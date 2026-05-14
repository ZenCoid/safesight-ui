import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { BorderGlow } from './BorderGlow';
import { SpotlightCard } from './SpotlightCard';

interface Props {
    children: ReactNode;
    className?: string;
}

export const ReflectiveCard = ({ children, className = '' }: Props) => {
    return (
        <BorderGlow glowColor="220 14 85" glowIntensity={0.7} glowRadius={55} borderRadius={14}>
            <SpotlightCard spotlightColor="rgba(226, 232, 240, 0.04)">
                <motion.div
                    whileHover={{ scale: 1.01, rotateY: 1, rotateX: -1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className={`relative bg-[#111118] rounded-xl overflow-hidden
            before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/[0.03] before:to-transparent before:pointer-events-none
            ${className}`}
                >
                    {children}
                </motion.div>
            </SpotlightCard>
        </BorderGlow>
    );
};