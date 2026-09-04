
// ===== MISSION 5 examples =====
// sound effect on catch
sprites.onOverlap(SpriteKind.Player, SpriteKind.Shiny, function (sprite, otherSprite) {
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
})
// bigger bucket
player.setScale(1.5, ScaleAnchor.Middle)
// countdown
info.startCountdown(60)
