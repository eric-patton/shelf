# Interaction model

## Flow 1: Install Shelf on Windows

- Primary: the user downloads MSI or NSIS from the release, verifies checksum and publisher, runs the
  installer, and launches Shelf.
- Empty: no supported agent CLI shows the documented requirement while blank PowerShell terminals
  remain usable.
- Error: missing WebView2 or an invalid signature directs the user to stop and follow the documented
  recovery path.

## Flow 2: Choose and use a Windows shell

- Primary: settings shows PowerShell 7 when installed, Windows PowerShell as fallback, and cmd as a
  selectable option. The user opens a terminal and executes a command.
- Empty: if only Windows PowerShell is present, it remains the valid default.
- Error: an unavailable saved shell falls back to the detected default and settings shows the active
  choice.

## Flow 3: Upgrade or uninstall

- Primary: the user installs the newer signed build over the previous release, Shelf preserves
  compatible settings, and Windows can uninstall it from Installed apps.
- Empty: a first install creates normal application state only after launch.
- Error: an active Shelf process is closed before upgrade or uninstall is retried.

## Flow 4: Verify a release

- Primary: the user or release owner compares SHA-256, checks Authenticode publisher and timestamp,
  and confirms the release tag and version.
- Empty: no checksum or no signature means the artifact is not accepted as a public Windows release.
- Error: any mismatch blocks install or publication.

## Components

- Existing Shelf home, settings, terminal, session, SSH, and quit interfaces.
- GitHub checks, release assets, checksum files, Windows installer metadata, and documentation.
- No new in-app visual component is required.

## Review

Every user story has primary, empty, and error handling. Release failures stop before public
distribution, while development and unsigned local packaging remain available.
