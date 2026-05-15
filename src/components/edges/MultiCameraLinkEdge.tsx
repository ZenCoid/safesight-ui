import { EdgeProps, getBezierPath } from 'reactflow';
import './MultiCameraLinkEdge.css';

export default function MultiCameraLinkEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
}: EdgeProps) {
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    return (
        <path
            id={id}
            style={{
                ...style,
                stroke: '#e2e8f0',          // Mercury Silver
                strokeWidth: 2,
                strokeDasharray: '6 4',
                animation: 'dashPulse 1.2s linear infinite',
            }}
            className="multi-camera-link-edge"
            d={edgePath}
            markerEnd={markerEnd}
        />
    );
}