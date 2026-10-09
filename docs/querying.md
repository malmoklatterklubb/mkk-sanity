# Content Model

This repository contains the Sanity Studio schema. The Astro frontend lives in the separate `mkk-astro` repository and currently has no Sanity queries.

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

Editorial `content` fields support paragraphs, headings, lists, quotes, internal and external links, images with alternative text, and section reference blocks. Queries that render Portable Text must project the referenced section when handling a `sectionReference` block.

## Organisation Queries

Sections derive their roles and members through references. A section does not contain people or roles directly:

```groq
*[_type == "section" && slug.current == $slug][0]{
  title,
  description,
  recruitmentInfo,
  "roles": *[_type == "role" && section._ref == ^._id] | order(sortOrder asc, title asc){
    _id,
    title,
    description,
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
*[_type == "role" && !defined(section)] | order(sortOrder asc, title asc){title, description, recruiting}
*[_type == "role" && recruiting == true] | order(sortOrder asc, title asc){title, section->{title}}
```

## Image Queries

When rendering an image, project its asset reference together with `alt`, `caption`, `crop`, and `hotspot` where applicable. Use Sanity's image URL builder so editorial hotspot and crop choices are respected.

## Migration

See [`../migrations/README.md`](../migrations/README.md) and [`../migrations/section-role-model.md`](../migrations/section-role-model.md) before changing live content. Existing legacy documents are retained until their replacements are deliberately created or migrated.
