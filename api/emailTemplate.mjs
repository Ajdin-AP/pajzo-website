import fs from 'fs';
import path from 'path';

// Escape user-supplied values for safe use in HTML text and attributes.
function esc(value) {
  if (value === undefined || value === null || value === '') return 'Not provided';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Field -> template token.
const TOKENS = {
  name: 'NAME',
  email: 'EMAIL',
  company: 'COMPANY',
  website: 'WEBSITE',
  service: 'SERVICE',
  budget: 'BUDGET',
  message: 'MESSAGE',
};

function render(file, data) {
  let html = fs.readFileSync(path.join(process.cwd(), 'email', file), 'utf8');
  for (const [field, token] of Object.entries(TOKENS)) {
    html = html.split(`{{${token}}}`).join(esc(data ? data[field] : ''));
  }
  return html;
}

export function getContactEmailHtml(data) {
  try {
    return render('notification.html', data);
  } catch (e) {
    console.error('notification template error:', e);
    return `<p>New enquiry from ${esc(data && data.name)} (${esc(data && data.email)}).</p>`;
  }
}

export function getAutoreplyEmailHtml(data) {
  try {
    return render('autoreply.html', data);
  } catch (e) {
    console.error('autoreply template error:', e);
    return `<p>Hi ${esc(data && data.name)}, thanks for reaching out to Pajzo. I'll reply personally within one business day. — Ajdin</p>`;
  }
}
