import React, { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import styled, { keyframes } from 'styled-components';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// STYLED COMPONENTS (Premium Dark)
// ==========================================

const marqueeAnim = keyframes`
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
`;

const FooterRoot = styled.footer`
    background: #050505;
    color: #fff;
    position: relative;
    overflow: hidden;
    padding-top: 180px; /* Increased to accommodate divider */
    font-family: 'Inter', sans-serif;
    overflow: visible; /* Allow divider to stand out */

    @media (max-width: 768px) {
        padding-top: 100px;
    }

    
    /* Background Grid for Tech Feel */
    &::before {
        content: '';
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background-image: 
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
        background-size: 50px 50px;
        pointer-events: none;
        opacity: 0.5;
    }
`;

const waveAnimFront = keyframes`
    0% { transform: scaleY(1); }
    50% { transform: scaleY(1.15); }
    100% { transform: scaleY(1); }
`;

const waveAnimBack = keyframes`
    0% { transform: scaleY(1) translateX(0); }
    50% { transform: scaleY(1.1) translateX(-5%); }
    100% { transform: scaleY(1) translateX(0); }
`;

const waveAnimMiddle = keyframes`
    0% { transform: scaleY(1) translateX(0); }
    50% { transform: scaleY(0.9) translateX(5%); }
    100% { transform: scaleY(1) translateX(0); }
`;

const IntegratedDivider = styled.div`
    position: absolute;
    top: 0;
    left: -10%; /* Significant overlap for sway */
    width: 120%; /* Much wider to prevent gaps during sway */
    transform: translateY(-99%); /* Move it UP outside the footer to overlap previous section */
    overflow: hidden;
    line-height: 0;
    z-index: 20;
    pointer-events: none;
    
    svg {
        position: relative;
        display: block;
        width: 100%;
        height: 150px;
        fill: #050505;
        transform: scaleY(-1); /* Flip vertically */
        
        @media (max-width: 768px) {
            height: 80px;
        }
    }

    .shape-fill {
        fill: #050505;
        transform-origin: 0 0; /* Anchor to SVG top (visual bottom) */
        will-change: transform;
    }

    /* Complex Parallax Animation */
    path:nth-child(1) {
        animation: ${waveAnimBack} 15s ease-in-out infinite;
        opacity: 0.3;
    }
    path:nth-child(2) {
        animation: ${waveAnimMiddle} 12s ease-in-out infinite;
        opacity: 0.6;
    }
    path:nth-child(3) {
        animation: ${waveAnimFront} 6s ease-in-out infinite;
    }
`;

const MainContent = styled.div`
    padding: 0 40px;
    max-width: 1400px;
    margin: 0 auto;
    position: relative;
    z-index: 10;

    @media (max-width: 768px) {
        padding: 0 20px;
    }
`;

// --- MAGNETIC COMPONENT ---

const MagneticLink = styled.a`
    display: inline-block;
    cursor: pointer;
    position: relative;
    text-decoration: none;
    color: #888;
    font-size: 1.1rem;
    font-weight: 500;
    transition: all 0.3s;
    padding: 5px 0;

    @media (hover: hover) {
        &:hover {
            color: #fff;
            transform: translateX(5px);
            text-shadow: 0 0 10px rgba(255,255,255,0.5);
        }
    }
`;


// --- MASSIVE CTA ---

const CTARow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 140px;
    flex-wrap: wrap;
    gap: 40px;

    @media (max-width: 768px) {
        margin-bottom: 80px;
    }
`;



// --- ANIMATED CTA COMPONENT ---

const CTAContainer = styled.button`
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    text-align: left;
    position: relative;
    display: block;
    width: 100%;
    overflow: hidden;

    h2 {
        font-size: clamp(3.5rem, 9vw, 10rem);
        font-weight: 900;
        color: #fff;
        margin: 0;
        /* User: "cut on bottom letters" -> increased line-height and added padding */
        line-height: 1.0; 
        padding-bottom: 20px;
        letter-spacing: -0.04em;
        display: flex;
        flex-wrap: wrap;
        gap: 1.5vw; /* Word gap */

        @media (max-width: 768px) {
            gap: 10px;
            letter-spacing: -0.02em;
        }
    }

    .word {
        display: flex;
    }

    .char {
        display: inline-block;
        transition: color 0.3s;
        will-change: transform;
    }

    /* Initial state: Darker grey */
    .char {
        color: #444; 
    }

    /* Arrow */
    .arrow {
        font-size: 0.4em;
        vertical-align: top;
        margin-left: 20px;
        opacity: 0;
        transform: translate(-20px, 20px);
        transition: all 0.5s ease;
        display: inline-block;
        color: #fff;
    }

    @media (hover: hover) {
        &:hover .arrow {
            opacity: 1;
            transform: translate(0, 0);
        }
    }
`;

const AnimatedCTA: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    const text = "Let's build your legacy.";

    const words = text.split(" ");
    const containerRef = React.useRef<HTMLButtonElement>(null);

    const handleMouseEnter = () => {
        if (!containerRef.current) return;
        const chars = containerRef.current.querySelectorAll('.char');

        // Kill previous tweens
        gsap.killTweensOf(chars);

        // Wave In
        gsap.to(chars, {
            y: -20,
            color: '#fff',
            stagger: 0.03,
            duration: 0.4,
            ease: 'back.out(1.7)',
            overwrite: true
        });

        // Return to natural position but keep white
        gsap.to(chars, {
            y: 0,
            stagger: 0.03,
            duration: 0.4,
            delay: 0.2, // Overlap slightly
            ease: 'power2.out',
            overwrite: false
        });
    };

    const handleMouseLeave = () => {
        if (!containerRef.current) return;
        const chars = containerRef.current.querySelectorAll('.char');

        // Kill previous tweens
        gsap.killTweensOf(chars);

        // Wave Out (back to grey)
        gsap.to(chars, {
            y: 0,
            color: '#444',
            stagger: {
                each: 0.02,
                from: "end" // Reverse direction
            },
            duration: 0.5,
            ease: 'power2.out',
            overwrite: true
        });
    };

    return (
        <CTAContainer
            ref={containerRef}
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="cta-trigger"
        >
            <h2>
                {words.map((word, wIndex) => (
                    <span key={wIndex} className="word">
                        {word.split("").map((char, cIndex) => (
                            <span key={cIndex} className="char">{char}</span>
                        ))}
                    </span>
                ))}
                <span className="arrow">↗</span>
            </h2>
        </CTAContainer>
    );
};


// --- BOTTOM GRID ---

const BottomGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
    padding-bottom: 100px;
    border-bottom: 1px solid rgba(255,255,255,0.1);

    @media (max-width: 900px) {
        grid-template-columns: 1fr 1fr;
    }
    @media (max-width: 600px) {
        grid-template-columns: 1fr;
        gap: 30px;
        padding-bottom: 60px;
    }
`;

const Col = styled.div<{ $alignRight?: boolean }>`
    display: flex;
    flex-direction: column;
    gap: 15px;

    /* Handle specific alignment for rightmost column on desktop */
    ${props => props.$alignRight && `
        align-items: flex-end;
        justify-content: flex-end;

        @media (max-width: 900px) {
            align-items: flex-start;
            justify-content: flex-start;
        }
    `}

    h4 {
        font-size: 0.85rem;
        color: #fff;
        margin-bottom: 15px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        opacity: 0.5;
    }
`;



// --- INFINITE MARQUEE ---

const MarqueeWrapper = styled.div`
    width: 100%;
    padding: 40px 0;
    background: #000;
    overflow: hidden;
    white-space: nowrap;
    display: flex;
    align-items: center;
    border-top: 1px solid rgba(255,255,255,0.1);
`;

const MarqueeTrack = styled.div`
    display: flex;
    animation: ${marqueeAnim} 40s linear infinite;
    gap: 0;
`;

const MarqueeItem = styled.span`
    font-size: 4rem;
    font-weight: 900;
    /* User: "lines inside" -> Removed stroke effects. Now Solid Dark Grey. */
    color: #222; 
    -webkit-text-stroke: 0;
    text-transform: uppercase;
    letter-spacing: -2px;
    padding: 0 40px;
    /* User: "smoother" -> Increased duration and eased curve */
    transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1);
    font-family: 'Inter', sans-serif;
    user-select: none;

    @media (hover: hover) {
        &:hover {
            color: #fff;
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
            /* Removed letter-spacing change to prevent jitter/layout shift */
            transform: scale(1.05); /* Smooth scale instead */
        }
    }
`;

// ==========================================
// COMPONENT
// ==========================================

interface FooterProps {
    onOpenForm: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenForm }) => {
    // Stagger reveal on scroll
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.footer-col',
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.1,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: 'footer',
                        start: 'top 80%',
                    }
                }
            );
        });
        return () => ctx.revert();
    }, []);

    return (
        <FooterRoot>
            <IntegratedDivider>
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="shape-fill"></path>
                    <path d="M0,0V15.81C13,36.92,47.64,50.79,98.28,60.47c59.84,11.43,124.5,12,185.52,1.52,70.62-12.13,132.89-42.58,202.9-49.63,90.54-9.11,180.89,17.43,264,55.9,81.44,37.64,166.45,43.23,249.79,15.75,69.09-22.81,149.25-63.18,199.51-100.32V0Z" opacity=".5" className="shape-fill"></path>
                    <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="shape-fill"></path>
                </svg>
            </IntegratedDivider>

            <MainContent>
                <CTARow>
                    <div style={{ width: '100%' }}>
                        <AnimatedCTA onClick={onOpenForm} />
                    </div>
                </CTARow>

                <BottomGrid>
                    <Col className="footer-col">
                        <h4>Socials</h4>
                        <MagneticLink href="https://x.com/Pajzo_">Twitter / X</MagneticLink>
                        <MagneticLink href="https://www.instagram.com/pajzo_/">Instagram</MagneticLink>
                    </Col>

                    <Col className="footer-col">
                        <h4>Legal</h4>
                        <MagneticLink href="/privacy-policy" onClick={(e) => {
                            e.preventDefault();
                            window.history.pushState({}, '', '/privacy-policy');
                            window.dispatchEvent(new PopStateEvent('popstate'));
                        }}>Privacy Policy</MagneticLink>
                        <MagneticLink href="/terms-of-service" onClick={(e) => {
                            e.preventDefault();
                            window.history.pushState({}, '', '/terms-of-service');
                            window.dispatchEvent(new PopStateEvent('popstate'));
                        }}>Terms of Service</MagneticLink>
                    </Col>

                    <Col className="footer-col" $alignRight>
                        <div style={{ opacity: 0.4, fontSize: '0.85rem' }}>
                            © {new Date().getFullYear()} PAJZO. All rights reserved.
                        </div>
                    </Col>
                </BottomGrid>
            </MainContent>

            <MarqueeWrapper>
                <MarqueeTrack>
                    {Array(4).fill(null).map((_, i) => (
                        <React.Fragment key={i}>
                            <MarqueeItem>STRATEGY</MarqueeItem>
                            <MarqueeItem>•</MarqueeItem>
                            <MarqueeItem>BRANDING</MarqueeItem>
                            <MarqueeItem>•</MarqueeItem>
                            <MarqueeItem>PERFORMANCE</MarqueeItem>
                            <MarqueeItem>•</MarqueeItem>
                            <MarqueeItem>GLOBAL</MarqueeItem>
                            <MarqueeItem>•</MarqueeItem>
                        </React.Fragment>
                    ))}
                </MarqueeTrack>
            </MarqueeWrapper>
        </FooterRoot>
    );
};

export default Footer;
