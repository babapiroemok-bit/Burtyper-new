"use client";

import { Suspense, lazy, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float } from "@react-three/drei";

const isSSR = typeof window === "undefined";

function makeCoinTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const cx = size / 2;

  const base = ctx.createRadialGradient(cx, cx * 0.82, cx * 0.15, cx, cx, cx);
  base.addColorStop(0, "#f7d87a");
  base.addColorStop(0.55, "#e6b84c");
  base.addColorStop(1, "#b57a1c");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  ctx.beginPath();
  ctx.arc(cx, cx, cx * 0.9, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(64,35,7,0.6)";
  ctx.lineWidth = 9;
  ctx.stroke();

  ctx.beginPath();
  ctx.setLineDash([15, 13]);
  ctx.arc(cx, cx, cx * 0.72, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(64,35,7,0.45)";
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.setLineDash([]);

  const inner = ctx.createRadialGradient(cx, cx * 0.8, cx * 0.1, cx, cx, cx * 0.6);
  inner.addColorStop(0, "#d09a3c");
  inner.addColorStop(1, "#8a5a14");
  ctx.beginPath();
  ctx.arc(cx, cx, cx * 0.6, 0, Math.PI * 2);
  ctx.fillStyle = inner;
  ctx.fill();

  ctx.font = `900 ${size * 0.5}px Sora, Manrope, "Segoe UI", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 18;
  ctx.fillStyle = "#3a1f05";
  ctx.fillText("R", cx, cx * 1.04);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function Coin() {
  const texture = useMemo(() => makeCoinTexture(), []);
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.16, 96]} />
        <meshStandardMaterial color="#d4a437" metalness={0.85} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.081]}>
        <circleGeometry args={[0.99, 96]} />
        <meshStandardMaterial map={texture} metalness={0.35} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0, -0.081]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[0.99, 96]} />
        <meshStandardMaterial map={texture} metalness={0.35} roughness={0.28} />
      </mesh>
    </group>
  );
}

function Rig({ children }: { children: ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const reduced = useMemo(
    () => !isSSR && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;
    if (!reduced) g.rotation.y += delta * 0.35;
    const t = 1 - Math.pow(0.001, delta);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, state.pointer.y * 0.3 - 0.12, t);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, -state.pointer.x * 0.22, t);
  });

  return <group ref={groupRef}>{children}</group>;
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 5, 6]} intensity={2.2} color="#fff4d6" />
      <directionalLight position={[-4, -2, -3]} intensity={0.7} color="#7c5cff" />
      <pointLight position={[0, -3, 2]} intensity={0.6} color="#ffd9a0" />
      <Suspense fallback={null}>
        <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.9}>
          <Rig>
            <Coin />
          </Rig>
        </Float>
        <ContactShadows position={[0, -1.9, 0]} opacity={0.45} scale={7} blur={2.6} far={3.2} />
      </Suspense>
    </>
  );
}

export default function Coin3D() {
  if (isSSR) return null;
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.2, 4.4], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      className="h-full w-full"
    >
      <Scene />
    </Canvas>
  );
}
