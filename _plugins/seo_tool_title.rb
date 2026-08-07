# frozen_string_literal: true

# Sets page.title from page.name + primary category label so jekyll-seo-tag
# outputs query-aligned meta titles (e.g. "Cursor — Coding & Development AI Tool | ai.vocino.com").
module Vocino
  class SeoToolTitleGenerator < Jekyll::Generator
    safe true
    priority :lowest

    def generate(site)
      tools = site.collections['tools']
      return unless tools

      cat_map = {}
      if site.data['categories']
        site.data['categories'].each { |c| cat_map[c['slug']] = c['label'] if c['slug'] && c['label'] }
      end

      tools.docs.each do |doc|
        next unless doc.data['name']

        if !doc.data['title'] || doc.data['title'].end_with?(' — AI Tool')
          title = build_title(doc.data, cat_map)
          doc.data['title'] = title
        end
        img = build_image(doc.data)
        doc.data['image'] = img if img
      end
    end

    private

    def build_title(data, cat_map)
      name = data['name']
      cats = data['categories']
      if cats && cats.is_a?(Array) && !cats.empty?
        label = cat_map[cats.first] || cats.first.to_s.gsub('-', ' ').split.map(&:capitalize).join(' ')
        # keep label concise for title length; map long labels
        short = label.sub(' & Development', '').sub(' & Automation', '').sub(' & Platforms', '').sub(' & Spatial', '')
        return "#{name} — #{short} AI Tool"
      end
      "#{name} — AI Tool"
    end

    def build_image(data)
      slug = data['slug']
      return nil unless slug

      "/assets/images/og/tools/#{slug}.png"
    end
  end
end

def vocino_build_title(data, cat_map)
  name = data['name']
  cats = data['categories']
  if cats && cats.is_a?(Array) && !cats.empty?
    label = cat_map[cats.first] || cats.first.to_s.gsub('-', ' ').split.map(&:capitalize).join(' ')
    short = label.sub(' & Development', '').sub(' & Automation', '').sub(' & Platforms', '').sub(' & Spatial', '')
    return "#{name} — #{short} AI Tool"
  end
  "#{name} — AI Tool"
end

def vocino_build_image(data)
  slug = data['slug']
  return nil unless slug

  "/assets/images/og/tools/#{slug}.png"
end

Jekyll::Hooks.register :documents, :pre_render do |doc, _payload|
  next unless doc.collection && doc.collection.label == 'tools'
  next unless doc.data['name']

  site = doc.site
  cat_map = {}
  if site.data['categories']
    site.data['categories'].each { |c| cat_map[c['slug']] = c['label'] if c['slug'] && c['label'] }
  end
  if !doc.data['title'] || doc.data['title'].end_with?(' — AI Tool')
    doc.data['title'] = vocino_build_title(doc.data, cat_map)
  end
  img = vocino_build_image(doc.data)
  doc.data['image'] = img if img
end
