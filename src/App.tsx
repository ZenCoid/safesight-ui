import { useState, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { AnimatePresence, motion } from 'framer-motion';
import { RuleCanvas } from './components/RuleCanvas';
import { NodePalette } from './components/NodePalette';
import { RulePreview } from './components/RulePreview';
import { ZoneEditor } from './components/ZoneEditor';
import { ForensicVault } from './components/ForensicVault';
import { DotGrid } from './components/effects/DotGrid';
import { getCameras, Camera, createRule, createPinned } from './api/backend';
import { useFlowStore } from './store/flowStore';
import { generateRule } from './utils/ruleGenerator';
import { VLMSearchNodeData } from './types';

function App() {
    const [cameras, setCameras] = useState<Camera[]>([]);
    const [showPreview, setShowPreview] = useState(false);
    const [ruleName, setRuleName] = useState('New Rule');
    const [deployStatus, setDeployStatus] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'canvas' | 'forensic'>('canvas');

    const selectedCameraForZone = useFlowStore(s => s.selectedCameraForZone);
    const setSelectedCameraForZone = useFlowStore(s => s.setSelectedCameraForZone);

    useEffect(() => {
        getCameras().then(res => setCameras(res.data)).catch(console.error);
    }, []);

    const handleDeploy = async () => {
        const { nodes, edges } = useFlowStore.getState();
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
        <div className="h-screen flex flex-col bg-security-950 text-gray-100 font-sans relative">
            <DotGrid />
            <header className="h-14 bg-security-900/80 backdrop-blur-sm border-b border-cyber-900/50 flex items-center px-4 justify-between shrink-0 z-20">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold tracking-tight text-cyber-400">SafeSight</h1>
                    <span className="text-gray-500">|</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('canvas')}
                            className={`px-3 py-1 text-sm rounded transition-colors ${activeTab === 'canvas' ? 'bg-cyber-500/20 text-cyber-400' : 'text-gray-400 hover:text-white'}`}
                        >
                            Command Canvas
                        </button>
                        <button
                            onClick={() => setActiveTab('forensic')}
                            className={`px-3 py-1 text-sm rounded transition-colors ${activeTab === 'forensic' ? 'bg-cyber-500/20 text-cyber-400' : 'text-gray-400 hover:text-white'}`}
                        >
                            Forensic Vault
                        </button>
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    {deployStatus && (
                        <span className={`text-xs ${deployStatus.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
                            {deployStatus}
                        </span>
                    )}
                    {activeTab === 'canvas' && (
                        <>
                            <button
                                onClick={() => setShowPreview(true)}
                                className="px-4 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors"
                            >
                                Validate &amp; Preview
                            </button>
                            <button
                                onClick={handleDeploy}
                                className="px-4 py-1 bg-cyber-500 hover:bg-cyber-600 text-black font-semibold rounded text-sm transition-colors"
                            >
                                Deploy Rule
                            </button>
                        </>
                    )}
                </div>
            </header>

            <div className="flex-1 overflow-hidden relative z-10">
                <AnimatePresence mode="wait">
                    {activeTab === 'canvas' ? (
                        <motion.div
                            key="canvas"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex h-full"
                        >
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
                        </motion.div>
                    ) : (
                        <motion.div
                            key="forensic"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="h-full"
                        >
                            <ForensicVault />
                        </motion.div>
                    )}
                </AnimatePresence>
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