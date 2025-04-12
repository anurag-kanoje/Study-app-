# Fix path issues
Get-ChildItem -Path "app" -Recurse -Filter "*.tsx" | ForEach-Object {
    $content = Get-Content $_.FullName
    $updated = $content -replace "@/components/", "@/app/components/"
    
    # Fix casing issues for UI components
    $updated = $updated -replace "@/app/components/ui/card", "@/app/components/ui/Card"
    $updated = $updated -replace "@/app/components/ui/button", "@/app/components/ui/Button"
    $updated = $updated -replace "@/app/components/ui/tabs", "@/app/components/ui/tabs"
    $updated = $updated -replace "@/app/components/ui/input", "@/app/components/ui/input"
    $updated = $updated -replace "@/app/components/ui/textarea", "@/app/components/ui/textarea"
    $updated = $updated -replace "@/app/components/ui/label", "@/app/components/ui/label"
    $updated = $updated -replace "@/app/components/ui/badge", "@/app/components/ui/badge"
    
    $updated | Set-Content $_.FullName
    Write-Host "Fixed imports in $($_.FullName)"
}
