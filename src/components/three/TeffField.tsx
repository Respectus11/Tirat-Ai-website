"use client";

/**
 * Procedural 3D teff field — the hero centerpiece.
 *
 * Every plant is generated in code (no external model files):
 *   - curved tube stems with a slight lean, like real teff stalks
 *   - grain heads = clusters of small spheres spiraling along the stem tips
 *   - all merged into ONE geometry, rendered as a single InstancedMesh
 *     so hundreds of plants stay cheap on the GPU
 *
 * Motion: per-instance wind sway (traveling gust waves), floating pollen
 * motes, and a gentle mouse-parallax camera rig. Honors prefers-reduced-motion.
 */

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/* ---------------------------------- utils --------------------------------- */

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fill a geometry's vertex color attribute with jitter around a base color. */
function paint(geo: THREE.BufferGeometry, base: THREE.Color, jitter: number, rng: () => number) {
  const count = geo.attributes.position.count;
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const j = (rng() - 0.5) * jitter;
    colors[i * 3] = THREE.MathUtils.clamp(base.r + j, 0, 1);
    colors[i * 3 + 1] = THREE.MathUtils.clamp(base.g + j, 0, 1);
    colors[i * 3 + 2] = THREE.MathUtils.clamp(base.b + j * 0.6, 0, 1);
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
}

/* ------------------------------ plant builder ----------------------------- */

const STEM_COLORS = ["#8fa04a", "#a3a84e", "#7c9142"].map((c) => new THREE.Color(c));
const GRAIN_COLORS = ["#d9a441", "#e3b45c", "#c08b32", "#ecc984"].map((c) => new THREE.Color(c));

/** Builds one teff plant: several arcing stems topped by grain clusters. Base sits at y=0. */
function buildTeffPlant(rng: () => number): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const stemCount = 5 + Math.floor(rng() * 4); // 5–8 stems

  for (let s = 0; s < stemCount; s++) {
    // Lean direction: mostly outward from center, small random tilt.
    const angle = (s / stemCount) * Math.PI * 2 + rng() * 0.8;
    const leanX = Math.cos(angle) * (0.18 + rng() * 0.35);
    const leanZ = Math.sin(angle) * (0.18 + rng() * 0.35);
    const height = 0.85 + rng() * 0.55;

    const p0 = new THREE.Vector3(0, 0, 0);
    const p1 = new THREE.Vector3(leanX * 0.4, height * 0.55, leanZ * 0.4);
    const p2 = new THREE.Vector3(
      leanX + (rng() - 0.5) * 0.12,
      height,
      leanZ + (rng() - 0.5) * 0.12,
    );
    const curve = new THREE.CatmullRomCurve3([p0, p1, p2]);

    const stem = new THREE.TubeGeometry(curve, 10, 0.008 + rng() * 0.005, 4, false);
    paint(stem, STEM_COLORS[Math.floor(rng() * STEM_COLORS.length)], 0.06, rng);
    parts.push(stem);

    // Grain head: spheres spiraling along the top ~40% of the stem,
    // widest near the middle of the head, tapering toward the tip.
    const grains = 22 + Math.floor(rng() * 10);
    for (let g = 0; g < grains; g++) {
      const t = 0.58 + 0.42 * (g / grains);
      const point = curve.getPointAt(Math.min(t, 1));
      const tangent = curve.getTangentAt(Math.min(t, 1));

      // Random offset perpendicular to the stem direction.
      const side = new THREE.Vector3(rng() * 2 - 1, rng() * 2 - 1, rng() * 2 - 1).normalize();
      side.addScaledVector(tangent, -side.dot(tangent));
      if (side.lengthSq() > 1e-6) side.normalize();

      const headProgress = (t - 0.58) / 0.42; // 0 at head start, 1 at tip
      const spread = 0.055 * Math.sin(Math.PI * Math.min(headProgress * 1.15, 1)) + 0.008;
      point.addScaledVector(side, spread * Math.sqrt(rng()));

      const size = 0.02 + rng() * 0.016 * (1 - headProgress * 0.55);
      const grain = new THREE.SphereGeometry(size, 5, 4);
      grain.translate(point.x, point.y, point.z);
      paint(grain, GRAIN_COLORS[Math.floor(rng() * GRAIN_COLORS.length)], 0.07, rng);
      parts.push(grain);
    }
  }

  const merged = mergeGeometries(parts, false);
  parts.forEach((p) => p.dispose());
  return merged ?? new THREE.BufferGeometry();
}

/* --------------------------------- field ---------------------------------- */

interface PlantTransform {
  x: number;
  z: number;
  scale: number;
  rotY: number;
  phase: number;
}

