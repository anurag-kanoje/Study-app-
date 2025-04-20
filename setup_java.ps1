# Set JAVA_HOME
$javaHome = "C:\Java\jdk-17"
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', $javaHome, 'Machine')

# Add Java to PATH
$currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'Machine')
$javaBinPath = "$javaHome\bin"
if (-not $currentPath.Contains($javaBinPath)) {
    [System.Environment]::SetEnvironmentVariable('Path', $currentPath + ";" + $javaBinPath, 'Machine')
}

Write-Host "Java environment variables have been set up."
Write-Host "Please close and reopen your terminal for changes to take effect." 