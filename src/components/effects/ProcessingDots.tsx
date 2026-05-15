import { motion } from 'framer-motion';

interface Props {
    active?: boolean;
    className?: string;
}

export const ProcessingDots = ({ active = false, className = '' }: Props) => {
    if (!active) return null;

    return (
        <div className={`flex items-center gap-1 ${className}`}>
            {[0, 1, 2].map(i => (
                <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#e2e8f0]/60"
                    animate={{
                        opacity: [0.2, 1, 0.2],
                        scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                        duration: 1.4,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    );
};