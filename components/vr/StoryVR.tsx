import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { XR, VRButton } from '@react-three/xr';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Story } from '../../types';

interface StoryVRProps {
    story: Story;
    onExit: () => void;
}

const StoryScene: React.FC<{ story: Story }> = ({ story }) => {
    const [pageIndex, setPageIndex] = useState(0);
    const currentPage = story.pages[pageIndex];

    const next = () => setPageIndex((i) => (i + 1) % story.pages.length);
    const prev = () => setPageIndex((i) => (i - 1 + story.pages.length) % story.pages.length);

    return (
        <>
            <OrbitControls />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />

            {/* Immersive Background Sphere */}
            <mesh scale={[-1, 1, 1]}>
                <sphereGeometry args={[20, 32, 32]} />
                <meshBasicMaterial
                    map={new THREE.TextureLoader().load(currentPage.illustrationUrl || 'https://picsum.photos/1024/512')}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* Floating Text Panel */}
            <group position={[0, 1.5, -3]}>
                <mesh>
                    <planeGeometry args={[4, 2]} />
                    <meshStandardMaterial color="#000" transparent opacity={0.7} />
                </mesh>
                <Text
                    position={[0, 0, 0.1]}
                    fontSize={0.15}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={3.5}
                >
                    {currentPage.content}
                </Text>

                {/* Navigation Buttons (3D Objects) */}
                <mesh position={[-1.5, -1.2, 0]} onClick={prev}>
                    <sphereGeometry args={[0.2]} />
                    <meshStandardMaterial color="red" />
                </mesh>
                <mesh position={[1.5, -1.2, 0]} onClick={next}>
                    <sphereGeometry args={[0.2]} />
                    <meshStandardMaterial color="green" />
                </mesh>
            </group>
        </>
    );
};

const StoryVR: React.FC<StoryVRProps> = ({ story, onExit }) => {
    return (
        <div className="fixed inset-0 z-50 bg-black">
            <VRButton />
            <button
                onClick={onExit}
                className="absolute top-4 left-4 z-50 px-4 py-2 bg-white/10 text-white rounded-full backdrop-blur-md"
            >
                Exit VR
            </button>
            <Canvas>
                <XR>
                    {/* <Controllers /> */}
                    {/* <Hands /> */}
                    <StoryScene story={story} />
                </XR>
            </Canvas>
        </div>
    );
};

export default StoryVR;
