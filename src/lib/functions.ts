import { create, all } from 'mathjs';

const math = create(all);

export type FunctionDef = {
    id: string;
    name: string;
    f: (x: number, y: number) => number;
    grad?: (x: number, y: number) => [number, number]; // Analytic gradient
    range: [number, number]; // [min, max] for both x and y (assuming square domain for simplicity)
};

export const functions: Record<string, FunctionDef> = {
    quadratic: {
        id: 'quadratic',
        name: 'Quadratic Bowl',
        f: (x, y) => x * x + y * y,
        grad: (x, y) => [2 * x, 2 * y],
        range: [-2, 2],
    },
    rosenbrock: {
        id: 'rosenbrock',
        name: 'Rosenbrock',
        f: (x, y) => Math.pow(1 - x, 2) + 100 * Math.pow(y - x * x, 2),
        grad: (x, y) => [
            -2 * (1 - x) - 400 * x * (y - x * x),
            200 * (y - x * x),
        ],
        range: [-2, 2], // Usually viewed around (1,1) but this range covers it
    },
    saddle: {
        id: 'saddle',
        name: 'Saddle Point',
        f: (x, y) => x * x - y * y,
        grad: (x, y) => [2 * x, -2 * y],
        range: [-2, 2],
    },
    sinusoidal: {
        id: 'sinusoidal',
        name: 'Sinusoidal',
        f: (x, y) => Math.sin(x) * Math.cos(y),
        grad: (x, y) => [
            Math.cos(x) * Math.cos(y),
            -Math.sin(x) * Math.sin(y),
        ],
        range: [-Math.PI, Math.PI],
    },
    himmelblau: {
        id: 'himmelblau',
        name: 'Himmelblau',
        f: (x, y) => Math.pow(x * x + y - 11, 2) + Math.pow(x + y * y - 7, 2),
        grad: (x, y) => [
            4 * x * (x * x + y - 11) + 2 * (x + y * y - 7),
            2 * (x * x + y - 11) + 4 * y * (x + y * y - 7),
        ],
        range: [-5, 5],
    },
    beale: {
        id: 'beale',
        name: 'Beale',
        f: (x, y) => {
            const t1 = 1.5 - x + x * y;
            const t2 = 2.25 - x + x * y * y;
            const t3 = 2.625 - x + x * y * y * y;
            return t1 * t1 + t2 * t2 + t3 * t3;
        },
        grad: (x, y) => {
            const t1 = 1.5 - x + x * y;
            const t2 = 2.25 - x + x * y * y;
            const t3 = 2.625 - x + x * y * y * y;
            return [
                2 * t1 * (y - 1) + 2 * t2 * (y * y - 1) + 2 * t3 * (y * y * y - 1),
                2 * t1 * x + 2 * t2 * 2 * x * y + 2 * t3 * 3 * x * y * y,
            ];
        },
        range: [-4.5, 4.5],
    },
    ackley: {
        id: 'ackley',
        name: 'Ackley',
        f: (x, y) => {
            const a = 20;
            const b = 0.2;
            const c = 2 * Math.PI;
            return (
                -a * Math.exp(-b * Math.sqrt(0.5 * (x * x + y * y))) -
                Math.exp(0.5 * (Math.cos(c * x) + Math.cos(c * y))) +
                a + Math.E
            );
        },
        grad: (x, y) => {
            const a = 20;
            const b = 0.2;
            const c = 2 * Math.PI;
            const r = Math.sqrt(0.5 * (x * x + y * y));
            const expTerm = Math.exp(-b * r);
            const cosTerm = Math.exp(0.5 * (Math.cos(c * x) + Math.cos(c * y)));

            const dfdx = a * b * expTerm * (0.5 * 2 * x) / (2 * r) +
                cosTerm * 0.5 * (-Math.sin(c * x)) * c;
            const dfdy = a * b * expTerm * (0.5 * 2 * y) / (2 * r) +
                cosTerm * 0.5 * (-Math.sin(c * y)) * c;

            return [dfdx, dfdy];
        },
        range: [-5, 5],
    },
    custom: {
        id: 'custom',
        name: 'Custom Function',
        f: (x, y) => 0, // Placeholder
        range: [-2, 2],
    },
};

export function createCustomFunction(expression: string): FunctionDef {
    try {
        const node = math.parse(expression);
        const compiled = node.compile();

        // Symbolic differentiation
        const gradXNode = math.derivative(node, 'x');
        const gradYNode = math.derivative(node, 'y');
        const compiledGradX = gradXNode.compile();
        const compiledGradY = gradYNode.compile();

        return {
            id: 'custom',
            name: 'Custom Function',
            f: (x, y) => {
                try {
                    return compiled.evaluate({ x, y });
                } catch (e) {
                    return 0;
                }
            },
            grad: (x, y) => {
                try {
                    return [
                        compiledGradX.evaluate({ x, y }),
                        compiledGradY.evaluate({ x, y }),
                    ];
                } catch (e) {
                    return [0, 0];
                }
            },
            range: [-2, 2],
        };
    } catch (e) {
        // console.error("Failed to parse custom function", e);
        return functions.custom;
    }
}
