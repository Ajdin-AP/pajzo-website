import { useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useClaude } from '../hooks/useClaude';
import { ChatBox } from './Chat/ChatBox';
import { MessageInput } from './Chat/MessageInput';

gsap.registerPlugin(ScrollTrigger);

// ─── Animations ───────────────────────────────────────────────────────────────

const pulse = keyframes`
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.5; transform: scale(0.88); }
`;

const shimmer = keyframes`
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(400%); }
`;

// ─── Section ──────────────────────────────────────────────────────────────────

const Section = styled.section`
    position: relative;
    /* Blend seamlessly with TechStack (above) and Partners (below) */
    background-color: #ffffff; 
    padding: 160px 24px;
    
    @media (max-width: 768px) {
        padding: 80px 16px;
    }
`;

const InnerCard = styled.div`
    position: relative;
    max-width: 1360px; /* Huge Bento Card */
    margin: 0 auto;
    border-radius: 48px;
    overflow: hidden;
    padding: 100px 80px;
    
    /* Stealth Dark Mode AI Card */
    background-color: #08080a; 
    border: 1px solid rgba(255, 255, 255, 0.05);

    /* Subtle orange ambient glow at the top for powerful AI vibe */
    background-image: radial-gradient(circle at 50% 0%, rgba(255, 68, 0, 0.15) 0%, transparent 60%);
        
    /* Deep beautiful shadow to detach the dark card from the white background */
    box-shadow: 
        0 40px 100px rgba(0, 0, 0, 0.15),
        0 10px 40px rgba(255, 68, 0, 0.08); /* Ambient edge reflection */

    @media (max-width: 1024px) {
        padding: 60px 40px;
        border-radius: 32px;
    }

    @media (max-width: 768px) {
        padding: 48px 24px;
        border-radius: 24px;
    }
`;

/* High-end Dotted Grid inside the gorgeous orange card */
const Grid = styled.div`
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255,255,255,0.12) 1px, transparent 0);
    background-size: 40px 40px;
    background-position: -19px -19px;
    pointer-events: none;
    z-index: 0;
`;

const Inner = styled.div`
    position: relative;
    z-index: 1;
    width: 100%;
`;

// ─── Header block ─────────────────────────────────────────────────────────────

const HeaderRow = styled.div`
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 40px;
    margin-bottom: 72px;

    @media (max-width: 860px) {
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 48px;
    }
`;

const HeaderLeft = styled.div``;

const Tag = styled.p`
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 4px;
    color: #ff4400;
    background: #ffffff;
    padding: 6px 14px;
    border-radius: 6px;
    display: inline-block;
    margin: 0 0 24px 0;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08); /* Crisp tag */
`;

const Headline = styled.h2`
    font-size: clamp(3rem, 6.5vw, 5.5rem);
    font-weight: 900;
    letter-spacing: -0.04em;
    line-height: 1.18;
    padding-bottom: 0.18em; /* Prevents descenders like 'g' from clipping */
    color: #ffffff;
    margin: 0;

    em {
        font-style: normal;
        background: linear-gradient(135deg, #ffffff, #888888);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 400;
        display: block;
    }
`;

const Sub = styled.p`
    font-size: 1.15rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.6;
    max-width: 400px;
    margin: 0;

    @media (max-width: 860px) {
        max-width: 100%;
    }
`;

// ─── Columns ──────────────────────────────────────────────────────────────────

const Columns = styled.div`
    display: grid;
    grid-template-columns: 380px 1fr;
    gap: 40px;
    align-items: start;

    @media (max-width: 960px) {
        grid-template-columns: 1fr;
        gap: 32px;
    }
`;

// ─── Feature list (left) ──────────────────────────────────────────────────────

const FeatureList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const FeatureItem = styled.div`
    padding: 24px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    display: flex;
    align-items: flex-start;
    gap: 24px;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:first-child {
        border-top: 1px solid rgba(255, 255, 255, 0.15);
    }

    @media (hover: hover) {
        &:hover { 
            transform: translateX(12px);
            
            /* Add subtle highlight indication */
            h4 {
                color: #ff4400;
            }
        }
    }
`;

const FeatureNum = styled.span`
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.6);
    letter-spacing: 2px;
    padding-top: 4px;
    flex-shrink: 0;
`;

const FeatureBody = styled.div`
    h4 {
        font-size: 1.2rem;
        font-weight: 700;
        color: #ffffff;
        margin: 0 0 8px 0;
        letter-spacing: -0.01em;
        transition: color 0.3s ease;
    }
    p {
        font-size: 1rem;
        color: rgba(255, 255, 255, 0.5);
        margin: 0;
        line-height: 1.6;
        font-weight: 400;
    }
`;

// ─── Chat Panel (right) ───────────────────────────────────────────────────────

