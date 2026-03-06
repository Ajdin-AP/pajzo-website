import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';

// ==========================================
// TYPES & DATA
// ==========================================

type FormStep = 'INTRO' | 'IDENTITY' | 'BUSINESS' | 'SERVICES' | 'BUDGET' | 'DETAILS' | 'SUCCESS';

interface FormData {
    name: string;
    company: string;
    email: string;
    website: string;
    businessName: string;
    industry: string;
    businessDesc: string;
    services: string[];
    budget: number;
    details: string;
}

const SERVICES = [
    { id: 'social_ads', label: 'Social & Ads', desc: 'Organic + Paid Scaling' },
    { id: 'web_dev', label: 'Web Development', desc: 'High-Performance Sites' },
    { id: 'brand_design', label: 'Brand Design', desc: 'Identity & Systems' },
    { id: 'seo_analytics', label: 'SEO & Analytics', desc: 'Ranking & Data' }
];

const BUDGET_RANGES = [
    "0 - 500 €",
    "500 - 1.000 €",
    "1.000 - 2.500 €",
    "2.500 - 5.000 €",
    "5.000 - 10.000 €",
    "10.000 - 25.000 €",
    "25.000 - 50.000 €",
    "50.000 € +"
];


// ==========================================
// VALIDATION HELPERS
// ==========================================

const isValidEmail = (email: string) => {
    // Standard precise email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidUrl = (url: string) => {
    // If empty, it's valid (optional field)
    if (!url || url.trim() === '') return true;
    // Basic structural URL check
    return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(url);
};

// ==========================================
// ANIMATIONS
// ==========================================


const AetherRoot = styled.div<{ $isOpen: boolean }>`
    position: fixed;
    top: 0; 
    left: 0;
    width: 100%; 
    height: 100vh;
    background: #000000; /* Pure Black */
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: ${props => props.$isOpen ? 1 : 0};
    pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};
    transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #fff;
    overflow: hidden;
`;

const ContentWrapper = styled.div`
    position: relative;
    z-index: 100;
    width: 100%;
    /* max-width: 900px;  Removed to allow infinite input expansion */
    padding: 40px;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    justify-content: center;
    overflow-y: auto;
    
    /* Ensure content is scrollable if it exceeds viewport */
    @media (max-height: 800px) {
        justify-content: flex-start;
        padding-top: 100px;
        padding-bottom: 50px;
    }

    @media (max-width: 768px) {
        padding: 20px;
        min-height: 80vh;
        justify-content: flex-start;
        padding-top: 100px; /* Increased to avoid CloseButton overlap */
        padding-bottom: 80px; /* Give room for mobile browser bottom bars */
    }
`;

const CloseButton = styled.button`
    position: absolute;
    top: 40px;
    right: 40px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.1);
    cursor: pointer;
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

    svg {
        width: 20px;
        height: 20px;
        stroke: #fff;
        transition: transform 0.4s ease;
    }

    @media (hover: hover) {
        &:hover {
            transform: scale(1.1);
            background: #fff;
            svg {
                transform: rotate(90deg);
                stroke: #000;
            }
        }
    }

    @media (max-width: 768px) {
        top: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
    }
`;

const ProgressBar = styled.div`
    position: absolute;
    top: 40px;
    left: 40px;
    width: 200px;
    height: 4px;
    background: rgba(255,255,255,0.1);
    border-radius: 2px;
    overflow: hidden;
    z-index: 200;

    @media (max-width: 768px) {
        width: 100px;
        left: 20px; 
        top: 30px;
    }
`;

const ProgressFill = styled.div<{ $progress: number }>`
    height: 100%;
    background: #fff;
    width: ${props => props.$progress}%;
    transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
`;

