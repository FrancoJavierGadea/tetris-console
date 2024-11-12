param(
    [string]$source,
    [double]$volume = 0.5
);

if (-not (Test-Path $source)) {

    Write-Host "El archivo no existe en la ruta especificada: $source";

    exit;
}

# Cargar la biblioteca necesaria
Add-Type -AssemblyName presentationCore;

# Crear el reproductor
$sound = New-Object System.Windows.Media.MediaPlayer;

$sound.Open([uri] $source);

$duration = $null;

do {
    $duration = $sound.NaturalDuration.TimeSpan.TotalMilliseconds;
}
until($duration);

Write-Host "Duration $duration";

$sound.Volume = $volume;


Write-Host "Reproduciendo en bucle... Presiona Ctrl + C para detener.";

while ($true) {
    
    $sound.Position = [TimeSpan]::Zero;
    $sound.Play();
    Start-Sleep -Milliseconds $duration;
}