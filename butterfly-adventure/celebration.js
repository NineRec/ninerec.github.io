/* Gentle, silent paper confetti. It never intercepts a child's next touch. */
(() => {
  let last=-Infinity,layer;
  function clear(){layer?.remove();layer=null;}
  window.LittleCelebration={burst(){
    if(performance.now()-last<900)return;last=performance.now();clear();
    layer=document.createElement('div');layer.className='paper-party';layer.setAttribute('aria-hidden','true');document.body.append(layer);
    const own=layer,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduced){own.innerHTML='<span class="party-star">✦</span>';setTimeout(()=>own.remove(),1200);return;}
    const colors=['#d5aa73','#b9c58d','#d49c8b','#9dbcb0','#e5ce88'];
    const motions=Array.from({length:42},(_,i)=>{
      const p=document.createElement('i');own.append(p);p.style.background=colors[i%colors.length];p.style.borderRadius=i%3===0?'50%':'2px';p.style.left=`${18+Math.random()*64}%`;
      return p.animate([{transform:'translate(0,-20px) rotate(0deg)',opacity:0},{opacity:1,offset:.1},{transform:`translate(${(Math.random()-.5)*240}px,${innerHeight*.85}px) rotate(${Math.random()*540-270}deg)`,opacity:0}],{duration:1400+Math.random()*500,delay:Math.random()*180,easing:'cubic-bezier(.2,.5,.6,1)'}).finished.catch(()=>{});
    });Promise.all(motions).then(()=>own.remove());
  },clear};
  window.addEventListener('pagehide',clear);document.addEventListener('visibilitychange',()=>{if(document.hidden)clear();});
})();
