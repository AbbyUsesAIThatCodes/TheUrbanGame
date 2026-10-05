// Exercise an update using one isolated browser tab and the same storage origin.
const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {simulate}=require('./full-simulation.cjs');
const root=path.resolve(__dirname,'..'),out=path.join(root,'test-output');
const current=JSON.parse(fs.readFileSync(path.join(root,'current-build.json')));
const from=process.env.URBAN_PREVIOUS_URL||'http://127.0.0.1:8770/';
const to=process.env.URBAN_REVIEW_URL||'http://127.0.0.1:8770/review-build-019/';
const report={identifier:current.identifier,from,to,checks:[],errors:[]};
(async()=>{
 assert.equal(new URL(from).origin,new URL(to).origin);
 const {rounds}=await simulate(9),fixture={...rounds[8].before,reviewLimit:20,reviewComplete:false};
 const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try{
  const context=await browser.newContext({viewport:{width:1600,height:1000}}),page=await context.newPage();
  page.on('pageerror',error=>report.errors.push(error.message));
  await page.goto(from,{waitUntil:'networkidle'});await page.waitForFunction(()=>!!globalThis.__URBAN_REVIEW__);
  report.previousIdentity=await page.evaluate(()=>URBAN_REVIEW_BUILD.identifier);assert(report.previousIdentity.includes('_build-018_'));
  await page.locator('#saveFile').setInputFiles({name:'generated-handoff-test.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(fixture))});
  await page.locator('#confirmOpen').click();assert.deepEqual(await page.evaluate(()=>__URBAN_REVIEW__.read()),fixture);
  await page.goto(to,{waitUntil:'networkidle'});await page.waitForFunction(()=>!!globalThis.__URBAN_REVIEW__);
  assert.equal(await page.evaluate(()=>URBAN_REVIEW_BUILD.identifier),current.identifier);
  assert.deepEqual(await page.evaluate(()=>__URBAN_REVIEW__.read()),fixture);
  assert.equal(await page.locator('#eraseButton').textContent(),'Erase This Round');
  assert.equal(await page.locator('[data-tool="demolish"] .name').textContent(),'Destroy House');
  report.checks.push('Same-tab navigation from Build018 to Build019 automatically retains the exact Round9 test save');
  for(const [name,digest] of Object.entries(current.payload_sha256)){
   const response=await context.request.get(new URL(name,to).href);assert.equal(response.status(),200,name);
   assert.equal(require('node:crypto').createHash('sha256').update(await response.body()).digest('hex'),digest,name);
  }
  report.checks.push('All50 payloads and relative asset paths at the final review URL match Build019');
  await page.screenshot({path:path.join(out,'build-019-review.png')});
  await page.goto(from,{waitUntil:'networkidle'});await page.waitForFunction(()=>!!globalThis.__URBAN_REVIEW__);
  assert.equal(await page.evaluate(()=>URBAN_REVIEW_BUILD.identifier),report.previousIdentity);
  assert.deepEqual(await page.evaluate(()=>__URBAN_REVIEW__.read()),fixture);
  report.checks.push('Original Build018 URL remains unchanged and can still read the same unmodified save');
  assert.deepEqual(report.errors,[]);report.status='passed';
 }catch(error){report.status='failed';report.failure=error.stack;throw error;}
 finally{fs.writeFileSync(path.join(out,'preview-handoff-results.json'),JSON.stringify(report,null,2));await browser.close();}
 console.log(JSON.stringify(report,null,2));
})().catch(error=>{console.error(error);process.exitCode=1;});
