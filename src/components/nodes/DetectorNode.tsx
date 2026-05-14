import { Handle, Position, NodeProps } from 'reactflow';
import { Cpu, AlertTriangle } from 'lucide-react';
import { DetectorNodeData } from '../../types';
import { useFlowStore } from '../../store/flowStore';
import { MetallicSilverCard } from '../effects/MetallicSilverCard';

export const DetectorNode = ({ id, data }: NodeProps<DetectorNodeData>) => {
    const isProcessing = (data as any).isProcessing ?? false;
    const warningNodeIds = useFlowStore(s => s.warningNodeIds);
    const hasWarning = warningNodeIds.has(id);
    return (
        <MetallicSilverCard className={`p-0 ${hasWarning ? 'ring-1 ring-red-500/50' : ''}`} style={{ minWidth: 150 }}>
            {hasWarning && (
                <div className="absolute top-1.5 right-1.5 z-30 text-red-400" title="Detector needs a camera feed or output">
                    <AlertTriangle className="w-3.5 h-3.5" />
                </div>
            )}
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
            <div className="flex flex-col gap-2 p-4">
                <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span className="text-[10px] text-slate-500 tracking-widest uppercase">Detector</span>
                </div>
                <div className="flex flex-wrap gap-1">
                    {data.modules.map(mod => (
                        <span key={mod} className="bg-slate-800 text-slate-300 text-xs px-1.5 py-0.5 rounded">
                            {mod}
                        </span>
                    ))}
                </div>
            </div>
        </MetallicSilverCard>
    );
};