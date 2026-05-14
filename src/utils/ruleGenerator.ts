import { RuleDefinition, EscalationLevel, MultiCameraLink, PolygonZone } from '../api/backend';
import { useFlowStore } from '../store/flowStore';
import { CameraNodeData, DetectorNodeData, ActionNodeData, VLMSearchNodeData } from '../types';
import { v4 as uuidv4 } from 'uuid';

// ---------------------------------------------------------------------------
// Graph‑aware condition builder – recursively walk the detector → action chain
// ---------------------------------------------------------------------------
function buildConditionFromGraph(
    nodes: ReturnType<typeof useFlowStore.getState>['nodes'],
    edges: ReturnType<typeof useFlowStore.getState>['edges']
): string {
    // Find all detector nodes that are connected to cameras and actions
    const detectorNodes = nodes.filter(n => n.type === 'detector');
    const actionNodes = nodes.filter(n => n.type === 'action');

    // For each action, trace back to its detectors (via edges)
    const detectorGroups: string[][] = [];   // each group = detectors feeding same action

    for (const action of actionNodes) {
        const incomingEdges = edges.filter(e => e.target === action.id);
        const connectedDetectors = incomingEdges
            .map(e => nodes.find(n => n.id === e.source && n.type === 'detector'))
            .filter(Boolean)
            .map(n => (n!.data as DetectorNodeData).modules);

        if (connectedDetectors.length > 0) {
            // Merge all modules of detectors that lead to this action
            const allModules = new Set<string>();
            connectedDetectors.forEach(mods => mods.forEach(m => allModules.add(m)));
            // Build condition for this group: e.g., (person AND no_helmet) OR (fire)
            const parts: string[] = [];
            for (const mods of connectedDetectors) {
                if (mods.length === 0) continue;
                const moduleConditions = mods.map(m => `${m}_present`);
                parts.push('(' + moduleConditions.join(' AND ') + ')');
            }
            if (parts.length > 0) {
                detectorGroups.push(parts.join(' OR '));
            }
        }
    }

    if (detectorGroups.length === 0) {
        // Fallback: use all modules from any detector
        const allModules = new Set<string>();
        detectorNodes.forEach(dn => {
            const mods = (dn.data as DetectorNodeData).modules;
            mods.forEach(m => allModules.add(m));
        });
        if (allModules.size === 0) return 'person_in_zone';
        const parts = Array.from(allModules).map(m => `${m}_present`);
        return '(' + parts.join(' AND ') + ')';
    }

    // Combine all action groups with OR
    return '(' + detectorGroups.join(') OR (') + ')';
}

// ---------------------------------------------------------------------------
// Multi‑camera link extraction (Task 1.2)
// ---------------------------------------------------------------------------
function extractMultiCameraLinks(
    nodes: ReturnType<typeof useFlowStore.getState>['nodes'],
    edges: ReturnType<typeof useFlowStore.getState>['edges']
): MultiCameraLink[] {
    const cameraNodes = nodes.filter(n => n.type === 'camera');
    const detectorNodes = nodes.filter(n => n.type === 'detector');
    const links: MultiCameraLink[] = [];

    // Find any detector connected to multiple cameras
    for (const det of detectorNodes) {
        const incomingCameras = edges
            .filter(e => e.target === det.id)
            .map(e => nodes.find(n => n.id === e.source && n.type === 'camera'))
            .filter(Boolean)
            .map(n => (n!.data as CameraNodeData).cameraId);

        if (incomingCameras.length >= 2) {
            // Create a link between the first and each other camera
            for (let i = 1; i < incomingCameras.length; i++) {
                links.push({
                    trigger_camera_id: incomingCameras[0] as any,
                    target_camera_id: incomingCameras[i] as any,
                    action: 'enable_rule',
                    rule_ids: undefined,
                });
            }
        }
    }

    return links;
}

