import { useState, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { AnimatePresence, motion } from 'framer-motion';
import { ConsoleChrome } from './components/ConsoleChrome';
import { IntelligenceRail } from './components/IntelligenceRail';
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
    const [activeTab, setActiveTab] = useState('canvas');

    const selectedCameraForZone = useFlowStore(s => s.selectedCameraForZone);
    const setSelectedCameraForZone = useFlowStore(s => s.setSelectedCameraForZone);

    useEffect(() => { getCameras().then(res => setCameras(res.data)).catch(console.error); }, []);

    const handleDeploy = async () => {
        const { nodes, edges } = useFlowStore.getState();
        const vlmNode = nodes.find(n => n.type === 'vlmSearch');
        if (vlmNode) {
            const d = vlmNode.data as VLMSearchNodeData;
            const camIds = edges.filter(e => e.target === vlmNode.id).map(e => {
                const cam = nodes.find(n => n.id === e.source && n.type === 'camera');
                return cam ? (cam.data as any).cameraId : null;
            }).filter(Boolean) as string[];
            try {
                await createPinned({ query: d.query, channel: d.channel, interval_frames: d.intervalFrames, minio_keys: d.imageKey ? [d.imageKey] : [], camera_id: camIds[0] || undefined, rule_id: undefined });
                setDeployStatus('✅ Pinned search activated!');
            } catch (err) { setDeployStatus('❌ Error'); }
            return;
        }
        try {
            const rule = generateRule(ruleName);
            await createRule(rule);
            setDeployStatus(`✅ Rule deployed`);
        } catch (err) { setDeployStatus('❌ Error'); }
    };

    return (
        <div className="h-screen flex flex-col bg-[#020202] text-slate-200 font-['Inter'] relative overflow-hidden">
            <DotGrid />
            <ConsoleChrome />
            <div className="flex flex-1 overflow-hidden">
                <IntelligenceRail active={activeTab} onSelect={setActiveTab} />
                <main className="flex-1 relative z-10">
                    <AnimatePresence mode="wait">
                        {activeTab === 'canvas' ? (
                            <motion.div key="canvas" initial={{ opacity: 0, filter: 'blur(4px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="flex h-full">
                                <NodePalette cameras={cameras} />
                                <div className="flex-1 relative">
                                    <ReactFlowProvider><RuleCanvas /></ReactFlowProvider>
                                </div>
                                {selectedCameraForZone && (
                                    <ZoneEditor cameraId={selectedCameraForZone} cameraName={cameras.find(c => c.id === selectedCameraForZone)?.name || ''} onClose={() => setSelectedCameraForZone(null)} />
                                )}
                            </motion.div>
                        ) : (
                            <motion.div key="forensic" initial={{ opacity: 0, filter: 'blur(4px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="h-full">
                                <ForensicVault />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
            {activeTab === 'canvas' && (
                <div className="absolute bottom-4 right-4 z-20 flex gap-2">
                    <button onClick={() => setShowPreview(true)} className="px-3 py-1.5 bg-white/5 border border-slate-800 text-xs text-slate-400 rounded-lg hover:bg-white/10">Preview</button>
                    <button onClick={handleDeploy} className="px-3 py-1.5 bg-rose-400/10 border border-rose-400/30 text-rose-400 text-xs rounded-lg hover:bg-rose-400/20">Deploy</button>
                </div>
            )}
            {showPreview && <RulePreview ruleName={ruleName} onClose={() => setShowPreview(false)} />}
        </div>
    );
}

export default App;