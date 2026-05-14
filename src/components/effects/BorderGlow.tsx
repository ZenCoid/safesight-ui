import React from 'react';

interface Props {
    children: React.ReactNode;
    className?: string;
    mouseX: number;
    mouseY: number;
    isHovering: boolean;
    borderWidth?: number;
    glowColor?: string;
    glowRadius?: number;
    glowIntensity?: number;
    borderRadius?: number;
}

export const BorderGlow = ({
    children,
    className = '',
    mouseX,
    mouseY,
    isHovering,
    borderWidth = 1,
    glowColor = '220 14 85',
    glowRadius = 60,
    glowIntensity = 0.8,
    borderRadius = 14,
}: Props) => {
    return (
        <div
            className={`relative ${className}`}
            style={{ borderRadius: `${borderRadius}px` }}
        >
            {/* Ambient glow */}
            <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-500"
                style={{
                    borderRadius: `${borderRadius}px`,
                    opacity: isHovering ? glowIntensity : 0,
                    background: `
            radial-gradient(
              circle ${glowRadius}px at ${mouseX}% ${mouseY}%,
              hsl(${glowColor} / 0.30) 0%,
              hsl(${glowColor} / 0.10) 35%,
              transparent 65%
            )
          `,
                    margin: `-${borderWidth}px`,
                }}
            />
            {/* Metallic specular edge */}
            <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                style={{
                    borderRadius: `${borderRadius}px`,
                    opacity: isHovering ? 0.85 : 0,
                    boxShadow: `
            0 0 0 ${borderWidth}px hsl(${glowColor} / 0.18),
            inset 0 0 0 ${borderWidth}px hsl(${glowColor} / 0.06),
            0 0 ${glowRadius * 0.6}px -${glowRadius * 0.3}px hsl(${glowColor} / 0.15)
          `,
                    margin: `-${borderWidth}px`,
                }}
            />
            {children}
        </div>
    );
};