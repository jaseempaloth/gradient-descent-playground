import React, { useMemo } from 'react';
import { useAppState } from '@/state/useAppState';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

export function GradientPath() {
    const { trajectory, showTrajectory } = useAppState();

    const { points, colors } = useMemo(() => {
        if (!showTrajectory || trajectory.length < 2) return { points: [], colors: [] };

        const pts: THREE.Vector3[] = [];
        const clrs: [number, number, number][] = [];
        const maxSpeed = 0.5; // Assumed max speed for normalization

        for (let i = 0; i < trajectory.length; i++) {
            const [x, y, z] = trajectory[i];
            pts.push(new THREE.Vector3(x, z, y));

            if (i > 0) {
                const prev = trajectory[i - 1];
                const dist = Math.sqrt(
                    Math.pow(x - prev[0], 2) +
                    Math.pow(y - prev[1], 2) +
                    Math.pow(z - prev[2], 2)
                );

                // Map speed to color: Blue (slow) -> Red (fast)
                const t = Math.min(dist / maxSpeed, 1);
                const color = new THREE.Color().lerpColors(
                    new THREE.Color('blue'),
                    new THREE.Color('red'),
                    t
                );
                clrs.push([color.r, color.g, color.b]);
            } else {
                clrs.push([0, 0, 1]); // Start with blue
            }
        }

        // Line expects colors per vertex, but for segments it interpolates.
        // Let's ensure we have same number of colors as points

        return { points: pts, colors: clrs };
    }, [trajectory, showTrajectory]);

    if (!showTrajectory || points.length < 2) return null;

    return (
        <Line
            points={points}
            vertexColors={colors}
            lineWidth={3}
            dashed={false}
        />
    );
}
