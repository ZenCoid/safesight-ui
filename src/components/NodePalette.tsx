import { Camera } from '../api/backend';

interface Props {
    cameras: Camera[];
}

export const NodePalette = ({ cameras }: Props) => {
    const onDragStart = (event: React.DragEvent, nodeType: string, data: unknown) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType, data }));
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className="w-64 bg-gray-900 border-r border-gray-800 p-4 flex flex-col gap-4 shrink-0 overflow-y-auto">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Nodes</h2>

            <div className="space-y-2">
                <h3 className="text-xs text-gray-500">Cameras</h3>
                {cameras.map(cam => (
                    <div
                        key={cam.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, 'camera', {
                            cameraId: cam.id,
                            label: cam.name,
                            snapshotUrl: undefined,
                        })}
                        className="bg-gray-800 border border-gray-700 p-2 rounded cursor-grab hover:border-safesight-500 transition-colors text-sm active:cursor-grabbing"
                    >
                        <span className="mr-1">📷</span> {cam.name}
                    </div>
                ))}
            </div>

            <div>
                <h3 className="text-xs text-gray-500 mb-2">Detectors</h3>
                <div
                    draggable
                    onDragStart={(e) => onDragStart(e, 'detector', { modules: ['person', 'helmet'] })}
                    className="bg-gray-800 border border-gray-700 p-2 rounded cursor-grab hover:border-purple-500 transition-colors text-sm mb-1 active:cursor-grabbing"
                >
                    🧠 Person + Helmet
                </div>
                <div
                    draggable
                    onDragStart={(e) => onDragStart(e, 'detector', { modules: ['fire'] })}
                    className="bg-gray-800 border border-gray-700 p-2 rounded cursor-grab hover:border-purple-500 transition-colors text-sm mb-1 active:cursor-grabbing"
                >
                    🔥 Fire
                </div>
                {/* VLM Search node */}
                <div
                    draggable
                    onDragStart={(e) => onDragStart(e, 'vlmSearch', {
                        query: '',
                        channel: 'whatsapp',
                        intervalFrames: 10,
                    })}
                    className="bg-gray-800 border border-cyan-400 p-2 rounded cursor-grab hover:border-cyan-300 transition-colors text-sm mb-1 active:cursor-grabbing"
                >
                    🧪 VLM Search
                </div>
            </div>

            <div>
                <h3 className="text-xs text-gray-500 mb-2">Actions</h3>
                <div
                    draggable
                    onDragStart={(e) => onDragStart(e, 'action', { channels: ['whatsapp'] })}
                    className="bg-gray-800 border border-gray-700 p-2 rounded cursor-grab hover:border-amber-500 transition-colors text-sm mb-1 active:cursor-grabbing"
                >
                    📱 WhatsApp
                </div>
                <div
                    draggable
                    onDragStart={(e) => onDragStart(e, 'action', { channels: ['email'] })}
                    className="bg-gray-800 border border-gray-700 p-2 rounded cursor-grab hover:border-amber-500 transition-colors text-sm mb-1 active:cursor-grabbing"
                >
                    ✉️ Email
                </div>
            </div>
        </aside>
    );
};