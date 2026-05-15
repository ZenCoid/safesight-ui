import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ReflectiveCard } from './effects/ReflectiveCard';
import { MagneticButton } from './effects/MagneticButton';
import { BlurText } from './effects/BlurText';
import { DotGrid } from './effects/DotGrid';

interface ForensicResult {
    minio_key: string;
    thumbnail_url: string;
    vlm_reasoning: string;
    timestamp: string;
    present: boolean;
    confidence?: number;
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
                query, max_frames: 20, show_all: showAll,
            });
            setResults(res.data.results);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    return (
        <div className="p-8 w-full h-full bg-[#020202] text-[#e2e8f0] overflow-auto relative">
            <div className="fixed inset-0 z-0 opacity-10">
                <DotGrid />
            </div>
            <div className="relative z-10 max-w-7xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-light tracking-[0.15em] text-[#e2e8f0] mb-10"
                >
                    FORENSIC INVESTIGATION
                </motion.h1>

                <div className="flex items-center justify-center gap-4 mb-12">
                    <div className="relative w-full max-w-xl">
                        <input
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder=""
                            className="w-full bg-transparent border-b border-[#e2e8f0]/20 focus:border-[#e2e8f0]/40 outline-none px-0 py-3 text-white placeholder-transparent text-lg font-light"
                        />
                        {!query && !loading && (
                            <div className="absolute top-3 left-0 text-[#e2e8f0]/20 text-lg font-light pointer-events-none">
                                <BlurText texts={[
                                    "Find a person in a red shirt...",
                                    "Search for abandoned luggage...",
                                    "Detect perimeter breach..."
                                ]} />
                            </div>
                        )}
                    </div>
                    <MagneticButton
                        onClick={handleSearch}
                        className="bg-white/5 border border-[#e2e8f0]/20 text-[#e2e8f0] font-medium px-6 py-3 rounded-lg hover:bg-white/10 disabled:opacity-50"
                    >
                        {loading ? 'Searching...' : 'Investigate'}
                    </MagneticButton>
                </div>

                <div className="flex items-center gap-2 mb-8">
                    <label className="flex items-center gap-2 text-sm text-[#e2e8f0]/60 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showAll}
                            onChange={e => setShowAll(e.target.checked)}
                            className="accent-[#e2e8f0] w-4 h-4 rounded"
                        />
                        Show all frames
                    </label>
                </div>

                <motion.div
                    layout
                    className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 auto-rows-min"
                >
                    <AnimatePresence>
                        {results.length === 0 && !loading && (
                            <div className="col-span-full text-[#e2e8f0]/20 text-center py-20 text-sm font-light">
                                {query ? 'No frames matched.' : 'Enter a query to begin.'}
                            </div>
                        )}
                        {results.map((item, idx) => {
                            const isHighConfidence = item.present && (item.confidence || 0) > 0.9;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4 }}
                                    layout
                                    className={`${isHighConfidence ? 'col-span-2 row-span-2' : ''}`}
                                >
                                    <ReflectiveCard className="flex flex-col h-full">
                                        <img
                                            src={item.thumbnail_url}
                                            className={`w-full object-cover ${isHighConfidence ? 'h-72' : 'h-48'}`}
                                        />
                                        <div className="p-5 flex flex-col flex-1">
                                            <p className="text-xs text-[#e2e8f0]/40 mb-3 font-mono tracking-wider">
                                                {item.timestamp}
                                            </p>
                                            <div className="text-sm text-[#fde047] mb-4 leading-relaxed flex-1">
                                                {item.vlm_reasoning}
                                            </div>
                                            <div className="flex items-center justify-between mb-4">
                                                <span
                                                    className={`text-xs px-2 py-0.5 rounded-full ${item.present
                                                        ? 'bg-[#fde047]/10 text-[#fde047]'
                                                        : 'bg-[#e2e8f0]/10 text-[#e2e8f0]/40'
                                                        }`}
                                                >
                                                    {item.present ? 'Match' : 'No Match'}
                                                </span>
                                                <MagneticButton
                                                    onClick={() => window.open(item.thumbnail_url, '_blank')}
                                                    className="text-xs text-[#e2e8f0]/60 hover:text-white transition-colors px-3 py-1 rounded-lg"
                                                >
                                                    Export Evidence
                                                </MagneticButton>
                                            </div>
                                            {item.image_hash && (
                                                <div className="border-t border-[#e2e8f0]/10 pt-3 group">
                                                    <p className="text-[10px] font-mono text-[#e2e8f0]/30 group-hover:text-[#e2e8f0] group-hover:drop-shadow-[0_0_6px_rgba(226,232,240,0.3)] transition-all duration-300">
                                                        SHA‑256: {item.image_hash}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </ReflectiveCard>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};