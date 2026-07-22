# Drive Dog Runbook

## Daily Work Start

1. `cd /home/noam/.openclaw/workspace/drive-dog`
2. Read `docs/agent-harness/README.md`.
3. Read the task-relevant file:
   - Product: `PRD.md`
   - Functional behavior: `SPEC.md`
   - Integration: `GROW_INTEGRATION_CHECK.md`
   - Verification: `CHECKS.md`
   - Handoff: `HANDOFF.md`
4. Run the relevant preflight from `PREFLIGHT.md`.
5. Check `git status --short`.

## Planning Task Procedure

1. Identify whether the requested change affects MVP scope, later scope, or a
   client-facing artifact.
2. Update `PRD.md` for product intent.
3. Update `SPEC.md` for functional behavior.
4. Update `CLIENT_DISCOVERY_CHECKLIST.md` if a new question appears.
5. Log the decision in `WORKLOG.md`.

## Proposal Page Procedure

1. Edit `proposal.html`.
2. Run `npm run build`.
3. Verify `dist/server/index.js` with `node --check`.
4. Confirm content with `rg` and, when deployed, `curl`.
5. Commit source and generated dist files.
6. Push to the Sites source repository.
7. Save a Sites version from the pushed commit.
8. Deploy the saved version.
9. Verify `/proposal` returns `200`.

## Questionnaire Procedure

1. Edit `questionnaire.html`.
2. Run `npm run build`.
3. Confirm root route serves questionnaire content.
4. Deploy using the same Sites flow as the proposal page.

## Grow / Meshulam Procedure

1. Read `GROW_INTEGRATION_CHECK.md`.
2. Confirm whether task is research, sandbox, or live.
3. Do not call live endpoints without Noam's approval.
4. Store credentials outside public docs.
5. Implement webhook handlers idempotently.
6. Log provider findings in `WORKLOG.md` and update `SPEC.md`.

## Handoff Procedure

1. Use `HANDOFF.md` format.
2. Include source files, exact requirements, assumptions, open questions, and
   acceptance checks.
3. Keep handoff isolated to Drive Dog.
4. Do not include unrelated project data.

## Worklog Procedure

Update `WORKLOG.md` when:

- A product decision is made.
- A risk is discovered or closed.
- A public artifact is changed.
- A provider/API finding is verified.
- A handoff packet is prepared.
- An implementation slice starts or completes.

## Public Link Verification

Use:

```bash
curl -s -I https://drive-dog-questionnaire.candy-pine-7976.chatgpt.site/proposal
curl -s https://drive-dog-questionnaire.candy-pine-7976.chatgpt.site/proposal | rg "Drive Dog|דרייב דוג|Orma AI"
```

Expected:

- HTTP `200`
- Hebrew proposal content present
- No sensitive credentials in HTML

