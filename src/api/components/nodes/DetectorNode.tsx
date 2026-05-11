import { Handle, Position, NodeProps } from 'reactflow';
import { DetectorNodeData } from '../types';

export const DetectorNode = ({ data }: NodeProps<DetectorNodeData>) => {
    return (
        <div className="bg-purple-900/40 border-2 border-purple-500 rounded-lg p-3 min-w-[160px] shadow-lg">
            <Handle type="target" position={Position.Left} className="!bg-purple-400" />
            <div className="text-xs text-purple-300 uppercase mb-1">Detector</div>
            <div className="flex flex-wrap gap-1">
                {data.modules.map(mod => (
                    <span key={mod} className="bg-purple-500/20 text-purple-200 text-xs px-1.5 py-0.5 rounded">
                        {mod}
                    </span>
                ))}
            </div>
            <Handle type="source" position={Position.Right} className="!bg-purple-400" />
        </div>
    );
};