# Function to check if Java is installed
function Test-JavaInstallation {
    try {
        $javaVersion = java -version 2>&1
        return $true
    } catch {
        return $false
    }
}

# Function to install Java
function Install-Java {
    Write-Host "Installing Java..."
    
    # Download Java installer
    $javaUrl = "https://download.java.net/java/GA/jdk17.0.2/dfd4a8d0985749f896bed50d7138ee7f/8/GPL/openjdk-17.0.2_windows-x64_bin.zip"
    $downloadPath = "$env:TEMP\java.zip"
    $installPath = "C:\Java"
    
    # Create Java directory
    if (-not (Test-Path $installPath)) {
        New-Item -ItemType Directory -Path $installPath -Force
    }
    
    # Download Java
    Write-Host "Downloading Java..."
    $ProgressPreference = 'SilentlyContinue'
    Invoke-WebRequest -Uri $javaUrl -OutFile $downloadPath -UseBasicParsing
    
    # Extract Java
    Write-Host "Extracting Java..."
    Expand-Archive -Path $downloadPath -DestinationPath $installPath -Force
    
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
    Remove-Item $downloadPath -Force
    
    Write-Host "Java installation completed."
}

# Function to build and deploy the app
function Deploy-App {
    Write-Host "Building and deploying the app..."
    
    # Install dependencies
    Write-Host "Installing dependencies..."
    npm install
    
    # Build the app
    Write-Host "Building the app..."
    npx eas build --platform android --profile development
    
    # Check build status
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Build completed successfully!"
    } else {
        Write-Host "Build failed. Please check the error messages above."
        exit 1
    }
}

# Main execution
Write-Host "Starting deployment process..."

# Check Java installation
if (-not (Test-JavaInstallation)) {
    Write-Host "Java not found. Installing Java..."
    Install-Java
    Write-Host "Please close and reopen this terminal, then run the script again."
    exit 0
}

# Build and deploy the app
Deploy-App

Write-Host "Deployment process completed!"

# Additional instructions for Expo development server
Write-Host "Great! The Expo development server is now running."
Write-Host "Here's what you need to do next:"
Write-Host "1. Install the Expo Go app on your Android device:"
Write-Host "   - Go to the Google Play Store"
Write-Host "   - Search for 'Expo Go'"
Write-Host "   - Install the app"
Write-Host "2. Once installed, open the Expo Go app and scan the QR code that appears in your terminal. The QR code should look like this:"
Write-Host "   ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄"
Write-Host "   █ ▄▄▄▄▄ █▄███  ▀█▄ ▀▀█▀ █▀█ ▄▄▄▄▄ █"
Write-Host "   █ █   █ ██  █▄  █▀▀▄▄▄ █▀▀█ █   █ █"
Write-Host "   █ █▄▄▄█ ██  ▀ ▄█▄ ▀▄▄▀▄ ▀██ █▄▄▄█ █"
Write-Host "   █▄▄▄▄▄▄▄█ █▄█ ▀▄▀▄█ █▄█▄█▄█▄▄▄▄▄▄▄█"
Write-Host "3. After scanning the QR code, your app will load in the Expo Go app. You can now:"
Write-Host "   - Test all features"
Write-Host "   - Make changes to your code"
Write-Host "   - See updates in real-time"
Write-Host "   - Use the developer menu (shake your device or press 'm' in the terminal)"
Write-Host "4. Useful commands while developing:"
Write-Host "   - Press 'r' to reload the app"
Write-Host "   - Press 'm' to open the developer menu"
Write-Host "   - Press 'j' to open the debugger"
Write-Host "   - Press 'a' to open on Android emulator (if you have one set up)"
Write-Host "The app is now running in development mode, which means:"
Write-Host "- You can make changes to your code and see them immediately"
Write-Host "- You have access to the developer menu"
Write-Host "- You can use the debugger"
Write-Host "- Hot reloading is enabled"
Write-Host "Would you like me to help you test any specific features or make any changes to the app?"