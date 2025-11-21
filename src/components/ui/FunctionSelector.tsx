'use client';

import React from 'react';
import { useAppState } from '@/state/useAppState';
import { functions } from '@/lib/functions';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export function FunctionSelector() {
    const { selectedFunctionId, setFunctionId, customFunctionExpression, setCustomFunctionExpression } = useAppState();
    const [localExpression, setLocalExpression] = React.useState(customFunctionExpression);

    // Sync local state with global state when global state changes (e.g. initial load or reset)
    React.useEffect(() => {
        setLocalExpression(customFunctionExpression);
    }, [customFunctionExpression]);

    // Debounce updates to global state
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (localExpression !== customFunctionExpression) {
                setCustomFunctionExpression(localExpression);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [localExpression, setCustomFunctionExpression, customFunctionExpression]);

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="function-select">Function</Label>
                <Select value={selectedFunctionId} onValueChange={setFunctionId}>
                    <SelectTrigger id="function-select">
                        <SelectValue placeholder="Select a function" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.values(functions).map((func) => (
                            <SelectItem key={func.id} value={func.id}>
                                {func.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {selectedFunctionId === 'custom' && (
                <div className="space-y-2">
                    <Label htmlFor="custom-expression">Expression (e.g., x^2 + y^2)</Label>
                    <Input
                        id="custom-expression"
                        value={localExpression}
                        onChange={(e) => setLocalExpression(e.target.value)}
                        placeholder="x^2 + y^2"
                    />
                    <p className="text-xs text-muted-foreground">
                        Supported: +, -, *, /, ^, sin, cos, etc.
                    </p>
                </div>
            )}
        </div>
    );
}
