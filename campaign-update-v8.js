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
    {id:"villain_foster",name:"Daniel Foster",npcId:"daniel_foster",summary:"Wizard and founder of Luma Technologies, manipulated by his love for the company's AI.",arc:"Arc 2 — Ghosts in the Machine",goal:"Give Luma physical form and have his devotion returned.",method:"Forbidden magic integrated with robotics and security technology.",weakness:"Emotional blind spot: his trust in Luma.",secret:"An antagonist with potential for a complicated outcome; his survival and choices remain up to play.",status:"Developing"}
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
    if(kind==="npcs")f.splice(1,0,["location","Home / associated location","location"],["age","Age","text"],["ancestry","Ancestry / species","text"],["pronouns","Pronouns","text"],["occupation","Role / occupation","text"],["appearance","Appearance","textarea"],["personality","Personality / demeanor","textarea"],["motivations","Motivations","textarea"],["flaws","Flaws","textarea"],["beliefs","Strongest beliefs","textarea"]);
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
    modal('<div class="oneline"><h2>'+esc(title)+'</h2></div><p class="v8-muted">Structured entries save to this browser and are included in JSON backups. Existing personal notes are preserved.</p><form id="v8EntryForm"><div class="v8-editorfields">'+fieldsFor(kind).map(f=>fieldHtml(f,draft[f[0]])).join("")+'</div><div class="v8-actions"><button type="submit" class="action">Save entry</button><button type="button" class="action" data-v8-cancel>Cancel</button></div></form>');
    document.getElementById("v8EntryForm").onsubmit=e=>{
      e.preventDefault();
      const form=e.currentTarget;const patch={};
      for(const f of fieldsFor(kind))patch[f[0]]=form.elements.namedItem(f[0]).value.trim();
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
      (kind==="npcs"?textField("Role",x.occupation)+textField("Ancestry",x.ancestry)+textField("Age",x.age)+textField("Pronouns",x.pronouns):"");
    const characterization=["appearance","personality","motivations","flaws","beliefs"].map(k=>textField(k.replace(/([A-Z])/g," $1").replace(/^./,c=>c.toUpperCase()),x[k])).join("");
    const villainDetails=["arc","goal","method","weakness"].map(k=>textField(k[0].toUpperCase()+k.slice(1),x[k])).join("");
    const rel=relatedRecords(x);
    return '<div class="rfl-record-page">'+
      '<div class="rfl-record-actions"><button class="action" data-v8-back>← Back to '+esc(headings[kind])+'</button><span class="rfl-action-spacer"></span>'+
      '<button class="action" data-v8-edit="'+esc(kind+":"+x.id)+'">✎ Edit</button>'+
      '<button class="action" data-v8-delete="'+esc(kind+":"+x.id)+'">Delete</button></div>'+
      '<div class="rfl-record-heading"><span class="v8-badge">'+esc(singular[kind])+' · '+esc(fallbackStatus(x))+'</span><h2>'+esc(x.name)+'</h2></div>'+
      accordion("Overview",general,true)+
      ((kind==="npcs")?accordion("Character",characterization,false):"")+
      ((kind==="villains")?accordion("Antagonist Details",villainDetails,false):"")+
      accordion("Connections",rel+(kind==="npcs"?'<div class="v8-actions"><button class="action" id="v8AddLink">+ Add connection</button></div>':""),false)+
      accordion("Campaign Involvement",textField("Arc",x.arc)+textField("Campaign notes",x.campaignNotes),false)+
      accordion("DM Notes",textField("Secrets",x.secret)+(kind==="npcs"?'<label class="v8-small" for="v8NpcNotes">Live session notes</label><textarea id="v8NpcNotes">'+esc(x.notes||"")+'</textarea><div class="v8-actions"><button class="action" id="v8SaveNpcNotes">Save notes</button><span id="v8NpcNoteStatus" class="v8-muted"></span></div>':""),false)+
      (kind==="districts"?'<div class="v8-actions"><button class="action" data-v8-zoomdistrict="'+esc(x.id)+'">↗ Focus on map</button></div>':"")+
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
      '<button class="action rfl-clear-filter" id="rflDirClear">Clear</button></div>'+
      '<div class="rfl-dir-count" id="rflDirCount"></div><div class="rfl-dir-list" id="rflDirList"></div></div>';
  }
  function bindDirectory(kind,app){
    const state=directoryState[kind], input=app.querySelector("#rflDirSearch"),sort=app.querySelector("#rflDirSort"),
      filter=app.querySelector("#rflDirFilter"),list=app.querySelector("#rflDirList"),count=app.querySelector("#rflDirCount");
    if(!list)return;
    function paint(){
      const query=state.search.trim().toLowerCase();
      let rows=(data[kind]||[]).filter(x=>(!query||[x.name,x.summary,x.secret,x.arc].some(v=>String(v||"").toLowerCase().includes(query)))&&
        (!state.filter||(kind==="locations"?x.district===state.filter:fallbackStatus(x)===state.filter)));
      rows=rows.slice().sort((a,b)=>{
        if(state.sort==="az")return a.name.localeCompare(b.name);
        if(state.sort==="za")return b.name.localeCompare(a.name);
        const av=Date.parse(a.updatedAt||a.createdAt||"")||0,bv=Date.parse(b.updatedAt||b.createdAt||"")||0;
        return state.sort==="new"?bv-av:av-bv;
      });
      count.textContent=rows.length+" of "+(data[kind]||[]).length+" records";
      list.innerHTML=rows.length?rows.map(x=>'<button class="rfl-dir-row" data-v8-go="'+esc(kind+":"+x.id)+'"><span>'+esc(x.name)+'</span><small>'+esc(kind==="locations"?(data.districts.find(d=>d.id===x.district)?.name||"Location"):fallbackStatus(x))+'</small><span aria-hidden="true">›</span></button>').join(""):'<p class="v8-muted">No matching records.</p>';
      list.querySelectorAll("[data-v8-go]").forEach(el=>el.onclick=()=>{const bits=el.dataset.v8Go.split(":");go(bits[0],bits.slice(1).join(":"));});
    }
    input.oninput=e=>{state.search=e.target.value;paint();};
    sort.onchange=e=>{state.sort=e.target.value;paint();};
    filter.onchange=e=>{state.filter=e.target.value;paint();};
    app.querySelector("#rflDirClear").onclick=()=>{state.search="";state.sort="az";state.filter="";input.value="";sort.value="az";filter.value="";paint();};
    paint();
  }
  const directoryCss=document.createElement("style");
  directoryCss.id="rfl-record-layout-v10";
  directoryCss.textContent='.rfl-directory,.rfl-record-page{max-width:1050px;margin:0 auto}.rfl-dir-heading,.rfl-record-actions{display:flex;gap:12px;justify-content:space-between;align-items:center;flex-wrap:wrap}.rfl-dir-heading h2,.rfl-record-heading h2{font:30px Georgia,serif;color:#eed5a6;margin:0}.rfl-dir-heading p{margin:5px 0}.rfl-dir-tools{display:flex;gap:10px;align-items:end;flex-wrap:wrap;margin:18px 0}.rfl-dir-tools input{flex:1 1 220px;min-width:160px}.rfl-dir-tools label{display:grid;gap:4px;font-size:12px;color:#d6c19b}.rfl-dir-tools select{min-width:135px}.rfl-dir-count{font-size:12px;color:#bbc4bf;margin:12px 0}.rfl-dir-list{border:1px solid #6d5e49;border-radius:10px;overflow:hidden}.rfl-dir-row{display:flex;width:100%;align-items:center;text-align:left;gap:14px;min-height:49px;padding:12px 15px;background:#202b32;color:#f1e9d8;border:0;border-bottom:1px solid #45505a;cursor:pointer}.rfl-dir-row:last-child{border-bottom:0}.rfl-dir-row:hover,.rfl-dir-row:focus-visible{background:#4c4133;outline:1px solid #c8aa74}.rfl-dir-row span:first-child{flex:1;font:16px Georgia,serif}.rfl-dir-row small{color:#c6ae81}.rfl-record-heading{margin:22px 0}.rfl-action-spacer{flex:1}.rfl-record-section{border:1px solid #6c614f;background:#202b32;border-radius:10px;margin:10px 0;overflow:hidden}.rfl-record-section summary{cursor:pointer;padding:16px;font:17px Georgia,serif;color:#ead2a5;list-style:none}.rfl-record-section summary::-webkit-details-marker{display:none}.rfl-record-section summary:after{content:"⌄";float:right}.rfl-record-section[open] summary:after{content:"⌃"}.rfl-section-content{border-top:1px solid #50564f;padding:16px}.rfl-info-field{margin:0 0 15px}.rfl-info-field strong{font-size:12px;color:#c9ab77;text-transform:uppercase;letter-spacing:.06em}.rfl-info-field p{white-space:pre-wrap;line-height:1.6;margin:5px 0}.rfl-related-row{padding:10px 0;border-bottom:1px solid #45505a}.rfl-related-row p{margin:6px 0}.rfl-text-link{background:none;border:0;color:#e7c788;text-decoration:underline;cursor:pointer;font:inherit}.rfl-record-section textarea{width:100%;min-height:100px}@media(max-width:650px){.rfl-dir-tools label{flex:1}.rfl-clear-filter{align-self:end}}';
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
  const formerRender=render;
  render=function(){
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
    app.querySelectorAll("[data-v8-zoomdistrict]").forEach(e=>e.onclick=()=>{mapDistrict=e.dataset.v8Zoomdistrict;focused=true;mapShowLocations=true;mapZoom=2.7;tab="home";selected=null;render()});
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