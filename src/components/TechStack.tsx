import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import styled from 'styled-components';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// STYLED COMPONENTS (Awwwards / Minimalist Editorial)
// ==========================================

const Section = styled.section`
    background: #ffffff;
    /* Massive top/bottom padding for the editorial feel */
    padding: 200px 24px 160px;
    position: relative;
    overflow: hidden;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    
    /* Gentle overlap curve to transition from previous section */
    border-top-left-radius: 48px;
    border-top-right-radius: 48px;
    margin-top: -48px;
    z-index: 10;
    
    @media (max-width: 768px) {
        padding: 140px 16px 100px;
        border-top-left-radius: 32px;
        border-top-right-radius: 32px;
    }
`;

const Container = styled.div`
    max-width: 1300px; /* Tighter layout for typographic tension */
    margin: 0 auto;
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const Header = styled.div`
    margin-bottom: 100px;
    padding-bottom: 24px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    
    h2 {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.8rem;
        font-weight: 700;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        color: #ff4400;
        margin-bottom: 16px;
        display: block;
    }

    .main-title {
        font-size: clamp(3rem, 6vw, 5.5rem);
        font-weight: 800;
        color: #111111;
        letter-spacing: -0.04em;
        line-height: 1.05;
        margin: 0;
        max-width: 800px;
        
        span {
            font-style: italic;
            background: linear-gradient(135deg, #ff4400, #ff8800);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }
`;

const ListContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const RowItem = styled.div`
    position: relative;
    padding: 48px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: flex-end; /* Align bottom */
    justify-content: space-between;
    overflow: hidden;
    cursor: pointer;
    transition: padding 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    
    /* The brilliant background gradient that reveals on hover strictly within the row bounds */
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #ff4400, #ff8800);
        transform: scaleY(0);
        transform-origin: bottom;
        transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        z-index: 0;
    }

    @media (max-width: 900px) {
        flex-direction: column;
        align-items: flex-start;
        padding: 32px 0;
        gap: 16px;
    }

    @media (hover: hover) {
        &:hover {
            padding: 64px 24px;

            &::before {
                transform: scaleY(1);
            }
            
            /* Text elements invert color over the orange background */
            .row-number, .row-tag, .row-title, .row-desc, .row-icon {
                color: #ffffff !important;
                border-color: rgba(255, 255, 255, 0.3) !important;
            }
            
            .row-tag {
                background: rgba(255, 255, 255, 0.15);
            }
            
            /* Subtly reveal the description and slide it up slightly */
            .row-desc {
                opacity: 0.9;
                transform: translateY(0);
            }
            
            .row-icon {
                transform: rotate(45deg) scale(1.1);
            }
        }
    }
`;

const ContentLeft = styled.div`
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    pointer-events: none; /* Let hover hit the row */
`;

const MetaTop = styled.div`
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 16px;
`;

const RowNumber = styled.span`
    font-family: 'JetBrains Mono', monospace;
    font-size: 1rem;
    font-weight: 500;
    color: rgba(0,0,0,0.3);
    transition: color 0.4s ease;
`;

const Tag = styled.span`
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #111111;
    padding: 6px 14px;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 100px;
    transition: all 0.4s ease;
`;

const Title = styled.h3`
    font-size: clamp(3rem, 7vw, 6rem);
    font-weight: 800;
    color: #111111;
    margin: 0;
    letter-spacing: -0.05em;
    line-height: 0.9;
    text-transform: uppercase;
    transition: color 0.4s ease;
`;

const ContentRight = styled.div`
    position: relative;
    z-index: 1;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    text-align: right;
    pointer-events: none;
    
    @media (max-width: 900px) {
        align-items: flex-start;
        text-align: left;
        max-width: 100%;
    }
`;

const Description = styled.p`
    font-size: 1.15rem;
    color: #4a4a4f;
    line-height: 1.5;
    margin: 0 0 24px 0;
    font-weight: 400;
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    
    /* Default desktop state masks the desc until hover */
    @media (min-width: 901px) {
        opacity: 0.5;
        transform: translateY(10px);
    }
`;

const BigIcon = styled.i`
    font-size: 2.5rem;
    color: #ff4400; /* Initially brand color */
    transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
`;


// ==========================================
// DATA
// ==========================================

const TECH_DATA = [
    {
        tag: "Frontend",
        title: "React",
        desc: "We engineer lightning-fast interfaces using React and modern server-side rendering for optimal Core Web Vitals.",
        icon: "fab fa-react",
    },
    {
        tag: "Motion",
        title: "GSAP fluid",
        desc: "Hardware-accelerated animations powered by GSAP. No jank, pure buttery smoothness at 60fps.",
        icon: "fas fa-fan",
    },
    {
        tag: "Commerce",
        title: "Headless",
        desc: "Decoupled architecture utilizing Shopify Plus and custom Node.js middleware for infinite scale.",
        icon: "fab fa-shopify",
    },
    {
        tag: "Backend",
        title: "Cloud",
        desc: "Serverless edge functions and distributed databases ensuring zero downtime globally.",
        icon: "fas fa-cloud",
    },
    {
        tag: "Analytics",
        title: "Data",
        desc: "Custom tracking pixels, server-side tagging, and real-time BI dashboards.",
        icon: "fas fa-chart-pie",
    }
];

// ==========================================
// COMPONENT
// ==========================================

const TechStack: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            
            // Header animation
            gsap.fromTo(".editorial-header",
                { y: 60, opacity: 0 },
                {
                    y: 0, opacity: 1,
                    duration: 1.2, ease: "power3.out",
                    scrollTrigger: { trigger: sectionRef.current, start: "top 75%" }
                }
            );

            // Staggered list items
            gsap.fromTo(".editorial-row",
                { y: 100, opacity: 0 },
                {
                    y: 0, opacity: 1,
                    duration: 1.4,
                    stagger: 0.15,
                    ease: "power4.out",
                    scrollTrigger: { trigger: ".editorial-list", start: "top 80%" }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <Section id="tech-stack" ref={sectionRef}>
            <Container>
                <Header className="editorial-header">
                    <h2>// Digital Infrastructure</h2>
                    <h3 className="main-title">
                        Engineered with <br/> <span>precision.</span>
                    </h3>
                </Header>

                <ListContainer className="editorial-list">
                    {TECH_DATA.map((item, index) => (
                        <RowItem key={index} className="editorial-row">
                            <ContentLeft>
                                <MetaTop>
                                    <RowNumber className="row-number">
                                        0{index + 1}
                                    </RowNumber>
                                    <Tag className="row-tag">{item.tag}</Tag>
                                </MetaTop>
                                <Title className="row-title">{item.title}</Title>
                            </ContentLeft>
                            
                            <ContentRight>
                                <Description className="row-desc">{item.desc}</Description>
                                <BigIcon className={`row-icon ${item.icon}`} />
                            </ContentRight>
                        </RowItem>
                    ))}
                </ListContainer>
            </Container>
        </Section>
    );
};

export default TechStack;
