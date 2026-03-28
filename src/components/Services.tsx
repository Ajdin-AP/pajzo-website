import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import styled from 'styled-components';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// STYLED COMPONENTS (Interactive White Accordion)
// ==========================================

const Section = styled.section`
    background: #ffffff;
    padding: 150px 20px;
    position: relative;
    overflow: hidden;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    
    /* 
       Premium Creative Transition: 
       Overlapping Card Arch Architecture (Pulls the White Section UP to physically overlap the Black Section)
    */
    border-top-left-radius: 60px;
    border-top-right-radius: 60px;
    margin-top: -60px;
    z-index: 10;
    box-shadow: 0 -30px 80px rgba(0, 0, 0, 0.6);
`;

const Container = styled.div`
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Header = styled.div`
    text-align: center;
    margin-bottom: 80px;
    
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
`;

const AccordionContainer = styled.div`
    display: flex;
    width: 100%;
    height: 600px; /* Fixed height for the accordion */
    gap: 16px;
    perspective: 2000px;

    /* Completely hide the accordion on mobile/tablets */
    @media (max-width: 1024px) {
        display: none;
    }
`;

// Represents a single accordion slice
const Panel = styled.div<{ $isActive: boolean }>`
    position: relative;
    height: 100%;
    background: ${props => props.$isActive ? '#ffffff' : '#f0f0f3'};
    border-radius: 40px;
    border: 1px solid ${props => props.$isActive ? 'rgba(255, 68, 0, 0.25)' : 'rgba(0, 0, 0, 0.03)'};
    overflow: hidden;
    cursor: pointer;
    
    /* Smooth flex interpolation */
    flex: ${props => props.$isActive ? '6' : '1'};
    min-width: ${props => props.$isActive ? '45%' : '100px'};
    
    transition: flex 0.8s cubic-bezier(0.16, 1, 0.3, 1), 
                min-width 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                background 0.5s ease, 
                border-color 0.5s ease,
                box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    
    box-shadow: ${props => props.$isActive
        ? '0 40px 80px rgba(255, 68, 0, 0.08), 0 10px 30px rgba(0, 0, 0, 0.04)'
        : '0 4px 12px rgba(0, 0, 0, 0.02)'};

    &:hover {
        background: ${props => props.$isActive ? '#ffffff' : '#eaeaea'};
        transform: ${props => props.$isActive ? 'none' : 'translateY(-2px)'};
    }

    /* Ambient glow for active card */
    &::before {
        content: '';
        position: absolute;
        top: -30%;
        left: -30%;
        width: 160%;
        height: 160%;
        background: radial-gradient(circle, rgba(255,68,0,0.06) 0%, transparent 60%);
        opacity: ${props => props.$isActive ? 1 : 0};
        transition: opacity 1s ease;
        pointer-events: none;
        z-index: 0;
    }
`;

// Container for the fully expanded view
const ActiveContent = styled.div<{ $isActive: boolean }>`
    position: absolute;
    inset: 0;
    padding: 50px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    opacity: ${props => props.$isActive ? 1 : 0};
    visibility: ${props => props.$isActive ? 'visible' : 'hidden'};
    transition: opacity 0.6s ease ${props => props.$isActive ? '0.4s' : '0s'},
                visibility 0.6s;
    z-index: 2;
    min-width: 500px;
`;

// Container for the collapsed sidebar view
const InactiveContent = styled.div<{ $isActive: boolean }>`
    position: absolute;
    inset: 0;
    padding: 40px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    opacity: ${props => props.$isActive ? 0 : 1};
    visibility: ${props => props.$isActive ? 'hidden' : 'visible'};
    transition: opacity 0.4s ease, visibility 0.4s;
    z-index: 2;
