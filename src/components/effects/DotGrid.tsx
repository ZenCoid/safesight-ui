import { useEffect, useRef } from 'react';

export const DotGrid = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            draw();
        };

        const draw = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const spacing = 28;
            const radius = 1;
            ctx.fillStyle = 'rgba(34, 211, 238, 0.15)';
            for (let x = 0; x < canvas.width; x += spacing) {
                for (let y = 0; y < canvas.height; y += spacing) {
                    ctx.beginPath();
                    ctx.arc(x, y, radius, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        };

        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};