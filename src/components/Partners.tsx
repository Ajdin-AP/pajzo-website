import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styled, { keyframes } from 'styled-components';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// STYLED COMPONENTS ("Magnetic Ecosystem")
// ==========================================

const scrollAnimation = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-33.333%); } /* Moves exactly 1/3 of the width (one set) */
`;

const Section = styled.section`
    position: relative;
    padding: 60px 0;
    overflow: hidden;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 40px;
    min-height: 300px;
`;

const Header = styled.div`
    text-align: center;
    z-index: 2;
    padding: 0 20px;
    margin-bottom: 20px;

    h2 {
        font-size: 3.5rem;
        font-weight: 800;
        letter-spacing: -2px;
        color: #0f172a; /* Dark Slate */
        margin-bottom: 12px;
    }

    p {
        font-size: 1.1rem;
        color: #64748b; /* Medium Slate */
        max-width: 500px;
        margin: 0 auto;
        line-height: 1.6;
        font-weight: 500;
        letter-spacing: 0.5px;
    }
`;

const MarqueeContainer = styled.div`
    position: relative;
    width: 100%;
    z-index: 2;
    padding: 40px 0;
    overflow: hidden;
    display: flex;
    align-items: center;
    /* Soft graduation mask */
    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
    -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
`;

const MarqueeTrack = styled.div`
    display: flex;
    gap: 60px; /* Increased gap for cleaner look */
    width: max-content;
    will-change: transform;
    align-items: center;
    /* CSS Animation for smooth infinite loop */
    animation: ${scrollAnimation} 30s linear infinite;
    
    /* Removed pause on hover to keep it moving */
    &:hover {
        /* animation-play-state: running; */
    }
`;

/* "Aerogel" Style Card - High Contrast */
const BrandCard = styled.div`
    position: relative;
    width: 180px;
    height: 100px;
    /* Clean White Card */
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    
    /* Holographic glow on hover */
    &::after {
        content: '';
        position: absolute;
        inset: -2px;
        border-radius: 18px;
        padding: 2px;
        background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    i {
        font-size: 2.5rem;
        color: #334155; /* Slate 700 */
        transition: all 0.3s ease;
    }

    span {
        position: absolute;
        bottom: 15px;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: #0f172a;
        opacity: 0;
        transform: translateY(5px);
        transition: all 0.3s ease;
    }

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

        &::after {
            opacity: 1;
        }

        i {
            color: #0f172a;
            transform: translateY(-12px) scale(0.9);
        }

        span {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// ==========================================
// COMPONENT
// ==========================================

const BRANDS = Array(10).fill({ name: '', icon: null });

const Partners: React.FC = () => {
    const trackRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Only keep magnetic cursor logic, removed scroll logic
        const ctx = gsap.context(() => {
            // GSAP Context for potential future expansion
        });

        // Magnetic Cursor & Physics Effect
        const cards = document.querySelectorAll<HTMLElement>('.partner-card');

        const handleMouseMove = (e: MouseEvent) => {
            const card = e.currentTarget as HTMLElement;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Magnetic pull
            gsap.to(card, {
                x: x * 0.2,
                y: y * 0.2,
                rotation: x * 0.05,
                duration: 0.5,
                ease: "power2.out"
            });
        };

        const handleMouseLeave = (e: MouseEvent) => {
            const card = e.currentTarget as HTMLElement;
            // Snap back
            gsap.to(card, {
                x: 0,
                y: 0,
                rotation: 0,
                duration: 0.8,
                ease: "elastic.out(1, 0.3)"
            });
        };

        cards.forEach((card) => {
            card.addEventListener('mousemove', handleMouseMove);
            card.addEventListener('mouseleave', handleMouseLeave);
        });

        return () => {
            ctx.revert();
            cards.forEach((card) => {
                card.removeEventListener('mousemove', handleMouseMove);
                card.removeEventListener('mouseleave', handleMouseLeave);
            });
        };
    }, []);

    // 3 sets for smooth infinite scroll
    const loopSet = [...BRANDS, ...BRANDS, ...BRANDS];

    return (
        <Section id="partners" ref={containerRef}>
            <Header>
                <h2>Select Clients</h2>
                <p>Strategic partnerships with industry leaders.</p>
            </Header>

            <MarqueeContainer>
                <MarqueeTrack ref={trackRef}>
                    {loopSet.map((_, i) => (
                        <BrandCard key={`p-${i}`} className="partner-card">
                            {/* Empty card as requested */}
                        </BrandCard>
                    ))}
                </MarqueeTrack>
            </MarqueeContainer>
        </Section>
    );
};

export default Partners;
