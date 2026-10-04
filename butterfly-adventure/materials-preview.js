/* Every published drawing can be inspected and moved before it joins a game. */
(() => {
 const grid=document.getElementById('material-grid'),art=AdventureArt;
 const defs=document.createElement('div');defs.innerHTML=`<svg width="0" height="0" style="position:absolute"><defs>${art.symbols}</defs></svg>`;document.body.prepend(defs);
 const animals=[...CreatureCatalog.zoo.map(a=>({...a,group:'zoo'})),...CreatureCatalog.sea.map(a=>({...a,group:'sea'}))];
 const basic=(id,svg,group='play',kind='basic')=>`<article class="material-card" data-group="${group}" data-kind="${kind}"><div class="material-stage"><span data-basic-material="${id}">${svg}</span></div><h2>${id.replace(/[-_]/g,' ')}</h2><button data-basic-demo="${id}">Try the movement</button><p class="material-status" role="status">Ready</p></article>`;
 grid.innerHTML=animals.map(a=>`<article class="material-card" data-group="${a.group}"><div class="material-stage"><span class="animal-art" data-material="${a.id}">${art.animals[a.id]}</span></div><h2>${a.name}</h2><div class="material-actions">${CreatureMotion.actions(a.id).map((name,i)=>`<button data-demo="${a.id}" data-variant="${i}">${name}</button>`).join('')}</div><p class="material-status" role="status">Ready</p></article>`).join('')+
 Object.entries({...art.food,...art.dishes,story:art.story,coin:art.coin,basket:art.basket,clock:art.clock}).map(([id,svg])=>`<article class="material-card" data-group="food"><div class="material-stage"><span class="food-art" data-material="${id}">${svg}</span></div><h2>${id}</h2><button data-food-demo="${id}">Try the movement</button><p class="material-status" role="status">Ready</p></article>`).join('')+
 Object.entries(art.playthings).map(([id,svg])=>`<article class="material-card" data-group="play"><div class="material-stage"><span data-play-material="${id}">${svg}</span></div><h2>${id}</h2><button data-play-demo="${id}">Try the movement</button><p class="material-status" role="status">Ready</p></article>`).join('')+
 ['leaf','egg','caterpillar','pupa','butterfly','flower'].map(id=>{const symbol=document.getElementById(id);return basic('lifecycle-'+id,`<svg viewBox="${symbol.getAttribute('viewBox')}" aria-hidden="true"><use href="#${id}"/></svg>`);}).join('')+
 basic('Zoey',art.kid())+basic('grownup',art.grownup())+basic('cashier',art.cashier)+basic('register',art.register)+Object.entries(art.places).map(([id,svg])=>basic('place-'+id,svg)).join('')+Object.entries(art.vehicles).map(([id,svg])=>basic('vehicle-'+id,svg)).join('')+Object.entries(art.vessels).map(([id,svg])=>basic('vessel-'+id,svg)).join('')+Object.entries(art.icons).map(([id,svg])=>basic('control-'+id,svg,'play','icon')).join('');
 grid.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;const card=b.closest('.material-card'),node=card.querySelector('[data-material],[data-play-material],[data-basic-material]'),status=card.querySelector('.material-status');
  let finished;
  if(b.dataset.demo)finished=CreatureMotion.play(node,b.dataset.demo,Number(b.dataset.variant)).finished;
  else finished=PlaythingMotion.play(node,b.dataset.playDemo||b.dataset.basicDemo||b.dataset.foodDemo);
  status.textContent='Exploring';finished.then(()=>status.textContent='Back home · ready again');
 });
 document.querySelector('.material-filters').addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(!b)return;document.querySelectorAll('[data-filter]').forEach(t=>t.setAttribute('aria-pressed',t===b));grid.querySelectorAll('.material-card').forEach(card=>card.hidden=b.dataset.filter!=='all'&&card.dataset.group!==b.dataset.filter);});
})();
