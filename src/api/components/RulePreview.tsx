import { useState } from 'react';
import { generateRule } from '../utils/ruleGenerator';
import { createRule } from '../api/backend';

interface Props {
    ruleName: string;
    onClose: () => void;
}

export const RulePreview = ({ ruleName, onClose }: Props) => {
    const [status, setStatus] = useState<string>('');
    const rule = generateRule(ruleName);

    const handleDeploy = async () => {
        try {
            await createRule(rule);
            setStatus('Rule deployed successfully!');
        } catch (err) {
            setStatus('Error deploying rule.');
            console.error(err);
        }
    };

    return (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-safesight-500">Rule Preview</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
                </div>
                <pre className="text-xs bg-gray-900 p-4 rounded overflow-auto max-h-96">
                    {JSON.stringify(rule, null, 2)}
                </pre>
                <div className="mt-4 flex justify-between items-center">
                    <span className={`text-sm ${status.includes('success') ? 'text-green-400' : 'text-red-400'}`}>{status}</span>
                    <button
                        onClick={handleDeploy}
                        className="bg-safesight-500 hover:bg-safesight-600 text-black font-semibold px-4 py-2 rounded"
                    >
                        Deploy to Backend
                    </button>
                </div>
            </div>
        </div>
    );
};