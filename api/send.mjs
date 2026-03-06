import { Resend } from 'resend';
import { getContactEmailHtml } from './emailTemplate.mjs';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get the data from your frontend form
    const data = req.body;
    const { name, email } = data;

    try {
        const responseData = await resend.emails.send({
            // The testing address provided by Resend
            from: 'Acme <onboarding@resend.dev>',
            // Your actual email address from the screenshot
            to: 'ajdin.pajazetovic.ap@gmail.com',
            reply_to: email, // Allows you to click 'reply' directly in your email client
            subject: `New Contact Form Submission from ${name || 'Lead'}`,
            html: getContactEmailHtml(data)
        });

        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Resend SDK Error:", error);
        return res.status(500).json({ success: false, error: 'Failed to send email' });
    }
}
