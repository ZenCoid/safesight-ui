import { useState, useEffect } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { BrainCircuit } from 'lucide-react';
import { VLMSearchNodeData } from '../../types';
import axios from 'axios';
import { ReflectiveCard } from '../effects/ReflectiveCard';

export const VLMSearchNode = ({ data }: NodeProps<VLMSearchNodeData>) => {
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
            const res = await axios.post('http://127.0.0.1:8000/minio/upload', formData);
            setImageKey(res.data.object_name);
        } catch (err) {
            console.error('Upload failed', err);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <ReflectiveCard className={`p-4 min-w-[260px] ${isProcessing ? 'neon-flow-border' : ''}`}>
            <Handle type="target" position={Position.Left} className="!bg-cyber-400" />
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-cyber-400" />
                    <span className="text-xs text-cyber-400 uppercase tracking-widest font-medium">
                        VLM Search
                    </span>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider">Query</label>
                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Alert me if a person in a red shirt appears"
                        className="bg-transparent border-b border-gray-700 focus:border-cyber-400 outline-none px-0 py-1 text-sm text-gray-200 resize-none h-16 placeholder:text-gray-600"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider">Channel</label>
                    <select
                        value={channel}
                        onChange={(e) => setChannel(e.target.value)}
                        className="bg-transparent border-b border-gray-700 focus:border-cyber-400 outline-none px-0 py-1 text-sm text-gray-200"
                    >
                        <option value="whatsapp">WhatsApp</option>
                        <option value="email">Email</option>
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider">Interval (frames)</label>
                    <input
                        type="number"
                        value={interval}
                        onChange={(e) => setInterval(Number(e.target.value))}
                        min={1}
                        className="bg-transparent border-b border-gray-700 focus:border-cyber-400 outline-none px-0 py-1 text-sm text-gray-200 w-20"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider">Test Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading}
                        className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-cyber-400/10 file:text-cyber-400 hover:file:bg-cyber-400/20"
                    />
                    {uploading && <span className="text-xs text-cyber-400">Uploading…</span>}
                    {imageKey && (
                        <div className="text-[10px] text-gray-500 truncate font-mono">
                            ✅ {imageKey}
                        </div>
                    )}
                </div>
            </div>
        </ReflectiveCard>
    );
};