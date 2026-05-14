import { useEffect, useRef } from 'react';

export const DotGrid = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let mouseX = -1000, mouseY = -1000;
        const particles: { x: number; y: number; baseX: number; baseY: number }[] = [];
        const spacing = 32;
        const radius = 1.2;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particles.length = 0;
            for (let x = spacing; x < canvas.width; x += spacing) {
                for (let y = spacing; y < canvas.height; y += spacing) {
                    particles.push({ x, y, baseX: x, baseY: y });
                }
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(226, 232, 240, 0.12)';
            for (const p of particles) {
                const dx = mouseX - p.baseX;
                const dy = mouseY - p.baseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxMove = 4;
                const force = Math.min(maxMove, maxMove / (dist * 0.01 + 1));
                const angle = Math.atan2(dy, dx);
                p.x = p.baseX + Math.cos(angle) * force;
                p.y = p.baseY + Math.sin(angle) * force;
                ctx.beginPath();
                ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
                ctx.fill();
            }
            requestAnimationFrame(draw);
        };

        const handleMouse = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        resize();
        draw();
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouse);
        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouse);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};