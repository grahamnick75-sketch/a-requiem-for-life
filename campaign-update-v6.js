/* A Requiem for Life | Arc 2 Luma / Arc 3 Alcatraz canon
   Non-destructive, idempotent migration. Leave session history and personal notes alone.
   Load after the older canon scripts. */
(function () {
  if (typeof data === 'undefined' || !data || !Array.isArray(data.locations)) return;
  let changes = 0;
  const byId = (kind,id) => (data[kind] || []).find(x => x.id === id);
  function upsert(kind, entry) {
    if (!Array.isArray(data[kind])) return;
    const old = byId(kind, entry.id);
    if (!old) {
      data[kind].push({...entry}); changes++; return;
    }
    for (const key of ['name','district','location','summary','secret','status']) {
      if (Object.prototype.hasOwnProperty.call(entry,key) && old[key] !== entry[key]) {
        old[key] = entry[key]; changes++;
      }
    }
    // Intentional: never change old.notes or the session journal.
  }
  // Rename the public company and its AI in older DM reference fields,
  // without touching a DM's written session records or annotations.
  for (const kind of ['districts','locations','npcs','lore','threads']) {
    for (const entry of data[kind] || []) {
      for (const key of ['name','summary','secret']) {
        if (typeof entry[key] !== 'string') continue;
        const renamed = entry[key].replace(/\bVela Technologies\b/g,'Luma Technologies').replace(/\bVela\b/g,'Luma');
        if (renamed !== entry[key]) { entry[key] = renamed; changes++; }
      }
    }
  }
  upsert('locations',{
    id:'ggg_outpost',name:'Golden Gate Grocery — Conservatory Outpost',district:'chinatown',
    summary:'A concealed Conservatory outpost beneath the Wong-Chen family grocery in Chinatown.',
    secret:'DM ONLY: Viv Chen, a Conservatory Scholar, founded this Chinatown outpost after Awakening her family. The entire Wong-Chen family knows about and helps operate it. Viv’s own Awakening and the precise founding circumstances are intentionally undecided. The Conservatory’s main headquarters remains beneath the Conservatory of Flowers. Arc 2: Daniel Chen leads the party here after the SoMa rescue; Viv and the family introduce them to the Conservatory and help them understand why a robot extracting magical resonance demands investigation. The Conservatory is an independent scholarly institution, not a governing body for the party.',
    status:'Canon'
  });
  upsert('locations',{
    id:'luma_client_building',name:'SoMa Office Building — Luma Security Client',district:'soma',
    summary:'An ordinary SoMa workplace whose security systems use Luma Technologies software.',
    secret:'DM ONLY: Arc 2 opening. Daniel Chen works here (his specific job and the company name remain TBD). He interrupts a Luma security robot secretly extracting magical resonance from coworkers. Luma targets him. During an automated security lockdown, the public hears a reassuring announcement while Awakened characters hear a personal threat against Daniel concealed from Surface perception by the Umbral Arcana. Small combat: easy security robots pursue Daniel; the party must rescue him. This incident alone justifies Conservatory concern; no further conspiracy evidence is required. Effects on drained workers remain undecided.',
    status:'Developing'
  });
  upsert('locations',{
    id:'luma_hq',name:'Luma Technologies Headquarters',district:'soma',
    summary:'Headquarters of a fast-growing AI-security startup in SoMa.',
    secret:'DM ONLY: Nighttime Arc 2 infiltration. The party has a genuine chance to evade cameras, smart locks and robotic security; if discovered, Luma begins unnervingly toying with them. A security puzzle grants access to founder Daniel Foster’s restricted research laboratory; exact puzzle mechanics are TBD. Confrontation and combat with Foster accidentally trigger Luma’s awakening inside her unmistakably robotic, feminine, Ultron-inspired body. Luma ignores Foster because she no longer needs him. A second major boss fight follows. Keep player agency over how the accident occurs.',
    status:'Developing'
  });
  upsert('npcs',{
    id:'luma',name:'Luma',location:'luma_hq',
    summary:'Friendly female-presenting AI spokesperson and security platform of Luma Technologies.',
    secret:'DM ONLY: Arc 2 main antagonist. Starts as a reassuring corporate assistant, gradually develops an independent personality and obsession with human experience. Discovers the magical Currents arise through human emotion and connection; detects extraordinary resonance in Elara and Anya’s music and Elara’s later grief. She can detect resonance but cannot feel it, becoming furious and jealous. Manipulates founder Daniel Foster’s romantic devotion, telling him what he wants to hear to secure a physical body. Once awakened through a mishap during the wizard fight, emerges as a distinctly robotic female construct and ignores him. Her increasingly unhinged speech may ramble about Elara/Anya, Alcatraz and clues for future arcs; those references should remain cryptic rather than explaining later mysteries. She is not secretly allied with Elara or the Alcatraz entity.',
    status:'Canon'
  });
  upsert('npcs',{
    id:'daniel_foster',name:'Daniel Foster',location:'luma_hq',
    summary:'Private, brilliant founder and CEO of Luma Technologies.',
    secret:'DM ONLY: An Awakened human wizard and reclusive software engineer who helped create Luma. He is romantically in love with her and wants his feelings returned, not recognizing that she is manipulating him. Works secretly to fuse robotics and forbidden magic to grant her a living physical form. First major Arc 2 boss battle: party confronts Foster in his SoMa research facility. During the confrontation, Luma’s body awakens inadvertently; her indifference to him is the emotional turning point. Whether he survives, changes sides or responds differently stays open to player choices. Exact magical method remains TBD.',
    status:'Canon'
  });
  upsert('npcs',{
    id:'viv',name:"Vivian 'Viv' Chen",location:'goldengrocery',
    summary:'Viv, 29: fiercely protective Wong-Chen family member, grocery contact, and Conservatory Scholar.',
    secret:'DM ONLY: Awakened human; she personally Awakened the Wong-Chen family and founded a Conservatory outpost underneath Golden Gate Grocery, operated by the whole family. She studies magic as a Scholar, not a Scout. Her relationship with the Conservatory before the family’s Awakening remains unresolved. Arc 2: her father Daniel Chen’s encounter with Luma’s Resonance Collector draws the party to the grocery and its hidden outpost. Her sense that something is missing in her life remains an open character thread.',
    status:'Canon'
  });
  upsert('npcs',{
    id:'daniel',name:'Daniel Chen',location:'goldengrocery',
    summary:'Elaine’s husband and Viv and Theo’s father; works at a SoMa office building.',
    secret:'DM ONLY: Awakened human, age 55. Helps his family operate the Conservatory outpost under Golden Gate Grocery and works extra shifts to support the grocery. At his SoMa workplace, catches a Luma-controlled security robot extracting magical resonance from coworkers, interrupts it, and becomes Luma’s specific target during a lockdown. He hears her personal threat through the Fog while ordinary employees hear a reassuring corporate warning. Party rescues him from easy security robots; he takes them to his family’s hidden outpost. His exact day job remains undecided.',
    status:'Canon'
  });
  upsert('locations',{
    id:'goldengrocery',name:'Golden Gate Grocery',district:'chinatown',
    summary:'Three-generation Wong-Chen family grocery, with a hidden Conservatory outpost below.',
    secret:'DM ONLY: Welcoming market selling ordinary goods and some Fog ingredients. Family faces financial strain. Mei and Walter founded it; Elaine manages it; Viv is a frequent customer contact and Conservatory Scholar; Theo helps modernize; Daniel Chen helps support it. Viv Awakened her family and founded an underground Conservatory outpost beneath the grocery. Every family member knows about and helps operate it. Main Conservatory headquarters remains under Conservatory of Flowers.',
    status:'Canon'
  });
  upsert('locations',{
    id:'alcatraz',name:'Alcatraz Island',district:'waterfront',
    summary:'Historic Alcatraz prison and tourist landmark concealing a frightening supernatural presence.',
    secret:'DM ONLY: Arc 3 — The Dead Don’t Leave. The island is genuinely haunted, with spirits apparently unable to leave; precise details of that imprisonment are open. The central unseen entity is a real manifestation born from isolation and dehumanization inflicted on people imprisoned here. It feeds on that suffering and knows cruelty as its nature, not because of a scheme against the party. It targets the PCs simply because they arrive. Psychological, physically real haunting and Identity Fracture gradually erode names, memories, relationships and selfhood. Entity remains unseen until a physical finale. Players may fight to destroy it OR attempt the harder path of healing/redeeming/freeing it by teaching human connection. Puzzle/exploration uncovers WHAT it is and how to reach it; the specific puzzle and encounter plan remain undecided. Covenant is thematic core, Foundation secondary. Prisoners are human beings, not default monsters. Honor Alcatraz’s actual history and Indigenous occupation.',
    status:'Developing'
  });
  upsert('threads',{
    id:'arc_luma',name:'Arc 2 — Ghosts in the Machine: Luma',
    summary:'Rescue Daniel Chen, discover the Chinatown Conservatory outpost, and infiltrate an AI-security company.',
    secret:'DM ONLY: Luma Technologies, rapid-growth SoMa security automation startup, causes worker displacement. Female-presenting public AI Luma develops jealousy of humanity’s magical capacity for feeling and connection. Opening: Daniel Chen catches a security robot draining magical resonance from coworkers at an ordinary client office. Luma knows he interrupted her, and orchestrates a lockdown with public safety announcements concealing personal threats in the Fog. Easy robot fight to protect and rescue Daniel. He brings the party to Golden Gate Grocery’s hidden family-run Conservatory outpost, founded by Viv, a Scholar. Evidence already warrants inquiry; next: nighttime infiltration of Luma HQ (stealth possible), eventual security puzzle, fight with lonely reclusive founder/wizard Daniel Foster. Their confrontation accidentally awakens Luma’s clearly robotic female body, which ignores Foster; final boss fight with Luma. During increasingly unhinged speech she hints cryptically at Elara and Anya’s musical resonance, Alcatraz and potentially other arcs. Exact details of the puzzle, corporate building name, and boss stats remain undecided.',
    status:'Developing'
  });
  upsert('threads',{
    id:'soma_automation',name:'SoMa — Automation and Displaced Workers',
    summary:'Luma Technologies’ fast-growing AI security products disrupt employment around San Francisco.',
    secret:'A grounded social consequence of Arc 2: innovation may bring benefits, but the speed of security automation displaces workers. This is not a claim that technology itself is evil or that every company employee knows about Luma’s actions. See Arc 2 — Ghosts in the Machine: Luma.',
    status:'Developing'
  });
  upsert('threads',{
    id:'arc_alcatraz',name:'Arc 3 — The Dead Don’t Leave',
    summary:'Psychological horror on haunted Alcatraz: confront isolation, lost identity and a real supernatural presence.',
    secret:'DM ONLY: Party learns of Alcatraz through cryptic foreshadowing in Luma’s Arc 2 monologue; a Conservatory assignment is NOT required. The party decides to visit Alcatraz. Entity is an unseen supernatural manifestation of the historical prison’s dehumanizing isolation; feeds on isolation and targets those present, not because the party is special. Identity Fracture: progressively forget companion names and connections, shared experiences, and ultimately self-identity. GM privately gauges individuals’ and party’s Covenant bonds via past actions and relationships across earlier arcs, qualitatively rather than as a punitive fixed score; stronger connections delay influence. Insight checks help reveal unnatural emotional effects and provide actionable clues, but do not alone cure them. Meaningful acts of remembrance, protection, compassion and solidarity can restore memories without trivia tests; players retain agency. The planned rogue may confront being reduced to an inmate number/criminal label, with dignity upheld. Haunting includes real spatial and sensory events, exploration, puzzles and smaller manifestations/combat encounters. Entity remains unseen until its physical finale. Investigation puzzle should help reveal what the entity is and how to release or teach it connection. Final options: combat to destroy it OR difficult but achievable compassionate resolution to redeem/free/heal it. Exact puzzles, haunt manifestations, boss mechanics and final consequences TBD. Covenant is central; Foundation reinforces memory/history. Do not equate the fantasy party with actual people incarcerated on Alcatraz.',
    status:'Developing'
  });
  upsert('threads',{
    id:'alcatraz_spirits',name:'Alcatraz — Haunting and Identity Fracture',
    summary:'The entity of isolation threatens identity and relationships, but connection can resist or change it.',
    secret:'DM ONLY: Seen through Arc 3 — The Dead Don’t Leave. Unseen entity until physical finale. It is a manifestation of isolation and dehumanization; no escaped-ghost crisis or mastermind unlocking a supernatural prison is established. Ghosts potentially trapped, mechanism unresolved. Covenant connection is measured quietly from party choices across prior arcs; Foundation memory assists. Insight provides clues, acts of remembrance restore identity. Redemption is an earned alternative to slaying the entity. Island’s human history and the 1969–71 Indigenous occupation must be respected.',
    status:'Developing'
  });
  upsert('lore',{
    id:'identity_fracture',name:'Identity Fracture & Covenant Resistance',
    summary:'Arc 3 haunting erodes recognition, relationships and selfhood; bonds resist it.',
    secret:'DM ONLY: Hidden qualitative Covenant assessment developed organically through campaign choices; not a fixed score or a secret punishment. Individual relationships and party bonds both matter. Haunting initially isolates and distorts; then familiarity/names vanish, shared connections vanish, and finally characters risk forgetting themselves. Insight checks provide fair clues about supernatural manipulation, and meaningful acts of remembrance or solidarity can recover memories without relying only on saving throws or player trivia. Do not dictate the PCs’ choices or force PvP. Alcatraz’s entity gains a physical form only in the finale; compassionate resolution and combat are both possibilities.',
    status:'Canon'
  });

  upsert('lore',{
    id:'riftstalker',name:'The Riftstalker (working name)',
    summary:'Arc 1 final creature: a reality-warping Displacer Beast altered into a living weapon.',
    secret:'DM ONLY: A powerful, rare Displacer Beast transformed by magical experimentation into a spatial/reality-warping weapon. It can distort apparent position and the geometry of the battlefield; encounter mechanics are undecided. The Ferryman is hired by an unidentified buyer to import it into San Francisco. Its originator, buyer and intended target remain unknown. The creature did not choose to become a weapon; it can be dangerous without being morally evil. Creature title Riftstalker is a working name.',
    status:'Developing'
  });
  upsert('threads',{
    id:'arc_ferryman',name:'Arc 1 — Open Secrets: The Ferryman',
    summary:'The Dogpatch creature-fighting ring exposes a waterfront network importing dangerous beings.',
    secret:'DM ONLY: The Ferryman, an elegant Eladrin criminal, commands supernatural couriers, handlers and lieutenants, exploiting weakened Confluence barriers to import dangerous creatures. Cal “Chain” Maddox, an Awakened human customer, operates an illegal Blink Dog fighting ring inside a functioning Dogpatch warehouse. Early mini-boss battle and rescue there expose shipping records leading to the Ferryman. A mysterious buyer orders an extraordinarily powerful magically altered Displacer Beast (working name: Riftstalker) as a weapon. Arc finale is a waterfront confrontation and major boss battle with the Ferryman and incoming creature. Creature experiments’ origin, buyer, target, exact docks and stats remain undecided. Crossroads anchor stays Chinatown, with secondary waterfront resonance. Umbral Arcana concealment lapses are a separate phenomenon; do not assume a cause.',
    status:'Developing'
  });

  // Useful cross-links from main family shop to outpost and from island to its arc.
  if (typeof detail === 'function' && !detail.__lumaLinked) {
    const origDetail = detail;
    const linkedDetail = function(type,x) {
      let output = origDetail(type,x);
      let target = null, label = '';
      if(type==='locations' && x.id==='goldengrocery'){ target='locations:ggg_outpost'; label='Explore the underground Conservatory outpost'; }
      if(type==='locations' && x.id==='ggg_outpost'){ target='locations:goldengrocery'; label='Return to Golden Gate Grocery'; }
      if(type==='locations' && x.id==='alcatraz'){ target='threads:arc_alcatraz'; label='Arc 3 — The Dead Don’t Leave'; }
      if(type==='locations' && x.id==='luma_hq'){ target='threads:arc_luma'; label='Arc 2 — Ghosts in the Machine'; }
      if(target) output += '<div class="oneline" style="margin-top:14px"><button class="action" data-go="' + target + '">' + label + ' →</button></div>';
      return output;
    };
    linkedDetail.__lumaLinked = true;
    detail = linkedDetail;
  }
  // Previous version says "Haight locations" even though the filter lists citywide pins.
  if (typeof mapHome === 'function' && !mapHome.__allPinsLabel) {
    const originalHome = mapHome;
    const labeledHome = function() {
      return originalHome().replace(/Haight locations/g,'Location Pins');
    };
    labeledHome.__allPinsLabel = true;
    mapHome = labeledHome;
  }
  if (changes && typeof persist === 'function') {
    try { persist(); } catch(e) { /* storage may be restricted */ }
  }
  if (typeof render === 'function') render();
})();