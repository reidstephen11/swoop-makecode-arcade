import { chromium } from 'playwright'
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport:{width:1500,height:1000} })
const page = await ctx.newPage()
await page.goto('https://arcade.makecode.com/#editor',{waitUntil:'domcontentloaded',timeout:120000})
await page.waitForTimeout(18000)
for (const cat of ['Info','Sprites','Music','Game','Scene']) {
  const ok = await page.evaluate(c => {
    const el = [...document.querySelectorAll('.blocklyTreeRow, .blocklyTreeLabel, div')].find(e => e.textContent.trim() === c && /blocklyTree/.test(String(e.className)))
      || [...document.querySelectorAll('*')].find(e => e.children.length===0 && e.textContent.trim()===c)
    if (!el) return false; el.click(); return true
  }, cat)
  await page.waitForTimeout(2500)
  const blocks = await page.evaluate(() => {
    const f = document.querySelector('.blocklyFlyout')
    if (!f) return null
    return [...f.querySelectorAll('g.blocklyDraggable')]
      .filter(g => !g.parentElement.closest('g.blocklyDraggable'))
      .map(g => [...g.querySelectorAll('text')].map(t=>t.textContent).join(' ').replace(/\s+/g,' ').trim())
      .filter(Boolean).slice(0,30)
  })
  console.log('\n=== ' + cat + ' (' + ok + ') ===')
  ;(blocks||[]).forEach(b => console.log('  ' + b))
}
await browser.close(); process.exit(0)
