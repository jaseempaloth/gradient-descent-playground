import React, { useRef, useEffect } from 'react';
import { useAppState } from '@/state/useAppState';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { functions } from '@/lib/functions';
import { computeGradient } from '@/lib/gradient';

export function DescentPoint() {
    const { currentPoint, showGradientArrows, selectedFunctionId } = useAppState();
    const [x, y, z] = currentPoint;

    // Map coordinates: Math X -> Three X, Math Y -> Three Z, Math Z -> Three Y
    const position: [number, number, number] = [x, z, y];

    const arrowRef = useRef<THREE.ArrowHelper>(null);
    const groupRef = useRef<THREE.Group>(null);

    // Initialize arrow with proper world-space configuration
    useEffect(() => {
        if (arrowRef.current && showGradientArrows) {
            // Set a fixed arrow length in world units (not dependent on camera)
            const arrowLength = 0.8;
            const arrowColor = 0xffff00; // Yellow
            const headLength = 0.2;
            const headWidth = 0.15;

            // Initialize with default direction (will be updated in useFrame)
            const dir = new THREE.Vector3(1, 0, 0);
            const origin = new THREE.Vector3(...position);

            // Recreate the arrow to ensure clean initialization
            arrowRef.current.setLength(arrowLength, headLength, headWidth);
            arrowRef.current.setDirection(dir);
            arrowRef.current.position.copy(origin);
            arrowRef.current.setColor(arrowColor);
        }
    }, [showGradientArrows, selectedFunctionId]);

    // Update arrow position and direction every frame based on current gradient
    useFrame(() => {
        if (showGradientArrows && arrowRef.current) {
            const funcDef = functions[selectedFunctionId];
            let grad: [number, number];

            if (funcDef.grad) {
                grad = funcDef.grad(x, y);
            } else {
                grad = computeGradient(funcDef.f, x, y);
            }

            // Compute gradient descent direction (negative gradient)
            // Gradient direction in math space is (gradX, gradY)
            // Map to 3D world space: Math X -> Three X, Math Y -> Three Z
            // The arrow points in the direction of steepest descent on the XZ plane
            const gradX = -grad[0];
            const gradZ = -grad[1];

            // Create direction vector in world space (Y=0 for horizontal plane)
            const direction = new THREE.Vector3(gradX, 0, gradZ);

            // Normalize the direction (required for ArrowHelper)
            if (direction.length() > 0.0001) {
                direction.normalize();
            } else {
                // If gradient is near zero, keep previous direction or use default
                direction.set(1, 0, 0);
            }

            // Update arrow direction
            arrowRef.current.setDirection(direction);

            // Update arrow position to current point in world space
            // CRITICAL: This ensures the arrow origin is always at the exact surface point
            const worldPosition = new THREE.Vector3(x, z, y);
            arrowRef.current.position.copy(worldPosition);
        }
    });

    return (
        <group ref={groupRef}>
            {/* Red sphere at current descent point */}
            <mesh position={position} castShadow>
                <sphereGeometry args={[0.1, 32, 32]} />
                <meshStandardMaterial color="red" emissive="red" emissiveIntensity={0.5} />
            </mesh>

            {/* Gradient arrow - only render when enabled */}
            {showGradientArrows && (
                <primitive
                    ref={arrowRef}
                    object={new THREE.ArrowHelper(
                        new THREE.Vector3(1, 0, 0), // Initial direction
                        new THREE.Vector3(...position), // Initial position
                        0.8, // Length in world units
                        0xffff00, // Yellow color
                        0.2, // Head length
                        0.15 // Head width
                    )}
                />
            )}
        </group>
    );
}
