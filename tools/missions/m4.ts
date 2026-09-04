
// ===== MISSION 4 (student duplicates the swoop block) =====
game.onUpdateInterval(2000, function () {
    crow = sprites.create(crowFrames[0], SpriteKind.Crow)
    crow.setPosition(-6, randint(50, 95))
    crow.setVelocity(90, 10)
    crow.setFlag(SpriteFlag.AutoDestroy, true)
    animation.runImageAnimation(crow, crowFrames, 140, true)
})
