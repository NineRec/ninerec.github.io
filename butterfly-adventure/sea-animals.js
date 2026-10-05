/* Redrawn and newly added ocean residents. Everyone faces right. Moving parts (data-motion-origin)
 * overlap the body so a pose never opens a gap in the silhouette. */
(() => {
 'use strict';
 const {path:P,line:L,ellipse:E,circle:C,svg:S,joint:J,cream}=StoryPaint;
 const gradient=(id,top,bottom)=>`<defs><linearGradient id="sea-${id}" x1="0" y1="0" x2=".25" y2="1"><stop stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient></defs>`;
 const seaEye=(x,y,r=9)=>`<g class="creature-eyes">${C(x,y,r,'#fff8e9')+C(x+1,y+1,r*.57,'#253e48')+C(x-1,y-2,r*.23,'#fff')}</g>`;
 const seaSmile=(x,y,w=18)=>L(`M${x} ${y}q${w*.5} 8 ${w} -2`,'#355a60',2.4);
 const finLines=(d,c)=>L(d,c,1.8,'opacity=".65"');
 const stroke=(d,color,w,extra='')=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
 const blush=(x,y,gap=0,c='#ff9aa2')=>E(x,y,7,4,c,'opacity=".45"')+(gap?E(x+gap,y,7,4,c,'opacity=".45"'):'');
 const a={};

 // Dolphin: a long streamlined body, a rounded forehead and a real beak, a curved dorsal fin and crescent flukes.
 a.dolphin=S(gradient('dolphin2','#8fd5e4','#3d8fab')+
  J('animal-tail',74,112,P('M80 104C62 100 48 88 36 66L24 58C28 80 36 98 48 112C38 126 30 142 18 160L34 158C52 150 66 140 82 126Z','#3b8aa6')+finLines('M70 112L38 70M68 118L36 150','#9bd8e6'))+
  J('animal-fin',150,80,P('M126 84C136 54 156 36 176 28C170 46 172 66 184 86Z','#3b8aa6')+finLines('M148 78L166 44','#9bd8e6'))+
  P('M70 112C86 82 130 62 172 68C198 72 210 84 218 98L248 108C258 112 256 122 246 124L220 126C204 148 160 160 122 156C96 152 76 138 70 112Z','url(#sea-dolphin2)')+
  P('M80 126C106 156 168 160 206 132L248 122C254 122 256 116 252 112L244 124L214 130C180 156 112 156 84 130Z','#f2fafb')+
  J('animal-fin',150,130,P('M144 128C144 150 128 168 104 178C114 154 118 140 126 124Z','#3b8aa6')+finLines('M138 134L116 166','#9bd8e6'))+
  L('M184 82q5-3 11 0','#2f7a95',2.4)+seaEye(206,100,7.5)+L('M250 118Q232 124 214 116','#2f6e86',2.4)+blush(206,112,0,'#ff9aa2'));

 // Sea turtle: a domed scute shell, a long paddling flipper, a rounded head with a beak.
 a.turtle=S(gradient('turtle2','#92c068','#4c7f47')+gradient('turtleskin2','#bddc9e','#7db28a')+
  J('animal-fin fin-front',146,92,P('M134 96C124 66 100 46 66 38C64 56 76 82 98 100Z','#6aa889')+finLines('M120 88L84 52M112 94L78 66','#2d7b6f'))+
  J('animal-fin fin-rear',70,136,P('M84 128C60 128 38 142 28 162C46 166 68 160 90 146Z','#6aa889')+finLines('M70 138L38 156','#2d7b6f'))+
  P('M52 134C78 162 164 164 200 132C198 152 160 168 124 168C88 168 62 156 52 134Z','#ebdca0')+
  P('M48 124C46 84 88 58 132 60C178 62 206 92 202 126C198 144 158 156 122 156C84 154 50 144 48 124Z','url(#sea-turtle2)')+
  P('M112 84L142 84L156 108L142 132L112 132L98 108Z','#b3d476','opacity=".85"')+
  L('M98 108L72 100M156 108L184 100M112 84L104 70M142 84L152 68M112 132L102 146M142 132L152 146','#3f7a46',3.2,'opacity=".7"')+
  P('M62 104L76 96L84 112L72 124L58 118Z','#a5c969','opacity=".75"')+P('M172 100L186 106L184 120L172 126L162 114Z','#a5c969','opacity=".75"')+
  J('animal-fin fin-front',162,124,P('M152 120C168 108 184 124 180 150C174 178 146 198 108 208C106 194 124 176 134 156C140 142 142 128 152 120Z','#78b894')+finLines('M160 134L134 192M168 140L146 190','#2d7b6f'))+
  J('animal-head',194,114,P('M188 96C208 84 238 90 246 108C252 122 238 136 220 136C206 136 194 132 188 124Z','url(#sea-turtleskin2)')+P('M238 106Q256 112 252 122Q246 128 236 124Z','#a9cb8d')+seaEye(222,104,7.5)+C(246,112,2,'#427c67')+seaSmile(226,122,14)+blush(214,118)));

 // Seahorse: an upright S-shaped body with a curled tail, a bulging belly, a long snout and a spiky crown.
 a.seahorse=S(gradient('seahorse2','#f7d078','#e3a05a')+
  J('animal-fin',106,100,P('M110 80C84 72 62 88 60 112C78 128 102 126 114 118Z','#efc069')+finLines('M68 104L108 98M70 114L108 108','#c9914e'))+
  stroke('M126 124L122 158','#ebad5e',32)+stroke('M122 158C118 176 126 192 140 194','#ebad5e',22)+stroke('M140 194C156 194 164 178 154 168','#ebad5e',15)+stroke('M154 168C146 160 136 168 140 178','#ebad5e',9)+
  P('M106 52C108 34 130 32 146 42L200 52L200 68L152 74C160 92 166 118 152 138C138 150 112 148 104 128C96 108 106 96 106 84C106 72 104 62 106 52Z','url(#sea-seahorse2)')+
  P('M116 100C112 122 122 140 136 140C150 138 156 120 152 98C140 108 126 108 116 100Z','#fbe6a9','opacity=".85"')+
  stroke('M118 104Q136 112 154 102M117 116Q136 124 154 114M120 128Q136 136 152 126','#d9a24f',2.4,'opacity=".75"')+
  P('M114 42L108 20L122 32L128 12L134 32L148 20L146 44Z','#e3a05a')+
  stroke('M126 168Q140 170 146 180M130 178Q140 182 142 190','#d9a24f',2,'opacity=".6"')+
  C(190,60,2.2,'#b77f4a')+L('M170 70H198','#b77f4a',2.2)+seaEye(133,56,10)+blush(124,72)+
  J('animal-fin',138,84,P('M134 80Q154 76 160 94Q146 100 134 92Z','#efc069')));

 // Shrimp: a curved segmented body, a fan tail, long antennae, a spiky rostrum and rows of swimming legs.
 const shrimpPoint=(t)=>[(1-t)*(1-t)*168+2*(1-t)*t*112+t*t*50,(1-t)*(1-t)*116+2*(1-t)*t*24+t*t*158];
 const shrimpSegs=(()=>{
  let out='',legs='';
  for(let i=0;i<9;i++){
   const t=i/8,[x,y]=shrimpPoint(t),[x2,y2]=shrimpPoint(Math.min(1,t+.02)),ang=Math.atan2(y2-y,x2-x)*180/Math.PI;
   if(i>=1&&i<=6){const d=Math.hypot(112-x,150-y),ux=(112-x)/d,uy=(150-y)/d;legs+=L(`M${x.toFixed(1)} ${y.toFixed(1)}L${(x+ux*34).toFixed(1)} ${(y+uy*34+4).toFixed(1)}`,'#d36e5a',3.4);}
   out+=E(x.toFixed(1),y.toFixed(1),(19-t*6).toFixed(1),(27-t*8).toFixed(1),i%2?'#e98a76':'url(#sea-shrimp2)',`transform="rotate(${(ang+90).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})"`);
  }
  return legs+out;
 })();
 a.shrimp=S(gradient('shrimp2','#f7b7a0','#e07a64')+
  J('animal-tail',52,156,P('M58 148L32 138L24 158L34 178L60 170Z','#e5806b')+L('M52 156L30 150M52 160L30 162M54 166L36 172','#f6b6a2',2))+
  shrimpSegs+
  J('animal-leg',172,128,L('M172 128l-10 26M184 132l-4 24','#d36e5a',3.4))+
  L('M186 96Q214 50 252 62M190 104Q226 70 258 86','#c5705c',2)+
  E(184,116,34,28,'url(#sea-shrimp2)')+P('M196 92L240 86L210 108Z','#e07a64')+L('M206 96L232 90','#f6b6a2',1.6)+
  seaEye(196,112,8.5)+seaSmile(196,134,16)+blush(184,130));

 // Blue tang: a bright blue disc with a black palette marking and a sunny yellow tail.
 a.bluetang=S(gradient('tang','#57a3ee','#2765c9')+
  J('animal-tail',64,114,P('M78 102C54 96 38 78 24 70C20 98 20 122 26 150C44 142 62 130 78 124Z','#f7cf45')+finLines('M30 84L70 112M28 112L70 116M32 138L70 122','#fff1a3'))+
  P('M104 52C124 40 160 44 176 62L200 70L206 96L190 90C196 130 150 168 112 164C76 160 62 130 78 100C84 76 92 58 104 52Z','url(#sea-tang)')+
  P('M92 98C112 78 156 76 178 94C168 98 154 94 140 100C130 106 124 112 126 124C128 134 150 136 168 128C150 148 112 148 98 128C90 118 88 106 92 98Z','#202b47')+
  J('animal-fin',140,150,P('M130 150Q150 140 160 164Q146 176 128 162Z','#f7cf45'))+
  P('M104 50C120 34 150 36 164 52C148 54 122 50 104 50Z','#f7cf45')+
  seaEye(172,92,8.5)+seaSmile(182,114,12)+blush(166,108));

 // Angelfish: a tall disc body with bold bands and long, trailing fins.
 a.angelfish=S(gradient('angel','#fff1a8','#f1b65a')+
  J('animal-fin',116,54,P('M112 70C108 40 124 20 150 6C146 30 154 48 164 62Z','#f6c860')+finLines('M126 48L142 20','#fff3c4'))+
  J('animal-fin',116,160,P('M112 148C108 180 126 200 154 214C148 190 156 172 166 158Z','#f6c860')+finLines('M126 172L142 200','#fff3c4'))+
  J('animal-tail',74,112,P('M84 100C64 92 52 78 42 62C40 94 40 128 44 156C58 144 72 130 84 124Z','#f6c860')+finLines('M48 80L80 108M46 112L80 112M48 144L80 120','#fff3c4'))+
  E(138,112,56,52,'url(#sea-angel)')+
  P('M114 60Q104 112 114 164L128 166Q118 112 130 62Z','#3d4a63','opacity=".85"')+P('M148 62Q140 112 148 160L160 154Q152 112 162 66Z','#3d4a63','opacity=".85"')+
  J('animal-fin',150,128,P('M144 124Q166 120 176 144Q160 158 146 148Z','#f6c860'))+
  seaEye(172,100,8.5)+seaSmile(180,122,12)+blush(164,114));

 // Orca: glossy black body, a white belly and eye patch, a tall dorsal fin and big paddle flippers.
 a.orca=S(gradient('orca','#455a6e','#1d2833')+
  J('animal-tail',66,118,P('M76 108C60 104 46 92 34 72L22 64C26 88 34 104 46 118C36 132 28 146 16 164L32 162C50 154 64 142 80 130Z','#26333f'))+
  J('animal-fin',138,76,P('M114 82C124 44 140 22 154 12C158 38 164 60 168 84Z','#26333f'))+
  P('M66 118C74 84 116 62 160 66C194 70 214 88 226 108C240 112 248 120 244 128C236 138 214 142 196 142C166 166 108 162 66 134Z','url(#sea-orca)')+
  P('M84 140C116 164 176 166 210 140C196 150 150 168 110 160C98 156 90 148 84 140Z','#f6f8f8')+P('M200 140C220 144 238 134 244 128C236 138 218 144 200 146Z','#f6f8f8')+
  E(138,76,26,8,'#8e9ba6','opacity=".7"')+E(196,98,18,7.5,'#f6f8f8','transform="rotate(-18 196 98)"')+
  J('animal-fin',172,128,P('M162 122C172 148 164 176 138 194C136 170 142 146 150 124Z','#26333f'))+
  seaEye(210,108,6.6)+L('M244 126Q228 132 212 126','#f6f8f8',2.4)+blush(214,120,0,'#ff9aa2'));

 // Narwhal: a pale spotted whale with one long spiral tusk.
 a.narwhal=S(gradient('narwhal','#b7c9db','#7894b2')+
  J('animal-tail',58,118,P('M64 108C50 104 38 92 28 74L16 68C20 92 28 108 40 120C30 134 22 148 12 164L28 162C46 154 58 144 72 132Z','#6d88a6'))+
  P('M188 98L254 58L258 66L198 116Z','#fbf2d8')+
  P('M52 118C58 88 98 66 140 68C170 70 190 86 202 104C212 108 214 120 208 128C196 142 170 148 150 148C112 162 66 150 52 128Z','url(#sea-narwhal)')+
  P('M62 132C90 156 150 158 196 134C184 150 150 160 116 158C88 156 70 146 62 132Z','#f0f4f8')+
  [[90,86,5],[112,76,6],[136,74,5],[158,80,6],[98,104,4],[124,96,5],[148,98,4]].map(([x,y,r])=>C(x,y,r,'#5f7a97','opacity=".7"')).join('')+
  J('animal-fin',150,126,P('M144 124C146 146 134 164 112 174C116 152 122 138 128 122Z','#6d88a6'))+
  L('M214 94l8 8M224 86l8 8M234 78l8 8M244 70l8 8','#d9c79b',2.4)+
  seaEye(190,100,7.5)+L('M206 126Q194 134 178 128','#46607c',2.4)+blush(190,114));

 // Moray eel: a long speckled body winding out of a rock, with an open toothy mouth.
 a.moray=S(gradient('moray','#9bbd6a','#5f8a52')+
  stroke('M72 190C52 146 108 150 118 112C128 76 170 92 188 98','url(#sea-moray)',26)+
  stroke('M72 190C52 146 108 150 118 112C128 76 170 92 188 98','#cfe29a',10,'opacity=".55" transform="translate(2 6)"')+
  [[84,170],[78,152],[96,140],[112,128],[120,106],[136,92],[156,92]].map(([x,y])=>C(x,y,3.4,'#f1d86a')).join('')+
  P('M20 206C20 170 46 160 76 168C102 160 126 178 128 206Z','#8e929c')+P('M36 206C40 186 56 178 74 184C86 180 100 188 104 206Z','#a6a9b2','opacity=".7"')+
  C(34,180,6,'#e87f7f')+C(46,170,7,'#f2a0a6')+L('M30 186L34 206M44 176L44 206','#d46a74',3)+
  J('animal-head',184,98,
   P('M176 88C190 76 218 76 238 90C246 96 244 102 236 104L184 108Z','#8cb35e')+
   J('animal-mouth',184,108,P('M180 106L238 102C244 108 240 118 230 120L186 122Z','#c9de92')+P('M196 104l4 8l4-8ZM214 102l4 8l4-8ZM230 102l3 7l3-7Z',cream)+L('M188 114q22 6 44-2','#7a9a50',1.8,'opacity=".6"'))+
   C(200,88,9,'#8cb35e')+seaEye(201,87,6)+C(238,94,2.4,'#5f8a52')+blush(194,104)));

 // Squid: a torpedo mantle with triangle fins, a big eye and ten waving arms.
 a.squid=S(gradient('squid','#f7a9ac','#d8607d')+
  J('animal-fin',50,110,P('M26 110L52 64L78 84Z','#e6798f')+P('M26 110L52 156L78 136Z','#e6798f'))+
  P('M24 110C48 74 100 66 134 88L142 132C106 154 50 148 24 110Z','url(#sea-squid)')+
  [[70,98,4],[90,92,3.4],[110,100,4],[84,122,3.4],[106,126,4]].map(([x,y,r])=>C(x,y,r,'#fff0f0','opacity=".5"')).join('')+
  [-24,-10,4,18,30].map((dy,i)=>L(`M156 ${112+dy}Q${190+i*3} ${100+dy*1.6} ${222-i*4} ${108+dy*1.5}`,'#e0708a',7.5)).join('')+
  L('M156 104Q200 70 244 84',  '#e0708a',5)+C(246,84,6,'#e0708a')+L('M156 122Q204 140 246 128','#e0708a',5)+C(248,128,6,'#e0708a')+
  E(150,112,26,28,'#ed8d9f')+seaEye(158,104,11)+seaSmile(156,128,16)+blush(146,122));

 // Hermit crab: a big spiral shell on its back, orange claws and eyes on little stalks.
 a.hermitcrab=S(gradient('hermit','#f2c9dc','#c898c8')+
  J('animal-leg',150,190,L('M138 188l-12 14M156 190l-4 14M176 186l12 14','#e0764a',5))+
  E(150,176,42,22,'#ec8d57')+
  J('animal-claw',184,160,L('M174 168Q196 150 214 134','#ec8d57',11)+P('M206 120C214 106 232 108 230 126C228 138 218 142 210 140Z','#e0764a')+P('M220 122L236 114L232 132Z','#f5a56e'))+
  J('animal-claw',178,176,L('M178 180Q206 180 224 170','#ec8d57',9)+P('M220 160C230 156 242 164 238 176C234 184 224 182 220 178Z','#e0764a'))+
  L('M168 168L166 128M184 168L190 130','#ec8d57',4)+seaEye(166,124,7)+seaEye(190,126,7)+seaSmile(166,164,16)+
  C(98,126,54,'url(#sea-hermit)')+
  stroke('M98 126C114 122 124 140 112 152C98 164 74 154 76 132C78 108 106 98 126 112C146 128 138 160 114 170','#b27fb5',5,'opacity=".8"')+
  P('M58 160C40 156 40 130 56 118Z','#e9b3cd','opacity=".6"'));

 // Sea otter: floating on its back, cracking a shell on its belly, with a cream face and round ears.
 a.seaotter=S(
  E(112,138,76,28,'#8b6244','transform="rotate(-4 112 138)"')+E(110,134,60,18,'#c19a76','transform="rotate(-4 110 134)"')+
  J('animal-fin',44,128,E(42,112,12,20,'#6f4c34','transform="rotate(-14 42 112)"')+L('M36 102l-2-12M44 98l1-12M50 102l5-11','#6f4c34',3))+
  L('M32 148Q12 150 6 166','#6f4c34',9)+
  P('M104 112C118 100 146 106 148 128C140 138 112 140 104 128Z','#e8d6b8')+L('M112 114l14 22M124 112l10 26M136 114l4 20','#c4ac86',2)+
  J('animal-paw',160,126,L('M166 128Q146 126 134 122',  '#8b6244',13)+C(130,120,7.5,'#6f4c34'))+
  J('animal-head',186,112,
   C(168,92,9,'#8b6244')+C(204,88,9,'#8b6244')+
   E(190,110,32,26,'#8b6244')+E(196,118,24,17,'#ead6b4')+E(206,114,7,5.4,'#33292a')+
   seaEye(184,106,6.4)+seaEye(208,102,0.1)+L('M194 126q6 4 12 0','#33292a',2)+L('M220 112l22-4M220 120l22 4M218 126l20 8','#f2e2c3',1.8)+blush(180,118))+
  E(130,176,118,19,'#79c5d6','opacity=".5"')+E(130,176,96,13,'#9ad8e4','opacity=".6"')+L('M30 172q16-7 32 0t32 0M150 180q16-7 32 0t32 0','#e8fbfd',2.4,'opacity=".8"')+E(110,160,92,14,'#79c5d6','opacity=".45"'));

 Object.assign(AdventureArt.animals,a);
})();
