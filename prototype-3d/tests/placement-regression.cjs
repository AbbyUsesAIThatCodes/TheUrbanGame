const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=path.join(root,'test-output');
const report={url:'http://127.0.0.1:8770/',checks:[],errors:[],failedRequests:[]};
const pass=name=>{report.checks.push(name);console.log('PASS '+name);};
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader']});
 try{
  const context=await browser.newContext({viewport:{width:1600,height:1000},acceptDownloads:true});
  await context.addInitScript(()=>localStorage.setItem('nch-urban-game-v1','Preserved 2D Sentinel'));
  const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));page.on('requestfailed',r=>report.failedRequests.push(r.url()));
  await page.goto(report.url,{waitUntil:'networkidle'});await page.waitForFunction(()=>!!globalThis.__URBAN_REVIEW__);report.buildIdentity=await page.evaluate(()=>URBAN_REVIEW_BUILD.identifier);
  const read=()=>page.evaluate(()=>__URBAN_REVIEW__.read());
  const point=(x,y)=>page.evaluate(([x,y])=>__URBAN_REVIEW__.cellToScreen(x,y),[x,y]);
  const click=async(x,y)=>{const p=await point(x,y);assert(p.x>0&&p.x<1600&&p.y>160&&p.y<900,JSON.stringify(p));await page.mouse.click(p.x,p.y);};
  const collapse=async()=>{for(const name of ['journal','tools'])if(await page.locator('#'+name+'Toggle').getAttribute('aria-expanded')==='true')await page.locator('#'+name+'Toggle').click();};
  const tool=async type=>{if(await page.locator('#toolsToggle').getAttribute('aria-expanded')==='false')await page.locator('#toolsToggle').click();await page.locator('[data-tool='+type+']').click();await collapse();};
  const load=async n=>{await page.locator('#saveFile').setInputFiles(path.join(__dirname,'fixtures/build-011/round-'+n+'.json'));await page.locator('#confirmOpen').click();assert.equal((await read()).state.round,n);await page.locator('#isometricButton').click();await page.locator('#fitButton').click();await collapse();};
  const rotate=async amount=>{await page.mouse.move(800,500);await page.mouse.down({button:'middle'});await page.mouse.move(800+amount,500,{steps:4});await page.mouse.up({button:'middle'});};
  const idle=async()=>{const i=await page.evaluate(()=>__URBAN_REVIEW__.interaction());assert.equal(i.activePointer,null);assert.deepEqual(i.navigationPointers,[]);};
  const saveAndReopen=async n=>{const before=await read();await page.locator('#saveButton').click();const pending=page.waitForEvent('download');await page.locator('#downloadReview').click();const download=await pending,file=path.join(out,'deep-round-'+n+'.json');await download.saveAs(file);await page.locator('#closeModal').click();await page.reload({waitUntil:'networkidle'});await page.waitForFunction(()=>!!globalThis.__URBAN_REVIEW__);assert.deepEqual(await read(),before);await page.locator('#saveFile').setInputFiles(file);await page.locator('#confirmOpen').click();assert.deepEqual(await read(),before);};
  for(let n=2;n<=5;n++){
   const cell=n===3?[18,6]:[3,n===2?20:n===4?22:24];
   for(const angle of [-240,110,310]){
    await load(n);const before=await read();await rotate(angle);await tool('house');await click(...cell);let after=await read();assert.equal(after.state.structures.length,before.state.structures.length+1);const b=after.state.structures.at(-1);assert.equal(b.type,'house');assert.equal(b.x,cell[0]);assert.equal(b.y,cell[1]);assert.equal(b.born,n);
    await click(...cell);assert.deepEqual(await read(),after);await page.keyboard.press('Control+z');assert.deepEqual(await read(),before);await page.keyboard.press('Control+Shift+z');assert.deepEqual(await read(),after);await idle();
   }
   pass('Round '+n+': exact-cell house placement after three rotations; duplicate click, undo, and redo preserve data');
   await load(n);await rotate(n%2?190:-170);await tool('house');let p=await point(...cell);await page.mouse.move(p.x,p.y);await page.mouse.down();const id=await page.evaluate(()=>__URBAN_REVIEW__.interaction().activePointer);assert.notEqual(id,null);
   if(n===2)await page.dispatchEvent('#villageCanvas','pointercancel',{pointerId:id,pointerType:'mouse'});
   if(n===3){await page.evaluate(id=>document.querySelector('canvas').releasePointerCapture(id),id);await page.mouse.move(p.x+1,p.y+1);}
   if(n===4){await page.reload({waitUntil:'networkidle'});await page.waitForFunction(()=>!!globalThis.__URBAN_REVIEW__);}
   if(n===5)await page.mouse.move(-10,-10);
   await page.mouse.up();await idle();assert((await read()).state.structures.some(b=>b.type==='house'&&b.x===cell[0]&&b.y===cell[1]&&b.born===n));
   await tool('house');await click(cell[0]+1,cell[1]);await idle();await saveAndReopen(n);await collapse();const kept=await read();
   await page.locator('#saveFile').setInputFiles([]);assert.deepEqual(await read(),kept);await page.locator('#saveFile').setInputFiles({name:'interrupted.json',mimeType:'application/json',buffer:Buffer.from('{unfinished')});await page.waitForFunction(()=>document.querySelector('#modalTitle').textContent==='Could Not Open Save');assert.deepEqual(await read(),kept);await page.locator('#closeModal').click();await page.locator('#guideButton').click();await page.locator('#closeModal').click();
   pass('Round '+n+': interrupted placement, repeated action, save/reopen, cancelled file input, and malformed save recover without losing the village');
  }
  for(const [n,type,x,y] of [[3,'manor',24,4],[4,'factory',9,3]]){
   await load(n);await rotate(-230);const before=await read();await tool(type);await click(x,y);const b=(await read()).state.structures.at(-1);assert.equal(b.type,type);assert.equal(b.x,x);assert.equal(b.y,y);assert.equal(b.size,2);await page.keyboard.press('Control+z');assert.deepEqual(await read(),before);
  }
  pass('Two-square manor and river-bank factory placement remains exact after rotation');
  await load(5);await rotate(180);await tool('road');let start=await point(2,21),end=await point(6,21);await page.mouse.move(start.x,start.y);await page.mouse.down();await page.mouse.move(end.x,end.y,{steps:8});await page.keyboard.press('Escape');await page.mouse.up();await idle();for(let x=2;x<=6;x++)assert.equal((await read()).state.terrain.road[x+',21'],5);await page.keyboard.press('Control+z');for(let x=2;x<=6;x++)assert.equal((await read()).state.terrain.road[x+',21'],undefined);await tool('bridge');await click(8,24);assert.equal((await read()).state.terrain.bridge['8,24'].born,5);
  pass('Rotated road drag, Escape, grouped undo, and switching to bridge placement remain responsive');
  assert.equal(await page.evaluate(()=>localStorage.getItem('nch-urban-game-v1')),'Preserved 2D Sentinel');assert.deepEqual(report.errors,[]);assert.deepEqual(report.failedRequests,[]);pass('No script/network errors or changes to accepted 2D storage');report.status='passed';
 }catch(e){report.status='failed';report.failure=e.stack;throw e;}
 finally{fs.writeFileSync(path.join(out,'placement-regression-results.json'),JSON.stringify(report,null,2));await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
