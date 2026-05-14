import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Props {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    strength?: number;
}

export const MagneticButton = ({
    children,
    className = '',
    onClick,
    strength = 6,
}: Props) => {
    const ref = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = useCallback((e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        setPosition({
            x: (e.clientX - centerX) / strength,
            y: (e.clientY - centerY) / strength,
        });
    }, [strength]);

    const handleLeave = useCallback(() => {
        setPosition({ x: 0, y: 0 });
    }, []);

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={handleLeave}
            onClick={onClick}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
            className={className}
        >
            {children}
        </motion.button>
    );
};