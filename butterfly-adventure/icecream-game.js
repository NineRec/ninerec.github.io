/* Zoey's Ice Cream Shop.
 * A friendly animal walks up and says what it would like. A picture of the order floats beside it.
 * Build it in order: a cone (or a cup), scoop after scoop from the tubs, then a topping. Ring the bell to serve.
 * Three customers make a shift; the levels add scoops, toppings and choosing a cup or a cone. */
(() => {
 'use strict';
 const shuffle=list=>{const r=list.slice();for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]];}return r;};
 const pick=list=>list[Math.floor(Math.random()*list.length)];
 const sfx=(name,o)=>window.SoundFX?.play(name,o);
 const CUSTOMERS=['rabbit','bear','panda','monkey','elephant','giraffe','tiger','lion','fox','cow','koala','pig','penguin','frog','otter','kangaroo','owl','duck','deer','hippo','sheep','zebra'];
 const SHIFT=3,THANKS=3;
 // scoops: [fewest, most]; topping: how often an order has one; choose: customer might want a cup instead of a cone
 const LEVELS=[{scoops:[1,1],topping:0,choose:false},{scoops:[2,2],topping:.5,choose:false},{scoops:[2,3],topping:1,choose:true}];
 const orderKey=o=>`${o.holder}|${o.scoops.join(',')}|${o.topping||''}`;

 window.IceCreamShop={start(kit){
  const {$,art,shell,setVoice,message,bindPick,returnTile,celebrate,flow}=kit,book=window.AdventureBook,Say=window.Say,IC=art.iceCream;
  const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait=ms=>new Promise(r=>setTimeout(r,reduce()?1:ms));
  const hintDelay=Number(new URLSearchParams(location.search).get('hint'))||9000,pace=Number(new URLSearchParams(location.search).get('pace'))||0;
  let level=1,served=0,phase='order',token=0,wrongs=0,order=null,built=null,customer='',crowd=[],lastKey='',hintTimer=0,thanks=0,busy=false;

  const levels=`<nav class="pz-levels" aria-label="Choose difficulty">${[1,2,3].map(n=>`<button data-level="${n}" aria-label="${['One scoop','Two scoops and toppings','Cups, cones, three scoops'][n-1]}" aria-pressed="${n===1}">${'●'.repeat(n)}</button>`).join('')}</nav>`;
  const tubs=IC.flavorIds.map(f=>`<button class="ic-pick ic-tub" data-pick="${f}" data-kind="flavor" aria-label="${IC.flavors[f].name}">${IC.tub(f)}</button>`).join('');
  const jars=IC.toppings.map(t=>`<button class="ic-pick ic-jar" data-pick="${t}" data-kind="topping" aria-label="${t}">${IC.jar(t)}</button>`).join('');
  const holders=['cone','cup'].map(h=>`<button class="ic-pick ic-holder-tile" data-pick="${h}" data-kind="holder" aria-label="${h}">${IC.holderTile(h)}</button>`).join('');
  shell("Zoey's Ice Cream Shop",'',`${levels}<div class="toy-content ic-content"><section class="ic-shop" id="ic-shop" aria-label="Ice cream shop"><div class="ic-awning" aria-hidden="true"></div><div class="ic-window"><button class="ic-customer" id="ic-customer" aria-label="Our customer. Tap to hear the order."></button><button class="ic-bubble" id="ic-bubble" aria-label="What our customer would like"><span class="ic-order" id="ic-order"></span></button></div><div class="ic-counter" id="ic-counter" aria-label="Counter. Drop the next thing here."><div class="ic-build" id="ic-build"><svg id="ic-build-svg" viewBox="0 -100 200 456" aria-hidden="true" focusable="false"><g id="ic-ring"></g><g id="ic-hold"></g><g id="ic-stack"></g><g id="ic-top"></g></svg></div><button class="ic-bell" id="ic-bell" aria-label="Ring the bell to serve">${IC.bell()}</button></div></section><section class="ic-tray" id="ic-tray" aria-label="Choose what goes in the ice cream"><div class="ic-holders" id="ic-holders" hidden>${holders}</div><div class="ic-tubs" id="ic-tubs">${tubs}</div><div class="ic-tops" id="ic-tops" hidden>${jars}</div></section></div><footer class="toy-footer pz-footer"><div class="round-dots" id="ic-dots"></div><p id="toy-message" class="toy-message" role="status"></p></footer>`);
  const root=$('new-game'),build=$('ic-build'),ring=$('ic-ring'),hold=$('ic-hold'),stack=$('ic-stack'),top=$('ic-top');

  const expected=()=>{
   if(!order||!built)return '';
   if(!built.holder)return order.holder;
   if(built.scoops.length<order.scoops.length)return order.scoops[built.scoops.length];
   if(order.topping&&!built.topping)return order.topping;
   return '';
  };
  const orderClips=o=>[`ic-hi-${o.holder}`,...o.scoops.flatMap((f,i)=>i?['ic-then',`fl-${f}`]:[`fl-${f}`]),o.topping?`ic-top-${o.topping}`:'ic-please'];
  const nameClip=id=>IC.flavors[id]?`fl-${id}`:id==='cone'||id==='cup'?`ic-${id}`:`tp-${id}`;

  function renderRing(){
   const next=expected(),n=built?built.scoops.length:0;let shape='';
   if(phase==='order'&&next){
    if(!built.holder)shape=`<ellipse cx="100" cy="236" rx="64" ry="112"/>`;
    else if(IC.flavors[next])shape=`<ellipse cx="100" cy="${IC.scoopY(n)-6}" rx="58" ry="46"/>`;
    else shape=`<ellipse cx="100" cy="${IC.scoopY(Math.max(0,n-1))-66}" rx="40" ry="32"/>`;
   }
   ring.innerHTML=shape?`<g class="ic-ring">${shape}</g>`:'';
  }
  function renderState(){
   const d=root.dataset,next=expected();
   d.level=level;d.phase=phase;d.served=served;d.customer=customer;d.holder=order?.holder||'';d.scoops=order?.scoops.join(',')||'';d.topping=order?.topping||'';
   d.built=built?[built.holder||'',...built.scoops,built.topping||''].filter(Boolean).join(','):'';d.next=next;d.progress=built?built.scoops.length:0;
   $('ic-dots').innerHTML=Array.from({length:SHIFT},(_,i)=>`<i class="${i<served?'current':''}"></i>`).join('');
   $('ic-bell').classList.toggle('ready',phase==='ready');
   renderRing();
  }
  const clearHint=()=>{clearTimeout(hintTimer);root.querySelectorAll('.ic-pick.hint,.ic-bell.hint,.ic-bubble.hint').forEach(n=>n.classList.remove('hint'));};
  const armHint=()=>{clearTimeout(hintTimer);hintTimer=setTimeout(()=>{
   if(phase==='ready'){$('ic-bell').classList.add('hint');return;}
   if(phase!=='order')return;
   const next=expected();root.querySelector(`.ic-pick[data-pick="${next}"]`)?.classList.add('hint');$('ic-bubble').classList.add('hint');
  },hintDelay);};

  function makeOrder(){
   const cfg=LEVELS[level-1];let o;
   for(let tries=0;tries<12;tries++){
    const n=cfg.scoops[0]+Math.floor(Math.random()*(cfg.scoops[1]-cfg.scoops[0]+1)),scoops=[];
    while(scoops.length<n){const f=pick(IC.flavorIds);if(f!==scoops[scoops.length-1])scoops.push(f);}
    o={holder:cfg.choose?pick(['cone','cup']):'cone',scoops,topping:Math.random()<cfg.topping?pick(IC.toppings):null};
    if(orderKey(o)!==lastKey)break;
   }
   lastKey=orderKey(o);return o;
  }
  // Make the picture just tall enough for this level's biggest order, so smaller orders get a bigger cone.
  function fitBuild(){
   const cfg=LEVELS[level-1],topY=IC.topOf(cfg.scoops[1],level>=2?'wafer':null)-6,h=IC.FLOOR-topY;
   $('ic-build-svg').setAttribute('viewBox',`0 ${topY} 200 ${h}`);build.style.aspectRatio=`200 / ${h}`;
  }
  function paintBuild(){
   build.style.removeProperty('animation');$('ic-build-svg').getAnimations?.().forEach(a=>a.cancel());
   hold.innerHTML=built.holder?IC.holder(built.holder):'';
   stack.innerHTML=built.scoops.map((f,i)=>`<g transform="translate(${IC.CX} ${IC.scoopY(i)})">${IC.scoop(f)}</g>`).join('');
   top.innerHTML=built.topping?IC.topping(built.topping,IC.scoopY(Math.max(0,built.scoops.length-1))):'';
  }
  async function nextCustomer(first=false){
   flow.cancel();token++;const mine=token;clearHint();busy=false;wrongs=0;
   const cu=$('ic-customer');
   if(!first){phase='leaving';renderState();cu.classList.remove('arrive');cu.classList.add('leave');await wait(520);if(mine!==token)return;}
   customer=crowd[served]||pick(CUSTOMERS);
   fitBuild();order=makeOrder();built={holder:LEVELS[level-1].choose?null:order.holder,scoops:[],topping:null};
   paintBuild();
   cu.classList.remove('leave','happy');void cu.offsetWidth;cu.innerHTML=art.animals[customer];cu.classList.add('arrive');
   $('ic-order').innerHTML=IC.render(order);$('ic-bubble').classList.remove('hint');$('ic-bubble').classList.add('pop');setTimeout(()=>$('ic-bubble').classList.remove('pop'),700);
   $('ic-holders').hidden=!LEVELS[level-1].choose;$('ic-tops').hidden=level<2;
   phase='order';renderState();armHint();
   message(`A ${customer} would like an ice cream.`,'Look at the picture and build the same one.');
   sfx('pick',{pitch:1.1});
   Say.play(orderClips(order),{after:first});
  }
  function newShift(first=false){
   served=0;crowd=shuffle(CUSTOMERS).slice(0,SHIFT);
   $('ic-shop').classList.remove('celebrate');
   nextCustomer(first);
  }
  function wrong(id,node){
   wrongs++;clearHint();sfx('boing');returnTile(node);
   $('ic-bubble').classList.remove('look');void $('ic-bubble').offsetWidth;$('ic-bubble').classList.add('look');setTimeout(()=>$('ic-bubble').classList.remove('look'),800);
   message('Not that one. Look at the picture!','');
   if(wrongs===1)Say.play([nameClip(id),'ic-wrong']);
   else if(wrongs%3===0)Say.play(orderClips(order));
   else Say.play([nameClip(id)]);
   armHint();
  }
  async function add(id,node){
   if(phase!=='order'||busy)return;
   if(id!==expected()){wrong(id,node);return;}
   clearHint();wrongs=0;busy=true;const mine=token;
   const tile=node;tile.classList.remove('dip');void tile.offsetWidth;tile.classList.add('dip');setTimeout(()=>tile.classList.remove('dip'),600);
   if(IC.flavors[id]){
    built.scoops.push(id);const i=built.scoops.length-1;
    stack.insertAdjacentHTML('beforeend',`<g transform="translate(${IC.CX} ${IC.scoopY(i)})"><g class="ic-drop">${IC.scoop(id)}</g></g>`);
    sfx('scoop',{pitch:.95+Math.random()*.12});
   }else if(id==='cone'||id==='cup'){
    built.holder=id;hold.innerHTML=IC.holder(id);hold.firstElementChild.classList.add('ic-drop');sfx('pick',{pitch:1.05});
   }else{
    built.topping=id;top.innerHTML=`<g class="ic-drop small">${IC.topping(id,IC.scoopY(Math.max(0,built.scoops.length-1)))}</g>`;
    sfx(id==='sprinkles'?'sprinkle':id==='wafer'?'crunch':'pop');
   }
   Say.play([nameClip(id)]);
   await wait(430);if(mine!==token)return;
   busy=false;
   if(!expected()){phase='ready';renderState();message('All done! Ring the bell.','');Say.play(['ic-ready']);armHint();return;}
   renderState();armHint();
  }
  async function serve(){
   if(busy)return;
   if(phase!=='ready'){
    if(phase==='order'){sfx('boing',{pitch:1.2});$('ic-bell').classList.remove('wrong');void $('ic-bell').offsetWidth;$('ic-bell').classList.add('wrong');setTimeout(()=>$('ic-bell').classList.remove('wrong'),500);Say.play(['ic-notyet']);}
    return;
   }
   phase='serving';busy=true;clearHint();const mine=token;renderState();
   sfx('bell');$('ic-bell').classList.add('ringing');setTimeout(()=>$('ic-bell').classList.remove('ringing'),900);
   const cu=$('ic-customer'),svg=$('ic-build-svg');
   try{
    const a=build.getBoundingClientRect(),b=cu.getBoundingClientRect(),dx=b.left+b.width*.62-(a.left+a.width/2),dy=b.top+b.height*.45-(a.top+a.height*.35);
    svg.animate([{transform:'none',opacity:1},{transform:'translateY(-6%) scale(1.06)',opacity:1,offset:.25},{transform:`translate(${dx}px,${dy}px) scale(.3) rotate(-14deg)`,opacity:.1}],{duration:reduce()?1:760,easing:'ease-in',fill:'forwards'});
   }catch{}
   await wait(720);if(mine!==token)return;
   cu.classList.add('happy');window.WordBank.motion(cu,customer);sfx('chomp');setTimeout(()=>sfx('twinkle'),380);hearts(cu);
   served++;const done=served===SHIFT;
   message(done?'Three happy customers!':'Yum! Thank you!','');
   if(done){celebrate($('ic-shop'));Say.play([`ic-thanks-${thanks++%THANKS+1}`,'ic-done']);}
   else Say.play([`ic-thanks-${thanks++%THANKS+1}`]);
   phase='served';renderState();busy=false;
   flow.after(()=>{if(mine!==token)return;if(done)newShift();else nextCustomer();},pace||(done?6500:3300));
  }
  function hearts(node){
   if(reduce())return;
   for(let i=0;i<6;i++){const h=document.createElement('i');h.className='ic-heart';h.textContent='♥';h.style.cssText=`--x:${(Math.random()*120-60).toFixed(0)}px;--d:${(i*.08).toFixed(2)}s;color:${['#e8788a','#f0a6b8','#e8b95e'][i%3]}`;node.parentElement.append(h);setTimeout(()=>h.remove(),1500);}
  }
  bindPick($('ic-tray'),'#ic-counter',(id,node)=>add(id,node));
  $('ic-bell').addEventListener('click',serve);
  const repeat=()=>{if(phase==='order'||phase==='ready'){sfx('tap');Say.play(phase==='ready'?['ic-ready']:orderClips(order));}};
  $('ic-customer').addEventListener('click',repeat);$('ic-bubble').addEventListener('click',repeat);
  // "Read to me" repeats the whole order, not just one word.
  Say.listen(repeat);
  root.querySelector('.pz-levels').addEventListener('click',e=>{
   const b=e.target.closest('button[data-level]');if(!b)return;
   level=Number(b.dataset.level);root.querySelectorAll('.pz-levels button').forEach(x=>x.setAttribute('aria-pressed',x===b));
   sfx('tap');Say.cancel();newShift();
  });
  window.addEventListener('pagehide',()=>{clearHint();flow.cancel();token++;Say.cancel();});
  newShift(true);
  setVoice('ic-intro');
 }};
})();
