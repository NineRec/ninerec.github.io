/* Letter Balloons.
 * A picture of an animal, fruit or toy appears with its name spoken aloud. Balloons float up wearing letters;
 * pop the one that the word starts with. Three levels change how many balloons, which case, and how alike the letters look. */
(() => {
 'use strict';
 const shuffle=list=>{const r=list.slice();for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]];}return r;};
 const sfx=(name,o)=>window.SoundFX?.play(name,o);
 const ALPHABET='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
 // Letters that children really do mix up. Level 3 puts these next to each other.
 const LOOKALIKE={B:'DPR',D:'BPQ',P:'BDQ',Q:'OGP',M:'NW',N:'MHR',U:'VN',V:'UY',W:'MV',I:'LJ',L:'IJ',O:'QCD',C:'OG',G:'CQ',E:'FL',F:'EP',T:'IL',H:'NK',K:'XH',X:'KY',Y:'VX',S:'ZC',Z:'SN',A:'RH',R:'BP',J:'IL'};
 const PAINT=[['#e8b95e','#c99a3f'],['#d78e85','#bb6f66'],['#79a7b4','#5b8895'],['#a3bb81','#84a063'],['#c79bd6','#a97bb8'],['#f0a6b8','#d4879b']];
 const ROUNDS_PER_SET=5;
 const balloon=(shown,[fill,dark],tilt)=>`<svg viewBox="0 0 120 176" aria-hidden="true" focusable="false">
  <path d="M60 128C54 142 67 150 58 174" fill="none" stroke="#8d7f6a" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M60 4C97 4 116 35 112 67 107 99 82 124 60 129 38 124 13 99 8 67 4 35 23 4 60 4Z" fill="${fill}"/>
  <path d="M60 129C82 124 107 99 112 67 114 50 109 34 100 22 104 52 92 100 60 129Z" fill="${dark}" opacity=".35"/>
  <path d="M60 126 51 141H69Z" fill="${dark}"/>
  <ellipse cx="38" cy="38" rx="11" ry="19" transform="rotate(24 38 38)" fill="#fff" opacity=".42"/>
  <text x="60" y="${shown===shown.toUpperCase()?88:86}" text-anchor="middle" font-size="${shown===shown.toUpperCase()?60:68}" font-weight="800" fill="#5b4636" font-family="'Avenir Next Rounded','Nunito','Arial Rounded MT Bold',ui-rounded,system-ui,sans-serif">${shown}</text>
 </svg>`;
 // Pick the column count that makes the balloons biggest in the room we have.
 function bestCols(n,w,h){let best=1,size=0;for(let c=1;c<=n;c++){const rows=Math.ceil(n/c),s=Math.min(w/c,h/rows*.72);if(s>size+1){size=s;best=c;}}return best;}

 window.LetterGame={start(kit){
  const {$,art,shell,setVoice,message,celebrate,flow}=kit,book=window.AdventureBook,WB=window.WordBank,Say=window.Say;
  const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hintDelay=Number(new URLSearchParams(location.search).get('hint'))||9000,pace=Number(new URLSearchParams(location.search).get('pace'))||0;
  let level=1,round=0,phase='ask',token=0,wrongs=0,deck=[],item='',letter='',lastLetter='',hintTimer=0,balloons=[];
  const levels=`<nav class="pz-levels" aria-label="Choose difficulty">${[1,2,3].map(n=>`<button data-level="${n}" aria-label="${[3,4,6][n-1]} balloons" aria-pressed="${n===1}">${'●'.repeat(n)}</button>`).join('')}</nav>`;
  shell('Letter Balloons','',`${levels}<div class="toy-content lb-content"><section class="lb-card" id="lb-card" aria-label="Picture to name"><button class="lb-picture" id="lb-picture" aria-label="Hear the word"></button><div class="lb-tag" id="lb-tag" data-state="ask" aria-live="polite"></div></section><section class="lb-sky" id="lb-sky" role="group" aria-label="Balloons with letters"></section></div><footer class="toy-footer pz-footer"><div class="round-dots" id="lb-dots"></div><p id="toy-message" class="toy-message" role="status"></p></footer>`);
  const sky=$('lb-sky'),root=$('new-game');
  Say.listen(()=>{sfx('tap');Say.play([WB.clip(item),'lb-ask']);});
  const status=()=>{root.dataset.phase=phase;};
  function layout(){
   const n=sky.children.length;if(!n)return;
   const cs=getComputedStyle(sky),w=sky.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight),h=sky.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);
   const cols=bestCols(n,w,h);sky.style.setProperty('--cols',cols);sky.dataset.cols=cols;
   [...sky.children].forEach((slot,i)=>{slot.style.gridColumn=i===n-1&&n%cols===1&&cols>1?'1 / -1':'';});
  }
  const clearHint=()=>{clearTimeout(hintTimer);sky.querySelectorAll('.lb-balloon.hint').forEach(b=>b.classList.remove('hint'));};
  const armHint=()=>{clearTimeout(hintTimer);hintTimer=setTimeout(()=>{if(phase!=='ask')return;sky.querySelector(`.lb-balloon[data-letter="${letter}"]`)?.classList.add('hint');Say.play([WB.clip(item)]);},hintDelay);};
  function renderDots(){
   const at=round%ROUNDS_PER_SET;
   $('lb-dots').innerHTML=Array.from({length:ROUNDS_PER_SET},(_,i)=>`<i class="${i<at||(phase==='won'&&i===at)?'current':''}"></i>`).join('');
   const d=root.dataset;d.level=level;d.round=round;d.item=item;d.answer=letter;d.count=balloons.length;status();
  }
  function pickLetters(){
   const n=[3,4,6][level-1],others=ALPHABET.filter(l=>l!==letter);let chosen=[];
   if(level===3){chosen=shuffle((LOOKALIKE[letter]||'').split('')).slice(0,2);}
   const alike=new Set((LOOKALIKE[letter]||'').split('')),calm=others.filter(l=>!alike.has(l)&&!chosen.includes(l));
   // Gentler levels avoid look-alikes so a guess is always fair.
   const rest=shuffle(level===1?calm:others.filter(l=>!chosen.includes(l)));
   chosen=chosen.concat(rest.slice(0,n-1-chosen.length));
   return shuffle([letter,...chosen]);
  }
  function newRound(say){
   flow.cancel();token++;clearHint();phase='ask';wrongs=0;$('lb-card').classList.remove('celebrate');
   // Walk through the alphabet in a shuffled order, then pick any picture that starts with that letter.
   if(!deck.length)deck=shuffle(WB.letters);
   let k=deck.findIndex(l=>l!==lastLetter);if(k<0)k=0;
   letter=deck.splice(k,1)[0];lastLetter=letter;
   const options=WB.byLetter[letter].filter(id=>id!==item);item=options.length?options[Math.floor(Math.random()*options.length)]:WB.byLetter[letter][0];
   const faces=pickLetters(),colours=shuffle(PAINT);
   balloons=faces.map((l,i)=>({letter:l,shown:level===1?l:level===2?l.toLowerCase():(Math.random()<.5?l:l.toLowerCase()),paint:colours[i%colours.length]}));
   $('lb-picture').innerHTML=WB.piece(item);$('lb-picture').dataset.item=item;
   $('lb-tag').dataset.state='ask';$('lb-tag').innerHTML='<span class="lb-q">?</span>';
   sky.innerHTML=balloons.map((b,i)=>`<div class="lb-slot" style="--dx:${(Math.random()*10-5).toFixed(1)}%;--dy:${(Math.random()*8-4).toFixed(1)}%"><button class="lb-balloon" data-letter="${b.letter}" data-shown="${b.shown}" aria-label="Letter ${b.shown}" data-fill="${b.paint[0]}" style="--dur:${(3.1+Math.random()*1.8).toFixed(2)}s;--delay:${(-Math.random()*3).toFixed(2)}s">${balloon(b.shown,b.paint)}</button></div>`).join('');
   layout();renderDots();
   message(`Which letter does ${WB.word(item).toLowerCase()} start with?`,'Pop the balloon with the first letter.');
   setVoice(WB.clip(item));armHint();
   if(say){sfx('shuffle');Say.play([WB.clip(item),'lb-ask'],{after:say==='wait'});}
  }
  function bits(slot,colour){
   if(reduce())return;
   for(let i=0;i<10;i++){const b=document.createElement('i'),a=i/10*Math.PI*2+Math.random()*.4,r=70+Math.random()*50;b.className='lb-bit';b.style.cssText=`--x:${Math.cos(a)*r}px;--y:${Math.sin(a)*r}px;background:${colour}`;slot.append(b);setTimeout(()=>b.remove(),800);}
  }
  function wrong(btn){
   wrongs++;clearHint();sfx('boing');btn.classList.remove('wrong');void btn.offsetWidth;btn.classList.add('wrong');setTimeout(()=>btn.classList.remove('wrong'),520);
   message('Not that one. Try another balloon!','');
   if(wrongs===1||wrongs%3===0)Say.play(['lb-wrong']);
   if(wrongs>=3&&level===1)armHintSoon();
   else armHint();
  }
  function armHintSoon(){clearTimeout(hintTimer);hintTimer=setTimeout(()=>sky.querySelector(`.lb-balloon[data-letter="${letter}"]`)?.classList.add('hint'),600);}
  function won(btn){
   phase='won';clearHint();const mine=token;
   sky.querySelectorAll('.lb-balloon').forEach(b=>{if(b!==btn)b.classList.add('drift');b.disabled=true;});
   const slot=btn.parentElement;btn.classList.add('popped');bits(slot,btn.dataset.fill);sfx('pop');setTimeout(()=>sfx('twinkle'),180);
   const first=WB.word(item)[0];
   $('lb-tag').dataset.state='won';$('lb-tag').innerHTML=`<span class="lb-big">${letter}<small>${letter.toLowerCase()}</small></span><span class="lb-word"><b>${first}</b>${WB.word(item).slice(1)}</span>`;
   WB.motion($('lb-picture'),item);
   renderDots();celebrate($('lb-card'));
   message(`${letter} is for ${WB.word(item).toLowerCase()}!`,'');
   Say.play([`ls-${letter.toLowerCase()}`,WB.clip(item)]);
   round++;
   flow.after(()=>{if(mine===token)newRound(true);},pace||4200);
  }
  sky.addEventListener('click',e=>{
   const btn=e.target.closest('.lb-balloon');if(!btn||phase!=='ask'||btn.disabled)return;
   if(btn.dataset.letter===letter)won(btn);else wrong(btn);
  });
  $('lb-picture').addEventListener('click',()=>{sfx('tap');Say.play([WB.clip(item)]);WB.motion($('lb-picture'),item);});
  root.querySelector('.pz-levels').addEventListener('click',e=>{
   const b=e.target.closest('button[data-level]');if(!b)return;
   level=Number(b.dataset.level);root.querySelectorAll('.pz-levels button').forEach(x=>x.setAttribute('aria-pressed',x===b));
   round=0;sfx('tap');newRound(true);
  });
  new ResizeObserver(layout).observe(sky);
  window.addEventListener('pagehide',()=>{clearHint();flow.cancel();token++;Say.cancel();});
  newRound('wait');
  // The shell plays this welcome first (also when a tap is needed to unlock sound); then the word and the question follow.
  setVoice('lb-intro');
 }};
})();
