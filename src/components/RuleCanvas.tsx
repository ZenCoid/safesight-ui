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
import { useFlowStore } from '../store/flowStore';
import { CustomNodeData } from '../types';
import { v4 as uuidv4 } from 'uuid';

const nodeTypes = {
    camera: CameraNode,
    detector: DetectorNode,
    action: ActionNode,
};

export const RuleCanvas = () => {
    const { nodes, edges, onNodesChange, onEdgesChange, addNode } = useFlowStore();
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
                data: data as CustomNodeData, // data comes from draggable palette, already matches one of the node data types
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
            nodeTypes={nodeTypes}
            onInit={(inst) => { reactFlowInstance.current = inst; }}
            onDragOver={onDragOver}
            onDrop={onDrop}
            fitView
            className="bg-gray-950"
            deleteKeyCode={['Backspace', 'Delete']}
            defaultEdgeOptions={{ animated: true, style: { stroke: '#14b8a6', strokeWidth: 2 } }}
        >
            <Background color="#1f2937" gap={20} />
            <Controls className="!bg-gray-800 !border-gray-700 !fill-gray-300" />
        </ReactFlow>
    );
};