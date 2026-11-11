import React from 'react';

interface TabItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ size?: string | number; className?: string }>;
  badge?: string | number;
}

interface SegmentedTabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export const SegmentedTabs: React.FC<SegmentedTabsProps> = ({
  items,
  activeId,
  onChange,
  className = '',
}) => (
  <div className={`recessed-well p-1.5 inline-flex flex-wrap items-center gap-1 ${className}`} role="tablist">
    {items.map((item) => {
      const active = item.id === activeId;
      const Icon = item.icon;
      return (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={active}
          onClick={() => onChange(item.id)}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            active
              ? 'tactile-pill text-ink'
              : 'text-ink-secondary hover:text-ink'
          }`}
        >
          {Icon && <Icon size={15} className={active ? 'text-glow' : ''} />}
          <span>{item.label}</span>
          {item.badge !== undefined && (
            <span className="text-[11px] font-mono text-ink-muted">{item.badge}</span>
          )}
        </button>
      );
    })}
  </div>
);

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  description,
  action,
}) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
    <div className="min-w-0">
      {eyebrow && (
        <span className="text-xs font-bold text-ink-muted block mb-1">{eyebrow}</span>
      )}
      <h1 className="text-2xl sm:text-4xl font-black font-cairo text-ink leading-tight">
        {title}
      </h1>
      {description && (
        <p className="text-sm sm:text-base text-ink-secondary mt-1.5 leading-relaxed">
          {description}
        </p>
      )}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);
