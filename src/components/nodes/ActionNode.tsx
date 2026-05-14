import { Handle, Position, NodeProps } from 'reactflow';
import { MessageCircle, Mail, Bell } from 'lucide-react';
import { ActionNodeData } from '../../types';
import { MetallicSilverCard } from '../effects/MetallicSilverCard';

const icons: Record<string, React.ReactNode> = {
    whatsapp: <MessageCircle className="w-4 h-4" />,
    email: <Mail className="w-4 h-4" />,
};

export const ActionNode = ({ id, data }: NodeProps<ActionNodeData>) => {
    return (
        <MetallicSilverCard className="p-0" style={{ minWidth: 150 }}>
            <Handle
                type="target"
                position={Position.Left}
                className="!bg-slate-400 !w-4 !h-4 !border-2 !border-[#111118] !z-50 hover:!bg-teal-400 transition-colors"
            />
            <div className="flex flex-col gap-2 p-4">
                <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-rose-400" />
                    <span className="text-[10px] text-rose-400 tracking-widest uppercase">Escalation</span>
                </div>
                <div className="flex gap-2">
                    {data.channels.map(ch => (
                        <span key={ch} className="text-slate-400" title={ch}>
                            {icons[ch] || <Bell className="w-4 h-4" />}
                        </span>
                    ))}
                </div>
            </div>
        </MetallicSilverCard>
    );
};