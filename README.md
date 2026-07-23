# Drive Dog

Project ID: `proj-20260722-c0bjt68np0t`

Slack channel: `C0BJT68NP0T`

This project is intentionally separate from Solar Tzadi / TG Energy. Do not mix code, data, integrations, deployment settings, or product decisions between the projects unless Noam explicitly asks for that connection.

## Local MVP

- Questionnaire: `dist/index.html`
- Proposal: `dist/proposal.html`
- Owner admin MVP: `dist/admin.html`

Build:

```bash
npm run build
```

Local preview:

```bash
cd dist
python3 -m http.server 4174 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4174/admin.html`.
