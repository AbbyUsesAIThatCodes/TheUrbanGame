import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { buildingModel, clearGroup, tileMesh } from './models.js';
import { STORAGE, PREVIOUS_STORAGE, LEGACY_STORAGE, LAST_ROUND, preparedVillage, blankVillage, validateReview, advanceReview } from './review-state.js';

import { bridgeModel, railwayModel, smokeModel, smokeBounds } from './transport.js';
import { roundSource, reflectionQuestions } from './source-content.js';

const R=globalThis.UrbanRules,$=id=>document.getElementById(id),W=R.WIDTH,H=R.HEIGHT;
const sourceDecks=await (await fetch('recovered/sources.json')).json();
let review=preparedVillage(),undo=[],redo=[],selected='inspect',mode='pan',movingId=null,active=null,hover=null,inspectedId=null,inspectedType='mine',viewMode='3d',inspectionClick=null;
let loadNotice='',loadError=false,migratedLegacy=false;
const navigationPointers=new Map();
try{const saved=localStorage.getItem(STORAGE),legacy=saved?null:(localStorage.getItem(PREVIOUS_STORAGE)||localStorage.getItem(LEGACY_STORAGE));if(saved||legacy){review=validateReview(JSON.parse(saved||legacy));migratedLegacy=!!legacy;}}catch(e){loadError=true;loadNotice='The previous review save could not be opened. It has not been overwritten; use Save & Open to choose a backup.';}
const state=()=>review.state;
const titleCase=text=>text.replace(/\b\w/g,c=>c.toUpperCase());
const toolName=tool=>titleCase(R.TYPES[tool]?.name||R.TOOL_NAMES[tool]||tool);
const escape=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function status(text,error=false){$('status').textContent=text;$('status').classList.toggle('error',error);}
function persist(){try{localStorage.setItem(STORAGE,JSON.stringify(review));}catch(e){status('Browser saving is unavailable. Download a review save before leaving.',true);}}
function remember(before){if(JSON.stringify(before)!==JSON.stringify(review)){undo.push(before);if(undo.length>50)undo.shift();redo=[];persist();}updateUndo();}
function updateUndo(){$('undoButton').disabled=!undo.length;$('redoButton').disabled=!redo.length;}
function change(action){finishInteraction();const before=R.clone(review);const error=action();if(error){status(error,true);return false;}remember(before);renderAll();return true;}

