import React, { useEffect, useId, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface OverlayProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  headerActions?: React.ReactNode;
  maxWidthClass?: string;
}

export function useDialogAccessibility(open: boolean, onClose: () => void) {
  const prevFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return undefined;

    prevFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKey);
      prevFocusRef.current?.focus?.();
    };
  }, [open, onClose]);
}

export const ModalDialog: React.FC<OverlayProps> = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  headerActions,
  maxWidthClass = 'max-w-2xl',
}) => {
  const titleId = useId();
  useDialogAccessibility(open, onClose);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start sm:items-center justify-center p-3 sm:p-6 pt-12 sm:pt-6"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full ${maxWidthClass} bento-stage p-4 sm:p-6 max-h-[86vh] flex flex-col gap-4 overflow-hidden`}
            dir="rtl"
          >
            {(title || headerActions) && (
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-[var(--glass-border-subtle)] shrink-0">
                <div className="min-w-0">
                  {title && (
                    <h2 id={titleId} className="text-lg sm:text-xl font-extrabold font-cairo text-ink truncate">
                      {title}
                    </h2>
                  )}
                  {subtitle && (
                    <p className="text-xs text-ink-secondary mt-0.5 truncate">{subtitle}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {headerActions}
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="إغلاق"
                    className="w-9 h-9 rounded-full tactile-pill flex items-center justify-center text-ink-secondary hover:text-ink"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}
            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface SideDrawerProps extends OverlayProps {
  side?: 'left' | 'right';
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  headerActions,
  side = 'left',
  maxWidthClass = 'max-w-md',
}) => {
  const titleId = useId();
  useDialogAccessibility(open, onClose);
  const slideX = side === 'left' ? '-100%' : '100%';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex ${
            side === 'left' ? 'justify-end' : 'justify-start'
          }`}
        >
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            initial={{ x: slideX }}
            animate={{ x: 0 }}
            exit={{ x: slideX }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full ${maxWidthClass} h-full bento-stage rounded-none sm:rounded-r-[28px] p-5 flex flex-col gap-4 overflow-hidden`}
            dir="rtl"
          >
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-[var(--glass-border-subtle)] shrink-0">
              <div className="min-w-0">
                {title && (
                  <h2 id={titleId} className="text-lg font-extrabold font-cairo text-ink truncate">
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p className="text-xs text-ink-secondary mt-0.5 truncate">{subtitle}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {headerActions}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="إغلاق"
                  className="w-9 h-9 rounded-full tactile-pill flex items-center justify-center text-ink-secondary hover:text-ink"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">{children}</div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

