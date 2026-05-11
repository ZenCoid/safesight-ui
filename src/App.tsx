import { useState, useCallback, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { RuleCanvas } from './components/RuleCanvas';
import { NodePalette } from './components/NodePalette';
import { RulePreview } from './components/RulePreview';
import { getCameras } from './api/backend';
import { useFlowStore } from './store/flowStore';

function App() {
    const [cameras, setCameras] = useState<Camera[]>([]);
    const [showPreview, setShowPreview] = useState(false);
    const [ruleName, setRuleName] = useState('New Rule');

    useEffect(() => {
        getCameras().then(res => setCameras(res.data)).catch(console.error);
    }, []);

    return (
        <div className="h-screen flex flex-col bg-gray-950 text-gray-100 font-sans">
            {/* Top bar */}
            <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center px-4 justify-between">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold tracking-tight text-safesight-500">SafeSight</h1>
                    <span className="text-gray-500">|</span>
                    <input
                        value={ruleName}
                        onChange={e => setRuleName(e.target.value)}
                        className="bg-transparent border-b border-gray-700 focus:border-safesight-500 outline-none px-2"
                        placeholder="Rule Name"
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowPreview(true)}
                        className="px-4 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm"
                    >
                        Validate & Preview
                    </button>
                    <button className="px-4 py-1 bg-safesight-500 hover:bg-safesight-700 text-black font-semibold rounded text-sm">
                        Deploy Rule
                    </button>
                </div>
            </header>

            {/* Main area */}
            <div className="flex flex-1 overflow-hidden">
                <NodePalette cameras={cameras} />
                <div className="flex-1 relative">
                    <ReactFlowProvider>
                        <RuleCanvas />
                    </ReactFlowProvider>
                </div>
            </div>

            {showPreview && (
                <RulePreview
                    ruleName={ruleName}
                    onClose={() => setShowPreview(false)}
                />
            )}
        </div>
    );
}

import { ZoneEditor } from './components/ZoneEditor';
// ...
const selectedCameraForZone = useFlowStore(s => s.selectedCameraForZone);
// inside return after main area div:
{
    selectedCameraForZone && (
        <ZoneEditor
            cameraId={selectedCameraForZone}
            cameraName={cameras.find(c => c.id === selectedCameraForZone)?.name || ''}
            onClose={() => setSelectedCameraForZone(null)}
        />
    )
}

export default App;