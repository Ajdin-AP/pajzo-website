import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import styled from 'styled-components';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// STYLED COMPONENTS (Apple Bento Box)
// ==========================================

const Section = styled.section`
    background: #ffffff;
    padding: 180px 20px;
    position: relative;
    overflow: hidden;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const Container = styled.div`
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Header = styled.div`
    text-align: center;
    margin-bottom: 100px;
    
    h2 {
        font-size: 0.9rem;
        font-weight: 600;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        color: #4a4a4f;
        margin-bottom: 24px;
        display: inline-block;
    }

    .main-title {
        font-size: clamp(3.5rem, 7vw, 6rem);
        font-weight: 700;
        color: #111111;
        letter-spacing: -0.05em;
        line-height: 1.05;
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

const BentoGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 300px);
    gap: 32px;
    width: 100%;
    
    @media (max-width: 1024px) {
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: auto;
    }
    
    @media (max-width: 600px) {
        grid-template-columns: 1fr;
    }
`;

// Base card mechanics
const BentoCardContainer = styled.div<{ $colSpan?: number, $rowSpan?: number }>`
    perspective: 2000px;
    grid-column: span ${props => props.$colSpan || 1};
    grid-row: span ${props => props.$rowSpan || 1};
    
    @media (max-width: 1024px) {
        grid-column: span ${props => (props.$colSpan === 3 || props.$colSpan === 4) ? 2 : 1};
        grid-row: span 1;
        min-height: 300px;
    }
    
    @media (max-width: 600px) {
        grid-column: span 1;
        min-height: 280px;
    }
`;

const BentoCard = styled.div<{ $brandColor: string }>`
    position: relative;
    background: #ffffff;
    height: 100%;
    width: 100%;
    padding: 40px;
    border-radius: 36px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    
    /* Apple soft shadow & border */
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02);
    border: 1px solid rgba(0, 0, 0, 0.04);
    
    transform-style: preserve-3d;
    will-change: transform;
    cursor: default;
    
    /* Subtle metallic sheen that activates on hover */
    &::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle at center, ${props => props.$brandColor}15 0%, transparent 60%);
        opacity: 0;
        transition: opacity 0.6s ease;
        pointer-events: none;
        z-index: 0;
    }

    @media (hover: hover) {
        &:hover {
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.06);
            border-color: rgba(255, 68, 0, 0.3);

            &::before {
                opacity: 1;
            }
            
            .bento-icon {
                transform: scale(1.1) translateZ(30px);
                color: ${props => props.$brandColor};
            }
        }
    }
`;

const ContentWrapper = styled.div`
    position: relative;
    z-index: 1;
    transform: translateZ(20px);
`;

const TopRightIcon = styled.i`
    position: absolute;
    top: 40px;
    right: 40px;
    font-size: 2.5rem;
    color: rgba(0,0,0,0.05); /* Light Apple Gray */
    transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
    transform-style: preserve-3d;
`;

const Tag = styled.span`
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #ff4400;
    margin-bottom: 12px;
    display: block;
`;

const Title = styled.h3`
    font-size: 2rem;
    font-weight: 700;
    color: #111111;
    margin: 0 0 12px 0;
    letter-spacing: -0.03em;
    line-height: 1.1;
`;

const Description = styled.p`
    font-size: 1.1rem;
    color: #4a4a4f;
    line-height: 1.5;
    margin: 0;
    max-width: 90%;
`;


// ==========================================
// DATA
// ==========================================

const TECH_DATA = [
    {
        tag: "Frontend",
        title: "React & Beyond.",
        desc: "We engineer lightning-fast interfaces using React and modern server-side rendering for optimal Core Web Vitals.",
        icon: "fab fa-react",
        color: "#ff4400", // Orange
        colSpan: 2,
        rowSpan: 1
    },
    {
        tag: "Motion",
        title: "Fluid Dynamics.",
        desc: "Hardware-accelerated animations powered by GSAP. No jank, pure buttery smoothness at 60fps.",
        icon: "fas fa-fan",
        color: "#ff8800", // Light orange
        colSpan: 1,
        rowSpan: 1
    },
    {
        tag: "Commerce",
        title: "Headless CMS.",
        desc: "Decoupled architecture utilizing Shopify Plus and custom Node.js middleware for infinite scale.",
        icon: "fab fa-shopify",
        color: "#ff4400", // Orange
        colSpan: 1,
        rowSpan: 2 // Tall box
    },
    {
        tag: "Backend",
        title: "Cloud Native.",
        desc: "Serverless edge functions and distributed databases ensuring zero downtime globally.",
        icon: "fas fa-cloud",
        color: "#ff8800", // Light orange
        colSpan: 1,
        rowSpan: 1
    },
    {
        tag: "Analytics",
        title: "Data Dominance.",
        desc: "Custom tracking pixels, server-side tagging, and real-time BI dashboards.",
        icon: "fas fa-chart-pie",
        color: "#ff4400", // Orange
        colSpan: 2,
        rowSpan: 1
    }
];

// ==========================================
// COMPONENT
// ==========================================

const TechStack: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(".bento-header",
                { y: 40, opacity: 0 },
                {
                    y: 0, opacity: 1,
                    duration: 1, ease: "power3.out",
                    scrollTrigger: { trigger: sectionRef.current, start: "top 75%" }
                }
            );

            gsap.fromTo(".bento-card-container",
                { y: 80, opacity: 0, scale: 0.95 },
                {
                    y: 0, opacity: 1, scale: 1,
                    duration: 1.2,
                    stagger: 0.1,
                    ease: "expo.out",
                    scrollTrigger: { trigger: sectionRef.current, start: "top 70%" }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
        const cardContainer = cardRefs.current[index];
        if (!cardContainer) return;
        const card = cardContainer.querySelector('.inner-bento') as HTMLDivElement;
        if (!card) return;

        const rect = cardContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            scale: 1.01,
            duration: 0.4,
            ease: 'power2.out',
            transformPerspective: 1500,
            transformOrigin: 'center center'
        });
    };

    const handleMouseLeave = (index: number) => {
        const cardContainer = cardRefs.current[index];
        if (!cardContainer) return;
        const card = cardContainer.querySelector('.inner-bento') as HTMLDivElement;
        if (!card) return;

        gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            duration: 0.8,
            ease: 'elastic.out(1, 0.5)'
        });
    };

    return (
        <Section id="tech-stack" ref={sectionRef}>
            <Container>
                <Header className="bento-header">
                    <h2>Digital Infrastructure</h2>
                    <h3 className="main-title">
                        Engineered with <span>precision.</span>
                    </h3>
                </Header>

                <BentoGrid>
                    {TECH_DATA.map((item, index) => (
                        <BentoCardContainer
                            key={index}
                            className="bento-card-container"
                            $colSpan={item.colSpan}
                            $rowSpan={item.rowSpan}
                            ref={el => { cardRefs.current[index] = el; }}
                            onMouseMove={(e) => handleMouseMove(e, index)}
                            onMouseLeave={() => handleMouseLeave(index)}
                        >
                            <BentoCard className="inner-bento" $brandColor={item.color}>
                                <TopRightIcon className={`bento-icon ${item.icon}`} />
                                <ContentWrapper>
                                    <Tag>{item.tag}</Tag>
                                    <Title>{item.title}</Title>
                                    <Description>{item.desc}</Description>
                                </ContentWrapper>
                            </BentoCard>
                        </BentoCardContainer>
                    ))}
                </BentoGrid>
            </Container>
        </Section>
    );
};

export default TechStack;
