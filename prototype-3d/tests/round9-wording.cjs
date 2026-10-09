const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {simulate,R,plain}=require('./full-simulation.cjs');
const root=path.resolve(__dirname,'..'),out=path.join(root,'test-output');
fs.mkdirSync(out,{recursive:true});
const current=JSON.parse(fs.readFileSync(path.join(root,'current-build.json')));
const report={identifier:current.identifier,url:process.env.URBAN_REVIEW_URL||'http://127.0.0.1:8770/',checks:[],errors:[]};
const guidance='To remove an older house, select Destroy House in Build Your Village.';
const pass=name=>{report.checks.push(name);console.log('PASS '+name);};

(async()=>{
 const {rounds}=await simulate(10);
 const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try{
  const context=await browser.newContext({viewport:{width:1600,height:1000},acceptDownloads:true});
  await context.addInitScript(()=>{
   localStorage.setItem('nch-urban-game-v1','Accepted 2D Sentinel');
   localStorage.setItem('nch-urban-game-3d-round5-review-v2','Earlier Review Sentinel');
  });
  const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));
  await page.goto(report.url,{waitUntil:'networkidle'});await page.waitForFunction(()=>!!globalThis.__URBAN_REVIEW__);
  assert.equal(await page.evaluate(()=>URBAN_REVIEW_BUILD.identifier),current.identifier);
  const read=()=>page.evaluate(()=>__URBAN_REVIEW__.read());
  const panel=async(name,open)=>{if((await page.locator('#'+name+'Toggle').getAttribute('aria-expanded')==='true')!==open)await page.locator('#'+name+'Toggle').click();};
  const load=async n=>{
   const fixture={...rounds[n-1].before,reviewLimit:20,reviewComplete:false};
   await page.locator('#saveFile').setInputFiles({name:`generated-round-${n}.json`,mimeType:'application/json',buffer:Buffer.from(JSON.stringify(fixture))});
   await page.locator('#confirmOpen').click();assert.deepEqual(await read(),fixture);
   await page.locator('#overheadButton').click();await page.locator('#fitButton').click();await panel('journal',false);
  };
  const select=async tool=>{
   await panel('tools',true);
   if(tool==='erase')await page.getByRole('button',{name:'Erase This Round',exact:true}).click();
   else if(tool==='demolish')await page.getByRole('button',{name:/Destroy House/}).click();
   else await page.locator(`[data-tool="${tool}"]`).click();
   await panel('tools',false);
  };
  const click=async b=>{const p=await page.evaluate(([x,y])=>__URBAN_REVIEW__.cellToScreen(x,y),[b.x,b.y]);await page.mouse.click(p.x,p.y);};
  const status=()=>page.locator('#status').textContent();

  await load(9);await panel('tools',true);
  assert.equal(await page.locator('#eraseButton').textContent(),'Erase This Round');
  assert.equal(await page.locator('[data-tool="demolish"] .name').textContent(),'Destroy House');
  assert((await page.locator('#roundHint').textContent()).startsWith('Use Destroy House'));
  assert.equal(await page.getByRole('button',{name:/Demolish House/}).count(),0);
  for(const width of [1600,390]){
   await page.setViewportSize({width,height:1000});
   assert(await page.locator('#eraseButton').isVisible());
   assert(await page.locator('#eraseButton').evaluate(b=>b.scrollWidth<=b.clientWidth&&b.scrollHeight<=b.clientHeight));
   assert(await page.locator('[data-tool="demolish"] .name').evaluate(b=>b.scrollWidth<=b.clientWidth));
  }
  await page.setViewportSize({width:1600,height:1000});await page.locator('#fitButton').click();
  pass('Approved labels and Round9 hint are consistent; labels fit desktop and 390px panels');

  const before=await read(),houses=before.state.structures.filter(b=>b.type==='house');
  const manor=before.state.structures.find(b=>b.type==='manor'),pub=before.state.structures.find(b=>b.type==='pub');
  await select('erase');
  const saved=await page.evaluate(()=>localStorage.getItem('nch-urban-game-3d-full-review-v3'));
  await click(houses[0]);assert.equal(await status(),guidance);assert(await page.locator('#status').evaluate(n=>n.classList.contains('error')));
  assert.deepEqual(await read(),before);assert.equal(await page.evaluate(()=>localStorage.getItem('nch-urban-game-3d-full-review-v3')),saved);
  assert(await page.locator('#undoButton').isDisabled());
  await page.screenshot({path:path.join(out,'round9-erase-guidance.png')});
  pass('Actual Erase This Round button explains old-house removal in Round9 without changing state, save or undo history');

  for(const target of [manor,pub]){await click(target);assert.notEqual(await status(),guidance);assert(!(await status()).includes('select Destroy House'));assert.deepEqual(await read(),before);}
  await select('demolish');await click(manor);assert.equal(await status(),'Choose an ordinary house to demolish.');assert.deepEqual(await read(),before);
  pass('Older nice houses and non-house buildings receive no incorrect Destroy House advice; destruction rejects nice houses');

  await select('pub');let addition;
  for(let y=0;y<32&&!addition;y++)for(let x=0;x<29&&!addition;x++)if(!R.buildingError(plain(before.state),'pub',x,y))addition={x,y};
  assert(addition);await click(addition);const added=await read();assert.equal(added.state.structures.length,before.state.structures.length+1);
  await select('erase');await click(addition);const erased=await read();assert.equal(erased.state.structures.length,before.state.structures.length);assert.equal(erased.state.removed.length,0);
  assert.equal(R.placed(erased.state,'pub'),0);await page.keyboard.press('Control+z');assert.deepEqual(await read(),added);await page.keyboard.press('Control+Shift+z');assert.deepEqual(await read(),erased);
  pass('Current-round pub erasure remains an edit, restores allowance, does not count as destruction, and supports undo/redo');

  await load(9);await select('demolish');await click(houses[0]);const once=await read();assert.equal(once.state.removed.length,1);
  assert.equal(once.state.structures.length,before.state.structures.length-1);assert((await status()).startsWith('Destroy House'));
  await page.keyboard.press('Control+z');assert.deepEqual(await read(),before);await page.keyboard.press('Control+Shift+z');assert.deepEqual(await read(),once);
  for(const house of houses.slice(1,5))await click(house);
  const five=await read();assert.equal(five.state.removed.length,5);assert(R.tasks(five.state).find(t=>t.id==='demolished').done);
  await click(houses[5]);assert.equal(await status(),'All five houses have been demolished.');assert.deepEqual(await read(),five);
  await select('erase');await click(houses[5]);assert.notEqual(await status(),guidance);assert.deepEqual(await read(),five);
  pass('Destroy House counts exactly five ordinary houses, supports undo/redo, and neither control suggests or allows a sixth');

  await page.locator('#saveButton').click();const pending=page.waitForEvent('download');await page.locator('#downloadReview').click();
  const file=path.join(out,'round9-wording-save.json');await(await pending).saveAs(file);assert.deepEqual(JSON.parse(fs.readFileSync(file)),five);
  await page.locator('#closeModal').click();await page.reload({waitUntil:'networkidle'});await page.waitForFunction(()=>!!globalThis.__URBAN_REVIEW__);assert.deepEqual(await read(),five);
  await page.locator('#saveFile').setInputFiles(file);await page.locator('#confirmOpen').click();assert.deepEqual(await read(),five);
  pass('Round9 demolition progress survives unchanged save download, reload and reopening');

  for(const n of [8,10]){
   await load(n);const initial=await read();assert.equal(await page.locator('[data-tool="demolish"]').count(),0);
   await select('erase');await click(initial.state.structures.find(b=>b.type==='house'));
   assert.notEqual(await status(),guidance);assert(!(await status()).includes('select Destroy House'));assert.deepEqual(await read(),initial);
  }
  assert.equal(await page.evaluate(()=>localStorage.getItem('nch-urban-game-v1')),'Accepted 2D Sentinel');
  assert.equal(await page.evaluate(()=>localStorage.getItem('nch-urban-game-3d-round5-review-v2')),'Earlier Review Sentinel');
  assert.deepEqual(report.errors,[]);
  pass('Rounds8/10 retain earlier-building protection and hide destruction; separate save keys remain unchanged');
  report.status='passed';
 }catch(error){report.status='failed';report.failure=error.stack;throw error;}
 finally{fs.writeFileSync(path.join(out,'round9-wording-results.json'),JSON.stringify(report,null,2));await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
