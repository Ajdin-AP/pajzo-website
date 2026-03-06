import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// STYLED COMPONENTS ("Zenith" Layout)
// ==========================================

const Section = styled.section`
    position: relative;
    padding: 60px 20px;
    background: #ffffff;
    color: #1e293b;
    z-index: 10;
`;

const Container = styled.div`
    max-width: 1400px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 80px;
    position: relative;

    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
        gap: 60px;
    }
`;

// --- Left Column (Sticky) ---
const StickyColumn = styled.div`
    position: sticky;
    top: 150px;
    height: max-content;
    
    @media (max-width: 1024px) {
        position: relative;
        top: 0;
        text-align: center;
    }
`;

const Label = styled.span`
    display: inline-block;
    padding: 8px 16px;
    background: rgba(99, 102, 241, 0.1);
    color: #4f46e5;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 24px;
    backdrop-filter: blur(10px);
`;

const Title = styled.h2`
    font-size: clamp(3rem, 5vw, 4.5rem);
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin-bottom: 24px;

    background: linear-gradient(180deg, #0f172a 0%, #475569 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
    font-size: 1.1rem;
    line-height: 1.7;
    color: #64748b;
    margin-bottom: 40px;
    max-width: 400px;
    
    @media (max-width: 1024px) {
        margin: 0 auto 40px auto;
    }
`;

const ContactCard = styled.div`
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.8);
    padding: 30px;
    border-radius: 24px;
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
    gap: 16px;
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        background: #fff;
    }

    h4 {
        margin: 0;
        font-size: 1.2rem;
        color: #1e293b;
    }
    p {
        margin: 0;
        font-size: 0.95rem;
        color: #64748b;
    }
    a {
        color: #4f46e5;
        font-weight: 600;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-top: 8px;
        
        &:hover { text-decoration: underline; }
    }

    @media (max-width: 1024px) {
        text-align: left;
        max-width: 400px;
        margin: 0 auto;
    }
`;

// --- Right Column (Accordion List) ---
const AccordionStack = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const AccordionItem = styled.div<{ $isOpen: boolean }>`
    background: ${props => props.$isOpen ? '#ffffff' : 'rgba(255, 255, 255, 0.5)'};
    backdrop-filter: blur(20px);
    border: 1px solid ${props => props.$isOpen ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.6)'};
    border-radius: 20px;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    box-shadow: ${props => props.$isOpen
        ? '0 20px 40px -10px rgba(99, 102, 241, 0.15), 0 0 0 1px rgba(99,102,241,0.1)'
        : '0 4px 6px -1px rgba(0,0,0,0.02)'};
        
    &:hover {
        background: #fff;
        transform: ${props => props.$isOpen ? 'none' : 'translateY(-2px)'};
        box-shadow: 0 10px 20px -5px rgba(0,0,0,0.05);
    }
`;

const AccordionHeader = styled.button`
    width: 100%;
    text-align: left;
    padding: 24px 32px;
    background: transparent;
    border: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    font-family: inherit;
    
    span {
        font-size: 1.15rem;
        font-weight: 700;
        color: #1e293b;
        padding-right: 20px;
    }

    @media (max-width: 768px) {
        padding: 20px 24px;
        span {
            font-size: 1.05rem; /* Prevent squeezing the arrow */
        }
    }
`;

const IconWrapper = styled.div<{ $isOpen: boolean }>`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: ${props => props.$isOpen ? '#4f46e5' : '#f1f5f9'};
    color: ${props => props.$isOpen ? '#fff' : '#64748b'};
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    flex-shrink: 0;

    svg {
        width: 14px;
        height: 14px;
        transition: transform 0.4s ease;
        transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
    }
`;

const AccordionContent = styled.div`
    height: 0;
    overflow: hidden;
    /* Height is animated by GSAP */
`;

const ContentInner = styled.div`
    padding: 0 32px 32px 32px;
    color: #475569;
    line-height: 1.7;
    font-size: 1rem;
    max-width: 90%;
`;


// ==========================================
// COMPONENT
// ==========================================

