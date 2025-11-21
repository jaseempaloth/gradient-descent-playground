import React from 'react';
import { Grid } from '@react-three/drei';

export function Axes() {
    return (
        <group>
            {/* Grid on the XZ plane (which corresponds to XY in math if we map Z->Y) */}
            {/* But we decided: Math X -> Three X, Math Y -> Three Z, Math Z -> Three Y */}
            {/* So the "ground" is the XZ plane in Three.js */}
            <Grid
                position={[0, -2, 0]} // Lower it a bit so the function sits above or around it
                args={[10, 10]} // Size
                cellSize={1}
                cellThickness={0.5}
                cellColor="#6f6f6f"
                sectionSize={5}
                sectionThickness={1}
                sectionColor="#9d4b4b"
                fadeDistance={30}
                infiniteGrid
            />
            <axesHelper args={[5]} />
        </group>
    );
}
