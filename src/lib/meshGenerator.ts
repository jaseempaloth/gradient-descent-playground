import * as THREE from 'three';

export type MeshData = {
    positions: Float32Array;
    normals: Float32Array;
    indices: Uint32Array;
    colors?: Float32Array;
};

export function generateFunctionMesh(
    f: (x: number, y: number) => number,
    range: [number, number],
    resolution: number = 100
): MeshData {
    const [min, max] = range;
    const step = (max - min) / resolution;

    const positions = new Float32Array((resolution + 1) * (resolution + 1) * 3);
    const indices = [];

    // Generate positions
    for (let i = 0; i <= resolution; i++) {
        const y = min + i * step;
        for (let j = 0; j <= resolution; j++) {
            const x = min + j * step;
            const z = f(x, y);

            const index = (i * (resolution + 1) + j) * 3;
            positions[index] = x;
            positions[index + 1] = z; // Up axis is Y in Three.js usually, but for math surfaces Z is up. We'll map Z to Y in Three.js or rotate the mesh.
            // Let's map math(x, y, z) -> three(x, z, -y) or just three(x, y, z) and rotate camera.
            // Standard convention in R3F: Y is up.
            // So let's map: Math X -> Three X, Math Y -> Three Z, Math Z -> Three Y
            positions[index + 1] = z; // Height
            positions[index + 2] = -y; // Depth (negative to match right-hand rule if we want standard orientation)

            // Actually, let's stick to a simple mapping:
            // Math X -> Three X
            // Math Y -> Three Z
            // Math Z (Height) -> Three Y

            positions[index] = x;
            positions[index + 1] = z;
            positions[index + 2] = y;
        }
    }

    // Generate indices
    for (let i = 0; i < resolution; i++) {
        for (let j = 0; j < resolution; j++) {
            const a = i * (resolution + 1) + j;
            const b = i * (resolution + 1) + j + 1;
            const c = (i + 1) * (resolution + 1) + j;
            const d = (i + 1) * (resolution + 1) + j + 1;

            // Two triangles per square
            indices.push(a, b, d);
            indices.push(a, d, c);
        }
    }

    // Compute normals
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    const normals = geometry.attributes.normal.array as Float32Array;

    return {
        positions,
        normals,
        indices: new Uint32Array(indices),
    };
}
