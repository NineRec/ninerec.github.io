/* Wooden toys, town props and pictorial controls from the same paint box. */
(() => {
 'use strict';
 const {path:P,line:L,ellipse:E,circle:C,svg:S,joint:J,eyes,smile,leaf,ink,cream,gold,green,mint,rose,brown,peach}=StoryPaint;
 const moving=body=>J('toy-moving',130,110,body);
 const petals=Array.from({length:8},(_,i)=>E(130,49,16,29,rose,`transform="rotate(${i*45} 130 80)"`)).join('');
 const flower=L('M130 188V80',green,9)+P('M130 151Q70 146 70 112Q114 109 130 151M130 168Q181 166 185 132Q144 128 130 168Z',green)+J('flower-petals',130,80,petals+C(130,80,24,gold)+eyes(121,77,18)+smile(123,90,14));
 const wheel=(x)=>C(x,173,23,'#61786b')+C(x,173,12,'#d6d5bb')+C(x,173,4,'#91a18a');
 const vehicle=(color,bus=false)=>S(moving(P(bus?'M30 53Q30 40 45 40H211Q230 40 230 60V174H30Z':'M30 119L68 65Q72 58 80 58H153Q162 58 168 68L200 112H222Q237 112 237 130V175H25V136Q25 120 30 119Z',color)+P(bus?'M46 60H214V114H46Z':'M77 72H108V110H54ZM120 72H148L179 110H120Z','#dce8d6')+L(bus?'M80 60V114M118 60V114M157 60V114M195 60V114':'M114 119V157',color,5)+L('M30 142H47M219 142H233',gold,7)+wheel(72)+wheel(188)));
 const car=vehicle('#cb957b'),bus=vehicle('#d7b467',true),van=vehicle('#95b49c',true);
 // The tulip grows in five readable steps: one leaf, two, three, every leaf, then the flower.
 const tulipGreen='#78ad63',tulipVein='#5a9150',tulipRed='#e4586f',tulipPink='#f28fa0',tulipDeep='#c93d5c';
 const tulipLeaf=(side,scale,tilt=0)=>`<g transform="translate(100 250) rotate(${tilt}) scale(${side*scale} ${scale}) translate(-100 -250)">${P('M100 250C80 210 50 188 28 112C70 142 98 186 100 250Z',tulipGreen)}${L('M99 244C84 206 62 170 38 128',tulipVein,2.4,'opacity=".7"')}</g>`;
 const tulipBloom=()=>J('toy-moving',100,250,L('M100 250V112',tulipGreen,9)+tulipLeaf(1,1)+tulipLeaf(-1,1)+tulipLeaf(1,.82,10)+tulipLeaf(-1,.82,-10)+
  J('flower-petals',100,110,P('M72 108C60 74 70 44 86 30C94 50 100 70 100 108Z',tulipPink)+P('M128 108C140 74 130 44 114 30C106 50 100 70 100 108Z',tulipPink)+P('M74 110C76 70 86 40 100 22C114 40 124 70 126 110C116 124 84 124 74 110Z',tulipRed)+P('M100 22C108 40 116 66 118 100C112 80 106 50 100 22Z',tulipDeep,'opacity=".35"')+
  eyes(88,84,24)+smile(90,98,20)+E(82,96,6,3.6,'#fff','opacity=".35"')+E(118,96,6,3.6,'#fff','opacity=".35"')));
 const tulipStage=stage=>{
  const body={
   0:'',
   1:L('M100 250V218',tulipGreen,8)+tulipLeaf(1,.5,10),
   2:L('M100 250V206',tulipGreen,8)+tulipLeaf(1,.62,4)+tulipLeaf(-1,.62,-4),
   3:L('M100 250V190',tulipGreen,9)+tulipLeaf(1,.8,6)+tulipLeaf(-1,.8,-6)+tulipLeaf(1,.56,-12),
   4:L('M100 250V108',tulipGreen,9)+tulipLeaf(1,1)+tulipLeaf(-1,1)+tulipLeaf(1,.82,10)+tulipLeaf(-1,.82,-10)+P('M82 112C78 82 88 52 100 36C112 52 122 82 118 112C110 124 90 124 82 112Z',tulipRed)+P('M82 112C82 100 92 98 100 112C108 98 118 100 118 112C112 124 90 124 82 112Z',tulipGreen)
  }[stage];
  return `<svg viewBox="0 0 200 260" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" class="tulip tulip-${stage}">${stage===5?tulipBloom():body}</svg>`;
 };
 AdventureArt.playthings={
  spade:S(moving(L('M140 45V135',brown,12)+P('M117 15H163V37Q141 62 117 37Z','none','stroke="#ad8058" stroke-width="8"')+P('M105 125H177V160Q169 191 141 207Q110 190 105 160Z','#9bb5a4')+L('M115 137H166','#cbd8bc',4))),
  seed:S(L('M63 181Q130 162 198 181','#b59a70',7)+moving(P('M131 56C149 75 165 98 159 121Q153 153 128 151Q96 151 97 122C96 98 116 76 131 56Z','#ba9466')+L('M128 80Q114 104 114 127','#e7cca2',4))),
  soil:S(P('M20 169Q48 134 81 146Q111 95 147 140Q190 127 239 169V200H20Z','#b69a76')+E(68,178,9,5,'#967a5d')+E(131,156,8,4,'#967a5d')+E(192,181,7,4,'#967a5d')),
  water:S(moving(L('M60 108V70Q60 20 101 29Q140 38 131 75','#80a08d',9)+P('M50 80H158V174Q103 205 50 174Z','#a5c2ae')+P('M151 138L205 86L225 104L162 173Z','#a5c2ae')+L('M203 80L230 110','#80a08d',11)+L('M74 103V161','#c9dbbc',5))+J('water-drops',218,125,E(219,141,4,8,'#8bbdba')+E(238,159,4,8,'#8bbdba')+E(205,169,4,8,'#8bbdba'))),
  sun:S(moving(Array.from({length:12},(_,i)=>L('M130 19V38',gold,7,`transform="rotate(${i*30} 130 110)"`)).join('')+C(130,110,57,'#ecd083')+eyes(114,104,32)+smile(116,125,29)+E( 90,119,7,4,'#ddb073')+E(170,119,7,4,'#ddb073'))),
  flower:S(flower),car,
  signal:S(L('M130 161V207','#91a18a',10)+P('M105 13H156Q177 13 177 35V146Q177 169 156 169H105Q80 169 80 146V35Q80 13 105 13Z','#526f5d')+C(129,57,28,'#d58f7b','class="signal-red"')+C(129,125,28,'#abc48b','class="signal-green"')+`<g class="signal-red-person">${C(129,44,5,cream)+L('M129 50V75M117 62H141M129 75L120 85M129 75L138 85',cream,5)}</g><g class="signal-green-person">${C(129,111,5,cream)+L('M129 121L122 134L111 136M122 134L133 143L143 149M125 129L143 127M133 143L121 154',cream,5)}</g>`),
  envelope:S(P('M42 50H218Q232 50 232 64V174Q232 188 218 188H42Q28 188 28 174V64Q28 50 42 50Z','#efddb4')+L('M33 60L129 130L227 60M33 181L90 120M227 181L168 120','#bc9d6a',3)+P('M177 65H213V90H177Z','#a8bd91')+C(195, 77,6,cream)),
  numbers:S(P('M65 20H195Q214 20 214 42V180Q214 201 195 201H65Q45 201 45 180V42Q45 20 65 20Z','#f1dfad')+`<text x="130" y="159" font-family="Georgia" font-size="136" text-anchor="middle" fill="${ink}">3</text>`),
  icecream:S(P('M87 121H175L133 207Z','#c9a575')+L('M101 148L157 174M116 182L151 141','#edd0a1',3)+C(132, 80,44,'#d69e93')+P('M91 103Q111 130 132 114Q154 133 173 103Z','#d69e93')+L('M109 65Q114 52 129 49','#efc9b7',5)),
  nest:S(P('M38 122Q130 90 225 122Q209 192 130 191Q50 190 38 122Z','#b29770')+E(97,112,23,31,cream)+E(142,104,22,32,cream)+E(180,116,19,27,cream)+L('M40 132Q130 176 222 132M55 155Q130 191 206 154M70 177L182 138M60 135L166 181','#8f7c57',5)),
  umbrella:S(L('M129 80V177Q129 209 155 202Q167 197 165 182',brown,8)+moving(P('M20 116C29 49 70 14 130 14C196 14 236 55 240 116Q211 95 190 115Q161 92 130 115Q98 93 70 115Q45 95 20 116Z','#a5c4b4')+L('M130 15Q90 46 70 115M130 15Q174 40 190 115','#7caa94',3))),
  xylophone:S(L('M30 160L227 112',brown,10)+['#cd957a','#dfb76b','#a8bd8b','#94bbb0','#92a5b4'].map((c,i)=>P(`M${42+i*35} ${ 50+i*13}h28v${139-i*21}q-14 9-28 0Z`,c)+C(56+i*35,137,3,ink)).join('')+moving(L('M72 20L177 60',brown,6)+C(185,64,11,'#b39470'))),
  yoyo:S(L('M114 20Q67 101 132 122','#b7a17c',3)+moving(C(137,147,56,'#ca927b')+C(137,147, 43,'none','stroke="#edc59e" stroke-width="5"')+C(137,147,10,cream))),
  worm:S(P('M14 200Q64 152 130 178Q196 152 246 200V214H14Z','#b69a76')+E(70,198,9,4,'#967a5d')+E(190,200,8,4,'#967a5d')+
   moving(L('M96 204C62 160 124 150 128 110C132 74 98 68 116 46','#e9a3a5',31)+L('M96 204C62 160 124 150 128 110C132 74 98 68 116 46','#d27f86',29,'stroke-dasharray="2 15" opacity=".8"')+L('M112 126Q132 120 130 98','#f4c3c1',32,'opacity=".7"')+
   C(116,44,25,'#eeb0b0')+eyes(103,38,25)+smile(106,52,20)+E(94,50,6,3.6,rose,'opacity=".45"')+E(138,50,6,3.6,rose,'opacity=".45"'))),
  rain:S(moving(C(84,92,34,'#cfdbe2')+C(128,74,46,'#cfdbe2')+C(176,94,34,'#cfdbe2')+E(130,100,84,30,'#cfdbe2')+E(130,110,80,18,'#b9c9d3','opacity=".55"')+eyes(113,92,34)+smile(117,108,26)+E(103,106,8,4.5,rose,'opacity=".42"')+E(155,106,8,4.5,rose,'opacity=".42"'))+
   J('water-drops',130,140,[[78,150],[118,176],[160,152],[196,182],[96,200],[146,206]].map(([x,y])=>P(`M${x} ${y-9}C${x+7} ${y} ${x+7} ${y+6} ${x} ${y+8}C${x-7} ${y+6} ${x-7} ${y} ${x} ${y-9}Z`,'#7fb2d6')).join(''))),
  grandpa:S(L('M44 212L74 70',brown,9)+P('M52 78L96 60L102 76L62 98Z','#95a6aa')+
   moving(P('M62 220Q62 154 130 146Q198 154 198 220Z','#86a68f')+L('M130 146V220','#6e8f78',3)+P('M110 142H150L130 168Z',cream)+
   E(130,98,40,44,peach)+P('M92 100Q96 172 130 176Q164 172 168 100Q150 128 130 128Q110 128 92 100Z','#f6f3ea')+P('M108 112Q130 100 152 112Q130 124 108 112Z','#f6f3ea')+
   E(96,96,6,10,peach)+E(164,96,6,10,peach)+L('M104 82Q114 76 124 82M136 82Q146 76 156 82','#f2efe6',4)+L('M108 94q6-6 12 0M140 94q6-6 12 0',ink,2.6)+E(130,106,7,5.5,'#e8ae88')+L('M120 126q10 7 20 0',ink,2.4)+E(100,108,7,4,rose,'opacity=".4"')+E(160,108,7,4,rose,'opacity=".4"')+
   E(130,62,76,15,'#e3c27a')+P('M92 62Q94 16 130 14Q166 16 168 62Z','#efd592')+L('M93 55H167','#b9814f',7)+L('M100 36l60 0M104 26l52 0','#e0bd73',2.4,'opacity=".7"'))),
  tulip:S(tulipBloom(),'0 0 200 260')
 };
 AdventureArt.tulipStage=tulipStage;
 AdventureArt.vehicles={car,bus,van};
 AdventureArt.icons={
  check:S(L('M60 115L108 162L202 60',cream,18)),
  play:S(P('M90 40Q82 36 82 50V175Q82 188 94 181L204 123Q219 113 203 103Z',cream)),
  left:S(L('M198 174V90Q198 60 168 60H50M50 60L90 20M50 60L90 100',cream,16)),
  right:S(L('M62 174V90Q62 60 92 60H210M210 60L170 20M210 60L170 100',cream,16)),
  footsteps:S(E( 90, 80,17, 30,cream,'transform="rotate(-22 90 80)"')+C( 70, 40,5,cream)+C(82,34,5,cream)+C(96, 30,5,cream)+E(158,143,17, 30,cream,'transform="rotate(22 158 143)"')+C(151,101,5,cream)+C(164,103,5,cream)+C(176,110,5,cream)),
  hand:S(P('M90 102V50Q90 35 104 35Q117 35 117 50V91V30Q117 15 130 15Q143 15 143 30V90V45Q143 30 156 30Q169 30 169 45V101V66Q169 50 182 50Q196 50 196 66V133Q196 188 141 195Q105 195 85 159L60 123Q53 108 66 104Q78 99 90 119Z',cream)),
  stir:S(L('M185 50Q90 5 65 85Q42 151 103 175Q168 202 203 143M185 50H134M185 50V103',cream,11)),
  home:S(P('M42 102L130 20L218 102H195V196H151V136H110V196H65V102Z',cream)),
  ear:S(L('M90 158Q62 86 101 50Q143 15 175 59Q201 103 161 136L145 169Q133 195 108 179M108 80Q136 50 153 81Q168 103 140 119',ink,11))
 };
 const building=(color,type)=>S(P('M42 90H220V202H42Z',color)+P('M30 95L130 20L230 95Z',brown)+P('M111 139H153V203H111Z',cream)+P('M60 113H90V143H60ZM173 113H203V143H173Z','#dce5d3')+(type==='market'?P('M42 95H220V115Q202 129 183 115Q165 129 147 115Q128 129 110 115Q91 129 73 115Q50 129 42 115Z','#c6d19f'):AdventureArt.story.match(/<svg[^>]*>([\s\S]*)<\/svg>/)[1].replace(/^/,'<g transform="translate(89 62) scale(.32)">')+'</g>'));
 AdventureArt.places={park:S(P('M30 182Q130 157 230 182V208H30Z','#b8cd99')+L('M90 182V90',brown,10)+C( 90,75,42,green)+C( 60, 90, 30,green)+C(122, 90, 30,green)+L('M157 50V192M220 50V192M147 50H230',brown,6)+L('M172 50V137M208 50V137','#96ac83',3)+P('M162 134H215V149H162Z',gold)),market:building('#b9c999','market'),library:building('#c4b3a1','library')};
 AdventureArt.cashier=S(P('M84 102Q130 86 174 103L185 174H73Z','#91af97')+P('M109 100L130 122L151 100Z',cream)+E(130, 60,38,42,peach)+P('M91 56Q85 12 124 13Q164 7 171 54Q143 52 130 31Q116 53 91 56Z','#947153')+eyes(117,61,26)+smile(118, 80,24)+C(90,151,10,peach)+J('cashier-arm',169,111,L('M169 111Q184 126 182 144','#91af97',13)+C(182,145,9,peach))+P('M20 171H240V213H20Z','#bba079'));
 AdventureArt.register=S(P('M60 90H201L217 201H40Z','#91ad9c')+P('M81 30H178V109H81Z','#617e6a')+P('M91 43H167V91H91Z','#d8e5c5')+C(107, 60,5,gold)+C(129, 60,5,gold)+C(150, 60,5,gold)+L('M80 136H176M75 159H179',cream,7)+P('M50 181H207V200H50Z','#6e8b78'));
 window.PlaythingMotion={play(node,id){
  node.getAnimations({subtree:true}).forEach(a=>a.cancel());
  const moving=node.querySelector(id==='cashier'?'.cashier-arm':'.toy-moving,.flower-petals')||node;
  const frames=id==='cashier'?[{transform:'none'},{transform:'rotate(-45deg)'},{transform:'none'}]:id==='spade'?[{transform:'none'},{transform:'rotate(-24deg) translateY(10px)'},{transform:'none'}]:id==='car'?[{transform:'none'},{transform:'translateX(23px)'},{transform:'none'}]:id==='water'?[{transform:'none'},{transform:'rotate(15deg)'},{transform:'none'}]:id==='flower'?[{transform:'scale(.7)'},{transform:'scale(1.06)'},{transform:'none'}]:[{transform:'none'},{transform:'translateY(-10px) rotate(-4deg)'},{transform:'none'}];
  if(!moving.dataset.motionOrigin){moving.style.transformBox='fill-box';moving.style.transformOrigin='center';}
  return moving.animate(frames,{duration:matchMedia('(prefers-reduced-motion: reduce)').matches?1:900,easing:'ease-in-out'}).finished.catch(()=>{});
 }};
})();
