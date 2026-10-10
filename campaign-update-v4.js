/* Campaign canon update · Chinatown, Haight-Ashbury and Anya.
   Idempotent migration: adds entries to existing local saves without replacing session notes. */
(function () {
  if (typeof data === "undefined" || !data || !Array.isArray(data.locations)) return;
  const entries = {
    locations: [
      {id:"portsmouth",name:"Portsmouth Square",district:"chinatown",summary:"Historic public gathering place in Chinatown, with quiet daytime socializing and community celebrations.",secret:"Surface and Fog residents share the square. Supernatural festivals and ordinary community life coexist; no specific festival program established.",status:"Canon"},
      {id:"evergreen",name:"Evergreen Tea House",district:"chinatown",summary:"Traditional Chinatown tea house, welcoming and peaceful, founded during the Gold Rush era.",secret:"Owned by Jin, a black Dragonborn who immigrated from China during the 1850s. Jin has operated Evergreen since his early days in San Francisco; ordinary and Fog patrons are both welcome.",status:"Canon"},
      {id:"goldengrocery",name:"Golden Gate Grocery",district:"chinatown",summary:"Busy family-run Chinatown market with produce, pantry staples and familiar faces, now in its third generation.",secret:"Operated by the Awakened Wong-Chen family. Ordinary groceries sit alongside some ingredients for Fog customers. Mei and Walter founded it; Elaine now runs it, with Viv as primary contact and Theo involved in modernization. The family faces financial pressure.",status:"Canon"}
    ],
    npcs: [
      {id:"jules",name:"Jules",location:"ink",summary:"Older transgender Aasimar man, proprietor of Ink & Ether; tattoo artist, activist and advocate for self-expression.",secret:"Naturally part of the Fog, with visible glowing celestial tattoos. He was a close personal friend of Harvey Milk and involved in San Francisco LGBTQ+ activism. His tattoos' magical properties remain open for improvisation.",status:"Canon"},
      {id:"ziggy",name:"Ziggy",location:"kaleido",summary:"Mischievous Satyr alchemist and co-owner of Kaleidoscope, always experimenting with potions.",secret:"Longtime best friend and business partner of Floyd; the pair have run Kaleidoscope for decades, with relaxed Cheech-and-Chong-style comic chemistry. Despite antics, both know their crafts.",status:"Canon"},
      {id:"floyd",name:"Floyd",location:"kaleido",summary:"Impossibly laid-back Tortle herbalist and co-owner of Kaleidoscope, expert in magical plants.",secret:"Longtime best friend and business partner of Ziggy. The psychedelic apothecary has been open for decades. Calm foil to Ziggy's enthusiasm.",status:"Canon"},
      {id:"winnie",name:"Winnie",location:"jumble",summary:"Older, scatterbrained and wonderfully curious woman who runs the chaotic Jumble thrift shop.",secret:"Awakened human who has collected magical oddities for decades; cares more about discoveries and their stories than profits.",status:"Canon"},
      {id:"percy",name:"Percy",location:"hippie",summary:"Quiet, observant gargoyle who poses as a living statue performer at Hippie Hill.",secret:"An actual supernatural stone gargoyle. Surface visitors see a street performer; Awakened visitors can perceive what he is. He rarely speaks and simply enjoys watching people and music.",status:"Canon"},
      {id:"jin",name:"Jin",location:"evergreen",summary:"Warm, humorous black Dragonborn tea house owner, known for his hospitality and love of tea.",secret:"Immigrated to San Francisco from China during the Gold Rush, and has operated Evergreen Tea House since his early years there. His exceptional longevity is part of the setting; its mechanism isn't defined. Never conflate D&D dragonborn heritage with Chinese dragon mythology.",status:"Canon"},
      {id:"mei",name:"Mei Wong",location:"goldengrocery",summary:"Grandmother, 76, who lovingly tends the produce outside Golden Gate Grocery and greets neighbors.",secret:"Awakened human. With her husband Walter, she founded the family business. The pair affectionately bicker throughout the day.",status:"Canon"},
      {id:"walter",name:"Walter Wong",location:"goldengrocery",summary:"Grandfather, 79, who sweeps, cleans and tends to the grocery's upkeep.",secret:"Awakened human; co-founded the store with Mei, his wife. Lovingly bickers with her and is still present despite being largely retired.",status:"Canon"},
      {id:"elaine",name:"Elaine Wong",location:"goldengrocery",summary:"Mother, 53; manages Golden Gate Grocery, carrying on the business her parents started.",secret:"Awakened human. Married to Daniel Chen, mother of Viv and Theo. Cares deeply about preserving the market despite financial strain.",status:"Canon"},
      {id:"daniel",name:"Daniel Chen",location:"goldengrocery",summary:"Father, 55; works in SoMa and takes extra shifts to help keep Golden Gate Grocery afloat.",secret:"Awakened human. Elaine's husband and father to Viv and Theo. His specific job in SoMa hasn't been determined.",status:"Canon"},
      {id:"viv",name:"Vivian 'Viv' Chen",location:"goldengrocery",summary:"Viv, 29: strong-willed, fiercely loving, and the main person customers interact with at Golden Gate Grocery.",secret:"Awakened human. She senses something is missing from her own life despite loving her family and community; what that means remains undefined. Sister to Theo.",status:"Canon"},
      {id:"theo",name:"Theo Chen",location:"goldengrocery",summary:"Viv's younger brother, 25; easygoing, sociable and helping modernize the family grocery.",secret:"Awakened human. Close to Viv and more optimistic about the shop's future.",status:"Canon"},
      {id:"anya_vox",name:"Anya — Vox Nebulae (in life)",summary:"Anya, Elara's romantic and musical partner; while alive she held the title of Vox Nebulae.",secret:"Anya knew her role as Voice of the Fog but concealed it from Elara because of its burden and responsibilities. Elara was not Awakened and did not know Anya's supernatural identity. Her death from addiction was not engineered by the demon.",status:"Canon"},
      {id:"anya_spirit",name:"Anya — Spirit of the Nebulae (after death)",summary:"Anya's posthumous manifestation: the Spirit of the Nebulae.",secret:"The same Anya as the former Vox Nebulae, not another person. The precise nature of the spirit and what happened to the mantle after death remain undecided.",status:"Canon"}
    ],
    threads: [
      {id:"noe_player",name:"Noe Valley — Player Backstory",summary:"Noe Valley is relevant to an upcoming player character.",secret:"A player mentioned Noe Valley in their backstory. No character identity, connections, plot implications or opening scene have been decided. Ask the player for details before elaborating.",status:"Unresolved"}
    ]
  };
  let changes = 0;
  for (const type of Object.keys(entries)) {
    if (!Array.isArray(data[type])) continue;
    for (const item of entries[type]) {
      if (!data[type].some(existing => existing.id === item.id)) {
        data[type].push({...item});
        changes++;
      }
    }
  }
  const appendSecret = (type,id,token,addition) => {
    const entry = data[type] && data[type].find(x=>x.id===id);
    if (entry && !(entry.secret||"").includes(token)) {
      entry.secret = (entry.secret||"").trim() + " " + addition;
      changes++;
    }
  };
  appendSecret("districts","castro","A player mentioned Noe Valley","A player mentioned Noe Valley in a character backstory; specific details are not yet defined.");
  appendSecret("districts","chinatown","Evergreen Tea House","Established locations include Portsmouth Square, Evergreen Tea House and Golden Gate Grocery; the latter is run by three generations of the Wong-Chen family.");
  appendSecret("lore","vox","Anya knowingly concealed","Anya knowingly concealed her status as Vox Nebulae from Elara because of its burdens. After her death she appears as the Spirit of the Nebulae; the mantle's succession is undecided.");
  appendSecret("lore","elara","Anya knew she was Vox Nebulae","Anya knew she was Vox Nebulae but did not tell Elara, who discovered magic only after Anya died. Anya is later known as the Spirit of the Nebulae; Elara's search for resurrection comes from love and grief, not prior knowledge of Anya's role.");
  const chinatown = data.districts.find(d=>d.id==="chinatown");
  if (chinatown && chinatown.status==="Outline") {chinatown.status="Developing";changes++;}
  if (typeof LOCATION_PINS !== "undefined") {
    const newPins = [
      ["portsmouth",63.3,35.5,"P"],
      ["evergreen",66.4,39.6,"E"],
      ["goldengrocery",60.2,38.8,"G"]
    ];
    newPins.forEach(pin=>{if(!LOCATION_PINS.some(p=>p[0]===pin[0])) LOCATION_PINS.push(pin)});
  }
  if (changes) {
    try { persist(); } catch(e) { /* Browser storage can be restricted. */ }
  }
  if (typeof render === "function") render();
})();