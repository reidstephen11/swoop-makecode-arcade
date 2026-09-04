import { chromium } from 'playwright'
import fs from 'fs'
fs.mkdirSync('shots', { recursive: true })

const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i > -1 ? process.argv[i + 1] : d }
const has = n => process.argv.includes('--' + n)
const SECONDS = parseFloat(arg('seconds', 15))
const SHOTS = (arg('shots', '') || '').split(',').filter(Boolean).map(parseFloat)
const TAG = arg('tag', 'run')
const KEYS = arg('keys', '')   // e.g. "2:right,4:left" -> at t=2s hold right, t=4s hold left

const browser = await chromium.launch({
  args: ['--disable-background-timer-throttling', '--disable-renderer-backgrounding',
         '--disable-backgrounding-occluded-windows', '--autoplay-policy=no-user-gesture-required']
})
const ctx = await browser.newContext({ viewport: { width: 900, height: 700 }, deviceScaleFactor: 4 })
const page = await ctx.newPage()
const logs = []
page.on('console', m => { const t = m.text().replace(/^l>/, '').trim(); if (/^(TEST|CROW|ASSERT|BOOT)/.test(t)) logs.push(t) })
page.on('pageerror', e => logs.push('PAGEERROR ' + e.message))
await page.goto('http://127.0.0.1:7788', { waitUntil: 'load' })
await page.waitForFunction(() => {
  const f = document.getElementById('simframe')
  return f && f.contentWindow && f.contentWindow.pxsim && f.contentWindow.pxsim.runtime && f.contentWindow.pxsim.runtime.running
}, null, { timeout: 90000 })
const KEYMAP = { left: 1, up: 2, right: 3, down: 4, a: 5, b: 6, menu: 7 }
const press = (k, on) => page.evaluate(([k, on]) =>
  document.getElementById('simframe').contentWindow.pxsim.runtime.board.setButton(k, on), [KEYMAP[k], on])
const shot = async n => {
  await page.frameLocator('#simframe').locator('#game-screen').screenshot({ path: `shots/${TAG}-${n}.png` })
}
const t0 = Date.now()
const evts = []
for (const spec of KEYS.split(',').filter(Boolean)) {
  const [t, k] = spec.split(':'); evts.push({ t: parseFloat(t), k })
}
let held = null
const deadline = t0 + SECONDS * 1000
const shotQ = [...SHOTS]
while (Date.now() < deadline) {
  const el = (Date.now() - t0) / 1000
  while (evts.length && evts[0].t <= el) {
    const e = evts.shift()
    if (held) await press(held, false)
    held = e.k === 'none' ? null : e.k
    if (held) await press(held, true)
  }
  while (shotQ.length && shotQ[0] <= el) { const s = shotQ.shift(); await shot('t' + s) }
  await page.waitForTimeout(100)
}
if (held) await press(held, false)
await shot('end')
await browser.close()
const uniq = logs.filter((l, i) => i === 0 || l !== logs[i - 1])
console.log(uniq.join('\n'))