function Field({ count, reduceMotion }: { count: number; reduceMotion: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const geometry = useMemo(() => buildTeffPlant(mulberry32(20260824)), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.85,
        metalness: 0.05,
      }),
    [],
  );

  const plants = useMemo<PlantTransform[]>(() => {
    const rng = mulberry32(777);
    const arr: PlantTransform[] = [];
    const cols = Math.ceil(Math.sqrt(count * 2.2));
    const rows = Math.ceil(count / cols);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols && arr.length < count; c++) {
        arr.push({
          x: -13 + (26 * c) / (cols - 1) + (rng() - 0.5) * 0.7,
          z: -11 + (15 * r) / (rows - 1) + (rng() - 0.5) * 0.7,
          scale: 0.75 + rng() * 0.65,
          rotY: rng() * Math.PI * 2,
          phase: rng() * Math.PI * 2,
        });
      }
    }
    return arr;
  }, [count]);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    plants.forEach((p, i) => {
      dummy.position.set(p.x, 0, p.z);
      dummy.rotation.set(0, p.rotY, 0);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [plants, dummy]);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh || reduceMotion) return;
    const time = clock.getElapsedTime();
    const gust = 0.55 + 0.45 * Math.sin(time * 0.21);

    plants.forEach((p, i) => {
      // Traveling wind wave across x + per-plant phase → organic field motion.
      const wave = Math.sin(time * 1.35 + p.phase + p.x * 0.32);
      dummy.position.set(p.x, 0, p.z);
      dummy.rotation.set(wave * 0.03 * gust, p.rotY, wave * 0.075 * gust);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  useEffect(() => () => material.dispose(), [material]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, plants.length]}
      frustumCulled={false}
    />
  );
}

/* ------------------------------- ground + air ------------------------------ */

function Ground() {
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={-0.01}>
      <circleGeometry args={[34, 48]} />
      <meshStandardMaterial color="#14371f" roughness={1} />
    </mesh>
  );
}

function Pollen({ count, reduceMotion }: { count: number; reduceMotion: boolean }) {
  const pointsRef = useRef<THREE.Points>(null!);

  const { positions, speeds } = useMemo(() => {
    const rng = mulberry32(4242);
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rng() - 0.5) * 22;
      positions[i * 3 + 1] = 0.2 + rng() * 3.2;
      positions[i * 3 + 2] = -9 + rng() * 13;
      speeds[i] = 0.08 + rng() * 0.22;
    }
    return { positions, speeds };
  }, [count]);

  useFrame(({ clock }) => {
    const pts = pointsRef.current;
    if (!pts || reduceMotion) return;
    const t = clock.getElapsedTime();
    const attr = pts.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      let y = attr.getY(i) + speeds[i] * 0.004;
      if (y > 3.6) y = 0.15;
      attr.setY(i, y);
      attr.setX(i, attr.getX(i) + Math.sin(t * 0.6 + i) * 0.0012);
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions.slice(), 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ecc984"
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/* ------------------------------ camera parallax ---------------------------- */

function Rig({ reduceMotion }: { reduceMotion: boolean }) {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reduceMotion) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduceMotion]);

  useFrame(({ camera }, delta) => {
    if (reduceMotion) return;
    const k = 1 - Math.pow(0.001, delta); // frame-rate independent lerp
    camera.position.x += (pointer.current.x * 0.55 - camera.position.x) * k;
    camera.position.y += (1.35 - pointer.current.y * 0.28 - camera.position.y) * k;
    camera.lookAt(0, 0.95, -1.5);
  });

  return null;
}

/* ---------------------------------- scene ---------------------------------- */

export default function TeffField() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setIsSmall(window.innerWidth < 768);
  }, []);

  const plantCount = isSmall ? 130 : 300;
  const moteCount = isSmall ? 90 : 180;

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 42, position: [0, 1.35, 5.2], near: 0.1, far: 60 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      className="!absolute inset-0"
    >
      <color attach="background" args={["#081f11"]} />
      <fog attach="fog" args={["#081f11", 7, 21]} />

      {/* Golden-hour lighting: warm rim light through the grain heads */}
      <hemisphereLight args={["#ffd9a0", "#0a2415", 0.55]} />
      <directionalLight position={[-6, 7, -6]} intensity={2.1} color="#ffca7a" />
      <directionalLight position={[4, 3, 6]} intensity={0.35} color="#bfe6cd" />
      <ambientLight intensity={0.14} />

      <Ground />
      <Field count={plantCount} reduceMotion={reduceMotion} />
      <Pollen count={moteCount} reduceMotion={reduceMotion} />
      <Rig reduceMotion={reduceMotion} />
    </Canvas>
  );
}
