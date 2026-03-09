import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';

// ==========================================
// STYLED COMPONENTS
// ==========================================

const HeaderRoot = styled.header<{ $scrolled: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    /* Massive padding at top, shrinks on scroll */
    padding: ${props => props.$scrolled ? '30px 50px' : '60px 80px'};
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 1000;
    box-sizing: border-box;
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);

    /* Always Transparent - No Background */
    background: transparent;
    mix-blend-mode: difference;
    pointer-events: none; /* Let clicks pass through empty space */

    @media(max-width: 900px) {
        padding: 20px 20px;
    }

    @media(max-width: 480px) {
        padding: 15px 15px;
    }
`;

// Logo Text with Dynamic Color
const LogoText = styled.a<{ $scrolled: boolean }>`
    font-family: 'Inter', sans-serif;
    font-weight: 900;
    font-size: 26px;
    letter-spacing: -0.04em;
    color: #fff; /* Base White for Difference Blend */
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    cursor: pointer;
    pointer-events: auto;
    text-decoration: none;

    /* Scale Effect: Massive -> Normal */
    transform: ${props => props.$scrolled ? 'scale(1)' : 'scale(1.5)'};
    transform-origin: left center;

    /* Reveal effect */
    opacity: 0;
    animation: fadeIn 0.5s ease 0.2s forwards;

    @keyframes fadeIn {
        to { opacity: 1; }
    }

    @media(max-width: 480px) {
        font-size: 20px;
    }

    @media (hover: hover) {
        &:hover {
            color: #ff4400; /* Orange hover effect */
        }
    }
`;

const Nav = styled.nav`
    display: flex;
    align-items: center;
    gap: 40px;
    pointer-events: auto;
`;

// Magnetic Button Wrapper
const MagneticBtn = styled.button<{ $scrolled: boolean }>`
    position: relative;
    background: #fff; /* Base White for Difference Blend */
    color: #000;      /* Base Black Text */
    border: none;
    border-radius: 40px;

    /* Base Size */
    padding: 16px 36px;
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    font-weight: 700;

    cursor: pointer;
    overflow: hidden;
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease;

    /* Scale Effect: Large -> Normal */
    transform: ${props => props.$scrolled ? 'scale(1)' : 'scale(1.3)'};
    transform-origin: right center;

    @media (hover: hover) {
        &:hover {
            background: #ff4400; /* Orange hover */
            color: #ffffff;      /* White text */
            box-shadow: 0 0 20px rgba(255, 68, 0, 0.4);
        }
    }
    
    &:active {
        transform: ${props => props.$scrolled ? 'scale(0.95)' : 'scale(1.25)'};
    }

    @media(max-width: 480px) {
        padding: 10px 20px;
        font-size: 13px;
    }
`;

// ==========================================
// COMPONENT
// ==========================================

interface HeaderProps {
    onOpenForm: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenForm }) => {
    const [scrolled, setScrolled] = useState(false);
    const btnRef = useRef<HTMLButtonElement>(null);

    // Scroll Detection
    useEffect(() => {
        const handleScroll = () => {
            // Hero is pinned for 600% of viewport. 
            // We want header to minimize ONLY after we scroll past that ENTIRE sequence.
            // 6.2 * innerHeight gives a small buffer after unpinning.
            const threshold = window.innerHeight * 6.2;
            const isScrolled = window.scrollY > threshold;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Magnetic Effect Logic
    useEffect(() => {
        const btn = btnRef.current;
        if (!btn) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Magnetic pull strength
            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: "power2.out"
            });
        };

        const handleMouseLeave = () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: "elastic.out(1, 0.3)"
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
        <HeaderRoot $scrolled={scrolled}>
            <LogoText $scrolled={scrolled} href="/">
                PAJZO.
            </LogoText>

            <Nav>
                <MagneticBtn
                    ref={btnRef}
                    $scrolled={scrolled}
                    onClick={() => onOpenForm()}
                >
                    Let's Talk
                </MagneticBtn>
            </Nav>
        </HeaderRoot>
    );
};

export default Header;
