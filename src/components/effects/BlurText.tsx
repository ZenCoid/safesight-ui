import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    texts: string[];
    interval?: number;
    className?: string;
}

export const BlurText = ({ texts, interval = 3000, className = '' }: Props) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setIndex(prev => (prev + 1) % texts.length), interval);
        return () => clearInterval(timer);
    }, [texts, interval]);

    return (
        <AnimatePresence mode="wait">
            <motion.span
                key={index}
                initial={{ filter: 'blur(8px)', opacity: 0 }}
                animate={{ filter: 'blur(0px)', opacity: 1 }}
                exit={{ filter: 'blur(8px)', opacity: 0 }}
                transition={{ duration: 0.4 }}
                className={className}
            >
                {texts[index]}
            </motion.span>
        </AnimatePresence>
    );
};