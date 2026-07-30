# Change proposal: persistent tab renaming

## Trigger

Windows pilot feedback identified that terminal tabs cannot be given a user-defined name.

## Why

Session and terminal titles are currently derived from provider or process state. That is useful as a
default, but it does not let a user distinguish multiple tabs that have similar generated titles. A
small, persistent rename action makes the tab strip easier to organize without changing the
underlying workspace or session identity.

## Blast radius

- Specification: add one acceptance criterion for renaming closable tabs and preserving the custom
  title across restart.
- Plan: add a backward-compatible optional saved-state field, a focused title helper, and accessible
  context-menu and double-click entry points.
- Tasks: add test-first implementation, persistence coverage, and Windows desktop verification.
- Product code: tab types, saved-state validation and restoration, automatic session-title refresh,
  workspace tab rendering, dialog actions, and translations.

