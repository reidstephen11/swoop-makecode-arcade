namespace SpriteKind {
    export const Shiny = SpriteKind.create()
    export const Crow = SpriteKind.create()
    export const Scenery = SpriteKind.create()
}
let crow: Sprite = null
let shiny: Sprite = null

// ===== MISSION 2 =====
// These two numbers make the game boring. Change them, then play again.
let dropEvery = 2500
let fallSpeed = 15

// The shiny things the crow stole. Draw another one to add it to the game.
let loot = [
    img`
        ..ffff..
        .f5555f.
        f551555f
        f515545f
        f554545f
        f555455f
        .f54455.
        ..ffff..
    `,
    img`
        ..fff...
        .f11bf..
        .fb.bf..
        ..fbf...
        ...bf...
        ...bff..
        ...bf...
        ...bff..
    `,
    img`
        .ffffff.
        f911119f
        f991199f
        .f9999f.
        .f6666f.
        ..f66f..
        ..f66f..
        ...ff...
    `,
    img`
        ..fbbf..
        .ffffff.
        f111111f
        f11ff11f
        f111f11f
        f111111f
        .ffffff.
        ..fbbf..
    `
]
let crowFrames = [
    img`
        ................
        .........f......
        ........f1f.....
        .......f11f.....
        .f....f111fff...
        f1f.fff111111f..
        f11f1111111114f.
        f11111111111244f
        .f11111111111444
        f1111111111114ff
        f11fbbbbbbbfff..
        .ff.fffffff.....
        ................
        ................
        ................
        ................
    `,
    img`
        ................
        ................
        ................
        ................
        .f........fff...
        f1f.ffffff111f..
        f11f1111111114f.
        f11111111111244f
        .f11111111111444
        f1111111111114ff
        f11fbbbbbbbfff..
        .ff.fbbbfff.....
        .....f11f.......
        .....f1f........
        ......f.........
        ................
    `
]

// ===== MISSION 1: change this colour =====
scene.setBackgroundColor(12)

let ground = sprites.create(img`
@@GROUND@@`, SpriteKind.Scenery)
ground.setPosition(80, 100)

// ===== MISSION 1: redraw this bucket =====
let player = sprites.create(img`
        .....ffffff.....
        ...ff......ff...
        ..f..........f..
        .ffffffffffffff.
        .f111111111166f.
        .f199999999966f.
        .f199999999966f.
        ..f1999999966f..
        ..f1666666666f..
        ..f1999999966f..
        ...f19999966f...
        ...f19999966f...
        ...f19999966f...
        ....f199966f....
        ....ffffffff....
        ................
    `, SpriteKind.Player)
player.setPosition(80, 96)
player.setStayInScreen(true)
controller.moveSprite(player, 110, 0)
info.setScore(0)
info.setLife(3)

// Caught something shiny
sprites.onOverlap(SpriteKind.Player, SpriteKind.Shiny, function (sprite, otherSprite) {
    info.changeScoreBy(1)
    otherSprite.destroy(effects.warmRadial, 100)
})

// Swooped!
sprites.onOverlap(SpriteKind.Player, SpriteKind.Crow, function (sprite, otherSprite) {
    info.changeLifeBy(-1)
    otherSprite.destroy(effects.spray, 200)
    scene.cameraShake(4, 500)
})

// Drop the loot out of the nest
game.onUpdateInterval(dropEvery, function () {
    shiny = sprites.create(loot._pickRandom(), SpriteKind.Shiny)
    shiny.setPosition(randint(10, 150), 0)
    shiny.setVelocity(0, fallSpeed)
    shiny.setFlag(SpriteFlag.AutoDestroy, true)
})

// ===== MISSION 4: copy this whole block to add a second crow =====
game.onUpdateInterval(3500, function () {
    crow = sprites.create(crowFrames[0], SpriteKind.Crow)
    crow.setPosition(-6, randint(18, 72))
    crow.setVelocity(72, 16)
    crow.setFlag(SpriteFlag.AutoDestroy, true)
    animation.runImageAnimation(crow, crowFrames, 140, true)
})
