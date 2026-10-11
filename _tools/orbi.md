---
name: Orbi
slug: orbi
website: https://orbi.build
description: Open-source coding agent that turns a labeled GitHub issue into a pull request, has a second AI session review it, then merges it.
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
  - Label a GitHub issue ai-ready and Orbi writes the change and opens a pull request
  - A second AI session reviews the PR against the issue's acceptance criteria
  - Merges once that review passes; branch protection can require a human approval first
  - Tags a version and publishes a GitHub Release only when you open a release issue (label ai-release)
  - For ops issues (deploys, debugging), it runs the commands and posts them with their output as an issue comment
  - Works with any OpenAI-compatible model endpoint, including a local llama.cpp server
launch_date: "2026-08"
---
Orbi is licensed AGPL-3.0 and the source is at [github.com/orbi-build/orbi](https://github.com/orbi-build/orbi). It is free to self-host with your own model key. There is also a hosted version, Orbi Cloud, where your first 3 merged deliveries (merged PRs) are free and paid plans start at US$24/month billed yearly.
