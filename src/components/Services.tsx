import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import styled from 'styled-components';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// STYLED COMPONENTS (Sticky Stacking Layout)
// ==========================================

const Section = styled.section`
    background: #f8f9fa; /* Subtle off-white for premium contrast against pure white cards */
    padding: 100px 0 0 0;
    position: relative;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    
    /* 
       Premium Creative Transition: 
       Overlapping Card Arch Architecture (Pulls the White Section UP to physically overlap the Black Section)
    */
    border-top-left-radius: 60px;
    border-top-right-radius: 60px;
    margin-top: -60px;
    z-index: 30; /* Restored to ensure it overlaps Stats and hides upward shadows */
    box-shadow: 0 -30px 80px rgba(0, 0, 0, 0.6);
`;

const HeaderContainer = styled.div`
    text-align: center;
    padding-bottom: 20px;
    position: relative;
    z-index: 2;
    
    h2 {
        font-size: clamp(3rem, 6vw, 5rem);
        font-weight: 800;
        color: #111111;
        letter-spacing: -0.04em;
        line-height: 1.05;
        margin: 0;
        
        span {
            /* Text gradient */
            background: linear-gradient(135deg, #ff4400, #ff8800);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }

    p {
        font-size: 1.2rem;
        color: #666;
        margin-top: 20px;
        max-width: 600px;
        margin-inline: auto;
    }
`;

const StackingContainer = styled.div`
    position: relative;
    padding-bottom: 10vh; /* Extra padding after the final card */
`;

const CardWrapper = styled.div<{ $index: number }>`
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    /* The offset ensures that cards peeking from underneath build a visual hierarchy */
    padding-top: calc(8vh + ${props => props.$index * 30}px);
    width: 100%;
    
    /* On mobile, disable the sticky stack and rely on natural flow */
    @media (max-width: 1024px) {
        position: relative;
        height: auto;
        padding-top: 40px;
        padding-bottom: 20px;
    }
`;

const CardInner = styled.div`
    width: 100%;
    max-width: 1200px;
    min-height: 500px;
    margin: 0 20px;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(40px);
    -webkit-backdrop-filter: blur(40px);
    border: 1px solid rgba(255, 255, 255, 0.9);
    border-radius: 40px;
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 1);
    display: flex;
    transform-origin: top center;
    overflow: hidden;
    position: relative;
    will-change: transform, opacity, filter;

    @media (max-width: 1024px) {
        flex-direction: column;
        border-radius: 32px;
        min-height: auto;
    }
`;

const DynamicGlow = styled.div`
    position: absolute;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(255,68,0,0.08) 0%, transparent 70%);
    top: -300px;
    right: -200px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
`;

const CardContent = styled.div`
    flex: 1;
    padding: 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    z-index: 2;

    @media (max-width: 1024px) {
        padding: 40px 30px;
    }
`;

