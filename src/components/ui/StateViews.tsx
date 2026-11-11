import React from 'react';
import { AlertCircle, RefreshCw, Inbox } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  action?: React.ReactNode;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'تعذر تحميل البيانات',
  message = 'حدث خطأ أثناء الاتصال بالخدمة، يرجى التحقق من اتصالك والمحاولة مجدداً.',
  onRetry,
  action,
}) => (
  <div className="bento-stage p-8 sm:p-12 text-center flex flex-col items-center gap-4 max-w-xl mx-auto my-6">
    <div className="w-14 h-14 rounded-2xl recessed-box flex items-center justify-center text-glow">
      <AlertCircle size={26} />
    </div>
    <div className="space-y-1.5">
      <h2 className="text-xl font-extrabold font-cairo text-ink">{title}</h2>
      <p className="text-sm text-ink-secondary leading-relaxed">{message}</p>
    </div>
    <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="tactile-pill px-5 py-2.5 text-sm font-bold text-ink hover:text-glow flex items-center gap-2 border-glow-border"
        >
          <RefreshCw size={15} />
          <span>إعادة المحاولة</span>
        </button>
      )}
      {action}
    </div>
  </div>
);

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => (
  <div className="recessed-box p-8 sm:p-12 text-center flex flex-col items-center gap-3">
    <div className="w-12 h-12 rounded-2xl tactile-pill flex items-center justify-center text-ink-muted">
      {icon || <Inbox size={22} />}
    </div>
    <h3 className="text-base sm:text-lg font-extrabold font-cairo text-ink">{title}</h3>
    {description && (
      <p className="text-xs sm:text-sm text-ink-secondary max-w-md leading-relaxed">
        {description}
      </p>
    )}
    {action && <div className="pt-2">{action}</div>}
  </div>
);

export const CardsSkeleton: React.FC<{ count?: number }> = ({ count = 12 }) => (
  <div className="auto-grid" aria-label="جاري التحميل">
    {Array.from({ length: count }).map((_, idx) => (
      <div
        key={idx}
        className="h-24 rounded-[22px] recessed-box animate-pulse"
        aria-hidden="true"
      />
    ))}
  </div>
);

