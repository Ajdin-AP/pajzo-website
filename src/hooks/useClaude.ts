import { useState, useCallback, useRef, useEffect } from 'react';

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    images?: string[];
}

export function useClaude() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // VISUAL state: What the user actually sees typing out
    const [streamingMessage, setStreamingMessage] = useState('');

    // HIDDEN state: Raw buffers catching the jagged Anthropic network packets
    const fullNetworkBufferRef = useRef('');
    const displayIndexRef = useRef(0);
    const isProcessingRef = useRef(false);

    // FLUID TYPEWRITER ENGINE: Constantly bleeds out the hidden network buffer to the visible UI
    useEffect(() => {
        let animationFrameId: number;

        const updateTypewriter = () => {
            const bufferLen = fullNetworkBufferRef.current.length;
            const currentIdx = displayIndexRef.current;

            if (currentIdx < bufferLen) {
                // Dynamic flow control: If the network dumps a massive chunk, type faster to catch up.
                // If the network is slow, bleed out 1 character at a time.
                const diff = bufferLen - currentIdx;
                const charsToBleed = Math.max(1, Math.min(diff, Math.ceil(diff / 8)));

                displayIndexRef.current += charsToBleed;
                setStreamingMessage(fullNetworkBufferRef.current.slice(0, displayIndexRef.current));
            }

            animationFrameId = requestAnimationFrame(updateTypewriter);
        };

        animationFrameId = requestAnimationFrame(updateTypewriter);

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const sendMessage = useCallback(async (content: string, images?: string[]) => {
        if (isProcessingRef.current) return; // Prevent double-firing

        isProcessingRef.current = true;
        setIsLoading(true);

        // Reset typewriter and streaming buffers
        fullNetworkBufferRef.current = '';
        displayIndexRef.current = 0;
        setStreamingMessage('');

        // Handle scraping/URL logic
        let finalContent = content;
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const matches = content.match(urlRegex);

        if (matches && matches.length > 0) {
            const targetUrl = matches[0];
            try {
                // If we choose to move the scraper to the backend later
                await fetch(`http://localhost:3001/api/scrape?url=${encodeURIComponent(targetUrl)}`);
            } catch (e) {
                console.error("Scraper integration currently disabled on Claude Proxy");
            }
        }

        const newMessage: ChatMessage = { role: 'user', content: finalContent };
        const displayMessage: ChatMessage = { role: 'user', content: content };

        if (images && images.length > 0) {
            newMessage.images = images;
            displayMessage.images = images;
        }

        const newMessagesForAPI: ChatMessage[] = [...messages, newMessage];
        setMessages([...messages, displayMessage]);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: newMessagesForAPI.map(m => {
                        if (m.images && m.images.length > 0) {
                            const contentBlocks: any[] = m.images.map(img => {
                                // Dynamically detect Base64 image MIME type from magic byte headers
                                let media_type = 'image/jpeg';
                                if (img.startsWith('iVBORw0KGgo')) media_type = 'image/png';
                                else if (img.startsWith('UklGR')) media_type = 'image/webp';
                                else if (img.startsWith('R0lGOD')) media_type = 'image/gif';

                                return {
                                    type: 'image',
                                    source: {
                                        type: 'base64',
                                        media_type: media_type,
                                        data: img
                                    }
                                };
                            });
                            contentBlocks.push({ type: 'text', text: m.content });
                            return { role: m.role, content: contentBlocks };
                        }
                        return { role: m.role, content: m.content };
                    }),
                    stream: true
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error('No reader available');

            const decoder = new TextDecoder('utf-8');

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.trim() === 'data: [DONE]') {
                        break;
                    }
                    if (line.startsWith('data: ')) {
                        const dataStr = line.replace('data: ', '').trim();
                        if (dataStr) {
                            try {
                                const parsed = JSON.parse(dataStr);
                                if (parsed.message?.content) {
                                    // Inject raw tokens into the hidden buffer ONLY. 
                                    // The independent Typewriter engine loop will organically discover this and bleed it out.
                                    fullNetworkBufferRef.current += parsed.message.content;
                                }
                            } catch (e) {
                                console.error('Error parsing SSE chunk:', e);
                            }
                        }
                    }
                }
            }

            // Wait for the visual typewriter engine to finish bleeding out the final tokens
            // before snapping the message from the streaming bubble into the permanent chat history
            await new Promise<void>(resolve => {
                const checkAnimation = setInterval(() => {
                    if (displayIndexRef.current >= fullNetworkBufferRef.current.length) {
                        clearInterval(checkAnimation);
                        resolve();
                    }
                }, 50);
            });

            const finalMessage = fullNetworkBufferRef.current;
            setMessages(prev => [...prev, { role: 'assistant', content: finalMessage }]);

        } catch (error) {
            console.error('Error with Claude API generation:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error: Unable to reach Pajzo Secure API Proxy.' }]);
        } finally {
            fullNetworkBufferRef.current = '';
            displayIndexRef.current = 0;
            setStreamingMessage('');
            setIsLoading(false);
            isProcessingRef.current = false;
        }
    }, [messages]);

    return { messages, isLoading, streamingMessage, sendMessage };
}
