import * as T from 'three';
import { tileMesh } from './models.js';
const R=globalThis.UrbanRules;
// Exact original 4x4 shading bounds, shifted inward at the board edge.
export function smokeBounds(building){return {x:Math.min(R.WIDTH-4,Math.max(0,building.x-1)),y:Math.min(R.HEIGHT-4,Math.max(0,building.y-1)),size:4};}
export function smokeModel(building,round){
 const bounds=smokeBounds(building),g=new T.Group();g.userData.smokeBounds=bounds;
 const material=new T.MeshBasicMaterial({color:round>=19?'#4b5355':'#5b656c',transparent:true,opacity:round>=19?.2:.125,depthWrite:false,side:T.DoubleSide});
 const plane=new T.Mesh(new T.PlaneGeometry(4,4),material);plane.rotation.x=-Math.PI/2;plane.position.y=.069;plane.userData.disposeMaterial=true;g.add(plane);
 const points=[[-2,.071,-2],[2,.071,-2],[2,.071,2],[-2,.071,2]].map(p=>new T.Vector3(...p)),line=new T.LineLoop(new T.BufferGeometry().setFromPoints(points),new T.LineBasicMaterial({color:'#51575d',transparent:true,opacity:.3}));line.userData.disposeMaterial=true;g.add(line);return g;
}
function part(g,w,d,h,color,x,y,z){const p=tileMesh(w,d,h,color);p.position.set(x,y,z);g.add(p);return p;}
export function bridgeModel(bridge,horizontal=true){
 const g=new T.Group(),iron=bridge.material==='iron';g.userData.bridgeMaterial=bridge.material;
 for(let i=0;i<5;i++)part(g,.98,.15,.065,iron?'#65746c':'#a58653',0,.06,-.38+i*.19);
 if(iron){for(const z of [-.43,.43]){part(g,.98,.04,.045,'#46584f',0,.33,z);for(const x of [-.42,0,.42])part(g,.045,.045,.25,'#46584f',x,.105,z);}}
 if(!horizontal)g.rotation.y=Math.PI/2;return g;
}
export function railwayModel(layer,key,water,lineNumber){
 const [x,y]=key.split(',').map(Number),g=new T.Group(),height=water?.205:.075,color=lineNumber===1?'#4b594f':'#81684c';g.userData.railway=lineNumber;g.userData.railBridge=water;
 const directions=[[1,0],[-1,0],[0,1],[0,-1]].filter(([dx,dy])=>Object.hasOwn(layer,(x+dx)+','+(y+dy)));
 if(!directions.length)directions.push([0,1],[0,-1]);
 if(water)part(g,.96,.96,.12,'#83785f',0,.085,0);
 for(const [dx,dy] of directions){
  const arm=new T.Group();if(dx)arm.rotation.y=dx>0?Math.PI/2:-Math.PI/2;else if(dy<0)arm.rotation.y=Math.PI;
  for(const z of [.1,.33])part(arm,.57,.075,.035,'#9a8865',0,height,z);
  for(const offset of [-.19,.19])part(arm,.035,.54,.045,color,offset,height+.03,.25);
  g.add(arm);
 }
 return g;
}
