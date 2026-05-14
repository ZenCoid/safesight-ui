import { Handle, Position, NodeProps } from 'reactflow';
import { MessageCircle, Mail, Bell } from 'lucide-react';
import { ActionNodeData } from '../../types';
import { ReflectiveCard } from '../effects/ReflectiveCard';

const icons: Record<string, React.ReactNode> = {
    whatsapp: <MessageCircle className="w-4 h-4" />,
    email: <Mail className="w-4 h-4" />,
};

export const ActionNode = ({ data }: NodeProps<ActionNodeData>) => {
    return (
        <ReflectiveCard className="p-3 min-w-[150px]">
            <Handle type="target" position={Position.Left} className="!bg-slate-400" />
            <div className="flex items-center gap-2 mb-1">
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
        </ReflectiveCard>
    );
};