import {chromium} from 'playwright';import fs from 'fs';
fs.mkdirSync('evidence',{recursive:true});
const browser=await chromium.launch({args:['--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows','--autoplay-policy=no-user-gesture-required']});
const unusedCases=[['starter','idle',60],['starter','left',30],['starter','bot',60],['m2','bot',60],['m3','bot',40],['m4','bot',60],['combined','bot',40],['right','bot',20],['m5','bot',35],['zero','bot',12],['fast','bot',15],['white','bot',12],['doublehit','doublehit',4],['blank','bot',12],['countdown','idle',7],['fifth','bot',15]];
const cases=[['starter','bot',60],['m2','bot',60],['m3','bot',40],['combined','bot',40]];
async function run([variant,mode,seconds],index){
 const name=`${String(index+1).padStart(2,'0')}-${variant}-${mode}`;const c=await browser.newContext({viewport:{width:1000,height:760}});const p=await c.newPage();const logs=[],errors=[],states=[];let last={};
 p.on('console',m=>{let s=m.text().replace(/^l>/,'').trim();if(s.startsWith('QA ')){logs.push(s);const vals=Object.fromEntries([...s.matchAll(/(\w+)=([-\d.]+)/g)].map(x=>[x[1],+x[2]]));last=vals;}});p.on('pageerror',e=>errors.push(e.message));
 await p.route('**/binary.js',r=>r.fulfill({contentType:'text/javascript',body:fs.readFileSync(`variants/${variant}.js`,'utf8')}));
 await p.goto('http://127.0.0.1:7788');await p.waitForFunction(()=>document.querySelector('#simframe')?.contentWindow?.pxsim?.runtime?.running,null,{timeout:30000});
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
   let tx=player.x; let best=Infinity;
   const goal=target?.x??player.x;
   for(let candidate=8;candidate<=152;candidate+=4){
    let cost=Math.abs(candidate-goal)+Math.abs(candidate-player.x)*.12;
    for(let t=.05;t<=1.5;t+=.1){
     const futureX=player.x+Math.sign(candidate-player.x)*Math.min(Math.abs(candidate-player.x),110*t);
     for(const crow of crows){const cx=crow.x+crow.vx*t,cy=crow.y+crow.vy*t;if(cy>80&&cy<111&&Math.abs(cx-futureX)<19)cost+=10000/(1+t);}
    }
    if(cost<best){best=cost;tx=candidate;}
   }
   if(Math.abs(tx-player.x)>2)dir=Math.sign(tx-player.x);
  }
  w.pxsim.runtime.board.setButton(1,dir<0);w.pxsim.runtime.board.setButton(3,dir>0);
  if(mode==='doublehit'&&elapsed>1&&!injected)w.pxsim.runtime.board.setButton(5,true);
  return {player,loot:loot.length,crows:crows.length,millis:scene._millis,items:a};
 },{mode,elapsed:(Date.now()-start)/1000,injected});
 if(mode==='doublehit'&&Date.now()-start>1200)injected=true;
 states.push({wall:Date.now()-start,...last,...state});
 if(!shot&&Date.now()-start>Math.min(seconds*500,8000)){await p.frameLocator('#simframe').locator('#game-screen').screenshot({path:`evidence/${name}-play.png`});shot=true;}
 await p.waitForTimeout(80);
 }
 await p.frameLocator('#simframe').locator('#game-screen').screenshot({path:`evidence/${name}-end.png`});
 const firstLife=logs.map(s=>Object.fromEntries([...s.matchAll(/(\w+)=([-\d.]+)/g)].map(x=>[x[1],+x[2]]))).find(x=>x.life<3);
 const summary={name,variant,mode,seconds,firstLife,last,maxLoot:Math.max(...states.map(s=>s.loot||0)),maxCrows:Math.max(...states.map(s=>s.crows||0)),xRange:[Math.min(...states.filter(s=>s.player).map(s=>s.player.x)),Math.max(...states.filter(s=>s.player).map(s=>s.player.x))],errors};
 fs.writeFileSync(`evidence/${name}.json`,JSON.stringify({summary,logs,states},null,2));await c.close();console.log(JSON.stringify(summary));return summary;
}
const results=[];for(let i=0;i<cases.length;i+=4){const batch=await Promise.allSettled(cases.slice(i,i+4).map((x,j)=>run(x,i+j+16)));for(const r of batch){if(r.status==='fulfilled')results.push(r.value);else console.log('TEST FAILURE',r.reason);}}
fs.writeFileSync('evidence/refined-controller-results.json',JSON.stringify(results,null,2));await browser.close();
