import { useState, useRef, useEffect, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CameraNodeData } from '../../types';
import { useFlowStore } from '../../store/flowStore';

export const CameraNode = ({ data }: NodeProps<CameraNodeData>) => {
    const setSelected = useFlowStore(s => s.setSelectedCameraForZone);
    const [showPreview, setShowPreview] = useState(false);
    const [detections, setDetections] = useState<any[]>([]);
    const imgRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wsRef = useRef<WebSocket | null>(null);

    const streamUrl = `http://127.0.0.1:8000/cameras/${data.cameraId}/stream`;

    // WebSocket connection for detection overlay
    useEffect(() => {
        if (!showPreview) return;
        const ws = new WebSocket('ws://127.0.0.1:8000/ws/overlay');
        wsRef.current = ws;
        ws.onopen = () => {
            ws.send(JSON.stringify({ action: 'subscribe', camera_id: data.cameraId }));
        };
        ws.onmessage = (event) => {
            const detectionEvent = JSON.parse(event.data);
            if (detectionEvent.camera_id === data.cameraId) {
                setDetections(detectionEvent.objects || []);
            }
        };
        ws.onclose = () => setDetections([]);
        return () => ws.close();
    }, [showPreview, data.cameraId]);

    // Draw bounding boxes on canvas over the image
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
            const [x, y, w, h] = obj.bbox; // normalized 0‑1
            const px = x * canvas.width;
            const py = y * canvas.height;
            const pw = w * canvas.width;
            const ph = h * canvas.height;

            const isViolation = obj.class_name === 'no-helmet' || obj.class_name === 'fire';
            ctx.strokeStyle = isViolation ? '#ff4444' : '#22d3ee';
            ctx.lineWidth = 2;
            ctx.strokeRect(px, py, pw, ph);

            ctx.fillStyle = isViolation ? '#ff4444' : '#22d3ee';
            ctx.font = '12px monospace';
            ctx.fillText(
                `${obj.class_name} (${(obj.confidence * 100).toFixed(0)}%)`,
                px, py - 4
            );

            if (isViolation) {
                ctx.fillStyle = '#ff4444';
                ctx.font = 'bold 14px monospace';
                ctx.fillText('⚠️ ALERT', px + pw + 4, py + 14);
            }
        });
    }, [detections]);

    useEffect(() => {
        const interval = setInterval(drawOverlay, 100);
        return () => clearInterval(interval);
    }, [drawOverlay]);

    return (
        <div className="bg-gray-800 border-2 border-safesight-500 rounded-lg p-3 min-w-[200px] shadow-lg">
            <Handle type="source" position={Position.Right} className="!bg-safesight-500" />
            <div className="flex flex-col items-start gap-2">
                <span className="text-xs text-gray-400 uppercase">Camera</span>
                <span className="text-sm font-bold">{data.label}</span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="text-xs bg-safesight-500/20 text-safesight-500 px-2 py-0.5 rounded hover:bg-safesight-500/30 transition-colors"
                    >
                        {showPreview ? 'Hide Preview' : 'Live Preview'}
                    </button>
                    {showPreview && (
                        <span className="flex items-center gap-1 text-xs">
                            <span className="live-dot"></span>
                            <span className="text-red-400 font-semibold">LIVE</span>
                        </span>
                    )}
                </div>
                {showPreview && (
                    <div className="relative w-full h-32 rounded overflow-hidden border border-gray-700 scanline">
                        <img
                            ref={imgRef}
                            src={streamUrl}
                            alt="Live feed"
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                        <canvas
                            ref={canvasRef}
                            className="absolute inset-0 w-full h-full"
                        />
                    </div>
                )}
                <button
                    onClick={() => setSelected(data.cameraId)}
                    className="mt-1 text-xs bg-safesight-500/20 text-safesight-500 px-2 py-0.5 rounded hover:bg-safesight-500/30 transition-colors"
                >
                    Edit Zones
                </button>
            </div>
            <Handle type="target" position={Position.Left} />
        </div>
    );
};