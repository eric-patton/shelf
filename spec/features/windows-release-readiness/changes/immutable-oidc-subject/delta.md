# Delta - immutable-oidc-subject

> The change expressed against the current spec as explicit operations.

## ADDED

- The release contract verifies the fork's live immutable GitHub OIDC owner and repository IDs
  against the exact subject documented for Azure federation.

## MODIFIED

- **AC-8 fork-bound GitHub OIDC federation**
  - Was: Azure federation uses the name-only subject
    `repo:eric-patton/shelf:environment:windows-release`.
  - Now: Azure federation uses the immutable subject
    `repo:eric-patton@248889511/shelf@1316644982:environment:windows-release`.
- **Repository rename behavior**
  - Was: A renamed repository does not inherit signing access.
  - Now: Ordinary renames retain the immutable owner-ID and repository-ID trust binding. A transfer
    or replacement repository does not inherit signing access.

## REMOVED

- The name-only OIDC subject is removed from canonical guidance because GitHub does not issue that
  subject for this post-2026-07-15 fork.
