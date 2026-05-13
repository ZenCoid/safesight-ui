import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    children: React.ReactNode;
    className?: string;
}

export const ClickSpark = ({ children, className = '' }: Props) => {
    const [sparks, setSparks] = useState<{ id: number; x: number; y: number }[]>([]);

    const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();
        setSparks(prev => [...prev, { id, x, y }]);
        setTimeout(() => setSparks(prev => prev.filter(s => s.id !== id)), 600);
    }, []);

    return (
        <button onClick={handleClick} className={`relative overflow-hidden ${className}`}>
            {children}
            <AnimatePresence>
                {sparks.map(s => (
                    <motion.div
                        key={s.id}
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 2, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute w-2 h-2 bg-cyber-400 rounded-full pointer-events-none"
                        style={{ left: s.x - 4, top: s.y - 4 }}
                    />
                ))}
            </AnimatePresence>
        </button>
    );
};