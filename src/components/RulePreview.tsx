import { useState } from 'react';
import { generateRule } from '../utils/ruleGenerator';
import { createRule } from '../api/backend';
import { useFlowStore } from '../store/flowStore';
import axios from 'axios';

interface Props {
    ruleName: string;
    onClose: () => void;
}

export const RulePreview = ({ ruleName, onClose }: Props) => {
    const [status, setStatus] = useState<string>('');
    const [simulateResult, setSimulateResult] = useState<string | null>(null);
    const rule = generateRule(ruleName);

    const handleDeploy = async () => {
        try {
            await createRule(rule);
            setStatus('✅ Rule deployed successfully!');
            setTimeout(() => setStatus(''), 3000);
        } catch (err) {
            setStatus('❌ Error deploying rule.');
            console.error(err);
        }
    };

    const handleSimulate = async () => {
        try {
            setSimulateResult('Running simulation...');
            const res = await axios.post('http://127.0.0.1:8000/rules/simulate', rule);
            const density = res.data.predicted_alert_density;
            setSimulateResult(`Predicted Alert Density: ${(density * 100).toFixed(1)}% (${res.data.alerts_fired} / ${res.data.total_frames} frames)`);
        } catch (e) {
            setSimulateResult('Simulation failed.');
        }
    };

    return (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="ultra-glass rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-cyber-400">Rule Preview</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">✕</button>
                </div>
                <pre className="text-xs bg-gray-900 p-4 rounded overflow-auto max-h-96 text-green-300">
                    {JSON.stringify(rule, null, 2)}
                </pre>
                {simulateResult && (
                    <div className="mt-2 text-sm text-cyber-400 bg-cyber-900/20 p-2 rounded">
                        {simulateResult}
                    </div>
                )}
                <div className="mt-4 flex justify-between items-center">
                    <span className={`text-sm ${status.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>{status}</span>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSimulate}
                            className="bg-cyber-500 hover:bg-cyber-600 text-black font-semibold px-4 py-2 rounded transition-colors"
                        >
                            Simulate Rule
                        </button>
                        <button
                            onClick={handleDeploy}
                            className="bg-safesight-500 hover:bg-safesight-600 text-black font-semibold px-4 py-2 rounded transition-colors"
                        >
                            Deploy to Backend
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};