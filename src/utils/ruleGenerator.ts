import { RuleDefinition, EscalationLevel } from '../api/backend';
import { useFlowStore } from '../store/flowStore';
import { CameraNodeData, DetectorNodeData, ActionNodeData } from '../types';
import { v4 as uuidv4 } from 'uuid';

export function generateRule(ruleName: string): RuleDefinition {
    const { nodes, edges, zones } = useFlowStore.getState();

    const cameraNodes = nodes.filter(n => n.type === 'camera');
    const detectorNodes = nodes.filter(n => n.type === 'detector');
    const actionNodes = nodes.filter(n => n.type === 'action');

    // Helper to safely get typed data from a node
    const getCameraData = (node: typeof nodes[number]): CameraNodeData | null =>
        node.type === 'camera' ? node.data as CameraNodeData : null;
    const getDetectorData = (node: typeof nodes[number]): DetectorNodeData | null =>
        node.type === 'detector' ? node.data as DetectorNodeData : null;
    const getActionData = (node: typeof nodes[number]): ActionNodeData | null =>
        node.type === 'action' ? node.data as ActionNodeData : null;

    const activeCameraIds = cameraNodes
        .filter(cn => edges.some(e => e.source === cn.id && nodes.find(n => n.id === e.target)?.type === 'detector'))
        .map(cn => getCameraData(cn))
        .filter((d): d is CameraNodeData => d !== null)
        .map(d => d.cameraId);

    const allModules = new Set<string>();
    detectorNodes.forEach(dn => {
        const data = getDetectorData(dn);
        if (data) data.modules.forEach(m => allModules.add(m));
    });
    const detection_modules = Array.from(allModules);

    const activeZoneCameras = new Set(
        edges
            .filter(e => cameraNodes.some(cn => cn.id === e.source) && detectorNodes.some(dn => dn.id === e.target))
            .map(e => {
                const srcNode = nodes.find(n => n.id === e.source);
                return srcNode ? getCameraData(srcNode) : null;
            })
            .filter((d): d is CameraNodeData => d !== null)
            .map(d => d.cameraId)
    );
    const relevantZones = zones.filter(z => activeZoneCameras.has(z.cameraId));

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

    let condition = 'person_in_zone';
    if (allModules.has('helmet')) {
        condition += " AND helmet_status=='none'";
    }
    if (allModules.has('fire')) {
        condition += ' AND fire_detected';
    }

    return {
        rule_id: uuidv4(),
        rule_name: ruleName,
        version: '1.0',
        enabled: true,
        cameras: activeCameraIds,
        detection_modules,
        zones: relevantZones,
        confidence_threshold: 0.6,
        min_duration_seconds: 1,
        cooldown_seconds: 30,
        schedule: null,
        escalation_levels,
        multi_camera_links: [],
        condition,
    };
}