import { useEffect, useRef } from 'react';
import { useAppState } from '@/state/useAppState';
import { functions } from '@/lib/functions';
import { computeGradient } from '@/lib/gradient';

export function useGradientDescent() {
    const {
        selectedFunctionId,
        learningRate,
        iterationSpeed,
        isRunning,
        isPaused,
        currentPoint,
        setCurrentPoint,
        addTrajectoryPoint,
        setIsRunning,
        optimizer,
        optimizerParams,
        setMetrics,
        setStoppingReason,
        functionVersion,
    } = useAppState();

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Optimizer Internal State
    const stateRef = useRef({
        velocity: [0, 0] as [number, number], // For Momentum
        squaredGrad: [0, 0] as [number, number], // For RMSProp/Adam
        m: [0, 0] as [number, number], // For Adam (1st moment)
        v: [0, 0] as [number, number], // For Adam (2nd moment)
        t: 0, // Time step for Adam
        gradientHistory: [] as number[], // Track gradient magnitude history for divergence detection
    });

    // Reset internal state when optimizer or function changes
    useEffect(() => {
        stateRef.current = {
            velocity: [0, 0],
            squaredGrad: [0, 0],
            m: [0, 0],
            v: [0, 0],
            t: 0,
            gradientHistory: [],
        };
    }, [optimizer, selectedFunctionId, isRunning, functionVersion]); // Reset on run start too? Maybe just on optimizer change.

    useEffect(() => {
        if (isRunning && !isPaused) {
            // Reset stopping reason when starting
            setStoppingReason(null);

            intervalRef.current = setInterval(() => {
                const funcDef = functions[selectedFunctionId];
                const [x, y] = currentPoint; // z is ignored for gradient calc

                // Calculate gradient
                let grad: [number, number];
                if (funcDef.grad) {
                    grad = funcDef.grad(x, y);
                } else {
                    grad = computeGradient(funcDef.f, x, y);
                }

                const gradMag = Math.sqrt(grad[0] * grad[0] + grad[1] * grad[1]);
                setMetrics({
                    currentValue: funcDef.f(x, y),
                    gradientMagnitude: gradMag,
                });

                // Track gradient history for divergence detection
                const state = stateRef.current;
                state.gradientHistory.push(gradMag);

                // Keep only last 10 gradient magnitudes
                if (state.gradientHistory.length > 10) {
                    state.gradientHistory.shift();
                }

                // Check stopping conditions
                const range = funcDef.range as [number, number];
                const [minBound, maxBound] = range;

                // 1. Convergence: gradient is very small
                if (gradMag < 0.001) {
                    setIsRunning(false);
                    setStoppingReason('converged');
                    return;
                }

                // 2. Out of bounds
                if (Math.abs(x) > maxBound * 2 || Math.abs(y) > maxBound * 2) {
                    setIsRunning(false);
                    setStoppingReason('bounds');
                    return;
                }

                // 3. Divergence detection: gradient is consistently increasing
                if (state.gradientHistory.length >= 5) {
                    const recent = state.gradientHistory.slice(-5);
                    const isIncreasing = recent.every((val, idx) =>
                        idx === 0 || val > recent[idx - 1] * 0.95
                    );

                    if (isIncreasing && gradMag > recent[0] * 1.5) {
                        setIsRunning(false);
                        setStoppingReason('diverged');
                        return;
                    }
                }

                // Optimizer Step
                let stepX = 0;
                let stepY = 0;
                const { momentum, beta2, epsilon } = optimizerParams;
                const optimizerState = stateRef.current;
                optimizerState.t += 1;

                switch (optimizer) {
                    case 'SGD':
                        stepX = learningRate * grad[0];
                        stepY = learningRate * grad[1];
                        break;

                    case 'Momentum':
                        // v = momentum * v + lr * grad
                        optimizerState.velocity[0] = momentum * optimizerState.velocity[0] + learningRate * grad[0];
                        optimizerState.velocity[1] = momentum * optimizerState.velocity[1] + learningRate * grad[1];
                        stepX = optimizerState.velocity[0];
                        stepY = optimizerState.velocity[1];
                        break;

                    case 'RMSProp':
                        // E[g^2] = beta2 * E[g^2] + (1-beta2) * g^2
                        // Note: usually RMSProp uses a specific decay rate (alpha), here mapping to beta2 for simplicity or should add alpha?
                        // Let's use beta2 as the decay rate (typically 0.9 or 0.99)
                        optimizerState.squaredGrad[0] = beta2 * optimizerState.squaredGrad[0] + (1 - beta2) * grad[0] * grad[0];
                        optimizerState.squaredGrad[1] = beta2 * optimizerState.squaredGrad[1] + (1 - beta2) * grad[1] * grad[1];

                        stepX = (learningRate / Math.sqrt(optimizerState.squaredGrad[0] + epsilon)) * grad[0];
                        stepY = (learningRate / Math.sqrt(optimizerState.squaredGrad[1] + epsilon)) * grad[1];
                        break;

                    case 'Adam':
                        // m = beta1 * m + (1-beta1) * g  (using momentum param as beta1)
                        // v = beta2 * v + (1-beta2) * g^2
                        optimizerState.m[0] = momentum * optimizerState.m[0] + (1 - momentum) * grad[0];
                        optimizerState.m[1] = momentum * optimizerState.m[1] + (1 - momentum) * grad[1];

                        optimizerState.v[0] = beta2 * optimizerState.v[0] + (1 - beta2) * grad[0] * grad[0];
                        optimizerState.v[1] = beta2 * optimizerState.v[1] + (1 - beta2) * grad[1] * grad[1];

                        // Bias correction
                        const mHatX = optimizerState.m[0] / (1 - Math.pow(momentum, optimizerState.t));
                        const mHatY = optimizerState.m[1] / (1 - Math.pow(momentum, optimizerState.t));

                        const vHatX = optimizerState.v[0] / (1 - Math.pow(beta2, optimizerState.t));
                        const vHatY = optimizerState.v[1] / (1 - Math.pow(beta2, optimizerState.t));

                        stepX = (learningRate * mHatX) / (Math.sqrt(vHatX) + epsilon);
                        stepY = (learningRate * mHatY) / (Math.sqrt(vHatY) + epsilon);
                        break;
                }

                // Update position
                const newX = x - stepX;
                const newY = y - stepY;
                const newZ = funcDef.f(newX, newY);

                const newPoint: [number, number, number] = [newX, newY, newZ];

                setCurrentPoint(newPoint);
                addTrajectoryPoint(newPoint);

            }, iterationSpeed);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [
        isRunning,
        isPaused,
        iterationSpeed,
        selectedFunctionId,
        learningRate,
        currentPoint,
        setCurrentPoint,
        addTrajectoryPoint,
        setIsRunning,
        setStoppingReason,
        optimizer,
        optimizerParams,
        setMetrics,
        functionVersion,
    ]);
}
