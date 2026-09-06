import {chromium} from 'playwright';import fs from 'fs';
fs.mkdirSync('evidence',{recursive:true});
const browser=await chromium.launch({args:['--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows','--autoplay-policy=no-user-gesture-required']});
const binaries=Object.fromEntries(['starter','protection','combined','m5','countdown'].map(name=>[name,fs.readFileSync(`variants/${name}.js`,'utf8')]));
const cases=[['starter','idle',3],['protection','idle',2],['combined','bot',35],['m5','bot',35],['countdown','idle',6]];
async function run([variant,mode,seconds],index){
 const name=`${String(index+1).padStart(2,'0')}-${variant}-${mode}`;const c=await browser.newContext({viewport:{width:1000,height:760}});const p=await c.newPage();const logs=[],errors=[],states=[];let last={};
 p.on('console',m=>{let s=m.text().replace(/^l>/,'').trim();if(s.startsWith('CHECK ')) logs.push(s);if(s.startsWith('QA ')){logs.push(s);const vals=Object.fromEntries([...s.matchAll(/(\w+)=([-\d.]+)/g)].map(x=>[x[1],+x[2]]));last=vals;}});p.on('pageerror',e=>errors.push(e.message));
 await p.route('**/binary.js',r=>r.fulfill({contentType:'text/javascript',body:binaries[variant]}));
 await p.goto('http://127.0.0.1:7790');await p.waitForFunction(()=>document.querySelector('#simframe')?.contentWindow?.pxsim?.runtime?.running,null,{timeout:30000});
 const start=Date.now();let injected=false;let shot=false;
 while(Date.now()-start<seconds*1000){
 const state=await p.evaluate(({mode,elapsed,injected})=>{
  const w=document.querySelector('#simframe').contentWindow;const g=w.pxsim.runtime.globals;const scene=Object.values(g).find(v=>v?.fields?.allSprites)?.fields;if(!scene)return {};
  const items=scene.allSprites.data.map(s=>s.fields).filter(Boolean);const s=items.find(x=>x._kind===1000);if(!s)return {};
  const pos=x=>({id:x.id,kind:x._kind,x:(x._x+x._width/2)/256,y:(x._y+x._height/2)/256,vx:x._vx/256,vy:x._vy/256,w:x._width/256,h:x._height/256,flags:x.flags});
  const a=items.map(pos);const player=pos(s);const loot=a.filter(x=>x.kind===1003);const crows=a.filter(x=>x.kind===1004);let dir=0;
  if(mode==='left')dir=-1;
  if(mode==='bot'){
   const target=loot.filter(x=>x.vy>0&&x.y<104).map(x=>({...x,t:(89-x.y)/x.vy})).filter(x=>x.t>=-.05&&Math.abs(x.x-player.x)/110<=x.t+.13).sort((a,b)=>a.t-b.t)[0];
   let tx=target?.x??player.x;
   const danger=crows.find(x=>x.y<108&&x.y>73&&Math.abs((x.x+x.vx*.18)-player.x)<22);
   if(danger){const away=player.x>danger.x?1:-1;tx=Math.max(8,Math.min(152,player.x+away*35));}
   if(Math.abs(tx-player.x)>2)dir=Math.sign(tx-player.x);
  }
  w.pxsim.runtime.board.setButton(1,dir<0);w.pxsim.runtime.board.setButton(3,dir>0);
  if(mode==='doublehit'&&elapsed>1&&!injected)w.pxsim.runtime.board.setButton(5,true);
  return {player,loot:loot.length,crows:crows.length,millis:scene._millis,items:a};
 },{mode,elapsed:(Date.now()-start)/1000,injected});
 if(mode==='doublehit'&&Date.now()-start>1200)injected=true;
 states.push({wall:Date.now()-start,...last,...state});
 if(!shot&&Date.now()-start>(variant==='protection'?550:Math.min(seconds*500,8000))){await p.frameLocator('#simframe').locator('#game-screen').screenshot({path:`evidence/${name}-play.png`});shot=true;}
 await p.waitForTimeout(80);
 }
 await p.frameLocator('#simframe').locator('#game-screen').screenshot({path:`evidence/${name}-end.png`});
 const firstLife=logs.map(s=>Object.fromEntries([...s.matchAll(/(\w+)=([-\d.]+)/g)].map(x=>[x[1],+x[2]]))).find(x=>x.life<3);
 const checks=logs.filter(s=>s.startsWith('CHECK '));if(variant==='protection'){for(const expected of ['CHECK double life=2','CHECK catch gain=1 life=2','CHECK during life=2','CHECK expired life=1'])if(!checks.includes(expected))throw new Error('Missing '+expected+'; '+checks.join('; '));}
 const summary={checks,name,variant,mode,seconds,firstLife,last,maxLoot:Math.max(...states.map(s=>s.loot||0)),maxCrows:Math.max(...states.map(s=>s.crows||0)),xRange:[Math.min(...states.filter(s=>s.player).map(s=>s.player.x)),Math.max(...states.filter(s=>s.player).map(s=>s.player.x))],errors};
 fs.writeFileSync(`evidence/${name}.json`,JSON.stringify({summary,logs,states},null,2));await c.close();console.log(JSON.stringify(summary));return summary;
}
const results=[];for(let i=0;i<cases.length;i+=2){const batch=await Promise.allSettled(cases.slice(i,i+2).map((x,j)=>run(x,i+j)));for(const r of batch){if(r.status==='fulfilled')results.push(r.value);else {process.exitCode=1;console.log('TEST FAILURE',r.reason)};}}
fs.writeFileSync('evidence/results.json',JSON.stringify(results,null,2));await browser.close();
