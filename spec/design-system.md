# Design system: Shelf

## Design principles

- Preserve the terminal-first workflow. Platform support should reduce friction without adding
  ceremony to common actions.
- Explain recoverable failures in place and keep unaffected projects and terminals usable.
- Use familiar Windows terminology when behavior is platform-specific.

## Visual language

- Color: reuse the existing CSS custom properties and semantic status colors.
- Type: reuse the existing application and terminal typography.
- Spacing and layout: reuse the existing panel, dialog, tab, and settings spacing.
- Iconography: reuse the existing Lucide icon set.
- Theming: preserve the existing application theme and terminal theme behavior.

## Components and patterns

- Reuse existing settings rows, notices, toasts, dialogs, terminal tabs, file tree items, and update
  cards before adding a new component.
- Shell choices show friendly labels while persisting stable executable identifiers.

## Interaction and states

- Loading: preserve the current surface and show progress only when work is perceptibly long.
- Empty: explain what is missing and name the direct next action.
- Error: keep unaffected controls enabled, state what failed, and offer a retry or settings action.
- Success and confirmation: use a short toast for reversible operations and a dialog only when the
  user must decide.

## Motion and feedback

- Motion: use existing brief transitions and disable nonessential animation under reduced motion.
- Haptics and sound: none.

## Content and voice

- Voice: plain, direct, concise, and specific about the failing shell, provider, path, or installer.
- Terminology: use the product-global glossary and Windows product names.

## Accessibility

- Preserve keyboard navigation, accessible names, visible focus, readable contrast, and reduced
  motion across settings, dialogs, project navigation, and update surfaces.
- Terminal accessibility remains governed by xterm behavior and user terminal settings.

## Responsive and platforms

- Support resizable desktop windows at the existing minimum size.
- Preserve the established macOS and Linux layout. Windows-specific choices appear only when Shelf
  runs on Windows.
