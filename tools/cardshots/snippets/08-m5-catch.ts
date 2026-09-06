namespace SpriteKind { export const Shiny = SpriteKind.create() }
sprites.onOverlap(SpriteKind.Player, SpriteKind.Shiny, function (sprite, otherSprite) {
    info.changeScoreBy(1)
    otherSprite.destroy(effects.warmRadial, 100)
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
})
