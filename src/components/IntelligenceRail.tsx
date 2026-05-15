import { Camera, FolderSearch } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

const WS_BASE = import.meta.env.VITE_WS_URL || 'ws://127.0.0.1:8000';

interface Props {
    active: string;
    onSelect: (tab: string) => void;
}

const items = [
    { id: 'canvas', icon: Camera, label: 'Canvas' },
    { id: 'forensic', icon: FolderSearch, label: 'Forensic' },
];

export const IntelligenceRail = ({ active, onSelect }: Props) => {
    const [telemetry, setTelemetry] = useState<any>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimer = useRef<any>(null);

    const connect = () => {
        const ws = new WebSocket(`${WS_BASE}/ws/telemetry`);
        wsRef.current = ws;

        ws.onmessage = (event) => {
            try {
                setTelemetry(JSON.parse(event.data));
            } catch { }
        };

        ws.onclose = () => {
            setTelemetry(null);
            reconnectTimer.current = setTimeout(connect, 5000);
        };

        ws.onerror = () => {
            ws.close();
        };
    };

    useEffect(() => {
        connect();
        return () => {
            if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
            wsRef.current?.close();
        };
    }, []);

    return (
        <aside className="w-16 bg-[#020202] border-r border-[#e2e8f0]/10 z-20 flex flex-col items-center py-4 gap-6">
            {items.map(({ id, icon: Icon, label }) => (
                <button
                    key={id}
                    onClick={() => onSelect(id)}
                    className={`p-2 rounded-lg transition-all group relative ${active === id ? 'bg-white/5 border border-[#e2e8f0]/10' : 'hover:bg-white/[0.02]'}`}
                    title={label}
                >
                    <Icon className={`w-5 h-5 ${active === id ? 'text-[#e2e8f0]' : 'text-[#e2e8f0]/30'}`} />
                    <span className="absolute left-12 top-1/2 -translate-y-1/2 bg-[#020202] border border-[#e2e8f0]/10 px-2 py-0.5 text-[10px] text-[#e2e8f0]/60 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {label}
                    </span>
                </button>
            ))}
            <div className="mt-auto w-full px-1">
                {telemetry ? (
                    <div className="text-[8px] text-[#e2e8f0]/30 leading-tight animate-pulse">
                        <div>CPU {telemetry.cpu_percent}%</div>
                        <div>MEM {telemetry.memory_used_gb}GB</div>
                        <div>VLM {telemetry.vlm_loaded ? 'ON' : 'OFF'}</div>
                    </div>
                ) : (
                    <div className="text-[8px] text-[#e2e8f0]/20">CONNECTING…</div>
                )}
            </div>
        </aside>
    );
};