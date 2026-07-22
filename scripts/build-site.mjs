import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const questionnaireHtml = readFileSync('questionnaire.html', 'utf8');
const proposalHtml = readFileSync('proposal.html', 'utf8');

const worker = `const questionnaireHtml = ${JSON.stringify(questionnaireHtml)};
const proposalHtml = ${JSON.stringify(proposalHtml)};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const html = url.pathname.startsWith("/proposal") ? proposalHtml : questionnaireHtml;

    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=300"
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
copyFileSync('.openai/hosting.json', 'dist/.openai/hosting.json');
