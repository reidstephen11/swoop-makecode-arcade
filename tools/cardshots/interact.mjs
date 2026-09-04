import { chromium } from 'playwright'
import fs from 'fs'
const OUT='out', VW=1600, VH=1200
const browser = await chromium.launch({ args:['--disable-background-timer-throttling','--disable-renderer-backgrounding'] })
const ctx = await browser.newContext({ viewport:{width:VW,height:VH}, deviceScaleFactor:2 })
const page = await ctx.newPage()
await page.goto('https://arcade.makecode.com/#editor',{waitUntil:'domcontentloaded',timeout:120000})
await page.waitForTimeout(18000)
const clickTab = n => page.evaluate(t=>{const el=[...document.querySelectorAll('div,button,span')].find(e=>e.className&&String(e.className).includes('item')&&e.textContent.trim()===t); if(!el)throw new Error('no tab'+t); el.click()},n)
const load = async src => { await clickTab('JavaScript'); await page.waitForTimeout(7000)
  await page.evaluate(s=>{const m=window.monaco.editor.getModels().find(x=>/main\.ts$/.test(x.uri.path))||window.monaco.editor.getModels()[0]; m.setValue(s)},src)
  await page.waitForTimeout(5000); await clickTab('Blocks'); await page.waitForTimeout(13000) }
const canvasBox = () => page.evaluate(()=>{const c=[...document.querySelectorAll('.blocklyBlockCanvas')].filter(e=>e.getBoundingClientRect().width>4)[0]; const r=c.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height}})

// duplicate menu
await load(fs.readFileSync('snippets/05-m4-crow.ts','utf8'))
const box = await canvasBox()
await page.mouse.click(box.x+60, box.y+18, {button:'right'})
await page.waitForTimeout(2200)
const menu = await page.evaluate(()=>{
  const m = document.querySelector('.blocklyWidgetDiv .blocklyMenu, .blocklyWidgetDiv [role=menu], .blocklyMenu')
  if(!m) return null
  const r = m.getBoundingClientRect()
  return {x:r.x,y:r.y,w:r.width,h:r.height, labels:[...m.querySelectorAll('.blocklyMenuItem,[role=menuitem]')].map(e=>e.textContent.trim())}
})
console.log('MENU2', JSON.stringify(menu))
if (menu){
  const pad=18
  const x0=Math.max(0,box.x-pad), y0=Math.max(0,box.y-pad)
  const x1=Math.min(VW, Math.max(menu.x+menu.w, box.x+box.w)+pad)
  const y1=Math.min(VH, Math.max(menu.y+menu.h, box.y+box.h)+pad)
  await page.screenshot({path:OUT+'/_duplicate-menu.png', clip:{x:x0,y:y0,width:x1-x0,height:y1-y0}})
  console.log('dup shot')
}
await page.keyboard.press('Escape'); await page.waitForTimeout(1000)

// colour picker
await load(fs.readFileSync('snippets/01-m1-sky.ts','utf8'))
const sw = await page.evaluate(()=>{
  const c=[...document.querySelectorAll('.blocklyBlockCanvas')].filter(e=>e.getBoundingClientRect().width>4)[0]
  const g=[...c.querySelectorAll('g')].find(e=>/colorindexpicker/.test(String(e.getAttribute('class')||'')))
  if(!g) return null; const r=g.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height}
})
console.log('SWATCH', JSON.stringify(sw))
if(sw){
  const cb = await canvasBox()
  await page.mouse.click(sw.x+sw.w/2, sw.y+sw.h/2)
  await page.waitForTimeout(2500)
  const pal = await page.evaluate(()=>{const m=document.querySelector('.blocklyWidgetDiv .blocklyDropDownDiv, .blocklyDropDownDiv'); if(!m)return null; const r=m.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height}})
  console.log('PALETTE', JSON.stringify(pal))
  const pad=18
  const x0=Math.max(0,cb.x-pad), y0=Math.max(0,cb.y-pad)
  const x1=Math.min(VW,(pal?Math.max(pal.x+pal.w,cb.x+cb.w):cb.x+cb.w)+pad)
  const y1=Math.min(VH,(pal?Math.max(pal.y+pal.h,cb.y+cb.h):cb.y+cb.h)+pad)
  await page.screenshot({path:OUT+'/_colour-picker.png', clip:{x:x0,y:y0,width:x1-x0,height:y1-y0}})
  console.log('colour shot')
}
await browser.close(); process.exit(0)
