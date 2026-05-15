import { useState } from 'react';
import { generateRule } from '../utils/ruleGenerator';
import { createRule } from '../api/backend';
import axios from 'axios';

interface Props { ruleName: string; onClose: () => void; }

interface AlertFrame {
    frame_index: number;
    timestamp: string;
    confidence: number;
}

export const RulePreview = ({ ruleName, onClose }: Props) => {
    const [status, setStatus] = useState('');
    const [simulateResult, setSimulateResult] = useState<{
        total_frames: number;
        alerts_fired: number;
        predicted_alert_density: number;
        alert_frames: AlertFrame[];
    } | null>(null);
    const rule = generateRule(ruleName);

    const handleDeploy = async () => {
        try { await createRule(rule); setStatus('✅ Deployed'); } catch (e) { setStatus('❌ Error'); }
    };
    const handleSimulate = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/rules/simulate`, rule);
            setSimulateResult(res.data);
        } catch { setSimulateResult(null); }
    };

    return (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="ultra-glass rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg text-[#e2e8f0]">Rule Preview</h2>
                    <button onClick={onClose} className="text-[#e2e8f0]/50 hover:text-white">✕</button>
                </div>
                <pre className="text-xs bg-black/30 p-4 rounded text-[#e2e8f0]/60 max-h-96 overflow-auto">
                    {JSON.stringify(rule, null, 2)}
                </pre>
                {simulateResult && (
                    <div className="mt-4">
                        <div className="text-sm text-[#e2e8f0] mb-2">
                            Density: {(simulateResult.predicted_alert_density * 100).toFixed(1)}% ({simulateResult.alerts_fired}/{simulateResult.total_frames})
                        </div>
                        <div className="grid grid-cols-[repeat(50,1fr)] gap-[1px] h-12">
                            {Array.from({ length: 50 }, (_, i) => {
                                const alert = simulateResult.alert_frames.find(a => a.frame_index === i);
                                const intensity = alert ? alert.confidence : 0;
                                return (
                                    <div
                                        key={i}
                                        className="h-full rounded-sm"
                                        style={{
                                            backgroundColor: intensity > 0.8 ? '#fb7185' :
                                                intensity > 0.5 ? '#fde047' :
                                                    intensity > 0 ? '#e2e8f0' :
                                                        '#1e293b',
                                            opacity: intensity > 0 ? 1 : 0.4,
                                        }}
                                        title={alert ? `Frame ${i}: ${(alert.confidence * 100).toFixed(0)}%` : `Frame ${i}: no alert`}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
                <div className="mt-4 flex justify-between">
                    <span className="text-xs text-[#e2e8f0]/40">{status}</span>
                    <div className="flex gap-2">
                        <button onClick={handleSimulate} className="px-3 py-1 bg-[#e2e8f0]/10 text-[#e2e8f0] rounded text-xs">Simulate</button>
                        <button onClick={handleDeploy} className="px-3 py-1 bg-[#fb7185]/10 border border-[#fb7185]/30 text-[#fb7185] rounded text-xs">Deploy</button>
                    </div>
                </div>
            </div>
        </div>
    );
};