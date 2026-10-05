/* Redrawn and newly added zoo residents. Everyone faces right, stands on y≈205, and every moving
 * group (data-motion-origin) overlaps its fixed neighbour so the silhouette stays one piece. */
(() => {
 'use strict';
 const {path:P,line:L,ellipse:E,circle:C,svg:S,joint:J,ink,cream,gold,green,rose,brown,peach}=StoryPaint;
 const stroke=(d,color,w,extra='')=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" ${extra}/>`;
 const bands=(d,color,w,dash)=>stroke(d,color,w,`stroke-dasharray="${dash}"`);
 const eye=(x,y,r=5.2)=>`<g class="creature-eyes">${E(x,y,r*.8,r,'#2f2824')}${C(x+r*.22,y-r*.4,r*.32,cream)}</g>`;
 const eyes2=(x,y,gap,r)=>eye(x,y,r)+eye(x+gap,y,r);
 const cheeks=(x,y,gap,c=rose)=>E(x,y,7,4,c,'opacity=".4"')+E(x+gap,y,7,4,c,'opacity=".4"');
 const happy=(x,y,w=18)=>L(`M${x} ${y}q${w/2} 8 ${w} 0`,ink,2.4,`class="animal-mouth" data-motion-origin="${x+w/2} ${y}"`);
 // A column leg with a rounded foot. The top stays inside the body so a hip rotation never opens a gap.
 const leg=(x,top,w,color,toes='')=>P(`M${x-w} ${top}C${x-w-2} ${top+28} ${x-w+1} ${top+50} ${x-w-1} 197Q${x-w-5} 206 ${x} 206Q${x+w+5} 206 ${x+w+1} 197C${x+w-1} ${top+50} ${x+w+2} ${top+28} ${x+w} ${top}Z`,color)+toes;
 const toes=(x,color='#00000022')=>L(`M${x-5} 201v4M${x} 202v4M${x+5} 201v4`,color,1.6);
 const a={};

 // Tiger: lean body, bold black stripes, white cheek ruffs and a long ringed tail.
 const T='#eb9849',Td='#cf7c35',Tc='#fff1d6',Ts='#41322e';
 const tigerStripes=(x0)=>[[70,98,-8],[88,96,-4],[108,95,-2],[128,98,2],[148,106,6]].map(([x,y,k])=>P(`M${x} ${y}Q${x+k+8} ${y+22} ${x+k} ${y+44}Q${x+k-9} ${y+22} ${x-6} ${y+2}Z`,Ts)).join('');
 a.tiger=S(
  J('animal-tail',54,128,stroke('M56 126C26 130 10 106 20 78','#eb9849',13,'stroke-linecap="round"')+bands('M56 126C26 130 10 106 20 78',Ts,13,'5 12')+C(20,78,7,Ts))+
  J('animal-leg leg-rear',84,138,leg(84,138,11,Td))+J('animal-leg leg-front',162,138,leg(162,138,11,Td))+
  P('M44 128C42 102 70 92 104 94Q138 90 158 104C170 100 180 98 190 104L192 132C188 156 150 168 112 168C74 168 46 158 44 128Z',T)+
  tigerStripes()+E(116,160,44,9,Tc)+
  J('animal-leg leg-rear',62,140,leg(62,140,12,T,toes(62))+P('M50 168H74V176H50Z',Ts,'opacity=".0"'))+
  J('animal-leg leg-front',140,140,leg(140,140,12,T,toes(140)))+
  L('M52 160l20 0M130 162l20 0',Ts,4,'opacity=".9"')+
  J('animal-head',186,106,
   C(166,60,15,T)+C(166,61,8,'#f6cca0')+C(224,60,15,T)+C(224,61,8,'#f6cca0')+C(166,56,15,'none',`stroke="${Ts}" stroke-width="3" stroke-dasharray="26 70"`)+
   P('M158 92C156 64 176 50 200 50C226 50 242 66 240 92C240 114 222 130 198 130C176 130 158 114 158 92Z',T)+
   P('M160 100L146 108L162 112L154 124L172 118ZM238 100L252 108L236 112L244 124L226 118Z',Tc)+
   P('M180 112C184 104 196 100 212 102C228 100 238 108 232 118C226 130 190 132 180 112Z',Tc)+
   P('M198 96H220L209 107Z','#d8776f')+L('M209 106V112M200 116Q209 120 209 112Q209 120 218 116',Ts,2.2)+
   L('M200 53v15M192 55l3 12M208 55l-3 12M164 90l12 3M163 99l13 1M240 88l-12 4M241 97l-13 2',Ts,4)+
   eyes2(185,86,36,5.4)+L('M176 78q9-6 17-1M213 77q9-5 17 1',Ts,3.2)+cheeks(172,100,74)));

 // Elephant: huge ears, long curling trunk, tusks, tree-trunk legs and a tufted tail.
 const El='#9fb4bd',Ed='#869fab',Eh='#b8cad0';
 const pillar=(x,top,w,color)=>P(`M${x-w} ${top}L${x-w-1} 192Q${x-w-3} 206 ${x} 206Q${x+w+3} 206 ${x+w+1} 192L${x+w} ${top}Z`,color)+P(`M${x-w+2} 197q4-5 8 0M${x+2} 198q5-5 9 0`,'none',`stroke="#f1ece0" stroke-width="0"`)+E(x-w/2-1,203,4,3.4,'#efe6d3')+E(x+w/2+1,203,4,3.4,'#efe6d3');
 a.elephant=S(
  J('animal-tail',52,114,L('M52 114C40 124 38 140 42 158',Ed,6)+P('M36 156Q32 172 42 178Q50 172 48 156Z','#6e8995'))+
  J('animal-leg leg-rear',76,140,pillar(76,138,17,Ed))+J('animal-leg leg-front',158,140,pillar(158,138,17,Ed))+
  E(116,114,80,58,El)+P('M48 128C44 100 70 70 114 68Q160 64 178 92L186 150C150 176 80 172 48 128Z',El)+
  L('M60 112Q88 90 124 90',Eh,5,'opacity=".6"')+
  J('animal-leg leg-rear',104,140,pillar(104,138,18,El))+J('animal-leg leg-front',140,140,pillar(140,138,18,El))+
  J('animal-ear',172,70,P('M170 62C140 36 100 56 108 100C112 124 144 134 166 108Z',Ed)+P('M164 70C142 54 118 66 122 96C125 112 144 118 158 100Z','#c4a7a8','opacity=".55"'))+
  J('animal-head',190,90,
   E(196,86,38,40,El)+C(172,60,17,El)+C(212,58,17,El)+
   J('animal-trunk',214,106,P('M204 92C226 94 238 104 238 130C238 152 234 174 224 186Q214 196 204 188Q198 180 208 176Q220 170 220 150C220 136 214 128 204 124Z',El)+L('M210 128q10 4 18 0M212 142q9 4 17 0M214 156q8 4 14 0',Ed,2.4))+
   P('M202 116Q214 138 236 140Q242 134 226 130Q214 126 210 114Z',cream)+
   eye(208,76,5.4)+eye(184,78,5)+L('M200 66q6-5 12 0',Ed,2.6)+cheeks(204,98,0,'#d99a96')));

 // Giraffe: very long legs and a very long neck (the view box extends upward), small head with ossicones.
 const G='#ebbd66',Gd='#b27a41',Gl='#f6dc9d';
 const spot=(x,y,r,rot=0)=>E(x,y,r,r*.78,Gd,`transform="rotate(${rot} ${x} ${y})"`);
 const giraffeLeg=(x,cls,top)=>J(`animal-leg ${cls}`,x,top+4,leg(x,top,7,'#d9a455',L(`M${x-8} 184h16`,Gd,3))+P(`M${x-8} 197H${x+8}L${x+9} 206H${x-9}Z`,'#6e5038'));
 a.giraffe=S(
  giraffeLeg(80,'leg-rear',96)+giraffeLeg(150,'leg-front',96)+
  `<g transform="translate(0 -36)">`+
  J('animal-tail',48,118,L('M48 118C32 126 28 142 30 156',G,5)+P('M24 154Q22 170 32 174Q40 166 36 154Z',Gd))+
  P('M40 122C40 104 66 96 96 98C116 100 130 104 146 102L176 110C178 134 168 150 144 156C112 164 70 160 52 148C44 142 40 134 40 122Z',G)+
  [[70,118,9,10],[100,126,10,-6],[126,116,8,0],[96,146,7,8],[140,140,7,0],[62,142,6,0]].map(([x,y,r,k])=>spot(x,y,r,k)).join('')+
  J('animal-neck',150,112,
   P('M124 120C134 76 142 20 150 -30L186 -22C186 30 184 84 180 124Z',G)+L('M138 112C146 70 150 24 158 -22',Gd,5,'opacity=".55"')+
   [[162,98,8,-8],[166,66,7.5,10],[160,36,7,-6],[168,8,6.5,8],[158,-14,5.5,0]].map(([x,y,r,k])=>spot(x,y,r,k)).join('')+
   J('animal-head',170,-22,
    L('M174 -38l-3-18M196 -37l6-18',Gd,4)+C(170,-58,5,Gd)+C(203,-56,5,Gd)+
    P('M164 -30Q142 -46 140 -30Q146 -18 166 -20M202 -34Q224 -46 226 -32Q220 -20 202 -20Z',G)+P('M164 -30Q152 -38 148 -31Q152 -24 164 -24Z','#e9a79a','opacity=".7"')+
    E(186,-26,27,19,G)+E(212,-14,23,14,Gl)+C(219,-16,2.4,Gd)+C(208,-15,2.4,Gd)+eye(190,-32,5.2)+L('M200 -4q6 3 12 0',ink,2.2)+cheeks(186,-17,0)))+
  `</g>`+
  giraffeLeg(104,'leg-rear',100)+giraffeLeg(130,'leg-front',100),'0 -122 260 346');

 // Otter: a long, sleek body on short legs, thick tapering tail, whiskers and a cream muzzle.
 const O='#8b6a4c',Od='#6f523a',Oc='#e8d2ae';
 a.otter=S(
  J('animal-tail',54,150,P('M62 138C40 146 20 160 8 190C26 186 44 176 70 164Z',O)+P('M50 152C34 162 20 172 12 186',Od,'opacity=".0"'))+
  J('animal-leg leg-rear',78,160,P('M66 148C66 138 96 138 98 150L94 192Q100 204 88 205H72Q62 204 68 192Z',Od)+L('M68 200v4M76 201v4M84 200v4',Oc,1.6,'opacity=".7"'))+
  P('M60 150C58 120 92 112 128 116C150 118 168 108 178 90C192 94 204 106 204 124C204 152 170 170 130 170C92 170 62 168 60 150Z',O)+
  P('M96 150C112 164 160 166 188 140C180 164 150 174 120 174C98 174 92 160 96 150Z',Oc)+
  J('animal-leg leg-front',152,160,P('M140 148C142 138 168 138 170 150L168 192Q174 204 162 205H146Q136 204 142 192Z',Od)+L('M142 200v4M150 201v4M158 200v4',Oc,1.6,'opacity=".7"'))+
  J('animal-paw',164,134,L('M164 134Q182 146 196 134',O,14)+C(198,132,8,Od)+L('M196 126v-4M201 128v-4',Oc,2))+
  J('animal-head',190,104,
   C(166,68,9,Od)+C(210,66,9,Od)+C(166,69,4.5,Oc)+C(210,67,4.5,Oc)+
   E(188,86,37,28,O)+E(198,98,27,18,Oc)+eyes2(178,82,22,4.8)+P('M190 90H208L199 99Z',ink)+L('M199 99V103M190 105Q199 111 199 103Q199 111 208 105',ink,2)+
   L('M176 96L152 90M176 102L150 104M218 96L240 90M216 102L242 104',Oc,1.8)+cheeks(168,90,48)));

 // Kangaroo: upright, big hind foot, a heavy tail, short forearms, and a joey peeking out of the pouch.
 const K='#c79c68',Kd='#a87b4b',Kl='#ecd3a9';
 a.kangaroo=S(
  J('animal-tail',104,160,P('M110 146C80 166 44 188 8 188L10 204C60 206 104 192 132 172Z','#b78a58')+L('M18 190Q60 192 104 168','#d0a574',3,'opacity=".6"'))+
  P('M112 138C98 112 110 80 134 66C156 54 170 66 172 86C176 120 174 160 150 178C130 190 118 170 112 138Z',K)+
  P('M128 112C120 134 124 164 146 172C166 168 168 128 156 106Z',Kl)+
  J('animal-head',152,64,
   P('M138 52C132 22 136 4 144 6C152 8 156 32 156 50Z',K)+P('M166 50C174 24 184 8 192 12C196 18 188 40 178 54Z',K)+P('M142 40C140 24 142 14 146 14C148 24 150 36 150 48Z',peach,'opacity=".6"')+P('M180 44C186 28 190 20 190 20C190 32 186 42 180 52Z',peach,'opacity=".6"')+
   P('M138 74C136 52 154 40 172 46C186 50 196 62 212 70C220 76 218 86 206 90C190 96 160 98 146 90C140 86 138 80 138 74Z',K)+
   eye(166,64,5)+C(214,74,4.4,'#4a3829')+L('M180 84Q196 92 208 86',ink,2)+cheeks(158,76,0))+
  J('animal-leg',124,170,E(122,170,30,28,Kd)+stroke('M96 164Q118 138 148 160','#8a6038',2.5,'opacity=".7"')+P('M112 186C134 192 164 194 190 201Q196 206 188 207H118Q108 206 110 196Z',Kd)+L('M170 203v3M178 203v3M185 203v3',Kl,1.6,'opacity=".8"'))+
  P('M136 148Q154 160 172 148L170 168Q154 180 138 170Z','#b88c58')+
  C(154,148,13,K)+E(148,134,4.5,9,K,'transform="rotate(-14 148 134)"')+E(162,133,4.5,9,K,'transform="rotate(14 162 133)"')+E(154,152,10,8.5,Kl)+eye(151,148,2.8)+eye(159,148,2.8)+C(155,153,2,'#6b4a32')+
  J('animal-paw',156,108,L('M156 108Q176 112 186 100',K,12)+C(188,98,6.5,Kd))
 );

 // Flamingo: slim S-curved neck, hooked beak, black wing tips, one leg tucked up.
 const F='#f19ca7',Fd='#e57f90',Fl='#f7bcc3';
 a.flamingo=S(
  J('animal-leg',112,140,stroke('M112 140V190L96 200','#e58b95',5,'stroke-linecap="round" stroke-linejoin="round"')+C(96,200,3.5,'#e58b95'))+
  J('animal-leg',136,142,stroke('M136 142L140 166L112 166','#e58b95',5,'stroke-linecap="round" stroke-linejoin="round"'))+
  P('M56 128C46 112 60 90 92 90C122 88 148 98 158 118C150 144 110 156 78 148Z',F)+P('M60 130L30 150L66 142Z',Fl)+
  J('animal-wing',100,112,P('M62 118C78 92 126 96 154 124C130 146 88 146 62 118Z',Fd)+P('M62 118C48 130 46 140 56 146C70 140 78 132 84 124Z',ink)+L('M80 114Q112 114 144 122',Fl,3,'opacity=".7"'))+
  J('animal-neck',146,106,
   stroke('M146 112C176 104 188 78 164 58C142 40 154 18 178 18C194 18 200 28 198 38',F,15,'stroke-linecap="round"')+
   C(196,32,13,F)+P('M200 24C214 24 226 32 228 44C222 58 206 60 196 48Z','#fbe4dc')+P('M216 28C224 34 228 40 228 46C224 54 214 58 206 56C214 48 218 40 216 28Z','#33302f')+eye(190,28,4.6)));

 // Rhino: armoured grey body with skin folds, a shoulder hump, leaf ears and a big nose horn.
 const R='#a9b0b5',Rd='#8a949b';
 const stout=(x,top,w,color,nails='#efe6d6')=>P(`M${x-w} ${top}L${x-w-2} 190Q${x-w-4} 206 ${x} 206Q${x+w+4} 206 ${x+w+2} 190L${x+w} ${top}Z`,color)+E(x-w*.55,203,3.8,3.2,nails)+E(x,204,3.8,3.2,nails)+E(x+w*.55,203,3.8,3.2,nails);
 a.rhino=S(
  J('animal-tail',40,112,L('M42 112C32 124 30 140 34 156',Rd,5)+P('M28 152Q26 168 36 170Q42 162 40 152Z',Rd))+
  J('animal-leg leg-rear',72,136,stout(72,136,16,Rd))+J('animal-leg leg-front',150,136,stout(150,136,16,Rd))+
  P('M38 132C34 100 66 82 108 82Q146 78 162 100C176 98 190 108 192 128L190 152C170 172 118 176 82 172C56 168 40 156 38 132Z',R)+
  P('M138 90C146 78 162 80 170 98L172 120C160 106 148 100 138 90Z',Rd,'opacity=".45"')+
  L('M64 98Q54 122 66 146M86 92Q78 118 88 144M152 104Q142 128 150 152',Rd,3,'opacity=".6"')+
  J('animal-leg leg-rear',100,136,stout(100,136,17,R))+J('animal-leg leg-front',176,136,stout(176,136,17,R))+
  J('animal-head',176,112,
   P('M180 86C176 66 184 54 192 50C198 64 198 80 194 92Z',Rd)+P('M184 84C182 70 186 62 190 58C192 68 192 78 190 86Z','#c8a59f','opacity=".8"')+
   P('M164 104C164 82 188 78 212 90L246 124C254 140 244 156 226 156L192 154C172 150 164 128 164 104Z',R)+
   P('M212 102C214 80 226 60 244 50C248 66 244 90 238 114Z','#e3d2a6')+P('M214 104C218 94 230 90 240 104L238 114L214 112Z',Rd,'opacity=".55"')+
   P('M198 92C198 82 204 74 210 70C213 80 212 90 208 98Z','#e3d2a6')+
   eye(196,106,4.6)+E(240,132,3.4,2.6,Rd)+L('M222 148q12 4 24-4',Rd,2.4)+cheeks(186,120,0)));

 // Frog: sitting green frog with bulging eyes, a wide smile, a folded hind leg with webbed toes.
 const Fg='#7fc066',Fgd='#5c9a4f',Fgl='#eef5c0';
 a.frog=S(
  J('animal-leg',92,150,E(94,152,34,30,Fgd)+P('M72 170C60 184 52 194 38 198L30 204L50 206L66 202L88 200L110 196Z',Fg)+P('M30 204L18 202M38 202L24 210M50 206L40 214',Fg,'stroke="#7fc066" stroke-width="0"')+L('M40 200l-14 2M48 204l-14 8M58 206l-8 10',Fg,5)+L('M40 200l-14 2M48 204l-14 8',Fgd,0))+
  E(122,146,68,48,Fg)+E(150,164,40,26,Fgl)+
  [[90,128,6],[116,118,5],[140,126,6],[104,146,4.5],[128,140,4]].map(([x,y,r])=>C(x,y,r,Fgd,'opacity=".75"')).join('')+
  J('animal-paw',168,164,L('M168 164L184 190',Fg,12)+L('M184 190l12 14M184 190l2 15M184 190l-8 15',Fg,5))+
  J('animal-head',166,110,
   C(158,92,19,Fg)+C(196,94,19,Fg)+C(158,90,13.5,cream)+C(196,92,13.5,cream)+
   E(176,124,52,34,Fg)+eye(160,92,7)+eye(198,94,7)+
   L('M148 130Q176 148 222 126',Fgd,3,'class="animal-mouth" data-motion-origin="185 132"')+C(212,116,2.2,Fgd)+C(220,118,2.2,Fgd)+cheeks(168,128,34,'#f3a7a0')));

 // Cow: black-and-white patches, pink muzzle, horns, a bell, udder and a swishing tail.
 const W='#fbf8ee',Wk='#3f3d44',Wp='#f4b6b0';
 const hoofLeg=(x,top,w,color)=>P(`M${x-w} ${top}L${x-w} 192H${x+w}L${x+w} ${top}Z`,color)+P(`M${x-w-1} 192H${x+w+1}L${x+w+2} 206H${x-w-2}Z`,'#5b4a4a');
 a.cow=S(
  J('animal-tail',44,102,L('M44 102C32 114 30 140 34 160',W,6)+L('M44 102C32 114 30 140 34 160',Wk,0)+P('M28 156Q26 176 36 178Q44 172 40 156Z',Wk))+
  J('animal-leg leg-rear',66,140,hoofLeg(66,140,12,'#d6cfba'))+J('animal-leg leg-front',160,140,hoofLeg(160,140,12,'#d6cfba'))+
  P('M40 114C40 94 58 84 84 84H166C186 84 198 94 198 114V146C198 164 184 172 164 172H74C54 172 40 164 40 146Z',W)+
  P('M64 86C82 82 98 92 96 108C94 124 74 128 62 118C52 108 52 90 64 86Z',Wk)+P('M146 98C166 92 186 100 184 122C182 142 160 148 148 134C140 122 138 106 146 98Z',Wk)+P('M108 150C120 144 134 148 132 160C128 170 110 168 108 150Z',Wk,'opacity=".9"')+
  E(116,174,17,11,Wp)+L('M108 180v6M116 182v6M124 180v6',Wp,4)+
  J('animal-leg leg-rear',92,140,hoofLeg(92,140,12,'#f1ecdb')+P('M80 140H104V164Q92 170 80 164Z',Wk))+J('animal-leg leg-front',186,140,hoofLeg(186,140,12,'#f1ecdb'))+
  J('animal-head',190,106,
   P('M196 60C190 44 194 36 200 34C204 44 204 54 204 62Z',cream)+P('M224 60C230 44 226 36 220 34C216 44 216 54 216 62Z',cream)+
   P('M184 78L160 74L162 92L184 94Z',W)+P('M184 80L168 78L170 88L184 90Z',Wp,'opacity=".8"')+P('M240 80L256 75L254 92L240 94Z',Wk)+
   P('M180 80C180 62 198 54 214 56C232 58 246 76 244 100C242 122 232 134 212 134C192 134 180 122 180 80Z',W)+
   P('M180 86C180 66 192 58 204 58C206 76 200 94 186 98Z',Wk)+
   E(224,116,26,19,Wp)+E(214,114,3.6,5,'#a96d65')+E(234,114,3.6,5,'#a96d65')+L('M212 126q12 5 24 0','#a96d65',2.4)+
   eye(200,86,5)+eye(226,86,5)+cheeks(194,102,40,'#f08f88')+
   L('M186 134Q204 146 228 134',Gold(),6)+C(208,146,6.5,gold)+L('M208 152v2','#8f6a1a',2)));
 function Gold(){return '#d85d52';}

 // Gorilla: broad shoulders, long strong arms resting on the ground, a heavy brow and a crested head.
 const Gf='#5c6872',Gdk='#444d55',Gch='#7d8991',Gfa='#3f464d',Gm='#59636b';
 a.gorilla=S(
  J('animal-leg',100,182,P('M88 176H128L124 198Q132 208 112 208H84Q74 206 82 196Z',Gdk)+L('M92 204v-4M101 205v-5M110 204v-4',Gch,1.8,'opacity=".6"'))+
  J('animal-leg',162,182,P('M134 176H174L178 196Q186 206 170 208H146Q128 208 136 196Z',Gdk)+L('M148 204v-4M157 205v-5M166 204v-4',Gch,1.8,'opacity=".6"'))+
  P('M52 156C44 112 76 92 130 92C184 92 216 112 208 156C206 184 182 200 130 200C80 200 54 184 52 156Z',Gf)+
  E(130,142,36,44,Gch)+C(116,122,3.4,Gdk)+C(144,122,3.4,Gdk)+L('M130 132v34',Gdk,1.8,'opacity=".6"')+
  J('animal-paw paw-left',74,116,L('M74 118Q40 146 44 184',Gf,36)+E(46,192,24,13,Gdk)+L('M33 194v6M44 196v6M55 194v6',Gch,2.4,'opacity=".7"'))+
  J('animal-paw paw-right',186,116,L('M186 118Q220 146 216 184',Gf,36)+E(214,192,24,13,Gdk)+L('M203 194v6M214 196v6M225 194v6',Gch,2.4,'opacity=".7"'))+
  J('animal-head',130,96,
   P('M92 60C90 34 108 10 130 8C152 10 170 34 168 60C170 82 154 98 130 98C106 98 90 82 92 60Z',Gf)+P('M112 24C116 10 144 10 148 24C140 18 120 18 112 24Z',Gdk)+
   P('M102 46Q130 34 158 46L156 62Q130 52 104 62Z',Gdk)+E(130,76,26,20,Gm)+E(130,70,30,8,Gm,'opacity="0"')+
   eye(116,58,4.6)+eye(144,58,4.6)+E(121,74,5.2,3.4,Gfa)+E(139,74,5.2,3.4,Gfa)+L('M116 88Q130 96 144 88',Gfa,2.6)+cheeks(104,72,52,'#f09890')));

 // Fox: slim orange body, big pointed ears, white cheeks and chest, dark socks and a white-tipped brush.
 const Fx='#e48238',Fxl='#fff2dc',Fxd='#4a352d';
 const sockLeg=(x,top,w,fur)=>leg(x,top,w,fur)+P(`M${x-w-1} 174L${x-w-1} 197Q${x-w-5} 206 ${x} 206Q${x+w+5} 206 ${x+w+1} 197L${x+w+1} 174Z`,Fxd);
 a.fox=S(
  J('animal-tail',60,126,P('M64 132C36 144 6 124 10 88C13 66 30 52 44 56C38 72 44 96 70 110Z',Fx)+P('M12 90C12 70 26 54 44 56C38 64 36 70 36 76C28 80 20 86 12 90Z',Fxl))+
  J('animal-leg leg-rear',86,136,sockLeg(86,136,7,'#c8692c'))+J('animal-leg leg-front',160,136,sockLeg(160,136,7,'#c8692c'))+
  P('M56 130C54 106 84 98 118 100Q150 98 162 112C172 108 178 112 182 118L180 138C172 156 142 162 112 162C80 162 58 152 56 130Z',Fx)+
  P('M142 128C158 118 176 124 174 142C164 156 148 152 142 140Z',Fxl)+
  J('animal-leg leg-rear',64,138,sockLeg(64,138,8,Fx))+J('animal-leg leg-front',138,138,sockLeg(138,138,8,Fx))+
  J('animal-head',170,108,
   P('M156 82L150 40L180 64Z',Fx)+P('M186 86L206 34L224 92Z',Fx)+P('M158 74L156 52L170 64Z',Fxd)+P('M196 80L206 48L214 82Z',Fxd)+
   P('M150 100C150 80 170 68 192 72C208 76 226 94 248 108C250 116 240 122 226 122C206 126 168 132 156 118C152 112 150 104 150 100Z',Fx)+
   P('M162 110C176 120 200 128 228 122C216 132 190 140 170 130Z',Fxl)+
   C(246,108,5.4,Fxd)+L('M232 124q10 2 14-6',Fxd,2)+
   eye(190,94,4.8)+L('M182 86q8-6 16-1',Fxd,2.4)+cheeks(180,108,0)+L('M224 112l16-2M226 116l16 4',Fxl,1.6,'opacity=".9"')));

 // Hippo: enormous barrel body, short stout legs, a huge square muzzle and eyes and ears on top of the head.
 const H='#a6a2b8',Hd='#8883a0',Hl='#c4c0d2';
 const stump=(x,top,w,color)=>P(`M${x-w} ${top}L${x-w-1} 194Q${x-w-3} 206 ${x} 206Q${x+w+3} 206 ${x+w+1} 194L${x+w} ${top}Z`,color)+E(x-w/2,203,3.4,3,'#efe6df')+E(x+w/2,203,3.4,3,'#efe6df');
 a.hippo=S(
  J('animal-tail',36,126,P('M40 122C30 126 26 134 30 142L36 138C36 132 40 128 44 128Z',Hd)+L('M32 138v6',Hd,4))+
  J('animal-leg leg-rear',76,150,stump(76,150,18,Hd))+J('animal-leg leg-front',158,150,stump(158,150,18,Hd))+
  P('M32 146C30 112 64 92 110 92Q154 92 174 108C186 112 196 122 198 138C198 160 174 178 128 180C80 182 34 176 32 146Z',H)+
  P('M50 168C80 178 150 180 184 160C176 176 148 184 110 184C74 184 54 178 50 168Z',Hl,'opacity=".65"')+
  J('animal-leg leg-rear',108,150,stump(108,150,19,H))+J('animal-leg leg-front',186,150,stump(186,150,19,H))+
  J('animal-head',184,120,
   C(178,84,9,H)+C(178,85,4.5,'#d9a7ad')+C(206,76,9,H)+C(206,77,4.5,'#d9a7ad')+
   P('M164 112C164 86 184 76 208 78C232 80 254 98 254 124C254 148 240 162 214 162C186 162 164 148 164 112Z',H)+
   E(228,128,30,28,Hl)+E(216,108,4.2,3.2,Hd)+E(238,110,4.2,3.2,Hd)+
   C(194,92,9,H)+C(194,92,9,'none',`stroke="${Hd}" stroke-width="1.6"`)+eye(194,92,4.4)+
   L('M200 138Q226 152 252 138',Hd,2.8,'class="animal-mouth" data-motion-origin="226 140"')+P('M214 146l3 6l3-6ZM236 146l3 6l3-6Z',cream)+cheeks(196,110,0,'#e8929a')));

 // Zebra: black-and-white stripes, a stiff mane, a long dark muzzle and a tufted tail.
 const Zw='#fbf8ef',Zk='#323a3d',Zm='#4b4f4a';
 const zebraBody='M52 130C50 106 78 96 112 98Q140 96 156 104L176 76C184 60 200 62 206 72L184 120C182 146 154 162 112 162C78 162 54 154 52 130Z';
 const zebraLeg=(x,top,w,color)=>P(`M${x-w} ${top}L${x-w} 190H${x+w}L${x+w} ${top}Z`,color)+P(`M${x-w-1} 168H${x+w+1}V174H${x-w-1}ZM${x-w-1} 180H${x+w+1}V185H${x-w-1}Z`,Zk)+P(`M${x-w-1} 190H${x+w+1}L${x+w+2} 206H${x-w-2}Z`,Zk);
 a.zebra=S(
  J('animal-tail',54,116,P('M56 114C40 124 36 146 40 164Z',Zw)+L('M54 116C42 128 38 148 42 164',Zk,5)+P('M34 160Q34 178 44 180Q52 172 48 160Z',Zk))+
  J('animal-leg leg-rear',84,136,zebraLeg(84,136,8,'#e7e2d4'))+J('animal-leg leg-front',160,136,zebraLeg(160,136,8,'#e7e2d4'))+
  `<defs><clipPath id="zebra-clip"><path d="${zebraBody}"/></clipPath></defs>`+
  P(zebraBody,Zw)+
  `<g clip-path="url(#zebra-clip)">`+[60,78,96,114,132,150,168].map((x,i)=>P(`M${x} 90Q${x+8} 126 ${x-2} 168L${x+7} 168Q${x+17} 126 ${x+11} 90Z`,Zk)).join('')+[150,160,170,180].map((x,i)=>P(`M${x} 60L${x+20} 84L${x+20} 98L${x} 76Z`,Zk)).join('')+`</g>`+
  J('animal-leg leg-rear',64,138,zebraLeg(64,138,9,Zw))+J('animal-leg leg-front',140,138,zebraLeg(140,138,9,Zw))+
  P('M168 88L174 70L180 88ZM176 80L182 62L190 84ZM184 76L192 58L198 82Z',Zk)+
  J('animal-head',188,82,
   P('M184 66L186 38L202 56Z',Zw)+P('M206 56L218 32L224 62Z',Zw)+P('M188 56L188 44L196 54Z',Zk)+P('M210 52L218 40L219 56Z',Zk)+
   P('M176 76C176 56 196 48 214 52C232 56 246 74 252 92C254 104 244 112 230 112C206 114 184 110 178 96C176 90 176 82 176 76Z',Zw)+
   P('M214 52C218 60 218 72 212 84L222 86C228 72 226 60 220 52ZM194 52C200 62 198 76 192 88L200 90C206 76 206 62 202 52Z',Zk)+
   P('M226 82C242 80 254 90 252 102C250 112 238 114 228 112C222 100 222 90 226 82Z',Zm)+C(238,92,2.6,Zk)+L('M232 106q8 2 14-3',Zk,1.8)+
   eye(204,74,4.6)+cheeks(198,90,0)));

 // Horse: chestnut coat, an arched neck, a dark mane and tail, a white blaze and one white sock.
 const Hc='#b27240',Hm='#4b2f24';
 const horseLeg=(x,top,w,color,sock=false)=>P(`M${x-w} ${top}L${x-w+1} 192H${x+w-1}L${x+w} ${top}Z`,color)+(sock?P(`M${x-w+1} 178H${x+w-1}V192H${x-w+1}Z`,cream):'')+P(`M${x-w} 192H${x+w}L${x+w+2} 206H${x-w-2}Z`,'#4d3a32');
 a.horse=S(
  J('animal-tail',54,114,P('M58 110C36 118 24 150 32 188C44 172 50 152 66 134Z',Hm)+L('M38 150Q36 168 40 182','#6b4637',3,'opacity=".7"'))+
  J('animal-leg leg-rear',84,136,horseLeg(84,136,7,'#96592f'))+J('animal-leg leg-front',160,136,horseLeg(160,136,7,'#96592f',true))+
  P('M50 128C48 104 78 96 114 98Q142 96 160 104L186 130C182 152 152 164 112 164C78 164 52 154 50 128Z',Hc)+
  P('M146 108C156 90 168 70 180 56L206 66C204 90 198 112 190 136Z',Hc)+
  P('M184 40C170 52 156 74 140 100L156 110C164 90 176 70 196 58Z',Hm)+
  J('animal-leg leg-rear',64,138,horseLeg(64,138,8,Hc))+J('animal-leg leg-front',140,138,horseLeg(140,138,8,Hc,true))+
  J('animal-head',196,66,
   P('M190 50L190 26L204 44Z',Hc)+P('M208 44L218 24L222 46Z',Hc)+P('M193 44L193 34L200 43Z','#d79a7e')+
   P('M184 62C186 46 202 40 214 46C228 56 244 84 252 102C256 112 248 118 238 116C220 112 202 104 192 92C186 84 184 72 184 62Z',Hc)+
   P('M208 50L236 98L230 102L204 58Z',cream)+E(246,108,10,8,'#dbb088')+C(249,106,1.8,Hm)+L('M240 114q6 2 10-3','#7a5238',1.8)+
   P('M198 44C206 52 208 64 202 74C196 62 194 52 198 44Z',Hm)+eye(204,66,4.6)+cheeks(205,84,0)));

 // Crocodile: a long low body with a ridged back, a long toothy snout with a hinged jaw, and bumpy eyes.
 const Cg='#7ea35b',Cgd='#5f8447',Cgl='#dde7ab';
 const crocLeg=(x,c=Cgd)=>P(`M${x-12} 172C${x-14} 184 ${x-20} 192 ${x-26} 197L${x-28} 205H${x-6}L${x+4} 198C${x+10} 190 ${x+12} 180 ${x+10} 172Z`,c)+L(`M${x-27} 203v-5M${x-20} 204v-6M${x-13} 204v-6`,Cgl,1.6,'opacity=".7"');
 a.crocodile=S(
  J('animal-tail',104,172,P('M108 150C84 166 52 164 14 178C8 184 8 190 14 194C46 206 88 206 116 194Z',Cg)+P('M70 164l7-13l7 12ZM44 172l6-11l6 11ZM22 180l5-9l5 9Z',Cgd))+
  J('animal-leg leg-rear',84,170,crocLeg(84))+J('animal-leg leg-front',162,170,crocLeg(162))+
  P('M102 168L111 144L121 166ZM124 158L133 134L143 156ZM146 152L155 129L165 150Z',Cgd)+
  P('M76 186C100 178 116 160 134 150C150 142 166 142 184 144L184 176C158 182 140 194 110 200C90 204 74 200 76 186Z',Cg)+
  P('M86 196C112 202 140 194 184 176V168C152 184 122 188 92 190Z',Cgl,'opacity=".7"')+
  J('animal-leg leg-rear',112,170,crocLeg(112,Cg))+J('animal-leg leg-front',190,170,crocLeg(190,Cg))+
  P('M172 142C192 126 224 126 252 140C258 144 254 154 244 156L174 162Z',Cg)+
  J('animal-mouth',176,160,P('M174 156L246 154C252 162 246 170 238 170L178 176Z',Cgl)+P('M196 154l4 8l4-8ZM216 154l4 8l4-8ZM234 154l4 7l3-7Z',cream)+L('M182 166q30 6 58 -2',Cgd,1.6,'opacity=".5"'))+
  C(197,133,10,Cg)+eye(198,132,4.6)+C(247,138,3.2,Cgd)+cheeks(184,150,0));

 // Orangutan: shaggy orange hair, a round tan face, very long arms and a friendly wave.
 const Oh='#cd6c3a',Ohd='#a64f2a',Of='#e4ac80',Ofd='#cb8e62';
 a.orangutan=S(
  J('animal-leg',100,184,P('M84 176H126L124 196Q130 206 112 206H88Q76 204 82 194Z',Ohd)+E(90,200,12,6,Of))+
  J('animal-leg',162,184,P('M134 176H176L178 194Q184 204 168 206H146Q128 206 136 194Z',Ohd)+E(170,200,12,6,Of))+
  P('M70 152C62 112 92 96 130 96C168 96 198 112 190 152C188 186 164 200 130 200C96 200 72 186 70 152Z',Oh)+
  P('M96 156C94 130 112 120 130 120C148 120 166 130 164 156C162 180 150 190 130 190C110 190 98 180 96 156Z','#e69a63')+
  [[92,176],[110,194],[150,194],[170,178]].map(([x,y])=>P(`M${x-8} ${y-4}L${x} ${y+10}L${x+8} ${y-4}Z`,Oh)).join('')+
  J('animal-paw paw-left',80,120,L('M80 122Q36 146 38 188',Oh,24)+P('M26 186Q38 214 58 186Q50 176 38 178Z',Ohd)+L('M31 196v5M39 198v6M47 196v5',Of,2,'opacity=".8"'))+
  J('animal-paw paw-right',180,120,L('M180 122Q226 108 222 60',Oh,24)+C(222,54,14,Ohd)+L('M214 44v-8M222 42v-9M230 44v-8',Of,3))+
  J('animal-head',130,98,
   P('M80 74C70 40 98 14 130 14C162 14 190 40 180 74C184 92 170 100 156 98L104 98C90 100 76 92 80 74Z',Oh)+
   P('M84 70C84 66 90 62 96 64L100 98L88 92Z M176 70C176 66 170 62 164 64L160 98L172 92Z',Ohd,'opacity=".55"')+
   E(130,74,34,34,Of)+E(130,90,20,15,'#f2c9a2')+P('M100 56C112 44 148 44 160 56C150 52 110 52 100 56Z',Oh)+
   eye(116,68,4.4)+eye(144,68,4.4)+E(124,84,2.4,1.8,Ohd)+E(136,84,2.4,1.8,Ohd)+L('M118 96Q130 104 142 96',Ohd,2.4)+cheeks(104,86,52,'#e4887a')));

 // Polar bear: a creamy-white coat, a long gentle head, a black nose and strong paws for the ice.
 const Pb='#f5f4ec',Pbd='#d3dde2',Pbn='#37383d';
 const pawLeg=(x,top,w,color)=>leg(x,top,w,color)+C(x-w/2,203,1.8,Pbn)+C(x,204,1.8,Pbn)+C(x+w/2,203,1.8,Pbn);
 a.polarbear=S(
  C(46,126,9,Pbd)+
  J('animal-leg leg-rear',76,134,pawLeg(76,134,14,Pbd))+J('animal-leg leg-front',160,134,pawLeg(160,134,14,Pbd))+
  P('M44 132C42 104 76 88 118 90Q150 86 170 102C182 98 192 104 196 114L196 140C192 162 160 172 116 172C78 172 46 162 44 132Z',Pb)+
  P('M52 160C80 172 150 174 190 150C182 168 156 176 116 176C82 176 58 170 52 160Z',Pbd,'opacity=".7"')+
  J('animal-leg leg-rear',104,134,pawLeg(104,134,15,Pb))+J('animal-leg leg-front',184,134,pawLeg(184,134,15,Pb))+
  J('animal-head',190,114,
   C(190,86,9,Pb)+C(190,87,4.5,Pbd)+C(214,82,9,Pb)+C(214,83,4.5,Pbd)+
   P('M176 114C176 92 194 82 212 84C228 86 246 100 252 118C254 128 246 134 236 134L204 134C186 132 176 128 176 114Z',Pb)+
   E(246,118,7,5.6,Pbn)+E(238,128,10,5,Pbd,'opacity=".6"')+L('M232 128q8 4 16-2',Pbn,2)+
   eye(214,102,4.6)+cheeks(204,118,0,'#f0b4b0')));

 // Camel: a single hump, a long curved neck, a gentle face with long lashes and long legs with knobbly knees.
 const Ca='#d8a867',Cad='#b98446',Cal='#f1dfb9';
 const camelLeg=(x,top,w,color)=>P(`M${x-w} ${top}C${x-w-1} ${top+20} ${x-w+1} 168 ${x-w-1} 176L${x-w+1} 192H${x+w-1}L${x+w+1} 176C${x+w-1} 168 ${x+w+1} ${top+20} ${x+w} ${top}Z`,color)+E(x,176,w+1.5,4,Cad,'opacity=".5"')+P(`M${x-w} 192H${x+w}L${x+w+4} 206H${x-w-4}Z`,Cad);
 a.camel=S(
  J('animal-tail',52,124,L('M54 124C44 132 42 148 44 162',Cad,5)+P('M40 160Q38 174 46 176Q52 168 48 160Z',Cad))+
  J('animal-leg leg-rear',80,140,camelLeg(80,134,7,Cad))+J('animal-leg leg-front',160,140,camelLeg(160,134,7,Cad))+
  P('M48 128C46 108 70 100 104 100Q142 100 166 110L174 124C172 150 148 162 108 162C74 162 50 152 48 128Z',Ca)+
  P('M76 106C72 82 82 64 100 62C118 60 134 74 138 104Z',Ca)+
  J('animal-leg leg-rear',104,140,camelLeg(104,134,8,Ca))+J('animal-leg leg-front',184,140,camelLeg(184,134,8,Ca))+
  J('animal-neck',156,126,P('M148 126C154 108 160 94 160 78C160 60 172 46 190 46L204 70C194 78 192 92 194 110C194 120 192 130 190 140Z',Ca))+
  J('animal-head',196,56,
   C(188,36,6,Ca)+C(188,37,3,'#e7a29a')+P('M184 52C184 38 196 30 210 33C226 36 244 46 248 56C250 64 242 70 232 70L202 72C190 70 184 62 184 52Z',Ca)+
   E(236,60,14,11,Cal)+C(242,56,2.2,Cad)+L('M228 66q8 3 15-2',Cad,1.8)+eye(206,52,4.6)+L('M200 46l-4-5M205 45l-1-6M210 46l3-5',ink,1.6)+cheeks(210,64,0)));

 // Koala: a fluffy grey bear-like climber with huge ears and a big dark nose, hugging a eucalyptus branch.
 const Kg='#a7b0b7',Kgd='#8a949c',Kgl='#e9ecec';
 a.koala=S(
  L('M6 184C60 176 150 180 252 164','#8a6a4a',11)+
  [[30,170,-30],[72,164,20],[200,160,-20],[236,150,30]].map(([x,y,r])=>E(x,y,17,7,'#7fae86',`transform="rotate(${r} ${x} ${y})"`)).join('')+
  J('animal-leg',100,172,E(98,184,20,10,Kgd))+J('animal-leg',162,172,E(164,184,20,10,Kgd))+
  E(130,142,46,48,Kg)+E(130,152,28,32,Kgl)+
  J('animal-paw paw-left',92,120,L('M92 122Q62 138 70 170',Kg,18)+C(70,174,10,Kgd))+
  J('animal-paw paw-right',168,120,L('M168 122Q198 106 192 72',Kg,18)+C(192,66,10,Kgd))+
  J('animal-head',130,92,
   C(72,56,26,Kg)+C(72,56,16,'#f1e4e0')+C(188,56,26,Kg)+C(188,56,16,'#f1e4e0')+
   E(130,72,50,42,Kg)+E(130,98,28,10,Kgl,'opacity="0"')+
   eye(110,66,4.4)+eye(150,66,4.4)+E(130,80,11,15,'#4b484c')+C(126,76,2.4,'#767177')+L('M118 100Q130 108 142 100','#4b484c',2.4)+cheeks(100,86,60)));

 // Sheep: a cloud of curly wool, a dark face with sideways ears, and slim dark legs.
 const Wl='#f6f1e3',Wld='#e1d9c4',Sh='#4c4749';
 const woolBlobs=[[62,122,20],[74,102,22],[98,92,24],[124,88,25],[150,94,23],[170,110,21],[176,134,20],[158,152,22],[130,158,23],[102,158,22],[76,148,21]];
 a.sheep=S(
  C(48,118,11,Wl)+
  J('animal-leg leg-rear',84,146,leg(84,146,5.5,Sh))+J('animal-leg leg-front',152,146,leg(152,146,5.5,Sh))+
  E(118,126,62,38,Wl)+woolBlobs.map(([x,y,r])=>C(x,y,r,Wl)).join('')+
  woolBlobs.slice(0,6).map(([x,y,r])=>C(x+r*.35,y+r*.35,r*.4,Wld,'opacity=".55"')).join('')+
  J('animal-leg leg-rear',104,148,leg(104,148,5.5,Sh))+J('animal-leg leg-front',170,148,leg(170,148,5.5,Sh))+
  J('animal-head',182,112,
   E(172,104,16,6,Sh,'transform="rotate(-24 172 104)"')+E(210,100,14,6,Sh,'transform="rotate(14 210 100)"')+
   E(198,118,25,28,Sh,'transform="rotate(-8 198 118)"')+C(184,92,12,Wl)+C(202,88,11,Wl)+C(194,98,10,Wl)+
   eye(190,112,4.4,'#fff')+eye(212,112,4.4)+E(204,134,9,6,'#6a5558')+C(200,134,1.6,'#2f2628')+C(208,134,1.6,'#2f2628')+L('M196 142q8 4 15 0','#2f2628',1.8)));

 // Pig: a round pink body, a flat snout with two nostrils, floppy ears, a curly tail and neat little trotters.
 const Pk='#f6b2b4',Pkd='#e68f98',Pkh='#c9727c';
 const trotter=(x,top,w,color)=>P(`M${x-w} ${top}L${x-w} 196H${x+w}L${x+w} ${top}Z`,color)+P(`M${x-w} 196H${x+w}L${x+w+1} 206H${x-w-1}Z`,Pkh);
 a.pig=S(
  J('animal-tail',52,124,stroke('M54 124C40 118 34 130 44 134C52 136 52 126 46 126',Pkd,4.5,'stroke-linecap="round"'))+
  J('animal-leg leg-rear',84,150,trotter(84,150,10,Pkd))+J('animal-leg leg-front',160,150,trotter(160,150,10,Pkd))+
  E(118,138,66,46,Pk)+E(118,164,44,10,Pkd,'opacity=".45"')+
  J('animal-leg leg-rear',108,150,trotter(108,150,11,Pk))+J('animal-leg leg-front',182,150,trotter(182,150,11,Pk))+
  J('animal-head',186,126,
   P('M168 106L164 80L192 96Z',Pkd)+P('M200 94L222 76L228 104Z',Pkd)+
   E(198,126,36,32,Pk)+E(232,138,19,15,'#f39ca3')+E(226,137,3.2,4.6,Pkh)+E(238,137,3.2,4.6,Pkh)+
   eye(200,116,4.8)+L('M214 152q10 5 20 0',Pkh,2.2)+cheeks(184,134,0,'#f07f8a')));

 // Peacock: a fan of eyed feathers spread behind a blue neck, a tiny crest and thin legs.
 const fanFeather=(k)=>{
  const ang=(-170+k*14)*Math.PI/180,ox=124,oy=152,r=56,cx=(ox+Math.cos(ang)*r).toFixed(1),cy=(oy+Math.sin(ang)*r).toFixed(1),deg=(ang*180/Math.PI).toFixed(1),ex=(ox+Math.cos(ang)*(r+32)).toFixed(1),ey=(oy+Math.sin(ang)*(r+32)).toFixed(1);
  return E(cx,cy,44,12,'#3a9c85',`transform="rotate(${deg} ${cx} ${cy})"`)+E(ex,ey,10,8,'#2a6fb0')+C(ex,ey,4,'#e6bd3d');
 };
 a.peacock=S(
  `<g class="animal-wing peacock-fan" data-motion-origin="124 152" style="transform-box:view-box;transform-origin:124px 152px">`+Array.from({length:13},(_,k)=>fanFeather(k)).join('')+`</g>`+
  J('animal-leg leg-rear',120,176,L('M120 176L116 202m0 0l-8 4m8-4l0 6m0-6l8 4','#9b8f78',3.6))+J('animal-leg leg-front',146,176,L('M146 176L146 202m0 0l-8 4m8-4l0 6m0-6l8 4','#9b8f78',3.6))+
  P('M82 156C84 138 108 134 132 140C152 146 164 160 158 176C150 186 118 190 98 182C86 176 80 166 82 156Z','#2f8f86')+P('M96 168C112 182 140 184 156 172C146 186 116 192 98 182Z','#4aa99c','opacity=".7"')+
  J('animal-neck',144,150,P('M138 150C134 126 140 108 156 98L170 106C162 116 160 134 166 154Z','#2b72b4'))+
  J('animal-head',166,92,
   L('M164 74L160 56M170 72L172 52M176 74L184 56','#2b72b4',2.4)+C(160,55,3.4,'#2f8f86')+C(172,51,3.4,'#2f8f86')+C(184,55,3.4,'#2f8f86')+
   E(168,90,14,12,'#2b72b4')+E(172,88,8,5,cream)+P('M180 90L194 96L180 100Z','#d6a94a')+eye(171,89,3.4)));

 // Tortoise: a high domed shell with a plate pattern, a wrinkly neck and slow, stubby legs.
 const Ts1='#8c7b43',Ts2='#a99658',Tsk='#bcc88c',Tskd='#a1ae73';
 a.tortoise=S(
  J('animal-tail',44,176,P('M46 170L20 178L46 184Z',Tskd))+
  J('animal-leg leg-rear',74,176,P('M54 170H94V198Q96 206 84 206H62Q52 206 54 198Z',Tskd)+L('M62 203v-4M72 204v-5M82 203v-4',cream,1.6,'opacity=".7"'))+
  J('animal-leg leg-front',150,176,P('M130 170H170V198Q172 206 160 206H138Q128 206 130 198Z',Tskd)+L('M138 203v-4M148 204v-5M158 203v-4',cream,1.6,'opacity=".7"'))+
  J('animal-head',184,156,
   P('M180 150C194 142 208 130 222 130C238 130 248 142 244 154C240 166 224 168 212 168L180 170Z',Tsk)+eye(226,146,4.4)+L('M222 160q8 4 16-1','#6a7a45',2)+cheeks(216,158,0)+L('M184 156q8 8 16 0','#9fae72',2,'opacity=".6"'))+
  P('M38 172C36 118 76 84 118 84C160 84 196 116 194 172Z',Ts1)+
  P('M52 172C52 138 70 112 90 100L100 138L96 172ZM104 96C112 92 124 92 132 96L136 136L100 138ZM140 100C160 112 178 138 180 172L142 172L136 136Z',Ts2,'opacity=".9"')+
  P('M96 172L100 138L136 136L142 172Z',Ts2,'opacity=".9"')+
  P('M34 174H200L196 184C170 190 66 190 38 184Z','#6d5f32'));

 // Snake: a friendly green coil with diamond marks, a raised S-curved neck and a flicking tongue.
 const Sn='#80b46a',Snd='#4e8a4c',Snl='#ecefb4';
 a.snake=S(
  E(120,192,80,15,Sn)+E(120,174,64,15,Sn)+E(120,156,48,14,Sn)+
  [[60,192],[92,200],[150,200],[184,190],[78,176],[108,184],[142,182],[170,172],[96,160],[126,166],[150,158]].map(([x,y])=>P(`M${x-6} ${y}L${x} ${y-6}L${x+6} ${y}L${x} ${y+6}Z`,Snd,'opacity=".7"')).join('')+
  stroke('M104 152C60 142 70 92 118 88C164 84 172 60 152 46',Sn,26,'stroke-linecap="round"')+
  stroke('M104 152C60 142 70 92 118 88C164 84 172 60 152 46',Snl,8,'stroke-linecap="round" stroke-dasharray="1 16" opacity=".8"')+
  J('animal-tail',200,196,stroke('M196 196C220 200 236 190 240 176',Sn,12,'stroke-linecap="round"'))+
  J('animal-head',152,52,
   E(168,46,26,18,Sn,'transform="rotate(-8 168 46)"')+E(170,52,18,8,Snl,'opacity=".7"')+eye(166,40,4.8)+eye(180,39,0.1)+L('M187 52q-4 3-9 2',Snd,1.6)+L('M192 50l18-2m-8 1l8 6m-8-6l8-7',rose,2.2,'class="animal-mouth" data-motion-origin="190 50"')+cheeks(160,50,0)));

 // Lemur: grey fur, a white face with dark eye patches, and the long black-and-white ringed tail held high.
 const Lg='#a1a8b1',Lgd='#7c848e',Lw='#f6f4ee',Lk='#34383d';
 const lemurTail='M102 174C90 178 78 178 70 176C18 176 6 112 44 74C64 54 88 62 78 88';
 a.lemur=S(
  J('animal-tail',100,172,stroke(lemurTail,Lw,15,'stroke-linecap="round"')+bands(lemurTail,Lk,15,'9 10'))+
  J('animal-leg',104,188,E(106,184,18,14,Lg)+E(108,198,24,8,Lgd))+J('animal-leg',150,188,E(150,182,18,14,Lg)+E(158,198,24,8,Lgd))+
  E(122,146,40,46,Lg)+E(130,158,24,32,Lw)+
  J('animal-paw paw-left',116,134,L('M116 136Q108 164 124 184',Lg,14)+C(126,186,7,Lgd))+
  J('animal-paw paw-right',146,134,L('M146 138Q154 160 148 184',Lg,14)+C(148,187,7,Lgd))+
  J('animal-head',144,98,
   C(122,68,10,Lg)+C(122,68,5,'#f1d2cf')+C(168,66,10,Lg)+C(168,66,5,'#f1d2cf')+
   E(146,86,28,26,Lg)+E(158,96,20,14,Lw)+
   E(136,84,10,8,Lk,'transform="rotate(30 136 84)"')+E(158,82,10,8,Lk,'transform="rotate(-30 158 82)"')+
   C(136,84,3.6,'#e8b040')+C(158,82,3.6,'#e8b040')+C(136,84,1.6,Lk)+C(158,82,1.6,Lk)+
   E(176,98,6,4.6,Lk)+L('M164 104q6 4 12 0',Lk,1.8)));

 Object.assign(AdventureArt.animals,a);
})();
