(() => {
 const grid=document.getElementById('material-grid');
 const animals=[...CreatureCatalog.zoo.map(a=>({...a,group:'zoo'})),...CreatureCatalog.sea.map(a=>({...a,group:'sea'}))];
 grid.innerHTML=animals.map(a=>`<article class="material-card" data-group="${a.group}"><div class="material-stage"><span class="animal-art" data-material="${a.id}">${AdventureArt.animals[a.id]}</span></div><h2>${a.name}</h2><div class="material-actions">${CreatureMotion.actions(a.id).map((name,i)=>`<button data-demo="${a.id}" data-variant="${i}">${name}</button>`).join('')}</div><p class="material-status" role="status">Ready to explore</p></article>`).join('')+Object.entries({...AdventureArt.food,...AdventureArt.dishes,story:AdventureArt.story,coin:AdventureArt.coin,basket:AdventureArt.basket,clock:AdventureArt.clock}).map(([id,art])=>`<article class="material-card" data-group="food"><div class="material-stage"><span class="food-art" data-material="${id}">${art}</span></div><h2>${id.replace(/([A-Z])/g,' $1')}</h2><button data-food-demo="${id}">Try the movement</button><p class="material-status" role="status">Ready for a recipe</p></article>`).join('');
 grid.addEventListener('click',e=>{
   const b=e.target.closest('button');if(!b)return;
   const card=b.closest('.material-card'),node=card.querySelector('[data-material]');
   if(b.dataset.demo){const handle=CreatureMotion.play(node,b.dataset.demo,Number(b.dataset.variant));card.querySelector('.material-status').textContent=handle.name;handle.finished.then(()=>card.querySelector('.material-status').textContent='Back home · ready again');}
   else {node.animate([{transform:'none'},{transform:'translateY(-18px) rotate(-7deg)'},{transform:'translateY(4px) scale(.94)'},{transform:'none'}],{duration:800});card.querySelector('.material-status').textContent='Lift, place, and settle';}
 });
 document.querySelector('.material-filters').addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(!b)return;document.querySelectorAll('[data-filter]').forEach(t=>t.setAttribute('aria-pressed',t===b));grid.querySelectorAll('.material-card').forEach(card=>card.hidden=b.dataset.filter!=='all'&&card.dataset.group!==b.dataset.filter);});
})();
