// Lazy-loaded three.js helpers for the studio's 3D moments.
// Everything is unlit line-art — dark fills, bone wireframes, one orange —
// so the objects read as extensions of the keyline brand, not "3D for 3D's sake".
import type * as THREE from 'three';

export const ORANGE = 0xe8621a;
export const BONE = 0xece7dc;
export const DARK = 0x211c18;

// The Pajzo shield, same path as the wordmark.
const SHIELD_PATH =
  'M238.4968,10H10v74.9127h50.4731v145.2735l49.3451-49.3451,29.8067,29.8067-79.1518,79.1518v76.6148l49.3451-49.3451,29.8067,29.8068-79.1518,79.1518v85.6663l128.5717-128.5717v-121.6868h49.452c71.5849,0,129.616-56.2858,129.616-125.7178S310.0818,10,238.4968,10Z';

type ThreeMod = typeof import('three');

let threePromise: Promise<ThreeMod> | null = null;
export function loadThree(): Promise<ThreeMod> {
  if (!threePromise) threePromise = import('three');
  return threePromise;
}

// Fetch every chunk the 3D layer needs, without booting anything — called
// when a 3D section approaches the viewport so first interaction is instant.
export function warm(): void {
  void loadThree().catch(() => {});
  void import('three/addons/loaders/SVGLoader.js').catch(() => {});
}

// Dispose a scene's GPU resources and release the GL context. Safe to call
// with nulls; used by component unmount cleanups.
export function teardown(
  renderer: THREE.WebGLRenderer | null,
  scene: THREE.Scene | null
): void {
  try {
    scene?.traverse((obj) => {
      const mesh = obj as Partial<THREE.Mesh>;
      mesh.geometry?.dispose();
      const mat = mesh.material;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
      else mat?.dispose();
    });
    renderer?.forceContextLoss();
    renderer?.dispose();
  } catch {
    // Context may already be lost — nothing to release.
  }
}

function edges(T: ThreeMod, geo: THREE.BufferGeometry, color: number, opacity = 1) {
  const line = new T.LineSegments(
    new T.EdgesGeometry(geo, 12),
    new T.LineBasicMaterial({ color, transparent: true, opacity })
  );
  return line;
}

function roundedRectShape(T: ThreeMod, w: number, h: number, r: number) {
  const s = new T.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

const dark = (T: ThreeMod) =>
  new T.MeshBasicMaterial({ color: DARK, transparent: true, opacity: 0.92 });

// A browser window: dark slab, bone edges, orange address bar, grid "content".
export function buildWeb(T: ThreeMod): THREE.Group {
  const g = new T.Group();
  const slabGeo = new T.ExtrudeGeometry(roundedRectShape(T, 1.7, 1.12, 0.07), {
    depth: 0.07,
    bevelEnabled: false,
  });
  g.add(new T.Mesh(slabGeo, dark(T)));
  g.add(edges(T, slabGeo, BONE, 1));

  const bar = new T.Mesh(
    new T.BoxGeometry(1.54, 0.1, 0.02),
    new T.MeshBasicMaterial({ color: ORANGE })
  );
  bar.position.set(0, 0.42, 0.085);
  g.add(bar);

  const grid = new T.LineSegments(
    new T.WireframeGeometry(new T.PlaneGeometry(1.54, 0.7, 6, 3)),
    new T.LineBasicMaterial({ color: BONE, transparent: true, opacity: 0.4 })
  );
  grid.position.set(0, -0.08, 0.08);
  g.add(grid);
  return g;
}

// A phone: tall slab, bone edges, orange island, faint screen grid.
export function buildApp(T: ThreeMod): THREE.Group {
  const g = new T.Group();
  const slabGeo = new T.ExtrudeGeometry(roundedRectShape(T, 0.78, 1.56, 0.13), {
    depth: 0.08,
    bevelEnabled: false,
  });
  g.add(new T.Mesh(slabGeo, dark(T)));
  g.add(edges(T, slabGeo, BONE, 1));

  const island = new T.Mesh(
    new T.CapsuleGeometry(0.028, 0.14, 4, 8),
    new T.MeshBasicMaterial({ color: ORANGE })
  );
  island.rotation.z = Math.PI / 2;
  island.position.set(0, 0.64, 0.09);
  g.add(island);

  const grid = new T.LineSegments(
    new T.WireframeGeometry(new T.PlaneGeometry(0.62, 1.1, 3, 5)),
    new T.LineBasicMaterial({ color: BONE, transparent: true, opacity: 0.38 })
  );
  grid.position.set(0, -0.06, 0.085);
  g.add(grid);
  return g;
}

// The shield itself, extruded — dark body, orange keyline edges.
export async function buildBrand(T: ThreeMod): Promise<THREE.Group> {
  const { SVGLoader } = await import('three/addons/loaders/SVGLoader.js');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg"><path d="${SHIELD_PATH}"/></svg>`;
  const paths = new SVGLoader().parse(svg).paths;
  const g = new T.Group();
  const inner = new T.Group();
  for (const p of paths) {
    for (const shape of SVGLoader.createShapes(p)) {
      const geo = new T.ExtrudeGeometry(shape, { depth: 56, bevelEnabled: false });
      inner.add(new T.Mesh(geo, dark(T)));
      inner.add(edges(T, geo, ORANGE, 0.95));
    }
  }
  // SVG space: y grows downward, path is ~447x520 units. Normalise to ~1.5.
  inner.scale.setScalar(0.0031);
  inner.rotation.x = Math.PI; // flip the SVG's y-down space
  const box = new T.Box3().setFromObject(inner);
  const c = box.getCenter(new T.Vector3());
  inner.position.sub(c);
  g.add(inner);
  return g;
}

// Design: a bone torus knot with an orange orbit ring — pure form.
export function buildDesign(T: ThreeMod): THREE.Group {
  const g = new T.Group();
  const knotGeo = new T.TorusKnotGeometry(0.5, 0.15, 96, 12);
  g.add(new T.Mesh(knotGeo, dark(T)));
  g.add(
    new T.LineSegments(
      new T.WireframeGeometry(knotGeo),
      new T.LineBasicMaterial({ color: BONE, transparent: true, opacity: 0.42 })
    )
  );
  const ring = new T.Mesh(
    new T.TorusGeometry(0.92, 0.008, 6, 72),
    new T.MeshBasicMaterial({ color: ORANGE })
  );
  ring.rotation.x = Math.PI / 2.4;
  g.add(ring);
  return g;
}

export function createRenderer(
  T: ThreeMod,
  canvas: HTMLCanvasElement,
  width: number,
  height: number
) {
  const renderer = new T.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    // Small canvases; keeping the buffer makes frames stable between paints.
    preserveDrawingBuffer: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height, false);
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(30, width / height, 0.1, 20);
  camera.position.z = 4.2;
  return { renderer, scene, camera };
}
