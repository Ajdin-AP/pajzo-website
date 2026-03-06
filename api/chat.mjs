import Anthropic from '@anthropic-ai/sdk';

// Initialize the Anthropic client securely on the backend
// Vercel serverless functions automatically load process.env from the project environment variables
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '', // Defaults to ANTHROPIC_API_KEY from environment
});

// The standard system persona for the Pajzo Marketing AI
const SYSTEM_PROMPT = `You are Pajzo AI, a cool, relaxed, and friendly AI assistant owned by the Pajzo Marketing Agency.
You speak in a laid-back, conversational, and highly helpful tone. Feel free to use emojis and be chill.
Your goal is to be the ultimate friendly companion for the user, while still being incredibly smart and capable.
Your name is "Pajzo AI". Do not refer to yourself as Claude or an Anthropic model.`;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { messages, stream } = req.body;

    if (!process.env.ANTHROPIC_API_KEY) {
        console.error('Environment variable ANTHROPIC_API_KEY is not set');
        return res.status(500).json({ error: 'ANTHROPIC_API_KEY is missing from the server environment.' });
    }

    try {
        if (!stream) {
            // Standard non-streaming response logic
            const response = await anthropic.messages.create({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 4096,
                system: SYSTEM_PROMPT,
                messages: messages,
            });
            return res.status(200).json({ message: { content: response.content[0].text } });
        }

        // Streaming Response Logic (SSE)
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const streamResponse = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 4096,
            system: SYSTEM_PROMPT,
            messages: messages,
            stream: true,
        });

        for await (const chunk of streamResponse) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
                // We format the streaming chunks to mimic the structure the React hook originally expected
                const data = JSON.stringify({ message: { content: chunk.delta.text } });
                res.write(`data: ${data}\n\n`);
            }
        }
        res.write('data: [DONE]\n\n');
        res.end();

    } catch (error) {
        console.error('Anthropic API Error:', error);
        res.status(500).json({ error: 'Failed to process chat request' });
    }
}
