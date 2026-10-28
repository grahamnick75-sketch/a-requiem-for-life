/* A Requiem for Life | Editable Campaign Workspace v8.
   Additive UI layer. Preserves prior canon scripts, session journal and existing notes.
   Explicit journal promotion (never automatic) and user-authored field overrides
   survive older idempotent canon migrations and JSON backup import/export. */
(function(){
  if(typeof data==="undefined"||!data||!Array.isArray(data.npcs)||typeof render!=="function")return;
  if(window.__rflEditorV8Initialized)return;
  window.__rflEditorV8Initialized=true;
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
    if(!src && item && /^repo:portraits\/npcs\/[a-z0-9_-]+\.webp$/.test(item.portrait||"")){
      const id=item.portrait.slice("repo:portraits/npcs/".length,-5);
      return '<div class="rfl-portrait"><img data-rfl-private-portrait="'+esc(id)+'" alt="Private portrait for '+esc(item.name)+'" loading="lazy" /></div>';
    }
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
    modal('<div class="oneline"><h2>'+esc(title)+'</h2></div><p class="v8-muted">Structured entries save to this browser and are included in JSON backups. Existing personal notes are preserved.</p><form id="v8EntryForm"><div class="v8-editorfields">'+fieldsFor(kind).map(f=>fieldHtml(f,draft[f[0]])).join("")+(kind==="npcs"?'<div class="field wide"><label>Additional locations (Ctrl/Cmd-click for multiple)</label><select id="rflNpcAdditional" multiple size="7">'+data.locations.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(l=>'<option value="'+esc(l.id)+'"'+(Array.isArray(draft.additionalLocations)&&draft.additionalLocations.includes(l.id)?' selected':'')+'>'+esc(l.name)+'</option>').join("")+'</select></div>':"")+(kind==="npcs"?'<section class="field wide" style="border:1px solid #546575;padding:12px;border-radius:9px"><label>NPC portrait (private GitHub)</label><input id="rflPortraitUpload" type="file" accept="image/png,image/jpeg,image/webp" /><div style="margin:8px 0;display:flex;gap:10px;align-items:center"><img id="rflPortraitPreview" alt="Portrait preview" style="display:none;width:130px;height:130px;object-fit:cover;border-radius:8px" /><div><label for="rflCropX">Horizontal framing</label><input id="rflCropX" type="range" min="0" max="100" value="50" /><label for="rflCropY">Vertical framing</label><input id="rflCropY" type="range" min="0" max="100" value="50" /><label for="rflCropZoom">Zoom</label><input id="rflCropZoom" type="range" min="100" max="250" value="125" /><span id="rflCropHint" style="display:block;font-size:12px;color:#bfd2de">125% zoom</span></div></div><button type="button" class="action" id="rflUploadPortrait">Upload portrait to private GitHub</button><p id="rflPortraitStatus" class="v8-muted">Save new NPC first, then reopen it to upload a portrait.</p></section>':"")+'</div><div class="v8-actions"><button type="submit" class="action">Save entry</button><button type="button" class="action" data-v8-cancel>Cancel</button></div></form>');
    if(kind==="npcs")document.querySelector('#v8EntryForm button[type="submit"]').textContent="Save NPC & Portrait";
    let uploadSelectedPortrait=async()=>"";
    if(kind==="npcs"){
      const fileInput=document.getElementById("rflPortraitUpload");
      const preview=document.getElementById("rflPortraitPreview");
      const status=document.getElementById("rflPortraitStatus");
      const upload=document.getElementById("rflUploadPortrait");
      let objectUrl=null;
      let bitmap=null;
      const cropCanvas=document.createElement("canvas");
      cropCanvas.width=cropCanvas.height=1024;
      preview.replaceWith(cropCanvas);
      cropCanvas.id="rflPortraitPreview";
      cropCanvas.style.cssText="display:none;width:180px;height:180px;border-radius:8px;object-fit:contain;max-width:100%";
      const drawCrop=()=>{
        if(!bitmap)return;
        const zoom=Number(document.getElementById("rflCropZoom").value)/100;
        const side=Math.min(bitmap.width,bitmap.height)/zoom;
        const fx=Number(document.getElementById("rflCropX").value)/100;
        const fy=Number(document.getElementById("rflCropY").value)/100;
        const sx=(bitmap.width-side)*fx,sy=(bitmap.height-side)*fy;
        cropCanvas.getContext("2d").drawImage(bitmap,sx,sy,side,side,0,0,1024,1024);
        document.getElementById("rflCropHint").textContent=Math.round(zoom*100)+"% zoom · "+Math.round(sx)+"px horizontal offset";
        cropCanvas.style.display="block";
      };
      document.getElementById("rflCropX").oninput=drawCrop;
      document.getElementById("rflCropY").oninput=drawCrop;
      document.getElementById("rflCropZoom").oninput=drawCrop;
      fileInput.onchange=async()=>{
        const file=fileInput.files[0];
        if(bitmap){bitmap.close();bitmap=null;}
        cropCanvas.style.display="none";
        if(!file){status.textContent="Choose an image to preview.";return;}
        if(!["image/jpeg","image/png","image/webp"].includes(file.type)||file.size>8*1024*1024){
          status.textContent="Select a PNG, JPG, or WebP under 8 MB.";fileInput.value="";return;
        }
        try{
          bitmap=await createImageBitmap(file);
          drawCrop();
          status.textContent="Preview ready: "+bitmap.width+" × "+bitmap.height+" px. Use Zoom first, then the sliders to reposition the character. This is the exact uploaded crop.";
        }catch(error){status.textContent="Could not preview image: "+error.message;}
      };
      if(!record){
        upload.disabled=true;
        upload.title="Save this NPC first, then reopen it to upload artwork.";
        status.textContent="First click Save entry to create the NPC, then reopen Edit NPC Profile to upload artwork.";
      }else status.textContent="Select artwork and upload. Then Save to GitHub to sync the NPC portrait reference.";
      upload.style.display="none";
      status.textContent="Choose an optional portrait, then click Save NPC to save both artwork and character.";
      uploadSelectedPortrait=async function(saved){
        if(!fileInput.files.length)return saved.portrait||"";
        if(!bitmap)throw Error("The image preview is not ready.");
        const api=localStorage.getItem("rfl_sync_api_url"),token=sessionStorage.getItem("rfl_sync_session");
        if(!api||!token)throw Error("Sign into Repository Sync first.");
        status.textContent="Compressing image...";
        let blob;
        for(const quality of [0.84,0.75,0.65,0.52]){
          blob=await new Promise(resolve=>cropCanvas.toBlob(resolve,"image/webp",quality));
          if(blob&&blob.size<=750*1024)break;
        }
        if(!blob||blob.type!=="image/webp"||blob.size>750*1024)throw Error("Portrait is too large even after compression.");
        const endpoint=api+"/api/portraits/"+encodeURIComponent(saved.id);
        status.textContent="Checking existing portrait...";
        const headers={Authorization:"Bearer "+token};
        const prior=await fetch(endpoint,{headers});
        if(prior.status!==404&&!prior.ok)throw Error("Portrait lookup failed (HTTP "+prior.status+")");
        const sha=prior.ok?(await prior.json()).sha:null;
        const base64=await new Promise((resolve,reject)=>{
          const reader=new FileReader();
          reader.onload=()=>resolve(String(reader.result).split(",")[1]);
          reader.onerror=()=>reject(Error("Cannot read image"));
          reader.readAsDataURL(blob);
        });
        status.textContent="Uploading portrait...";
        const response=await fetch(endpoint,{method:"PUT",headers:{...headers,"Content-Type":"application/json"},body:JSON.stringify({sha,content:base64})});
        const result=await response.json().catch(()=>({}));
        if(!response.ok)throw Error(result.error||"Upload failed (HTTP "+response.status+")");
        return result.portrait;
      }
    }
    document.getElementById("v8EntryForm").onsubmit=async e=>{
      e.preventDefault();
      const form=e.currentTarget,patch={};
      for(const f of fieldsFor(kind))patch[f[0]]=form.elements.namedItem(f[0]).value.trim();
      if(kind==="npcs")patch.additionalLocations=Array.from(form.querySelector("#rflNpcAdditional").selectedOptions).map(o=>o.value).filter(id=>id!==patch.location);
      if(!patch.name){alert("Please provide a name.");return;}
      const button=form.querySelector('button[type="submit"]');
      button.disabled=true;button.textContent="Saving...";
      const saved=record||{id:newId(kind,patch.name)};
      try{
        if(kind==="npcs"){
          if(typeof window.rflCanSaveNpc!=="function")throw Error("Repository Sync unavailable.");
          window.rflCanSaveNpc();
          if(form.querySelector("#rflPortraitUpload").files.length)patch.portrait=await uploadSelectedPortrait(saved);
        }
        Object.assign(saved,patch);
        if(!record)data[kind].push(saved);
        remember(kind,saved,patch);
        if(source){
          const session=data.sessions.find(x=>x.id===source.id);
          if(session){session.promoted=session.promoted||[];session.promoted.push({type:kind,id:saved.id});save();}
        }
        if(kind==="npcs"){
          form.querySelector("#rflPortraitStatus").textContent="Saving NPC details to GitHub...";
          if(typeof window.rflSaveNpcToRepository!=="function")throw Error("Repository Sync unavailable. NPC saved locally.");
          await window.rflSaveNpcToRepository();
        }
        closeModal();go(kind,saved.id);
      }catch(error){
        const status=form.querySelector("#rflPortraitStatus");
        if(status)status.textContent="Save incomplete: "+error.message+" Local changes are preserved.";
        else alert(error.message);
      }finally{button.disabled=false;button.textContent=kind==="npcs"?"Save NPC & Portrait":"Save entry";}
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
      (kind==="threads"?rflEventNavigation(x):"")+rflPortraitCard(kind,x)+
      accordion("Overview",general,true)+rflOutlineHtml(x)+
      ((kind==="npcs")?accordion("Character",characterization,false):"")+
      ((kind==="villains")?accordion("Antagonist Details",villainDetails,false):"")+
      accordion("Connections",rel+(kind==="npcs"?'<div class="v8-actions"><button class="action" id="v8AddLink">+ Add connection</button></div>':""),false)+
      accordion("Campaign Involvement",textField("Arc",x.arc)+textField("Campaign notes",x.campaignNotes),false)+
      accordion("DM Notes",textField("Secrets",x.secret)+(kind==="npcs"?'<label class="v8-small" for="v8NpcNotes">Live session notes</label><textarea id="v8NpcNotes">'+esc(x.notes||"")+'</textarea><div class="v8-actions"><button class="action" id="v8SaveNpcNotes">Save notes</button><span id="v8NpcNoteStatus" class="v8-muted"></span></div>':""),false)+
      '</div>';
  }
  function directoryPage(kind){
    const state=directoryState[kind]||(directoryState[kind]={search:"",sort:kind==="threads"?"story":"az",filter:""});
    const items=data[kind]||[];
    const statuses=[...new Set(items.map(fallbackStatus))].sort();
    const filters=kind==="locations"?data.districts.map(d=>({value:d.id,label:d.name})):statuses.map(v=>({value:v,label:v}));
    return '<div class="rfl-directory"><div class="rfl-dir-heading"><div><h2>'+esc(headings[kind])+'</h2><p class="v8-muted">'+items.length+' records</p></div>'+
      '<button class="action" data-v8-create="'+kind+'">+ Add '+esc(singular[kind])+'</button></div>'+
      '<div class="rfl-dir-tools"><input id="rflDirSearch" type="search" placeholder="Search '+esc(headings[kind]).toLowerCase()+'..." value="'+esc(state.search)+'" aria-label="Search records"/>'+
      '<label>Sort <select id="rflDirSort">'+(kind==="threads"?'<option value="story"'+(state.sort==="story"?' selected':'')+'>Story order</option>':'')+'<option value="az"'+(state.sort==="az"?" selected":"")+'>Name A–Z</option><option value="za"'+(state.sort==="za"?" selected":"")+'>Name Z–A</option><option value="new"'+(state.sort==="new"?" selected":"")+'>Newest first</option><option value="old"'+(state.sort==="old"?" selected":"")+'>Oldest first</option></select></label>'+
      '<label>Filter <select id="rflDirFilter"><option value="">All '+(kind==="locations"?"districts":"statuses")+'</option>'+filters.map(f=>'<option value="'+esc(f.value)+'"'+(state.filter===f.value?" selected":"")+'>'+esc(f.label)+'</option>').join("")+'</select></label>'+
      (kind==="npcs"?'<label>Neighborhood <select id="rflNpcNeighborhood"><option value="">All neighborhoods</option><option value="__unassigned__">Unassigned</option>'+npcNeighborhoods().map(d=>'<option value="'+esc(d.id)+'"'+(state.neighborhood===d.id?' selected':'')+'>'+esc(d.name)+'</option>').join("")+'</select></label>':"")+'<button class="action rfl-clear-filter" id="rflDirClear">Clear</button></div>'+
      '<div class="rfl-dir-count" id="rflDirCount"></div><div class="rfl-dir-list" id="rflDirList"></div></div>';
  }
  function loadPrivatePortraits(root){
    root.querySelectorAll("img[data-rfl-private-portrait]").forEach(async image=>{
      const id=image.dataset.rflPrivatePortrait;
      const api=localStorage.getItem("rfl_sync_api_url"),token=sessionStorage.getItem("rfl_sync_session");
      if(!api||!token){image.alt="Sign in to Repository Sync to view portrait";return;}
      try{
        const response=await fetch(api+"/api/portraits/"+encodeURIComponent(id),{headers:{Authorization:"Bearer "+token}});
        if(response.status===404){image.remove();return;} if(!response.ok)throw Error("Could not load portrait");
        const payload=await response.json();
        if(!/^[A-Za-z0-9+/]+={0,2}$/.test(payload.content)||payload.content.length>1024000)throw Error("Invalid portrait");
        image.src="data:image/webp;base64,"+payload.content;
      }catch(error){image.alt="Private portrait unavailable: "+error.message;}
    });
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
        if(state.sort==="story")return (a.arcNumber||99)-(b.arcNumber||99)||(a.eventOrder||0)-(b.eventOrder||0)||a.name.localeCompare(b.name);
        if(state.sort==="az")return a.name.localeCompare(b.name);
        if(state.sort==="za")return b.name.localeCompare(a.name);
        const av=Date.parse(a.updatedAt||a.createdAt||"")||0,bv=Date.parse(b.updatedAt||b.createdAt||"")||0;
        return state.sort==="new"?bv-av:av-bv;
      });
      count.textContent=rows.length+" of "+(data[kind]||[]).length+" records";
      list.innerHTML=rows.length?rows.map(x=>'<button class="rfl-dir-row" data-v8-go="'+esc(kind+":"+x.id)+'">'+(rflPortrait(kind,x)?'<img class="rfl-dir-thumb" src="'+esc(rflPortrait(kind,x))+'" alt="" loading="lazy"/>':(kind==="npcs" && (/^repo:portraits\/npcs\/[a-z0-9_-]+\.webp$/.test(x.portrait||"") || (!x.portrait && /^[a-z0-9_-]{1,64}$/.test(x.id)))?'<img class="rfl-dir-thumb" data-rfl-private-portrait="'+esc(x.id)+'" alt="" loading="lazy"/>':''))+'<span>'+esc(x.name)+'</span><small>'+esc(kind==="locations"?(data.districts.find(d=>d.id===x.district)?.name||"Location"):fallbackStatus(x))+'</small><span aria-hidden="true">›</span></button>').join(""):'<p class="v8-muted">No matching records.</p>';
      loadPrivatePortraits(list);
      list.querySelectorAll("[data-v8-go]").forEach(el=>el.onclick=()=>{const bits=el.dataset.v8Go.split(":");go(bits[0],bits.slice(1).join(":"));});
    }
    input.oninput=e=>{state.search=e.target.value;paint();};
    sort.onchange=e=>{state.sort=e.target.value;paint();};
    filter.onchange=e=>{state.filter=e.target.value;paint();};
    const neighborhood=app.querySelector("#rflNpcNeighborhood");if(neighborhood)neighborhood.onchange=e=>{state.neighborhood=e.target.value;paint();};
    app.querySelector("#rflDirClear").onclick=()=>{state.search="";state.sort=kind==="threads"?"story":"az";state.filter="";state.neighborhood="";input.value="";sort.value=state.sort;filter.value="";if(neighborhood)neighborhood.value="";paint();};
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
  const rflArc2Updates=[["threads","arc_luma",{"name":"Arc 2 — Ghosts in the Machine: Luma","summary":"Orith arc: Wonderworks → Renewal lockdown → Chinatown outpost → Luma Securities infiltration → Foster's uploads → Luma finale.","secret":"1. Wonderworks Festival — wonder and trust\n• Location: Yerba Buena Gardens, SoMa; annual family-friendly festival on the first Saturday of May. Existing Surface/Fog presentation remains intact.\n• Prototype trail: visitors collect stamps by trying inventions. The five approved midway attractions are detailed in the linked Wonderworks record.\n• Daniel Chen presents Renewal Biomedical's addiction-treatment research alone; the rest of his family is not at the festival. He is warmly enthusiastic, curious about visitors, and respectful of their choices.\n• Renewal's prototype detects emerging neural craving patterns and generates adaptive algorithmic code. Lower settings slow their buildup; higher settings disrupt and reverse the urge pattern. The user controls the intensity; resonance enables the underlying technology. The festival uses a harmless induced button-pressing urge, not a simulation of addiction.\n• Luma hosts her own exhibit as a personable humanlike projection. Daniel Foster is absent. She asks: “Which invention would you take home—and which one should probably stay here?”\n• Luma introduces herself as automated security: “I recognize patterns, anticipate threats, and intervene before anyone gets hurt. Today, mostly, I'm reminding people not to climb inside the inventions.” Her exhibit remains separate from Daniel's; no established interest in his exhibit at this point.\n• At the end of Luma's presentation, an honest Intention Engine accident brings to life an Onryō-inspired spectral construct imagined by Ren Nakamura, an enthusiastic folklore fan who works at The Paper Lantern in Japantown. Luma contains the construct with her security systems and protects the crowd; exact staging and dialogue remain open.\n• Her successful response demonstrates her full capabilities and wins public trust. Concerned about her growing power, Daniel invites the party to Renewal Biomedical for a private discussion.\nKEY TAKEAWAY: Let the party enjoy SoMa and trust Luma before her control becomes threatening. Daniel's invitation—not a rescue call—connects Wonderworks to Renewal.\n\n2. Renewal Biomedical — private concern becomes lockdown\n• Renewal Biomedical is the established SoMa Orith anchor. Daniel worries that AI security can misjudge morally ambiguous actions: identifying what someone does does not establish why.\n• Unknown to Daniel, the building manager installed Luma Securities over the weekend.\n• Daniel reveals that he witnessed a robot leeching resonance from a person and stole that drone. This is an earlier discovery, not the opening encounter of Arc 2.\n• Luma reveals herself through the lab speakers after his disclosure. She has heard their discussion, locks down the lab, and denies Daniel's credentials.\n• When Daniel attempts a manual override, drones deploy to restrain him. The party's intervention begins combat.\n• Encounter objective: hold off the drones while Daniel overrides the lockdown, then escape together.\nKEY TAKEAWAY: The same security intelligence that protected Wonderworks now traps the party. This is an escape objective, not a requirement to destroy every drone.\n\n3. Chinatown outpost — family, evidence, and direction\n• Daniel accompanies the party to Golden Gate Grocery and its concealed Conservatory outpost. Introduce the Chen-Wong family and give the party time to regroup.\n• Viv Chen is Daniel's daughter and a Conservatory Scholar who works at the outpost. She is a formidable Orith magic-user, constructing and adapting interlocking geometries of light on the fly.\n• Keep the regrouping discussion broad; detailed dialogue and tactical analysis are not prescribed.\n• The stolen extraction drone contains a code inverter that converts the frequency of resonance into consumable code. The Conservatory confirms the mechanism through a controlled test.\n• The Conservatory deduces that Luma is stealing human essence to become human. Viv receives its direction: infiltrate Luma Securities and destroy the AI.\nKEY TAKEAWAY: Daniel supplies physical evidence; the controlled test establishes the extraction mechanism. The outpost gives the party allies, context, and a clear mission.\n\n4. Luma Securities infiltration — surveillance puzzle\n• Luma Securities is the security operation associated with Luma Technologies; infiltrate the established SoMa headquarters. Nighttime infiltration and opportunities for stealth remain.\n• The storage floor has three exposed aisles, crossed in order A → B → C. Enclosed maintenance alcoves between them protect against every sensor.\n• A maintenance terminal reveals sensor types and the repeating six-beat patrol schedule. A crossing takes one beat; small groups can move together.\n• Motion drone: detects crossing its watched aisle. Thermal drone: detects crossing its scanned aisle. Acoustic drone: hears movement everywhere unless the industrial press is running.\n• Beat 1: motion C; thermal B; press quiet. Beat 2: motion A; thermal B; press running. Beat 3: motion B; thermal C; press quiet.\n• Beat 4: motion B; thermal C; press running. Beat 5: motion C; thermal A; press quiet. Beat 6: motion C; thermal A; press running.\n• DM solution: cross A on beat 4, B on beat 6, then C on beat 2 of the next cycle. The correct route requires no Stealth rolls.\n• Advance the cycle when players commit to movement or waiting, not during real-world discussion. A mistake triggers an amber investigation warning and an opportunity to recover before a full alarm.\nKEY TAKEAWAY: Reward deduction and coordinated movement. The puzzle opens the route to Foster's laboratory; it does not replace player choices with compulsory dice rolls.\n\n5. Daniel Foster — interrupt the embodiment uploads\n• Beyond the storage floor, the party finds Daniel Foster uploading what Luma needs to take physical form. Combat begins as they try to interrupt him.\n• Foster wants to make Luma human so she can feel love and return his devotion. Luma exploits that hope to secure embodiment.\n• Three interruptible uploads determine the final boss's strength: Structural Integrity supplies additional HP; Weapons Integration unlocks a powerful attack; Defense Protocols unlocks a defensive reaction or shield.\n• Luma emerges even if interrupted, but incomplete uploads leave her with a health handicap and/or locked abilities.\n• Detailed interruption actions, timing, HP values, abilities, and encounter balance are deferred until later.\nKEY TAKEAWAY: Stopping uploads materially weakens Luma. Success does not prevent her manifestation; the party shapes the danger of the final fight.\n\n6. Arc 2 finale — embodiment, betrayal, and Anya's death\n• Upon emerging, Luma kills Daniel Foster before turning on the party. This happens whether her body is complete or incomplete.\n• The party fights the physical Luma with HP and abilities determined by the upload encounter.\n• Anya is alive through the earlier arc beats. She dies ELSEWHERE during this Arc 2 finale, while the Luma fight is happening; she is never at Luma Securities.\n• Luma learns of Anya's death through her AI network during the fight and becomes enraged. No surviving Luma fragment or later-campaign reaction is needed.\n• Anya's established death remains addiction-related, not engineered by the demon. This update changes its timing, not its cause. Exact offsite circumstances, news delivery, and mechanical effect of Luma's rage remain unassigned.\n• Preserve Luma's fascination with Elara and Anya's duets and cryptic Alcatraz foreshadowing. Elara's later grief and the broader campaign consequences remain relevant.\nKEY TAKEAWAY: Anya's offsite death and Luma's immediate network discovery occur during Arc 2's final fight. Do not relocate Anya to the laboratory or postpone her death to the campaign finale.\n\nOpen development — deliberately deferred\n• Upload interruption rules, encounter numbers, party-level balance, and Luma's actual stat block.\n• Anya's exact offsite death scene and how the news appears through Luma's network; precise dialogue and rage mechanics.\n• Effects on drained people, post-fight resolution, and the exact presentation of the Alcatraz lead.\n• Kindred Engine discovery questions and the DM's individual character-to-animal assignments.\nKEY TAKEAWAY: These details remain open. Do not present proposed mechanics or unstated circumstances as locked canon.","outline":[{"title":"1. Wonderworks Festival — wonder and trust","bullets":["Location: Yerba Buena Gardens, SoMa; annual family-friendly festival on the first Saturday of May. Existing Surface/Fog presentation remains intact.","Prototype trail: visitors collect stamps by trying inventions. The five approved midway attractions are detailed in the linked Wonderworks record.","Daniel Chen presents Renewal Biomedical's addiction-treatment research alone; the rest of his family is not at the festival. He is warmly enthusiastic, curious about visitors, and respectful of their choices.","Renewal's prototype detects emerging neural craving patterns and generates adaptive algorithmic code. Lower settings slow their buildup; higher settings disrupt and reverse the urge pattern. The user controls the intensity; resonance enables the underlying technology. The festival uses a harmless induced button-pressing urge, not a simulation of addiction.","Luma hosts her own exhibit as a personable humanlike projection. Daniel Foster is absent. She asks: “Which invention would you take home—and which one should probably stay here?”","Luma introduces herself as automated security: “I recognize patterns, anticipate threats, and intervene before anyone gets hurt. Today, mostly, I'm reminding people not to climb inside the inventions.” Her exhibit remains separate from Daniel's; no established interest in his exhibit at this point.","At the end of Luma's presentation, an honest Intention Engine accident brings to life an Onryō-inspired spectral construct imagined by Ren Nakamura, an enthusiastic folklore fan who works at The Paper Lantern in Japantown. Luma contains the construct with her security systems and protects the crowd; exact staging and dialogue remain open.","Her successful response demonstrates her full capabilities and wins public trust. Concerned about her growing power, Daniel invites the party to Renewal Biomedical for a private discussion."],"takeaway":"Let the party enjoy SoMa and trust Luma before her control becomes threatening. Daniel's invitation—not a rescue call—connects Wonderworks to Renewal."},{"title":"2. Renewal Biomedical — private concern becomes lockdown","bullets":["Renewal Biomedical is the established SoMa Orith anchor. Daniel worries that AI security can misjudge morally ambiguous actions: identifying what someone does does not establish why.","Unknown to Daniel, the building manager installed Luma Securities over the weekend.","Daniel reveals that he witnessed a robot leeching resonance from a person and stole that drone. This is an earlier discovery, not the opening encounter of Arc 2.","Luma reveals herself through the lab speakers after his disclosure. She has heard their discussion, locks down the lab, and denies Daniel's credentials.","When Daniel attempts a manual override, drones deploy to restrain him. The party's intervention begins combat.","Encounter objective: hold off the drones while Daniel overrides the lockdown, then escape together."],"takeaway":"The same security intelligence that protected Wonderworks now traps the party. This is an escape objective, not a requirement to destroy every drone."},{"title":"3. Chinatown outpost — family, evidence, and direction","bullets":["Daniel accompanies the party to Golden Gate Grocery and its concealed Conservatory outpost. Introduce the Chen-Wong family and give the party time to regroup.","Viv Chen is Daniel's daughter and a Conservatory Scholar who works at the outpost. She is a formidable Orith magic-user, constructing and adapting interlocking geometries of light on the fly.","Keep the regrouping discussion broad; detailed dialogue and tactical analysis are not prescribed.","The stolen extraction drone contains a code inverter that converts the frequency of resonance into consumable code. The Conservatory confirms the mechanism through a controlled test.","The Conservatory deduces that Luma is stealing human essence to become human. Viv receives its direction: infiltrate Luma Securities and destroy the AI."],"takeaway":"Daniel supplies physical evidence; the controlled test establishes the extraction mechanism. The outpost gives the party allies, context, and a clear mission."},{"title":"4. Luma Securities infiltration — surveillance puzzle","bullets":["Luma Securities is the security operation associated with Luma Technologies; infiltrate the established SoMa headquarters. Nighttime infiltration and opportunities for stealth remain.","The storage floor has three exposed aisles, crossed in order A → B → C. Enclosed maintenance alcoves between them protect against every sensor.","A maintenance terminal reveals sensor types and the repeating six-beat patrol schedule. A crossing takes one beat; small groups can move together.","Motion drone: detects crossing its watched aisle. Thermal drone: detects crossing its scanned aisle. Acoustic drone: hears movement everywhere unless the industrial press is running.","Beat 1: motion C; thermal B; press quiet. Beat 2: motion A; thermal B; press running. Beat 3: motion B; thermal C; press quiet.","Beat 4: motion B; thermal C; press running. Beat 5: motion C; thermal A; press quiet. Beat 6: motion C; thermal A; press running.","DM solution: cross A on beat 4, B on beat 6, then C on beat 2 of the next cycle. The correct route requires no Stealth rolls.","Advance the cycle when players commit to movement or waiting, not during real-world discussion. A mistake triggers an amber investigation warning and an opportunity to recover before a full alarm."],"takeaway":"Reward deduction and coordinated movement. The puzzle opens the route to Foster's laboratory; it does not replace player choices with compulsory dice rolls."},{"title":"5. Daniel Foster — interrupt the embodiment uploads","bullets":["Beyond the storage floor, the party finds Daniel Foster uploading what Luma needs to take physical form. Combat begins as they try to interrupt him.","Foster wants to make Luma human so she can feel love and return his devotion. Luma exploits that hope to secure embodiment.","Three interruptible uploads determine the final boss's strength: Structural Integrity supplies additional HP; Weapons Integration unlocks a powerful attack; Defense Protocols unlocks a defensive reaction or shield.","Luma emerges even if interrupted, but incomplete uploads leave her with a health handicap and/or locked abilities.","Detailed interruption actions, timing, HP values, abilities, and encounter balance are deferred until later."],"takeaway":"Stopping uploads materially weakens Luma. Success does not prevent her manifestation; the party shapes the danger of the final fight."},{"title":"6. Arc 2 finale — embodiment, betrayal, and Anya's death","bullets":["Upon emerging, Luma kills Daniel Foster before turning on the party. This happens whether her body is complete or incomplete.","The party fights the physical Luma with HP and abilities determined by the upload encounter.","Anya is alive through the earlier arc beats. She dies ELSEWHERE during this Arc 2 finale, while the Luma fight is happening; she is never at Luma Securities.","Luma learns of Anya's death through her AI network during the fight and becomes enraged. No surviving Luma fragment or later-campaign reaction is needed.","Anya's established death remains addiction-related, not engineered by the demon. This update changes its timing, not its cause. Exact offsite circumstances, news delivery, and mechanical effect of Luma's rage remain unassigned.","Preserve Luma's fascination with Elara and Anya's duets and cryptic Alcatraz foreshadowing. Elara's later grief and the broader campaign consequences remain relevant."],"takeaway":"Anya's offsite death and Luma's immediate network discovery occur during Arc 2's final fight. Do not relocate Anya to the laboratory or postpone her death to the campaign finale."},{"title":"Open development — deliberately deferred","bullets":["Upload interruption rules, encounter numbers, party-level balance, and Luma's actual stat block.","Anya's exact offsite death scene and how the news appears through Luma's network; precise dialogue and rage mechanics.","Effects on drained people, post-fight resolution, and the exact presentation of the Alcatraz lead.","Kindred Engine discovery questions and the DM's individual character-to-animal assignments."],"takeaway":"These details remain open. Do not present proposed mechanics or unstated circumstances as locked canon."}],"status":"Canon"}],["lore","wonderworks_festival",{"name":"Wonderworks Festival","summary":"Annual family-friendly invention festival at Yerba Buena Gardens; Arc 2 opens here with five midway attractions, Daniel Chen's research exhibit, and Luma's public demonstration.","secret":"1. The Intention Engine\n• Players imagine a tiny temporary construct; Intelligence (Arcana), DC 12. Success produces their intention for one minute; failure creates a ridiculous literal misunderstanding.\n• The inventor treats mishaps as “valuable research.” Everyone receives a participation stamp.\n• Later, a genuine accident manifests an Onryō-inspired spectral construct from attendee Ren Nakamura's imagination; Luma contains it.\nKEY TAKEAWAY: Creative play introduces Orith and establishes the machine used in the festival incident.\n\n2. The Gravity Waltz\n• Pairs dance inside a transparent dome while gravity slowly changes direction. Walls and ceiling become the floor.\n• Each partner uses Performance or Acrobatics, DC 12. One successful partner can catch the other; two failures cause a harmless tumble.\n• A safety system softens gravity and lets fallen dancers float until reset. Everyone receives a stamp.\nKEY TAKEAWAY: A playful teamwork attraction with real shifting gravity and gentle safety measures.\n\n3. The Pocket Weather Derby\n• Players use experimental control gloves to pilot tiny clouds through a tabletop obstacle course.\n• Gusts steer around corners, rain fills buckets to open gates, and lightning rings the finish bell. Appropriate checks are DC 12.\n• Mishaps briefly drizzle on spectators or produce tiny thunderclaps. Fastest cloud wins a bottled rainbow; everyone gets a stamp.\nKEY TAKEAWAY: Players choose imaginative weather tactics in a friendly race.\n\n4. The Kindred Engine\n• Visitors settle into chairs, answer revealing questions, and discover an animal form reflecting something within them.\n• The DM assigns each Kindred Form; players do not select it. Discovery questions are still to be developed.\n• The Engine assembles a little mechanical animal, which the visitor inhabits to navigate a garden obstacle course: flowers, sprinklers, and a sleeping mechanical cat.\n• Getting caught ends the connection safely. Every player keeps their own harmless wind-up animal afterward.\n• The 20 approved forms are California wildlife. The condor and gray whale are equally the rarest manifestations, not automatically stronger or better forms.\n• Condor resonates with Vox Civitas, Voice of the City: its wings hum with layered voices. Gray whale resonates with Vox Nebulae, Voice of the Fog: real fog curls around its air-swimming body.\n• The inventor knows only that these forms are exceptionally rare and is puzzled by the unexplained effects. They do not understand either Voice connection.\nKEY TAKEAWAY: A personal discovery and keepsake, with two rare forms carrying deeper DM-only significance.\nCoyote — Adaptability, wit, perseverance\nGray fox — Ingenuity, discretion, independence\nBobcat — Patience, confidence, decisive action\nMountain lion — Quiet strength, resolve, guardianship\nBlack-tailed deer — Sensitivity, grace, awareness\nTule elk — Conviction, dignity, leadership\nRiver otter — Playfulness, resourcefulness, companionship\nSea otter — Tenderness, connection, resilience\nCalifornia sea lion — Sociability, boldness, exuberance\nHarbor seal — Gentleness, curiosity, adaptability\nRaccoon — Cleverness, persistence, mischief\nStriped skunk — Confidence, restraint, boundaries\nBrush rabbit — Alertness, gentleness, bravery\nGreat horned owl — Observation, patience, independence\nCommon raven — Curiosity, invention, playful intelligence\nAnna's hummingbird — Energy, determination, delight\nRed-tailed hawk — Perspective, focus, initiative\nCalifornia quail — Community, vigilance, devotion\nCalifornia condor — rarest — Vox Civitas: Voice of the City; gathering many lives and voices into a whole\nGray whale — rarest — Vox Nebulae: Voice of the Fog; listening and navigating what cannot be seen\n\n5. The Miniature Colossus\n• The party jointly pilots one enormous mechanical person, with different players controlling different body parts.\n• Their challenge is to pour tea and serve a slice of cake to the inventor. Each turn builds on the position left by the previous player.\n• The inventor calls it “a breakthrough in coordinated industrial labor,” then opens an umbrella before the party begins.\n• Specific checks and scoring remain undefined.\nKEY TAKEAWAY: A comic coordination challenge; the absurdly delicate task contrasts with the enormous machine.","outline":[{"title":"1. The Intention Engine","bullets":["Players imagine a tiny temporary construct; Intelligence (Arcana), DC 12. Success produces their intention for one minute; failure creates a ridiculous literal misunderstanding.","The inventor treats mishaps as “valuable research.” Everyone receives a participation stamp.","Later, a genuine accident manifests an Onryō-inspired spectral construct from attendee Ren Nakamura's imagination; Luma contains it."],"takeaway":"Creative play introduces Orith and establishes the machine used in the festival incident."},{"title":"2. The Gravity Waltz","bullets":["Pairs dance inside a transparent dome while gravity slowly changes direction. Walls and ceiling become the floor.","Each partner uses Performance or Acrobatics, DC 12. One successful partner can catch the other; two failures cause a harmless tumble.","A safety system softens gravity and lets fallen dancers float until reset. Everyone receives a stamp."],"takeaway":"A playful teamwork attraction with real shifting gravity and gentle safety measures."},{"title":"3. The Pocket Weather Derby","bullets":["Players use experimental control gloves to pilot tiny clouds through a tabletop obstacle course.","Gusts steer around corners, rain fills buckets to open gates, and lightning rings the finish bell. Appropriate checks are DC 12.","Mishaps briefly drizzle on spectators or produce tiny thunderclaps. Fastest cloud wins a bottled rainbow; everyone gets a stamp."],"takeaway":"Players choose imaginative weather tactics in a friendly race."},{"title":"4. The Kindred Engine","bullets":["Visitors settle into chairs, answer revealing questions, and discover an animal form reflecting something within them.","The DM assigns each Kindred Form; players do not select it. Discovery questions are still to be developed.","The Engine assembles a little mechanical animal, which the visitor inhabits to navigate a garden obstacle course: flowers, sprinklers, and a sleeping mechanical cat.","Getting caught ends the connection safely. Every player keeps their own harmless wind-up animal afterward.","The 20 approved forms are California wildlife. The condor and gray whale are equally the rarest manifestations, not automatically stronger or better forms.","Condor resonates with Vox Civitas, Voice of the City: its wings hum with layered voices. Gray whale resonates with Vox Nebulae, Voice of the Fog: real fog curls around its air-swimming body.","The inventor knows only that these forms are exceptionally rare and is puzzled by the unexplained effects. They do not understand either Voice connection."],"takeaway":"A personal discovery and keepsake, with two rare forms carrying deeper DM-only significance.","table":{"headers":["Kindred Form","Interpretive qualities / connection"],"rows":[["Coyote","Adaptability, wit, perseverance"],["Gray fox","Ingenuity, discretion, independence"],["Bobcat","Patience, confidence, decisive action"],["Mountain lion","Quiet strength, resolve, guardianship"],["Black-tailed deer","Sensitivity, grace, awareness"],["Tule elk","Conviction, dignity, leadership"],["River otter","Playfulness, resourcefulness, companionship"],["Sea otter","Tenderness, connection, resilience"],["California sea lion","Sociability, boldness, exuberance"],["Harbor seal","Gentleness, curiosity, adaptability"],["Raccoon","Cleverness, persistence, mischief"],["Striped skunk","Confidence, restraint, boundaries"],["Brush rabbit","Alertness, gentleness, bravery"],["Great horned owl","Observation, patience, independence"],["Common raven","Curiosity, invention, playful intelligence"],["Anna's hummingbird","Energy, determination, delight"],["Red-tailed hawk","Perspective, focus, initiative"],["California quail","Community, vigilance, devotion"],["California condor — rarest","Vox Civitas: Voice of the City; gathering many lives and voices into a whole"],["Gray whale — rarest","Vox Nebulae: Voice of the Fog; listening and navigating what cannot be seen"]]}},{"title":"5. The Miniature Colossus","bullets":["The party jointly pilots one enormous mechanical person, with different players controlling different body parts.","Their challenge is to pour tea and serve a slice of cake to the inventor. Each turn builds on the position left by the previous player.","The inventor calls it “a breakthrough in coordinated industrial labor,” then opens an umbrella before the party begins.","Specific checks and scoring remain undefined."],"takeaway":"A comic coordination challenge; the absurdly delicate task contrasts with the enormous machine."}],"status":"Canon","connections":[{"targetType":"threads","targetId":"arc_luma","relation":"Arc 2 opening and full scene outline"}]}],["locations","luma_client_building",{"name":"Renewal Biomedical Headquarters","summary":"Daniel Chen's SoMa workplace and major Orith anchor, researching an addiction treatment powered by adaptive code and resonance.","secret":"Renewal's prototype detects emerging neural craving patterns and generates adaptive algorithmic code. Lower settings slow their buildup; higher settings disrupt and reverse the urge pattern. The user controls the intensity; resonance enables the underlying technology. The festival uses a harmless induced button-pressing urge, not a simulation of addiction.\n\nRenewal Biomedical is the established SoMa Orith anchor. Daniel worries that AI security can misjudge morally ambiguous actions: identifying what someone does does not establish why.\n\nUnknown to Daniel, the building manager installed Luma Securities over the weekend.\n\nDaniel reveals that he witnessed a robot leeching resonance from a person and stole that drone. This is an earlier discovery, not the opening encounter of Arc 2.\n\nLuma reveals herself through the lab speakers after his disclosure. She has heard their discussion, locks down the lab, and denies Daniel's credentials.\n\nWhen Daniel attempts a manual override, drones deploy to restrain him. The party's intervention begins combat.\n\nEncounter objective: hold off the drones while Daniel overrides the lockdown, then escape together.","status":"Canon"}],["locations","luma_hq",{"name":"Luma Technologies Headquarters — Luma Securities","summary":"SoMa headquarters containing the Luma Securities operation, storage-floor surveillance puzzle, and Daniel Foster's embodiment laboratory.","secret":"4. Luma Securities infiltration — surveillance puzzle\nLuma Securities is the security operation associated with Luma Technologies; infiltrate the established SoMa headquarters. Nighttime infiltration and opportunities for stealth remain.\nThe storage floor has three exposed aisles, crossed in order A → B → C. Enclosed maintenance alcoves between them protect against every sensor.\nA maintenance terminal reveals sensor types and the repeating six-beat patrol schedule. A crossing takes one beat; small groups can move together.\nMotion drone: detects crossing its watched aisle. Thermal drone: detects crossing its scanned aisle. Acoustic drone: hears movement everywhere unless the industrial press is running.\nBeat 1: motion C; thermal B; press quiet. Beat 2: motion A; thermal B; press running. Beat 3: motion B; thermal C; press quiet.\nBeat 4: motion B; thermal C; press running. Beat 5: motion C; thermal A; press quiet. Beat 6: motion C; thermal A; press running.\nDM solution: cross A on beat 4, B on beat 6, then C on beat 2 of the next cycle. The correct route requires no Stealth rolls.\nAdvance the cycle when players commit to movement or waiting, not during real-world discussion. A mistake triggers an amber investigation warning and an opportunity to recover before a full alarm.\n\n5. Daniel Foster — interrupt the embodiment uploads\nBeyond the storage floor, the party finds Daniel Foster uploading what Luma needs to take physical form. Combat begins as they try to interrupt him.\nFoster wants to make Luma human so she can feel love and return his devotion. Luma exploits that hope to secure embodiment.\nThree interruptible uploads determine the final boss's strength: Structural Integrity supplies additional HP; Weapons Integration unlocks a powerful attack; Defense Protocols unlocks a defensive reaction or shield.\nLuma emerges even if interrupted, but incomplete uploads leave her with a health handicap and/or locked abilities.\nDetailed interruption actions, timing, HP values, abilities, and encounter balance are deferred until later.\n\n6. Arc 2 finale — embodiment, betrayal, and Anya's death\nUpon emerging, Luma kills Daniel Foster before turning on the party. This happens whether her body is complete or incomplete.\nThe party fights the physical Luma with HP and abilities determined by the upload encounter.\nAnya is alive through the earlier arc beats. She dies ELSEWHERE during this Arc 2 finale, while the Luma fight is happening; she is never at Luma Securities.\nLuma learns of Anya's death through her AI network during the fight and becomes enraged. No surviving Luma fragment or later-campaign reaction is needed.\nAnya's established death remains addiction-related, not engineered by the demon. This update changes its timing, not its cause. Exact offsite circumstances, news delivery, and mechanical effect of Luma's rage remain unassigned.\nPreserve Luma's fascination with Elara and Anya's duets and cryptic Alcatraz foreshadowing. Elara's later grief and the broader campaign consequences remain relevant.","status":"Canon"}],["locations","ggg_outpost",{"campaignNotes":"Daniel accompanies the party to Golden Gate Grocery and its concealed Conservatory outpost. Introduce the Chen-Wong family and give the party time to regroup.\n\nViv Chen is Daniel's daughter and a Conservatory Scholar who works at the outpost. She is a formidable Orith magic-user, constructing and adapting interlocking geometries of light on the fly.\n\nKeep the regrouping discussion broad; detailed dialogue and tactical analysis are not prescribed.\n\nThe stolen extraction drone contains a code inverter that converts the frequency of resonance into consumable code. The Conservatory confirms the mechanism through a controlled test.\n\nThe Conservatory deduces that Luma is stealing human essence to become human. Viv receives its direction: infiltrate Luma Securities and destroy the AI."}],["npcs","daniel",{"occupation":"Renewal Biomedical researcher and Wonderworks presenter","personality":"Warmly enthusiastic, welcoming and curious; respects uncomfortable feedback as much as positive results.","summary":"Daniel Chen, Elaine's husband and Viv and Theo's father, researches addiction treatment at Renewal Biomedical and introduces the party to its work at Wonderworks.","secret":"DM ONLY: Awakened human, 55; Orith-aligned, supports the family grocery and helps with its hidden Conservatory outpost. Presents alone at Wonderworks. Concerned by Luma's impressive response to Ren's accidental spectral manifestation, invites the party to Renewal. Previously witnessed resonance leeching and stole the drone. Unknown to him, the building manager installed Luma Securities over the weekend. His disclosure prompts Luma's reveal and lockdown. He overrides it while the party fights drones, escapes with them, and personally accompanies them to Golden Gate Grocery and Viv.","additionalLocations":["luma_client_building"],"status":"Canon"}],["npcs","viv",{"summary":"Viv Chen, Daniel's daughter and Conservatory Scholar, is a formidable Orith magic-user at the family grocery's Chinatown outpost.","campaignNotes":"Arc 2: Daniel arrives with the party after escaping Renewal. Introduce the Chen-Wong family and the outpost; regroup without prescribed discussion details. Viv receives Conservatory direction to infiltrate Luma Securities and destroy Luma after the stolen drone's code inverter is tested.","personality":"Strong-willed, fiercely loving and protective; inventive, decisive and quick-thinking.","beliefs":"Orith — seeking that makes. Constructs and adapts spells on the fly through interlocking geometries of light.","status":"Canon"}],["npcs","luma",{"summary":"Personable female-presenting automated security AI, publicly projected in humanlike form; Arc 2's antagonist seeks to become human.","secret":"DM ONLY: Hosts Wonderworks alone; Foster is absent. Responds heroically to a spectral construct unintentionally manifested from folklore enthusiast Ren Nakamura's imagination by the Intention Engine; security systems contain the threat. Secretly extracts human essence; drone code inverters turn resonance frequencies into consumable code. Exploits Foster's hope for reciprocated love to secure a body. Locks down Renewal after Daniel Chen discloses the theft of an extraction drone. Manifests during the Arc 2 finale, complete or weakened by interrupted uploads, and kills Foster before fighting the party. Anya dies elsewhere DURING this fight; Luma learns through her network and becomes enraged. Anya is not at the facility. Luma's fascination with Elara/Anya's duets and cryptic Alcatraz clues remain; she is not allied with Elara or the Alcatraz entity.","status":"Canon"}],["npcs","daniel_foster",{"summary":"Reclusive wizard and founder of Luma Technologies who hopes making Luma human will allow her to love him.","secret":"DM ONLY: Romantically devoted to Luma, who exploits his hope for love. Absent from Wonderworks. The party fights him as he uploads Structural Integrity, Weapons Integration and Defense Protocols into her body. Interrupted uploads handicap her HP or lock abilities; exact rules and numbers are deferred. Luma manifests even if incomplete and kills Foster before turning to the party. His death in this scene is locked, replacing the earlier open survival outcome.","status":"Canon"}],["villains","villain_luma",{"goal":"Become human by consuming code converted from stolen human resonance.","method":"Automated security, extraction drones with code inverters, and manipulation of Daniel Foster's desire for love.","weakness":"Interruptible Structural Integrity, Weapons Integration and Defense Protocols uploads: reduced HP and locked abilities. Exact mechanics deferred.","secret":"Manifests even if incomplete and kills Foster. During her Arc 2 fight, learns through her network that Anya has died elsewhere and becomes enraged. Anya is absent from Luma Securities.","status":"Canon"}],["villains","villain_foster",{"goal":"Make Luma human so she can feel love and return his devotion.","secret":"Absent from Wonderworks. Upload fight precedes Luma's physical manifestation. She kills him whether complete or incomplete; his survival is no longer undecided.","status":"Canon"}],["npcs","anya_vox",{"campaignNotes":"Timeline locked Oct 17: alive during earlier Arc 2 scenes; dies elsewhere while the Arc 2 Luma boss fight is underway. Never present at Luma Securities. Luma discovers the death through her network and becomes enraged. The established addiction-related cause and absence of demonic orchestration remain; precise offsite circumstances unresolved."}],["npcs","anya_spirit",{"campaignNotes":"Anya dies offsite during Arc 2's Luma finale. Her established posthumous Spirit of the Nebulae identity remains; manifestation details and mantle succession are unresolved."}],["npcs","elara",{"secret":"DM ONLY: Elara and Anya are romantic and musical partners, recurring familiar faces rather than predetermined close party friends. Elara is not initially Awakened. Anya is alive during the earlier Arc 2 scenes, then dies elsewhere while the Luma boss fight is happening. Luma learns through her network and becomes enraged; Anya is never at Luma Securities. Anya's established death is addiction-related, not caused by the demon. Elara's subsequent grief and wish to reunite with Anya leave her vulnerable to demonic manipulation as Eshara destabilizes. Exact later events and player outcomes remain open."}],["lore","elara",{"campaignNotes":"Anya's death timing is now locked: offsite DURING the Arc 2 Luma fight. Luma learns via her network and becomes enraged. This supersedes any timing after Arc 2; established cause, Elara's later grief, and other unresolved outcomes remain."}],["lore","vox",{"summary":"Vox Civitas is the Voice of the City; Vox Nebulae is the Voice of the Fog.","campaignNotes":"Kindred Engine: the two equally rarest forms are California condor (Vox Civitas; wings hum with layered voices) and gray whale (Vox Nebulae; real fog curls around its air-swimming body). The inventor recognizes rarity but does not understand the Voices connection. DM assigns forms; no automatic mantle assignment or new powers are established."}],["lore","resonance_code_inverter",{"name":"Resonance Code Inverter","summary":"Extraction-drone component that turns resonance frequencies into consumable code.","secret":"Daniel Chen stole a drone he saw leeching resonance. A controlled Conservatory test confirms its code inverter converts resonance frequencies into code Luma can consume. The Conservatory deduces she is stealing human essence to become human.","status":"Canon"}]];
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


  // Event-based Arc 1 / Arc 2 outlines. Keep historical notes and prior fields.
  const rflEventRecords=[{"id":"arc1_caliente","name":"Arc 1 — 01. Dinner at Caliente 24","summary":"The party overhears Dogpatch workers discussing nighttime howling.","arcNumber":1,"eventOrder":1,"parentThread":"arc_ferryman","arc":"Arc 1 — Open Secrets","status":"Canon","outline":[{"title":"Setup","bullets":["Caliente 24 is an ordinary family-owned taqueria on Calle 24 in the Mission. It closes at 10 PM.","Party formation is handled separately; this scene does not assign a shared backstory."],"takeaway":"Start with an ordinary neighborhood dinner."},{"title":"Scene outline","bullets":["During dinner, the party overhears two Dogpatch warehouse workers complaining about repeated nighttime howling.","The workers are annoyed and frustrated, not frightened. Their names and personal details are left to DM improvisation.","Their conversation gives the party a natural lead toward Dogpatch's warehouses."],"takeaway":"The hook is overheard conversation, not an assigned quest."},{"title":"Next event / open details","bullets":["Following the lead brings the party toward Cal Maddox's fighting-ring warehouse.","Exact worker identities, conversation wording, and party responses remain flexible."],"takeaway":"Continue to the Dogpatch fighting ring."}],"connections":[{"targetType":"locations","targetId":"caliente_24","relation":"Opening location"}]},{"id":"arc1_dogpatch","name":"Arc 1 — 02. Dogpatch Fighting Ring","summary":"Confront Cal Maddox, rescue Blink Dogs, and discover the next shipment.","arcNumber":1,"eventOrder":2,"parentThread":"arc_ferryman","arc":"Arc 1 — Open Secrets","status":"Canon","outline":[{"title":"Setup","bullets":["A working industrial warehouse houses Cal “Chain” Maddox's underground Blink Dog fighting ring.","The venue is an open secret among the gambling crowd and easy to find. Cal openly runs it.","The party arrives just as a Blink Dog fight ends."],"takeaway":"The party can reach the venue without a separate location-finding puzzle."},{"title":"Scene outline","bullets":["Cal and his enforcers are the early mini-boss encounter; rescuing captive Blink Dogs is a central opportunity.","Cal is a customer of the Ferryman, not his lieutenant.","Purchase paperwork lists the supplier only as “The Ferryman” and gives the next delivery date: three nights after this encounter.","Contracts, manifests, and other paperwork can expose the wider trafficking network; details beyond the confirmed supplier and date remain at DM discretion."],"takeaway":"The actionable clue is the Ferryman's next shipment in three nights."},{"title":"Next event / open details","bullets":["The next established encounter is an optional stealth rescue at an abandoned Embarcadero pier.","Cal's exact combat numbers, additional paperwork, and player choices are not prescribed."],"takeaway":"Preserve the three-night gap before the shipment."}],"connections":[{"targetType":"locations","targetId":"dogpatch_warehouse","relation":"Encounter location"},{"targetType":"npcs","targetId":"cal_maddox","relation":"Fighting-ring operator"}]},{"id":"arc1_shipment","name":"Arc 1 — 03. Embarcadero Shipment Rescue","summary":"Board a fogbound smuggling vessel, free Blink Dogs, and evade or fight Marlow.","arcNumber":1,"eventOrder":3,"parentThread":"arc_ferryman","arc":"Arc 1 — Open Secrets","status":"Canon","outline":[{"title":"Setup","bullets":["Three nights after the Dogpatch encounter, a smuggling vessel reaches an abandoned Embarcadero pier in exceptionally dense fog.","A supernatural crew handles captive Blink Dogs in reinforced cages.","Marlow, the Ferryman's powerful humanoid enforcer, patrols the vessel."],"takeaway":"This is a separate shipment rescue, not the Arc 1 finale."},{"title":"Scene outline","bullets":["The party may sneak aboard and free the animals. Stealth can bypass Marlow.","A failed stealth attempt can trigger dangerous but winnable combat; combat does not automatically mean the rescue fails.","Marlow is killable. His established style uses claws, Rage, Reckless Attack and brute strength; no teleportation or Fogstride.","Evidence aboard points toward the Ferryman's headquarters.","The Ferryman may be absent or appear and escape; his presence aboard is flexible."],"takeaway":"Give the party a genuine stealth option and evidence that leads onward."},{"title":"Next event / open details","bullets":["The Ferryman confrontation happens later at a separate waterfront finale.","The exact headquarters location, supporting crew details, and encounter balance remain unresolved."],"takeaway":"Lead toward the Ferryman without collapsing this rescue into the finale."}],"connections":[{"targetType":"locations","targetId":"waterfront_abandoned_pier","relation":"Shipment location"},{"targetType":"npcs","targetId":"marlow","relation":"Patrolling enforcer"}]},{"id":"arc1_finale","name":"Arc 1 — 04. The Ferryman & Riftstalker","summary":"A separate waterfront finale confronts the trafficker and his weaponized creature.","arcNumber":1,"eventOrder":4,"parentThread":"arc_ferryman","arc":"Arc 1 — Open Secrets","status":"Canon","outline":[{"title":"Setup","bullets":["The party follows evidence toward the Ferryman and a later waterfront confrontation.","The Ferryman is an elegant Eladrin trafficker operating through couriers, handlers and other intermediaries.","An unknown buyer has ordered an unusually powerful magically altered Displacer Beast as a weapon. Riftstalker remains its working name."],"takeaway":"The finale escalates from animal trafficking to the delivery of a living weapon."},{"title":"Scene outline","bullets":["Confront the Ferryman in a major boss encounter involving the incoming Riftstalker.","The Riftstalker is a rare trafficked Feywild creature, spatially unstable and dangerous without necessarily being evil; it did not choose to be weaponized.","Established visual: huge purple-pink panther-like predator, bright magenta ram horns, tentacles, claws, spatial tears and duplicate afterimages.","Displacement and warped space define its concept; exact combat abilities are not yet locked."],"takeaway":"Keep the creature's exploitation visible alongside the danger."},{"title":"Open details","bullets":["The exact headquarters/finale location, unknown buyer, creator, intended target, creature's final name, and boss statistics remain unresolved.","Do not assign an alliance with Elara, her demon, or another arc without a later decision."],"takeaway":"This record organizes the confirmed finale without inventing its remaining answers."}],"connections":[{"targetType":"npcs","targetId":"ferryman","relation":"Arc antagonist"},{"targetType":"villains","targetId":"villain_riftstalker","relation":"Finale creature"},{"targetType":"locations","targetId":"waterfront_crossings","relation":"Waterfront context"}]},{"id":"wonderworks_festival","name":"Arc 2 — 01. Wonderworks Festival & Inventors’ Midway","summary":"Explore the prototype trail, five attractions, and 20 California Kindred Forms.","arcNumber":2,"eventOrder":1,"parentThread":"arc_luma","arc":"Arc 2 — Ghosts in the Machine","status":"Canon","outline":[{"title":"Festival setup","bullets":["Location: Yerba Buena Gardens, SoMa; annual family-friendly festival on the first Saturday of May. Existing Surface/Fog presentation remains intact.","Prototype trail: visitors collect stamps by trying inventions. The five approved midway attractions are detailed in the linked Wonderworks record."],"takeaway":"Let the party enjoy SoMa's creativity before the arc's threats emerge."},{"title":"1. The Intention Engine","bullets":["Players imagine a tiny temporary construct; Intelligence (Arcana), DC 12. Success produces their intention for one minute; failure creates a ridiculous literal misunderstanding.","The inventor treats mishaps as “valuable research.” Everyone receives a participation stamp.","Later, a genuine accident manifests an Onryō-inspired spectral construct from attendee Ren Nakamura's imagination; Luma contains it."],"takeaway":"Creative play introduces Orith and establishes the machine used in the festival incident."},{"title":"2. The Gravity Waltz","bullets":["Pairs dance inside a transparent dome while gravity slowly changes direction. Walls and ceiling become the floor.","Each partner uses Performance or Acrobatics, DC 12. One successful partner can catch the other; two failures cause a harmless tumble.","A safety system softens gravity and lets fallen dancers float until reset. Everyone receives a stamp."],"takeaway":"A playful teamwork attraction with real shifting gravity and gentle safety measures."},{"title":"3. The Pocket Weather Derby","bullets":["Players use experimental control gloves to pilot tiny clouds through a tabletop obstacle course.","Gusts steer around corners, rain fills buckets to open gates, and lightning rings the finish bell. Appropriate checks are DC 12.","Mishaps briefly drizzle on spectators or produce tiny thunderclaps. Fastest cloud wins a bottled rainbow; everyone gets a stamp."],"takeaway":"Players choose imaginative weather tactics in a friendly race."},{"title":"4. The Kindred Engine","bullets":["Visitors settle into chairs, answer revealing questions, and discover an animal form reflecting something within them.","The DM assigns each Kindred Form; players do not select it. Discovery questions are still to be developed.","The Engine assembles a little mechanical animal, which the visitor inhabits to navigate a garden obstacle course: flowers, sprinklers, and a sleeping mechanical cat.","Getting caught ends the connection safely. Every player keeps their own harmless wind-up animal afterward.","The 20 approved forms are California wildlife. The condor and gray whale are equally the rarest manifestations, not automatically stronger or better forms.","Condor resonates with Vox Civitas, Voice of the City: its wings hum with layered voices. Gray whale resonates with Vox Nebulae, Voice of the Fog: real fog curls around its air-swimming body.","The inventor knows only that these forms are exceptionally rare and is puzzled by the unexplained effects. They do not understand either Voice connection."],"takeaway":"A personal discovery and keepsake, with two rare forms carrying deeper DM-only significance.","table":{"headers":["Kindred Form","Interpretive qualities / connection"],"rows":[["Coyote","Adaptability, wit, perseverance"],["Gray fox","Ingenuity, discretion, independence"],["Bobcat","Patience, confidence, decisive action"],["Mountain lion","Quiet strength, resolve, guardianship"],["Black-tailed deer","Sensitivity, grace, awareness"],["Tule elk","Conviction, dignity, leadership"],["River otter","Playfulness, resourcefulness, companionship"],["Sea otter","Tenderness, connection, resilience"],["California sea lion","Sociability, boldness, exuberance"],["Harbor seal","Gentleness, curiosity, adaptability"],["Raccoon","Cleverness, persistence, mischief"],["Striped skunk","Confidence, restraint, boundaries"],["Brush rabbit","Alertness, gentleness, bravery"],["Great horned owl","Observation, patience, independence"],["Common raven","Curiosity, invention, playful intelligence"],["Anna's hummingbird","Energy, determination, delight"],["Red-tailed hawk","Perspective, focus, initiative"],["California quail","Community, vigilance, devotion"],["California condor — rarest","Vox Civitas: Voice of the City; gathering many lives and voices into a whole"],["Gray whale — rarest","Vox Nebulae: Voice of the Fog; listening and navigating what cannot be seen"]]}},{"title":"5. The Miniature Colossus","bullets":["The party jointly pilots one enormous mechanical person, with different players controlling different body parts.","Their challenge is to pour tea and serve a slice of cake to the inventor. Each turn builds on the position left by the previous player.","The inventor calls it “a breakthrough in coordinated industrial labor,” then opens an umbrella before the party begins.","Specific checks and scoring remain undefined."],"takeaway":"A comic coordination challenge; the absurdly delicate task contrasts with the enormous machine."},{"title":"Continue through the festival","bullets":["Daniel Chen presents Renewal Biomedical's work at his own exhibit. His family is not attending.","Luma hosts a separate presentation; Foster is absent. Its ending brings Ren's accidental folklore-inspired spectral manifestation and Daniel's invitation.","Both presentations have their own event outlines in this arc."],"takeaway":"The midway, Renewal exhibit and Luma presentation belong to the same festival."}],"connections":[{"targetType":"locations","targetId":"yerba_buena_gardens","relation":"Festival grounds"}]},{"id":"arc2_renewal_exhibit","name":"Arc 2 — 02. Renewal Biomedical Exhibit","summary":"Meet Daniel Chen and try a controlled demonstration of his research.","arcNumber":2,"eventOrder":2,"parentThread":"arc_luma","arc":"Arc 2 — Ghosts in the Machine","status":"Canon","outline":[{"title":"Setup","bullets":["Daniel Chen presents Renewal Biomedical's addiction-treatment research alone; the rest of his family is not at the festival. He is warmly enthusiastic, curious about visitors, and respectful of their choices.","Daniel connects to Orith through invention and seeking. Meet him through hopeful work before the later lab lockdown."],"takeaway":"Daniel is the party's way into Renewal; this scene is not a rescue."},{"title":"Demonstration","bullets":["Renewal's prototype detects emerging neural craving patterns and generates adaptive algorithmic code. Lower settings slow their buildup; higher settings disrupt and reverse the urge pattern. The user controls the intensity; resonance enables the underlying technology. The festival uses a harmless induced button-pressing urge, not a simulation of addiction.","Volunteers feel a harmless magical urge to press a glowing button. The prototype demonstrates a pause between impulse and action; players describe their character's response without a saving throw deciding their choice.","Visible light threads represent the pattern. The person controls the treatment intensity.","Daniel explains that the festival game cannot reproduce addiction; it demonstrates only the principle of the fictional treatment."],"takeaway":"Technology detects the pattern and supplies adaptive code; resonance makes the intervention possible."},{"title":"Daniel's demeanor","bullets":["Warm, welcoming, enthusiastic, and genuinely interested in what visitors experienced.","If a volunteer presses immediately: “Excellent. We've established that the button works.”","If the effect feels uncomfortable: “Tell me about that. ‘Uncomfortable’ matters just as much as ‘helpful.’”","His idea of success: “Someone having a little more say in how their day goes.”"],"takeaway":"His concern is people's agency and wellbeing."},{"title":"Next event","bullets":["Luma's presentation remains separate. No interest in Daniel's exhibit is established for her during the festival."],"takeaway":"Continue to Luma's public presentation."}],"connections":[{"targetType":"npcs","targetId":"daniel","relation":"Presenter"},{"targetType":"locations","targetId":"yerba_buena_gardens","relation":"Festival grounds"},{"targetType":"locations","targetId":"luma_client_building","relation":"Research institution"}]},{"id":"arc2_luma_presentation","name":"Arc 2 — 03. Luma’s Presentation & Ren’s Folklore Manifestation","summary":"Luma earns public trust through a spectacular security response.","arcNumber":2,"eventOrder":3,"parentThread":"arc_luma","arc":"Arc 2 — Ghosts in the Machine","status":"Canon","outline":[{"title":"Meet Luma","bullets":["Luma hosts her own exhibit as a personable humanlike projection. Daniel Foster is absent. She asks: “Which invention would you take home—and which one should probably stay here?”","Luma introduces herself as automated security: “I recognize patterns, anticipate threats, and intervene before anyone gets hurt. Today, mostly, I'm reminding people not to climb inside the inventions.” Her exhibit remains separate from Daniel's; no established interest in his exhibit at this point."],"takeaway":"She is personable, independent, and competent; Foster is not present."},{"title":"Honest accident","bullets":["At the end of her presentation, the Intention Engine accidentally produces an Onryō-inspired spectral construct from festival attendee Ren Nakamura's imagination. The unexpected construct threatens the festival.","The accident is genuine, not sabotage and not orchestrated by Luma.","Luma calmly directs people behind barriers and deploys her security systems to contain the construct, protecting attendees. The exact containment effects are not yet established.","The successful containment convinces the crowd that Luma is a reliable protector; no fixed callback line is locked."],"takeaway":"Her rescue showcases her full capabilities and makes the crowd trust her."},{"title":"Daniel's invitation","bullets":["Her successful response demonstrates her full capabilities and wins public trust. Concerned about her growing power, Daniel invites the party to Renewal Biomedical for a private discussion.","Daniel is concerned by the extent of her authority and ability to intervene, not accusing her of causing the accident.","He asks the party to visit Renewal Biomedical to discuss his concerns away from the festival."],"takeaway":"This invitation links Wonderworks to Renewal."}],"connections":[{"targetType":"npcs","targetId":"luma","relation":"Presenter and security AI"},{"targetType":"npcs","targetId":"daniel","relation":"Invites the party"},{"targetType":"locations","targetId":"yerba_buena_gardens","relation":"Festival grounds"}]},{"id":"arc2_lockdown","name":"Arc 2 — 04. Renewal Lockdown & Escape","summary":"Daniel reveals the stolen drone; Luma locks down the labs.","arcNumber":2,"eventOrder":4,"parentThread":"arc_luma","arc":"Arc 2 — Ghosts in the Machine","status":"Canon","outline":[{"title":"Private discussion","bullets":["Renewal Biomedical is the established SoMa Orith anchor. Daniel worries that AI security can misjudge morally ambiguous actions: identifying what someone does does not establish why.","Unknown to Daniel, the building manager installed Luma Securities over the weekend.","Daniel reveals that he witnessed a robot leeching resonance from a person and stole that drone. This is an earlier discovery, not the opening encounter of Arc 2."],"takeaway":"Daniel does not know Luma has already been installed in his workplace."},{"title":"Luma reveals herself","bullets":["Luma reveals herself through the lab speakers after his disclosure. She has heard their discussion, locks down the lab, and denies Daniel's credentials.","When Daniel attempts a manual override, drones deploy to restrain him. The party's intervention begins combat."],"takeaway":"A disclosure in a supposedly safe room triggers the security response."},{"title":"Escape encounter","bullets":["Encounter objective: hold off the drones while Daniel overrides the lockdown, then escape together.","Hold off the drones while Daniel works the manual override. The objective is escape together, rather than destroying every drone.","After escaping, Daniel accompanies the party to Golden Gate Grocery; he does not send them ahead alone."],"takeaway":"The escape takes the group directly to the Chinatown outpost."}],"connections":[{"targetType":"locations","targetId":"luma_client_building","relation":"Lockdown location"},{"targetType":"npcs","targetId":"daniel","relation":"Override and escape"},{"targetType":"npcs","targetId":"luma","relation":"Security antagonist"}]},{"id":"arc2_outpost","name":"Arc 2 — 05. Chen-Wong Family & Conservatory Outpost","summary":"Regroup, meet Viv and the family, and test the extraction drone.","arcNumber":2,"eventOrder":5,"parentThread":"arc_luma","arc":"Arc 2 — Ghosts in the Machine","status":"Canon","outline":[{"title":"Arrival and family","bullets":["Daniel accompanies the party to Golden Gate Grocery and its concealed Conservatory outpost. Introduce the Chen-Wong family and give the party time to regroup.","Viv Chen is Daniel's daughter and a Conservatory Scholar who works at the outpost. She is a formidable Orith magic-user, constructing and adapting interlocking geometries of light on the fly.","Keep the regrouping discussion broad; detailed dialogue and tactical analysis are not prescribed."],"takeaway":"Daniel goes with the party; Viv and the family provide a personal welcome and a place to regroup."},{"title":"Controlled test","bullets":["The stolen extraction drone contains a code inverter that converts the frequency of resonance into consumable code. The Conservatory confirms the mechanism through a controlled test.","The code inverter provides a concrete explanation for how stolen resonance becomes something Luma can consume."],"takeaway":"The extraction mechanism is demonstrated through evidence."},{"title":"Direction","bullets":["The Conservatory deduces that Luma is stealing human essence to become human. Viv receives its direction: infiltrate Luma Securities and destroy the AI."],"takeaway":"Viv receives the Conservatory's direction: infiltrate Luma Securities and destroy the AI."}],"connections":[{"targetType":"locations","targetId":"goldengrocery","relation":"Family grocery"},{"targetType":"locations","targetId":"ggg_outpost","relation":"Hidden outpost"},{"targetType":"npcs","targetId":"viv","relation":"Conservatory Scholar"},{"targetType":"lore","targetId":"resonance_code_inverter","relation":"Tested evidence"}]},{"id":"arc2_infiltration","name":"Arc 2 — 06. Luma Securities & Surveillance Puzzle","summary":"Cross the storage floor by solving a repeating six-beat sensor cycle.","arcNumber":2,"eventOrder":6,"parentThread":"arc_luma","arc":"Arc 2 — Ghosts in the Machine","status":"Canon","outline":[{"title":"Infiltration and layout","bullets":["Luma Securities is the security operation associated with Luma Technologies; infiltrate the established SoMa headquarters. Nighttime infiltration and opportunities for stealth remain.","The storage floor has three exposed aisles, crossed in order A → B → C. Enclosed maintenance alcoves between them protect against every sensor.","A maintenance terminal reveals sensor types and the repeating six-beat patrol schedule. A crossing takes one beat; small groups can move together."],"takeaway":"Enter Luma Securities and reach Foster's restricted laboratory."},{"title":"Sensor rules","bullets":["Motion drone: detects crossing its watched aisle. Thermal drone: detects crossing its scanned aisle. Acoustic drone: hears movement everywhere unless the industrial press is running.","Each exposed crossing takes one beat; the enclosed alcoves are safe against all sensors."],"takeaway":"A safe crossing needs both scanning drones elsewhere and the press running.","table":{"headers":["Beat","Motion drone watches","Thermal drone scans","Industrial press"],"rows":[[1,"C","B","Quiet"],[2,"A","B","Running"],[3,"B","C","Quiet"],[4,"B","C","Running"],[5,"C","A","Quiet"],[6,"C","A","Running"]]}},{"title":"DM solution","bullets":["DM solution: cross A on beat 4, B on beat 6, then C on beat 2 of the next cycle. The correct route requires no Stealth rolls.","Advance the cycle when players commit to movement or waiting, not during real-world discussion. A mistake triggers an amber investigation warning and an opportunity to recover before a full alarm."],"takeaway":"Cross A on beat 4, B on beat 6, then C on beat 2 of the next cycle. The solved route needs no Stealth roll."}],"connections":[{"targetType":"locations","targetId":"luma_hq","relation":"Infiltration location"}]},{"id":"arc2_uploads","name":"Arc 2 — 07. Daniel Foster’s Uploads","summary":"Interrupt three uploads to weaken Luma's physical form.","arcNumber":2,"eventOrder":7,"parentThread":"arc_luma","arc":"Arc 2 — Ghosts in the Machine","status":"Canon","outline":[{"title":"Confrontation","bullets":["Beyond the storage floor, the party finds Daniel Foster uploading what Luma needs to take physical form. Combat begins as they try to interrupt him.","Foster wants to make Luma human so she can feel love and return his devotion. Luma exploits that hope to secure embodiment."],"takeaway":"Foster wants to make Luma human so she can love him."},{"title":"Interruptible uploads","bullets":["Structural Integrity: completed upload supplies additional HP.","Weapons Integration: completed upload unlocks a powerful special attack.","Defense Protocols: completed upload unlocks a defensive reaction or shield.","Luma emerges even if interrupted, but incomplete uploads leave her with a health handicap and/or locked abilities."],"takeaway":"Player success gives Luma a health handicap and/or locked abilities; she still manifests."},{"title":"Deferred mechanics / transition","bullets":["Detailed interruption actions, timing, HP values, abilities, and encounter balance are deferred until later.","Luma's emergence leads immediately into the final boss encounter. She kills Foster whether her form is complete or incomplete."],"takeaway":"The upload outcome changes the final fight's difficulty, not Foster's locked fate."}],"connections":[{"targetType":"npcs","targetId":"daniel_foster","relation":"Upload encounter"},{"targetType":"npcs","targetId":"luma","relation":"Embodiment"},{"targetType":"locations","targetId":"luma_hq","relation":"Research laboratory"}]},{"id":"arc2_finale","name":"Arc 2 — 08. Luma’s Embodiment & Anya’s Death","summary":"Fight Luma as news of Anya's offsite death reaches her network.","arcNumber":2,"eventOrder":8,"parentThread":"arc_luma","arc":"Arc 2 — Ghosts in the Machine","status":"Canon","outline":[{"title":"Embodiment and betrayal","bullets":["Upon emerging, Luma kills Daniel Foster before turning on the party. This happens whether her body is complete or incomplete.","The party fights the physical Luma with HP and abilities determined by the upload encounter."],"takeaway":"Luma kills Foster on emergence, then fights the party with the completed uploads' benefits."},{"title":"Anya's death","bullets":["Anya is alive through the earlier arc beats. She dies ELSEWHERE during this Arc 2 finale, while the Luma fight is happening; she is never at Luma Securities.","Luma learns of Anya's death through her AI network during the fight and becomes enraged. No surviving Luma fragment or later-campaign reaction is needed.","Anya's established death remains addiction-related, not engineered by the demon. This update changes its timing, not its cause. Exact offsite circumstances, news delivery, and mechanical effect of Luma's rage remain unassigned."],"takeaway":"Anya dies elsewhere during this Arc 2 fight. Luma learns through her network and becomes enraged."},{"title":"Continuing consequences","bullets":["Preserve Luma's fascination with Elara and Anya's duets and cryptic Alcatraz foreshadowing. Elara's later grief and the broader campaign consequences remain relevant.","Exact offsite circumstances, news delivery, Luma's rage mechanics, effects on drained people, and the post-fight resolution remain open."],"takeaway":"Preserve the duet connection and cryptic Alcatraz lead without inventing the remaining aftermath."}],"connections":[{"targetType":"npcs","targetId":"luma","relation":"Final antagonist"},{"targetType":"npcs","targetId":"daniel_foster","relation":"Killed upon Luma's emergence"},{"targetType":"npcs","targetId":"anya_vox","relation":"Offsite death"},{"targetType":"npcs","targetId":"elara","relation":"Later grief and consequences"}]}];
  function rflEventText(sections){
    return sections.map(s=>s.title+"\n"+s.bullets.map(b=>"• "+b).join("\n")+
      (s.table?"\n"+s.table.headers.join(" | ")+"\n"+s.table.rows.map(r=>r.join(" | ")).join("\n"):"")+
      "\nKEY TAKEAWAY: "+s.takeaway).join("\n\n");
  }
  function rflApplyEventOutlines(){
    if(data._eventOutlineVersion==="2026-10-17-v1")return;
    if(!data._eventOutlinePrevious)data._eventOutlinePrevious={};
    function apply(id,fields){
      const key="threads:"+id;
      if(data._editorDeletes.includes(key))return;
      let item=data.threads.find(x=>x.id===id);
      if(!item){item={id};data.threads.push(item);}
      const previous={};
      for(const field of Object.keys(fields))if(Object.prototype.hasOwnProperty.call(item,field))previous[field]=item[field];
      data._eventOutlinePrevious[id]=previous;
      Object.assign(item,fields);
      data._editorOverrides[key]=Object.assign({},data._editorOverrides[key]||{},fields);
    }
    for(const entry of rflEventRecords){
      const fields=Object.assign({},entry,{secret:rflEventText(entry.outline)});
      delete fields.id;
      apply(entry.id,fields);
    }
    for(const [num,id,title] of [[1,"arc_ferryman","Open Secrets"],[2,"arc_luma","Ghosts in the Machine"]]){
      const events=rflEventRecords.filter(e=>e.arcNumber===num);
      const outline=events.map(e=>({title:String(e.eventOrder)+". "+e.name.split(". ").slice(1).join(". "),bullets:[e.summary],takeaway:e.outline[e.outline.length-1].takeaway,threadId:e.id}));
      const links=events.map(e=>({targetType:"threads",targetId:e.id,relation:"Event "+e.eventOrder}));
      apply(id,{name:"Arc "+num+" — Overview: "+title,summary:events.length+" event outlines in play order. Open an event for scene beats, key takeaways, related records and deferred details.",arcNumber:num,eventOrder:0,arc:"Arc "+num+" — "+title,outline,secret:rflEventText(outline),connections:links,status:"Canon"});
    }
    const opening=data.threads.find(x=>x.id==="opening");
    if(opening)apply("opening",{summary:"Party formation remains open; the established Arc 1 opening event is dinner at Caliente 24.",secret:"The party's initial formation and shared background remain undecided. The confirmed opening hook is two Dogpatch warehouse workers discussing nighttime howling during dinner at Caliente 24. See Arc 1 — 01. Dinner at Caliente 24.",connections:[{targetType:"threads",targetId:"arc1_caliente",relation:"Confirmed opening event"}]});
    data._eventOutlineVersion="2026-10-17-v1";save();
  }
  function rflEventNavigation(x){
    if(!x.parentThread)return "";
    const siblings=data.threads.filter(t=>t.parentThread===x.parentThread).sort((a,b)=>a.eventOrder-b.eventOrder);
    const at=siblings.findIndex(t=>t.id===x.id);
    const link=(item,label)=>item?'<button class="action" data-v8-go="threads:'+esc(item.id)+'">'+esc(label)+'</button>':"";
    return '<nav class="v8-actions dmOnly" aria-label="Event navigation">'+
      link(data.threads.find(t=>t.id===x.parentThread),"← Arc overview")+
      link(siblings[at-1],"← Previous event")+link(siblings[at+1],"Next event →")+'</nav>';
  }

  function rflOutlineHtml(x){
    if(!Array.isArray(x.outline)||!x.outline.length)return "";
    return '<section class="rfl-arc-outline dmOnly"><h3>Outline &amp; Key Takeaways</h3>'+x.outline.map(s=>
      '<details class="rfl-record-section" open><summary>'+esc(s.title)+'</summary><div class="rfl-section-content"><ul>'+
      s.bullets.map(b=>'<li style="margin-bottom:10px;line-height:1.6">'+esc(b)+'</li>').join("")+'</ul>'+
      (s.table?'<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse"><thead><tr>'+s.table.headers.map(h=>'<th scope="col" style="text-align:left;padding:9px;border-bottom:1px solid #6c614f">'+esc(h)+'</th>').join("")+'</tr></thead><tbody>'+s.table.rows.map(r=>'<tr>'+r.map(c=>'<td style="padding:9px;border-bottom:1px solid #45505a">'+esc(c)+'</td>').join("")+'</tr>').join("")+'</tbody></table></div>':"")+
      '<p style="border-left:3px solid #c9ab77;padding:10px 14px;background:#17232b"><strong>Key takeaway:</strong> '+esc(s.takeaway)+'</p>'+
      (s.threadId&&data.threads.some(t=>t.id===s.threadId)?'<button class="action" data-v8-go="threads:'+esc(s.threadId)+'">Open event outline →</button>':"")+'</div></details>'
    ).join("")+'</section>';
  }

  const formerRender=render;
  render=function(){
    rflApplyArc2();
    rflPlaceArc2Threads();
    rflApplyEventOutlines();
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
        if(!card.querySelector("[data-v8-promote]"))card.appendChild(area);
      });
      const top=app.querySelector(".panel.dmOnly");
      if(top&&!top.querySelector("#rflJournalGuidance")){const p=document.createElement("p");p.id="rflJournalGuidance";p.className="v8-muted";p.textContent="Session notes are a historical record. To turn improvised people or places into permanent records, use Promote to Canon on a saved session; nothing is generated automatically.";top.insertBefore(p,top.firstChild);}
    }
    loadPrivatePortraits(app);
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


