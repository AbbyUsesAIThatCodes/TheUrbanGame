const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),sandbox={module:{exports:{}}};vm.runInNewContext(fs.readFileSync(path.join(root,'src/recovered/rules.js'),'utf8'),sandbox);const R=sandbox.module.exports;globalThis.UrbanRules=R;
const specs=require('./fixtures/source-rounds.cjs'),early=require('./fixtures/rounds-2-5.cjs'),plain=x=>JSON.parse(JSON.stringify(x));
async function simulate(last=20){
 const {preparedVillage}=await import('../src/review-state.js');const v=preparedVillage(),rounds=[];
 function ok(error){assert.equal(error,null);}
 function route(layer,targets){
  let network=new Set(Object.keys(v.state.terrain[layer]));
  for(const target of targets){
   const goals=new Set(target);if([...network].some(k=>goals.has(k)))continue;
   let starts=network.size?[...network]:[target[0]],queue=[...starts],parents=new Map(starts.map(k=>[k,null])),hit=null;
   for(let q=0;q<queue.length;q++){const k=queue[q];if(goals.has(k)){hit=k;break;}for(const n of R.neighbors(k)){const[x,y]=n.split(',').map(Number);if(!parents.has(n)&&!R.at(v.state,x,y)){parents.set(n,k);queue.push(n);}}}
   assert(hit,'No legal route to '+target);for(let k=hit;k!==null;k=parents.get(k)){const[x,y]=k.split(',').map(Number);ok(R.paint(v.state,layer,x,y));network.add(k);}
  }
 }
 for(let n=1;n<=last;n++){
  const s=v.state,spec=specs[n],actions=[],before=plain(v);assert.equal(s.round,n);assert.deepEqual(plain(R.ROUNDS[n].add),spec.add);assert.equal(R.ROUNDS[n].slide,spec.slide);assert.equal(R.ROUNDS[n].year,spec.year);assert(R.tasks(s).some(t=>!t.done));
  const paint=(tool,x,y)=>{ok(R.paint(s,tool,x,y));actions.push({tool,x,y});};
  if(n===1){for(let y=8;y<=12;y++)paint('canal',7,y);paint('manor',10,20);s.checks['1-nearRiver']=true;actions.push({check:'1-nearRiver'});}
  else if(n<=5){for(const p of early[n].placements)paint(...p);}
  else{
   if(n===9)for(const b of s.structures.filter(b=>b.type==='house').slice(0,5))paint('demolish',b.x,b.y);
   // Keep narrow lanes between later blocks, and row31 open for the west-east line.
   for(const[type,count]of Object.entries(spec.add).sort((a,b)=>R.TYPES[b[0]].size-R.TYPES[a[0]].size))for(let i=0;i<count;i++){
    const size=R.TYPES[type].size,choices=[];
    for(let y=0;y+size<=31;y++)for(let x=0;x+size<=R.WIDTH;x++)if(!R.buildingError(s,type,x,y)){
     const grid=size===2?x%3===0&&y%3===0:true;
     const score=size===2?(grid?0:1000)+(x>=17?0:100)+y:(x<6?0:100)+(x%3===2||y%3===2?200:0)+y;
     choices.push({x,y,score});
    }
    choices.sort((a,b)=>a.score-b.score);assert(choices.length,`No space Round${n} ${type}`);paint(type,choices[0].x,choices[0].y);
   }
  }
  if(n===8){s.checks['8-churchWalk']=true;actions.push({check:'8-churchWalk'});}
  if(n===12){const k=Object.keys(s.terrain.bridge)[0];paint('iron',...k.split(',').map(Number));}
  if(n===14){route('rail1',s.structures.filter(b=>['factory','mine'].includes(b.type)).map(b=>[...new Set(R.cells(b).flatMap(R.neighbors))].filter(k=>!R.at(s,...k.split(',').map(Number)))));for(const k of Object.keys(s.terrain.rail1))actions.push({tool:'rail1',x:+k.split(',')[0],y:+k.split(',')[1]});}
  if(n===17)for(let x=0;x<R.WIDTH;x++)paint('rail2',x,31);
  assert.deepEqual(plain(R.tasks(s).filter(t=>!t.done)),[],`Round ${n} missing requirements`);const complete=plain(v);ok(R.advance(s));v.roundStart=R.clone(s);v.reviewComplete=n===20;v.reviewLimit=20;assert.equal(s.teacherOverrides.length,0);R.validateImport(s);rounds.push({round:n,before,actions,complete,after:plain(v),counts:plain(R.counts(s))});
 }
 return {v,rounds};
}
module.exports={simulate,R,specs,plain};
if(require.main===module)simulate().then(({v,rounds})=>{const out=path.join(root,'test-output');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'full-simulation.json'),JSON.stringify({rounds,final:v},null,2));console.log(JSON.stringify({rounds:rounds.map(r=>({round:r.round,actions:r.actions.length,counts:r.counts})),finalStructures:v.state.structures.length,snapshots:v.state.snapshots.length,overrides:v.state.teacherOverrides},null,2));}).catch(e=>{console.error(e);process.exit(1);});
