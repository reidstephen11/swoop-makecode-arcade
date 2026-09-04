import { chromium } from 'playwright'
import fs from 'fs'
const P = process.env.SWOOP_DIR
const files = {
  'main.blocks': fs.readFileSync(P+'/main.blocks','utf8'),
  'main.ts':     fs.readFileSync(P+'/main.ts','utf8'),
  'pxt.json':    fs.readFileSync(P+'/pxt.json','utf8'),
  'README.md':   fs.readFileSync(P+'/README.md','utf8'),
  'assets.json': fs.readFileSync(P+'/assets.json','utf8'),
}
const browser = await chromium.launch({ args:['--disable-background-timer-throttling','--disable-renderer-backgrounding'] })
const ctx = await browser.newContext({ viewport:{width:1600,height:1200}, deviceScaleFactor:2 })
const page = await ctx.newPage()
await page.goto('https://arcade.makecode.com/#editor',{waitUntil:'domcontentloaded',timeout:120000})
await page.waitForTimeout(16000)
await page.evaluate(async f => {
  const db = await new Promise(r=>{const q=indexedDB.open('__pxt_idb_workspace_arcade___default'); q.onsuccess=()=>r(q.result)})
  const get = s => new Promise(r=>{const q=db.transaction(s).objectStore(s).getAll(); q.onsuccess=()=>r(q.result)})
  const txt=(await get('texts'))[0], hdr=(await get('headers'))[0]
  txt.files=f; hdr.name='SWOOP'; hdr.editor='blocksprj'; hdr.modificationTime=Math.floor(Date.now()/1000)
  await new Promise(r=>{const t=db.transaction(['texts','headers'],'readwrite'); t.objectStore('texts').put(txt); t.objectStore('headers').put(hdr); t.oncomplete=r})
}, files)
await page.reload({waitUntil:'domcontentloaded'})
await page.waitForTimeout(24000)
const info = await page.evaluate(() => {
  const c=[...document.querySelectorAll('.blocklyBlockCanvas')].filter(e=>e.getBoundingClientRect().width>4)[0]
  const tabs=[...document.querySelectorAll('div,button,span')].filter(e=>e.className&&String(e.className).includes('item')&&['Blocks','JavaScript'].includes(e.textContent.trim())).map(e=>e.textContent.trim()+':'+(String(e.className).includes('active')?'ACTIVE':'-'))
  if(!c) return {tabs, canvas:null}
  const arrays=[...c.querySelectorAll('g.blocklyDraggable')].filter(x=>/lists_create_with/.test(String(x.getAttribute('class')||''))).map(g=>{const r=g.getBoundingClientRect(); return {x:r.x,y:r.y,w:Math.round(r.width),h:Math.round(r.height)}})
  return {tabs, canvas:Math.round(c.getBoundingClientRect().width), arrays}
})
console.log(JSON.stringify(info))
const box = (info.arrays||[]).filter(b=>b.w>2).sort((a,b)=>b.w*b.h-a.w*a.h)[0]
if (box) {
  const pad=14
  const clip={x:Math.max(0,box.x-pad),y:Math.max(0,box.y-pad),width:Math.min(1600-Math.max(0,box.x-pad),box.w+2*pad),height:Math.min(1200-Math.max(0,box.y-pad),box.h+2*pad)}
  await page.screenshot({path:'out/_loot.png', clip}); console.log('loot shot', JSON.stringify(clip))
} else { await page.screenshot({path:'out/_projfull.png'}); console.log('no array block visible; full shot') }
await browser.close(); process.exit(0)
