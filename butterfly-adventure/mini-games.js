/* Three gentle stories: safe walking, a counting picnic and planting. */
(() => {
  const shuffle=items=>items.slice().sort(()=>Math.random()-.5);
  window.MiniGames={start(game,kit){
    const {$,art,shell,speak,setVoice,message,guide,bindPick,returnTile,fly,celebrate,foodNames,flow}=kit;
    const bookAudioRemaining=()=>window.AdventureBook.audioRemaining();
    const toys=art.playthings,reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
    const buttons=items=>items.map(([id,label])=>`<button class="learning-tool food-tile" data-pick="${id}" aria-label="${label}">${toys[id]}<span>${label}</span></button>`).join('');
    const modes=()=>'<nav class="learning-modes" aria-label="Choose difficulty"><button data-level="1" aria-label="Easy" aria-pressed="true">●</button><button data-level="2" aria-label="More choices" aria-pressed="false">● ●</button></nav>';
    function status(phase){$('new-game').dataset.phase=phase;}
    function flash(node){returnTile(node);}
    if(game==='traffic'){
      let round=0,step=0,phase='choose',token=0,route=[],motions=[];
      const places=['park','market','library'];
      shell('A Little Walk','',`<div class="toy-content route-content"><aside class="route-card"><div id="route-goal" class="route-goal"></div><div id="route-map" class="route-map" aria-label="Our path to the destination"></div><div class="round-dots" id="walk-progress"></div></aside><div class="traffic-work"><div class="traffic-scene" id="traffic-scene" data-signal="red"><div class="traffic-town" id="traffic-destination"></div><div class="traffic-road"><div class="crossing-stripes"></div><span class="road-car car-one">${art.vehicles.car}</span><span class="road-car car-two">${art.vehicles.bus}</span><span class="road-car car-turn">${art.vehicles.van}</span></div><div class="traffic-signal" id="traffic-signal">${toys.signal}</div><div class="traffic-walkers" id="traffic-walkers"><span class="grownup-walker">${art.grownup()}</span><span class="small-walker">${art.kid()}</span><span class="held-hands" aria-hidden="true"></span></div></div><div class="route-controls"><div id="route-choices" class="route-choices"><button id="route-left" data-turn="left" class="toy-button route-turn" aria-label="Choose the left route">${art.icons.left}</button><button id="route-right" data-turn="right" class="toy-button route-turn" aria-label="Choose the right route">${art.icons.right}</button></div><button id="cross-road" class="toy-button crossing-button" aria-label="Wait for green">${art.icons.hand}</button></div></div></div><footer class="toy-footer"><p id="toy-message" class="toy-message sr-only" role="status"></p><button id="walk-next" class="toy-button" aria-label="Next walk" hidden>${art.icons.play}</button></footer>`);
      function cancel(){token++;motions.forEach(a=>a.cancel());motions=[];flow.cancel();}
      function map(){
        const points=[[150,263],...route.map((d,i)=>[d==='left'? 70:230,198-i*74]),[150,43]];
        const line=points.slice(0,step+1).map(p=>p.join(',')).join(' '),current=points[Math.min(step,points.length-1)];
        $('route-map').innerHTML=`<svg viewBox="0 0 300 300" aria-hidden="true"><path d="M150 263L70 198L70 124L150 43M150 263L230 198L230 124L150 43M70 198L230 124M230 198L70 124" stroke="#d5dbc6" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" fill="none"/><polyline points="${line}" stroke="#9bae7b" stroke-width="13" fill="none" stroke-linecap="round" stroke-linejoin="round"/>${[ [150,263],[70,198],[230,198],[70,124],[230,124],[150,43] ].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="10" fill="#f8f0d8" stroke="#acbb90" stroke-width="2"/>`).join('')}<circle id="route-marker" cx="${current[0]}" cy="${current[1]}" r="14" fill="#d7a36a"/></svg>`;
      }
      function render(){status(phase);$('new-game').dataset.round=round;$('new-game').dataset.step=step;$('new-game').dataset.route=route.join(',');$('traffic-scene').dataset.signal=['green','crossing','checkpoint','done'].includes(phase)?'green':'red';$('traffic-scene').dataset.phase=phase;
        $('route-goal').innerHTML=art.places[places[round]];$('traffic-destination').innerHTML=art.places[places[round]];
        $('walk-progress').innerHTML=places.map((_,i)=>`<i class="${i===round?'current':''}"></i>`).join('');$('route-choices').hidden=phase!=='choose';$('cross-road').hidden=phase==='choose'||phase==='done'||phase==='checkpoint';$('cross-road').innerHTML=phase==='green'||phase==='crossing'?art.icons.footsteps:art.icons.hand;$('cross-road').classList.toggle('walk-ready',phase==='green');$('cross-road').disabled=phase==='crossing';$('cross-road').setAttribute('aria-label',phase==='green'?'Walk with a grown-up':'Wait for green');map();
      }
      async function prepare(direction){
        if(phase!=='choose')return;if(direction)route.push(direction);phase='red';render();const own=token;
        if(direction)speak('traffic-turn-'+direction);else speak('traffic-wait');
        const width=$('traffic-scene').clientWidth,duration=reduce()?1400:2200;
        const cars=[...$('traffic-scene').querySelectorAll('.road-car')];cars.forEach(c=>c.style.opacity='1');
        const frames=[
          [{transform:`translateX(${-width*.7}px)`},{transform:`translateX(${-width*.31}px)`}],
          [{transform:`translateX(${width*.6}px)`},{transform:`translateX(${width*.13}px)`}],
          [{transform:`translate(${width*.45}px,-55px) rotate(0deg)`,opacity:1},{transform:'translate(0,-55px) rotate(0deg)',offset:.4,opacity:1},{transform:`translate(${-width*.5}px,-110px) rotate(35deg)`,opacity:0}]
        ];
        $('traffic-scene').dataset.carsStopped='false';motions=cars.map((car,i)=>car.animate(reduce()?[frames[i].at(-1),frames[i].at(-1)]:frames[i],{duration:duration+i*150,easing:'ease-out',fill:'forwards'}));
        await Promise.allSettled(motions.map(a=>a.finished));if(own!==token)return;
        $('traffic-scene').dataset.carsStopped='true';phase='green';render();speak('traffic-green');
      }
      function resetCrossing(){cancel();$('traffic-walkers').style.transform='';$('traffic-destination').classList.remove('celebrate');phase='choose';render();if(step===2)prepare();else setVoice(step?'traffic-next':'traffic-'+places[round]);}
      $('route-left').addEventListener('click',()=>prepare('left'));$('route-right').addEventListener('click',()=>prepare('right'));
      $('cross-road').addEventListener('click',async()=>{
        if(phase==='crossing')return;if(phase!=='green'||$('traffic-scene').dataset.carsStopped!=='true'){flash($('cross-road'));speak('traffic-wrong');return;}
        phase='crossing';render();speak('traffic-cross');const own=token,node=$('traffic-walkers'),distance=$('traffic-scene').clientHeight*.56;
        const a=node.animate([{transform:'translateY(0)'},{transform:`translateY(-${distance}px)`}],{duration:reduce()?1:1900,easing:'linear',fill:'forwards'});motions.push(a);try{await a.finished;}catch{return;}if(own!==token)return;
        step++;phase=step===3?'done':'checkpoint';render();celebrate(step===3?$('traffic-destination'):$('route-goal'));
        if(phase==='done'){speak('traffic-done');flow.after(()=>{round=(round+1)%places.length;step=0;route=[];resetCrossing();speak('traffic-'+places[round]);});}
        else{setVoice('traffic-next');flow.after(()=>{resetCrossing();if(step<2)speak('traffic-next');},Math.max(1900,bookAudioRemaining()));}
      });
      window.addEventListener('pagehide',cancel);document.addEventListener('visibilitychange',()=>motions.forEach(a=>{if(a.playState==='finished'||a.playState==='idle')return;if(document.hidden)a.pause();else a.play();}));resetCrossing();
    }else if(game==='counting'){
      let level=1,round=0,count=0,phase='play',busy=false,token=0;
      let targets=shuffle([1,2,3,4,5]);const friends=[['rabbit','carrot'],['monkey','banana'],['elephant','apple']];
      shell('A Counting Picnic','ONE LITTLE PIECE · ONE HAPPY FRIEND',`${modes()}<div class="toy-content picnic-content"><aside class="picnic-card"><p class="eyebrow">OUR PICNIC CARD</p><div id="picnic-friend" class="picnic-friend"></div><div class="picnic-order"><strong id="picnic-target"></strong><span id="picnic-food"></span></div><p id="picnic-request"></p><p id="picnic-round" class="toy-counter"></p></aside><div class="picnic-work"><div id="picnic-basket" class="picnic-basket" aria-label="Drop the food here"><div class="picnic-rug"></div><div id="picnic-pieces" class="picnic-pieces"></div><div class="picnic-count"><strong id="picnic-count">0</strong> little pieces</div><button id="picnic-remove" class="toy-button">Put one back ↶</button></div><div id="picnic-foods" class="picnic-foods"></div></div></div><footer class="toy-footer"><p id="toy-message" class="toy-message" role="status"></p><button id="picnic-check" class="toy-button">Count &amp; check ✓</button></footer>`);
      const target=()=>targets[round],friend=()=>friends[round%friends.length];
      function render(){status(phase);$('new-game').dataset.target=target();$('new-game').dataset.count=count;$('new-game').dataset.level=level;$('picnic-target').innerHTML=`<strong>${target()}</strong><span class="number-pips">${Array.from({length:target()},()=>'<i></i>').join('')}</span>`;$('picnic-friend').innerHTML=art.animals[friend()[0]];$('picnic-food').innerHTML=art.food[friend()[1]];$('picnic-request').textContent=`${foodNames[friend()[1]]} picnic · match the number`;$('picnic-round').textContent=`${round+1} / ${targets.length} picnic cards`;$('picnic-pieces').innerHTML=Array.from({length:count},()=>`<span>${art.food[friend()[1]]}</span>`).join('');$('picnic-count').textContent=count;$('picnic-remove').disabled=!count||busy||phase==='done';$('picnic-check').disabled=busy;$('picnic-check').textContent=phase==='done'?'Another picnic card →':'Count & check ✓';$('picnic-foods').querySelectorAll('button').forEach(b=>b.disabled=phase==='done');$('new-game').querySelectorAll('[data-level]').forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.level)===level));}
      function reset(){flow.cancel();token++;$('picnic-basket').classList.remove('celebrate');busy=false;count=0;phase='play';$('picnic-foods').innerHTML=['carrot','banana','apple','strawberry'].map(id=>`<button class="food-tile" data-pick="${id}">${art.food[id]}<span>${foodNames[id]}</span></button>`).join('');render();message(`Can you prepare ${target()} little pieces?`,'Tap food or drag it onto our picnic rug. One touch makes one piece.');setVoice(`number-${target()}`);}
      bindPick($('picnic-foods'),'#picnic-basket',async(id,node)=>{if(busy||phase!=='play')return;if(id!==friend()[1]||count>=target()){flash(node);message('Let us look at our picnic card.','Choose the pictured food and match its number.');speak('counting-wrong');return;}busy=true;const own=token;speak(`number-${count+1}`);await fly(node,$('picnic-basket'));if(own!==token)return;count++;busy=false;render();setVoice(`number-${target()}`);message(`${count} little ${count===1?'piece':'pieces'}.`,`Our picnic card asks for ${target()}.`);if(count===target())completePicnic();});
      $('picnic-remove').addEventListener('click',()=>{if(busy||phase!=='play'||!count)return;count--;render();message('One piece goes back.','We can always count and try again.');});
      function nextPicnic(){if(phase!=='done')return;round++;if(round===targets.length){round=0;targets=shuffle(level===1?[1,2,3,4,5]:[1,2,3,4,5,6,7,8,9,10]);}reset();speak(`number-${target()}`);}
      function completePicnic(){if(phase!=='play'||busy||count!==target())return;phase='done';render();CreatureMotion.play($('picnic-friend'),friend()[0]);celebrate($('picnic-basket'));speak('counting-done');flow.after(nextPicnic);}
      $('picnic-check').addEventListener('click',()=>{if(busy)return;if(phase==='done'){nextPicnic();return;}if(count!==target()){flash($('picnic-check'));speak('counting-wrong');return;}completePicnic();});
      $('new-game').querySelector('.learning-modes').addEventListener('click',e=>{const b=e.target.closest('button[data-level]');if(!b)return;level=Number(b.dataset.level);round=0;targets=shuffle(level===1?[1,2,3,4,5]:[1,2,3,4,5,6,7,8,9,10]);reset();speak(`number-${target()}`);});reset();
    }else if(game==='seedling'){
      // One tulip, told as a rhyme: dig, seed, cover, then sun, worm, rain and grandpa each bring more leaves, and it blooms.
      let phase='dig',digs=0,stage=0,busy=false,token=0,timer;
      const sequence=['dig','seed','cover','sun','worm','rain','grandpa'],correct={dig:'spade',seed:'seed',cover:'soil',sun:'sun',worm:'worm',rain:'rain',grandpa:'grandpa'};
      const names={dig:'挖一个小坑',seed:'放进小种子',cover:'盖上薄薄的土',sun:'请大太阳出来',worm:'请小蚯蚓来翻土',rain:'请毛毛雨来浇水',grandpa:'请老爷爷来耕耘',bloom:'小花正在开放',done:'郁金香开花啦！'};
      const verses={sun:['大太阳当空晒，','一片叶子长出来。'],worm:['小蚯蚓翻土快，','两片叶子长出来。'],rain:['毛毛雨来灌溉，','三片叶子长出来。'],grandpa:['老爷爷来耕耘，','所有叶子长出来。']};
      const wait=ms=>new Promise(r=>setTimeout(r,reduce()?1:ms)),grounded=svg=>svg.replace('<svg','<svg preserveAspectRatio="xMidYMax meet"');
      const hearLine=()=>wait(Math.min(2600,Math.max(0,bookAudioRemaining())));
      shell('挖呀种花园','中文小故事 · 一朵郁金香的旅行',`<div class="toy-content seedling-content"><aside class="seedling-card"><p class="eyebrow">小园丁的种花计划</p><ol id="seedling-plan"></ol>${guide()}<p class="seedling-fact">小花长大需要阳光、泥土和雨水。<br>每种植物长大的速度都不一样。</p></aside><div class="seedling-work"><div id="garden-bed" class="garden-bed" role="group" aria-label="花园"><span class="garden-sky"><span id="garden-sun" class="garden-sun">${toys.sun}</span><span id="garden-cloud" class="garden-cloud">${toys.rain}</span></span><span id="garden-helper" class="garden-helper"></span><span class="garden-earth"></span><span id="garden-hole" class="garden-hole"><span id="garden-seed" class="garden-seed">${toys.seed}</span></span><span class="garden-mound"></span><span id="garden-plant" class="garden-plant"></span><span id="garden-rain" class="garden-rain" hidden></span><span id="garden-dirt" class="garden-dirt" aria-hidden="true"></span><button id="garden-action" class="garden-hit" aria-label="花园：轻点来完成当前的种花步骤"></button><button id="garden-spade" class="garden-spade" aria-label="小铲子：点一点，挖一下">${toys.spade}</button><span id="garden-caption" class="garden-caption"></span></div><div id="garden-tools" class="garden-tools">${buttons([['spade','小铲子'],['seed','种子'],['soil','盖土'],['sun','大太阳'],['worm','小蚯蚓'],['rain','毛毛雨'],['grandpa','老爷爷']])}</div></div></div><footer class="toy-footer"><p id="toy-message" class="toy-message" role="status"></p><button id="seedling-again" class="toy-button" disabled>再种一次 ↻</button></footer>`);
      $('new-game').lang='zh-CN';$('toy-listen').setAttribute('aria-label','听 Zoey 讲');
      function render(){
        status(phase);const bed=$('garden-bed');
        $('new-game').dataset.digs=digs;$('new-game').dataset.stage=stage;bed.dataset.phase=phase;bed.dataset.digs=digs;bed.dataset.stage=stage;
        $('garden-action').disabled=busy||phase==='bloom'||phase==='done';$('garden-spade').disabled=busy||phase!=='dig';$('seedling-again').disabled=phase!=='done';
        $('garden-caption').textContent=names[phase]+(phase==='dig'?` · ${digs}/3`:'');
        const current=sequence.indexOf(phase);
        $('seedling-plan').innerHTML=sequence.map((p,i)=>`<li class="${phase==='bloom'||phase==='done'||i<current?'step-done':i===current?'step-current':''}">${toys[correct[p]]}<span class="sr-only">${names[p]}</span></li>`).join('');
        const plant=$('garden-plant');if(plant.dataset.stage!==String(stage)){plant.dataset.stage=stage;plant.innerHTML=stage?grounded(art.tulipStage(stage)):'';}
        $('garden-tools').querySelectorAll('[data-pick]').forEach(b=>{b.disabled=phase==='bloom'||phase==='done';b.classList.toggle('next-ingredient',b.dataset.pick===correct[phase]);});
      }
      function dirt(){
        const box=$('garden-dirt');box.innerHTML=Array.from({length:7},(_,i)=>`<i style="--dx:${(i-3)*17+(i%2?5:-4)}px;--dy:${-34-(i%3)*15}px;--spin:${i*47}deg"></i>`).join('');
        box.classList.remove('fly');void box.offsetWidth;box.classList.add('fly');
      }
      async function plunge(){
        const spade=$('garden-spade').querySelector('svg');
        if(!reduce())await spade.animate([{transform:'translateY(0) rotate(0)'},{transform:'translateY(34%) rotate(-7deg)',offset:.42},{transform:'translateY(34%) rotate(-7deg)',offset:.58},{transform:'translateY(0) rotate(0)'}],{duration:760,easing:'ease-in-out'}).finished.catch(()=>{});
        dirt();
      }
      async function helper(id,className,duration){
        const box=$('garden-helper');box.className='garden-helper '+className;box.innerHTML=grounded(toys[id]);void box.offsetWidth;box.classList.add('active');
        await wait(duration);box.classList.remove('active');await wait(380);box.innerHTML='';box.className='garden-helper';
      }
      function reset(){
        flow.cancel();token++;clearTimeout(timer);$('garden-bed').classList.remove('celebrate','beam','raining');busy=false;phase='dig';digs=0;stage=0;
        $('garden-rain').hidden=true;$('garden-helper').innerHTML='';$('garden-helper').className='garden-helper';$('garden-cloud').classList.remove('show');$('garden-plant').dataset.stage='';render();
        message('一颗种子，会长成什么呢？','先点一点小铲子，挖三下小坑。');setVoice('seedling-intro');
      }
      async function use(id,node){
        if(busy||phase==='bloom'||phase==='done')return;
        if(id!==correct[phase]){flash(node||$('garden-spade'));message('先等等，下一步是：'+names[phase]+'。','小园丁可以慢慢来，再试一次。');speak('seedling-wrong');return;}
        busy=true;const own=token;render();
        if(node&&node.dataset?.pick)await fly(node,$('garden-bed'));
        if(own!==token)return;
        if(phase==='dig'){
          await plunge();if(own!==token)return;digs++;
          if(digs===3){phase='seed';speak('seedling-seed');message(names.seed,'把种子放进小坑里。');}else{speak('seedling-dig');message(names.dig,`再点一点铲子，还要挖 ${3-digs} 下。`);}
        }else if(phase==='seed'){
          $('garden-bed').classList.add('seed-in');await wait(620);if(own!==token)return;phase='cover';speak('seedling-cover');message(names.cover,'给小种子盖好被子，然后请大太阳来帮忙。');
        }else if(phase==='cover'){
          $('garden-bed').classList.remove('seed-in');$('garden-bed').classList.add('covered');dirt();await wait(520);if(own!==token)return;phase='sun';message(names.sun,'大太阳当空晒……点一点大太阳。');
        }else{
          const verse=verses[phase];speak('seedling-'+phase);message(verse[0],verse[1]);
          if(phase==='sun'){$('garden-bed').classList.add('beam');await wait(1900);$('garden-bed').classList.remove('beam');}
          else if(phase==='worm')await helper('worm','worm',1900);
          else if(phase==='rain'){$('garden-cloud').classList.add('show');await wait(500);$('garden-rain').hidden=false;await wait(1700);$('garden-rain').hidden=true;$('garden-cloud').classList.remove('show');}
          else await helper('grandpa','grandpa',2200);
          if(own!==token)return;
          stage=({sun:1,worm:2,rain:3,grandpa:4})[phase];render();await hearLine();if(own!==token)return;
          phase=sequence[sequence.indexOf(phase)+1]||'bloom';
          if(phase==='bloom'){
            busy=true;render();message('最后开出花朵……','');await wait(900);if(own!==token)return;
            stage=5;phase='done';busy=false;render();celebrate($('garden-bed'));message('开花啦！你种出了一朵漂亮的郁金香。','谢谢你细心照顾。真实的小花要等很多天，慢慢长大。');speak('seedling-done');flow.after(()=>{reset();speak('seedling-intro');});
            return;
          }
          message(names[phase],'按顺序请朋友来帮忙，看看小花的变化。');
        }
        busy=false;render();
      }
      bindPick($('garden-tools'),'#garden-bed',use);
      $('garden-action').addEventListener('click',()=>use(correct[phase],null));
      $('garden-spade').addEventListener('click',()=>use('spade',null));
      $('seedling-again').addEventListener('click',()=>{if(phase==='done'){reset();speak('seedling-intro');}});
      window.addEventListener('pagehide',()=>{clearTimeout(timer);token++;});
      reset();
    }
  }};
})();
