'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppState } from '@/state/useAppState';

export function MetricsPanel() {
    const { metrics, stoppingReason, isRunning } = useAppState();

    const getStatusBadge = () => {
        if (isRunning) {
            return (
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    Running
                </span>
            );
        }

        if (!stoppingReason) return null;

        switch (stoppingReason) {
            case 'converged':
                return (
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        ✓ Converged
                    </span>
                );
            case 'diverged':
                return (
                    <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                        ✗ Diverged
                    </span>
                );
            case 'bounds':
                return (
                    <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                        ⚠ Out of Bounds
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Metrics
                </h3>
                {getStatusBadge()}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                    <span className="text-xs text-muted-foreground">Value f(x,y)</span>
                    <span className="font-mono text-sm">
                        {typeof metrics.currentValue === 'number' ? metrics.currentValue.toFixed(4) : '0.0000'}
                    </span>
                </div>
                <div className="flex flex-col space-y-1">
                    <span className="text-xs text-muted-foreground">|Gradient|</span>
                    <span className="font-mono text-sm">
                        {metrics.gradientMagnitude.toFixed(4)}
                    </span>
                </div>
            </div>
        </div>
    );
}
