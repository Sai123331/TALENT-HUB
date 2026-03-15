import { motion, AnimatePresence } from 'motion/react';
import { X, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginPromptModal({ isOpen, onClose }: LoginPromptModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-md bg-white rounded-3xl shadow-xl z-50 overflow-hidden border border-slate-100"
          >
            <div className="p-6 sm:p-8">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
                <LogIn className="w-6 h-6 text-indigo-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Sign in to save jobs</h2>
              <p className="text-slate-600 mb-8">
                Create an account or log in to save jobs and access them later from any device.
              </p>
              
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="w-full py-3 px-4 bg-indigo-600 text-white text-center font-medium rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={onClose}
                  className="w-full py-3 px-4 bg-white text-slate-700 border border-slate-200 text-center font-medium rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
