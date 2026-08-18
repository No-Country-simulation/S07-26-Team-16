'use client';

"use client"

import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import { Mesh } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function MeshComponent() {
  const fileUrl = '/model/scene.gltf';
  const mesh = useRef<Mesh | null>(null);
  const gltf = useLoader(GLTFLoader, fileUrl);

  useFrame(() => {
    if (mesh.current) {
      // Cambiado a -= 0.01 para girar en el sentido opuesto
      mesh.current.rotation.y -= 0.01;
    }
  });

  return (
    <mesh ref={mesh} rotation={[Math.PI / 2, 0, Math.PI / 1]}>
      <primitive object={gltf.scene} />
    </mesh>
  );
}

const Model = () => {
  return (
    <div className="flex justify-center h-full w-full">
      <Canvas 
        className="h-full w-full" 
        camera={{ position: [0, 4, 0], fov: 35 }}
      >
        <Suspense fallback={null}>
          <OrbitControls 
            enabled={false}         /* Desactiva todos los eventos de control del ratón */
            enableZoom={false}      /* Desactiva el zoom */
            enableRotate={false}    /* Desactiva la rotación manual con clic */
            enablePan={false}       /* Desactiva el arrastre/desplazamiento con clic derecho */
            autoRotate={true}       /* Mantiene la rotación automática en segundo plano */
            autoRotateSpeed={2.0}  /* Valor negativo para invertirte también la órbita de la cámara */
          />
          <ambientLight intensity={0.8} />
          <pointLight position={[7, 7, 7]} />
          <MeshComponent />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Model;