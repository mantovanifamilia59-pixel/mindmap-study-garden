<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Sample study content (subjects, aulas, notes) lives in `src/lib/study-data.ts`; pages derive counts from it instead of hardcoding, so lists and totals stay consistent.
- Notes are nested routes `/anotacoes/$materia/$aula/$nota`; 4-segment paths and the create forms render fullscreen (no tab bar/FAB) via `isFullscreen` in AppShell.
- Typography uses the `title-page`, `title-section`, `title-item`, `text-meta`, `text-label` utilities in `src/styles.css`; use them instead of ad-hoc text sizes so hierarchy stays uniform.
