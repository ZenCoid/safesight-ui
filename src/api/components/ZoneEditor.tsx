import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Line, Circle } from 'react-konva';
import Konva from 'konva';
import { ZoneData } from '../types';
import { useFlowStore } from '../store/flowStore';

interface Props {
    cameraId: string;
    cameraName: string;
    onClose: () => void;
}

export const ZoneEditor = ({ cameraId, cameraName, onClose }: Props) => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [points, setPoints] = useState<number[]>([]); // absolute canvas coords
    const [isFinished, setIsFinished] = useState(false);
    const stageRef = useRef<Konva.Stage>(null);
    const addZone = useFlowStore(s => s.addZone);

    // Load placeholder snapshot (in production, fetch from camera)
    useEffect(() => {
        const img = new window.Image();
        img.crossOrigin = 'Anonymous';
        img.src = 'https://via.placeholder.com/640x360.png?text=Camera+Snapshot'; // placeholder
        img.onload = () => setImage(img);
    }, [cameraId]);

    const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (isFinished) return;
        const stage = stageRef.current;
        if (!stage) return;
        const pos = stage.getPointerPosition();
        if (!pos) return;
        setPoints(prev => [...prev, pos.x, pos.y]);
    };

    const finishPolygon = () => {
        if (points.length < 6) { // need at least 3 points (6 coordinates)
            alert('Need at least 3 points to form a polygon.');
            return;
        }
        setIsFinished(true);
    };

    const saveZone = () => {
        if (!image || !stageRef.current || points.length < 6) return;
        const name = prompt('Zone name:') || 'Unnamed Zone';
        // Normalize points: divide by image size
        const normalizedPoints: number[][] = [];
        for (let i = 0; i < points.length; i += 2) {
            normalizedPoints.push([
                points[i] / image.width,
                points[i + 1] / image.height,
            ]);
        }
        addZone({ cameraId, name, points: normalizedPoints });
        alert(`Zone "${name}" saved.`);
        onClose();
    };

    return (
        <div className="absolute top-0 right-0 w-96 h-full bg-gray-900 border-l border-gray-700 p-4 flex flex-col z-50">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Zones for {cameraName}</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="flex-1 bg-black rounded overflow-hidden mb-2">
                <Stage
                    ref={stageRef}
                    width={640}
                    height={360}
                    onClick={handleStageClick}
                    style={{ borderRadius: '0.5rem' }}
                >
                    <Layer>
                        {image && <KonvaImage image={image} width={640} height={360} />}
                        <Line
                            points={points}
                            closed={isFinished}
                            fill={isFinished ? 'rgba(255,0,0,0.2)' : undefined}
                            stroke="red"
                            strokeWidth={2}
                            tension={0}
                        />
                        {points.map((_, i) => i % 2 === 0 && (
                            <Circle
                                key={i}
                                x={points[i]}
                                y={points[i + 1]}
                                radius={3}
                                fill="white"
                                stroke="red"
                            />
                        ))}
                    </Layer>
                </Stage>
            </div>
            <div className="flex gap-2">
                {!isFinished ? (
                    <button onClick={finishPolygon} className="flex-1 bg-safesight-500 hover:bg-safesight-600 rounded py-1 text-sm">
                        Close Polygon
                    </button>
                ) : (
                    <button onClick={saveZone} className="flex-1 bg-safesight-500 hover:bg-safesight-600 rounded py-1 text-sm">
                        Save Zone
                    </button>
                )}
                <button onClick={() => { setPoints([]); setIsFinished(false); }} className="px-3 bg-gray-700 rounded text-sm">Reset</button>
            </div>
        </div>
    );
};