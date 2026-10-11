/* One little dictionary shared by the letter, matching and ice-cream games, plus a voice helper
 * that can say several recorded clips one after another without talking over itself. */
(() => {
 'use strict';
 const art=window.AdventureArt;
 // Picture id → the English word we say and show. The first letter is the letter a picture "starts with".
 const WORDS={
  apple:'Apple',airplane:'Airplane',ambulance:'Ambulance',angelfish:'Angelfish',
  banana:'Banana',bear:'Bear',bicycle:'Bicycle',bus:'Bus',butterfly:'Butterfly',ball:'Ball',bamboo:'Bamboo',blueberry:'Blueberry',bluetang:'Blue tang',boat:'Boat',broccoli:'Broccoli',
  cow:'Cow',crab:'Crab',cherries:'Cherries',car:'Car',camel:'Camel',carrot:'Carrot',crocodile:'Crocodile',corn:'Corn',cucumber:'Cucumber',clownfish:'Clownfish',
  duck:'Duck',deer:'Deer',dolphin:'Dolphin',
  elephant:'Elephant',eggplant:'Eggplant',
  frog:'Frog',fox:'Fox',flamingo:'Flamingo',flower:'Flower',firetruck:'Fire truck',
  giraffe:'Giraffe',gorilla:'Gorilla',grapes:'Grapes',
  hippo:'Hippo',horse:'Horse',honey:'Honey',
  icecream:'Ice cream',
  jellyfish:'Jellyfish',
  kangaroo:'Kangaroo',koala:'Koala',
  lion:'Lion',lemon:'Lemon',lobster:'Lobster',leaf:'Leaf',lemur:'Lemur',
  monkey:'Monkey',mushroom:'Mushroom',moon:'Moon',
  narwhal:'Narwhal',nest:'Nest',
  owl:'Owl',otter:'Otter',octopus:'Octopus',orange:'Orange',
  panda:'Panda',penguin:'Penguin',pig:'Pig',pear:'Pear',pumpkin:'Pumpkin',peas:'Peas',peanut:'Peanut',peacock:'Peacock',pufferfish:'Pufferfish',
  rabbit:'Rabbit',rhino:'Rhino',radish:'Radish',
  seal:'Seal',shark:'Shark',sheep:'Sheep',snake:'Snake',starfish:'Starfish',strawberry:'Strawberry',sun:'Sun',seahorse:'Seahorse',
  tiger:'Tiger',turtle:'Turtle',tomato:'Tomato',train:'Train',tulip:'Tulip',
  umbrella:'Umbrella',
  whale:'Whale',watermelon:'Watermelon',
  xylophone:'Xylophone',
  yoyo:'Yo-yo',
  zebra:'Zebra',
  // Only used by the matching game, never as a "starts with" picture.
  policecar:'Police car',van:'Van',orca:'Orca',squid:'Squid',tortoise:'Tortoise',orangutan:'Orangutan',swordfish:'Swordfish',manta:'Manta ray',stingray:'Stingray'
 };
 const piece=id=>art.animals[id]||art.playthings[id]||art.food[id]||art.vehicles?.[id]||'';
 const letterOf=id=>(WORDS[id]||id)[0].toUpperCase();
 const letterIds=Object.keys(WORDS).filter(id=>piece(id)&&!['policecar','van','orca','squid','tortoise','orangutan','swordfish','manta','stingray'].includes(id));
 const byLetter={};letterIds.forEach(id=>(byLetter[letterOf(id)]||=[]).push(id));
 const sleep=ms=>new Promise(r=>setTimeout(r,ms));
 // Say([...clip keys]) plays each recorded clip once the one before it has finished.
 // A newer Say() always cancels an older one, so voices never pile up.
 let seq=0;
 const Say={
  async play(keys,{after=false}={}){
   const book=window.AdventureBook,mine=++seq;keys=[].concat(keys).filter(Boolean);
   if(after){
    await sleep(150);if(mine!==seq)return false;
    // Autoplay blocked: the big play button is showing. Wait for the tap that unlocks sound, then let its welcome clip finish.
    for(let i=0;i<900&&document.getElementById('sound-start');i++){await sleep(200);if(mine!==seq)return false;}
    let quiet=0;for(let i=0;i<60&&quiet<2;i++){await sleep(150);if(mine!==seq)return false;quiet=book.audioPlaying||book.audioRemaining()>0?0:quiet+1;}
   }
   for(let i=0;i<keys.length;i++){
    if(mine!==seq)return false;
    if(i>0){await sleep(book.audioRemaining()+60);if(mine!==seq)return false;}
    book.playAudio(`${keys[i]}.m4a`);
   }
   return true;
  },
  cancel(){seq++;},
  // Swap the shell's "Read to me" button for one that says a whole sentence instead of a single clip.
  listen(fn){const b=document.getElementById('toy-listen');if(!b)return;const c=b.cloneNode(true);b.replaceWith(c);c.addEventListener('click',fn);},
  get busy(){return window.AdventureBook?.audioPlaying||false;}
 };
 window.WordBank={words:WORDS,piece,letterOf,letterIds,byLetter,
  word:id=>WORDS[id]||id,clip:id=>`wd-${id}`,
  letters:Object.keys(byLetter).sort(),
  motion(node,id){try{if(art.animals[id]&&window.CreatureMotion)window.CreatureMotion.play(node,id);else window.PlaythingMotion?.play(node,id);}catch{}}};
 window.Say=Say;
})();
