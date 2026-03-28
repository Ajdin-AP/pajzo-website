import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import styled, { keyframes } from 'styled-components';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// STYLED COMPONENTS (Premium Dark Parallax)
// ==========================================

const marqueeAnim = keyframes`
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
`;

/* 
   Creative Transition 6: The "Floating Parallax Reveal"
   This is the holy grail of modern agency transitions. 
   1. The white layout elegantly curves inwards to close itself out (Pill Shape).
   2. It casts a massive shadow over the footer.
   3. The footer sits in a parallax well behind it and scrolls slower than the page, 
      causing it to be "revealed" like a cinematic curtain drawing back.
*/

const FooterWrapper = styled.div`
    position: relative;
    overflow: hidden; /* Contains the parallax movement to this box only */
    background: #050505;
`;

const FloatingPillClosure = styled.div`
    position: absolute;
    top: -1px; /* Stitch to the FAQ section perfectly */
    left: 0;
    width: 100%;
    height: 120px;
    background: #ffffff; /* Exact match to FAQ section */
    border-bottom-left-radius: 80px;
    border-bottom-right-radius: 80px;
    z-index: 30;
    pointer-events: none; /* Let clicks pass through if needed */
    box-shadow: 0 40px 80px rgba(0, 0, 0, 0.4);

    @media (max-width: 768px) {
        height: 80px;
        border-bottom-left-radius: 40px;
        border-bottom-right-radius: 40px;
    }
`;

const FooterRoot = styled.footer`
    background: #050505;
    color: #fff;
    position: relative;
    padding-top: 220px; /* Absorbs the pill overlay and gives breathing room */
    font-family: 'Inter', sans-serif;
    will-change: transform; /* Optimize parallax rendering */

    @media (max-width: 768px) {
        padding-top: 150px;
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
        z-index: 1;
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
            color: #ff4400;
            transform: translateX(5px);
            text-shadow: 0 0 10px rgba(255, 68, 0, 0.4);
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
        color: #ff4400;
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
    const containerRef = useRef<HTMLButtonElement>(null);

    const handleMouseEnter = () => {
        if (!containerRef.current) return;
        const chars = containerRef.current.querySelectorAll('.char');

        gsap.killTweensOf(chars);

        // Wave In
        gsap.to(chars, {
            y: -20,
            color: '#ff4400',
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
    color: #222; 
    -webkit-text-stroke: 0;
    text-transform: uppercase;
    letter-spacing: -2px;
    padding: 0 40px;
    transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1);
    font-family: 'Inter', sans-serif;
    user-select: none;

    @media (hover: hover) {
        &:hover {
            color: #ff4400;
            text-shadow: 0 0 20px rgba(255, 68, 0, 0.3);
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
    const wrapperRef = useRef<HTMLDivElement>(null);
    const footerRef = useRef<HTMLElement>(null);

    // Stagger reveal on scroll & Parallax
    useEffect(() => {
        const ctx = gsap.context(() => {
            
            // 1. The Parallax Reveal physics
            gsap.fromTo(footerRef.current,
                { yPercent: -30 }, // Starts 30% pushed up under the pill
                {
                    yPercent: 0,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: wrapperRef.current,
                        start: 'top bottom', // Start parallax as soon as wrapper enters viewport
                        end: 'bottom bottom', // End precisely when the footer reaches its final position
                        scrub: true
                    }
                }
            );

            // 2. The Text Entrance
            gsap.fromTo('.footer-col',
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.1,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: wrapperRef.current,
                        start: 'top 60%',
                    }
                }
            );
        });
        return () => ctx.revert();
    }, []);

    return (
        <FooterWrapper ref={wrapperRef} id="footer">
            <FloatingPillClosure />
            <FooterRoot ref={footerRef}>
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
        </FooterWrapper>
    );
};

export default Footer;