const StepContainer = styled.div`
    position: relative;
    width: 100%;
    /* Removed absolute positioning to allow natural flow & scrolling */
    margin: 0 auto;
    transform: none;
    top: auto;
    left: auto;
    will-change: transform, opacity;
    display: flex;
    flex-direction: column;
    align-items: center; 
    /* We align details/inputs to center too */
`;

// --- TYPOGRAPHY ---

const SuperTitle = styled.h1`
    font-size: clamp(3rem, 6vw, 5rem);
    font-weight: 800; // Inter Tight
    letter-spacing: -0.04em;
    line-height: 1.1;
    color: #fff;
    margin: 0 0 40px 0;
    text-align: center;
    
    span.highlight {
        color: #666;
        font-weight: 400;
        display: block;
        font-size: 0.6em;
        margin-top: 10px;
    }
`;

const Question = styled.h2`
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 600;
    letter-spacing: -0.03em;
    color: #fff;
    margin-bottom: 40px;
    text-align: center;
    max-width: 800px;

    @media (max-width: 768px) {
        margin-bottom: 20px; /* Reduced for mobile */
    }
`;

// --- INPUTS ---

const InputWrapper = styled.div`
    display: inline-grid;
    align-items: center;
    justify-items: center;
    position: relative;
    width: auto;
    max-width: none; /* Truly infinite expansion (clamped by maxLength) */
    min-width: 200px;
    margin-bottom: 30px;
    transition: width 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    
    @media (max-width: 768px) {
        margin-bottom: 15px;
    }

    &::after {
        content: attr(data-value);
        visibility: hidden;
        white-space: pre;
        font-size: clamp(1.2rem, 3vw, 2.5rem);
        font-weight: 500;
        padding: 20px 0;
        grid-area: 1 / 1;
        min-width: 200px;

        @media (max-width: 768px) {
            padding: 10px 0;
        }
    }
`;

const DynamicInput = styled.input`
    width: 100%;
    grid-area: 1 / 1;
    background: transparent;
    border: none;
    border-bottom: 2px solid rgba(255,255,255,0.1);
    font-size: clamp(1.2rem, 3vw, 2.5rem);
    font-weight: 500;
    color: #fff;
    padding: 20px 0;
    outline: none;
    transition: border-color 0.3s ease;
    text-align: center;
    border-radius: 0;

    @media (max-width: 768px) {
        padding: 10px 0;
    }

    /* Kill WebKit Autofill Yellow Background */
    &:-webkit-autofill,
    &:-webkit-autofill:hover, 
    &:-webkit-autofill:focus, 
    &:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 30px black inset !important;
        -webkit-text-fill-color: white !important;
        transition: background-color 5000s ease-in-out 0s;
        caret-color: white; /* Keep cursor white */
    }

    &::placeholder {
        color: #444;
    }

    &:focus {
        border-color: #fff;
    }
`;

const AutoResizeInput = ({ value, placeholder, ...props }: any) => {
    // Determine the content to sizing: value or placeholder if value is empty
    // But to prevent jumping, we usually want it to be at least placeholder width 
    // OR we fix a min-width and only expand if value > min-width.
    // Let's use value || placeholder for the ghost element so it starts at placeholder width.
    // If the user wants it to start small, we'd use (value || " ").
    const displayContent = value || placeholder || " ";

    return (
        <InputWrapper data-value={displayContent}>
            <DynamicInput value={value} placeholder={placeholder} {...props} />
        </InputWrapper>
    );
};

const TextAreaWrapper = styled.div`
    display: inline-grid;
    align-items: center;
    justify-items: center;
    position: relative;
    width: auto;
    max-width: 90vw;
    min-width: 300px;
    margin-bottom: 40px;
    transition: width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    
    @media (max-width: 768px) {
        margin-bottom: 20px;
        min-width: 250px;
    }

    &::after {
        content: attr(data-value);
        visibility: hidden;
        white-space: pre-wrap;
        word-break: break-word;
        font-size: clamp(1.1rem, 2vw, 1.5rem);
        font-family: inherit;
        line-height: 1.4;
        padding: 20px 0;
        grid-area: 1 / 1;
        min-width: 300px;
        text-align: center;

        @media (max-width: 768px) {
            padding: 10px 0;
            min-width: 250px;
        }
    }
`;

