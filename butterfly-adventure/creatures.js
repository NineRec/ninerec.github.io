/* Shared catalogs and motions; verify these in materials.html before scene assembly. */
(() => {
  'use strict';
  const zooNames=['Lion','Elephant','Giraffe','Zebra','Monkey','Owl','Tiger','Bear','Duck','Frog','Hippo','Rhino','Otter','Panda','Kangaroo','Penguin','Crocodile','Flamingo','Gorilla','Fox','Deer','Rabbit','Horse','Cow'];
  const zooActions={lion:['Roar','Stretch','Swish'],elephant:['Trumpet','Flap ears','Shower'],giraffe:['Bow','Reach up','Step'],zebra:['Trot','Nod','Shake'],monkey:['Hop','Swing','Wave'],owl:['Flap','Peek','Bow'],tiger:['Stretch','Swish','Pounce'],bear:['Wave','Stretch','Sway'],duck:['Waddle','Flap','Nod'],frog:['Hop','Big hop','Peek'],hippo:['Yawn','Wade','Wiggle ears'],rhino:['Nod','Stomp','Swish'],otter:['Roll','Wave','Slide'],panda:['Nibble','Wave','Sway'],kangaroo:['Hop','Big hop','Wave'],penguin:['Waddle','Flap','Slide'],crocodile:['Swish','Yawn','Crawl'],flamingo:['Balance','Bow','Flap'],gorilla:['Wave','Pat chest','Sway'],fox:['Peek','Swish','Pounce'],deer:['Bow','Step','Peek'],rabbit:['Hop','Wiggle ears','Nibble'],horse:['Trot','Nod','Swish'],cow:['Nibble','Nod','Swish']};
  const seaNames={turtle:'Sea turtle',clownfish:'Clownfish',dolphin:'Dolphin',octopus:'Octopus',whale:'Whale',jellyfish:'Jellyfish',shark:'Shark',stingray:'Stingray',seahorse:'Seahorse',crab:'Crab',seal:'Seal',pufferfish:'Pufferfish',starfish:'Starfish',manta:'Manta ray',swordfish:'Swordfish',shrimp:'Shrimp',lobster:'Lobster',mermaid:'Mermaid'};
  const seaKinds={turtle:'paddle',clownfish:'dart',dolphin:'arc',octopus:'jet',whale:'glide',jellyfish:'pulse',shark:'glide',stingray:'ray',seahorse:'upright',crab:'scuttle',seal:'arc',pufferfish:'puff',starfish:'crawl',manta:'ray',swordfish:'dart',shrimp:'backward',lobster:'backward',mermaid:'arc'};
  const zoo=zooNames.map((name,i)=>({id:name.toLowerCase(),name,x:250+(i%6)*410,y:150+Math.floor(i/6)*295,width:name==='elephant'?265:220,actions:zooActions[name.toLowerCase()],detail:`Hello, ${name.toLowerCase()}! Tap again for another little surprise.`}));
  const sea=Object.entries(seaNames).map(([id,name],i)=>({id,name,x:230+(i%6)*415,y:110+Math.floor(i/6)*400,width:['whale','manta','shark'].includes(id)?265:220,kind:seaKinds[id],detail:({pulse:'Pulsing softly up and down.',upright:'A little fin keeps our friend upright.',scuttle:'Sideways steps along the sandy seabed.',crawl:'A slow crawl on tiny tube feet.',backward:'A quick flick of the tail, backwards!',ray:'Wide fins glide like wings.',puff:'A little puff, then a gentle swim.',paddle:'Paddling with wonderful flippers.',jet:'A pulse of water and waving arms.'})[seaKinds[id]]||'Follow our friend through the water. It always comes back!'}));
  // Bottom dwellers stay near the sand, even when their route changes.
  for(const a of sea)if(['crab','starfish','lobster'].includes(a.id))a.y=1100;
  window.CreatureCatalog={zoo,sea,width:2700,height:1400};
  const running=new Map(),previous=new Map(),directions=new Map();
  const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  function animate(node,frames,duration,options={}){
    return node.animate(frames,{duration,easing:'ease-in-out',fill:'none',...options});
  }
  function randomAction(id,length){
    let choice=Math.floor(Math.random()*length);
    if(choice===previous.get(id))choice=(choice+1+Math.floor(Math.random()*(length-1)))%length;
    previous.set(id,choice);return choice;
  }
  function play(node,id,forced){
    if(running.has(node))running.get(node).cancel();
    const animal=zoo.find(a=>a.id===id)||sea.find(a=>a.id===id),isSea=!!animal.kind;
    const index=forced??randomAction(id,isSea?3:animal.actions.length);
    const name=isSea?`${animal.kind} ${index+1}`:animal.actions[index];
    node.dataset.motion=name;node.dataset.motionIndex=index;
    const animations=[],oldAnimation=node.style.animation;node.style.animation='none';
    const frames=[{transform:'translate(0,0) rotate(0) scale(1)',opacity:1}];
    let duration=1700;
    function part(selector,transform,origin){
      if(reduce())return;
      node.querySelectorAll(selector).forEach(p=>{p.style.transformBox='view-box';p.style.transformOrigin=origin||'130px 110px';animations.push(animate(p,[{transform:'none'},{transform,offset:.45},{transform:'none'}],duration));});
    }
    if(isSea){
      const kind=animal.kind;
      let direction=Math.random()<.5?-1:1;
      if(direction===directions.get(id))direction=-direction;
      directions.set(id,direction);node.dataset.direction=direction;
      const distance=(150+Math.random()*140)*direction, vertical=(Math.random()-.5)*130;
      duration=['crawl','upright','pulse'].includes(kind)?4200:3200+Math.random()*900;
      const move=(x,y,rotation=0,scale=1)=>`translate(${x}px,${y}px) rotate(${rotation}deg) scale(${scale})`;
      if(kind==='pulse')frames.push({transform:move(25*direction,-70-Math.random()*35,0,.9),offset:.3},{transform:move(-15*direction,-105-Math.random()*35,0,1.06),offset:.6});
      else if(kind==='upright')frames.push({transform:move(70*direction,-45,-3),offset:.3},{transform:move(90*direction,15,3),offset:.65});
      else if(kind==='scuttle'||kind==='crawl')frames.push({transform:move(distance*(kind==='crawl'?.35:.75),0,0),offset:.45},{transform:move(distance*.15,0,0),offset:.8});
      else if(kind==='backward')frames.push({transform:move(-distance,15,6*direction),offset:.25},{transform:move(-distance*.4,-10,-4*direction),offset:.7});
      else if(kind==='puff')frames.push({transform:move(0,0,0,1.23),offset:.2},{transform:move(distance*.6,vertical,0,1),offset:.6});
      else if(kind==='arc')frames.push({transform:move(distance*.55,-85,-10*direction),offset:.3},{transform:move(distance,vertical,8*direction),offset:.6});
      else if(kind==='jet')frames.push({transform:move(distance*.3,-25,0,.85),offset:.2},{transform:move(distance,vertical,-8*direction),offset:.5});
      else if(kind==='dart')frames.push({transform:move(distance,vertical,-6*direction),offset:.28},{transform:move(distance*.6,-vertical,6*direction),offset:.68});
      else frames.push({transform:move(distance*.6,vertical,-4*direction),offset:.35},{transform:move(distance,vertical*.5,4*direction),offset:.65});
      // Fish and flipper swimmers face their route, then turn for the return.
      if(['paddle','dart','arc','glide','jet','puff','backward'].includes(kind)&&id!=='mermaid'){
        const drawing=node.querySelector('svg');
        if(!reduce())animations.push(animate(drawing,[{transform:`scaleX(${direction})`},{transform:`scaleX(${direction})`,offset:.58},{transform:`scaleX(${-direction})`,offset:.6},{transform:'scaleX(1)'}],duration,{easing:'steps(1,end)'}));
      }
      part('.animal-tail','rotate(12deg)','65px 115px');
      part('.animal-wing,.animal-fin','scaleY(.78)');
      part('.tentacles','scaleX(.85) skewX(5deg)');
      part('.animal-claw,.animal-leg','rotate(7deg)');
    }else{
      const dx=index===1?-20:20;
      const motion=name.toLowerCase();
      if(motion.includes('hop')||motion==='pounce')frames.push({transform:`translate(${dx}px,-42px) rotate(-3deg)`,offset:.3},{transform:`translate(${-dx}px,-24px) rotate(3deg)`,offset:.65});
      else if(motion==='roll')frames.push({transform:'translate(15px,-12px) rotate(30deg)',offset:.35},{transform:'translate(-10px,-5px) rotate(-15deg)',offset:.7});
      else if(['trot','step','stomp','crawl','wade','waddle','slide'].includes(motion))frames.push({transform:`translate(${dx}px,-6px) rotate(-4deg)`,offset:.3},{transform:`translate(${-dx}px,0) rotate(4deg)`,offset:.68});
      else if(motion==='bow'||motion==='nod'||motion==='peek')frames.push({transform:'rotate(8deg) translateY(7px)',offset:.5});
      else if(motion==='stretch'||motion==='reach up')frames.push({transform:'translateY(-14px) scale(1.05,1.1)',offset:.5});
      else if(motion==='roar'||motion==='yawn')frames.push({transform:'scale(1.08) translateY(-5px)',offset:.5});
      else if(motion==='balance')frames.push({transform:'rotate(-6deg) translateY(-9px)',offset:.5});
      else frames.push({transform:`rotate(${index%2?4:-4}deg) translateY(-5px)`,offset:.5});
      if(motion.includes('ears'))part('.animal-ear','rotate(-18deg)','170px 70px');
      if(motion==='wave'||motion==='pat chest')part('.animal-paw','rotate(-24deg)','180px 130px');
      if(motion==='flap'||motion==='swing')part('.animal-wing','scaleX(1.18) rotate(-8deg)');
      if(motion==='bow')part('.animal-neck','rotate(-8deg)','148px 108px');
      if(motion==='swish')part('.animal-tail','rotate(20deg)','62px 137px');
      if(['yawn','nibble','roar'].includes(motion))part('.animal-mouth','scaleY(1.2)','185px 120px');
      if(['trumpet','shower'].includes(motion))part('.animal-trunk','rotate(-52deg)','212px 115px');
      if(motion==='big hop')frames[1].transform=`translate(${dx}px,-65px) rotate(-3deg)`;
    }
    frames.push({transform:'translate(0,0) rotate(0) scale(1)',opacity:1});
    if(!reduce())animations.push(animate(node,frames,duration));
    let controller;
    const finished=Promise.allSettled(animations.map(a=>a.finished)).then(()=>{
      if(running.get(node)!==controller)return;
      node.style.animation=oldAnimation;running.delete(node);
    });
    controller={name,index,duration,finished,cancel(){animations.forEach(a=>a.cancel());node.style.animation=oldAnimation;if(running.get(node)===controller)running.delete(node);}};
    running.set(node,controller);
    // Reduced-motion actions still produce a visible state/text update.
    if(!animations.length)queueMicrotask(()=>{node.style.animation=oldAnimation;running.delete(node);});
    return controller;
  }
  window.CreatureMotion={play,cancelAll(){for(const handle of running.values())handle.cancel();running.clear();},actions(id){return zoo.find(a=>a.id===id)?.actions||['Explore','Return','Glide'];}};
})();
