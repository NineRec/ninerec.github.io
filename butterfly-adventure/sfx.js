/* Little sound effects, synthesized with Web Audio so there is nothing to download.
 * Every sound is a tiny recipe that draws into any AudioContext, which also lets the tests render them offline.
 * Follows the same mute switch as the narrator (AdventureBook.muted). */
(() => {
 'use strict';
 const AudioCtx=window.AudioContext||window.webkitAudioContext;
 const NOTE={C4:261.63,D4:293.66,E4:329.63,G4:392,A4:440,C5:523.25,D5:587.33,E5:659.25,G5:783.99,A5:880,C6:1046.5,D6:1174.7,E6:1318.5,G6:1568,A6:1760,C7:2093};
 let ctx,master,noiseBuf,armed=false,lastPlay={};
 const isMuted=()=>Boolean(window.AdventureBook?.muted);

 // One soft note: attack, then a smooth fade. `to` bends the pitch while it rings.
 function tone(c,out,t,{f=440,to=f,dur=.2,type='sine',gain=.25,attack=.006,delay=0}={}){
  const o=c.createOscillator(),g=c.createGain(),s=t+delay;
  o.type=type;o.frequency.setValueAtTime(f,s);
  if(to!==f)o.frequency.exponentialRampToValueAtTime(Math.max(20,to),s+dur);
  g.gain.setValueAtTime(0.0001,s);g.gain.linearRampToValueAtTime(gain,s+attack);g.gain.exponentialRampToValueAtTime(0.0001,s+dur);
  o.connect(g).connect(out);o.start(s);o.stop(s+dur+.03);
}
 // A bell is a note plus two quieter overtones, so it sounds like a little chime instead of a beep.
 const bell=(c,out,t,f,{dur=.55,gain=.2,delay=0}={})=>{tone(c,out,t,{f,dur,gain,delay});tone(c,out,t,{f:f*2.01,dur:dur*.6,gain:gain*.35,delay});tone(c,out,t,{f:f*3.02,dur:dur*.3,gain:gain*.12,delay});};
 function buffer(c){
  if(!noiseBuf){const n=Math.floor(c.sampleRate*1.2),b=c.createBuffer(1,n,c.sampleRate),d=b.getChannelData(0);let seed=7;for(let i=0;i<n;i++){seed=(seed*16807)%2147483647;d[i]=(seed/2147483647)*2-1;}noiseBuf=b;}
  return noiseBuf;
 }
 // A puff of filtered noise: pops, splashes, whooshes and bites are all made from this.
 function puff(c,out,t,{dur=.1,gain=.2,type='bandpass',freq=1800,to=freq,q=.9,delay=0}={}){
  const n=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain(),s=t+delay;
  n.buffer=buffer(c);f.type=type;f.Q.value=q;f.frequency.setValueAtTime(freq,s);
  if(to!==freq)f.frequency.exponentialRampToValueAtTime(Math.max(40,to),s+dur);
  g.gain.setValueAtTime(0.0001,s);g.gain.linearRampToValueAtTime(gain,s+.008);g.gain.exponentialRampToValueAtTime(0.0001,s+dur);
  n.connect(f).connect(g).connect(out);n.start(s,Math.random()*.5);n.stop(s+dur+.03);
 }
 const sparkle=(c,out,t,{count=5,gain=.1,pitch=1,gap=.07}={})=>{const set=[NOTE.E6,NOTE.G6,NOTE.A6,NOTE.C7,NOTE.G6,NOTE.E6];for(let i=0;i<count;i++)tone(c,out,t,{f:set[i%set.length]*pitch,dur:.22,gain,delay:i*gap});};

 // name -> recipe(c,out,t,o). Each ends within about 1.5 seconds except the big celebration.
 const sounds={
  tap:(c,o,t,p)=>tone(c,o,t,{f:520*p,to:640*p,dur:.09,type:'triangle',gain:.24}),
  pick:(c,o,t,p)=>{tone(c,o,t,{f:NOTE.G5*p,dur:.14,gain:.22});tone(c,o,t,{f:NOTE.G6*p,dur:.08,gain:.06});},
  drop:(c,o,t,p)=>{tone(c,o,t,{f:340*p,to:210*p,dur:.14,gain:.26});puff(c,o,t,{dur:.05,gain:.08,freq:900});},
  link:(c,o,t,p)=>{[NOTE.C5,NOTE.E5,NOTE.G5].forEach((f,i)=>bell(c,o,t,f*p,{delay:i*.075,dur:.6,gain:.2}));},
  boing:(c,o,t,p)=>{tone(c,o,t,{f:300*p,to:170*p,dur:.3,type:'triangle',gain:.24});tone(c,o,t,{f:290*p,to:180*p,dur:.3,type:'sine',gain:.1,delay:.02});},
  pop:(c,o,t,p)=>{tone(c,o,t,{f:380*p,to:1100*p,dur:.09,gain:.34});puff(c,o,t,{dur:.06,gain:.2,type:'highpass',freq:3000});},
  match:(c,o,t,p)=>{sounds.pop(c,o,t,p);bell(c,o,t,NOTE.E6*p,{delay:.07,dur:.4,gain:.12});bell(c,o,t,NOTE.A6*p,{delay:.14,dur:.45,gain:.1});},
  shuffle:(c,o,t,p)=>{for(let i=0;i<5;i++){puff(c,o,t,{dur:.06,gain:.28,freq:2200+i*300,q:.7,delay:i*.07});tone(c,o,t,{f:(420+i*70)*p,dur:.06,type:'triangle',gain:.1,delay:i*.07});}},
  star:(c,o,t,p)=>{bell(c,o,t,NOTE.C6*p,{dur:.5,gain:.16});bell(c,o,t,NOTE.E6*p,{delay:.09,dur:.55,gain:.16});},
  // themed link sounds, one per kind of friendship
  chomp:(c,o,t,p)=>{[0,.14].forEach(d=>{puff(c,o,t,{dur:.08,gain:.2,type:'lowpass',freq:1100,to:400,delay:d});tone(c,o,t,{f:240*p,to:110*p,dur:.09,gain:.16,delay:d});});bell(c,o,t,NOTE.G5*p,{delay:.3,dur:.4,gain:.12});},
  siren:(c,o,t,p)=>{for(let i=0;i<2;i++){tone(c,o,t,{f:620*p,to:620*p,dur:.2,type:'triangle',gain:.18,delay:i*.4});tone(c,o,t,{f:830*p,to:830*p,dur:.2,type:'triangle',gain:.18,delay:i*.4+.2});}bell(c,o,t,NOTE.E6*p,{delay:.82,dur:.4,gain:.1});},
  sizzle:(c,o,t,p)=>{puff(c,o,t,{dur:.7,gain:.16,type:'highpass',freq:3800});tone(c,o,t,{f:500*p,to:260*p,dur:.4,gain:.1});},
  splash:(c,o,t,p)=>{puff(c,o,t,{dur:.4,gain:.26,freq:1500,to:420,q:.8});[.1,.2,.28].forEach((d,i)=>tone(c,o,t,{f:(800+i*220)*p,to:(1500+i*260)*p,dur:.07,gain:.14,delay:d}));},
  twinkle:(c,o,t,p)=>sparkle(c,o,t,{count:6,gain:.16,pitch:p*.82,gap:.09}),
  flutter:(c,o,t,p)=>{for(let i=0;i<7;i++)tone(c,o,t,{f:(i%2?NOTE.G6:NOTE.E6)*p,dur:.1,type:'triangle',gain:.15,delay:i*.06});bell(c,o,t,NOTE.C7*p,{delay:.45,dur:.4,gain:.08});},
  bounce:(c,o,t,p)=>{tone(c,o,t,{f:180*p,to:520*p,dur:.14,gain:.26});tone(c,o,t,{f:520*p,to:200*p,dur:.12,gain:.18,delay:.14});tone(c,o,t,{f:150*p,to:130*p,dur:.1,gain:.2,delay:.3});bell(c,o,t,NOTE.A5*p,{delay:.34,dur:.35,gain:.1});},
  moo:(c,o,t,p)=>{tone(c,o,t,{f:150*p,to:105*p,dur:.7,type:'sawtooth',gain:.1});tone(c,o,t,{f:300*p,to:210*p,dur:.7,type:'sine',gain:.08});bell(c,o,t,NOTE.C6*p,{delay:.72,dur:.4,gain:.1});},
  // ice cream shop
  scoop:(c,o,t,p)=>{puff(c,o,t,{dur:.1,gain:.2,type:'lowpass',freq:1500,to:500});tone(c,o,t,{f:330*p,to:160*p,dur:.17,gain:.28});tone(c,o,t,{f:540*p,to:300*p,dur:.1,type:'triangle',gain:.08,delay:.05});},
  bell:(c,o,t,p)=>{bell(c,o,t,NOTE.E6*p,{dur:.95,gain:.3});bell(c,o,t,NOTE.A6*p,{delay:.14,dur:.85,gain:.2});},
  sprinkle:(c,o,t,p)=>{for(let i=0;i<8;i++)tone(c,o,t,{f:(1800+((i*397)%900))*p,to:(1500+((i*211)%700))*p,dur:.05,type:'triangle',gain:.1,delay:i*.045});puff(c,o,t,{dur:.32,gain:.1,type:'highpass',freq:5000});},
  crunch:(c,o,t,p)=>{[0,.07,.15].forEach(d=>puff(c,o,t,{dur:.06,gain:.26,type:'highpass',freq:2500,delay:d}));tone(c,o,t,{f:200*p,to:120*p,dur:.08,gain:.12});},
  // celebration pieces
  party:(c,o,t,p)=>{puff(c,o,t,{dur:.1,gain:.36,freq:1900*p,to:700,q:.7});tone(c,o,t,{f:150*p,to:60,dur:.16,gain:.32});sparkle(c,o,t,{count:4,gain:.09,pitch:p,gap:.05});},
  fanfare:(c,o,t,p)=>{[NOTE.C5,NOTE.E5,NOTE.G5,NOTE.C6].forEach((f,i)=>{tone(c,o,t,{f:f*p,dur:.34,type:'triangle',gain:.2,delay:i*.1});bell(c,o,t,f*p,{delay:i*.1,dur:.5,gain:.1});});[NOTE.C5,NOTE.E5,NOTE.G5,NOTE.C6].forEach(f=>tone(c,o,t,{f:f*p,dur:1.1,type:'triangle',gain:.1,delay:.46}));sparkle(c,o,t,{count:8,gain:.1,pitch:p,gap:.08});}
 };
 const names=Object.keys(sounds);

 function context(){
  if(!AudioCtx)return null;
  if(!ctx){
   ctx=new AudioCtx();
   const comp=ctx.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=6;comp.knee.value=12;
   master=ctx.createGain();master.gain.value=1.2;master.connect(comp).connect(ctx.destination);
   // Let sounds play even when an iPhone is on silent, like any game would.
   try{if(navigator.audioSession)navigator.audioSession.type='playback';}catch{}
  }
  return ctx;
 }
 function unlock(){const c=context();if(c&&c.state==='suspended')c.resume().catch(()=>{});return c;}
 function play(name,{pitch=1,delay=0}={}){
  const recipe=sounds[name];
  stats.requested.push(name);if(stats.requested.length>200)stats.requested.shift();
  if(!recipe||isMuted()||!armed)return false;
  const now=performance.now();
  if(now-(lastPlay[name]||-Infinity)<35)return false;lastPlay[name]=now;
  const c=unlock();if(!c)return false;
  try{recipe(c,master,c.currentTime+.01+delay,pitch);stats.played++;return true;}catch{return false;}
 }
 // Offline render for tests: how loud, how long, and whether it clips.
 async function render(name,pitch=1){
  const Off=window.OfflineAudioContext||window.webkitOfflineAudioContext;if(!Off||!sounds[name])return null;
  const rate=22050,c=new Off(1,rate*3,rate);const g=c.createGain();g.gain.value=1.2;g.connect(c.destination);
  sounds[name](c,g,.01,pitch);
  const d=(await c.startRendering()).getChannelData(0);let peak=0,sum=0,last=0;
  for(let i=0;i<d.length;i++){const a=Math.abs(d[i]);if(a>peak)peak=a;sum+=d[i]*d[i];if(a>.002)last=i;}
  return {name,peak,rms:Math.sqrt(sum/Math.max(1,last)),seconds:last/rate};
 }
 const stats={played:0,requested:[]};
 // Wake the audio up on the first touch, since browsers keep sound off until someone taps.
 ['pointerdown','keydown','touchend'].forEach(e=>addEventListener(e,()=>{armed=true;if(AudioCtx)unlock();},{passive:true,capture:true}));
 window.SoundFX={play,unlock,render,names,stats,get supported(){return Boolean(AudioCtx);},get state(){return ctx?ctx.state:'none';}};
})();
