import fs from 'fs';
import path from 'path';

export function getContactEmailHtml(data) {
    const { name, email, company, website, industry, businessDesc, services, budget, message } = data;

    // Replace nullish/empty values with 'Not provided'
    const safeData = {
        name: name || 'Not provided',
        email: email || 'Not provided',
        company: company || 'Not provided',
        website: website || 'Not provided',
        industry: industry || 'Not provided',
        businessDesc: businessDesc || 'Not provided',
        services: services || 'Not provided',
        budget: budget || 'Not provided',
        message: message || 'Not provided'
    };

    try {
        let template = fs.readFileSync(path.join(process.cwd(), 'email', 'notification.html'), 'utf8');
        template = template.replace(/{{NAME}}/g, safeData.name);
        template = template.replace(/{{EMAIL}}/g, safeData.email);
        template = template.replace(/{{COMPANY}}/g, safeData.company);
        template = template.replace(/{{WEBSITE}}/g, safeData.website);
        template = template.replace(/{{INDUSTRY}}/g, safeData.industry);
        template = template.replace(/{{DESC}}/g, safeData.businessDesc);
        template = template.replace(/{{SERVICES}}/g, safeData.services);
        template = template.replace(/{{BUDGET}}/g, safeData.budget);
        template = template.replace(/{{MESSAGE}}/g, safeData.message);
        return template;
    } catch (e) {
        console.error("Error loading notification template:", e);
        return `<p>New lead received from ${safeData.name}.<br><br>Company: ${safeData.company}<br>Email: ${safeData.email}<br>Budget: ${safeData.budget}</p>`;
    }
}

export function getAutoreplyEmailHtml(data) {
    const { name, company, website, industry, businessDesc, services, budget, message } = data;

    const safeData = {
        name: name || 'Not provided',
        company: company || 'Not provided',
        website: website || 'Not provided',
        industry: industry || 'Not provided',
        businessDesc: businessDesc || 'Not provided',
        services: services || 'Not provided',
        budget: budget || 'Not provided',
        message: message || 'Not provided'
    };

    try {
        let template = fs.readFileSync(path.join(process.cwd(), 'email', 'autoreply.html'), 'utf8');
        template = template.replace(/{{NAME}}/g, safeData.name);
        template = template.replace(/{{COMPANY}}/g, safeData.company);
        template = template.replace(/{{WEBSITE}}/g, safeData.website);
        template = template.replace(/{{INDUSTRY}}/g, safeData.industry);
        template = template.replace(/{{DESC}}/g, safeData.businessDesc);
        template = template.replace(/{{SERVICES}}/g, safeData.services);
        template = template.replace(/{{BUDGET}}/g, safeData.budget);
        template = template.replace(/{{MESSAGE}}/g, safeData.message);
        return template;
    } catch (e) {
        console.error("Error loading autoreply template:", e);
        return `<p>Hi ${safeData.name},<br><br>Thank you for reaching out to PAJZO. We have officially received your project details and our team is currently reviewing them.<br><br>The PAJZO Team</p>`;
    }
}
