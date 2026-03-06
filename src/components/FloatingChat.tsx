import { useState, useEffect, useRef } from 'react';
import { useClaude } from '../hooks/useClaude';
import { ChatBox } from './Chat/ChatBox';
import { MessageInput } from './Chat/MessageInput';
import styles from './FloatingChat.module.css';
import gsap from 'gsap';

export function FloatingChat() {
    const [isOpen, setIsOpen] = useState(false);
    const { messages, isLoading, streamingMessage, sendMessage } = useClaude();
    const chatWindowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatWindowRef.current) {
            if (isOpen) {
                gsap.to(chatWindowRef.current, {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.6,
                    ease: "power4.out",
                    display: "flex"
                });
            } else {
                gsap.to(chatWindowRef.current, {
                    y: 50,
                    opacity: 0,
                    scale: 0.95,
                    duration: 0.4,
                    ease: "power2.in",
                    onComplete: () => {
                        if (chatWindowRef.current) {
                            chatWindowRef.current.style.display = 'none';
                        }
                    }
                });
            }
        }
    }, [isOpen]);

    return (
        <div className={styles.floatingContainer}>
            <div
                ref={chatWindowRef}
                className={styles.chatWindow}
                style={{ opacity: 0, display: 'none', transform: 'translateY(50px) scale(0.95)' }}
            >
                <div className={styles.chatHeader}>
                    <div className={styles.headerLeft}>
                        <div className={styles.logoContainer}>
                            <img src="/hero.svg" alt="Pajzo Logo" className={styles.logo} />
                        </div>
                        <div>
                            <h3>PAJZO AI</h3>
                            <span className={styles.status}>Online</span>
                        </div>
                    </div>
                    <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className={styles.chatBody}>
                    <ChatBox
                        messages={messages}
                        streamingMessage={streamingMessage}
                        isLoading={isLoading}
                    />
                </div>

                <div className={styles.chatFooter}>
                    <MessageInput
                        onSend={sendMessage}
                        disabled={isLoading}
                    />
                </div>
            </div>

            <button
                className={`${styles.floatingButton} ${isOpen ? styles.hidden : ''}`}
                onClick={() => setIsOpen(true)}
                aria-label="Open Pajzo AI"
            >
                <div className={styles.glowEffect}></div>
                <img src="/hero.svg" alt="Chat" className={styles.botIcon} />
            </button>
        </div>
    );
}
