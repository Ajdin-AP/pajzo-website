import { Resend } from 'resend';
import { getContactEmailHtml, getAutoreplyEmailHtml } from './emailTemplate.mjs';

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
        const responseData = await Promise.all([
            // 1. Send internal notification to the site owner
            resend.emails.send({
                from: 'PAJZO Leads <leads@pajzo.com>',
                to: 'ajdin.pajazetovic.ap@gmail.com',
                reply_to: email, // Allows you to click 'reply' directly in your email client
                subject: `New Project Lead: ${data.company || name || 'Inquiry'}`,
                html: getContactEmailHtml(data)
            }),
            // 2. Send the autoreply to the customer
            resend.emails.send({
                from: 'PAJZO <info@pajzo.com>',
                to: email,
                subject: "We've received your project inquiry - PAJZO",
                html: getAutoreplyEmailHtml(data)
            })
        ]);

        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Resend SDK Error:", error);
        return res.status(500).json({ success: false, error: 'Failed to send email' });
    }
}
