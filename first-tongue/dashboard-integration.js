(function installFirstTongue(){
  if (typeof data === "undefined" || !data || !Array.isArray(data.lore) ||
      typeof tabs === "undefined" || typeof render !== "function") return;
  let dirty=0;
  function add(kind,entry){if(!Array.isArray(data[kind]))return;if(!data[kind].some(x=>x.id===entry.id)){data[kind].push({...entry});dirty++;}}
  add("lore",{
    id:"first_tongue",name:"The First Tongue and Kethil Script",
    summary:"A largely lost supernatural language of ancient San Francisco, preserved in inscriptions and Conservatory scholarship.",
    secret:"DM ONLY: The First Tongue is a wholly fictional ancient language of the Fog's supernatural inhabitants, living alongside but distinct from the Yelamu. It is not Ramaytush nor a representation of actual Indigenous language or tradition. Few modern inhabitants speak it fluently. Inscribed stones, annotated artifacts and manuscripts preserve its grammar and writing, Kethil. The Conservatory maintains a language table at the main Golden Gate Park archive. Dr. Tessa Vale studies philology; Orun the goblin is a field epigrapher; Viv Chen is the Chinatown liaison, not a linguist. Nineteen Kethil signs include single glyphs for ae, sh, th. The First Tongue typically uses SOV clauses and compound roots. Five surviving Current names: Eshara (esha + ra; voice unrestrained), Orith (or + ith; seeking that makes), Saelun (sae + lun; holding one another), Mereth (mer + eth; memory that endures), Vaedrin (vae + drin; crossing into chosen change). Conservatory scholarship reconstructs simple inscriptions confidently and poetic nuances tentatively. Readable, printable references and the full SVG inscription maker are available through the dashboard's First Tongue tab.",
    status:"Canon"
  });
  add("npcs",{
    id:"tessa_vale",name:"Dr. Tessa Vale",
    summary:"Warm, meticulous Awakened human philologist who leads the Conservatory's First Tongue research.",
    secret:"DM ONLY: Tessa Vale oversees First Tongue language reconstruction at the main Conservatory library beneath Conservatory of Flowers. She distinguishes proven grammar from uncertain interpretations and collaborates with Orun and Viv Chen. She is a researcher, not a governing authority over the PCs.",
    status:"Canon"
  });
  add("npcs",{
    id:"orun_epigrapher",name:"Orun",
    summary:"Older goblin Scholar and field epigrapher studying Kethil inscriptions around San Francisco.",
    secret:"DM ONLY: Orun is enthusiastic, prone to scholarly digressions, and skilled in rubbings, provenance, and recognizing the tools that created Kethil inscriptions. Works with Dr. Tessa Vale in the Conservatory, liaising with Viv Chen on Chinatown discoveries.",
    status:"Canon"
  });
  const oldCurrents=data.lore.find(x=>x.id==="currents");
  if(oldCurrents){
    const patch={
      name:"Five Currents — Eshara, Orith, Saelun, Mereth, Vaedrin",
      summary:"Five ancient Currents of human experience: expression, invention, solidarity, remembrance, and passage.",
      secret:"DM ONLY: The five magical Currents originated in the land that became San Francisco long before modern settlement and flow everywhere across the city. They follow human experience and do NOT cause human history. Their First Tongue names preserved in inscriptions are Eshara (art, voice, expression, rebellion; Haight-Ashbury), Orith (invention, innovation, curiosity; SoMa), Saelun (love, chosen family and solidarity; Castro), Mereth (memory, history and preservation; Presidio), and Vaedrin (migration, exchange, personal change and self-determination; Chinatown and Tenderloin). Vaedrin combines the former Crossroads and Threshold concepts without erasing their distinct expressions. Eshara and Orith stay separate, reflecting San Francisco's art and technology. Their balance sustains the Confluence, which protects Surface life from supernatural dangers and veils the Fog from ordinary perception. These names are entirely fictional and not drawn from Indigenous words."
    };
    for(const [k,v] of Object.entries(patch)) if(oldCurrents[k]!==v){oldCurrents[k]=v;dirty++;}
  }
  const rename={Wildfire:"Eshara",Spark:"Orith",Covenant:"Saelun",Foundation:"Mereth",Crossroads:"Vaedrin",Threshold:"Vaedrin"};
  const re=/\b(Wildfire|Spark|Covenant|Foundation|Crossroads|Threshold)\b/g;
  for(const kind of ["districts","locations","npcs","lore","threads"]) for(const entry of data[kind]||[]){
    if(entry.id==="first_tongue"||entry.id==="currents")continue;
    for(const key of ["name","summary","secret"])if(typeof entry[key]==="string"){
      const newer=entry[key].replace(re,m=>rename[m]);
      if(newer!==entry[key]){entry[key]=newer;dirty++;}
    }
  }
  const conservatory=data.lore.find(x=>x.id==="conservatory");
  if(conservatory&&!(conservatory.secret||"").includes("Tessa Vale")){
    conservatory.secret=((conservatory.secret||"")+" Its language table includes philologist Dr. Tessa Vale and epigrapher Orun, who research the First Tongue and Kethil; Viv Chen is the Chinatown outpost liaison.").trim();dirty++;
  }
  if(dirty&&typeof persist==="function"){try{persist();}catch(e){}}
  const id="firstTongue";
  if(!tabs.some(t=>t[0]===id)){
    const j=tabs.findIndex(t=>t[0]==="sessions");
    tabs.splice(j<0?tabs.length:j,0,[id,"First Tongue"]);
  }
  let view="maker";
  const paths={
    maker:"first-tongue/kethil-workshop.html",
    gm:"first-tongue/gm-reference.html",
    player:"first-tongue/player-primer.html",
    handouts:"first-tongue/inscription-handouts.html"
  };
  const v=[
    {id:"maker",title:"Kethil Inscription Maker",sub:"Live SVG engravings, searchable 133-word dictionary, original glyphs.",dm:true},
    {id:"gm",title:"Conservatory GM Reference",sub:"16 folios: complete language, lore, grammar and puzzle solutions.",dm:true},
    {id:"player",title:"Player Language Primer",sub:"Spoiler-safe introduction, pronunciation, names, and letter forms.",dm:false},
    {id:"handouts",title:"Printable Inscription Handouts",sub:"Five Kethil-encoded clues with spaces for player notes.",dm:false}
  ];
  const currents=[
    ["Eshara","Voice unrestrained","Art · Expression · Rebellion"],
    ["Orith","Seeking that makes","Invention · Innovation"],
    ["Saelun","Holding one another","Belonging · Chosen family"],
    ["Mereth","Memory that endures","History · Remembrance"],
    ["Vaedrin","Chosen passage","Migration · Transformation"]
  ];
  const style=document.createElement("style");
  style.textContent=`
  .ft-kicker{color:#bba98a;font:700 11px system-ui,sans-serif;letter-spacing:.16em;text-transform:uppercase}
  .ft-head h2{font:normal clamp(28px,4vw,43px) Georgia,serif;margin:4px 0 7px}
  .ft-head p{color:#bfccd0;max-width:760px;line-height:1.6}
  .ft-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:9px;margin:17px 0}
  .ft-current{background:#1d2b33;border:1px solid #415059;border-radius:10px;padding:13px}
  .ft-current strong{display:block;color:#ead7a5;font:normal 22px Georgia,serif}
  .ft-current em{display:block;color:#e2e6e7;font-style:normal;margin:6px 0 2px}
  .ft-current small{color:#9eabb1;font-size:12px}
  .ft-views{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px;margin:18px 0}
  .ft-view{border:1px solid #485c64;background:#1d2b33;color:#eaf1f1;padding:15px;text-align:left;border-radius:10px;min-height:104px;cursor:pointer}
  .ft-view strong{display:block;font-size:15px;margin-bottom:7px}
  .ft-view small{display:block;color:#b4c0c7;font-size:12px;line-height:1.45}
  .ft-view.active{background:#324b52;outline:2px solid #b7a17b}
  .ft-body{background:#182329;border:1px solid #405058;border-radius:11px;padding:13px;margin-top:12px}
  .ft-tools{display:flex;gap:8px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin:0 0 12px}
  .ft-tools a{color:#f1d8a6;text-decoration:underline}
  .ft-frame{display:block;border:0;background:#f6f3e9;border-radius:7px;width:100%;height:min(1100px,80vh);min-height:580px}
  .ft-desc{font-size:13px;color:#a7b4bd}
  .ft-privacy{font-size:12px;color:#aeb9ba;border-left:3px solid #b9a178;padding-left:12px;margin:15px 0}
  body.player .ft-gm{display:none!important}
  @media(max-width:750px){.ft-frame{height:78vh;min-height:500px}.ft-view{min-height:92px}}
  `;
  document.head.appendChild(style);
  function archiveHTML(){
    const player=!!mode||document.body.classList.contains("player");
    if(player&&(view==="gm"||view==="maker"))view="player";
    const current=v.find(x=>x.id===view)||v[2];
    return `<div class="ft-head"><span class="ft-kicker">THE CONSERVATORY · LANGUAGE ARCHIVE</span>
      <h2>The First Tongue</h2>
      <p>A largely forgotten supernatural language of ancient San Francisco. Research its five named Currents, decode Kethil inscriptions, and prepare handouts without leaving your campaign dashboard.</p></div>
      <div class="ft-list">${currents.map(c=>`<div class="ft-current"><strong>${c[0]}</strong><em>${c[1]}</em><small>${c[2]}</small></div>`).join("")}</div>
      <p class="ft-desc ft-gm">Conservatory linguists Dr. Tessa Vale and Orun study the First Tongue at the Golden Gate Park library; Viv Chen coordinates with Chinatown. This language is entirely fictional and separate from real Indigenous languages.</p>
      <div class="ft-views">${v.map(x=>`<button type="button" class="ft-view ${x.dm?"ft-gm":""} ${view===x.id?"active":""}" data-ft-view="${x.id}" aria-pressed="${view===x.id}"><strong>${x.title}</strong><small>${x.sub}</small></button>`).join("")}</div>
      <div class="ft-body"><div class="ft-tools"><strong>${current.title}</strong><a href="${paths[view]}" target="_blank" rel="noopener noreferrer">Open full page ↗</a></div>
      <iframe class="ft-frame" title="${current.title}" loading="eager" src="${paths[view]}"></iframe>
      <p class="ft-desc" style="margin:9px 2px 2px">The Kethil maker works here, including its SVG download. Open a resource separately for full-screen research or printing.</p></div>
      <p class="ft-privacy ft-gm">GM pages contain puzzles and answers. Player-safe view shows only the primer and handouts; this is a display filter, not access control.</p>`;
  }
  const previousRender=render;
  render=function(){
    if(tab!==id)return previousRender();
    nav();
    const app=document.getElementById("app");
    if(!app)return;
    app.innerHTML=archiveHTML();
    app.querySelectorAll("[data-ft-view]").forEach(el=>el.onclick=()=>{view=el.dataset.ftView;render();});
  };
  if(typeof mapHome==="function"){
    const olderMap=mapHome;
    mapHome=function(){
      let html=olderMap();
      if(!html.includes('data-jump="firstTongue"')){
        html=html.replace('data-jump="lore"',
          'data-jump="firstTongue">First Tongue Archive</button><button class="action" data-jump="lore"');
      }
      return html;
    };
  }
  const toggle=document.getElementById("playerMode");
  if(toggle)toggle.addEventListener("change",()=>{if(toggle.checked&&(view==="maker"||view==="gm"))view="player";if(tab===id)render();});
  render();
})();
/* Load Castro / Tenderloin additions after the First Tongue migration. */
(function loadNeighborhoodCanonV7(){
  if(document.querySelector('script[data-canon-version="v7"]'))return;
  const script=document.createElement('script');
  script.src='campaign-update-v7.js';
  script.async=false;
  script.dataset.canonVersion='v7';
  script.addEventListener('load',function(){
    if(document.querySelector('script[data-canon-version="v8"]'))return;
    const next=document.createElement('script');
    next.src='campaign-update-v8.js';
    next.async=false;
    next.dataset.canonVersion='v8';
    (document.body||document.head).appendChild(next);
  });
  (document.body||document.head).appendChild(script);
})();
