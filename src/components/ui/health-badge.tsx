/**
 * SAT Connect - Health Status Badge Component
 * Displays product health status with appropriate styling
 */

import { cn } from '@/lib/utils';

export type HealthStatus = 'HEALTHY' | 'INCOMPLETE' | 'AUDIT_REQUIRED';

export interface HealthBadgeProps {
    status: HealthStatus;
    className?: string;
}

const healthConfig: Record<HealthStatus, {
    label: string;
    variant: string;
    icon: string;
}> = {
    HEALTHY: {
        label: 'Healthy',
        variant: 'bg-green-100 text-green-950 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
        icon: '⭐',
    },
    INCOMPLETE: {
        label: 'Incomplete',
        variant: 'bg-red-100 text-red-950 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
        icon: '❌',
    },
    AUDIT_REQUIRED: {
        label: 'Audit Required',
        variant: 'bg-yellow-100 text-yellow-950 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
        icon: '⚠️',
    },
};

export function HealthBadge({ status, className }: HealthBadgeProps) {
    const config = healthConfig[status];

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border',
                config.variant,
                className
            )}
        >
            <span>{config.icon}</span>
            <span>{config.label}</span>
        </span>
    );
}
