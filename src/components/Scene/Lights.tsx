import React from 'react';

export function Lights() {
    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
            <pointLight position={[-5, 5, -5]} intensity={0.5} />
        </>
    );
}
