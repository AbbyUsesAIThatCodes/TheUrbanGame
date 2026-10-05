const R = globalThis.UrbanRules;
export const LAST_ROUND = 5;
export const STORAGE = 'nch-urban-game-3d-round5-review-v2';
export const LEGACY_STORAGE = 'nch-urban-game-3d-round1-review-v1';
function wrap(state) {return {format:'urban-game-3d-review',version:2,state,roundStart:R.clone(state),reviewComplete:false};}
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
  return wrap(state);
}
export function blankVillage() {return wrap(R.fresh());}
export function validateReview(value) {
  if(value?.format!=='urban-game-3d-review'||![1,2].includes(value.version)) throw Error('Choose a save from this 3D review.');
  const state=R.validateImport(value.state),roundStart=R.validateImport(value.roundStart);
  const legacy=value.version===1;
  if(state.round>(legacy?1:LAST_ROUND)||roundStart.round!==state.round) throw Error(legacy?'An earlier review save supports setup and Round 1 only.':'This review supports setup and Rounds 1–5 only.');
  if(legacy&&value.roundOneComplete&&(state.round!==1||R.tasks(state).some(t=>!t.done))) throw Error('The completed round has unfinished source requirements.');
  if(!legacy&&typeof value.reviewComplete!=='boolean') throw Error('The review completion flag is invalid.');
  const complete=legacy?false:value.reviewComplete;
  if(complete&&(state.round!==LAST_ROUND||R.tasks(state).some(t=>!t.done))) throw Error('The completed review has unfinished source requirements.');
  // Completed earlier Round 1 villages stay at Round 1, ready to continue normally.
  // Preserve all game data; only the wrapper and its storage key change.
  return {format:'urban-game-3d-review',version:2,state,roundStart,reviewComplete:complete};
}
export function advanceReview(review) {
  if(review.reviewComplete) return `Round ${LAST_ROUND} is already complete.`;
  if(R.tasks(review.state).some(t=>!t.done)) return 'Finish the original checklist before continuing.';
  if(review.state.round<LAST_ROUND){const error=R.advance(review.state);if(error)return error;review.roundStart=R.clone(review.state);}
  else review.reviewComplete=true;
  return null;
}
