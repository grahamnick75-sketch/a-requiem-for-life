/* A Requiem for Life · Dogpatch & Ferryman · additive local-data migration */
(function(){
 if(typeof data==='undefined'||!data||!Array.isArray(data.districts))return;
 const additions={
  districts:[
   {id:'dogpatch',name:'Dogpatch',summary:'Industrial blocks, working warehouses, workshops and waterfront streets southeast of SoMa.',secret:'Cal “Chain” Maddox operates a concealed after-hours supernatural creature-fighting ring inside a functioning commercial Dogpatch warehouse. Ordinary workers may have no idea.',status:'Developing'},
   {id:'waterfront',name:'North Waterfront / Embarcadero',summary:'San Francisco piers, ferries, working shorelines, attractions, and places of arrival and departure.',secret:'Secondary expression of Crossroads: transit, exchange and passage. The Ferryman’s Fey network uses waterfront crossings to smuggle dangerous supernatural creatures. Chinatown remains the Crossroads anchor.',status:'Developing'}
  ],
  locations:[
   {id:'dogpatch_warehouse',name:'Dogpatch Freight Warehouse',district:'dogpatch',summary:'A functioning commercial warehouse in Dogpatch handling ordinary freight and deliveries.',secret:'Fictional warehouse; actual business name and street address not decided. Cal “Chain” Maddox conceals a magical creature-fighting arena inside, active after hours. Blink Dogs are among the captive creatures. A mini-boss battle against Cal and his enforcers should enable rescue and reveal shipping manifests, contracts or other clues to the Ferryman. Unaware legitimate warehouse employees can be witnesses or allies.',status:'Canon'},
   {id:'fishermans_wharf',name:'Fisherman’s Wharf',district:'waterfront',summary:'Busy tourist waterfront with seafood stalls, public piers and neighborhood life.',secret:'A player-map landmark. Surface and Fog activity coexist; no specific smuggling operation has yet been placed here.',status:'Canon'},
   {id:'pier39',name:'PIER 39',district:'waterfront',summary:'A familiar waterfront attraction with sea lions, shops, street performers and bay views.',secret:'Primarily an ordinary tourist attraction. Supernatural Fog activity coexists casually; not secretly a wholesale magical market.',status:'Canon'},
   {id:'waterfront_crossings',name:'Waterfront Crossing Points',district:'waterfront',summary:'Service docks, piers and ferry infrastructure along the city’s northern and eastern shores.',secret:'The Ferryman’s network uses concealed waterfront routes. Exact dock, staging location and headquarters still undecided. A final major shipment and boss battle are planned somewhere on the waterfront.',status:'Developing'},
   {id:'alcatraz',name:'Alcatraz Island',district:'waterfront',summary:'Historic island and former federal prison visited by tourists.',secret:'Significant haunted island in the Fog. Spirits may be supernaturally trapped; the mechanism, creator and ancient-versus-deliberate origin are unresolved. Respect real history including the Indigenous occupation.',status:'Developing'}
  ],
  npcs:[
   {id:'cal_maddox',name:'Cal “Chain” Maddox',location:'dogpatch_warehouse',summary:'Awakened human criminal involved in Dogpatch’s underground gambling and creature-fighting scene.',secret:'Arc 1 mini-boss: a greasy, cruel, intimidating thug wearing a stained white ribbed tank top, gold chain, jeans and heavy boots. Runs illegal animal fights featuring beautiful, intelligent magical hounds such as Blink Dogs. A customer of the Ferryman, not a lieutenant. Battle with enforcers in the Dogpatch warehouse leads to rescuing captive animals and revealing the wider trafficking network.',status:'Canon'},
   {id:'ferryman',name:'The Ferryman',location:'waterfront_crossings',summary:'Sophisticated, impeccably dressed Eladrin broker known within the supernatural underground.',secret:'Arc 1 main antagonist. Commands a network of couriers, handlers and lieutenants who traffic dangerous supernatural creatures into San Francisco. A smooth, contract-focused criminal exploiting Confluence weakness for profit, not working for Elara or her demon. An unknown buyer pays him to import an unusually powerful creature to be used as a weapon. Arc culminates with battle against Ferryman and monster at a waterfront crossing. Monster, buyer, intended target and precise location undecided; build a level-appropriate serious Fey boss combat kit.',status:'Canon'}
  ],
  threads:[
   {id:'arc_ferryman',name:'Arc 1 — Open Secrets: The Ferryman',summary:'Creature trafficking investigation, from Cal Maddox’s Dogpatch fighting ring to a dangerous waterfront shipment.',secret:'Five beats: trafficking rumors and consequences → rescue/mini-boss clash with Cal and enforcers at functional Dogpatch warehouse → contracts and manifests expose the Ferryman’s courier/handler/lieutenant network → discovery of a powerful imported creature ordered as a weapon by an unknown buyer → interception and boss fight with Ferryman and creature. Ordinary waterfront workers and visitors feel the fallout. Chinatown anchors Crossroads; the waterfront embodies passage and exchange. Occasional gaps in the veil maintained by the Confluence allow Surface witnesses brief glimpses of the Fog, sometimes leaving hazy memories. Their cause remains open. Creature species, buyer and target unchosen.',status:'Developing'},
   {id:'soma_automation',name:'SoMa — Automation and Displaced Workers',summary:'Potential future storyline about technology and automation replacing local workers.',secret:'Future arc concept only. Consequences for ordinary workers should matter; possible but unconfirmed bridge from the Ferryman arc. Do not canonize a magical cause or villain yet.',status:'Idea'},
   {id:'alcatraz_spirits',name:'Alcatraz — Trapped Spirits',summary:'A haunted island where some spirits cannot leave.',secret:'Cause and history of trapping undecided. Respect the island’s real history, including 1969–71 Indigenous occupation. This is separate from Ferryman until established otherwise.',status:'Developing'}
  ]
 };
 let changes=0;
 for(const [type,items] of Object.entries(additions)){
  if(!Array.isArray(data[type]))continue;
  for(const item of items)if(!data[type].some(old=>old.id===item.id)){data[type].push({...item});changes++;}
 }
 const china=data.districts.find(x=>x.id==='chinatown');
 if(china&&!(china.secret||'').includes('secondary expression of arrival')){
  china.secret=((china.secret||'')+' Chinatown remains the principal Crossroads anchor; the north waterfront is a secondary expression of arrival, transit and exchange.').trim();changes++;
 }
 if(typeof HOTSPOTS!=='undefined'){
  for(const p of [['dogpatch',87,82],['waterfront',72,28]])if(!HOTSPOTS.some(x=>x[0]===p[0]))HOTSPOTS.push(p);
 }
 if(typeof LOCATION_PINS!=='undefined'){
  for(const p of [['dogpatch_warehouse',87,82,'D'],['fishermans_wharf',57,24,'W'],['pier39',63,23,'39'],['alcatraz',65,12,'A']]){
   if(!LOCATION_PINS.some(x=>x[0]===p[0]))LOCATION_PINS.push(p);
  }
 }
 if(typeof mapHome==='function'){
  const original=mapHome;
  mapHome=function(){return original().replace('draggable="false">','draggable="false"><span class="dogpatch-map-label" aria-hidden="true">Dogpatch</span>');};
  const style=document.createElement('style');
  style.textContent='.dogpatch-map-label{position:absolute;left:86%;top:83%;transform:translate(-50%,-50%);z-index:1;pointer-events:none;color:#39291a;font:italic 700 clamp(12px,1.5vw,19px) Georgia,serif;letter-spacing:.02em;text-shadow:1px 1px 2px #f2dbab,-1px -1px 2px #f2dbab,0 0 6px #f1d9ab}';
  document.head.appendChild(style);
 }
 if(changes)try{persist();}catch(e){}
 if(typeof render==='function')render();
})();