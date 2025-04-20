# Set Android SDK path (update this path to your Android Studio installation)
$androidHome = "$env:LOCALAPPDATA\Android\Sdk"
[Environment]::SetEnvironmentVariable("ANDROID_HOME", $androidHome, "User")

# Add Android SDK tools to PATH
$androidPaths = @(
    "$androidHome\platform-tools",
    "$androidHome\tools",
    "$androidHome\tools\bin",
    "$androidHome\build-tools\34.0.0"
)

# Get current PATH
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")

# Add Android paths to PATH if they don't exist
foreach ($path in $androidPaths) {
    if (-not $currentPath.Contains($path)) {
        $currentPath = "$currentPath;$path"
    }
}

# Update PATH
[Environment]::SetEnvironmentVariable("Path", $currentPath, "User")

Write-Host "Android environment variables have been set up."
Write-Host "Please close and reopen your terminal for changes to take effect." 