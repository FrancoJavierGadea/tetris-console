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

$sound.Volume = $volume;

# Evento para reiniciar la reproducción cuando termine
$sound.Add_MediaEnded({

    # Reinicia la posición al inicio
    $sound.Position = [TimeSpan]::Zero;

    $sound.Play();
})

$sound.Play();

Write-Host "Reproduciendo en bucle... Presiona Ctrl+C para detener."

while ($true) {

    Start-Sleep -Seconds 1;
}