// ---------------------------------------------------------------------------
// VLM Search node rule mapping (Task 1.3)
// ---------------------------------------------------------------------------
function extractPinnedSearch(
    nodes: ReturnType<typeof useFlowStore.getState>['nodes'],
    edges: ReturnType<typeof useFlowStore.getState>['edges']
): { query: string; channel: string; interval_frames: number; minio_keys: string[]; camera_id?: string } | null {
    const vlmNode = nodes.find(n => n.type === 'vlmSearch');
    if (!vlmNode) return null;

    const data = vlmNode.data as VLMSearchNodeData;
    // Find connected camera
    const camEdge = edges.find(e => e.target === vlmNode.id);
    let cameraId: string | undefined;
    if (camEdge) {
        const camNode = nodes.find(n => n.id === camEdge.source && n.type === 'camera');
        if (camNode) {
            cameraId = (camNode.data as CameraNodeData).cameraId;
        }
    }

    return {
        query: data.query,
        channel: data.channel,
        interval_frames: data.intervalFrames,
        minio_keys: data.imageKey ? [data.imageKey] : [],
        camera_id: cameraId,
    };
}

// ---------------------------------------------------------------------------
// Main rule generator
// ---------------------------------------------------------------------------
export function generateRule(ruleName: string): RuleDefinition {
    const { nodes, edges, zones } = useFlowStore.getState();

    const cameraNodes = nodes.filter(n => n.type === 'camera');
    const detectorNodes = nodes.filter(n => n.type === 'detector');
    const actionNodes = nodes.filter(n => n.type === 'action');

    // Helpers to get typed data
    const getCameraData = (node: typeof nodes[number]): CameraNodeData | null =>
        node.type === 'camera' ? node.data as CameraNodeData : null;
    const getDetectorData = (node: typeof nodes[number]): DetectorNodeData | null =>
        node.type === 'detector' ? node.data as DetectorNodeData : null;
    const getActionData = (node: typeof nodes[number]): ActionNodeData | null =>
        node.type === 'action' ? node.data as ActionNodeData : null;

    // Active cameras: those connected to a detector
    const activeCameraIds = cameraNodes
        .filter(cn => edges.some(e => e.source === cn.id && nodes.find(n => n.id === e.target)?.type === 'detector'))
        .map(cn => getCameraData(cn))
        .filter((d): d is CameraNodeData => d !== null)
        .map(d => d.cameraId);

    // All detection modules from connected detectors
    const allModules = new Set<string>();
    detectorNodes.forEach(dn => {
        const data = getDetectorData(dn);
        if (data) data.modules.forEach(m => allModules.add(m));
    });

    // Zones only for active cameras
    const activeCameraSet = new Set(activeCameraIds);
    const relevantZones = zones.filter(z => activeCameraSet.has(z.cameraId as any));

    // Escalation levels from connected actions
    const activeActionNodes = actionNodes.filter(an =>
        edges.some(e => e.target === an.id && nodes.find(n => n.id === e.source)?.type === 'detector')
    );
    const escalation_levels: EscalationLevel[] = activeActionNodes
        .map(an => getActionData(an))
        .filter((d): d is ActionNodeData => d !== null)
        .map(d => ({
            channels: d.channels,
            delay_seconds: 0,
        }));

    // Build condition from graph topology (Task 1.1)
    const condition = buildConditionFromGraph(nodes, edges);

    // Multi‑camera links (Task 1.2)
    const multi_camera_links = extractMultiCameraLinks(nodes, edges);

    // VLM Search (Task 1.3)
    const pinned = extractPinnedSearch(nodes, edges);

    // Schedule & cooldown placeholders – will be populated by future nodes
    const schedule = null; // placeholder
    const cooldown_seconds = 30;
    const min_duration_seconds = 1;

    return {
        rule_id: uuidv4(),
        rule_name: ruleName,
        version: '1.0',
        enabled: true,
        cameras: activeCameraIds,
        detection_modules: Array.from(allModules),
        zones: relevantZones as PolygonZone[],
        confidence_threshold: 0.6,
        min_duration_seconds,
        cooldown_seconds,
        schedule,
        escalation_levels,
        multi_camera_links,
        condition,
    };
}