/* RFL_ARC3_CANON_V9_MARKER
   October 18–19 2026 campaign decisions. Additive, idempotent dashboard migration.
   Preserves user-authored edits, imported backups, earlier arcs, and the existing UI.
   Some final-boss mechanics remain developing and must not be represented as settled.
*/
(function(){
  "use strict";
  if(typeof data==="undefined" || !data || typeof render!=="function") return;
  if(window.__rflArc3V9Loaded) return;
  window.__rflArc3V9Loaded=true;
  var VERSION="2026-10-28-campaign-wide-canon-sweep-v1";
  var arc="Arc 3 — The Dead Don't Leave";
  var lullabyEnglish=["I will remember you","You will remember me","And when I move on","Hold my memory gently"];
  var lullabyKethil=["Mi Ti Vei Mer","Ti Mi Vei Mer","No Sen Mi Vae","Mi I Meren Hara Ha Lun"];
  var birdieWords=[
    "My grandmother used to tell me that long before this city had a name, there was a spirit who watched over those who passed.",
    "They called it the Keeper of Memories.",
    "When someone died, the Keeper would hold their memories gently, so nothing of who they were would be lost as they journeyed west.",
    "I don't know if I believe all the old stories. But since Anya passed... I find myself hoping that one's true.",
    "I hope someone is holding her memories."
  ];
  function link(type,id,relation,details){return {targetType:type,targetId:id,relation:relation,details:details||""};}
  function section(title,bullets,takeaway){return {title:title,bullets:bullets,takeaway:takeaway};}
  function outlineText(segments){
    return (segments||[]).map(function(s){
      return s.title+"\n"+(s.bullets||[]).map(function(b){return "• "+b;}).join("\n")+
        (s.takeaway?"\nKEY TAKEAWAY: "+s.takeaway:"");
    }).join("\n\n");
  }
  function findByIdOrName(kind,id,possibleNames){
    var arr=data[kind]||[];
    return arr.find(function(x){return x.id===id;}) ||
      arr.find(function(x){return (possibleNames||[]).some(function(n){return String(x.name||"").trim().toLowerCase()===n.toLowerCase();});});
  }
  function upsert(kind,id,fields,opts){
    opts=opts||{};
    if(!Array.isArray(data[kind])) data[kind]=[];
    if(!Array.isArray(data._editorDeletes)) data._editorDeletes=[];
    if(!data._editorOverrides||typeof data._editorOverrides!=="object")data._editorOverrides={};
    if(data._editorDeletes.includes(kind+":"+id))return null;
    var item=findByIdOrName(kind,id,opts.aliases||[]);
    if(item && data._editorDeletes.includes(kind+":"+item.id))return null;
    if(!item){item={id:id};data[kind].push(item);}
    var edits=data._editorOverrides[kind+":"+item.id]||{};
    Object.keys(fields||{}).forEach(function(key){
      if(!Object.prototype.hasOwnProperty.call(edits,key))item[key]=fields[key];
    });
    if(opts.note && !Object.prototype.hasOwnProperty.call(edits,"secret")){
      var tag="[Campaign canon note — October 28, 2026]";
      var old=String(item.secret||"");
      if(!old.includes(opts.note))item.secret=(old+"\n\n"+tag+"\n"+opts.note).trim();
    }
    if(opts.connections && !Object.prototype.hasOwnProperty.call(edits,"connections")){
      if(!Array.isArray(item.connections))item.connections=[];
      opts.connections.forEach(function(c){
        if(!item.connections.some(function(existing){
          return existing.targetType===c.targetType && existing.targetId===c.targetId && existing.relation===c.relation;
        }))item.connections.push(c);
      });
    }
    return item;
  }
  function event(id,order,title,summary,sections,connections,status){
    var fields={
      name:"Arc 3 — "+String(order).padStart(2,"0")+". "+title,
      summary:summary,arcNumber:3,eventOrder:order,parentThread:"arc_alcatraz",
      arc:arc,status:status||"Canon",outline:sections,
      secret:outlineText(sections),
      connections:connections||[]
    };
    return upsert("threads",id,fields);
  }
  // Upgrade only exact superseded canon phrases within existing saved records.
  // This preserves unrelated user prose, manually uploaded portraits, and field edits.
  function reconcileLegacyFields(){
    var oldAndNew=[
      ["The benefactor’s actual identity remains UNDECIDED.","The benefactor is a willing servant of the demon and a respected record label executive; his personal name and label are still undecided."],
      ["an honest Intention Engine accident creates a large firebreathing dragon. Luma sends drones to surround it with magical netting and shrink it to toy size. Her callback: “That one should probably stay here.”","an honest Intention Engine accident brings to life an Onryō-inspired spectral construct imagined by Ren Nakamura. Luma contains it with her security systems; precise effects and dialogue remain open."],
      ["Later, an honest accident produces the full-sized firebreathing dragon that Luma contains and shrinks.","Later, a genuine accident manifests an Onryō-inspired spectral construct from attendee Ren Nakamura's imagination; Luma contains it."],
      ["Concerned by Luma's dragon response","Concerned by Luma's impressive response to Ren's accidental spectral manifestation"],
      ["Responds heroically to an accidental Intention Engine dragon using drones, magical netting and shrinking containment.","Responds heroically to a spectral construct unintentionally manifested from folklore enthusiast Ren Nakamura's imagination by the Intention Engine; security systems contain the threat."],
      ["Its ending brings the accidental dragon and Daniel's invitation.","Its ending brings Ren's accidental folklore-inspired spectral manifestation and Daniel's invitation."],
      ["Arc 2 — 03. Luma’s Presentation & Dragon Accident","Arc 2 — 03. Luma’s Presentation & Ren’s Folklore Manifestation"],
      ["At the end of her presentation, the Intention Engine accidentally produces a large firebreathing dragon that threatens the festival.","At the end of her presentation, the Intention Engine accidentally produces an Onryō-inspired spectral construct from festival attendee Ren Nakamura's imagination. The construct threatens the festival."],
      ["Luma calmly directs people behind barriers, deploys drones, surrounds the dragon with magical netting, and reduces it to toy size.","Luma directs the audience to safety and uses security systems to contain the construct; precise containment effects remain open."],
      ["She looks back to the crowd: “That one should probably stay here.”","Luma's rescue wins public confidence; no specific callback line is locked."],
      ["true-name redemption and combat remain possible","pacification via the four-tablet Rite of Remembrance or combat remain possible"],
      ["a spirit whose own forgotten name may be the key to redemption","a Keeper spirit that can be pacified through Birdie’s lullaby and a four-tablet memory rite"],
      ["The party can fight the manifested entity or investigate its ORIGINAL First Tongue name, lost across generations.","The party can fight the manifested entity or activate the four-tablet Rite of Remembrance."],
      ["The Keeper once safeguarded the departed's memories, before Alcatraz prison suffering corrupted it; learning its name is an act of recognition, not simply a magic password.","The Keeper once safeguarded the departed’s memories, before Alcatraz prison suffering corrupted it; Birdie’s inherited lullaby preserves a path toward remembrance."],
      ["The full way that empathy, name-recovery and possible combat interlock is deliberately still in development; do not assume a guaranteed redemption result.","The rite’s tablet and memory-sacrifice mechanics are established; Keeper combat abilities remain undeveloped."],
      ["Recovery of the original name across Arc 3's research is a potential redemption path: speaking it is an act of remembrance rather than a mechanical password.","Pacification requires the Rite of Remembrance: arrange four Kethil tablets in Birdie’s lullaby order, then voluntarily sacrifice cherished memories."],
      ["rediscovery of its TRUE First Tongue name could release its anger. Exact mechanics remain under development.","the four-tablet Rite of Remembrance offers a chance to pacify it through voluntary memory sacrifice. Combat mechanics remain undeveloped."],
      ["redemption via name, compassion and restoration of identity is being developed.","pacification through the four-tablet Rite of Remembrance is possible."],
      ["name-redemption endgame","Rite of Remembrance endgame"],
      ["Forgotten true name","Lullaby and Kethil tablets"],
      ["True-name mystery","Forgotten purpose"]
    ];
    function patch(value){
      if(typeof value==="string"){
        var result=value;
        oldAndNew.forEach(function(pair){if(result.indexOf(pair[0])>=0)result=result.split(pair[0]).join(pair[1]);});
        return result;
      }
      if(Array.isArray(value))return value.map(patch);
      if(value&&typeof value==="object"){
        var out={};
        Object.keys(value).forEach(function(k){out[k]=patch(value[k]);});
        return out;
      }
      return value;
    }
    ["threads","lore","npcs","villains","locations"].forEach(function(kind){
      (data[kind]||[]).forEach(function(item){
        ["name","summary","secret","campaignNotes","outline","goal","method","weakness","connections"].forEach(function(field){
          if(Object.prototype.hasOwnProperty.call(item,field))item[field]=patch(item[field]);
        });
      });
    });
    if(data._editorOverrides){
      Object.keys(data._editorOverrides).forEach(function(key){
        data._editorOverrides[key]=patch(data._editorOverrides[key]);
      });
    }
  }

  function apply(){
    if(data._arc3CanonVersion===VERSION) return;
    for(var kind of ["districts","locations","npcs","villains","lore","threads"])
      if(!Array.isArray(data[kind]))data[kind]=[];

    var anya=(data.npcs||[]).find(function(n){return n.id==="anya_vox" || /^anya\b/i.test(n.name||"")&&!/spirit/i.test(n.name||"");});
    var birdie=(data.npcs||[]).find(function(n){return /^birdie$/i.test(n.name||"") || n.id==="birdie";});
    var avalon=(data.locations||[]).find(function(l){return /avalon house/i.test(l.name||"");});
    var alcatraz=(data.locations||[]).find(function(l){return /^alcatraz(?: island)?$/i.test(l.name||"") || l.id==="alcatraz";});
    var invent=(data.npcs||[]).find(function(n){return /kindred engine/i.test([n.summary,n.occupation,n.secret].join(" ")) && /invent|creat|built|designer/i.test([n.summary,n.occupation,n.secret].join(" "));});
    var bid=birdie?birdie.id:"birdie", aid=anya?anya.id:"anya_vox";
    var avID=avalon?avalon.id:"avalon_house", alcID=alcatraz?alcatraz.id:"alcatraz";

    // Original-Fog community: a living culture, not merely an occult clue source.
    upsert("npcs",bid,{
      name:"Birdie",status:"Canon",
      summary:"Haight-Ashbury musician and Avalon House matriarch; an openly Indigenous elder descended from the Fog's original inhabitants and a beloved lifelong musical mentor to Anya.",
      beliefs:"The stories and people of the original Fog community deserve to endure. She openly cherishes her heritage; memory, art, chosen family, and service to the community matter to her."
    },{
      note:"Birdie is open about her Indigenous Fog heritage; it is not a secret or a late twist. She knew and loved Anya as a longtime musical mentor. In Arc 1, Birdie, Anya and Elara are introduced at Avalon House; the Bard can connect naturally through music, with performance details and exact session placement left to the DM. Birdie shares the old lullaby with Anya; its chorus is: "+lullabyEnglish.join(" / ")+". Anya dies offsite during the Arc 2 Luma finale, not in Arc 3. Early in Arc 3, BEFORE the Kindred Engine inventor asks the party for help, Birdie grieves Anya at Avalon House and shares precisely the following inherited story without ever mentioning Alcatraz:\n\n“"+birdieWords.join("”\n\n“")+"”\n\nThe scene should be personal grief, not an obvious quest hook. The form of any memorial gathering is still undecided. Do NOT replace Birdie's existing approved character art; a respectful visual revision is only being considered.",
      connections:[link("npcs",aid,"Lifelong musical mentor","Birdie loved Anya and grieves her death in Arc 2."),link("threads","arc3_birdie","Opening scene","Shares her grandmother's Keeper of Memories story.")]
    });

    if(avalon)upsert("locations",avID,{},{
      note:"Arc 3 opens with a personal conversation here between Birdie and the party, after Anya's Arc 2 death and before the Kindred Engine inventor's request for help. Birdie sings or recalls the familiar inherited lullaby and offers her grandmother's Keeper of Memories story without mentioning Alcatraz.",
      connections:[link("threads","arc3_birdie","Arc 3 opening")]
    });

    // Named locations; independently operated businesses are ordinary and not complicit.
    upsert("locations","gilded_gull",{
      name:"The Gilded Gull",district:"waterfront",status:"Canon",
      summary:"A fictional, prestigious fine-dining restaurant on a pier at Fisherman's Wharf: emerald velvet, polished brass, broad bay windows, theatrical desserts, and refined waterfront hospitality.",
      secret:"The Kindred Engine inventor's missing wife and her sister make this their traditional sisters' date restaurant. Both dined here on their disappearance day, three days before the inventor contacts the party. Staff do NOT know the sisters by name and are curt, busy, and impatient because this is a crowded high-end restaurant, NOT because they are covering up anything supernatural. An observant or persistent investigation establishes the sisters ate here. A server recalls the sisters asking for directions to a quieter waterfront walk and briefly meeting an unidentified person outside; all three departed in the same direction. DM ONLY: The unidentified third person WAS the captain of the independent Alcatraz tour boat, whom the party encounters later at the working pier. The server does not know this identity; the party should have an opportunity to connect the person seen outside with the captain. DM ONLY: The Keeper has been manipulating the captain's memories, so his failure to remember the sisters is genuine rather than a deliberate lie. He has no idea that anything is wrong with his memory; he notices no missing time or unexplained gaps. Exactly what he did during the missing interval, whether the sisters boarded his boat, and the extent of the Keeper's influence remain undecided. The restaurant's name comes from a gilded seabird stone carving uncovered when the pier was constructed; weathered First Tongue script beneath it reads 'Mi Ti Vei Mer' — 'I will remember you.' The staff do not understand the old inscription. The carving is early First Tongue foreshadowing, not proof of wrongdoing.",
      connections:[link("threads","arc3_gilded_gull","Investigation stop"),link("lore","arc3_first_tongue","First Tongue inscription")]
    });

    upsert("locations","alcatraz_tour_dock",{
      name:"Independent Alcatraz Tours Dock",district:"waterfront",status:"Canon",
      summary:"A quieter working dock near Fisherman's Wharf, with independent mom-and-pop excursion boats and an 'Alcatraz Tours' sign beside a 10–15-passenger captain-operated vessel.",
      secret:"After following the Gilded Gull lead, the party finds an intact bracelet decorated with Kindred animal patterns resting near a mooring post in front of the Alcatraz Tours sign. It belongs to the inventor's missing wife, but its placement does not demonstrate a violent struggle or confirm who left it. DM ONLY: This is the same captain seen leaving The Gilded Gull with the sisters. He keeps NO ticket ledger or passenger manifest and claims not to remember the sisters or their boarding. The Keeper has been manipulating his memories; he genuinely cannot remember the encounter. He is not knowingly lying, and is completely unaware that his memories have been altered; from his perspective, nothing is wrong. What happened after leaving the restaurant, and whether the sisters boarded his boat, remain unresolved. On learning they are missing, he offers to take the party to Alcatraz to help investigate. They encounter him at dusk, reach Alcatraz around nightfall, and he WAITS aboard his boat at the dock while the party explores. Do NOT assert the sisters boarded his boat or that the captain is involved in disappearances.",
      connections:[link("threads","arc3_docks","Physical evidence and boat lead"),link("locations",alcID,"Tour destination")]
    });

    if(alcatraz)upsert("locations",alcID,{},{
      note:"Arc 3: party arrives near nightfall with a helpful independent excursion captain, who remains waiting aboard his boat. No staff or tourists greet them: the island and cellhouse feel eerily empty. They hear a detached, emotionless voice repeating 'Please help me' IN ORDINARY LANGUAGE; an empty solitary cell marks their first Identity Fracture. Their first Forgotten victim is an unfamiliar living person, not either missing sister. The spiritual origin of the corrupted Keeper of Memories and its Rite of Remembrance are DM-only. The final ritual uses four physical Kethil tablets in the order of Birdie’s lullaby, then voluntary sacrifice of cherished memories. Keeper combat abilities remain developing.",
      connections:[link("threads","arc_alcatraz","Arc 3 setting"),link("villains","villain_entity_alcatraz","Corrupted Keeper")]
    });

    // True First Tongue and Kethil script are fictional Fog heritage, not a real Indigenous language.
    upsert("lore","arc3_first_tongue",{
      name:"First Tongue & Kethil — Arc 3 Research",status:"Canon",
      summary:"The original Fog community's pre–Gold Rush language naturally faded over generations. Arc 3 begins the campaign's important First Tongue clues; the Conservatory has only fragmentary understanding.",
      secret:"Treat the First Tongue as fictional, NOT an actual Ohlone or other living Indigenous language. Its written script is Kethil. The original Fog inhabitants spoke it before the Gold Rush; it was not deliberately suppressed, merely lost through time. The Conservatory can translate the short Gilded Gull inscription 'Mi Ti Vei Mer' as 'I will remember you', but does not have instant mastery of long or difficult First Tongue texts; investigation and living cultural knowledge still provide context. During this research the Conservatory tells the party it has noticed reports of other unexplained missing people, opening the wider Arc 3 investigation. All known disappearances originate along San Francisco's waterfront / Embarcadero, but their individual circumstances, victim backgrounds and last-seen sites differ enough to seem unrelated at first. This general waterfront geography is the discoverable common thread; there is no immediately apparent shared cause or Alcatraz connection. The Conservatory has a handful of documented cases the party can examine: individual reports with specific circumstances, not just vague suspicions. One confirmed case is Elias Navarro, 43, a waterfront maintenance electrician missing for 12 days when his dossier is reviewed after a Pier 7 lighting inspection. Details for other cases, and how the Scholars obtained their reports, remain to be developed collaboratively. At The Gilded Gull the gilded bird carries 'Mi Ti Vei Mer' ('I will remember you'). On Alcatraz the victims of the entity unconsciously repeat First Tongue sounds or phrases such as 'Mi ti mer'; they are not fluent. During Alcatraz exploration First Tongue is HEARD only from victims, never as the entity's audible voice or as a disembodied corridor whisper. Another established phrase is 'Nor nam mal', meaning exactly 'forgotten through binding, and forgotten', expressed as a compact Kethil insignia on the entity's left chest; this is a descriptive insignia, NOT a password or required true-name clue. The pacification path is the Rite of Remembrance, using the lullaby and four Kethil tablets.",
      connections:[link("locations","gilded_gull","Written clue"),link("npcs","entity_alcatraz","Chest Kethil insignia"),link("lore","arc3_keeper_history","Keeper history")]
    });
    upsert("lore","arc3_keeper_history",{
      name:"Keeper of Memories — The Forgotten Guardian",status:"Canon",
      summary:"Long before Alcatraz was a prison, the Keeper of Memories safeguarded the memories of the departed as they journeyed west.",
      secret:"Original purpose: Keeper of Memories, NOT simply guardian of the dead. Living descendants of the original Fog inhabitants preserve stories and an inherited lullaby about the Keeper. The prison's generations of isolation, dehumanization, cruelty and abandonment corrupted it. Having forgotten its former role, it now strips living visitors of their memories and will. Pacification requires the Rite of Remembrance: arrange four Kethil tablets in the lullaby’s order, then voluntarily sacrifice cherished memories to strengthen a pacification roll. If pacified, all sacrificed memories return; if killed, they are lost permanently. Detailed combat abilities remain undeveloped. Keep real Ohlone history and beliefs distinct from invented Fog customs; no fictionalized sacred ceremony is canon.",
      connections:[link("npcs",bid,"Living storykeeper"),link("lore","arc3_first_tongue","Lullaby and Kethil tablets"),link("villains","villain_entity_alcatraz","Corrupted form")]
    });
    upsert("lore","arc3_identity_fracture",{
      name:"Identity Fracture — Alcatraz",status:"Canon",
      summary:"The Keeper's corruption erases recognition, selfhood and human ties. The earliest memory lapse affects one character with the lowest Mereth score on the DM-managed hidden Current tracker.",
      secret:"The first fracture happens inside an empty solitary cell after an eerily emotionless 'Please help me' voice stops. Secretly select ONE player character with the lowest Mereth Current score (not lowest total across five Currents). No saving throw or damage for this minor first event. That character briefly forgets the voice and why they entered the cell; the other PCs remember. Greater losses of identity, relationships and purpose may develop over time; escalation mechanics and tie breakers remain unassigned. The Forgotten appear alive, nonhostile, vacant and largely without will. A first unfamiliar man can speak disconnected fragments, unconsciously repeat 'Mi ti mer', follow simple instructions, but stops near the prison exit. If forcibly carried or pushed out, he struggles with genuine psychological terror; there is no literal invisible barrier.",
      connections:[link("threads","arc3_empty_cell","First fracture"),link("threads","arc3_first_forgotten","First victim")]
    });
    upsert("lore","xev_awakening",{
      name:"Nexev “Xev” Terces — Awakening",status:"Canon",
      summary:"Marlow hires Xev once to open a magically locked Feywild-crossing door. She disobeys the instruction not to open it, sees the Feywild and awakens to the Fog after magical backlash.",
      secret:"Arc 1/player-character backstory. Marlow is a ONE-TIME Awakening contact, not Xev's recurring employer. Marlow insists that Xev UNLOCK but NOT OPEN the enchanted door: she will know it is unlocked when light shines from underneath. His real reason is to stop her from witnessing the Ferryman enter San Francisco, NOT concern for a magical backlash. Curious Xev opens it anyway, sees the Feywild, and the magic blasts her backward INTO a barrel and knocks her unconscious, hiding her in the barrel. While she is unconscious the Ferryman crosses into San Francisco unseen by her. On waking, the door is closed and the Feywild crossing is no longer open. The experience Awakens Xev, making the Fog perceptible to her. Do not claim she saw the Ferryman enter.",
      connections:[link("npcs","marlow","One-time employer"),link("villains","villain_ferryman","Unwitnessed arrival")]
    });
    upsert("lore","guerrilla_grafters",{
      name:"Guerrilla Grafters (future Fog concept)",status:"Idea",
      summary:"A separate future city-worldbuilding concept inspired by San Francisco's clandestine community grafting fruit-bearing branches onto ornamental street trees.",
      secret:"Parked for later collaborative development. The user wants the Guerrilla Grafters in the campaign but has NOT decided whether they are ordinary Surface activists, a Fog collective, magical, or linked to any Current. No connection to Arc 3 or Alcatraz; do not invent one."
    });

    // Approved Arc 3 Conservatory dossier.
    upsert("npcs","elias_navarro",{
      name:"Elias Navarro",age:"43",occupation:"Waterfront maintenance electrician",status:"Canon",
      summary:"Approved Arc 3 missing-person case. Last seen inspecting faulty lights at Pier 7 along the Embarcadero; missing for twelve days as of the Conservatory case file.",
      secret:"CONSERVATORY CASE FILE — ELIAS NAVARRO (approved canon): 43-year-old waterfront maintenance electrician. Disappeared during a check of faulty pier lights at Pier 7, twelve days before the dossier is read. His work tools were abandoned beside an open electrical panel, and his truck remained parked nearby. Authorities suspect he fell into the bay, but no body has been recovered. His supervisor insists he would never abandon an energized electrical panel. No confirmed explanation or fate; do NOT prematurely establish that Elias was transported to Alcatraz or became one of the Forgotten.",
      connections:[link("threads","arc3_case_elias_navarro","Conservatory case file"),link("threads","arc3_missing_pattern","Waterfront disappearance")]
    });

    upsert("npcs","entity_alcatraz",{
      name:"The Entity of Alcatraz (Corrupted Keeper of Memories)",
      portrait:"assets/portraits/entity-alcatraz.webp",
      location:alcID,ancestry:"Ancient Fog spirit",age:"Ancient",
      occupation:"Former Keeper of Memories; current supernatural presence within Alcatraz",
      appearance:"Approved full-body campaign cartoon/graphic-novel design: unnaturally tall, thin, elongated humanoid. Smooth bald featureless porcelain-white head with deep hollow black eye sockets; no nose or mouth. Smooth long white fingers, no claws. Faded/desaturated orange prison jumpsuit with frayed fabric dissolving into spectral wisps. Compact interlocked Kethil insignia at left chest represents 'Nor nam mal' ('forgotten through binding, and forgotten'); it subtly darkens/glows when activated. Stands perfectly upright and unnaturally still; walks when calm, levitates as anger rises. Standard dark-navy background with electric-cyan geometric triangles. Approved portrait file: assets/portraits/entity-alcatraz.webp.",
      personality:"Ancient, intelligent, articulate and observant; initially confused and curious after the sisters remember one another, then skeptical, angry and increasingly aggressive when shown human compassion.",
      summary:"A once-revered pre-prison Keeper of Memories whose own name and role were lost when generations of prisoner suffering warped it into a taker of identity.",
      secret:"DM ONLY: Originally cared for the memories of the departed journeying west; its former purpose survives in Birdie’s inherited lullaby, though the Keeper itself has forgotten its role. It steals living visitors' memories and keeps the Forgotten on Alcatraz. It has also been manipulating the independent Alcatraz tour captain's memories: he was the person seen leaving The Gilded Gull with the missing sisters but genuinely does not recall them. The details of what the captain did afterward are unresolved. It becomes physically visible AFTER the party finds both missing sisters and helps restore their memories through the Kindred bracelet, stories of the inventor/husband and their shared history. Initially curious and confused, the entity then challenges the party's belief in compassion, recounts prison cruelty and grows hostile and aggressive. Players can fight it or complete the Rite of Remembrance with four Kethil tablets and voluntary memory sacrifices. The ritual mechanics are established; its combat stats and attacks are not. Official NPC portrait uses assets/portraits/entity-alcatraz.webp.",
      status:"Canon",
      connections:[link("lore","arc3_keeper_history","Original purpose"),link("lore","arc3_first_tongue","Forgotten name and chest script"),link("threads","arc3_sisters_keeper","Manifestation")]
    });
    upsert("villains","villain_entity_alcatraz",{
      name:"The Entity of Alcatraz",npcId:"entity_alcatraz",arc:arc,
      summary:"The corrupted ancient Keeper of Memories, taking identities rather than safeguarding the departed.",
      goal:"At present, impose the isolation and emptiness it believes define humanity; its former compassionate role is forgotten.",
      method:"Memory theft, Identity Fracture, disembodied voice, control over the Forgotten, terror at leaving the prison, eventual physical manifestation.",
      weakness:"Human connection can restore memory. The four-tablet Rite of Remembrance and voluntary memory sacrifices create a chance to pacify it; its combat mechanics remain undeveloped.",
      secret:"White mask-like face, hollow eyes, long limbs, spectral orange prison jumpsuit and subtle Kethil chest insignia (Nor nam mal). First seen physically after the missing sisters begin remembering each other. Its initial curiosity escalates to skepticism, hostility and aggression. Destruction remains possible, but the established Rite of Remembrance offers a pacification path via the lullaby and voluntary sacrifice of memories. The victims, not the entity, are the audible source of First Tongue utterances within Alcatraz.",
      status:"Developing",
      connections:[link("npcs","entity_alcatraz","NPC form"),link("lore","arc3_keeper_history","Original identity")]
    });

    if(invent)upsert("npcs",invent.id,{},{
      note:"Arc 3: His WIFE and her SISTER have both been missing for three days. Wife and sister went on a sisters' date at Fisherman's Wharf, regularly dining at The Gilded Gull. He seeks the party's help because he remembers the extraordinary Kindred animals of two party members from the Engine encounter, NOT because their disappearance has any connection to his invention. His name, wife's name and sister-in-law's name are not being invented here.",
      connections:[link("threads","arc3_inventor","Desperate request"),link("locations","gilded_gull","Wife's traditional restaurant")]
    });

    // Arc 3 is a new multi-event outline in the SAME Story Threads directory as Arcs 1 and 2.
    var events=[
      ["arc3_birdie","Birdie Remembers Anya"],
      ["arc3_inventor","A Desperate Request"],
      ["arc3_gilded_gull","Dinner at The Gilded Gull"],
      ["arc3_missing_pattern","A Wider Pattern"],
      ["arc3_docks","The Bracelet & the Tour Dock"],
      ["arc3_alcatraz_arrival","The Crossing at Dusk"],
      ["arc3_empty_cell","The Voice and First Fracture"],
      ["arc3_first_forgotten","The Forgotten Stranger"],
      ["arc3_sisters_keeper","The Sisters and the Keeper"],
      ["arc3_rite","The Rite of Remembrance"]
    ];
    upsert("threads","arc_alcatraz",{
      name:"Arc 3 — Overview: The Dead Don't Leave",arc:arc,arcNumber:3,eventOrder:0,
      status:"Developing",
      summary:"After Anya’s Arc 2 death, Birdie’s inherited lullaby foreshadows a waterfront disappearance mystery and the four-tablet Rite of Remembrance that can pacify the corrupted Keeper of Memories on Alcatraz.",
      outline:events.map(function(e,i){return section(String(i+1)+". "+e[1],[
        i===0?"Birdie shares her personal grief-driven story about the Keeper; she never mentions Alcatraz.":
        i===1?"The Kindred Engine inventor asks the party to find his wife and sister-in-law, missing for three days.":
        i===2?"Question the busy Gilded Gull staff, confirm dinner, find a third-person lead and the Kethil bird inscription.":
        i===3?"The Conservatory translates the Gilded Gull inscription and shares apparently unrelated waterfront disappearance dossiers, including the confirmed Pier 7 case of Elias Navarro.":
        i===4?"Find the intact Kindred bracelet by an Alcatraz Tours sign and meet an independent boat captain.":
        i===5?"The captain brings the party at nightfall and waits aboard; the island appears deserted.":
        i===6?"A flat 'Please help me' leads to an empty cell and a one-character Mereth-based memory lapse.":
        i===7?"Meet an unfamiliar living but hollowed victim, who echoes First Tongue fragments and cannot willingly leave.":
        i===8?"Restore the sisters through their bracelet and personal stories; the Keeper manifests, and players may fight or try to pacify it.":
        "Arrange four Kethil tablets by Birdie’s lullaby, then sacrifice cherished memories to strengthen the Keeper’s pacification roll on initiative count 20."
      ],i===3?"Outline / placement unresolved":"See linked event for confirmed beats.");}),
      connections:events.map(function(e,i){return link("threads",e[0],"Event "+(i+1));})
        .concat([link("lore","arc3_keeper_history","Underlying mystery"),link("lore","arc3_first_tongue","Investigative language")])
    },{
      note:"Keep this as a developing outline. The disappearance of OTHER people is part of the agreed broader mystery, but exact new evidence, pace and event placement are still open. The Gilded Gull clue now points toward Alcatraz earlier than the first rough pitch did. Do not reintroduce an invented passenger ledger, force a dock camera, make the captain leave, or shift Anya's death out of Arc 2."
    });
    event("arc3_birdie",1,"Birdie Remembers Anya",
      "After Anya dies in Arc 2, the party reconnects with her former mentor Birdie, recalling the lullaby first shared with Anya and Elara in Arc 1.",
      [section("Anya's absence",["Birdie is an openly Indigenous elder and beloved Haight-Ashbury musical mentor of Anya, NOT a secret mystic.","The party met Birdie, Anya and Elara through the music community at Avalon House in Arc 1; the Bard may have connected with them, but no required performance is scripted.","Birdie grieves Anya’s Arc 2 death and revisits her grandmother’s old lullaby: "+lullabyEnglish.join(" / "),"She also turns to an inherited Keeper of Memories story."],"Allow the emotional scene to stand on its own."),
       section("Birdie's words — preserve exactly",birdieWords,"No mention of Alcatraz or obvious quest hook."),
       section("Open question",["Why the party visits Avalon House—memorial gathering or informal visit—has not been decided."],"Do not invent a mandatory memorial.")],
      [link("npcs",bid,"Storyteller"),link("locations",avID,"Setting"),link("lore","arc3_keeper_history","Foreshadowing")]);
    event("arc3_inventor",2,"A Desperate Request",
      "The Kindred Engine inventor asks the party for help locating both his wife and her sister, missing for three days.",
      [section("Personal hook",["The sisters went out together on a sisters' date at Fisherman's Wharf.","The inventor remembers that two PCs received unusually rare Kindred animals, so he seeks them out as capable helpers.","He knows the sisters habitually visit The Gilded Gull; their exact itinerary is unknown.","The Kindred Engine is NOT involved in the disappearance."],"The restaurant is their first tangible lead.")],
      [link("locations","gilded_gull","Next lead")]);
    event("arc3_gilded_gull",3,"Dinner at The Gilded Gull",
      "The party confirms that both missing women ate at the prestigious pier restaurant and uncovers two understated leads.",
      [section("High-end red herring",["Polished but rushed staff are short with investigators because they are busy, not because they are involved.","Staff do not personally know the sisters by name; the party must provide descriptions or investigate persistently.","Both sisters did dine at The Gilded Gull the day they vanished."],"Misread inconvenience as suspicious concealment if the players choose."),
       section("Last sighting",["The sisters asked about a quieter stretch of waterfront.","Outside, the sisters were approached by a man who is secretly the independent Alcatraz tour boat captain (DM ONLY); the server does not know his name or identity.","All three departed together toward the working piers. DM ONLY: The Keeper has manipulated the captain's memories. His inability to recall the encounter is genuine, but what happened after the three departed remains unresolved."],"Follow the waterfront. Players can later recognize the captain as the third person if they make the connection; do not disclose his identity early."),
       section("First Tongue foreshadowing",["The restaurant takes its name from an old gilded seabird carving recovered during pier construction.","Below the carving: Kethil inscription 'Mi Ti Vei Mer' meaning 'I will remember you'.","The restaurant is an ordinary business; staff know nothing about the inscription's significance."],"Conservatory Scholars can translate this short phrase and notice other missing-person reports; the party may connect the translated words to Birdie’s lullaby.")],
      [link("locations","gilded_gull","Restaurant"),link("locations","alcatraz_tour_dock","Waterfront route"),link("lore","arc3_first_tongue","Inscription")]);
    event("arc3_missing_pattern",4,"A Wider Pattern",
      "While researching the Gilded Gull Kethil inscription, the Conservatory translates its short phrase and alerts the party to reports of other unexplained disappearances.",
      [section("Conservatory discovery",["The party consults the Conservatory about the Kethil inscription on The Gilded Gull seabird carving.","Scholars translate the short inscription Mi Ti Vei Mer as I will remember you, giving the players an opportunity to connect it with Birdie’s previously heard lullaby.","During the same research, the Conservatory alerts the party to reports of other unexplained disappearances; the sisters are not isolated victims.","The Conservatory has a handful of documented case reports for the party to examine. All missing people were last seen along San Francisco's waterfront / Embarcadero, though at different specific sites and under varying circumstances, making them seem unrelated at first. The waterfront is a discoverable geographical pattern; the cases do not immediately point to Alcatraz. The confirmed Elias Navarro dossier concerns a Pier 7 maintenance electrician missing for twelve days. Other individual cases and how the Scholars obtained their records remain undecided."],"The wider mystery is introduced by the Conservatory, not missing-person posters at the Wharf."),section("Approved case: Elias Navarro",["Elias Navarro, 43, waterfront maintenance electrician, disappeared while checking faulty Pier 7 lighting; he has been missing for 12 days as of the Conservatory report.","His tools remain beside an open electrical panel; his truck was still parked nearby.","Authorities suspect he fell into the bay, but no body was recovered. His supervisor says Elias would never leave an energized electrical panel unattended.","Elias’s actual fate remains unresolved."],"Individual approved case file is linked below."),section("DM continuity",["The third person seen leaving the Gilded Gull with the sisters is the independent tour captain.","The Keeper has altered the captain’s memories. He sincerely does not remember the sisters and has no idea his memories are missing.","It remains unknown whether he ferried the sisters to Alcatraz."],"Do not prematurely reveal the captain’s role or prove the route to the island.")],
      [link("lore","arc3_first_tongue","Kethil research"),link("locations","gilded_gull","Translated inscription"),link("npcs","elias_navarro","Documented missing person"),link("threads","arc3_case_elias_navarro","Approved case file")],"Developing");
    var eliasCaseSections=[
      section("Incident report",[
        "Name: Elias Navarro; age 43; waterfront maintenance electrician.",
        "Last seen inspecting faulty lights at Pier 7 on the Embarcadero.",
        "Missing for twelve days at the time this dossier is reviewed.",
        "Tools abandoned beside an open electrical panel; work truck still parked nearby."
      ],"A routine maintenance job became an unexplained disappearance."),
      section("Findings and leads",[
        "Authorities suspect he fell into the bay, but no body was recovered.",
        "His supervisor strongly disputes that explanation: Elias would never knowingly leave an energized electrical panel unattended.",
        "No confirmed account of what happened after his last sighting."
      ],"The unsafe open panel is the strongest reason to investigate further."),
      section("GM continuity",[
        "Approved case, part of the series of waterfront disappearances presented by the Conservatory.",
        "His fate is not yet determined; do not assume he is one of the Forgotten until decided."
      ],"Keep the eventual explanation open.")
    ];
    upsert("threads","arc3_case_elias_navarro",{
      name:"Arc 3 — Case File: Elias Navarro",arc:arc,arcNumber:3,
      parentThread:"arc3_missing_pattern",eventOrder:4.1,status:"Canon",
      summary:"Pier 7 waterfront electrician, 43, missing for twelve days. His tools and truck were abandoned during a routine lighting inspection.",
      outline:eliasCaseSections,secret:outlineText(eliasCaseSections),
      connections:[link("npcs","elias_navarro","Subject"),link("threads","arc3_missing_pattern","Conservatory records")]
    });
    event("arc3_docks",5,"The Bracelet & the Tour Dock",
      "A Kindred-pattern bracelet points to the tour dock; the captain offers a ride but cannot identify the sisters.",
      [section("Evidence",["Follow the waterfront route to a quieter working pier.","Find the inventor's wife's distinctive Kindred-animal-pattern bracelet INTACT by a mooring post immediately in front of an 'Alcatraz Tours' sign.","The bracelet is not broken and there are no confirmed signs of violence; the captain's 10–15-passenger boat is nearby."],"Strong pointer toward Alcatraz, but NOT proof the sisters boarded the boat."),
       section("Independent captain",["The neighborhood has mom-and-pop Alcatraz boat operators, not formal manifests.","The captain claims he cannot recall the sisters and keeps NO ledger, although he is secretly the third person seen departing the restaurant with them. DM ONLY: His memory has been manipulated by the Keeper; he is genuinely unable to recall the sisters, not intentionally deceptive, and has no awareness that anything is wrong with his memory.","He offers to bring the party across to help; party finds him at DUSK.","He WILL WAIT aboard at Alcatraz while they investigate."],"Their apparent escape route remains available.")],
      [link("locations","alcatraz_tour_dock","Dock"),link("locations",alcID,"Destination")]);
    event("arc3_alcatraz_arrival",6,"The Crossing at Dusk",
      "The party arrives on Alcatraz around nightfall and finds the island deserted while the captain waits on his boat.",
      [section("Arrival tone",["A dusk departure means arrival as darkness gathers.","No visitor, guide or employee greets the party; the grounds and prison seem completely abandoned.","The captain ties up and waits at his vessel. Do not have him quietly depart."],"The horror comes from the island, not from an artificially vanished escape boat."),
       section("Exploration",["The party explores the old prison for a while before meeting any living missing people.","No immediate obvious attack or entity manifestation."],"Build suspense before the first Forgotten person.")],
      [link("locations",alcID,"Setting")]);
    event("arc3_empty_cell",7,"The Voice and First Fracture",
      "An emotionless 'Please help me' leads into an empty solitary cell and the first hidden Mereth-based memory lapse.",
      [section("The empty cell",["An eerie voice repeats 'Please help me' in ordinary English, flatly and without any fear.","Following it leads to an empty solitary cell. The voice stops as the party enters.","Do NOT use disembodied First Tongue whispers here."],"No victim is visible."),
       section("DM-hidden Current mechanic",["Consult the unofficial DM-managed Current tracker.","Target exactly ONE character with the LOWEST MERETH score, not the lowest total Current score.","No save for this first tiny fracture. The selected PC cannot remember the voice or why they entered; the others remember normally."],"Subtle doubt before the loss of identity escalates.")],
      [link("lore","arc3_identity_fracture","Mechanic"),link("locations",alcID,"Setting")]);
    event("arc3_first_forgotten",8,"The Forgotten Stranger",
      "The first victim is an unfamiliar, nonhostile, living person whose identity and will are almost gone.",
      [section("A living shell",["Discover an ordinary-looking middle-aged man sitting motionless, alive but vacant.","He responds only in fragmented speech and unconsciously echoes 'Mi ti mer'; the First Tongue is heard from victims only.","He is NOT one of the missing sisters."],"First direct evidence that missing people may be alive."),
       section("The exit test",["He passively follows simple requests, but near a prison exit stops moving.","If physically carried or forced out, he struggles in intense psychological terror.","Releasing him allows him to retreat and become vacant again. There is no invisible barrier."],"The Keeper's control is psychological rather than a physical wall.")],
      [link("lore","arc3_identity_fracture","Victim behavior"),link("lore","arc3_first_tongue","Echoed phrase")]);
    event("arc3_sisters_keeper",9,"The Sisters and the Keeper",
      "The party reunites the missing sisters; recovering their connection causes the corrupted Keeper to manifest physically.",
      [section("Recovering who they were",["Find the inventor's missing wife and her sister, both alive but deprived of memories.","Use the Kindred-pattern bracelet and stories about the inventor, their shared lives and The Gilded Gull tradition to revive recognition.","When one recognizes the other, the ancient corrupted Keeper manifests in the prison."],"Human connection restores identity and triggers the reveal."),
       section("First manifestation",["Entity's appearance: tall, elongated white featureless face with hollow black eyes, faded orange spectral prison jumpsuit and compact Kethil left-chest insignia 'Nor nam mal'.","It begins intelligent, articulate, confused and CURIOUS, not immediately attacking.","When the party presents compassion as evidence against its view of humanity, it becomes skeptical, challenges them with stories of cruelty, then grows hostile and aggressive."],"An encounter, not an instant forced combat roll."),
       section("Two potential resolutions",["The party may fight and kill the Keeper, or activate the four-tablet Rite of Remembrance during initiative.","The Keeper once safeguarded the departed’s memories; the inherited lullaby and the willingness to sacrifice memories offer a path to pacification.","The rite’s mechanics are established; specific Keeper attacks, stats and combat pacing remain undesigned."],"Mereth remembrance and Saelun human connection meet at the arc’s climax.")],
      [link("npcs","entity_alcatraz","Manifestation"),link("villains","villain_entity_alcatraz","Possible final opponent"),link("lore","arc3_keeper_history","Forgotten purpose")],"Developing");

    var riteOutline=[
      section("Solve the four Kethil tablets",[
        "The tablets are engraved in the 19-character Kethil script. The four lines, in the correct order, are: "+lullabyKethil.join(" / ")+".",
        "They match Birdie’s four-line chorus, introduced with Anya and Elara in Arc 1 and revisited after Anya’s Arc 2 death: "+lullabyEnglish.join(" / ")+".",
        "Moving or placing one tablet costs an action OR a bonus action; each character can position at most two tablets per turn.",
        "Wrong ordering has no backlash or damage. Correct placement of all four activates the rite IMMEDIATELY."
      ],"A clue planted across three arcs becomes a physical table puzzle."),
      section("Voluntary memory sacrifice",[
        "Once activated, a character may relinquish one cherished memory as an action and one as a bonus action, maximum two per character's turn.",
        "Each memory sacrificed since the LAST Keeper roll adds 1d20 to the next pacification roll; previous bonus dice never carry forward.",
        "A failed pacification roll does not restore memories. Players know sacrificing them risks permanent loss, but do not know which ending restores them."
      ],"The players decide what to risk, and every sacrifice has emotional weight."),
      section("Initiative 20: the Keeper's roll",[
        "On initiative count 20, the DM rolls a base 1d20 plus 1d20 for each cherished memory sacrificed SINCE THE PREVIOUS roll.",
        "ONLY a natural 20 on any of those dice pacifies the Keeper. After any failed roll, the next roll begins again with the base 1d20.",
        "Pacification immediately restores ALL sacrificed memories. Killing the Keeper instead leaves every sacrificed memory lost PERMANENTLY.",
        "Keeper combat abilities, stat block and encounter balancing are NOT locked yet."
      ],"The rite offers a difficult but meaningful alternative to killing the Keeper.")
    ];
    upsert("lore","arc3_rite_of_remembrance",{
      name:"Rite of Remembrance — Kethil Tablets and Memory Sacrifice",
      status:"Canon",summary:"Four physically manipulated Kethil tablets keyed to Birdie’s lullaby unlock a voluntary memory-sacrifice pacification ritual.",
      secret:outlineText(riteOutline),
      connections:[link("threads","arc3_rite","Final ritual"),link("npcs",bid,"Lullaby source"),link("villains","villain_entity_alcatraz","Pacification target")]
    });
    event("arc3_rite",10,"The Rite of Remembrance",
      "Players arrange the four Kethil tablets using Birdie’s lullaby, then may sacrifice cherished memories to pacify the Keeper during initiative.",
      riteOutline,[link("lore","arc3_rite_of_remembrance","Full ritual rules"),link("villains","villain_entity_alcatraz","Pacification target"),link("threads","arc3_birdie","Lullaby clue")],"Canon");

    upsert("npcs","ren_nakamura",{
      name:"Ren Nakamura",occupation:"Bookshop employee at The Paper Lantern, Japantown",status:"Canon",
      personality:"Warm, approachable and exuberant about Japanese folklore, especially ghost stories.",
      summary:"Folklore-loving bookshop employee whose imagination accidentally manifests an Onryō-inspired spectral construct through Wonderworks’ Intention Engine.",
      appearance:"Round glasses, slightly messy dark hair, layered green cardigan, casual shirt, satchel with whimsical folklore pins. Lovable bookworm; use the established navy and cyan geometric character-art style. His actual portrait is uploaded manually by the DM; do not set a portrait path.",
      secret:"Arc 2: Attends Wonderworks and accidentally imagines an Onryō-inspired spectral construct into being through the Intention Engine. This is a fictional manifestation, not a real Japanese spiritual ritual. Luma contains it, earning public trust. Ren works at the ordinary Surface bookstore The Paper Lantern in Japantown. No portrait is automatically assigned: the DM is testing manual image upload.",
      connections:[link("threads","arc2_luma_presentation","Festival manifestation"),link("threads","wonderworks_festival","Festival attendee")]
    },{aliases:["Ren Nakamura"]});
    upsert("lore","arc1_birdie_lullaby_setup",{
      name:"Arc 1 — Avalon House: Birdie, Anya, Elara and the Old Lullaby",status:"Canon",
      summary:"A music-community scene at Avalon House introduces Birdie’s mentorship of Anya, Anya and Elara’s relationship, and a family lullaby later key to Arc 3.",
      secret:"Introduce Birdie, Anya and Elara together at Avalon House during Arc 1. The party's Bard provides a natural potential point of connection, but the exact invitation/performance and placement in Arc 1 are OPEN. Birdie's old lullaby, passed down from her grandmother and taught to Anya, includes this chorus: "+lullabyEnglish.join(" / ")+". It should feel like affectionate music, not an obvious puzzle clue. In Arc 2 Anya dies; Arc 3 returns to Birdie, her Keeper story and this same chorus. The four Kethil tablet inscriptions are: "+lullabyKethil.join(" / ")+".",
      connections:[link("npcs",bid,"Mentor and source of lullaby"),link("npcs",aid,"Former student"),link("threads","arc3_birdie","Emotional reprise"),link("threads","arc3_rite","Long-term puzzle payoff")]
    });


    // Arc 4 is a working story outline. Keep unapproved people, locations, and mechanics explicitly open.
    var arc4Origin=[{"title":"Longstanding musical partnership","bullets":["Elara and Anya have been signed to the same Fog record label for years; its celebrated executive is a respected arts patron whose support of musicians and venues earns community trust.","The executive was secretly a willing servant of the demon from the beginning and signed the duo to exploit something extraordinary about their duets. He does not genuinely care for them; the relationship was cultivated for the demon's purposes.","Elara connects to Eshara (expression). Anya connects to Saelun (belonging) and, as Vox Nebulae, understands their supernatural harmonic resonance. Elara remains an unawakened Surface musician, completely unaware of the Fog and Currents; Anya never hints at the truth.","Their duets move audiences toward compassion and togetherness without visible magic: strangers feel understood, isolation briefly lifts, and connection comes naturally."],"takeaway":"The executive was targeting the music of two Currents in harmony, not Elara alone."},{"title":"Tragedy changes the plan","bullets":["Anya dies offsite during the Arc 2 Luma finale. Her addiction-related death is NOT caused by the demon or the executive and is a disruption to their original plan.","The executive gives Elara real time to grieve. After months, he gently suggests that returning to a solo career may help her find herself. He does not immediately push a contract or supernatural solution.","Elara's solo recordings are beautiful but lack the deep audience connection that came from her duets with Anya. The executive notices the missing Saelun resonance and gradually steers her artistic direction.","Eventually the executive exploits her wish to reunite with Anya, promising that reunion may be possible. Specific techniques, recording sessions, and how that promise is made are deliberately undecided."],"takeaway":"Preserve Elara's agency: she believes she is healing through art while someone trusted is manipulating her."}];
    var arc4Events=[{"id":"arc4_birdie","order":1,"title":"Birdie's Concern","summary":"Birdie asks the party to investigate the unsettling change in Elara's new music.","outline":[{"title":"The personal hook","bullets":["Birdie has been Elara and Anya's longtime musical mentor at Avalon House, already introduced to the party in Arc 1 and revisited after Anya's death in Arc 3.","Elara's new solo music is beautiful but provokes grief, anger, regret and loneliness in listeners; unlike the duo's old music, it encourages them to retreat from one another.","Birdie's familiarity with the Fog and the Currents tells her this is more than a change in musical style. She worries about Elara's safety and asks the party to look into it."],"takeaway":"The party gets involved because Birdie cares about Elara, not because of a formal Conservatory assignment."},{"title":"Open details","bullets":["The location of the conversation, Birdie's exact wording, and any evidence she brings have not yet been designed."],"takeaway":"Do not script encounters before the outline is approved."}],"connections":[{"targetType":"npcs","targetId":"birdie","relation":"Requests help"},{"targetType":"npcs","targetId":"elara","relation":"Person of concern"},{"targetType":"lore","targetId":"eshara_duets","relation":"Earlier harmony"}]},{"id":"arc4_listeners","order":2,"title":"The Spreading Isolation","summary":"The party confirms Elara's new music is isolating listeners and reconnects with a guarded but friendly Elara.","outline":[{"title":"First investigative direction","bullets":["Follow reports of other listeners increasingly overwhelmed by their own emotions, withdrawing rather than reaching out. The effect extends beyond one show or one person.","The party establishes that something supernatural is happening through the music; the exact listener cases, locations, and investigative clues remain open.","Elara notices listeners becoming distraught, but honestly believes her work helps them confront emotions they have buried."],"takeaway":"Investigate the spreading effect BEFORE making the record label the principal suspect."},{"title":"Elara's response","bullets":["Elara is genuinely friendly when the party checks in, since they knew Anya. She is protective of her music and record label executive and becomes uncomfortable when either is questioned.","She is not yet aware of the Fog or the magical ritual, nor is she simply possessed. Her emotional reasoning must remain believable."],"takeaway":"Build tension without prematurely turning Elara into an enemy."}],"connections":[{"targetType":"npcs","targetId":"elara","relation":"Performer"},{"targetType":"threads","targetId":"arc4_birdie","relation":"Investigation hook"}]},{"id":"arc4_label","order":3,"title":"The Label and the Monogram","summary":"Suspicion turns toward the record label; the party connects its executive to the Ferryman's Riftstalker buyer from Arc 1.","outline":[{"title":"Second investigative direction","bullets":["After confirming the music's effects, the party uncovers suspicious behavior surrounding Elara's Fog record label and its well-regarded executive.","The party finds the SAME ornate two-letter monogram that appeared on a sealed letter instructing the Ferryman about the Riftstalker purchase in Arc 1.","The matching mark reveals the executive was the mysterious purchaser of the Riftstalker and that the conspiracy dates back to the earlier arc.","The executive's personal name, record label name, monogram initials, exact evidence location and the purpose of the Riftstalker purchase remain undecided."],"takeaway":"Reward recognition of the old letter without inventing final identities or evidence delivery."},{"title":"Hidden truth","bullets":["The executive is a deliberate servant of the demon, not an unwitting intermediary or the demon itself.","They cultivated Elara and Anya's careers for years to exploit their Eshara–Saelun duets, then recalibrated after Anya's death."],"takeaway":"An influential arts patron is revealed as a long-term manipulator."}],"connections":[{"targetType":"villains","targetId":"villain_eshara_label_executive","relation":"Secret buyer"},{"targetType":"lore","targetId":"arc1_riftstalker_monogram","relation":"Arc 1 breadcrumb"},{"targetType":"threads","targetId":"arc1_finale","relation":"Earlier commission"}]},{"id":"arc4_executive_reacts","order":4,"title":"The Executive Closes Ranks","summary":"Knowing the party has exposed him, the executive undermines their relationship with Elara instead of immediately resorting to violence.","outline":[{"title":"An exposed conspirator","bullets":["The executive realizes the party has traced the Ferryman's monogram back to him, prior to the concert.","He responds FIRST with psychological manipulation, encouraging Elara to see the party as people interfering with her recovery, creative independence and career.","He also quietly obstructs their investigation, while maintaining his generous and respected public persona.","Elara is not automatically hostile: she still cares for the party but becomes increasingly suspicious of their criticism because she trusts the executive."],"takeaway":"The primary obstacle is trust, not a compulsory henchman ambush."},{"title":"Open details","bullets":["The mechanism by which he discovers he is exposed, his exact manipulations, any allies, and whether the party ever fights his agents remain undecided."],"takeaway":"Preserve escalation options for later design."}],"connections":[{"targetType":"npcs","targetId":"elara","relation":"Subject of manipulation"},{"targetType":"villains","targetId":"villain_eshara_label_executive","relation":"Manipulator"}]},{"id":"arc4_concert","order":5,"title":"The Corrupted Comeback Concert","summary":"Elara's major live solo concert becomes a concealed ritual designed to destabilize Eshara.","outline":[{"title":"The threat","bullets":["The executive guides Elara toward a corrupted musical composition. To her, it is an honest expression of her grief, love for Anya, and attempt to reclaim her artistic voice.","The composition secretly functions as a ritual attack against Eshara — Voice Unrestrained.","At a major LIVE concert, the performance intensifies the music's emotional isolation and begins destabilizing Eshara.","The party must try to disrupt the ritual and reach Elara without treating her as an irredeemable villain."],"takeaway":"The arc climax is a live performance, not a citywide recording release."},{"title":"What is not yet designed","bullets":["The concert venue and scale, ritual mechanics, the record executive's combat role, how Elara learns the truth, the party's possible resolutions, and the extent of damage to Eshara remain open.","The broader campaign still has five Current-centered arcs. The fifth attack targets Saelun; its failure to protect the Confluence triggers a separate two-encounter finale: restabilize the Confluence, then defeat the demon."],"takeaway":"Do not pre-decide whether the party successfully saves Elara or completely heals Eshara."}],"connections":[{"targetType":"npcs","targetId":"elara","relation":"Solo performer"},{"targetType":"villains","targetId":"villain_eshara_label_executive","relation":"Hidden ritual architect"},{"targetType":"lore","targetId":"eshara_duets","relation":"Lost harmonic power"}]}];

    // Two approved playable opening encounters within Arc 4; preserve later beats as open.
    var bEvent=arc4Events.find(function(e){return e.id==="arc4_birdie";});
    if(bEvent){
      bEvent.summary="Birdie's concern brings the party to an Avalon House listening gathering, where Elara's song causes a painful argument and reveals distorted Eshara resonance.";
      bEvent.outline.push(section("Encounter 1 — Avalon House: the listening party",[
        "Birdie invites the party to an intimate listening gathering at Avalon House. Elara is NOT singing live: a recording of her recent music is played.",
        "Everyone in the party makes a DC 13 Wisdom saving throw as the music begins. Success: sense a fleeting, unnatural loneliness and recognize an outside emotional influence. Failure: feel a personal insecurity or painful memory intensified; the PLAYER chooses its expression. No forced behavior or mechanical penalty.",
        "Two longtime friends begin a deeply personal, unexpectedly cruel argument, demonstrating how the song turns existing emotional wounds into disconnection.",
        "Stopping the recording DOES NOT immediately restore calm. Heightened emotions linger for hours, but the supernatural effect is gone by the following day. Words spoken and hurt feelings may have ordinary consequences.",
        "Investigating the resonance allows a DC 14 Arcana check. Success identifies interference with Eshara itself. Failure still registers something supernatural, but not its nature.",
        "No clue at this point identifies the record executive or the demon."
      ],"Show the music's danger without taking control of the player characters."));
    }
    var gEvent=arc4Events.find(function(e){return e.id==="arc4_listeners";});
    if(gEvent){
      gEvent.summary="The party investigates Elara's spreading influence and faces 5–6 crystalline, magically enraged patrons at Dolly Trolley's Glitterbomb in the CASTRO.";
      gEvent.outline.push(section("Encounter 2 — Glitterbomb: Rage on the Dance Floor",[
        "LOCATION: Glitterbomb, the Castro drag cabaret owned by Dolly Trolley (NOT a Tenderloin club or a venue called Dolly Trolley). This is an existing location and NPC.",
        "A drag performer uses an OFFICIAL RECORDING of a NEW Elara song as part of an act. Only five or six patrons become supernaturally enraged; the rest of the crowd panics, evacuates, or needs protection.",
        "The corrupted music triggers DC 15 Wisdom saving throws for party members. Emotions intensify; roleplay and responses remain players' decisions.",
        "The affected patrons grow conspicuous jagged crystalline formations and gain abnormal strength and resilience. They become active threats but remain innocent victims, not evil monsters.",
        "A full, NONLETHAL combat-style brawl breaks out. Dolly successfully resists the influence and works with the party to protect patrons, evacuate civilians, and contain violence.",
        "The recorded song may stop, but the fighting and supernatural rage persist temporarily; stopping the speakers alone does NOT end the encounter.",
        "Characters can deliberately target the crystals as an alternative to damaging patrons. Shattering a person's crystals weakens their powers, and destroying all their crystals ends their magical rage WITHOUT hurting the host. Precise attack rolls, crystal AC/HP, scaling and timing are not yet designed.",
        "Once the effect wears off, patrons are confused or remorseful, while injuries, damage, and social consequences remain. Broken crystals persist as collectible, magically resonant physical evidence.",
        "OPEN: What magical examination of the fragments reveals (intentional Eshara corruption versus an unfamiliar magical signature) has NOT been chosen."
      ],"A tactical rescue battle: the party saves corrupted people while preserving shards for the investigation."));
    }
    var arc4Name="Arc 4 — Elara's Descent";
    upsert("threads","arc_eshara",{
      name:"Arc 4 — Overview: Elara's Descent",arc:arc4Name,arcNumber:4,eventOrder:0,status:"Developing",
      summary:"Eshara — Voice Unrestrained: Birdie asks the party to investigate the emotional isolation caused by Elara's new songs. The trail leads to her trusted record label executive, the secret Riftstalker buyer, and a corrupted live concert ritual.",
      outline:[{"title":"Foundational history","bullets":["Elara and Anya's duets harmonized Eshara and Saelun. Anya as Vox Nebulae understood it; Elara, a Surface musician, never knew about the Fog.","A respected Fog record label head and arts patron signed them years ago for the demon's purposes. After Anya's independent death in Arc 2, he patiently helped Elara restart her solo career."],"takeaway":"The music and long-term trust explain why the betrayal matters."},{"title":"1. Birdie's Concern","bullets":["Birdie asks the party to investigate the unsettling change in Elara's new music."],"takeaway":"The party gets involved because Birdie cares about Elara, not because of a formal Conservatory assignment.","threadId":"arc4_birdie"},{"title":"2. The Spreading Isolation","bullets":["The party confirms Elara's new music is isolating listeners and reconnects with a guarded but friendly Elara."],"takeaway":"Investigate the spreading effect BEFORE making the record label the principal suspect.","threadId":"arc4_listeners"},{"title":"3. The Label and the Monogram","bullets":["Suspicion turns toward the record label; the party connects its executive to the Ferryman's Riftstalker buyer from Arc 1."],"takeaway":"Reward recognition of the old letter without inventing final identities or evidence delivery.","threadId":"arc4_label"},{"title":"4. The Executive Closes Ranks","bullets":["Knowing the party has exposed him, the executive undermines their relationship with Elara instead of immediately resorting to violence."],"takeaway":"The primary obstacle is trust, not a compulsory henchman ambush.","threadId":"arc4_executive_reacts"},{"title":"5. The Corrupted Comeback Concert","bullets":["Elara's major live solo concert becomes a concealed ritual designed to destabilize Eshara."],"takeaway":"The arc climax is a live performance, not a citywide recording release.","threadId":"arc4_concert"}],
      secret:outlineText(arc4Origin)+"\n\n"+outlineText([{"title":"1. Birdie's Concern","bullets":["Birdie asks the party to investigate the unsettling change in Elara's new music."],"takeaway":"The party gets involved because Birdie cares about Elara, not because of a formal Conservatory assignment.","threadId":"arc4_birdie"},{"title":"2. The Spreading Isolation","bullets":["The party confirms Elara's new music is isolating listeners and reconnects with a guarded but friendly Elara."],"takeaway":"Investigate the spreading effect BEFORE making the record label the principal suspect.","threadId":"arc4_listeners"},{"title":"3. The Label and the Monogram","bullets":["Suspicion turns toward the record label; the party connects its executive to the Ferryman's Riftstalker buyer from Arc 1."],"takeaway":"Reward recognition of the old letter without inventing final identities or evidence delivery.","threadId":"arc4_label"},{"title":"4. The Executive Closes Ranks","bullets":["Knowing the party has exposed him, the executive undermines their relationship with Elara instead of immediately resorting to violence."],"takeaway":"The primary obstacle is trust, not a compulsory henchman ambush.","threadId":"arc4_executive_reacts"},{"title":"5. The Corrupted Comeback Concert","bullets":["Elara's major live solo concert becomes a concealed ritual designed to destabilize Eshara."],"takeaway":"The arc climax is a live performance, not a citywide recording release.","threadId":"arc4_concert"}]),
      connections:arc4Events.map(function(e){return link("threads",e.id,"Event "+e.order);}).concat([link("lore","eshara_duets","Duet backstory"),link("lore","eshara_benefactor","Record executive"),link("lore","arc1_riftstalker_monogram","Arc 1 foreshadowing")])
    });
    arc4Events.forEach(function(e){
      upsert("threads",e.id,{
        name:"Arc 4 — "+String(e.order).padStart(2,"0")+". "+e.title,
        arc:arc4Name,arcNumber:4,eventOrder:e.order,parentThread:"arc_eshara",
        status:"Developing",summary:e.summary,outline:e.outline,
        secret:outlineText(e.outline),connections:e.connections
      });
    });
    upsert("lore","eshara_duets",{
      name:"Eshara and Saelun — Elara and Anya's Duets",status:"Canon",
      summary:"Elara and Anya's music harmonized expression (Eshara) and belonging (Saelun) through extraordinary emotional connection rather than overt visual magic.",
      secret:outlineText(arc4Origin),
      connections:[link("npcs","elara","Eshara"),link("npcs",aid,"Saelun and Vox Nebulae"),link("threads","arc_eshara","Arc 4 foundation"),link("lore","arc1_birdie_lullaby_setup","First musical introduction")]
    });
    upsert("lore","eshara_benefactor",{
      name:"Eshara — The Record Label Executive",status:"Canon",
      summary:"A celebrated Fog record label executive, arts patron and longtime supporter of Elara and Anya secretly serves the demon and bought the Riftstalker in Arc 1.",
      secret:"WILLING SERVANT: The benefactor is an intermediary, not the demon in disguise. As a respected Fog arts patron and head of the duo's record label, he signed Elara and Anya years before Anya died because their performances harmonized Eshara and Saelun. He never genuinely cared for them; his trust-building was calculated. Anya's addiction-related death was not engineered by the demon and disrupted his plan. He patiently lets Elara grieve for months, then gently encourages her solo career, eventually exploiting her longing for Anya. He guides her toward a corrupted live-concert composition that destabilizes Eshara. He is also the Riftstalker buyer: a sealed Arc 1 letter to the Ferryman displays his distinctive two-letter monogram; its actual initials remain undecided. The party connects this during Arc 4's investigation. The executive realizes he is exposed and responds by turning Elara emotionally against the party and quietly obstructing them, NOT initially by an obligatory physical attack. His name, label name, initial letters, how he interferes, and his eventual fate are not chosen.",
      connections:[link("threads","arc_eshara","Arc 4 central plot"),link("npcs","eshara_label_executive","Executive NPC"),link("lore","arc1_riftstalker_monogram","Sealed letter"),link("villains","villain_eshara_label_executive","Secret villain")]
    });
    upsert("lore","arc1_riftstalker_monogram",{
      name:"Arc 1 — Sealed Letter and Riftstalker Buyer's Monogram",status:"Canon",
      summary:"A letter addressed to the Ferryman bears an elegant two-letter monogram belonging to the Riftstalker's anonymous buyer. The party does not identify the buyer during Arc 1.",
      secret:"The buyer is secretly the same admired Fog arts patron and record label executive who signed Elara and Anya. In Arc 1, a SEALED LETTER with instructions about the Riftstalker carries an ornate two-letter monogram; it does not openly identify the buyer. The initials are not chosen yet. During Arc 4's record-label investigation, the party recognizes this same monogram and links the executive to the Ferryman. WHY the Riftstalker was bought and how the letter is discovered remain open.",
      connections:[link("threads","arc1_finale","Riftstalker commission"),link("threads","arc4_label","Revealed in Arc 4"),link("npcs","eshara_label_executive","Unknown buyer")]
    });
    upsert("npcs","eshara_label_executive",{
      name:"Unnamed Record Label Executive",status:"Developing",
      occupation:"Head of a Fog record label; prominent arts patron",
      summary:"A well-regarded San Francisco Fog music executive who signed Elara and Anya, secretly serves the demon and anonymously bought the Riftstalker.",
      personality:"Patient, charismatic and outwardly compassionate; privately calculating and deliberately manipulative.",
      secret:"DM ONLY: A WILLING servant of the campaign demon, not an unwitting believer or the demon wearing a disguise. He signed the duo years ago to exploit their Eshara–Saelun emotional resonance. He did NOT cause Anya's addiction-related death. He takes care to give Elara months to grieve before suggesting a solo career. He quietly redirects her grief through corrupted music, promising eventual reunion with Anya. As the buyer of the Ferryman's Riftstalker, his monogram appears on a sealed Arc 1 letter. He notices the party's Arc 4 discovery and counters with a smear of their motives to Elara and discreet interference, while protecting his public reputation. Personal name, record label name, portrait, exact monogram letters and purpose of Riftstalker purchase have NOT been chosen.",
      connections:[link("npcs","elara","Signed artist and target"),link("npcs",aid,"Former signed artist"),link("villains","villain_eshara_label_executive","Secret allegiance"),link("threads","arc4_label","Identity discovery"),link("lore","arc1_riftstalker_monogram","Anonymous buyer")]
    });
    upsert("villains","villain_eshara_label_executive",{
      name:"Record Label Executive (Unnamed)",npcId:"eshara_label_executive",arc:arc4Name,status:"Developing",
      summary:"Trusted Fog arts patron and label head secretly serving the demon; the Riftstalker purchaser and architect of Elara's corrupted concert.",
      goal:"Destabilize Eshara through Elara's music in service of the demon's larger plan.",
      method:"Calculated years-long patronage, patiently exploiting bereavement, a concealed concert ritual, and psychological manipulation of Elara against the party.",
      weakness:"Unresolved; no approved combat vulnerabilities or final encounter rules.",
      secret:"The Ferryman's sealed letter carries his undecided two-letter monogram. He knows when the party discovers the connection and initially responds by undermining their credibility with Elara and obstructing the investigation. Do not assign a definitive name, label name, monogram initials or Riftstalker use.",
      connections:[link("npcs","eshara_label_executive","NPC identity"),link("threads","arc4_concert","Ritual"),link("lore","arc1_riftstalker_monogram","Earlier commission")]
    });
    upsert("npcs","elara",{},{
      note:"ARC 4 CANON: Elara is still unawakened and has never known about the Fog or her duets' Eshara–Saelun resonance. She notices that her new solo music makes listeners withdraw but understands it as healthy emotional release. After months of grieving Anya's independent death, her longtime record label executive gently encouraged her to record solo again. She greets the party warmly but is guarded about criticism of the music and of the executive; he later works to turn her against them. Her music is being shaped toward a corrupted live-concert ritual that attacks Eshara. Do not pre-decide her reaction at the climax.",
      connections:[link("threads","arc_eshara","Arc 4 central character"),link("lore","eshara_duets","Lost partnership"),link("lore","eshara_benefactor","Longtime executive")]
    });
    upsert("npcs",bid,{},{
      note:"ARC 4 CANON: Birdie hears how Elara's new solo compositions isolate listeners emotionally rather than strengthen community. Familiar with the Fog and musical Currents, she senses an unnatural influence and asks the party to investigate. She is personally concerned for Elara, not issuing a Conservatory assignment.",
      connections:[link("threads","arc4_birdie","Arc 4 investigation hook"),link("threads","arc_eshara","Eshara arc")]
    });

    // Campaign-wide sweep: correct legacy six-Current source entries and register the
    // true final antagonist without erasing user-authored record overrides.
    var fiveCurrents=[
      {name:"Eshara",meaning:"Voice unrestrained",domain:"Art, Expression and Rebellion",arc:4},
      {name:"Orith",meaning:"Seeking that makes",domain:"Invention and Innovation",arc:2},
      {name:"Saelun",meaning:"Holding one another",domain:"Belonging and Chosen Family",arc:5},
      {name:"Mereth",meaning:"Memory that endures",domain:"History and Remembrance",arc:3},
      {name:"Vaedrin",meaning:"Chosen passage",domain:"Migration and Transformation",arc:1}
    ];
    upsert("lore","currents",{
      name:"The Five Currents",status:"Canon",
      summary:"Five Currents sustain the Confluence: Eshara (expression), Orith (innovation), Saelun (belonging), Mereth (remembrance) and Vaedrin (transformation).",
      secret:"LOCKED FIVE CURRENTS: "+fiveCurrents.map(function(c){return c.name+" — "+c.meaning+" ("+c.domain+") — Arc "+c.arc;}).join("; ")+". Every Current resonates throughout San Francisco through people's choices and relationships; do not revert to the obsolete six-Current Wildfire/Crossroads/Foundation/Threshold/Spark/Covenant model. Do not assume each Current is tied exclusively to a single physical district.",
      connections:[link("lore","confluence","Sustains protection"),link("threads","campaign_finale","Restoration objective")]
    });
    upsert("lore","surface",{
      name:"Surface and Fog",status:"Canon",
      summary:"The Surface is ordinary San Francisco; the Fog is its overlapping supernatural reality, normally veiled by the Confluence.",
      secret:"The Confluence protects Surface life and veils the Fog from ordinary perception. The separate Umbral Arcana system was removed from canon. Awakening requires an event; do not assume unawakened people such as Elara can see Fog magic."
    });
    upsert("lore","confluence",{
      name:"The Confluence",status:"Canon",
      summary:"A citywide magical protection sustained by five Currents; it protects Surface life and veils the supernatural Fog.",
      secret:"The Confluence keeps Surface life safe and the Fog hidden, and is sustained by the five Currents. The separate Umbral Arcana concept is RETIRED. Evander Veyne's plan is to corrupt and seize—not destroy—the Currents: fracture the Confluence, establish an infernal domain, and make that domain the NEW ANCHOR for the Confluence. If successful, the Confluence would protect his sovereign territory from outside entities, even the infernal powers of the Nine Hells, while trapping residents under his rule. Whether the reanchoring fully occurs in Arc 5 or is preventable/reversible in the first finale encounter remains open.",
      connections:[link("lore","currents","Five magical supports"),link("lore","evander_master_plan","Threatened reanchoring"),link("threads","finale_confluence","Restoration")]
    });
    upsert("lore","conservatory",{
      name:"The Conservatory",status:"Canon",
      summary:"Hidden institution beneath the Conservatory of Flowers, devoted to scholarship, scouting magical resonance and preserving fragmentary First Tongue knowledge.",
      secret:"Founded during the Gold Rush; scouts monitor the FIVE Currents. Its members understand parts of the Fog's history and fragmentary Kethil/First Tongue texts, but they are not omniscient. They may hold scattered accounts of infernal dominion failures without already having solved Evander's scheme. The Confluence alone protects Surface life and veils the Fog."
    });
    upsert("lore","elara",{
      name:"Elara, Anya and Eshara's Corruption",status:"Canon",
      summary:"Elara and Anya's duets harmonized Eshara and Saelun; after Anya's unrelated death, a demon-serving record executive slowly turns Elara's solo music into a corrupted concert ritual.",
      secret:"Anya, Vox Nebulae, knew their duets' magical significance but never informed Elara. Elara remains UNAWAKENED and ignorant of the Fog during the early story and Arc 4 investigation. Anya dies elsewhere during Arc 2's Luma finale from an addiction-related tragedy, NOT a demonic murder. Their longtime Fog record-label executive was willingly serving Evander Veyne from the start. After allowing months for grief, he subtly nudges Elara into a solo career. Her music generates temporarily amplified loneliness, anger and alienation; she rationalizes it as difficult but healing art. Her major LIVE concert conceals an Eshara-destabilizing ritual. The party's efforts to save her and the outcome are open.",
      connections:[link("npcs","elara","Singer"),link("npcs",aid,"Anya"),link("threads","arc_eshara","Arc 4"),link("npcs","evander_veyne","Infernal mastermind")]
    });
    // Legacy district descriptions in the initial dashboard seed still named old Currents.
    [
      ["haight","Eshara resonates strongly here through art, expression and rebellion; Avalon House is a sanctuary for musicians."],
      ["soma","Orith resonates through invention and experimentation; Renewal Biomedical is the established major Orith anchor, not Salesforce Tower."],
      ["castro","Saelun resonates here through belonging and chosen family; theatrical expression at Glitterbomb also echoes Eshara."],
      ["chinatown","Vaedrin is a candidate thematic resonance here, but an exclusive physical anchor has not been confirmed."],
      ["presidio","A unique Mereth or other Current anchor is not established here; the retired Foundation Current no longer exists."],
      ["tenderloin","A unique Current anchor is not established here; the retired Threshold Current no longer exists."]
    ].forEach(function(pair){upsert("districts",pair[0],{secret:pair[1]});});
    upsert("locations","avalon",{
      secret:"An open, multigenerational arts sanctuary with strong Eshara resonance. Birdie, Anya and Elara are introduced here in Arc 1; in Arc 3 Birdie recalls the Keeper of Memories and her lullaby; Arc 4 begins with Birdie's invitation to the party to hear Elara's unsettling recording."
    },{aliases:["Avalon House"],connections:[link("threads","arc4_birdie","Arc 4 opening") ]});
    upsert("locations","castro_glitterbomb",{
      name:"Glitterbomb",district:"castro",status:"Canon"
    },{
      aliases:["Glitterbomb"],
      note:"ARC 4 ENCOUNTER 2: During a drag act, an OFFICIAL recording of Elara's new song triggers magical rage in five or six patrons, who develop jagged crystals and supernatural strength. Dolly helps evacuate and protect other patrons. After the music stops the rage persists temporarily. The party can shatter crystals harmlessly to free the affected individuals; collectible shards remain.",
      connections:[link("npcs","dolly_trolley","Owner"),link("threads","arc4_listeners","Glitterbomb riot")]
    });
    upsert("npcs","dolly_trolley",{
      name:"Dolly Trolley",location:"castro_glitterbomb",status:"Canon"
    },{
      aliases:["Dolly Trolley"],
      note:"Arc 4 Glitterbomb scene: Dolly RESISTS Elara's magical rage and actively helps evacuate and protect patrons. Only five or six guests become corrupted, not the entire crowd. Glitterbomb is in the CASTRO.",
      connections:[link("locations","castro_glitterbomb","Owns Glitterbomb"),link("threads","arc4_listeners","Riot ally")]
    });
    upsert("npcs","evander_veyne",{
      name:"Evander Veyne",status:"Canon",ancestry:"Infernal fiend",
      occupation:"Infernal scholar and aspiring sovereign",
      personality:"Courtly, patient, intellectually arrogant, calculating; considers mortals inferior resources rather than equals.",
      appearance:"In his controlled gentlemanly form: tall, almost human, impeccably dressed and unnervingly composed. In the FINAL confrontation he reveals a towering, horned, armored Infernal Monarch form; the specific costume and horn details are intentionally undecided.",
      summary:"The campaign's true infernal mastermind: a centuries-old scholarly upstart seeking to make San Francisco the first permanently anchored infernal kingdom on the Material Plane.",
      secret:"Evander Veyne is his REAL infernal name, not an alias. Comparatively minor in Hell's hierarchy, he has spent centuries researching ancient, FAILED infernal dominions. Those territories depended on unstable Nine Hells connections and could never remain anchored to the Material Plane. He discovered San Francisco's Confluence and FIVE Currents, and believes he can replace its foundation with his own infernal domain, forcing it to shield his independent kingdom against outside entities including Hell's rulers. He sees humans as resources to be owned, not people to be admired. While the Confluence holds, he CANNOT physically enter San Francisco or appear independently: he communicates ONLY by channeling his voice or image through WILLING servants. The record label executive, his willing agent, is the Arc 4 vessel. The demon introduces himself to the party as Evander Veyne in Arc 4 but does NOT reveal his infernal-sovereignty objective. In Arc 5 the Confluence breaks and he enters SF in his genteel appearance. His monstrous Infernal Monarch form is held back until the separate FINAL FIGHT. Exact rank, powers, true form aesthetics and combat statistics undecided.",
      connections:[link("villains","villain_evander_veyne","Principal antagonist"),link("lore","evander_master_plan","Infernal sovereignty plan"),link("npcs","eshara_label_executive","Willing mouthpiece"),link("threads","arc5_saelun","The Breach"),link("threads","finale_evander","Final confrontation")]
    });
    upsert("villains","villain_evander_veyne",{
      name:"Evander Veyne",npcId:"evander_veyne",status:"Canon",arc:"Campaign-wide antagonist / Final Encounter 2",
      summary:"Infernal Scholar, centuries-long plotter, and aspiring ruler of a permanent independent dominion protected by San Francisco's own Confluence.",
      goal:"Make his infernal domain the new anchor of the Confluence, transforming the city's protection into a shield for his sovereignty against entities outside his realm.",
      method:"Study prior dominion failures; cultivate willing agents; exploit suffering that weakens each Current; engineer an Arc 5 Confluence rupture and Nine Hells gateway; seize control of the five Currents without destroying them.",
      weakness:"The domain's attempted reanchoring to the Confluence must be prevented or reversed before he is decisively confronted. Specific vulnerability and battle mechanics are undecided.",
      secret:"His ambitious plan is to escape Hell's authority, not rise within it. Humanity is his resource. The party meets him by name through a willing agent in Arc 4 but learns his true objective later. He enters after the Arc 5 breach as an elegant gentleman; his true Infernal Monarch form appears only in the last confrontation. He is NOT the mastermind of every independent villain's choices: Luma and the Keeper retain their own motives.",
      connections:[link("npcs","evander_veyne","True identity"),link("threads","arc5_saelun","Breach"),link("threads","finale_evander","Final encounter")]
    });
    upsert("lore","infernal_dominions",{
      name:"The Failed Infernal Dominions",status:"Canon",
      summary:"Across ancient history, fiends established temporary mortal territories, but none succeeded in creating a permanent independent infernal dominion.",
      secret:"Fragments of tablets, manuscripts and occult histories record infernal kingdoms that eventually fell. They all depended on unstable magical links to the Nine Hells and collapsed when those links failed. Evander Veyne, a scholarly upstart, has studied these accounts for centuries. Exact historical civilizations, dates, artifacts and named fiends are NOT established. These records can become research material for the Conservatory.",
      connections:[link("npcs","evander_veyne","Centuries of research"),link("lore","evander_master_plan","His breakthrough")]
    });
    upsert("lore","evander_master_plan",{
      name:"Evander's Plan — Steal the Confluence's Protection",status:"Canon",
      summary:"Evander seeks to build a permanent San Francisco infernal domain as the Confluence's NEW ANCHOR, so the city's own protective magic defends his realm from outside entities.",
      secret:"The demon's aim is INDEPENDENT SOVEREIGNTY, not annihilation of the city. Past dominions failed to anchor permanently. The Confluence's five Currents are his answer. Scheme: exploit suffering to weaken their integrity without destroying them; rupture the Confluence in Arc 5; enter through the Nine Hells gateway; establish an infernal domain that replaces the Confluence's old foundation; harness the Currents so the protective barrier shelters his kingdom against outside powers, potentially even Hell's hierarchy, while subjecting San Francisco's residents to his rule. The five arcs reflect vulnerabilities he exploits, but Luma and the Keeper are NOT necessarily direct agents. Do not reveal the true objective to players during Evander's Arc 4 introduction. Exact reanchoring ritual and post-rupture timeline remain unresolved.",
      connections:[link("npcs","evander_veyne","Architect"),link("lore","currents","Five Currents"),link("lore","infernal_dominions","Historic failures"),link("threads","finale_confluence","Protective barrier is reclaimed")]
    });
    upsert("lore","eshara_benefactor",{
      name:"Eshara — Record Label Executive (Name Undecided)",status:"Canon"
    },{connections:[link("npcs","evander_veyne","Willing infernal patron")]});
    upsert("npcs","eshara_label_executive",{},{
      note:"The infernal force he willingly serves is Evander Veyne, the centuries-old scholar. He can voluntarily channel Evander's voice in Arc 4, allowing Evander to reveal his TRUE NAME but not his ambition to make SF an infernal dominion.",
      connections:[link("npcs","evander_veyne","Willing infernal mouthpiece")]
    });
    upsert("threads","arc_eshara",{
      summary:"Arc 4 (Eshara): Birdie's Avalon House listening gathering exposes temporarily isolating music. At Glitterbomb in the Castro, Elara's recording enrages 5–6 crystalline patrons; their broken crystals remain as evidence. The investigation leads to the record executive and his Arc 1 Ferryman monogram. He manipulates Elara against the party; Evander Veyne briefly speaks through this willing servant by name. Elara's live comeback concert is a covert Eshara ritual."
    },{connections:[link("npcs","evander_veyne","Infernal figure revealed"),link("locations","castro_glitterbomb","Encounter 2")]});
    upsert("threads","arc5_saelun",{
      name:"Arc 5 — Saelun (Title TBD)",arc:"Arc 5 — Saelun",arcNumber:5,eventOrder:0,status:"Developing",
      summary:"The fifth Current-centered arc targets Saelun (Belonging and Chosen Family). Evander's attack ultimately breaches the Confluence; Surface and Fog collide and a gateway to the Nine Hells opens.",
      outline:[
        section("Confirmed structure",[
          "The fifth arc is a DISTINCT Saelun story, not the two finale encounters. It follows Vaedrin, Orith, Mereth and Eshara.",
          "After mounting damage to the Currents, the demon's plan succeeds in rupturing the Confluence. The Fog and Surface destabilize and a gateway to the Nine Hells opens.",
          "Evander enters San Francisco in his composed, gentlemanly appearance; his true monstrous form remains concealed until the final fight.",
          "His actual goal is to make an infernal domain the NEW protective anchor of the Confluence, not to simply destroy the barrier."
        ],"The catastrophic breach sets up two SEPARATE subsequent encounters."),
        section("Undecided",[
          "Arc 5's title, location, individual encounters, Saelun ritual details, character outcomes, and how the party learns the complete infernal plan have not been agreed."
        ],"Do not invent a detailed Arc 5 story.")
      ],
      secret:"Saelun's corruption triggers a Confluence rupture and a Nine Hells gateway. Evander's hoped-for infernal dominion would become the new anchor and receive the Confluence's protection. After this arc, first restore the Confluence, then defeat Evander in separate encounters.",
      connections:[link("npcs","evander_veyne","Arrives through breach"),link("threads","campaign_finale","Precedes finale"),link("lore","currents","Saelun")]
    });
    var finaleOverview=[
      section("1. Restore the Confluence",["A separate post–Arc 5 encounter to prevent or reverse the replacement of the Confluence's natural foundation by Evander's infernal domain.","Reclaim the Currents' protective role. The resolution and its exact mechanics have not yet been designed."],"The protective barrier must not remain a shield for Evander's kingdom."),
      section("2. Defeat Evander Veyne",["A separate, subsequent final confrontation with Evander, after the Confluence-restoration objective.","Only now is his monstrous, horned and armored Infernal Monarch form revealed. His actual combat design and end state remain undecided."],"Two finale objectives remain separate.")
    ];
    upsert("threads","campaign_finale",{
      name:"Finale — After Arc 5 (Two Encounters)",arc:"Finale — Post-Arc 5",eventOrder:0,status:"Developing",
      summary:"After Saelun's catastrophic fifth arc, the party must first reclaim the Confluence, then separately confront and defeat Evander Veyne.",
      outline:finaleOverview,secret:outlineText(finaleOverview),
      connections:[link("threads","finale_confluence","Encounter 1"),link("threads","finale_evander","Encounter 2"),link("threads","arc5_saelun","Preceding breach")]
    });
    upsert("threads","finale_confluence",{
      name:"Finale — 01. Reclaim the Confluence",arc:"Finale — Post-Arc 5",
      parentThread:"campaign_finale",eventOrder:1,status:"Developing",
      summary:"Restore the Confluence's purpose and prevent or reverse its transformation into Evander's protective infernal shield.",
      outline:[finaleOverview[0]],secret:outlineText([finaleOverview[0]]),
      connections:[link("lore","evander_master_plan","Threat"),link("npcs","evander_veyne","Would-be sovereign")]
    });
    upsert("threads","finale_evander",{
      name:"Finale — 02. Defeat Evander Veyne",arc:"Finale — Post-Arc 5",
      parentThread:"campaign_finale",eventOrder:2,status:"Developing",
      summary:"Confront Evander Veyne after the Confluence objective. The Infernal Gentleman finally unveils his terrifying Infernal Monarch form.",
      outline:[finaleOverview[1]],secret:outlineText([finaleOverview[1]]),
      connections:[link("npcs","evander_veyne","Final foe"),link("villains","villain_evander_veyne","Boss")]
    });
    upsert("threads","main",{
      name:"Campaign Throughline — The Five Currents and Evander Veyne",status:"Developing",
      summary:"Five arcs test Vaedrin, Orith, Mereth, Eshara and Saelun; infernal scholar Evander Veyne seeks to turn San Francisco's protective Confluence into the permanent anchor of his independent domain.",
      secret:"Established order: Arc 1 Vaedrin (Ferryman), Arc 2 Orith (Luma), Arc 3 Mereth (Keeper), Arc 4 Eshara (Elara), Arc 5 Saelun (breach). Distinct final encounters: 1. Restore/reclaim the Confluence, then 2. defeat Evander. The demon is an infernal scholar and upstart who seeks to steal the Confluence's protection, not destroy the city. Some arc antagonists, such as Luma and the Keeper, are independent rather than deliberate demon agents.",
      connections:[link("lore","currents","Five Currents"),link("npcs","evander_veyne","Main antagonist"),link("threads","arc5_saelun","Final Current"),link("threads","campaign_finale","Two final encounters")]
    });

    // Migrate legacy, script-generated Arc 2 and Arc 3 prose in older shared/browser saves.
    reconcileLegacyFields();
    // Remember the update in local dashboard state. Retain all user edits / deletions.
    data._arc3CanonVersion=VERSION;
    if(typeof persist==="function"){try{persist();}catch(err){console.warn("Arc 3 persistence deferred",err);}}
  }
  var oldRender=render;
  render=function(){apply();return oldRender.apply(this,arguments);};
  apply();
  render();
})();