`;

const ActiveIconBox = styled.div`
    width: 76px;
    height: 76px;
    border-radius: 24px;
    background: linear-gradient(135deg, #ff4400, #ff8800);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 15px 30px rgba(255, 68, 0, 0.35);
    
    i {
        font-size: 2rem;
        color: #fff;
    }
`;

const InactiveIconBox = styled.div`
    width: 60px;
    height: 60px;
    border-radius: 20px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 16px rgba(0,0,0,0.04);

    i {
        font-size: 1.5rem;
        color: #111;
        opacity: 0.6;
    }
`;

const ActiveHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 25px;
`;

const ActiveTitle = styled.h3`
    font-size: 2.2rem;
    font-weight: 800;
    color: #111;
    margin: 0;
    letter-spacing: -0.03em;
`;

const InactiveTitle = styled.h3`
    font-size: 1.5rem;
    font-weight: 700;
    color: #111;
    margin: 0;
    letter-spacing: -0.02em;
    opacity: 0.4;
    
    /* Elegant vertical text rendering */
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    margin-top: 50px;
    white-space: nowrap;
`;

const ActiveBody = styled.div`
    display: flex;
    flex-direction: column;
    gap: 30px;
    max-width: 85%;
`;   

const Description = styled.p`
    font-size: 1.25rem;
    line-height: 1.6;
    color: #4a4a4f;
    margin: 0;
    font-weight: 400;
`;

const Tags = styled.div`
    display: flex;
    gap: 12px;
    flex-wrap: wrap;

    span {
        font-family: 'Inter', sans-serif;
        font-size: 0.9rem;
        color: #ff4400;
        padding: 8px 18px;
        border-radius: 100px;
        background: rgba(255, 68, 0, 0.06);
        border: 1px solid rgba(255, 68, 0, 0.15);
        font-weight: 600;
        transition: all 0.3s ease;
        
        &:hover {
            background: #ff4400;
            color: #ffffff;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 68, 0, 0.2);
        }
    }
`;

const NumberBadge = styled.div`
    position: absolute;
    bottom: 30px;
    right: 40px;
    font-size: 8rem;
    font-weight: 900;
    color: rgba(0,0,0,0.02);
    line-height: 1;
    user-select: none;
    z-index: 1;
`;

// ==========================================
// MOBILE STYLED COMPONENTS (New Stacked Protocol)
// ==========================================

const MobileContainer = styled.div`
    display: none;
    width: 100%;
    flex-direction: column;
    gap: 30px;
    padding: 0 20px;

    @media (max-width: 1024px) {
        display: flex;
    }
`;

const MobileCard = styled.div`
    background: #ffffff;
    border-radius: 32px;
    border: 1px solid rgba(0, 0, 0, 0.05);
    padding: 40px 30px;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03);
    
    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 6px;
        background: linear-gradient(90deg, #ff4400, #ff8800);
        opacity: 0.9;
    }
`;

const MobileCardHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 25px;
    position: relative;
    z-index: 2;
`;

const MobileTitle = styled.h3`
    font-size: 1.6rem;
    font-weight: 800;
    color: #111111;
    margin: 0;
    letter-spacing: -0.02em;
`;

const MobileDescription = styled.p`
    font-size: 1.15rem;
    line-height: 1.6;
    color: #4a4a4f;
    margin: 0 0 25px 0;
    font-weight: 400;
    position: relative;
    z-index: 2;
`;

const MobileNumberBadge = styled.div`
    position: absolute;
    bottom: -10px;
    right: 15px;
    font-size: 6rem;
    font-weight: 900;
    color: rgba(0,0,0,0.03);
    user-select: none;
    line-height: 1;
    z-index: 1;
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
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Creative 3D fan-out animation for desktop panels
            gsap.fromTo(".accordion-panel",
                { x: 100, opacity: 0, rotationY: 15 },
                {
                    x: 0, opacity: 1, rotationY: 0,
                    duration: 1.2,
                    stagger: 0.15,
                    ease: "expo.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 75%"
                    }
                }
            );

            // Staggered reveal for mobile cards
            gsap.fromTo(".mobile-service-card",
                { y: 50, opacity: 0 },
                {
                    y: 0, opacity: 1,
                    duration: 1.2,
                    stagger: 0.25,
                    ease: "expo.out",
                    scrollTrigger: {
                        trigger: ".mobile-services-container",
                        start: "top 85%",
                    }
                }
            );

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <Section id="services" ref={sectionRef}>
            <Container>
                <Header>
                    <h2>
                        Specialized <span>Capabilities.</span>
                    </h2>
                </Header>

                <AccordionContainer>
                    {SERVICES_DATA.map((service, index) => {
                        const isActive = index === activeIndex;
                        return (
                            <Panel
                                key={index}
                                className="accordion-panel"
                                $isActive={isActive}
                                onMouseEnter={() => setActiveIndex(index)}
                            >
                                {/* Inactive Sidebar View */}
                                <InactiveContent $isActive={isActive}>
                                    <InactiveIconBox>
                                        <i className={service.icon}></i>
                                    </InactiveIconBox>
                                    <InactiveTitle>{service.title}</InactiveTitle>
                                </InactiveContent>

                                {/* Active Expanded View */}
                                <ActiveContent $isActive={isActive}>
                                    <div>
                                        <ActiveHeader>
                                            <ActiveIconBox>
                                                <i className={service.icon}></i>
                                            </ActiveIconBox>
                                            <ActiveTitle>{service.title}</ActiveTitle>
                                        </ActiveHeader>

                                        <ActiveBody style={{ marginTop: '40px' }}>
                                            <Description>{service.desc}</Description>
                                            <Tags>
                                                {service.tags.map((t, idx) => (
                                                    <span key={idx}>{t}</span>
                                                ))}
                                            </Tags>
                                        </ActiveBody>
                                    </div>

                                    <NumberBadge>
                                        {service.id}
                                    </NumberBadge>
                                </ActiveContent>
                            </Panel>
                        );
                    })}
                </AccordionContainer>

                {/* Mobile Specific Layout */}
                <MobileContainer className="mobile-services-container">
                    {SERVICES_DATA.map((service, index) => (
                        <MobileCard key={index} className="mobile-service-card">
                            <MobileCardHeader>
                                <ActiveIconBox style={{ width: 60, height: 60 }}>
                                    <i className={service.icon} style={{ fontSize: '1.5rem' }}></i>
                                </ActiveIconBox>
                                <MobileTitle>{service.title}</MobileTitle>
                            </MobileCardHeader>

                            <MobileDescription>
                                {service.desc}
                            </MobileDescription>

                            <Tags style={{ zIndex: 2, position: 'relative' }}>
                                {service.tags.map((t, idx) => (
                                    <span key={idx}>{t}</span>
                                ))}
                            </Tags>

                            <MobileNumberBadge>
                                {service.id}
                            </MobileNumberBadge>
                        </MobileCard>
                    ))}
                </MobileContainer>
            </Container>
        </Section>
    );
};

export default Services;
