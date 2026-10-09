# Content Migration

Run the field migration in dry-run mode before deploying the revised Studio:

```sh
npx sanity migrations run 2026-04-content-architecture
```

After reviewing the generated patches, make a dataset export and run the migration with `--no-dry-run`.

`config` to `siteSettings` and `volunteerGroup` to `section` cannot be changed by a content migration because Sanity document `_type` values are immutable. Recreate those documents in the revised Studio before deleting the old ones:

- Copy the current `config` values into the `siteSettings` singleton.
- Create sections for IT-gruppen, Kursverksamhet, and Ledbygge.
- Create roles separately and assign them to people. See [`section-role-model.md`](section-role-model.md).

The legacy documents remain stored in the dataset until they are deliberately removed.
