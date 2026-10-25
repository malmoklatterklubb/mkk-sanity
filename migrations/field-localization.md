# Field-Level Localization Migration

This migration moves existing Swedish content into `sv` items in the field-level localization arrays. It does not create English values, modify document IDs, replace references, or duplicate assets.

## Before Running

1. Export the production dataset and keep the export available for rollback.
2. Deploy the Studio schema and query changes before executing the migration.
3. Run the migration in dry-run mode and review every proposed patch.

```sh
npx sanity migrations run 2026-10-field-localization
```

The migration updates only legacy scalar or Portable Text values. It skips values already stored as localized arrays, so it is safe to rerun and does not overwrite English translations.

## Execute After Approval

After a reviewed dry run and a verified backup, execute:

```sh
npx sanity migrations run 2026-10-field-localization --no-dry-run
```

## Included Fields

- Page, post, homepage, committee, and role visitor-facing copy.
- Site title, site description, and navigation labels.
- Person biographies.
- SEO title, description, and image alternative text.
- Image alternative text and captions in Portable Text.
- Swedish route slugs, converted from `slug.current` to `slug.sv.current`.

The migration retains legacy `body` fields while copying their Portable Text into localized `content`, so the earlier content-architecture migration can be completed independently.

English slug values remain empty. An English route must not be enabled until an editor deliberately adds an English slug.
