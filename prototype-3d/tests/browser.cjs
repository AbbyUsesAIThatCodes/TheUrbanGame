const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=path.join(root,'test-output');fs.mkdirSync(out,{recursive:true});
const current=JSON.parse(fs.readFileSync(path.join(root,'current-build.json'),'utf8'));
const results={url:'http://127.0.0.1:8770/',buildIdentity:current.identifier,checks:[],errors:[],failedRequests:[]};
const pass=(name,detail)=>{results.checks.push({name,detail});console.log('PASS '+name);};
(async()=>{
const browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader']});
try{
 const context=await browser.newContext({viewport:{width:1600,height:1000},acceptDownloads:true});
 await context.addInitScript(()=>localStorage.setItem('nch-urban-game-v1','DO NOT CHANGE: accepted 2D progress sentinel'));
 const page=await context.newPage();page.on('pageerror',e=>results.errors.push(e.message));page.on('requestfailed',r=>results.failedRequests.push({url:r.url(),error:r.failure()}));
 await page.goto(results.url,{waitUntil:'networkidle'});await page.waitForFunction(()=>!!globalThis.__URBAN_REVIEW__);
 const read=()=>page.evaluate(()=>__URBAN_REVIEW__.read());
 const view=()=>page.evaluate(()=>__URBAN_REVIEW__.camera());
 const point=(x,y)=>page.evaluate(([x,y])=>__URBAN_REVIEW__.cellToScreen(x,y),[x,y]);
 const clickCell=async(x,y)=>{const p=await point(x,y);await page.mouse.click(p.x,p.y);};
 const free=async()=>assert.equal(await page.evaluate(()=>__URBAN_REVIEW__.interaction().activePointer),null);
 const uiAlive=async()=>{await page.locator('#guideButton').click();assert(await page.locator('#modal').isVisible());await page.locator('#closeModal').click();};
 assert.equal((await read()).state.round,1);assert.equal((await read()).state.structures.length,16);assert.equal((await read()).state.teacherOverrides.length,0);
 assert.equal(await page.locator('#buildIdentity').innerText(),current.identifier);
 assert.equal(await page.evaluate(()=>JSON.parse(document.querySelector('#review-build-manifest').textContent).identifier),current.identifier);
 pass('Prepared village, original rule engine, and complete build identity load');
 await page.screenshot({path:path.join(out,'initial-3d.png')});
 const original=JSON.stringify((await read()).state);
 let before=await view();await page.mouse.move(1030,730);await page.mouse.down();await page.mouse.move(1120,690,{steps:8});await page.mouse.up();await page.waitForTimeout(350);let after=await view();assert.notDeepEqual(after.target,before.target);assert.equal(JSON.stringify((await read()).state),original);
 await page.locator('#rotateMode').click();before=await view();await page.mouse.move(960,650);await page.mouse.down();await page.mouse.move(1120,675,{steps:8});await page.mouse.up();await page.waitForTimeout(350);after=await view();assert(Math.abs(after.azimuth-before.azimuth)>.1);assert.equal(JSON.stringify((await read()).state),original);
 pass('Pan and rotation change the view without modifying the village');
 await page.locator('#overheadButton').click();await page.locator('#fitButton').click();after=await view();assert.equal(after.viewMode,'overhead');assert(after.polar<.001);assert(Math.abs(after.azimuth)<.01);
 await page.locator('#zoomIn').click();assert((await view()).zoom>1);await page.locator('#zoomOut').click();assert(Math.abs((await view()).zoom-1)<.0001);
 pass('North-up overhead view, frame reset, and zoom controls');
 await page.locator('#isometricButton').click();await page.locator('#focusBuilding').click();assert.equal((await view()).zoom,4);assert((await page.locator('#inspectArt').boundingBox()).width>=180);await page.screenshot({path:path.join(out,'close-inspection.png')});
 await page.locator('#fitButton').click();await page.locator('#journalToggle').click();assert.equal(await page.locator('#journalToggle').getAttribute('aria-expanded'),'false');await page.locator('#journalToggle').click();await page.locator('#toolsToggle').click();assert.equal(await page.locator('#toolsToggle').getAttribute('aria-expanded'),'false');await page.locator('#toolsToggle').click();
 pass('Close inspection, enlarged original artwork, and collapsible floating panels');
 await page.locator('#sourceTab').click();const sources=JSON.parse(fs.readFileSync(path.join(root,'src/recovered/sources.json'),'utf8'));assert.equal(await page.locator('#storyText').textContent(),sources[0].slides.find(s=>s.number===9).text);await page.locator('#sourceDeck').selectOption('1');assert.equal(await page.locator('#storyText').textContent(),sources[1].slides.find(s=>s.number===9).text);await page.locator('#sourceDeck').selectOption('0');await page.locator('#taskTab').click();
 pass('Both original Round 1 narratives are shown verbatim');
 await page.locator('#nextButton').click();assert(!(await read()).roundOneComplete);
 await page.locator('#overheadButton').click();await page.locator('#fitButton').click();
 await page.locator('[data-tool=manor]').click();await clickCell(20,4);assert.equal((await read()).state.structures.filter(b=>b.type==='manor').length,0);assert((await page.locator('#status').innerText()).includes('commons'));
 await clickCell(10,20);assert.equal((await read()).state.structures.filter(b=>b.type==='manor').length,1);await free();
 await page.locator('#undoButton').click();assert.equal((await read()).state.structures.filter(b=>b.type==='manor').length,0);await page.locator('#redoButton').click();assert.equal((await read()).state.structures.filter(b=>b.type==='manor').length,1);
 pass('Protected commons, manor placement, undo, and redo use original requirements');
 await page.locator('[data-tool=canal]').click();const start=await point(7,8),end=await point(7,12);await page.mouse.move(start.x,start.y);await page.mouse.down();await page.mouse.move(end.x,end.y,{steps:8});await page.mouse.up();await free();assert.equal(Object.keys((await read()).state.terrain.canal).length,5);
 await page.locator('#nextButton').click();assert(!(await read()).roundOneComplete);await page.locator('#checklist input[type=checkbox]').check();await page.locator('#nextButton').click();assert((await read()).roundOneComplete);assert.equal((await read()).state.round,1);assert.equal((await read()).state.teacherOverrides.length,0);await page.locator('#exploreComplete').click();
 pass('Complete Round 1 through normal UI with no override; progression stops at Round 1');
 await page.locator('#isometricButton').click();await page.locator('#fitButton').click();await page.screenshot({path:path.join(out,'round-1-complete.png')});
 await page.locator('#saveButton').click();const pending=page.waitForEvent('download');await page.locator('#downloadReview').click();const download=await pending;const save=path.join(out,'round-1-review.json');await download.saveAs(save);assert(JSON.parse(fs.readFileSync(save,'utf8')).roundOneComplete);await page.locator('#closeModal').click();await page.reload({waitUntil:'networkidle'});await page.waitForFunction(()=>!!globalThis.__URBAN_REVIEW__);assert((await read()).roundOneComplete);
 const other=await browser.newContext({viewport:{width:1600,height:1000}}),otherPage=await other.newPage();await otherPage.goto(results.url,{waitUntil:'networkidle'});await otherPage.waitForFunction(()=>!!globalThis.__URBAN_REVIEW__);await otherPage.locator('#saveFile').setInputFiles(save);await otherPage.locator('#confirmOpen').click();assert(await otherPage.evaluate(()=>__URBAN_REVIEW__.read().roundOneComplete));await other.close();
 pass('Review save downloads, survives reload, and opens in a fresh context');
 await page.locator('#saveButton').click();await page.locator('#blankReview').click();await page.locator('#confirmNew').click();await page.locator('#villageName').fill('Interaction Recovery Test');await page.locator('#starterButton').click();await page.locator('#overheadButton').click();await page.locator('#fitButton').click();
 for(let i=0;i<4;i++){
  await page.locator('[data-tool=house]').click();const p=await point(2+i,20);await page.mouse.move(p.x,p.y);await page.mouse.down();const id=await page.evaluate(()=>__URBAN_REVIEW__.interaction().activePointer);assert.notEqual(id,null);
  if(i===0){await page.mouse.move(-10,-10);await page.mouse.up();}
  if(i===1){await page.dispatchEvent('#villageCanvas','pointercancel',{pointerId:id,pointerType:'mouse'});await page.mouse.up();}
  if(i===2){await page.evaluate(id=>document.querySelector('#villageCanvas').releasePointerCapture(id),id);await page.waitForTimeout(100);await page.mouse.up();}
  if(i===3){await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await page.mouse.up();}
  await free();assert.equal((await read()).state.structures.filter(b=>b.type==='house').length,i+1);await uiAlive();
 }
 pass('Repeated house placement recovers from outside release, pointer cancel, lost capture, and focus-loss signal');
 await page.locator('[data-tool=house]').click();let p=await point(6,20);await page.mouse.move(p.x,p.y);await page.mouse.down();await page.keyboard.press('Escape');await page.mouse.up();await free();await uiAlive();
 await page.locator('[data-tool=cemetery]').click();await clickCell(4,23);await page.locator('[data-tool=house]').click();await clickCell(7,20);await page.mouse.click(900,600,{button:'right'});await uiAlive();await free();assert.equal((await read()).state.structures.filter(b=>b.type==='house').length,6);assert.equal((await read()).state.structures.filter(b=>b.type==='cemetery').length,1);
 pass('Escape, tool switching, cemetery placement, repeated houses, and context-menu cancellation leave UI responsive');
 for(const [x,y] of [[9,20],[10,20],[11,20],[12,20]]){await page.locator('[data-tool=house]').click();await clickCell(x,y);}
 for(const [type,x,y] of [['church',10,23],['store',11,23],['pub',12,23],['mine',5,8],['park',18,22]]){await page.locator('[data-tool='+type+']').click();await clickCell(x,y);}
 assert.equal((await read()).state.structures.length,16);await page.locator('#nextButton').click();assert.equal((await read()).state.round,1);assert.equal((await read()).state.teacherOverrides.length,0);
 pass('Blank setup can be built completely through the 3D UI and advances normally');
 assert.equal(await page.evaluate(()=>localStorage.getItem('nch-urban-game-v1')),'DO NOT CHANGE: accepted 2D progress sentinel');
 pass('Accepted 2D save key is never changed');
 await page.setViewportSize({width:390,height:844});await page.reload({waitUntil:'networkidle'});await page.waitForFunction(()=>!!globalThis.__URBAN_REVIEW__);assert.equal(await page.locator('#journalToggle').getAttribute('aria-expanded'),'false');assert.equal(await page.locator('#toolsToggle').getAttribute('aria-expanded'),'false');await page.screenshot({path:path.join(out,'mobile-review.png')});
 for(const [x,y] of [[0,0],[28,0],[0,31],[28,31]]){const p=await point(x,y);assert(p.x>=0&&p.x<=390&&p.y>=125&&p.y<=690,'Frame Village must contain all board corners on mobile');}
 pass('Narrow viewport defaults to a clear board with collapsed panels');
 assert.deepEqual(results.errors,[]);assert.deepEqual(results.failedRequests,[]);pass('No JavaScript errors or failed network requests');results.status='passed';
}catch(e){results.status='failed';results.failure=e.stack;throw e;}
finally{fs.writeFileSync(path.join(out,'browser-results.json'),JSON.stringify(results,null,2));await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
