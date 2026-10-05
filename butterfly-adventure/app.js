(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const art = window.AdventureArt;
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const use = (name, view = '0 0 240 180') => `<svg viewBox="${view}" aria-hidden="true" focusable="false"><use href="#${name}"/></svg>`;
  const stages = [
    {name:'Egg', symbol:'egg', view:'0 0 180 150', title:'A tiny, wonderful beginning', actions:['Take a closer look','Watch the shell crack','Help it hatch'], next:'Meet the caterpillar', hints:['Tap the little egg','Look! Something is moving','Tap to watch it hatch','Hello, little caterpillar!'], captions:['A secret is hiding on this leaf…','A little wiggle from inside…','A tiny crack. A big adventure.','One little life, out in the world.'], stories:[
      ['A butterfly left a tiny egg on a leaf. Shall we take a closer look?',"There is a little life growing inside. Let's be gentle and give it time."],
      ['Zoey leans in. Did you see that tiny wiggle?', 'The baby caterpillar is growing inside its egg.'],
      ['Crack! A little line appears in the shell.', 'The caterpillar is ready to hatch. Watch the shell open.'],
      ['Hello, little caterpillar! It crawls out of its egg.', 'Zoey waves hello. Our new friend is ready for some tasty leaves.']]},
    {name:'Caterpillar',symbol:'caterpillar',view:'0 0 300 145',title:'A very hungry little friend',actions:['Feed a leaf','Another little snack','One last crunchy leaf'],next:'Watch it become a chrysalis',hints:['Tap to feed a leaf','Crunch, crunch!','A little bigger every day','Time for a wonderful change'],captions:['A leaf-sized lunch, please!','Zoey brought a crunchy snack.','A growing appetite. A growing friend.','Find a branch. Hold on tight.'],stories:[
      ['Zoey picks a leaf. Our little caterpillar is hungry!', 'Caterpillars eat leaves and shed their old skin as they grow.'],
      ['Crunch! Zoey offers the first leaf. What a lovely lunch.', 'The caterpillar takes a bite and grows a little bigger.'],
      ['Crunch, crunch! Another leaf, another little growth spurt.', 'Zoey reaches out carefully. Growing takes lots of energy.'],
      ['Our caterpillar is all grown. It finds a safe branch.', 'Watch it hang in a J shape and shed its skin to reveal a chrysalis.']]},
    {name:'Chrysalis',symbol:'pupa',view:'0 0 160 220',title:'Quiet outside. Magic inside.',actions:['Give it a little time','Look for a little crack','Welcome the butterfly'],next:'Help its wings get ready',hints:['Tap to wait together','Something is changing inside','Tap to watch it emerge','Tiny wings need a little time'],captions:['Some wonders are worth waiting for.','Zoey waits quietly beside the branch.','The chrysalis begins to open.','A butterfly steps into the sunlight.'],stories:[
      ['A chrysalis hangs from the branch. Zoey waits quietly and watches.', 'Inside, the caterpillar is changing into a butterfly.'],
      ['The garden is quiet. The chrysalis gently sways.', 'Days pass in nature. Our little story makes time move faster.'],
      ['Look, Zoey! The chrysalis shell is beginning to split.', 'A butterfly will emerge with soft, folded wings.'],
      ['The butterfly climbs out, slowly and carefully.', 'It holds on while its soft wings begin to unfurl.']]},
    {name:'Butterfly',symbol:'butterfly',view:'0 0 240 180',title:'Little wings, a whole new world',actions:['Let the wings unfold','Wait for the wings to dry','Ready, set… fly!'],next:'Play the little memory game',hints:['Give those wings some time','Wings open, slowly and gently','Almost ready for the sky','Tap a flower for a nectar stop'],captions:['Soft little wings, fresh from the chrysalis.','Stretching into the sunshine.','A little rest before a big adventure.','Off you go, little butterfly!'],stories:[
      ['Zoey watches the butterfly rest on the branch.', 'Its wings are soft and folded. Give them time to expand.'],
      ['The wings slowly open. Look at those lovely colors!', 'Zoey stretches too. The butterfly still needs time to dry its wings.'],
      ['The wings are open and dry. A new adventure is waiting.', 'Zoey lifts a hand. Are you ready to help our friend take flight?'],
      ['Up, up, and away! Zoey waves as the butterfly takes flight.', 'Tap a flower to invite it for nectar. A butterfly can lay eggs, and the story begins again.']]}
  ];
  const worldSize = kind => CreatureCatalog.worlds[kind];
  const AUDIO_VERSION = 'zoo-tulip-20261005';
  const zoo = CreatureCatalog.zoo, sea = CreatureCatalog.sea;
  let customNarration = null;
  let world = 'garden', stage = 0, counts = [0,0,0,0], busy = false, epoch = 0;
  let gameStep = 0, muted = false, selected = {zoo:null, sea:null};
  const discovered = {zoo:new Set(),sea:new Set()}, scrolls = {zoo:null,sea:null};
  const animations = new Set(), animalTimers = new Set();
  const audio = new Audio(); audio.preload = 'auto';
  const audioFiles = {lion:'lion.m4a',elephant:'elephant.m4a',giraffe:'giraffe.m4a',zebra:'zebra.m4a',monkey:'monkey.m4a',owl:'owl.m4a'};
  let toastTimer,lastFile='',soundNeeded=false,startVoice=null,recordings={},queuedFile='',queueDue=0,queueTimer=null;
  fetch(`audio/recording-info.json?v=${AUDIO_VERSION}`).then(r=>r.json()).then(info=>recordings=info.recordings).catch(()=>{});
  function audioRemaining(){if(queuedFile&&!muted)return Math.max(0,queueDue-performance.now())+(recordings[queuedFile.replace(/\.m4a$/,'')]?.duration_seconds||3)*1000;if(muted||audio.paused&&soundNeeded)return 0;const key=lastFile.replace(/\.m4a$/,'');const seconds=Number.isFinite(audio.duration)?audio.duration:recordings[key]?.duration_seconds||0;return Math.max(0,(seconds-audio.currentTime)*1000);}
  function startSound(){if(document.getElementById('sound-start'))return;const b=document.createElement('button');b.id='sound-start';b.className='sound-start';b.setAttribute('aria-label','Start playing with Zoey and sound');b.innerHTML=art.icons.play;document.body.append(b);b.addEventListener('click',()=>playAudio(startVoice?`${startVoice()}.m4a`:narration()));}
  function queueAudio(file){if(muted||document.hidden)return;const wait=audioRemaining();clearTimeout(queueTimer);queuedFile=file;queueDue=performance.now()+wait;queueTimer=setTimeout(()=>playAudio(file),wait+20);}
  function startAudio(getVoice){startVoice=getVoice||null;playAudio(getVoice?`${getVoice()}.m4a`:narration());}
  function stopAudio(){clearTimeout(queueTimer);queuedFile='';audio.pause(); audio.removeAttribute('src'); audio.load(); $('listen').classList.remove('playing'); $('listen-label').textContent='Read to me'; }
  function audioError(){ $('audio-status').textContent="That sound couldn't play. Tap again to retry."; $('audio-status').hidden=false; clearTimeout(toastTimer); toastTimer=setTimeout(()=>$('audio-status').hidden=true,3500); }
  function playAudio(file){
    stopAudio(); if(muted||document.hidden) return;
    lastFile=file;audio.src=`audio/${file}?v=${AUDIO_VERSION}`;
    $('listen').classList.add('playing'); $('listen-label').textContent='Stop listening';
    const requested = audio.src;
    return audio.play().then(()=>{soundNeeded=false;document.getElementById('sound-start')?.remove();}).catch(error => {if(audio.src!==requested || error.name==='AbortError')return;if(error.name==='NotAllowedError'){$('listen').classList.remove('playing');$('listen-label').textContent='Read to me';soundNeeded=true;startSound();return;} $('listen').classList.remove('playing'); $('listen-label').textContent='Read to me'; audioError();});
  }
  audio.addEventListener('ended',()=>{ $('listen').classList.remove('playing'); $('listen-label').textContent='Read to me'; });
  audio.addEventListener('error',()=>{ if(audio.hasAttribute('src')){ $('listen').classList.remove('playing'); $('listen-label').textContent='Read to me'; audioError(); } });
  function narration(){ if(customNarration)return customNarration();if(world==='garden')return `garden-${stage}-${counts[stage]}.m4a`; return selected[world] ? audioFiles[selected[world]] || `${selected[world]}.m4a` : `${world}-intro.m4a`; }
  function gestureGuide(kind, target=world==='garden'?'garden-guide':'explore-guide'){
    const guide=$(target); guide.classList.remove('wave','look','feed','cheer'); void guide.offsetWidth; guide.classList.add(kind);
  }
  function cancelAnimations(){ CreatureMotion.cancelAll();epoch++; animations.forEach(a=>a.cancel()); animations.clear(); animalTimers.forEach(clearTimeout); animalTimers.clear(); busy=false; $('book').setAttribute('aria-busy','false'); }
  async function tween(id, frames, duration=1500){
    const node=$(id), last=frames[frames.length-1];
    if(reduced()){Object.assign(node.style,last);return;}
    const animation=node.animate(frames,{duration,easing:'ease-in-out',fill:'forwards'}); animations.add(animation);
    try{await animation.finished; Object.assign(node.style,last);}finally{animations.delete(animation);animation.cancel();}
  }
  function pose(id, values){Object.assign($(id).style,values);}
  function renderPose(){
    ['egg-actor','worm-actor','hanging-worm','chrysalis-actor','butterfly-actor','snack-leaf'].forEach(id=>{$(id).style.cssText='opacity:0';});
    ['egg-top','egg-bottom','chrysalis-left','chrysalis-right','worm-motion','butterfly-wings'].forEach(id=>$(id).style.cssText='');
    ['egg-crack','embryo','pupa-crack'].forEach(id=>pose(id,{opacity:'0'}));
    $('garden').classList.remove('flying','sipping');
    const n=counts[stage];
    if(stage===0){
      pose('egg-actor',{opacity:'1',transform:'translate(348px,251px)'});
      pose('embryo',{opacity:n>0?'1':'0'});pose('egg-crack',{opacity:n>1?'1':'0'});
      if(n===3){pose('egg-top',{transform:'translate(-65px,-38px) rotate(-45deg)'});pose('egg-bottom',{transform:'scaleY(.65)'});pose('worm-actor',{opacity:'1',transform:'translate(315px,267px) scale(.55)'});}
    }else if(stage===1){pose('worm-actor',{opacity:'1',transform:`translate(${230-n*13}px,${253-n*8}px) scale(${.7+n*.1})`});}
    else if(stage===2){
      pose('chrysalis-actor',{opacity:'1',transform:'translate(370px,160px)',filter:n>0?'saturate(.75)':'none'});pose('pupa-crack',{opacity:n>1?'1':'0'});
      if(n===3){pose('chrysalis-left',{transform:'translate(-19px,8px) rotate(14deg)',opacity:'.7'});pose('chrysalis-right',{transform:'translate(19px,8px) rotate(-14deg)',opacity:'.7'});pose('butterfly-actor',{opacity:'1',transform:'translate(285px,165px) scale(.75)'});pose('butterfly-wings',{transform:'scaleX(.22)'});}
    }else{
      pose('chrysalis-actor',{opacity:'.3',transform:'translate(370px,160px)',filter:'none'});pose('chrysalis-left',{transform:'translate(-19px,8px) rotate(14deg)'});pose('chrysalis-right',{transform:'translate(19px,8px) rotate(-14deg)'});
      pose('butterfly-actor',{opacity:'1',transform:'translate(285px,165px) scale(.75)'});pose('butterfly-wings',{transform:`scaleX(${n===0?.22:n===1?.75:1})`});
      if(n===3)$('garden').classList.add('flying');
    }
  }
  function renderGarden(){
    const d=stages[stage],n=counts[stage];
    $('chapter-number').textContent=`BUTTERFLY GARDEN · CHAPTER 0${stage+1} OF 04`;
    $('chapter-title').textContent=d.title; $('garden-caption').textContent=d.captions[n];
    $('story-main').textContent=d.stories[n][0];$('story-detail').textContent=d.stories[n][1];
    $('tap-hint').textContent=d.hints[n];$('tap-hint').hidden=stage===3&&n===3;
    $('action-label').innerHTML=art.icons.play;$('action').setAttribute('aria-label',n===3?d.next:d.actions[n]);$('specimen').setAttribute('aria-label',n===3?d.next:d.actions[n]);
    $('back').disabled=stage===0||busy;$('action').disabled=busy;$('specimen').disabled=busy;
    $('progress-count').textContent=`${n} / 3`;$('garden-progress').querySelector('[role=progressbar]').setAttribute('aria-valuenow',n);
    $('garden-progress').querySelectorAll('.dots i').forEach((dot,i)=>dot.classList.toggle('done',i<n));
    document.querySelectorAll('.life-stop').forEach((b,i)=>{b.classList.toggle('active',i===stage);b.setAttribute('aria-pressed',i===stage);b.disabled=busy;b.querySelector('.stop-check').textContent=counts[i]===3?'✓':'';});
    $('nectar-controls').hidden=!(stage===3&&n===3);renderPose();
  }
  async function act(){
    if(world!=='garden'){exploreNext();return;}
    if(busy)return;PlayFlow.cancel();
    if(stage===3&&counts[stage]===3){showGame();return;}
    const s=stage,n=counts[s],run=epoch;
    busy=true;$('book').setAttribute('aria-busy','true');renderGarden();
    const nextStage=n===3?s+1:s,nextCount=n===3?0:n+1;
    playAudio(`garden-${nextStage}-${nextCount}.m4a`);
    try{
      if(s===0&&n<2){
        gestureGuide('look');
        await tween('egg-actor',[{transform:'translate(348px,251px) rotate(0)'},{transform:'translate(348px,251px) rotate(-5deg)',offset:.3},{transform:'translate(348px,251px) rotate(5deg)',offset:.7},{transform:'translate(348px,251px) rotate(0)'}],1100);
        await tween(n===0?'embryo':'egg-crack',[{opacity:'0'},{opacity:'1'}],450);
      }else if(s===0&&n===2){
        $('garden-caption').textContent='Crack, wiggle… and out we come!';gestureGuide('wave');
        await tween('egg-top',[{transform:'translate(0,0) rotate(0)'},{transform:'translate(-65px,-38px) rotate(-45deg)'}],950);
        await tween('egg-bottom',[{transform:'scaleY(1)'},{transform:'scaleY(.65)'}],450);
        await tween('worm-actor',[{opacity:'0',transform:'translate(285px,247px) scale(.22)'},{opacity:'1',transform:'translate(285px,247px) scale(.35)',offset:.4},{opacity:'1',transform:'translate(315px,267px) scale(.55)'}],1800);
      }else if(s===0&&n===3){
        gestureGuide('feed');
        await tween('worm-actor',[{transform:'translate(315px,267px) scale(.55)'},{transform:'translate(230px,253px) scale(.7)'}],1300);
        await tween('egg-actor',[{opacity:'1'},{opacity:'0'}],500);
      }else if(s===1&&n<3){
        gestureGuide('feed');
        await tween('snack-leaf',[{opacity:'0',transform:'translate(660px,260px) rotate(-20deg)'},{opacity:'1',transform:'translate(530px,245px) rotate(-20deg)',offset:.25},{opacity:'1',transform:'translate(440px,290px) scale(.75)',offset:.7},{opacity:'0',transform:'translate(430px,297px) scale(.1)'}],1700);
        await tween('worm-actor',[{transform:`translate(${230-n*13}px,${253-n*8}px) scale(${.7+n*.1})`},{transform:`translate(${230-(n+1)*13}px,${253-(n+1)*8}px) scale(${.7+(n+1)*.1})`}],800);
      }else if(s===1&&n===3){
        $('garden-caption').textContent='Climb, hold on… and curl into a J.';gestureGuide('look');
        await tween('worm-actor',[{transform:'translate(191px,229px) scale(1)'},{transform:'translate(150px,155px) scale(.85)',offset:.45},{transform:'translate(419px,123px) rotate(90deg) scale(.52)'}],1900);
        await Promise.all([tween('hanging-worm',[{opacity:'0'},{opacity:'1'}],750),tween('worm-actor',[{opacity:'1'},{opacity:'0'}],750)]);
        await tween('hanging-worm',[{transform:'rotate(0)'},{transform:'rotate(6deg)',offset:.35},{transform:'rotate(-5deg)',offset:.7},{transform:'rotate(0)'}],1100);
        $('garden-caption').textContent='The old skin slips away. A chrysalis appears.';
        await Promise.all([tween('chrysalis-actor',[{opacity:'0',transform:'translate(370px,160px) scale(.65)'},{opacity:'1',transform:'translate(370px,160px) scale(1)'}],1400),tween('hanging-worm',[{opacity:'1',transform:'translate(0,0) scaleY(1)'},{opacity:'0',transform:'translate(0,45px) scaleY(.88)'}],1400)]);
      }else if(s===2&&n<2){
        gestureGuide('look');
        await tween('chrysalis-actor',[{transform:'translate(370px,160px) rotate(0)'},{transform:'translate(370px,160px) rotate(-4deg)',offset:.3},{transform:'translate(370px,160px) rotate(4deg)',offset:.7},{transform:'translate(370px,160px) rotate(0)'}],1300);
        if(n===1)await tween('pupa-crack',[{opacity:'0'},{opacity:'1'}],650);
      }else if(s===2&&n===2){
        $('garden-caption').textContent='The shell opens. Soft little wings emerge.';gestureGuide('wave');
        await Promise.all([tween('chrysalis-left',[{transform:'translate(0,0)',opacity:'1'},{transform:'translate(-19px,8px) rotate(14deg)',opacity:'.7'}],1400),tween('chrysalis-right',[{transform:'translate(0,0)',opacity:'1'},{transform:'translate(19px,8px) rotate(-14deg)',opacity:'.7'}],1400)]);
        await tween('butterfly-actor',[{opacity:'0',transform:'translate(280px,103px) scale(.6)'},{opacity:'1',transform:'translate(285px,140px) scale(.7)',offset:.5},{opacity:'1',transform:'translate(285px,165px) scale(.75)'}],2000);
      }else if(s===2&&n===3){
        gestureGuide('look');await tween('chrysalis-actor',[{opacity:'1'},{opacity:'.3'}],700);
      }else if(s===3&&n<2){
        gestureGuide(n===0?'cheer':'look');
        await tween('butterfly-wings',[{transform:`scaleX(${n===0?.22:.75})`},{transform:`scaleX(${n===0?.75:1})`}],2200);
      }else if(s===3&&n===2){
        gestureGuide('wave');await tween('butterfly-actor',[{transform:'translate(285px,165px) scale(.75)'},{transform:'translate(270px,122px) scale(.8) rotate(-7deg)'}],1700);
      }
      if(run!==epoch)return;
      if(n===3)stage=s+1;else counts[s]=n+1;
      if(counts[stage]===3){window.LittleCelebration?.burst();PlayFlow.after(()=>stage===3?showGame():act());}
    }catch(error){if(run===epoch){console.error('Story animation failed',error);}}
    finally{if(run===epoch){busy=false;$('book').setAttribute('aria-busy','false');if(world==='garden')renderGarden();}}
  }
  function sceneBackground(kind){return WorldMaps.render(kind,CreatureCatalog,worldSize(kind));}
  // The zoo opens at its gate, the ocean at the sunny surface.
  function startScroll(kind,size){const vp=$('viewport');return kind==='zoo'?{x:Math.max(0,size.width/2-vp.clientWidth/2),y:Math.max(0,size.height-vp.clientHeight)}:{x:Math.max(0,size.width/2-vp.clientWidth/2),y:0};}
  function renderExplore(){
    const animals=world==='zoo'?zoo:sea, isSea=world==='sea';
    selected[world]=null; // The restored panorama opens with its introduction.
    $('chapter-number').textContent=isSea?`UNDER THE SEA · ${animals.length} OCEAN FRIENDS`:`A DAY AT THE ZOO · ${animals.length} ANIMAL FRIENDS`;
    $('chapter-title').textContent=isSea?'A hello beneath the waves':'So many friends to meet';
    $('explore-scene').classList.toggle('sea',isSea);$('explore-note').textContent=isSea?'THE WONDERFUL OCEAN':'THE SUNNY ZOO';
    const size=worldSize(world);$('panorama').style.width=size.width+'px';$('panorama').style.height=size.height+'px';
    $('panorama').dataset.world=world;
    $('panorama').innerHTML=sceneBackground(world)+animals.map(a=>`<button class="animal${discovered[world].has(a.id)?' discovered':''}" data-animal="${a.id}" data-zone="${a.zone}" style="left:calc(${a.x/size.width*100}% - ${a.width/2}px);top:${a.y/size.height*100}%;width:${a.width}px;--art-h:${a.h}px" aria-label="Meet the ${a.name.toLowerCase()}" aria-pressed="false"><span class="animal-art">${art.animals[a.id]}</span><span class="animal-name">${a.name}</span></button>`).join('');
    $('animal-index').innerHTML=animals.map(a=>`<button data-find="${a.id}" class="${discovered[world].has(a.id)?'found':''}" aria-label="Meet ${a.name}" aria-pressed="false">${art.animals[a.id]}<span class="sr-only">${a.name}</span><span aria-hidden="true">${discovered[world].has(a.id)?' ✓':''}</span></button>`).join('');
    $('animal-bubble').textContent=isSea?'Dive in with me!':'Hello, new friends!';
    $('story-main').textContent=isSea?'Zoey takes a peek beneath the waves. Who is swimming here?':'Zoey follows the winding park path, from the gate to every zone. Can you find all thirty-four animal friends?';
    $('story-detail').textContent=isSea?'Swipe in any direction to explore. Tap a sea animal to hear its name and watch it swim away and return.':'Swipe in any direction to explore. Tap an animal to hear its name and call, and see it move.';
    $('action-label').innerHTML=art.icons.right;$('action').setAttribute('aria-label','Find a new friend');$('back').disabled=false;$('action').disabled=false;
    const start=scrolls[world]||startScroll(world,size);$('viewport').scrollLeft=start.x;$('viewport').scrollTop=start.y;updatePan();updateDiscovery();
  }
  function updateDiscovery(){
    $('discovery-count').textContent=`${discovered[world].size} / ${(world==='zoo'?zoo:sea).length}`;
    if(discovered[world].size===(world==='zoo'?zoo:sea).length){$('action').setAttribute('aria-label',world==='zoo'?'Dive into the sea':'Back to the garden');}
  }
  function scrollToAnimal(id){const button=$('panorama').querySelector(`[data-animal="${id}"]`);if(!button)return;const target=button.offsetLeft+button.offsetWidth/2-$('viewport').clientWidth/2,top=button.offsetTop+button.offsetHeight/2-$('viewport').clientHeight/2;$('viewport').scrollTo({left:target,top,behavior:reduced()?'instant':'smooth'});}
  function meet(id){
    if(world==='garden')return;
    const a=(world==='zoo'?zoo:sea).find(a=>a.id===id), button=$('panorama').querySelector(`[data-animal="${id}"]`);
    if(!a||!button)return;

    const newFriend=!discovered[world].has(id);
    selected[world]=id;discovered[world].add(id);
    const completed=discovered[world].size===(world==='zoo'?zoo:sea).length;
    $('panorama').querySelectorAll('.animal').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',b===button);});
    button.classList.add('discovered','acting');
    $('animal-index').querySelectorAll('button').forEach(b=>{b.classList.toggle('found',discovered[world].has(b.dataset.find));b.setAttribute('aria-pressed',b.dataset.find===id);b.innerHTML=art.animals[b.dataset.find]+'<span class="sr-only">'+(world==='zoo'?zoo:sea).find(a=>a.id===b.dataset.find).name+'</span>'+(discovered[world].has(b.dataset.find)?'<span aria-hidden="true"> ✓</span>':'');});
    $('animal-bubble').textContent=`Hello, ${a.name.toLowerCase()}!`;$('story-main').textContent=a.detail;
    $('story-detail').textContent=world==='zoo'?"Zoey waves hello. Tap another animal to meet a new friend.":"Zoey follows along with a wave. Our friend always comes back!";
    gestureGuide('wave');playAudio(audioFiles[id]||`${id}.m4a`);updateDiscovery();
    const handle=CreatureMotion.play(button.querySelector('.animal-art'),id);
    button.dataset.action=handle.name;
    $('story-main').textContent=world==='zoo'?`${a.name}: ${handle.name.toLowerCase()}!`:a.detail;
    $('story-detail').textContent=world==='zoo'?'Tap again to discover another action. Swipe up, down, left, or right.':'A different little journey each time. Our friend always returns.';
    if(completed){if(newFriend)window.LittleCelebration?.burst();PlayFlow.after(()=>{changeWorld(world==='zoo'?'sea':'garden');playAudio(narration());},Math.max(handle.duration+400,audioRemaining()));}
    const marker=button.dataset.action;
    handle.finished.then(()=>{if(button.dataset.action===marker)button.classList.remove('acting');});
  }
  function exploreNext(){
    const next=(world==='zoo'?zoo:sea).find(a=>!discovered[world].has(a.id));
    if(next){scrollToAnimal(next.id);meet(next.id);}else changeWorld(world==='zoo'?'sea':'garden');
  }
  function changeWorld(next){
    if(world!=='garden')scrolls[world]={x:$('viewport').scrollLeft,y:$('viewport').scrollTop};
    PlayFlow.cancel();cancelAnimations();stopAudio();world=next;document.body.dataset.game=next;document.title=({garden:'Butterfly Garden',zoo:'A Day at the Zoo',sea:'Under the Sea'})[next]+" · Zoey's Little Wonders";
    document.querySelectorAll('.world-tab').forEach(b=>{b.classList.toggle('active',b.dataset.world===world);b.setAttribute('aria-pressed',b.dataset.world===world);});
    const garden=world==='garden';$('garden-panel').hidden=!garden;$('explore-panel').hidden=garden;$('garden-progress').hidden=!garden;$('explore-instruction').hidden=garden;$('game').hidden=true;
    if(garden)renderGarden();else renderExplore();
  }
  function changeStage(index){PlayFlow.cancel();cancelAnimations();stopAudio();stage=index;renderGarden();}
  function updatePan(){
    const vp=$('viewport'), max=vp.scrollWidth-vp.clientWidth, fraction=max?vp.scrollLeft/max:0;
    $('pan-position').value=String(Math.round(fraction*100));$('pan-up').disabled=vp.scrollTop<=1;$('pan-down').disabled=vp.scrollTop>=vp.scrollHeight-vp.clientHeight-1;$('pan-left').disabled=vp.scrollLeft<=1;$('pan-right').disabled=vp.scrollLeft>=max-1;
    if(world!=='garden')scrolls[world]={x:vp.scrollLeft,y:vp.scrollTop};
  }
  // Safari owns touch scrolling (including momentum and diagonal gestures).
  // Only mouse/pen drags use capture and manually update scrollLeft.
  let drag=null, suppressClickUntil=0;
  $('viewport').addEventListener('pointerdown',e=>{
    if(!e.isPrimary||e.button!==0)return;
    suppressClickUntil=0; // A fresh tap is never blocked by an earlier swipe.
    drag={id:e.pointerId,type:e.pointerType,x:e.clientX,y:e.clientY,start:$('viewport').scrollLeft,startY:$('viewport').scrollTop,moved:false};
  },{passive:true});
  $('viewport').addEventListener('pointermove',e=>{
    if(!drag||e.pointerId!==drag.id)return;
    const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
    if(drag.type==='touch'){
      drag.moved ||= Math.hypot(dx,dy)>10;
      return; // No capture or preventDefault: allow native pan/zoom.
    }
    if(!drag.moved){
      if(Math.hypot(dx,dy)<10)return;
      drag.moved=true;$('viewport').setPointerCapture(e.pointerId);$('viewport').classList.add('dragging');
    }
    e.preventDefault();$('viewport').scrollLeft=drag.start-dx;$('viewport').scrollTop=drag.startY-dy;
  },{passive:false});
  function endDrag(e){
    if(!drag||drag.id!==e.pointerId)return;
    if(drag.moved||e.type==='pointercancel'||Math.abs($('viewport').scrollLeft-drag.start)>10)suppressClickUntil=performance.now()+350;
    const captured=drag.type!=='touch'&&$('viewport').hasPointerCapture(e.pointerId);
    drag=null;$('viewport').classList.remove('dragging');
    if(captured)$('viewport').releasePointerCapture(e.pointerId);
  }
  $('viewport').addEventListener('pointerup',endDrag);$('viewport').addEventListener('pointercancel',endDrag);
  $('viewport').addEventListener('lostpointercapture',e=>{
    if(e.target!==$('viewport')||!drag||drag.type==='touch'||e.pointerId!==drag.id)return;
    drag=null;$('viewport').classList.remove('dragging');
  });
  $('pan-position').addEventListener('input',()=>{
    const vp=$('viewport');vp.scrollLeft=Number($('pan-position').value)/100*(vp.scrollWidth-vp.clientWidth);
  });
  $('viewport').addEventListener('click',e=>{if(e.detail!==0&&performance.now()<suppressClickUntil){e.preventDefault();return;}const b=e.target.closest('[data-animal]');if(b)meet(b.dataset.animal);});
  $('viewport').addEventListener('scroll',updatePan,{passive:true});
  $('viewport').addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();const vertical=e.key==='ArrowUp'||e.key==='ArrowDown';$('viewport').scrollBy({[vertical?'top':'left']:(e.key==='ArrowLeft'||e.key==='ArrowUp'?-1:1)*(vertical?$('viewport').clientHeight:$('viewport').clientWidth)*.6,behavior:reduced()?'instant':'smooth'});}});
  window.addEventListener('pointerup',endDrag);
  $('pan-up').addEventListener('click',()=>$('viewport').scrollBy({top:-$('viewport').clientHeight*.6,behavior:reduced()?'instant':'smooth'}));
  $('pan-down').addEventListener('click',()=>$('viewport').scrollBy({top:$('viewport').clientHeight*.6,behavior:reduced()?'instant':'smooth'}));
  window.addEventListener('resize',()=>{if(world!=='garden')updatePan();});
  $('pan-left').addEventListener('click',()=>$('viewport').scrollBy({left:-$('viewport').clientWidth*.65,behavior:reduced()?'instant':'smooth'}));
  $('pan-right').addEventListener('click',()=>$('viewport').scrollBy({left:$('viewport').clientWidth*.65,behavior:reduced()?'instant':'smooth'}));
  $('animal-index').addEventListener('click',e=>{const b=e.target.closest('[data-find]');if(b){scrollToAnimal(b.dataset.find);meet(b.dataset.find);}});
  function showGame(){
    stopAudio();$('game').hidden=false;resetGame();$('game-choices').querySelector('button').focus({preventScroll:true});
  }
  function resetGame(){
    PlayFlow.cancel();
    gameStep=0;$('game-feedback').textContent='What comes first? Tap a picture.';
    $('game-slots').innerHTML=stages.map((_,i)=>`<div class="game-slot" aria-label="Stage ${i+1}, waiting for your choice">${i+1}<span>?</span></div>`).join('');
    const order=[2,0,3,1];$('game-choices').innerHTML=order.map(i=>`<button data-choice="${i}">${use(stages[i].symbol,stages[i].view)}<span>${stages[i].name}</span></button>`).join('');
  }
  $('game-choices').addEventListener('click',e=>{
    const button=e.target.closest('[data-choice]');if(!button||gameStep===4)return;
    const i=Number(button.dataset.choice);
    if(i!==gameStep){$('game-feedback').textContent=['Look for the tiny egg on the leaf.','Who hatches from the egg? The caterpillar!','What does the caterpillar become? A chrysalis.','Who comes out of the chrysalis? The butterfly!'][gameStep];return;}
    const slot=$('game-slots').children[gameStep];slot.classList.add('filled');slot.innerHTML=use(stages[i].symbol,stages[i].view)+`<span>${stages[i].name}</span>`;slot.setAttribute('aria-label',`Stage ${i+1}: ${stages[i].name}`);button.disabled=true;gameStep++;
    $('game-feedback').textContent=gameStep===4?'You did it! Egg → caterpillar → chrysalis → butterfly. A wonderful circle of life.':'Wonderful! What comes next?';
    if(gameStep===4){playAudio('game-complete.m4a');PlayFlow.after(()=>{counts=[0,0,0,0];stage=0;changeWorld('garden');playAudio(narration());});window.LittleCelebration?.burst();gestureGuide('cheer');$('game-reset').focus({preventScroll:true});}else $('game-choices').querySelector('button:not(:disabled)').focus({preventScroll:true});
  });
  $('game-reset').addEventListener('click',resetGame);
  $('restart').addEventListener('click',()=>{counts=[0,0,0,0];stage=0;discovered.zoo.clear();discovered.sea.clear();selected={zoo:null,sea:null};scrolls.zoo=null;scrolls.sea=null;changeWorld('garden');gestureGuide('wave');});
  $('listen').addEventListener('click',()=>{if(!audio.paused){stopAudio();return;}if(muted){muted=false;renderSound();}playAudio(narration());});
  function renderSound(){ $('sound-toggle').setAttribute('aria-pressed',!muted);$('sound-toggle').setAttribute('aria-label',muted?'Unmute sound':'Mute sound');$('sound-label').textContent=muted?'Sound off':'Sound on'; }
  $('sound-toggle').addEventListener('click',()=>{muted=!muted;renderSound();if(muted){stopAudio();document.getElementById('sound-start')?.remove();}else playAudio(narration());});
  $('back').addEventListener('click',()=>{if(busy)return;if(world==='garden')changeStage(Math.max(0,stage-1));else changeWorld(world==='sea'?'zoo':'garden');});
  $('action').addEventListener('click',act);$('specimen').addEventListener('click',act);
  document.querySelectorAll('[data-world]').forEach(b=>b.addEventListener('click',()=>changeWorld(b.dataset.world)));
  $('nectar-controls').addEventListener('click',e=>{
    const b=e.target.closest('[data-flower]');if(!b||busy)return;window.PlayFlow?.cancel();
    $('garden').classList.remove('flying');$('garden').classList.add('sipping');
    const target=b.dataset.flower==='left'?'translate(35px,310px) scale(.45)':'translate(510px,325px) scale(.45)';
    const run=epoch;busy=true;$('action').disabled=true;
    tween('butterfly-actor',[{transform:getComputedStyle($('butterfly-actor')).transform},{transform:target}],1200).catch(()=>{}).finally(()=>{if(run===epoch){busy=false;$('action').disabled=false;window.PlayFlow?.after(()=>{if(world==='garden'&&stage===3&&counts[3]===3)showGame();});}});
    $('story-main').textContent='A sweet little stop! The butterfly visits a flower for nectar.';gestureGuide('look');playAudio('nectar.m4a');
  });
  // SVG characters remain vectors at every size, with independently articulated arms and eyes.
  $('svg-library').innerHTML=`<svg width="0" height="0" style="position:absolute;overflow:hidden"><defs>${art.symbols}</defs></svg>`;
  $('butterfly-wings').innerHTML=document.getElementById('butterfly').innerHTML;
  $('garden-tab-art').innerHTML=use('butterfly');$('zoo-tab-art').innerHTML=art.animals.lion;$('sea-tab-art').innerHTML=art.animals.turtle;
  document.querySelector('.hero-butterfly').innerHTML=use('butterfly');
  ['garden-guide','explore-guide'].forEach(id=>{$(id).innerHTML=art.kid();$(id).setAttribute('role','button');$(id).setAttribute('tabindex','0');$(id).setAttribute('aria-label','Say hello to Zoey');$(id).addEventListener('click',()=>{gestureGuide('wave',id);playAudio('zoey-hello.m4a');});$(id).addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();$(id).click();}});});
  document.querySelector('.life-stops').innerHTML=stages.map((d,i)=>`<button class="life-stop" data-stage="${i}" aria-pressed="${i===0}">${use(d.symbol,d.view)}<span>${d.name}</span><span class="stop-check" aria-hidden="true"></span></button>`).join('');
  document.querySelector('.life-stops').addEventListener('click',e=>{const b=e.target.closest('[data-stage]');if(b&&!busy)changeStage(Number(b.dataset.stage));});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAudio();});window.addEventListener('pagehide',()=>{stopAudio();cancelAnimations();});window.addEventListener('pageshow',e=>{if(e.persisted){if(world==='garden')renderGarden();else renderExplore();}});
  window.AdventureBook={changeWorld,playAudio,stopAudio,startAudio,audioRemaining,queueAudio,gestureGuide,cancelAnimations,get audioPlaying(){return !audio.paused;},setNarrator(fn){customNarration=fn;},restart(){ $('restart').click(); }};
  renderGarden();
})();