let renderer;
try{renderer=new T.WebGLRenderer({antialias:true,alpha:false});}catch(e){$('loading').textContent='This 3D review needs WebGL 2. The preserved 2D game remains available.';throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.28;
renderer.domElement.id='villageCanvas';renderer.domElement.tabIndex=0;renderer.domElement.setAttribute('aria-label','3D village. Choose a build tile and click the board. Use Pan and Inspect, Rotate, Overhead, and zoom controls to explore.');
$('town').append(renderer.domElement);$('loading').remove();
const canvas=renderer.domElement,scene=new T.Scene();scene.background=new T.Color('#d0d9c3');scene.fog=new T.Fog('#d0d9c3',90,190);
const camera=new T.OrthographicCamera(-35,35,23,-23,.1,250);
// Orthographic screen-space panning follows the pointer equally on both axes at every angle/zoom.
// Direct movement avoids damping lag and stops immediately when a gesture ends.
const controls=new OrbitControls(camera,canvas);controls.enableDamping=false;controls.screenSpacePanning=true;controls.minZoom=.55;controls.maxZoom=10;controls.maxPolarAngle=Math.PI*.43;controls.minPolarAngle=.15;controls.zoomToCursor=true;controls.rotateSpeed=.65;controls.panSpeed=1;controls.maxTargetRadius=35;
scene.add(new T.HemisphereLight('#fff8df','#81946f',2.3));
const sun=new T.DirectionalLight('#fff0cf',3.1);sun.position.set(-18,38,15);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-27,right:27,top:27,bottom:-27,near:.5,far:95});sun.shadow.bias=-.0005;sun.shadow.normalBias=.025;scene.add(sun);
const surround=new T.Mesh(new T.PlaneGeometry(500,500),new T.MeshStandardMaterial({color:'#cbd5bc',roughness:1}));surround.rotation.x=-Math.PI/2;surround.position.y=-.76;surround.receiveShadow=true;scene.add(surround);
const base=tileMesh(W+.5,H+.5,.55,'#9a805d');base.position.y=-.58;scene.add(base);
const ground=tileMesh(W,H,.055,'#aebd87');ground.position.y=-.055;scene.add(ground);
const gridPoints=[];for(let x=0;x<=W;x++)gridPoints.push(x-W/2,.013,-H/2,x-W/2,.013,H/2);for(let y=0;y<=H;y++)gridPoints.push(-W/2,.013,y-H/2,W/2,.013,y-H/2);
const gridGeometry=new T.BufferGeometry();gridGeometry.setAttribute('position',new T.Float32BufferAttribute(gridPoints,3));const grid=new T.LineSegments(gridGeometry,new T.LineBasicMaterial({color:'#7e9464',transparent:true,opacity:.35}));grid.position.y=.06;scene.add(grid);
const townGroup=new T.Group();scene.add(townGroup);
const hoverMaterial=new T.MeshBasicMaterial({color:'#ffdb87',transparent:true,opacity:.44,depthWrite:false});
const highlight=new T.Mesh(new T.BoxGeometry(1,.025,1),hoverMaterial);highlight.position.y=.08;highlight.visible=false;highlight.renderOrder=3;scene.add(highlight);
const raycaster=new T.Raycaster(),pointerVector=new T.Vector2(),groundPlane=new T.Plane(new T.Vector3(0,1,0),0);
function world(x,y,size=1){return [x+size/2-W/2,y+size/2-H/2];}
function renderTown(){
 clearGroup(townGroup);const s=state();
 for(const [layer,color] of [['road','#c2b18b'],['river','#6f9fa4'],['canal','#50888d']])for(const key of Object.keys(s.terrain[layer])){
  const [x,y]=key.split(',').map(Number),[wx,wz]=world(x,y);const tile=tileMesh(.98,.98,layer==='road'?.033:.045,color);tile.position.set(wx,.012,wz);townGroup.add(tile);
 }
 for(const [key,bridge] of Object.entries(s.terrain.bridge)){const [x,y]=key.split(',').map(Number),[wx,wz]=world(x,y),horizontal=Object.hasOwn(s.terrain.road,(x-1)+','+y)||Object.hasOwn(s.terrain.road,(x+1)+','+y),model=bridgeModel(bridge,horizontal);model.position.set(wx,0,wz);townGroup.add(model);}
 for(const [number,layer] of [[1,s.terrain.rail1],[2,s.terrain.rail2]])for(const key of Object.keys(layer)){const [x,y]=key.split(',').map(Number),[wx,wz]=world(x,y),water=Object.hasOwn(s.terrain.river,key)||Object.hasOwn(s.terrain.canal,key),model=railwayModel(layer,key,water,number);model.position.set(wx,0,wz);townGroup.add(model);}
 if(s.round>=11)for(const building of s.structures.filter(b=>b.type==='factory')){const model=smokeModel(building,s.round),bounds=smokeBounds(building),[x,z]=world(bounds.x,bounds.y,4);model.position.set(x,0,z);townGroup.add(model);}

 if(s.commons){const [wx,wz]=world(s.commons.x,s.commons.y,10);const reserve=tileMesh(9.94,9.94,.015,s.round<3?'#bdb787':'#b5bf94');reserve.position.set(wx,.025,wz);townGroup.add(reserve);if(s.round<3)for(let i=0;i<=10;i++)for(const [x,z] of [[wx-5+i,wz-5],[wx-5+i,wz+5],[wx-5,wz-5+i],[wx+5,wz-5+i]]){const post=tileMesh(.075,.075,.27,'#ad9461');post.position.set(x,.04,z);townGroup.add(post);}}
 for(const building of s.structures){const model=buildingModel(building.type,s.round),[x,z]=world(building.x,building.y,building.size);model.position.set(x,.07,z);model.userData.buildingId=building.id;townGroup.add(model);}
 updateHighlight();
}
function cellAt(event){const rect=canvas.getBoundingClientRect();pointerVector.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointerVector,camera);const point=raycaster.ray.intersectPlane(groundPlane,new T.Vector3());return point?{x:Math.floor(point.x+W/2),y:Math.floor(point.z+H/2)}:null;}
function buildingAtPointer(event){const cell=cellAt(event);for(const hit of raycaster.intersectObjects(townGroup.children,true)){let object=hit.object;while(object&&object!==townGroup){if(object.userData.buildingId)return state().structures.find(b=>b.id===object.userData.buildingId);object=object.parent;}}return cell&&R.at(state(),cell.x,cell.y);}
function updateHighlight(){
 if(!hover||!R.inside(hover.x,hover.y)||mode!=='build'||review.reviewComplete){highlight.visible=false;return;}
 const moving=state().structures.find(b=>b.id===movingId),size=moving?.size||R.TYPES[selected]?.size||(selected==='commons'?10:1);
 const type=moving?.type||selected;const error=R.TYPES[type]?R.buildingError(state(),type,hover.x,hover.y,movingId):!R.inside(hover.x,hover.y,size);
 const [x,z]=world(hover.x,hover.y,size);highlight.scale.set(size,1,size);highlight.position.set(x,.082,z);hoverMaterial.color.set(error?'#c75e49':'#f3d782');highlight.visible=true;
}
function setMode(next){finishInteraction();mode=next;controls.mouseButtons.LEFT=next==='build'?null:next==='rotate'?T.MOUSE.ROTATE:T.MOUSE.PAN;controls.mouseButtons.MIDDLE=T.MOUSE.ROTATE;controls.mouseButtons.RIGHT=viewMode==='overhead'?T.MOUSE.PAN:T.MOUSE.ROTATE;controls.touches.ONE=next==='rotate'?T.TOUCH.ROTATE:T.TOUCH.PAN;controls.touches.TWO=T.TOUCH.DOLLY_PAN;$('panMode').setAttribute('aria-pressed',String(next==='pan'));$('rotateMode').setAttribute('aria-pressed',String(next==='rotate'));canvas.style.cursor=next==='build'?'crosshair':next==='rotate'?'grab':'grab';updateHighlight();}
function setView(view,frame=false){finishInteraction();viewMode=view;controls.enableDamping=false;controls.minPolarAngle=view==='overhead'?.0001:.15;controls.maxPolarAngle=view==='overhead'?.0001:Math.PI*.43;controls.enableRotate=view!=='overhead';if(frame)controls.target.set(0,0,0);const target=controls.target.clone();camera.up.set(0,1,0);camera.position.copy(target).add(view==='overhead'?new T.Vector3(0,65,.0065):new T.Vector3(32,39,38));if(frame)camera.zoom=1;resize();controls.update();controls.enableDamping=false;$('overheadButton').setAttribute('aria-pressed',String(view==='overhead'));$('isometricButton').setAttribute('aria-pressed',String(view==='3d'));document.querySelector('.north').textContent=view==='overhead'?'N ↑':'3D';setMode(mode==='rotate'&&view==='overhead'?'pan':mode);updateZoom();}
function updateZoom(){$('zoomLabel').textContent=Math.round(camera.zoom*100)+'%';}
function resize(){document.documentElement.style.setProperty('--panel-top',Math.ceil(document.querySelector('.topbar').getBoundingClientRect().bottom+12)+'px');const w=innerWidth,h=innerHeight,half=Math.max(23,(viewMode==='overhead'?W+3:45)/(2*w/h));camera.left=-half*w/h;camera.right=half*w/h;camera.top=half;camera.bottom=-half;camera.updateProjectionMatrix();renderer.setSize(w,h);}
function zoomBy(factor){camera.zoom=Math.max(controls.minZoom,Math.min(controls.maxZoom,camera.zoom*factor));camera.updateProjectionMatrix();updateZoom();}
const orbitDirection=new T.Vector3(),groundTarget=new T.Vector3(),cameraCorrection=new T.Vector3();
function keepOrbitAboveBoard(){
 // Orthographic movement along the view ray leaves the screen image unchanged.
 // Project the orbit pivot back to ground so later rotations cannot go below the board.
 camera.getWorldDirection(orbitDirection);
 groundTarget.copy(controls.target).addScaledVector(orbitDirection,-controls.target.y/orbitDirection.y);
 groundTarget.y=0;groundTarget.clampLength(0,35);
 cameraCorrection.copy(groundTarget).sub(controls.target);
 controls.target.copy(groundTarget);camera.position.add(cameraCorrection);camera.updateMatrixWorld();
}
new ResizeObserver(resize).observe(document.querySelector('.topbar'));
controls.addEventListener('change',keepOrbitAboveBoard);
controls.addEventListener('change',updateZoom);window.addEventListener('resize',resize);resize();setView('3d',true);
renderer.setAnimationLoop(()=>{controls.update();renderer.render(scene,camera);});

