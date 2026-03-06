import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// SHARED STYLES
// ==========================================

const DividerRoot = styled.div`
    position: relative;
    width: 100%;
    z-index: 10;
    pointer-events: none;
    overflow: hidden;
    height: 160px; /* More breathing room */
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff;

    &.divider-architect {
        height: auto;
        margin-bottom: -5px; /* Force overlap with footer to kill white line */
        z-index: 20;
    }

    &.divider-curve {
        height: auto;
        display: block;
        background: transparent; /* Transparent so body black shows through top gap */
        padding: 0;
        margin-top: -2px; /* Pull the whole divider up to overlap Hero */
    }
`;

// ==========================================
// 1. MIST (Breathing Room)
// Description: A subtle radial gradient that implies depth without heavy lines.
// ==========================================
const MistContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
`;

const MistOrb = styled.div`
    width: 300px;
    height: 1px;
    background: radial-gradient(circle, rgba(0,0,0,0.2) 0%, transparent 80%);
    box-shadow: 0 0 40px 5px rgba(0,0,0,0.05);
`;

// ==========================================
// 2. SPLITTER (Precision)
// Description: A clean, single pixel line growing from center.
// ==========================================
const SplitterLine = styled.div`
    width: 0%;
    height: 1px;
    background: linear-gradient(90deg, transparent, #000, transparent);
    opacity: 0.3;
`;

// ==========================================
// 3. PRISM (Refraction)
// Description: A thin line with a moving light bead.
// ==========================================
const PrismContainer = styled.div`
    width: 100%;
    max-width: 600px;
    height: 1px;
    background: rgba(0,0,0,0.05);
    position: relative;
    overflow: hidden;
`;

const PrismLight = styled.div`
    position: absolute;
    top: -1px;
    left: 0;
    width: 40px;
    height: 3px;
    background: linear-gradient(90deg, transparent, #000, transparent);
    filter: blur(2px);
    opacity: 0.6;
`;

// ==========================================
// 4. AIRLOCK (Containment)
// Description: Minimal brackets fading in.
// ==========================================
const AirlockContainer = styled.div`
    display: flex;
    gap: 20px;
    align-items: center;
    opacity: 0;
`;

const AirlockBracket = styled.div`
    font-family: 'JetBrains Mono', monospace;
    font-size: 1.2rem;
    font-weight: 300;
    color: rgba(0,0,0,0.2);
`;

const AirlockDot = styled.div`
    width: 4px;
    height: 4px;
    background: #000;
    border-radius: 50%;
    opacity: 0.2;
`;

// ==========================================
// 5. GLITCH (Data)
// Description: Two offset thin lines.
// ==========================================
const GlitchContainer = styled.div`
    position: relative;
    width: 100px;
    height: 10px;
`;

const GlitchBar = styled.div`
    position: absolute;
    height: 1px;
    background: #000;
    width: 100%;
    opacity: 0.2;
    
    &.top { top: 0; left: -10px; }
    &.bottom { bottom: 0; left: 10px; }
`;

// ==========================================
// 6. WAVE (Frequency)
// Description: A minimal sine wave path.
// ==========================================
const WaveSVG = styled.svg`
    width: 200px;
    height: 40px;
    opacity: 0.3;
    
    path {
        fill: none;
        stroke: #000;
        stroke-width: 1;
        vector-effect: non-scaling-stroke;
    }
`;

// ==========================================
// 7. LOADING (Progress)
// Description: Simple thin track with progress.
// ==========================================
const LoadingTrack = styled.div`
    width: 120px;
    height: 1px;
    background: rgba(0,0,0,0.1);
    position: relative;
    overflow: hidden;
`;

const LoadingBar = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background: #000;
    transform: translateX(-100%);
`;

// ==========================================
// 8. NETWORK (Nodes)
// Description: Just three tiny dots.
// ==========================================
const NetworkContainer = styled.div`
    display: flex;
    gap: 40px;
`;

const NetworkNode = styled.div`
    width: 3px;
    height: 3px;
    background: #000;
    border-radius: 50%;
    opacity: 0.2;
    transition: opacity 0.3s;
`;

// ==========================================
// 9. ORBIT (Cycle)
// Description: A minimal arc.
// ==========================================
const OrbitSVG = styled.svg`
    width: 60px;
    height: 60px;
    opacity: 0.3;
    
    circle {
        fill: none;
        stroke: #000;
        stroke-width: 1;
        stroke-dasharray: 100;
        stroke-dashoffset: 100;
    }
`;

// ==========================================
// 10. GRADIENT (Transition)
// Description: Smooth fade from white to black.
// ==========================================
const GradientContainer = styled.div`
    width: 100%;
    height: 200px;
    background: linear-gradient(to bottom, #ffffff 0%, #050505 100%);
`;

// ==========================================
// 11. VOID (Gateway)
// Description: Organic curve transition to black.
// ==========================================
const VoidContainer = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    margin-bottom: -1px; /* Overlap fix */
`;

const VoidSVG = styled.svg`
    width: 100%;
    height: 102%; /* Overlap fix */
    display: block;
    margin-bottom: -1px;
    
    path {
        fill: #050505;
    }
`;

// ==========================================
// 13. REENTRY (Return)
// Description: Inverted curve from Black to White.
// ==========================================
const ReentryContainer = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    margin-top: -1px; /* Overlap fix */
`;

const ReentrySVG = styled.svg`
    width: 100%;
    height: 102%; /* Overlap fix */
    display: block;
    transform: scaleY(-1); /* Flip the Void curve */
    margin-top: -1px;
    
    path {
        fill: #050505;
    }
`;

// ==========================================
// 14. ARCHITECT (Slant)
// Description: Clean, sharp diagonal cut.
// ==========================================
const ArchitectContainer = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    margin-top: -1px;
    background: transparent;
`;

const ArchitectSVG = styled.svg`
    width: 100%;
    height: 105%; /* Aggressive Overlap fix */
    display: block;
    margin-top: -2px;
    margin-bottom: -2px;
    transform: scale(1.02); /* Slight scale to prevent subpixel gaps */
    transform-origin: bottom;
    
    path {
        fill: #050505;
        vector-effect: non-scaling-stroke;
        shape-rendering: geometricPrecision; /* Crisper edges */
    }
`;

// ==========================================
// 12. CURVE (Hero Transition)
// Description: Smooth black slope from Hero.
// ==========================================
const CurveContainer = styled.div`
    width: 100%;
    height: 160px; /* Match DividerRoot or slightly larger */
    position: relative;
    overflow: hidden;
    background: transparent;
    z-index: 20;
`;

const FluxLayer = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    will-change: transform;
    
    &.layer-1 { z-index: 1; opacity: 0.3; }
    &.layer-2 { z-index: 2; opacity: 0.6; }
    &.layer-3 { z-index: 3; opacity: 1; }
    
    svg {
        display: block;
        width: 100%;
        height: 100%;
    }
    
    path {
        fill: #ffffff;
    }
`;


// ==========================================
// COMPONENT
// ==========================================

interface SectionDividerProps {
    variant?: 'mist' | 'splitter' | 'prism' | 'airlock' | 'glitch' | 'wave' | 'loading' | 'network' | 'orbit' | 'gradient' | 'void' | 'curve' | 'reentry' | 'architect';
}

const SectionDivider: React.FC<SectionDividerProps> = ({ variant = 'mist' }) => {
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            const defaults = {
                trigger: el,
                start: "top 85%",
                end: "bottom 45%",
                toggleActions: "play reverse play reverse"
            };

            switch (variant) {
                case 'mist':
                    gsap.to('.mist-container', {
                        opacity: 1,
                        duration: 1.5,
                        scrollTrigger: defaults
                    });
                    break;

                case 'splitter':
                    gsap.to('.splitter-line', {
                        width: '80%',
                        opacity: 0.4,
                        duration: 1,
                        ease: "power2.out",
                        scrollTrigger: defaults
                    });
                    break;

                case 'prism':
                    gsap.fromTo('.prism-light',
                        { x: '-100%' },
                        {
                            x: '600px',
                            scrollTrigger: {
                                trigger: el,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: 1
                            }
                        }
                    );
                    break;

                case 'airlock':
                    gsap.to('.airlock-container', {
                        opacity: 1,
                        gap: '40px',
                        duration: 1,
                        ease: "power2.out",
                        scrollTrigger: defaults
                    });
                    break;

                case 'glitch':
                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: el,
                            start: "top 90%",
                            toggleActions: "play none none reverse"
                        },
                        repeat: -1,
                        repeatDelay: 2
                    });
                    tl.to('.glitch-top', { x: 5, duration: 0.1, ease: "steps(1)" })
                        .to('.glitch-top', { x: -5, duration: 0.1, ease: "steps(1)" })
                        .to('.glitch-top', { x: 0, duration: 0.1 });
                    break;

                case 'wave':
                    gsap.fromTo('.wave-path',
                        { attr: { d: "M0,20 Q100,20 200,20" } },
                        {
                            attr: { d: "M0,20 Q100,5 200,20" },
                            scrollTrigger: {
                                trigger: el,
                                scrub: 1
                            }
                        }
                    );
                    break;

                case 'loading':
                    gsap.to('.loading-bar', {
                        x: '0%',
                        ease: "power1.inOut",
                        scrollTrigger: {
                            trigger: el,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true
                        }
                    });
                    break;

                case 'network':
                    gsap.to('.network-node', {
                        opacity: 0.6,
                        scale: 1.5,
                        stagger: {
                            each: 0.2,
                            from: "center"
                        },
                        scrollTrigger: defaults
                    });
                    break;

                case 'orbit':
                    gsap.to('.orbit-circle', {
                        strokeDashoffset: 0,
                        rotation: 180,
                        transformOrigin: "center",
                        scrollTrigger: {
                            trigger: el,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: 1
                        }
                    });
                    break;

                case 'void':
                    // Parallax effect for the curve
                    gsap.fromTo('.void-path',
                        { scaleY: 0.5, transformOrigin: "bottom" },
                        {
                            scaleY: 1.2,
                            ease: "none",
                            scrollTrigger: {
                                trigger: el,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: true
                            }
                        }
                    );
                    break;

                case 'reentry':
                    // Static fix: Ensure no gap by removing parallax scaling
                    gsap.set('.reentry-path', { scaleY: 1.1, transformOrigin: "top" });
                    break;

                case 'architect':
                    // Reveal effect
                    gsap.fromTo('.architect-path',
                        { y: '100%' },
                        {
                            y: '0%',
                            ease: "none",
                            scrollTrigger: {
                                trigger: el,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: true
                            }
                        }
                    );
                    break;

                case 'curve':
                    // FLUX PARALLAX ANIMATION

                    // Layer 1 (Back/Slow)
                    gsap.to('.curve-layer-1', {
                        y: '30%',
                        ease: "none",
                        scrollTrigger: {
                            trigger: el,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true
                        }
                    });

                    // Layer 2 (Middle/Medium)
                    gsap.to('.curve-layer-2', {
                        y: '15%',
                        ease: "none",
                        scrollTrigger: {
                            trigger: el,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true
                        }
                    });

                    // Layer 3 (Front/Fast/Fixed) - The main connector
                    break;
            }

        }, rootRef);

        return () => ctx.revert();
    }, [variant]);

    return (
        <DividerRoot ref={rootRef} className={`divider-${variant}`}>
            {variant === 'mist' && (
                <MistContainer className="mist-container">
                    <MistOrb />
                </MistContainer>
            )}

            {variant === 'splitter' && (
                <SplitterLine className="splitter-line" />
            )}

            {variant === 'prism' && (
                <PrismContainer>
                    <PrismLight className="prism-light" />
                </PrismContainer>
            )}

            {variant === 'airlock' && (
                <AirlockContainer className="airlock-container">
                    <AirlockBracket>[</AirlockBracket>
                    <AirlockDot />
                    <AirlockBracket>]</AirlockBracket>
                </AirlockContainer>
            )}

            {variant === 'glitch' && (
                <GlitchContainer>
                    <GlitchBar className="glitch-top top" />
                    <GlitchBar className="bottom" />
                </GlitchContainer>
            )}

            {variant === 'wave' && (
                <WaveSVG viewBox="0 0 200 40">
                    <path className="wave-path" d="M0,20 Q100,20 200,20" />
                </WaveSVG>
            )}

            {variant === 'loading' && (
                <LoadingTrack>
                    <LoadingBar className="loading-bar" />
                </LoadingTrack>
            )}

            {variant === 'network' && (
                <NetworkContainer>
                    <NetworkNode className="network-node" />
                    <NetworkNode className="network-node" />
                    <NetworkNode className="network-node" />
                </NetworkContainer>
            )}

            {variant === 'orbit' && (
                <OrbitSVG viewBox="0 0 60 60">
                    <circle className="orbit-circle" cx="30" cy="30" r="28" />
                </OrbitSVG>
            )}

            {variant === 'gradient' && (
                <GradientContainer />
            )}

            {variant === 'architect' && (
                <ArchitectContainer>
                    <ArchitectSVG viewBox="0 0 1440 100" preserveAspectRatio="none">
                        <path className="architect-path" d="M0,100 L0,0 L1440,100 Z"></path>
                    </ArchitectSVG>
                </ArchitectContainer>
            )}

            {variant === 'void' && (
                <VoidContainer>
                    <VoidSVG viewBox="0 0 1440 320" preserveAspectRatio="none">
                        <path className="void-path" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </VoidSVG>
                </VoidContainer>
            )}

            {variant === 'reentry' && (
                <ReentryContainer>
                    <ReentrySVG viewBox="0 0 1440 320" preserveAspectRatio="none">
                        <path className="reentry-path" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </ReentrySVG>
                </ReentryContainer>
            )}

            {variant === 'curve' && (
                <CurveContainer>
                    {/* Layer 1: Deep Background Wave */}
                    <FluxLayer className="curve-layer-1 layer-1">
                        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
                            <path d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L0,320Z"></path>
                        </svg>
                    </FluxLayer>

                    {/* Layer 2: Midground Wave */}
                    <FluxLayer className="curve-layer-2 layer-2">
                        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
                            <path d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,149.3C672,149,768,203,864,218.7C960,235,1056,213,1152,192C1248,171,1344,149,1392,138.7L1440,128L1440,320L0,320Z"></path>
                        </svg>
                    </FluxLayer>

                    {/* Layer 3: Foreground (Main Connector) */}
                    <FluxLayer className="curve-layer-3 layer-3">
                        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
                            <path d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L0,320Z"></path>
                        </svg>
                    </FluxLayer>
                </CurveContainer>
            )}
        </DividerRoot>
    );
};

export default SectionDivider;
