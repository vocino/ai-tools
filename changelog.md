---
layout: default
title: "Changelog — New AI Tools Added | AI Tools Open Directory"
description: "Changelog of new AI tools added to ai.vocino.com — open directory maintained by Vocino. See what's new each week."
permalink: /changelog/
---
<div class="category-page">
  <div class="category-page__eyebrow"><span style="color:var(--brand)">//</span> Changelog — open directory</div>
  <h1 class="category-page__title">Changelog — what's new</h1>
  <p class="category-page__description">Every tool added to <strong>ai.vocino.com</strong> with its added date. Newest first — freshness signal for builders and crawlers. Curated by <a href="https://vocino.com" style="color:var(--brand)">Vocino</a>.</p>

  {% assign sorted = site.tools | sort: "slug" %}
  {% comment %} Build grouped list by added_date desc via data file {% endcomment %}
  {% assign dates = site.data.tool_added_dates %}
  {% assign tool_list = "" | split: "" %}
  {% for tool in site.tools %}
    {% assign d = dates[tool.slug] %}
    {% capture item %}{{ d }}|{{ tool.slug }}|{{ tool.name }}|{{ tool.url }}{% endcapture %}
    {% assign tool_list = tool_list | push: item %}
  {% endfor %}
  {% assign sorted_list = tool_list | sort | reverse %}

  <div class="hud-corners hud-corners--always" style="margin:1.5rem 0;padding:1rem 1.1rem;background:var(--surface-1);border:1px solid var(--border);border-radius:12px">
    <p style="margin:0;color:var(--text-secondary);line-height:1.6"><strong style="color:var(--text-primary)">{{ site.tools | size }} tools</strong> — updated {{ site.time | date: "%Y-%m-%d" }}. <a href="{{ '/feed.xml' | relative_url }}" style="color:var(--brand)">RSS feed →</a> · <a href="{{ '/tools.json' | relative_url }}" style="color:var(--brand)">JSON →</a></p>
  </div>

  <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.6rem">
    {% for entry in sorted_list limit:50 %}
      {% assign parts = entry | split: "|" %}
      {% assign d = parts[0] %}
      {% assign slug = parts[1] %}
      {% assign name = parts[2] %}
      {% assign url = parts[3] %}
      <li style="display:flex;align-items:center;gap:0.75rem;padding:0.6rem 0.9rem;background:var(--surface-1);border:1px solid var(--border);border-radius:10px">
        <span style="font-family:var(--font-mono);font-size:0.72rem;color:var(--text-muted);min-width:5.5rem">{{ d }}</span>
        <a href="{{ url | relative_url }}" style="color:var(--text-primary);font-weight:600;text-decoration:none">{{ name }}</a>
        <span style="margin-left:auto;font-family:var(--font-mono);font-size:0.68rem;color:var(--text-muted)">{{ slug }}</span>
      </li>
    {% endfor %}
  </ul>
  <p style="margin-top:1rem;color:var(--text-muted);font-size:0.85rem">Full history in <a href="https://github.com/vocino/ai-tools/commits/main" style="color:var(--brand)">git commits →</a>. Suggest a tool: <a href="https://github.com/vocino/ai-tools?tab=contributing-ov-file" style="color:var(--brand)">contribute →</a></p>
</div>
