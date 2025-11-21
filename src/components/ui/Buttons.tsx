'use client';

import React from 'react';
import { useAppState } from '@/state/useAppState';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Camera } from 'lucide-react';

export function Buttons() {
    const { isRunning, isPaused, setIsRunning, setIsPaused, resetSimulation } = useAppState();

    const handleStartPause = () => {
        if (isRunning && !isPaused) {
            setIsPaused(true);
        } else if (isRunning && isPaused) {
            setIsPaused(false);
        } else {
            setIsRunning(true);
            setIsPaused(false);
        }
    };

    const handleReset = () => {
        resetSimulation();
    };

    return (
        <div className="flex gap-2">
            <Button onClick={handleStartPause} className="flex-1">
                {isRunning && !isPaused ? (
                    <>
                        <Pause className="mr-2 h-4 w-4" /> Pause
                    </>
                ) : (
                    <>
                        <Play className="mr-2 h-4 w-4" /> {isRunning ? 'Resume' : 'Start'}
                    </>
                )}
            </Button>
            <Button variant="outline" onClick={handleReset} title="Reset Simulation">
                <RotateCcw className="h-4 w-4" />
            </Button>
            {/* Camera reset can be handled in the scene or via a global event/state if needed. 
          For now, we'll just keep the button as a placeholder or implement if we add camera state. */}
            <Button variant="outline" title="Reset Camera" onClick={() => window.dispatchEvent(new Event('reset-camera'))}>
                <Camera className="h-4 w-4" />
            </Button>
        </div>
    );
}
