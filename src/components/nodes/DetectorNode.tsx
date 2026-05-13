import { Handle, Position, NodeProps } from 'reactflow';
import { DetectorNodeData } from '../../types';

export const DetectorNode = ({ data }: NodeProps<DetectorNodeData>) => {
    const isProcessing = (data as any).isProcessing ?? false;
    return (
        <div className={`glass-panel rounded-lg p-3 min-w-[160px] shadow-lg ${isProcessing ? 'neon-glow' : ''}`}>
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