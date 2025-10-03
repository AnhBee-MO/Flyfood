Definition of Done (Flyfood)

- Types & API
  - No `any` or unused vars in changed code
  - Types shared via `src/types/*`; hooks return typed shapes
  - Loading/empty/error states covered in UI

- UI & i18n
  - UTF-8 text; no mojibake
  - Shared patterns use `src/styles/components.css` (e.g., status badges)
  - Accessible labels (aria-*, title) where appropriate

- Performance
  - Hooks memoize derived maps (`useMemo`), avoid unnecessary re-renders
  - API caching is coherent; invalidated or refreshed when query changes

- Code quality
  - `npm run lint` passes (no errors/warnings on touched files)
  - Naming and file placement consistent with current structure

- Docs & housekeeping
  - Update README or docs when behavior/UX changes
  - Keep commits scoped and descriptive

