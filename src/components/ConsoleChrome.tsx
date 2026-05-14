import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';

export const ConsoleChrome = () => {
    const [time, setTime] = useState('');

    useEffect(() => {
        const tick = () => {
            const now = new Date();
            setTime(now.toISOString().replace('T', ' ').slice(0, 19) + ' Z');
        };
        tick();
        const timer = setInterval(tick, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <header className="h-10 flex items-center justify-between px-5 bg-[#0a0a0a] border-b border-machined select-none z-30">
            <div className="flex items-center gap-6">
                <span className="text-[10px] font-medium tracking-[0.3em] text-slate-400">SAFESIGHT</span>
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                    <span className="text-[10px] text-slate-500 tracking-widest">Δ CLEARANCE</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-[10px] text-slate-600 font-mono">{time}</span>
                <div className="flex items-center gap-1.5">
                    <span className="live-dot"></span>
                    <span className="text-[10px] text-rose-400 tracking-widest">SYNC</span>
                </div>
            </div>
        </header>
    );
};