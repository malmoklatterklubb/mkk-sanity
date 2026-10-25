# Content Model

This repository contains the Sanity Studio schema. The Astro frontend lives in the separate `mkk-astro` repository and currently has no Sanity queries or routes to update.

## Document Types

| Type           | Purpose                                                     |
| -------------- | ----------------------------------------------------------- |
| `homePage`     | Singleton content for the homepage                          |
| `siteSettings` | Singleton shared title, contact information, and navigation |
| `page`         | General editorial pages                                     |
| `post`         | News articles                                               |
| `person`       | Reusable people records                                     |
| `section`      | Club sections, such as courses or IT                        |
| `role`         | Reusable roles, optionally belonging to a section           |

Events are managed in Fienta and are not modelled in this Studio.

## Portable Text

Editorial Portable Text is localised as a whole. Resolve the requested language first and fall back to Swedish only when the requested field is empty:

```groq
coalesce(content[language == $language][0].value, content[language == "sv"][0].value)
```

Portable Text supports paragraphs, headings, lists, quotes, internal and external links, images with localised alternative text and captions, and committee reference blocks. Queries that render Portable Text must project the referenced section when handling a `sectionReference` block.

## Localized Fields

Visitor-facing strings, text, Portable Text, SEO copy, image alternative text, captions, and route slugs use `sanity-plugin-internationalized-array`. Swedish is the default language and English is optional. Site navigation derives its labels from referenced pages and supports one level of nested page links.

Navigation items reference pages directly; they do not store labels or external URLs:

```groq
navigation[]{
  "page": page->{
    _id,
    "title": coalesce(title[language == $language][0].value, title[language == "sv"][0].value),
    "slug": coalesce(slug[$language].current, slug.sv.current)
  },
  children[]{
    "page": page->{
      _id,
      "title": coalesce(title[language == $language][0].value, title[language == "sv"][0].value),
      "slug": coalesce(slug[$language].current, slug.sv.current)
    }
  }
}
```

Footer links are grouped by a localized title. Each group contains page links only and cannot contain nested child pages:

```groq
footerLinkGroups[]{
  "title": coalesce(title[language == $language][0].value, title[language == "sv"][0].value),
  links[]{
    "page": page->{
      "title": coalesce(title[language == $language][0].value, title[language == "sv"][0].value),
      "slug": coalesce(slug[$language].current, slug.sv.current)
    }
  }
}
```

```groq
 coalesce(title[language == $language][0].value, title[language == "sv"][0].value)
```

Images, references, person names, contact details, dates, roles, `recruiting`, sort order, and other structural fields are shared.

## Routing

Slugs use `{sv: {current}, en: {current}}`. Swedish and English routes must use separate queries:

```groq
// Swedish route: /{slug}
*[_type == "page" && slug.sv.current == $slug][0]

// English route: /en/{slug}
*[_type == "page" && slug.en.current == $slug][0]
```

Never fall back from an English slug lookup to Swedish. An English route exists only when `slug.en.current` is defined. Individual English fields may fall back to Swedish after the route has resolved.

When generating internal links and `hreflang` tags, use `slug.en.current` only when it exists. Otherwise link to the Swedish route or omit the English alternative.

## Organisation Queries

Sections derive their roles and members through references. A section does not contain people or roles directly:

```groq
*[_type == "section" && slug.sv.current == $slug][0]{
      "title": coalesce(title[language == $language][0].value, title[language == "sv"][0].value),
  "description": coalesce(description[language == $language][0].value, description[language == "sv"][0].value),
  "recruitmentInfo": coalesce(recruitmentInfo[language == $language][0].value, recruitmentInfo[language == "sv"][0].value),
  "roles": *[_type == "role" && section._ref == ^._id] | order(sortOrder asc){
    _id,
    "title": coalesce(title[language == $language][0].value, title[language == "sv"][0].value),
    "description": coalesce(description[language == $language][0].value, description[language == "sv"][0].value),
    recruiting,
    "people": *[_type == "person" && ^._id in roles[]._ref] | order(name asc){
      _id,
      name,
      bio,
      image
    }
  }
}
```

Roles without a section and actively recruiting roles can be queried independently:

```groq
*[_type == "role" && !defined(section)] | order(sortOrder asc){
  "title": coalesce(title[language == $language][0].value, title[language == "sv"][0].value),
  "description": coalesce(description[language == $language][0].value, description[language == "sv"][0].value),
  recruiting
}

*[_type == "role" && recruiting == true] | order(sortOrder asc){
  "title": coalesce(title[language == $language][0].value, title[language == "sv"][0].value),
  "committee": section->{
    "title": coalesce(title[language == $language][0].value, title[language == "sv"][0].value)
  }
}
```

## Image Queries

When rendering an image, project its asset reference together with `crop` and `hotspot`, then resolve `alt` and `caption` through the same localised-field fallback. Use Sanity's image URL builder so editorial hotspot and crop choices are respected.

## Migration

See [`../migrations/README.md`](../migrations/README.md), [`../migrations/section-role-model.md`](../migrations/section-role-model.md), and [`../migrations/field-localization.md`](../migrations/field-localization.md) before changing live content. Existing legacy documents are retained until their replacements are deliberately created or migrated.
