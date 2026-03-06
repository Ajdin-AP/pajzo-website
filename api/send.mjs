import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get the data from your frontend form
    const { name, email, company, website, industry, businessDesc, services, budget, message } = req.body;

    try {
        const data = await resend.emails.send({
            // The testing address provided by Resend
            from: 'Acme <onboarding@resend.dev>',
            // Your actual email address from the screenshot
            to: 'ajdin.pajazetovic.ap@gmail.com',
            reply_to: email, // Allows you to click 'reply' directly in your email client
            subject: `New Contact Form Submission from ${name}`,
            html: `
        <h3>New Message from your Website</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Website:</strong> ${website || 'N/A'}</p>
        <p><strong>Industry:</strong> ${industry || 'N/A'}</p>
        <p><strong>Business Desc:</strong> ${businessDesc || 'N/A'}</p>
        <p><strong>Services:</strong><br/>${services || 'N/A'}</p>
        <p><strong>Budget:</strong> ${budget || 'N/A'}</p>
        <hr/>
        <p><strong>Message:</strong></p>
        <p>${message ? message.replace(/\n/g, '<br/>') : 'N/A'}</p>
      `
        });

        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Resend SDK Error:", error);
        return res.status(500).json({ success: false, error: 'Failed to send email' });
    }
}
