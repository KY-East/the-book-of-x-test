import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion-3d';

interface Scene3DProps {
  children: React.ReactNode;
  cameraPosition?: [number, number, number];
}

export const Scene3D: React.FC<Scene3DProps> = ({
  children,
  cameraPosition = [0, 0, 5]
}) => {
  return (
    <div className="w-full h-[500px]">
      <Canvas>
        <PerspectiveCamera makeDefault position={cameraPosition} />
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <motion.group
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          {children}
        </motion.group>
      </Canvas>
    </div>
  );
};

// 示例3D对象
export const QuantumCube: React.FC = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#00ff9d"
        metalness={0.8}
        roughness={0.2}
        emissive="#00ff9d"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}; 