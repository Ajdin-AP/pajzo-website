import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import styled from 'styled-components';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// STYLED COMPONENTS (Apple Style White Theme)
// ==========================================

const Section = styled.section`
    background: #ffffff;
    /* We don't pad top/bottom heavily because ScrollTrigger pinning handles spacing naturally */
    position: relative;
    overflow: hidden;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

// This container dictates the height of the pinning effect
const PinContainer = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;

    @media (max-width: 768px) {
        height: auto;
        padding-top: 100px;
        padding-bottom: 100px;
        overflow: visible;
    }
`;

const HeaderContainer = styled.div`
    padding: 0 5vw;
    margin-bottom: 60px;
    z-index: 10;
    
    h2 {
        font-size: clamp(3rem, 6vw, 5rem);
        font-weight: 700;
        color: #111111;
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

// The horizontal track that actually moves
const HorizontalTrack = styled.div`
    display: flex;
    gap: 40px;
    padding: 0 5vw;
    /* Extra padding on the right so the last card doesn't touch the edge of the screen */
    padding-right: 30vw; 
    width: max-content;
    will-change: transform;

    @media (max-width: 768px) {
        width: 100%;
        padding-right: 5vw; /* Normal padding */
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        gap: 20px;
        -webkit-overflow-scrolling: touch;
        /* Hide scrollbar for a cleaner look */
        &::-webkit-scrollbar {
            display: none;
        }
        scrollbar-width: none;
    }
`;

const ProjectCard = styled.div`
    width: 600px;
    height: 480px;
    background: #ffffff;
    border-radius: 36px;
    border: 1px solid rgba(0, 0, 0, 0.05);
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02);
    transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);

    @media (max-width: 768px) {
        width: 85vw; /* On mobile, take up most of width */
        height: 60vh;
        border-radius: 24px;
        padding: 30px;
        scroll-snap-align: center;
        flex-shrink: 0;
    }

    &:hover {
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.06);
        border-color: rgba(255, 68, 0, 0.3);
        transform: translateY(-10px);

        .mock-image {
            transform: scale(1.05);
        }

        .project-arrow {
            transform: translate(5px, -5px);
            color: #ffffff;
            background: linear-gradient(135deg, #ff4400, #ff8800);
            box-shadow: 0 8px 24px rgba(255, 68, 0, 0.25);
            i {
                color: #ffffff;
            }
        }
    }
`;

// Placeholder for actual project imagery
const MockImageContainer = styled.div`
    position: absolute;
    top: 5%;
    left: 5%;
    right: 5%;
    bottom: 35%; /* Leave room for text */
    background: linear-gradient(135deg, #f5f5f7 0%, #e8e8ed 100%);
    border-radius: 24px;
    overflow: hidden;
    z-index: 1;

    /* A subtle inner shadow to make it feel inset */
    box-shadow: inset 0 2px 10px rgba(0,0,0,0.03);
`;

// Abstract shapes for the placeholder images to feel active
const AbstractShape = styled.div<{ $color: string, $delay: number }>`
    position: absolute;
    background: ${props => props.$color};
    border-radius: 50%;
    filter: blur(40px);
    opacity: 0.5;
    animation: floatShape 10s ease-in-out infinite alternate;
    animation-delay: ${props => props.$delay}s;

    @keyframes floatShape {
        0% { transform: translate(0, 0) scale(1); }
        100% { transform: translate(30px, 30px) scale(1.2); }
    }
`;

const ContentBox = styled.div`
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
`;

const TextContent = styled.div`
    h3 {
        font-size: 2rem;
        font-weight: 700;
        color: #111111;
        margin: 0 0 10px 0;
        letter-spacing: -0.03em;
    }

    p {
        font-size: 1.1rem;
        color: #4a4a4f;
        margin: 0;
        font-weight: 400;
    }

    @media (max-width: 768px) {
        h3 { font-size: 1.5rem; }
        p { font-size: 1rem; }
    }
`;

const TagRow = styled.div`
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    flex-wrap: wrap;

    span {
        font-family: 'Inter', sans-serif;
        font-size: 0.85rem;
        color: #111111;
        padding: 8px 16px;
        border-radius: 100px;
        background: #f8f9fa;
        border: 1px solid rgba(0, 0, 0, 0.05);
        font-weight: 500;
        transition: background 0.3s ease;
    }
`;

const ArrowBox = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #f5f5f7;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    border: 1px solid rgba(0, 0, 0, 0.03);

    i {
        font-size: 1.2rem;
        color: #111111;
        transition: all 0.3s ease;
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
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const track = trackRef.current;
            if (!track) return;

            // Only apply GSAP pinning on desktop. Mobile uses native swipe CSS.
            let mm = gsap.matchMedia();

            mm.add("(min-width: 769px)", () => {
                const getScrollAmount = () => {
                    let trackWidth = track.scrollWidth;
                    return -(trackWidth - window.innerWidth);
                };

                const tween = gsap.to(track, {
                    x: getScrollAmount,
                    ease: "none"
                });

                ScrollTrigger.create({
                    trigger: sectionRef.current,
                    start: "top top",
                    end: () => `+=${getScrollAmount() * -1}`,
                    pin: true,
                    animation: tween,
                    scrub: 1,
                    invalidateOnRefresh: true,
                });
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <Section id="work" ref={sectionRef}>
            <PinContainer>

                <HeaderContainer>
                    <h2>
                        Selected <span>Works.</span>
                    </h2>
                </HeaderContainer>

                <HorizontalTrack ref={trackRef}>
                    {PROJECTS.map((project, i) => (
                        <ProjectCard key={i}>

                            <MockImageContainer className="mock-image">
                                {/* Abstract gradient blobs serving as mock project imagery */}
                                <AbstractShape
                                    $color={project.colors[0]}
                                    $delay={0}
                                    style={{ width: '150px', height: '150px', top: '10%', left: '20%' }}
                                />
                                <AbstractShape
                                    $color={project.colors[1]}
                                    $delay={1.5}
                                    style={{ width: '200px', height: '200px', bottom: '10%', right: '10%' }}
                                />
                            </MockImageContainer>

                            <ContentBox>
                                <TextContent>
                                    <TagRow>
                                        {project.tags.map((tag, idx) => (
                                            <span key={idx}>{tag}</span>
                                        ))}
                                    </TagRow>
                                    <h3>{project.title}</h3>
                                    <p>{project.client}</p>
                                </TextContent>

                                <ArrowBox className="project-arrow">
                                    <i className="fas fa-arrow-right"></i>
                                </ArrowBox>
                            </ContentBox>

                        </ProjectCard>
                    ))}
                </HorizontalTrack>

            </PinContainer>
        </Section>
    );
};

export default Works;
