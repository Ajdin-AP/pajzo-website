import { Resend } from 'resend';
import { getContactEmailHtml, getAutoreplyEmailHtml } from './emailTemplate.mjs';

// Mirror of the form's own field limits — anything beyond them did not come
// from the form, so it gets a 400 instead of an email.
const LIMITS = {
    name: 80,
    email: 120,
    company: 120,
    website: 160,
    service: 60,
    budget: 60,
    message: 1500
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Validate + normalise the payload. Returns null if it isn't a plausible
// form submission.
function clean(body) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
    const out = {};
    for (const [field, max] of Object.entries(LIMITS)) {
        const v = body[field];
        if (v !== undefined && v !== null && typeof v !== 'string') return null;
        const s = (v ?? '').trim();
        if (s.length > max) return null;
        out[field] = s;
    }
    if (out.name.length < 2) return null;
    if (!EMAIL_RE.test(out.email)) return null;
    return out;
}

// Subjects must never carry line breaks or grow unbounded.
const subjectSafe = (s) => s.replace(/[\r\n\t]+/g, ' ').slice(0, 120);

let resend = null;

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY is not configured');
        return res.status(500).json({ success: false, error: 'Email service not configured' });
    }
    if (!resend) resend = new Resend(process.env.RESEND_API_KEY);

    const data = clean(req.body);
    if (!data) {
        return res.status(400).json({ success: false, error: 'Invalid submission' });
    }

    // 1. The lead notification is the critical send — if it fails, the whole
    //    submission failed and the client shows the fallback email address.
    //    NOTE: resend v6 does NOT throw on API errors; it returns { error }.
    try {
        const notif = await resend.emails.send({
            from: 'Pajzo Leads <leads@pajzo.com>',
            to: 'ajdin.pajazetovic.ap@gmail.com',
            replyTo: data.email, // Allows you to click 'reply' directly in your email client
            subject: subjectSafe(`New enquiry — ${data.company || data.name || 'Pajzo'}`),
            html: getContactEmailHtml(data)
        });
        if (notif && notif.error) {
            console.error('Resend error (notification):', notif.error);
            return res.status(502).json({ success: false, error: 'Failed to send email' });
        }
    } catch (error) {
        console.error('Resend exception (notification):', error);
        return res.status(500).json({ success: false, error: 'Failed to send email' });
    }

    // 2. The autoreply is best-effort — a failure here must never lose the lead.
    try {
        const auto = await resend.emails.send({
            from: 'Ajdin at Pajzo <info@pajzo.com>',
            to: data.email,
            subject: 'Thanks for your message — Pajzo',
            html: getAutoreplyEmailHtml(data)
        });
        if (auto && auto.error) {
            console.error('Resend error (autoreply, non-fatal):', auto.error);
        }
    } catch (error) {
        console.error('Resend exception (autoreply, non-fatal):', error);
    }

    return res.status(200).json({ success: true });
}
