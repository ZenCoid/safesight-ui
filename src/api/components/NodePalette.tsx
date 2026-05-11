import { Camera } from '../api/backend';

interface Props {
    cameras: Camera[];
}

export const NodePalette = ({ cameras }: Props) => {
    const onDragStart = (event: React.DragEvent, nodeType: string, data: any) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType, data }));
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className="w-64 bg-gray-900 border-r border-gray-800 p-4 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Nodes</h2>
            {/* Camera nodes from API */}
            <div className="space-y-2">
                {cameras.map(cam => (
                    <div
                        key={cam.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, 'camera', {
                            cameraId: cam.id,
                            label: cam.name,
                            snapshotUrl: undefined, // we could fetch a still later
                        })}
                        className="bg-gray-800 border border-gray-700 p-2 rounded cursor-grab hover:border-safesight-500 transition-colors text-sm"
                    >
                        📷 {cam.name}
                    </div>
                ))}
            </div>

            {/* Detector modules */}
            <div>
                <h3 className="text-xs text-gray-500 mb-2">Detectors</h3>
                <div
                    draggable
                    onDragStart={(e) => onDragStart(e, 'detector', { modules: ['person', 'helmet'] })}
                    className="bg-gray-800 border border-gray-700 p-2 rounded cursor-grab hover:border-safesight-500 text-sm mb-1"
                >
                    🧠 Person + Helmet
                </div>
                <div
                    draggable
                    onDragStart={(e) => onDragStart(e, 'detector', { modules: ['fire'] })}
                    className="bg-gray-800 border border-gray-700 p-2 rounded cursor-grab hover:border-safesight-500 text-sm mb-1"
                >
                    🔥 Fire
                </div>
                {/* Add more... */}
            </div>

            {/* Action nodes */}
            <div>
                <h3 className="text-xs text-gray-500 mb-2">Actions</h3>
                <div
                    draggable
                    onDragStart={(e) => onDragStart(e, 'action', { channels: ['whatsapp'] })}
                    className="bg-gray-800 border border-gray-700 p-2 rounded cursor-grab hover:border-safesight-500 text-sm mb-1"
                >
                    📱 WhatsApp
                </div>
                <div
                    draggable
                    onDragStart={(e) => onDragStart(e, 'action', { channels: ['email'] })}
                    className="bg-gray-800 border border-gray-700 p-2 rounded cursor-grab hover:border-safesight-500 text-sm mb-1"
                >
                    ✉️ Email
                </div>
            </div>
        </aside>
    );
};