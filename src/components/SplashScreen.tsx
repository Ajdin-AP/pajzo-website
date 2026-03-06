import React from 'react';
import styled, { keyframes } from 'styled-components';

// Simple fade/blur in for the logo
const logoReveal = keyframes`
    0% { filter: blur(20px); opacity: 0; transform: scale(0.9); }
    100% { filter: blur(0px); opacity: 1; transform: scale(1); }
`;

// Subtle pulse
const pulse = keyframes`
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
`;

const Screen = styled.div<{ $loading: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    height: 100dvh;
    background: #000000;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    
    /* Reveal Step 2: Fade out background (delayed until after logo fades) */
    transition: opacity 1.5s ease-in-out 0.8s, 
                visibility 1.5s ease-in-out 0.8s;
    pointer-events: ${props => props.$loading ? 'all' : 'none'};
    opacity: ${props => props.$loading ? 1 : 0};
    visibility: ${props => props.$loading ? 'visible' : 'hidden'};
`;

const Logo = styled.h1<{ $loading: boolean }>`
    font-family: 'Inter', sans-serif;
    font-weight: 800;
    font-size: 4rem;
    color: #ffffff;
    margin: 0;
    letter-spacing: -2px;
    
    /* Reveal Step 1: Fade out Logo FIRST */
    opacity: ${props => props.$loading ? 1 : 0};
    transition: opacity 0.8s ease-in-out;

    animation: ${props => props.$loading ? logoReveal : 'none'} 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards,
               ${props => props.$loading ? pulse : 'none'} 2s ease-in-out infinite 0.8s;
`;

interface SplashScreenProps {
    isLoading: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ isLoading }) => {
    return (
        <Screen $loading={isLoading}>
            <Logo $loading={isLoading}>PAJZO</Logo>
        </Screen>
    );
};

export default SplashScreen;
