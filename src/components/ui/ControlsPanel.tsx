import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FunctionSelector } from './FunctionSelector';
import { LearningRateSlider } from './LearningRateSlider';
import { Buttons } from './Buttons';
import { useAppState } from '@/state/useAppState';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { OptimizerSelector } from './OptimizerSelector';
import { MetricsPanel } from './MetricsPanel';

export function ControlsPanel() {
    const {
        showWireframe,
        toggleWireframe,
        showGradientArrows,
        toggleGradientArrows,
        showTrajectory,
        toggleTrajectory,
        iterationSpeed,
        setIterationSpeed,
    } = useAppState();

    return (
        <Card className="h-full overflow-y-auto rounded-none border-r">
            <CardHeader>
                <CardTitle>Gradient Descent</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <FunctionSelector />

                <OptimizerSelector />

                <LearningRateSlider />

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label htmlFor="speed">Iteration Delay (ms)</Label>
                        <span className="text-sm text-muted-foreground">{iterationSpeed}ms</span>
                    </div>
                    <Slider
                        id="speed"
                        min={10}
                        max={500}
                        step={10}
                        value={[iterationSpeed]}
                        onValueChange={(vals) => setIterationSpeed(vals[0])}
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="wireframe">Wireframe</Label>
                        <Switch id="wireframe" checked={showWireframe} onCheckedChange={toggleWireframe} />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="arrows">Gradient Arrows</Label>
                        <Switch id="arrows" checked={showGradientArrows} onCheckedChange={toggleGradientArrows} />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="trajectory">Trajectory Path</Label>
                        <Switch id="trajectory" checked={showTrajectory} onCheckedChange={toggleTrajectory} />
                    </div>
                </div>

                <Buttons />

                <MetricsPanel />
            </CardContent>
        </Card>
    );
}
