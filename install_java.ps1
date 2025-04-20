# Download and install Java
$javaUrl = "https://download.java.net/java/GA/jdk17.0.2/dfd4a8d0985749f896bed50d7138ee7f/8/GPL/openjdk-17.0.2_windows-x64_bin.zip"
$downloadPath = "$env:TEMP\java.zip"
$installPath = "C:\Java"

# Create Java directory if it doesn't exist
if (-not (Test-Path $installPath)) {
    New-Item -ItemType Directory -Path $installPath -Force
}

# Download Java
Write-Host "Downloading Java..."
try {
    $ProgressPreference = 'SilentlyContinue'
    Invoke-WebRequest -Uri $javaUrl -OutFile $downloadPath -UseBasicParsing
    Write-Host "Download completed successfully."
} catch {
    Write-Host "Error downloading Java: $_"
    Write-Host "Please download Java manually from: https://download.java.net/java/GA/jdk17.0.2/dfd4a8d0985749f896bed50d7138ee7f/8/GPL/openjdk-17.0.2_windows-x64_bin.zip"
    Write-Host "Save it to: $downloadPath"
    exit 1
}

# Extract Java
Write-Host "Extracting Java..."
try {
    Expand-Archive -Path $downloadPath -DestinationPath $installPath -Force
    Write-Host "Extraction completed successfully."
} catch {
    Write-Host "Error extracting Java: $_"
    exit 1
}

# Set environment variables
$javaHome = "$installPath\jdk-17.0.2"
$javaBin = "$javaHome\bin"

# Set JAVA_HOME
[Environment]::SetEnvironmentVariable("JAVA_HOME", $javaHome, "User")

# Add Java to PATH
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
if (-not $currentPath.Contains($javaBin)) {
    [Environment]::SetEnvironmentVariable("Path", "$currentPath;$javaBin", "User")
}

# Clean up
if (Test-Path $downloadPath) {
    Remove-Item $downloadPath -Force
}

Write-Host "Java has been installed and configured."
Write-Host "Please close and reopen your terminal for changes to take effect."
Write-Host "To verify installation, run 'java -version' in a new terminal." 