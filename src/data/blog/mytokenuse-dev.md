---
pubDatetime: 2026-06-21T20:45:33-07:00
title: "mytokenuse.dev: LLM Cost Clarity for AI Coding Tools"
slug: mytokenuse-dev
featured: false
ogImage: "../../assets/images/mytokenuse-dev-og.png"
tags:
  - personal-project
  - ai
  - typescript
draft: false
description: "A brief look at mytokenuse.dev, a CLI-powered dashboard for turning local ccusage data into private, short-lived LLM cost and token usage snapshots."
---

I recently built and launched [mytokenuse.dev](https://mytokenuse.dev), a small tool for developers who want a clearer picture of what their AI coding tools are actually costing them.

The basic idea is simple: run one command, publish a sanitized snapshot of your local `ccusage` data, and open a dashboard that shows LLM spend by model, session, and time period.

```sh
npx mytokenuse publish
```

## Product: Cost Clarity for AI Coding

AI coding tools are moving away from the comforting fiction of "unlimited" usage. Some plans meter requests, some meter credits, some bundle token pools, and different models can produce very different bills for the same work. That makes it hard to answer a simple question: what did this actually cost?

`mytokenuse.dev` is built for that moment. It takes recent local usage data from `ccusage`, turns it into a web dashboard, and makes the cost visible without asking users to set up their own database, charting layer, or reporting workflow.

The target audience is developers who use tools like Claude Code, Codex-style agents, and other LLM-assisted workflows often enough that token usage matters. It is also useful for solo builders, consultants, engineering managers, and teams comparing models or trying to understand where their AI budget is going.

The main use cases are:

- Checking total spend over the last 30 days.
- Comparing cost by provider or model.
- Finding expensive sessions, long-context runs, or agent loops.
- Sharing a short-lived dashboard with a teammate or client.

The value is not just "more charts." The value is turning token noise into a view that supports decisions: which model is worth using, which workflow is accidentally expensive, and whether a usage spike came from a real task or a runaway session.

## User Experience: One Command, Readable Dashboards

The product starts from the CLI because the source data is local. The happy path is intentionally one command: `npx mytokenuse publish`. If you are not signed in yet, the CLI folds GitHub login into that workflow, then collects the last 30 days of daily and session usage, sanitizes it, uploads it, and opens the dashboard.

The web experience is designed around terminal-native clarity. The landing page leads with the command, a demo, and the problem statement. The dashboard itself avoids a generic analytics look and instead feels like a focused developer console: summary totals, model cost rails, chart tabs, and ledger-style tables.

The dashboard has a few important views:

- Model cost over time.
- Cumulative model cost.
- Model cost and token totals.
- Session cost over time.
- Session-level cost and token totals.

There are also small quality-of-life details that matter in practice. Dashboard state is controlled through query params like `view` and `group`, so links can open directly to a specific view. A visibility toggle lets the owner switch a snapshot between private and shared. Shared dashboards are useful for collaboration, while private-by-default snapshots keep the normal workflow low-risk.

The demo route is another important UX choice. Someone can understand the product before authenticating or uploading anything. That keeps the first interaction lightweight: inspect the shape of the dashboard, then decide whether to publish real data.

## Engineering: A Small Control Plane for Usage Snapshots

The app is a React Router 7 application deployed on Vercel. The frontend uses React 19, CSS modules, Chart.js, and a component model built around reusable dashboard surfaces: charts, tabs, tables, summary rails, panels, account controls, and snapshot visibility controls.

The backend is intentionally compact. Better Auth handles GitHub OAuth and web sessions. Drizzle ORM maps the Postgres schema, including Better Auth tables plus product-specific tables for users, publish tokens, upload sessions, and snapshots. Vercel Blob stores the actual gzipped usage reports, while Postgres stores metadata such as ownership, visibility, row counts, compressed sizes, expiration, and deletion state.

The CLI is the other half of the system. It runs `ccusage daily --json` and `ccusage session --json`, keeps only the fields the dashboard needs, redacts obvious local filesystem paths, hashes session identifiers, wraps the result in a versioned envelope, gzip-compresses the reports, and uploads them.

The upload flow is split into two phases:

1. The CLI authenticates with an account-scoped publish token and calls `/api/uploads/init`.
2. The server creates an upload session and returns short-lived Vercel Blob upload capabilities for the daily and session reports.
3. The CLI uploads the gzipped reports directly to Blob staging paths.
4. The CLI calls `/api/uploads/:snapshotId/finalize`.
5. The server validates ownership, size limits, schema version, redaction markers, and visibility, then writes final private Blob objects and creates the snapshot metadata row.

That architecture keeps large payloads out of the app server during upload, but still gives the server control over authorization, validation, retention, and dashboard access.

Privacy and cleanup are built into the lifecycle. Snapshots are private by default, can be shared by URL, and expire after seven days unless the environment overrides the retention window. Deleting a snapshot removes both metadata and stored Blob data. A scheduled cleanup route removes expired snapshots and stale staged uploads. There are also first-pass guardrails for upload size, uncompressed report size, upload-session TTL, and per-user publish rate.

The result is a project that feels small on purpose: a CLI, a dashboard, and a control plane in between. It solves one narrow problem well: making AI coding usage visible enough to understand, explain, and act on.
