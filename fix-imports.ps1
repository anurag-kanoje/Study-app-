Get-ChildItem -Path "app" -Recurse -Filter "*.tsx" | ForEach-Object {
    $content = Get-Content $_.FullName
    $updated = $content -replace "@/components/", "@/app/components/"
    $updated | Set-Content $_.FullName
}
