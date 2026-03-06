import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// VISUAL ANIMATION COMPONENTS (PREMIUM GLASS)
// ==========================================

const VisualCard = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  /* Subtle inner glow */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, transparent 70%);
    pointer-events: none;
  }
`;

interface VisualProps {
  isActive: boolean;
}

// --- 1. DATA GRID SCAN (MINIMALIST) ---

const DataGridScan = React.memo(({ isActive }: VisualProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(isActive);

  useEffect(() => {
    activeRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width;
    let height = canvas.height;
    let animationFrameId: number;

    // Configuration
    const cols = 20;
    const rows = 15;
    const dots: { x: number; y: number; active: number }[] = [];

    const initGrid = () => {
      dots.length = 0;
      const cellWidth = width / cols;
      const cellHeight = height / rows;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push({
            x: c * cellWidth + cellWidth / 2,
            y: r * cellHeight + cellHeight / 2,
            active: 0
          });
        }
      }
    };

    const handleResize = () => {
      if (containerRef.current && canvas) {
        width = containerRef.current.clientWidth;
        height = containerRef.current.clientHeight;
        canvas.width = width;
        canvas.height = height;
        initGrid();
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    let scanY = 0;

    const render = () => {
      if (!activeRef.current) {
        // throttling: check back in 100ms
        setTimeout(() => {
          animationFrameId = requestAnimationFrame(render);
        }, 100);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Move Scan Line
      scanY += 2;
      if (scanY > height + 20) scanY = -20;

      // Draw Grid
      dots.forEach(dot => {
        // Activate if scan line touches
        if (Math.abs(dot.y - scanY) < 10) {
          dot.active = 1.0;
        } else {
          dot.active *= 0.92; // Fast fade
        }

        const opacity = 0.1 + dot.active * 0.9;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fillRect(dot.x - 2, dot.y - 2, 4, 4); // Small square dots
      });

      // Draw Scan Line
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillRect(0, scanY, width, 1); // Razor thin line

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <VisualCard ref={containerRef}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </VisualCard>
  );
});

// --- 2. NEURAL CONSTELLATION (CANVAS) ---

const NeuralConstellation = React.memo(({ isActive }: VisualProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(isActive);

  useEffect(() => {
    activeRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width;
    let height = canvas.height;
    let animationFrameId: number;

    // Configuration
    const particleCount = 40;
    const connectionDistance = 100;
    const particles: { x: number; y: number; vx: number; vy: number; }[] = [];

    // Initialize Particles
    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5
        });
      }
    };

    // Resize Handler
    const handleResize = () => {
      if (containerRef.current && canvas) {
        width = containerRef.current.clientWidth;
        height = containerRef.current.clientHeight;
        canvas.width = width;
        canvas.height = height;
        initParticles();
      }
    };

    // Initial Resize
    handleResize();
    window.addEventListener('resize', handleResize);

    // Animation Loop
    const render = () => {
      if (!activeRef.current) {
        setTimeout(() => {
          animationFrameId = requestAnimationFrame(render);
        }, 100);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Update & Draw Particles
      particles.forEach((p, i) => {
        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw Node
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Connect
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / connectionDistance})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <VisualCard ref={containerRef}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </VisualCard>
  );
});

// --- 3. ORBITAL SYNTHESIS (3D GYROSCOPE) ---

const OrbitalSynthesis = React.memo(({ isActive }: VisualProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(isActive);

  useEffect(() => {
    activeRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width;
    let height = canvas.height;
    let animationFrameId: number;

    // Configuration
    const rings = [
      { radius: 100, speedX: 0.02, speedY: 0.01, speedZ: 0.005, rotation: { x: 0, y: 0, z: 0 }, color: 'rgba(255,255,255,0.8)', width: 2 },
      { radius: 150, speedX: -0.015, speedY: 0.02, speedZ: -0.01, rotation: { x: 0, y: 0, z: 0 }, color: 'rgba(255,255,255,0.5)', width: 1, dashed: true },
      { radius: 210, speedX: 0.01, speedY: -0.01, speedZ: 0.02, rotation: { x: 0, y: 0, z: 0 }, color: 'rgba(255,255,255,0.3)', width: 1 }
    ];

    // Resize Handler
    const handleResize = () => {
      if (containerRef.current && canvas) {
        width = containerRef.current.clientWidth;
        height = containerRef.current.clientHeight;
        canvas.width = width;
        canvas.height = height;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Animation Loop
    const render = () => {
      if (!activeRef.current) {
        setTimeout(() => {
          animationFrameId = requestAnimationFrame(render);
        }, 100);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const perspective = 500; // Increased perspective for larger items

      // Draw Core
      const coreGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40);
      coreGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      coreGradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.4)');
      coreGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(cx, cy, 40, 0, Math.PI * 2);
      ctx.fill();


      // Draw Rings
      rings.forEach(ring => {
        ring.rotation.x += ring.speedX;
        ring.rotation.y += ring.speedY;
        ring.rotation.z += ring.speedZ;

        ctx.beginPath();
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = ring.width;
        if (ring.dashed) {
          ctx.setLineDash([5, 10]);
        } else {
          ctx.setLineDash([]);
        }

        // Draw ring segments
        const segments = 60;
        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * Math.PI * 2;
          // Base Circle in XY plane? Or XZ? Let's say XZ plane (y=0)
          const px = Math.cos(theta) * ring.radius;
          const py = Math.sin(theta) * ring.radius;
          const pz = 0;

          // Rotate X
          const rx1 = px;
          const ry1 = py * Math.cos(ring.rotation.x) - pz * Math.sin(ring.rotation.x);
          const rz1 = py * Math.sin(ring.rotation.x) + pz * Math.cos(ring.rotation.x);

          // Rotate Y
          const rx2 = rx1 * Math.cos(ring.rotation.y) + rz1 * Math.sin(ring.rotation.y);
          const ry2 = ry1;
          const rz2 = -rx1 * Math.sin(ring.rotation.y) + rz1 * Math.cos(ring.rotation.y);

          // Rotate Z
          const rx3 = rx2 * Math.cos(ring.rotation.z) - ry2 * Math.sin(ring.rotation.z);
          const ry3 = rx2 * Math.sin(ring.rotation.z) + ry2 * Math.cos(ring.rotation.z);
          const rz3 = rz2;

          // Project
          const scale = perspective / (perspective + rz3 + 200);
          const x2d = cx + rx3 * scale;
          const y2d = cy + ry3 * scale;

          if (i === 0) {
            ctx.moveTo(x2d, y2d);
          } else {
            ctx.lineTo(x2d, y2d);
          }
        }
        ctx.stroke();

        // Draw "Data Particle" orbiting on the ring
        if (!ring.dashed) {
          const theta = Date.now() * 0.002 * (ring.speedX > 0 ? 1 : -1);
          const px = Math.cos(theta) * ring.radius;
          const py = Math.sin(theta) * ring.radius;
          const pz = 0;

          // Apply same rotations
          // Rotate X
          const rx1 = px;
          const ry1 = py * Math.cos(ring.rotation.x) - pz * Math.sin(ring.rotation.x);
          const rz1 = py * Math.sin(ring.rotation.x) + pz * Math.cos(ring.rotation.x);
          // Rotate Y
          const rx2 = rx1 * Math.cos(ring.rotation.y) + rz1 * Math.sin(ring.rotation.y);
          const ry2 = ry1;
          const rz2 = -rx1 * Math.sin(ring.rotation.y) + rz1 * Math.cos(ring.rotation.y);
          // Rotate Z
          const rx3 = rx2 * Math.cos(ring.rotation.z) - ry2 * Math.sin(ring.rotation.z);
          const ry3 = rx2 * Math.sin(ring.rotation.z) + ry2 * Math.cos(ring.rotation.z);
          const rz3 = rz2;

          const scale = perspective / (perspective + rz3 + 200);
          if (scale > 0) {
            const x2d = cx + rx3 * scale;
            const y2d = cy + ry3 * scale;

            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(x2d, y2d, 4 * scale, 0, Math.PI * 2);
            ctx.fill();
          }
        }

      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <VisualCard ref={containerRef}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </VisualCard>
  );
});

// --- 4. SIGNAL PROPAGATION (HOLOGRAPHIC GLOBE) ---

const SignalPropagation = React.memo(({ isActive }: VisualProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(isActive);

  useEffect(() => {
    activeRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width;
    let height = canvas.height;
    let animationFrameId: number;

    // Configuration
    const sphereRadius = 180; // Bigger radius
    const particleCount = 200; // More particles
    const rotationSpeed = 0.003;
    const particles: { x: number; y: number; z: number; x2d: number; y2d: number; scale: number; }[] = [];

    // Fibonacci Sphere Algorithm
    const initParticles = () => {
      particles.length = 0;
      const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

      for (let i = 0; i < particleCount; i++) {
        const y = 1 - (i / (particleCount - 1)) * 2;
        const radius = Math.sqrt(1 - y * y);
        const theta = phi * i;

        const x = Math.cos(theta) * radius;
        const z = Math.sin(theta) * radius;

        particles.push({
          x: x * sphereRadius,
          y: y * sphereRadius,
          z: z * sphereRadius,
          x2d: 0,
          y2d: 0,
          scale: 1
        });
      }
    };

    // Resize Handler
    const handleResize = () => {
      if (containerRef.current && canvas) {
        width = containerRef.current.clientWidth;
        height = containerRef.current.clientHeight;
        canvas.width = width;
        canvas.height = height;
      }
    };
    handleResize();
    initParticles();
    window.addEventListener('resize', handleResize);

    let angleY = 0;
    let angleX = 0;

    // Animation Loop
    const render = () => {
      if (!activeRef.current) {
        setTimeout(() => {
          animationFrameId = requestAnimationFrame(render);
        }, 100);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const perspective = 500; // Increased perspective for size

      angleY += rotationSpeed;
      angleX += rotationSpeed * 0.2;

      // Rotate & Project
      particles.forEach(p => {
        // Rotation Y
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.z * cosY + p.x * sinY;

        // Rotation X
        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        let y2 = p.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.y * sinX;

        // Projection
        const scale = perspective / (perspective + z2 + 250);
        p.x2d = cx + x1 * scale;
        p.y2d = cy + y2 * scale;
        p.scale = scale;
      });

      // Draw Particles
      particles.forEach(p => {
        if (p.scale < 0.4) return; // Cull back faces

        // Brighter / Whiter
        const alpha = Math.max(0.3, p.scale - 0.2);

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x2d, p.y2d, 2 * p.scale, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Connections (Brighter)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'; // Higher base opacity

      for (let i = 0; i < particleCount; i++) {
        const p1 = particles[i];
        if (p1.scale < 0.7) continue;

        for (let j = i + 1; j < particleCount; j++) {
          const p2 = particles[j];
          if (p2.scale < 0.7) continue;

          const dx = p1.x2d - p2.x2d;
          const dy = p1.y2d - p2.y2d;
          // Distance threshold
          if (dx * dx + dy * dy < 2500) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 * p1.scale})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(p1.x2d, p1.y2d);
            ctx.lineTo(p2.x2d, p2.y2d);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <VisualCard ref={containerRef}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </VisualCard>
  );
});

// ==========================================
// LAYOUT & SECTION COMPONENTS
// ==========================================

const Section = styled.section`
  padding: 100px 5%;
  background: #000000;
  color: #ffffff;
  position: relative;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 80px;
  
  h2 {
    font-size: 3.5rem;
    font-weight: 700;
    letter-spacing: -2px;
    background: linear-gradient(to right, #ffffff, #94a3b8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 20px;
  }
  
  p {
    font-family: 'JetBrains Mono', monospace;
    color: #64748b;
    font-size: 0.8rem;
    letter-spacing: 4px;
    text-transform: uppercase;
  }
`;

const LayoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div`
  position: relative;
  /* Ensure this column has height so scroll triggers work */
`;

const StepItem = styled.div`
  min-height: 80vh; /* Each step takes full viewport height scroll */
  display: flex;
  flex-direction: column;
  justify-content: center;
  opacity: 0.3;
  transition: opacity 0.5s;
  padding: 40px;

  &.active {
    opacity: 1;
  }

  /* Mobile: stack cards */
  @media (max-width: 1024px) {
    min-height: auto;
    margin-bottom: 80px;
    opacity: 1;
    background: rgba(255,255,255,0.05);
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.1);
  }
