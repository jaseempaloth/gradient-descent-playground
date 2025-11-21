'use client';

import React from 'react';
import { useAppState } from '@/state/useAppState';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

export function LearningRateSlider() {
    const { learningRate, setLearningRate } = useAppState();

    return (
        <div className="space-y-2">
            <div className="flex justify-between">
                <Label htmlFor="learning-rate">Learning Rate</Label>
                <span className="text-sm text-muted-foreground">{learningRate.toFixed(3)}</span>
            </div>
            <Slider
                id="learning-rate"
                min={0.001}
                max={0.5}
                step={0.001}
                value={[learningRate]}
                onValueChange={(vals) => setLearningRate(vals[0])}
            />
        </div>
    );
}
