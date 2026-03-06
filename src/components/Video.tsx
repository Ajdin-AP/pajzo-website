import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import styled, { keyframes } from 'styled-components';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// STYLED COMPONENTS (DARK MODE / STEALTH TECH)
// ==========================================

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
  70% { box-shadow: 0 0 0 20px rgba(99, 102, 241, 0); }
  100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
`;

const Section = styled.section`
    position: relative;
    padding-top: 80vh;
    padding-bottom: 80vh;
    width: 100%;
    background: #000000;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 10;
    overflow: hidden;
`;

const Spotlight = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 80%;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0,0,0,0) 70%);
    pointer-events: none;
    z-index: 1;
`;

const Background = styled.div`
    position: absolute;
    inset: 0;
    z-index: 0;
    opacity: 0.3;
    background-image: 
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 60px 60px;
`;

const Container = styled.div`
    position: relative;
    width: 90%;
    max-width: 1200px;
    z-index: 2;
`;

// PREVIEW COMPONENT
const PreviewCard = styled.div`
    position: relative;
    width: 100%;
    aspect-ratio: 16/9;
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
    transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
    box-shadow: 0 20px 50px -10px rgba(0,0,0,0.5);

    &:hover {
        transform: scale(1.02);
        border-color: rgba(99, 102, 241, 0.5);
        box-shadow: 0 0 30px rgba(99, 102, 241, 0.2);
    }
`;

const PreviewVideo = styled.video`
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.6;
    filter: grayscale(80%) contrast(1.2);
    transition: all 0.7s ease;

    ${PreviewCard}:hover & {
        opacity: 0.8;
        filter: grayscale(0%) contrast(1.1);
        transform: scale(1.05);
    }
`;

const Overlay = styled.div`
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%);
    transition: all 0.5s ease;
`;

const PlayButton = styled.div`
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    margin-bottom: 24px;
    position: relative;
    box-shadow: 0 0 20px rgba(255,255,255,0.05);

    i {
        font-size: 2rem;
        color: #fff;
        margin-left: 6px; 
        text-shadow: 0 0 10px rgba(255,255,255,0.5);
    }

    &::after {
        content: '';
        position: absolute;
        inset: -2px;
        border-radius: 50%;
        border: 2px solid rgba(99, 102, 241, 0.5);
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    ${PreviewCard}:hover & {
        transform: scale(1.1);
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(99, 102, 241, 0.8);
        box-shadow: 0 0 30px rgba(99, 102, 241, 0.4);
        animation: ${pulseGlow} 2s infinite;

        &::after {
            opacity: 1;
        }
    }
`;

const Label = styled.div`
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.9rem;
    letter-spacing: 2px;
    color: #94a3b8;
    text-transform: uppercase;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 10px;

    span { 
        color: #fff; 
        font-weight: 700; 
        text-shadow: 0 0 10px rgba(255,255,255,0.3);
    }

    &::after {
        content: '_';
        animation: blink 1s step-end infinite;
    }
    @keyframes blink { 50% { opacity: 0; } }
`;

// MODAL & CUSTOM PLAYER
const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    background: rgba(0,0,0,0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.5s ease;
    backdrop-filter: blur(20px);

    &.open {
        opacity: 1;
        pointer-events: auto;
    }
`;

const ModalContent = styled.div`
    width: 90vw;
    max-width: 1400px;
    display: flex;
    flex-direction: column;
    position: relative;
    background: transparent;
    transform: scale(0.95);
    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);

    ${ModalOverlay}.open & {
        transform: scale(1);
    }
`;

const VideoWrapper = styled.div`
    width: 100%;
    aspect-ratio: 16/9;
    position: relative;
    background: #000;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 20px 50px -10px rgba(0,0,0,0.5);
`;

const ControlsContainer = styled.div`
    margin-top: 16px;
    width: 100%;
    padding: 16px 24px;
    background: rgba(25, 25, 25, 0.9);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
`;

const ProgressBarContainer = styled.div`
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    &:hover {
        background: rgba(255, 255, 255, 0.15);
    }
