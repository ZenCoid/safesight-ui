import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { BorderGlow } from './BorderGlow';
import { SpotlightCard } from './SpotlightCard';

interface Props {
    children: ReactNode;
    className?: string;
}

export const ReflectiveCard = ({ children, className = '' }: Props) => {
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
        >
            <BorderGlow
                mouseX={mousePos.x}
                mouseY={mousePos.y}
                isHovering={isHovering}
                glowColor="220 14 85"
                glowIntensity={0.7}
                glowRadius={55}
                borderRadius={14}
            >
                <SpotlightCard
                    mouseX={mousePos.x}
                    mouseY={mousePos.y}
                    opacity={isHovering ? 1 : 0}
                    spotlightColor="rgba(226, 232, 240, 0.04)"
                >
                    <motion.div
                        whileHover={{ scale: 1.01, rotateY: 1, rotateX: -1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className={`relative bg-[#111118] rounded-xl
              before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/[0.03] before:to-transparent before:pointer-events-none before:rounded-xl before:z-0
              ${className}`}
                    >
                        {children}
                    </motion.div>
                </SpotlightCard>
            </BorderGlow>
        </div>
    );
};