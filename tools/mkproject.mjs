import { chromium } from 'playwright'
import fs from 'fs'
fs.mkdirSync('shots', { recursive: true })

const code = fs.readFileSync('main.ts', 'utf8')
const browser = await chromium.launch({ args: ['--disable-background-timer-throttling','--disable-renderer-backgrounding'] })
const ctx = await browser.newContext({ viewport: { width: 1500, height: 950 }, acceptDownloads: true })
const page = await ctx.newPage()
await page.goto('https://arcade.makecode.com/#editor', { waitUntil: 'domcontentloaded', timeout: 120000 })
await page.waitForTimeout(14000)
const clickTab = name => page.evaluate(n => {
  const el = [...document.querySelectorAll('div,button,span')].find(e => e.className && String(e.className).includes('item') && e.textContent.trim() === n)
  if (!el) throw new Error('no tab ' + n); el.click()
}, name)
await clickTab('JavaScript')
await page.waitForTimeout(8000)
await page.evaluate(src => {
  const m = window.monaco.editor.getModels().find(x => /main\.ts$/.test(x.uri.path)) || window.monaco.editor.getModels()[0]
  m.setValue(src)
}, code)
await page.waitForTimeout(6000)
await clickTab('Blocks')
await page.waitForTimeout(15000)
// name the project
const nameBox = page.locator('input.ui.input, #fileNameInput, input[placeholder="Untitled"]').first()
try { await nameBox.fill('SWOOP'); await nameBox.press('Enter') } catch (e) { console.log('name fail', e.message) }
await page.waitForTimeout(2000)
// tidy the workspace via the canvas context menu
await page.mouse.click(1200, 700, { button: 'right' })
await page.waitForTimeout(1500)
const menu = await page.evaluate(() => [...document.querySelectorAll('.blocklyMenuItem, .goog-menuitem, [role=menuitem]')].map(e => e.textContent.trim()))
console.log('CTXMENU:', JSON.stringify(menu))
const tidy = menu.find(m => /clean|format|tidy|arrange/i.test(m))
if (tidy) {
  await page.evaluate(t => { const el=[...document.querySelectorAll('.blocklyMenuItem, .goog-menuitem, [role=menuitem]')].find(e=>e.textContent.trim()===t); el.click() }, tidy)
  console.log('applied:', tidy)
  await page.waitForTimeout(3000)
} else { await page.keyboard.press('Escape') }
await page.screenshot({ path: 'shots/ed-tidy.png' })
const dump = await page.evaluate(async () => {
  const db = await new Promise(r => { const q = indexedDB.open('__pxt_idb_workspace_arcade___default'); q.onsuccess = () => r(q.result) })
  const rec = await new Promise(r => { const q = db.transaction('texts').objectStore('texts').getAll(); q.onsuccess = () => r(q.result) })
  return rec
})
fs.writeFileSync('editor-project.json', JSON.stringify(dump, null, 1))
console.log('RECORDS:', dump.length, 'files:', Object.keys(dump[0] && dump[0].files || dump[0] || {}))
await browser.close()
process.exit(0)
