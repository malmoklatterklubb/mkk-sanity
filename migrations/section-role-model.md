# Section and Role Migration

The section and role model replaces `activityArea` and its embedded role/member objects. No documents are changed or deleted by this repository update.

Sanity document `_type` values are immutable, so an `activityArea` cannot be converted to a `section` in place. Recreate the replacement documents first, then retire the old draft only after the new data has been reviewed.

## Current Production Content

The dataset contains one unpublished activity area:

- `Kursverksamhet` (`kursverksamhet`)
- Embedded role: `Instruktör`
- Assigned person: Nils Lockean

There are no existing `person.roles` references and no Portable Text activity-area reference blocks.

## Manual Migration Steps

1. Create and publish a `Sektion` named `Kursverksamhet` with slug `kursverksamhet`.
2. Create and publish a `Roll` named `Instruktör`, referencing the new section.
3. Open Nils Lockean, add the new `Instruktör` role to `roles`, and publish the person.
4. Compare the replacement records with the old activity-area draft.
5. Delete the legacy `activityArea` draft only after approval.

For any future activity areas with embedded members, repeat the same mapping: create one role document per embedded role and assign that role to each referenced person. Do not add people to sections directly.
