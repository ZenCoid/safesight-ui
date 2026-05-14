import { useState, useRef, useEffect, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Camera } from 'lucide-react';
import { CameraNodeData } from '../../types';
import { useFlowStore } from '../../store/flowStore';

export const CameraNode = ({ data }: NodeProps<CameraNodeData>) => {
    const setSelected = useFlowStore(s => s.setSelectedCameraForZone);
    const [showPreview, setShowPreview] = useState(false);
    const [detections, setDetections] = useState<any[]>([]);
    const imgRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const [timestamp, setTimestamp] = useState('');

    const streamUrl = `http://127.0.0.1:8000/cameras/${data.cameraId}/stream`;

    useEffect(() => {
        if (!showPreview) return;
        const ws = new WebSocket('ws://127.0.0.1:8000/ws/overlay');
        wsRef.current = ws;
        ws.onopen = () => ws.send(JSON.stringify({ action: 'subscribe', camera_id: data.cameraId }));
        ws.onmessage = (event) => {
            const detectionEvent = JSON.parse(event.data);
            if (detectionEvent.camera_id === data.cameraId) {
                setDetections(detectionEvent.objects || []);
                setTimestamp(new Date().toLocaleTimeString('en-US', { hour12: false }));
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
        detections.forEach((obj) => {
            const [x, y, w, h] = obj.bbox;
            const px = x * canvas.width;
            const py = y * canvas.height;
            const pw = w * canvas.width;
            const ph = h * canvas.height;
            const isViolation = obj.class_name === 'no-helmet' || obj.class_name === 'fire';
            ctx.strokeStyle = isViolation ? '#ef4444' : '#22d3ee';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(px, py, pw, ph);
            ctx.fillStyle = isViolation ? '#ef4444' : '#22d3ee';
            ctx.font = '10px monospace';
            ctx.fillText(`${obj.class_name} (${(obj.confidence * 100).toFixed(0)}%)`, px, py - 4);
            if (isViolation) {
                ctx.fillStyle = '#ef4444';
                ctx.font = 'bold 12px monospace';
                ctx.fillText('⚠️ ALERT', px + pw + 4, py + 14);
            }
        });
        ctx.fillStyle = 'rgba(34, 211, 238, 0.8)';
        ctx.font = '10px monospace';
        ctx.fillText(timestamp, canvas.width - 160, canvas.height - 10);
    }, [detections, timestamp]);

    useEffect(() => {
        const interval = setInterval(drawOverlay, 100);
        return () => clearInterval(interval);
    }, [drawOverlay]);

    return (
        <div className="ultra-glass rounded-lg p-3 min-w-[200px]">
            <Handle type="source" position={Position.Right} className="!bg-cyber-400" />
            <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-cyber-400" />
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">Camera</span>
                </div>
                <span className="text-sm font-medium">{data.label}</span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="text-xs text-cyber-400 hover:text-cyber-300 transition-colors"
                    >
                        {showPreview ? 'Hide' : 'Live Preview'}
                    </button>
                    {showPreview && (
                        <span className="flex items-center gap-1.5 text-xs">
                            <span className="live-dot"></span>
                            <span className="text-red-400 font-semibold tracking-wider">LIVE</span>
                        </span>
                    )}
                </div>
                {showPreview && (
                    <div className="relative w-full h-32 rounded overflow-hidden border border-gray-800 scanline">
                        <img
                            ref={imgRef}
                            src={streamUrl}
                            alt="Live feed"
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                        />
                        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
                    </div>
                )}
                <button
                    onClick={() => setSelected(data.cameraId)}
                    className="mt-1 text-xs text-gray-500 hover:text-cyber-400 transition-colors"
                >
                    Edit Zones
                </button>
            </div>
            <Handle type="target" position={Position.Left} />
        </div>
    );
};