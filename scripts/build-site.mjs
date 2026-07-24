import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const questionnaireHtml = readFileSync('questionnaire.html', 'utf8');
const proposalHtml = readFileSync('proposal.html', 'utf8');
const adminHtml = readFileSync('admin.html', 'utf8');
const customerScreenChecklistHtml = readFileSync('customer-screen-checklist.html', 'utf8');

const worker = `const questionnaireHtml = ${JSON.stringify(questionnaireHtml)};
const proposalHtml = ${JSON.stringify(proposalHtml)};
const adminHtml = ${JSON.stringify(adminHtml)};
const customerScreenChecklistHtml = ${JSON.stringify(customerScreenChecklistHtml)};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const html = url.pathname === "/" || url.pathname.startsWith("/admin")
      ? adminHtml
      : url.pathname.startsWith("/proposal")
        ? proposalHtml
        : url.pathname.startsWith("/questionnaire")
          ? questionnaireHtml
          : url.pathname.startsWith("/customer-screen-checklist")
            ? customerScreenChecklistHtml
            : adminHtml;

    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store"
      }
    });
  }
};
`;

mkdirSync('dist/server', { recursive: true });
mkdirSync('dist/.openai', { recursive: true });
writeFileSync('dist/server/index.js', worker);
writeFileSync('dist/index.html', questionnaireHtml);
writeFileSync('dist/proposal.html', proposalHtml);
writeFileSync('dist/admin.html', adminHtml);
writeFileSync('dist/customer-screen-checklist.html', customerScreenChecklistHtml);
copyFileSync('.openai/hosting.json', 'dist/.openai/hosting.json');
