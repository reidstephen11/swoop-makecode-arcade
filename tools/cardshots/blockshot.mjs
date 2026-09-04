import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'

const SNIP = 'snippets', OUT = 'out'
const VW = 1600, VH = 1400
fs.mkdirSync(OUT, { recursive: true })
const files = fs.readdirSync(SNIP).filter(f => f.endsWith('.ts')).sort()

const browser = await chromium.launch({ args: ['--disable-background-timer-throttling', '--disable-renderer-backgrounding'] })
const ctx = await browser.newContext({ viewport: { width: VW, height: VH }, deviceScaleFactor: 3 })
const page = await ctx.newPage()
await page.goto('https://arcade.makecode.com/#editor', { waitUntil: 'domcontentloaded', timeout: 120000 })
await page.waitForTimeout(18000)

const clickTab = name => page.evaluate(n => {
  const el = [...document.querySelectorAll('div,button,span')].find(e => e.className && String(e.className).includes('item') && e.textContent.trim() === n)
  if (!el) throw new Error('no tab ' + n); el.click()
}, name)

const canvasBox = () => page.evaluate(() => {
  const cs = [...document.querySelectorAll('.blocklyBlockCanvas')]
    .map(c => { const r = c.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height } })
    .filter(b => b.w > 4 && b.h > 4)
  if (!cs.length) return null
  cs.sort((a, b) => b.w * b.h - a.w * a.h)
  const ws = document.querySelector('.blocklyWorkspace')
  const wr = [...document.querySelectorAll('.blocklyWorkspace')].map(e => e.getBoundingClientRect()).filter(r => r.width > 100)[0]
  return { c: cs[0], ws: wr ? { x: wr.x, y: wr.y, w: wr.width, h: wr.height } : null }
})

// toolbox strip, once
const tbBox = await page.evaluate(() => {
  const t = document.querySelector('.blocklyTreeRoot')
  if (!t) return null
  const r = t.getBoundingClientRect()
  return { x: r.x, y: r.y, width: r.width, height: r.height }
})
if (tbBox) await page.screenshot({ path: path.join(OUT, '_toolbox.png'), clip: tbBox })
console.log('TOOLBOX', JSON.stringify(tbBox))

for (const f of files) {
  const src = fs.readFileSync(path.join(SNIP, f), 'utf8')
  const name = f.replace(/\.ts$/, '')
  try {
    await clickTab('JavaScript'); await page.waitForTimeout(7000)
    await page.evaluate(s => {
      const m = window.monaco.editor.getModels().find(x => /main\.ts$/.test(x.uri.path)) || window.monaco.editor.getModels()[0]
      m.setValue(s)
    }, src)
    await page.waitForTimeout(5000)
    await clickTab('Blocks'); await page.waitForTimeout(13000)

    // fit: zoom out until the block canvas sits inside the visible workspace
    for (let i = 0; i < 8; i++) {
      const b = await canvasBox()
      if (!b || !b.ws) break
      const fits = b.c.w <= b.ws.w - 40 && b.c.h <= b.ws.h - 40
      if (fits) break
      const zo = await page.evaluate(() => {
        const el = [...document.querySelectorAll('button,[role=button],div')].find(e => /zoom out/i.test(e.getAttribute('aria-label') || e.getAttribute('title') || ''))
        if (el) { el.click(); return true } return false
      })
      if (!zo) break
      await page.waitForTimeout(900)
    }
    // scroll blocks into view (top-left of workspace)
    await page.evaluate(() => {
      const el = [...document.querySelectorAll('button,[role=button],div')].find(e => /zoom.*fit|fit.*screen|reset.*zoom/i.test(e.getAttribute('aria-label') || e.getAttribute('title') || ''))
      if (el) el.click()
    })
    await page.waitForTimeout(1500)

    const b = await canvasBox()
    if (!b) { console.log('SKIP', name); continue }
    const pad = 16
    const clip = {
      x: Math.max(0, b.c.x - pad), y: Math.max(0, b.c.y - pad),
      width: Math.min(b.c.w + pad * 2, VW - Math.max(0, b.c.x - pad)),
      height: Math.min(b.c.h + pad * 2, VH - Math.max(0, b.c.y - pad)),
    }
    await page.screenshot({ path: path.join(OUT, name + '.png'), clip })
    console.log('SHOT', name, 'canvas', Math.round(b.c.w) + 'x' + Math.round(b.c.h), 'ws', b.ws && Math.round(b.ws.w) + 'x' + Math.round(b.ws.h))
  } catch (e) {
    console.log('FAIL', name, e.message)
    await page.screenshot({ path: path.join(OUT, name + '-FAIL.png') })
  }
}
await browser.close()
process.exit(0)