const DynamicTextarea = styled.textarea`
    width: 100%;
    height: 100%;
    grid-area: 1 / 1;
    background: transparent;
    border: none;
    border-bottom: 2px solid rgba(255,255,255,0.1);
    font-size: clamp(1.1rem, 2vw, 1.5rem);
    font-family: inherit;
    line-height: 1.4;
    color: #fff;
    outline: none;
    resize: none;
    padding: 20px 0;
    transition: border-color 0.3s ease;
    text-align: center;
    border-radius: 0;
    overflow: hidden;

    @media (max-width: 768px) {
        padding: 10px 0;
    }

    /* Kill WebKit Autofill Yellow Background */
    &:-webkit-autofill,
    &:-webkit-autofill:hover, 
    &:-webkit-autofill:focus, 
    &:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 30px black inset !important;
        -webkit-text-fill-color: white !important;
        transition: background-color 5000s ease-in-out 0s;
        caret-color: white; /* Keep cursor white */
    }

    &::placeholder {
        color: #444;
    }

    &:focus {
        border-color: #fff;
    }
`;

const DiagonallyExpandingTextarea = ({ value, placeholder, ...props }: any) => {
    const displayContent = (value || placeholder || " ") + "\n";
    return (
        <TextAreaWrapper data-value={displayContent}>
            <DynamicTextarea value={value} placeholder={placeholder} {...props} />
        </TextAreaWrapper>
    );
};

// --- BUTTONS ---

const PrimaryButton = styled.button`
    background: #fff;
    color: #000;
    border: none;
    padding: 24px 60px;
    border-radius: 100px;
    font-size: 1.1rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    position: relative;
    overflow: hidden;
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, opacity 0.3s ease;
    margin-top: 20px;
    opacity: ${props => props.disabled ? 0.3 : 1};

    @media (hover: hover) {
        &:not(:disabled):hover {
            transform: scale(1.05);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
        }
    }

    &:not(:disabled):active {
        transform: scale(0.95);
    }
`;

const SecondaryButton = styled.button`
    background: transparent;
    color: #666;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 16px 32px;
    border-radius: 100px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    margin-top: 20px;
    transition: all 0.3s ease;

    @media (hover: hover) {
        &:hover {
            color: #fff;
            border-color: #fff;
        }
    }
`;

const ButtonRow = styled.div`
    display: flex;
    gap: 30px;
    align-items: center;
    justify-content: center;
    margin-top: 40px;
`;

// --- GRID ---

const ServiceGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    width: 100%;
    max-width: 800px;

    @media(max-width: 600px) { 
        grid-template-columns: 1fr;
        gap: 15px; 
    }
`;

const ServiceCard = styled.div<{ $selected: boolean }>`
    background: ${props => props.$selected ? '#fff' : 'rgba(255,255,255,0.05)'};
    color: ${props => props.$selected ? '#000' : '#fff'};
    padding: 30px;
    border-radius: 24px;
    border: 1px solid ${props => props.$selected ? '#fff' : 'rgba(255,255,255,0.1)'};
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    position: relative;
    overflow: hidden;
    
    @media (hover: hover) {
        &:hover {
            transform: translateY(-5px);
            background: ${props => props.$selected ? '#fff' : 'rgba(255,255,255,0.1)'};
            border-color: ${props => props.$selected ? '#fff' : 'rgba(255,255,255,0.3)'};
        }
    }

    h3 {
        margin: 0 0 5px 0;
        font-size: 1.25rem;
        font-weight: 700;
    }
    
    p {
        margin: 0;
        font-size: 0.9rem;
        opacity: ${props => props.$selected ? 0.8 : 0.5};
    }

    @media (max-width: 768px) {
        padding: 20px;
    }
