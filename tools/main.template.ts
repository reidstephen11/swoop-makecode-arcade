namespace SpriteKind {
    export const Shiny = SpriteKind.create()
    export const Crow = SpriteKind.create()
    export const Scenery = SpriteKind.create()
}
// Swooped!
sprites.onOverlap(SpriteKind.Player, SpriteKind.Crow, function (sprite, otherSprite) {
    otherSprite.destroy(effects.spray, 200)
    if (game.runtime() >= protectedUntil) {
        protectedUntil = game.runtime() + 1000
        info.changeLifeBy(-1)
        scene.cameraShake(4, 500)
        sprite.sayText("SAFE", 1000, false)
        sprite.startEffect(effects.coolRadial, 1000)
    }
})
// Caught something shiny
sprites.onOverlap(SpriteKind.Player, SpriteKind.Shiny, function (sprite, otherSprite) {
    info.changeScoreBy(1)
    otherSprite.destroy(effects.warmRadial, 100)
})
let crow: Sprite = null
let protectedUntil = 0
// ===== MISSION 2 =====
// Choose relaxed, busy or tricky. Predict, change ONE number, then test.
let dropEvery = 2500
let fallSpeed = 15
// ===== MISSION 1: change this colour =====
scene.setBackgroundColor(12)
// ===== MISSION 1: recolour this bucket; keep some solid pixels =====
let player2 = sprites.create(img`
    . . . . . f f f f f f . . . . . 
    . . . f f . . . . . . f f . . . 
    . . f . . . . . . . . . . f . . 
    . f f f f f f f f f f f f f f . 
    . f 1 1 1 1 1 1 1 1 1 1 6 6 f . 
    . f 1 9 9 9 9 9 9 9 9 9 6 6 f . 
    . f 1 9 9 9 9 9 9 9 9 9 6 6 f . 
    . . f 1 9 9 9 9 9 9 9 6 6 f . . 
    . . f 1 6 6 6 6 6 6 6 6 6 f . . 
    . . f 1 9 9 9 9 9 9 9 6 6 f . . 
    . . . f 1 9 9 9 9 9 6 6 f . . . 
    . . . f 1 9 9 9 9 9 6 6 f . . . 
    . . . f 1 9 9 9 9 9 6 6 f . . . 
    . . . . f 1 9 9 9 6 6 f . . . . 
    . . . . f f f f f f f f . . . . 
    . . . . . . . . . . . . . . . . 
    `, SpriteKind.Player)
player2.setPosition(80, 96)
player2.setStayInScreen(true)
controller.moveSprite(player2, 110, 0)
info.setScore(0)
info.setLife(3)
// The shiny things the crow stole. Draw another one to add it to the game.
let loot = [
img`
    . . f f f f . . 
    . f 5 5 5 5 f . 
    f 5 5 1 5 5 5 f 
    f 5 1 5 5 4 5 f 
    f 5 5 4 5 4 5 f 
    f 5 5 5 4 5 5 f 
    . f 5 4 4 5 5 . 
    . . f f f f . . 
    `,
img`
    . . f f f . . . 
    . f 1 1 b f . . 
    . f b . b f . . 
    . . f b f . . . 
    . . . b f . . . 
    . . . b f f . . 
    . . . b f . . . 
    . . . b f f . . 
    `,
img`
    . f f f f f f . 
    f 9 1 1 1 1 9 f 
    f 9 9 1 1 9 9 f 
    . f 9 9 9 9 f . 
    . f 6 6 6 6 f . 
    . . f 6 6 f . . 
    . . f 6 6 f . . 
    . . . f f . . . 
    `,
img`
    . . f b b f . . 
    . f f f f f f . 
    f 1 1 1 1 1 1 f 
    f 1 1 f f 1 1 f 
    f 1 1 1 f 1 1 f 
    f 1 1 1 1 1 1 f 
    . f f f f f f . 
    . . f b b f . . 
    `
]
let crowFrames = [img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . f . . . . . . 
    . . . . . . . . f 1 f . . . . . 
    . . . . . . . f 1 1 f . . . . . 
    . f . . . . f 1 1 1 f f f . . . 
    f 1 f . f f f 1 1 1 1 1 1 f . . 
    f 1 1 f 1 1 1 1 1 1 1 1 1 4 f . 
    f 1 1 1 1 1 1 1 1 1 1 1 2 4 4 f 
    . f 1 1 1 1 1 1 1 1 1 1 1 4 4 4 
    f 1 1 1 1 1 1 1 1 1 1 1 1 4 f f 
    f 1 1 f b b b b b b b f f f . . 
    . f f . f f f f f f f . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    `, img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . f . . . . . . . . f f f . . . 
    f 1 f . f f f f f f 1 1 1 f . . 
    f 1 1 f 1 1 1 1 1 1 1 1 1 4 f . 
    f 1 1 1 1 1 1 1 1 1 1 1 2 4 4 f 
    . f 1 1 1 1 1 1 1 1 1 1 1 4 4 4 
    f 1 1 1 1 1 1 1 1 1 1 1 1 4 f f 
    f 1 1 f b b b b b b b f f f . . 
    . f f . f b b b f f f . . . . . 
    . . . . . f 1 1 f . . . . . . . 
    . . . . . f 1 f . . . . . . . . 
    . . . . . . f . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    `]
let ground = sprites.create(img`
@@GROUND@@`, SpriteKind.Scenery)
ground.setPosition(80, 100)
ground.z = -1
// A nearby first catch helps new players get started.
let shiny = sprites.create(loot[0], SpriteKind.Shiny)
shiny.setPosition(80, 72)
shiny.setVelocity(0, fallSpeed)
shiny.setFlag(SpriteFlag.AutoDestroy, true)
// Drop the loot out of the nest
game.onUpdateInterval(dropEvery, function () {
    shiny = sprites.create(loot._pickRandom(), SpriteKind.Shiny)
    shiny.setPosition(randint(10, 150), 0)
    shiny.setVelocity(0, fallSpeed)
    shiny.setFlag(SpriteFlag.AutoDestroy, true)
})
// ===== MISSION 4: copy this whole event to add a stream of crows =====
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
