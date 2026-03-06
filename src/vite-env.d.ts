/// <reference types="vite/client" />

declare module '*.svg' {
    const content: string;
    export default content;
}

declare module '*.css' {
    const content: { [className: string]: string };
    export default content;
}

interface ImportMetaEnv {
    readonly VITE_EMAILJS_SERVICE_ID: string;
    readonly VITE_EMAILJS_TEMPLATE_ID: string;
    readonly VITE_EMAILJS_AUTO_REPLY_TEMPLATE_ID: string;
    readonly VITE_EMAILJS_PUBLIC_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
