import {chromium} from 'playwright';import fs from 'fs';
const browser=await chromium.launch({args:['--disable-background-timer-throttling','--disable-renderer-backgrounding']});
async function read(page){return page.evaluate(async()=>{const db=await new Promise(r=>{const q=indexedDB.open('__pxt_idb_workspace_arcade___default');q.onsuccess=()=>r(q.result)});return new Promise(r=>{const q=db.transaction('texts').objectStore('texts').getAll();q.onsuccess=()=>r(q.result)})})}
async function reopen(file,label){
 const context=await browser.newContext({viewport:{width:1366,height:768},acceptDownloads:true});const page=await context.newPage();
 await page.goto('https://arcade.makecode.com/',{waitUntil:'domcontentloaded',timeout:120000});await page.waitForTimeout(9000);
 await page.getByText('Import',{exact:true}).first().click();await page.waitForTimeout(700);await page.getByText('Import File...', {exact:true}).click();await page.waitForTimeout(700);
 console.log('IMPORT UI',await page.locator('input,button,[role=button]').evaluateAll(es=>es.map(e=>({text:e.textContent.slice(0,70),label:e.getAttribute('aria-label'),type:e.getAttribute('type')})).filter(e=>e.type==='file'||/import|go ahead/i.test(JSON.stringify(e)))));
 await page.locator('input[type=file]').setInputFiles(file);await page.getByRole('button',{name:/go ahead/i}).click();await page.waitForTimeout(14000);
 const records=await read(page);const rec=records.find(r=>r.files?.['main.ts']?.includes('protectedUntil'));if(!rec)throw new Error('Imported code missing');
 for(const required of ['ground.z = -1','sprite.sayText("SAFE", 1000, false)','sprite.startEffect(effects.coolRadial, 1000)','controller.moveSprite(player2, 110, 0)','otherSprite.destroy(effects.warmRadial, 100)']) if(!rec.files['main.ts'].includes(required)) throw new Error('Roundtrip lost: '+required);
 if(/typescript_statement|typescript_expression/.test(rec.files['main.blocks']))throw new Error('Unsupported blocks');
 if(label==='starter' && rec.files['main.ts']!==fs.readFileSync('main.ts','utf8')) throw new Error('Starter source changed on import');
 if(label==='checkpoint'&&(!rec.files['main.ts'].includes('info.onScore(15')||!rec.files['main.ts'].includes('dropEvery = 700')))throw new Error('Checkpoint changes lost');
 await page.screenshot({path:`shots/reopened-${label}.png`});fs.writeFileSync(`reopened-${label}.json`,JSON.stringify(rec.files,null,2));console.log('REOPEN PASS',label);
 return {context,page};
}
const starter=await reopen('SWOOP-starter.png','starter');
const files=Object.fromEntries(['main.ts','main.blocks','pxt.json','README.md','assets.json'].map(f=>[f,fs.readFileSync('checkpoint/'+f,'utf8')]));
await starter.page.evaluate(async files=>{const db=await new Promise(r=>{const q=indexedDB.open('__pxt_idb_workspace_arcade___default');q.onsuccess=()=>r(q.result)});const get=s=>new Promise(r=>{const q=db.transaction(s).objectStore(s).getAll();q.onsuccess=()=>r(q.result)});const txt=(await get('texts'))[0],hdr=(await get('headers'))[0];txt.files=files;hdr.name='SWOOP - checkpoint';hdr.editor='blocksprj';await new Promise(r=>{const t=db.transaction(['texts','headers'],'readwrite');t.objectStore('texts').put(txt);t.objectStore('headers').put(hdr);t.oncomplete=r})},files);
await starter.page.reload({waitUntil:'domcontentloaded'});await starter.page.waitForTimeout(13000);
const dlp=starter.page.waitForEvent('download',{timeout:60000});await starter.page.getByRole('button',{name:'Save the project',exact:true}).click();await(await dlp).saveAs('SWOOP-checkpoint.png');await starter.context.close();
await reopen('SWOOP-checkpoint.png','checkpoint');await browser.close();
