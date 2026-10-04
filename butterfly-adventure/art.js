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
  function kid(grownup=false){
    return svg(`<g class="kid-body">${path('M95 260Q91 292 89 332L86 367Q97 374 109 367L122 278L133 367Q148 374 159 367L149 265Z',grownup?'#667f75':'#6c8e87')}${ellipse(96,369,18,6,'#ad7b50')}${ellipse(147,369,18,6,'#ad7b50')}
      ${path('M105 125H135V161H105Z',colors.peach)}${joint('kid-arm left',88,165,line('M88 165Q63 199 65 229',grownup?'#a6b995':'#d98967',20)+line('M65 229l-5 11',colors.peach,15))}${joint('kid-arm right',154,165,line('M154 165Q176 187 180 227',grownup?'#a6b995':'#d98967',20)+line('M180 227l5 12',colors.peach,15))}
      ${path('M95 147Q120 138 148 148C163 180 161 220 158 266Q123 281 85 266C82 222 79 184 95 147Z',grownup?'#a6b995':'#d98967')}${path('M105 147l15 19l15-19','#efc49a')}${path('M98 218h44v29q-20 9-44 0Z','#c47758')}
      <g class="kid-head">${path('M72 123C59 91 61 38 111 30C163 21 191 55 176 123L162 142L80 139Z','#936348')}${ellipse(120,90,48,55,colors.peach)}${path('M73 75Q76 26 118 33Q165 23 170 76Q137 67 127 47Q109 72 73 75Z','#936348')}${path('M159 119q8 12 5 25l-16 1l1-23','#936348')}${path('M80 116q-8 16-2 29l16-2l-2-23','#936348')}
      <g class="kid-eyes">${eyes(102,89,34)}</g>${cheek(88,108)}${cheek(151,108)}${smile(106,111,28)}${path('M72 44Q116 6 167 43L166 56Q116 36 72 57Z','#afbd85')}${line('M78 45Q115 29 162 45','#6d8b64',4)}</g></g>`,'0 0 240 400');
  }
  window.AdventureArt={symbols,kid,grownup:()=>kid(true),animals:{}};
})();
