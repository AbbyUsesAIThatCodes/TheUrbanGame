const R = globalThis.UrbanRules;
export const LAST_ROUND = 10;
export const STORAGE = 'nch-urban-game-3d-full-review-v3';
export const PREVIOUS_STORAGE = 'nch-urban-game-3d-round5-review-v2';
export const LEGACY_STORAGE = 'nch-urban-game-3d-round1-review-v1';
function wrap(state) {return {format:'urban-game-3d-review',version:3,reviewLimit:LAST_ROUND,state,roundStart:R.clone(state),reviewComplete:false};}
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
  if(value?.format!=='urban-game-3d-review'||![1,2,3].includes(value.version)) throw Error('Choose a save from this 3D review.');
  const state=R.validateImport(value.state),roundStart=R.validateImport(value.roundStart);
  const limit=value.version===1?1:value.version===2?5:value.reviewLimit;
  if(!Number.isInteger(limit)||limit<1||limit>LAST_ROUND||state.round>limit||roundStart.round!==state.round) throw Error(`This review supports setup and Rounds 1-${LAST_ROUND}; the save's round range is invalid.`);
  const claimed=value.version===1?!!value.roundOneComplete:value.reviewComplete;
  if(typeof claimed!=='boolean') throw Error('The review completion flag is invalid.');
  if(claimed&&(state.round!==limit||R.tasks(state).some(t=>!t.done))) throw Error('The completed review has unfinished source requirements.');
  if(state.finished&&(state.round!==20||!claimed)) throw Error('The completed game flag is invalid.');
  if(value.version===3&&claimed&&limit===20&&!state.finished) throw Error('The completed game is missing its final snapshot.');
  // Earlier milestone saves keep their exact state and wait for normal advancement.
  return {format:'urban-game-3d-review',version:3,reviewLimit:LAST_ROUND,state,roundStart,reviewComplete:claimed&&limit===LAST_ROUND};
}
export function advanceReview(review) {
  if(review.reviewComplete) return `Round ${LAST_ROUND} is already complete.`;
  if(R.tasks(review.state).some(t=>!t.done)) return 'Finish the original checklist before continuing.';
  if(review.state.round<LAST_ROUND){const error=R.advance(review.state);if(error)return error;review.roundStart=R.clone(review.state);}
  else {if(LAST_ROUND===20){const error=R.advance(review.state);if(error)return error;}review.reviewComplete=true;}
  return null;
}
