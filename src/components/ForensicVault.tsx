import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ReflectiveCard } from './effects/ReflectiveCard';
import { ClickSpark } from './effects/ClickSpark';
import { DecryptText } from './effects/DecryptText';
import { BlurText } from './effects/BlurText';
import { DotGrid } from './effects/DotGrid';
import { MagneticButton } from './effects/MagneticButton';

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
                query, max_frames: 10, show_all: showAll,
            });
            setResults(res.data.results);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    return (
        <div className="p-8 w-full h-full bg-[#0a0a0f] text-slate-200 overflow-auto relative">
            <div className="fixed inset-0 z-0 opacity-20">
                <DotGrid />
            </div>
            <div className="relative z-10 max-w-6xl mx-auto">
                <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-light text-slate-300 mb-10 tracking-[0.15em]">
                    FORENSIC INVESTIGATION
                </motion.h1>

                <div className="flex items-center justify-center gap-4 mb-12">
                    <div className="relative w-full max-w-xl">
                        <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder=""
                            className="w-full bg-transparent border-b border-slate-800 focus:border-slate-400 outline-none px-0 py-3 text-white placeholder-transparent text-lg font-light" />
                        {!query && !loading && (
                            <div className="absolute top-3 left-0 text-slate-700 text-lg font-light pointer-events-none">
                                <BlurText texts={["Find a person in a red shirt...", "Search for abandoned luggage...", "Detect perimeter breach..."]} />
                            </div>
                        )}
                    </div>
                    <MagneticButton onClick={handleSearch} className="bg-white/5 border border-slate-800 text-slate-300 font-medium px-6 py-3 rounded-lg hover:bg-white/10 disabled:opacity-50">
                        {loading ? 'Searching...' : 'Investigate'}
                    </MagneticButton>
                </div>

                <div className="flex items-center gap-2 mb-8">
                    <label className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer">
                        <input type="checkbox" checked={showAll} onChange={e => setShowAll(e.target.checked)} className="accent-slate-400 w-4 h-4 rounded" />
                        Show all frames
                    </label>
                </div>

                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {results.length === 0 && !loading && (
                            <div className="col-span-full text-slate-700 text-center py-20 text-sm font-light">
                                {query ? 'No frames matched.' : 'Enter a query to begin.'}
                            </div>
                        )}
                        {results.map((item, idx) => (
                            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }} layout>
                                <ReflectiveCard className="flex flex-col h-full">
                                    <img src={item.thumbnail_url} className="w-full h-48 object-cover" />
                                    <div className="p-5 flex flex-col flex-1">
                                        <p className="text-xs text-slate-500 mb-3 font-mono tracking-wider">{item.timestamp}</p>
                                        <div className="text-sm text-gold-400 mb-4 leading-relaxed flex-1">
                                            <DecryptText text={item.vlm_reasoning} />
                                        </div>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${item.present ? 'bg-gold-400/10 text-gold-400' : 'bg-slate-800 text-slate-500'}`}>
                                                {item.present ? 'Match' : 'No Match'}
                                            </span>
                                            <MagneticButton onClick={() => window.open(item.thumbnail_url, '_blank')} className="text-xs text-slate-400 hover:text-white transition-colors px-3 py-1 rounded-lg">
                                                Export Evidence
                                            </MagneticButton>
                                        </div>
                                        {item.image_hash && (
                                            <div className="border-t border-slate-800 pt-3 group">
                                                <p className="text-xs text-slate-600 font-mono truncate transition-opacity duration-300 opacity-30 group-hover:opacity-100">
                                                    SHA‑256: {item.image_hash}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </ReflectiveCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};