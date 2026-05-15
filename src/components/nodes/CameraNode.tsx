import { useState, useRef, useEffect, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Camera } from 'lucide-react';
import { CameraNodeData } from '../../types';
import { useFlowStore } from '../../store/flowStore';
import { MetallicSilverCard } from '../effects/MetallicSilverCard';

interface DetectionWithConfirm {
    class_name: string;
    confidence: number;
    bbox: number[];
    confirmCount: number;   // 0..3
    id: string;             // unique identifier: `${class_name}_${bbox.join(',')}`
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
const WS_BASE = API_BASE.replace(/^http/, 'ws');

export const CameraNode = ({ id, data }: NodeProps<CameraNodeData>) => {
    const setSelected = useFlowStore(s => s.setSelectedCameraForZone);
    const [showPreview, setShowPreview] = useState(false);
    const [detections, setDetections] = useState<DetectionWithConfirm[]>([]);
    const imgRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const [timestamp, setTimestamp] = useState('');
    const isProcessing = (data as any).isProcessing ?? false;

    const streamUrl = `${API_BASE}/cameras/${data.cameraId}/stream`;

    useEffect(() => {
        if (!showPreview) return;
        const ws = new WebSocket(`${WS_BASE}/ws/overlay`);
        wsRef.current = ws;
        ws.onopen = () => ws.send(JSON.stringify({ action: 'subscribe', camera_id: data.cameraId }));
        ws.onmessage = (event) => {
            const d = JSON.parse(event.data);
            if (d.camera_id === data.cameraId) {
                setTimestamp(new Date().toLocaleTimeString('en-US', { hour12: false }));
                const rawObjects: any[] = d.objects || [];
                setDetections(prev => {
                    const newDetections = [...prev];
                    rawObjects.forEach(obj => {
                        const objId = `${obj.class_name}_${obj.bbox.join(',')}`;
                        const existing = newDetections.find(o => o.id === objId);
                        if (existing) {
                            existing.confirmCount = Math.min(existing.confirmCount + 1, 3);
                        } else {
                            newDetections.push({
                                class_name: obj.class_name,
                                confidence: obj.confidence,
                                bbox: obj.bbox,
                                confirmCount: 1,
                                id: objId,
                            });
                        }
                    });
                    return newDetections.filter(n => rawObjects.some(o => `${o.class_name}_${o.bbox.join(',')}` === n.id));
                });
            }
        };
        ws.onclose = () => setDetections([]);
        return () => ws.close();
    }, [showPreview, data.cameraId]);

    const drawOverlay = useCallback(() => {
        const canvas = canvasRef.current;
        const img = imgRef.current;
        if (!canvas || !img) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        canvas.width = img.clientWidth;
        canvas.height = img.clientHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        detections.forEach(obj => {
            const [x, y, w, h] = obj.bbox;
            const px = x * canvas.width, py = y * canvas.height;
            const pw = w * canvas.width, ph = h * canvas.height;
            const violation = obj.class_name === 'no-helmet' || obj.class_name === 'fire';
            const confirmed = obj.confirmCount >= 3;

            ctx.strokeStyle = violation ? '#fb7185' : '#e2e8f0';
            ctx.lineWidth = 1.2;
            ctx.strokeRect(px, py, pw, ph);
            ctx.fillStyle = violation ? '#fb7185' : '#e2e8f0';
            ctx.font = '9px Inter';
            ctx.fillText(`${obj.class_name} (${(obj.confidence * 100).toFixed(0)}%)`, px, py - 4);

            const barWidth = pw;
            const barHeight = 4;
            const barX = px;
            const barY = py + ph + 2;
            const fillPercent = obj.confirmCount / 3;
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.fillRect(barX, barY, barWidth, barHeight);
            ctx.fillStyle = confirmed ? '#4ade80' : '#facc15';
            ctx.fillRect(barX, barY, barWidth * fillPercent, barHeight);

            if (violation && confirmed) {
                ctx.fillStyle = '#fb7185';
                ctx.font = 'bold 10px Inter';
                ctx.fillText('⚠ BREACH', px + pw + 4, py + 14);
            }
        });
        ctx.fillStyle = 'rgba(226,232,240,0.8)';
        ctx.font = '9px monospace';
        ctx.fillText(timestamp, canvas.width - 140, canvas.height - 8);
    }, [detections, timestamp]);

    useEffect(() => {
        const interval = setInterval(drawOverlay, 100);
        return () => clearInterval(interval);
    }, [drawOverlay]);

    return (
        <MetallicSilverCard className="p-0" style={{ minWidth: 210 }}>
            <Handle
                type="source"
                position={Position.Right}
                className="!bg-slate-400 !w-4 !h-4 !border-2 !border-[#111118] !z-50 hover:!bg-teal-400 transition-colors"
            />
            <Handle
                type="target"
                position={Position.Left}
                className="!bg-slate-400 !w-4 !h-4 !border-2 !border-[#111118] !z-50 hover:!bg-teal-400 transition-colors"
            />
            <div className="flex flex-col gap-2 p-4 h-full">
                <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-slate-400" />
                    <span className="text-[10px] text-slate-500 tracking-widest uppercase">Camera</span>
                </div>
                <span className="text-sm font-medium text-slate-200">{data.label}</span>
                <div className="flex items-center gap-2">
                    <button onClick={() => setShowPreview(!showPreview)} className="text-xs text-slate-400 hover:text-white transition-colors">
                        {showPreview ? 'Hide' : 'Live Preview'}
                    </button>
                    {showPreview && (
                        <span className="flex items-center gap-1.5 text-xs">
                            <span className="live-dot"></span>
                            <span className="text-rose-400 tracking-widest">LIVE</span>
                        </span>
                    )}
                </div>
                {showPreview && (
                    <div className="relative w-full h-32 rounded overflow-hidden border border-slate-800 scanline">
                        <img ref={imgRef} src={streamUrl} alt="Feed" className="absolute inset-0 w-full h-full object-cover" onError={e => (e.target as HTMLImageElement).style.display = 'none'} />
                        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
                    </div>
                )}
                <button onClick={() => setSelected(data.cameraId)} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                    Edit Zones
                </button>
            </div>
        </MetallicSilverCard>
    );
};