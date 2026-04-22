$ErrorActionPreference = "Stop"

$Repo = "MichaelCurrin/auto-commit-msg"
$Binaries = @("acm", "gacm", "auto_commit_msg")
$InstallDir = "$HOME\AppData\Local\bin"

$RepoUrl = "https://github.com/$Repo/releases/latest/download"

# Ensure install directory exists.
if (!(Test-Path $InstallDir)) {
    New-Item -ItemType Directory -Path $InstallDir | Out-Null
}

# Create a temporary workspace.
$TempDir = Join-Path $env:TEMP ([Guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $TempDir | Out-Null

try {
    foreach ($Bin in $Binaries) {
        $Filename = "${Bin}-windows-amd64.exe"
        $DownloadUrl = "${RepoUrl}/${Filename}"
        $DestPath = Join-Path $InstallDir "${Bin}.exe"
        $TempPath = Join-Path $TempDir $Filename

        Write-Host "Installing $Bin..."

        # Download
        Invoke-WebRequest -Uri $DownloadUrl -OutFile $TempPath -UseBasicParsing

        # Move to destination
        Move-Item -Path $TempPath -Destination $DestPath -Force
    }

    # Verify PATH.
    $UserPath = [Environment]::GetEnvironmentVariable("Path", "User")
    if ($UserPath -notlike "*$InstallDir*") {
        Write-Host "Adding $InstallDir to User PATH..." -ForegroundColor Cyan
        [Environment]::SetEnvironmentVariable("Path", "$UserPath;$InstallDir", "User")
        $env:Path += ";$InstallDir"
    }

    Write-Host "Successfully installed $($Binaries -join ', ') to $InstallDir" -ForegroundColor Green
    Write-Host "Please restart your terminal to refresh the PATH." -ForegroundColor Yellow
}
finally {
    # Cleanup.
    if (Test-Path $TempDir) {
        Remove-Item -Path $TempDir -Recurse -Force
    }
}
