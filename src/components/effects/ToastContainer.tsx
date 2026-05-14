import { useToastStore } from '../../utils/toast';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ToastContainer = () => {
    const { toasts, removeToast } = useToastStore();

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
            <AnimatePresence>
                {toasts.map(toast => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className={`rounded-lg px-4 py-3 text-sm shadow-lg flex items-center gap-3 backdrop-blur-md ${toast.type === 'error' ? 'bg-red-500/20 border border-red-500/40 text-red-300' :
                                toast.type === 'success' ? 'bg-teal-500/20 border border-teal-500/40 text-teal-300' :
                                    'bg-slate-800/90 border border-slate-700 text-slate-300'
                            }`}
                    >
                        <span className="flex-1">{toast.message}</span>
                        <button onClick={() => removeToast(toast.id)} className="text-current opacity-60 hover:opacity-100">
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};