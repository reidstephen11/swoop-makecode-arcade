import fs from 'fs';import {execFileSync} from 'child_process';
const base=fs.readFileSync('main.ts','utf8');fs.mkdirSync('variants',{recursive:true});
const m2=base.replace('dropEvery = 2500','dropEvery = 700').replace('fallSpeed = 15','fallSpeed = 60');
const win='\ninfo.onScore(15, function () {game.over(true)})\n';
const crow=base.slice(base.indexOf('game.onUpdateInterval(3500'));
const probe='\ngame.onUpdateInterval(100, function () {console.log("QA t=" + game.runtime() + " score=" + info.score() + " life=" + info.life() + " px=" + player2.x + " py=" + player2.y + " loot=" + sprites.allOfKind(SpriteKind.Shiny).length + " crows=" + sprites.allOfKind(SpriteKind.Crow).length)})\n';
const protectedTest=`
control.runInParallel(function () {
 pause(300)
 let before = info.score()
 for (let i = 0; i < 2; i++) {let hit = sprites.create(crowFrames[0],SpriteKind.Crow);hit.setPosition(player2.x,player2.y)}
 pause(100)
 console.log("CHECK double life=" + info.life())
 let item = sprites.create(loot[0],SpriteKind.Shiny); item.setPosition(player2.x,player2.y)
 pause(100)
 console.log("CHECK catch gain=" + (info.score()-before) + " life=" + info.life())
 pause(400)
 let blocked = sprites.create(crowFrames[0],SpriteKind.Crow);blocked.setPosition(player2.x,player2.y)
 pause(100)
 console.log("CHECK during life=" + info.life())
 pause(400)
 let after = sprites.create(crowFrames[0],SpriteKind.Crow);after.setPosition(player2.x,player2.y)
 pause(100)
 console.log("CHECK expired life=" + info.life())
})`;
const sound='\n'+fs.readFileSync('m5-catch.ts','utf8').replace('namespace SpriteKind { export const Shiny = SpriteKind.create() }','').replace('    info.changeScoreBy(1)\n','').replace('    otherSprite.destroy(effects.warmRadial, 100)\n','');
const variants={starter:base,protection:base+protectedTest,combined:m2+win+crow.replace('3500','2000'),m5:m2+win+'\nplayer2.setScale(1.5, ScaleAnchor.Middle)\ninfo.startCountdown(60)\n'+sound,countdown:base+'\ninfo.startCountdown(3)\n'};
try {for(const [name,src] of Object.entries(variants)){fs.writeFileSync('main.ts',src+probe);execFileSync('./node_modules/.bin/makecode',['build','-j'],{stdio:'pipe'});fs.copyFileSync('built/binary.js',`variants/${name}.js`);fs.writeFileSync(`variants/${name}.ts`,src);console.log(name,'BUILD PASS')}}finally{fs.writeFileSync('main.ts',base)}
