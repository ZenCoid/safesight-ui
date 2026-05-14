import { useFlowStore } from '../store/flowStore';

export interface GraphValidationError {
    nodeId: string;
    message: string;
}

/**
 * Validates the current rule graph and returns a list of errors.
 * Checks: at least one camera, at least one detector/VLM, each action has a path from a detector,
 * no disconnected nodes.
 */
export function validateGraph(): GraphValidationError[] {
    const { nodes, edges } = useFlowStore.getState();
    const errors: GraphValidationError[] = [];

    const cameraNodes = nodes.filter(n => n.type === 'camera');
    const detectorNodes = nodes.filter(n => n.type === 'detector');
    const actionNodes = nodes.filter(n => n.type === 'action');
    const vlmNodes = nodes.filter(n => n.type === 'vlmSearch');

    const allNodes = nodes;

    // At least one camera
    if (cameraNodes.length === 0) {
        errors.push({ nodeId: '', message: 'Add at least one camera.' });
    }

    // At least one detector or VLM search
    if (detectorNodes.length === 0 && vlmNodes.length === 0) {
        errors.push({ nodeId: '', message: 'Add at least one detector or VLM search node.' });
    }

    // Each action must have an incoming edge from a detector
    for (const action of actionNodes) {
        const hasIncoming = edges.some(e => e.target === action.id && nodes.find(n => n.id === e.source)?.type === 'detector');
        if (!hasIncoming) {
            errors.push({ nodeId: action.id, message: `Action "${(action.data as any).channels?.join(',') || 'unnamed'}" needs a detector connected.` });
        }
    }

    // Each detector should have at least one camera incoming
    for (const det of detectorNodes) {
        const hasCamera = edges.some(e => e.target === det.id && nodes.find(n => n.id === e.source)?.type === 'camera');
        if (!hasCamera) {
            errors.push({ nodeId: det.id, message: 'Detector needs a camera feed.' });
        }
    }

    // VLM Search needs a camera
    for (const vlm of vlmNodes) {
        const hasCamera = edges.some(e => e.target === vlm.id && nodes.find(n => n.id === e.source)?.type === 'camera');
        if (!hasCamera) {
            errors.push({ nodeId: vlm.id, message: 'VLM Search needs a camera feed.' });
        }
    }

    // Disconnected nodes (nodes with no edges at all)
    for (const node of allNodes) {
        const connected = edges.some(e => e.source === node.id || e.target === node.id);
        if (!connected) {
            errors.push({ nodeId: node.id, message: `Node "${node.type}" is disconnected.` });
        }
    }

    return errors;
}

/**
 * Returns a set of node IDs that have a warning (used for visual indicators).
 */
export function getWarningNodeIds(errors: GraphValidationError[]): Set<string> {
    return new Set(errors.filter(e => e.nodeId).map(e => e.nodeId));
}