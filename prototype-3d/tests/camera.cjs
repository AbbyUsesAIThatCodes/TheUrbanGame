const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=path.join(root,'test-output');
const current=JSON.parse(fs.readFileSync(path.join(root,'current-build.json'),'utf8'));
const results={url:'http://127.0.0.1:8770/',buildIdentity:current.identifier,checks:[],panMeasurements:[],errors:[]};
const pass=(name)=>{results.checks.push(name);console.log('PASS '+name);};
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader']});
 try{
  const context=await browser.newContext({viewport:{width:1600,height:1000}}),page=await context.newPage();
  page.on('pageerror',e=>results.errors.push(e.message));
  await page.goto(results.url,{waitUntil:'networkidle'});await page.waitForFunction(()=>!!globalThis.__URBAN_REVIEW__);
  const view=()=>page.evaluate(()=>__URBAN_REVIEW__.camera());
  const read=()=>page.evaluate(()=>__URBAN_REVIEW__.read());
  const interaction=()=>page.evaluate(()=>__URBAN_REVIEW__.interaction());
  const point=(x=14,y=16)=>page.evaluate(([x,y])=>__URBAN_REVIEW__.cellToScreen(x,y),[x,y]);
  const drag=async(dx,dy,button='left')=>{await page.mouse.move(820,500);await page.mouse.down({button});await page.mouse.move(820+dx,500+dy,{steps:8});await page.mouse.up({button});};
  const frame=async()=>{await page.locator('#isometricButton').click();await page.locator('#fitButton').click();};
  const free=async()=>{const i=await interaction();assert.equal(i.activePointer,null);assert.deepEqual(i.navigationPointers,[]);};
  const stateBefore=JSON.stringify((await read()).state);
  for(const [yaw,tilt] of [[0,0],[190,100],[-280,-100]])for(const zoomSteps of [0,2,5]){
   await frame();await page.locator('#rotateMode').click();await drag(yaw,tilt);await page.locator('#panMode').click();
   for(let i=0;i<zoomSteps;i++)await page.locator('#zoomIn').click();
   for(const [dx,dy] of [[60,0],[0,60],[-45,-45]]){
    const before=await point();await drag(dx,dy);const after=await point();
    const actual={x:after.x-before.x,y:after.y-before.y};
    assert(Math.abs(actual.x-dx)<1,JSON.stringify({yaw,tilt,zoomSteps,dx,dy,actual}));
    assert(Math.abs(actual.y-dy)<1,JSON.stringify({yaw,tilt,zoomSteps,dx,dy,actual}));
    await page.waitForTimeout(120);const settled=await point();assert(Math.hypot(settled.x-after.x,settled.y-after.y)<.1,'Pan must stop on release');
    results.panMeasurements.push({yawDrag:yaw,tiltDrag:tilt,zoom:(await view()).zoom,requested:[dx,dy],actual:[actual.x,actual.y]});
   }
  }
  assert.equal(JSON.stringify((await read()).state),stateBefore);
  pass('27 pan measurements match pointer pixels across three orientations, three zooms, and both axes, with no release drift');
  await frame();await page.locator('[data-tool=manor]').click();let before=await view();await drag(145,0,'middle');let after=await view();
  assert(Math.abs(after.azimuth-before.azimuth)>.1);assert(Math.abs(after.polar-before.polar)<.001);assert.equal(after.zoom,before.zoom);assert.deepEqual(after.target,before.target);await free();
  assert.equal(JSON.stringify((await read()).state),stateBefore);
  assert(await page.evaluate(()=>{const e=new MouseEvent('mousedown',{button:1,bubbles:true,cancelable:true});return !document.querySelector('canvas').dispatchEvent(e);}));
  assert(await page.evaluate(()=>{const e=new MouseEvent('auxclick',{button:1,bubbles:true,cancelable:true});return !document.querySelector('canvas').dispatchEvent(e);}));
  await page.mouse.move(820,500);await page.mouse.wheel(0,-120);await page.waitForTimeout(100);assert((await view()).zoom>after.zoom);
  pass('Middle-button horizontal orbit works while building, preserves tilt and state, suppresses browser defaults, and leaves wheel zoom working');
  await page.locator('#overheadButton').click();await page.locator('#fitButton').click();before=await view();await drag(150,40,'middle');after=await view();assert(Math.abs(after.azimuth)<.001);assert(after.polar<.001);assert.equal(after.zoom,before.zoom);await free();
  pass('Overhead remains north-up and rotation-locked with middle-button input');
  for(const button of ['left','middle'])for(const cancel of ['pointercancel','lostcapture','blur','Escape','outside','buttons-release']){
   await frame();await page.locator('#panMode').click();await page.mouse.move(820,500);await page.mouse.down({button});await page.mouse.move(850,520,{steps:3});
   const id=(await interaction()).navigationPointers[0];assert.notEqual(id,undefined);
   if(cancel==='pointercancel')await page.dispatchEvent('#villageCanvas','pointercancel',{pointerId:id,pointerType:'mouse'});
   if(cancel==='lostcapture'){await page.evaluate(id=>document.querySelector('canvas').releasePointerCapture(id),id);await page.mouse.move(855,525);}
   if(cancel==='blur')await page.evaluate(()=>window.dispatchEvent(new Event('blur')));
   if(cancel==='Escape')await page.keyboard.press('Escape');
   if(cancel==='outside')await page.mouse.move(-10,-10);
   if(cancel==='buttons-release')await page.dispatchEvent('#villageCanvas','pointermove',{pointerId:id,pointerType:'mouse',buttons:0,clientX:850,clientY:520});
   await page.mouse.up({button});await free();const stopped=await view();await page.mouse.move(900,600);await page.waitForTimeout(100);assert.deepEqual(await view(),stopped);
   await page.mouse.wheel(0,-80);await page.waitForTimeout(100);assert((await view()).zoom>stopped.zoom,'Wheel must work after '+button+' '+cancel);
   await page.locator('#guideButton').click();assert(await page.locator('#modal').isVisible());await page.locator('#closeModal').click();
   await page.locator('#overheadButton').click();await page.locator('#fitButton').click();await page.locator('[data-tool=manor]').click();const p=await point(10,20);await page.mouse.click(p.x,p.y);
   assert.equal((await read()).state.structures.filter(b=>b.type==='manor').length,1);await page.keyboard.press('Control+z');assert.equal((await read()).state.structures.filter(b=>b.type==='manor').length,0);
  }
  pass('12 interrupted pan/orbit cases recover: cancel, lost capture, focus-loss signal, Escape, outside release, and missing buttons; placement and keyboard undo still work');
  await frame();await page.locator('#rotateMode').click();await drag(0,-180);await page.locator('#panMode').click();
  for(const [dx,dy] of [[0,-350],[0,-350],[0,-350],[400,150],[400,150],[400,150]]){await drag(dx,dy);const c=await view();assert(Math.hypot(...c.target)<=35.001);assert(Math.abs(c.target[1])<.001);assert(c.position[1]>1,'Camera must stay above the board');}
  await page.locator('#fitButton').click();assert(Math.hypot(...(await view()).target)<.001);
  pass('Low-angle extreme panning keeps a grounded orbit pivot and camera above the board, respects navigation bounds, and Frame Village restores the center');
  for(const width of [1600,1000,720,390]){
   await page.setViewportSize({width,height:width===390?844:1000});await page.waitForTimeout(120);
   const bounds=await page.evaluate(()=>{const box=s=>{const r=document.querySelector(s).getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height};};return {brand:box('.brand'),session:box('.session-panel'),identity:box('#buildIdentity'),panel:box('#journalPanel'),footer:document.querySelector('footer')!==null,identityText:document.querySelector('#buildIdentity').textContent,phaseVisible:getComputedStyle(document.querySelector('.era')).display!=='none',overflow:document.documentElement.scrollWidth>innerWidth};});
   assert.equal(bounds.footer,false);assert.equal(bounds.identityText,current.identifier);assert(bounds.brand.right+6<=bounds.session.x);assert(bounds.session.right<=width);assert(bounds.identity.bottom<=bounds.brand.bottom);assert(bounds.panel.y>Math.max(bounds.brand.bottom,bounds.session.bottom));assert(bounds.phaseVisible);assert(!bounds.overflow);
   await page.screenshot({path:path.join(out,'header-'+width+'.png')});
  }
  pass('Split header shows the full current ID, year, round, and actions without a footer or overlaps at 1600, 1000, 720, and 390 pixels');
  const baselineSave=path.join(__dirname,'fixtures/build-006-round-1-review.json');
  await page.locator('#saveFile').setInputFiles(baselineSave);await page.locator('#confirmOpen').click();assert((await read()).roundOneComplete);assert.equal((await read()).state.round,1);
  pass('A build 006 review save opens unchanged in the new build');
  assert.deepEqual(results.errors,[]);pass('No JavaScript errors during camera or header checks');results.status='passed';
 }catch(e){results.status='failed';results.failure=e.stack;throw e;}
 finally{fs.writeFileSync(path.join(out,'camera-results.json'),JSON.stringify(results,null,2));await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
