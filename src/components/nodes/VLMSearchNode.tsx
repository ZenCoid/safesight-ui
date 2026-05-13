import { useState, useEffect } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { VLMSearchNodeData } from '../../types';
import axios from 'axios';

export const VLMSearchNode = ({ data }: NodeProps<VLMSearchNodeData>) => {
    const [query, setQuery] = useState(data.query || '');
    const [channel, setChannel] = useState(data.channel || 'whatsapp');
    const [interval, setInterval] = useState(data.intervalFrames || 10);
    const [imageKey, setImageKey] = useState(data.imageKey || '');
    const [uploading, setUploading] = useState(false);

    // Keep node data updated
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
        <div className="bg-gray-800 border-2 border-cyan-400 rounded-lg p-4 min-w-[260px] shadow-lg shadow-cyan-500/20">
            <Handle type="target" position={Position.Left} className="!bg-cyan-400" />
            <div className="flex flex-col gap-3">
                <span className="text-xs text-cyan-400 uppercase tracking-wider font-semibold">
                    🧠 VLM Search
                </span>

                {/* Query */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400">Natural Language Query</label>
                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Alert me if a person in a red shirt appears"
                        className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-gray-200 resize-none h-16"
                    />
                </div>

                {/* Alert Channel */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400">Alert Channel</label>
                    <select
                        value={channel}
                        onChange={(e) => setChannel(e.target.value)}
                        className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-gray-200"
                    >
                        <option value="whatsapp">WhatsApp</option>
                        <option value="email">Email</option>
                    </select>
                </div>

                {/* Interval */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400">Check Interval (frames)</label>
                    <input
                        type="number"
                        value={interval}
                        onChange={(e) => setInterval(Number(e.target.value))}
                        min={1}
                        className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-gray-200 w-24"
                    />
                </div>

                {/* Image Upload */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400">Test Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading}
                        className="text-xs text-gray-300"
                    />
                    {uploading && <span className="text-xs text-cyan-400">Uploading…</span>}
                    {imageKey && (
                        <div className="text-xs text-gray-500 truncate">
                            ✅ {imageKey}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};