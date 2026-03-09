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
    color: #111111;
`;

const Container = styled.div`
    max-width: 1500px;
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
        font-weight: 700;
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
    padding: 0 20px;

    /* Completely hide the accordion on mobile/tablets */
    @media (max-width: 1024px) {
        display: none;
    }
`;

// Represents a single accordion slice
const Panel = styled.div<{ $isActive: boolean }>`
    position: relative;
    height: 100%;
    background: #ffffff;
    border-radius: 32px;
    border: 1px solid ${props => props.$isActive ? 'rgba(255, 68, 0, 0.15)' : 'rgba(0, 0, 0, 0.04)'};
    overflow: hidden;
    cursor: pointer;
    
    /* 
     Flex magic: 
     Inactive panels take up 1 part of the space (min-width logic prevents crushing).
     Active panel jumps to taking up significantly more space (flex-grow: 4 or 5).
    */
    flex: ${props => props.$isActive ? '5' : '1'};
    min-width: ${props => props.$isActive ? '40%' : '120px'};
    
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    
    box-shadow: ${props => props.$isActive
        ? '0 30px 60px rgba(0, 0, 0, 0.06), 0 10px 20px rgba(0, 0, 0, 0.02)'
        : '0 4px 12px rgba(0, 0, 0, 0.02)'};

    &:hover {
        border-color: ${props => props.$isActive ? 'rgba(255, 68, 0, 0.3)' : 'rgba(0, 0, 0, 0.08)'};
        box-shadow: ${props => props.$isActive
        ? '0 30px 60px rgba(0, 0, 0, 0.06)'
        : '0 8px 20px rgba(0, 0, 0, 0.04)'};
    }

    @media (max-width: 1024px) {
        min-height: ${props => props.$isActive ? 'auto' : '100px'};
        width: 100%;
        padding: ${props => props.$isActive ? '40px 30px' : '0'};
    }
`;

const PanelContent = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
    /* To keep text from wrapping strangely during the flex transition, 
       we use a fixed width for the content wrapper inside the dynamic panel */
    min-width: 500px; 
    
    @media (max-width: 1024px) {
        position: relative;
        padding: 0;
        min-width: 100%;
    }
`;

const HeaderSection = styled.div<{ $isActive: boolean }>`
    display: flex;
    align-items: center;
    gap: 20px;
    
    /* When inactive, we want the title to rotate vertically on desktop */
    @media (min-width: 1025px) {
        flex-direction: ${props => props.$isActive ? 'row' : 'column'};
        align-items: flex-start;
        padding-top: ${props => props.$isActive ? '0' : '20px'};
    }
`;

const IconWrapper = styled.div<{ $isActive: boolean }>`
    width: 64px;
    height: 64px;
    min-width: 64px; /* Prevent shrink */
    border-radius: 20px;
    background: ${props => props.$isActive ? 'linear-gradient(135deg, #ff4400, #ff8800)' : '#f5f5f7'};
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: ${props => props.$isActive ? '0 8px 24px rgba(255, 68, 0, 0.25)' : 'none'};
    border: 1px solid ${props => props.$isActive ? 'transparent' : 'rgba(0, 0, 0, 0.03)'};
    transition: all 0.5s ease;

    i {
        font-size: 1.5rem;
        color: ${props => props.$isActive ? '#ffffff' : '#1d1d1f'};
    }
`;

const Title = styled.h3<{ $isActive: boolean }>`
    font-size: 1.75rem;
    font-weight: 700;
    color: #111111;
    margin: 0;
    white-space: nowrap;
    transition: all 0.8s ease;

    @media (min-width: 1025px) {
        /* Rotate the title when standing vertically */
        transform-origin: left top;
        transform: ${props => props.$isActive
        ? 'none'
        : 'rotate(90deg) translateY(-100%) translateX(20px)'};
        
        /* Adjust positioning when rotated so it sits below the icon */
        margin-top: ${props => props.$isActive ? '0' : '80px'};
        margin-left: ${props => props.$isActive ? '0' : '-20px'};
        
        opacity: ${props => props.$isActive ? '1' : '0.5'};
    }
    
    @media (max-width: 1024px) {
        padding: ${props => !props.$isActive ? '35px 20px' : '0'}; /* Click area padding on mobile */
    }

    @media (max-width: 768px) {
        font-size: 1.35rem; /* Better fit for small screens */
    }
`;