function inspect(type,id=null){inspectedType=type;inspectedId=id;const def=R.TYPES[type];if(!def)return;$('inspectTitle').textContent=toolName(type);$('inspectArt').style.backgroundPosition=`${def.art%4/3*100}% ${Math.floor(def.art/4)/3*100}%`;$('inspectArt').setAttribute('aria-label','Preserved original '+def.name+' artwork');$('inspectDescription').textContent=`${def.size===1?'One square':`Four squares (${def.size} × ${def.size})`} on the original board. The town uses a distinct 3D placeholder; this is the original illustration.`;$('focusBuilding').disabled=!state().structures.some(b=>id?b.id===id:b.type===type);}
function chooseTool(tool){if(review.reviewComplete){status(`Round ${LAST_ROUND} is complete. Explore the town or open your saved review.`);return;}selected=tool;movingId=null;setMode('build');if(R.TYPES[tool])inspect(tool);renderPalette();status(tool==='move'?'Click a building, then click its new upper-left square. Escape cancels.':tool==='erase'?'Erase additions from this round. Earlier buildings remain protected.':tool==='demolish'?'Click an ordinary house to demolish it. Exactly five are required; Undo can restore it.':`${toolName(tool)} selected. Click its upper-left square${['river','road','canal'].includes(tool)?' or drag a continuous route':''}.`);}
const drawingTools=new Set(['river','road','canal','bridge','erase','rail1','rail2']);
function applyCell(cell){if(!cell||!R.inside(cell.x,cell.y)||review.reviewComplete)return false;
 if(selected==='move'){
  if(!movingId){const b=R.at(state(),cell.x,cell.y);if(b){movingId=b.id;inspect(b.type,b.id);status('Choose the new upper-left square. Escape cancels.');}else status('Choose a building to move.',true);return false;}
  const b=state().structures.find(b=>b.id===movingId);const error=R.place(state(),b.type,cell.x,cell.y,movingId);if(error){status(error,true);return false;}movingId=null;
 }else{const error=R.paint(state(),selected,cell.x,cell.y);if(error){status(error,true);return false;}}
 status(`${toolName(selected)} · Column ${cell.x+1}, Row ${cell.y+1}`);renderTown();renderTasks();inspect(inspectedType,inspectedId);return true;
}
function finishInteraction(event){
 finishNavigation(event);
 if(!active)return;if(event?.pointerId!==undefined&&event.pointerId!==active.id)return;
 const ended=active;active=null; // Clear before releasing capture: lostpointercapture may fire immediately.
 try{if(canvas.hasPointerCapture(ended.id))canvas.releasePointerCapture(ended.id);}catch(e){}
 remember(ended.before);renderPalette();renderTasks();updateHighlight();
}
function finishNavigation(event){
 if(!navigationPointers.size||event?.pointerId!==undefined&&!navigationPointers.has(event.pointerId))return;
 // Normal release remains with OrbitControls, including its two-finger transition.
 if(event?.type==='pointerup'){navigationPointers.delete(event.pointerId);return;}
 const pointers=[...navigationPointers.keys()];navigationPointers.clear();inspectionClick=null;
 // Public disconnect/connect clears an interrupted orbit without altering the camera or village.
 controls.disconnect();
 for(const id of pointers)try{if(canvas.hasPointerCapture(id))canvas.releasePointerCapture(id);}catch(e){}
 controls.connect(canvas);canvas.style.cursor=mode==='build'?'crosshair':'grab';
}
canvas.addEventListener('pointerdown',event=>{
 if(event.button===1)event.preventDefault();
 if(event.button!==0||mode!=='build'){
  if(active)finishInteraction();
  navigationPointers.set(event.pointerId,{mask:event.button===1?4:event.button===2?2:1});
  inspectionClick=event.button===0?{x:event.clientX,y:event.clientY}:null;return;
 }
 if(!event.isPrimary)return;event.preventDefault();event.stopImmediatePropagation();finishInteraction();canvas.focus({preventScroll:true});
 let cell=cellAt(event);if(selected==='move'&&!movingId){const b=buildingAtPointer(event);if(b)cell={x:b.x,y:b.y};}hover=cell;if(!cell||!R.inside(cell.x,cell.y))return;
 active={id:event.pointerId,before:R.clone(review),last:cell};canvas.setPointerCapture(event.pointerId);applyCell(cell);updateHighlight();
},true);
canvas.addEventListener('pointermove',event=>{
 const navigation=navigationPointers.get(event.pointerId);
 if(navigation&&event.pointerType==='mouse'&&(event.buttons&navigation.mask)===0){finishNavigation(event);event.stopImmediatePropagation();return;}
 hover=cellAt(event);$('pointerCell').textContent=hover&&R.inside(hover.x,hover.y)?`Column ${hover.x+1}, Row ${hover.y+1}`:'Pan to Explore · Wheel to Zoom';
 if(active&&event.pointerId===active.id){
  if(event.pointerType==='mouse'&&event.buttons!==1){finishInteraction(event);event.stopImmediatePropagation();return;}
  if(drawingTools.has(selected)&&hover&&R.inside(hover.x,hover.y)){
   let {x,y}=active.last;for(let steps=0;(x!==hover.x||y!==hover.y)&&steps<W+H;steps++){if(x!==hover.x)x+=Math.sign(hover.x-x);else y+=Math.sign(hover.y-y);applyCell({x,y});}active.last=hover;
  }
 }
 updateHighlight();
},true);
canvas.addEventListener('pointerup',event=>{
 if(active){event.stopImmediatePropagation();finishInteraction(event);return;}
 if(event.button===0&&mode==='pan'&&inspectionClick&&Math.hypot(event.clientX-inspectionClick.x,event.clientY-inspectionClick.y)<5){const b=buildingAtPointer(event);if(b){inspect(b.type,b.id);status(`${toolName(b.type)} · Column ${b.x+1}, Row ${b.y+1}. Use Focus for a closer look.`);}}
 inspectionClick=null;
},true);
canvas.addEventListener('pointercancel',finishInteraction,true);canvas.addEventListener('lostpointercapture',finishInteraction,true);
canvas.addEventListener('pointerleave',()=>{if(!active){hover=null;updateHighlight();}});
canvas.addEventListener('contextmenu',event=>event.preventDefault());canvas.addEventListener('dragstart',event=>event.preventDefault());
// Prevent the browser's middle-button autoscroll and auxiliary-click defaults.
for(const type of ['mousedown','auxclick'])canvas.addEventListener(type,event=>{if(event.button===1)event.preventDefault();});
window.addEventListener('pointerup',finishInteraction,true);window.addEventListener('blur',()=>{finishInteraction();inspectionClick=null;});
document.addEventListener('visibilitychange',()=>{if(document.hidden){finishInteraction();inspectionClick=null;}});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){finishInteraction();movingId=null;hover=null;updateHighlight();if(!$('modal').open)status('Placement ended. Your village remains saved.');}if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='z'&&!['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)){event.preventDefault();event.shiftKey?redoAction():undoAction();}});

function renderTasks(){const tasks=R.tasks(state()),done=tasks.filter(t=>t.done).length;$('checklist').replaceChildren();for(const task of tasks){const row=document.createElement('div');row.className='task'+(task.done?' done':'');if(task.manual){const label=document.createElement('label'),input=document.createElement('input'),span=document.createElement('span');input.type='checkbox';input.checked=task.done;input.disabled=review.reviewComplete;input.onchange=()=>change(()=>{state().checks[state().round+'-'+task.id]=input.checked;return null;});span.textContent=task.label;label.append(input,span);row.append(label);}else{const check=document.createElement('span');check.className='check';check.textContent=task.done?'✓':'';const text=document.createElement('span');text.textContent=task.label;row.append(check,text);}$('checklist').append(row);}$('progressNumbers').textContent=`${done} / ${tasks.length}`;$('progressText').textContent=review.reviewComplete?`Round ${LAST_ROUND} Complete`:'Original Requirements';$('progress').value=done;$('progress').max=tasks.length;$('nextButton').innerHTML=review.reviewComplete?'Review Complete <span>✓</span>':state().round===0?'Begin Round 1 <span>→</span>':done===tasks.length&&state().round<LAST_ROUND?`Begin Round ${state().round+1} <span>→</span>`:`Complete Round ${state().round} <span>→</span>`;$('starterButton').hidden=state().round!==0;}
function renderPalette(){const tools=R.availableTools(state()).filter(t=>!['move','erase'].includes(t));$('palette').replaceChildren();for(const tool of tools){const button=document.createElement('button');button.type='button';button.className='tile'+(mode==='build'&&selected===tool?' active':'');button.dataset.tool=tool;button.setAttribute('aria-pressed',String(mode==='build'&&selected===tool));const def=R.TYPES[tool];if(def){const art=document.createElement('span');art.className='art';art.style.backgroundPosition=`${def.art%4/3*100}% ${Math.floor(def.art/4)/3*100}%`;const size=document.createElement('span');size.className='size';size.textContent=def.size+' × '+def.size;button.append(art,size);}else{const symbol=document.createElement('span');symbol.className='symbol';symbol.textContent={river:'≈',road:'╋',commons:'10 × 10',canal:'∿',bridge:'═'}[tool]||'+';button.append(symbol);}const name=document.createElement('span');name.className='name';name.textContent=toolName(tool);button.append(name);if(def&&tool!=='trees'){const count=document.createElement('span');count.className='count';count.textContent=`${R.placed(state(),tool)} / ${R.allowance(state(),tool)} This Round`;button.append(count);}button.onclick=()=>chooseTool(tool);button.disabled=review.reviewComplete;$('palette').append(button);}$('moveButton').disabled=review.reviewComplete;$('eraseButton').disabled=review.reviewComplete;}
function renderSource(){const info=roundSource(sourceDecks,state().round,state().sourceDeck||0);$('storyText').textContent=info.text;$('sourceDeck').value=String(info.deckIndex);$('sourceDeck').options[1].disabled=state().round>10;$('sourceReference').textContent=`Original ${info.deckIndex?'Rounds 1-10':'World History'} Deck · Slide ${info.number}${state().round===0?' · Commons: Slide 6':''}`;$('sourceNotice').textContent=state().round>10?'Rounds 11–20 are supplied by the full World History deck.':'';$('sourceImages').replaceChildren();for(const [i,path] of info.images.entries()){const a=document.createElement('a'),img=document.createElement('img');a.href=path;a.target='_blank';a.rel='noopener';img.src=path;img.alt=`Original classroom image ${i+1}, World History slide ${info.imageSlide||info.number}`;img.loading='lazy';a.append(img);$('sourceImages').append(a);}}

function renderAll(){const s=state(),def=R.ROUNDS[s.round];$('era').textContent=def.year;$('phase').textContent=review.reviewComplete?`Round ${LAST_ROUND} Complete`:s.round===0?'Establish Your Village':`Round ${s.round} · ${titleCase(def.title)}`;if(document.activeElement!==$('villageName'))$('villageName').value=s.name;$('roundHint').textContent=def.hint||'Add the buildings listed in the original checklist.';renderTown();renderTasks();renderPalette();renderSource();inspect(inspectedType,inspectedId);updateUndo();}
function undoAction(){finishInteraction();if(!undo.length)return;redo.push(R.clone(review));review=undo.pop();movingId=null;persist();renderAll();status('Last change undone.');}
function redoAction(){finishInteraction();if(!redo.length)return;undo.push(R.clone(review));review=redo.pop();movingId=null;persist();renderAll();status('Change restored.');}
function setTab(tab){$('taskPanel').hidden=tab!=='task';$('sourcePanel').hidden=tab!=='source';$('taskTab').setAttribute('aria-pressed',String(tab==='task'));$('sourceTab').setAttribute('aria-pressed',String(tab==='source'));}
$('taskTab').onclick=()=>setTab('task');$('sourceTab').onclick=()=>setTab('source');$('sourceDeck').onchange=()=>{state().sourceDeck=Number($('sourceDeck').value);persist();renderSource();};
$('villageName').oninput=()=>{state().name=$('villageName').value;persist();renderTasks();};
$('starterButton').onclick=()=>change(()=>{const s=state();if(s.structures.length||s.commons||Object.values(s.terrain).some(layer=>Object.keys(layer).length))return 'Starter geography needs an empty board.';for(let y=0;y<H;y++)R.paint(s,'river',8,y);for(let x=0;x<W;x++)R.paint(s,'road',x,16);for(let y=0;y<H;y++)R.paint(s,'road',14,y);return R.paint(s,'commons',18,2);});
$('nextButton').onclick=()=>{finishInteraction();if(review.reviewComplete){showComplete();return;}if(change(()=>advanceReview(review))){selected='inspect';setMode('pan');renderAll();if(review.reviewComplete)showComplete();else status(`Round ${state().round} is ready. Read the original words, then build.`);}};
$('panMode').onclick=()=>{setMode('pan');renderPalette();status('Drag to pan. Click a building to inspect its original artwork. Wheel to zoom.');};$('rotateMode').onclick=()=>{if(viewMode==='overhead')setView('3d');setMode('rotate');renderPalette();status('Drag to rotate around the village. Wheel to zoom.');};
$('overheadButton').onclick=()=>setView('overhead');$('isometricButton').onclick=()=>setView('3d');$('fitButton').onclick=()=>setView(viewMode,true);$('zoomIn').onclick=()=>zoomBy(1.3);$('zoomOut').onclick=()=>zoomBy(1/1.3);$('undoButton').onclick=undoAction;$('redoButton').onclick=redoAction;$('moveButton').onclick=()=>chooseTool('move');$('eraseButton').onclick=()=>chooseTool('erase');
$('focusBuilding').onclick=()=>{const b=state().structures.find(b=>inspectedId?b.id===inspectedId:b.type===inspectedType);if(!b)return;finishInteraction();const [x,z]=world(b.x,b.y,b.size),target=new T.Vector3(x,.4,z),delta=target.clone().sub(controls.target);controls.target.copy(target);camera.position.add(delta);camera.zoom=4;camera.updateProjectionMatrix();controls.update();setMode('pan');renderPalette();status(`A closer look at the ${toolName(b.type)}. Frame Village restores the whole board.`);};
for(const name of ['journal','tools'])$(name+'Toggle').onclick=()=>{const collapsed=$(name+'Panel').classList.toggle('collapsed');$(name+'Toggle').setAttribute('aria-expanded',String(!collapsed));$(name+'Toggle').querySelector('.collapse-mark').textContent=collapsed?'+':'−';};

let modalFocus=null;
function showModal(title,body){finishInteraction();modalFocus=document.activeElement;$('modalTitle').textContent=title;$('modalBody').innerHTML=body;if(!$('modal').open)$('modal').showModal();}
function closeModal(){$('modal').close();modalFocus?.focus?.();}
$('closeModal').onclick=closeModal;
function downloadSave(){finishInteraction();const url=URL.createObjectURL(new Blob([JSON.stringify(review,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='Urban-Game-3D-Review-Round-'+state().round+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status('Review save downloaded. The accepted 2D game save is separate.');}
function confirmNew(prepared){showModal(prepared?'Open Prepared Round 1?':'Start Blank Setup?',`<p>This replaces the village in this local review only. Download a backup first if you want to keep it.</p><div class="actions"><button id="backupFirst">Download Current Save</button><button id="confirmNew" class="primary">${prepared?'Open Prepared Village':'Start Blank Setup'}</button></div>`);$('backupFirst').onclick=downloadSave;$('confirmNew').onclick=()=>{review=prepared?preparedVillage():blankVillage();undo=[];redo=[];movingId=null;selected='inspect';setMode('pan');persist();renderAll();setView('3d',true);setTab('task');closeModal();status(prepared?'Prepared setup is complete. Build the canal and nice house for Round 1.':'Blank setup is ready. Follow the original checklist.');};}
$('saveButton').onclick=()=>{showModal('Save & Open Your Review',`<p class="notice">This review uses its own browser save. It does not read or overwrite your accepted 2D village.</p><div class="actions"><button id="downloadReview" class="primary">Download Review Save</button><button id="openReview">Open Review Save</button></div><h3>Choose A Starting Point</h3><p>The prepared village meets every original setup requirement. Its layout is a review fixture, not a required classroom arrangement.</p><button id="preparedReview">Open Prepared Round 1</button><button id="blankReview">Start Blank Setup</button>`);$('downloadReview').onclick=downloadSave;$('openReview').onclick=()=>$('saveFile').click();$('preparedReview').onclick=()=>confirmNew(true);$('blankReview').onclick=()=>confirmNew(false);};
$('saveFile').onchange=async event=>{const file=event.target.files[0];event.target.value='';if(!file)return;try{if(file.size>8*1024*1024)throw Error('That save is too large.');const candidate=validateReview(JSON.parse(await file.text()));showModal('Open This Saved Review?',`<p>Open <strong>${escape(candidate.state.name||'Unnamed Village')}</strong> at ${candidate.state.round?'Round '+candidate.state.round:'Setup'}?</p><div class="actions"><button id="backupCurrent">Download Current Save</button><button id="confirmOpen" class="primary">Open Village</button></div>`);$('backupCurrent').onclick=downloadSave;$('confirmOpen').onclick=()=>{review=candidate;undo=[];redo=[];movingId=null;selected='inspect';setMode('pan');persist();renderAll();closeModal();status('Saved review opened.');};}catch(e){status(e.message,true);showModal('Could Not Open Save',`<p>${escape(e.message)}</p><p>Your current review has been kept.</p>`);}};
function showComplete(){status(`Round ${LAST_ROUND} complete. Explore your village and save your work.`);showModal(`Round ${LAST_ROUND} Complete`,`<p class="notice">You have completed every original requirement through Round ${LAST_ROUND}.</p><p>Explore the town, compare the original illustrations, and download your review save.</p><div class="actions"><button id="saveComplete" class="primary">Download Review Save</button><button id="exploreComplete">Explore Your Village</button></div>`);$('saveComplete').onclick=downloadSave;$('exploreComplete').onclick=closeModal;}

function buildDetails(){const m=globalThis.URBAN_REVIEW_BUILD;if(!m)return '';return `<h3>About This Build</h3><div id="buildDetails" style="overflow-wrap:anywhere;user-select:text"><p>${escape(m.display_label)}</p><p>${escape(m.identifier)}</p><p>Built ${escape(m.build_time_utc)}<br>Source ${escape(m.source_revision)}</p></div>`;}
$('guideButton').onclick=()=>showModal('Explore, Build, And Review',`<h3>Camera Controls</h3><ul><li><strong>Pan & Inspect:</strong> drag empty ground to move the view; click a building to inspect it.</li><li><strong>Rotate:</strong> drag to turn and tilt the town. Right-drag also rotates while building. Hold the middle mouse button and drag horizontally to orbit without switching tools.</li><li><strong>Zoom:</strong> use the wheel or + / −. Select <strong>Focus</strong> to examine a building closely.</li><li><strong>Overhead:</strong> a north-up, rotation-locked view for reliable square placement. <strong>Frame Village</strong> restores the whole board.</li><li>Collapse either floating panel using its title. On touch screens, select Pan before navigating and use two fingers to pan or zoom.</li></ul><h3>Building</h3><p>Choose a tile, then click its upper-left grid square. Drag for a continuous canal, river, or road. Move uses two clicks. Escape ends a placement gesture or cancels a move. Undo and Redo keep your changes reversible.</p><h3>Original Source Notes</h3><p>The full World History deck supplies the sequence. Setup uses slides 2 and 6; Rounds 1–5 use slides 9–13. The flat shaded former commons remains visible after Round 3 opens it for building. Original wording is available in the Chronicle. “Near the river” has no numeric distance in the source, so the original acknowledgement remains part of the checklist.</p><p>The original 29 × 32 grid and one-square / 2 × 2 footprints remain unchanged. The 3D models are clearly distinct placeholders. The original 2D illustrations are permanent artwork, preserved at larger viewing sizes. This review adds no money, scoring, or historical events.</p>${buildDetails()}`);
window.addEventListener('beforeunload',()=>{finishInteraction();if(!loadError)persist();});
try{const manifest=JSON.parse($('review-build-manifest').textContent);$('buildIdentity').textContent=manifest.display_label;globalThis.URBAN_REVIEW_BUILD=manifest;}catch(e){$('buildIdentity').textContent='Local Development Session';}
renderAll();if(innerWidth<720){$('journalToggle').click();$('toolsToggle').click();}if(loadError)status(loadNotice,true);else if(migratedLegacy){persist();status('Your earlier 3D village is ready to continue. Its original save is kept separately.');}else status(review.reviewComplete?`Round ${LAST_ROUND} complete. Explore your saved village.`:state().round===0?'Continue your setup using the original checklist.':`Round ${state().round} is ready. Follow the original checklist.`);

globalThis.__URBAN_REVIEW__={read:()=>R.clone(review),visuals:()=>townGroup.children.filter(o=>o.userData.smokeBounds||o.userData.railway||o.userData.bridgeMaterial).map(o=>({...o.userData,position:o.position.toArray()})),interaction:()=>({activePointer:active?.id??null,navigationPointers:[...navigationPointers.keys()],mode,selected,movingId}),camera:()=>({zoom:camera.zoom,position:camera.position.toArray(),target:controls.target.toArray(),viewMode,azimuth:controls.getAzimuthalAngle(),polar:controls.getPolarAngle()}),cellToScreen:(x,y)=>{const [wx,wz]=world(x,y),v=new T.Vector3(wx,.03,wz).project(camera);return {x:(v.x+1)/2*innerWidth,y:(1-v.y)/2*innerHeight};}};