`;

/* 
   REMOVED TRANSITION for "ProgressFill" to allow 60fps JS updates 
   without fighting CSS interpolation
*/
const ProgressFill = styled.div`
    height: 100%;
    background: linear-gradient(90deg, #6366f1, #818cf8);
    border-radius: 3px;
    position: relative;
    box-shadow: 0 0 15px rgba(99, 102, 241, 0.6);
    width: 0%; /* Intial width */
    
    /* Head */
    &::after {
        content: '';
        position: absolute;
        right: -6px;
        top: 50%;
        transform: translateY(-50%);
        width: 12px;
        height: 12px;
        background: #fff;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(255,255,255,0.8);
        opacity: 0;
        transition: opacity 0.2s;
    }

    ${ProgressBarContainer}:hover &::after {
        opacity: 1;
    }
`;

const ControlsRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.9rem;
`;

const LeftControls = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`;

const RightControls = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`;

const ControlButton = styled.button`
    background: none;
    border: none;
    color: rgba(255,255,255,0.7);
    cursor: pointer;
    font-size: 1.1rem;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    border-radius: 6px;

    /* Highlight Active/Hover */
    &:hover {
        color: #fff;
        background: rgba(255,255,255,0.05);
        transform: translateY(-1px);
    }
    
    &:active {
        transform: translateY(0);
    }
`;

const VolumeContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;

    &:hover .volume-slider {
        width: 80px;
        opacity: 1;
        margin-left: 0px;
    }
`;

const VolumeSlider = styled.input`
    width: 0;
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    height: 4px;
    appearance: none;
    background: rgba(255,255,255,0.2);
    border-radius: 2px;
    
    &::-webkit-slider-thumb {
        appearance: none;
        width: 10px;
        height: 10px;
        background: #fff;
        border-radius: 50%;
        margin-top: -3px; /* Center thumb */
    }

    &::-webkit-slider-runnable-track {
        height: 4px;
        border-radius: 2px;
    }
`;

const TimeDisplay = styled.div`
    color: rgba(255,255,255,0.4);
    font-size: 0.8rem;
    letter-spacing: 1px;
    font-variant-numeric: tabular-nums;
    font-weight: 500;
    
    span { color: #fff; }
`;

const CloseButton = styled.button`
    position: absolute;
    top: -50px;
    right: 0;
    background: none;
    border: none;
    color: white;
    font-size: 0.9rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    opacity: 0.6;
    transition: opacity 0.3s ease;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 2px;
    text-transform: uppercase;
    z-index: 2147483647;

    &:hover {
        opacity: 1;
        color: #6366f1;
    }
`;

// Helper for time formatting (00:00)
const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// ==========================================
// COMPONENT LOGIC
// ==========================================

const VideoPresentation: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    // Video State
    const fullVideoRef = useRef<HTMLVideoElement>(null);
    const progressFillRef = useRef<HTMLDivElement>(null); // Direct DOM ref for 60fps update

    const [isPlaying, setIsPlaying] = useState(false);
    // Removed 'progress' state used for bar width to avoid re-renders
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    const requestRef = useRef<number | null>(null);
    const scrollYRef = useRef(0);

    // Scroll Animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(cardRef.current,
                { y: 50, opacity: 0, scale: 0.95, filter: "blur(10px)" },
                {
                    y: 0, opacity: 1, scale: 1, filter: "blur(0px)",
                    duration: 1.2, ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%"
                    }
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    // Body Scroll Logic
    useEffect(() => {
        const body = document.body;
        if (!body) return;
        if (isOpen) {
            scrollYRef.current = window.scrollY;
            body.style.position = 'fixed';
            body.style.top = `-${scrollYRef.current}px`;
            body.style.width = '100%';
            body.style.overflowY = 'scroll';
        } else {
            const scrollY = body.style.top;
            body.style.position = '';
            body.style.top = '';
            body.style.width = '';
            body.style.overflowY = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    }, [isOpen]);


    // ------------------------------------------
    // 60FPS SMOOTH PROGRESS LOOP
    // ------------------------------------------
    const updateProgress = useCallback(() => {
        if (!fullVideoRef.current || !progressFillRef.current) return;

        const current = fullVideoRef.current.currentTime;
        const dur = fullVideoRef.current.duration;

        if (dur > 0) {
            const percent = (current / dur) * 100;
            progressFillRef.current.style.width = `${percent}%`;
        }

        if (!fullVideoRef.current.paused && !fullVideoRef.current.ended) {
            requestRef.current = requestAnimationFrame(updateProgress);
        }
    }, []);

    useEffect(() => {
        if (isPlaying) {
            requestRef.current = requestAnimationFrame(updateProgress);
        } else {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isPlaying, updateProgress]);


    // Video Handlers
    const togglePlay = useCallback(() => {
        if (!fullVideoRef.current) return;
        if (fullVideoRef.current.paused) {
            fullVideoRef.current.play().catch(console.error);
            setIsPlaying(true);
        } else {
            fullVideoRef.current.pause();
            setIsPlaying(false);
        }
    }, []);

    const handleTimeUpdate = () => {
        // Still used for numerical display (doesn't need 60fps)
        if (!fullVideoRef.current) return;
        setCurrentTime(fullVideoRef.current.currentTime);
        setDuration(fullVideoRef.current.duration);
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!fullVideoRef.current) return;
        const timeline = e.currentTarget;
        const rect = timeline.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const percent = offsetX / rect.width;
        fullVideoRef.current.currentTime = percent * fullVideoRef.current.duration;

        // Update visual immediately
        if (progressFillRef.current) {
            progressFillRef.current.style.width = `${percent * 100}%`;
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const vol = parseFloat(e.target.value);
        setVolume(vol);
        if (fullVideoRef.current) {
            fullVideoRef.current.volume = vol;
            fullVideoRef.current.muted = vol === 0;
            setIsMuted(vol === 0);
        }
    };

    const toggleMute = () => {
        if (!fullVideoRef.current) return;
        const newMute = !isMuted;
        setIsMuted(newMute);
        fullVideoRef.current.muted = newMute;
        if (newMute) setVolume(0);
        else setVolume(1);
    };

    const toggleFullscreen = () => {
        if (!fullVideoRef.current) return;
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            fullVideoRef.current.parentElement?.requestFullscreen();
        }
    };

    const openCinema = () => {
        setIsOpen(true);
        setTimeout(() => {
            if (fullVideoRef.current) {
                fullVideoRef.current.currentTime = 0;
                fullVideoRef.current.muted = false;
                setVolume(1);
                setIsMuted(false);
                fullVideoRef.current.play().catch(console.error);
                setIsPlaying(true);
            }
        }, 100);
    };

    const closeCinema = () => {
        setIsOpen(false);
        setIsPlaying(false);
        if (fullVideoRef.current) {
            fullVideoRef.current.pause();
        }
    };

    return (
        <Section ref={sectionRef} id="presentation">
            <Background />
            <Spotlight />

            <Container>
                <PreviewCard ref={cardRef} onClick={openCinema}>
                    <PreviewVideo
                        src="https://assets.mixkit.co/videos/preview/mixkit-white-abstract-technology-network-background-2775-large.mp4"
                        autoPlay muted loop playsInline
                    />
                    <Overlay>
                        <PlayButton><i className="fas fa-play"></i></PlayButton>
                        <Label><span>Mission Briefing</span> // v2.0</Label>
                    </Overlay>
                </PreviewCard>
            </Container>

            {typeof document !== 'undefined' && document.body && createPortal(
                <ModalOverlay
                    className={isOpen ? 'open' : ''}
                    onClick={closeCinema}
                >
                    <ModalContent
                        onClick={(e) => e.stopPropagation()}
                    >
                        <CloseButton onClick={closeCinema}>
                            Close Briefing <i className="fas fa-times"></i>
                        </CloseButton>

                        <VideoWrapper>
                            <video
                                ref={fullVideoRef}
                                src="https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4"
                                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                                playsInline
                                onClick={togglePlay}
                                onTimeUpdate={handleTimeUpdate}
                                onEnded={() => { setIsPlaying(false); }}
                            />
                        </VideoWrapper>

                        <ControlsContainer>
                            <ProgressBarContainer onClick={handleSeek}>
                                <ProgressFill ref={progressFillRef} />
                            </ProgressBarContainer>

                            <ControlsRow>
                                <LeftControls>
                                    <ControlButton onClick={togglePlay}>
                                        <i className={`fas fa-${isPlaying ? 'pause' : 'play'}`}></i>
                                    </ControlButton>

                                    <VolumeContainer>
                                        <ControlButton onClick={toggleMute}>
                                            <i className={`fas fa-volume-${isMuted ? 'mute' : 'up'}`}></i>
                                        </ControlButton>
                                        <VolumeSlider
                                            className="volume-slider"
                                            type="range" min="0" max="1" step="0.1"
                                            value={volume} onChange={handleVolumeChange}
                                        />
                                    </VolumeContainer>

                                    <TimeDisplay>
                                        <span>{formatTime(currentTime)}</span> / {formatTime(duration)}
                                    </TimeDisplay>
                                </LeftControls>

                                <RightControls>
                                    <ControlButton onClick={toggleFullscreen}>
                                        <i className="fas fa-expand"></i>
                                    </ControlButton>
                                </RightControls>
                            </ControlsRow>
                        </ControlsContainer>

                    </ModalContent>
                </ModalOverlay>,
                document.body as HTMLElement
            )}
        </Section>
    );
};

export default VideoPresentation;
