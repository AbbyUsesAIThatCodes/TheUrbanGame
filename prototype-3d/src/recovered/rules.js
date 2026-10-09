
/* The original board is 29 columns by 32 complete rows. No invented economy. */
(function (root) {
  'use strict';
  const WIDTH = 29, HEIGHT = 32;
  const TYPES = {
    house: {name:'House',size:1,art:0,mark:'H'}, church:{name:'Church',size:1,art:1,mark:'Ch'},
    cemetery:{name:'Cemetery',size:1,art:2,mark:'C'},store:{name:'Store',size:1,art:3,mark:'$'},
    pub:{name:'Pub',size:1,art:4,mark:'P'},mine:{name:'Coal mine',size:2,art:5,mark:'Co'},
    park:{name:'Park',size:2,art:6,mark:'Pk'},manor:{name:'Nice house',size:2,art:7,mark:'N'},
    factory:{name:'Factory',size:2,art:8,mark:'F'},tenement:{name:'Tenement',size:2,art:9,mark:'Tn'},
    school:{name:'School',size:1,art:10,mark:'?'},jail:{name:'Jail',size:1,art:11,mark:'J'},
    hospital:{name:'Hospital',size:1,art:12,mark:'+'},theater:{name:'Theater',size:1,art:13,mark:'T'},
    museum:{name:'Museum',size:1,art:14,mark:'M'},trees:{name:'Trees',size:1,art:15,mark:'Tr'}
  };
  const ROUNDS = [
    {year:'Before 1745',title:'A village by the river',slide:2,add:{house:10,church:1,cemetery:1,store:1,pub:1,mine:1,park:1},tools:['river','road','commons','trees'],hint:'Draw your river and two roads. Reserve the commons, then place your first buildings.'},
    {year:'1745',title:'The canal arrives',slide:9,add:{manor:1},tools:['canal'],hint:'Draw a one-square-wide canal near the river, touching your coal mine. Choose a place for your new home.'},
    {year:'1750',title:'A growing village',slide:10,add:{house:5}},
    {year:'1760',title:'Enclosing the commons',slide:11,add:{house:5,manor:1},hint:'The commons can now be built upon. This round’s nice house must stand inside the former commons.'},
    {year:'1773',title:'The water-powered factory',slide:12,add:{factory:1,house:5},hint:'Your factory must touch the river bank. The canal cannot power it.'},
    {year:'1774',title:'Workers arrive',slide:13,add:{house:15,church:1,pub:1,store:1},tools:['road','bridge'],hint:'You may add roads and one additional bridge. A crossing may span several water squares.'},
    {year:'After 1774',title:'The factory district',slide:14,add:{factory:5,house:15},hint:'All five factories must touch the river bank.'},
    {year:'1780',title:'Life in the tenements',slide:15,add:{tenement:5},images:16,hint:'Each new tenement must be within five squares of a factory.'},
    {year:'1781',title:'A community takes shape',slide:17,add:{store:1,pub:1,school:1,church:1}},
    {year:'1782',title:'The cost of long hours',slide:18,add:{pub:5,jail:1,tenement:4},demolish:5,hint:'Use Demolish to remove exactly five ordinary houses. Nice houses do not count.'},
    {year:'1783',title:'A new wealthy class',slide:19,add:{manor:2,factory:1,house:15},hint:'Water power still requires the new factory to touch the river.'},
    {year:'1785',title:'The age of steam',slide:20,add:{factory:10,manor:1,house:5,tenement:1},hint:'Factories can now stand away from the river. Every factory gains a 4 × 4 square of smoke automatically.'},
    {year:'1800',title:'Coal and iron',slide:21,add:{mine:1,house:5},tools:['iron'],hint:'Select Iron bridge, then click a wooden road bridge to replace that entire crossing.'},
    {year:'1815',title:'Children in the coal mines',slide:22,add:{mine:1,cemetery:1},images:23},
    {year:'1820',title:'The first railway',slide:24,add:{house:5},tools:['rail1'],hint:'Draw one connected rail network beside every factory and coal mine. Water crossings become railway bridges.'},
    {year:'1827',title:'A surplus of workers',slide:25,add:{jail:2,pub:4,tenement:2},images:26},
    {year:'1838',title:'The human cost',slide:27,add:{hospital:2,cemetery:1},images:28},
    {year:'1840',title:'East to west',slide:29,add:{house:5,tenement:1},tools:['rail2'],hint:'Draw a second, continuous railway from the west edge to the east edge. It may cross the first line.'},
    {year:'1842',title:'Culture in the city',slide:30,add:{theater:1,museum:1,school:2,manor:1}},
    {year:'1845',title:'A city under smoke',slide:31,add:{cemetery:1,jail:1,hospital:1},images:32},
    {year:'1850',title:'An industrial city',slide:33,add:{house:20,tenement:5,store:2,church:1,factory:5,pub:1,manor:3}}
  ];
  const TOOL_NAMES={river:'River',road:'Road',commons:'Commons',canal:'Canal',bridge:'Wooden bridge',iron:'Iron bridge',rail1:'First railway',rail2:'Second railway',move:'Move',erase:'Erase this round',demolish:'Demolish house'};
  const key=(x,y)=>x+','+y;
  const inside=(x,y,size=1)=>x>=0&&y>=0&&x+size<=WIDTH&&y+size<=HEIGHT;
  const clone=value=>JSON.parse(JSON.stringify(value));
  function fresh(){return {format:'nch-urban-game',version:1,round:0,finished:false,name:'',structures:[],terrain:{river:{},canal:{},road:{},rail1:{},rail2:{},bridge:{}},commons:null,removed:[],checks:{},snapshots:[],answers:['','',''],questionSet:'board',nextId:1,teacherOverrides:[],sourceDeck:0};}
  function cells(building){const list=[];for(let y=building.y;y<building.y+building.size;y++)for(let x=building.x;x<building.x+building.size;x++)list.push(key(x,y));return list;}
  function at(state,x,y){return state.structures.find(b=>x>=b.x&&x<b.x+b.size&&y>=b.y&&y<b.y+b.size);}
  function onCommons(state,x,y,size){const c=state.commons;return c&&x<c.x+10&&x+size>c.x&&y<c.y+10&&y+size>c.y;}
  function withinCommons(state,x,y,size){const c=state.commons;return c&&x>=c.x&&y>=c.y&&x+size<=c.x+10&&y+size<=c.y+10;}
  function neighbors(k){const [x,y]=k.split(',').map(Number);return [[x-1,y],[x+1,y],[x,y-1],[x,y+1]].filter(p=>inside(...p)).map(p=>key(...p));}
  function adjacent(building,layer){return cells(building).some(k=>neighbors(k).some(n=>Object.hasOwn(layer,n)));}
  function groups(layer){const remaining=new Set(Object.keys(layer)),result=[];while(remaining.size){const todo=[remaining.values().next().value],group=[];remaining.delete(todo[0]);while(todo.length){const k=todo.pop();group.push(k);for(const n of neighbors(k))if(remaining.delete(n))todo.push(n);}result.push(group);}return result;}
  function spans(group,horizontal){return group.some(k=>Number(k.split(',')[horizontal?0:1])===0)&&group.some(k=>Number(k.split(',')[horizontal?0:1])===(horizontal?WIDTH:HEIGHT)-1);}
  function touchesAll(group){return spans(group,true)&&spans(group,false);}
  function gap(a,b){const dx=Math.max(0,a.x-(b.x+b.size-1),b.x-(a.x+a.size-1));const dy=Math.max(0,a.y-(b.y+b.size-1),b.y-(a.y+a.size-1));return dx+dy;}
  function connected(layer){const g=groups(layer);return g.length===1;}
  function block2(layer){return Object.keys(layer).some(k=>{const[x,y]=k.split(',').map(Number);return layer[key(x+1,y)]!==undefined&&layer[key(x,y+1)]!==undefined&&layer[key(x+1,y+1)]!==undefined;});}
  function riverValid(layer){const g=groups(layer);if(g.length!==1)return false;const horizontal=spans(g[0],true),vertical=spans(g[0],false);if(!horizontal&&!vertical)return false;const wide=axis=>{const counts={};for(const k of g[0]){const n=k.split(',')[axis];counts[n]=(counts[n]||0)+1;}return Math.max(...Object.values(counts))<=3;};return horizontal&&wide(0)||vertical&&wide(1);}
  function counts(state){const result={};for(const b of state.structures)result[b.type]=(result[b.type]||0)+1;return result;}
  function placed(state,type){return state.structures.filter(b=>b.type===type&&b.born===state.round).length;}
  function allowance(state,type){return ROUNDS[state.round].add[type]||0;}
  function buildingError(state,type,x,y,movingId=null){
    const def=TYPES[type];if(!def||!inside(x,y,def.size))return 'Keep the whole building inside the board.';
    if(!movingId&&type!=='trees'&&placed(state,type)>=allowance(state,type))return 'You have placed all of this building for this round.';
    const existing=state.structures.find(b=>b.id===movingId);
    if(state.round<3&&onCommons(state,x,y,def.size))return 'The commons are protected until Round 3.';
    const candidate={x,y,size:def.size};
    for(const k of cells(candidate)){const [cx,cy]=k.split(',').map(Number);const occupant=at(state,cx,cy);if(occupant&&occupant.id!==movingId)return 'Another building occupies that space.';for(const layer of ['river','canal','road','rail1','rail2'])if(state.terrain[layer][k]!==undefined)return 'Buildings need clear land. Leave waterways and transport routes open.';}
    if(type==='factory'&&state.round<11&&!adjacent(candidate,state.terrain.river))return 'This factory must touch the river bank. Canal water cannot power it.';
    if(type==='manor'&&((!movingId&&state.round===3)||existing?.born===3)&&!withinCommons(state,x,y,def.size))return 'The nice house from Round 3 belongs entirely inside the former commons.';
    if(type==='tenement'&&((!movingId&&state.round===7)||existing?.born===7)&&!state.structures.some(b=>b.type==='factory'&&gap(candidate,b)<=5))return 'Place this tenement within five squares of a factory.';
    return null;
  }
  function place(state,type,x,y,movingId=null){const error=buildingError(state,type,x,y,movingId);if(error)return error;if(movingId){const b=state.structures.find(b=>b.id===movingId);b.x=x;b.y=y;}else state.structures.push({id:state.nextId++,type,x,y,size:TYPES[type].size,born:state.round});return null;}
  function availableTools(state){return [...Object.keys(ROUNDS[state.round].add),...(ROUNDS[state.round].tools||[]),'move','erase',...(state.round===9?['demolish']:[])];}
  function paint(state,tool,x,y){
    if(!inside(x,y))return 'Stay inside the board.';
    if(state.finished)return 'Your game is complete. Start a new village to play again.';
    if(TYPES[tool])return place(state,tool,x,y);
    if(tool==='move')return 'Select a building, then its new location.';
    const k=key(x,y),b=at(state,x,y);
    if(tool==='demolish'){
      if(state.round!==9)return 'Demolition belongs to Round 9.';
      if(state.removed.length>=5)return 'All five houses have been demolished.';
      if(!b||b.type!=='house')return 'Choose an ordinary house to demolish.';
      state.removed.push(clone(b));state.structures=state.structures.filter(q=>q.id!==b.id);return null;
    }
    if(tool==='erase'){
      if(b){if(b.born!==state.round&&b.type!=='trees')return 'Earlier buildings can be moved. Demolition of old houses is only allowed in Round 9.';state.structures=state.structures.filter(q=>q.id!==b.id);return null;}
      for(const layer of ['rail2','rail1','road','canal','river'])if(state.terrain[layer][k]===state.round){delete state.terrain[layer][k];if((layer==='road'||layer==='river'||layer==='canal')&&!(state.terrain.road[k]!==undefined&&(state.terrain.river[k]!==undefined||state.terrain.canal[k]!==undefined)))delete state.terrain.bridge[k];return null;}
      if(state.round===12&&state.terrain.bridge[k]?.upgraded===12){state.terrain.bridge[k]={...state.terrain.bridge[k],material:'wood',upgraded:null};return null;}
      if(state.round===0&&withinCommons(state,x,y,1)){state.commons=null;return null;}
      return 'Only additions from this round can be erased. Use Undo to reverse other changes.';
    }
    if(!availableTools(state).includes(tool))return 'That tool is not available in this round.';
    if(tool==='commons'){
      if(!inside(x,y,10))return 'The commons need a clear 10 × 10 area.';
      for(let cy=y;cy<y+10;cy++)for(let cx=x;cx<x+10;cx++){if(at(state,cx,cy)||['river','canal','road'].some(l=>state.terrain[l][key(cx,cy)]!==undefined))return 'Reserve ten by ten squares of empty land.';}
      state.commons={x,y};return null;
    }
    if(tool==='iron'){
      const bridge=state.terrain.bridge[k];if(!bridge)return 'Click an existing wooden road bridge.';
      if(bridge.material==='iron')return 'That crossing is already iron.';
      if(Object.values(state.terrain.bridge).some(v=>v.material==='iron'))return 'One bridge replacement is requested.';
      const group=groups(state.terrain.bridge).find(g=>g.includes(k));for(const cell of group)state.terrain.bridge[cell]={...state.terrain.bridge[cell],material:'iron',upgraded:12};return null;
    }
    if(b)return 'This square contains a building. Move it first.';
    if(state.round<3&&onCommons(state,x,y,1))return 'The commons are protected until Round 3.';
    const water=state.terrain.river[k]!==undefined||state.terrain.canal[k]!==undefined;
    if(tool==='bridge'&&!water)return 'A bridge must cross river or canal water.';
    if(tool==='river'&&state.terrain.canal[k]!==undefined||tool==='canal'&&state.terrain.river[k]!==undefined)return 'Keep the canal separate from the river.';
    const layer=tool==='bridge'?'road':tool;
    if(!state.terrain[layer])return 'Choose a building or drawing tool.';
    if(state.terrain[layer][k]!==undefined)return null;
    state.terrain[layer][k]=state.round;
    if((layer==='road'&&water)||(['river','canal'].includes(layer)&&state.terrain.road[k]!==undefined))state.terrain.bridge[k]={material:'wood',born:state.round};
    return null;
  }
  function tasks(state){
    const list=[],round=state.round,def=ROUNDS[round],t=state.terrain;
    const add=(id,label,done,manual=false)=>list.push({id,label,done:!!done,manual});
    for(const[type,target]of Object.entries(def.add))add(type,`${TYPES[type].name}: ${placed(state,type)} / ${target}`,placed(state,type)===target);
    if(round===0){
      add('name','Give your village a name',state.name.trim());
      add('river','One connected river, edge to opposite edge, at most 3 squares wide',riverValid(t.river));
      add('roads','One-square roads reaching north, south, east and west',groups(t.road).length===1&&touchesAll(groups(t.road)[0])&&!block2(t.road));
      add('intersection','The two roads intersect near the middle',Object.keys(t.road).some(k=>{const[x,y]=k.split(',').map(Number);return x>=9&&x<=19&&y>=10&&y<=21&&neighbors(k).every(n=>t.road[n]!==undefined);}));
      add('commons','Reserve a 10 × 10 commons',!!state.commons);
    }
    if(round===1){add('canal','One connected, one-square canal touching the coal mine',connected(t.canal)&&!block2(t.canal)&&state.structures.filter(b=>b.type==='mine').some(b=>adjacent(b,t.canal)));add('nearRiver','I kept the canal near the river',state.checks['1-nearRiver'],true);}
    if(round===3)add('manorLocation','Place this round’s nice house in the former commons',state.structures.some(b=>b.type==='manor'&&b.born===3&&withinCommons(state,b.x,b.y,b.size)));
    if([4,6,10].includes(round))add('waterPower','Every new factory touches the river bank',state.structures.filter(b=>b.type==='factory'&&b.born===round).every(b=>adjacent(b,t.river)));
    if(round===5)add('bridgeLimit','At most one additional bridge crossing (optional)',groups(Object.fromEntries(Object.entries(t.bridge).filter(([,v])=>v.born===5))).length<=1);
    if(round===7)add('walk','New tenements are within five squares of a factory',state.structures.filter(b=>b.type==='tenement'&&b.born===7).every(b=>state.structures.some(f=>f.type==='factory'&&gap(b,f)<=5)));
    if(round===8)add('churchWalk','I placed the church conveniently for workers',state.checks['8-churchWalk'],true);
    if(round===9)add('demolished',`Ordinary houses demolished: ${state.removed.length} / 5`,state.removed.length===5);
    if(round===11)add('smoke','4 × 4 smoke areas added to all factories automatically',true);
    if(round===12)add('iron','Replace one wooden bridge with an iron bridge',groups(Object.fromEntries(Object.entries(t.bridge).filter(([,v])=>v.material==='iron'))).length===1);
    if(round===14){add('railConnected','First railway is one connected network',connected(t.rail1));const targets=state.structures.filter(b=>b.type==='factory'||b.type==='mine');const touched=targets.filter(b=>adjacent(b,t.rail1));add('railTargets',`Railway touches factories and mines: ${touched.length} / ${targets.length}`,touched.length===targets.length);}
    if(round===17)add('eastWest','Second railway connects west edge to east edge',groups(t.rail2).length===1&&spans(groups(t.rail2)[0],true));
    return list;
  }
  function advance(state,overrideReason=''){
    const missing=tasks(state).filter(t=>!t.done);if(missing.length&&!overrideReason)return 'Finish the checklist before moving on.';
    if(overrideReason)state.teacherOverrides.push({round:state.round,reason:overrideReason,missing:missing.map(t=>t.label)});
    state.snapshots.push({round:state.round,name:state.name,structures:clone(state.structures),terrain:clone(state.terrain),commons:clone(state.commons),counts:counts(state)});
    if(state.round===20)state.finished=true;else state.round++;
    return null;
  }
  function validateImport(value){
    if(!value||value.format!=='nch-urban-game'||value.version!==1||!Number.isInteger(value.round)||value.round<0||value.round>20)throw Error('This is not a supported Urban Game save.');
    if(!Array.isArray(value.structures)||value.structures.length>1500||typeof value.name!=='string'||value.name.length>100)throw Error('The save contains invalid village data.');
    const ids=new Set(),occupied=new Set();
    function validateMap(map){if(!map||typeof map!=='object'||Array.isArray(map)||Object.keys(map).length>WIDTH*HEIGHT)throw Error('Invalid map layer.');for(const k of Object.keys(map)){if(!/^\d+,\d+$/.test(k)||!inside(...k.split(',').map(Number)))throw Error('Invalid board coordinates.');}}
    for(const b of value.structures){if(!TYPES[b.type]||b.size!==TYPES[b.type].size||!Number.isInteger(b.x)||!Number.isInteger(b.y)||!inside(b.x,b.y,b.size)||!Number.isInteger(b.id)||b.id<1||ids.has(b.id)||!Number.isInteger(b.born)||b.born<0||b.born>value.round)throw Error('Invalid building in save.');ids.add(b.id);for(const cell of cells(b)){if(occupied.has(cell))throw Error('Overlapping buildings in save.');occupied.add(cell);}}
    if(!value.terrain)throw Error('Missing map.');for(const l of ['river','canal','road','rail1','rail2','bridge'])validateMap(value.terrain[l]);
    for(const l of ['river','canal','road','rail1','rail2'])for(const [k,n]of Object.entries(value.terrain[l])){if(!Number.isInteger(n)||n<0||n>value.round||occupied.has(k))throw Error('Invalid route in save.');}
    for(const b of Object.values(value.terrain.bridge))if(!b||!['wood','iron'].includes(b.material))throw Error('Invalid bridge.');
    if(value.commons&&(!Number.isInteger(value.commons.x)||!Number.isInteger(value.commons.y)||!inside(value.commons.x,value.commons.y,10)))throw Error('Invalid commons.');
    if(!Array.isArray(value.answers)||value.answers.length!==3||value.answers.some(a=>typeof a!=='string'||a.length>20000))throw Error('Invalid reflections.');
    if(!Array.isArray(value.removed)||value.removed.length>5||!Array.isArray(value.snapshots)||value.snapshots.length>21||!Array.isArray(value.teacherOverrides)||value.teacherOverrides.length>21)throw Error('Invalid game history.');
    for(const s of value.snapshots){if(!Number.isInteger(s.round)||s.round<0||s.round>20||!Array.isArray(s.structures)||s.structures.length>1500||!s.terrain)throw Error('Invalid timeline.');for(const l of ['river','canal','road','rail1','rail2','bridge'])validateMap(s.terrain[l]);for(const b of s.structures)if(!TYPES[b.type]||b.size!==TYPES[b.type].size||!Number.isInteger(b.x)||!Number.isInteger(b.y)||!inside(b.x,b.y,b.size))throw Error('Invalid timeline building.');if(s.commons&&(!Number.isInteger(s.commons.x)||!Number.isInteger(s.commons.y)||!inside(s.commons.x,s.commons.y,10)))throw Error('Invalid timeline commons.');}
    for(const ruling of value.teacherOverrides)if(!ruling||!Number.isInteger(ruling.round)||ruling.round<0||ruling.round>20||typeof ruling.reason!=='string'||ruling.reason.length>1000)throw Error('Invalid teacher ruling.');
    const safe=fresh();for(const field of Object.keys(safe))if(Object.hasOwn(value,field))safe[field]=clone(value[field]);for(const snapshot of safe.snapshots)snapshot.counts=counts(snapshot);safe.nextId=Math.max(0,...safe.structures.map(b=>b.id))+1;safe.checks=value.checks&&typeof value.checks==='object'?clone(value.checks):{};safe.sourceDeck=value.sourceDeck===1?1:0;safe.questionSet=value.questionSet==='slides'?'slides':'board';safe.finished=!!value.finished&&safe.round===20;return safe;
  }
  root.UrbanRules={WIDTH,HEIGHT,TYPES,ROUNDS,TOOL_NAMES,key,inside,clone,fresh,cells,at,onCommons,withinCommons,neighbors,adjacent,groups,spans,gap,counts,placed,allowance,buildingError,place,availableTools,paint,tasks,advance,validateImport};
  if(typeof module!=='undefined')module.exports=root.UrbanRules;
})(globalThis);

