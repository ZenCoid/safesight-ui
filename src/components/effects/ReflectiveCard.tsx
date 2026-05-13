import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
    children: ReactNode;
    className?: string;
}

export const ReflectiveCard = ({ children, className = '' }: Props) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02, rotateY: 2, rotateX: -2, boxShadow: '0 20px 40px rgba(34, 211, 238, 0.15)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`ultra-glass rounded-xl overflow-hidden ${className}`}
        >
            {children}
        </motion.div>
    );
};