`;

const StepIndex = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  color: #cbd5e1;
  margin-bottom: 20px;
  display: block;
`;

const StepTitle = styled.h3`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #ffffff;
  line-height: 1.2;
`;

const StepDesc = styled.p`
  font-size: 1.1rem;
  color: #94a3b8;
  line-height: 1.6;
  max-width: 450px;
`;

const RightColumn = styled.div`
  position: relative;
  
  @media (max-width: 1024px) {
    display: none; /* Hide sticky visual on mobile, or move it inside steps */
  }
`;

const StickyWrapper = styled.div`
  position: sticky;
  top: calc(50vh - 250px); /* Vertically centered (50% viewport - half height) */
  height: 500px;
  width: 100%;
`;

// ==========================================
// DATA & MAIN COMPONENT
// ==========================================

const STEPS = [
  {
    id: '01',
    title: 'Discovery & Strategy',
    desc: 'We analyze your business goals and technical infrastructure to build a data-driven roadmap for success.',
    Visual: DataGridScan
  },
  {
    id: '02',
    title: 'Architecture & Design',
    desc: 'We design scalable, secure systems and intuitive interfaces tailored specifically to your operational needs.',
    Visual: NeuralConstellation
  },
  {
    id: '03',
    title: 'Development & Integration',
    desc: 'Our engineers build robust, high-performance applications using modern frameworks, ensuring seamless integration with your existing stack.',
    Visual: OrbitalSynthesis
  },
  {
    id: '04',
    title: 'Launch & Optimization',
    desc: 'We deploy your solution with zero downtime and continuously monitor performance to ensure global scalability and reliability.',
    Visual: SignalPropagation
  }
];

