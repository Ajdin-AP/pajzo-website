// Simple health check endpoint to verify Vercel API routing works
export default function handler(req, res) {
    res.status(200).json({
        status: 'ok',
        message: 'Pajzo API is reachable',
        hasApiKey: !!process.env.ANTHROPIC_API_KEY,
        timestamp: new Date().toISOString()
    });
}
