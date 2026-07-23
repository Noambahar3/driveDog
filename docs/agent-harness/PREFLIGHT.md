# Drive Dog Preflight

Run this before non-trivial Drive Dog work.

## Minimal Local-Only Preflight

Use for documentation edits, local planning, and small code changes that do not
touch external services.

- Confirm current working directory is inside
  `/home/noam/.openclaw/workspace/drive-dog`.
- Check `git status --short` and do not overwrite unrelated user changes.
- Read the task-relevant source files.
- Confirm the work does not require external action.
- Update `WORKLOG.md` if the task changes decisions, risks, scope, or handoff
  state.

## Product / Spec Preflight

- Read `README.md`, `PRD.md`, and `SPEC.md`.
- Check `CLIENT_DISCOVERY_CHECKLIST.md` for open questions.
- Separate known facts from assumptions.
- Mark missing information as `TBD` instead of guessing.
- Confirm whether new scope belongs in MVP or later.

## Integration Preflight

Use before work involving Grow / Meshulam, password setup messaging, email, or
deployment.

- Read `GROW_INTEGRATION_CHECK.md` when relevant.
- Use official provider documentation or verified credentials only.
- Do not call live payment APIs without explicit approval.
- Do not test live bit / Apple Pay / Google Pay flows unless explicitly
  approved and expected to charge.
- Keep API keys and tokens out of public docs and chat replies.
- Ensure webhook processing is designed to be idempotent.

## Client-Facing Artifact Preflight

Use before changing proposal pages, questionnaires, PDFs, or anything Noam may
send to the client.

- Confirm the recipient and purpose.
- Remove internal-only notes, uncertainty, and implementation chatter unless
  Noam asked to show them.
- Avoid exposing private phone numbers or credentials.
- Keep language positive and commercial when this is a proposal.
- Verify public links return `200`.
- If a signature form is static, clearly state what it can and cannot do.

## Deployment Preflight

- Confirm `.openai/hosting.json` exists and reuse its `project_id`.
- Build locally.
- Commit the exact source state.
- Push the committed source state to the Sites source repository.
- Save a site version from the pushed commit.
- Deploy only a saved version.
- Verify the deployed URL and relevant routes.

## Stop Conditions

Stop and ask Noam before proceeding if:

- A task requires live payment credentials, live charges, or provider account
  changes.
- A client-facing artifact would include sensitive data.
- There are conflicting product decisions.
- A destructive command would be needed.
- The same approach fails three times.
