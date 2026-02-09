/**
 * SAT Connect - OTA Distribution Score Bar Component
 * Visual progress bar for 0-100 OTA distribution score
 */

import { cn } from '@/lib/utils';

export interface OTAScoreBarProps {
    score: number;
    className?: string;
    showLabel?: boolean;
}

function getScoreColor(score: number): string {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    if (score > 0) return 'bg-orange-500';
    return 'bg-gray-300';
}

function getScoreRating(score: number): string {
    if (score >= 80) return 'Excellent Distribution';
    if (score >= 60) return 'Good Distribution';
    if (score >= 40) return 'Moderate Distribution';
    if (score > 0) return 'Limited Distribution';
    return 'No Distribution';
}

export function OTAScoreBar({ score, className, showLabel = true }: OTAScoreBarProps) {
    const clampedScore = Math.max(0, Math.min(100, score));
    const colorClass = getScoreColor(clampedScore);
    const rating = getScoreRating(clampedScore);

    return (
        <div className={cn('space-y-1', className)}>
            {showLabel && (
                <div className="flex justify-between text-sm">
                    <span className="font-medium">{rating}</span>
                    <span className="text-muted-foreground">{clampedScore}/100</span>
                </div>
            )}
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                    className={cn('h-full transition-all duration-300', colorClass)}
                    style={{ width: `${clampedScore}%` }}
                />
            </div>
        </div>
    );
}
