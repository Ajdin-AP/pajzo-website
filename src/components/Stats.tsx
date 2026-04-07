import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import styled from 'styled-components';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// STYLED COMPONENTS (High-Contrast Liquid Glass)
// ==========================================

const StatsSection = styled.section`
    position: relative;
    padding: 160px 20px;
    background: #e2e2e8; /* Deeper cool gray background for absolute premium contrast */
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    z-index: 20; /* Must be 20 to strictly overlap the Works section sliding beneath it */
    display: flex;
    justify-content: center;
    overflow: visible; /* Must be visible to allow the box-shadow to bleed downward seamlessly */

    /* 
       Premium Creative Transition (Closing the Arch):
       Curves the bottom of the white block and casts a deep ambient shadow downwards
       over the dark Stealth Mode Works section below it.
    */
    border-bottom-left-radius: 60px;
    border-bottom-right-radius: 60px;
    box-shadow: 0 40px 100px rgba(0, 0, 0, 0.9);

    /* Architectural Math Grid Background */
    &::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background-image: 
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
        background-size: 60px 60px;
        z-index: 0;
        mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
        -webkit-mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
        pointer-events: none;
    }
`;

const TopDivider = styled.div`
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 180px;
    background: linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0) 100%);
    z-index: 3;
    pointer-events: none;
`;

const OrbContainer = styled.div`
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    overflow: hidden;
    /* Force clipping to match parent curve to prevent neon from spilling over Works */
    border-bottom-left-radius: 60px;
    border-bottom-right-radius: 60px;
    opacity: 0.85; 
    
    /* 
       PERFORMANCE OPTIMIZATION: 
       Removed highly expensive 'filter: blur()' since the radial gradients 
       already have soft transparent edges. This eliminates mouse-hover lag!
    */
    .orb-1 {
        position: absolute;
        top: -10%; left: -10%;
        width: 800px; height: 800px;
        background: radial-gradient(circle, rgba(255, 68, 0, 0.25) 0%, transparent 70%);
        border-radius: 50%;
        animation: floatOrb 20s infinite alternate ease-in-out;
    }

    .orb-2 {
        position: absolute;
        bottom: -20%; right: -10%;
        width: 1000px; height: 1000px;
        background: radial-gradient(circle, rgba(0, 110, 255, 0.2) 0%, transparent 70%);
        border-radius: 50%;
        animation: floatOrb 25s infinite alternate-reverse ease-in-out;
    }

    .orb-3 {
        position: absolute;
        top: 30%; left: 30%;
        width: 700px; height: 700px;
        background: radial-gradient(circle, rgba(255, 0, 150, 0.15) 0%, transparent 70%);
        border-radius: 50%;
        animation: floatOrb 18s infinite alternate ease-in-out;
    }

    @keyframes floatOrb {
        0% { transform: translate(0, 0) scale(1); }
        100% { transform: translate(150px, 100px) scale(1.1); }
    }
`;

const Container = styled.div`
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 2;
`;

const Header = styled.div`
    text-align: center;
    margin-bottom: 120px;
    position: relative;
    z-index: 4;
    
    h2 {
        font-size: 0.9rem;
        font-weight: 800;
        letter-spacing: 0.3em;
        text-transform: uppercase;
        color: #ff4400;
        margin-bottom: 24px;
        display: inline-block;
        background: rgba(255, 255, 255, 0.5);
        padding: 8px 20px;
        border-radius: 30px;
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.8);
    }

    .main-title {
        font-size: clamp(3.5rem, 6vw, 6rem);
        font-weight: 900;
        color: #111111;
        letter-spacing: -0.05em;
        line-height: 1.1;
        margin: 0;
        max-width: 800px;
        margin: 0 auto;
        
        span {
            display: inline-block;
            background: linear-gradient(135deg, #ff4400, #ff8800);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
    width: 100%;
    padding: 0 20px;
    perspective: 2500px; 
    
    @media (max-width: 1024px) {
        display: none;
    }
`;

const CardContainer = styled.div`
    height: 520px;
    width: 100%;
    position: relative;
    transform-style: preserve-3d;
`;

