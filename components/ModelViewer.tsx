
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Stage, Center } from '@react-three/drei';

interface ModelProps {
  url: string;
}

const Model: React.FC<ModelProps> = ({ url }) => {
  const { scene } = useGLTF(url);
  // Add @ts-ignore to fix: Property 'primitive' does not exist on type 'JSX.IntrinsicElements'.
  // This is a common issue where React Three Fiber intrinsic elements are not recognized by standard React types.
  // @ts-ignore
  return <primitive object={scene} />;
};

interface ModelViewerProps {
  url: string | null;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ url }) => {
  if (!url) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl text-gray-400 p-8 text-center">
        <span className="material-symbols-outlined text-5xl mb-4">deployed_code</span>
        <p className="font-bold text-sm">No 3D Character Uploaded</p>
        <p className="text-[10px] opacity-70 mt-1 uppercase tracking-widest">Upload a .glb or .gltf file to see your hero in 3D</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-900 rounded-3xl overflow-hidden relative shadow-inner">
      <Canvas shadows camera={{ position: [0, 0, 4], fov: 40 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6} shadows="contact">
            <Center>
              <Model url={url} />
            </Center>
          </Stage>
        </Suspense>
        <OrbitControls makeDefault autoRotate autoRotateSpeed={1} />
      </Canvas>
      <div className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-md p-3 rounded-2xl flex items-center justify-between border border-white/10">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Preview</span>
          <span className="text-[8px] text-gray-300 uppercase">3D Character Asset</span>
        </div>
        <span className="material-symbols-outlined text-white text-sm animate-pulse">view_in_ar</span>
      </div>
    </div>
  );
};

export default ModelViewer;
