/* Pictures for the two puzzle games: friends to connect and fruit/vegetable/vehicle tiles to match.
 * Same soft paint box as the other toys. Registered as playthings so the material gallery can move them. */
(() => {
 'use strict';
 const {path:P,line:L,ellipse:E,circle:C,svg:S,joint:J,eyes,smile,ink,cream,gold,green,mint,blue,rose,brown,peach}=StoryPaint;
 const moving=body=>J('toy-moving',130,110,body);
 const hi=(d,w=5)=>L(d,'#ffffff',w,'opacity=".4"');
 const leafAt=(x,y,r=0,s=1,color=green,vein='#65895d')=>`<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">${P('M0 0C-20-28-2-62 32-72C48-40 30-6 0 0Z',color)}${L('M2-4C10-26 20-46 29-64',vein,2.4,'opacity=".7"')}</g>`;
 const wheel=(x,y=173,r=23)=>C(x,y,r,'#61786b')+C(x,y,r*.52,'#d6d5bb')+C(x,y,r*.17,'#91a18a');
 const bodyCar=(color)=>P('M30 119L68 65Q72 58 80 58H153Q162 58 168 68L200 112H222Q237 112 237 130V175H25V136Q25 120 30 119Z',color);

 /* ---------- fruit ---------- */
 const watermelon=S(moving(
  P('M22 96H238C234 164 190 204 130 204C70 204 26 164 22 96Z','#6fa35e')+
  P('M32 96H228C224 156 184 194 130 194C76 194 36 156 32 96Z','#d9e8a9')+
  P('M40 96H220C216 150 180 184 130 184C80 184 44 150 40 96Z','#e0646a')+
  P('M30 96H230','none','stroke="#fff6d8" stroke-width="5" stroke-linecap="round"')+
  [[84,122,-20],[118,138,10],[152,122,20],[184,134,-12],[104,164,0],[160,160,-8]].map(([x,y,r])=>E(x,y,5,9,'#3d3a36',`transform="rotate(${r} ${x} ${y})"`)).join('')+
  hi('M52 112Q60 150 86 172')));
 const grapes=S(moving(
  `<g transform="translate(0 12)">`+L('M134 46Q132 62 128 78',brown,8)+leafAt(134,52,-28,.6,'#88ab79')+
  [[82,84,'#9b7bbd'],[121,82,'#8a69ad'],[160,84,'#9b7bbd'],[199,86,'#8a69ad'],[100,114,'#8a69ad'],[140,114,'#9b7bbd'],[180,116,'#8a69ad'],[120,146,'#9b7bbd'],[160,146,'#8a69ad'],[140,178,'#9b7bbd']].map(([x,y,c])=>C(x,y,21,c)+E(x-7,y-8,5,3,'#ffffff','opacity=".4" transform="rotate(-30 '+(x-7)+' '+(y-8)+')"')).join('')+`</g>`));
 const pear=S(moving(
  P('M130 44C150 44 150 66 157 84C164 102 198 116 198 152C198 186 168 206 130 206C92 206 62 186 62 152C62 116 96 102 103 84C110 66 110 44 130 44Z','#b8cc6a')+
  P('M130 44C150 44 150 66 157 84C164 102 198 116 198 152C198 186 168 206 130 206C150 190 160 150 150 110C146 90 140 60 130 44Z','#a3b95a','opacity=".55"')+
  L('M130 46Q128 30 138 20',brown,7)+leafAt(134,34,50,.75)+hi('M86 142Q80 168 100 186')+
  [[108,150],[150,168],[124,184],[142,136]].map(([x,y])=>C(x,y,2.4,'#8ea04a')).join('')));
 const cherries=S(moving(
  L('M88 132Q94 78 140 38',brown,5)+L('M172 124Q168 78 140 38',brown,5)+leafAt(142,40,40,.9)+
  C(88,164,32,'#d3475a')+C(172,154,32,'#c23d52')+E(76,150,7,5,'#fff','opacity=".4" transform="rotate(-30 76 150)"')+E(160,140,7,5,'#fff','opacity=".4" transform="rotate(-30 160 140)"')+
  C(88,134,4,'#8f2a3a')+C(172,124,4,'#8f2a3a')));
 const lemon=S(moving(
  `<g transform="rotate(-18 130 118)">`+P('M24 118Q26 76 88 64Q130 58 172 66Q232 80 238 118Q232 156 172 168Q130 176 88 168Q26 158 24 118Z','#efd45f')+C(22,118,9,'#e5c24a')+C(240,118,9,'#e5c24a')+
  P('M60 90Q90 72 130 70Q110 80 70 112Z','#fff6c0','opacity=".5"')+[[96,128],[140,140],[184,104],[168,142],[110,98]].map(([x,y])=>C(x,y,2.2,'#d7b53f')).join('')+`</g>`+
  leafAt(150,62,20,.8)));
 /* ---------- vegetables ---------- */
 const corn=S(moving(
  `<g transform="rotate(14 130 110)">`+E(130,98,36,76,'#f0c75c')+
  [[-24,-8],[-8,-8],[8,-8],[24,-8]].map(([dx])=>L(`M${130+dx} 36V160`,'#d9a93e',2.2,'opacity=".7"')).join('')+
  [50,72,94,116,138].map(y=>L(`M96 ${y}Q130 ${y+6} 164 ${y}`,'#d9a93e',2.2,'opacity=".7"')).join('')+
  hi('M108 50Q100 100 112 140',6)+
  P('M130 206C86 190 70 140 86 96C100 130 118 156 130 206Z','#88ab79')+P('M130 206C174 190 190 140 174 96C160 130 142 156 130 206Z','#7a9f6c')+P('M130 206C112 176 112 140 122 112C132 142 140 176 130 206Z','#9bbd88')+`</g>`));
 const eggplant=S(moving(
  P('M150 62C204 74 218 124 192 170C172 204 120 212 92 184C64 158 80 102 110 80C126 68 138 64 150 62Z','#7b5a9e')+
  P('M150 62C204 74 218 124 192 170C180 190 160 202 138 206C176 170 186 112 150 62Z','#664a86','opacity=".55"')+hi('M110 110Q96 140 108 170',6)+
  P('M104 64Q120 36 148 50Q162 56 170 76Q138 86 104 64Z','#7fa86d')+L('M120 54L112 78M138 56L136 82M156 62L162 80','#689259',2.4)+L('M140 52Q148 30 164 24',green,9)));
 const mushroom=S(moving(
  P('M90 122Q90 196 112 202H148Q170 196 170 122Q130 138 90 122Z','#ead9b6','stroke="#d3bd90" stroke-width="2.5"')+P('M96 150Q130 162 164 150L166 130Q130 144 94 130Z','#d9c49b','opacity=".6"')+
  P('M24 124C24 62 74 26 130 26C186 26 236 62 236 124Q130 142 24 124Z','#d9695d')+
  [[80,78,15],[132,58,17],[184,80,14],[108,106,10],[160,108,11],[56,108,8],[208,110,8]].map(([x,y,r])=>C(x,y,r,cream)).join('')+hi('M46 104Q58 64 92 44',6)));
 const pumpkin=S(moving(
  E(86,128,44,62,'#e08f42')+E(174,128,44,62,'#e08f42')+E(130,128,48,70,'#eba24f')+
  L('M130 62Q116 128 130 196',"#c97a31",3,'opacity=".7"')+L('M96 74Q70 128 96 190M164 74Q190 128 164 190','#c97a31',3,'opacity=".6"')+hi('M104 84Q90 120 104 160',6)+
  P('M118 66Q122 36 142 30Q146 52 142 68Z',brown)+L('M142 34Q164 24 172 40',green,5)+leafAt(146,56,70,.7)));
 const radish=S(moving(
  leafAt(130,96,-38,1.1)+leafAt(130,96,0,1.25,'#7eab6d')+leafAt(130,96,38,1.1)+
  P('M130 92C176 92 200 122 184 154C172 178 150 200 130 214C110 200 88 178 76 154C60 122 84 92 130 92Z','#d9606e')+
  P('M130 214C142 206 156 190 166 172Q130 184 94 172C104 190 118 206 130 214Z','#f6e6e4')+hi('M92 128Q86 144 94 160',6)));
 /* ---------- vehicles ---------- */
 const firetruck=S(moving(
  P('M18 98H170V172H18Z','#d56b5a')+P('M170 84H208Q224 84 230 106L240 128V172H170Z','#d56b5a')+P('M180 94H206Q216 94 220 106L224 122H180Z','#dce8d6')+
  L('M24 126H236','#f0d27a',6)+L('M26 90H164',gold,6)+L('M26 78H164',gold,6)+[40,62,84,106,128,150].map(x=>L(`M${x} 78V90`,gold,4)).join('')+
  C(60,120,12,'#c25a49')+L('M60 108V132M48 120H72','#e9a89b',3)+P('M186 70H204V82H186Z','#e8b95e')+C(195,70,5,'#79a7b4')+
  P('M230 140H242V152H230Z','#e8b95e')+wheel(64)+wheel(200)));
 const policecar=S(moving(
  bodyCar('#f1efe4')+P('M25 138H237V158H25Z','#6f98b8')+P('M77 72H108V110H54ZM120 72H148L179 110H120Z','#dce8d6')+L('M114 119V157','#c9c6b8',4)+
  P('M100 46H116V60H100Z','#d56b5a')+P('M116 46H132V60H116Z','#6f98b8')+L('M30 142H47M219 142H233',gold,7)+
  P('M154 124L158 134L168 134L160 140L163 150L154 144L145 150L148 140L140 134L150 134Z','#e8b95e')+wheel(72)+wheel(188)));
 const ambulance=S(moving(
  P('M22 62Q22 52 34 52H160V172H22Z','#f4f1e6')+P('M160 82H204Q220 82 228 102L238 128V172H160Z','#f4f1e6')+P('M170 92H202Q212 92 216 104L220 122H170Z','#dce8d6')+
  P('M74 76H98V96H118V120H98V140H74V120H54V96H74Z','#d56b5a')+L('M24 150H236','#d56b5a',7)+P('M184 62H204V74H184Z','#d56b5a')+P('M200 62H216V74H200Z','#79a7b4')+
  P('M230 140H242V152H230Z','#e8b95e')+wheel(64)+wheel(196)));
 const airplane=S(moving(
  P('M116 112L88 176L124 178L172 114Z','#9fb7c7')+P('M34 112C24 108 22 60 22 52L64 52L86 104Z','#6f98b8')+
  P('M24 120Q24 94 62 90L196 84Q240 84 242 110Q240 134 196 136L62 144Q24 144 24 120Z','#f1efe4')+
  P('M196 84Q240 84 242 110Q240 134 196 136Q216 112 196 84Z','#6f98b8')+P('M60 122H214','none','stroke="#6f98b8" stroke-width="5"')+
  [88,112,136,160].map(x=>C(x,108,7,'#a9c9d8')).join('')+P('M184 90Q204 86 214 98L196 106Z','#a9c9d8')+
  P('M98 104L132 38L158 40L132 108Z','#b9ccd8')));
 const train=S(moving(
  P('M70 88H182V162H70Z','#6a9c7e')+P('M176 66H236V170H176Z','#d56b5a')+P('M170 56H242V70H170Z','#4f5f58')+P('M188 80H224V114H188Z','#dce8d6')+
  P('M84 62H112V90H84Z','#4f5f58')+P('M76 54H120L112 64H84Z','#4f5f58')+C(146,88,17,'#f0d27a')+L('M70 124H176','#f0d27a',6)+
  C(110,48,12,'#ffffffcc')+C(130,34,15,'#ffffffa0')+C(154,24,12,'#ffffff80')+
  P('M56 150L74 156V176H50Z','#4f5f58')+C(104,172,24,'#4f5f58')+C(104,172,13,'#d6d5bb')+C(156,172,24,'#4f5f58')+C(156,172,13,'#d6d5bb')+C(210,178,17,'#4f5f58')+C(210,178,9,'#d6d5bb')+L('M104 172H210','#d9a93e',4)));
 const boat=S(moving(
  L('M130 26V152',brown,6)+P('M138 34Q198 78 200 140H138Z',cream)+P('M122 52Q80 92 64 140H122Z','#e6d6a0')+P('M130 26L158 34L130 44Z','#d56b5a')+
  P('M28 148H232Q216 194 170 198H90Q44 194 28 148Z','#c97f5f')+L('M42 162H218','#e8b95e',5)+
  P('M12 196Q40 184 68 196T124 196T180 196T236 196V214H12Z','#8fbfd2')+P('M12 206Q40 196 68 206T124 206T180 206T236 206V218H12Z','#79a7b4','opacity=".7"')));
 const bicycle=S(moving(
  C(70,148,42,'none','stroke="#4f6f63" stroke-width="8"')+C(192,148,42,'none','stroke="#4f6f63" stroke-width="8"')+C(70,148,6,'#d6d5bb')+C(192,148,6,'#d6d5bb')+
  [0,45,90,135].map(a=>L('M70 148m-36 0h72','#a8b79c',2,`transform="rotate(${a} 70 148)"`)+L('M192 148m-36 0h72','#a8b79c',2,`transform="rotate(${a} 192 148)"`)).join('')+
  L('M70 148L108 84L168 84L192 148M108 84L128 148L70 148M128 148L168 84','#d9795f',8)+L('M98 70H126',ink,9)+P('M92 62Q108 56 128 62L124 72H96Z','#3f5a4c')+L('M168 84L176 54M164 54H190',ink,7)+C(128,148,10,'#e8b95e')));
 /* ---------- friends to connect ---------- */
 const flame=S(moving(
  P('M130 16C142 54 190 82 190 132C190 176 162 204 130 204C98 204 70 176 70 132C70 104 86 88 96 68C102 92 114 94 116 78C118 58 116 36 130 16Z','#e8764f')+
  P('M130 70C140 98 166 112 166 144C166 172 150 190 130 190C110 190 94 172 94 144C94 124 108 112 112 96C120 112 128 106 128 94C128 86 126 78 130 70Z','#f6b955')+
  P('M130 118C138 134 148 142 148 160C148 176 140 184 130 184C120 184 112 176 112 160C112 148 122 140 130 118Z','#fbe38b')+
  hi('M88 128Q82 150 92 170',6)));
 const police=S(
  P('M62 220Q62 156 130 148Q198 156 198 220Z','#6f8fae')+P('M108 148H152L130 176Z',cream)+P('M130 160L124 172L130 206L136 172Z','#3f5f80')+P('M62 190H198V220H62Z','#6280a0','opacity=".5"')+C(88,176,5,gold)+
  moving(E(130,104,38,42,peach)+E(93,108,6,10,peach)+E(167,108,6,10,peach)+
  P('M86 88Q90 40 130 38Q170 40 174 88Z','#3f5f80')+P('M80 90H180Q176 100 130 102Q84 100 80 90Z','#2e4a66')+P('M122 54H138L136 74H124Z','#e8b95e')+C(130,62,9,gold)+
  eyes(114,106,32)+smile(116,122,28)+E(102,118,7,4,rose,'opacity=".4"')+E(158,118,7,4,rose,'opacity=".4"')));
 const bamboo=S(moving(
  [[88,'#8bb26b'],[130,'#7da95f'],[172,'#93b974']].map(([x,c],i)=>L(`M${x} ${208}V${20+i*12}`,c,26)+[48,92,136,178].map(y=>L(`M${x-14} ${y+i*8}H${x+14}`,'#5d8a4a',5)).join('')+L(`M${x-8} ${40+i*12}V190`,'#ffffff',4,'opacity=".25"')).join('')+
  leafAt(100,56,-60,.9,'#8bb26b','#5d8a4a')+leafAt(154,40,60,.9,'#7da95f','#5d8a4a')+leafAt(186,92,70,.8,'#93b974','#5d8a4a')+leafAt(72,110,-70,.8,'#7da95f','#5d8a4a')));
 const honey=S(moving(
  P('M70 74H190Q216 98 210 150Q204 198 130 202Q56 198 50 150Q44 98 70 74Z','#e6a43f')+P('M70 74H190Q216 98 210 150Q204 198 130 202Q150 170 156 130Q160 96 150 74Z','#d18d2d','opacity=".5"')+
  hi('M70 108Q62 146 74 178',6)+P('M92 112H168V160H92Z','#fbefce')+P('M130 120l9 5v10l-9 5l-9-5v-10Z','#e6a43f')+
  P('M60 64H200V84H60Z',brown)+P('M60 64H200V70H60Z','#c4966a')+P('M80 84Q80 112 92 112Q100 112 100 90Z','#e6a43f')+P('M150 84Q156 106 166 104Q174 100 168 84Z','#e6a43f')));
 const leaf=S(moving(
  L('M38 196Q104 164 214 66',brown,10)+L('M96 170Q92 140 74 124M144 134Q150 100 136 80',brown,5)+
  leafAt(70,126,-50,1.2)+leafAt(130,152,40,1.15,'#7ca36d')+leafAt(138,82,-20,1.25)+leafAt(180,98,60,1.1,'#7ca36d')+leafAt(212,68,10,1.15)));
 const peanut=S(moving(
  `<g transform="rotate(32 130 114)">`+P('M130 20C170 20 186 54 174 86C166 106 162 112 174 134C188 166 170 208 130 208C90 208 72 166 86 134C98 112 94 106 86 86C74 54 90 20 130 20Z','#d9b682')+
  P('M130 20C170 20 186 54 174 86C168 100 164 108 166 118Q130 104 94 118C96 108 92 100 86 86C74 54 90 20 130 20Z','#e6cb9b','opacity=".6"')+
  [[108,46],[132,38],[152,52],[116,70],[142,76],[110,160],[134,152],[154,168],[118,184],[142,190],[128,172]].map(([x,y])=>C(x,y,2.8,'#b8935f')).join('')+
  L('M92 120Q130 138 168 120','#b8935f',3.4,'opacity=".85"')+hi('M104 36Q92 56 100 80',5)+`</g>`));
 const moon=S(moving(
  P('M168 24C106 26 66 78 78 134C90 190 152 212 208 182C150 190 118 146 130 98C138 64 152 40 168 24Z','#f3e0a0')+
  P('M168 24C106 26 66 78 78 134C86 170 116 194 152 200C112 176 100 130 112 92C122 60 142 36 168 24Z','#e8cf82','opacity=".5"')+
  L('M96 108Q106 100 116 108',ink,3)+L('M98 136Q112 148 126 136',ink,3)+E(94,122,7,4,rose,'opacity=".45"'))+
  [[190,56,9],[210,118,7],[176,176,6]].map(([x,y,r])=>P(`M${x} ${y-r}Q${x} ${y} ${x+r} ${y}Q${x} ${y} ${x} ${y+r}Q${x} ${y} ${x-r} ${y}Q${x} ${y} ${x} ${y-r}Z`,gold)).join(''));
 const ball=(()=>{const slices=Array.from({length:6},(_,i)=>{const a=i*60-90,b=a+60,r=72,p=t=>`${(130+r*Math.cos(t*Math.PI/180)).toFixed(1)} ${(112+r*Math.sin(t*Math.PI/180)).toFixed(1)}`;return P(`M130 112L${p(a)}A${r} ${r} 0 0 1 ${p(b)}Z`,['#d9795f','#f6e3b0','#79a7b4'][i%3]);}).join('');
  return S(moving(slices+C(130,112,72,'none','stroke="#ffffff55" stroke-width="3"')+C(130,112,10,cream)+hi('M80 84Q92 62 118 52',7)));})();
 const butterfly=`<svg viewBox="0 0 240 180" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">${AdventureArt.symbols.match(/<symbol id="butterfly"[^>]*>([\s\S]*?)<\/symbol>/)[1]}</svg>`;

 const pieces={watermelon,grapes,pear,cherries,lemon,corn,eggplant,mushroom,pumpkin,radish,firetruck,policecar,ambulance,airplane,train,boat,bicycle,flame,police,bamboo,honey,leaf,peanut,moon,ball,butterfly};
 Object.assign(AdventureArt.playthings,pieces);
 // Chinese names, used for screen readers and to describe each move.
 AdventureArt.puzzleNames={
  lion:'狮子',bear:'小熊',panda:'大熊猫',deer:'小鹿',rabbit:'小兔子',monkey:'小猴子',owl:'猫头鹰',duck:'小鸭子',penguin:'企鹅',clownfish:'小丑鱼',shark:'鲨鱼',whale:'鲸鱼',octopus:'章鱼',jellyfish:'水母',pufferfish:'河豚',seal:'小海豹',crab:'螃蟹',starfish:'海星',
  tiger:'老虎',elephant:'大象',giraffe:'长颈鹿',frog:'青蛙',cow:'奶牛',fox:'狐狸',zebra:'斑马',koala:'考拉',dolphin:'海豚',turtle:'海龟',seahorse:'海马',
  banana:'香蕉',strawberry:'草莓',blueberry:'蓝莓',apple:'苹果',orange:'橙子',carrot:'胡萝卜',broccoli:'西兰花',tomato:'番茄',cucumber:'黄瓜',peas:'豌豆',milk:'牛奶',
  watermelon:'西瓜',grapes:'葡萄',pear:'梨',cherries:'樱桃',lemon:'柠檬',corn:'玉米',eggplant:'茄子',mushroom:'蘑菇',pumpkin:'南瓜',radish:'小萝卜',
  car:'小汽车',bus:'公共汽车',van:'面包车',firetruck:'消防车',policecar:'警车',ambulance:'救护车',airplane:'飞机',train:'火车',boat:'帆船',bicycle:'自行车',
  flame:'火',police:'警察',bamboo:'竹子',honey:'蜂蜜',leaf:'树叶',peanut:'花生',moon:'月亮',ball:'皮球',butterfly:'蝴蝶',flower:'花朵',rain:'乌云和雨',umbrella:'雨伞',spade:'小铲子',soil:'泥土',sun:'太阳',tulip:'郁金香'
 };
})();
