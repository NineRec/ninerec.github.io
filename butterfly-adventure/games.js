/* Fixed-viewport game shell and three small, forgiving learning games. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id),art=AdventureArt,book=AdventureBook;
  const requested=({kitchen:'icecream'})[new URLSearchParams(location.search).get('game')]||new URLSearchParams(location.search).get('game');
  const game=['garden','zoo','sea','clock','market','icecream','traffic','counting','letters','seedling','connect','match'].includes(requested)?requested:'garden';
  document.body.dataset.game=game;document.querySelector('.brand').innerHTML=art.icons.home;$('fullscreen').textContent='⛶';
  document.title=({garden:'Butterfly Garden',zoo:'A Day at the Zoo',sea:'Under the Sea',clock:'Clock Cottage',market:'The Little Market',icecream:"Zoey's Ice Cream Shop",traffic:'A Little Walk',counting:'A Counting Picnic',letters:'Letter Balloons',seedling:'挖呀种花园',connect:'Connect the Pairs',match:'找朋友消消乐'})[game]+" · Zoey's Little Wonders";
  const flow=window.PlayFlow;
  const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  let currentVoice=`${game}-intro`;
  function speak(id){currentVoice=id;book.playAudio(`${id}.m4a`);}
  function fit(){document.body.style.setProperty('--game-height',`${Math.round(window.visualViewport?.height||innerHeight)}px`);}
  fit();window.addEventListener('resize',fit);window.visualViewport?.addEventListener('resize',fit);
  $('fullscreen').hidden=!document.documentElement.requestFullscreen&&!document.documentElement.webkitRequestFullscreen;
  $('fullscreen').addEventListener('click',async()=>{try{const el=document.documentElement;await (el.requestFullscreen?.()||el.webkitRequestFullscreen?.());fit();}catch{$('fullscreen').textContent='Browser full screen';}});
  $('memory-close').addEventListener('click',()=>$('game').hidden=true);
  if(['garden','zoo','sea'].includes(game)){
    book.changeWorld(game);
    if(game==='garden')document.querySelector('.garden-art').setAttribute('preserveAspectRatio','xMidYMid meet');
    book.startAudio();return;
  }
  $('book').hidden=true;$('new-game').hidden=false;
  book.setNarrator(()=>`${currentVoice}.m4a`);
  function shell(title,kicker,body){
    $('new-game').innerHTML=`<header class="toy-heading"><div><p class="eyebrow">${kicker}</p><h1>${title}</h1></div><button class="listen" id="toy-listen" aria-label="Listen to Zoey">▷ Read to me</button></header>${body}`;
    $('toy-listen').innerHTML=art.icons.ear;$('toy-listen').addEventListener('click',()=>speak(currentVoice));
  }
  function message(main,detail='',id='toy-message'){$(id).innerHTML=main+(detail?`<small>${detail}</small>`:'');}
  function celebrate(node){window.LittleCelebration?.burst();node.classList.add('celebrate');const sparkle=document.createElement('span');sparkle.className='toy-sparkles';sparkle.setAttribute('aria-hidden','true');sparkle.textContent='✦   ✧   ✦';node.append(sparkle);setTimeout(()=>sparkle.remove(),1000);}
  function guide(){return `<div class="toy-guide guide" style="position:relative;right:auto;bottom:auto">${art.kid()}</div>`;}
  // Pointer dragging supports iPad; taps and keyboard clicks are equivalent alternatives.
  function bindPick(container,dropSelector,callback){
    let drag=null;
    container.addEventListener('pointerdown',e=>{
      const tile=e.target.closest('[data-pick]');if(!tile||tile.disabled||!e.isPrimary||e.button!==0)return;
      drag={tile,id:e.pointerId,x:e.clientX,y:e.clientY,moved:false,ghost:null};tile.setPointerCapture(e.pointerId);e.preventDefault();
    });
    container.addEventListener('pointermove',e=>{
      if(!drag||drag.id!==e.pointerId)return;
      if(!drag.moved&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<8)return;
      drag.moved=true;
      if(!drag.ghost){drag.ghost=document.createElement('span');drag.ghost.className='drop-ghost';drag.ghost.innerHTML=drag.tile.querySelector('svg').outerHTML;document.body.append(drag.ghost);}
      drag.ghost.style.left=`${e.clientX-42}px`;drag.ghost.style.top=`${e.clientY-42}px`;e.preventDefault();
    });
    function end(e){
      if(!drag||drag.id!==e.pointerId)return;
      const gesture=drag;drag=null;gesture.ghost?.remove();
      if(gesture.tile.hasPointerCapture(e.pointerId))gesture.tile.releasePointerCapture(e.pointerId);
      if(e.type==='pointercancel')return;
      const zone=document.querySelector(dropSelector).getBoundingClientRect();
      const over=e.clientX>=zone.left&&e.clientX<=zone.right&&e.clientY>=zone.top&&e.clientY<=zone.bottom;
      if(!gesture.moved||over)callback(gesture.tile.dataset.pick,gesture.tile);else returnTile(gesture.tile);
      e.preventDefault();
    }
    container.addEventListener('pointerup',end);container.addEventListener('pointercancel',end);
    container.addEventListener('lostpointercapture',e=>{if(drag&&drag.id===e.pointerId){drag.ghost?.remove();drag=null;}});
    container.addEventListener('click',e=>{const tile=e.target.closest('[data-pick]');if(tile&&e.detail===0&&!tile.disabled)callback(tile.dataset.pick,tile);});
  }
  function returnTile(tile){tile.classList.remove('returning');void tile.offsetWidth;tile.classList.add('returning');setTimeout(()=>tile.classList.remove('returning'),650);}
  async function fly(tile,zone){
    const a=tile.getBoundingClientRect(),b=zone.getBoundingClientRect(),ghost=document.createElement('span');ghost.className='drop-ghost';ghost.innerHTML=tile.querySelector('svg').outerHTML;ghost.style.left=`${a.left+a.width/2-42}px`;ghost.style.top=`${a.top+a.height/2-42}px`;document.body.append(ghost);
    const motion=ghost.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${b.left+b.width/2-a.left-a.width/2}px,${b.top+b.height/2-a.top-a.height/2}px) scale(.55)`,opacity:.9}],{duration:reduce()?1:430,easing:'ease-in-out'});
    try{await motion.finished;}finally{ghost.remove();}
  }
  const foodNames={banana:'Banana',strawberry:'Strawberry',blueberry:'Blueberry',apple:'Apple',orange:'Orange',carrot:'Carrot',broccoli:'Broccoli',tomato:'Tomato',cucumber:'Cucumber',peas:'Peas',milk:'Milk',water:'Water'};
  function tile(id){return `<button class="food-tile" data-pick="${id}" aria-label="Pick ${foodNames[id].toLowerCase()}">${art.food[id]}<span>${foodNames[id]}</span></button>`;}
  function clockGame(){
    const routines=[{hour:8,title:'Breakfast time',period:'8 AM · 08:00',art:art.food.milk},{hour:10,title:'Market time',period:'10 AM · 10:00',art:art.basket},{hour:12,title:'Garden time',period:'12 PM · 12:00',art:'<svg viewBox="0 0 240 180"><use href="#butterfly"/></svg>'},{hour:15,title:'Mermaid time',period:'3 PM · 15:00',art:art.animals.mermaid},{hour:16,title:'Rest time',period:'4 PM · 16:00',art:art.animals.rabbit},{hour:18,title:'Soup time',period:'6 PM · 18:00',art:art.dishes.soup},{hour:20,title:'Bath time',period:'8 PM · 20:00',art:art.food.water},{hour:21,title:'Princess story time',period:'9 PM · 21:00',art:art.story}];
    let step=0,hour=12,solved=false,pointer=null;
    shell('Clock Cottage','LITTLE HANDS · LOVELY HOURS',`<div class="toy-content clock-content"><div class="clock-house"><div class="clock-roof" aria-hidden="true"></div><div id="clock-control" class="clock-control" role="slider" tabindex="0" aria-label="Short hour hand. Use arrow keys to move and Enter to check." aria-valuemin="1" aria-valuemax="12" aria-valuenow="12"><svg id="clock-dial" viewBox="0 0 420 420" aria-hidden="true"><circle cx="210" cy="210" r="193" fill="#fbf1d0" stroke="#c5a273" stroke-width="9"/><circle cx="210" cy="210" r="173" fill="none" stroke="#e2ce9f" stroke-width="2"/>${Array.from({length:12},(_,i)=>{const n=i+1,angle=n*Math.PI/6;return `<text x="${210+146*Math.sin(angle)}" y="${218-146*Math.cos(angle)}" text-anchor="middle" font-family="Georgia" font-size="31" fill="#596b4f">${n}</text>`;}).join('')}<path id="minute-hand" d="M210 210V82" stroke="#718969" stroke-width="9" stroke-linecap="round"/><g id="hour-hand"><path d="M210 224V120" stroke="#b77955" stroke-width="17" stroke-linecap="round"/><circle cx="210" cy="125" r="19" fill="#b77955" stroke="#f7e5b8" stroke-width="4"/></g><circle cx="210" cy="210" r="13" fill="#d5b067"/></svg></div><p class="clock-hint">Long hand at 12. Move the short hand.</p></div><aside class="clock-routine" id="clock-routine"><span class="routine-art" id="routine-art"></span><p class="eyebrow">OUR NEXT LITTLE MOMENT</p><h2 id="routine-title"></h2><p class="clock-time" id="routine-time"></p><span class="hour-target" id="hour-target"></span><div class="routine-guide">${guide()}<span>Shall we find the hour?</span></div></aside></div><footer class="toy-footer"><p id="toy-message" class="toy-message" role="status"></p><div><p id="clock-progress" class="toy-counter"></p><button class="toy-button" id="clock-next" disabled>Next little hour →</button></div></footer>`);
    const dial=$('clock-control');
    function setHour(value){hour=value;$('hour-hand').style.transform=`rotate(${hour*30}deg)`;dial.setAttribute('aria-valuenow',hour);dial.setAttribute('aria-valuetext',`${hour} o'clock`);}
    function render(){flow.cancel();const r=routines[step];solved=false;setHour(12);$('clock-routine').classList.remove('celebrate');$('routine-art').innerHTML=r.art;$('routine-title').textContent=r.title;$('routine-time').textContent=r.period;$('hour-target').innerHTML=`<strong>${r.hour%12||12}</strong>`;$('clock-control').dataset.target=r.hour%12||12;$('clock-progress').textContent=`${step+1} / ${routines.length} little hours`;$('clock-next').disabled=true;$('clock-next').textContent=step===routines.length-1?'Start our day again ↻':'Next little hour →';message('Can you find the hour?','Drag the short hand. It snaps to whole hours.');currentVoice=`clock-find-${r.hour}`;dial.dataset.result='waiting';}
    function check(){if(solved)return;const r=routines[step];if(hour!==(r.hour%12||12)){dial.dataset.result='try-again';message('Almost! Let us try again.',`The short hand needs to point to ${r.hour%12||12}.`);speak('clock-wrong');return;}solved=true;dial.dataset.result='correct';$('clock-next').disabled=false;message(`You found it! ${r.title}.`,r.period);celebrate($('clock-routine'));const actor=$('routine-art');if(r.hour===15)CreatureMotion.play(actor,'mermaid');else actor.animate([{transform:'none'},{transform:'translateY(-10px) rotate(-3deg)'},{transform:'none'}],{duration:reduce()?1:1000});speak(`clock-${r.hour}`);flow.after(nextHour);}
    function point(e){const r=$('clock-dial').getBoundingClientRect(),angle=Math.atan2(e.clientX-(r.left+r.width/2),-(e.clientY-(r.top+r.height/2)))*180/Math.PI;setHour((Math.round(angle/30)+12)%12||12);}
    dial.addEventListener('pointerdown',e=>{if(!e.isPrimary||e.button!==0||solved)return;pointer={id:e.pointerId,hour};dial.setPointerCapture(e.pointerId);point(e);e.preventDefault();});
    dial.addEventListener('pointermove',e=>{if(pointer?.id!==e.pointerId)return;point(e);e.preventDefault();});
    dial.addEventListener('pointerup',e=>{if(pointer?.id!==e.pointerId)return;point(e);pointer=null;if(dial.hasPointerCapture(e.pointerId))dial.releasePointerCapture(e.pointerId);check();});
    dial.addEventListener('pointercancel',e=>{if(pointer?.id===e.pointerId){setHour(pointer.hour);pointer=null;}});
    dial.addEventListener('lostpointercapture',e=>{if(pointer?.id===e.pointerId){setHour(pointer.hour);pointer=null;}});
    dial.addEventListener('keydown',e=>{if(solved)return;if(['ArrowLeft','ArrowDown','ArrowRight','ArrowUp'].includes(e.key)){e.preventDefault();setHour((hour+(e.key==='ArrowLeft'||e.key==='ArrowDown'?-2:0)+12)%12+1);}else if(e.key==='Enter'||e.key===' '){e.preventDefault();check();}});
    function nextHour(){if(!solved)return;step=(step+1)%routines.length;render();speak(currentVoice);}$('clock-next').setAttribute('aria-label','Next hour');$('clock-next').addEventListener('click',nextHour);
    render();
  }
  function marketGame(){
    const lists=[[{id:'banana',count:2},{id:'strawberry',count:3},{id:'blueberry',count:1}],[{id:'carrot',count:2},{id:'broccoli',count:1},{id:'tomato',count:2}],[{id:'apple',count:1},{id:'orange',count:2},{id:'cucumber',count:1}]];
    const state={round:0,items:[],coins:0,phase:'shop',busy:false,token:0};
    shell('The Little Market','',`<div class="market-list" id="market-list" aria-label="Picture shopping list"></div><div class="toy-content market-content"><div class="market-shelves" id="market-shelves"><div class="market-awning" aria-hidden="true"></div><div id="market-foods" class="food-shelf"></div></div><aside class="market-counter"><div class="cashier-desk"><button id="market-cashier" class="cashier-person" aria-label="Talk to our cashier">${art.cashier}</button><div class="cash-register" id="cash-register">${art.register}<span id="register-total"></span></div></div><div class="basket-zone" id="basket-zone" aria-label="Shopping basket"><div class="basket-art">${art.basket}</div><div class="basket-items" id="basket-items"></div><span class="basket-count" id="basket-count"></span></div><div class="coin-tray" id="coin-tray" aria-label="Payment tray"><div class="coin-slots" id="coin-slots"></div><div class="paid-coins" id="paid-coins"></div><span id="coin-count" class="sr-only"></span></div><div id="coin-purse" class="coin-purse"><button class="food-tile coin-source" id="coin-source" data-pick="coin" aria-label="Add one gold coin" disabled>${art.coin}</button><button class="toy-button picture-check" id="market-check" aria-label="Pay the cashier" disabled>${art.icons.check}</button><span class="coin-rule sr-only" id="coin-rule"></span></div></aside></div><footer class="toy-footer"><p class="toy-message sr-only" id="toy-message" role="status"></p><div class="round-dots" id="market-rounds" aria-label="Shopping rounds"></div></footer>`);
    const total=()=>lists[state.round].reduce((n,a)=>n+a.count,0);
    function render(){
      const list=lists[state.round];$('market-list').innerHTML=list.map(a=>{const count=state.items.filter(id=>id===a.id).length;return `<div class="list-item ${count===a.count?'list-done':''}" data-list="${a.id}" aria-label="${count} of ${a.count} ${foodNames[a.id]}">${art.food[a.id]}<div class="list-pips">${Array.from({length:a.count},(_,i)=>`<i class="${i<count?'filled':''}">${i<count?'✓':''}</i>`).join('')}</div><strong class="list-number">${a.count}</strong></div>`;}).join('');
      $('basket-items').innerHTML=state.items.map(id=>`<span data-bought="${id}">${art.food[id]}</span>`).join('');$('basket-count').textContent=state.items.length;
      $('paid-coins').innerHTML=Array.from({length:state.coins},(_,i)=>`<button class="paid-coin" data-remove-coin="${i}" aria-label="Put one coin back">${art.coin}</button>`).join('');
      $('coin-slots').innerHTML=Array.from({length:total()},()=>`<span>${art.coin}</span>`).join('');$('coin-count').textContent=`${state.coins} coins for ${total()} items`;
      $('register-total').innerHTML=state.phase==='done'?'✓':`${total()}`;$('cash-register').dataset.ready=state.phase==='pay'&&state.coins===total();
      $('coin-source').disabled=state.phase!=='pay'||state.busy;$('market-check').disabled=state.phase!=='pay'||state.busy;$('market-check').classList.toggle('ready-to-check',state.phase==='pay'&&state.coins===total());
      $('coin-rule').textContent=`${total()} pieces → ${total()} coins`;$('new-game').dataset.phase=state.phase;$('new-game').dataset.round=state.round;$('new-game').dataset.coins=state.coins;
      $('market-rounds').innerHTML=lists.map((_,i)=>`<i class="${i===state.round?'current':''}"></i>`).join('');
    }
    function reset(){flow.cancel();state.token++;state.items=[];state.coins=0;state.phase='shop';state.busy=false;$('basket-zone').classList.remove('celebrate');$('coin-tray').classList.remove('celebrate');$('market-cashier').classList.remove('cashier-thanks','cashier-wave');
      const wanted=lists[state.round].map(a=>a.id),others=Object.keys(art.food).filter(id=>!wanted.includes(id)&&!['milk','water'].includes(id));
      const rack=[...wanted,...others.slice(state.round, state.round+3)];$('market-foods').innerHTML=rack.sort(()=>Math.random()-.5).map(tile).join('');render();currentVoice='market-cashier';message('Welcome! Match the picture list.');
    }
    async function pick(id,node){
      if(state.busy||state.phase==='done')return;const own=state.token;
      if(id==='coin'){
        if(state.phase!=='pay')return;if(state.coins>=total()){returnTile(node);speak('market-coins');return;}
        state.busy=true;render();await fly(node,$('coin-tray'));if(own!==state.token)return;state.coins++;state.busy=false;render();if(state.coins===total()){speak('market-checkout');$('market-cashier').classList.add('cashier-wave');}return;
      }
      const wanted=lists[state.round].find(a=>a.id===id),count=state.items.filter(a=>a===id).length;
      if(state.phase!=='shop'||!wanted||count>=wanted.count){returnTile(node);speak('market-wrong');return;}
      state.busy=true;speak(`food-${id}`);await fly(node,$('basket-zone'));if(own!==state.token)return;state.items.push(id);state.busy=false;
      if(state.items.length===total()){state.phase='pay';speak('market-pay');$('coin-source').classList.add('next-ingredient');}render();
    }
    async function checkout(){
      if(state.busy||state.phase==='done')return;
      if(state.phase!=='pay'){speak('market-cashier');return;}
      if(state.coins!==total()){returnTile($('market-check'));speak('market-coins');return;}
      state.phase='done';render();speak('market-done');$('market-cashier').classList.add('cashier-thanks');
      $('paid-coins').animate([{transform:'none',opacity:1},{transform:'translateY(-40px) scale(.5)',opacity:0}],{duration:reduce()?1:550});
      celebrate($('basket-zone'));flow.after(()=>{state.round=(state.round+1)%lists.length;reset();speak('market-cashier');});
    }
    bindPick($('market-foods'),'#basket-zone',pick);bindPick($('coin-purse'),'#coin-tray',pick);
    $('paid-coins').addEventListener('click',e=>{if(e.target.closest('[data-remove-coin]')&&state.phase==='pay'&&!state.busy){state.coins--;render();}});
    $('market-check').addEventListener('click',checkout);$('market-cashier').addEventListener('click',checkout);window.addEventListener('pagehide',()=>state.token++);reset();
  }
  if(['connect','match'].includes(game))PuzzleGames.start(game,{$,art,shell,speak,setVoice:id=>currentVoice=id,message,celebrate,flow});
  else if(game==='letters')LetterGame.start({$,art,shell,setVoice:id=>currentVoice=id,message,celebrate,flow});
  else if(game==='icecream')IceCreamShop.start({$,art,shell,setVoice:id=>currentVoice=id,message,bindPick,returnTile,celebrate,flow});
  else if(['traffic','counting','seedling'].includes(game))MiniGames.start(game,{$,art,shell,speak,setVoice:id=>currentVoice=id,message,guide,bindPick,returnTile,fly,celebrate,foodNames,flow});
  else if(game==='clock')clockGame();else marketGame();
  book.startAudio(()=>currentVoice);
})();
