# PowerShell script to move files from 'util dashboard' to root for Vercel deployment

# First, copy all files from 'util dashboard' to the root
Get-ChildItem -Path "util dashboard" -Recurse | ForEach-Object {
    $targetPath = $_.FullName -replace [regex]::Escape((Join-Path (Get-Location) "util dashboard\")), (Get-Location).Path + "\"
    
    if ($_.PSIsContainer) {
        # Create directory if it doesn't exist
        if (!(Test-Path $targetPath)) {
            New-Item -ItemType Directory -Path $targetPath | Out-Null
            Write-Host "Created directory: $targetPath"
        }
    } else {
        # Copy file
        $targetDir = Split-Path -Parent $targetPath
        if (!(Test-Path $targetDir)) {
            New-Item -ItemType Directory -Path $targetDir | Out-Null
        }
        Copy-Item -Path $_.FullName -Destination $targetPath -Force
        Write-Host "Copied file: $($_.FullName) -> $targetPath"
    }
}

# Now remove the vercel.json from the util dashboard directory as it's no longer needed
if (Test-Path "util dashboard\vercel.json") {
    Remove-Item "util dashboard\vercel.json"
    Write-Host "Removed util dashboard\vercel.json"
}

Write-Host ""
Write-Host "Project restructured for Vercel deployment."
Write-Host "You can now deploy from the root directory."
Write-Host ""
Write-Host "Important: After successful deployment, you can delete these copied files if you want to keep your original project structure." 