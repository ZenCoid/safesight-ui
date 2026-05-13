import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

interface ForensicResult {
    minio_key: string;
    thumbnail_url: string;
    vlm_reasoning: string;
    timestamp: string;
    present: boolean;
    image_hash: string;
}

export const ForensicVault = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<ForensicResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [showAll, setShowAll] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        try {
            const res = await axios.post('http://127.0.0.1:8000/v1/forensic/search', {
                query: query,
                max_frames: 10,
                show_all: showAll,
            });
            setResults(res.data.results);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 w-full h-full bg-security-950 text-gray-100 overflow-auto">
            <h1 className="text-2xl font-bold text-cyber-400 mb-6">Forensic Investigation Vault</h1>
            <div className="flex items-center gap-3 mb-8">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Find a person in a red shirt..."
                    className="flex-1 bg-security-800 border border-cyber-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyber-400 glass-panel"
                />
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="bg-cyber-500 hover:bg-cyber-600 text-black font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                    {loading ? 'Searching...' : 'Investigate'}
                </button>
            </div>
            <div className="flex items-center gap-2 mb-6">
                <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showAll}
                        onChange={(e) => setShowAll(e.target.checked)}
                        className="accent-cyber-400 w-4 h-4 rounded"
                    />
                    Show all frames (including non‑matches)
                </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.length === 0 && !loading && (
                    <div className="col-span-full text-gray-500 text-center py-12">
                        {query ? 'No frames matched your query.' : 'Enter a query to begin an investigation.'}
                    </div>
                )}
                {results.map((item, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-security-800 glass-panel rounded-xl overflow-hidden border border-cyber-900/50"
                    >
                        <img
                            src={item.thumbnail_url}
                            alt="Frame"
                            className="w-full h-40 object-cover"
                        />
                        <div className="p-4">
                            <p className="text-sm text-cyber-400 mb-2 font-mono">
                                {item.timestamp}
                            </p>
                            <p className="text-sm text-gray-300 mb-3">
                                {item.vlm_reasoning}
                            </p>
                            <div className="flex items-center justify-between mb-2">
                                <span
                                    className={`text-xs px-2 py-0.5 rounded ${item.present ? 'bg-green-400/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}
                                >
                                    {item.present ? 'Match' : 'No Match'}
                                </span>
                                <button
                                    onClick={() => window.open(item.thumbnail_url, '_blank')}
                                    className="text-xs bg-cyber-500/20 text-cyber-400 px-3 py-1 rounded hover:bg-cyber-500/30 transition-colors"
                                >
                                    Download Clip
                                </button>
                            </div>
                            {item.image_hash && (
                                <p className="text-xs text-gray-500 truncate font-mono">
                                    SHA‑256: {item.image_hash}
                                </p>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};