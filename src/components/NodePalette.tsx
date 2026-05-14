import { Camera, Cpu, BrainCircuit, MessageCircle, Mail } from 'lucide-react';
import { Camera as CameraType } from '../api/backend';

interface Props {
    cameras: CameraType[];
}

export const NodePalette = ({ cameras }: Props) => {
    const onDragStart = (event: React.DragEvent, nodeType: string, data: unknown) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType, data }));
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className="w-64 ultra-glass border-r border-gray-800/50 p-5 flex flex-col gap-6 shrink-0 overflow-y-auto z-20">
            <h2 className="text-[10px] text-gray-600 uppercase tracking-[0.2em]">Nodes</h2>

            <div className="space-y-3">
                <h3 className="text-[10px] text-gray-700 uppercase tracking-widest">Cameras</h3>
                {cameras.map(cam => (
                    <div
                        key={cam.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, 'camera', {
                            cameraId: cam.id,
                            label: cam.name,
                            snapshotUrl: undefined,
                        })}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyber-400 transition-colors cursor-grab active:cursor-grabbing py-1 border-b border-transparent hover:border-cyber-400/20"
                    >
                        <Camera className="w-4 h-4" />
                        {cam.name}
                    </div>
                ))}
            </div>

            <div>
                <h3 className="text-[10px] text-gray-700 uppercase tracking-widest mb-2">Detectors</h3>
                <div
                    draggable
                    onDragStart={(e) => onDragStart(e, 'detector', { modules: ['person', 'helmet'] })}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 transition-colors cursor-grab py-1"
                >
                    <Cpu className="w-4 h-4" />
                    Person + Helmet
                </div>
                <div
                    draggable
                    onDragStart={(e) => onDragStart(e, 'detector', { modules: ['fire'] })}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 transition-colors cursor-grab py-1"
                >
                    <Cpu className="w-4 h-4" />
                    Fire
                </div>
                <div
                    draggable
                    onDragStart={(e) => onDragStart(e, 'vlmSearch', {
                        query: '',
                        channel: 'whatsapp',
                        intervalFrames: 10,
                    })}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyber-400 transition-colors cursor-grab py-1"
                >
                    <BrainCircuit className="w-4 h-4" />
                    VLM Search
                </div>
            </div>

            <div>
                <h3 className="text-[10px] text-gray-700 uppercase tracking-widest mb-2">Actions</h3>
                <div
                    draggable
                    onDragStart={(e) => onDragStart(e, 'action', { channels: ['whatsapp'] })}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-amber-400 transition-colors cursor-grab py-1"
                >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                </div>
                <div
                    draggable
                    onDragStart={(e) => onDragStart(e, 'action', { channels: ['email'] })}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-amber-400 transition-colors cursor-grab py-1"
                >
                    <Mail className="w-4 h-4" />
                    Email
                </div>
            </div>
        </aside>
    );
};