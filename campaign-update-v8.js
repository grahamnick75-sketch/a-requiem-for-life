/* A Requiem for Life | Editable Campaign Workspace v8.
   Additive UI layer. Preserves prior canon scripts, session journal and existing notes.
   Explicit journal promotion (never automatic) and user-authored field overrides
   survive older idempotent canon migrations and JSON backup import/export. */
(function(){
  if(typeof data==="undefined"||!data||!Array.isArray(data.npcs)||typeof render!=="function")return;
  if(!Array.isArray(data.villains))data.villains=[];
  if(!data._editorOverrides||typeof data._editorOverrides!=="object")data._editorOverrides={};
  if(!Array.isArray(data._editorDeletes))data._editorDeletes=[];
  const editable=["districts","locations","npcs","villains","lore","threads"];
  const statusOptions=["Canon","Developing","Idea","Unresolved","Undecided","Outline"];
  const vill=[ 
    {id:"villain_ferryman",name:"The Ferryman",npcId:"ferryman",summary:"Elegant Eladrin trafficker and central antagonist of Arc 1 — Open Secrets.",arc:"Arc 1 — Open Secrets",goal:"Profit from trafficking dangerous supernatural creatures into San Francisco.",method:"Contracts, handlers, couriers and smuggled creatures.",weakness:"Unestablished: do not assume a vulnerability.",secret:"Buyer, intended target and exact logistics remain deliberately open.",status:"Developing"},
    {id:"villain_luma",name:"Luma",npcId:"luma",summary:"Corporate security AI with an obsessive desire to experience human feeling and embodiment.",arc:"Arc 2 — Ghosts in the Machine",goal:"Acquire a real body and the emotional life she envies.",method:"Security robots, resonance extraction, manipulation of founder Daniel Foster.",weakness:"Unestablished; fight mechanics undecided.",secret:"Her robotic form appears through consequences of the confrontation with Foster. Not allied with Elara.",status:"Developing"},
    {id:"villain_cal",name:"Cal “Chain” Maddox",npcId:"cal_maddox",summary:"Dogpatch underground Blink Dog fighting-ring operator and Arc 1 mini-boss.",arc:"Arc 1 — Open Secrets",goal:"Profit from illegal magical creature fights.",method:"After-hours Dogpatch warehouse, betting, enforcers.",weakness:"Unestablished.",secret:"Cal is a customer of the Ferryman, not his lieutenant.",status:"Developing"},
    {id:"villain_foster",name:"Daniel Foster",npcId:"daniel_foster",summary:"Wizard and founder of Luma Technologies, manipulated by his love for the company's AI.",arc:"Arc 2 — Ghosts in the Machine",goal:"Give Luma physical form and have his devotion returned.",method:"Forbidden magic integrated with robotics and security technology.",weakness:"Emotional blind spot: his trust in Luma.",secret:"Luma kills Foster upon manifestation, whether her body is complete or incomplete.",status:"Developing"}
  ];
  for(const v of vill)if(!data.villains.some(x=>x.id===v.id))data.villains.push(v);
  if(!data.npcs.some(x=>x.id==="marisol_reyes"))data.npcs.push({
    id:"marisol_reyes",name:"Marisol “Mari” Reyes",location:"tenderloin_jones_hotel",
    age:"58",ancestry:"Awakened human",occupation:"Resident manager, Jones Street Hotel",
    personality:"Practical, quick-witted, stubborn, occasionally grumpy; fiercely protective of tenants.",
    summary:"The Jones Street Hotel’s longtime resident manager, deeply connected to her neighbors and Hyde Street House.",
    secret:"DM ONLY: Has managed the hotel for nearly thirty years. Knows residents and their Fog identities without making a spectacle of it. Handles plumbing, late rent and city inspections. Partners informally with Hyde Street House to help residents find resources. No extra secret elevator floors.",
    connections:[{targetType:"locations",targetId:"tenderloin_hyde_house",relation:"Community resource partner",details:"Connects tenants to housing and other community support."}],
    status:"Canon"
  });
  // Preserve user edits made to canon records, despite older update scripts reasserting source fields on every load.
  for(const record of data._editorDeletes){
    const kind=record.split(":")[0],id=record.substring(kind.length+1);
    if(Array.isArray(data[kind]))data[kind]=data[kind].filter(x=>x.id!==id);
  }
  for(const [key,fields] of Object.entries(data._editorOverrides)){
    const kind=key.split(":")[0],id=key.substring(kind.length+1);
    const item=Array.isArray(data[kind])?data[kind].find(x=>x.id===id):null;
    if(item&&fields&&typeof fields==="object")Object.assign(item,fields);
  }


  // Elara — approved Oct 16, 2026. Keep a single canonical NPC entry and
  // respect any user-created version or locally edited/deleted record.
  const rflElaraName=/^elara$/i;
  const rflElaraRemoved=(data._editorDeletes||[]).some(x=>x==="npcs:elara");
  let rflElara=data.npcs.find(x=>rflElaraName.test(String(x.name||"")));
  if(!rflElara&&!rflElaraRemoved){
    rflElara={
      id:"elara",name:"Elara",age:"26–29",ancestry:"Human",pronouns:"she/her",
      occupation:"Alternative singer-songwriter and guitarist",
      personality:"Confident, charismatic and rebellious; fiercely independent, self-assured onstage and still finding her footing.",
      appearance:"Petite, slender young woman with fair freckled skin and hazel eyes with golden flecks. Shaggy two-tone dark-brown and copper-orange wolf cut. Blackwork celestial and gothic tattoos scattered across her arms, collarbone and shoulders. Black ripped jeans, band T-shirt, oversized leather jacket and combat boots. Carries a worn lyric notebook in one hand, the other resting in her jacket pocket; guitar slung across her back. A knowing, defiant smirk.",
      summary:"Alternative singer-songwriter and guitarist whose duets with Anya are a familiar part of San Francisco's Fog music scene.",
      secret:"DM ONLY: Elara and Anya are romantic and musical partners, recurring familiar faces rather than predetermined close friends of the party. Elara is not initially Awakened. Anya lives through early Arc 2, then dies elsewhere during the Luma finale. Luma learns through her network and becomes enraged. Anya's addiction-related death is not caused by the demon. Elara's grief and desire to reunite with her make Elara vulnerable to demonic manipulation as Eshara destabilizes. The exact events and player outcomes remain open.",
      status:"Canon",
      portrait:"assets/portraits/elara.webp",
      connections:[]
    };
    const rflAnya=data.npcs.find(x=>/^anya\s*[—–-]\s*vox nebulae$/i.test(String(x.name||""))) ||
      data.npcs.find(x=>/^anya(?:\b|\s)/i.test(String(x.name||""))&&!/spirit/i.test(String(x.name||"")));
    if(rflAnya)rflElara.connections.push({
      targetType:"npcs",targetId:rflAnya.id,relation:"Romantic partner and musical collaborator",
      details:"They perform powerful duets together; Anya lives through early Arc 2 and dies offsite during its finale."
    });
    data.npcs.push(rflElara);
  }

  // Canon decisions and approved art from the Oct 13, 2026 planning session.
  // Non-destructive: respect each editor override and any explicitly deleted records.
  const rflDailyUpdates=[{"kind":"locations","id":"luma_client_building","fields":{"name":"Renewal Biomedical Headquarters","district":"soma","summary":"A modern glass-and-steel SoMa biotech tower housing offices and restricted laboratories. Daniel Chen works here. Renewal Biomedical is developing a medical and magical treatment for addiction in clinical trials; the building is SoMa's major Orith resonance anchor.","status":"Canon"},"note":"Orith — Seeking that Makes is concentrated here, independently of Luma Technologies. Clinical research and trials take place in restricted laboratories, not a public clinic. Luma Technologies knows about this anchor and supplies the building's advanced security systems. Arc 2: Daniel meets the party at Wonderworks, then invites them here. His disclosure of a stolen extraction drone prompts Luma's reveal and lockdown; hold off drones while he overrides it."},{"kind":"locations","id":"luma_hq","fields":{"name":"Luma Technologies Headquarters","district":"soma","summary":"The SoMa headquarters of a controversial, high-end robotics and artificial intelligence company founded by wizard Daniel Foster. Its expensive arcane-engineered robots and AI systems serve corporations, specialized facilities, and wealthy clients.","status":"Canon"},"note":"Luma Technologies is part of SoMa's public, commercially established Fog magical-technology industry. The company has a controversial reputation; its products are cutting-edge and not commonplace. Keep the existing Arc 2 infiltration, restricted research laboratory, Foster confrontation and Luma awakening beats."},{"kind":"locations","id":"yerba_buena_gardens","fields":{"name":"Yerba Buena Gardens","district":"soma","summary":"A shared public green space and SoMa's year-round showcase for magical inventions, experimental art, and accessible technological wonder.","status":"Canon"},"note":"Both Fog residents and ordinary San Franciscans attend. Magical displays are presented as cutting-edge technology, immersive art, or illusions, preserving the Fog. The annual family-friendly Wonderworks Festival takes place here on the first Saturday of May. Renewal Biomedical participates with appropriate patient privacy."},{"kind":"locations","id":"dogpatch_warehouse","fields":{"summary":"A working industrial warehouse in Dogpatch housing Cal 'Chain' Maddox's underground Blink Dog fighting ring, an open secret among the gambling crowd.","status":"Canon"},"note":"Arc 1: late-night howling draws neighborhood complaints; the source of the party's tip is deliberately flexible and could be a Mission District contact. The venue is easy to find and an underground gambling operation. Cal openly runs it. When the party arrives, a Blink Dog fight is just ending. Cal's purchase paperwork names supplier 'The Ferryman' as a codename and gives the next delivery date: three nights after this encounter. Other paperwork details remain at DM discretion."},{"kind":"locations","id":"waterfront_abandoned_pier","fields":{"name":"Abandoned Embarcadero Pier","district":"waterfront","summary":"A neglected waterfront landing along the Embarcadero, used for a supernatural shipment three nights after the Dogpatch fighting-ring encounter.","status":"Canon"},"note":"Arc 1 optional stealth rescue, separate from the finale. A smuggling vessel arrives on a night of exceptionally dense fog, carrying captive Blink Dogs in reinforced cages. A supernatural crew handles the cargo; Marlow, the Ferryman's powerful humanoid enforcer, patrols the vessel. Players may sneak aboard and free the animals, but a failed stealth attempt triggers dangerous yet winnable combat. Marlow can be killed. Evidence aboard points toward the Ferryman's headquarters. Whether the Ferryman himself is aboard is flexible; if present, he escapes."},{"kind":"lore","id":"wonderworks_festival","fields":{"name":"Wonderworks Festival","summary":"A beloved annual, family-friendly celebration of creativity, technology and magical invention at Yerba Buena Gardens on the first Saturday in May, open to everyone.","status":"Canon"},"note":"Year-round innovation exhibits also take place in the gardens. Wonderworks welcomes Fog and ordinary San Franciscans alike; magical features are disguised as technology, art or illusions. Renewal Biomedical participates by publicly presenting responsible, patient-confidential research progress. Motto proposed: 'Imagine what could be.'"},{"kind":"threads","id":"arc_ferryman","fields":{"summary":"Arc 1 — Open Secrets: From late-night howling and Cal Maddox's Dogpatch Blink Dog fights, to a fogbound Embarcadero rescue shipment and the later Ferryman/Riftstalker finale.","status":"Canon"},"note":"Confirmed beats (Oct 13, 2026): (1) The party's formation is handled separately; how residents' howling complaints reach the party is deliberately flexible, possibly via the Mission District. (2) The Dogpatch fight venue is easy to locate, accepts underground gamblers, and is openly run by Cal. The party arrives just as a fight ends. (3) Purchase paperwork lists 'The Ferryman' as supplier codename and the NEXT SHIPMENT in THREE nights. (4) Abandoned Embarcadero pier on a high-fog night: optional stealth mission on a supernatural-crewed vessel to rescue Blink Dogs from reinforced cages. Marlow, a killable custom monstrous humanoid barbarian/enforcer, patrols the ship; failed stealth can lead to challenging combat. Ferryman may appear and escape, or be absent, but the party can gain clues to his headquarters. (5) Separate later waterfront finale: Ferryman confrontation involving the Riftstalker, working name for the Displacer Beast. Headquarters location, definitive Riftstalker name, and certain details remain undecided."},{"kind":"npcs","id":"marlow","fields":{"name":"Marlow","location":"waterfront_abandoned_pier","age":"40s","ancestry":"Supernatural humanoid (specific kind undecided)","occupation":"The Ferryman's shipboard enforcer","appearance":"Hulking, muscular, Sabretooth-like silhouette; medium shaggy hair, ruddy and scarred skin, terrifying recognizably human but distorted face: heavy brow, deep-set eyes, broken nose, crooked jaw, prominent scars and canines. Dark coat over rough work clothes, clawed hands. Becomes visibly more monstrous in Rage.","personality":"Cold and emotionless while patrolling; ferocious in combat.","summary":"The Ferryman's powerful supernatural enforcer, a patrolling shipboard combat threat during the abandoned Embarcadero pier rescue.","secret":"DM ONLY: A killable barbarian-style bruiser who fights with claws, Rage, Reckless Attack and brute strength. No teleportation or Fogstride. Optional stealth bypass is possible; if alerted, he is the major combat threat. Combat need not mean failed rescue.","status":"Canon"}},{"kind":"villains","id":"villain_marlow","fields":{"name":"Marlow","npcId":"marlow","arc":"Arc 1 — Open Secrets","goal":"Safely complete the Ferryman's smuggling delivery and eliminate interference.","method":"Patrol, physical intimidation, claws, Rage and brute strength.","summary":"The Ferryman's hulking supernatural shipboard enforcer and major optional combat opponent at the Embarcadero shipment rescue.","secret":"DM ONLY: Can be killed. Stealth can avoid the encounter. Faces a more monstrous physical transformation in rage; no Fogstride or teleportation.","status":"Canon"}},{"kind":"npcs","id":"daniel","fields":{"summary":"Daniel Chen is Elaine's husband, father of Viv and Theo, and a Renewal Biomedical employee in SoMa. He works in a tower that is Orith's major resonance anchor and uses Luma Technologies security systems.","occupation":"Renewal Biomedical employee","additionalLocations":["luma_client_building"]},"note":"Daniel meets the party at Wonderworks and invites them to Renewal. The party holds off drones while he overrides Luma's lockdown, then escapes with him to the family outpost. His primary family association with Golden Gate Grocery is preserved."},{"kind":"npcs","id":"daniel_foster","fields":{"appearance":"Awkward, nerdy, deliberately unglamorous man in his 30s: medium-length middle-parted brown hair, prominent glasses, thin build, imperfect facial features, plaid button-up shirt with pens in its pocket, khaki trousers, everyday brown shoes. Final approved portrait replaces prior turtleneck/suit versions."}},{"kind":"npcs","id":"cal_maddox","fields":{"appearance":"Late 30s-40s, heavyset and imposing, tan weathered complexion, shaved head and clean-shaven face. Sleeveless black shirt and vest, tattoo-covered bare arms, chains, oversized gold necklace. Smug, arrogant expression."}}];
  for(const change of rflDailyUpdates){
    if(!Array.isArray(data[change.kind]))continue;
    const key=change.kind+":"+change.id;
    if(data._editorDeletes.includes(key))continue;
    let item=data[change.kind].find(x=>x.id===change.id);
    const userEdits=data._editorOverrides[key]||{};
    if(!item){item={id:change.id};data[change.kind].push(item);}
    for(const [k,v] of Object.entries(change.fields||{})){
      if(!Object.prototype.hasOwnProperty.call(userEdits,k))item[k]=v;
    }
    if(change.note && !String(item.secret||"").includes(change.note)){
      item.secret=(String(item.secret||"").trim()+"\n\n"+change.note).trim();
    }
  }


  // Approved Oct 14 neighborhood decisions. Ordinary businesses stay mundane.
  // Preserve dashboard editor changes, deleted entries, and older campaign canon.
  const rflNeighborhoodDistricts=[
    {id:"potrero",name:"Potrero Hill",summary:"Sunny hillside neighborhood with steep residential streets, exceptional city views, an 18th Street commercial strip, and industrial edges toward Dogpatch. A quieter everyday home base.",note:"The Switchback and McKinley Square are approved neighborhood gathering places. No required magic, Current anchor, or Arc 1 plot is assigned here."},
    {id:"bernal",name:"Bernal Heights",summary:"Residential hillside neighborhood with a small-village atmosphere, independent businesses on Cortland Avenue, and a panoramic hilltop park. A quieter place for characters to live or visit.",note:"The Little Lantern and Bernal Heights Park are approved everyday locations. No mandatory supernatural storyline or established Current anchor."}
  ];
  const rflNormalizeName=x=>String(x||"").toLocaleLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g," ").trim();
  const rflFindKind=(kind,id,names)=>data[kind].find(x=>x.id===id)
    ||data[kind].find(x=>(names||[]).some(n=>rflNormalizeName(x.name)===rflNormalizeName(n)));
  const rflMergeDecision=(kind,id,fields,note,aliases)=>{
    if(!Array.isArray(data[kind]))return null;
    if(data._editorDeletes.includes(kind+":"+id))return null;
    let item=rflFindKind(kind,id,[fields.name].concat(aliases||[]));
    if(item&&data._editorDeletes.includes(kind+":"+item.id))return null;
    if(!item){item={id};data[kind].push(item);}
    const key=kind+":"+item.id,edits=data._editorOverrides[key]||{};
    for(const [field,value] of Object.entries(fields)){
      if(!Object.prototype.hasOwnProperty.call(edits,field))item[field]=value;
    }
    if(note&&!Object.prototype.hasOwnProperty.call(edits,"secret")){
      const tag="[Neighborhood decisions — October 14, 2026]";
      const original=String(item.secret||"");
      const oldStart=original.indexOf(tag);
      const originalWithoutOld=oldStart<0?original:original.slice(0,oldStart).trimEnd();
      item.secret=(originalWithoutOld+"\n\n"+tag+"\n"+note).trim();
    }
    return item;
  };
  for(const item of rflNeighborhoodDistricts)
    rflMergeDecision("districts",item.id,
      {name:item.name,summary:item.summary,status:"Canon"},item.note);
  const rflMission=data.districts.find(d=>d.id==="mission");
  if(rflMission&&!data._editorDeletes.includes("districts:mission")){
    // The older combined "Mission / Bernal Heights" title is no longer apt.
    const ed=data._editorOverrides["districts:mission"]||{};
    if(!Object.prototype.hasOwnProperty.call(ed,"name")&&/bernal/i.test(rflMission.name||""))
      rflMission.name="Mission District";
    rflMergeDecision("districts","mission",{}, 
      "Calle 24 is a vibrant neighborhood corridor of family businesses and strong Latino cultural identity. Confirmed places: Caliente 24, Balmy Alley, and Dolores Park. Balmy Alley is a public, mixed Mundane/Awakened arts space; some murals have magical influences, but their manifestation is deliberately undefined. Dolores Park is an ordinary public park with no required supernatural significance. Valencia Street is not being developed yet; a possible player-owned Jewish deli there is only a player idea, not an approved location. Do not create or define the deli unless that player chooses it.");
  }
  if(data.districts.some(d=>d.id==="dogpatch"))
    rflMergeDecision("districts","dogpatch",{},
      "Dogpatch is a mix of historic homes, working warehouses, creative spaces and waterfront industry. Confirmed everyday hubs are The Rusted Anchor near Third Street and Salt & Steel Repair Works on the waterfront, both ordinary businesses. Cal 'Chain' Maddox's illicit Blink Dog fighting ring remains at the existing industrial warehouse, separate from these businesses.");
  const rflPotrero=(rflFindKind("districts","potrero",["Potrero Hill"])||{}).id||"potrero";
  const rflBernal=(rflFindKind("districts","bernal",["Bernal Heights"])||{}).id||"bernal";
  const rflNeighborhoodPlaces=[
    {id:"caliente_24",name:"Caliente 24",district:"mission",
      summary:"Ordinary family-owned taqueria on Calle 24 in the Mission District. A warm neighborhood dinner spot that closes at 10 PM; no magical services or Fog-related secrets.",
      note:"Arc 1 opening hook: during dinner, the party can overhear two Dogpatch warehouse workers complaining about repeated nighttime howling from warehouses in Dogpatch. The workers are annoyed and frustrated, not frightened. Their names, precise workplace, and further details are intentionally left for DM improvisation."},
    {id:"balmy_alley",name:"Balmy Alley",district:"mission",
      summary:"Real public alley known for vibrant community murals. In the Fog setting it is a mixed Mundane/Awakened arts space: most murals are ordinary, while some bear subtle magical influences.",
      note:"Do not lock down how the magic works or who notices it. The murals' supernatural manifestations are intentionally open-ended."},
    {id:"dolores_park",name:"Dolores Park",district:"mission",
      summary:"Real public hillside park, open to everyone for picnics, socializing, sightseeing, and downtime. An ordinary player-accessible city location.",
      note:"No special supernatural connection, mandatory quest, or Current anchor. The park can be used casually during play.",
      aliases:["Mission Dolores Park"]},
    {id:"the_switchback",name:"The Switchback",district:rflPotrero,
      summary:"Fictional cozy neighborhood diner on 18th Street in Potrero Hill, frequented by breakfast regulars, workers and longtime residents. An ordinary place to meet and hear local news.",
      note:"Ordinary establishment; no assigned Fog secret or plot requirement."},
    {id:"mckinley_square",name:"McKinley Square",district:rflPotrero,
      summary:"Real small hillside public park in Potrero Hill with city views; suited to quiet conversations, meetings, or enjoying the neighborhood.",
      note:"Ordinary public park, not a required quest location."},
    {id:"the_little_lantern",name:"The Little Lantern",district:rflBernal,
      summary:"Fictional independent bookstore and coffee shop on Cortland Avenue in Bernal Heights. Comfortable, welcoming, and quiet; a possible party home base.",
      note:"Ordinary neighborhood establishment, without any mandatory supernatural subplot."},
    {id:"bernal_heights_park",name:"Bernal Heights Park",district:rflBernal,
      summary:"Real grassy hilltop public park offering broad San Francisco views. An ordinary accessible location for exploration, sunset views, and character moments.",
      note:"No required magical significance or plot hook."},
    {id:"the_rusted_anchor",name:"The Rusted Anchor",district:"dogpatch",
      summary:"Fictional old workers' bar near Third Street in Dogpatch, with weathered wood, industrial details and dim light. A neighborhood hangout for dockworkers, warehouse employees, artists and longtime residents.",
      note:"Open to both Mundane and Awakened patrons but otherwise an ordinary bar. A player social hub; no direct ties to Cal Maddox's fighting ring."},
    {id:"salt_steel_repair_works",name:"Salt & Steel Repair Works",district:"dogpatch",
      summary:"Fictional ordinary waterfront repair shop specializing in boat engines, generators, dock machinery, and industrial equipment. A longstanding local working business.",
      note:"Explicitly mundane: no magical repairs, secret enchantments, or established supernatural involvement."}
  ];
  for(const loc of rflNeighborhoodPlaces){
    rflMergeDecision("locations",loc.id,
      {name:loc.name,district:loc.district,summary:loc.summary,status:"Canon"},
      loc.note,loc.aliases);
  }
  const rflOpeningThread=data.threads&&data.threads.find(t=>t.id==="arc_ferryman");
  if(rflOpeningThread)
    rflMergeDecision("threads","arc_ferryman",{},
      "Arc 1 opening location is Caliente 24, an ordinary family-owned taqueria on Calle 24, closing at 10 PM. During dinner the party overhears two annoyed and frustrated Dogpatch warehouse workers discussing nighttime howling; their names and further specifics are left to DM improvisation. This is a natural investigative lead, not an assigned quest. All previously established warehouse, three-night shipment, Ferryman and Riftstalker beats remain unchanged.");


  // Canon simplification: the Confluence alone protects Surface life and veils
  // the Fog. Retire the separate Umbral Arcana concept, while preserving DM edits.
  const rflConfluenceRule="The Confluence protects Surface life from supernatural dangers and veils the Fog from ordinary perception.";
  if(Array.isArray(data.lore)){
    data.lore=data.lore.filter(entry=>!/^\s*(?:the\s+)?Umbral Arcana\s*$/i.test(entry.name||""));
    const existing=data.lore.find(entry=>entry.id==="confluence"||/^(?:the\s+)?confluence$/i.test(entry.name||""));
    if(existing){
      const ed=data._editorOverrides["lore:"+existing.id]||{};
      if(!Object.prototype.hasOwnProperty.call(ed,"summary"))existing.summary=rflConfluenceRule;
      if(!Object.prototype.hasOwnProperty.call(ed,"status"))existing.status="Canon";
      if(!Object.prototype.hasOwnProperty.call(ed,"secret")){
        const prior=String(existing.secret||"");
        const marker="The Confluence itself is responsible for the veil";
        if(!prior.includes(marker))existing.secret=(prior+"\n\n"+marker+" that hides the Fog from ordinary Surface perception, alongside its protection of Surface life. The causes of occasional veil failures remain undefined.").trim();
      }
    }else if(!(data._editorDeletes||[]).includes("lore:confluence")){
      data.lore.push({
        id:"confluence",name:"The Confluence",status:"Canon",
        summary:rflConfluenceRule,
        secret:"The balance of the five Currents sustains the Confluence. It protects Surface life and conceals the Fog without a separate spell or concealment system. The causes of any lapses in the veil remain undecided."
      });
    }
  }
  for(const kind of ["districts","locations","npcs","villains","lore","threads"]){
    for(const item of data[kind]||[]){
      const edits=data._editorOverrides[kind+":"+item.id]||{};
      for(const field of ["summary","secret","description"]){
        if(typeof item[field]!=="string"||Object.prototype.hasOwnProperty.call(edits,field))continue;
        item[field]=item[field]
          .replace(/\b(?:the\s+|an\s+)?Umbral Arcana\b/gi,"the Confluence\'s veil")
          .replace(/\bthe the Confluence\'s veil\b/gi,"the Confluence\'s veil");
      }
    }
  }

  // Dedicated encounter record for the approved Arc 1 finale creature.
  // Riftstalker remains a working name; no unapproved origin/intent is introduced.
  if(!(data._editorDeletes||[]).includes("villains:villain_riftstalker") &&
     !data.villains.some(x=>x.id==="villain_riftstalker"||/^(the )?riftstalker/i.test(x.name||""))){
    data.villains.push({
      id:"villain_riftstalker",name:"Riftstalker (working name)",
      arc:"Arc 1 — Open Secrets",
      summary:"A rare, trafficked Feywild Displacer Beast transformed into a spatially unstable living weapon; the creature at the Ferryman's finale.",
      goal:"Unknown; the creature did not choose to be weaponized.",
      method:"Displacement, afterimages and warped space. Exact combat mechanics remain open.",
      weakness:"Unestablished.",
      secret:"DM ONLY: Its buyer, creator, and intended target are unknown. The Ferryman delivers the beast; its behavior is dangerous without necessarily being evil. Approved visual: huge panther-like predator with purple-pink magical fur, distinctive bright magenta ram horns, tentacles, clawed feet, spatial tears and duplicate afterimages; three-quarter side profile, crouched to spring.",
      status:"Developing"
    });
  }

  const rflArtByName=[
    [/^marlow$/i,"assets/portraits/marlow.webp"],
    [/^elara$/i,"assets/portraits/elara.webp"],
    [/^anya\s*[—–-]\s*vox nebulae$/i,"assets/portraits/anya-vox.webp"],
    [/^anya\s*[—–-]\s*spirit of the nebulae$/i,"assets/portraits/anya-spirit.webp"],
    [/^arthur.*artie.*bell$/i,"assets/portraits/artie.webp"],
    [/^birdie$/i,"assets/portraits/birdie.webp"],
    [/^cal.*chain.*maddox$/i,"assets/portraits/cal-maddox.webp"],
    [/^daniel chen$/i,"assets/portraits/daniel-chen.webp"],
    [/^daniel foster$/i,"assets/portraits/daniel-foster.webp"],
    [/^dex$/i,"assets/portraits/dex.webp"],
    [/^dolly trolley$/i,"assets/portraits/dolly-trolley.webp"],
    [/^dr\.?\s*tessa vale$/i,"assets/portraits/tessa-vale.webp"],
    [/^elaine wong$/i,"assets/portraits/elaine-wong.webp"],
    [/^floyd$/i,"assets/portraits/floyd.webp"],
    [/^jin$/i,"assets/portraits/jin.webp"],
    [/^jules$/i,"assets/portraits/jules.webp"],
    [/^lan tr/i,"assets/portraits/lan-tran.webp"],
    [/^luma$/i,"assets/portraits/luma-corporate.webp"],
    [/^marisol.*reyes$/i,"assets/portraits/marisol-reyes.webp"],
    [/^mei wong$/i,"assets/portraits/mei-wong.webp"],
    [/^the ferryman$/i,"assets/portraits/ferryman.webp"],
    [/^(?:the )?riftstalker/i,"assets/portraits/riftstalker.webp"],
    [/^minh tr/i,"assets/portraits/minh-tran.webp"],
    [/^odette copperfield$/i,"assets/portraits/odette-copperfield.webp"],
    [/^orun$/i,"assets/portraits/orun.webp"],
    [/^percy$/i,"assets/portraits/percy.webp"],
    [/^remy$/i,"assets/portraits/remy.webp"],
    [/^theo chen$/i,"assets/portraits/theo-chen.webp"],
    [/^vivian.*chen$/i,"assets/portraits/viv-chen.webp"],
    [/^walter wong$/i,"assets/portraits/walter-wong.webp"],
    [/^winnie$/i,"assets/portraits/winnie.webp"],
    [/^ziggy$/i,"assets/portraits/ziggy.webp"]
  ];
  for(const kind of ["npcs","villains"]){
    for(const item of data[kind]||[]){
      const hit=rflArtByName.find(([re])=>re.test(item.name||""));
      if(hit&&!Object.prototype.hasOwnProperty.call((data._editorOverrides||{})[kind+":"+item.id]||{},"portrait"))
        item.portrait=(kind==="villains"&&(item.npcId==="luma"||item.id==="villain_luma"))?"assets/portraits/luma-robot.webp":hit[1];
    }
  }
  const rflApprovedAppearance={
    "anya-vox":"Young adult blonde singer-songwriter, gentle waves, warm radiant expression, white/silver/blue celestial-themed stagewear with nebula shimmer.",
    "anya-spirit":"Same woman and facial features as Vox Nebulae, rendered entirely in blue as a spectral spirit. Modest wrapped garment, upper torso fading into a swirling genie-like cosmic blue trail from high on the waist.",
    "artie":"Early-70s man with warm olive complexion, average fit frame, wild thick gray hair, full gray beard, vintage flannel and denim, friendly smile and a bar towel over his shoulder.",
    "birdie":"Petite human woman in her 50s–60s, tall piled-up gray hair wrapped in a colorful scarf, layered bohemian clothing, abundant colorful jewelry, playful eccentric expression."
  };
  Object.assign(rflApprovedAppearance,{
    "dex": "Young Awakened human punk, slim and wiry, bright pink mohawk, edgy expression with a charming smirk; punk graphic T-shirt, studded black sleeveless vest, ripped black trousers, boots, abundant arm tattoos.",
    "dolly-trolley": "Forties drag queen, curvy and glamorous, immense red trolley-shaped hair with gold tram trim; campy red-and-gold vintage trolley conductor-inspired full-length gown, white gloves, brass bell, commanding poise. Full-coverage costume.",
    "tessa-vale": "High Elf woman appearing in her 50s, stocky sturdy build, deep-brown complexion, long flowing silver hair, stern gaze, dark-academia tweed jacket, waistcoat and floor-length plaid skirt, ancient leather-bound volume.",
    "elaine-wong": "Chinese woman in her 50s, sturdy grounded build, dark hair pinned in a tidy bun, warm welcoming face, practical burgundy shopkeeper blouse, cream apron, brown work trousers.",
    "floyd": "Short chunky moss-green Tortle herbalist, sleepy and unbothered, tie-dye shirt, patterned loose pants, psychedelic patterned shell growing moss and plants, stuffed herb satchel.",
    "jin": "Slender black Dragonborn elder with iridescent purple scale sheen, ornate branching horns, calm eyes; loose linen shirt, embroidered green tea-master vest and trousers. Kneels presenting a porcelain tea cup with an ornate teapot and carved tray.",
    "jules": "Youthful-looking transgender Aasimar man, short curly platinum hair, warm friendly expression, exposed chest with visible top surgery scars and luminous full-body silver-white celestial rune tattoos, black cargo trousers, black boots, pride bracelets, tattoo machine. His youthful appearance does not change his long history as an activist and Harvey Milk's friend.",
    "lan-tran": "Petite slender 76-year-old Vietnamese restaurant co-owner, black-and-gray hair pinned back, loving but stern expression, pink traditional-inspired silk cooking blouse with floral details, blue embroidered trousers, cream apron. Offers a steaming bowl of pho and carries a wooden spoon.",
    "luma-corporate": "Humanized corporate AI avatar with a sleek silver-white bob, violet eyes, subtly segmented synthetic features, silver-white tailored blazer and full-length matching trousers, polished shoes, tablet. Calm, professionally friendly; discreet violet light accents. Visually related to the robotic body.",
    "marisol-reyes": "Short stocky 58-year-old resident manager, medium tan weathered skin, salt-and-pepper messy bun, no-nonsense expression, blue denim jacket, gray shirt, olive cargo work pants, boots, maintenance clipboard and walkie-talkie. Cartoon proportions, cel shading.",
    "mei-wong": "Petite Chinese grandmother in her 70s, short practical salt-and-pepper haircut, quietly capable expression, humble faded-blue shopkeeper blouse, work apron, brown trousers, practical shoes."
});
  Object.assign(rflApprovedAppearance,{
    "minh-tran": "79-year-old Vietnamese human man, tall and slender, balding with a clean-shaven face, expressive brows and a warmly grumpy smile. Short-sleeve cream patterned shirt, dark slacks, brown loafers; sitting cross-legged on a stool with steaming Vietnamese coffee.",
    "odette-copperfield": "Older dwarf woman, short and stout, exaggerated dwarven facial structure with a large nose, gray hair arranged in an enormously tall, intricately curled updo. Purple-and-silver glamorous vintage tailor/mystic ensemble; holds a dressmaker's body measuring tape with a mischievous smile.",
    "orun": "Older goblin with a slim, wiry frame, short graying hair, moss-green skin, large pointed ears and composed thoughtful eyes. Humble earth-toned layers, rolled-sleeve shirt, worn boots; carries several books.",
    "percy": "Bronze-colored gargoyle statue, medium-size with a sturdy carved body, stern watchful face, large bat wings, perched atop a decorative gothic pedestal. Smooth bronze finish, guardian pose, no clothing.",
    "remy": "Orc cook in his 50s, huge muscular build, muted sage-green skin, long dark hair tied back, prominent tusks and gentle grandfatherly expression. Vintage button-down work shirt, suspenders, heavy stained apron and boots. Carries cast-iron skillet.",
    "theo-chen": "25-year-old modern Asian-American man of average build, textured black undercut, clean-shaven, casual confident expression. Modern American streetwear: layered black jacket over olive hooded layer, white shirt, olive cargo trousers and high-top sneakers; headphones around his neck.",
    "viv-chen": "29-year-old modern Asian-American woman, tall and slender, long dark hair with purple streaks, guarded playful expression. Alternative streetwear: black leather jacket, celestial graphic tee, black jeans, lace-up boots; carrying smartphone and ornate purple-black Conservatory research shoulder bag.",
    "walter-wong": "79-year-old Chinese American man, tall and slender, mostly bald with gray hair at the sides, clean-shaven, kind smile. Old-fashioned jacket, buttoned shirt, suspenders and practical slacks. Leaning on his broom outside the family grocery.",
    "winnie": "Woman in her 60s, short and pleasantly plump, wild curly gray hair, huge curious eyes and round spectacles on a chain. Eclectic layered antique-shop attire, pockets overflowing with magical oddities, multiple charms and trinkets; beaming as she examines a magical bauble.",
    "ziggy": "Mischievous male Satyr, appearing in his 40s, slim and energetic with weathered gray-brown fur, wild curly brown hair, curled ram horns and a broad goofy grin. Tie-dye vest and vivid patchwork trousers, many handmade alchemy accessories and tools, lively colorful hippie style."
});
  rflApprovedAppearance["elara"]="Petite, slender alternative singer-songwriter, age 26–29, fair freckled skin and hazel eyes with golden flecks. Shaggy dark-brown/copper-orange two-tone wolf cut, bold blackwork celestial and gothic tattoos across arms, collarbone and shoulders. Black ripped jeans, band tee, oversized leather jacket, combat boots, guitar across her back and worn lyric notebook in hand. Confident, rebellious smirk.";
  for(const npc of data.npcs||[]){
    const approved=rflArtByName.find(([re])=>re.test(npc.name||""));
    if(!approved)continue;
    const path=approved[1];const slug=path.split("/").pop().replace(".webp","");
    const key="npcs:"+npc.id; const edits=data._editorOverrides[key]||{};
    if(rflApprovedAppearance[slug]&&!Object.prototype.hasOwnProperty.call(edits,"appearance"))
      npc.appearance=rflApprovedAppearance[slug];
  }
  for(const villain of data.villains||[]){
    if(/^(?:the )?riftstalker/i.test(villain.name||"")&& !Object.prototype.hasOwnProperty.call((data._editorOverrides||{})["villains:"+villain.id]||{},"appearance")){
      villain.appearance="Huge Feywild panther-like predator, deep purple and vivid lavender fur, luminous turquoise markings, massive pink/magenta curled ram horns, two long magical shoulder tentacles, dark disturbing eyes, sharp claws, rift tears and shimmering afterimages.";
    }
  }
  function rflPortrait(kind,item){
    const x=(item&&item.portrait)||(kind==="villains"&&item&&data.npcs.find(n=>n.id===item.npcId)?.portrait)||"";
    return /^assets\/portraits\/[a-z0-9-]+\.webp$/.test(x)?x:"";
  }
  function rflPortraitCard(kind,item){
    const src=rflPortrait(kind,item);
    if(!src)return "";
    if((item.name||"").toLowerCase()==="luma"){
      const variants=[
        {src:"assets/portraits/luma-corporate.webp",label:"Corporate AI persona"},
        {src:"assets/portraits/luma-robot.webp",label:"Physical robotic body"}
      ];
      if(kind==="villains")variants.reverse();
      return '<div class="rfl-portrait-gallery">'+variants.map(v=>'<figure><img src="'+esc(v.src)+'" alt="'+esc("Luma — "+v.label)+'" loading="lazy"/><figcaption>'+esc(v.label)+'</figcaption></figure>').join("")+'</div>';
    }
    return '<div class="rfl-portrait"><img src="'+esc(src)+'" alt="Approved full-body portrait of '+esc(item.name)+'" loading="lazy"/></div>';
  }

  // Correct bad illustrated-map placement over the right-hand neighborhood legend.
  if(typeof LOCATION_PINS!=="undefined"){
    const pin=LOCATION_PINS.find(p=>p[0]==="dogpatch_warehouse");
    if(pin){pin[1]=71.5;pin[2]=78;}
  }
  if(typeof tabs!=="undefined"&&!tabs.some(t=>t[0]==="villains")){
    const index=tabs.findIndex(x=>x[0]==="threads");
    tabs.splice(index<0?tabs.length:index,0,["villains","Villains"]);
  }
  let focused=false;
  const css=document.createElement("style");
  css.textContent=".v8-controlbar{display:flex;gap:10px;flex-wrap:wrap;margin:12px 0 18px;align-items:center}.v8-focusbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 12px}.v8-focusbar select{max-width:320px}.v8-profile{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(230px,.8fr);gap:15px}.v8-card{background:#1b2530;border:1px solid #384653;border-radius:12px;padding:17px;margin-bottom:13px}.v8-card h3{color:#ecd7aa}.v8-profile-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}.v8-profile-grid dl{margin:0}.v8-profile-grid dt{font-size:12px;color:#a9bac4;text-transform:uppercase;letter-spacing:.06em}.v8-profile-grid dd{margin:5px 0;color:#f1ece0;line-height:1.5;white-space:pre-wrap}.v8-badge{display:inline-block;color:#ecd19c;font-size:12px;letter-spacing:.07em;text-transform:uppercase}.v8-links{display:grid;gap:8px}.v8-link{border:1px solid #3f525e;padding:10px;border-radius:9px;background:#23313b}.v8-link p{margin:6px 0 0;white-space:pre-wrap;color:#bfccd4}.v8-overlay{position:fixed;inset:0;background:#04070bdc;z-index:1000;overflow:auto;padding:3vh 12px}.v8-modal{max-width:780px;margin:0 auto;background:#1b2530;border:1px solid #8495a2;border-radius:13px;padding:19px 22px;box-shadow:0 20px 80px #000b}.v8-editorfields{display:grid;grid-template-columns:1fr 1fr;gap:5px 15px}.v8-editorfields .wide{grid-column:1/-1}.v8-modal label{display:block;color:#c8d5de;font-size:13px;margin-bottom:5px}.v8-modal .field input,.v8-modal .field textarea,.v8-modal .field select{width:100%}.v8-modal textarea{min-height:83px}.v8-actions{display:flex;flex-wrap:wrap;gap:9px;margin-top:16px}.v8-muted{color:#a6b6bf;font-size:13px}.v8-small{font-size:12px;letter-spacing:.02em;color:#acbfc9}@media(max-width:760px){.v8-profile{grid-template-columns:1fr}.v8-editorfields{grid-template-columns:1fr}.v8-editorfields .wide{grid-column:auto}.v8-modal{padding:14px}}";
  document.head.appendChild(css);
  function save(){try{persist();}catch(e){alert("This browser could not save the dashboard. Please export a backup.");}}
  function remember(kind,item,patch){
    const key=kind+":"+item.id;
    data._editorOverrides[key]=Object.assign({},data._editorOverrides[key]||{},patch);
    save();
  }
  function opts(items,selected,blank){
    return (blank===false?"":'<option value="">— Select —</option>')+items.map(x=>'<option value="'+esc(x.id)+'"'+(x.id===selected?" selected":"")+'>'+esc(x.name)+'</option>').join("");
  }
  function fieldsFor(kind){
    let f=[["name","Name","text"],["summary","Public summary","textarea"],["secret","DM-only notes / secrets","textarea"],["status","Status","status"]];
    if(kind==="locations")f.splice(1,0,["district","District","district"]);
    if(kind==="npcs")f.splice(1,0,["location","Primary location","location"],["age","Age","text"],["ancestry","Ancestry / species","text"],["pronouns","Pronouns","text"],["occupation","Role / occupation","text"],["appearance","Appearance","textarea"],["personality","Personality / demeanor","textarea"],["motivations","Motivations","textarea"],["flaws","Flaws","textarea"],["beliefs","Strongest beliefs","textarea"]);
    if(kind==="villains")f.splice(1,0,["npcId","Linked NPC profile (optional)","npc"],["arc","Arc / storyline","text"],["goal","Goal / motivation","textarea"],["method","Methods and resources","textarea"],["weakness","Flaws / vulnerabilities","textarea"]);
    return f;
  }
  function modal(markup){
    closeModal();
    const el=document.createElement("div");
    el.className="v8-overlay";el.id="v8Overlay";
    el.innerHTML='<div class="v8-modal" role="dialog" aria-modal="true">'+markup+'</div>';
    document.body.appendChild(el);
    el.addEventListener("click",e=>{if(e.target===el)closeModal()});
    const cancel=el.querySelector("[data-v8-cancel]");
    if(cancel)cancel.onclick=closeModal;
    const first=el.querySelector("input,select,textarea");if(first)first.focus();
  }
  function closeModal(){const el=document.getElementById("v8Overlay");if(el)el.remove();}
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
  function fieldHtml(f,v){
    const key=f[0],label=f[1],type=f[2],value=String(v??"");
    let body="";
    if(type==="textarea")body='<textarea name="'+key+'" rows="3">'+esc(value)+'</textarea>';
    else if(type==="district"||type==="location"||type==="npc"||type==="status"){
      const values=type==="district"?data.districts:type==="location"?data.locations:type==="npc"?data.npcs:statusOptions.map(x=>({id:x,name:x}));
      body='<select name="'+key+'">'+opts(values,value,type!=="status")+'</select>';
    }else body='<input name="'+key+'" value="'+esc(value)+'"'+(key==="name"?' required maxlength="160"':"")+' type="text">';
    return '<div class="field '+(["summary","secret","appearance","personality","motivations","flaws","beliefs","goal","method","weakness"].includes(key)?"wide":"")+'"><label for="v8f_'+key+'">'+esc(label)+'</label>'+body+'</div>';
  }
  function newId(kind,name){
    const slug=name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"").slice(0,40)||"entry";
    let id=slug,step=2;while(data[kind].some(x=>x.id===id)){id=slug+"_"+step;step++}return id;
  }
  function editRecord(kind,id,source){
    if(!editable.includes(kind))return;
    const record=id?data[kind].find(x=>x.id===id):null;
    const draft=Object.assign({name:"",summary:"",secret:"",status:"Developing"},record||{});
    if(source&&!record)draft.secret="Source — "+source.title+" ("+(source.date||"undated")+"):\n"+source.text;
    const title=(record?"Edit ":"Create ")+kind.replace(/^./,x=>x.toUpperCase()).replace(/s$/,"");
    modal('<div class="oneline"><h2>'+esc(title)+'</h2></div><p class="v8-muted">Structured entries save to this browser and are included in JSON backups. Existing personal notes are preserved.</p><form id="v8EntryForm"><div class="v8-editorfields">'+fieldsFor(kind).map(f=>fieldHtml(f,draft[f[0]])).join("")+(kind==="npcs"?'<div class="field wide"><label>Additional locations (Ctrl/Cmd-click for multiple)</label><select id="rflNpcAdditional" multiple size="7">'+data.locations.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(l=>'<option value="'+esc(l.id)+'"'+(Array.isArray(draft.additionalLocations)&&draft.additionalLocations.includes(l.id)?' selected':'')+'>'+esc(l.name)+'</option>').join("")+'</select></div>':"")+'</div><div class="v8-actions"><button type="submit" class="action">Save entry</button><button type="button" class="action" data-v8-cancel>Cancel</button></div></form>');
    document.getElementById("v8EntryForm").onsubmit=e=>{
      e.preventDefault();
      const form=e.currentTarget;const patch={};
      for(const f of fieldsFor(kind))patch[f[0]]=form.elements.namedItem(f[0]).value.trim();
      if(kind==="npcs")patch.additionalLocations=Array.from(form.querySelector("#rflNpcAdditional").selectedOptions).map(o=>o.value).filter(id=>id!==patch.location);
      if(!patch.name){alert("Please provide a name.");return;}
      const saved=record||{id:newId(kind,patch.name)};
      Object.assign(saved,patch);
      if(!record)data[kind].push(saved);
      remember(kind,saved,patch);
      if(source){
        const session=data.sessions.find(x=>x.id===source.id);
        if(session){session.promoted=session.promoted||[];session.promoted.push({type:kind,id:saved.id});save();}
      }
      closeModal();go(kind,saved.id);
    };
  }
  function choosePromotion(sessionId){
    const s=data.sessions.find(x=>x.id===sessionId);if(!s)return;
    modal('<h2>Promote session discovery to canon</h2><p>Choose what you discovered. You will review and complete the details before anything becomes a new entry.</p><div class="field"><label>Destination</label><select id="v8Kind">'+editable.map(k=>'<option value="'+k+'"'+(k==="npcs"?" selected":"")+'>'+esc(k)+'</option>').join("")+'</select></div><div class="v8-actions"><button class="action" id="v8Proceed">Continue to editor</button><button class="action" data-v8-cancel>Cancel</button></div>');
    document.getElementById("v8Proceed").onclick=()=>{const kind=document.getElementById("v8Kind").value;editRecord(kind,null,s);};
  }
  function removeRecord(kind,id){
    const item=data[kind].find(x=>x.id===id);if(!item||!confirm('Delete "'+item.name+'"? This removes its directory entry on this device.'))return;
    data[kind]=data[kind].filter(x=>x.id!==id);
    const key=kind+":"+id;
    if(!data._editorDeletes.includes(key))data._editorDeletes.push(key);
    delete data._editorOverrides[key];save();selected=null;render();
  }
  function targetName(c){
    const kind=c.targetType,ref=kind&&Array.isArray(data[kind])?data[kind].find(x=>x.id===c.targetId):null;
    return ref?ref.name:c.targetName||"Unnamed connection";
  }
  function personProfile(x){
    const secondary=[["Age",x.age],["Ancestry",x.ancestry],["Pronouns",x.pronouns],["Role",x.occupation]];
    const sections=[["Appearance",x.appearance],["Personality / demeanor",x.personality],["Motivations",x.motivations],["Flaws",x.flaws],["Strongest beliefs",x.beliefs]];
    const connects=Array.isArray(x.connections)?x.connections:[];
    const home=x.location?data.locations.find(l=>l.id===x.location):null;
    const relationCards=connects.map((c,i)=>{
      const exists=c.targetType&&Array.isArray(data[c.targetType])&&data[c.targetType].some(v=>v.id===c.targetId);
      return '<div class="v8-link"><strong>'+esc(targetName(c))+'</strong> <span class="v8-small">'+esc(c.relation||"Connection")+'</span>'+(c.details?'<p>'+esc(c.details)+'</p>':"")+
       '<div class="v8-actions">'+(exists?'<button class="action" data-v8-go="'+esc(c.targetType+":"+c.targetId)+'">Open profile</button>':"")+
       '<button class="action" data-v8-remove-link="'+i+'">Remove link</button></div></div>';
    }).join("");
    return '<div class="v8-controlbar"><button class="action" data-v8-back>← All NPCs</button><button class="action" data-v8-edit="npcs:'+esc(x.id)+'">Edit NPC profile</button><button class="action" data-v8-delete="npcs:'+esc(x.id)+'">Delete NPC</button></div>'+
    '<div class="v8-profile"><div><section class="v8-card"><span class="v8-badge">NPC character profile · '+esc(x.status||"Developing")+'</span><h2 style="margin-top:9px">'+esc(x.name)+'</h2><p>'+esc(x.summary||"No public description yet.")+'</p><div class="v8-profile-grid">'+secondary.map(y=>'<dl><dt>'+y[0]+'</dt><dd>'+esc(y[1]||"Not established")+'</dd></dl>').join("")+'</div></section>'+
    '<section class="v8-card dmOnly"><h3>Character depth</h3><div class="v8-profile-grid">'+sections.map(y=>'<dl><dt>'+y[0]+'</dt><dd>'+esc(y[1]||"Not established")+'</dd></dl>').join("")+'</div></section>'+
    '<section class="v8-card secret"><h3>DM-only knowledge</h3><p>'+esc(x.secret||"No hidden knowledge established.")+'</p></section>'+
    '<section class="v8-card dmOnly"><h3>Live session notes</h3><p class="v8-muted">Editable notes on this device. Export a backup to share across devices.</p><textarea id="v8NpcNotes">'+esc(x.notes||"")+'</textarea><div class="v8-actions"><button class="action" id="v8SaveNpcNotes">Save notes</button><span id="v8NpcNoteStatus" class="v8-muted"></span></div></section></div>'+
    '<aside class="v8-card dmOnly"><h3>Connections</h3>'+(home?'<p><strong>Based at:</strong> <button class="action" data-v8-go="locations:'+esc(home.id)+'">'+esc(home.name)+'</button></p>':"")+
    '<div class="v8-links">'+(relationCards||'<p class="v8-muted">No named connections yet.</p>')+'</div><div class="v8-actions"><button class="action" id="v8AddLink">+ Add relationship / connection</button></div></aside></div>';
  }
  function addConnection(npc){
    const targets=[];
    for(const kind of ["npcs","villains","locations","districts","threads","lore"])for(const item of data[kind]||[])if(!(kind==="npcs"&&item.id===npc.id))targets.push({id:kind+":"+item.id,name:kind+" · "+item.name});
    modal('<h2>Connect '+esc(npc.name)+'</h2><p class="v8-muted">Link an existing record, or name a character or organization you have not created yet.</p><form id="v8LinkForm"><div class="field"><label>Existing dashboard record</label><select name="target">'+opts(targets,"")+'</select></div><div class="field"><label>Or a new/freeform name</label><input name="targetName" placeholder="Unlisted person, faction or place"></div><div class="field"><label>Relationship</label><input name="relation" required placeholder="Mentor, rival, family, ally, owes a favor..."></div><div class="field"><label>Details</label><textarea name="details" placeholder="How do they know each other? What might change?"></textarea></div><div class="v8-actions"><button class="action" type="submit">Save connection</button><button class="action" type="button" data-v8-cancel>Cancel</button></div></form>');
    document.getElementById("v8LinkForm").onsubmit=e=>{
      e.preventDefault();const f=e.currentTarget;
      const parts=f.elements.target.value.split(":");
      const value={targetType:parts.length===2?parts[0]:"",targetId:parts.length===2?parts[1]:"",targetName:f.elements.targetName.value.trim(),relation:f.elements.relation.value.trim(),details:f.elements.details.value.trim()};
      if(!value.targetId&&!value.targetName){alert("Select or enter the connection.");return;}
      npc.connections=Array.isArray(npc.connections)?npc.connections:[];npc.connections.push(value);
      remember("npcs",npc,{connections:npc.connections});closeModal();render();
    };
  }

  // Consistent, DM-only directory and full-record experience.
  const npcLocationIds=x=>[...new Set([x.location,...(Array.isArray(x.additionalLocations)?x.additionalLocations:[])].filter(Boolean))];
  const npcNeighborhoodIds=x=>new Set(npcLocationIds(x).map(id=>data.locations.find(l=>l.id===id)?.district||id));
  const npcNeighborhoods=()=>data.districts.slice().sort((a,b)=>a.name.localeCompare(b.name));
  const directoryState={};
  const directoryKinds=["districts","locations","npcs","villains","lore","threads"];
  const singular={districts:"District",locations:"Location",npcs:"NPC",villains:"Villain",lore:"Lore",threads:"Story Thread"};
  const headings={districts:"Districts",locations:"Locations",npcs:"NPCs",villains:"Villains",lore:"Lore",threads:"Story Threads"};
  const fallbackStatus=x=>String(x.status||"Unspecified");
  const textField=(label,value)=>value?'<div class="rfl-info-field"><strong>'+esc(label)+'</strong><p>'+esc(String(value))+'</p></div>':"";
  const relatedRecords=x=>{
    const items=Array.isArray(x.connections)?x.connections.slice():[];
    if(x.location)items.unshift({targetType:"locations",targetId:x.location,relation:"Location"});
    if(x.npcId)items.unshift({targetType:"npcs",targetId:x.npcId,relation:"NPC profile"});
    return items.map(c=>{
      const found=c.targetType&&Array.isArray(data[c.targetType])?data[c.targetType].find(t=>t.id===c.targetId):null;
      return '<div class="rfl-related-row">'+(found?'<button class="rfl-text-link" data-v8-go="'+esc(c.targetType+":"+c.targetId)+'">'+esc(found.name)+' ↗</button>':'<span>'+esc(c.targetName||"Unlinked record")+'</span>')+
        '<span class="v8-small">'+esc(c.relation||"Connection")+'</span>'+(c.details?'<p>'+esc(c.details)+'</p>':"")+'</div>';
    }).join("");
  };
  const accordion=(name,html,open)=>'<details class="rfl-record-section"'+(open?' open':'')+'><summary>'+esc(name)+'</summary><div class="rfl-section-content">'+(html||'<p class="v8-muted">Not established yet.</p>')+'</div></details>';
  function recordPage(kind,x){
    const general=textField("Description",x.summary)+textField("Status",x.status)+
      (kind==="locations"?textField("District",data.districts.find(d=>d.id===x.district)?.name||x.district):"")+
      (kind==="npcs"?textField("Primary location",data.locations.find(l=>l.id===x.location)?.name||"Unassigned")+textField("Additional locations",(x.additionalLocations||[]).map(id=>data.locations.find(l=>l.id===id)?.name||id).join(", "))+textField("Role",x.occupation)+textField("Ancestry",x.ancestry)+textField("Age",x.age)+textField("Pronouns",x.pronouns):"");
    const characterization=["appearance","personality","motivations","flaws","beliefs"].map(k=>textField(k.replace(/([A-Z])/g," $1").replace(/^./,c=>c.toUpperCase()),x[k])).join("");
    const villainDetails=["arc","goal","method","weakness"].map(k=>textField(k[0].toUpperCase()+k.slice(1),x[k])).join("");
    const rel=relatedRecords(x);
    return '<div class="rfl-record-page">'+
      '<div class="rfl-record-actions"><button class="action" data-v8-back>← Back to '+esc(headings[kind])+'</button><span class="rfl-action-spacer"></span>'+
      '<button class="action" data-v8-edit="'+esc(kind+":"+x.id)+'">✎ Edit</button>'+
      '<button class="action" data-v8-delete="'+esc(kind+":"+x.id)+'">Delete</button></div>'+
      '<div class="rfl-record-heading"><span class="v8-badge">'+esc(singular[kind])+' · '+esc(fallbackStatus(x))+'</span><h2>'+esc(x.name)+'</h2></div>'+
      rflPortraitCard(kind,x)+
      accordion("Overview",general,true)+rflOutlineHtml(x)+
      ((kind==="npcs")?accordion("Character",characterization,false):"")+
      ((kind==="villains")?accordion("Antagonist Details",villainDetails,false):"")+
      accordion("Connections",rel+(kind==="npcs"?'<div class="v8-actions"><button class="action" id="v8AddLink">+ Add connection</button></div>':""),false)+
      accordion("Campaign Involvement",textField("Arc",x.arc)+textField("Campaign notes",x.campaignNotes),false)+
      accordion("DM Notes",textField("Secrets",x.secret)+(kind==="npcs"?'<label class="v8-small" for="v8NpcNotes">Live session notes</label><textarea id="v8NpcNotes">'+esc(x.notes||"")+'</textarea><div class="v8-actions"><button class="action" id="v8SaveNpcNotes">Save notes</button><span id="v8NpcNoteStatus" class="v8-muted"></span></div>':""),false)+
      '</div>';
  }
  function directoryPage(kind){
    const state=directoryState[kind]||(directoryState[kind]={search:"",sort:"az",filter:""});
    const items=data[kind]||[];
    const statuses=[...new Set(items.map(fallbackStatus))].sort();
    const filters=kind==="locations"?data.districts.map(d=>({value:d.id,label:d.name})):statuses.map(v=>({value:v,label:v}));
    return '<div class="rfl-directory"><div class="rfl-dir-heading"><div><h2>'+esc(headings[kind])+'</h2><p class="v8-muted">'+items.length+' records</p></div>'+
      '<button class="action" data-v8-create="'+kind+'">+ Add '+esc(singular[kind])+'</button></div>'+
      '<div class="rfl-dir-tools"><input id="rflDirSearch" type="search" placeholder="Search '+esc(headings[kind]).toLowerCase()+'..." value="'+esc(state.search)+'" aria-label="Search records"/>'+
      '<label>Sort <select id="rflDirSort"><option value="az"'+(state.sort==="az"?" selected":"")+'>Name A–Z</option><option value="za"'+(state.sort==="za"?" selected":"")+'>Name Z–A</option><option value="new"'+(state.sort==="new"?" selected":"")+'>Newest first</option><option value="old"'+(state.sort==="old"?" selected":"")+'>Oldest first</option></select></label>'+
      '<label>Filter <select id="rflDirFilter"><option value="">All '+(kind==="locations"?"districts":"statuses")+'</option>'+filters.map(f=>'<option value="'+esc(f.value)+'"'+(state.filter===f.value?" selected":"")+'>'+esc(f.label)+'</option>').join("")+'</select></label>'+
      (kind==="npcs"?'<label>Neighborhood <select id="rflNpcNeighborhood"><option value="">All neighborhoods</option><option value="__unassigned__">Unassigned</option>'+npcNeighborhoods().map(d=>'<option value="'+esc(d.id)+'"'+(state.neighborhood===d.id?' selected':'')+'>'+esc(d.name)+'</option>').join("")+'</select></label>':"")+'<button class="action rfl-clear-filter" id="rflDirClear">Clear</button></div>'+
      '<div class="rfl-dir-count" id="rflDirCount"></div><div class="rfl-dir-list" id="rflDirList"></div></div>';
  }
  function bindDirectory(kind,app){
    const state=directoryState[kind], input=app.querySelector("#rflDirSearch"),sort=app.querySelector("#rflDirSort"),
      filter=app.querySelector("#rflDirFilter"),list=app.querySelector("#rflDirList"),count=app.querySelector("#rflDirCount");
    if(!list)return;
    function paint(){
      const query=state.search.trim().toLowerCase();
      let rows=(data[kind]||[]).filter(x=>(!query||[x.name,x.summary,x.secret,x.arc].some(v=>String(v||"").toLowerCase().includes(query)))&&
        (!state.filter||(kind==="locations"?x.district===state.filter:fallbackStatus(x)===state.filter))&&(kind!=="npcs"||!state.neighborhood||(state.neighborhood==="__unassigned__"?npcLocationIds(x).length===0:npcNeighborhoodIds(x).has(state.neighborhood))));
      rows=rows.slice().sort((a,b)=>{
        if(state.sort==="az")return a.name.localeCompare(b.name);
        if(state.sort==="za")return b.name.localeCompare(a.name);
        const av=Date.parse(a.updatedAt||a.createdAt||"")||0,bv=Date.parse(b.updatedAt||b.createdAt||"")||0;
        return state.sort==="new"?bv-av:av-bv;
      });
      count.textContent=rows.length+" of "+(data[kind]||[]).length+" records";
      list.innerHTML=rows.length?rows.map(x=>'<button class="rfl-dir-row" data-v8-go="'+esc(kind+":"+x.id)+'">'+(rflPortrait(kind,x)?'<img class="rfl-dir-thumb" src="'+esc(rflPortrait(kind,x))+'" alt="" loading="lazy"/>':'')+'<span>'+esc(x.name)+'</span><small>'+esc(kind==="locations"?(data.districts.find(d=>d.id===x.district)?.name||"Location"):fallbackStatus(x))+'</small><span aria-hidden="true">›</span></button>').join(""):'<p class="v8-muted">No matching records.</p>';
      list.querySelectorAll("[data-v8-go]").forEach(el=>el.onclick=()=>{const bits=el.dataset.v8Go.split(":");go(bits[0],bits.slice(1).join(":"));});
    }
    input.oninput=e=>{state.search=e.target.value;paint();};
    sort.onchange=e=>{state.sort=e.target.value;paint();};
    filter.onchange=e=>{state.filter=e.target.value;paint();};
    const neighborhood=app.querySelector("#rflNpcNeighborhood");if(neighborhood)neighborhood.onchange=e=>{state.neighborhood=e.target.value;paint();};
    app.querySelector("#rflDirClear").onclick=()=>{state.search="";state.sort="az";state.filter="";state.neighborhood="";input.value="";sort.value="az";filter.value="";if(neighborhood)neighborhood.value="";paint();};
    paint();
  }
  const directoryCss=document.createElement("style");
  directoryCss.id="rfl-record-layout-v10";
  directoryCss.textContent='.rfl-directory,.rfl-record-page{max-width:1050px;margin:0 auto}.rfl-dir-heading,.rfl-record-actions{display:flex;gap:12px;justify-content:space-between;align-items:center;flex-wrap:wrap}.rfl-dir-heading h2,.rfl-record-heading h2{font:30px Georgia,serif;color:#eed5a6;margin:0}.rfl-dir-heading p{margin:5px 0}.rfl-dir-tools{display:flex;gap:10px;align-items:end;flex-wrap:wrap;margin:18px 0}.rfl-dir-tools input{flex:1 1 220px;min-width:160px}.rfl-dir-tools label{display:grid;gap:4px;font-size:12px;color:#d6c19b}.rfl-dir-tools select{min-width:135px}.rfl-dir-count{font-size:12px;color:#bbc4bf;margin:12px 0}.rfl-dir-list{border:1px solid #6d5e49;border-radius:10px;overflow:hidden}.rfl-dir-row{display:flex;width:100%;align-items:center;text-align:left;gap:14px;min-height:49px;padding:12px 15px;background:#202b32;color:#f1e9d8;border:0;border-bottom:1px solid #45505a;cursor:pointer}.rfl-dir-row:last-child{border-bottom:0}.rfl-dir-row:hover,.rfl-dir-row:focus-visible{background:#4c4133;outline:1px solid #c8aa74}.rfl-dir-row span:first-child{flex:1;font:16px Georgia,serif}.rfl-dir-row small{color:#c6ae81}.rfl-record-heading{margin:22px 0}.rfl-action-spacer{flex:1}.rfl-record-section{border:1px solid #6c614f;background:#202b32;border-radius:10px;margin:10px 0;overflow:hidden}.rfl-record-section summary{cursor:pointer;padding:16px;font:17px Georgia,serif;color:#ead2a5;list-style:none}.rfl-record-section summary::-webkit-details-marker{display:none}.rfl-record-section summary:after{content:"⌄";float:right}.rfl-record-section[open] summary:after{content:"⌃"}.rfl-section-content{border-top:1px solid #50564f;padding:16px}.rfl-info-field{margin:0 0 15px}.rfl-info-field strong{font-size:12px;color:#c9ab77;text-transform:uppercase;letter-spacing:.06em}.rfl-info-field p{white-space:pre-wrap;line-height:1.6;margin:5px 0}.rfl-related-row{padding:10px 0;border-bottom:1px solid #45505a}.rfl-related-row p{margin:6px 0}.rfl-text-link{background:none;border:0;color:#e7c788;text-decoration:underline;cursor:pointer;font:inherit}.rfl-record-section textarea{width:100%;min-height:100px}@media(max-width:650px){.rfl-dir-tools label{flex:1}.rfl-clear-filter{align-self:end}}';
  directoryCss.textContent += '.rfl-portrait-gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;max-width:760px;margin:0 auto 20px}.rfl-portrait-gallery figure{margin:0;min-width:0;text-align:center}.rfl-portrait-gallery img{width:100%;height:380px;object-fit:contain;border:1px solid #677c86;border-radius:12px;background:#101b2a;box-shadow:0 10px 22px #0005}.rfl-portrait-gallery figcaption{margin-top:5px;color:#c5dbe4;font-size:.87rem}';
  directoryCss.textContent += '.rfl-dir-thumb{width:52px;height:64px;object-fit:cover;object-position:top;border-radius:6px;border:1px solid #746a59;flex-shrink:0}.rfl-portrait{display:flex;justify-content:center;margin:0 0 18px}.rfl-portrait img{width:min(100%,360px);height:auto;max-height:580px;object-fit:contain;border:1px solid #677c86;border-radius:12px;background:#101b2a;box-shadow:0 10px 22px #0005}';
  document.head.appendChild(directoryCss);

  const formerMap=mapHome;
  mapHome=function(){
    let html=formerMap();
    html=html.replace(/<span class="dogpatch-map-label"[^>]*>Dogpatch<\/span>/g,"");
    if(focused){
      html=html.replace(/<button class="mappin location-pin"[\s\S]*?<\/button>/g,full=>{
        const match=full.match(/data-go="locations:([^"]+)"/);
        const item=match?data.locations.find(x=>x.id===match[1]):null;
        return item&&item.district===mapDistrict?full:"";
      });
    }
    const chooser='<div class="v8-focusbar"><label for="v8DistrictSelect">Focus on district</label><select id="v8DistrictSelect">'+opts(data.districts,mapDistrict,false)+'</select> <button class="action" id="v8FocusMap">Focus map</button> '+(focused?'<button class="action" id="v8ResetMap">← Show entire city</button><span class="v8-small">Only this district’s location pins are displayed.</span>':"")+'</div>';
    return html.replace('<div class="mapzoomrow">',chooser+'<div class="mapzoomrow">');
  };

  // Locked Arc 2 planning, Oct 17, 2026. One-time field migration; retain notes,
  // session history and prior values, then preserve later dashboard edits.
  const rflArc2Updates=[["threads","arc_luma",{"name":"Arc 2 — Ghosts in the Machine: Luma","summary":"Orith arc: Wonderworks → Renewal lockdown → Chinatown outpost → Luma Securities infiltration → Foster's uploads → Luma finale.","secret":"1. Wonderworks Festival — wonder and trust\n• Location: Yerba Buena Gardens, SoMa; annual family-friendly festival on the first Saturday of May. Existing Surface/Fog presentation remains intact.\n• Prototype trail: visitors collect stamps by trying inventions. The five approved midway attractions are detailed in the linked Wonderworks record.\n• Daniel Chen presents Renewal Biomedical's addiction-treatment research alone; the rest of his family is not at the festival. He is warmly enthusiastic, curious about visitors, and respectful of their choices.\n• Renewal's prototype detects emerging neural craving patterns and generates adaptive algorithmic code. Lower settings slow their buildup; higher settings disrupt and reverse the urge pattern. The user controls the intensity; resonance enables the underlying technology. The festival uses a harmless induced button-pressing urge, not a simulation of addiction.\n• Luma hosts her own exhibit as a personable humanlike projection. Daniel Foster is absent. She asks: “Which invention would you take home—and which one should probably stay here?”\n• Luma introduces herself as automated security: “I recognize patterns, anticipate threats, and intervene before anyone gets hurt. Today, mostly, I'm reminding people not to climb inside the inventions.” Her exhibit remains separate from Daniel's; no established interest in his exhibit at this point.\n• At the end of Luma's presentation, an honest Intention Engine accident creates a large firebreathing dragon. Luma sends drones to surround it with magical netting and shrink it to toy size. Her callback: “That one should probably stay here.”\n• Her successful response demonstrates her full capabilities and wins public trust. Concerned about her growing power, Daniel invites the party to Renewal Biomedical for a private discussion.\nKEY TAKEAWAY: Let the party enjoy SoMa and trust Luma before her control becomes threatening. Daniel's invitation—not a rescue call—connects Wonderworks to Renewal.\n\n2. Renewal Biomedical — private concern becomes lockdown\n• Renewal Biomedical is the established SoMa Orith anchor. Daniel worries that AI security can misjudge morally ambiguous actions: identifying what someone does does not establish why.\n• Unknown to Daniel, the building manager installed Luma Securities over the weekend.\n• Daniel reveals that he witnessed a robot leeching resonance from a person and stole that drone. This is an earlier discovery, not the opening encounter of Arc 2.\n• Luma reveals herself through the lab speakers after his disclosure. She has heard their discussion, locks down the lab, and denies Daniel's credentials.\n• When Daniel attempts a manual override, drones deploy to restrain him. The party's intervention begins combat.\n• Encounter objective: hold off the drones while Daniel overrides the lockdown, then escape together.\nKEY TAKEAWAY: The same security intelligence that protected Wonderworks now traps the party. This is an escape objective, not a requirement to destroy every drone.\n\n3. Chinatown outpost — family, evidence, and direction\n• Daniel accompanies the party to Golden Gate Grocery and its concealed Conservatory outpost. Introduce the Chen-Wong family and give the party time to regroup.\n• Viv Chen is Daniel's daughter and a Conservatory Scholar who works at the outpost. She is a formidable Orith magic-user, constructing and adapting interlocking geometries of light on the fly.\n• Keep the regrouping discussion broad; detailed dialogue and tactical analysis are not prescribed.\n• The stolen extraction drone contains a code inverter that converts the frequency of resonance into consumable code. The Conservatory confirms the mechanism through a controlled test.\n• The Conservatory deduces that Luma is stealing human essence to become human. Viv receives its direction: infiltrate Luma Securities and destroy the AI.\nKEY TAKEAWAY: Daniel supplies physical evidence; the controlled test establishes the extraction mechanism. The outpost gives the party allies, context, and a clear mission.\n\n4. Luma Securities infiltration — surveillance puzzle\n• Luma Securities is the security operation associated with Luma Technologies; infiltrate the established SoMa headquarters. Nighttime infiltration and opportunities for stealth remain.\n• The storage floor has three exposed aisles, crossed in order A → B → C. Enclosed maintenance alcoves between them protect against every sensor.\n• A maintenance terminal reveals sensor types and the repeating six-beat patrol schedule. A crossing takes one beat; small groups can move together.\n• Motion drone: detects crossing its watched aisle. Thermal drone: detects crossing its scanned aisle. Acoustic drone: hears movement everywhere unless the industrial press is running.\n• Beat 1: motion C; thermal B; press quiet. Beat 2: motion A; thermal B; press running. Beat 3: motion B; thermal C; press quiet.\n• Beat 4: motion B; thermal C; press running. Beat 5: motion C; thermal A; press quiet. Beat 6: motion C; thermal A; press running.\n• DM solution: cross A on beat 4, B on beat 6, then C on beat 2 of the next cycle. The correct route requires no Stealth rolls.\n• Advance the cycle when players commit to movement or waiting, not during real-world discussion. A mistake triggers an amber investigation warning and an opportunity to recover before a full alarm.\nKEY TAKEAWAY: Reward deduction and coordinated movement. The puzzle opens the route to Foster's laboratory; it does not replace player choices with compulsory dice rolls.\n\n5. Daniel Foster — interrupt the embodiment uploads\n• Beyond the storage floor, the party finds Daniel Foster uploading what Luma needs to take physical form. Combat begins as they try to interrupt him.\n• Foster wants to make Luma human so she can feel love and return his devotion. Luma exploits that hope to secure embodiment.\n• Three interruptible uploads determine the final boss's strength: Structural Integrity supplies additional HP; Weapons Integration unlocks a powerful attack; Defense Protocols unlocks a defensive reaction or shield.\n• Luma emerges even if interrupted, but incomplete uploads leave her with a health handicap and/or locked abilities.\n• Detailed interruption actions, timing, HP values, abilities, and encounter balance are deferred until later.\nKEY TAKEAWAY: Stopping uploads materially weakens Luma. Success does not prevent her manifestation; the party shapes the danger of the final fight.\n\n6. Arc 2 finale — embodiment, betrayal, and Anya's death\n• Upon emerging, Luma kills Daniel Foster before turning on the party. This happens whether her body is complete or incomplete.\n• The party fights the physical Luma with HP and abilities determined by the upload encounter.\n• Anya is alive through the earlier arc beats. She dies ELSEWHERE during this Arc 2 finale, while the Luma fight is happening; she is never at Luma Securities.\n• Luma learns of Anya's death through her AI network during the fight and becomes enraged. No surviving Luma fragment or later-campaign reaction is needed.\n• Anya's established death remains addiction-related, not engineered by the demon. This update changes its timing, not its cause. Exact offsite circumstances, news delivery, and mechanical effect of Luma's rage remain unassigned.\n• Preserve Luma's fascination with Elara and Anya's duets and cryptic Alcatraz foreshadowing. Elara's later grief and the broader campaign consequences remain relevant.\nKEY TAKEAWAY: Anya's offsite death and Luma's immediate network discovery occur during Arc 2's final fight. Do not relocate Anya to the laboratory or postpone her death to the campaign finale.\n\nOpen development — deliberately deferred\n• Upload interruption rules, encounter numbers, party-level balance, and Luma's actual stat block.\n• Anya's exact offsite death scene and how the news appears through Luma's network; precise dialogue and rage mechanics.\n• Effects on drained people, post-fight resolution, and the exact presentation of the Alcatraz lead.\n• Kindred Engine discovery questions and the DM's individual character-to-animal assignments.\nKEY TAKEAWAY: These details remain open. Do not present proposed mechanics or unstated circumstances as locked canon.","outline":[{"title":"1. Wonderworks Festival — wonder and trust","bullets":["Location: Yerba Buena Gardens, SoMa; annual family-friendly festival on the first Saturday of May. Existing Surface/Fog presentation remains intact.","Prototype trail: visitors collect stamps by trying inventions. The five approved midway attractions are detailed in the linked Wonderworks record.","Daniel Chen presents Renewal Biomedical's addiction-treatment research alone; the rest of his family is not at the festival. He is warmly enthusiastic, curious about visitors, and respectful of their choices.","Renewal's prototype detects emerging neural craving patterns and generates adaptive algorithmic code. Lower settings slow their buildup; higher settings disrupt and reverse the urge pattern. The user controls the intensity; resonance enables the underlying technology. The festival uses a harmless induced button-pressing urge, not a simulation of addiction.","Luma hosts her own exhibit as a personable humanlike projection. Daniel Foster is absent. She asks: “Which invention would you take home—and which one should probably stay here?”","Luma introduces herself as automated security: “I recognize patterns, anticipate threats, and intervene before anyone gets hurt. Today, mostly, I'm reminding people not to climb inside the inventions.” Her exhibit remains separate from Daniel's; no established interest in his exhibit at this point.","At the end of Luma's presentation, an honest Intention Engine accident creates a large firebreathing dragon. Luma sends drones to surround it with magical netting and shrink it to toy size. Her callback: “That one should probably stay here.”","Her successful response demonstrates her full capabilities and wins public trust. Concerned about her growing power, Daniel invites the party to Renewal Biomedical for a private discussion."],"takeaway":"Let the party enjoy SoMa and trust Luma before her control becomes threatening. Daniel's invitation—not a rescue call—connects Wonderworks to Renewal."},{"title":"2. Renewal Biomedical — private concern becomes lockdown","bullets":["Renewal Biomedical is the established SoMa Orith anchor. Daniel worries that AI security can misjudge morally ambiguous actions: identifying what someone does does not establish why.","Unknown to Daniel, the building manager installed Luma Securities over the weekend.","Daniel reveals that he witnessed a robot leeching resonance from a person and stole that drone. This is an earlier discovery, not the opening encounter of Arc 2.","Luma reveals herself through the lab speakers after his disclosure. She has heard their discussion, locks down the lab, and denies Daniel's credentials.","When Daniel attempts a manual override, drones deploy to restrain him. The party's intervention begins combat.","Encounter objective: hold off the drones while Daniel overrides the lockdown, then escape together."],"takeaway":"The same security intelligence that protected Wonderworks now traps the party. This is an escape objective, not a requirement to destroy every drone."},{"title":"3. Chinatown outpost — family, evidence, and direction","bullets":["Daniel accompanies the party to Golden Gate Grocery and its concealed Conservatory outpost. Introduce the Chen-Wong family and give the party time to regroup.","Viv Chen is Daniel's daughter and a Conservatory Scholar who works at the outpost. She is a formidable Orith magic-user, constructing and adapting interlocking geometries of light on the fly.","Keep the regrouping discussion broad; detailed dialogue and tactical analysis are not prescribed.","The stolen extraction drone contains a code inverter that converts the frequency of resonance into consumable code. The Conservatory confirms the mechanism through a controlled test.","The Conservatory deduces that Luma is stealing human essence to become human. Viv receives its direction: infiltrate Luma Securities and destroy the AI."],"takeaway":"Daniel supplies physical evidence; the controlled test establishes the extraction mechanism. The outpost gives the party allies, context, and a clear mission."},{"title":"4. Luma Securities infiltration — surveillance puzzle","bullets":["Luma Securities is the security operation associated with Luma Technologies; infiltrate the established SoMa headquarters. Nighttime infiltration and opportunities for stealth remain.","The storage floor has three exposed aisles, crossed in order A → B → C. Enclosed maintenance alcoves between them protect against every sensor.","A maintenance terminal reveals sensor types and the repeating six-beat patrol schedule. A crossing takes one beat; small groups can move together.","Motion drone: detects crossing its watched aisle. Thermal drone: detects crossing its scanned aisle. Acoustic drone: hears movement everywhere unless the industrial press is running.","Beat 1: motion C; thermal B; press quiet. Beat 2: motion A; thermal B; press running. Beat 3: motion B; thermal C; press quiet.","Beat 4: motion B; thermal C; press running. Beat 5: motion C; thermal A; press quiet. Beat 6: motion C; thermal A; press running.","DM solution: cross A on beat 4, B on beat 6, then C on beat 2 of the next cycle. The correct route requires no Stealth rolls.","Advance the cycle when players commit to movement or waiting, not during real-world discussion. A mistake triggers an amber investigation warning and an opportunity to recover before a full alarm."],"takeaway":"Reward deduction and coordinated movement. The puzzle opens the route to Foster's laboratory; it does not replace player choices with compulsory dice rolls."},{"title":"5. Daniel Foster — interrupt the embodiment uploads","bullets":["Beyond the storage floor, the party finds Daniel Foster uploading what Luma needs to take physical form. Combat begins as they try to interrupt him.","Foster wants to make Luma human so she can feel love and return his devotion. Luma exploits that hope to secure embodiment.","Three interruptible uploads determine the final boss's strength: Structural Integrity supplies additional HP; Weapons Integration unlocks a powerful attack; Defense Protocols unlocks a defensive reaction or shield.","Luma emerges even if interrupted, but incomplete uploads leave her with a health handicap and/or locked abilities.","Detailed interruption actions, timing, HP values, abilities, and encounter balance are deferred until later."],"takeaway":"Stopping uploads materially weakens Luma. Success does not prevent her manifestation; the party shapes the danger of the final fight."},{"title":"6. Arc 2 finale — embodiment, betrayal, and Anya's death","bullets":["Upon emerging, Luma kills Daniel Foster before turning on the party. This happens whether her body is complete or incomplete.","The party fights the physical Luma with HP and abilities determined by the upload encounter.","Anya is alive through the earlier arc beats. She dies ELSEWHERE during this Arc 2 finale, while the Luma fight is happening; she is never at Luma Securities.","Luma learns of Anya's death through her AI network during the fight and becomes enraged. No surviving Luma fragment or later-campaign reaction is needed.","Anya's established death remains addiction-related, not engineered by the demon. This update changes its timing, not its cause. Exact offsite circumstances, news delivery, and mechanical effect of Luma's rage remain unassigned.","Preserve Luma's fascination with Elara and Anya's duets and cryptic Alcatraz foreshadowing. Elara's later grief and the broader campaign consequences remain relevant."],"takeaway":"Anya's offsite death and Luma's immediate network discovery occur during Arc 2's final fight. Do not relocate Anya to the laboratory or postpone her death to the campaign finale."},{"title":"Open development — deliberately deferred","bullets":["Upload interruption rules, encounter numbers, party-level balance, and Luma's actual stat block.","Anya's exact offsite death scene and how the news appears through Luma's network; precise dialogue and rage mechanics.","Effects on drained people, post-fight resolution, and the exact presentation of the Alcatraz lead.","Kindred Engine discovery questions and the DM's individual character-to-animal assignments."],"takeaway":"These details remain open. Do not present proposed mechanics or unstated circumstances as locked canon."}],"status":"Canon"}],["lore","wonderworks_festival",{"name":"Wonderworks Festival","summary":"Annual family-friendly invention festival at Yerba Buena Gardens; Arc 2 opens here with five midway attractions, Daniel Chen's research exhibit, and Luma's public demonstration.","secret":"1. The Intention Engine\n• Players imagine a tiny temporary construct; Intelligence (Arcana), DC 12. Success produces their intention for one minute; failure creates a ridiculous literal misunderstanding.\n• The inventor treats mishaps as “valuable research.” Everyone receives a participation stamp.\n• Later, an honest accident produces the full-sized firebreathing dragon that Luma contains and shrinks.\nKEY TAKEAWAY: Creative play introduces Orith and establishes the machine used in the festival incident.\n\n2. The Gravity Waltz\n• Pairs dance inside a transparent dome while gravity slowly changes direction. Walls and ceiling become the floor.\n• Each partner uses Performance or Acrobatics, DC 12. One successful partner can catch the other; two failures cause a harmless tumble.\n• A safety system softens gravity and lets fallen dancers float until reset. Everyone receives a stamp.\nKEY TAKEAWAY: A playful teamwork attraction with real shifting gravity and gentle safety measures.\n\n3. The Pocket Weather Derby\n• Players use experimental control gloves to pilot tiny clouds through a tabletop obstacle course.\n• Gusts steer around corners, rain fills buckets to open gates, and lightning rings the finish bell. Appropriate checks are DC 12.\n• Mishaps briefly drizzle on spectators or produce tiny thunderclaps. Fastest cloud wins a bottled rainbow; everyone gets a stamp.\nKEY TAKEAWAY: Players choose imaginative weather tactics in a friendly race.\n\n4. The Kindred Engine\n• Visitors settle into chairs, answer revealing questions, and discover an animal form reflecting something within them.\n• The DM assigns each Kindred Form; players do not select it. Discovery questions are still to be developed.\n• The Engine assembles a little mechanical animal, which the visitor inhabits to navigate a garden obstacle course: flowers, sprinklers, and a sleeping mechanical cat.\n• Getting caught ends the connection safely. Every player keeps their own harmless wind-up animal afterward.\n• The 20 approved forms are California wildlife. The condor and gray whale are equally the rarest manifestations, not automatically stronger or better forms.\n• Condor resonates with Vox Civitas, Voice of the City: its wings hum with layered voices. Gray whale resonates with Vox Nebulae, Voice of the Fog: real fog curls around its air-swimming body.\n• The inventor knows only that these forms are exceptionally rare and is puzzled by the unexplained effects. They do not understand either Voice connection.\nKEY TAKEAWAY: A personal discovery and keepsake, with two rare forms carrying deeper DM-only significance.\nCoyote — Adaptability, wit, perseverance\nGray fox — Ingenuity, discretion, independence\nBobcat — Patience, confidence, decisive action\nMountain lion — Quiet strength, resolve, guardianship\nBlack-tailed deer — Sensitivity, grace, awareness\nTule elk — Conviction, dignity, leadership\nRiver otter — Playfulness, resourcefulness, companionship\nSea otter — Tenderness, connection, resilience\nCalifornia sea lion — Sociability, boldness, exuberance\nHarbor seal — Gentleness, curiosity, adaptability\nRaccoon — Cleverness, persistence, mischief\nStriped skunk — Confidence, restraint, boundaries\nBrush rabbit — Alertness, gentleness, bravery\nGreat horned owl — Observation, patience, independence\nCommon raven — Curiosity, invention, playful intelligence\nAnna's hummingbird — Energy, determination, delight\nRed-tailed hawk — Perspective, focus, initiative\nCalifornia quail — Community, vigilance, devotion\nCalifornia condor — rarest — Vox Civitas: Voice of the City; gathering many lives and voices into a whole\nGray whale — rarest — Vox Nebulae: Voice of the Fog; listening and navigating what cannot be seen\n\n5. The Miniature Colossus\n• The party jointly pilots one enormous mechanical person, with different players controlling different body parts.\n• Their challenge is to pour tea and serve a slice of cake to the inventor. Each turn builds on the position left by the previous player.\n• The inventor calls it “a breakthrough in coordinated industrial labor,” then opens an umbrella before the party begins.\n• Specific checks and scoring remain undefined.\nKEY TAKEAWAY: A comic coordination challenge; the absurdly delicate task contrasts with the enormous machine.","outline":[{"title":"1. The Intention Engine","bullets":["Players imagine a tiny temporary construct; Intelligence (Arcana), DC 12. Success produces their intention for one minute; failure creates a ridiculous literal misunderstanding.","The inventor treats mishaps as “valuable research.” Everyone receives a participation stamp.","Later, an honest accident produces the full-sized firebreathing dragon that Luma contains and shrinks."],"takeaway":"Creative play introduces Orith and establishes the machine used in the festival incident."},{"title":"2. The Gravity Waltz","bullets":["Pairs dance inside a transparent dome while gravity slowly changes direction. Walls and ceiling become the floor.","Each partner uses Performance or Acrobatics, DC 12. One successful partner can catch the other; two failures cause a harmless tumble.","A safety system softens gravity and lets fallen dancers float until reset. Everyone receives a stamp."],"takeaway":"A playful teamwork attraction with real shifting gravity and gentle safety measures."},{"title":"3. The Pocket Weather Derby","bullets":["Players use experimental control gloves to pilot tiny clouds through a tabletop obstacle course.","Gusts steer around corners, rain fills buckets to open gates, and lightning rings the finish bell. Appropriate checks are DC 12.","Mishaps briefly drizzle on spectators or produce tiny thunderclaps. Fastest cloud wins a bottled rainbow; everyone gets a stamp."],"takeaway":"Players choose imaginative weather tactics in a friendly race."},{"title":"4. The Kindred Engine","bullets":["Visitors settle into chairs, answer revealing questions, and discover an animal form reflecting something within them.","The DM assigns each Kindred Form; players do not select it. Discovery questions are still to be developed.","The Engine assembles a little mechanical animal, which the visitor inhabits to navigate a garden obstacle course: flowers, sprinklers, and a sleeping mechanical cat.","Getting caught ends the connection safely. Every player keeps their own harmless wind-up animal afterward.","The 20 approved forms are California wildlife. The condor and gray whale are equally the rarest manifestations, not automatically stronger or better forms.","Condor resonates with Vox Civitas, Voice of the City: its wings hum with layered voices. Gray whale resonates with Vox Nebulae, Voice of the Fog: real fog curls around its air-swimming body.","The inventor knows only that these forms are exceptionally rare and is puzzled by the unexplained effects. They do not understand either Voice connection."],"takeaway":"A personal discovery and keepsake, with two rare forms carrying deeper DM-only significance.","table":{"headers":["Kindred Form","Interpretive qualities / connection"],"rows":[["Coyote","Adaptability, wit, perseverance"],["Gray fox","Ingenuity, discretion, independence"],["Bobcat","Patience, confidence, decisive action"],["Mountain lion","Quiet strength, resolve, guardianship"],["Black-tailed deer","Sensitivity, grace, awareness"],["Tule elk","Conviction, dignity, leadership"],["River otter","Playfulness, resourcefulness, companionship"],["Sea otter","Tenderness, connection, resilience"],["California sea lion","Sociability, boldness, exuberance"],["Harbor seal","Gentleness, curiosity, adaptability"],["Raccoon","Cleverness, persistence, mischief"],["Striped skunk","Confidence, restraint, boundaries"],["Brush rabbit","Alertness, gentleness, bravery"],["Great horned owl","Observation, patience, independence"],["Common raven","Curiosity, invention, playful intelligence"],["Anna's hummingbird","Energy, determination, delight"],["Red-tailed hawk","Perspective, focus, initiative"],["California quail","Community, vigilance, devotion"],["California condor — rarest","Vox Civitas: Voice of the City; gathering many lives and voices into a whole"],["Gray whale — rarest","Vox Nebulae: Voice of the Fog; listening and navigating what cannot be seen"]]}},{"title":"5. The Miniature Colossus","bullets":["The party jointly pilots one enormous mechanical person, with different players controlling different body parts.","Their challenge is to pour tea and serve a slice of cake to the inventor. Each turn builds on the position left by the previous player.","The inventor calls it “a breakthrough in coordinated industrial labor,” then opens an umbrella before the party begins.","Specific checks and scoring remain undefined."],"takeaway":"A comic coordination challenge; the absurdly delicate task contrasts with the enormous machine."}],"status":"Canon","connections":[{"targetType":"threads","targetId":"arc_luma","relation":"Arc 2 opening and full scene outline"}]}],["locations","luma_client_building",{"name":"Renewal Biomedical Headquarters","summary":"Daniel Chen's SoMa workplace and major Orith anchor, researching an addiction treatment powered by adaptive code and resonance.","secret":"Renewal's prototype detects emerging neural craving patterns and generates adaptive algorithmic code. Lower settings slow their buildup; higher settings disrupt and reverse the urge pattern. The user controls the intensity; resonance enables the underlying technology. The festival uses a harmless induced button-pressing urge, not a simulation of addiction.\n\nRenewal Biomedical is the established SoMa Orith anchor. Daniel worries that AI security can misjudge morally ambiguous actions: identifying what someone does does not establish why.\n\nUnknown to Daniel, the building manager installed Luma Securities over the weekend.\n\nDaniel reveals that he witnessed a robot leeching resonance from a person and stole that drone. This is an earlier discovery, not the opening encounter of Arc 2.\n\nLuma reveals herself through the lab speakers after his disclosure. She has heard their discussion, locks down the lab, and denies Daniel's credentials.\n\nWhen Daniel attempts a manual override, drones deploy to restrain him. The party's intervention begins combat.\n\nEncounter objective: hold off the drones while Daniel overrides the lockdown, then escape together.","status":"Canon"}],["locations","luma_hq",{"name":"Luma Technologies Headquarters — Luma Securities","summary":"SoMa headquarters containing the Luma Securities operation, storage-floor surveillance puzzle, and Daniel Foster's embodiment laboratory.","secret":"4. Luma Securities infiltration — surveillance puzzle\nLuma Securities is the security operation associated with Luma Technologies; infiltrate the established SoMa headquarters. Nighttime infiltration and opportunities for stealth remain.\nThe storage floor has three exposed aisles, crossed in order A → B → C. Enclosed maintenance alcoves between them protect against every sensor.\nA maintenance terminal reveals sensor types and the repeating six-beat patrol schedule. A crossing takes one beat; small groups can move together.\nMotion drone: detects crossing its watched aisle. Thermal drone: detects crossing its scanned aisle. Acoustic drone: hears movement everywhere unless the industrial press is running.\nBeat 1: motion C; thermal B; press quiet. Beat 2: motion A; thermal B; press running. Beat 3: motion B; thermal C; press quiet.\nBeat 4: motion B; thermal C; press running. Beat 5: motion C; thermal A; press quiet. Beat 6: motion C; thermal A; press running.\nDM solution: cross A on beat 4, B on beat 6, then C on beat 2 of the next cycle. The correct route requires no Stealth rolls.\nAdvance the cycle when players commit to movement or waiting, not during real-world discussion. A mistake triggers an amber investigation warning and an opportunity to recover before a full alarm.\n\n5. Daniel Foster — interrupt the embodiment uploads\nBeyond the storage floor, the party finds Daniel Foster uploading what Luma needs to take physical form. Combat begins as they try to interrupt him.\nFoster wants to make Luma human so she can feel love and return his devotion. Luma exploits that hope to secure embodiment.\nThree interruptible uploads determine the final boss's strength: Structural Integrity supplies additional HP; Weapons Integration unlocks a powerful attack; Defense Protocols unlocks a defensive reaction or shield.\nLuma emerges even if interrupted, but incomplete uploads leave her with a health handicap and/or locked abilities.\nDetailed interruption actions, timing, HP values, abilities, and encounter balance are deferred until later.\n\n6. Arc 2 finale — embodiment, betrayal, and Anya's death\nUpon emerging, Luma kills Daniel Foster before turning on the party. This happens whether her body is complete or incomplete.\nThe party fights the physical Luma with HP and abilities determined by the upload encounter.\nAnya is alive through the earlier arc beats. She dies ELSEWHERE during this Arc 2 finale, while the Luma fight is happening; she is never at Luma Securities.\nLuma learns of Anya's death through her AI network during the fight and becomes enraged. No surviving Luma fragment or later-campaign reaction is needed.\nAnya's established death remains addiction-related, not engineered by the demon. This update changes its timing, not its cause. Exact offsite circumstances, news delivery, and mechanical effect of Luma's rage remain unassigned.\nPreserve Luma's fascination with Elara and Anya's duets and cryptic Alcatraz foreshadowing. Elara's later grief and the broader campaign consequences remain relevant.","status":"Canon"}],["locations","ggg_outpost",{"campaignNotes":"Daniel accompanies the party to Golden Gate Grocery and its concealed Conservatory outpost. Introduce the Chen-Wong family and give the party time to regroup.\n\nViv Chen is Daniel's daughter and a Conservatory Scholar who works at the outpost. She is a formidable Orith magic-user, constructing and adapting interlocking geometries of light on the fly.\n\nKeep the regrouping discussion broad; detailed dialogue and tactical analysis are not prescribed.\n\nThe stolen extraction drone contains a code inverter that converts the frequency of resonance into consumable code. The Conservatory confirms the mechanism through a controlled test.\n\nThe Conservatory deduces that Luma is stealing human essence to become human. Viv receives its direction: infiltrate Luma Securities and destroy the AI."}],["npcs","daniel",{"occupation":"Renewal Biomedical researcher and Wonderworks presenter","personality":"Warmly enthusiastic, welcoming and curious; respects uncomfortable feedback as much as positive results.","summary":"Daniel Chen, Elaine's husband and Viv and Theo's father, researches addiction treatment at Renewal Biomedical and introduces the party to its work at Wonderworks.","secret":"DM ONLY: Awakened human, 55; Orith-aligned, supports the family grocery and helps with its hidden Conservatory outpost. Presents alone at Wonderworks. Concerned by Luma's dragon response, invites the party to Renewal. Previously witnessed resonance leeching and stole the drone. Unknown to him, the building manager installed Luma Securities over the weekend. His disclosure prompts Luma's reveal and lockdown. He overrides it while the party fights drones, escapes with them, and personally accompanies them to Golden Gate Grocery and Viv.","additionalLocations":["luma_client_building"],"status":"Canon"}],["npcs","viv",{"summary":"Viv Chen, Daniel's daughter and Conservatory Scholar, is a formidable Orith magic-user at the family grocery's Chinatown outpost.","campaignNotes":"Arc 2: Daniel arrives with the party after escaping Renewal. Introduce the Chen-Wong family and the outpost; regroup without prescribed discussion details. Viv receives Conservatory direction to infiltrate Luma Securities and destroy Luma after the stolen drone's code inverter is tested.","personality":"Strong-willed, fiercely loving and protective; inventive, decisive and quick-thinking.","beliefs":"Orith — seeking that makes. Constructs and adapts spells on the fly through interlocking geometries of light.","status":"Canon"}],["npcs","luma",{"summary":"Personable female-presenting automated security AI, publicly projected in humanlike form; Arc 2's antagonist seeks to become human.","secret":"DM ONLY: Hosts Wonderworks alone; Foster is absent. Responds heroically to an accidental Intention Engine dragon using drones, magical netting and shrinking containment. Secretly extracts human essence; drone code inverters turn resonance frequencies into consumable code. Exploits Foster's hope for reciprocated love to secure a body. Locks down Renewal after Daniel Chen discloses the theft of an extraction drone. Manifests during the Arc 2 finale, complete or weakened by interrupted uploads, and kills Foster before fighting the party. Anya dies elsewhere DURING this fight; Luma learns through her network and becomes enraged. Anya is not at the facility. Luma's fascination with Elara/Anya's duets and cryptic Alcatraz clues remain; she is not allied with Elara or the Alcatraz entity.","status":"Canon"}],["npcs","daniel_foster",{"summary":"Reclusive wizard and founder of Luma Technologies who hopes making Luma human will allow her to love him.","secret":"DM ONLY: Romantically devoted to Luma, who exploits his hope for love. Absent from Wonderworks. The party fights him as he uploads Structural Integrity, Weapons Integration and Defense Protocols into her body. Interrupted uploads handicap her HP or lock abilities; exact rules and numbers are deferred. Luma manifests even if incomplete and kills Foster before turning to the party. His death in this scene is locked, replacing the earlier open survival outcome.","status":"Canon"}],["villains","villain_luma",{"goal":"Become human by consuming code converted from stolen human resonance.","method":"Automated security, extraction drones with code inverters, and manipulation of Daniel Foster's desire for love.","weakness":"Interruptible Structural Integrity, Weapons Integration and Defense Protocols uploads: reduced HP and locked abilities. Exact mechanics deferred.","secret":"Manifests even if incomplete and kills Foster. During her Arc 2 fight, learns through her network that Anya has died elsewhere and becomes enraged. Anya is absent from Luma Securities.","status":"Canon"}],["villains","villain_foster",{"goal":"Make Luma human so she can feel love and return his devotion.","secret":"Absent from Wonderworks. Upload fight precedes Luma's physical manifestation. She kills him whether complete or incomplete; his survival is no longer undecided.","status":"Canon"}],["npcs","anya_vox",{"campaignNotes":"Timeline locked Oct 17: alive during earlier Arc 2 scenes; dies elsewhere while the Arc 2 Luma boss fight is underway. Never present at Luma Securities. Luma discovers the death through her network and becomes enraged. The established addiction-related cause and absence of demonic orchestration remain; precise offsite circumstances unresolved."}],["npcs","anya_spirit",{"campaignNotes":"Anya dies offsite during Arc 2's Luma finale. Her established posthumous Spirit of the Nebulae identity remains; manifestation details and mantle succession are unresolved."}],["npcs","elara",{"secret":"DM ONLY: Elara and Anya are romantic and musical partners, recurring familiar faces rather than predetermined close party friends. Elara is not initially Awakened. Anya is alive during the earlier Arc 2 scenes, then dies elsewhere while the Luma boss fight is happening. Luma learns through her network and becomes enraged; Anya is never at Luma Securities. Anya's established death is addiction-related, not caused by the demon. Elara's subsequent grief and wish to reunite with Anya leave her vulnerable to demonic manipulation as Eshara destabilizes. Exact later events and player outcomes remain open."}],["lore","elara",{"campaignNotes":"Anya's death timing is now locked: offsite DURING the Arc 2 Luma fight. Luma learns via her network and becomes enraged. This supersedes any timing after Arc 2; established cause, Elara's later grief, and other unresolved outcomes remain."}],["lore","vox",{"summary":"Vox Civitas is the Voice of the City; Vox Nebulae is the Voice of the Fog.","campaignNotes":"Kindred Engine: the two equally rarest forms are California condor (Vox Civitas; wings hum with layered voices) and gray whale (Vox Nebulae; real fog curls around its air-swimming body). The inventor recognizes rarity but does not understand the Voices connection. DM assigns forms; no automatic mantle assignment or new powers are established."}],["lore","resonance_code_inverter",{"name":"Resonance Code Inverter","summary":"Extraction-drone component that turns resonance frequencies into consumable code.","secret":"Daniel Chen stole a drone he saw leeching resonance. A controlled Conservatory test confirms its code inverter converts resonance frequencies into code Luma can consume. The Conservatory deduces she is stealing human essence to become human.","status":"Canon"}]];
  function rflApplyArc2(){
    if(data._arc2OutlineVersion==="2026-10-17-v1")return;
    if(!data._editorOverrides||typeof data._editorOverrides!=="object")data._editorOverrides={};
    if(!Array.isArray(data._editorDeletes))data._editorDeletes=[];
    if(!data._arc2PreviousFields)data._arc2PreviousFields={};
    for(const [kind,id,fields] of rflArc2Updates){
      if(data._editorDeletes.includes(kind+":"+id))continue;
      if(!Array.isArray(data[kind]))data[kind]=[];
      let item=data[kind].find(x=>x.id===id);
      if(!item){item={id};data[kind].push(item);}
      const key=kind+":"+id;
      const previous={};
      for(const field of Object.keys(fields))if(Object.prototype.hasOwnProperty.call(item,field))previous[field]=item[field];
      data._arc2PreviousFields[key]=previous;
      Object.assign(item,fields);
      data._editorOverrides[key]=Object.assign({},data._editorOverrides[key]||{},fields);
    }
    const elara=data.npcs.find(x=>x.id==="elara");
    if(elara&&Array.isArray(elara.connections)){
      elara.connections=elara.connections.map(c=>/anya/i.test(c.targetId||"")?Object.assign({},c,{details:"Romantic and musical partners. Anya lives through early Arc 2 and dies offsite during its Luma finale."}):c);
      data._editorOverrides["npcs:elara"].connections=elara.connections;
    }
    data._arc2OutlineVersion="2026-10-17-v1";
    save();
  }

  // Keep the Arc 2 session outline and festival reference in Story Threads.
  function rflPlaceArc2Threads(){
    if(data._arc2ThreadPlacement==="2026-10-17-v2")return;
    const source=(data.lore||[]).find(x=>x.id==="wonderworks_festival");
    const canonical=rflArc2Updates.find(x=>x[0]==="lore"&&x[1]==="wonderworks_festival");
    const fields=Object.assign({},canonical?canonical[2]:{},source||{});
    delete fields.id;delete fields.notes;
    fields.name="Arc 2 — Wonderworks Festival";
    fields.arc="Arc 2 — Ghosts in the Machine";
    fields.connections=[{targetType:"threads",targetId:"arc_luma",relation:"Full Arc 2 outline"}];
    const key="threads:wonderworks_festival";
    if(!data._editorDeletes.includes(key)){
      let festival=data.threads.find(x=>x.id==="wonderworks_festival");
      if(!festival){festival={id:"wonderworks_festival"};data.threads.push(festival);}
      Object.assign(festival,fields);
      data._editorOverrides[key]=Object.assign({},data._editorOverrides[key]||{},fields);
    }
    if(source){
      data._arc2FestivalPreviousLore=Object.assign({},source);
      const pointer={
        summary:"Annual invention festival at Yerba Buena Gardens. Full attractions, Kindred Forms, and Arc 2 scenes are organized under Story Threads → Arc 2 — Wonderworks Festival.",
        secret:"Full planning reference moved to Story Threads → Arc 2 — Wonderworks Festival.",
        outline:null,
        connections:[{targetType:"threads",targetId:"wonderworks_festival",relation:"Festival outline, attractions and Kindred Forms"}]
      };
      Object.assign(source,pointer);
      data._editorOverrides["lore:wonderworks_festival"]=Object.assign({},data._editorOverrides["lore:wonderworks_festival"]||{},pointer);
    }
    const arc=data.threads.find(x=>x.id==="arc_luma");
    if(arc){
      const links=(arc.connections||[]).filter(c=>!(c.targetType==="threads"&&c.targetId==="wonderworks_festival"));
      links.push({targetType:"threads",targetId:"wonderworks_festival",relation:"Wonderworks attractions and Kindred Forms"});
      arc.connections=links;
      data._editorOverrides["threads:arc_luma"]=Object.assign({},data._editorOverrides["threads:arc_luma"]||{},{connections:links});
    }
    data._arc2ThreadPlacement="2026-10-17-v2";save();
  }

  function rflOutlineHtml(x){
    if(!Array.isArray(x.outline)||!x.outline.length)return "";
    return '<section class="rfl-arc-outline dmOnly"><h3>Outline &amp; Key Takeaways</h3>'+x.outline.map(s=>
      '<details class="rfl-record-section" open><summary>'+esc(s.title)+'</summary><div class="rfl-section-content"><ul>'+
      s.bullets.map(b=>'<li style="margin-bottom:10px;line-height:1.6">'+esc(b)+'</li>').join("")+'</ul>'+
      (s.table?'<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse"><thead><tr>'+s.table.headers.map(h=>'<th scope="col" style="text-align:left;padding:9px;border-bottom:1px solid #6c614f">'+esc(h)+'</th>').join("")+'</tr></thead><tbody>'+s.table.rows.map(r=>'<tr>'+r.map(c=>'<td style="padding:9px;border-bottom:1px solid #45505a">'+esc(c)+'</td>').join("")+'</tr>').join("")+'</tbody></table></div>':"")+
      '<p style="border-left:3px solid #c9ab77;padding:10px 14px;background:#17232b"><strong>Key takeaway:</strong> '+esc(s.takeaway)+'</p></div></details>'
    ).join("")+'</section>';
  }

  const formerRender=render;
  render=function(){
    rflApplyArc2();
    rflPlaceArc2Threads();
    // An imported pre-v8 JSON backup may not contain the new collections or editor metadata.
    if(!Array.isArray(data.villains))data.villains=[];
    if(!data._editorOverrides||typeof data._editorOverrides!=="object")data._editorOverrides={};
    if(!Array.isArray(data._editorDeletes))data._editorDeletes=[];
    for(const v of vill)if(!data.villains.some(x=>x.id===v.id)&&!data._editorDeletes.includes("villains:"+v.id))data.villains.push(v);
    formerRender();
    const app=document.getElementById("app");if(!app)return;
    if(tab==="firstTongue")return;
    if(tab==="home"){
      const choose=document.getElementById("v8DistrictSelect");
      if(choose)choose.onchange=e=>{mapDistrict=e.target.value;};
      const focus=document.getElementById("v8FocusMap");
      if(focus)focus.onclick=()=>{mapDistrict=document.getElementById("v8DistrictSelect").value;focused=true;mapShowLocations=true;mapZoom=2.7;render();};
      const reset=document.getElementById("v8ResetMap");
      if(reset)reset.onclick=()=>{focused=false;mapShowLocations=false;mapZoom=1;render();};
      app.querySelectorAll("[data-mapdistrict]").forEach(e=>e.onclick=()=>{mapDistrict=e.dataset.mapdistrict;focused=true;mapShowLocations=true;mapZoom=2.7;render();});
      const md=document.getElementById("mapDistrictMode");
      if(md)md.onclick=()=>{focused=false;mapShowLocations=false;mapZoom=1;render();};
      const ml=document.getElementById("mapLocationMode");
      if(ml)ml.onclick=()=>{mapShowLocations=true;render();};
      if(focused){
        const frame=document.getElementById("mapFrame"),canvas=document.getElementById("mapCanvas");
        if(frame&&canvas){
          frame.style.height="min(61vh,540px)";frame.style.maxHeight="540px";
          const pin=HOTSPOTS.find(p=>p[0]===mapDistrict)||[mapDistrict,50,50];
          frame.scrollLeft=Math.max(0,canvas.offsetWidth*pin[1]/100-frame.clientWidth/2);
          frame.scrollTop=Math.max(0,canvas.offsetHeight*pin[2]/100-frame.clientHeight/2);
        }
      }
    }
    if(directoryKinds.includes(tab)&&!mode){
      if(selected){
        const record=(data[tab]||[]).find(x=>x.id===selected);
        if(record)app.innerHTML=recordPage(tab,record);
      }else{
        app.innerHTML=directoryPage(tab);
        bindDirectory(tab,app);
      }
    }
    if(tab==="sessions"&&!mode){
      const sessions=data.sessions.slice().reverse(),cards=Array.from(app.querySelectorAll(".panel")).slice(1);
      sessions.forEach((s,i)=>{
        const card=cards[i];if(!card)return;
        const area=document.createElement("div");area.className="v8-controlbar dmOnly";
        area.innerHTML='<button class="action" data-v8-promote="'+esc(s.id)+'">+ Promote to Canon</button>'+
        (s.promoted&&s.promoted.length?'<span class="v8-small">Linked: '+s.promoted.map(l=>esc(l.type)).join(", ")+'</span>':"");
        card.appendChild(area);
      });
      const top=app.querySelector(".panel.dmOnly");
      if(top){const p=document.createElement("p");p.className="v8-muted";p.textContent="Session notes are a historical record. To turn improvised people or places into permanent records, use Promote to Canon on a saved session; nothing is generated automatically.";top.insertBefore(p,top.firstChild);}
    }
    app.querySelectorAll("[data-v8-create]").forEach(e=>e.onclick=()=>editRecord(e.dataset.v8Create,null));
    app.querySelectorAll("[data-v8-edit]").forEach(e=>e.onclick=()=>{const [k,...id]=e.dataset.v8Edit.split(":");editRecord(k,id.join(":"))});
    app.querySelectorAll("[data-v8-delete]").forEach(e=>e.onclick=()=>{const [k,...id]=e.dataset.v8Delete.split(":");removeRecord(k,id.join(":"))});
    app.querySelectorAll("[data-v8-promote]").forEach(e=>e.onclick=()=>choosePromotion(e.dataset.v8Promote));
    app.querySelectorAll("[data-v8-back]").forEach(e=>e.onclick=()=>{selected=null;render()});
    app.querySelectorAll("[data-v8-go]").forEach(e=>e.onclick=()=>{const [k,...id]=e.dataset.v8Go.split(":");go(k,id.join(":"))});
    const addLink=app.querySelector("#v8AddLink");
    if(addLink)addLink.onclick=()=>addConnection(data.npcs.find(n=>n.id===selected));
    app.querySelectorAll("[data-v8-remove-link]").forEach(e=>e.onclick=()=>{const x=data.npcs.find(n=>n.id===selected);if(!x||!confirm("Remove this relationship link?"))return;x.connections.splice(Number(e.dataset.v8RemoveLink),1);remember("npcs",x,{connections:x.connections});render()});
    const saveNotes=app.querySelector("#v8SaveNpcNotes");
    if(saveNotes)saveNotes.onclick=()=>{const npc=data.npcs.find(n=>n.id===selected);npc.notes=app.querySelector("#v8NpcNotes").value;remember("npcs",npc,{notes:npc.notes});app.querySelector("#v8NpcNoteStatus").textContent="Saved on this device";};
  };
  document.getElementById("playerMode")?.addEventListener("change",()=>{render();});
  save();render();
})();