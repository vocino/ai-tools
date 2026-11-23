---
name: Cloudbrowser
slug: cloudbrowser
website: https://cloudbrowser.tv/
description: Cloudbrowser hosts persistent, isolated Chrome profiles for AI agents that connect over authenticated CDP.
categories:
  - agents
  - api-platform
use_cases:
  - automation
  - development
modalities:
  - code
pricing: freemium
api: true
self_hosted: false
features:
  - Isolated Chrome profiles that persist across pause and resume
  - Authenticated browser-level CDP and permission-controlled desktop Live View
  - Fork a paused profile into an independent browser
  - Manage browsers and access links through a Go CLI or REST API
---
Cloudbrowser gives agents a dedicated Chrome browser for web automation, with a reusable profile for workflows that span runs. Developers attach a CDP client to the running browser, and operators can observe the same desktop in Live View. Pausing preserves profile data such as cookies and local storage, subject to each site's session expiry, and the free plan provides one running browser and one browser-hour per month.
