import { Handle, Position, NodeProps } from 'reactflow';
import { MessageCircle, Mail, Bell, AlertTriangle } from 'lucide-react';
import { ActionNodeData } from '../../types';

const channelIcons: Record<string, React.ReactNode> = {
    whatsapp: <MessageCircle className="w-4 h-4" />,
    email: <Mail className="w-4 h-4" />,
    siren: <Bell className="w-4 h-4" />,
    push_notification: <AlertTriangle className="w-4 h-4" />,
};

export const ActionNode = ({ data }: NodeProps<ActionNodeData>) => {
    return (
        <div className="ultra-glass rounded-lg p-3 min-w-[160px]">
            <Handle type="target" position={Position.Left} className="!bg-amber-400" />
            <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] text-amber-300 uppercase tracking-widest">Escalation</span>
            </div>
            <div className="flex gap-2">
                {data.channels.map(ch => (
                    <span key={ch} className="text-amber-400" title={ch}>
                        {channelIcons[ch] || <Bell className="w-4 h-4" />}
                    </span>
                ))}
            </div>
        </div>
    );
}; import { Handle, Position, NodeProps } from 'reactflow';
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