# Specification delta: persistent tab renaming

## ADDED

### Scenario: Rename a tab

- Given a closable blank-terminal, local-session, new-agent, or SSH tab
- When the user opens Rename from its context menu or double-clicks the tab and saves a nonempty name
- Then Shelf immediately shows the trimmed custom title
- And Shelf restores that title after restart
- And provider or pending-session refresh does not overwrite it

### Acceptance criterion

- AC-9: Every closable tab can be renamed from an accessible dialog opened by its context menu or by
  double-click. A trimmed nonempty custom title is persisted across restart and takes precedence over
  automatic session-title updates. The Home tab remains immutable.

### Edge cases and errors

- A blank or whitespace-only title is not saved.
- Canceling the dialog leaves the current title unchanged.
- Existing saved state without a custom title restores with its existing generated title.

## MODIFIED

None.

## REMOVED

None.

