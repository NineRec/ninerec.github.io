/* Pictures for the ice cream shop: scoops that stack, a cone and a cup, three toppings,
 * tubs to scoop from, and a little service bell. Drawn in the same soft paint box as the animals. */
(() => {
 'use strict';
 const {path:P,line:L,ellipse:E,circle:C,svg:S,joint:J}=StoryPaint;
 const art=window.AdventureArt;

 // Each flavour has a clear colour AND its own speckle, so it can be told apart without colour alone.
 const FLAVORS={
  vanilla:{name:'Vanilla',main:'#f9ecc4',shade:'#ead493',chip:'#b4915f',kind:'speck'},
  chocolate:{name:'Chocolate',main:'#8d5b45',shade:'#6c4333',chip:'#47291f',kind:'chip'},
  strawberry:{name:'Strawberry',main:'#f4a8b8',shade:'#e17f99',chip:'#d4566f',kind:'bits'},
  mint:{name:'Mint',main:'#b1e5d0',shade:'#82cbae',chip:'#5a3a2a',kind:'chip'},
  blueberry:{name:'Blueberry',main:'#aab5ee',shade:'#8591d6',chip:'#4857ad',kind:'bits'},
  mango:{name:'Mango',main:'#fcc965',shade:'#efa63a',chip:'#e1862a',kind:'swirl'}
 };
 const TOPPINGS=['cherry','sprinkles','wafer'];
 const SPRINKLE_COLORS=['#e8586f','#f6c84c','#5aa9d6','#78b868','#b98ad6','#ffffff'];

 // Where things sit on the 200-wide build canvas. The cone rim is at y=130; scoops stack upward from there.
 const CX=100,FIRST=128,STEP=50,FLOOR=356;
 const scoopY=i=>FIRST-STEP*i;
 const topOf=(n,topping)=>scoopY(Math.max(0,n-1))-58-(topping==='wafer'?54:topping==='cherry'?36:6);

 // One scoop, centred on 0,0: a dome, a ruffled skirt and a few flecks.
 const flecks=f=>{
  if(f.kind==='speck')return [[-30,-14],[-14,-36],[8,-42],[26,-26],[34,-8],[-6,-18],[14,-10],[-34,-30]].map(([x,y])=>C(x,y,2,f.chip,'opacity=".75"')).join('');
  if(f.kind==='chip')return [[-30,-18,20],[-8,-38,-30],[18,-34,40],[30,-14,-20],[-2,-18,60],[-20,-4,-10]].map(([x,y,r])=>`<rect x="${x-5}" y="${y-3}" width="10" height="6" rx="2.4" transform="rotate(${r} ${x} ${y})" fill="${f.chip}"/>`).join('');
  if(f.kind==='bits')return [[-28,-18],[-6,-40],[20,-30],[32,-8],[2,-16],[-18,-6]].map(([x,y])=>C(x,y,4.6,f.chip,'opacity=".85"')+C(x-1.3,y-1.4,1.4,'#ffffff','opacity=".5"')).join('');
  return L('M-36 -14Q-18 -32 2 -20T38 -24',f.shade,4.5,'opacity=".75"')+L('M-24 -36Q-4 -48 18 -38',f.shade,3.5,'opacity=".7"')+L('M-30 -2Q-8 -14 16 -4',f.shade,3.5,'opacity=".6"');
 };
 const scoop=name=>{
  const f=FLAVORS[name];
  return P('M-50 8C-58 -32 -30 -58 0 -58S58 -32 50 8Z',f.main)+
   flecks(f)+
   P('M-56 6C-58 18 -48 27 -40 17C-34 29 -20 29 -14 17C-8 29 8 29 14 17C20 29 34 29 40 17C48 27 58 18 56 6C30 -6 -30 -6 -56 6Z',f.shade)+
   E(-21,-34,12,7,'#ffffff','opacity=".38" transform="rotate(-28 -21 -34)"');
 };

 // The cone and the cup both open at y=130 so a scoop sits on either.
 const cone=()=>{
  const left=y=>34+66*(y-142)/204,right=y=>166-66*(y-142)/204;
  const grid=[];
  for(let y=150;y<=300;y+=48){grid.push(`M${left(y).toFixed(1)} ${y}L${right(y+52).toFixed(1)} ${y+52}`);grid.push(`M${right(y).toFixed(1)} ${y}L${left(y+52).toFixed(1)} ${y+52}`);}
  return `<g class="ic-holder ic-cone">${P('M34 142H166L100 348Z','#e5af68')}${L(grid.join(''),'#c98c47',3,'opacity=".75"')}${P('M26 134Q26 128 33 128H167Q174 128 174 134V140Q174 152 164 152H36Q26 152 26 140Z','#d99a4f')}${L('M38 139H162','#f1c98c',4,'opacity=".7"')}</g>`;
 };
 const cup=()=>`<g class="ic-holder ic-cup">${P('M42 148H158L143 334Q142 346 130 346H70Q58 346 57 334Z','#fbf0d6')}${P('M50 148H72L82 346H68Q58 346 57 334Z','#f3b3ba')}${P('M96 148H118L116 346H98Z','#f3b3ba')}${P('M142 148H152L143 334Q142 342 136 345Z','#f3b3ba')}${P('M34 134Q34 128 41 128H159Q166 128 166 134V142Q166 152 156 152H44Q34 152 34 142Z','#e58f9c')}${L('M46 139H154','#f8c9cf',4,'opacity=".7"')}</g>`;
 const holder=kind=>kind==='cup'?cup():cone();

 const topping=(name,cy)=>{
  const top=cy-56;
  if(name==='cherry')return `<g class="ic-topping ic-cherry">${L(`M${CX} ${top-4}Q${CX+4} ${top-24} ${CX+20} ${top-32}`,'#6d8a3e',3.5)}${C(CX,top-2,16,'#d63f52')}${C(CX-5,top-8,4.6,'#ffffff','opacity=".5"')}</g>`;
  if(name==='wafer')return `<g class="ic-topping ic-wafer" transform="translate(${CX+26} ${cy-34}) rotate(24)">${P('M-10 -78H10V16Q10 22 4 22H-4Q-10 22 -10 16Z','#ebc680')}${L('M-10 -58H10M-10 -38H10M-10 -18H10M-10 2H10','#c99a52',2.4,'opacity=".75"')}${L('M-4 -76V18','#fbe3b0',2.6,'opacity=".6"')}</g>`;
  const dots=[[-34,-14,30],[-18,-40,-20],[2,-46,70],[22,-36,10],[34,-18,-50],[-26,-30,-60],[10,-24,40],[-8,-16,-20],[28,-4,60],[-36,2,0],[18,-12,-40],[-4,-34,30]];
  return `<g class="ic-topping ic-sprinkles" transform="translate(${CX} ${cy})">${dots.map(([x,y,r],i)=>`<rect x="${x-5.5}" y="${y-1.9}" width="11" height="3.8" rx="1.9" transform="rotate(${r} ${x} ${y})" fill="${SPRINKLE_COLORS[i%SPRINKLE_COLORS.length]}"/>`).join('')}</g>`;
 };

 // A whole picture of an order (or of what has been built so far).
 const view=(n,top)=>`0 ${top-6} 200 ${FLOOR-top+6}`;
 function render(order,{full=false}={}){
  const n=order.scoops.length,top=full?-100:topOf(n,order.topping);
  const scoops=order.scoops.map((f,i)=>`<g transform="translate(${CX} ${scoopY(i)})">${scoop(f)}</g>`).join('');
  const t=order.topping?topping(order.topping,scoopY(Math.max(0,n-1))):'';
  return S(holder(order.holder||'cone')+scoops+t,full?`0 -100 200 ${FLOOR+100}`:view(n,top));
 }

 // A tub of ice cream to scoop from.
 const tub=name=>{
  const f=FLAVORS[name],band=(()=>{const k=f.kind;return `<g transform="translate(70 92) scale(.64)">${flecks({...f,kind:k})}</g>`;})();
  return S(
   E(70,38,60,15,'#dcd2b6')+
   `<g transform="translate(70 36) scale(.72)">${scoop(name)}</g>`+
   P('M10 38C10 56 130 56 130 38L120 112Q119 122 109 122H31Q21 122 20 112Z','#fffdf4')+
   P('M14 70C40 82 100 82 126 70L120 112Q119 122 109 122H31Q21 122 20 112Z',f.main)+band+
   L('M10 38C10 56 130 56 130 38','#d5caac',4.5)+
   L('M22 100H118','#ffffff',3,'opacity=".25"'),'0 -16 140 144');
 };

 // Jars for the three toppings.
 const jar=name=>{
  const glass=P('M20 34H80V102Q80 114 68 114H32Q20 114 20 102Z','#eef7f4','opacity=".7"'),edge=L('M20 34H80V102Q80 114 68 114H32Q20 114 20 102Z','#b7d3cf',3.5)+L('M28 44V96','#ffffff',3,'opacity=".7"');
  const lid=P('M15 20Q15 16 19 16H81Q85 16 85 20V34H15Z','#d9a066')+L('M22 26H78','#efc58f',3,'opacity=".7"');
  const inside={
   cherry:[[38,96],[60,98],[48,80],[66,78]].map(([x,y])=>L(`M${x} ${y-13}Q${x+3} ${y-22} ${x+10} ${y-26}`,'#6d8a3e',2.4)+C(x,y,11,'#d63f52')+C(x-3,y-4,3,'#ffffff','opacity=".5"')).join(''),
   sprinkles:Array.from({length:30},(_,i)=>{const x=28+((i*37)%44),y=62+((i*23)%44);return `<rect x="${x-4.5}" y="${y-1.5}" width="9" height="3" rx="1.5" transform="rotate(${(i*47)%180} ${x} ${y})" fill="${SPRINKLE_COLORS[i%SPRINKLE_COLORS.length]}"/>`;}).join(''),
   wafer:[[34,6],[46,-5],[57,7],[67,-4]].map(([x,r],i)=>`<g transform="translate(${x} 104) rotate(${i%2?8:-8})">${P('M-6 -66H6V0H-6Z','#ebc680')}${L('M-6 -48H6M-6 -30H6M-6 -12H6','#c99a52',2,'opacity=".7"')}</g>`).join('')
  }[name];
  return S(glass+inside+edge+lid,'0 0 100 120');
 };

 const holderTile=kind=>S(holder(kind),'14 118 172 240');

 const bell=()=>S(
  E(60,77,52,10,'#caa05a')+E(60,73,48,8,'#e2bd78')+
  J('toy-moving',60,72,P('M18 72C18 40 36 26 60 26S102 40 102 72Z','#ecc874')+P('M18 72C30 66 90 66 102 72Z','#d9ad5c')+E(40,46,6,14,'#ffffff','opacity=".42" transform="rotate(24 40 46)"')+C(60,22,7.5,'#d9a84a')+L('M60 14V9','#d9a84a',4)),
  '0 0 120 90');

 const sundae=()=>S(
  J('toy-moving',100,300,P('M44 150H156L142 304Q141 316 129 316H71Q59 316 58 304Z','#fbf0d6')+P('M52 150H72L82 316H70Q59 316 58 304Z','#f3b3ba')+P('M96 150H116L114 316H98Z','#f3b3ba')+
   `<g transform="translate(${CX} 118)">${scoop('strawberry')}</g><g transform="translate(${CX} 78)">${scoop('vanilla')}</g>`+topping('cherry',78)+
   P('M34 134Q34 128 41 128H159Q166 128 166 134V142Q166 152 156 152H44Q34 152 34 142Z','#e58f9c')),'0 -10 200 340');

 const api={flavors:FLAVORS,flavorIds:Object.keys(FLAVORS),toppings:TOPPINGS,scoop,holder,topping,render,tub,jar,holderTile,bell,sundae,scoopY,topOf,view,CX,FIRST,STEP,FLOOR};
 art.iceCream=api;
 // Show a few in the material gallery too.
 Object.assign(art.playthings,{sundae:sundae(),icetub:tub('strawberry'),shopbell:bell()});
 art.puzzleNames={...art.puzzleNames,sundae:'圣代',icetub:'冰淇淋桶',shopbell:'服务铃'};
})();
