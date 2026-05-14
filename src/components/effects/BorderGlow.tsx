import { useRef, useState, useCallback } from 'react';

interface Props {
    children: React.ReactNode;
    className?: string;
    borderWidth?: number;
    glowColor?: string;
    glowRadius?: number;
    glowIntensity?: number;
    borderRadius?: number;
}

export const BorderGlow = ({
    children,
    className = '',
    borderWidth = 1,
    glowColor = '220 14 85',
    glowRadius = 60,
    glowIntensity = 0.8,
    borderRadius = 14,
}: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    }, []);

    const handleMouseEnter = useCallback(() => setIsHovering(true), []);
    const handleMouseLeave = useCallback(() => {
        setIsHovering(false);
        setMousePos({ x: -1000, y: -1000 });
    }, []);

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`relative ${className}`}
            style={{ borderRadius: `${borderRadius}px` }}
        >
            {/* Ambient glow layer */}
            <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                style={{
                    borderRadius: `${borderRadius}px`,
                    opacity: isHovering ? glowIntensity : 0,
                    background: `
            radial-gradient(
              circle ${glowRadius}px at ${mousePos.x}% ${mousePos.y}%,
              hsl(${glowColor} / 0.30) 0%,
              hsl(${glowColor} / 0.10) 35%,
              transparent 65%
            )
          `,
                    zIndex: -1,
                    margin: `-${borderWidth}px`,
                }}
            />
            {/* Metallic specular edge highlight */}
            <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                    borderRadius: `${borderRadius}px`,
                    opacity: isHovering ? 0.85 : 0,
                    boxShadow: `
            0 0 0 ${borderWidth}px hsl(${glowColor} / 0.18),
            inset 0 0 0 ${borderWidth}px hsl(${glowColor} / 0.06),
            0 0 ${glowRadius * 0.6}px -${glowRadius * 0.3}px hsl(${glowColor} / 0.15)
          `,
                    zIndex: -1,
                }}
            />
            {/* Content */}
            <div className="relative z-10">{children}</div>
        </div>
    );
};