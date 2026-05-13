import { useState, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { AnimatePresence, motion } from 'framer-motion';
import { RuleCanvas } from './components/RuleCanvas';
import { NodePalette } from './components/NodePalette';
import { RulePreview } from './components/RulePreview';
import { ZoneEditor } from './components/ZoneEditor';
import { ForensicVault } from './components/ForensicVault';
import { AuroraBackground } from './components/effects/AuroraBackground';
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
        <div className="h-screen flex flex-col bg-[#020617] text-gray-100 font-['Inter'] relative overflow-hidden">
            <AuroraBackground />

            {/* Header */}
            <header className="h-14 flex items-center px-6 justify-between shrink-0 z-20 border-b border-gray-800/50">
                <div className="flex items-center gap-6">
                    <h1 className="text-lg font-light tracking-[0.2em] text-cyber-400">SAFESIGHT</h1>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setActiveTab('canvas')}
                            className={`text-xs uppercase tracking-widest transition-colors ${activeTab === 'canvas' ? 'text-cyber-400' : 'text-gray-600 hover:text-gray-400'}`}
                        >
                            Canvas
                        </button>
                        <button
                            onClick={() => setActiveTab('forensic')}
                            className={`text-xs uppercase tracking-widest transition-colors ${activeTab === 'forensic' ? 'text-cyber-400' : 'text-gray-600 hover:text-gray-400'}`}
                        >
                            Forensic
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {deployStatus && (
                        <span className={`text-xs ${deployStatus.includes('✅') ? 'text-cyber-400' : 'text-red-400'}`}>
                            {deployStatus}
                        </span>
                    )}
                    {activeTab === 'canvas' && (
                        <>
                            <button
                                onClick={() => setShowPreview(true)}
                                className="text-xs text-gray-500 hover:text-gray-300 transition-colors uppercase tracking-widest"
                            >
                                Preview
                            </button>
                            <button
                                onClick={handleDeploy}
                                className="text-xs bg-cyber-400/10 border border-cyber-400/30 text-cyber-400 px-4 py-1.5 rounded-lg hover:bg-cyber-400/20 transition-all uppercase tracking-widest"
                            >
                                Deploy
                            </button>
                        </>
                    )}
                </div>
            </header>

            {/* Content with fluid morphing */}
            <div className="flex-1 relative z-10">
                <AnimatePresence mode="wait">
                    {activeTab === 'canvas' ? (
                        <motion.div
                            key="canvas"
                            initial={{ opacity: 0, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, filter: 'blur(4px)' }}
                            transition={{ duration: 0.3 }}
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
                            initial={{ opacity: 0, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, filter: 'blur(4px)' }}
                            transition={{ duration: 0.3 }}
                            className="h-full"
                        >
                            <ForensicVault />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {showPreview && (
                <RulePreview ruleName={ruleName} onClose={() => setShowPreview(false)} />
            )}
        </div>
    );
}

export default App;