import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import styled from 'styled-components';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// STYLED COMPONENTS (Stealth Dark Architecture)
// ==========================================

const Section = styled.section`
    background: #050505;
    padding: 210px 20px 250px; /* Increased top padding to compensate for margin shift */
    margin-top: -60px; /* Pulls it up under Stats */
    position: relative;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #ffffff;
    z-index: 10; /* Sits beneath Stats (which should be 20) */
`;

const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
`;

const HeaderContainer = styled.div`
    text-align: center;
    margin-bottom: 120px;
    
    h2 {
        font-size: clamp(3.5rem, 8vw, 6rem);
        font-weight: 800;
        color: #ffffff;
        letter-spacing: -0.04em;
        line-height: 1.05;
        margin: 0;

        span {
            display: inline-block;
            background: linear-gradient(135deg, #ff4400, #ff8800);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }
`;

const StackContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    /* Massive gap forces the user to scroll heavily between cards, giving time for the parallax */
    gap: 15vh; 
    align-items: center;
    width: 100%;
`;

// The sticky anchor that holds the card in place.
const CardWrapper = styled.div`
    position: sticky;
    top: 15vh; /* Stops scrolling when it reaches this point */
    width: 100%;
    /* Extra padding allows GSAP animations to run without hitting container limits */
    padding-bottom: 20px;
    display: flex;
    justify-content: center;
    will-change: transform;
`;

// The physical card that scales down
const MonolithCard = styled.div`
    width: 100%;
    max-width: 1000px;
    height: 70vh;
    min-height: 500px;
    max-height: 800px;
    background: rgba(15, 15, 18, 0.95);
    background-image: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 40px;
    box-shadow: 0 40px 100px rgba(0, 0, 0, 0.9), inset 0 2px 0 rgba(255, 255, 255, 0.05);
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transform-origin: top center;
    
    @media (max-width: 768px) {
        height: 60vh;
        border-radius: 24px;
    }
`;

// Represents the massive project image area
const GlassCanvas = styled.div`
    position: absolute;
    top: 2%;
    left: 1%;
    right: 1%;
    bottom: 35%;
    border-radius: 36px 36px 20px 20px;
    background: #000000;
    overflow: hidden;
    z-index: 1;
    border: 1px solid rgba(255, 255, 255, 0.04);
    
    @media (max-width: 768px) {
        bottom: 40%;
        border-radius: 20px;
    }
`;

// Ambient lighting trapped inside the canvas
const AmbientNebula = styled.div<{ $color: string, $delay: number }>`
    position: absolute;
    background: ${props => props.$color};
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.35;
    animation: nebulaDrift 15s ease-in-out infinite alternate;
    animation-delay: ${props => props.$delay}s;

    @keyframes nebulaDrift {
        0% { transform: translate(0, 0) scale(1) rotate(0deg); }
        50% { transform: translate(50px, -30px) scale(1.3) rotate(180deg); }
        100% { transform: translate(-20px, 40px) scale(0.9) rotate(360deg); }
    }
`;

// Foreground content structure
const ContentArea = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 35%;
    padding: 0 50px 40px;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    
    @media (max-width: 768px) {
        height: 40%;
        padding: 0 24px 24px;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        gap: 20px;
    }
`;

const Typography = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    
    h3 {
        font-size: clamp(2rem, 4vw, 3rem);
        font-weight: 700;
        color: #ffffff;
        margin: 0;
        letter-spacing: -0.03em;
        line-height: 1.1;
    }

    p {
        font-size: 1.1rem;
        color: rgba(255, 255, 255, 0.6);
        margin: 0;
        font-weight: 400;
    }
`;

const TagRow = styled.div`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;

    span {
        font-family: 'Inter', sans-serif;
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.8);
        padding: 6px 14px;
        border-radius: 100px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        font-weight: 500;
        letter-spacing: 0.02em;
    }
`;

const ActionButton = styled.div`
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 0.15);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    cursor: pointer;

    i {
        font-size: 1.2rem;
        color: #ffffff;
        transition: transform 0.4s ease;
    }
    
    &:hover {
        background: #ff4400;
        border-color: #ff4400;
        box-shadow: 0 0 30px rgba(255, 68, 0, 0.4);
        transform: scale(1.1);
        
        i {
            transform: rotate(-45deg); /* Arrow points up and right aggressively */
        }
    }
    
    @media (max-width: 768px) {
        align-self: flex-end;
    }
`;

// ==========================================
// DATA
// ==========================================

const PROJECTS = [
    {
        title: "Lumina Engine",
        client: "Fintech Enterprise",
        tags: ["React", "Blockchain", "UI API"],
        colors: ["#6366f1", "#a855f7"]
    },
    {
        title: "Aura Commerce",
        client: "Luxury Retailer",
        tags: ["Shopify Plus", "Next.js", "ThreeJS"],
        colors: ["#ec4899", "#f43f5e"]
    },
    {
        title: "Nexus Dashboard",
        client: "SaaS Analytics",
        tags: ["Vue", "Node", "Real-time"],
        colors: ["#14b8a6", "#3b82f6"]
    },
    {
        title: "Equinox Protocol",
        client: "Defi Startup",
        tags: ["Web3", "Solidity", "Design System"],
        colors: ["#f59e0b", "#ef4444"]
    }
];

// ==========================================
// COMPONENT
// ==========================================

const Works: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Select all card wrappers
            const wrappers = gsap.utils.toArray<HTMLElement>('.monolith-card-wrapper');
            
            wrappers.forEach((wrapper, index) => {
                const innerCard = wrapper.querySelector('.monolith-inner');
                if (!innerCard) return;

                // The last card does not get scaled down
                if (index === wrappers.length - 1) return;
                
                // The physics logic:
                // When the current card hits its sticky point ("top 15%"), the timeline starts.
                // It completes when the NEXT card hits its sticky point.
                // During this scroll distance, the current card visually sinks backward.
                ScrollTrigger.create({
                    trigger: wrapper,
                    start: "top 15vh", 
                    endTrigger: wrappers[index + 1],
                    end: "top 25vh", // Finish shrinking before the next card fully overlaps
                    scrub: 0.5, // 0.5s lag for smooth butter
                    animation: gsap.to(innerCard, {
                        scale: 0.9,
                        opacity: 0.4,
                        y: -40, // physically shift up into the background
                        transformOrigin: "top center",
                        ease: "none" // Linear mapping to scroll position
                    })
                });
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <Section id="work" ref={sectionRef}>
            <Container>
                <HeaderContainer>
                    <h2>
                        Selected <span>Works.</span>
                    </h2>
                </HeaderContainer>

                <StackContainer>
                    {PROJECTS.map((project, i) => (
                        <CardWrapper key={i} className="monolith-card-wrapper" style={{ zIndex: i }}>
                            <MonolithCard className="monolith-inner">
                                <GlassCanvas>
                                    <AmbientNebula
                                        $color={project.colors[0]}
                                        $delay={0}
                                        style={{ width: '30vh', height: '30vh', top: '10%', left: '20%' }}
                                    />
                                    <AmbientNebula
                                        $color={project.colors[1]}
                                        $delay={-7.5}
                                        style={{ width: '40vh', height: '40vh', bottom: '-10%', right: '10%' }}
                                    />
                                </GlassCanvas>

                                <ContentArea>
                                    <Typography>
                                        <TagRow>
                                            {project.tags.map((tag, idx) => (
                                                <span key={idx}>{tag}</span>
                                            ))}
                                        </TagRow>
                                        <h3>{project.title}</h3>
                                        <p>{project.client}</p>
                                    </Typography>

                                    <ActionButton>
                                        <i className="fas fa-arrow-right"></i>
                                    </ActionButton>
                                </ContentArea>
                            </MonolithCard>
                        </CardWrapper>
                    ))}
                </StackContainer>
            </Container>
        </Section>
    );
};

export default Works;
