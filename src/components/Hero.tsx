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
  perspective: 1200px;
`;

const BackgroundLogo = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  width: clamp(600px, 100vw, 1500px);
  transform: translate(-50%, -50%) scale(1.2);
  opacity: 0.02;
  filter: invert(1) blur(30px);
  pointer-events: none;
  z-index: 1;
  will-change: transform;
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
  z-index: 10;
  pointer-events: none;
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
  padding-right: 0.05em;
  transform: translateY(110%);
  will-change: transform;

  span {
      background: linear-gradient(135deg, #ff4400, #ff8800);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
  }
`;

const BrandLogoContainer = styled.div`
  opacity: 0;
  transform: scale(0.8);
  will-change: transform, opacity;
  z-index: 20;
  position: relative;
`;

const BrandLogoInner = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  transform-style: preserve-3d;
  will-change: transform;
`;

const Glow = styled.div`
  position: absolute;
  width: clamp(250px, 35vw, 600px);
  height: clamp(250px, 35vw, 600px);
  background: radial-gradient(circle, rgba(255, 68, 0, 0.15) 0%, rgba(0, 0, 0, 0) 70%);
  border-radius: 50%;
  z-index: 1;
  pointer-events: none;
  transform: translateZ(-30px);
`;

const CircleAccent = styled.div`
  position: absolute;
  width: clamp(160px, 20vw, 350px);
  height: clamp(160px, 20vw, 350px);
  border: 1px dashed rgba(255, 68, 0, 0.4);
  border-radius: 50%;
  z-index: 1;
  pointer-events: none;
  transform: translateZ(40px);
  opacity: 0.6;
`;

const OuterCircle = styled.div`
  position: absolute;
  width: clamp(200px, 25vw, 450px);
  height: clamp(200px, 25vw, 450px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 50%;
  z-index: 1;
  pointer-events: none;
  transform: translateZ(-10px);
`;

const BrandLogo = styled.img`
  width: clamp(100px, 12vw, 220px);
  height: auto;
  display: block;
  filter: invert(1);
  backface-visibility: hidden;
  position: relative;
  z-index: 2;
  transform: translateZ(60px);
`;

// ==========================================
// 2. MAIN COMPONENT
// ==========================================

const Hero: React.FC = () => {
  const wrapperRef = useRef<HTMLElement>(null);
  const text1Ref = useRef<HTMLHeadingElement>(null);
  const text2Ref = useRef<HTMLHeadingElement>(null);
  
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const logoInnerRef = useRef<HTMLDivElement>(null);
  
  const bgLogoRef = useRef<HTMLImageElement>(null);
  const dashedRingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "+=600%",
          pin: true,
          scrub: 1,
        }
      });

      // 0. Set Initial State
      gsap.set(text1Ref.current, { y: "0%" });
      gsap.set(text2Ref.current, { y: "110%" });
      gsap.set(logoContainerRef.current, { opacity: 0, scale: 0.8 });

      // Ambient rotation for the background logo and dashed ring
      gsap.to(bgLogoRef.current, {
        rotation: 360,
        duration: 90,
        repeat: -1,
        ease: "linear",
      });
      
      gsap.to(dashedRingRef.current, {
        rotation: -360,
        duration: 40,
        repeat: -1,
        ease: "linear",
      });

      // 1. "Built to scale."
      tl.to(text1Ref.current, { y: "0%", duration: 2 })
        .to(text1Ref.current, { y: "-110%", duration: 1, ease: "power2.in" });

      // 2. "Designed to win."
      tl.to(text2Ref.current, { y: "0%", duration: 4, ease: "power2.out" }, "-=0.5")
        .to(text2Ref.current, { y: "0%", duration: 2 })
        .to(text2Ref.current, { y: "-110%", duration: 1, ease: "power2.in" });

      // 3. Logo Reveal & Background interaction
      tl.to(logoContainerRef.current, {
        opacity: 1,
        scale: 1,
        duration: 4,
        ease: "power2.out"
      }, "-=0.5");

      tl.to(bgLogoRef.current, {
        opacity: 0.06,
        scale: 1,
        duration: 4,
        ease: "power2.out"
      }, "<");

    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  // 3D Tilt Effect and Floating
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = logoInnerRef.current;
    const floater = floatRef.current;
    if (!wrapper || !inner || !floater) return;

    let xTo = gsap.quickTo(inner, "rotationY", { ease: "power3.out", duration: 0.8 });
    let yTo = gsap.quickTo(inner, "rotationX", { ease: "power3.out", duration: 0.8 });
    let xMoveTo = gsap.quickTo(inner, "x", { ease: "power3.out", duration: 0.8 });
    let yMoveTo = gsap.quickTo(inner, "y", { ease: "power3.out", duration: 0.8 });

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      
      xTo(x * 25);
      yTo(-y * 25);
      xMoveTo(x * 20);
      yMoveTo(y * 20);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
      xMoveTo(0);
      yMoveTo(0);
    };

    wrapper.addEventListener("mousemove", handleMouseMove);
    wrapper.addEventListener("mouseleave", handleMouseLeave);
    
    // Independent float animation
    gsap.to(floater, {
      y: -15,
      duration: 3,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    return () => {
      wrapper.removeEventListener("mousemove", handleMouseMove);
      wrapper.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <>
      <GlobalStyle />
      <Wrapper ref={wrapperRef}>
        
        <BackgroundLogo ref={bgLogoRef} src={heroImg} alt="PAJZO Background" />

        <ContentContainer>
          <IntroTextWrapper>
            <IntroText ref={text1Ref}>Built to <span>scale.</span></IntroText>
          </IntroTextWrapper>

          <IntroTextWrapper>
            <IntroText ref={text2Ref}>Designed to <span>win.</span></IntroText>
          </IntroTextWrapper>

          <BrandLogoContainer ref={logoContainerRef}>
            <div ref={floatRef}>
              <BrandLogoInner ref={logoInnerRef}>
                <OuterCircle />
                <Glow />
                <CircleAccent ref={dashedRingRef} />
                <BrandLogo src={heroImg} alt="PAJZO" />
              </BrandLogoInner>
            </div>
          </BrandLogoContainer>
        </ContentContainer>

      </Wrapper>
    </>
  );
};

export default Hero;