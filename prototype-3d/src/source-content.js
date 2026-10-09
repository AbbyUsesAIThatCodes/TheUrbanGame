// Original classroom texts and images are read from the preserved slide records.
export function roundSource(decks,round,requestedDeck=0){
  const deckIndex=round>10?0:requestedDeck;
  const deck=decks[deckIndex];
  const slide=round===0?deck.slides.find(s=>s.number===2):deck.slides.find(s=>new RegExp('^Round\\s+'+round+'(?:\\s|$)','i').test(s.text.trim()));
  if(!slide)throw Error(`Original source missing for Round ${round}.`);
  const supplementary={7:16,13:23,15:26,16:28,19:32}[round];
  const pictures=deckIndex===0&&supplementary?deck.slides.find(s=>s.number===supplementary):null;
  return {deckIndex,number:slide.number,text:slide.text+(round===0?'\n\n'+deck.slides.find(s=>s.number===6).text:''),images:[...slide.images,...(pictures?.images||[])],imageSlide:pictures?.number};
}
export const reflectionQuestions={
  board:['What were some of the impacts that industrialization had on your village and its citizens over time?','What were some factors that influenced or caused these changes?','What issues do the people of your village face at the end of the game?'],
  slides:['What were some of the impacts that urbanization had on your village and its people over time?','What were some factors that influenced or caused these changes?','What issues do the people of your village face at the end of the game?']
};
