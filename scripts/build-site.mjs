import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const questionnaireHtml = readFileSync('questionnaire.html', 'utf8');
const proposalHtml = readFileSync('proposal.html', 'utf8');
const adminHtml = readFileSync('admin.html', 'utf8');
const customerScreenChecklistHtml = readFileSync('customer-screen-checklist.html', 'utf8');
const demoApiCustomers = [
  { id: 'c1', firstName: 'עמי', lastName: 'כהן', phone: '050-1111111', address: 'הכלנית 12', city: 'ראשון לציון', deliveryNotes: 'להתקשר לפני הגעה', mustChangePassword: false, deletedAt: null, createdAt: '2026-07-22T00:00:00.000Z', updatedAt: '2026-07-22T00:00:00.000Z' },
  { id: 'c2', firstName: 'דנה', lastName: 'לוי', phone: '052-2222222', address: 'הגפן 8', city: 'רחובות', deliveryNotes: 'להשאיר ליד הדלת', mustChangePassword: false, deletedAt: null, createdAt: '2026-07-22T00:00:00.000Z', updatedAt: '2026-07-22T00:00:00.000Z' },
  { id: 'c3', firstName: 'יוסי', lastName: 'מזרחי', phone: '054-3333333', address: 'העצמאות 40', city: 'אשדוד', deliveryNotes: 'כלב גדול בחצר', mustChangePassword: false, deletedAt: null, createdAt: '2026-07-22T00:00:00.000Z', updatedAt: '2026-07-22T00:00:00.000Z' }
];

const worker = `const questionnaireHtml = ${JSON.stringify(questionnaireHtml)};
const proposalHtml = ${JSON.stringify(proposalHtml)};
const adminHtml = ${JSON.stringify(adminHtml)};
const customerScreenChecklistHtml = ${JSON.stringify(customerScreenChecklistHtml)};
const demoApiCustomers = ${JSON.stringify(demoApiCustomers)};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/api/customers") {
      return new Response(JSON.stringify({ customers: demoApiCustomers }), {
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store"
        }
      });
    }
    if (request.method === "GET" && url.pathname === "/api/customers/deleted") {
      return new Response(JSON.stringify({ customers: [] }), {
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store"
        }
      });
    }
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
