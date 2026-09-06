import fs from 'fs';
import {execFileSync} from 'child_process';
const base=fs.readFileSync('main.ts','utf8'); fs.writeFileSync('original.ts',base); fs.mkdirSync('variants',{recursive:true});
const m2=base.replace('dropEvery = 2500','dropEvery = 700').replace('fallSpeed = 15','fallSpeed = 60');
const m3='\ninfo.onScore(15, function () { game.over(true) })\n';
const crow=base.slice(base.indexOf('game.onUpdateInterval(3500'));
const m4='\n'+crow.replace('3500','2000');
const probe=`\ngame.onUpdateInterval(100, function () {console.log("QA t=" + game.runtime() + " score=" + info.score() + " life=" + info.life() + " px=" + player2.x + " py=" + player2.y + " loot=" + sprites.allOfKind(SpriteKind.Shiny).length + " crows=" + sprites.allOfKind(SpriteKind.Crow).length)})\n`;
const collision=`\ncontroller.A.onEvent(ControllerButtonEvent.Pressed, function () { for(let i=0;i<2;i++){let testCrow=sprites.create(crowFrames[0],SpriteKind.Crow); testCrow.setPosition(player2.x,player2.y)} })\n`;
const variants={starter:base,m2,m3:m2+m3,m4:m2+m4,combined:m2+m3+m4,right:m2+m4.replace('setPosition(-6','setPosition(166').replace('setVelocity(72','setVelocity(-72'),m5:m2+m3+'\nplayer2.setScale(1.5, ScaleAnchor.Middle)\ninfo.startCountdown(60)\n'+`sprites.onOverlap(SpriteKind.Player,SpriteKind.Shiny,function (sprite,otherSprite) {music.play(music.createSoundEffect(WaveShape.Sine,400,1200,255,0,100,SoundExpressionEffect.None,InterpolationCurve.Linear),music.PlaybackMode.InBackground)})`,zero:m2.replace('dropEvery = 700','dropEvery = 0'),fast:m2.replace('fallSpeed = 60','fallSpeed = 500'),white:m2.replace('setBackgroundColor(12)','setBackgroundColor(1)'),doublehit:base+collision,blank:m2.replace(/(let player2 = sprites.create\()img`[\s\S]*?`/,'$1image.create(16,16)'),countdown:m2+'\ninfo.startCountdown(3)\n',fifth:m2+'\nloot.push(img`\n. 3 3 .\n3 3 3 3\n. 3 3 .\n. . 3 .\n`)\n'};
for(const [name,src] of Object.entries(variants)) {
 fs.writeFileSync('main.ts',src+probe);
 try {const out=execFileSync('./node_modules/.bin/makecode',['build','-j'],{encoding:'utf8'}); fs.copyFileSync('built/binary.js',`variants/${name}.js`); fs.writeFileSync(`variants/${name}.ts`,src); console.log(name,'BUILD PASS');}catch(e){console.log(name,'FAIL',String(e.stdout),String(e.stderr));}
}
fs.writeFileSync('main.ts',base);