const FAQ_DATA = [
    {
        question: 'What exactly does Pajzo do?',
        answer: 'We are a hybrid branding and growth strategy agency. We don’t just design pretty logos or run ads; we build entire ecosystems. From forging a compelling brand identity to engineering the digital infrastructure that scales it, we handle the end-to-end journey of market dominance.'
    },
    {
        question: 'How is your approach different?',
        answer: 'Most agencies fragment your business—hiring one for design, one for dev, and another for marketing. Pajzo integrates these disciplines into a singular, cohesive strike force. We use data-driven insights to inform creative decisions, ensuring every pixel and line of code serves a measurable business objective.'
    },
    {
        question: 'What is the typical project timeline?',
        answer: 'We move fast without breaking things. A comprehensive brand overhaul and digital launch typically takes 6-10 weeks. Specific growth campaigns or separate asset production can be deployed in as little as 2-3 weeks. We value velocity, but never at the cost of precision.'
    },
    {
        question: 'Do you work with startups or established enterprises?',
        answer: 'Both. We partner with ambitious startups ready to disrupt their industries and established enterprises looking to reinvent themselves. The common denominator is ambition—we work with clients who are ready to aggressive scale and lead their market.'
    },
    {
        question: 'How do you structure your pricing?',
        answer: 'We believe in value-based pricing. We offer project-based retainers for end-to-end builds and performance-based models for growth campaigns. We are not the cheapest option on the market, but we are the most efficient investment for high-growth ROI.'
    }
];

const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
    const sectionRef = useRef<HTMLElement>(null);

    const toggleAccordion = (index: number) => {
        if (openIndex === index) {
            setOpenIndex(null);
        } else {
            setOpenIndex(index);
        }
    };

    useEffect(() => {
        // Animate height changes
        contentRefs.current.forEach((el, index) => {
            if (!el) return;

            if (index === openIndex) {
                gsap.to(el, {
                    height: "auto",
                    duration: 0.4,
                    ease: "power2.out"
                });
                gsap.to(el.querySelector('div'), { // ContentInner
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    delay: 0.1
                });
            } else {
                gsap.to(el, {
                    height: 0,
                    duration: 0.3,
                    ease: "power2.in"
                });
                gsap.to(el.querySelector('div'), {
                    opacity: 0,
                    y: -10,
                    duration: 0.2
                });
            }
        });
    }, [openIndex]);

    // Entrance Animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            const elements = sectionRef.current?.querySelectorAll('.stagger-in');
            if (elements && elements.length > 0) {
                gsap.fromTo(elements,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top 70%"
                        }
                    }
                );
            }
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const ChevronIcon = () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
    );

    return (
        <Section ref={sectionRef} id="faq">
            <Container>
                {/* Left Column */}
                <StickyColumn className="stagger-in">
                    <Label>Support</Label>
                    <Title>Frequently Asked Questions</Title>
                    <Subtitle>
                        Everything you need to know about our products and services.
                        Can't find the answer? We're here to help.
                    </Subtitle>

                    <ContactCard>
                        <h4>Still have questions?</h4>
                        <p>Our team is ready to assist you.</p>
                        <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' }); }}>
                            Contact Support <span style={{ fontSize: '1.2em' }}>&rarr;</span>
                        </a>
                    </ContactCard>
                </StickyColumn>

                {/* Right Column */}
                <AccordionStack>
                    {FAQ_DATA.map((item, index) => (
                        <AccordionItem
                            key={index}
                            $isOpen={openIndex === index}
                            className="stagger-in"
                        >
                            <AccordionHeader onClick={() => toggleAccordion(index)}>
                                <span>{item.question}</span>
                                <IconWrapper $isOpen={openIndex === index}>
                                    <ChevronIcon />
                                </IconWrapper>
                            </AccordionHeader>
                            <AccordionContent
                                ref={(el: HTMLDivElement | null) => { contentRefs.current[index] = el; }}
                                style={{ height: index === 0 ? 'auto' : 0 }}
                            >
                                <ContentInner>
                                    {item.answer}
                                </ContentInner>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </AccordionStack>
            </Container>
        </Section>
    );
};

export default FAQ;
