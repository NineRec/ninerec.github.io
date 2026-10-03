/* Fixed-viewport game shell and three small, forgiving learning games. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id),art=AdventureArt,book=AdventureBook;
  const requested=new URLSearchParams(location.search).get('game');
  const game=['garden','zoo','sea','clock','market','kitchen'].includes(requested)?requested:'garden';
  document.body.dataset.game=game;
  document.title=({garden:'Butterfly Garden',zoo:'A Day at the Zoo',sea:'Under the Sea',clock:'Clock Cottage',market:'The Little Market',kitchen:"Zoey's Kitchen"})[game]+" · Zoey's Little Wonders";
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
    return;
  }
  $('book').hidden=true;$('new-game').hidden=false;
  book.setNarrator(()=>`${currentVoice}.m4a`);
  function shell(title,kicker,body){
    $('new-game').innerHTML=`<header class="toy-heading"><div><p class="eyebrow">${kicker}</p><h1>${title}</h1></div><button class="listen" id="toy-listen" aria-label="Listen to Zoey">▷ Read to me</button></header>${body}`;
    $('toy-listen').addEventListener('click',()=>speak(currentVoice));
  }
  function message(main,detail='',id='toy-message'){$(id).innerHTML=main+(detail?`<small>${detail}</small>`:'');}
  function celebrate(node){node.classList.add('celebrate');const sparkle=document.createElement('span');sparkle.className='toy-sparkles';sparkle.setAttribute('aria-hidden','true');sparkle.textContent='✦   ✧   ✦';node.append(sparkle);setTimeout(()=>sparkle.remove(),1000);}
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
    function render(){const r=routines[step];solved=false;setHour(12);$('clock-routine').classList.remove('celebrate');$('routine-art').innerHTML=r.art;$('routine-title').textContent=r.title;$('routine-time').textContent=r.period;$('hour-target').textContent=`Short hand → ${r.hour%12||12}`;$('clock-progress').textContent=`${step+1} / ${routines.length} little hours`;$('clock-next').disabled=true;$('clock-next').textContent=step===routines.length-1?'Start our day again ↻':'Next little hour →';message('Can you find the hour?','Drag the short hand. It snaps to whole hours.');currentVoice=`clock-find-${r.hour}`;dial.dataset.result='waiting';}
    function check(){if(solved)return;const r=routines[step];if(hour!==(r.hour%12||12)){dial.dataset.result='try-again';message('Almost! Let us try again.',`The short hand needs to point to ${r.hour%12||12}.`);speak('clock-wrong');return;}solved=true;dial.dataset.result='correct';$('clock-next').disabled=false;message(`You found it! ${r.title}.`,r.period);celebrate($('clock-routine'));const actor=$('routine-art');if(r.hour===15)CreatureMotion.play(actor,'mermaid');else actor.animate([{transform:'none'},{transform:'translateY(-10px) rotate(-3deg)'},{transform:'none'}],{duration:reduce()?1:1000});speak(`clock-${r.hour}`);}
    function point(e){const r=$('clock-dial').getBoundingClientRect(),angle=Math.atan2(e.clientX-(r.left+r.width/2),-(e.clientY-(r.top+r.height/2)))*180/Math.PI;setHour((Math.round(angle/30)+12)%12||12);}
    dial.addEventListener('pointerdown',e=>{if(!e.isPrimary||e.button!==0||solved)return;pointer={id:e.pointerId,hour};dial.setPointerCapture(e.pointerId);point(e);e.preventDefault();});
    dial.addEventListener('pointermove',e=>{if(pointer?.id!==e.pointerId)return;point(e);e.preventDefault();});
    dial.addEventListener('pointerup',e=>{if(pointer?.id!==e.pointerId)return;point(e);pointer=null;if(dial.hasPointerCapture(e.pointerId))dial.releasePointerCapture(e.pointerId);check();});
    dial.addEventListener('pointercancel',e=>{if(pointer?.id===e.pointerId){setHour(pointer.hour);pointer=null;}});
    dial.addEventListener('lostpointercapture',e=>{if(pointer?.id===e.pointerId){setHour(pointer.hour);pointer=null;}});
    dial.addEventListener('keydown',e=>{if(solved)return;if(['ArrowLeft','ArrowDown','ArrowRight','ArrowUp'].includes(e.key)){e.preventDefault();setHour((hour+(e.key==='ArrowLeft'||e.key==='ArrowDown'?-2:0)+12)%12+1);}else if(e.key==='Enter'||e.key===' '){e.preventDefault();check();}});
    $('clock-next').addEventListener('click',()=>{if(!solved)return;step=(step+1)%routines.length;render();speak(currentVoice);});
    render();
  }
  function marketGame(){
    const lists=[[{id:'banana',count:2},{id:'strawberry',count:3},{id:'blueberry',count:1}],[{id:'carrot',count:2},{id:'broccoli',count:1},{id:'tomato',count:2}],[{id:'apple',count:1},{id:'orange',count:2},{id:'cucumber',count:1}]];
    const state={round:0,items:[],coins:0,phase:'shop',busy:false};
    shell('The Little Market','PICK A LITTLE · COUNT A LITTLE',`<div class="market-list" id="market-list" aria-label="Shopping list"></div><div class="toy-content market-content"><div class="market-shelves" id="market-shelves"><div class="market-awning" aria-hidden="true"></div><div id="market-foods" class="food-shelf">${Object.keys(foodNames).filter(id=>!['milk','water'].includes(id)).map(tile).join('')}</div></div><aside class="market-counter"><div class="basket-zone" id="basket-zone" aria-label="Shopping basket"><div class="basket-art">${art.basket}</div><div class="basket-items" id="basket-items"></div><span class="basket-count" id="basket-count">0 pieces</span></div><div class="coin-tray" id="coin-tray" aria-label="Payment tray"><span class="eyebrow">ONE GOLD COIN PER PIECE</span><div class="paid-coins" id="paid-coins"></div><span id="coin-count">0 gold coins</span></div><div id="coin-purse" class="coin-purse"><button class="food-tile coin-source" id="coin-source" data-pick="coin" aria-label="Add one gold coin" disabled>${art.coin}<span>One coin</span></button><span class="coin-rule" id="coin-rule">Fill the basket first</span></div></aside></div><footer class="toy-footer"><p class="toy-message" id="toy-message" role="status"></p><button class="toy-button" id="market-check" disabled>Pay &amp; check ✓</button></footer>`);
    function total(){return lists[state.round].reduce((n,a)=>n+a.count,0);}
    function render(){
      const list=lists[state.round];$('market-list').innerHTML=`<span class="list-title">TODAY'S LITTLE LIST <small>${state.round+1} / ${lists.length}</small></span>`+list.map(a=>{const count=state.items.filter(id=>id===a.id).length;return `<div class="list-item ${count===a.count?'list-done':''}" data-list="${a.id}">${art.food[a.id]}<span>${foodNames[a.id]}<strong>${count} / ${a.count}${count===a.count?' ✓':''}</strong></span></div>`;}).join('');
      $('basket-items').innerHTML=state.items.map(id=>`<span data-bought="${id}">${art.food[id]}</span>`).join('');$('basket-count').textContent=`${state.items.length} pieces`;
      $('paid-coins').innerHTML=Array.from({length:state.coins},(_,i)=>`<button class="paid-coin" data-remove-coin="${i}" aria-label="Put one coin back in the purse">${art.coin}</button>`).join('');$('coin-count').textContent=`${state.coins} gold coins`;
      $('coin-source').disabled=state.phase==='shop'||state.phase==='done';$('market-check').disabled=state.phase==='shop';$('coin-rule').textContent=state.phase==='shop'?'Fill the basket first':`${state.items.length} pieces → ${state.items.length} coins`;
      $('new-game').dataset.phase=state.phase;
    }
    async function pick(id,node){
      if(state.busy||state.phase==='done')return;
      if(id==='coin'){
        if(state.phase!=='pay')return;
        if(state.coins>=total()){returnTile(node);message('Our tray already has enough coins.','Tap a coin on the tray to put it back.');speak('market-coins');return;}
        state.busy=true;await fly(node,$('coin-tray'));state.coins++;state.busy=false;render();message('One more gold coin.',`${state.coins} coins for ${state.items.length} pieces of food.`);return;
      }
      const wanted=lists[state.round].find(a=>a.id===id),count=state.items.filter(a=>a===id).length;
      if(state.phase!=='shop'||!wanted||count>=wanted.count){returnTile(node);message('Back to the shelf, little friend.','Let us look at our list again.');speak('market-wrong');return;}
      state.busy=true;speak(`food-${id}`);await fly(node,$('basket-zone'));state.items.push(id);state.busy=false;
      if(state.items.length===total()){state.phase='pay';message('Our basket is ready!','Now place the same number of gold coins on the tray.');speak('market-pay');}else message('Lovely! Into our basket.',`${state.items.length} of ${total()} pieces found.`);
      render();
    }
    bindPick($('market-foods'),'#basket-zone',pick);bindPick($('coin-purse'),'#coin-tray',pick);
    $('paid-coins').addEventListener('click',e=>{if(e.target.closest('[data-remove-coin]')&&state.phase==='pay'&&!state.busy){state.coins--;render();}});
    $('market-check').addEventListener('click',()=>{
      if(state.busy)return;
      if(state.phase==='done'){state.round=(state.round+1)%lists.length;state.items=[];state.coins=0;state.phase='shop';$('basket-zone').classList.remove('celebrate');$('coin-tray').classList.remove('celebrate');$('market-check').textContent='Pay & check ✓';render();message('A fresh little shopping list!','Tap food or drag it into the basket.');speak('market-intro');return;}
      if(state.items.length!==total()||state.coins!==state.items.length){message('Let us count once more.',`We need ${state.items.length} gold coins for ${state.items.length} pieces.`);speak('market-coins');return;}
      state.phase='done';render();message('The food and coins match!','Thank you for shopping with Zoey.');speak('market-done');celebrate($('basket-zone'));celebrate($('coin-tray'));$('market-check').textContent='Another little list →';
    });
    render();message('What is on our shopping list?','Tap a piece of food, or drag it into the basket.');
  }
  function kitchenGame(){
    const recipes=[{id:'boat',name:'Fruit boat',dish:'boat',items:['banana','strawberry','blueberry'],stir:false,boil:false},{id:'soup',name:'Vegetable soup',dish:'soup',items:['carrot','broccoli','tomato','water'],stir:true,boil:true},{id:'milk',name:'Strawberry milk',dish:'strawberryMilk',items:['strawberry','milk'],stir:true,boil:false}];
    const state={recipe:0,step:0,stirs:0,phase:'preview',busy:false,token:0,timer:null};let stirPointer=null;
    shell("Zoey's Kitchen",'A LITTLE RECIPE · A LOVELY DISH',`<nav class="recipe-menu" id="recipe-menu" aria-label="Choose a recipe">${recipes.map((r,i)=>`<button data-recipe="${i}" class="recipe-tab" aria-pressed="${i===0}">${art.dishes[r.dish]}<span>${r.name}</span></button>`).join('')}</nav><div class="toy-content kitchen-content"><aside class="recipe-card"><p class="eyebrow">FIRST, OUR FINISHED DISH</p><div class="finished-preview" id="finished-preview"></div><h2 id="recipe-name"></h2><ol class="recipe-steps" id="recipe-steps"></ol><div class="recipe-guide">${guide()}</div></aside><div class="kitchen-work"><div class="cook-zone" id="cook-zone" aria-label="Cooking bowl. Drop the next ingredient here."><span class="kitchen-label" id="kitchen-label">Shall we make it?</span><div class="cooking-vessel" id="cooking-vessel"></div><div class="added-ingredients" id="added-ingredients"></div><div class="soup-bubbles" id="soup-bubbles" hidden><i></i><i></i><i></i><i></i></div><div class="stir-spoon" id="stir-spoon" hidden><svg viewBox="0 0 40 160"><ellipse cx="20" cy="130" rx="17" ry="28" fill="#b18c61"/><path d="M20 10v109" stroke="#b18c61" stroke-width="12" stroke-linecap="round"/></svg></div><div class="cook-meter" id="cook-meter" hidden><span id="cook-meter-fill"></span></div></div><div class="food-shelf kitchen-shelf" id="kitchen-shelf">${['banana','strawberry','blueberry','carrot','broccoli','tomato','water','milk'].map(tile).join('')}</div></div></div><footer class="toy-footer"><p class="toy-message" id="toy-message" role="status"></p><button class="toy-button" id="kitchen-action">Let's make it →</button></footer>`);
    const recipe=()=>recipes[state.recipe];
    function vessel(){if(recipe().id==='milk')return `<svg viewBox="0 0 260 220"><path d="M81 30h99l-11 172H94Z" fill="#d8e5d9" fill-opacity=".65" stroke="#99b7ab" stroke-width="4"/><path d="M87 117h87l-6 83H94Z" fill="#d5e4d7"/></svg>`;if(recipe().id==='boat')return `<svg viewBox="0 0 260 220"><ellipse cx="130" cy="182" rx="108" ry="20" fill="#d4dbc2"/><ellipse cx="130" cy="177" rx="92" ry="14" fill="#eef0df"/></svg>`;return `<svg viewBox="0 0 260 220"><path d="M55 113H35q-24 0-22 26q4 16 39 14M204 113h23q24 0 21 26q-4 16-40 14" stroke="#7e9b88" stroke-width="10" fill="none"/><path d="M48 101h166v62q-4 49-84 49q-78 0-82-49Z" fill="#a4bc9f"/><ellipse cx="131" cy="102" rx="83" ry="25" fill="#d4deba" stroke="#7e9b88" stroke-width="4"/></svg>`;}
    function render(){
      const r=recipe();$('new-game').dataset.phase=state.phase;$('new-game').dataset.recipe=r.id;$('new-game').dataset.step=state.step;$('new-game').dataset.stirs=state.stirs;
      $('recipe-menu').querySelectorAll('[data-recipe]').forEach((b,i)=>b.setAttribute('aria-pressed',i===state.recipe));$('finished-preview').innerHTML=art.dishes[r.dish];$('recipe-name').textContent=r.name;
      $('recipe-steps').innerHTML=r.items.map((id,i)=>`<li class="${i<state.step?'step-done':i===state.step&&state.phase==='ingredients'?'step-current':''}">${foodNames[id]}${i<state.step?' ✓':''}</li>`).join('')+(r.stir?`<li class="${state.stirs===3?'step-done':state.phase==='stir'?'step-current':''}">Stir three times${state.stirs===3?' ✓':''}</li>`:'')+(r.boil?`<li class="${state.phase==='done'?'step-done':state.phase==='wait'?'step-current':''}">Wait for the bubbles</li>`:'');
      $('kitchen-shelf').querySelectorAll('[data-pick]').forEach(b=>{b.disabled=state.phase!=='ingredients';b.classList.toggle('next-ingredient',state.phase==='ingredients'&&b.dataset.pick===r.items[state.step]);});
      $('stir-spoon').hidden=state.phase!=='stir';$('soup-bubbles').hidden=state.phase!=='wait';$('cook-meter').hidden=state.phase!=='wait';
      $('added-ingredients').innerHTML=r.items.slice(0,state.step).map((id,i)=>`<span style="--ingredient-index:${i}">${art.food[id]}</span>`).join('');$('added-ingredients').hidden=state.phase==='done';
      $('kitchen-label').textContent=state.phase==='preview'?'See the dish. Follow the recipe.':state.phase==='ingredients'?`Next: ${foodNames[r.items[state.step]]}`:state.phase==='stir'?`Stir · ${state.stirs} / 3`:state.phase==='wait'?'Bubble, bubble…':'Our lovely dish is ready!';
      $('kitchen-action').disabled=state.phase==='ingredients'||state.phase==='wait';$('kitchen-action').textContent=state.phase==='preview'?"Let's make it →":state.phase==='stir'?'One little stir ↻':state.phase==='done'?'Make it again ↻':'Follow the recipe';
    }
    function reset(index=state.recipe){state.token++;clearInterval(state.timer);state.timer=null;stirPointer=null;state.recipe=index;state.step=0;state.stirs=0;state.phase='preview';state.busy=false;$('cook-zone').classList.remove('celebrate');$('cooking-vessel').innerHTML=vessel();render();message('Look at the lovely dish we will make.','When you are ready, follow the ingredients in order.');currentVoice=`recipe-${recipe().id}`;}
    function finish(announce=false){state.phase='done';state.busy=false;$('cooking-vessel').innerHTML=art.dishes[recipe().dish];$('cooking-vessel').animate([{opacity:.3,transform:'scale(.75)'},{opacity:1,transform:'scale(1)'}],{duration:reduce()?1:650});render();celebrate($('cook-zone'));message(`We made ${recipe().name.toLowerCase()}!`,'A lovely dish made by you and Zoey.');currentVoice='kitchen-done';if(announce)speak('kitchen-done');}
    function afterIngredients(){if(recipe().stir){state.phase='stir';state.stirs=0;render();message('Now stir it around.','Make three gentle circles, or tap the stir button.');speak('kitchen-stir');}else finish();}
    async function pick(id,node){
      if(state.phase!=='ingredients'||state.busy)return;
      if(id!==recipe().items[state.step]){returnTile(node);message('Not yet, little chef!',`Next comes ${foodNames[recipe().items[state.step]].toLowerCase()}.`);speak('kitchen-wrong');return;}
      const token=state.token;state.busy=true;speak(state.step===recipe().items.length-1&&!recipe().stir?'kitchen-done':`food-${id}`);await fly(node,$('cook-zone'));if(token!==state.token)return;state.step++;state.busy=false;
      if(state.step===recipe().items.length)afterIngredients();else{render();message('Lovely! One step at a time.',`Next comes ${foodNames[recipe().items[state.step]].toLowerCase()}.`);}
    }
    function stir(){
      if(state.phase!=='stir')return;state.stirs++;$('stir-spoon').animate([{transform:'rotate(0deg)'},{transform:'rotate(360deg)'}],{duration:reduce()?1:550});
      if(state.stirs<3){render();message('Around and around!',`${state.stirs} of 3 gentle circles.`);return;}
      if(!recipe().boil){finish(true);return;}
      state.phase='wait';render();message('Bubble, bubble…','Good things take a little time.');speak('kitchen-wait');const token=state.token,start=performance.now();$('cook-meter-fill').style.width='0%';
      state.timer=setInterval(()=>{if(token!==state.token){clearInterval(state.timer);return;}const fraction=Math.min(1,(performance.now()-start)/3500);$('cook-meter-fill').style.width=`${fraction*100}%`;if(fraction===1){clearInterval(state.timer);state.timer=null;finish();}},80);
    }
    bindPick($('kitchen-shelf'),'#cook-zone',pick);
    $('kitchen-action').addEventListener('click',()=>{if(state.phase==='preview'){state.phase='ingredients';render();message('Let us follow our little recipe.',`First, ${foodNames[recipe().items[0]].toLowerCase()}.`);speak(`recipe-${recipe().id}`);}else if(state.phase==='stir')stir();else if(state.phase==='done'){reset();speak(currentVoice);}});
    $('recipe-menu').addEventListener('click',e=>{const b=e.target.closest('[data-recipe]');if(b){reset(Number(b.dataset.recipe));speak(currentVoice);}});
    const zone=$('cook-zone');
    function angle(e){const r=zone.getBoundingClientRect();return Math.atan2(e.clientY-r.top-r.height/2,e.clientX-r.left-r.width/2);}
    zone.addEventListener('pointerdown',e=>{if(state.phase!=='stir'||!e.isPrimary||e.button!==0)return;stirPointer={id:e.pointerId,last:angle(e),sum:0};zone.setPointerCapture(e.pointerId);e.preventDefault();});
    zone.addEventListener('pointermove',e=>{if(stirPointer?.id!==e.pointerId||state.phase!=='stir')return;const a=angle(e),d=Math.atan2(Math.sin(a-stirPointer.last),Math.cos(a-stirPointer.last));stirPointer.last=a;if(Math.abs(d)<Math.PI/2)stirPointer.sum+=Math.abs(d);$('stir-spoon').style.rotate=`${a*180/Math.PI}deg`;if(stirPointer.sum>=Math.PI*2){stirPointer.sum-=Math.PI*2;stir();}e.preventDefault();});
    function stopStir(e){if(stirPointer?.id===e.pointerId){stirPointer=null;$('stir-spoon').style.rotate='';if(zone.hasPointerCapture(e.pointerId))zone.releasePointerCapture(e.pointerId);}}
    zone.addEventListener('pointerup',stopStir);zone.addEventListener('pointercancel',stopStir);zone.addEventListener('lostpointercapture',stopStir);
    window.addEventListener('pagehide',()=>{clearInterval(state.timer);state.token++;});
    reset(0);
  }
  if(game==='clock')clockGame();else if(game==='market')marketGame();else kitchenGame();
})();
