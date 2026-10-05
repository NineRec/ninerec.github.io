/* Painted maps for the two exploring games.
 * Zoo: a Singapore-Zoo-inspired park. One entrance at the bottom, a looping park path with spurs, themed zones
 *      (Elephants of Asia, Australasia, Primate Kingdom, Frozen Tundra, Reptile Garden, Fragile Forest, KidzWorld,
 *      Wild Africa), a lake and ponds.
 * Sea: depth bands and habitats instead of a grid: sunny surface, coral reef, open ocean, kelp forest, twilight deep and seabed.
 * Everything is static SVG sized to the same pixel size as the panorama, so text never stretches. */
(() => {
 'use strict';
 const random=seed=>()=>(seed=(seed*1664525+1013904223)>>>0)/4294967296;
 const n=v=>Math.round(v*10)/10;
 const FONT='ui-rounded,"SF Pro Rounded","Nunito",system-ui,sans-serif';
 // A smooth curve through the points (quadratic curves between mid-points).
 function smooth(points,closed=false){
  if(points.length<3)return `M${points.map(p=>p.join(' ')).join('L')}`;
  const mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];
  if(closed){
   const m0=mid(points[points.length-1],points[0]);let d=`M${n(m0[0])} ${n(m0[1])}`;
   points.forEach((p,i)=>{const m=mid(p,points[(i+1)%points.length]);d+=`Q${p[0]} ${p[1]} ${n(m[0])} ${n(m[1])}`;});
   return d+'Z';
  }
  let d=`M${points[0][0]} ${points[0][1]}`;
  for(let i=1;i<points.length-1;i++){const m=mid(points[i],points[i+1]);d+=`Q${points[i][0]} ${points[i][1]} ${n(m[0])} ${n(m[1])}`;}
  const last=points[points.length-1];return d+`L${last[0]} ${last[1]}`;
 }
 function segments(points,closed){
  const out=[];for(let i=0;i<points.length-1;i++)out.push([points[i],points[i+1]]);
  if(closed)out.push([points[points.length-1],points[0]]);return out;
 }
 function distance(px,py,segs){
  let best=1e9;
  for(const [[ax,ay],[bx,by]] of segs){
   const dx=bx-ax,dy=by-ay,t=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/(dx*dx+dy*dy||1)));
   best=Math.min(best,Math.hypot(px-(ax+t*dx),py-(ay+t*dy)));
  }
  return best;
 }
 const sign=(x,y,text,tone='#c89f67')=>{
  const w=text.length*17+54;
  return `<g transform="translate(${x} ${y})"><path d="M${-w/2+16} 24v34M${w/2-16} 24v34" stroke="#8a6a44" stroke-width="9" stroke-linecap="round"/><rect x="${-w/2}" y="-27" width="${w}" height="54" rx="15" fill="${tone}" stroke="#8d6c43" stroke-width="4"/><rect x="${-w/2+6}" y="-21" width="${w-12}" height="42" rx="10" fill="none" stroke="#e8cf9d" stroke-width="2" opacity=".8"/><text y="9" text-anchor="middle" font-family='${FONT}' font-weight="800" font-size="25" letter-spacing="1.5" fill="#fff8e4">${text}</text></g>`;
 };

 /* ---------- zoo ---------- */
 const zooPaths={
  ring:[[1600,1590],[1300,1560],[1130,1400],[1090,1130],[1120,880],[1250,740],[1600,720],[1980,740],[2110,900],[2150,1200],[2020,1450],[1800,1560]],
  spurs:[
   [[1600,2200],[1600,1600]],
   [[1250,740],[1050,700],[850,650],[840,540],[800,470],[520,440],[520,120]],
   [[520,440],[300,500],[130,540],[120,1000],[120,1500],[130,1700],[250,1770],[470,1830],[790,1790]],
   [[1090,1130],[980,1190],[700,1200],[480,1215],[485,1480]],
   [[1130,1400],[1000,1470],[800,1560],[780,1760]],
   [[1250,740],[1130,640],[1120,420],[1180,250],[1380,215]],
   [[1980,740],[2060,600],[2100,400],[2000,260],[1800,200]],
   [[2110,900],[2230,860],[2330,870]],
   [[2150,1200],[2260,1330],[2560,1500],[2700,1500]],
   [[1800,1560],[1900,1680],[2050,1740],[2300,1790]]
  ]
 };
 const zooSegments=segments(zooPaths.ring,true).concat(...zooPaths.spurs.map(s=>segments(s,false)));
 const treeKinds={
  round:(x,y,s,c)=>`<g transform="translate(${x} ${y}) scale(${s})"><rect x="-5" y="-6" width="10" height="46" rx="4" fill="#9b7a52"/><ellipse cx="0" cy="-26" rx="46" ry="38" fill="${c}"/><ellipse cx="18" cy="-18" rx="30" ry="24" fill="#fff" opacity=".1"/></g>`,
  pine:(x,y,s,c)=>`<g transform="translate(${x} ${y}) scale(${s})"><rect x="-4" y="10" width="8" height="30" fill="#8d6e4c"/><path d="M0-58L30-4H-30Z" fill="${c}"/><path d="M0-34L40 22H-40Z" fill="${c}"/></g>`,
  snowpine:(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})"><rect x="-4" y="10" width="8" height="30" fill="#8d6e4c"/><path d="M0-58L30-4H-30Z" fill="#8db9a2"/><path d="M0-34L40 22H-40Z" fill="#8db9a2"/><path d="M0-58L11-38Q0-33-11-38ZM-12-20Q0-14 12-20L22 0Q0 8-22 0ZM-28 12Q0 22 28 12L36 24Q0 36-36 24Z" fill="#fff" opacity=".9"/></g>`,
  palm:(x,y,s,c)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 40Q-6-10 4-50" stroke="#a88256" stroke-width="10" fill="none" stroke-linecap="round"/><g fill="${c}"><path d="M4-50Q-30-72-58-52Q-28-52 4-50ZM4-50Q34-76 62-54Q32-52 4-50ZM4-50Q-8-84-34-92Q-14-70 4-50ZM4-50Q18-86 46-90Q26-68 4-50Z"/></g></g>`,
  acacia:(x,y,s,c)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 40Q-2 0 4-24M4-24Q-14-36-28-42M4-24Q20-34 34-44" stroke="#8d6a46" stroke-width="8" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="-48" rx="62" ry="17" fill="${c}"/><ellipse cx="-30" cy="-56" rx="38" ry="12" fill="${c}"/><ellipse cx="36" cy="-56" rx="36" ry="11" fill="${c}"/></g>`,
  gum:(x,y,s,c)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 40Q-4-6 2-40" stroke="#c9bfa8" stroke-width="8" fill="none" stroke-linecap="round"/><ellipse cx="-16" cy="-44" rx="30" ry="12" fill="${c}" transform="rotate(-24 -16 -44)"/><ellipse cx="22" cy="-50" rx="32" ry="12" fill="${c}" transform="rotate(20 22 -50)"/><ellipse cx="2" cy="-64" rx="26" ry="11" fill="${c}"/></g>`,
  blossom:(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})"><rect x="-5" y="-6" width="10" height="46" rx="4" fill="#a07e58"/><ellipse cx="0" cy="-26" rx="44" ry="36" fill="#f3c6cc"/><circle cx="-16" cy="-30" r="6" fill="#fbe6ea"/><circle cx="14" cy="-18" r="5" fill="#fbe6ea"/><circle cx="6" cy="-42" r="5" fill="#fbe6ea"/></g>`,
  bush:(x,y,s,c)=>`<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="-18" cy="0" rx="26" ry="18" fill="${c}"/><ellipse cx="16" cy="-4" rx="28" ry="20" fill="${c}"/><ellipse cx="0" cy="-10" rx="22" ry="16" fill="${c}" opacity=".85"/></g>`
 };
 const zoneStyle={
  'Entrance Plaza':{trees:['round','bush'],colors:['#94b878','#a3c382'],count:0},
  'Elephants of Asia':{trees:['round','bush'],colors:['#7fae6c','#92bb73'],count:16},
  'Australasia':{trees:['gum','bush'],colors:['#8fb08a','#a2bd8d'],count:12},
  'Primate Kingdom':{trees:['round','round','bush'],colors:['#6c9d63','#7fae6c','#5f9158'],count:26},
  'Frozen Tundra':{trees:['snowpine'],colors:[],count:14},
  'Reptile Garden':{trees:['palm','bush'],colors:['#6fa56a','#8bb86c'],count:14},
  'Fragile Forest':{trees:['round','pine','round'],colors:['#6a9f63','#5b9060','#7aae68'],count:34},
  'KidzWorld':{trees:['blossom','round'],colors:['#8fc17a'],count:14},
  'Wild Africa':{trees:['acacia','bush'],colors:['#a5ad61','#b5b86d'],count:14}
 };
 function zooMap(catalog,size){
  const {width:W,height:H}=size,rnd=random(37),animals=catalog.zoo;
  const boxes=animals.map(a=>[a.x-a.width/2-26,a.y-26,a.x+a.width/2+26,a.y+a.h+78]);
  const signs=[
   ['ENTRANCE PLAZA',1600,1880],['ELEPHANTS OF ASIA',560,1485],['AUSTRALASIA',420,1100],['PRIMATE KINGDOM',640,505],['FROZEN TUNDRA',520,70],['REPTILE GARDEN',1500,88],
   ['FRAGILE FOREST',1900,840],['KIDZWORLD',2480,425],['WILD AFRICA',2700,1195]
  ];
  const signBoxes=signs.map(([t,x,y])=>[x-(t.length*17+54)/2-14,y-40,x+(t.length*17+54)/2+14,y+66]);
  const inBox=(x,y,pad=0)=>boxes.some(([a,b,c,d])=>x>a-pad&&x<c+pad&&y>b-pad&&y<d+pad)||signBoxes.some(([a,b,c,d])=>x>a&&x<c&&y>b&&y<d);
  const zones=[
   ['Frozen Tundra',520,300,540,320,'#e6f2f3'],['Reptile Garden',1610,370,560,290,'#ecdfb7'],['Primate Kingdom',610,810,540,400,'#bcd39a'],
   ['Fragile Forest',1640,1010,560,400,'#aec88b'],['Australasia',440,1290,430,230,'#eccfa3'],['Elephants of Asia',580,1790,560,340,'#d0dca8'],
   ['KidzWorld',2690,780,540,400,'#f6e3bd'],['Wild Africa',2650,1430,620,420,'#edde9f']
  ];
  let svg=`<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true" focusable="false"><defs><linearGradient id="zoo-ground" x2="0" y2="1"><stop stop-color="#e8efcf"/><stop offset="1" stop-color="#d4e0b3"/></linearGradient><linearGradient id="zoo-water" x2="1" y2="1"><stop stop-color="#b7dce0"/><stop offset="1" stop-color="#86bcc6"/></linearGradient></defs>`;
  svg+=`<rect width="${W}" height="${H}" fill="#9fba7f"/>`;
  svg+=`<path d="M170 70Q1600-20 3010 70Q3150 600 3130 1200Q3150 1800 3010 2190Q1600 2270 170 2190Q50 1600 70 1100Q50 600 170 70Z" fill="url(#zoo-ground)"/>`;
  // outer woods
  for(let i=0;i<150;i++){
   const t=rnd(),side=Math.floor(rnd()*4);let x,y;
   if(side===0){x=100+t*W*0.94;y=20+rnd()*70;}else if(side===1){x=100+t*W*0.94;y=H-110+rnd()*90;}else if(side===2){x=20+rnd()*80;y=100+t*(H-200);}else{x=W-100+rnd()*80;y=100+t*(H-200);}
   if(x>2240&&y<460)continue;
   svg+=treeKinds[rnd()<.35?'pine':'round'](n(x),n(y),n(.8+rnd()*.5),['#6f9c61','#5f8f5a','#7aa968'][Math.floor(rnd()*3)]);
  }
  // themed ground
  svg+=zones.map(([,x,y,rx,ry,fill])=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}"/><ellipse cx="${x}" cy="${y}" rx="${rx-26}" ry="${ry-22}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="3" stroke-dasharray="3 16" stroke-linecap="round"/>`).join('');
  // entrance plaza, lake, ponds
  svg+=`<ellipse cx="1600" cy="2030" rx="440" ry="170" fill="#efe6c8"/><ellipse cx="1600" cy="2030" rx="410" ry="148" fill="none" stroke="#fffaf0" stroke-opacity=".6" stroke-width="4" stroke-dasharray="2 14" stroke-linecap="round"/>`;
  svg+=`<path d="M2230 -20H3220V380C3100 430 3000 350 2860 392C2720 436 2590 380 2480 300C2380 230 2300 120 2230 -20Z" fill="#c4e1e1"/><path d="M2270 -20H3220V330C3100 380 3000 300 2860 342C2720 386 2610 330 2510 252C2420 184 2340 100 2270 -20Z" fill="url(#zoo-water)"/>`;
  svg+=`<g fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="4" stroke-linecap="round"><path d="M2650 110q30-14 60 0t60 0M2900 190q30-14 60 0t60 0M2500 60q30-14 60 0"/></g>`;
  svg+=`<text x="2850" y="262" font-family='${FONT}' font-weight="800" font-size="30" fill="#fff" fill-opacity=".85" text-anchor="middle" letter-spacing="3">THE LAKE</text>`;
  svg+=`<g transform="translate(2420 200)"><path d="M-48 0H48L34 24H-34Z" fill="#d1936b"/><path d="M0-62V0" stroke="#8d6c43" stroke-width="5"/><path d="M0-58L34-6H0Z" fill="#fff8e4"/></g>`;
  svg+=`<ellipse cx="2110" cy="2030" rx="360" ry="120" fill="#c4e1e1"/><ellipse cx="2110" cy="2030" rx="334" ry="98" fill="url(#zoo-water)"/>`;
  svg+=`<ellipse cx="1000" cy="2110" rx="190" ry="60" fill="#c4e1e1"/><ellipse cx="1000" cy="2110" rx="168" ry="44" fill="url(#zoo-water)"/>`;
  svg+=`<ellipse cx="300" cy="320" rx="150" ry="60" fill="#d4ebf0"/><ellipse cx="300" cy="320" rx="126" ry="42" fill="#bfe0ea"/>`;
  svg+=`<ellipse cx="1540" cy="430" rx="0" ry="0" fill="none"/>`;
  svg+=`<ellipse cx="640" cy="1960" rx="170" ry="62" fill="#b79b78" opacity=".55"/><ellipse cx="640" cy="1956" rx="146" ry="46" fill="#a98a69" opacity=".7"/>`;
  // paths: soft edge, sand body and a white centre dash
  const ringPath=smooth(zooPaths.ring,true),spurPaths=zooPaths.spurs.map(s=>smooth(s));
  const strokeAll=(w,color,extra='')=>`<g fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}><path d="${ringPath}"/>${spurPaths.map(d=>`<path d="${d}"/>`).join('')}</g>`;
  svg+=strokeAll(78,'#d8c690')+strokeAll(62,'#f1e5bd')+strokeAll(3,'#fffaf0','stroke-dasharray="4 20" opacity=".85"');
  // tram line along the ring path with sleepers
  svg+=`<g fill="none" stroke-linecap="round"><path d="${ringPath}" stroke="#a7a38f" stroke-width="10" opacity=".35" transform="translate(0 0)"/></g>`;
  for(const [x,y] of [[1300,1560],[1090,1130],[1600,720],[2150,1200]])svg+=`<g transform="translate(${x} ${y})"><rect x="-26" y="-24" width="52" height="48" rx="12" fill="#5f9bb0" stroke="#fff" stroke-width="4"/><rect x="-16" y="-14" width="32" height="16" rx="4" fill="#e9f6f7"/><circle cx="-9" cy="10" r="4" fill="#fff"/><circle cx="9" cy="10" r="4" fill="#fff"/></g>`;
  // themed scenery
  const tundra=`<g fill="#fff"><ellipse cx="260" cy="440" rx="120" ry="34"/><ellipse cx="780" cy="470" rx="100" ry="28"/><ellipse cx="170" cy="150" rx="90" ry="26"/></g><g fill="#c8e6ee"><path d="M380 360l30-46l36 40l-18 22Z"/><path d="M820 220l24-38l30 32l-14 20Z"/><path d="M240 250l20-30l26 28l-12 16Z"/></g>`;
  svg+=tundra;
  svg+=`<g transform="translate(1250 120)"><ellipse cx="0" cy="0" rx="160" ry="50" fill="#a9d1d8"/><ellipse cx="0" cy="0" rx="134" ry="36" fill="#8bbec9"/></g>`;
  svg+=`<g fill="#b8a078"><ellipse cx="1760" cy="300" rx="34" ry="20"/><ellipse cx="1500" cy="610" rx="26" ry="16"/><ellipse cx="1250" cy="520" rx="28" ry="17"/></g><g fill="#a48d68"><ellipse cx="1752" cy="296" rx="22" ry="11"/></g>`;
  svg+=`<g transform="translate(2440 740)"><rect x="-70" y="-46" width="140" height="92" rx="6" fill="#c9786c"/><path d="M-84-44L0-104L84-44Z" fill="#8f5a4c"/><rect x="-22" y="-8" width="44" height="54" rx="4" fill="#f7efd7"/><path d="M-22 4H22M0-8V46" stroke="#c9786c" stroke-width="3"/></g>`;
  svg+=`<g transform="translate(3030 1000)" fill="none" stroke="#fff3d1" stroke-width="7" stroke-linecap="round"><path d="M-60 0H60M-60 22H60M-50-14V36M0-14V36M50-14V36"/></g>`;
  svg+=`<g transform="translate(2900 560)"><circle r="46" fill="#f7d2da"/><path d="M0-46V-96L34-82L0-70" fill="#e98fa0"/><circle cx="-26" cy="-20" r="8" fill="#fff"/><circle cx="26" cy="-20" r="8" fill="#fff"/><circle cx="0" cy="16" r="8" fill="#fff"/><path d="M-60 46H60" stroke="#c98a9a" stroke-width="8" stroke-linecap="round"/></g>`;
  // Entrance gate
  svg+=`<g transform="translate(1600 2190)"><rect x="-190" y="-110" width="38" height="120" rx="8" fill="#b4895f"/><rect x="152" y="-110" width="38" height="120" rx="8" fill="#b4895f"/><path d="M-210-100Q0-170 210-100V-70Q0-140-210-70Z" fill="#c89f67" stroke="#8d6c43" stroke-width="4"/><text y="-102" text-anchor="middle" font-family='${FONT}' font-weight="800" font-size="30" fill="#fff8e4" letter-spacing="3" transform="rotate(0)">WELCOME!</text><g fill="#efd9a0"><rect x="-300" y="-46" width="76" height="56" rx="8"/><rect x="224" y="-46" width="76" height="56" rx="8"/></g><path d="M-310-46L-262-82L-214-46Z M214-46L262-82L310-46Z" fill="#a8765c"/></g>`;
  // fountain
  svg+=`<g transform="translate(1600 2030)"><ellipse rx="64" ry="24" fill="#a9d6de"/><ellipse rx="48" ry="16" fill="#cdebf0"/><path d="M0 0V-44" stroke="#8cc3cd" stroke-width="8" stroke-linecap="round"/><path d="M-26-30Q0-62 26-30" stroke="#d8f2f5" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;
  // flower beds on the plaza
  for(let i=0;i<14;i++){const x=1250+i*53,y=2160+Math.sin(i)*8;svg+=`<circle cx="${x}" cy="${y}" r="9" fill="${['#f2a7b4','#f6d27a','#fff1c9'][i%3]}"/>`;}
  // scattered trees by zone
  const draw=[];
  for(const [zone,cx,cy,rx,ry] of zones.map(z=>[z[0],z[1],z[2],z[3],z[4]])){
   const style=zoneStyle[zone];let placed=0,tries=0;
   while(placed<style.count&&tries++<400){
    const a=rnd()*Math.PI*2,r=Math.sqrt(rnd()),x=cx+Math.cos(a)*(rx-40)*r,y=cy+Math.sin(a)*(ry-30)*r;
    if(inBox(x,y,18)||distance(x,y,zooSegments)<70||(zone==='Reptile Garden'&&x>1100&&x<1400&&y<170))continue;
    if(x>2230&&y<420)continue;
    const kind=style.trees[Math.floor(rnd()*style.trees.length)],color=style.colors.length?style.colors[Math.floor(rnd()*style.colors.length)]:'#8db9a2';
    draw.push([y,treeKinds[kind](n(x),n(y),n(.78+rnd()*.5),color)]);placed++;
   }
  }
  draw.sort((a,b)=>a[0]-b[0]);svg+=draw.map(d=>d[1]).join('');
  // small bushes along the paths
  for(let i=0;i<70;i++){
   const x=120+rnd()*(W-240),y=200+rnd()*(H-400);
   if(inBox(x,y,14)||distance(x,y,zooSegments)<52||(x>2240&&y<480)||distance(x,y,zooSegments)>170)continue;
   svg+=treeKinds.bush(n(x),n(y),n(.45+rnd()*.35),['#86b36f','#92be78','#78a866'][i%3]);
  }
  svg+=signs.map(([t,x,y])=>sign(x,y,t)).join('');
  return svg+'</svg>';
 }

 /* ---------- sea ---------- */
 function seaMap(catalog,size){
  const {width:W,height:H}=size,rnd=random(91);
  const waterline=210,sandTop=1810;
  let svg=`<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true" focusable="false"><defs>
   <linearGradient id="sea-depth" x2="0" y2="1"><stop offset="0" stop-color="#bfe9e6"/><stop offset=".18" stop-color="#8fd0d6"/><stop offset=".45" stop-color="#58a6c2"/><stop offset=".75" stop-color="#357fa4"/><stop offset="1" stop-color="#2a6489"/></linearGradient>
   <linearGradient id="sea-sky" x2="0" y2="1"><stop stop-color="#f7f1d6"/><stop offset="1" stop-color="#d7eef0"/></linearGradient>
   <linearGradient id="sea-sand" x2="0" y2="1"><stop stop-color="#ead9a6"/><stop offset="1" stop-color="#cfb98a"/></linearGradient>
   <linearGradient id="sea-ray" x2="0" y2="1"><stop stop-color="#fff" stop-opacity=".34"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>`;
  svg+=`<rect width="${W}" height="${H}" fill="url(#sea-depth)"/><rect width="${W}" height="${waterline}" fill="url(#sea-sky)"/>`;
  svg+=`<circle cx="2050" cy="86" r="52" fill="#f8dc8c"/><circle cx="2050" cy="86" r="76" fill="#f8dc8c" opacity=".25"/>`;
  svg+=`<g fill="#fff" opacity=".9"><ellipse cx="620" cy="70" rx="90" ry="24"/><ellipse cx="680" cy="52" rx="60" ry="26"/><ellipse cx="1500" cy="110" rx="110" ry="26"/><ellipse cx="1570" cy="88" rx="64" ry="26"/><ellipse cx="2650" cy="60" rx="80" ry="22"/></g>`;
  svg+=`<path d="M0 ${waterline}q150-34 300 0t300 0t300 0t300 0t300 0t300 0t300 0t300 0t300 0t300 0V${waterline+30}H0Z" fill="#a8e0df"/><path d="M0 ${waterline+14}q150-24 300 0t300 0t300 0t300 0t300 0t300 0t300 0t300 0t300 0t300 0" stroke="#fff" stroke-opacity=".8" stroke-width="5" fill="none"/>`;
  // rays of sunlight
  svg+=Array.from({length:7},(_,i)=>`<path d="M${i*470-90} ${waterline}L${i*470+70} ${waterline}L${i*470+330} 1500L${i*470+90} 1500Z" fill="url(#sea-ray)" opacity=".5"/>`).join('');
  // darker twilight band
  svg+=`<rect y="1020" width="${W}" height="800" fill="#1d4f77" opacity=".16"/><rect y="1280" width="${W}" height="540" fill="#173f66" opacity=".16"/>`;
  // mermaid rock + surface buoy
  svg+=`<g transform="translate(1860 ${waterline-6})"><path d="M-110 20Q-90-50-30-60Q40-70 90-20Q110 0 120 20Z" fill="#9aa59f"/><path d="M-60 6Q-20-30 30-20" stroke="#bdc7bf" stroke-width="8" fill="none" stroke-linecap="round"/></g>`;
  svg+=`<g transform="translate(2300 ${waterline-4})"><path d="M-14-60L14-60L22 0H-22Z" fill="#e87b6e"/><rect x="-18" y="-14" width="36" height="12" fill="#fff" opacity=".9"/><circle cy="-70" r="9" fill="#f6dc7a"/></g>`;
  // coral reef (left)
  const coral=(x,y,s,c,kind)=>{
   if(kind==='fan')return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0V-30" stroke="${c}" stroke-width="10" stroke-linecap="round"/><path d="M0-30Q-60-50-52-130Q-20-100 0-90Q20-100 52-130Q60-50 0-30Z" fill="${c}" opacity=".9"/><path d="M0-30V-100M-20-40L-34-100M20-40L34-100" stroke="#fff" stroke-opacity=".35" stroke-width="3"/></g>`;
   if(kind==='tube')return `<g transform="translate(${x} ${y}) scale(${s})" fill="${c}"><rect x="-30" y="-110" width="20" height="110" rx="10"/><rect x="0" y="-150" width="22" height="150" rx="11"/><rect x="28" y="-90" width="20" height="90" rx="10"/><ellipse cx="-20" cy="-110" rx="10" ry="5" fill="#fff" opacity=".4"/><ellipse cx="11" cy="-150" rx="11" ry="5" fill="#fff" opacity=".4"/></g>`;
   if(kind==='brain')return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="-30" rx="64" ry="48" fill="${c}"/><path d="M-40-40q14-16 28 0t28 0t28 0M-46-22q16-14 32 0t32 0t30 0" stroke="#fff" stroke-opacity=".4" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;
   return `<g transform="translate(${x} ${y}) scale(${s})" stroke="${c}" stroke-width="12" stroke-linecap="round" fill="none"><path d="M0 0V-70M0-30L-34-80M0-46L30-100M0-70L-14-130M30-100L50-130M-34-80L-52-110"/></g>`;
  };
  const reef=[[110,1810,1.6,'#e56b8d','branch'],[230,1810,1.2,'#f4a259','fan'],[360,1810,1.4,'#9a7ac9','tube'],[520,1810,1.3,'#f0907a','brain'],[640,1810,1.7,'#e8b948','branch'],[790,1810,1.2,'#d9708f','fan'],[920,1810,1.5,'#7fb2d9','tube'],[1040,1810,1.1,'#f48b6d','brain'],[160,1810,.9,'#8ed1b0','branch'],[700,1810,.9,'#ffb86b','tube']];
  svg+=reef.map(r=>coral(...r)).join('');
  // kelp forest (right)
  for(let i=0;i<22;i++){
   const x=2250+i*34+rnd()*14,h=520+rnd()*620,top=sandTop-h,sway=18+rnd()*18;
   svg+=`<path d="M${n(x)} ${sandTop+14}C${n(x-sway)} ${sandTop-h*.3} ${n(x+sway)} ${sandTop-h*.62} ${n(x-sway*.4)} ${n(top)}" fill="none" stroke="${['#4f9a6a','#5aa874','#3f8a62'][i%3]}" stroke-width="${12+rnd()*8}" stroke-linecap="round" opacity=".92"/>`;
   for(let k=1;k<5;k++){const y=sandTop-h*k/5,ox=(k%2?1:-1);svg+=`<ellipse cx="${n(x+ox*16)}" cy="${n(y)}" rx="22" ry="8" fill="#5aa874" transform="rotate(${ox*-32} ${n(x+ox*16)} ${n(y)})" opacity=".9"/>`;}
  }
  // shipwreck
  svg+=`<g transform="translate(2640 1700) rotate(-12)"><path d="M-220 0H230Q200 90 120 100H-130Q-190 90-220 0Z" fill="#8b6a4b"/><path d="M-210 14H214" stroke="#a07e5a" stroke-width="6"/><circle cx="-120" cy="44" r="14" fill="#33566a"/><circle cx="-60" cy="44" r="14" fill="#33566a"/><circle cx="0" cy="44" r="14" fill="#33566a"/><path d="M-30 0V-250" stroke="#7a5b3f" stroke-width="16" stroke-linecap="round"/><path d="M-26-240Q60-190 28-90L-26-90Z" fill="#e8dcc0" opacity=".85"/><path d="M80 0V-150" stroke="#7a5b3f" stroke-width="12" stroke-linecap="round"/></g>`;
  svg+=`<g transform="translate(2850 1790)"><rect x="-44" y="-34" width="88" height="48" rx="8" fill="#9a6a3f"/><path d="M-44-12H44" stroke="#e1b84f" stroke-width="6"/><rect x="-8" y="-20" width="16" height="16" rx="4" fill="#e1b84f"/><path d="M-44-34Q0-60 44-34Z" fill="#b57e4b"/></g>`;
  // rock arch in the deep
  svg+=`<g transform="translate(1180 1560)"><path d="M-150 250V80Q-140-60 0-70Q140-60 150 80V250H90V90Q80 20 0 16Q-80 20-90 90V250Z" fill="#46688a" opacity=".8"/><path d="M-120 250V90Q-114-30 0-40" stroke="#6e92b1" stroke-width="10" fill="none" opacity=".4"/></g>`;
  // sand
  svg+=`<path d="M0 ${sandTop}Q300 ${sandTop-50} 700 ${sandTop-14}T1500 ${sandTop-26}T2300 ${sandTop-10}T3000 ${sandTop-36}V${H}H0Z" fill="url(#sea-sand)"/>`;
  svg+=`<g fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="4" stroke-linecap="round">${Array.from({length:30},(_,i)=>`<path d="M${60+i*100} ${1870+(i%4)*38}q30-12 60 0t60 0"/>`).join('')}</g>`;
  svg+=Array.from({length:26},(_,i)=>{const x=40+rnd()*(W-80),y=1880+rnd()*100;return i%3?`<ellipse cx="${n(x)}" cy="${n(y)}" rx="${6+rnd()*6}" ry="4" fill="${['#f4d0c8','#fff0d0','#f3b9a8'][i%3]}"/>`:`<path d="M${n(x)} ${n(y)}l8-14l8 14Z" fill="#ec9c8c"/>`;}).join('');
  // seaweed on the seabed
  svg+=Array.from({length:16},(_,i)=>{const x=60+i*185+rnd()*40,h=110+rnd()*110;return `<path d="M${n(x)} ${sandTop+20}q-24-${n(h*.4)} 0-${n(h*.5)}t0-${n(h*.5)}" fill="none" stroke="${['#6eb184','#7fc293'][i%2]}" stroke-width="12" stroke-linecap="round" opacity=".85"/>`;}).join('');
  // bubbles and plankton
  svg+=`<g fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2.5">${Array.from({length:100},(_,i)=>`<circle cx="${n(30+rnd()*(W-60))}" cy="${n(300+rnd()*1450)}" r="${n(3+rnd()*9)}"/>`).join('')}</g>`;
  svg+=`<g fill="#fff" opacity=".35">${Array.from({length:90},(_,i)=>`<circle cx="${n(rnd()*W)}" cy="${n(1000+rnd()*760)}" r="${n(1.2+rnd()*2.2)}"/>`).join('')}</g>`;
  // floating zone boards
  const board=(x,y,text)=>{const w=text.length*17+52;return `<g transform="translate(${x} ${y})"><path d="M0 -26V-70" stroke="#fff" stroke-opacity=".7" stroke-width="3" stroke-dasharray="6 7"/><rect x="${-w/2}" y="-26" width="${w}" height="52" rx="26" fill="#fffbea" fill-opacity=".92" stroke="#7fb3b8" stroke-width="4"/><text y="9" text-anchor="middle" font-family='${FONT}' font-weight="800" font-size="24" letter-spacing="1.5" fill="#35656b">${text}</text></g>`;};
  svg+=[[560,400,'SUNNY SURFACE'],[390,540,'CORAL REEF'],[1700,470,'OPEN OCEAN'],[2650,1010,'KELP FOREST'],[1180,1170,'TWILIGHT DEEP'],[930,1860,'SANDY SEABED']].map(b=>board(...b)).join('');
  return svg+'</svg>';
 }

 window.WorldMaps={
  render(kind,catalog,size){return kind==='sea'?seaMap(catalog,size):zooMap(catalog,size);},
  zooPaths
 };
})();
