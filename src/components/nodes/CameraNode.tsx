import { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CameraNodeData } from '../../types';
import { useFlowStore } from '../../store/flowStore';

export const CameraNode = ({ data }: NodeProps<CameraNodeData>) => {
    const setSelected = useFlowStore(s => s.setSelectedCameraForZone);
    const [showPreview, setShowPreview] = useState(false);

    const streamUrl = `http://127.0.0.1:8000/cameras/${data.cameraId}/stream`;

    return (
        <div className="bg-gray-800 border-2 border-safesight-500 rounded-lg p-3 min-w-[200px] shadow-lg">
            <Handle type="source" position={Position.Right} className="!bg-safesight-500" />
            <div className="flex flex-col items-start gap-2">
                <span className="text-xs text-gray-400 uppercase">Camera</span>
                <span className="text-sm font-bold">{data.label}</span>
                <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-xs bg-safesight-500/20 text-safesight-500 px-2 py-0.5 rounded hover:bg-safesight-500/30 transition-colors"
                >
                    {showPreview ? 'Hide Preview' : 'Live Preview'}
                </button>
                {showPreview && (
                    <img
                        src={streamUrl}
                        alt="Live feed"
                        className="mt-2 w-full h-24 object-cover rounded border border-gray-700"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                )}
                <button
                    onClick={() => setSelected(data.cameraId)}
                    className="mt-1 text-xs bg-safesight-500/20 text-safesight-500 px-2 py-0.5 rounded hover:bg-safesight-500/30 transition-colors"
                >
                    Edit Zones
                </button>
            </div>
            <Handle type="target" position={Position.Left} />
        </div>
    );
};