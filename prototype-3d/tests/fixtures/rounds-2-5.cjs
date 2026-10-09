module.exports={
  2:{year:'1750',slide:10,houses:15,placements:Array.from({length:5},(_,i)=>['house',2+i,20])},
  3:{year:'1760',slide:11,houses:20,placements:[...Array.from({length:5},(_,i)=>['house',18+i,2]),['manor',24,4]]},
  4:{year:'1773',slide:12,houses:25,placements:[['factory',9,3],...Array.from({length:5},(_,i)=>['house',2+i,22])]},
  5:{year:'1774',slide:13,houses:40,placements:[...[24,26,28].flatMap(y=>Array.from({length:5},(_,i)=>['house',2+i,y])),['church',10,25],['pub',12,25],['store',11,25]]}
};