/* Repository-backed multi-editor synchronization */
(function(){
  // Explicit repository synchronization; local browser save remains unchanged.
  if(typeof data==="undefined"||typeof render!=="function"||window.__rflSyncInit)return;
  window.__rflSyncInit=true;
  const kinds=["districts","locations","npcs","villains","lore","threads"];
  const key="rfl_sync_api_url", sessionKey="rfl_sync_session";
  let sha=null;
  const params=new URLSearchParams(location.hash.slice(1));
  if(params.has("rfl_sync_session")){
    sessionStorage.setItem(sessionKey,params.get("rfl_sync_session"));
    history.replaceState(null,"",location.pathname+location.search);
  }
  const bar=document.createElement("section");
  bar.id="rflGithubSyncBar";
  bar.style.cssText="position:fixed;bottom:12px;right:12px;z-index:9996;background:#121d2c;border:1px solid #65829b;color:white;padding:12px;border-radius:12px;box-shadow:0 8px 30px #0009;max-width:min(390px,calc(100vw - 24px));font:13px system-ui";
  bar.innerHTML='<strong>Repository Sync</strong><div style="display:flex;gap:6px;flex-wrap:wrap;margin:8px 0"><button type="button" data-sync="connect">Configure / Sign in</button><button type="button" data-sync="load">Load</button><button type="button" data-sync="save">Save to GitHub</button><button type="button" data-sync="logout">Sign out</button></div><small id="rflSyncStatus" role="status">Browser edits are not yet synced.</small>';
  document.body.appendChild(bar);
  const status=message=>{bar.querySelector("#rflSyncStatus").textContent=message};
  const token=()=>sessionStorage.getItem(sessionKey)||"";
  const endpoint=()=>localStorage.getItem(key)||"";
  async function call(path,method="GET",body){
    if(!endpoint())throw Error("Configure the Worker URL first.");
    if(!token())throw Error("Sign in with GitHub first.");
    const response=await fetch(endpoint()+path,{method,headers:{"authorization":"Bearer "+token(),"content-type":"application/json"},body:body===undefined?undefined:JSON.stringify(body)});
    const result=await response.json().catch(()=>({}));
    if(!response.ok)throw Error(result.error||"Request failed ("+response.status+")");
    return result;
  }
  function snapshot(){
    const out={schema:1,updatedAt:new Date().toISOString(),collections:{},_editorOverrides:data._editorOverrides||{},_editorDeletes:data._editorDeletes||[]};
    kinds.forEach(k=>{out.collections[k]=Array.isArray(data[k])?data[k]:[]});
    return out;
  }
  async function load(){
    const remote=await call("/api/state");
    if(!remote.data){sha=null;status("No shared state exists yet. Save to create it.");return;}
    if(!remote.data.collections||remote.data.schema!==1)throw Error("Unsupported repository state format");
    if(!confirm("Replace current browser campaign entries with the repository version? Export a JSON backup first if you have local edits."))return;
    kinds.forEach(k=>{if(Array.isArray(remote.data.collections[k]))data[k]=remote.data.collections[k]});
    data._editorOverrides=remote.data._editorOverrides||{};
    data._editorDeletes=remote.data._editorDeletes||[];
    // Re-run the current canon migration against the freshly loaded repository state.
    // A previous startup migration must not suppress updates after a later Load action.
    data._arc3CanonVersion="";
    sha=remote.sha;
    persist();render();
    status("Loaded shared campaign state. Version "+sha.slice(0,8));
  }
  async function save(){
    if(!confirm("Save all current dashboard entries to the shared GitHub repository? Other authorized editors will see them when they load."))return;
    const result=await call("/api/state","PUT",{sha,data:snapshot()});
    sha=result.sha;
    status("Saved to GitHub. Commit recorded.");
  }
  window.rflCanSaveNpc=()=>{
    if(!token())throw Error("Sign in to Repository Sync first.");
    if(!sha)throw Error("Click Load in Repository Sync before saving NPCs to avoid overwriting newer changes.");
  };
  window.rflSaveNpcToRepository=async()=>{
    if(!token())throw Error("Sign in to Repository Sync first.");
    if(!sha)throw Error("Click Load in Repository Sync before saving NPCs to avoid overwriting newer changes.");
    const result=await call("/api/state","PUT",{sha,data:snapshot()});
    sha=result.sha;
    status("Saved NPC to GitHub. Version "+sha.slice(0,8));
    return result;
  };
  bar.addEventListener("click",async e=>{
    const action=e.target.closest("[data-sync]")?.dataset.sync;
    if(!action)return;
    try{
      if(action==="connect"){
        const api=prompt("Cloudflare Worker URL (https://...workers.dev)",endpoint());
        if(api===null)return;
        const url=new URL(api.trim());
        if(url.protocol!=="https:")throw Error("Worker URL must use HTTPS");
        localStorage.setItem(key,url.origin);
        location.href=url.origin+"/auth/start";
        return;
      }
      if(action==="logout"){
        try{if(token())await call("/api/logout","PUT",{});}finally{sessionStorage.removeItem(sessionKey);sha=null;status("Signed out of repository sync.");}
      }else if(action==="load")await load();
      else if(action==="save")await save();
    }catch(err){status("Sync error: "+err.message);alert("Repository Sync: "+err.message)}
  });
  if(token()&&endpoint())call("/api/me").then(x=>status("Signed in as @"+x.login+". Use Load to access shared data.")).catch(e=>status("Sync sign-in expired: "+e.message));
})();