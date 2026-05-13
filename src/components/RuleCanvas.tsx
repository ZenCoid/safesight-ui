import { useCallback, useRef } from 'react';
import ReactFlow, {
    Background,
    Controls,
    ReactFlowInstance,
    Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { CameraNode } from './nodes/CameraNode';
import { DetectorNode } from './nodes/DetectorNode';
import { ActionNode } from './nodes/ActionNode';
import { VLMSearchNode } from './nodes/VLMSearchNode';
import { useFlowStore } from '../store/flowStore';
import { CustomNodeData } from '../types';
import { v4 as uuidv4 } from 'uuid';

const nodeTypes = {
    camera: CameraNode,
    detector: DetectorNode,
    action: ActionNode,
    vlmSearch: VLMSearchNode,
};

export const RuleCanvas = () => {
    const { nodes, edges, onNodesChange, onEdgesChange, addNode, onConnect } = useFlowStore();
    const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            const raw = event.dataTransfer.getData('application/reactflow');
            if (!raw || !reactFlowInstance.current) return;
            const { nodeType, data } = JSON.parse(raw);
            const position = reactFlowInstance.current.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });
            const newNode: Node<CustomNodeData> = {
                id: uuidv4(),
                type: nodeType,
                position,
                data: data as CustomNodeData,
            };
            addNode(newNode);
        },
        [addNode]
    );

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onInit={(inst) => { reactFlowInstance.current = inst; }}
            onDragOver={onDragOver}
            onDrop={onDrop}
            fitView
            className="bg-transparent"
            deleteKeyCode={['Backspace', 'Delete']}
            defaultEdgeOptions={{
                animated: true,
                style: { stroke: 'rgba(34, 211, 238, 0.4)', strokeWidth: 1.5 },
            }}
        >
            <Background color="rgba(34, 211, 238, 0.05)" gap={24} size={0.5} />
            <Controls className="!bg-transparent !border-none !fill-gray-600" />
        </ReactFlow>
    );
};