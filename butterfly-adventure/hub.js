(() => {
 document.getElementById('hub-guide').innerHTML=AdventureArt.kid();
 const artworks={garden:'<svg viewBox="0 0 240 180">'+AdventureArt.symbols.match(/<symbol id="butterfly"[^>]*>([\s\S]*?)<\/symbol>/)[1]+'</svg>',zoo:AdventureArt.animals.hippo,sea:AdventureArt.animals.mermaid,clock:AdventureArt.clock,market:AdventureArt.basket,kitchen:AdventureArt.dishes.boat,traffic:AdventureArt.playthings.signal,counting:AdventureArt.playthings.numbers,letters:AdventureArt.playthings.envelope,seedling:AdventureArt.playthings.flower};
 document.querySelectorAll('[data-art]').forEach(node=>node.innerHTML=artworks[node.dataset.art]);
})();
