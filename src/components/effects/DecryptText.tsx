import { motion } from 'framer-motion';

interface Props {
    text: string;
    className?: string;
}

export const DecryptText = ({ text, className = '' }: Props) => {
    const chars = text.split('');
    return (
        <span className={className}>
            {chars.map((char, i) => (
                <motion.span
                    key={i}
                    initial={{ filter: 'blur(8px)', opacity: 0 }}
                    animate={{ filter: 'blur(0px)', opacity: 1 }}
                    transition={{ delay: i * 0.03, duration: 0.2 }}
                >
                    {char}
                </motion.span>
            ))}
        </span>
    );
};