let player = sprites.create(img`
    . . . . 
    . 1 1 . 
    . 1 1 . 
    . . . . 
    `, SpriteKind.Player)
player.setScale(1.5, ScaleAnchor.Middle)
music.play(music.createSoundEffect(WaveShape.Sine, 400, 1200, 255, 0, 100, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
info.startCountdown(60)
