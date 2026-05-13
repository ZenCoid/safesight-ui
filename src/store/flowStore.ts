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

// Use the combined CustomNodeData type so all node types are accepted
type AllNodeData = CameraNodeData | DetectorNodeData | ActionNodeData | VLMSearchNodeData;

interface FlowState {
    nodes: Node<AllNodeData>[];
    edges: Edge[];
    zones: ZoneData[];
    selectedCameraForZone: string | null;

    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    addNode: (node: Node<AllNodeData>) => void;
    setNodes: (nodes: Node<AllNodeData>[]) => void;
    setEdges: (edges: Edge[]) => void;
    onConnect: (connection: Connection) => void;
    addZone: (zone: ZoneData) => void;
    removeZone: (cameraId: string, name: string) => void;
    setSelectedCameraForZone: (cameraId: string | null) => void;
}

export const useFlowStore = create<FlowState>((set) => ({
    nodes: [],
    edges: [],
    zones: [],
    selectedCameraForZone: null,

    onNodesChange: (changes) =>
        set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) })),
    onEdgesChange: (changes) =>
        set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),

    addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),

    onConnect: (connection) =>
        set((state) => ({ edges: addEdge(connection, state.edges) })),

    addZone: (zone) =>
        set((state) => ({ zones: [...state.zones, zone] })),
    removeZone: (cameraId, name) =>
        set((state) => ({
            zones: state.zones.filter(z => !(z.cameraId === cameraId && z.name === name))
        })),
    setSelectedCameraForZone: (cameraId) => set({ selectedCameraForZone: cameraId }),
}));