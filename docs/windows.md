# Shelf for Windows

Shelf for Windows 0.3.0 targets Windows 10 22H2 and Windows 11 on x64 systems. It is independently
maintained at `eric-patton/shelf` and is derived from the MIT-licensed upstream Shelf project.

## Choose an installer

- MSI is appropriate for Windows Installer-based deployment and managed environments.
- NSIS is the `-setup.exe` asset and provides an interactive per-user install.

Download the installer and `SHA256SUMS.windows.txt` from the same GitHub release. Public Windows
release assets must be signed and timestamped. Do not install an asset with an invalid or missing
signature.

## Verify the download

In PowerShell, compare the downloaded file with the matching checksum entry:

```powershell
$installer = Get-Item .\*0.3.0*x64-setup.exe
Get-FileHash $installer -Algorithm SHA256
Get-Content .\SHA256SUMS.windows.txt
```

Then verify the Authenticode publisher and timestamp:

```powershell
$signature = Get-AuthenticodeSignature $installer
$signature.Status
$signature.SignerCertificate.Subject
$signature.TimeStamperCertificate.Subject
```

`Status` must be `Valid`. The signer must match the publisher shown in the GitHub release. A missing
timestamp is not acceptable.

## Shell behavior

Shelf for Windows detects Windows shells in this order:

1. PowerShell 7 (`pwsh.exe`)
2. Windows PowerShell (`powershell.exe`)
3. Command Prompt (`cmd.exe`)

A valid saved shell remains selected. If it becomes unavailable, Shelf for Windows uses the first
detected shell.
Command Prompt remains selectable in Settings. AI Organizer uses PowerShell 7 when available and
falls back to Windows PowerShell.

PowerShell scripts are launched with `-NoLogo -NoProfile -NonInteractive -File`. Batch and cmd files
are launched through `cmd.exe`, while executable files are launched directly.

## Agent CLIs and SSH

Install Claude Code, Codex, or pi through the provider's supported Windows instructions and confirm
the command is available in a new PowerShell window:

```powershell
Get-Command claude,codex,pi -ErrorAction SilentlyContinue
```

You only need one provider to use Shelf for Windows. Each provider owns its authentication and
session records. Shelf for Windows does not proxy or store provider credentials.

For SSH workspaces, enable the built-in Windows OpenSSH Client and test the host outside Shelf first:

```powershell
Get-Command ssh.exe
ssh your-host
```

Remote workspace paths remain POSIX paths even though Shelf for Windows runs on Windows.

## Move from upstream Shelf

Shelf for Windows uses a unique application identifier and MSI upgrade code. Installing it does not
silently replace upstream Shelf 0.2.27 or another upstream release.

The compatible `~/.shelf` workspace configuration and provider-owned session stores remain
available. Close upstream Shelf before launching Shelf for Windows and do not run both applications
at the same time. Window-specific WebView state can start with new defaults because the applications
have separate identities.

## Upgrade Shelf for Windows

1. Close Shelf for Windows so no terminal or agent process remains active.
2. Verify the new installer's checksum and signature.
3. Run the new installer over the previous version.
4. Launch Shelf for Windows and confirm workspaces, shell selection, tabs, and session discovery.

Shelf for Windows keeps compatible settings and state across an in-place fork upgrade. Installers
reject version downgrades.

## Uninstall

Close Shelf for Windows, open Windows Settings, select Apps, then Installed apps, and uninstall Shelf
for Windows. If Windows reports that a file is in use, confirm the application and its terminal
children have exited before retrying.

## Troubleshooting

### Shelf for Windows opens to a blank or missing window

Install or repair the current Microsoft Edge WebView2 Runtime, then restart Shelf for Windows.

### PowerShell 7 is not listed

Open a new Windows PowerShell window and run `Get-Command pwsh.exe`. Install PowerShell 7 or continue
using the automatically detected Windows PowerShell fallback.

### An agent command is not found

Run `Get-Command` for the provider in a new terminal. Restart Shelf for Windows after changing PATH.
Provider authentication remains provider-owned.

### SSH cannot connect

Confirm `ssh.exe` is installed, test the same host and key from PowerShell, and verify that the remote
workspace uses a POSIX path.

### Windows shows a SmartScreen warning

First verify Authenticode and SHA-256. A new valid publisher can still need time to build SmartScreen
reputation. Do not bypass a warning if the signature is missing, invalid, or has an unexpected
publisher.

### Installer upgrade or uninstall fails

Close Shelf for Windows and confirm no `shelf-for-windows.exe` remains in Task Manager. Retry the
signed installer or uninstaller. Do not delete the application directory by hand.
