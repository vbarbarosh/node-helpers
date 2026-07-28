# Project Agent Instructions

## Commit Messages

- Prefer commit subjects in the form `<component>: <description>`.
- Use the concrete component name directly, for example:
  `urlmod: cover path preservation and query normalization`.
- Do not add Conventional Commit type prefixes such as `test(urlmod):`,
  `fix(urlmod):`, or `ci:` unless the user explicitly requests that style.

## JavaScript Requires

- Keep each contiguous top-level block of CommonJS `require` declarations
  sorted by the complete declaration line, matching the bytewise order produced
  by `LC_ALL=C sort`.
- Do not separate built-in, third-party, and local imports into different
  groups.
