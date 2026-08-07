# frozen_string_literal: true

# Sets page.title from page.name for tools collection so jekyll-seo-tag
# outputs unique, query-aligned meta titles (e.g. "LlamaIndex — AI Tool | ai.vocino.com").
module Vocino
  class SeoToolTitleGenerator < Jekyll::Generator
    safe true
    priority :lowest

    def generate(site)
      tools = site.collections['tools']
      return unless tools

      tools.docs.each do |doc|
        next unless doc.data['name']

        doc.data['title'] = "#{doc.data['name']} — AI Tool"
      end
    end
  end
end

Jekyll::Hooks.register :documents, :pre_render do |doc, _payload|
  next unless doc.collection && doc.collection.label == 'tools'
  next unless doc.data['name']

  doc.data['title'] = "#{doc.data['name']} — AI Tool"
end