const ChatPanel = styled.div`
    /* Dark Frosted Glass Effect - completely removing heavy GPU back-drop blur for max performance */
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 520px;
    box-shadow:
        0 40px 100px -20px rgba(0,0,0,0.6),
        inset 0 1px 1px rgba(255,255,255,0.05); /* Subtle rim light reflection */
`;

const ChatTopBar = styled.div`
    height: 3px;
    background: linear-gradient(90deg, #ff4400, #ff8800);
    flex-shrink: 0;
`;

const ChatHead = styled.div`
    padding: 16px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
`;

const Dot = styled.div`
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #ff4400;
    box-shadow: 0 0 6px #ff4400;
    animation: ${pulse} 2.2s ease-in-out infinite;
    flex-shrink: 0;
`;

const ChatHeadText = styled.div`
    h3 {
        font-size: 0.82rem;
        font-weight: 700;
        color: #fff;
        margin: 0;
        letter-spacing: 0.03em;
    }
    span {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.62rem;
        color: rgba(255,68,0,0.7);
        letter-spacing: 0.06em;
    }
`;

/* Shimmer line that runs across the chat panel */
const ShimmerWrap = styled.div`
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    border-radius: 16px;
    z-index: 2;

    &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        height: 40%;
        background: linear-gradient(transparent, rgba(255,68,0,0.012), transparent);
        animation: ${shimmer} 8s linear infinite;
    }
`;

const ChatBody = styled.div`
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
`;

const ChatFoot = styled.div`
    flex-shrink: 0;
    padding: 20px 24px 24px; /* Suspends the input securely inside the panel */
`;

// ─── Features data ────────────────────────────────────────────────────────────

const FEATURES = [
    {
        title: 'Context-Aware',
        desc: 'Trained on PAJZO services and capabilities to give instant, relevant answers.',
    },
    {
        title: 'Real-Time Streaming',
        desc: 'Token-by-token responses. No spinners. No waiting. Pure instant output.',
    },
    {
        title: 'Vision & Multimodal',
        desc: 'Attach images or paste screenshots — the AI reads and understands visuals.',
    },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AISection() {
    const { messages, isLoading, streamingMessage, sendMessage } = useClaude();
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const colsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Appearance Animations
            gsap.fromTo(headerRef.current,
                { y: 30, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
                    scrollTrigger: { trigger: headerRef.current, start: 'top 82%', once: true }
                }
            );
            gsap.fromTo(colsRef.current,
                { y: 50, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.12,
                    scrollTrigger: { trigger: colsRef.current, start: 'top 82%', once: true }
                }
            );

        }, sectionRef);
        return () => {
            ctx.revert();
        };
    }, []);

    return (
        <Section ref={sectionRef} id="ai-section">
            <InnerCard>
                <Grid />
                <Inner>
                    {/* Header */}
                    <HeaderRow ref={headerRef}>
                        <HeaderLeft>
                            <Tag>// AI Integration</Tag>
                            <Headline>
                                Built-in <span style={{ color: '#ff4400' }}>AI.</span><br />
                                <em>Real intelligence.</em>
                            </Headline>
                        </HeaderLeft>
                        <Sub>
                            Every PAJZO project ships with intelligent infrastructure. Our AI understands your brand, your stack, and your goals — from day one.
                        </Sub>
                    </HeaderRow>

                    {/* Two columns */}
                    <Columns ref={colsRef}>
                        {/* Feature list */}
                        <FeatureList>
                            {FEATURES.map((f, i) => (
                                <FeatureItem key={i}>
                                    <FeatureNum>0{i + 1}</FeatureNum>
                                    <FeatureBody>
                                        <h4>{f.title}</h4>
                                        <p>{f.desc}</p>
                                    </FeatureBody>
                                </FeatureItem>
                            ))}
                        </FeatureList>

                        {/* Chat */}
                        <ChatPanel style={{ position: 'relative' }}>
                            <ChatTopBar />
                            <ShimmerWrap />
                            <ChatHead>
                                <Dot />
                                <img src="/hero.svg" alt="PAJZO" style={{ width: 24, height: 24, borderRadius: 5, filter: 'brightness(0) invert(1)' }} />
                                <ChatHeadText>
                                    <h3>PAJZO AI</h3>
                                    <span>LIVE DEMO — ASK ANYTHING</span>
                                </ChatHeadText>
                            </ChatHead>
                            <ChatBody>
                                <ChatBox messages={messages} streamingMessage={streamingMessage} isLoading={isLoading} />
                            </ChatBody>
                            <ChatFoot>
                                <MessageInput onSend={sendMessage} disabled={isLoading} />
                            </ChatFoot>
                        </ChatPanel>
                    </Columns>
                </Inner>
            </InnerCard>
        </Section>
    );
}
