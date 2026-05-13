import { useState, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { RuleCanvas } from './components/RuleCanvas';
import { NodePalette } from './components/NodePalette';
import { RulePreview } from './components/RulePreview';
import { ZoneEditor } from './components/ZoneEditor';
import { getCameras, Camera, createRule, createPinned } from './api/backend';
import { useFlowStore } from './store/flowStore';
import { generateRule } from './utils/ruleGenerator';
import { VLMSearchNodeData } from './types';

function App() {
    const [cameras, setCameras] = useState<Camera[]>([]);
    const [showPreview, setShowPreview] = useState(false);
    const [ruleName, setRuleName] = useState('New Rule');
    const [deployStatus, setDeployStatus] = useState<string>('');

    const selectedCameraForZone = useFlowStore(s => s.selectedCameraForZone);
    const setSelectedCameraForZone = useFlowStore(s => s.setSelectedCameraForZone);

    useEffect(() => {
        getCameras().then(res => setCameras(res.data)).catch(console.error);
    }, []);

    const handleDeploy = async () => {
        const { nodes, edges } = useFlowStore.getState();

        // Check if a VLMSearchNode is present and connected to a camera
        const vlmSearchNode = nodes.find(n => n.type === 'vlmSearch');
        if (vlmSearchNode) {
            const vlmData = vlmSearchNode.data as VLMSearchNodeData;
            const connectedCameraEdges = edges.filter(e => e.target === vlmSearchNode.id);
            const connectedCameraIds = connectedCameraEdges
                .map(e => {
                    const camNode = nodes.find(n => n.id === e.source && n.type === 'camera');
                    return camNode ? (camNode.data as any).cameraId : null;
                })
                .filter(Boolean) as string[];

            // Use the uploaded image key, or fallback to an empty array
            const imageKey = vlmData.imageKey?.trim() || '';
            const keys = imageKey ? [imageKey] : [];

            try {
                await createPinned({
                    query: vlmData.query,
                    channel: vlmData.channel,
                    interval_frames: vlmData.intervalFrames,
                    minio_keys: keys,
                    camera_id: connectedCameraIds[0] || undefined,
                    rule_id: undefined,
                });
                setDeployStatus('✅ Pinned search activated!');
            } catch (err) {
                setDeployStatus('❌ Error deploying pinned search.');
                console.error(err);
            }
            return;
        }

        // Standard rule deployment
        try {
            const rule = generateRule(ruleName);
            await createRule(rule);
            setDeployStatus(`✅ Rule "${ruleName}" deployed successfully!`);
        } catch (err) {
            setDeployStatus('❌ Error deploying rule.');
            console.error(err);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-950 text-gray-100 font-sans">
            {/* Top bar */}
            <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center px-4 justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold tracking-tight text-safesight-500">SafeSight</h1>
                    <span className="text-gray-500">|</span>
                    <input
                        value={ruleName}
                        onChange={e => setRuleName(e.target.value)}
                        className="bg-transparent border-b border-gray-700 focus:border-safesight-500 outline-none px-2 w-48"
                        placeholder="Rule Name"
                    />
                </div>
                <div className="flex gap-2 items-center">
                    {deployStatus && (
                        <span className={`text-xs ${deployStatus.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
                            {deployStatus}
                        </span>
                    )}
                    <button
                        onClick={() => setShowPreview(true)}
                        className="px-4 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors"
                    >
                        Validate &amp; Preview
                    </button>
                    <button
                        onClick={handleDeploy}
                        className="px-4 py-1 bg-safesight-500 hover:bg-safesight-700 text-black font-semibold rounded text-sm transition-colors"
                    >
                        Deploy Rule
                    </button>
                </div>
            </header>

            {/* Main area */}
            <div className="flex flex-1 overflow-hidden relative">
                <NodePalette cameras={cameras} />
                <div className="flex-1 relative">
                    <ReactFlowProvider>
                        <RuleCanvas />
                    </ReactFlowProvider>
                </div>
                {selectedCameraForZone && (
                    <ZoneEditor
                        cameraId={selectedCameraForZone}
                        cameraName={cameras.find(c => c.id === selectedCameraForZone)?.name || ''}
                        onClose={() => setSelectedCameraForZone(null)}
                    />
                )}
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

export default App;