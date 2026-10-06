/* Full-screen paper party. Five waves keep coming for about six seconds:
 *   1 two corner cannons, 2 a shower from the top, 3 a big burst from the middle with a golden star,
 *   4 cannons from both sides, 5 a last streamer shower with twinkles.
 * Drawn on one canvas that never intercepts a child's next touch. With "reduce motion" it shows one still scatter instead. */
(() => {
 'use strict';
 const COLORS=['#e8b95e','#d78e85','#8fbdad','#79a7b4','#f2c7a4','#a3bb81','#c79bd6','#f5d36e','#ee7fa8','#6fb7e0'];
 const SHAPES=['rect','rect','circle','star','heart','streamer'];
 const rand=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)];
 const stats={bursts:0,waves:0,peak:0,cells:0,width:0,height:0,running:false,ms:0,reduced:false};
 let last=-Infinity,layer,canvas,g,raf=0,pieces,seen,W,H,dpr,base,startAt,waveIndex,timers=[];

 function clear(){cancelAnimationFrame(raf);raf=0;timers.forEach(clearTimeout);timers=[];layer?.remove();layer=canvas=g=null;pieces=null;stats.running=false;}
 function fit(){
  dpr=Math.min(2,window.devicePixelRatio||1);W=innerWidth;H=innerHeight;base=Math.max(7,Math.min(16,Math.min(W,H)/55));
  if(canvas){canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);g.setTransform(dpr,0,0,dpr,0,0);}
  stats.width=W;stats.height=H;
 }
 function make(x,y,vx,vy,o={}){
  const shape=o.shape||pick(SHAPES),size=base*(shape==='streamer'?rand(1.1,1.6):rand(.8,1.4));
  return {x,y,vx,vy,shape,size,color:o.color||pick(COLORS),rot:rand(0,6.28),vr:rand(-7,7),tilt:rand(0,6.28),vt:rand(4,9),
   k:o.k??rand(1.5,2.4),grav:o.grav??H*.5,sway:o.sway??rand(8,34),swayRate:rand(2,5),phase:rand(0,6.28),delay:o.delay||0,age:0,life:o.life||9};
 }
 const add=(...list)=>{pieces.push(...list);};
 /* ---- the five waves ---- */
 const waves=[
  // 1: corner cannons
  ()=>{for(const side of [-1,1])for(let i=0;i<55;i++){const dir=-Math.PI/2+(side<0?1:-1)*rand(.1,.75),s=H*rand(1.6,2.2);add(make(side<0?W*.03:W*.97,H*1.02,Math.cos(dir)*s,Math.sin(dir)*s,{delay:rand(0,.12)}));}},
  // 2: a shower from the top across the whole width
  ()=>{for(let i=0;i<110;i++)add(make(rand(0,W),-rand(10,H*.2),rand(-40,40),rand(H*.2,H*.35),{delay:rand(0,.7),k:rand(2.4,3.2),grav:H*1.1}));},
  // 3: big burst from the middle
  ()=>{const stretch=Math.min(1.8,Math.max(1,W/H*.8));for(let i=0;i<130;i++){const a=rand(0,6.28),s=H*rand(.5,1.5);add(make(W/2,H*.42,Math.cos(a)*s*stretch,Math.sin(a)*s,{delay:rand(0,.08)}));}},
  // 4: cannons shooting across from both sides
  ()=>{for(const side of [-1,1])for(let i=0;i<55;i++){const up=rand(.15,.8),dir=side<0?-up:Math.PI+up,s=Math.max(W,H)*rand(1.1,1.8);add(make(side<0?-10:W+10,H*rand(.45,.8),Math.cos(dir)*s,Math.sin(dir)*s,{delay:rand(0,.15)}));}},
  // 5: a last streamer shower plus twinkles
  ()=>{for(let i=0;i<120;i++)add(make(rand(0,W),-rand(10,H*.2),rand(-30,30),rand(H*.2,H*.35),{delay:rand(0,.8),k:rand(2.4,3.2),grav:H*1.1,shape:Math.random()<.5?'streamer':undefined}));
   for(let i=0;i<46;i++)add(make(rand(W*.04,W*.96),rand(H*.06,H*.9),0,0,{shape:'spark',delay:rand(0,1.4),life:rand(.9,1.4),grav:0,color:pick(['#fff3b8','#ffffff','#f5d36e'])}));}
 ];
 const WAVE_AT=[0,.6,1.3,2.1,2.8];
 const WAVE_SOUND=[['party',1],['party',1.18],['party',.94],['party',1.1],['party',1.3]];

 /* ---- drawing ---- */
 function star(r,inner,points=5){g.beginPath();for(let i=0;i<points*2;i++){const a=-Math.PI/2+i*Math.PI/points,d=i%2?inner:r;g.lineTo(Math.cos(a)*d,Math.sin(a)*d);}g.closePath();}
 function heart(s){g.beginPath();g.moveTo(0,s*.35);g.bezierCurveTo(-s*.9,-s*.1,-s*.5,-s*.75,0,-s*.3);g.bezierCurveTo(s*.5,-s*.75,s*.9,-s*.1,0,s*.35);g.closePath();}
 function drawPiece(p,alpha=1){
  g.save();g.translate(p.x,p.y);g.rotate(p.rot);g.fillStyle=p.color;g.globalAlpha=alpha;
  const flip=Math.cos(p.tilt);
  if(p.shape==='rect'){g.scale(1,flip);g.fillRect(-p.size/2,-p.size*.35,p.size,p.size*.7);}
  else if(p.shape==='streamer'){g.scale(1,flip);g.fillRect(-p.size*1.5,-p.size*.17,p.size*3,p.size*.34);}
  else if(p.shape==='circle'){g.scale(1,Math.max(.25,Math.abs(flip)));g.beginPath();g.arc(0,0,p.size*.45,0,6.3);g.fill();}
  else if(p.shape==='star'){g.scale(Math.max(.4,Math.abs(flip)),1);star(p.size*.75,p.size*.32);g.fill();}
  else if(p.shape==='heart'){g.scale(Math.max(.4,Math.abs(flip)),1);heart(p.size*1.1);g.fill();}
  else if(p.shape==='spark'){star(p.size*1.1,p.size*.2,4);g.fill();}
  g.restore();
 }
 function bigStar(t){ // t = seconds since wave 3: swells, spins a little, then leaves
  const life=1.6;if(t<0||t>life)return;const k=t/life,scale=k<.3?Math.sin(k/.3*Math.PI/2)*1.15:k<.4?1.15-(k-.3)*1.5:1-Math.max(0,(k-.7)/.3)*1;
  const alpha=k>.75?(1-k)/.25:1;
  g.save();g.translate(W/2,H*.42);g.rotate(Math.sin(t*3)*.12);g.scale(scale*Math.min(W,H)/430,scale*Math.min(W,H)/430);g.globalAlpha=Math.max(0,alpha);
  g.shadowColor='rgba(232,185,94,.7)';g.shadowBlur=30;g.fillStyle='#f5d36e';g.strokeStyle='#fff8dc';g.lineWidth=10;g.lineJoin='round';star(100,46);g.stroke();g.fill();
  g.shadowBlur=0;g.fillStyle='#fff8dc';g.beginPath();g.arc(-28,-20,10,0,6.3);g.arc(28,-20,10,0,6.3);g.fill();g.strokeStyle='#8a6a2d';g.lineWidth=7;g.lineCap='round';g.beginPath();g.arc(0,2,24,.25,Math.PI-.25);g.stroke();
  g.restore();
 }
 function flash(t){if(t<0||t>.5)return;g.save();g.globalAlpha=(1-t/.5)*.28;const grad=g.createRadialGradient(W/2,H*.42,0,W/2,H*.42,Math.max(W,H)*.7);grad.addColorStop(0,'#fff6cf');grad.addColorStop(1,'rgba(255,246,207,0)');g.fillStyle=grad;g.fillRect(0,0,W,H);g.restore();}
 function mark(p){const c=Math.min(5,Math.max(0,Math.floor(p.x/W*6)))+6*Math.min(3,Math.max(0,Math.floor(p.y/H*4)));seen.add(c);stats.cells=seen.size;}

 let prev=0,nextWave=0;
 function frame(now){
  if(!canvas)return;
  const t=(now-startAt)/1000,dt=Math.min(.04,(now-prev)/1000||.016);prev=now;
  while(nextWave<waves.length&&t>=WAVE_AT[nextWave]){waves[nextWave]();stats.waves=nextWave+1;if(window.SoundFX)window.SoundFX.play(...WAVE_SOUND[nextWave].slice(0,1),{pitch:WAVE_SOUND[nextWave][1]});nextWave++;}
  g.clearRect(0,0,W,H);flash(t-WAVE_AT[2]);
  let alive=0;
  for(let i=pieces.length-1;i>=0;i--){
   const p=pieces[i];
   if(p.delay>0){p.delay-=dt;continue;}
   p.age+=dt;
   if(p.shape==='spark'){const k=p.age/p.life;if(k>=1){pieces.splice(i,1);continue;}drawPiece(p,Math.sin(Math.PI*k));p.rot+=dt*2;mark(p);alive++;continue;}
   p.vy+=p.grav*dt;const damp=Math.max(0,1-p.k*dt);p.vx*=damp;p.vy*=damp;
   p.x+=(p.vx+Math.sin(p.age*p.swayRate+p.phase)*p.sway*Math.min(1,p.age))*dt;p.y+=p.vy*dt;p.rot+=p.vr*dt;p.tilt+=p.vt*dt;
   if(p.y>H+60||p.x<-120||p.x>W+120||p.age>p.life||(p.y<-H*.25&&p.vy<0)){pieces.splice(i,1);continue;} // pieces that fly off the top are done
   if(p.y>-30){drawPiece(p);mark(p);}
   alive++;
  }
  bigStar(t-WAVE_AT[2]);
  stats.peak=Math.max(stats.peak,alive);stats.ms=Math.round(t*1000);
  if(nextWave>=waves.length&&!pieces.length&&t>WAVE_AT[2]+1.7){clear();return;}
  if(t>9.5){clear();return;}
  raf=requestAnimationFrame(frame);
 }
 function still(){ // reduce-motion version: one calm scatter, a small star, gone in a moment
  g.clearRect(0,0,W,H);
  for(let i=0;i<90;i++){const p=make(rand(0,W),rand(0,H),0,0);p.tilt=rand(-.8,.8);p.rot=rand(0,6.28);drawPiece(p,.85);mark(p);}
  layer.insertAdjacentHTML('beforeend','<span class="party-star">✦</span>');
  timers.push(setTimeout(clear,1300));
 }
 function burst(){
  const now=performance.now();
  if(now-last<900)return;
  if(layer&&stats.running&&now-startAt<3000)return;
  last=now;clear();
  layer=document.createElement('div');layer.className='paper-party';layer.setAttribute('aria-hidden','true');
  canvas=document.createElement('canvas');canvas.className='party-canvas';layer.append(canvas);document.body.append(layer);
  g=canvas.getContext('2d');fit();pieces=[];seen=new Set();nextWave=0;prev=now;startAt=now;
  Object.assign(stats,{bursts:stats.bursts+1,waves:0,peak:0,cells:0,ms:0,running:true,reduced:matchMedia('(prefers-reduced-motion: reduce)').matches});
  if(stats.reduced){still();window.SoundFX?.play('star');return;}
  window.SoundFX?.play('fanfare');
  raf=requestAnimationFrame(frame);
 }
 window.addEventListener('resize',()=>{if(canvas)fit();});
 window.addEventListener('pagehide',clear);document.addEventListener('visibilitychange',()=>{if(document.hidden)clear();});
 window.LittleCelebration={burst,clear,stats};
})();
