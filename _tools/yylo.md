---
name: YYLO
slug: yylo
website: https://yylo.dev
description: command-line orchestrator for AI coding agents with Kanban task tracking, guided task lifecycles, and typed merge and release flows.
categories:
  - coding
  - agents
use_cases:
  - development
  - automation
modalities:
  - text
  - code
pricing: open-source
api: false
self_hosted: true
features:
  - Kanban-style task and dependency management for coding-agent work
  - Guided task start and finish lifecycles with typed validation and merge orchestration
  - Live terminal agent sessions with streamed tool calls and execution summaries
  - Receipt-backed, reviewable repository changes across Git worktrees
---
YYLO is an open-source command-line orchestrator for AI coding agents, repeatable workflows, and receipt-backed repository changes. A quick agent loop (`yy pi --live`) streams tool calls and execution summaries in the terminal, while typed task, validation, merge, and release-readiness boundaries keep project operators in control across Git worktrees. YYLO is MIT-licensed, installable from npm as [@yylo/cli](https://www.npmjs.com/package/@yylo/cli), with source at [yylo-dev/yylo](https://github.com/yylo-dev/yylo).
