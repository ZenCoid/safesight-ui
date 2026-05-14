import { Handle, Position, NodeProps } from 'reactflow';
import { Cpu } from 'lucide-react';
import { DetectorNodeData } from '../../types';
import { ReflectiveCard } from '../effects/ReflectiveCard';

export const DetectorNode = ({ data }: NodeProps<DetectorNodeData>) => {
    const isProcessing = (data as any).isProcessing ?? false;
    return (
        <ReflectiveCard className={`p-3 min-w-[150px] ${isProcessing ? 'glow-rose' : ''}`}>
            <Handle
                type="target"
                position={Position.Left}
                className="!bg-slate-400 !w-4 !h-4 !border-2 !border-[#111118] !z-50 hover:!bg-teal-400 transition-colors"
            />
            <Handle
                type="source"
                position={Position.Right}
                className="!bg-slate-400 !w-4 !h-4 !border-2 !border-[#111118] !z-50 hover:!bg-teal-400 transition-colors"
            />
            <div className="flex items-center gap-2 mb-1 relative z-10">
                <Cpu className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] text-slate-500 tracking-widest uppercase">Detector</span>
            </div>
            <div className="flex flex-wrap gap-1 relative z-10">
                {data.modules.map(mod => (
                    <span key={mod} className="bg-slate-800 text-slate-300 text-xs px-1.5 py-0.5 rounded">
                        {mod}
                    </span>
                ))}
            </div>
        </ReflectiveCard>
    );
};