/**
 * Fonte única em JS para a altura do header, usada pela lógica de scroll-spy
 * (`useActiveSection`). O mesmo valor também vive em `src/app/globals.css`
 * como a custom property `--header-height` — CSS e JS não compartilham um
 * único valor sem tooling extra, então os dois lados ficam sincronizados
 * manualmente. Se um mudar, o outro precisa mudar junto.
 */
export const HEADER_HEIGHT_PX = 72
