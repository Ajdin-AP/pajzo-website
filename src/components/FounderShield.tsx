import { useEffect, useRef, useState } from 'react';
import type * as THREE from 'three';
import { webglAvailable } from '../webgl';

const SHIELD =
  'M238.4968,10H10v74.9127h50.4731v145.2735l49.3451-49.3451,29.8067,29.8067-79.1518,79.1518v76.6148l49.3451-49.3451,29.8067,29.8068-79.1518,79.1518v85.6663l128.5717-128.5717v-121.6868h49.452c71.5849,0,129.616-56.2858,129.616-125.7178S310.0818,10,238.4968,10Z';

// The Pajzo shield, extruded and slowly turning — the one always-on 3D moment.
// Lazy-loads three.js when the founder card approaches the viewport; renders a
// single static frame under reduced-motion; pauses entirely when offscreen.
// If WebGL is unavailable, fails, or the connection is metered, it falls back
// to the flat SVG mark — the card never shows an empty hole.
const SIZE = 150;

const FounderShield = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const conn = (navigator as { connection?: { saveData?: boolean } }).connection;
    if (!('IntersectionObserver' in window) || conn?.saveData) {
      setFallback(true);
      return;
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let disposed = false;
    let started = false;
    let raf = 0;
    let render: (() => void) | null = null;
    let onscreen = false;
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let teardownFn: ((r: THREE.WebGLRenderer | null, s: THREE.Scene | null) => void) | null = null;

    const loop = () => {
      raf = 0;
      if (disposed || !render || !onscreen) return;
      render();
      raf = requestAnimationFrame(loop);
    };

    const boot = async () => {
      if (started) return;
      started = true;
      // No WebGL → never download the chunk; use the flat mark instead.
      if (!webglAvailable()) {
        if (!disposed) setFallback(true);
        return;
      }
      try {
        const mod = await import('../three/pajzo3d');
        teardownFn = mod.teardown;
        const T = await mod.loadThree();
        const shield = await mod.buildBrand(T);
        if (disposed) return;
        const created = mod.createRenderer(T, canvas, SIZE, SIZE * 1.15);
        renderer = created.renderer;
        scene = created.scene;
        const camera = created.camera;
        camera.position.z = 3.4;
        shield.rotation.y = -0.5;
        scene.add(shield);
        render = () => {
          if (!renderer || !scene) return;
          if (!reduce) {
            shield.rotation.y += 0.008;
            shield.rotation.x = Math.sin(performance.now() * 0.0005) * 0.1;
          }
          renderer.render(scene, camera);
        };
        render(); // always paint a first frame immediately
        if (!reduce && onscreen) {
          raf = requestAnimationFrame(loop);
        }
      } catch {
        if (!disposed) setFallback(true);
      }
    };

    const onContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
      raf = 0;
      render = null;
      if (!disposed) setFallback(true);
    };
    canvas.addEventListener('webglcontextlost', onContextLost);

    const io = new IntersectionObserver(
      ([entry]) => {
        onscreen = entry.isIntersecting;
        if (onscreen) {
          void boot();
          if (render && !reduce && !raf) raf = requestAnimationFrame(loop);
        } else {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: '200px 0px' }
    );
    io.observe(canvas);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      io.disconnect();
      // Release GPU resources and the context itself on unmount.
      if (teardownFn) teardownFn(renderer, scene);
    };
  }, []);

  if (fallback) {
    return (
      <svg
        className="founder__shield"
        viewBox="-10 -10 460 540"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d={SHIELD} />
      </svg>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="founder__shield"
      width={SIZE}
      height={SIZE * 1.15}
      aria-hidden="true"
    />
  );
};

export default FounderShield;
