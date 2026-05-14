import { Camera, Cpu, BrainCircuit, FolderSearch, GraduationCap, Shield } from 'lucide-react';

interface Props {
    active: string;
    onSelect: (tab: string) => void;
}

const items = [
    { id: 'canvas', icon: Camera, label: 'Canvas' },
    { id: 'forensic', icon: FolderSearch, label: 'Forensic' },
];

export const IntelligenceRail = ({ active, onSelect }: Props) => {
    return (
        <aside className="w-16 flex flex-col items-center py-4 gap-6 bg-[#0a0a0a] border-r border-machined z-20">
            {items.map(({ id, icon: Icon, label }) => (
                <button
                    key={id}
                    onClick={() => onSelect(id)}
                    className={`p-2 rounded-lg transition-all group relative ${active === id ? 'bg-white/5 border-machined' : 'hover:bg-white/[0.02]'
                        }`}
                    title={label}
                >
                    <Icon className={`w-5 h-5 ${active === id ? 'text-slate-200' : 'text-slate-600'}`} />
                    <span className="absolute left-12 top-1/2 -translate-y-1/2 bg-[#0a0a0a] border-machined px-2 py-0.5 text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {label}
                    </span>
                </button>
            ))}
        </aside>
    );
};