const TopMeta = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 30px;
`;

const IconBox = styled.div`
    width: 64px;
    height: 64px;
    border-radius: 20px;
    background: linear-gradient(135deg, #ff4400, #ff8800);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 15px 30px rgba(255, 68, 0, 0.25);
    
    i {
        font-size: 1.8rem;
        color: #fff;
    }

    @media (max-width: 1024px) {
        width: 50px;
        height: 50px;
        border-radius: 16px;
        i { font-size: 1.4rem; }
    }
`;

const IdText = styled.span`
    font-size: 1.2rem;
    font-weight: 700;
    color: #ff4400;
    letter-spacing: 0.1em;
`;

const Title = styled.h3`
    font-size: clamp(2.5rem, 4vw, 3.5rem);
    font-weight: 800;
    color: #111;
    margin: 0 0 30px 0;
    letter-spacing: -0.03em;
    line-height: 1.1;
`;

const Description = styled.p`
    font-size: 1.25rem;
    line-height: 1.6;
    color: #555;
    margin: 0 0 40px 0;
    max-width: 500px;

    @media (max-width: 1024px) {
        font-size: 1.1rem;
        margin: 0 0 30px 0;
    }
`;

const TagsRow = styled.div`
    display: flex;
    gap: 12px;
    flex-wrap: wrap;

    span {
        font-size: 0.9rem;
        color: #111;
        padding: 8px 20px;
        border-radius: 100px;
        background: rgba(0, 0, 0, 0.04);
        font-weight: 600;
        transition: all 0.3s ease;
        border: 1px solid transparent;

        &:hover {
            background: #ffffff;
            color: #ff4400;
            border-color: rgba(255, 68, 0, 0.2);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
            transform: translateY(-2px);
        }
    }
`;

const VisualSection = styled.div<{ $index: number }>`
    flex: 0.8;
    background: #fdfdfd;
    position: relative;
    border-left: 1px solid rgba(0,0,0,0.03);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    @media (max-width: 1024px) {
        display: none;
    }
`;

// Creates a neat geometric motif per card
const GeometricMotif = styled.div<{ $index: number }>`
    width: 250px;
    height: 250px;
    border-radius: ${props => props.$index % 2 === 0 ? '50%' : '30px'};
    background: linear-gradient(135deg, rgba(255,68,0,0.1), rgba(255,136,0,0.1));
    position: relative;
    border: 1px solid rgba(255,68,0,0.2);
    
    /* Add an inner shape for 3D look */
    &::after {
        content: '';
        position: absolute;
        inset: 20px;
        border-radius: inherit;
        background: linear-gradient(135deg, #ff4400, #ff8800);
        opacity: 0.1;
        transform: rotate(15deg);
    }
`;

const GiantNumber = styled.div`
    position: absolute;
    bottom: -20px;
    right: 20px;
    font-size: 16rem;
    font-weight: 900;
    color: rgba(0, 0, 0, 0.02);
    line-height: 1;
    z-index: 0;
    pointer-events: none;
`;

// ==========================================
// DATA
// ==========================================

const SERVICES_DATA = [
    {
        id: "01",
        title: "Social & Ads",
        desc: "We align your organic social strategy with high-ROI ad campaigns to scale your revenue seamlessly. Leveraging data-driven insights to maximize every dollar spent.",
        icon: "fas fa-chart-line",
        tags: ["Paid Social", "PPC", "Content Strategy"]
    },
    {
        id: "02",
        title: "Web Engineering",
        desc: "Lightning fast, custom applications built to convert. No rigid templates, just pure performance engineered from the ground up for maximum impact.",
        icon: "fas fa-laptop-code",
        tags: ["React & Node", "Headless Commerce", "Custom Tech"]
    },
    {
        id: "03",
        title: "Brand Design",
        desc: "High-fidelity design systems, marks, and user interfaces that exponentially elevate your digital presence and build lasting trust.",
        icon: "fas fa-pen-nib",
        tags: ["Brand Identity", "UI/UX", "Design Systems"]
    },
    {
        id: "04",
        title: "SEO Dynamics",
        desc: "Deep technical optimization and targeted content strategies designed to secure absolute dominance in search rankings and drive qualified organic traffic.",
        icon: "fas fa-search",
        tags: ["Technical SEO", "Audits", "Organic Growth"]
    }
];

// ==========================================
// COMPONENT
// ==========================================

const Services: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const wrappersRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        // We only want the stacking scroll effect on Desktop where heights make sense
        let ctx = gsap.context(() => {
            const isDesktop = window.innerWidth > 1024;
            
            if (isDesktop) {
                // Animate each card wrapper as it scrolls
                wrappersRef.current.forEach((wrapper, index) => {
                    if (!wrapper) return;
                    
                    const cardInner = wrapper.querySelector('.card-inner');
                    const geometric = wrapper.querySelector('.geometric-motif');
                    if (!cardInner) return;

                    // Float animation for the geometric motif
                    if (geometric) {
                        gsap.to(geometric, {
                            y: -30,
                            rotation: 10,
                            ease: "sine.inOut",
                            duration: 3,
                            yoyo: true,
                            repeat: -1,
                            delay: index * 0.2
                        });
                    }

                    // If it's the last card, we don't shrink it immediately
                    if (index === SERVICES_DATA.length - 1) return;

                    // As we scroll exactly ONE card height further down (100vh),
                    // the CURRENT card should shrink and darken, pushed back by the next card.
                    gsap.to(cardInner, {
                        scale: 0.92,
                        opacity: 0.4,
                        y: -30,
                        scrollTrigger: {
                            trigger: wrapper,
                            start: "top top", 
                            end: "+=100%", // Over the course of scrolling 100vh past the sticky trigger
                            scrub: true,
                            invalidateOnRefresh: true,
                        }
                    });
                });
            } else {
                // Mobile fade in animation
                gsap.fromTo('.card-inner', 
                    { y: 50, opacity: 0 },
                    { 
                        y: 0, opacity: 1, 
                        duration: 0.8,
                        stagger: 0.2,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: ".stacking-container",
                            start: "top 80%",
                        }
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <Section id="services" ref={sectionRef}>
            <HeaderContainer>
                <h2>
                    Specialized <span>Capabilities.</span>
                </h2>
                <p>Engineered to scale revenue, elevate design, and secure absolute market dominance.</p>
            </HeaderContainer>

            <StackingContainer className="stacking-container">
                {SERVICES_DATA.map((service, index) => (
                    <CardWrapper 
                        key={index} 
                        $index={index}
                        ref={el => { wrappersRef.current[index] = el; }}
                    >
                        <CardInner className="card-inner">
                            <DynamicGlow />
                            <CardContent>
                                <TopMeta>
                                    <IconBox>
                                        <i className={service.icon}></i>
                                    </IconBox>
                                    <IdText>{service.id}.</IdText>
                                </TopMeta>
                                
                                <Title>{service.title}</Title>
                                <Description>{service.desc}</Description>
                                
                                <TagsRow>
                                    {service.tags.map((t, idx) => (
                                        <span key={idx}>{t}</span>
                                    ))}
                                </TagsRow>
                            </CardContent>

                            <VisualSection $index={index}>
                                <GeometricMotif className="geometric-motif" $index={index} />
                                <GiantNumber>{service.id}</GiantNumber>
                            </VisualSection>
                        </CardInner>
                    </CardWrapper>
                ))}
            </StackingContainer>
        </Section>
    );
};

export default Services;
