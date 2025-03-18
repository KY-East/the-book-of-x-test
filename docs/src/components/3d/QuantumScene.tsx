import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import { MotionConfig } from 'framer-motion';
import * as THREE from 'three';

interface QuantumSceneProps {
  text?: string;
}

const QuantumBox = ({ text = 'Quantum Reality' }: QuantumSceneProps) => {
  const meshRef = useRef<any>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <motion.group
      initial={{ scale: 0 }}
      animate={{ scale: 1, rotateZ: 180 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      <motion.mesh
        ref={meshRef}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.8 }}
      >
        <boxGeometry args={[1, 1, 1]} />
        <motion.meshStandardMaterial 
          color="#5900ff"
          animate={{ 
            color: ["#5900ff", "#00a3ff", "#ff0055", "#5900ff"],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </motion.mesh>
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </motion.group>
  );
};

const QuantumScene: React.FC<QuantumSceneProps> = ({ text }) => {
  return (
    <div style={{ width: '100%', height: '300px' }}>
      <MotionConfig transition={{ duration: 0.5 }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <QuantumBox text={text} />
          <OrbitControls enableZoom={false} />
        </Canvas>
      </MotionConfig>
    </div>
  );
};

export default QuantumScene; 