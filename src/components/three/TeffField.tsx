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

const UP = new THREE.Vector3(0, 1, 0);

/**
 * Teff variety palettes (stems, grains):
 *   1. ripe golden field   2. "key" red-brown variety   3. "nech" pale ivory
 */
const PALETTES = [
  {
    stems: ["#96a34e", "#adab58", "#87984a"].map((c) => new THREE.Color(c)),
    grains: ["#d9a441", "#c8892f", "#e3b45c", "#b97f2e"].map((c) => new THREE.Color(c)),
  },
  {
    stems: ["#a39750", "#8c9046", "#9c9148"].map((c) => new THREE.Color(c)),
    grains: ["#b06b2f", "#a3542a", "#c07a35", "#8f4b30"].map((c) => new THREE.Color(c)),
  },
  {
    stems: ["#adb26e", "#99a45f", "#b6ba78"].map((c) => new THREE.Color(c)),
    grains: ["#ecd9a8", "#ddc488", "#f2e4ba"].map((c) => new THREE.Color(c)),
  },
];

/** One ellipsoid teff seed, elongated along Y then rotated to `dir`. */
function makeSeed(size: number, dir: THREE.Vector3, color: THREE.Color, rng: () => number) {
  const geo = new THREE.SphereGeometry(size, 4, 3);
  geo.scale(1, 1.75, 1); // seed shape, not a ball
  geo.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(UP, dir));
  paint(geo, color, 0.08, rng);
  return geo;
}

/** Builds one teff plant: nodding stems carrying open, feathery panicles. Base at y=0. */
function buildTeffPlant(rng: () => number): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const pal = PALETTES[Math.floor(rng() * PALETTES.length)];
  const stemCount = 6 + Math.floor(rng() * 4); // 6–9 stems

  for (let s = 0; s < stemCount; s++) {
    const angle = (s / stemCount) * Math.PI * 2 + rng() * 0.9;
    const leanX = Math.cos(angle);
    const leanZ = Math.sin(angle);
    const h = 1.05 + rng() * 0.65;

    // Stem rises, arcs over, and nods — mature teff panicles droop.
    const p0 = new THREE.Vector3(0, 0, 0);
    const p1 = new THREE.Vector3(leanX * 0.16, h * 0.62, leanZ * 0.16);
    const p2 = new THREE.Vector3(leanX * 0.42, h * 0.94, leanZ * 0.42);
    const p3 = new THREE.Vector3(leanX * 0.66, h - (0.16 + rng() * 0.2), leanZ * 0.66);
    const curve = new THREE.CatmullRomCurve3([p0, p1, p2, p3]);

    const stem = new THREE.TubeGeometry(curve, 12, 0.0045 + rng() * 0.003, 3, false);
    paint(stem, pal.stems[Math.floor(rng() * pal.stems.length)], 0.05, rng);
    parts.push(stem);

    // Open panicle: fine branchlets fanning out from the upper third…
    const branches = 4 + Math.floor(rng() * 3);
    for (let b = 0; b < branches; b++) {
      const t = Math.min(0.68 + (b / branches) * 0.28 + rng() * 0.02, 1);
      const base = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t).normalize();

      // Horizontal outward direction, spun around the stem tangent.
      let side = new THREE.Vector3().crossVectors(tangent, UP);
      if (side.lengthSq() < 1e-5) side.set(rng() - 0.5, 0, rng() - 0.5);
      side.normalize().applyAxisAngle(tangent, (rng() - 0.5) * 2.4);

      const len = 0.15 + rng() * 0.13;
      const rise = len * (0.3 + rng() * 0.22);
      const bp1 = base.clone().addScaledVector(side, len * 0.45).addScaledVector(UP, rise);
      const bp2 = base
        .clone()
        .addScaledVector(side, len)
        .addScaledVector(UP, rise - len * (0.34 + rng() * 0.26)); // tip droops
      const branch = new THREE.CatmullRomCurve3([base.clone(), bp1, bp2]);

      const twig = new THREE.TubeGeometry(branch, 6, 0.0022 + rng() * 0.0014, 3, false);
      paint(twig, pal.stems[Math.floor(rng() * pal.stems.length)], 0.05, rng);
      parts.push(twig);

      // …with rows of tiny elongated seeds alternating along each branchlet.
      const grains = 5 + Math.floor(rng() * 3);
      const btan = branch.getTangentAt(0).normalize();
      let gSide = new THREE.Vector3().crossVectors(btan, UP);
      if (gSide.lengthSq() < 1e-5) gSide.set(1, 0, 0);
      gSide.normalize();

      for (let g = 0; g < grains; g++) {
        const gt = Math.min(0.2 + (g / Math.max(grains - 1, 1)) * 0.75 + rng() * 0.04, 1);
        const pos = branch.getPointAt(gt);
        const dir = branch.getTangentAt(gt).normalize();
        const size = 0.011 + rng() * 0.007;

        const seed = makeSeed(size, dir, pal.grains[Math.floor(rng() * pal.grains.length)], rng);
        const flip = g % 2 === 0 ? 1 : -1;
        seed.translate(
          pos.x + gSide.x * size * 1.2 * flip,
          pos.y + size * 0.4,
          pos.z + gSide.z * size * 1.2 * flip,
        );
        parts.push(seed);
      }
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
      dummy.rotation.set(wave * 0.03 * gust, p.rotY, wave * 0.085 * gust);
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
        size={0.042}
        color="#ecc984"
        transparent
        opacity={0.42}
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
    camera.position.y += (1.15 - pointer.current.y * 0.26 - camera.position.y) * k;
    camera.lookAt(0, 0.85, -1.4);
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

  const plantCount = isSmall ? 100 : 240;
  const moteCount = isSmall ? 90 : 170;

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 41, position: [0, 1.15, 4.7], near: 0.1, far: 60 }}
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
