import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const html = readFileSync('questionnaire.html', 'utf8');

const worker = `const html = ${JSON.stringify(html)};

export default {
  async fetch() {
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
writeFileSync('dist/index.html', html);
copyFileSync('.openai/hosting.json', 'dist/.openai/hosting.json');
