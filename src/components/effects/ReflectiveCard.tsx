import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
    children: ReactNode;
    className?: string;
}

export const ReflectiveCard = ({ children, className = '' }: Props) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02, rotateY: 2, rotateX: -2, boxShadow: '0 20px 40px rgba(34, 211, 238, 0.2)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`relative bg-security-800 glass-panel rounded-xl overflow-hidden border border-cyber-900/50
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none ${className}`}
        >
            {children}
        </motion.div>
    );
};