const ExpandedContent = styled.div<{ $isActive: boolean }>`
    opacity: ${props => props.$isActive ? 1 : 0};
    transform: ${props => props.$isActive ? 'translateY(0)' : 'translateY(20px)'};
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: ${props => props.$isActive ? '0.2s' : '0s'}; /* Wait for expansion to fade in */
    pointer-events: ${props => props.$isActive ? 'auto' : 'none'};
    
    display: flex;
    flex-direction: column;
    gap: 30px;
    
    @media (max-width: 1024px) {
        display: ${props => props.$isActive ? 'flex' : 'none'}; /* Hard hide on mobile to save space */
        margin-top: 30px;
    }
`;

const Description = styled.p`
    font-size: 1.25rem;
    line-height: 1.6;
    color: #4a4a4f;
    margin: 0;
    font-weight: 400;
    max-width: 85%;
    
    @media (max-width: 1024px) {
        max-width: 100%;
        font-size: 1.1rem;
    }
`;

const Tags = styled.div`
    display: flex;
    gap: 10px;
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

const NumberBadge = styled.div<{ $isActive: boolean }>`
    position: absolute;
    bottom: 40px;
    right: 40px;
    font-size: 4rem;
    font-weight: 800;
    color: ${props => props.$isActive ? 'rgba(0,0,0,0.03)' : 'rgba(0,0,0,0.00)'}; /* Only show big number when active */
    transition: color 0.8s ease;
    user-select: none;
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
    font-size: 1.5rem;
    font-weight: 700;
    color: #111111;
    margin: 0;
    letter-spacing: -0.02em;
`;

const MobileDescription = styled.p`
    font-size: 1.1rem;
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
    font-weight: 800;
    color: rgba(0,0,0,0.02);
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
    const [activeIndex, setActiveIndex] = useState(0); // Default to first panel open

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Intro animation for the whole accordion block (Desktop)
            gsap.fromTo(".accordion-panel",
                { y: 60, opacity: 0 },
                {
                    y: 0, opacity: 1,
                    duration: 1.5,
                    stagger: 0.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%"
                    }
                }
            );

            // Intro animation for Mobile Cards (Scroll Reveal)
            gsap.fromTo(".mobile-service-card",
                { y: 50, opacity: 0 },
                {
                    y: 0, opacity: 1,
                    duration: 1.2,
                    stagger: 0.25,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".mobile-services-container",
                        start: "top 85%",
                        // Adjust end/scrub if you want it tied to scroll progress, 
                        // but a simple one-time trigger feels more native app-like.
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
                                <PanelContent>
                                    <div>
                                        <HeaderSection $isActive={isActive}>
                                            <IconWrapper $isActive={isActive}>
                                                <i className={service.icon}></i>
                                            </IconWrapper>
                                            <Title $isActive={isActive}>{service.title}</Title>
                                        </HeaderSection>

                                        <ExpandedContent $isActive={isActive}>
                                            <Description>{service.desc}</Description>
                                            <Tags>
                                                {service.tags.map((t, idx) => (
                                                    <span key={idx}>{t}</span>
                                                ))}
                                            </Tags>
                                        </ExpandedContent>
                                    </div>

                                    <NumberBadge $isActive={isActive}>
                                        {service.id}
                                    </NumberBadge>
                                </PanelContent>
                            </Panel>
                        );
                    })}
                </AccordionContainer>

                {/* Mobile Specific Layout (Hidden on Desktop) */}
                <MobileContainer className="mobile-services-container">
                    {SERVICES_DATA.map((service, index) => (
                        <MobileCard key={index} className="mobile-service-card">
                            <MobileCardHeader>
                                <IconWrapper $isActive={true}>
                                    <i className={service.icon}></i>
                                </IconWrapper>
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
