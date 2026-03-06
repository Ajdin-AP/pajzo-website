import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import styled from 'styled-components';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// STYLED COMPONENTS ("Apple Style")
// ==========================================

const StatsSection = styled.section`
    position: relative;
    padding: 200px 20px;
    background: #ffffff;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    z-index: 5;
    display: flex;
    justify-content: center;
    overflow: hidden;
`;

const Container = styled.div`
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Header = styled.div`
    text-align: center;
    margin-bottom: 140px;
    
    h2 {
        font-size: 0.9rem;
        font-weight: 600;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        color: #86868b; /* Apple Gray */
        margin-bottom: 24px;
        display: inline-block;
    }

    .main-title {
        font-size: clamp(3.5rem, 7vw, 6rem);
        font-weight: 700;
        color: #1d1d1f; /* Apple Dark Text */
        letter-spacing: -0.05em;
        line-height: 1.05;
        margin: 0;
        max-width: 800px;
        margin: 0 auto;
        
        /* Subtle text reveal effect setup */
        clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
        padding-bottom: 10px;

        span {
            color: #1d1d1f;
            display: inline-block;
            background: linear-gradient(120deg, #1d1d1f 30%, #86868b 80%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
    width: 100%;
    padding: 0 20px;
    
    @media (max-width: 1024px) {
        display: none;
    }
`;

const CardContainer = styled.div`
    perspective: 2000px;
    height: 540px;
    width: 100%;
`;

const Card = styled.div`
    position: relative;
    background: #ffffff;
    height: 100%;
    width: 100%;
    padding: 64px 48px;
    border-radius: 36px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
    /* Apple-style floating shadow */
    box-shadow: 
        0 4px 24px rgba(0, 0, 0, 0.04),
        0 1px 2px rgba(0, 0, 0, 0.02);
    
    /* Soft border using box-shadow inset for crispness */
    border: 1px solid rgba(0, 0, 0, 0.04);
    
    transform-style: preserve-3d;
    transition: box-shadow 0.5s cubic-bezier(0.25, 1, 0.5, 1),
                border-color 0.5s ease;
    will-change: transform;

    &:hover {
        box-shadow: 
            0 30px 60px rgba(0, 0, 0, 0.12),
            0 10px 20px rgba(0, 0, 0, 0.08);
        border-color: rgba(0, 0, 0, 0.08);
    }
`;

const TopSection = styled.div`
    width: 100%;
    transform: translateZ(30px); /* 3D pop on outer hover */
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const IconWrapper = styled.div`
    width: 64px;
    height: 64px;
    border-radius: 20px;
    background: linear-gradient(135deg, #f5f5f7 0%, #e8e8ed 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 2px 4px rgba(255,255,255,0.8),
                0 4px 12px rgba(0,0,0,0.05);
`;

const StatIcon = styled.i`
    font-size: 1.8rem;
    color: #1d1d1f;
`;

const StatNumber = styled.div`
    font-size: 1.5rem;
    font-weight: 600;
    color: #86868b;
    font-variant-numeric: tabular-nums;
`;

const ContentSection = styled.div`
    margin-top: auto;
    transform: translateZ(40px); /* Closer 3D pop for text */
`;

const Title = styled.h3`
    font-size: 2.25rem;
    font-weight: 700;
    color: #1d1d1f;
    margin: 0 0 24px 0;
    letter-spacing: -0.03em;
    line-height: 1.1;
`;

const Description = styled.p`
    font-size: 1.125rem;
    color: #86868b;
    line-height: 1.5;
    margin: 0;
    font-weight: 400;
    max-width: 90%;
`;

// ==========================================
// MOBILE STYLED COMPONENTS (Sticky Stacking Cards)
// ==========================================

const MobileStickyContainer = styled.div`
    display: none;
    width: 100%;
    flex-direction: column;
    padding: 0 20px 100px 20px; /* Extra bottom padding to allow full scroll */
    position: relative;

    @media (max-width: 1024px) {
        display: flex;
    }
`;

const MobileStickyCard = styled.div<{ $index: number }>`
    position: sticky;
    /* Each card sticks slightly lower than the one before it to create the "deck" effect.
       Top offset ensures it clears the fixed Header. */
    top: ${props => 120 + (props.$index * 20)}px;
    
    background: #ffffff;
    border-radius: 36px;
    padding: 40px 32px;
    margin-bottom: 20px; /* Space between cards before they stack */
    overflow: hidden;
    
    display: flex;
    flex-direction: column;
    min-height: 380px;

    /* Distinct shadow to separate layers as they stack */
    box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.08), 0 10px 40px rgba(0,0,0,0.02);
    border: 1px solid rgba(0, 0, 0, 0.04);
    
    /* Native smooth scaling when covered */
    transition: transform 0.3s ease;
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
    font-weight: 700;
    color: #1d1d1f;
    margin: 0;
    letter-spacing: -0.03em;
    line-height: 1.1;
`;

const MobileDescription = styled.p`
    font-size: 1.1rem;
    color: #86868b;
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
    color: rgba(0,0,0,0.02);
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
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header Reveal (Smooth slide UP and fade)
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
                    duration: 1.2, ease: "cubic-bezier(0.16, 1, 0.3, 1)", // Super smooth Apple-like ease
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
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
        const cardContainer = cardRefs.current[index];
        if (!cardContainer) return;

        const card = cardContainer.querySelector('.inner-card') as HTMLDivElement;
        if (!card) return;

        const rect = cardContainer.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element.
        const y = e.clientY - rect.top;  // y position within the element.

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -8; // Max rotation 8deg
        const rotateY = ((x - centerX) / centerX) * 8;

        gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            scale: 1.02,
            duration: 0.4,
            ease: 'power2.out',
            transformPerspective: 1500,
            transformOrigin: 'center center'
        });
    };

    const handleMouseLeave = (index: number) => {
        const cardContainer = cardRefs.current[index];
        if (!cardContainer) return;

        const card = cardContainer.querySelector('.inner-card') as HTMLDivElement;
        if (!card) return;

        gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            duration: 0.8,
            ease: 'elastic.out(1, 0.5)' // Gives a nice subtle bounce back
        });
    };

    return (
        <StatsSection ref={containerRef}>
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
                            ref={el => { cardRefs.current[index] = el; }}
                            onMouseMove={(e) => handleMouseMove(e, index)}
                            onMouseLeave={() => handleMouseLeave(index)}
                        >
                            <Card className="inner-card">
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