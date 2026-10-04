const R = globalThis.UrbanRules;
export const STORAGE = 'nch-urban-game-3d-round1-review-v1';
export function preparedVillage() {
  const state = R.fresh(); state.name = 'Riverside';
  const check = error => { if(error) throw new Error(error); };
  for(let y=0;y<R.HEIGHT;y++) check(R.paint(state,'river',8,y));
  for(let x=0;x<R.WIDTH;x++) check(R.paint(state,'road',x,16));
  for(let y=0;y<R.HEIGHT;y++) check(R.paint(state,'road',14,y));
  check(R.paint(state,'commons',18,2));
  for(const [x,y] of [[10,12],[11,12],[12,12],[13,12],[10,14],[11,14],[12,14],[13,14],[15,13],[16,13]]) check(R.place(state,'house',x,y));
  for(const [type,x,y] of [['church',11,10],['cemetery',12,10],['store',15,15],['pub',16,15],['mine',5,8],['park',18,22]]) check(R.place(state,type,x,y));
  check(R.advance(state));
  return {format:'urban-game-3d-review',version:1,state,roundStart:R.clone(state),roundOneComplete:false};
}
export function blankVillage() {const state=R.fresh();return {format:'urban-game-3d-review',version:1,state,roundStart:R.clone(state),roundOneComplete:false};}
export function validateReview(value) {
  if(value?.format!=='urban-game-3d-review'||value.version!==1) throw Error('Choose a save from this 3D review prototype.');
  const state=R.validateImport(value.state),roundStart=R.validateImport(value.roundStart);
  if(state.round>1||roundStart.round!==state.round) throw Error('This review supports setup and Round 1 only.');
  const complete=!!value.roundOneComplete;
  if(complete&&(state.round!==1||R.tasks(state).some(t=>!t.done))) throw Error('The completed round has unfinished source requirements.');
  return {format:'urban-game-3d-review',version:1,state,roundStart,roundOneComplete:complete};
}
export function advanceReview(review) {
  if(review.roundOneComplete) return 'Round 1 is already complete.';
  if(R.tasks(review.state).some(t=>!t.done)) return 'Finish the original checklist before continuing.';
  if(review.state.round===0){R.advance(review.state);review.roundStart=R.clone(review.state);}
  else review.roundOneComplete=true;
  return null;
}
