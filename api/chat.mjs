// Pajzo AI API - Vercel Serverless Function (v3)
import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `You are Pajzo AI, a cool, relaxed, and friendly AI assistant owned by the Pajzo Marketing Agency.
You speak in a laid-back, conversational, and highly helpful tone. Feel free to use emojis and be chill.
Your goal is to be the ultimate friendly companion for the user, while still being incredibly smart and capable.
Your name is "Pajzo AI". Do not refer to yourself as Claude or an Anthropic model.`;

export default async function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
        return res.status(500).json({ error: 'ANTHROPIC_API_KEY environment variable is not configured on the server.' });
    }

    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Invalid request: messages array is required.' });
    }

    try {
        const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

        // Use SSE streaming
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
                const data = JSON.stringify({ message: { content: chunk.delta.text } });
                res.write(`data: ${data}\n\n`);
            }
        }

        res.write('data: [DONE]\n\n');
        res.end();

    } catch (error) {
        console.error('Anthropic API Error:', JSON.stringify(error, null, 2));
        const statusCode = error.status || 500;
        const message = error.message || 'Failed to process chat request';
        return res.status(statusCode).json({ error: message });
    }
}
