// Simple health check endpoint to verify Vercel API routing works
export default function handler(req, res) {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
}