const Card = styled.div`
    position: relative;
    height: 100%;
    width: 100%;
    padding: 55px 45px;
    border-radius: 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
    background: rgba(255, 255, 255, 0.45); 
    border: 1px solid rgba(255, 255, 255, 0.8);
    
    box-shadow: 
        0 30px 60px rgba(0, 0, 0, 0.05),
        inset 0 1px 1px rgba(255, 255, 255, 1),
        inset 0 0 40px rgba(255, 255, 255, 0.2);
    
    transform-style: preserve-3d;
    transition: box-shadow 0.4s ease, border-color 0.4s ease;

    /* Specular diagonal glare representing glass reflection */
    &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.6) 0%,
            rgba(255, 255, 255, 0) 35%,
            rgba(255, 255, 255, 0) 100%
        );
        pointer-events: none;
        z-index: 1;
    }

    /* Core Philosophy: Interactive Cursor Spotlight */
    &::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        opacity: 0;
        transition: opacity 0.4s ease;
        background: radial-gradient(
            500px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
            rgba(255, 68, 0, 0.18), 
            transparent 45%
        );
        pointer-events: none;
        z-index: 1;
    }

    /* Bug Fix: Bind hover states to the un-tilted Container box to eliminate raycast flicker */
    ${CardContainer}:hover & {
        border-color: rgba(255, 255, 255, 1);
        box-shadow: 
            0 40px 80px rgba(0, 0, 0, 0.1),
            inset 0 1px 2px rgba(255, 255, 255, 1),
            inset 0 0 60px rgba(255, 255, 255, 0.5);
    }
    
    ${CardContainer}:hover &::after {
        opacity: 1;
    }
`;

const TopSection = styled.div`
    width: 100%;
    transform: translateZ(50px); /* 3D pop so it floats above the glass */
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 2;
`;

const IconWrapper = styled.div`
    width: 68px;
    height: 68px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 1);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.03);
    transition: all 0.4s ease;

    /* Bug Fix: Bind hover state to container */
    ${CardContainer}:hover & {
        background: linear-gradient(135deg, #ff4400, #ff8800);
        box-shadow: 0 10px 30px rgba(255, 68, 0, 0.3);
        border: 1px solid transparent;
        transform: scale(1.05); /* Extra dynamic pop! */
        
        i {
            color: #ffffff;
        }
    }
`;

const StatIcon = styled.i`
    font-size: 1.8rem;
    color: #111111;
    transition: all 0.4s ease;
`;

const StatNumber = styled.div`
    font-size: 1.5rem;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.1);
    font-variant-numeric: tabular-nums;
`;

const ContentSection = styled.div`
    margin-top: auto;
    transform: translateZ(40px); /* Closer 3D pop for text */
    position: relative;
    z-index: 2;
`;

const Title = styled.h3`
    font-size: 2.25rem;
    font-weight: 800;
    color: #111111;
    margin: 0 0 24px 0;
    letter-spacing: -0.03em;
    line-height: 1.1;
`;

const Description = styled.p`
    font-size: 1.15rem;
    color: #4a4a4f;
    line-height: 1.6;
    margin: 0;
    font-weight: 400;
`;

// ==========================================
// MOBILE STYLED COMPONENTS (Sticky Stacking Liquid Cards)
// ==========================================

const MobileStickyContainer = styled.div`
    display: none;
    width: 100%;
    flex-direction: column;
    padding: 0 20px 100px 20px;
    position: relative;
    perspective: 1500px;
    
    @media (max-width: 1024px) {
        display: flex;
    }
`;

const MobileStickyCard = styled.div<{ $index: number }>`
    position: sticky;
    top: ${props => 120 + (props.$index * 20)}px;
    
    /* OPTIMIZED FOR MOBILE: Removed heavy backdrop filters */
    background: rgba(255, 255, 255, 0.45); 
    
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: 36px;
    padding: 40px 32px;
    margin-bottom: 20px;
    overflow: hidden;
    
    display: flex;
    flex-direction: column;
    min-height: 380px;

    /* Liquid Shadows */
    box-shadow: 
        0 -10px 40px rgba(0, 0, 0, 0.04), 
        0 10px 40px rgba(0, 0, 0, 0.02),
        inset 0 1px 2px rgba(255, 255, 255, 1);
    
    transition: transform 0.3s ease;

    /* Specular diagonal glare */
    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.7) 0%,
            rgba(255, 255, 255, 0) 40%
        );
        pointer-events: none;
        z-index: 1;
    }
`;

const MobileTopSection = styled.div`
    display: flex;
    justify-content: flex-start;
    margin-bottom: 30px;
    position: relative;
    z-index: 2;
`;

const MobileContentSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    position: relative;
    z-index: 2;
`;

const MobileTitle = styled.h3`
    font-size: 1.75rem;
    font-weight: 800;
    color: #111111;
    margin: 0;
    letter-spacing: -0.03em;
    line-height: 1.1;
`;

const MobileDescription = styled.p`
    font-size: 1.1rem;
    color: #4a4a4f;
    line-height: 1.5;
    margin: 0;
    font-weight: 400;
`;

const MobileWatermark = styled.div`
    position: absolute;
    bottom: -10px;
    right: 18px;
    font-size: 6.5rem;
    font-weight: 800;
    color: rgba(0, 0, 0, 0.03);
    user-select: none;
    line-height: 1;
    z-index: 1;
