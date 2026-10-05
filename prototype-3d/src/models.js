import * as T from 'three';
const materials=new Map();
function mat(color){if(!materials.has(color))materials.set(color,new T.MeshStandardMaterial({color,roughness:.9,metalness:0}));return materials.get(color);}
function mesh(parent,geometry,color,x=0,y=0,z=0){const m=new T.Mesh(geometry,mat(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function box(g,w,h,d,c,x=0,y=h/2,z=0){return mesh(g,new T.BoxGeometry(w,h,d),c,x,y,z);}
function roof(g,w,d,h,base,color){
 const p=[-w/2,base,-d/2,w/2,base,-d/2,w/2,base,d/2,-w/2,base,d/2,0,base+h,-d/2,0,base+h,d/2];
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(p,3));geometry.setIndex([0,5,4,0,3,5,4,2,1,4,5,2,0,4,1,3,2,5]);geometry.computeVertexNormals();return mesh(g,geometry,color);
}
function tree(g,x,z,scale=1){box(g,.12*scale,.65*scale,.12*scale,'#78593c',x,.32*scale,z);mesh(g,new T.ConeGeometry(.35*scale,.8*scale,7),'#527347',x,.93*scale,z);mesh(g,new T.ConeGeometry(.28*scale,.63*scale,7),'#668b50',x,1.28*scale,z);}
function door(g,x,y,z,w=.15,h=.3){box(g,w,h,.025,'#574539',x,y,z);}
function windows(g, xs, y, z){for(const x of xs)box(g,.11,.13,.025,'#decb8e',x,y,z);}
export function buildingModel(type,round=0){
 const g=new T.Group();g.userData.type=type;
 if(type==='house'){
   box(g,.72,.55,.72,'#e0d0a4');roof(g,.86,.85,.38,.55,'#a76041');door(g,0,.16,.371);windows(g,[-.24,.24],.35,.371);box(g,.11,.39,.12,'#745743',.22,.87,-.17);
 }else if(type==='church'){
   box(g,.7,.76,.77,'#d4c8a5');roof(g,.82,.88,.35,.76,'#69766c');box(g,.27,1.35,.28,'#c6b995',0,.675,.23);mesh(g,new T.ConeGeometry(.245,.6,4),'#485950',0,1.62,.23).rotation.y=Math.PI/4;box(g,.045,.23,.045,'#bd9a53',0,2.0,.23);box(g,.15,.035,.04,'#bd9a53',0,2.04,.23);door(g,0,.2,.381,.18,.4);
 }else if(type==='cemetery'){
   box(g,.9,.08,.9,'#809671');for(const x of [-.23,.22])for(const z of [-.2,.23]){box(g,.2,.3,.065,'#b4b7a5',x,.23,z);mesh(g,new T.SphereGeometry(.1,8,5),'#b4b7a5',x,.37,z).scale.set(1,.55,.38);}box(g,.95,.07,.04,'#b7b69c',0,.09,.47);
 }else if(type==='store'){
   box(g,.78,.66,.68,'#d9c6a0');roof(g,.9,.8,.31,.66,'#75594e');door(g,0,.2,.35);windows(g,[-.25,.25],.39,.35);for(let i=0;i<6;i++)box(g,.145,.06,.23,i%2?'#f2dfad':'#9c6450',-.36+i*.145,.54,.365);box(g,.53,.16,.025,'#756247',0,.82,.42);
 }else if(type==='pub'){
   box(g,.78,.72,.76,'#c0a17b');roof(g,.92,.89,.34,.72,'#5e6354');box(g,.06,.74,.79,'#685440',-.3,.37);box(g,.06,.74,.79,'#685440',.3,.37);box(g,.81,.055,.79,'#685440',0,.51);door(g,0,.2,.391);windows(g,[-.2,.2],.55,.391);for(const x of [-.33,.33])mesh(g,new T.CylinderGeometry(.105,.115,.22,8),'#8a6944',x,.11,.38);box(g,.12,.38,.12,'#9b8063',-.2,1.02,-.2);
 }else if(type==='mine'){
   box(g,1.8,.13,1.8,'#a5a08b');for(const x of [-.45,.45])for(const z of [-.35,.35])box(g,.13,1.55,.13,'#786048',x,.83,z);box(g,1.12,.17,.9,'#66513e',0,1.57);const wheel=mesh(g,new T.TorusGeometry(.28,.07,6,14),'#494c44',0,1.62,0);wheel.rotation.y=Math.PI/2;box(g,.12,.65,.95,'#6d5741',0,.82,.08).rotation.z=.65;mesh(g,new T.ConeGeometry(.48,.48,7),'#48504a',-.48,.36,.51);mesh(g,new T.ConeGeometry(.35,.33,7),'#60675b',.47,.28,.5);box(g,.5,.06,1.36,'#61594b',0,.1,-.25);box(g,.32,.2,.33,'#686b62',0,.23,-.65);
 }else if(type==='park'){
   box(g,1.88,.1,1.88,'#89a568');for(const x of [-.68,.68])for(const z of [-.68,.68])tree(g,x,z,.75);box(g,.23,.035,1.84,'#d3c296',0,.071);box(g,1.84,.035,.23,'#d3c296',0,.073);box(g,.6,.12,.18,'#9c794d',.43,.2,.42);box(g,.6,.25,.05,'#9c794d',.43,.32,.51);
 }else if(type==='manor'){
   box(g,1.48,1.03,1.22,'#e5d6b1');roof(g,1.65,1.4,.52,1.03,'#59726c');box(g,.73,.82,.43,'#e9dfc2',0,.41,.7);roof(g,.89,.57,.28,.82,'#59726c').position.z=.7;door(g,0,.26,.928,.24,.52);windows(g,[-.5,.5],.44,.625);windows(g,[-.5,-.17,.17,.5],.81,.625);for(const x of [-.61,.61])box(g,.16,.47,.17,'#9b8e76',x,1.42,-.28);box(g,.68,.1,.22,'#bfb394',0,.05,.88);
 }else if(type==='factory'){
   // A water-powered mill: brick hall and wooden wheel, without later steam-era smoke.
   box(g,1.85,.1,1.85,'#a89b81');box(g,1.3,1.02,1.38,'#b98163');roof(g,1.48,1.56,.35,1.07,'#686b5b');
   windows(g,[-.43,-.14,.14,.43],.4,.704);windows(g,[-.43,-.14,.14,.43],.8,.704);door(g,0,.22,.72,.2,.36);
   const wheel=mesh(g,new T.TorusGeometry(.3,.05,6,12),'#74573b',-.84,.45,0);wheel.rotation.y=Math.PI/2;
   box(g,.06,.64,.055,'#9a7950',-.84,.45,0);box(g,.06,.055,.64,'#9a7950',-.84,.45,0);
   if(round>=11){box(g,.22,2.05,.24,'#947059',.66,1.075,-.62);box(g,.3,.11,.32,'#766451',.66,2.12,-.62);}
 }else if(type==='tenement'){
   box(g,1.72,1.72,1.55,'#a2866f');roof(g,1.88,1.72,.35,1.72,'#645e54');for(const y of [.4,.85,1.3])windows(g,[-.62,-.3,0,.3,.62],y,.787);door(g,0,.18,.797,.18,.36);for(const x of [-.55,.55])box(g,.15,.4,.15,'#796953',x,1.96,-.3);
 }else if(type==='school'){
   box(g,.8,.65,.76,'#d4bf91');roof(g,.92,.89,.32,.65,'#805946');box(g,.16,.3,.18,'#cdb682',0,1.05,0);roof(g,.24,.25,.15,1.2,'#805946');door(g,0,.2,.395);windows(g,[-.26,.26],.4,.395);
 }else if(type==='jail'){
   box(g,.84,.87,.8,'#8d9183');roof(g,.94,.9,.23,.87,'#606a60');door(g,0,.23,.415,.21,.46);for(const x of [-.28,.28]){box(g,.16,.22,.025,'#37483f',x,.55,.416);for(const dx of [-.045,.045])box(g,.015,.22,.03,'#b2b5a5',x+dx,.55,.433);}
 }else if(type==='trees'){tree(g,0,0,.85);}
 else {box(g,.8,.8,.8,'#baab86');roof(g,.9,.9,.32,.8,'#738072');}
 return g;
}
export function clearGroup(group){while(group.children.length){const child=group.children.pop();child.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.userData.disposeMaterial){o.material?.map?.dispose();o.material?.dispose();}});child.parent=null;}}
export function tileMesh(width,depth,height,color){const g=new T.Group();box(g,width,height,depth,color,0,height/2);return g;}
