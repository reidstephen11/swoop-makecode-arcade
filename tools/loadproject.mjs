import { chromium } from 'playwright'
import fs from 'fs'
fs.mkdirSync('shots', { recursive: true })

const files = {
  'main.blocks': fs.readFileSync('main.blocks', 'utf8'),
  'main.ts': fs.readFileSync('main.ts', 'utf8'),
  'pxt.json': fs.readFileSync('pxt.json', 'utf8'),
  'README.md': fs.readFileSync('README.md', 'utf8'),
  'assets.json': fs.readFileSync('assets.json', 'utf8'),
}
const browser = await chromium.launch({ args: ['--disable-background-timer-throttling','--disable-renderer-backgrounding'] })
const ctx = await browser.newContext({ viewport: { width: 1500, height: 950 } })
const page = await ctx.newPage()
await page.goto('https://arcade.makecode.com/#editor', { waitUntil: 'domcontentloaded', timeout: 120000 })
await page.waitForTimeout(14000)
const res = await page.evaluate(async f => {
  const DB = '__pxt_idb_workspace_arcade___default'
  const db = await new Promise(r => { const q = indexedDB.open(DB); q.onsuccess = () => r(q.result) })
  const get = s => new Promise(r => { const q = db.transaction(s).objectStore(s).getAll(); q.onsuccess = () => r(q.result) })
  const txt = (await get('texts'))[0]
  const hdr = (await get('headers'))[0]
  txt.files = f
  hdr.name = 'SWOOP'; hdr.editor = 'blocksprj'; hdr.modificationTime = Math.floor(Date.now()/1000)
  await new Promise(r => { const t = db.transaction(['texts','headers'],'readwrite'); t.objectStore('texts').put(txt); t.objectStore('headers').put(hdr); t.oncomplete = r })
  return { id: txt.id, hdr: Object.keys(hdr) }
}, files)
console.log('injected', JSON.stringify(res.id))
await page.reload({ waitUntil: 'domcontentloaded' })
await page.waitForTimeout(20000)
await page.screenshot({ path: 'shots/open-01.png' })
const tab = await page.evaluate(() => {
  const t = [...document.querySelectorAll('div,button,span')].filter(e => e.className && String(e.className).includes('item') && ['Blocks','JavaScript'].includes(e.textContent.trim()))
  return t.map(e => e.textContent.trim() + ':' + (String(e.className).includes('active') ? 'ACTIVE' : '-'))
})
console.log('TABS', JSON.stringify(tab))
await page.evaluate(() => { const b=[...document.querySelectorAll('button,[role=button]')].find(e=>/zoom.*fit|fit.*screen/i.test(e.getAttribute('aria-label')||'')); if(b) b.click() })
await page.keyboard.press('Control+Minus').catch(()=>{})
await page.waitForTimeout(1500)
await page.screenshot({ path: 'shots/open-fit.png' })
await browser.close()
