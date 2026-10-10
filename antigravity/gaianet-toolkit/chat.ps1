# Interactive PowerShell CLI Chat for GaiaNet Local Node
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "         GaiaNet Local AI Terminal Chat (Llama 3.2)       " -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "Type 'exit' or 'quit' to end the conversation.`n" -ForegroundColor Gray

$endpoint = "http://localhost:8080/v1/chat/completions"
$history = @(
    @{ role = "system"; content = "You are a helpful and concise AI assistant." }
)

while ($true) {
    $prompt = Read-Host "You"
    if ($prompt -eq "exit" -or $prompt -eq "quit" -or [string]::IsNullOrWhiteSpace($prompt)) {
        if ([string]::IsNullOrWhiteSpace($prompt)) { continue }
        Write-Host "Exiting chat..." -ForegroundColor Yellow
        break
    }

    $history += @{ role = "user"; content = $prompt }

    $payload = @{
        model = "Llama-3.2-3B-Instruct"
        messages = $history
        temperature = 0.7
        max_tokens = 250
    } | ConvertTo-Json -Depth 5

    Write-Host "AI: " -NoNewline -ForegroundColor Green
    try {
        $response = Invoke-RestMethod -Uri $endpoint -Method Post -ContentType "application/json" -Body $payload -TimeoutSec 60
        $reply = $response.choices[0].message.content.Trim()
        Write-Host "$reply`n" -ForegroundColor White
        $history += @{ role = "assistant"; content = $reply }
    } catch {
        Write-Host "Error communicating with local node. Ensure node is running on port 8080.`n" -ForegroundColor Red
    }
}
