import React, { useEffect, useRef } from 'react';
import type { ChatMessage } from '../../hooks/useClaude';
import styles from './ChatBox.module.css';

interface ChatBoxProps {
    messages: ChatMessage[];
    streamingMessage: string;
    isLoading: boolean;
}

export function ChatBox({ messages, streamingMessage, isLoading }: ChatBoxProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, streamingMessage]);

    const renderMarkdown = (text: string) => {
        // Process line by line to handle block-level elements
        return text.split('\n').map((line, lineIdx, arr) => {
            // Bold: **text**
            // Italic: *text* (but not **)
            // Inline code: `code`
            const parts: React.ReactNode[] = [];
            let remaining = line;
            let key = 0;

            // Process inline patterns
            const pattern = /(\*\*(.+?)\*\*|\*(?!\*)(.+?)(?<!\*)\*|`(.+?)`)/g;
            let lastIndex = 0;
            let match;

            while ((match = pattern.exec(remaining)) !== null) {
                if (match.index > lastIndex) {
                    parts.push(remaining.slice(lastIndex, match.index));
                }
                if (match[0].startsWith('**')) {
                    parts.push(<strong key={key++} style={{ fontWeight: 700, color: '#fff' }}>{match[2]}</strong>);
                } else if (match[0].startsWith('`')) {
                    parts.push(<code key={key++} style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.85em', fontFamily: 'monospace' }}>{match[4]}</code>);
                } else {
                    parts.push(<em key={key++}>{match[3]}</em>);
                }
                lastIndex = match.index + match[0].length;
            }
            if (lastIndex < remaining.length) {
                parts.push(remaining.slice(lastIndex));
            }

            return (
                <React.Fragment key={lineIdx}>
                    {parts.length > 0 ? parts : line}
                    {lineIdx !== arr.length - 1 && <br />}
                </React.Fragment>
            );
        });
    };

    return (
        <div className={styles.chatBox} ref={scrollRef}>
            {messages.length === 0 && !isLoading && (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                            <line x1="8" y1="21" x2="16" y2="21"></line>
                            <line x1="12" y1="17" x2="12" y2="21"></line>
                        </svg>
                    </div>
                    <h2>PAJZO INTELLIGENCE</h2>
                    <p>Advanced enterprise processing active.</p>
                </div>
            )}

            {messages.map((msg, idx) => (
                <div
                    key={idx}
                    className={`${styles.messageWrapper} ${msg.role === 'user' ? styles.user : styles.assistant}`}
                >
                    {msg.role === 'assistant' && (
                        <div className={styles.avatar}>
                            <img src="/hero.svg" alt="Pajzo" />
                        </div>
                    )}
                    <div className={styles.messageContent}>
                        {msg.images && msg.images.map((imgBase64, i) => (
                            <img
                                key={i}
                                src={`data:image/jpeg;base64,${imgBase64}`}
                                alt="User upload"
                                className={styles.sentImage}
                            />
                        ))}
                        {renderMarkdown(msg.content)}
                    </div>
                </div>
            ))}

            {streamingMessage && (
                <div className={`${styles.messageWrapper} ${styles.assistant}`}>
                    <div className={styles.avatar}>
                        <img src="/hero.svg" alt="Pajzo" />
                    </div>
                    <div className={styles.messageContent}>
                        {renderMarkdown(streamingMessage)}
                        <span className={styles.cursor}></span>
                    </div>
                </div>
            )}

            {isLoading && !streamingMessage && (
                <div className={`${styles.messageWrapper} ${styles.assistant}`}>
                    <div className={styles.avatar}>
                        <img src="/hero.svg" alt="Pajzo" />
                    </div>
                    <div className={styles.messageContent}>
                        <div className={styles.typingIndicator}>
                            <div className={styles.dot}></div>
                            <div className={styles.dot}></div>
                            <div className={styles.dot}></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
