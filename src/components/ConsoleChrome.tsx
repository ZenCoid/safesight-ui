import { useEffect, useState } from 'react';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

export const ConsoleChrome = () => {
    const [time, setTime] = useState('');
    const [privacyEnabled, setPrivacyEnabled] = useState(false);

    useEffect(() => {
        const tick = () => {
            const now = new Date();
            setTime(now.toISOString().replace('T', ' ').slice(0, 19) + ' Z');
        };
        tick();
        const timer = setInterval(tick, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/privacy/status')
            .then(res => setPrivacyEnabled(res.data.privacy_enabled))
            .catch(() => { });
    }, []);

    const togglePrivacy = async () => {
        try {
            const res = await axios.post('http://127.0.0.1:8000/privacy/toggle');
            setPrivacyEnabled(res.data.privacy_enabled);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <header className="h-10 flex items-center justify-between px-5 bg-[#020202] border-b border-[#e2e8f0]/10 select-none z-30">
            <div className="flex items-center gap-6">
                <span className="text-[10px] font-medium tracking-[0.3em] text-[#e2e8f0]/60">SAFESIGHT</span>
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#fb7185]" />
                    <span className="text-[10px] text-[#e2e8f0]/40 tracking-widest">Δ CLEARANCE</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={togglePrivacy}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] transition-colors ${privacyEnabled
                        ? 'bg-[#fb7185]/10 text-[#fb7185] border border-[#fb7185]/20'
                        : 'text-[#e2e8f0]/40 hover:text-[#e2e8f0]/80'
                        }`}
                    title={privacyEnabled ? 'Disable privacy mode' : 'Enable privacy mode'}
                >
                    {privacyEnabled ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {privacyEnabled ? 'PRIVACY ON' : 'PRIVACY OFF'}
                </button>
                <span className="text-[10px] text-[#e2e8f0]/40 font-mono">{time}</span>
                <div className="flex items-center gap-1.5">
                    <span className="live-dot"></span>
                    <span className="text-[10px] text-[#fb7185] tracking-widest">SYNC</span>
                </div>
            </div>
        </header>
    );
};