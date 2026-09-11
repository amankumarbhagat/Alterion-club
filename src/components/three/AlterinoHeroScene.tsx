import React, { useRef, useState, useEffect, useMemo, Component, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from './useReducedMotion';
import { ThreeSceneFallback } from './ThreeSceneFallback';

// ----------------------------------------------------------------------
// 1. WebGL Support Detection
// ----------------------------------------------------------------------
function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

// ----------------------------------------------------------------------
// 2. Error Boundary for WebGL Crashes
// ----------------------------------------------------------------------
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('[Alterino 3D] WebGL context failed, falling back to SVG map:', error.message);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// ----------------------------------------------------------------------
// 3. Central Technological Polyhedron Core
// ----------------------------------------------------------------------
interface CoreProps {
  reducedMotion: boolean;
  isMobile: boolean;
}

const InnovationCore: React.FC<CoreProps> = ({ reducedMotion, isMobile }) => {
  const outerRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (reducedMotion) return;

    if (outerRef.current) {
      outerRef.current.rotation.y += delta * 0.2;
      outerRef.current.rotation.x += delta * 0.08;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * 0.3;
      innerRef.current.rotation.z += delta * 0.15;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.12;
    }
  });

  return (
    <group>
      {/* Outer Wireframe Icosahedron */}
      <group ref={outerRef}>
        <mesh>
          <icosahedronGeometry args={[1.35, isMobile ? 0 : 1]} />
          <meshBasicMaterial
            color="#00f0ff"
            wireframe
            transparent
            opacity={0.35}
          />
        </mesh>
      </group>

      {/* Inner Solid Geometric Tech Core */}
      <mesh ref={innerRef}>
        <octahedronGeometry args={[0.75, 0]} />
        <meshStandardMaterial
          color="#050508"
          emissive="#00f0ff"
          emissiveIntensity={0.25}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Orbiting Tech Reticle Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.75, 0.012, 8, isMobile ? 24 : 48]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.4} />
      </mesh>
    </group>
  );
};

// ----------------------------------------------------------------------
// 4. Satellite Nodes with Connecting Vector Lines
// ----------------------------------------------------------------------
interface SatelliteNode {
  id: string;
  name: string;
  position: [number, number, number];
  color: string;
  targetPage: string;
  targetHash: string;
}

const NODES_DATA: SatelliteNode[] = [
  {
    id: 'app-dev',
    name: 'APP DEV',
    position: [0, 2.0, 0],
    color: '#00f0ff',
    targetPage: 'divisions',
    targetHash: '#/divisions',
  },
  {
    id: 'rd',
    name: 'R&D',
    position: [2.1, 0.7, 0.3],
    color: '#3b82f6',
    targetPage: 'divisions',
    targetHash: '#/divisions',
  },
  {
    id: 'projects',
    name: 'PROJECTS',
    position: [1.5, -1.8, -0.2],
    color: '#00f0ff',
    targetPage: 'projects',
    targetHash: '#/projects',
  },
  {
    id: 'events',
    name: 'EVENTS',
    position: [-1.6, -1.7, 0.2],
    color: '#3b82f6',
    targetPage: 'events',
    targetHash: '#/events',
  },
  {
    id: 'community',
    name: 'COMMUNITY',
    position: [-2.1, 0.8, -0.3],
    color: '#00f0ff',
    targetPage: 'about',
    targetHash: '#/about',
  },
];

interface SatellitesProps {
  reducedMotion: boolean;
  onNavigate?: (page: string, hash: string) => void;
}

