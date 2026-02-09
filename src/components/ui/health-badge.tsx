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
        variant: 'bg-green-100 text-green-800 border-green-200',
        icon: '⭐',
    },
    INCOMPLETE: {
        label: 'Incomplete',
        variant: 'bg-red-100 text-red-800 border-red-200',
        icon: '❌',
    },
    AUDIT_REQUIRED: {
        label: 'Audit Required',
        variant: 'bg-yellow-100 text-yellow-800 border-yellow-200',
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
