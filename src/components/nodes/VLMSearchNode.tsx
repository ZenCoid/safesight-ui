import { useState, useEffect } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { BrainCircuit } from 'lucide-react';
import { VLMSearchNodeData } from '../../types';
import axios from 'axios';
import { ReflectiveCard } from '../effects/ReflectiveCard';
import { ProcessingDots } from '../effects/ProcessingDots';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export const VLMSearchNode = ({ id, data }: NodeProps<VLMSearchNodeData>) => {
    const [query, setQuery] = useState(data.query || '');
    const [channel, setChannel] = useState(data.channel || 'whatsapp');
    const [interval, setInterval] = useState(data.intervalFrames || 10);
    const [imageKey, setImageKey] = useState(data.imageKey || '');
    const [uploading, setUploading] = useState(false);
    const isProcessing = (data as any).isProcessing ?? false;

    useEffect(() => {
        data.query = query;
        data.channel = channel;
        data.intervalFrames = interval;
        data.imageKey = imageKey;
    }, [query, channel, interval, imageKey, data]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await axios.post(`${API_BASE}/minio/upload`, formData);
            setImageKey(res.data.object_name);
        } catch (err) {
            console.error(err);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <ReflectiveCard className="p-0" style={{ minWidth: 270 }}>
            <Handle
                type="target"
                position={Position.Left}
                className="!bg-slate-400 !w-4 !h-4 !border-2 !border-[#111118] !z-50 hover:!bg-teal-400 transition-colors"
            />
            <div className="flex flex-col gap-3 p-4">
                <div className="flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-gold-400" />
                    <span className="text-xs text-slate-400 tracking-widest uppercase">VLM Search</span>
                    <ProcessingDots active={isProcessing} />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-500 tracking-wider">QUERY</label>
                    <textarea
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Alert if person in red shirt"
                        className="bg-transparent border-b border-slate-800 focus:border-gold-400/60 outline-none px-0 py-1 text-sm text-slate-200 resize-none h-14 placeholder:text-slate-700"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-500 tracking-wider">CHANNEL</label>
                    <select value={channel} onChange={e => setChannel(e.target.value)}
                        className="bg-transparent border-b border-slate-800 focus:border-slate-400 outline-none px-0 py-1 text-sm text-slate-200">
                        <option value="whatsapp">WhatsApp</option>
                        <option value="email">Email</option>
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-500 tracking-wider">INTERVAL</label>
                    <input type="number" value={interval} onChange={e => setInterval(Number(e.target.value))} min={1}
                        className="bg-transparent border-b border-slate-800 focus:border-slate-400 outline-none px-0 py-1 text-sm text-slate-200 w-16" />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-500 tracking-wider">TEST IMAGE</label>
                    <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading}
                        className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700" />
                    {uploading && <span className="text-xs text-slate-400">Uploading…</span>}
                    {imageKey && (
                        <div className="text-[10px] text-slate-600 font-mono truncate">
                            ✅ {imageKey}
                        </div>
                    )}
                </div>
            </div>
        </ReflectiveCard>
    );
};