'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useAppState, Optimizer } from '@/state/useAppState';

export function OptimizerSelector() {
    const { optimizer, setOptimizer } = useAppState();

    return (
        <div className="space-y-2">
            <Label htmlFor="optimizer-select">Optimizer</Label>
            <Select value={optimizer} onValueChange={(val) => setOptimizer(val as Optimizer)}>
                <SelectTrigger id="optimizer-select">
                    <SelectValue placeholder="Select optimizer" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="SGD">SGD</SelectItem>
                    <SelectItem value="Momentum">Momentum</SelectItem>
                    <SelectItem value="RMSProp">RMSProp</SelectItem>
                    <SelectItem value="Adam">Adam</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
