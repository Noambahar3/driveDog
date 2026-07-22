# Drive Dog Agent Harness

Purpose: give Noam and agents a clean operating system for planning, building,
testing, and handing off the Drive Dog project.

This harness is not the product itself. It is the project work system: how to
understand the MVP, keep boundaries clear, record decisions, run preflight
checks, and hand work between planning and implementation.

## Project Identity

- Project name: Drive Dog
- Project ID: `proj-20260722-c0bjt68np0t`
- Project path: `/home/noam/.openclaw/workspace/drive-dog`
- Slack channel: `C0BJT68NP0T`
- Product: CRM and ordering system for a dog/cat food delivery business serving
  recurring private customers.

## Source Material

Use Drive Dog files as the project source of truth:

- `/home/noam/.openclaw/workspace/drive-dog/project.json`
- `/home/noam/.openclaw/workspace/drive-dog/README.md`
- `/home/noam/.openclaw/workspace/drive-dog/MVP.md`
- `/home/noam/.openclaw/workspace/drive-dog/GROW_INTEGRATION_CHECK.md`

Reference material under `reference/` is structural inspiration only. Do not
copy product decisions, customer data, business flows, assumptions, or names
from any other project into Drive Dog.

## Document Set

- `README.md` - harness purpose, boundaries, and document map.
- `PREFLIGHT.md` - required checks before planning, implementation, external
  actions, and deployments.
- `PRD.md` - product requirements for the Drive Dog MVP.
- `SPEC.md` - functional specification, data model, integrations, states, and
  non-functional requirements.
- `RUNBOOK.md` - practical procedures for planning, building, testing, and
  release work.
- `WORKLOG.md` - running log of decisions, changes, risks, and follow-ups.
- `CHECKS.md` - verification checklists for MVP behavior and integration work.
- `HANDOFF.md` - packet format for transferring tasks to implementation.
- `CLIENT_DISCOVERY_CHECKLIST.md` - focused questions still needed from Noam,
  the business owner, Grow, or implementation stakeholders.
- `FIRST_IMPLEMENTATION_SLICE.md` - owner-side first MVP slice definition,
  scaffold readiness, stubs, acceptance criteria, and branch recommendation.

## Default Work Loop

1. Read this harness README and the task-specific document.
2. Run the relevant preflight from `PREFLIGHT.md`.
3. Confirm whether the task is planning, product spec, local docs,
   implementation, integration, deployment, or client-facing work.
4. Use Drive Dog source files only.
5. Make the smallest useful change.
6. Update `WORKLOG.md` for decisions, meaningful changes, risks, or open
   questions.
7. If handing off work, create a packet using `HANDOFF.md`.

## Boundaries

- Keep Drive Dog isolated from all other projects unless Noam explicitly asks
  for a connection.
- Do not use another project's product decisions as truth for Drive Dog.
- Do not expose private contact details in public artifacts unless Noam
  explicitly approves the exact content.
- Do not send emails, messages, production requests, provider requests, or public
  deployments without an explicit user request.
- Do not store payment card data in Drive Dog.
- Treat Grow / Meshulam as an external provider; API claims must be based on
  official documentation or verified credentials.

## Current Priority

1. Keep the MVP proposal accurate and presentable.
2. Close the Grow / Meshulam open question about invoices for cash-on-delivery.
3. Turn the MVP into screen-level flows.
4. Define the first implementation slice.
5. Prepare a clean handoff packet when development starts.
