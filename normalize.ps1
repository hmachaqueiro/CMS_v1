$filePath = "requisitos_v3.md"
$content = Get-Content -Path $filePath -Encoding UTF8 -Raw

# Count initial markers
$initial_count = ([regex]::Matches($content, "[ÃÂâ�]")).Count
Write-Host "Initial matches: $initial_count"

# Split content by lines, then process tokens
$lines = $content -split "`r?`n"
$new_lines = foreach ($line in $lines) {
    if ($line -cmatch "[ÃÂâ]") {
        # Tokenize by whitespace
        $tokens = $line -split '(\s+)'
        $new_tokens = foreach ($t in $tokens) {
            if ($t -cmatch "[ÃÂâ]") {
                # Attempt decoding
                try {
                    $bytes = [System.Text.Encoding]::GetEncoding("windows-1252").GetBytes($t)
                    $decoded = [System.Text.Encoding]::UTF8.GetString($bytes)
                    
                    $old_markers = ([regex]::Matches($t, "[ÃÂâ�]")).Count
                    $new_markers = ([regex]::Matches($decoded, "[ÃÂâ�]")).Count
                    
                    if ($new_markers -lt $old_markers -and $decoded -notlike '*�*') {
                        $decoded
                    } else {
                        $t
                    }
                } catch {
                    $t
                }
            } else {
                $t
            }
        }
        $new_tokens -join ""
    } else {
        $line
    }
}

$new_content = $new_lines -join "`r`n"
[System.IO.File]::WriteAllText((Get-Item $filePath).FullName, $new_content, [System.Text.Encoding]::UTF8)

# Count final markers
$final_content = Get-Content -Path $filePath -Encoding UTF8 -Raw
$final_count = ([regex]::Matches($final_content, "[ÃÂâ�]")).Count
Write-Host "Final matches: $final_count"

# Sample remaining lines with markers if any
$rem = $final_content -split "`r?`n" | Where-Object { $_ -cmatch "[ÃÂâ]" } | Select-Object -First 5
if ($rem) {
    Write-Host "Remaining sample lines:"
    $rem | ForEach-Object { Write-Host " - $_" }
}
