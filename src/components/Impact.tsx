import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// STYLED COMPONENTS
// ==========================================

const Section = styled.section`
    position: relative;
    width: 100%;
    height: 130vh; /* Extended vertical space */
    min-height: 900px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    z-index: 5; /* Ensure it sits nicely in the stack */
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const BackgroundVideo = styled.video`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
    filter: brightness(0.6) contrast(1.1); /* Darken for text readability */
    /* Parallax effect will be applied via GSAP to this element */
`;

const Overlay = styled.div`
    position: absolute;
    inset: 0;
    background: linear-gradient(
        to bottom,
        #000000 0%,
        rgba(0,0,0,0) 20%,
        rgba(0,0,0,0) 80%,
        #000000 100%
    ); /* Smooth fade to black at edges */
    z-index: 1;
`;

const ContentContainer = styled.div`
    position: relative;
    z-index: 2;
    text-align: center;
    max-width: 900px;
    padding: 0 20px;
    color: #fff;
`;

/* Optional: Call to Action button if desired, currently purely visual */
const Headline = styled.h2`
    font-size: clamp(2.5rem, 6vw, 5rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin-bottom: 32px;
    opacity: 0;
    transform: translateY(30px);
    
    color: #ffffff;
    
    /* Ensure the span inherits the gradient or has its own color */
    span {
        background: linear-gradient(135deg, #ff4400, #ff8800);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
`;

const Cursor = styled.span`
    display: inline-block;
    width: 0.1em;
    height: 1em;
    background-color: #ff4400;
    margin-left: 0.1em;
    vertical-align: middle;
    animation: blink 1s step-end infinite;
    
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
    }
`;

const DecoratorLine = styled.div`
    width: 2px;
    height: 100px;
    background: linear-gradient(to bottom, #ff4400, transparent);
    margin: 0 auto;
    opacity: 0;
    transform: scaleY(0);
    transform-origin: top;
`;

// ==========================================
// COMPONENT
// ==========================================

const Impact: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const [text, setText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(150);

    const words = ["The Future.", "Lasting Legacy.", "Market Leaders.", "Digital Dominance.", "Global Impact."];

    useEffect(() => {
        const handleType = () => {
            const i = loopNum % words.length;
            const fullText = words[i];

            setText(isDeleting
                ? fullText.substring(0, text.length - 1)
                : fullText.substring(0, text.length + 1)
            );

            setTypingSpeed(isDeleting ? 30 : 150);

            if (!isDeleting && text === fullText) {
                setTimeout(() => setIsDeleting(true), 1500); // Pause at end
            } else if (isDeleting && text === '') {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
                setTypingSpeed(500); // Pause before typing new word
            }
        };

        const timer = setTimeout(handleType, typingSpeed);
        return () => clearTimeout(timer);
    }, [text, isDeleting, loopNum, typingSpeed, words]); // Added words to dependency array

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Parallax Background
            if (videoRef.current) {
                gsap.to(videoRef.current, {
                    yPercent: 20, /* Subtle parallax */
                    ease: "none",
                    scale: 1.1, /* Ensure no edges show during parallax */
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                });
            }

            // Content Stagger Reveal
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 60%", /* Start animation when section is in view */
                    toggleActions: "play none none reverse"
                }
            });

            tl.to(contentRef.current?.querySelector('h2') as HTMLElement, { /* Headline */
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out"
            })
                .to(contentRef.current?.querySelector('.decorator') as HTMLElement, { /* Line */
                    opacity: 1,
                    scaleY: 1,
                    duration: 1.2,
                    ease: "power3.inOut"
                }, "-=0.8");

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <Section ref={sectionRef}>
            <BackgroundVideo
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                poster="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" /* Fallback image */
            >
                <source src="https://cdn.pixabay.com/video/2019/02/10/21268-316279641_large.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </BackgroundVideo>
            <Overlay />

            <ContentContainer ref={contentRef}>
                <Headline>
                    We engineer <br />
                    <span>{text}</span><Cursor />
                </Headline>
                <DecoratorLine className="decorator" />
            </ContentContainer>
        </Section>
    );
};

export default Impact;
