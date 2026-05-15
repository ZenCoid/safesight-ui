import { create } from 'zustand';
import {
    Node,
    Edge,
    OnNodesChange,
    OnEdgesChange,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    Connection,
} from 'reactflow';
import { CameraNodeData, DetectorNodeData, ActionNodeData, VLMSearchNodeData, ZoneData } from '../types';
import { validateGraph, getWarningNodeIds } from '../utils/graphValidation';

type AllNodeData = CameraNodeData | DetectorNodeData | ActionNodeData | VLMSearchNodeData;

interface FlowState {
    nodes: Node<AllNodeData>[];
    edges: Edge[];
    zones: ZoneData[];
    selectedCameraForZone: string | null;
    warningNodeIds: Set<string>;           // nodes with warnings

    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    addNode: (node: Node<AllNodeData>) => void;
    setNodes: (nodes: Node<AllNodeData>[]) => void;
    setEdges: (edges: Edge[]) => void;
    onConnect: (connection: Connection) => void;
    addZone: (zone: ZoneData) => void;
    removeZone: (cameraId: string, name: string) => void;
    setSelectedCameraForZone: (cameraId: string | null) => void;
    recalcWarnings: () => void;
}

export const useFlowStore = create<FlowState>((set, get) => ({
    nodes: [],
    edges: [],
    zones: [],
    selectedCameraForZone: null,
    warningNodeIds: new Set<string>(),

    recalcWarnings: () => {
        const errors = validateGraph();
        set({ warningNodeIds: getWarningNodeIds(errors) });
    },

    onNodesChange: (changes) => {
        set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) }));
        get().recalcWarnings();
    },
    onEdgesChange: (changes) => {
        set((state) => ({ edges: applyEdgeChanges(changes, state.edges) }));
        get().recalcWarnings();
    },

    addNode: (node) => {
        set((state) => ({ nodes: [...state.nodes, node] }));
        get().recalcWarnings();
    },
    setNodes: (nodes) => {
        set({ nodes });
        get().recalcWarnings();
    },
    setEdges: (edges) => {
        set({ edges });
        get().recalcWarnings();
    },

    onConnect: (connection) => {
        set((state) => {
            const sourceNode = state.nodes.find(n => n.id === connection.source);
            const targetNode = state.nodes.find(n => n.id === connection.target);
            const edgeType = sourceNode?.type === 'camera' && targetNode?.type === 'camera'
                ? 'multiCameraLink'
                : undefined;
            return { edges: addEdge({ ...connection, type: edgeType }, state.edges) };
        });
        get().recalcWarnings();
    },

    addZone: (zone) => set((state) => ({ zones: [...state.zones, zone] })),
    removeZone: (cameraId, name) =>
        set((state) => ({
            zones: state.zones.filter(z => !(z.cameraId === cameraId && z.name === name)),
        })),
    setSelectedCameraForZone: (cameraId) => set({ selectedCameraForZone: cameraId }),
}));