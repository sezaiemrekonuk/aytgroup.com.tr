import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { PROJECT_STATUS } from '../../constants';

/** Status badge for project cards */
export function StatusBadge({ status }) {
  const { t } = useTranslation();
  const style = PROJECT_STATUS[status]?.color ?? 'bg-neutral-100 text-neutral-600';
  const label = t(`projects.status.${status}`, { defaultValue: status });
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded text-xs font-heading font-semibold uppercase tracking-wide', style)}>
      {status === 'completed' ? '✓ ' : '● '}
      {label}
    </span>
  );
}

/** Category badge */
export function CategoryBadge({ category }) {
  const { t } = useTranslation();
  const colorMap = {
    residential: 'bg-accent/10 text-accent-dark dark:bg-accent/20 dark:text-accent-light',
    commercial:  'bg-primary/10 text-primary dark:bg-primary-light/20 dark:text-neutral-300',
    industrial:  'bg-cta/10 text-cta-dark dark:bg-cta/20 dark:text-cta-light',
  };
  const label = t(`projects.filter.${category}`, { defaultValue: category });

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded text-xs font-heading font-semibold uppercase tracking-wide',
        colorMap[category] ?? 'bg-neutral-100 text-neutral-600',
      )}
    >
      {label}
    </span>
  );
}
