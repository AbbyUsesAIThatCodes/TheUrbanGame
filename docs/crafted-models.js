import * as T from 'three';
// Sculpted from the permanent classroom atlas: limestone, terracotta, slate and brick.
// Decorative geometry stays inside the original one-square / two-square footprints.
const materials=new Map();
function material(color){if(!materials.has(color))materials.set(color,new T.MeshStandardMaterial({color,roughness:.92}));return materials.get(color);}
function solid(g,geometry,color,x=0,y=0,z=0){const m=new T.Mesh(geometry,material(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m;}
function block(g,w,h,d,color,x=0,y=h/2,z=0){return solid(g,new T.BoxGeometry(w,h,d),color,x,y,z);}
function gable(g,w,d,height,base,color,endColor=color){
 const positions=[-w/2,base,-d/2,w/2,base,-d/2,w/2,base,d/2,-w/2,base,d/2,0,base+height,-d/2,0,base+height,d/2],group=new T.Group();g.add(group);
 for(const [indices,tone]of [[[0,5,4,0,3,5,4,2,1,4,5,2],color],[[0,4,1,3,2,5],endColor]]){const indexed=new T.BufferGeometry();indexed.setAttribute('position',new T.Float32BufferAttribute(positions,3));indexed.setIndex(indices);const geometry=indexed.toNonIndexed();indexed.dispose();geometry.computeVertexNormals();solid(group,geometry,tone);}return group;
}

function arch(g,w,h,color,x,y,z){const r=w/2,shape=new T.Shape();shape.moveTo(-r,0);shape.lineTo(r,0);shape.lineTo(r,h-r);shape.absarc(0,h-r,r,0,Math.PI,false);shape.closePath();return solid(g,new T.ExtrudeGeometry(shape,{depth:.012,bevelEnabled:false,curveSegments:8}),color,x,y,z);}
function window(g,x,y,z,w=.14,h=.23,arched=false,trim='#c5b48f'){
 if(arched){arch(g,w+.045,h+.035,trim,x,y-.012,z);arch(g,w,h,'#475c55',x,y,z+.014);}
 else{block(g,w+.035,h+.035,.022,'#dbcfab',x,y+h/2,z);block(g,w,h,.025,'#465c55',x,y+h/2,z+.014);}
 block(g,.012,h-.015,.016,'#eee0bc',x,y+h/2,z+.033);block(g,w-.015,.012,.016,'#eee0bc',x,y+h*.52,z+.034);block(g,w+.05,.022,.055,'#c5b895',x,y-.01,z+.018);
}
function door(g,x,z,w=.15,h=.31,y=.04){block(g,w+.045,h+.025,.035,'#cbbb96',x,y+h/2,z);block(g,w,h,.025,'#345345',x,y+h/2,z+.023);for(const dy of [.25,.7])block(g,w*.68,h*.28,.012,'#49694e',x,y+h*dy,z+.043);solid(g,new T.SphereGeometry(.009,5,4),'#bb9859',x+w*.27,y+h*.46,z+.052);}
function shrub(g,x,z,size=.09){for(const [dx,dy,dz,scale]of [[0,0,0,1],[-.35,-.1,.15,.7],[.3,.1,-.1,.65]]){const m=solid(g,new T.IcosahedronGeometry(size*scale,1),dy>0?'#71834a':'#586d3c',x+dx*size,.08+size+dy*size,z+dz*size);m.scale.y=.9;}}
function chimney(g,x,z,base,height=.4,w=.1){block(g,w,height,w,'#a07d55',x,base+height/2,z);for(let i=0;i<4;i++)block(g,w+.006,.012,w+.006,'#b6976b',x,base+height*i/4,z);block(g,w+.035,.04,w+.035,'#c2a57c',x,base+height,z);block(g,w*.53,.04,w*.53,'#4a473a',x,base+height+.025,z);}
function roofTiles(g,w,d,height,base,colors,rows=7,columns=11,endColor=colors[0]){
 gable(g,w,d,height,base,colors[0],endColor);const angle=Math.atan2(height,w/2),slope=Math.hypot(w/2,height),tileW=slope/rows;
 for(const side of [-1,1])for(let row=0;row<rows;row++)for(let col=0;col<columns;col++){
  const t=(row+.5)/rows,x=side*(w/2*(1-t)),y=base+height*t+.012,z=-d/2+(col+.5)*d/columns;
  const tile=block(g,tileW*1.02,.014,d/columns*.95,colors[(row*3+col*5)%colors.length],x,y,z);tile.rotation.z=-side*angle;
 }
 for(let i=0;i<columns;i++){const cap=solid(g,new T.CylinderGeometry(.025,.025,d/columns*.98,6),colors[1],0,base+height+.02,-d/2+(i+.5)*d/columns);cap.rotation.x=Math.PI/2;}
}
function stoneCourses(g,w,h,d,base=.07){
 for(let row=0;row<5;row++){const y=base+(row+.5)*h/5;for(let col=0;col<6;col++){const x=-w/2+(col+.5)*w/6;block(g,w/6*.93,.013,.009,row%2?'#c1b28f':'#cfbe98',x,y,d/2+.007);}}
 for(const x of [-w/2,w/2])for(let row=0;row<5;row++)block(g,.07,h/5*.75,d+.016,'#daceac',x,base+(row+.5)*h/5,0);
}
export function cottage(){
 const g=new T.Group();block(g,.96,.045,.95,'#a2a27b');block(g,.72,.51,.65,'#cebf99',0,.3,0);stoneCourses(g,.72,.5,.65,.045);
 roofTiles(g,.86,.79,.38,.56,['#a36842','#ad764b','#955a3b','#bb8453','#a66e45'],7,10,'#cebf99');
 chimney(g,.23,-.19,.72,.41,.095);door(g,0,.335,.145,.3,.05);for(const x of [-.235,.235])window(g,x,.19,.334,.12,.21);
 for(const sign of [-1,1]){const side=new T.Group();side.rotation.y=sign*Math.PI/2;side.position.x=sign*.371;window(side,0,.2,0,.15,.22);g.add(side);}const rear=new T.Group();rear.rotation.y=Math.PI;rear.position.z=-.335;for(const x of [-.2,.2])window(rear,x,.19,0,.12,.21);g.add(rear);
 block(g,.18,.015,.15,'#c1b496',0,.056,.405);
 for(const x of [-.35,.34]){shrub(g,x,.35,.065);for(let i=0;i<3;i++)solid(g,new T.SphereGeometry(.016,5,4),i%2?'#d3a250':'#af694e',x-.035+i*.035,.15,.39);}
 for(let i=0;i<5;i++)block(g,.022,.15,.022,'#897a51',.18+i*.061,.12,.45);block(g,.28,.023,.026,'#aa9364',.3,.13,.45);
 const barrel=solid(g,new T.CylinderGeometry(.048,.042,.1,8),'#876849',-.405,.1,.16);for(const y of [.065,.13])solid(g,new T.TorusGeometry(.048,.006,4,8),'#575c46',-.405,y,.16).rotation.x=Math.PI/2;
 return g;
}
export function manor(){
 const g=new T.Group();block(g,1.96,.055,1.95,'#9caa7d');block(g,1.47,1.03,1.12,'#d9caa7',0,.565,-.14);block(g,1.55,.07,1.2,'#c4b792',0,.09,-.14);block(g,1.53,.05,1.18,'#eadcbc',0,1.085,-.14);block(g,1.5,.035,1.15,'#b6a886',0,.61,-.14);
 // A hipped slate roof, with the central pediment and paired dormers of the atlas.
 const w=1.63,d=1.28,base=1.11,top=1.49,indexed=new T.BufferGeometry();indexed.setAttribute('position',new T.Float32BufferAttribute([-w/2,base,-d/2,w/2,base,-d/2,w/2,base,d/2,-w/2,base,d/2,-.49,top,0,.49,top,0],3));indexed.setIndex([0,4,1,1,4,5,1,5,2,2,5,3,3,5,4,3,4,0]);const geometry=indexed.toNonIndexed();indexed.dispose();geometry.computeVertexNormals();solid(g,geometry,'#485565',0,0,-.14);
 const slate=['#475467','#536174','#596879','#414f63'];
 for(const side of [-1,1])for(let row=0;row<7;row++){const t=(row+.5)/7,width=1.63-.65*t;for(let col=0;col<12;col++){const tile=block(g,width/12*.97,.011,Math.hypot(.64,.38)/7*.98,slate[(row+col*3)%slate.length],-width/2+(col+.5)*width/12,base+.38*t+.01,side*.64*(1-t)-.14);tile.rotation.x=side*Math.atan2(.38,.64);}}
 for(const side of [-1,1])for(let row=0;row<5;row++){const t=(row+.5)/5,depth=1.28*(1-t);for(let col=0;col<8;col++){const tile=block(g,Math.hypot(.325,.38)/5*.97,.011,depth/8*.97,slate[(row*2+col)%slate.length],side*(.815-.325*t),base+.38*t+.01,-depth/2+(col+.5)*depth/8-.14);tile.rotation.z=-side*Math.atan2(.38,.325);}}
 block(g,1.03,.025,.04,'#68768a',0,top+.013,-.14);

 for(const x of [-.68,.68])for(const z of [-.48,.24])chimney(g,x,z,1.22,.46,.105);
 for(const x of [-.53,-.27,.27,.53])for(const y of [.21,.75])window(g,x,y,.43,.125,.24,y<.3);const rear=new T.Group();rear.rotation.y=Math.PI;rear.position.z=-.71;for(const x of [-.53,-.27,0,.27,.53])for(const y of [.21,.75])window(rear,x,y,0,.125,.24);g.add(rear);
 for(const side of [-1,1]){const wall=new T.Group();wall.rotation.y=side*Math.PI/2;wall.position.set(side*.742,0,-.14);for(const x of [-.31,.25])for(const y of [.21,.75])window(wall,x,y,0,.14,.24);g.add(wall);}
 block(g,.48,1.12,.12,'#e8d9b6',0,.64,.48);door(g,0,.563,.2,.4,.15);window(g,0,.78,.563,.18,.27,true);
 // Front balcony, columns and triangular stone pediment.
 for(const x of [-.21,.21])solid(g,new T.CylinderGeometry(.032,.038,.51,10),'#eee0bd',x,.43,.62);
 block(g,.53,.045,.31,'#cfc09b',0,.7,.58);for(const x of [-.22,-.11,0,.11,.22])block(g,.019,.12,.025,'#d6c8a5',x,.78,.731);block(g,.54,.027,.04,'#eadcbc',0,.85,.731);
 const pediment=gable(g,.65,.2,.23,1.18,'#e0d2af');pediment.position.z=.53;
 solid(g,new T.TorusGeometry(.045,.011,5,16),'#a99470',0,1.28,.636);
 for(const x of [-.46,.46]){block(g,.2,.19,.17,'#d4c6a5',x,1.26,.14);const dormer=gable(g,.25,.22,.13,1.36,'#536276');dormer.position.set(x,0,.14);window(g,x,1.2,.232,.1,.13);}
 for(let i=0;i<4;i++)block(g,.42+i*.07,.028,.1,'#c0b594',0,.13-i*.025,.7+i*.075);
 for(const x of [-.81,.81])for(const z of [.48,.8]){const bush=solid(g,new T.ConeGeometry(.09,.32,9),'#5e7444',x,.215,z);solid(g,new T.SphereGeometry(.065,8,6),'#73864c',x,.375,z);}
 return g;
}
export function mill(steam=false){
 const g=new T.Group();block(g,1.94,.065,1.94,'#acaa8d');block(g,1.76,.96,.98,'#a66a4b',0,.565,0);block(g,1.83,.08,1.05,'#b88c61',0,.1,0);block(g,1.81,.045,1.03,'#c4986d',0,1.065,0);
 const roof=new T.Group();roof.rotation.y=Math.PI/2;roofTiles(roof,1.12,1.88,.25,1.085,['#47566a','#536175','#637186','#4c5b6d'],6,16,'#a66a4b');g.add(roof);
 function facade(width,windowsX){const wall=new T.Group();for(let row=0;row<9;row++)for(let col=0;col<Math.round(width/.13);col++){const count=Math.round(width/.13),x=-width/2+(col+.5)*width/count;block(wall,width/count*.92,.011,.009,row%2?'#b98259':'#b17b54',x,.17+row*.102,.003);}for(const x of windowsX)for(const y of [.22,.64])window(wall,x,y,.014,.14,.32,true,'#c09367');return wall;}
 const front=facade(1.76,[-.68,-.34,0,.34,.68]);front.position.z=.495;g.add(front);door(g,0,.537,.19,.36,.12);
 const rear=facade(1.76,[-.68,-.34,0,.34,.68]);rear.rotation.y=Math.PI;rear.position.z=-.495;g.add(rear);
 for(const sign of [-1,1]){const side=facade(.98,[-.32,0,.32]);side.rotation.y=sign*Math.PI/2;side.position.x=sign*.883;g.add(side);}
 const lantern=new T.Group();lantern.rotation.y=Math.PI/2;block(lantern,.27,.17,1.46,'#b98c60',0,1.37,0);for(const side of [-1,1])for(let i=0;i<10;i++)block(lantern,.023,.12,.118,'#5c7a82',side*.148,1.4,-.63+i*.14);gable(lantern,.36,1.53,.12,1.455,'#536277','#b98c60');g.add(lantern);
 if(steam){
  solid(g,new T.CylinderGeometry(.105,.145,2.35,16),'#a66a4b',.72,1.24,-.36);for(let i=0;i<18;i++)solid(g,new T.TorusGeometry(.139-i*.002,.006,4,16),'#bd895d',.72,.17+i*.123,-.36).rotation.x=Math.PI/2;
  solid(g,new T.CylinderGeometry(.13,.12,.085,16),'#b88b60',.72,2.45,-.36);solid(g,new T.CylinderGeometry(.082,.082,.018,16),'#414b40',.72,2.499,-.36);
 }else{
  const wheel=new T.Group();wheel.position.set(-.918,.44,-.12);wheel.rotation.y=Math.PI/2;
  solid(wheel,new T.TorusGeometry(.305,.035,6,20),'#6c553d');for(let i=0;i<12;i++){const spoke=block(wheel,.025,.57,.035,'#92734d',0,0,0);spoke.rotation.z=i*Math.PI/6;const paddle=block(wheel,.115,.04,.13,'#8b704b',Math.sin(i*Math.PI/6)*.31,Math.cos(i*Math.PI/6)*.31,0);paddle.rotation.z=-i*Math.PI/6;}g.add(wheel);
 }
 for(const [x,z]of [[-.66,.78],[.67,.78]]){block(g,.16,.16,.13,'#96805a',x,.145,z);block(g,.17,.018,.14,'#b39a6a',x,.235,z);}
 return g;
}
