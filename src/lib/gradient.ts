export function computeGradient(
    f: (x: number, y: number) => number,
    x: number,
    y: number,
    h: number = 1e-5
): [number, number] {
    const dfdx = (f(x + h, y) - f(x - h, y)) / (2 * h);
    const dfdy = (f(x, y + h) - f(x, y - h)) / (2 * h);
    return [dfdx, dfdy];
}
