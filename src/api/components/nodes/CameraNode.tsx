import { Handle, Position, NodeProps } from 'reactflow';
import { CameraNodeData } from '../types';
import { useFlowStore } from '../store/flowStore';

export const CameraNode = ({ data }: NodeProps<CameraNodeData>) => {
    const setSelected = useFlowStore(s => s.setSelectedCameraForZone);

    return (
        <div className="bg-gray-800 border-2 border-safesight-500 rounded-lg p-3 min-w-[160px] shadow-lg">
            <Handle type="source" position={Position.Right} className="!bg-safesight-500" />
            <div className="flex flex-col items-start">
                <span className="text-xs text-gray-400 uppercase">Camera</span>
                <span className="text-sm font-bold">{data.label}</span>
                <button
                    onClick={() => setSelected(data.cameraId)}
                    className="mt-2 text-xs bg-safesight-500/20 text-safesight-500 px-2 py-0.5 rounded hover:bg-safesight-500/30"
                >
                    Edit Zones
                </button>
            </div>
            <Handle type="target" position={Position.Left} />
        </div>
    );
};