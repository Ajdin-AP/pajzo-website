import React, { useState, useRef, useEffect } from 'react';
import styles from './MessageInput.module.css';

interface MessageInputProps {
    onSend: (message: string, images?: string[]) => void;
    disabled: boolean;
}

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
    const [content, setContent] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isListening, setIsListening] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;

                recognition.onresult = (event: any) => {
                    let transcript = '';
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        transcript += event.results[i][0].transcript;
                    }
                    setContent(prev => {
                        // For simplicity in this local MVP, we append the spoken text
                        return prev + (prev.length > 0 && !prev.endsWith(' ') ? ' ' : '') + transcript;
                    });
                };

                recognition.onstart = () => setIsListening(true);
                recognition.onend = () => setIsListening(false);
                recognition.onerror = () => setIsListening(false);

                recognitionRef.current = recognition;
            }
        }
    }, []);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [content]);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Speech recognition is not supported in this browser. Please use Chrome or Safari.");
            return;
        }
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            // Ollama expects base64 without the data:image/png;base64, prefix
            const base64Data = result.split(',')[1];
            setSelectedImage(base64Data);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setSelectedImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        const hasText = content.trim().length > 0;

        if ((hasText || selectedImage) && !disabled) {
            onSend(content.trim() || 'Describe this image.', selectedImage ? [selectedImage] : undefined);
            setContent('');
            setSelectedImage(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handlePaste = async (e: React.ClipboardEvent) => {
        // 1. Check if the user pasted an actual physical image file
        const items = e.clipboardData?.items;
        if (items) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const file = items[i].getAsFile();
                    if (file) {
                        e.preventDefault(); // Stop the image from inserting as a weird string
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            const result = reader.result as string;
                            const base64Data = result.split(',')[1];
                            setSelectedImage(base64Data);
                        };
                        reader.readAsDataURL(file);
                        return;
                    }
                }
            }
        }

        // 2. Check if the user pasted a direct URL to an image
        const pastedText = e.clipboardData?.getData('text');
        if (pastedText) {
            const isImageUrl = /\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i.test(pastedText);

            // If it's a URL to an image, we can try to fetch it and convert it to base64 automatically
            if (isImageUrl && pastedText.startsWith('http')) {
                e.preventDefault(); // Stop the raw URL from pasting into the text box

                try {
                    // Note: This relies on the image server allowing Cross-Origin Resource Sharing (CORS).
                    // If the server blocks it, it will fail silently and the user will have to manually upload it.
                    const response = await fetch(pastedText);
                    const blob = await response.blob();

                    if (blob.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            const result = reader.result as string;
                            const base64Data = result.split(',')[1];
                            setSelectedImage(base64Data);
                        };
                        reader.readAsDataURL(blob);
                    }
                } catch (error) {
                    console.error("Failed to auto-fetch pasted image URL:", error);
                    // Fallback: If CORS blocks the fetch, just paste the text normally
                    setContent(prev => prev + pastedText);
                }
            }
        }
    };

    return (
        <form className={styles.inputForm} onSubmit={handleSubmit}>
            {selectedImage && (
                <div className={styles.imagePreviewContainer}>
                    <img src={`data:image/jpeg;base64,${selectedImage}`} alt="Upload preview" className={styles.imagePreview} />
                    <button type="button" onClick={removeImage} className={styles.removeImageBtn}>✕</button>
                </div>
            )}
            <div className={styles.inputWrapper}>
                <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    style={{ display: 'none' }}
                />
                <button
                    type="button"
                    className={`${styles.actionBtn} ${isListening ? styles.listeningActive : ''}`}
                    onClick={toggleListening}
                    disabled={disabled}
                    title="Dictate message"
                    aria-label="Toggle voice dictation"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                        <line x1="12" y1="19" x2="12" y2="23"></line>
                        <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>
                </button>
                <button
                    type="button"
                    className={styles.actionBtn}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled}
                    title="Attach image"
                    aria-label="Attach image"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                    </svg>
                </button>
                <textarea
                    ref={textareaRef}
                    className={styles.textarea}
                    placeholder="Message Pajzo AI or attach an image..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    disabled={disabled}
                    rows={1}
                />
                <button
                    type="submit"
                    className={styles.sendButton}
                    disabled={(!content.trim() && !selectedImage) || disabled}
                    aria-label="Send message"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </div>
        </form>
    );
}
