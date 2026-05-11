import { Handle, Position, NodeProps } from 'reactflow';
import { ActionNodeData } from '../../types';

const channelIcons: Record<string, string> = {
    whatsapp: '📱',
    email: '✉️',
    siren: '🚨',
    push_notification: '🔔',
};

export const ActionNode = ({ data }: NodeProps<ActionNodeData>) => {
    return (
        <div className="bg-amber-900/30 border-2 border-amber-500 rounded-lg p-3 min-w-[160px] shadow-lg">
            <Handle type="target" position={Position.Left} className="!bg-amber-400" />
            <div className="text-xs text-amber-300 uppercase mb-1">Escalation</div>
            <div className="flex gap-1">
                {data.channels.map(ch => (
                    <span key={ch} className="text-xl" title={ch}>{channelIcons[ch] || '📢'}</span>
                ))}
            </div>
        </div>
    );
};