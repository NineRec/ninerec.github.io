/* Shared catalogs and motions; verify these in materials.html before scene assembly. */
(() => {
  'use strict';
  // Zoo roster in tour order: Entrance Plaza, then anticlockwise round the park path.
  // x is the centre, y the top of the drawing; h is the art height in pixels (default 175).
  const zooPlan=[
    ['otter','Otter','Entrance Plaza',1020,1930,150,['Roll','Wave','Slide']],
    ['tiger','Tiger','Entrance Plaza',1280,1760,185,['Stretch','Swish','Pounce']],
    ['flamingo','Flamingo','Entrance Plaza',1960,1790,190,['Balance','Bow','Flap']],
    ['duck','Duck','Entrance Plaza',2290,1930,140,['Waddle','Flap','Nod']],
    ['elephant','Elephant','Elephants of Asia',560,1540,205,['Trumpet','Flap ears','Shower'],270],
    ['panda','Panda','Elephants of Asia',270,1830,175,['Nibble','Wave','Sway']],
    ['peacock','Peacock','Elephants of Asia',790,1880,185,['Show off','Strut','Peek']],
    ['kangaroo','Kangaroo','Australasia',310,1170,195,['Hop','Big hop','Wave']],
    ['koala','Koala','Australasia',650,1260,150,['Wave','Nibble','Nod']],
    ['gorilla','Gorilla','Primate Kingdom',300,720,185,['Wave','Pat chest','Sway']],
    ['orangutan','Orangutan','Primate Kingdom',930,830,180,['Wave','Swing','Sway']],
    ['lemur','Lemur','Primate Kingdom',580,960,150,['Hop','Swish','Wave']],
    ['monkey','Monkey','Primate Kingdom',640,570,170,['Hop','Swing','Wave']],
    ['polarbear','Polar bear','Frozen Tundra',340,220,180,['Sway','Nod','Slide']],
    ['penguin','Penguin','Frozen Tundra',700,140,160,['Waddle','Flap','Slide']],
    ['crocodile','Crocodile','Reptile Garden',1290,340,140,['Swish','Yawn','Crawl']],
    ['snake','Snake','Reptile Garden',1590,150,150,['Slither','Sway','Peek']],
    ['tortoise','Tortoise','Reptile Garden',1870,380,125,['Crawl','Peek','Nod']],
    ['frog','Frog','Reptile Garden',1570,500,125,['Hop','Big hop','Peek']],
    ['deer','Deer','Fragile Forest',1330,880,180,['Bow','Step','Peek']],
    ['owl','Owl','Fragile Forest',1650,780,155,['Flap','Peek','Bow']],
    ['fox','Fox','Fragile Forest',1910,1030,155,['Peek','Swish','Pounce']],
    ['bear','Bear','Fragile Forest',1480,1140,175,['Wave','Stretch','Sway']],
    ['cow','Cow','KidzWorld',2380,620,175,['Nibble','Nod','Swish']],
    ['sheep','Sheep','KidzWorld',2690,520,150,['Nibble','Trot','Nod']],
    ['pig','Pig','KidzWorld',2960,740,140,['Roll','Nod','Swish']],
    ['horse','Horse','KidzWorld',2490,890,195,['Trot','Nod','Swish']],
    ['rabbit','Rabbit','KidzWorld',2830,990,135,['Hop','Wiggle ears','Nibble']],
    ['giraffe','Giraffe','Wild Africa',2400,1120,300,['Bow','Reach up','Step'],245],
    ['zebra','Zebra','Wild Africa',2710,1260,180,['Trot','Nod','Shake']],
    ['rhino','Rhino','Wild Africa',2990,1190,185,['Nod','Stomp','Swish']],
    ['lion','Lion','Wild Africa',2520,1540,185,['Roar','Stretch','Swish']],
    ['hippo','Hippo','Wild Africa',2850,1560,175,['Yawn','Wade','Wiggle ears']],
    ['camel','Camel','Wild Africa',2210,1590,205,['Step','Nod','Swish']]
  ];
  const zoo=zooPlan.map(([id,name,zone,x,y,h,actions,width])=>({id,name,zone,x,y,h,width:width||Math.max(210,Math.round(h*1.18)),actions,detail:`Hello, ${name.toLowerCase()}! Tap again for another little surprise.`}));
  // Ocean roster: sunlit surface, coral reef, open ocean, kelp forest, twilight deep and the sandy seabed.
  const seaKinds={turtle:'paddle',clownfish:'dart',dolphin:'arc',octopus:'jet',whale:'glide',jellyfish:'pulse',shark:'glide',stingray:'ray',seahorse:'upright',crab:'scuttle',seal:'arc',pufferfish:'puff',starfish:'crawl',manta:'ray',swordfish:'dart',shrimp:'backward',lobster:'backward',mermaid:'arc',bluetang:'dart',angelfish:'glide',orca:'arc',narwhal:'glide',moray:'upright',squid:'jet',hermitcrab:'scuttle',seaotter:'glide'};
  const seaPlan=[
    ['seal','Seal','Sunny Surface',330,250,150,['Flipper wave','Playful dive','Glide']],
    ['dolphin','Dolphin','Sunny Surface',900,170,175,['Leap','Wave a flipper','Dive']],
    ['mermaid','Mermaid','Sunny Surface',1500,320,190,['Swim','Tail wave','Dive']],
    ['turtle','Sea turtle','Sunny Surface',2050,400,160,['Paddle','Glide','Turn']],
    ['seaotter','Sea otter','Kelp Forest',2630,118,150,['Float','Crack a shell','Roll']],
    ['clownfish','Clownfish','Coral Reef',330,720,125,['Tail wag','Quick dash','Peek']],
    ['bluetang','Blue tang','Coral Reef',640,600,135,['Tail wag','Quick dash','Peek']],
    ['angelfish','Angelfish','Coral Reef',940,770,160,['Fin flutter','Glide','Turn']],
    ['seahorse','Seahorse','Coral Reef',230,1010,165,['Fin flutter','Sway','Little rise']],
    ['pufferfish','Pufferfish','Coral Reef',590,950,130,['Little puff','Fin flutter','Wiggle']],
    ['narwhal','Narwhal','Open Ocean',1190,880,175,['Glide','Tusk point','Turn']],
    ['whale','Whale','Open Ocean',1270,540,195,['Glide','Blow a spout','Wave a flipper'],280],
    ['orca','Orca','Open Ocean',1780,640,185,['Leap','Glide','Tail sweep'],250],
    ['shark','Shark','Open Ocean',1580,920,175,['Cruise','Tail sweep','Turn'],250],
    ['swordfish','Swordfish','Open Ocean',2250,770,155,['Quick dash','Glide','Turn']],
    ['manta','Manta ray','Open Ocean',1980,1060,185,['Wing sweep','Soar','Bank'],250],
    ['jellyfish','Jellyfish','Kelp Forest',2640,720,170,['Bell pulse','Float up','Tassel dance']],
    ['octopus','Octopus','Twilight Deep',900,1300,170,['Eight-arm wave','Jet','Curl the arms']],
    ['squid','Squid','Twilight Deep',1450,1250,150,['Jet','Arm wave','Glide']],
    ['starfish','Starfish','Sandy Seabed',250,1650,120,['Slow crawl','Tiny turn','Sand stroll']],
    ['crab','Crab','Sandy Seabed',520,1700,125,['Sideways steps','Wave claws','Little shuffle']],
    ['shrimp','Shrimp','Sandy Seabed',800,1650,130,['Tail flick','Backward dart','Curl']],
    ['hermitcrab','Hermit crab','Sandy Seabed',1100,1700,125,['Sideways steps','Wave claws','Peek']],
    ['lobster','Lobster','Sandy Seabed',1400,1640,150,['Claw wave','Tail flick','Crawl']],
    ['stingray','Stingray','Sandy Seabed',1800,1660,150,['Fin ripple','Sand glide','Gentle turn']],
    ['moray','Moray eel','Sandy Seabed',2250,1560,170,['Sway','Peek','Open wide']]
  ];
  const seaDetail={pulse:'Pulsing softly up and down.',upright:'A little fin keeps our friend upright.',scuttle:'Sideways steps along the sandy seabed.',crawl:'A slow crawl on tiny tube feet.',backward:'A quick flick of the tail, backwards!',ray:'Wide fins glide like wings.',puff:'A little puff, then a gentle swim.',paddle:'Paddling with wonderful flippers.',jet:'A pulse of water and waving arms.'};
  const sea=seaPlan.map(([id,name,zone,x,y,h,actions,width])=>({id,name,zone,x,y,h,width:width||Math.max(200,Math.round(h*1.18)),actions,kind:seaKinds[id],detail:seaDetail[seaKinds[id]]||'Follow our friend through the water. It always comes back!'}));
  window.CreatureCatalog={zoo,sea,worlds:{zoo:{width:3200,height:2250},sea:{width:3000,height:2000}}};
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
    const name=animal.actions[index];
    node.dataset.motion=name;node.dataset.motionIndex=index;
    const animations=[],oldAnimation=node.style.animation;node.style.animation='none';
    const frames=[{transform:'translate(0,0) rotate(0) scale(1)',opacity:1}];
    let duration=1700;
    function part(selector,transform,origin){
      if(reduce())return;
      node.querySelectorAll(selector).forEach(p=>{
        // A drawing may specify its actual joint in viewBox coordinates.
        const joint=p.dataset.motionOrigin?.trim().split(/\s+/).map(Number);
        p.style.transformBox='view-box';
        p.style.transformOrigin=joint?.length===2&&joint.every(Number.isFinite)?`${joint[0]}px ${joint[1]}px`:origin||'130px 110px';
        animations.push(animate(p,[{transform:'none'},{transform,offset:.45},{transform:'none'}],duration));
      });
    }
    if(isSea){
      const kind=animal.kind;
      let direction=Math.random()<.5?-1:1;
      if(direction===directions.get(id))direction=-direction;
      directions.set(id,direction);node.dataset.direction=direction;
      const speed=[.78,1.18,.95][index],distance=(150+Math.random()*140)*direction*speed, vertical=(Math.random()-.5)*130;
      duration=['crawl','upright','pulse'].includes(kind)?4200:3200+Math.random()*900;
      const move=(x,y,rotation=0,scale=1)=>`translate(${x}px,${y}px) rotate(${rotation}deg) scale(${scale})`;
      if(kind==='pulse')frames.push({transform:move(25*direction,-70-Math.random()*35,0,.9),offset:.3},{transform:move(-15*direction,-105-Math.random()*35,0,1.06),offset:.6});
      else if(kind==='upright')frames.push({transform:move(70*direction,-45,-3),offset:.3},{transform:move(90*direction,15,3),offset:.65});
      else if(kind==='scuttle'||kind==='crawl')frames.push({transform:move(distance*(kind==='crawl'?.35:.75),0,0),offset:.45},{transform:move(distance*.15,0,0),offset:.8});
      else if(kind==='backward')frames.push({transform:move(-distance,15,6*direction),offset:.25},{transform:move(-distance*.4,-10,-4*direction),offset:.7});
      else if(kind==='puff')frames.push({transform:move(0,0,0,1.23),offset:.2},{transform:move(distance*.6,vertical,0,1),offset:.6});
      else if(kind==='arc'&&index===2)frames.push({transform:move(distance*.5,80,-12*direction),offset:.3},{transform:move(distance,35,10*direction),offset:.65});
      else if(kind==='arc')frames.push({transform:move(distance*.55,-85,-10*direction),offset:.3},{transform:move(distance,vertical,8*direction),offset:.6});
      else if(kind==='jet')frames.push({transform:move(distance*.3,-25,0,.85),offset:.2},{transform:move(distance,vertical,-8*direction),offset:.5});
      else if(kind==='dart')frames.push({transform:move(distance,vertical,-6*direction),offset:.28},{transform:move(distance*.6,-vertical,6*direction),offset:.68});
      else frames.push({transform:move(distance*.6,vertical,-4*direction),offset:.35},{transform:move(distance,vertical*.5,4*direction),offset:.65});
      // Fish and flipper swimmers face their route, then turn for the return.
      if(['paddle','dart','arc','glide','jet','puff','backward'].includes(kind)&&id!=='mermaid'){
        const drawing=node.querySelector('svg');
        if(!reduce())animations.push(animate(drawing,[{transform:`scaleX(${direction})`},{transform:`scaleX(${direction})`,offset:.58},{transform:`scaleX(${-direction})`,offset:.6},{transform:'scaleX(1)'}],duration,{easing:'steps(1,end)'}));
      }
      part('.animal-tail',`rotate(${index===1?20:12}deg)`,'65px 115px');
      if(id==='octopus'){
        node.querySelectorAll('.octopus-arm').forEach((arm,i)=>{
          if(reduce())return;
          const angle=(i%2?1:-1)*(index===2?12:7),peak=.24+(i%4)*.1;
          animations.push(animate(arm,[{transform:'none'},{transform:`rotate(${angle}deg)`,offset:peak},{transform:`rotate(${-angle*.45}deg)`,offset:Math.min(.85,peak+.25)},{transform:'none'}],duration));
        });
      }else if(id==='jellyfish'){
        part('.jelly-bell','scale(1.04,.94)');
        node.querySelectorAll('.jelly-tentacle').forEach((arm,i)=>{
          if(!reduce())animations.push(animate(arm,[{transform:'none'},{transform:`rotate(${i%2?-5:5}deg)`,offset:.25+i*.08},{transform:'none'}],duration));
        });
      }else if(id==='turtle'){
        part('.fin-front','rotate(-13deg)');part('.fin-rear','rotate(10deg)');
        part('.animal-head','rotate(4deg)');
      }else if(kind==='ray'){
        part('.ray-left','rotate(-9deg) scaleY(.91)');part('.ray-right','rotate(9deg) scaleY(.91)');
      }else part('.animal-wing,.animal-fin','rotate(-12deg) scaleY(.92)');
      if(id==='whale')part('.animal-spout',index===1?'scaleY(1.4)':'scaleY(.9)');
      if(kind==='scuttle'||kind==='backward'){
        node.querySelectorAll('.animal-leg').forEach((leg,i)=>{
          if(!reduce())animations.push(animate(leg,[{transform:'none'},{transform:`rotate(${i%2?-8:8}deg)`,offset:.3},{transform:`rotate(${i%2?6:-6}deg)`,offset:.65},{transform:'none'}],duration));
        });
        part('.animal-claw',index===1?'rotate(-17deg)':'rotate(9deg)');
      }
    }else{
      const dx=index===1?-20:20;
      const motion=name.toLowerCase();
      if(motion.includes('hop')||motion==='pounce')frames.push({transform:`translate(${dx}px,-42px) rotate(-3deg)`,offset:.3},{transform:`translate(${-dx}px,-24px) rotate(3deg)`,offset:.65});
      else if(motion==='roll')frames.push({transform:'translate(15px,-12px) rotate(30deg)',offset:.35},{transform:'translate(-10px,-5px) rotate(-15deg)',offset:.7});
      else if(['trot','step','stomp','crawl','wade','waddle','slide','strut','slither'].includes(motion))frames.push({transform:`translate(${dx}px,-6px) rotate(-4deg)`,offset:.3},{transform:`translate(${-dx}px,0) rotate(4deg)`,offset:.68});
      else if(motion==='bow'||motion==='nod'||motion==='peek')frames.push({transform:'rotate(8deg) translateY(7px)',offset:.5});
      else if(motion==='stretch'||motion==='reach up')frames.push({transform:'translateY(-14px) scale(1.05,1.1)',offset:.5});
      else if(motion==='roar'||motion==='yawn')frames.push({transform:'scale(1.08) translateY(-5px)',offset:.5});
      else if(motion==='balance')frames.push({transform:'rotate(-6deg) translateY(-9px)',offset:.5});
      else frames.push({transform:`rotate(${index%2?4:-4}deg) translateY(-5px)`,offset:.5});
      if(motion.includes('ears'))part('.animal-ear','rotate(-18deg)','170px 70px');
      if(motion==='wave'||motion==='pat chest'||motion==='swing'){part('.animal-paw:not(.paw-left)','rotate(-24deg)','180px 130px');part('.paw-left',motion==='wave'?'rotate(18deg)':'rotate(24deg)','80px 120px');}
      if(motion==='show off')part('.peacock-fan','scale(1.14)');
      if(motion==='flap'||motion==='swing')part('.animal-wing','scaleX(1.18) rotate(-8deg)');
      if(motion==='bow')part('.animal-neck','rotate(10deg)','148px 108px');
      if(motion==='bow'||motion==='nod')part('.animal-head','rotate(12deg)');
      if(motion==='swish')part('.animal-tail','rotate(20deg)','62px 137px');
      if(['yawn','nibble','roar'].includes(motion))part('.animal-mouth',motion==='nibble'?'scaleY(.65)':'scaleY(2.2)','185px 120px');
      if(['trumpet','shower'].includes(motion))part('.animal-trunk','rotate(-52deg)','212px 115px');
      if(['trot','step','stomp','crawl','wade','waddle','strut'].includes(motion)){part('.animal-leg:not(.leg-rear)','rotate(8deg)');part('.leg-rear','rotate(-8deg)');}
      if(['bear','panda','gorilla','orangutan','koala','lemur'].includes(id)){
        // Sitting feet stay planted while the upper body expresses the action.
        frames.length=1;
        if(motion==='stretch'){part('.paw-left','rotate(32deg)');part('.paw-right','rotate(-32deg)');part('.animal-head','rotate(-5deg)');}
        else if(motion==='sway')part('.animal-head','rotate(7deg)');
        else if(motion==='nibble')part('.paw-left','rotate(28deg)');
      }
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
  window.CreatureMotion={play,cancelAll(){for(const handle of running.values())handle.cancel();running.clear();},actions(id){return (zoo.find(a=>a.id===id)||sea.find(a=>a.id===id))?.actions||[];}};
})();
