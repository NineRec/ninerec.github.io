/* Original picture-book vectors. Each articulated group owns a real joint. */
(() => {
  'use strict';
  const colors={ink:'#345747',cream:'#fff2d2',gold:'#e8b95e',green:'#88ab79',mint:'#8fbdad',blue:'#79a7b4',rose:'#d78e85',brown:'#ad8058',peach:'#f2c7a4'};
  const path=(d,fill,attr='')=>`<path d="${d}" fill="${fill}" ${attr}/>`;
  const line=(d,color=colors.ink,width=3,attr='')=>path(d,'none',`stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${attr}`);
  const ellipse=(x,y,rx,ry,fill,attr='')=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" ${attr}/>`;
  const circle=(x,y,r,fill,attr='')=>ellipse(x,y,r,r,fill,attr);
  const svg=(body,view='0 0 260 220')=>`<svg viewBox="${view}" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  const joint=(name,x,y,body)=>`<g class="${name}" data-motion-origin="${x} ${y}" style="transform-box:view-box;transform-origin:${x}px ${y}px">${body}</g>`;
  const eyes=(x,y,gap=25)=>`<g class="creature-eyes">${ellipse(x,y,4,5,colors.ink)+ellipse(x+gap,y,4,5,colors.ink)+circle(x+1,y-2,1.4,colors.cream)+circle(x+gap+1,y-2,1.4,colors.cream)}</g>`;
  const smile=(x,y,width=22)=>line(`M${x} ${y}q${width/2} 10 ${width} 0`,colors.ink,2.5,`class="animal-mouth" data-motion-origin="${x+width/2} ${y}"`);
  const cheek=(x,y)=>ellipse(x,y,7,4,colors.rose,'opacity=".38"');
  const leaf=(x,y,scale=1)=>`<g transform="translate(${x} ${y}) scale(${scale})">${path('M0 0C-3-27 27-38 42-34C42-12 19 4 0 0Z',colors.green)+line('M0 0L33-28','#65895d',2)}</g>`;
  window.StoryPaint={...colors,path,line,ellipse,circle,svg,joint,eyes,smile,cheek,leaf};
  const wing=(side)=>`<g class="wing-${side}">${path(side==='left'?'M117 87C86 20 30 12 18 45C3 79 40 103 113 106C55 88 28 124 48 148C72 176 109 145 120 108Z':'M123 87C154 20 210 12 222 45C237 79 200 103 127 106C185 88 212 124 192 148C168 176 131 145 120 108Z',colors.gold)}${ellipse(side==='left'?61:179,66,23,18,'#f5d697')}${ellipse(side==='left'?77:163,127,15,13,colors.rose)}${circle(side==='left'?55:185,63,6,'#b17b52')}${circle(side==='left'?80:160,126,4,'#b17b52')}</g>`;
  const butterfly=wing('left')+wing('right')+ellipse(120,98,7,38,colors.ink)+circle(120,66,9,colors.ink)+line('M117 61q-10-17-19-18M123 61q10-17 19-18',colors.ink,2.5)+circle(98,43,3,colors.ink)+circle(142,43,3,colors.ink);
  const caterpillar=Array.from({length:7},(_,i)=>circle(43+i*30,99-i*5,23+i*2,['#99b878','#a4c585','#96b875'][i%3])).join('')+Array.from({length:6},(_,i)=>line(`M${43+i*31} ${113-i*4}l-1 12`,colors.ink,5)).join('')+circle(231,65,33,'#b5ce91')+line('M213 39q-9-14-7-21M236 35q7-15 15-17','#759454',3)+eyes(223,62,22)+smile(224,78,20)+cheek(212,78)+cheek(248,78);
  const flower=line('M29 90V34','#7e9e66',5)+path('M29 65Q2 62 6 47Q26 45 29 65M29 75Q57 73 54 57Q33 57 29 75Z','#a3bb81')+Array.from({length:7},(_,i)=>ellipse(29,12,8,14,colors.rose,`transform="rotate(${i*360/7} 29 32)"`)).join('')+circle(29,32,10,colors.gold);
  const symbols=[
    ['leaf','0 0 160 95',path('M8 77C10 39 68 4 146 15C137 63 70 105 8 77Z','#a0bf7c')+line('M9 77L130 24M39 62l-1-25M68 49l16 26M96 37l-3-19','#6f9659',2.5)],
    ['egg','0 0 180 150',`<use href="#leaf" x="0" y="55" width="180" height="95"/>`+ellipse(93,73,29,41,'#f8edc9',`stroke="#a8b584" stroke-width="2"`)+line('M86 36Q72 70 87 108M99 35Q94 78 104 108','#d4d4aa',2)+ellipse(83,54,6,12,'#fff8df')],
    ['caterpillar','0 0 300 145',caterpillar],
    ['pupa','0 0 160 220',line('M18 24Q75 28 144 10',colors.brown,9)+line('M82 20V47','#efe6c5',3)+path('M81 46C109 58 119 83 114 109C110 144 96 164 88 192Q81 214 74 192C66 162 46 139 45 110C42 82 55 57 81 46Z','#a6c587',`stroke="#739558" stroke-width="2"`)+line('M79 58Q59 104 79 177M46 101Q81 117 115 100M53 132Q79 145 108 132','#809f64',2.5)+line('M62 72Q53 88 54 105','#d6e3b1',5)],
    ['butterfly','0 0 240 180',butterfly],['flower','0 0 60 100',flower]
  ].map(([id,view,body])=>`<symbol id="${id}" viewBox="${view}">${body}</symbol>`).join('');
  // Zoey follows the supplied portrait: black hair in two pigtails with pink ties, a round rosy face,
  // an open smile and little ears. She wears a red short-sleeved T-shirt, blue shorts and white shoes.
  const skin='#f6cba6',skinShade='#e6ad86',hair='#2c2628',tieColor='#e4488f',red='#d8473f',redShade='#b53630';
  const hairTie=(x,y)=>ellipse(x,y,11,12,tieColor)+line(`M${x-9} ${y-4}q9 4 18 0M${x-9} ${y+3}q9 4 18 0`,'#b32f70',2)+ellipse(x-3,y-5,3.2,2.2,'#f8a5ca');
  const pigtails=path('M58 62C44 58 28 66 18 80L6 92L24 88L14 112L34 100L30 128L50 100C56 92 60 80 58 62Z',hair)+path('M182 62C196 58 212 66 222 80L234 92L216 88L226 112L206 100L210 128L190 100C184 92 180 80 182 62Z',hair)+line('M44 78C30 92 24 104 20 112M196 78C210 92 216 104 220 112','#5a4e52',2.2,'opacity=".55"');
  function child(){
    return `<g class="kid-body">
      ${line('M100 298L98 350',skin,22)}${line('M142 298L144 350',skin,22)}
      ${path('M88 338h22v18H88ZM130 338h22v18h-22Z','#fdf8ee')}${line('M88 346h22M130 346h22','#eca7bf',3)}
      ${path('M80 356Q80 346 100 346L112 352Q118 366 108 372L84 372Q78 366 80 356Z','#fbf6ea')}${path('M80 369H112Q114 375 108 377H84Q78 375 80 369Z','#e4a4b8')}
      ${path('M160 356Q160 346 140 346L128 352Q122 366 132 372L156 372Q162 366 160 356Z','#fbf6ea')}${path('M160 369H128Q126 375 132 377H156Q162 375 160 369Z','#e4a4b8')}
      ${path('M84 262Q121 276 158 262L163 306Q143 316 125 306L121 292L117 306Q99 316 79 306Z','#6e90b4')}${line('M121 292V305','#557596',2.5)}${line('M92 276Q105 281 117 280','#8fb0cf',2.5,'opacity=".7"')}
      ${path('M108 150H134V174H108Z',skinShade)}
      ${joint('kid-arm left',88,165,path('M94 164Q72 162 64 184Q70 197 86 199Q98 187 101 172Z',red)+path('M70 190Q82 196 90 196L88 190Z',redShade,'opacity=".55"')+line('M77 192Q71 213 69 234',skin,18)+circle(68,242,10.5,skin))}
      ${joint('kid-arm right',154,165,path('M146 164Q168 162 176 184Q170 197 154 199Q142 187 139 172Z',red)+path('M170 190Q158 196 150 196L152 190Z',redShade,'opacity=".55"')+line('M163 192Q169 213 171 234',skin,18)+circle(172,242,10.5,skin))}
      ${path('M92 168Q121 158 150 168C156 198 160 236 160 266Q121 280 82 266C82 236 86 198 92 168Z',red)}${line('M83 262Q121 275 159 262',redShade,3.5)}${line('M104 190Q108 214 105 240',redShade,3,'opacity=".22"')}
      ${path('M103 164Q121 188 139 164Q121 174 103 164Z',skinShade)}${line('M102 163Q121 190 140 163',redShade,5)}
      <g class="kid-head">${pigtails}
        ${path('M62 102C56 50 84 22 120 22C156 22 184 50 178 102C176 120 170 130 160 136L80 136C70 130 64 120 62 102Z',hair)}
        ${ellipse(66,110,8,12,skin)}${ellipse(174,110,8,12,skin)}${ellipse(67,111,4,7,skinShade)}${ellipse(173,111,4,7,skinShade)}
        ${path('M68 98C68 62 92 50 120 50C148 50 172 62 172 98C172 132 150 156 120 156C90 156 68 132 68 98Z',skin)}
        ${ellipse(88,124,12,8,'#ef8f86','opacity=".5"')}${ellipse(152,124,12,8,'#ef8f86','opacity=".5"')}
        <g class="kid-eyes">${ellipse(101,108,5.4,6.8,'#2b1e1c')+ellipse(139,108,5.4,6.8,'#2b1e1c')+circle(103,105.5,1.9,'#fff')+circle(141,105.5,1.9,'#fff')}</g>
        ${line('M92 97q9-5 18 0M130 97q9-5 18 0',hair,2.4,'opacity=".8"')}${line('M117 121q3 4 7 0',skinShade,2.4)}
        ${path('M102 131Q120 153 138 131Q120 139 102 131Z','#b4443f')}${path('M107 133.5Q120 142 133 133.5L131 138Q120 146 109 138Z','#fffaf0')}
        ${path('M64 108C56 56 84 24 122 24C162 24 186 54 176 108C174 94 170 86 166 78C160 86 152 84 146 76C140 88 130 84 124 72C116 86 104 84 96 76C92 86 82 90 78 82C72 92 68 100 64 108Z',hair)}
        ${line('M100 78q-3 12-7 20M141 80q5 9 3 21M121 74q-1 8-4 14',hair,2.4,'opacity=".9"')}${line('M80 52Q100 34 126 32',hairHi,3,'opacity=".5"')}
        ${pigtailTies()}</g></g>`;
  }
  const hairHi='#52474b',pigtailTies=()=>hairTie(52,72)+hairTie(188,72);
  // The grown-up is a separate character: gentle bun, sage cardigan and long trousers.
  function adult(){
    const h='#7a5238',top='#9fba92',topShade='#7f9d76',pants='#5f7f78';
    return `<g class="kid-body">${line('M104 270L100 346',pants,25)}${line('M138 270L142 346',pants,25)}
      ${path('M78 350Q78 340 100 340L112 348Q118 364 108 370L82 370Q76 362 78 350Z','#a66f4c')}${path('M162 350Q162 340 140 340L128 348Q122 364 132 370L158 370Q164 362 162 350Z','#a66f4c')}
      ${path('M108 150H134V174H108Z',skinShade)}
      ${joint('kid-arm left',88,165,line('M88 170Q66 202 66 236',top,21)+line('M66 228L65 238',topShade,21)+circle(66,246,10,skin))}
      ${joint('kid-arm right',154,165,line('M154 170Q176 202 176 236',top,21)+line('M176 228L177 238',topShade,21)+circle(176,246,10,skin))}
      ${path('M90 166Q121 156 152 166C159 200 161 236 159 276Q121 288 83 276C81 236 83 200 90 166Z',top)}${path('M104 164Q121 186 138 164Q121 172 104 164Z',skinShade)}${line('M121 178V282',topShade,2.5,'opacity=".6"')}${path('M92 244h24v28q-12 5-24 0ZM126 244h24v28q-12 5-24 0Z',topShade,'opacity=".5"')}
      <g class="kid-head"><g transform="translate(120 150) scale(.9) translate(-120 -150)">
        ${circle(120,20,19,h)}${path('M64 104C56 50 84 24 120 24C156 24 184 50 176 104C177 118 174 130 166 138L74 138C66 130 63 118 64 104Z',h)}
        ${ellipse(68,112,7,11,skin)}${ellipse(172,112,7,11,skin)}
        ${path('M70 98C70 64 92 52 120 52C148 52 170 64 170 98C170 132 150 156 120 156C90 156 70 132 70 98Z',skin)}
        ${path('M66 100C60 56 88 30 122 30C158 30 184 56 174 100C170 82 160 72 148 66C136 78 112 76 94 64C80 74 70 86 66 100Z',h)}
        <g class="kid-eyes">${ellipse(101,108,4.6,6,'#2b1e1c')+ellipse(139,108,4.6,6,'#2b1e1c')+circle(102.5,106,1.6,'#fff')+circle(140.5,106,1.6,'#fff')}</g>
        ${line('M92 97q9-5 18 0M130 97q9-5 18 0',h,2.2)}${line('M117 121q3 4 7 0',skinShade,2.4)}${ellipse(88,124,10,6.5,'#ef8f86','opacity=".4"')}${ellipse(152,124,10,6.5,'#ef8f86','opacity=".4"')}${line('M105 134Q121 148 137 134',redShade,3.2)}
      </g></g></g>`;
  }
  function kid(grownup=false){return svg(grownup?adult():child(),'0 0 240 400');}
  window.AdventureArt={symbols,kid,grownup:()=>kid(true),animals:{}};
})();
