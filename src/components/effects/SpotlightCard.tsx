import React from 'react';

interface Props {
    children: React.ReactNode;
    className?: string;
    mouseX: number;
    mouseY: number;
    opacity: number;
    spotlightColor?: string;
}

export const SpotlightCard = ({
    children,
    className = '',
    mouseX,
    mouseY,
    opacity,
    spotlightColor = 'rgba(226, 232, 240, 0.06)',
}: Props) => {
    return (
        <div className={`relative ${className}`}>
            {/* Spotlight layer – never blocks interactions */}
            <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-300 rounded-xl"
                style={{
                    opacity,
                    background: `radial-gradient(400px circle at ${mouseX}px ${mouseY}px, ${spotlightColor}, transparent 40%)`,
                }}
            />
            {children}
        </div>
    );
};