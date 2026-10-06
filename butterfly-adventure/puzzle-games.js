/* Two picture puzzles for little hands.
 *  connect: random sets of friends appear on two sides; drag (or tap, then tap) a line from each one to its partner.
 *  match:   a board of pictures from a theme; tap two of a kind and they pop away. Clear the board to win.
 * Everything works with a finger, a mouse or a keyboard, and every action has its own sound. */
(() => {
 'use strict';
 const shuffle=list=>{const r=list.slice();for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]];}return r;};
 const sfx=(name,o)=>window.SoundFX?.play(name,o);
 const LINE_COLORS=['#e8b95e','#d78e85','#79a7b4','#a3bb81','#c79bd6'];

 // Friends that belong together. `a` sits on the left, `b` on the right; `fx` is the sound their friendship makes.
 const PAIRS=[
  {id:'monkey-banana',a:'monkey',b:'banana',fx:'chomp'},{id:'rabbit-carrot',a:'rabbit',b:'carrot',fx:'chomp'},
  {id:'cow-milk',a:'cow',b:'milk',fx:'moo'},{id:'panda-bamboo',a:'panda',b:'bamboo',fx:'chomp'},
  {id:'bear-honey',a:'bear',b:'honey',fx:'chomp'},{id:'giraffe-leaf',a:'giraffe',b:'leaf',fx:'chomp'},
  {id:'elephant-peanut',a:'elephant',b:'peanut',fx:'chomp'},{id:'firetruck-flame',a:'firetruck',b:'flame',fx:'siren',fx2:'sizzle'},
  {id:'police-policecar',a:'police',b:'policecar',fx:'siren'},{id:'butterfly-flower',a:'butterfly',b:'flower',fx:'flutter'},
  {id:'rain-umbrella',a:'rain',b:'umbrella',fx:'splash'},{id:'spade-soil',a:'spade',b:'soil',fx:'drop'},
  {id:'owl-moon',a:'owl',b:'moon',fx:'twinkle'},{id:'seal-ball',a:'seal',b:'ball',fx:'bounce'},
  {id:'penguin-clownfish',a:'penguin',b:'clownfish',fx:'chomp'},{id:'sun-tulip',a:'sun',b:'tulip',fx:'twinkle'}
 ];
 // Themes for the matching board. Each has plenty of pictures so every round is different.
 const THEMES={
  animals:{icon:'tiger',pool:['tiger','elephant','giraffe','panda','monkey','rabbit','bear','lion','cow','fox','frog','penguin','zebra','koala']},
  fruit:{icon:'apple',pool:['apple','banana','strawberry','orange','watermelon','grapes','pear','cherries','lemon','blueberry']},
  veg:{icon:'carrot',pool:['carrot','broccoli','tomato','cucumber','peas','corn','eggplant','mushroom','pumpkin','radish']},
  vehicle:{icon:'firetruck',pool:['car','bus','van','firetruck','policecar','ambulance','airplane','train','boat','bicycle']},
  sea:{icon:'dolphin',pool:['dolphin','turtle','whale','octopus','jellyfish','crab','starfish','seahorse','shark','seal','pufferfish','clownfish']}
 };
 const THEME_NAMES={animals:'动物',fruit:'水果',veg:'蔬菜',vehicle:'交通工具',sea:'海洋朋友'};
 const check='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fffdf4" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

 window.PuzzleGames={pairs:PAIRS,themes:THEMES,start(game,kit){
  const {$,art,shell,speak,setVoice,message,celebrate,flow}=kit,book=window.AdventureBook;
  const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  const names=art.puzzleNames||{};
  const piece=id=>art.animals[id]||art.playthings[id]||art.food[id]||art.vehicles?.[id]||'';
  const wait=ms=>new Promise(r=>setTimeout(r,reduce()?1:ms));
  const hintDelay=Number(new URLSearchParams(location.search).get('hint'))||9000;
  const status=phase=>{$('new-game').dataset.phase=phase;};
  const levels=count=>`<nav class="pz-levels" aria-label="选择难度">${[1,2,3].map(n=>`<button data-level="${n}" aria-label="${count(n)}" aria-pressed="${n===1}">${'●'.repeat(n)}</button>`).join('')}</nav>`;
  const artOf=id=>`<span class="pz-art">${piece(id)}</span>`;
  // After a quiet moment, two helpful tiles wiggle so nobody feels stuck.
  let hintTimer=0;
  const clearHint=()=>{clearTimeout(hintTimer);$('new-game').querySelectorAll('.pz-tile.hint').forEach(t=>t.classList.remove('hint'));};
  const armHint=find=>{clearTimeout(hintTimer);hintTimer=setTimeout(()=>{const tiles=find();if(tiles)tiles.forEach(t=>t.classList.add('hint'));},hintDelay);};
  const stopAll=()=>{clearHint();flow.cancel();};
  window.addEventListener('pagehide',stopAll);

  if(game==='connect'){
   let level=1,round=0,phase='play',token=0,selected=null,drag=null,wrongs=0,lastIds=[],current=[],colors={};
   const connected=new Map();
   shell('好朋友连连线','连一连 · 找到好朋友',`${levels(n=>`${n+2} 对好朋友`)}<div class="toy-content pz-content"><div id="pz-board" class="pz-board pz-connect" role="group" aria-label="把好朋友连起来"><svg id="pz-lines" class="pz-lines" aria-hidden="true"></svg><div id="pz-left" class="pz-col"></div><div class="pz-gap"></div><div id="pz-right" class="pz-col"></div></div></div><footer class="toy-footer pz-footer"><div class="round-dots" id="pz-dots"></div><p id="toy-message" class="toy-message" role="status"></p></footer>`);
   const board=$('pz-board'),lines=$('pz-lines');
   const pairById=id=>PAIRS.find(p=>p.id===id);
   function anchor(tile){const b=board.getBoundingClientRect(),r=tile.getBoundingClientRect();return [(tile.dataset.side==='a'?r.right-2:r.left+2)-b.left,r.top+r.height/2-b.top];}
   function curve(p,q){const mx=(p[0]+q[0])/2;return `M${p[0].toFixed(1)} ${p[1].toFixed(1)}C${mx.toFixed(1)} ${p[1].toFixed(1)} ${mx.toFixed(1)} ${q[1].toFixed(1)} ${q[0].toFixed(1)} ${q[1].toFixed(1)}`;}
   function draw(fresh){
    lines.innerHTML=[...connected.entries()].map(([id,c])=>`<path class="pz-line${id===fresh?' fresh':''}" pathLength="1" d="${curve(anchor(c.a),anchor(c.b))}" style="--c:${c.color}"/>`).join('');
   }
   function render(){
    status(phase);const d=$('new-game').dataset;d.level=level;d.round=round;d.total=current.length;d.connected=connected.size;d.pairs=current.map(p=>p.id).join(',');
    $('pz-dots').innerHTML=current.map((p,i)=>`<i class="${connected.has(p.id)?'current':''}"></i>`).join('');
   }
   function newRound(say){
    flow.cancel();token++;clearHint();selected=null;drag=null;connected.clear();wrongs=0;phase='play';
    const count=level+2,fresh=shuffle(PAIRS.filter(p=>!lastIds.includes(p.id)));
    current=fresh.slice(0,count);
    // Short on fresh friends? Borrow from the last round rather than repeat the same set.
    if(current.length<count)current=current.concat(shuffle(PAIRS.filter(p=>!current.includes(p))).slice(0,count-current.length));
    lastIds=current.map(p=>p.id);
    colors={};shuffle(LINE_COLORS).forEach((c,i)=>{if(current[i])colors[current[i].id]=c;});
    const left=shuffle(current),rightOrder=(()=>{let r;for(let i=0;i<12;i++){r=shuffle(current);if(r.every((p,k)=>p!==left[k]))break;}return r;})();
    const tile=(p,side)=>`<button class="pz-tile" data-pair="${p.id}" data-side="${side}" data-piece="${p[side]}" aria-label="${names[p[side]]||p[side]}" style="--c:${colors[p.id]}">${artOf(p[side])}<i class="pz-peg" aria-hidden="true"></i><i class="pz-badge" aria-hidden="true">${check}</i></button>`;
    board.style.setProperty('--n',count);
    $('pz-left').innerHTML=left.map(p=>tile(p,'a')).join('');$('pz-right').innerHTML=rightOrder.map(p=>tile(p,'b')).join('');
    draw();render();message('给好朋友连一连线吧。','拖一拖，或者先点一个再点它的好朋友。');
    setVoice('connect-intro');armHint(findHint);
    if(say===true){sfx('shuffle');speak('connect-intro');}
   }
   function findHint(){const p=current.find(x=>!connected.has(x.id));if(!p)return null;return [...board.querySelectorAll(`.pz-tile[data-pair="${p.id}"]`)];}
   const deselect=()=>{selected?.classList.remove('is-selected');selected?.setAttribute('aria-pressed','false');selected=null;};
   function select(tile){selected=tile;tile.classList.add('is-selected');tile.setAttribute('aria-pressed','true');}
   function shake(...tiles){tiles.forEach(t=>{t.classList.remove('wrong');void t.offsetWidth;t.classList.add('wrong');setTimeout(()=>t.classList.remove('wrong'),520);});}
   function attempt(a,b){
    if(phase!=='play'||a.dataset.side===b.dataset.side)return;
    clearHint();
    if(a.dataset.pair===b.dataset.pair)return join(a.dataset.side==='a'?a:b,a.dataset.side==='a'?b:a);
    wrongs++;shake(a,b);sfx('boing');message('再找找看，谁是好朋友呢？','');
    if(wrongs===1||wrongs%3===0)speak('connect-wrong');
    armHint(findHint);
   }
   function join(a,b){
    const pair=pairById(a.dataset.pair);
    connected.set(pair.id,{a,b,color:colors[pair.id]});
    [a,b].forEach(t=>{t.dataset.done='true';t.classList.remove('is-selected','hint');t.setAttribute('aria-pressed','false');});
    draw(pair.id);render();sfx('link');setTimeout(()=>sfx(pair.fx),170);if(pair.fx2)setTimeout(()=>sfx(pair.fx2),650);
    try{if(art.animals[pair.a]&&window.CreatureMotion)window.CreatureMotion.play(a.querySelector('.pz-art'),pair.a);else window.PlaythingMotion?.play(a.querySelector('.pz-art'),pair.a);}catch{}
    try{if(art.animals[pair.b]&&window.CreatureMotion)window.CreatureMotion.play(b.querySelector('.pz-art'),pair.b);else window.PlaythingMotion?.play(b.querySelector('.pz-art'),pair.b);}catch{}
    message(`${names[pair.a]||pair.a}和${names[pair.b]||pair.b}是好朋友！`,'');
    speak(`connect-${pair.id}`);
    if(connected.size===current.length)return finish();
    armHint(findHint);
   }
   function finish(){
    phase='done';render();celebrate(board);
    setVoice('connect-done');book.queueAudio('connect-done.m4a');
    flow.after(()=>newRound(true));
   }
   function tap(tile){
    if(phase!=='play'||tile.dataset.done)return;
    clearHint();armHint(findHint);
    if(selected===tile){deselect();sfx('tap');return;}
    if(selected&&selected.dataset.side!==tile.dataset.side){const first=selected;deselect();attempt(first,tile);return;}
    deselect();select(tile);sfx('pick',{pitch:tile.dataset.side==='a'?1:1.12});
   }
   // Dragging draws a rubber line from the touched picture. Letting go over its friend ties the knot.
   board.addEventListener('pointerdown',e=>{
    const tile=e.target.closest('.pz-tile');
    if(!tile||phase!=='play'||tile.dataset.done||!e.isPrimary||e.button!==0)return;
    drag={tile,id:e.pointerId,x:e.clientX,y:e.clientY,moved:false,line:null};
    tile.setPointerCapture(e.pointerId);e.preventDefault();
   });
   board.addEventListener('pointermove',e=>{
    if(!drag||drag.id!==e.pointerId)return;
    if(!drag.moved&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<9)return;
    if(!drag.moved){drag.moved=true;clearHint();deselect();drag.tile.classList.add('is-dragging');sfx('pick',{pitch:drag.tile.dataset.side==='a'?1:1.12});
     drag.line=document.createElementNS('http://www.w3.org/2000/svg','path');drag.line.setAttribute('class','pz-line live');drag.line.style.setProperty('--c',colors[drag.tile.dataset.pair]);lines.append(drag.line);}
    const b=board.getBoundingClientRect();
    drag.line.setAttribute('d',curve(anchor(drag.tile),[e.clientX-b.left,e.clientY-b.top]));
    const over=document.elementFromPoint(e.clientX,e.clientY)?.closest('.pz-tile');
    board.querySelectorAll('.pz-tile.target').forEach(t=>{if(t!==over)t.classList.remove('target');});
    if(over&&over!==drag.tile&&over.dataset.side!==drag.tile.dataset.side&&!over.dataset.done)over.classList.add('target');
    e.preventDefault();
   });
   function endDrag(e){
    if(!drag||drag.id!==e.pointerId)return;
    const g=drag;drag=null;g.line?.remove();g.tile.classList.remove('is-dragging');board.querySelectorAll('.pz-tile.target').forEach(t=>t.classList.remove('target'));
    if(g.tile.hasPointerCapture(e.pointerId))g.tile.releasePointerCapture(e.pointerId);
    if(e.type==='pointercancel')return;
    if(!g.moved){tap(g.tile);e.preventDefault();return;}
    const over=document.elementFromPoint(e.clientX,e.clientY)?.closest('.pz-tile');
    if(over&&over!==g.tile&&over.dataset.side!==g.tile.dataset.side&&!over.dataset.done)attempt(g.tile,over);
    else{sfx('drop');armHint(findHint);}
    e.preventDefault();
   }
   board.addEventListener('pointerup',endDrag);board.addEventListener('pointercancel',endDrag);
   board.addEventListener('lostpointercapture',e=>{if(drag&&drag.id===e.pointerId){drag.line?.remove();drag.tile.classList.remove('is-dragging');drag=null;}});
   board.addEventListener('click',e=>{const tile=e.target.closest('.pz-tile');if(tile&&e.detail===0)tap(tile);});
   new ResizeObserver(()=>draw()).observe(board);
   $('new-game').querySelector('.pz-levels').addEventListener('click',e=>{
    const b=e.target.closest('button[data-level]');if(!b)return;
    level=Number(b.dataset.level);$('new-game').querySelectorAll('.pz-levels button').forEach(x=>x.setAttribute('aria-pressed',x===b));
    lastIds=[];sfx('tap');newRound(true);
   });
   newRound();
  }else if(game==='match'){
   let level=1,theme='animals',phase='play',token=0,first=null,busy=false,combo=0,wrongs=0,remaining=0,round=0,pairsTotal=0,intro=true;
   const themeKeys=Object.keys(THEMES);theme=themeKeys[Math.floor(Math.random()*themeKeys.length)];
   shell('找朋友消消乐','找两个一样的 · 一起消除',`<div class="pz-bar"><nav class="pz-themes" aria-label="选一个主题">${themeKeys.map(k=>`<button data-theme="${k}" aria-label="${THEME_NAMES[k]}" aria-pressed="false">${piece(THEMES[k].icon)}</button>`).join('')}</nav>${levels(n=>`${[4,6,8][n-1]} 对`)}</div><div class="toy-content pz-content"><div id="pz-grid" class="pz-board pz-grid" role="group" aria-label="找到两个一样的"></div></div><footer class="toy-footer pz-footer"><div class="round-dots" id="pz-dots"></div><p id="toy-message" class="toy-message" role="status"></p></footer>`);
   const grid=$('pz-grid');
   function layout(){
    const tiles=grid.querySelectorAll('.pz-tile').length;if(!tiles)return;
    const cs=getComputedStyle(grid),w=grid.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight),h=grid.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom),gap=Math.max(7,Math.min(14,Math.min(w,h)/36));
    let best={score:-1,size:0,cols:2};
    for(let c=2;c<=tiles;c++){const rows=Math.ceil(tiles/c),size=Math.min((w-(c-1)*gap)/c,(h-(rows-1)*gap)/rows),score=Math.min(210,Math.floor(size))*100-(c*rows-tiles);if(score>best.score)best={score,size,cols:c};}
    const rows=Math.ceil(tiles/best.cols),size=Math.max(40,Math.floor(Math.min(best.size,210)));
    grid.style.setProperty('--tile',`${size}px`);grid.style.setProperty('--gap',`${gap}px`);grid.style.gridTemplateColumns=`repeat(${best.cols},${size}px)`;grid.style.gridTemplateRows=`repeat(${rows},${size}px)`;
    grid.dataset.cols=best.cols;grid.dataset.rows=rows;
   }
   function render(){
    status(phase);const d=$('new-game').dataset;d.level=level;d.theme=theme;d.remaining=remaining;d.round=round;d.combo=combo;
    $('pz-dots').innerHTML=Array.from({length:pairsTotal},(_,i)=>`<i class="${i<pairsTotal-remaining/2?'current':''}"></i>`).join('');
    $('new-game').querySelectorAll('.pz-themes button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.theme===theme));
   }
   function newBoard(say){
    flow.cancel();token++;clearHint();first=null;busy=false;combo=0;wrongs=0;phase='play';round++;
    const count=[4,6,8][level-1],pool=THEMES[theme].pool.filter(id=>piece(id));
    const picks=shuffle(pool).slice(0,count);pairsTotal=count;remaining=count*2;
    grid.innerHTML=shuffle(picks.flatMap(id=>[id,id])).map(id=>`<button class="pz-tile match" data-piece="${id}" aria-label="${names[id]||id}" aria-pressed="false">${artOf(id)}</button>`).join('');
    layout();render();message(`找到两个一样的${THEME_NAMES[theme]}。`,'');
    armHint(findHint);
    const id=intro?'match-intro':`match-theme-${theme}`;intro=false;setVoice(id);if(say===true){sfx('shuffle');speak(id);}
   }
   function findHint(){
    const live=[...grid.querySelectorAll('.pz-tile:not([data-gone])')],byPiece={};
    for(const t of live)(byPiece[t.dataset.piece]||=[]).push(t);
    const pair=Object.values(byPiece).find(l=>l.length>=2);return pair?pair.slice(0,2):null;
   }
   function unselect(){first?.classList.remove('is-selected');first?.setAttribute('aria-pressed','false');first=null;}
   function sparkles(tile){
    const b=grid.getBoundingClientRect(),r=tile.getBoundingClientRect(),cx=r.left+r.width/2-b.left,cy=r.top+r.height/2-b.top;
    if(reduce())return;
    for(let i=0;i<7;i++){const s=document.createElement('span'),a=i/7*6.283+Math.random()*.5,d=r.width*(.55+Math.random()*.35);s.className='pz-spark';s.setAttribute('aria-hidden','true');s.textContent=i%2?'✦':'✧';
     s.style.cssText=`left:${cx}px;top:${cy}px;--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d}px;color:${LINE_COLORS[i%LINE_COLORS.length]}`;grid.append(s);setTimeout(()=>s.remove(),800);}
   }
   async function eliminate(a,b){
    busy=true;combo++;clearHint();const own=token;
    [a,b].forEach(t=>{t.classList.remove('is-selected');t.classList.add('matched');});first=null;
    sfx('match',{pitch:1+Math.min(combo-1,6)*.06});
    sparkles(a);sparkles(b);
    remaining-=2;render();
    message('找到啦！','');
    await wait(480);if(own!==token)return;
    [a,b].forEach(t=>{t.dataset.gone='true';t.disabled=true;t.classList.remove('matched');t.setAttribute('aria-hidden','true');});
    busy=false;
    if(remaining===0)return finish();
    if(combo%2===0)speak(`match-praise-${1+Math.floor(Math.random()*3)}`);
    armHint(findHint);
   }
   function finish(){
    phase='done';render();celebrate(grid);
    setVoice('match-done');speak('match-done');
    flow.after(()=>{const others=themeKeys.filter(k=>k!==theme);theme=others[Math.floor(Math.random()*others.length)];newBoard(true);});
   }
   async function wrong(a,b){
    busy=true;combo=0;wrongs++;clearHint();const own=token;
    [a,b].forEach(t=>{t.classList.remove('wrong');void t.offsetWidth;t.classList.add('wrong');});
    sfx('boing');message('不一样哦，再找找看。','');
    if(wrongs===1||wrongs%3===0)speak('match-wrong');
    await wait(520);if(own!==token)return;
    [a,b].forEach(t=>t.classList.remove('wrong','is-selected'));[a,b].forEach(t=>t.setAttribute('aria-pressed','false'));first=null;busy=false;armHint(findHint);
   }
   grid.addEventListener('click',e=>{
    const tile=e.target.closest('.pz-tile');
    if(!tile||phase!=='play'||busy||tile.dataset.gone)return;
    clearHint();armHint(findHint);
    if(!first){first=tile;tile.classList.add('is-selected');tile.setAttribute('aria-pressed','true');sfx('pick',{pitch:.95+Math.random()*.2});return;}
    if(first===tile){unselect();sfx('tap');return;}
    const a=first;
    if(a.dataset.piece===tile.dataset.piece)eliminate(a,tile);else{tile.classList.add('is-selected');wrong(a,tile);}
   });
   $('new-game').querySelector('.pz-themes').addEventListener('click',e=>{
    const b=e.target.closest('button[data-theme]');if(!b)return;
    theme=b.dataset.theme;sfx('tap');newBoard(true);
   });
   $('new-game').querySelector('.pz-levels').addEventListener('click',e=>{
    const b=e.target.closest('button[data-level]');if(!b)return;
    level=Number(b.dataset.level);$('new-game').querySelectorAll('.pz-levels button').forEach(x=>x.setAttribute('aria-pressed',x===b));
    sfx('tap');newBoard(true);
   });
   new ResizeObserver(layout).observe(grid);
   newBoard();
  }
 }};
})();
