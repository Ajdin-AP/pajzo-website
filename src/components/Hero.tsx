import React, { useEffect, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import heroImg from '../assets/hero.svg';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// 1. GLOBAL & STYLES
// ==========================================

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;800&family=JetBrains+Mono:wght@400&display=swap');

  body {
    margin: 0;
    padding: 0;
    background: #000000;
  }
`;

const Wrapper = styled.section`
  position: relative;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  /* Pure Black */
  background: #000000;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IntroTextWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 20px 0;
`;

const IntroText = styled.h1`
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  font-size: clamp(2rem, 10vw, 9rem);
  letter-spacing: -0.05em;
  color: #ffffff;
  margin: 0;
  text-align: center;
  white-space: nowrap;
  padding-right: 0.05em; /* Compensate for negative letter spacing */
  transform: translateY(110%); /* Start hidden (pushed down) */
  will-change: transform;

  span {
      background: linear-gradient(135deg, #ff4400, #ff8800);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
  }
`;

const BrandLogoContainer = styled.div`
  opacity: 0;
  transform: scale(1.1);
  will-change: transform, opacity;
`;

const BrandLogo = styled.img`
  width: clamp(250px, 45vw, 700px);
  height: auto;
  display: block;
  filter: invert(1) brightness(2) drop-shadow(0 0 40px rgba(255, 68, 0, 0.4));
  backface-visibility: hidden;
`;

// ==========================================
// 2. MAIN COMPONENT
// ==========================================

const Hero: React.FC = () => {
  const wrapperRef = useRef<HTMLElement>(null);

  const text1Ref = useRef<HTMLHeadingElement>(null);
  const text2Ref = useRef<HTMLHeadingElement>(null);

  const logoContainerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // MASTER SCROLL TIMELINE
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "+=600%", // Extended pin for very slow scroll feeling
          pin: true,
          scrub: 1, // Smooth scrubbing
        }
      });

      // --- SEQUENCE ---

      // 0. Set Initial State
      gsap.set(text1Ref.current, { y: "0%" }); // Start visible
      gsap.set(text2Ref.current, { y: "110%" }); // Start hidden
      gsap.set(logoContainerRef.current, { opacity: 0, scale: 1.1 }); // Start hidden

      // 1. "Built to scale."
      // HOLD (Stay visible initially)
      tl.to(text1Ref.current, {
        y: "0%",
        duration: 2 // Scroll distance to keep it visible
      })
        // OUT (Quick exit)
        .to(text1Ref.current, {
          y: "-110%",
          duration: 1,
          ease: "power2.in"
        });

      // 2. "Designed to win."
      // IN (Slower appear)
      tl.to(text2Ref.current, {
        y: "0%",
        duration: 4,
        ease: "power2.out"
      }, "-=0.5")
        // HOLD
        .to(text2Ref.current, {
          y: "0%",
          duration: 2
        })
        // OUT
        .to(text2Ref.current, {
          y: "-110%",
          duration: 1,
          ease: "power2.in"
        });

      // 3. Logo Reveal
      tl.to(logoContainerRef.current, {
        opacity: 1,
        scale: 1,
        duration: 4, // Very slow reveal
        ease: "power2.out"
      }, "-=0.5");

      // Idle float for logo (Independent loop)
      gsap.to(logoRef.current, {
        y: -10,
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <GlobalStyle />
      <Wrapper ref={wrapperRef}>

        <ContentContainer>
          {/* Text 1 Wrapper for Clipping */}
          <IntroTextWrapper>
            <IntroText ref={text1Ref}>Built to <span>scale.</span></IntroText>
          </IntroTextWrapper>

          {/* Text 2 Wrapper for Clipping */}
          <IntroTextWrapper>
            <IntroText ref={text2Ref}>Designed to <span>win.</span></IntroText>
          </IntroTextWrapper>

          <BrandLogoContainer ref={logoContainerRef}>
            <BrandLogo ref={logoRef} src={heroImg} alt="PAJZO" />
          </BrandLogoContainer>
        </ContentContainer>
      </Wrapper>
    </>
  );
};

export default Hero;