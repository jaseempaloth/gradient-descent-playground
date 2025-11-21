'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Lights } from './Lights';
import { Axes } from './Axes';
import { FunctionSurface } from './FunctionSurface';
import { DescentPoint } from './DescentPoint';
import { GradientPath } from './GradientPath';
import { useGradientDescent } from '@/hooks/useGradientDescent';

export function Canvas3D() {
    // Initialize the hook here so it runs when the component mounts
    useGradientDescent();

    return (
        <div className="h-full w-full bg-black">
            <Canvas shadows>
                <PerspectiveCamera makeDefault position={[5, 5, 5]} />
                <OrbitControls makeDefault />

                <Lights />
                <Axes />

                <FunctionSurface />
                <DescentPoint />
                <GradientPath />
            </Canvas>
        </div>
    );
}
