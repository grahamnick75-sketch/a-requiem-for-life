/* A Requiem for Life — Castro & Tenderloin neighborhood canon (October 2026).
   Additive and idempotent. Preserve custom notes, session journal and prior entries.
   Map coordinates are illustrative placements on the player-safe artwork, not street geocodes. */
(function(){
  if(typeof data==='undefined'||!data||!Array.isArray(data.locations))return;
  const entries={
    locations:[
      {
        id:'castro_wildfire',name:'Wildfire',district:'castro',
        summary:'Historic old-school gay dive bar in the Castro, opened in the late 1970s. A lived-in neighborhood gathering place with a jukebox, worn booths and photographs of generations of patrons.',
        secret:'DM ONLY: Owned by Arthur “Artie” Bell, a 73-year-old Awakened human man with a sharp tongue and a protective heart. Artie inherited Wildfire from his late longtime partner Luis “Lou” Moreno, who founded the bar. It survived decades of change, queer celebration, activism and grief, including the AIDS crisis. The photographs honor people, not just tragedy; the bar remains lively. Lou’s cause and date of death are intentionally unspecified. Wildfire expresses Saelun through chosen family and belonging. Despite the name Wildfire, the magical Current is called Eshara; these are distinct names.',
        status:'Canon'
      },
      {
        id:'castro_common_thread',name:'The Common Thread',district:'castro',
        summary:'Fictional independent LGBTQ+ community history center integrated into Harvey Milk Plaza at Castro and Market Streets, with exhibitions, stories and public programming.',
        secret:'DM ONLY: This is a fictional campaign adaptation of Harvey Milk Plaza, not a statement that such an institution exists there in the real world. Plaza-level memorials and events; adjoining concourse exhibition galleries and a Remembrance Room; research wing with oral-history recording studio, library and community archives. Preserves photographs, protest posters, zines, nightlife ephemera and the lives of people lost, including in the AIDS crisis. Sensitive collections have privacy protections. An Uncatalogued Collection preserves evidence of supernatural Castro residents; a few Awakened volunteers or staff protect it, without turning the center into a Conservatory branch. Reflects Saelun (community) and Mereth (remembrance). Records community history as human history, not events secretly caused by magic. Specific staff remain unassigned.',
        status:'Canon'
      },
      {
        id:'castro_moth_needle',name:'Moth & Needle',district:'castro',
        summary:'Longstanding Castro tailor and costume shop specializing in alterations, performance wardrobes and—among Awakened customers—powerful enchanted clothing and equipment.',
        secret:'DM ONLY: Proprietor Odette Copperfield is an older dwarven woman, theatrical, exacting and funny. A premier magical outfitter: repairs enchanted garments and armor, strengthens protections, upgrades gear, crafts magical boots/coats/gloves/cloaks and takes bespoke commissions. High-tier enchantments become available as characters progress, with rare materials sometimes needed. Each significant commission is personally fitted to the wearer and their abilities; item prices, stats and crafting mechanics not yet set. Serves ordinary local customers and Fog visitors without separating their lives. Odette’s line: “Darling, armor is supposed to keep you alive. That doesn’t mean you have to look like you’ve given up.”',
        status:'Canon'
      },
      {
        id:'castro_glitterbomb',name:'Glitterbomb',district:'castro',
        summary:'Gloriously flamboyant Castro cabaret and drag theatre: queens, kings, burlesque, comedians, singers, and over-the-top stage productions.',
        secret:'DM ONLY: Run by Dolly Trolley, a centuries-old changeling and legendary drag queen. Hot-pink neon, glitter, gold trim, disco balls, velvet curtains, backstage dressing rooms and a reputation for unforgettable shows. Human artists are celebrated on their own merits; illusions and magic occasionally enhance performances. Late-night Fog shows are possible. Dolly has known generations of queer San Franciscans and fiercely protects performers. Her trademark entrance: a cable-car bell rings and she declares, “Ding ding, darlings! Your ride to fabulous has arrived!” Primary neighborhood resonance Saelun; theatrical expression also echoes Eshara.',
        status:'Canon'
      },
      {
        id:'tenderloin_hyde_house',name:'Hyde Street House',district:'tenderloin',
        summary:'Independent nonprofit community resource center on Hyde Street offering practical support to immigrants, refugees, and longtime Tenderloin residents.',
        secret:'DM ONLY: Fictional organization inspired by real neighborhood mutual aid and immigrant-serving institutions, not a renamed real nonprofit. Services include language and citizenship classes, immigration legal-service referrals (not guaranteed legal representation), housing and employment assistance, family support and community gatherings. Some Awakened staff quietly assist new supernatural residents who need to understand the Fog, its concealment by the Confluence, and safe everyday housing. It is neither a magical authority nor a Conservatory outpost. Connects naturally to Jones Street Hotel and Pho15. A lived expression of Vaedrin: new arrivals building lives in San Francisco. Specific staff are undecided.',
        status:'Canon'
      },
      {
        id:'tenderloin_jones_hotel',name:'The Jones Street Hotel',district:'tenderloin',
        summary:'Century-old Tenderloin residential hotel on Jones Street, now home to long-term tenants and newcomers, ordinary humans and Fog residents alike.',
        secret:'DM ONLY: Historic single-room-occupancy-style residence with faded wallpaper, brass room numbers, aging elevator, shared facilities and a familiar front desk. Residents pay rent, maintain friendships and argue about laundry; the Confluence veils supernatural features from ordinary Surface perception. The hotel works informally with Hyde Street House on housing and neighborhood support. No magical extra floors, elevator portal, automatic haunting or sinister hidden hotel mythology—those pitches were explicitly discarded. Hotel manager and residents not yet developed. Vaedrin anchor.',
        status:'Canon'
      },
      {
        id:'tenderloin_pho15',name:'Pho15',district:'tenderloin',
        summary:'Beloved multigenerational Vietnamese family restaurant on Larkin Street in Little Saigon, named for San Francisco’s 415 area code.',
        secret:'DM ONLY: Exact official spelling is Pho15 (not Phö15 or Pho 15). Run by married owners Lan Trần (76, Awakened human, head cook) and Minh Trần (79, human, front of house). The couple settled in San Francisco during the 1980s and later established the restaurant. Lan is welcoming, sharp-witted and insists people eat before they talk through problems; her longtime Fog customers are treated as ordinary neighbors. Minh uses dry humor, handles the register and claims to be the boss despite Lan making most decisions. They bicker affectionately and share tea by the kitchen. Offers a familiar meal to Jones Street Hotel residents and sometimes helps feed Hyde Street House gatherings. Minh’s awareness of the Fog remains explicitly undecided. Vaedrin resonance.',
        status:'Canon'
      }
    ],
    npcs:[
      {
        id:'artie_bell',name:'Arthur “Artie” Bell',location:'castro_wildfire',
        summary:'73-year-old Awakened human man and longtime bartender who owns Wildfire, the Castro’s old-school gay dive bar.',
        secret:'DM ONLY: Sharp-tongued, funny, protective of younger queer visitors and longtime patrons; does not tolerate cruelty in his bar. Inherited Wildfire from his late partner Lou Moreno, its original founder. He has tended bar for over forty years; refuses to replace the jukebox. He knows the Fog but is not a magical authority or quest dispenser. Sample greeting: “You gonna stand there all night, sweetheart, or come make yourself at home?”',
        status:'Canon'
      },
      {
        id:'lou_moreno',name:'Luis “Lou” Moreno (deceased)',location:'castro_wildfire',
        summary:'Wildfire’s late founder and Artie Bell’s longtime partner, remembered in a photograph behind the bar.',
        secret:'DM ONLY: Founded Wildfire in the late 1970s and built it with Artie into an enduring neighborhood gathering place. Loved and remembered, not merely a plot device. His death’s circumstances and exact date are undefined; do not assign a cause without a deliberate later decision.',
        status:'Canon'
      },
      {
        id:'odette_copperfield',name:'Odette Copperfield',location:'castro_moth_needle',
        summary:'Older dwarven proprietor of Moth & Needle, legendary for couture, exacting craftsmanship and magical gear upgrades.',
        secret:'DM ONLY: Theatrical, witty, outspoken, exceptionally skilled in enchanted tailoring. Designs drag costumes and everyday outfits but also powerful custom magical armor, robes, coats and accessories. Takes time to understand each wearer. Can improve existing equipment and take ambitious future commissions; specific inventory, mechanics and prices open.',
        status:'Canon'
      },
      {
        id:'dolly_trolley',name:'Dolly Trolley',location:'castro_glitterbomb',
        summary:'Centuries-old changeling drag queen and legendary proprietor of Glitterbomb, Castro’s flamboyant cabaret and drag theatre.',
        secret:'DM ONLY: A larger-than-life performer with razor-sharp humor, towering wigs, rhinestone gowns and a deep commitment to her performers. She has lived through many identities and generations of queer San Francisco history. Trademark entrance accompanied by a cable-car bell: “Ding ding, darlings! Your ride to fabulous has arrived!”',
        status:'Canon'
      },
      {
        id:'lan_tran',name:'Lan Trần',location:'tenderloin_pho15',
        summary:'76-year-old Awakened human Vietnamese woman, head cook and co-owner of Pho15.',
        secret:'DM ONLY: Immigrated with Minh and settled in San Francisco in the 1980s. Warm, observant, outspoken; cooks treasured family recipes, knows patrons by name, and never wants anyone to go hungry. Many supernatural customers have eaten here for decades. Sample line: “Sit down. Eat first. Whatever it is, we talk after.” Married to Minh Trần.',
        status:'Canon'
      },
      {
        id:'minh_tran',name:'Minh Trần',location:'tenderloin_pho15',
        summary:'79-year-old Vietnamese man, Pho15 co-owner, storyteller, cashier and front-of-house host.',
        secret:'DM ONLY: Settled in San Francisco with Lan in the 1980s. Dry humor, keeps an old expenses notebook and resists replacing the cash register; claims he runs the business while Lan usually decides. Married to Lan. Sample line: “My wife says she’s retiring next year. She’s been saying that since 2004.” Whether Minh himself is Awakened or knows the Fog is UNDECIDED; do not assign either state automatically.',
        status:'Canon'
      }
    ]
  };
  let changes=0;
  function patch(type,item){
    if(!Array.isArray(data[type]))return;
    const old=data[type].find(x=>x.id===item.id);
    if(!old){data[type].push({...item});changes++;return;}
    // Deliberately exclude old.notes and any custom free-form fields.
    for(const key of ['name','district','location','summary','secret','status']){
      if(Object.prototype.hasOwnProperty.call(item,key)&&old[key]!==item[key]){
        old[key]=item[key];changes++;
      }
    }
  }
  for(const [type,items] of Object.entries(entries))for(const item of items)patch(type,item);
  const districtNotes=[
    ['castro','Castro','Neighborhood canon v7 — Castro: ',
      'Saelun anchor: chosen family, queer community and belonging. Established fictional locations: Wildfire, a historic gay dive bar owned by Artie Bell and founded by his late partner Lou Moreno; The Common Thread, independent history center integrated into the campaign version of Harvey Milk Plaza; Moth & Needle, Odette Copperfield’s enchanting tailor shop and powerful gear outfitter; Glitterbomb, Dolly Trolley’s flamboyant drag cabaret. The Common Thread also echoes Mereth, and Glitterbomb echoes Eshara. Distinguish the bar Wildfire from the Current Eshara. These venues sit alongside real Castro history, not secretly behind it.'],
    ['tenderloin','Tenderloin','Neighborhood canon v7 — Tenderloin: ',
      'Vaedrin anchor: immigrant experiences, passage, changing lives and cultural exchange. Established fictional locations: Hyde Street House, independent community support for newcomers and longtime residents; The Jones Street Hotel, residential home to both ordinary and Fog tenants (no nonexistent elevator floors); and Pho15, Lan and Minh Trần’s family-run Vietnamese restaurant on Larkin Street in Little Saigon, named for the 415 area code. The three share neighborly support, without belonging to an overarching magical institution. Respect real immigrant communities, transgender activism, neighborhood challenges and individual dignity.']
  ];
  for(const [id,name,marker,note] of districtNotes){
    if(!Array.isArray(data.districts))break;
    let d=data.districts.find(x=>x.id===id);
    if(!d){d={id,name,summary:id==='castro'?'Historic LGBTQ+ community neighborhood and Saelun anchor.':'Multicultural Tenderloin neighborhood and Vaedrin anchor.',secret:'',status:'Developing'};data.districts.push(d);changes++;}
    const previous=d.secret||'';
    const prefix=previous.includes('\n\n'+marker)?previous.split('\n\n'+marker)[0]:previous;
    const next=prefix+'\n\n'+marker+note;
    if(next!==d.secret){d.secret=next;changes++;}
    if(d.status==='Outline'||d.status==='Idea'){d.status='Developing';changes++;}
  }
  if(typeof LOCATION_PINS!=='undefined'&&Array.isArray(LOCATION_PINS)){
    const pins=[
      ['castro_wildfire',39.0,62.1,'W'],
      ['castro_common_thread',42.1,59.7,'C'],
      ['castro_moth_needle',39.0,66.0,'M'],
      ['castro_glitterbomb',44.0,64.2,'G'],
      ['tenderloin_hyde_house',55.0,50.8,'H'],
      ['tenderloin_jones_hotel',57.3,47.9,'J'],
      ['tenderloin_pho15',60.5,50.9,'15']
    ];
    for(const pin of pins)if(!LOCATION_PINS.some(p=>p[0]===pin[0]))LOCATION_PINS.push(pin);
  }
  if(changes&&typeof persist==='function'){try{persist();}catch(e){}}
  if(typeof render==='function')render();
})();