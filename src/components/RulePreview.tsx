import { useState } from 'react';
import { generateRule } from '../utils/ruleGenerator';
import { createRule } from '../api/backend';
import axios from 'axios';

interface Props { ruleName: string; onClose: () => void; }

export const RulePreview = ({ ruleName, onClose }: Props) => {
    const [status, setStatus] = useState('');
    const [simulateResult, setSimulateResult] = useState<string | null>(null);
    const rule = generateRule(ruleName);

    const handleDeploy = async () => {
        try { await createRule(rule); setStatus('✅ Deployed'); } catch (e) { setStatus('❌ Error'); }
    };
    const handleSimulate = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/rules/simulate`, rule);
            const density = res.data.predicted_alert_density;
            setSimulateResult(`Density: ${(density * 100).toFixed(1)}% (${res.data.alerts_fired}/${res.data.total_frames})`);
        } catch { setSimulateResult('Simulation failed'); }
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
                {simulateResult && <div className="mt-2 text-sm text-[#fb7185]">{simulateResult}</div>}
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