import React, { useMemo } from 'react';
import { useAppState } from '@/state/useAppState';
import { functions } from '@/lib/functions';
import { generateFunctionMesh } from '@/lib/meshGenerator';
import * as THREE from 'three';

export function FunctionSurface() {
    const { selectedFunctionId, showWireframe, setCurrentPoint, resetTrajectory, setIsRunning, functionVersion } = useAppState();

    const meshData = useMemo(() => {
        const funcDef = functions[selectedFunctionId];
        return generateFunctionMesh(funcDef.f, funcDef.range, 100);
    }, [selectedFunctionId, functionVersion]);

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(meshData.positions, 3));
        geo.setAttribute('normal', new THREE.BufferAttribute(meshData.normals, 3));
        geo.setIndex(new THREE.BufferAttribute(meshData.indices, 1));
        return geo;
    }, [meshData]);

    const handleClick = (event: any) => {
        event.stopPropagation();
        const point = event.point; // Vector3
        // In our scene, x=x, z=y, y=z (up)
        // But our mesh generation maps x->x, y->z, z->y
        // So point.x is x, point.z is y.

        const x = point.x;
        const y = point.z;
        const funcDef = functions[selectedFunctionId];
        const z = funcDef.f(x, y);

        setCurrentPoint([x, y, z]);
        resetTrajectory();
        setIsRunning(false); // Pause when manually setting point
    };

    return (
        <group>
            <mesh
                geometry={geometry}
                castShadow
                receiveShadow
                onClick={handleClick}
                onPointerMissed={(e) => e.type === 'click' && console.log('Missed')}
            >
                <meshStandardMaterial
                    color="#4f46e5"
                    side={THREE.DoubleSide}
                    roughness={0.3}
                    metalness={0.1}
                    wireframe={showWireframe}
                />
            </mesh>
            {/* Optional: Add a wireframe overlay if not in wireframe mode for better visibility of structure */}
            {!showWireframe && (
                <mesh geometry={geometry} onClick={handleClick}>
                    <meshBasicMaterial
                        color="#000000"
                        wireframe
                        transparent
                        opacity={0.1}
                    />
                </mesh>
            )}
        </group>
    );
}
