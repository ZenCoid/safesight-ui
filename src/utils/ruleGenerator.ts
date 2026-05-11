import { RuleDefinition, EscalationLevel, PolygonZone } from '../api/backend';
import { useFlowStore } from '../store/flowStore';
import { v4 as uuidv4 } from 'uuid';

export function generateRule(ruleName: string): RuleDefinition {
    const { nodes, edges, zones } = useFlowStore.getState();

    // Find all camera nodes
    const cameraNodes = nodes.filter(n => n.type === 'camera');
    const detectorNodes = nodes.filter(n => n.type === 'detector');
    const actionNodes = nodes.filter(n => n.type === 'action');

    // Cameras: list of IDs of camera nodes that have an outgoing edge to a detector
    const activeCameraIds = cameraNodes
        .filter(cn => edges.some(e => e.source === cn.id && nodes.find(n => n.id === e.target)?.type === 'detector'))
        .map(cn => (cn.data as any).cameraId);

    // Detection modules: union of all detector nodes' modules
    const allModules = new Set<string>();
    detectorNodes.forEach(dn => {
        (dn.data as any).modules.forEach((m: string) => allModules.add(m));
    });
    const detection_modules = Array.from(allModules);

    // Zones: only from cameras that are active and have zones stored
    const activeZoneCameras = new Set(
        edges.filter(e => cameraNodes.some(cn => cn.id === e.source) && detectorNodes.some(dn => dn.id === e.target))
            .map(e => (nodes.find(n => n.id === e.source)!.data as any).cameraId)
    );
    const relevantZones = zones.filter(z => activeZoneCameras.has(z.cameraId));

    // Escalation levels: from action nodes that are connected from a detector
    const activeActionNodes = actionNodes.filter(an =>
        edges.some(e => e.target === an.id && nodes.find(n => n.id === e.source)?.type === 'detector')
    );
    const escalation_levels: EscalationLevel[] = activeActionNodes.map(an => ({
        channels: (an.data as any).channels,
        delay_seconds: 0, // default immediate; could be configurable in node
    }));

    // Condition: simple DSL based on connected detectors
    // For now, build a condition like: person_in_zone AND helmet_status=='none'
    // If helmet module present, assume we want to detect missing helmet.
    let condition = 'person_in_zone';
    if (allModules.has('helmet')) {
        condition += " AND helmet_status=='none'";
    }
    if (allModules.has('fire')) {
        condition += ' AND fire_detected';
    }

    const rule: RuleDefinition = {
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

    return rule;
}