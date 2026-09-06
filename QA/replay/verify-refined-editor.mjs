import {chromium} from 'playwright';import fs from 'fs';
const browser=await chromium.launch({args:['--disable-background-timer-throttling','--disable-renderer-backgrounding']});
const context=await browser.newContext({viewport:{width:1366,height:768},acceptDownloads:true});const page=await context.newPage();
await page.goto('https://arcade.makecode.com/#editor',{waitUntil:'domcontentloaded',timeout:120000});await page.waitForTimeout(14000);
const files=Object.fromEntries(['main.blocks','main.ts','pxt.json','README.md','assets.json'].map(f=>[f,fs.readFileSync(f,'utf8')]));
await page.evaluate(async files=>{const db=await new Promise(r=>{const q=indexedDB.open('__pxt_idb_workspace_arcade___default');q.onsuccess=()=>r(q.result)});const get=s=>new Promise(r=>{const q=db.transaction(s).objectStore(s).getAll();q.onsuccess=()=>r(q.result)});const txt=(await get('texts'))[0],hdr=(await get('headers'))[0];txt.files=files;hdr.name='SWOOP';hdr.editor='blocksprj';await new Promise(r=>{const t=db.transaction(['texts','headers'],'readwrite');t.objectStore('texts').put(txt);t.objectStore('headers').put(hdr);t.oncomplete=r})},files);
await page.reload({waitUntil:'domcontentloaded'});await page.waitForTimeout(15000);await page.screenshot({path:'shots/revised-opening.png'});
const bounds=await page.evaluate(()=>[...document.querySelectorAll('.blocklyBlockCanvas')].filter(e=>e.getBoundingClientRect().width>0).flatMap(e=>[...e.children].filter(e=>e.tagName.toLowerCase()==='g').map(e=>({text:e.textContent.slice(0,100),rect:e.getBoundingClientRect().toJSON()}))));fs.writeFileSync('editor-bounds.json',JSON.stringify(bounds,null,2));
for(let i=0;i<bounds.length;i++)for(let j=i+1;j<bounds.length;j++){const a=bounds[i].rect,b=bounds[j].rect;if(a.left<b.right&&b.left<a.right&&a.top<b.bottom&&b.top<a.bottom)throw new Error('Event stacks overlap: '+i+','+j)}
console.log('BOUNDS',JSON.stringify(bounds));
console.log('SAVE',await page.locator('button, input, [role=button]').evaluateAll(es=>es.map(e=>({tag:e.tagName,text:e.textContent.slice(0,80),label:e.getAttribute('aria-label'),title:e.getAttribute('title'),type:e.getAttribute('type')})).filter(e=>/save|project|download|name/i.test(JSON.stringify(e)))));
const save=page.getByRole('button',{name:/save the project/i}).first();
const dlPromise=page.waitForEvent('download',{timeout:20000});await save.click();const dl=await dlPromise;await dl.saveAs('SWOOP-starter.png');console.log('EXPORTED',dl.suggestedFilename());
await browser.close();
