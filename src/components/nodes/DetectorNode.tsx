import { Handle, Position, NodeProps } from 'reactflow';
import { DetectorNodeData } from '../../types';
import { ReflectiveCard } from '../effects/ReflectiveCard';

export const DetectorNode = ({ data }: NodeProps<DetectorNodeData>) => {
    const isProcessing = (data as any).isProcessing ?? false;
    return (
        <ReflectiveCard className={`p-3 min-w-[160px] ${isProcessing ? 'neon-flow-border' : ''}`}>
            <Handle type="target" position={Position.Left} className="!bg-purple-400" />
            <div className="text-[10px] text-purple-300 uppercase tracking-widest mb-1">Detector</div>
            <div className="flex flex-wrap gap-1">
                {data.modules.map(mod => (
                    <span key={mod} className="bg-purple-500/10 text-purple-200 text-xs px-1.5 py-0.5 rounded">
                        {mod}
                    </span>
                ))}
            </div>
            <Handle type="source" position={Position.Right} className="!bg-purple-400" />
        </ReflectiveCard>
    );
};