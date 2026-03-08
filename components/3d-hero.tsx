'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function RotatingShape() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.003;
      meshRef.current.rotation.y += 0.005;
      meshRef.current.position.z = Math.sin(Date.now() * 0.0005) * 2;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <icosahedronGeometry args={[2.5, 4]} />
      <meshPhongMaterial
        color="#FFD700"
        emissive="#FFD700"
        emissiveIntensity={0.6}
        wireframe={true}
        // linewidth={2}
        opacity={0.9}
        transparent={true}
      />
    </mesh>
  );
}

function FloatingShapes() {
  const shapes = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 15,
    y: (Math.random() - 0.5) * 12,
    z: (Math.random() - 0.5) * 8 - 2,
  }));

  return (
    <>
      {shapes.map((shape) => (
        <FloatingShape key={shape.id} position={[shape.x, shape.y, shape.z]} size={Math.random() * 1.2 + 0.5} />
      ))}
    </>
  );
}

interface FloatingShapeProps {
  position: [number, number, number];
  size: number;
}

function FloatingShape({ position, size }: FloatingShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const startY = position[1];
  const hue = Math.random() * 60 + 40;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002;
      meshRef.current.rotation.z += 0.003;
      meshRef.current.position.y = startY + Math.sin(Date.now() * 0.0003) * 2;
      meshRef.current.position.x = position[0] + Math.cos(Date.now() * 0.0002) * 1.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <octahedronGeometry args={[size, 2]} />
      <meshPhongMaterial
        color={`hsl(${hue}, 100%, 60%)`}
        emissive={`hsl(${hue}, 100%, 50%)`}
        emissiveIntensity={0.7}
        wireframe={true}
        opacity={0.85}
        transparent={true}
      />
    </mesh>
  );
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 2, 12], fov: 60 }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
        dpr={typeof window !== 'undefined' ? window.devicePixelRatio : 1}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} color="#ffffff" />
          <pointLight position={[15, 15, 15]} intensity={1.5} color="#FFD700" />
          <pointLight position={[-15, -15, 10]} intensity={1.2} color="#00D9FF" />
          <pointLight position={[0, 10, -5]} intensity={1} color="#A855F7" />
          <RotatingShape />
          <FloatingShapes />
        </Suspense>
      </Canvas>
    </div>
  );
}