`;

// --- BUDGET SLIDER ---

const BudgetContainer = styled.div`
    width: 100%;
    max-width: 600px;
    margin: 40px auto;
    text-align: center;
`;

const BudgetValue = styled.div`
    font-size: clamp(2.5rem, 8vw, 4rem);
    font-weight: 800;
    color: #fff;
    margin-bottom: 20px;
    font-variant-numeric: tabular-nums;
    letter-spacing: -2px;
    white-space: nowrap; /* Prevent awkward wrapping logic if possible */
    
    @media (max-width: 768px) {
        letter-spacing: -1px;
    }
`;

const RangeInput = styled.input`
    -webkit-appearance: none;
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    outline: none;
    
    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: #fff;
        cursor: pointer;
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
        transition: transform 0.2s ease;
    }
    
    @media (hover: hover) {
        &::-webkit-slider-thumb:hover {
            transform: scale(1.2);
        }
    }
`;

// --- COMPONENT ---

const Form: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {

    const [step, setStep] = useState<FormStep>('INTRO');
    const [data, setData] = useState<FormData>({
        name: '',
        company: '',
        email: '',
        website: '',
        businessName: '',
        industry: '',
        businessDesc: '',
        services: [],
        budget: 2, // Default to middle option
        details: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Canvas & Animation Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Reset on close
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setStep('INTRO');
                setData({
                    name: '',
                    company: '',
                    email: '',
                    website: '',
                    businessName: '',
                    industry: '',
                    businessDesc: '',
                    services: [],
                    budget: 2,
                    details: ''
                });
            }, 600);
        }
    }, [isOpen]);

    // Canvas Background
    useEffect(() => {
        if (!isOpen || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        let time = 0;
        const orbs = [
            { x: width * 0.2, y: height * 0.3, r: 300, dx: 0.5, dy: 0.3, color: 'rgba(50, 50, 60, 0.4)' },
            { x: width * 0.8, y: height * 0.7, r: 400, dx: -0.4, dy: -0.4, color: 'rgba(60, 50, 50, 0.4)' },
            { x: width * 0.5, y: height * 0.5, r: 200, dx: 0.2, dy: -0.2, color: 'rgba(50, 60, 50, 0.4)' }
        ];

        let animationId: number;

        const render = () => {
            time += 0.01;
            ctx.clearRect(0, 0, width, height);

            orbs.forEach(orb => {
                orb.x += orb.dx + Math.sin(time) * 0.5;
                orb.y += orb.dy + Math.cos(time) * 0.5;

                // Bounce
                if (orb.x < 0 || orb.x > width) orb.dx *= -1;
                if (orb.y < 0 || orb.y > height) orb.dy *= -1;

                const g = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
                g.addColorStop(0, orb.color);
                g.addColorStop(1, 'rgba(255,255,255,0)');

                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
                ctx.fill();
            });

            animationId = requestAnimationFrame(render);
        };
        render();

        return () => cancelAnimationFrame(animationId);
    }, [isOpen]);

    // Step Transition Animation
    const transitionTo = (nextStep: FormStep) => {
        const currentContainer = document.getElementById(`step - ${step} `);

        // Manual Exit
        if (currentContainer) {
            gsap.to(currentContainer, {
                y: -50,
                opacity: 0,
                duration: 0.4,
                ease: 'power3.in',
                onComplete: () => {
                    setStep(nextStep);
                }
            });
        } else {
            setStep(nextStep);
        }
    };

    // Entrance Animation for new Step
    useEffect(() => {
        if (!isOpen) return;
        const el = document.getElementById(`step - ${step} `);
        if (el) {
            gsap.fromTo(el,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.1 }
            );
        }
    }, [step, isOpen]);


    // Handlers
    const toggleService = (id: string) => {
        setData(prev => {
            if (prev.services.includes(id)) return { ...prev, services: prev.services.filter(s => s !== id) };
            return { ...prev, services: [...prev.services, id] };
        });
    };

    // Calculate Progress
    const progress = useMemo(() => {
        const steps = ['INTRO', 'IDENTITY', 'BUSINESS', 'SERVICES', 'BUDGET', 'DETAILS', 'SUCCESS'];
        return (steps.indexOf(step) / (steps.length - 1)) * 100;
    }, [step]);


    return (
        <AetherRoot $isOpen={isOpen} ref={containerRef}>

            <CloseButton onClick={onClose}>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </CloseButton>

            <ProgressBar><ProgressFill $progress={progress} /></ProgressBar>

            <ContentWrapper>

                {step === 'INTRO' && (
                    <StepContainer id="step-INTRO">
                        <SuperTitle>
                            Let's build<br />something legendary.
                        </SuperTitle>
                        <PrimaryButton onClick={() => transitionTo('IDENTITY')}> Start the Journey </PrimaryButton>
                    </StepContainer>
                )}

                {step === 'IDENTITY' && (
                    <StepContainer id="step-IDENTITY">
                        <Question>First, introduce yourself.</Question>
                        <AutoResizeInput
                            placeholder="Your Name"
                            value={data.name}
                            onChange={(e: any) => setData({ ...data, name: e.target.value })}
                            autoFocus
                            maxLength={50}
                        />
                        <AutoResizeInput
                            placeholder="Your Email"
                            type="email"
                            value={data.email}
                            onChange={(e: any) => setData({ ...data, email: e.target.value })}
                            maxLength={100}
                        />
                        <ButtonRow>
                            <SecondaryButton onClick={() => transitionTo('INTRO')}>Back</SecondaryButton>
                            <PrimaryButton onClick={() => transitionTo('BUSINESS')} disabled={data.name.trim().length < 2 || !isValidEmail(data.email)}>Next</PrimaryButton>
                        </ButtonRow>
                    </StepContainer>
                )}

                {step === 'BUSINESS' && (
                    <StepContainer id="step-BUSINESS">
                        <Question>Tell us about your business.</Question>
                        <AutoResizeInput
                            placeholder="Business Name"
                            value={data.businessName}
                            onChange={(e: any) => setData({ ...data, businessName: e.target.value })}
                            autoFocus
                            maxLength={100}
                        />
                        <AutoResizeInput
                            placeholder="Industry (e.g. E-commerce)"
                            value={data.industry}
                            onChange={(e: any) => setData({ ...data, industry: e.target.value })}
                            maxLength={100}
                        />
                        <AutoResizeInput
                            placeholder="Website URL (e.g. pajzo.com)"
                            value={data.website}
                            onChange={(e: any) => setData({ ...data, website: e.target.value })}
                            maxLength={100}
                        />
                        <DiagonallyExpandingTextarea
                            placeholder="Briefly describe what your business does..."
                            value={data.businessDesc}
                            onChange={(e: any) => setData({ ...data, businessDesc: e.target.value })}
                            maxLength={500}
                        />
                        <ButtonRow>
                            <SecondaryButton onClick={() => transitionTo('IDENTITY')}>Back</SecondaryButton>
                            <PrimaryButton onClick={() => transitionTo('SERVICES')} disabled={data.businessName.trim().length < 2 || data.industry.trim().length < 2 || !isValidUrl(data.website)}>Next</PrimaryButton>
                        </ButtonRow>
                    </StepContainer>
                )}

                {step === 'SERVICES' && (
                    <StepContainer id="step-SERVICES">
                        <Question>How can we help?</Question>
                        <ServiceGrid>
                            {SERVICES.map(s => (
                                <ServiceCard
                                    key={s.id}
                                    $selected={data.services.includes(s.id)}
                                    onClick={() => toggleService(s.id)}
                                >
                                    <h3>{s.label}</h3>
                                    <p>{s.desc}</p>
                                </ServiceCard>
                            ))}
                        </ServiceGrid>
                        <ButtonRow>
                            <SecondaryButton onClick={() => transitionTo('BUSINESS')}>Back</SecondaryButton>
                            <PrimaryButton onClick={() => transitionTo('BUDGET')} disabled={data.services.length === 0}>Next</PrimaryButton>
                        </ButtonRow>
                    </StepContainer>
                )}

                {step === 'BUDGET' && (
                    <StepContainer id="step-BUDGET">
                        <Question>Ballpark figures.</Question>
                        <BudgetContainer>
                            <BudgetValue>{BUDGET_RANGES[data.budget]}</BudgetValue>
                            <RangeInput
                                type="range"
                                min="0"
                                max={BUDGET_RANGES.length - 1}
                                step="1"
                                value={data.budget}
                                onChange={e => setData({ ...data, budget: Number(e.target.value) })}
                            />
                        </BudgetContainer>
                        <ButtonRow>
                            <SecondaryButton onClick={() => transitionTo('SERVICES')}>Back</SecondaryButton>
                            <PrimaryButton onClick={() => transitionTo('DETAILS')}>Next</PrimaryButton>
                        </ButtonRow>
                    </StepContainer>
                )}

                {step === 'DETAILS' && (
                    <StepContainer id="step-DETAILS">
                        <Question>Tell us the details.</Question>
                        <DiagonallyExpandingTextarea
                            placeholder="Describe your vision, timeline, and any specific requirements..."
                            value={data.details}
                            onChange={(e: any) => setData({ ...data, details: e.target.value })}
                            autoFocus
                            maxLength={2000}
                        />
                        <ButtonRow>
                            <SecondaryButton onClick={() => transitionTo('BUDGET')}>Back</SecondaryButton>
                            <PrimaryButton onClick={async () => {
                                setIsLoading(true);
                                setError(null);

                                try {
                                    // Format services into a readable list
                                    const formattedServices = data.services.length > 0
                                        ? data.services.map(id => {
                                            const service = SERVICES.find(s => s.id === id);
                                            return `• ${service ? service.label : id}`;
                                        }).join('\n')
                                        : 'None selected';

                                    const payload = {
                                        name: data.name,
                                        email: data.email,
                                        company: data.businessName,
                                        website: data.website,
                                        industry: data.industry,
                                        businessDesc: data.businessDesc,
                                        services: formattedServices,
                                        budget: BUDGET_RANGES[data.budget],
                                        message: data.details
                                    };

                                    const response = await fetch('/api/send', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(payload)
                                    });

                                    const result = await response.json();

                                    if (result.success) {
                                        transitionTo('SUCCESS');
                                    } else {
                                        console.error("Resend API Error:", result.error);
                                        setError("Failed to send message. Please try again later.");
                                    }
                                } catch (err: any) {
                                    console.error("Fetch Error:", err);
                                    setError(`Failed: ${err.message || 'Unknown error'}`);
                                } finally {
                                    setIsLoading(false);
                                }
                            }} disabled={data.details.trim().length < 10 || isLoading}>
                                {isLoading ? 'Sending...' : 'Submit Proposal'}
                            </PrimaryButton>
                            {error && <p style={{ color: 'red', marginTop: '10px', fontSize: '0.9rem' }}>{error}</p>}
                        </ButtonRow>
                    </StepContainer>
                )}

                {step === 'SUCCESS' && (
                    <StepContainer id="step-SUCCESS">
                        <SuperTitle>
                            Sent.
                            <span className="highlight">We'll be in touch shortly.</span>
                        </SuperTitle>
                        <PrimaryButton onClick={onClose}> Return to Site </PrimaryButton>
                    </StepContainer>
                )}

            </ContentWrapper>
        </AetherRoot>
    );
};

export default Form;
