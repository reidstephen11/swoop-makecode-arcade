
// ===== MISSION 4, the likely student edit: duplicate, change only the timing =====
game.onUpdateInterval(2000, function () {
    crow = sprites.create(crowFrames[0], SpriteKind.Crow)
    crow.setPosition(-6, randint(18, 72))
    crow.setVelocity(72, 16)
    crow.setFlag(SpriteFlag.AutoDestroy, true)
    animation.runImageAnimation(crow, crowFrames, 140, true)
})
