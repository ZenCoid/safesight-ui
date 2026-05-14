import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
    children: ReactNode;
    className?: string;
}

export const ReflectiveCard = ({ children, className = '' }: Props) => {
    return (
        <motion.div
            whileHover={{ scale: 1.01, rotateY: 1, rotateX: -1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`relative bg-[#0a0a0a] border-machined rounded-xl overflow-hidden
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/3 before:to-transparent before:pointer-events-none
        ${className}`}
        >
            {children}
        </motion.div>
    );
};