const Process: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray('.step-item') as HTMLElement[];
      steps.forEach((step, index) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top center",
          end: "bottom center",
          onToggle: (self: any) => {
            if (self.isActive) setActiveStep(index);
          },
          toggleClass: { targets: step, className: "active" }
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <Section id="process" ref={containerRef}>
      <Header>
        <h2>Our Process</h2>
        <p>Streamlined Execution</p>
      </Header>

      <LayoutGrid>
        <LeftColumn>
          {STEPS.map((step) => (
            <StepItem key={step.id} className="step-item">
              <StepIndex>PHASE {step.id}</StepIndex>
              <StepTitle>{step.title}</StepTitle>
              <StepDesc>{step.desc}</StepDesc>

              {/* Mobile Only Visual */}
              <div className="mobile-visual" style={{ marginTop: 30, display: 'none' }}>
                {/* We could render visual here for mobile if needed, but keeping simple for now */}
              </div>
            </StepItem>
          ))}
        </LeftColumn>

        <RightColumn>
          <StickyWrapper>
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              {STEPS.map((step, index) => {
                const Visual = step.Visual;
                const isActive = activeStep === index;
                return (
                  <div
                    key={step.id}
                    style={{
                      position: 'absolute', inset: 0,
                      opacity: isActive ? 1 : 0,
                      transform: `scale(${isActive ? 1 : 0.96}) translateY(${isActive ? 0 : 10}px)`, /* Subtle lift */
                      transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                      pointerEvents: isActive ? 'auto' : 'none',
                      zIndex: isActive ? 10 : 0
                    }}
                  >
                    <Visual isActive={isActive} />
                  </div>
                );
              })}
            </div>
          </StickyWrapper>
        </RightColumn>
      </LayoutGrid>
    </Section>
  );
};

export default Process;
