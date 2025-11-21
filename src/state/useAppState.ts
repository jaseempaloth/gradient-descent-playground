import { create } from 'zustand';
import { functions, createCustomFunction } from '@/lib/functions';

export type Optimizer = 'SGD' | 'Momentum' | 'RMSProp' | 'Adam';

export type OptimizerParams = {
    momentum: number;
    beta2: number;
    epsilon: number;
};

export type Metrics = {
    currentValue: number;
    gradientMagnitude: number;
};

export type StoppingReason = 'converged' | 'diverged' | 'bounds' | null;

export type AppState = {
    selectedFunctionId: string;
    functionVersion: number; // To force re-renders when custom function changes
    learningRate: number;
    iterationSpeed: number; // Delay in ms
    isRunning: boolean;
    isPaused: boolean;
    currentPoint: [number, number, number]; // [x, y, z]
    trajectory: [number, number, number][];
    showWireframe: boolean;
    showGradientArrows: boolean;
    showTrajectory: boolean;
    customFunctionExpression: string;

    // New State
    optimizer: Optimizer;
    optimizerParams: OptimizerParams;
    metrics: Metrics;
    stoppingReason: StoppingReason;

    // Actions
    setFunctionId: (id: string) => void;
    setLearningRate: (rate: number) => void;
    setIterationSpeed: (speed: number) => void;
    setIsRunning: (isRunning: boolean) => void;
    setIsPaused: (isPaused: boolean) => void;
    setCurrentPoint: (point: [number, number, number]) => void;
    addTrajectoryPoint: (point: [number, number, number]) => void;
    resetTrajectory: () => void;
    toggleWireframe: () => void;
    toggleGradientArrows: () => void;
    toggleTrajectory: () => void;
    setCustomFunctionExpression: (expr: string) => void;
    resetSimulation: () => void;

    // New Actions
    setOptimizer: (optimizer: Optimizer) => void;
    setOptimizerParams: (params: Partial<OptimizerParams>) => void;
    setMetrics: (metrics: Metrics) => void;
    setStoppingReason: (reason: StoppingReason) => void;
};

export const useAppState = create<AppState>((set, get) => ({
    selectedFunctionId: 'quadratic',
    functionVersion: 0,
    learningRate: 0.1,
    iterationSpeed: 100,
    isRunning: false,
    isPaused: false,
    currentPoint: [1.5, 1.5, functions['quadratic'].f(1.5, 1.5)],
    trajectory: [[1.5, 1.5, functions['quadratic'].f(1.5, 1.5)]],
    showWireframe: false,
    showGradientArrows: true,
    showTrajectory: true,
    customFunctionExpression: 'x^2 + y^2',

    optimizer: 'SGD',
    optimizerParams: {
        momentum: 0.9,
        beta2: 0.999,
        epsilon: 1e-8,
    },
    metrics: {
        currentValue: functions['quadratic'].f(1.5, 1.5),
        gradientMagnitude: 0,
    },
    stoppingReason: null,

    setFunctionId: (id) => {
        const func = functions[id];
        // Reset point to a default or random position within range
        const startX = 1.5; // Could be randomized
        const startY = 1.5;
        const startZ = func.f(startX, startY);

        set({
            selectedFunctionId: id,
            currentPoint: [startX, startY, startZ],
            trajectory: [[startX, startY, startZ]],
            isRunning: false,
            isPaused: false,
            metrics: {
                currentValue: startZ,
                gradientMagnitude: 0,
            }
        });
    },
    setLearningRate: (rate) => set({ learningRate: rate }),
    setIterationSpeed: (speed) => set({ iterationSpeed: speed }),
    setIsRunning: (isRunning) => set({ isRunning }),
    setIsPaused: (isPaused) => set({ isPaused }),
    setCurrentPoint: (point) => set({ currentPoint: point }),
    addTrajectoryPoint: (point) => set((state) => ({ trajectory: [...state.trajectory, point] })),
    resetTrajectory: () => {
        const { currentPoint } = get();
        set({ trajectory: [currentPoint] });
    },
    toggleWireframe: () => set((state) => ({ showWireframe: !state.showWireframe })),
    toggleGradientArrows: () => set((state) => ({ showGradientArrows: !state.showGradientArrows })),
    toggleTrajectory: () => set((state) => ({ showTrajectory: !state.showTrajectory })),
    setCustomFunctionExpression: (expr) => {
        // Compile new function
        const newFuncDef = createCustomFunction(expr);
        functions['custom'] = newFuncDef; // Update global registry

        set((state) => {
            // If currently selected, we need to reset simulation or at least update metrics
            if (state.selectedFunctionId === 'custom') {
                // Recalculate current Z
                const [x, y] = state.currentPoint;
                let z = newFuncDef.f(x, y);
                if (typeof z !== 'number' || isNaN(z)) {
                    z = 0;
                }
                return {
                    customFunctionExpression: expr,
                    functionVersion: state.functionVersion + 1,
                    currentPoint: [x, y, z],
                    trajectory: [[x, y, z]], // Reset trajectory on function change
                    isRunning: false,
                    metrics: {
                        currentValue: z,
                        gradientMagnitude: 0, // Will be updated on next step or we could calc here
                    }
                };
            }
            return {
                customFunctionExpression: expr,
                functionVersion: state.functionVersion + 1
            };
        });
    },
    resetSimulation: () => {
        const { selectedFunctionId } = get();
        const func = functions[selectedFunctionId];
        const startX = 1.5;
        const startY = 1.5;
        const startZ = func.f(startX, startY);

        set({
            currentPoint: [startX, startY, startZ],
            trajectory: [[startX, startY, startZ]],
            isRunning: false,
            isPaused: false,
            metrics: {
                currentValue: startZ,
                gradientMagnitude: 0,
            }
        });
    },

    setOptimizer: (optimizer) => set({ optimizer }),
    setOptimizerParams: (params) => set((state) => ({ optimizerParams: { ...state.optimizerParams, ...params } })),
    setMetrics: (metrics) => set({ metrics }),
    setStoppingReason: (reason) => set({ stoppingReason: reason }),
}));
