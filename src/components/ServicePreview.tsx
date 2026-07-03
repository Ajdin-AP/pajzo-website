import { useEffect, useRef } from 'react';
import type * as THREE from 'three';
import { webglAvailable } from '../webgl';

// A small WebGL panel that floats beside the cursor while it travels the
// service rows, showing a line-art 3D object per discipline. Desktop-only
// (fine pointer), lazy-loads three.js on first approach, and idles when
// nothing is hovered. Reduced-motion users never see it move — it's skipped.
const W = 340;
const H = 250;

const ServicePreview = ({ listRef }: { listRef: React.RefObject<HTMLDivElement | null> }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const canvas = canvasRef.current;
    if (!list || !canvas) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Respect metered connections — this enhancement costs a ~190 KB chunk.
    const conn = (navigator as { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;

    let disposed = false;
    let started = false;
    let dead = false;
    let raf = 0;
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let teardownFn: ((r: THREE.WebGLRenderer | null, s: THREE.Scene | null) => void) | null = null;
    const objects: Record<string, THREE.Group> = {};
    let active: THREE.Group | null = null;
    let activeId: string | null = null;
    let visible = false;

    // Cursor-follow state (lerped in the render loop). Raw pointer position is
    // stored here; the rect math happens once per frame in the loop, so a
    // 1000 Hz mouse can't force per-event layout reads.
    let px = -1;
    let py = -1;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let scale = 0;

    const boot = async () => {
      if (started) return;
      started = true;
      // No WebGL → never download the chunk.
      if (!webglAvailable()) {
        dead = true;
        canvas.style.display = 'none';
        return;
      }
      try {
        const mod = await import('../three/pajzo3d');
        const { loadThree, buildWeb, buildApp, buildBrand, buildDesign, createRenderer } = mod;
        teardownFn = mod.teardown;
        const T = await loadThree();
        if (disposed) return;
        ({ renderer, scene, camera } = createRenderer(T, canvas, W, H));
        objects.web = buildWeb(T);
        objects.app = buildApp(T);
        objects.design = buildDesign(T);
        objects.branding = await buildBrand(T);
        if (disposed) return;
        Object.values(objects).forEach((o) => {
          o.visible = false;
          scene!.add(o);
        });
        if (activeId) setActive(activeId);
        loop();
      } catch {
        // WebGL unavailable or the chunk failed to load — the preview is an
        // enhancement; the rows work fine without it.
        dead = true;
        canvas.style.display = 'none';
      }
    };

    // If the GPU context is lost mid-session, retire the panel gracefully.
    const onContextLost = (e: Event) => {
      e.preventDefault();
      dead = true;
      canvas.style.display = 'none';
      cancelAnimationFrame(raf);
      raf = 0;
    };
    canvas.addEventListener('webglcontextlost', onContextLost);

    // Warm every 3D chunk once the section approaches the viewport, so the
    // first hover doesn't pay the download. Skipped when WebGL can't render.
    let warmIO: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      warmIO = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          if (webglAvailable()) {
            void import('../three/pajzo3d').then((m) => m.warm()).catch(() => {});
          }
          warmIO?.disconnect();
          warmIO = null;
        },
        { rootMargin: '600px 0px' }
      );
      warmIO.observe(list);
    }

    const setActive = (id: string | null) => {
      activeId = id;
      canvas.dataset.active = id ?? '';
      if (!scene) return;
      const next = id ? objects[id] : null;
      if (active && active !== next) active.visible = false;
      active = next ?? null;
      if (active) active.visible = true;
    };

    const loop = () => {
      raf = 0;
      if (disposed || dead || !renderer || !scene || !camera) return;
      // One rect read per frame, not per pointer event.
      if (px >= 0) {
        const r = list.getBoundingClientRect();
        tx = Math.min(Math.max(px - r.left + 60, W / 2 - 30), r.width - W / 2);
        ty = Math.min(Math.max(py - r.top, H / 2), r.height - H / 2);
      }
      cx += (tx - cx) * 0.11;
      cy += (ty - cy) * 0.11;
      const targetScale = visible && active ? 1 : 0;
      scale += (targetScale - scale) * 0.12;
      canvas.style.transform = `translate3d(${cx - W / 2}px, ${cy - H / 2}px, 0) scale(${scale.toFixed(3)})`;
      canvas.style.opacity = String(Math.min(1, scale * 1.4));
      if (active) {
        active.rotation.y += 0.012;
        active.rotation.x = Math.sin(performance.now() * 0.0006) * 0.16;
      }
      renderer.render(scene, camera);
      // Idle out once fully hidden — no hover, no work.
      if (scale > 0.005 || visible) raf = requestAnimationFrame(loop);
    };

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      if (dead) return;
      px = e.clientX;
      py = e.clientY;
      void boot();
      wake();
    };

    const onOver = (e: PointerEvent) => {
      const row = (e.target as HTMLElement).closest<HTMLElement>('.svc__row');
      if (!row) return;
      visible = true;
      setActive(row.dataset.svc ?? null);
      wake();
    };

    const onLeave = () => {
      visible = false;
      wake();
    };

    list.addEventListener('pointermove', onMove);
    list.addEventListener('pointerover', onOver);
    list.addEventListener('pointerleave', onLeave);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      warmIO?.disconnect();
      canvas.removeEventListener('webglcontextlost', onContextLost);
      list.removeEventListener('pointermove', onMove);
      list.removeEventListener('pointerover', onOver);
      list.removeEventListener('pointerleave', onLeave);
      // Release geometries, materials and the GL context itself — otherwise
      // route round-trips stack up contexts until the browser evicts one.
      if (teardownFn) teardownFn(renderer, scene);
      else renderer?.dispose();
    };
  }, [listRef]);

  return (
    <canvas
      ref={canvasRef}
      className="svc__preview"
      width={W}
      height={H}
      aria-hidden="true"
    />
  );
};

export default ServicePreview;