const SatelliteNodesGroup: React.FC<SatellitesProps> = ({ reducedMotion, onNavigate }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  // Construct lines connecting each node to the origin (0, 0, 0)
  const lineGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const origin = new THREE.Vector3(0, 0, 0);

    NODES_DATA.forEach((node) => {
      points.push(origin);
      points.push(new THREE.Vector3(...node.position));
    });

    const geom = new THREE.BufferGeometry().setFromPoints(points);
    return geom;
  }, []);

  const handleNodeClick = (page: string, hash: string) => {
    if (onNavigate) {
      onNavigate(page, hash);
    } else {
      window.location.hash = hash;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <group ref={groupRef}>
      {/* Connecting Vector Lines from Core to Satellite Nodes */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#00f0ff" transparent opacity={0.25} />
      </lineSegments>

      {/* Orbiting Nodes & Interactive HTML Badges */}
      {NODES_DATA.map((node) => (
        <group key={node.id} position={node.position}>
          {/* Node Sphere */}
          <mesh>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshBasicMaterial color={node.color} />
          </mesh>

          {/* Halo Glow */}
          <mesh>
            <sphereGeometry args={[0.18, 8, 8]} />
            <meshBasicMaterial color={node.color} transparent opacity={0.2} />
          </mesh>

          {/* HTML Overlay Pin for Navigation */}
          <Html distanceFactor={8} center position={[0, -0.32, 0]}>
            <button
              type="button"
              onClick={() => handleNodeClick(node.targetPage, node.targetHash)}
              aria-label={`Navigate to ${node.name}`}
              className="px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-widest uppercase transition-all duration-300 backdrop-blur-md cursor-pointer border whitespace-nowrap bg-[#050508]/85 text-white border-white/10 hover:border-[#00f0ff] hover:text-[#00f0ff] hover:shadow-[0_0_12px_rgba(0,240,255,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff]"
            >
              {node.name}
            </button>
          </Html>
        </group>
      ))}
    </group>
  );
};

// ----------------------------------------------------------------------
// 5. Ambient Floating Depth Particles
// ----------------------------------------------------------------------
interface ParticlesProps {
  isMobile: boolean;
  reducedMotion: boolean;
}

const AmbientParticles: React.FC<ParticlesProps> = ({ isMobile, reducedMotion }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = isMobile ? 35 : 75;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const cyan = new THREE.Color('#00f0ff');
    const blue = new THREE.Color('#3b82f6');
    const indigo = new THREE.Color('#818cf8');

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8.5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;

      const pick = i % 3 === 0 ? cyan : i % 3 === 1 ? blue : indigo;
      col[i * 3] = pick.r;
      col[i * 3 + 1] = pick.g;
      col[i * 3 + 2] = pick.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((_, delta) => {
    if (reducedMotion || !pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.03;
    pointsRef.current.rotation.x += delta * 0.015;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isMobile ? 0.04 : 0.055}
        vertexColors
        transparent
        opacity={0.65}
        sizeAttenuation
      />
    </points>
  );
};

// ----------------------------------------------------------------------
// 6. Interactive Parallax Rig
// ----------------------------------------------------------------------
interface SceneRigProps {
  reducedMotion: boolean;
  children: ReactNode;
}

const SceneRig: React.FC<SceneRigProps> = ({ reducedMotion, children }) => {
  const rigRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (reducedMotion || !rigRef.current) return;
    // Gentle mouse-follow parallax with smooth lerp
    const targetX = (state.pointer.x * 0.35);
    const targetY = (state.pointer.y * 0.25);
    rigRef.current.rotation.y = THREE.MathUtils.damp(rigRef.current.rotation.y, targetX, 2.5, delta);
    rigRef.current.rotation.x = THREE.MathUtils.damp(rigRef.current.rotation.x, -targetY, 2.5, delta);
  });

  return <group ref={rigRef}>{children}</group>;
};

// ----------------------------------------------------------------------
// 7. Main AlterinoHeroScene Component
// ----------------------------------------------------------------------
interface AlterinoHeroSceneProps {
  onNavigate?: (page: string, hash: string) => void;
}

export const AlterinoHeroScene: React.FC<AlterinoHeroSceneProps> = ({ onNavigate }) => {
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setHasWebGL(isWebGLAvailable());

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Safe Fallback if WebGL is unavailable
  if (!hasWebGL) {
    return <ThreeSceneFallback onNavigate={onNavigate} />;
  }

  return (
    <WebGLErrorBoundary fallback={<ThreeSceneFallback onNavigate={onNavigate} />}>
      <div
        role="region"
        aria-label="Interactive 3D Innovation Visual"
        className="relative w-full h-[340px] sm:h-[380px] md:h-[440px] flex items-center justify-center select-none overflow-visible"
      >
        {/* Ambient atmospheric backdrop glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
          <div className="w-64 h-64 rounded-full bg-[#00f0ff]/10 blur-3xl animate-pulse" />
          <div className="w-56 h-56 rounded-full bg-[#3b82f6]/10 blur-2xl" />
        </div>

        {/* 3D WebGL Canvas */}
        <Canvas
          aria-hidden="true"
          camera={{ position: [0, 0, 6.2], fov: 42 }}
          dpr={isMobile ? 1 : [1, 1.5]}
          gl={{
            alpha: true,
            antialias: !isMobile,
            powerPreference: 'high-performance',
          }}
          className="w-full h-full"
        >
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} color="#ffffff" />
          <pointLight position={[-4, -4, -2]} intensity={0.8} color="#00f0ff" />
          <pointLight position={[4, -2, 2]} intensity={0.6} color="#3b82f6" />

          {/* Float wrapper adds a subtle autonomous breathing motion */}
          <Float
            speed={prefersReducedMotion ? 0 : 1.2}
            rotationIntensity={prefersReducedMotion ? 0 : 0.25}
            floatIntensity={prefersReducedMotion ? 0 : 0.3}
          >
            <SceneRig reducedMotion={prefersReducedMotion}>
              <InnovationCore
                reducedMotion={prefersReducedMotion}
                isMobile={isMobile}
              />
              <SatelliteNodesGroup
                reducedMotion={prefersReducedMotion}
                onNavigate={onNavigate}
              />
            </SceneRig>
          </Float>

          {/* Depth Starfield Dust */}
          <AmbientParticles
            isMobile={isMobile}
            reducedMotion={prefersReducedMotion}
          />
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
};

export default AlterinoHeroScene;