`;

// ==========================================
// DATA
// ==========================================

const CORE_VALUES = [
    {
        id: "01",
        label: "Precision Engineered.",
        desc: "Uncompromising standards. We don't just build websites; we craft digital architecture with mathematical exactness.",
        icon: "fas fa-crosshairs"
    },
    {
        id: "02",
        label: "Built for Velocity.",
        desc: "Speed is a feature. We deploy next-generation frameworks designed to instantly outpace market evolution.",
        icon: "fas fa-bolt"
    },
    {
        id: "03",
        label: "Maximum Impact.",
        desc: "Measured purely in dominance. We focus entirely on performance metrics that aggressively shift your bottom line.",
        icon: "fas fa-chart-line"
    }
];

// ==========================================
// COMPONENT
// ==========================================

const Stats: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const cardContainerRefs = useRef<(HTMLDivElement | null)[]>([]);
    const cardInnerRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header Reveal
            gsap.fromTo(".stats-header-sub",
                { y: 30, opacity: 0 },
                {
                    y: 0, opacity: 1,
                    duration: 1, ease: "power3.out",
                    scrollTrigger: { trigger: containerRef.current, start: "top 75%" }
                }
            );

            gsap.fromTo(".stats-header-main",
                { y: 60, opacity: 0, rotationX: -20 },
                {
                    y: 0, opacity: 1, rotationX: 0,
                    duration: 1.2, ease: "expo.out",
                    scrollTrigger: { trigger: containerRef.current, start: "top 70%" }
                }
            );

            // Cards Staggered Reveal
            gsap.fromTo(".stat-card-container",
                { y: 100, opacity: 0, scale: 0.95 },
                {
                    y: 0, opacity: 1, scale: 1,
                    duration: 1.4,
                    stagger: 0.15,
                    ease: "expo.out",
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: "top 80%"
                    }
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // 3D Hover Interaction Logic
    const handleCardMouseMoveTilt = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
        const container = cardContainerRefs.current[index];
        const innerCard = cardInnerRefs.current[index];
        if (!container || !innerCard) return;

        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Spotlight Glow Tracker
        innerCard.style.setProperty('--mouse-x', `${x}px`);
        innerCard.style.setProperty('--mouse-y', `${y}px`);

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -12; // Deeper rotation for liquid feel
        const rotateY = ((x - centerX) / centerX) * 12;

        /* CRITICAL PERFORMANCE OPTIMIZATION: overwrite: "auto" kills orphaned Javascript loops */
        gsap.to(innerCard, {
            rotationX: rotateX,
            rotationY: rotateY,
            scale: 1.02,
            duration: 0.6,
            ease: 'power2.out',
            transformOrigin: 'center center',
            overwrite: "auto"
        });
    };

    const handleCardMouseLeave = (index: number) => {
        const innerCard = cardInnerRefs.current[index];
        if (!innerCard) return;

        gsap.to(innerCard, {
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            duration: 1.2, 
            ease: 'elastic.out(1, 0.4)', 
            overwrite: "auto"
        });
    };

    return (
        <StatsSection ref={containerRef}>
            
            {/* Seamless Section Dividers */}
            <TopDivider />

            {/* Background Orbs for Liquid Glass Refraction */}
            <OrbContainer>
                <div className="orb-1"></div>
                <div className="orb-2"></div>
            </OrbContainer>

            <Container>
                <Header>
                    <h2 className="stats-header-sub">Core Philosophy</h2>
                    <h3 className="main-title stats-header-main">
                        The foundation of <span>scale.</span>
                    </h3>
                </Header>

                <Grid ref={gridRef}>
                    {CORE_VALUES.map((item, index) => (
                        <CardContainer
                            key={index}
                            className="stat-card-container"
                            ref={el => { cardContainerRefs.current[index] = el; }}
                            onMouseMove={(e) => handleCardMouseMoveTilt(e, index)}
                            onMouseLeave={() => handleCardMouseLeave(index)}
                        >
                            <Card 
                                className="inner-card" 
                                ref={el => { cardInnerRefs.current[index] = el; }}
                            >
                                <TopSection>
                                    <IconWrapper>
                                        <StatIcon className={item.icon} />
                                    </IconWrapper>
                                    <StatNumber>{item.id}</StatNumber>
                                </TopSection>

                                <ContentSection>
                                    <Title>{item.label}</Title>
                                    <Description>{item.desc}</Description>
                                </ContentSection>
                            </Card>
                        </CardContainer>
                    ))}
                </Grid>

                {/* Mobile Specific Layout: Sticky Stacking Cards */}
                <MobileStickyContainer>
                    {CORE_VALUES.map((item, index) => (
                        <MobileStickyCard key={index} $index={index}>
                            <MobileTopSection>
                                <IconWrapper>
                                    <StatIcon className={item.icon} />
                                </IconWrapper>
                            </MobileTopSection>

                            <MobileContentSection>
                                <MobileTitle>{item.label}</MobileTitle>
                                <MobileDescription>{item.desc}</MobileDescription>
                            </MobileContentSection>

                            <MobileWatermark>{item.id}</MobileWatermark>
                        </MobileStickyCard>
                    ))}
                </MobileStickyContainer>
            </Container>
        </StatsSection>
    );
};

export default Stats;