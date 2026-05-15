import { Camera, Cpu, BrainCircuit, MessageCircle, Mail } from 'lucide-react';
import { Camera as CameraType } from '../api/backend';

interface Props { cameras: CameraType[]; }

export const NodePalette = ({ cameras }: Props) => {
    const onDragStart = (event: React.DragEvent, nodeType: string, data: unknown) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType, data }));
        event.dataTransfer.effectAllowed = 'move';
    };
    return (
        <aside className="w-52 bg-[#020202] border-r border-[#e2e8f0]/10 p-4 flex flex-col gap-5 overflow-y-auto z-20">
            <h2 className="text-[10px] text-[#e2e8f0]/40 uppercase tracking-[0.3em]">Nodes</h2>
            <div>
                <h3 className="text-[10px] text-[#e2e8f0]/30 tracking-widest mb-2">CAMERAS</h3>
                {cameras.map(cam => (
                    <div key={cam.id} draggable onDragStart={e => onDragStart(e, 'camera', { cameraId: cam.id, label: cam.name })}
                        className="flex items-center gap-2 text-sm text-[#e2e8f0]/50 hover:text-white transition-colors cursor-grab py-1">
                        <Camera className="w-4 h-4" /> {cam.name}
                    </div>
                ))}
            </div>
            <div>
                <h3 className="text-[10px] text-[#e2e8f0]/30 tracking-widest mb-2">DETECTORS</h3>
                <div draggable onDragStart={e => onDragStart(e, 'detector', { modules: ['person', 'helmet'] })}
                    className="flex items-center gap-2 text-sm text-[#e2e8f0]/50 hover:text-purple-400 cursor-grab py-1">
                    <Cpu className="w-4 h-4" /> Person + Helmet
                </div>
                <div draggable onDragStart={e => onDragStart(e, 'detector', { modules: ['fire'] })}
                    className="flex items-center gap-2 text-sm text-[#e2e8f0]/50 hover:text-purple-400 cursor-grab py-1">
                    <Cpu className="w-4 h-4" /> Fire
                </div>
                <div draggable onDragStart={e => onDragStart(e, 'vlmSearch', { query: '', channel: 'whatsapp', intervalFrames: 10 })}
                    className="flex items-center gap-2 text-sm text-[#e2e8f0]/50 hover:text-cyan-400 cursor-grab py-1">
                    <BrainCircuit className="w-4 h-4" /> VLM Search
                </div>
            </div>
            <div>
                <h3 className="text-[10px] text-[#e2e8f0]/30 tracking-widest mb-2">ACTIONS</h3>
                <div draggable onDragStart={e => onDragStart(e, 'action', { channels: ['whatsapp'] })}
                    className="flex items-center gap-2 text-sm text-[#e2e8f0]/50 hover:text-amber-400 cursor-grab py-1">
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                </div>
                <div draggable onDragStart={e => onDragStart(e, 'action', { channels: ['email'] })}
                    className="flex items-center gap-2 text-sm text-[#e2e8f0]/50 hover:text-amber-400 cursor-grab py-1">
                    <Mail className="w-4 h-4" /> Email
                </div>
            </div>
        </aside>
    );
};