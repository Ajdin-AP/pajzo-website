import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// STYLED COMPONENTS: Dual-Layer Architecture
// ==========================================

// Base Header Style applied to both layers
const HeaderRootBase = styled.header`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    /* Start with Large Padding */
    padding: 60px 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    will-change: padding;
    pointer-events: none; /* Let clicks pass through empty space */

    @media(max-width: 900px) { padding: 40px 40px; }
    @media(max-width: 480px) { padding: 20px 20px; }
`;

// Layer 1: The Difference Layer (Inverts dynamically)
const HeaderRootDiff = styled(HeaderRootBase)`
    z-index: 1000;
    mix-blend-mode: difference; /* The Magic CSS */
`;

// Layer 2: The Normal Layer (Holds the Orange Brand objects)
const HeaderRootNorm = styled(HeaderRootBase)`
    z-index: 1001;
    mix-blend-mode: normal;
`;

// Base Logo Text
const LogoText = styled.a`
    font-family: 'Inter', sans-serif;
    font-weight: 900;
    font-size: 26px;
    letter-spacing: -0.04em;
    color: #ffffff; 
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
    cursor: pointer;
    pointer-events: auto;
    text-decoration: none;
    will-change: transform;
    display: flex;

    /* Scale Effect: Massive -> Normal */
    transform: scale(1.5);
    transform-origin: left center;

    /* Reveal effect */
    opacity: 0;
    animation: fadeIn 0.5s ease 0.2s forwards;

    @keyframes fadeIn {
        to { opacity: 1; }
    }

    @media(max-width: 480px) {
        font-size: 20px;
        transform: scale(1);
    }

    &:hover {
        opacity: 0.8;
    }
`;

const BrandDot = styled.span`
    color: #ff4400; /* Immune to the difference blend */
`;

const Nav = styled.nav`
    display: flex;
    align-items: center;
    gap: 40px;
    pointer-events: auto;
`;

// Magnetic Button Wrapper
const MagneticBtn = styled.button`
    position: relative;
    background: #ff4400; /* Primary Brand Orange */
    color: #ffffff;      
    border: none;
    border-radius: 40px;
    box-shadow: 0 8px 20px rgba(255, 68, 0, 0.25); /* Subtle ambient glow */

    /* Base Size */
    padding: 16px 36px;
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    font-weight: 700;

    cursor: pointer;
    overflow: hidden;
    will-change: transform;
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease, box-shadow 0.3s ease;

    /* Scale Effect: Large -> Normal */
    transform: scale(1.3);
    transform-origin: right center;

    @media (hover: hover) {
        &:hover {
            background: #ff5511; /* Slightly brighter orange on hover */
            box-shadow: 0 12px 30px rgba(255, 68, 0, 0.45); /* Stronger glow */
        }
    }
    
    &:active {
        transform: scale(1.25);
    }

    @media(max-width: 480px) {
        padding: 10px 20px;
        font-size: 13px;
        transform: scale(1);
    }
`;

// ==========================================
// COMPONENT
// ==========================================

interface HeaderProps {
    onOpenForm: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenForm }) => {
    // We use arrays for refs so we can beautifully animate both layers simultaneously
    const headerRefs = useRef<(HTMLElement | null)[]>([]);
    const logoRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const btnRef = useRef<HTMLButtonElement>(null);
    const dummyBtnRef = useRef<HTMLButtonElement>(null);

    // Scroll Animation Logic
    useEffect(() => {
        if (!headerRefs.current[0] || !headerRefs.current[1] || !logoRefs.current[0] || !btnRef.current) return;

        // Sync with Hero pin length (600% viewport)
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: document.body,
                    start: "top top",
                    end: "600vh", // Match Hero pinning duration
                    scrub: 1.5,
                }
            });

            // Animate both overlapping headers symmetrically
            tl.to(headerRefs.current, {
                paddingTop: window.innerWidth <= 480 ? 15 : window.innerWidth <= 900 ? 20 : 30,
                paddingBottom: window.innerWidth <= 480 ? 15 : window.innerWidth <= 900 ? 20 : 30,
                paddingLeft: window.innerWidth <= 480 ? 15 : window.innerWidth <= 900 ? 20 : 50,
                paddingRight: window.innerWidth <= 480 ? 15 : window.innerWidth <= 900 ? 20 : 50,
                ease: "power2.inOut"
            }, 0);

            // Animate both split logos identically
            tl.to(logoRefs.current, {
                scale: 1,
                ease: "power2.inOut"
            }, 0);

            // Animate both buttons
            tl.to([btnRef.current, dummyBtnRef.current], {
                scale: 1,
                ease: "power2.inOut"
            }, 0);
        });

        return () => ctx.revert();
    }, []);

    // Magnetic Effect Logic (Only applied to the interactive top button)
    useEffect(() => {
        const btn = btnRef.current;
        if (!btn) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Magnetic pull
            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: "power2.out",
                overwrite: "auto"
            });
        };

        const handleMouseLeave = () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: "elastic.out(1, 0.3)",
                overwrite: "auto"
            });
        };

        btn.addEventListener('mousemove', handleMouseMove);
        btn.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            btn.removeEventListener('mousemove', handleMouseMove);
            btn.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <>
            {/* 
              LAYER 1: The Difference Blended Layer 
              This layer visually wipes its colors into the exact opposite of what's behind it.
              It contains ONLY the base PAJZO text in solid white.
            */}
            <HeaderRootDiff ref={el => { if (el) headerRefs.current[0] = el; }}>
                <LogoText ref={el => { if (el) logoRefs.current[0] = el; }} href="/">
                    PAJZO
                </LogoText>
                
                {/* Invisible Ghost elements to ensure flexbox sizes match precisely */}
                <Nav style={{ opacity: 0, pointerEvents: 'none' }}>
                    <MagneticBtn ref={dummyBtnRef}>Let's Talk</MagneticBtn>
                </Nav>
            </HeaderRootDiff>

            {/* 
              LAYER 2: The Normal Blended Layer 
              This layer sits right on top and preserves exact brand colors.
              We hide the "PAJZO" text so the difference layer shines through,
              but we render the Orange brand dot and CTA Button completely intact.
            */}
            <HeaderRootNorm ref={el => { if (el) headerRefs.current[1] = el; }}>
                <LogoText ref={el => { if (el) logoRefs.current[1] = el; }} href="/">
                    {/* Transparent text perfectly pushes the Brand Dot to its spot */}
                    <span style={{ opacity: 0 }}>PAJZO</span><BrandDot>.</BrandDot>
                </LogoText>

                <Nav>
                    <MagneticBtn
                        ref={btnRef}
                        onClick={() => onOpenForm()}
                    >
                        Let's Talk
                    </MagneticBtn>
                </Nav>
            </HeaderRootNorm>
        </>
    );
};

export default Header;
