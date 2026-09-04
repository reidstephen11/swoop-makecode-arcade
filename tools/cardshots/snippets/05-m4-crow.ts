namespace SpriteKind {
    export const Crow = SpriteKind.create()
}
let crow: Sprite = null
let crowFrames: Image[] = []
game.onUpdateInterval(3500, function () {
    crow = sprites.create(crowFrames[0], SpriteKind.Crow)
    crow.setPosition(-6, randint(18, 72))
    crow.setVelocity(72, 16)
    crow.setFlag(SpriteFlag.AutoDestroy, true)
    animation.runImageAnimation(
    crow,
    crowFrames,
    140,
    true
    )
})
