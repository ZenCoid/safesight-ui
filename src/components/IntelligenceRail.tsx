import { Camera, FolderSearch } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
    active: string;
    onSelect: (tab: string) => void;
}

const items = [
    { id: 'canvas', icon: Camera, label: 'Canvas' },
    { id: 'forensic', icon: FolderSearch, label: 'Forensic' },
];

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
const WS_BASE = API_BASE.replace(/^http/, 'ws');

export const IntelligenceRail = ({ active, onSelect }: Props) => {
    const [telemetry, setTelemetry] = useState<any>(null);

    useEffect(() => {
        const ws = new WebSocket(`${WS_BASE}/ws/telemetry`);
        ws.onmessage = (event) => {
            try {
                setTelemetry(JSON.parse(event.data));
            } catch { }
        };
        return () => ws.close();
    }, []);

    return (
        <aside className="w-16 bg-[#020202] border-r border-[#e2e8f0]/10 z-20 flex flex-col items-center py-4 gap-6">
            {items.map(({ id, icon: Icon, label }) => (
                <button
                    key={id}
                    onClick={() => onSelect(id)}
                    className={`p-2 rounded-lg transition-all group relative ${active === id ? 'bg-white/5 border border-[#e2e8f0]/10' : 'hover:bg-white/[0.02]'
                        }`}
                    title={label}
                >
                    <Icon className={`w-5 h-5 ${active === id ? 'text-[#e2e8f0]' : 'text-[#e2e8f0]/30'}`} />
                    <span className="absolute left-12 top-1/2 -translate-y-1/2 bg-[#020202] border border-[#e2e8f0]/10 px-2 py-0.5 text-[10px] text-[#e2e8f0]/60 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {label}
                    </span>
                </button>
            ))}
            <div className="mt-auto w-full overflow-hidden">
                {telemetry ? (
                    <div className="whitespace-nowrap animate-marquee text-[8px] text-[#e2e8f0]/50 leading-tight">
                        CPU {telemetry.cpu_percent}% · MEM {telemetry.memory_used_gb}GB · VLM {telemetry.vlm_loaded ? 'ON' : 'OFF'} · HASH {telemetry.hash_gen_per_sec}/s · PL {telemetry.pseudo_labeling_active ? 'ACTIVE' : 'IDLE'}
                    </div>
                ) : (
                    <div className="text-[8px] text-[#e2e8f0]/20 animate-pulse">CONNECTING…</div>
                )}
            </div>
        </aside>
    );
};