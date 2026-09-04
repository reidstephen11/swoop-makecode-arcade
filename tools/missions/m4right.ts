
// ===== MISSION 4 variant: crow from the right =====
game.onUpdateInterval(2200, function () {
    crow = sprites.create(crowFrames[1], SpriteKind.Crow)
    crow.setPosition(166, randint(18, 78))
    crow.setVelocity(-80, 25)
    crow.setFlag(SpriteFlag.AutoDestroy, true)
    animation.runImageAnimation(crow, crowFrames, 140, true)
})
