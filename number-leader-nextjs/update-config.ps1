# PowerShell script to update Firebase Functions configuration
$brochureUrl = "https://firebasestorage.googleapis.com/v0/b/numberleader-9210c.firebasestorage.app/o/Brochure.pdf?alt=media&token=70488f0a-75e9-49b4-b975-ec1eeb66da13"

Write-Host "Setting Firebase Functions configuration..."
firebase functions:config:set storage.brochure_url="$brochureUrl"
Write-Host "Configuration updated successfully!" 