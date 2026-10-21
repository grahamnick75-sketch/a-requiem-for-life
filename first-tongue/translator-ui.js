(function installTranslatorUI(){
 'use strict';
 if(!window.FTTranslator||!document.getElementById('phrase'))return;
 const left=document.querySelector('main .pane');
 if(!left)return;
 const header=left.querySelector('h2');
 if(header)header.textContent='First Tongue Studio';
 const section=document.createElement('section');
 section.id='firstTongueTranslator';
 section.innerHTML=`
 <div class="ftm-tabs" role="group" aria-label="Studio mode">
  <button type="button" id="ftm-english-mode" class="ftm-tab active" aria-pressed="true">Translate English</button>
  <button type="button" id="ftm-kethil-mode" class="ftm-tab" aria-pressed="false">Write First Tongue</button>
 </div>
 <div id="ftm-translator" class="ftm-panel">
  <p class="hint">This translator uses the Conservatory's documented vocabulary and grammatical patterns. Missing words are flagged, never invented.</p>
  <label for="ftm-input">Your English sentence</label>
  <textarea id="ftm-input" rows="3" spellcheck="true" placeholder="Remember who you are.">Remember who you are.</textarea>
  <div class="ftm-options">
   <div><label for="ftm-we">Meaning of “we”</label>
    <select id="ftm-we"><option value="inclusive">Includes the listener — sai</option><option value="exclusive">Excludes the listener — sin</option></select></div>
   <button class="btn" id="ftm-go" type="button">Translate and render Kethil</button>
  </div>
  <div class="ftm-examples"><span>Try:</span>
   <button type="button" data-example="Remember who you are.">Remember who you are.</button>
   <button type="button" data-example="I will remember you.">I will remember you.</button>
   <button type="button" data-example="Open the gate!">Open the gate!</button>
   <button type="button" data-example="I will remember you.&#10;You will remember me.&#10;And when I move on.&#10;Hold my memory gently.">Birdie’s lullaby (four lines)</button>
   <button type="button" data-example="The fog protects the city.">Missing-vocabulary example</button>
  </div>
  <div class="ftm-result" id="ftm-result" aria-live="polite">
   <div class="ftm-result-top"><strong id="ftm-status">Ready</strong><button class="btn secondary" id="ftm-copy" type="button">Copy translation</button></div>
   <div id="ftm-out" class="ftm-out">—</div>
   <div id="ftm-speech" class="ftm-speech"></div>
   <div id="ftm-gloss" class="ftm-gloss"></div>
   <div id="ftm-notes" class="ftm-notes"></div>
  </div>
 </div>
 <hr class="ftm-divider"><h3 class="ftm-caption">Kethil inscription preview</h3>
 `;
 left.insertBefore(section,header?header.nextSibling:left.firstChild);
 const style=document.createElement('style');
 style.textContent=`
 [hidden]{display:none!important}
 .ftm-tabs{display:flex;gap:8px;flex-wrap:wrap;border-bottom:1px solid #c6d5d0;margin:4px 0 17px;padding-bottom:12px}
 .ftm-tab{padding:9px 13px;border:1px solid #9fbab4;border-radius:8px;color:#24454b;background:#fafdfb;cursor:pointer;font-weight:700}
 .ftm-tab.active{background:#24464a;color:#fff;border-color:#24464a}
 .ftm-panel{padding:13px 15px;background:#eff5f0;border:1px solid #cadbd3;border-radius:9px}
 .ftm-panel textarea{min-height:83px}
 .ftm-options{display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end;margin:12px 0}
 .ftm-options>div{flex:1;min-width:210px}.ftm-options label{margin:2px 0 5px}
 .ftm-options select{padding:9px;border:1px solid #9bb3ac;border-radius:7px;background:white;color:#243e43;width:100%;font-size:14px;min-height:41px}
 .ftm-examples{display:flex;gap:7px;flex-wrap:wrap;align-items:center;margin:12px 0;color:#597072;font-size:12px}
 .ftm-examples button{border:1px solid #c4d5ce;border-radius:20px;padding:5px 9px;background:#fff;color:#21545b;cursor:pointer;font-size:12px}
 .ftm-result{background:#fffefa;border:1px solid #b5c9c4;border-radius:9px;padding:13px;margin-top:13px}
 .ftm-result.error{background:#fff7f3;border-color:#c6aca2}
 .ftm-result-top{display:flex;justify-content:space-between;gap:8px;align-items:center;flex-wrap:wrap}
 .ftm-result-top strong{font-size:13px;color:#276063}.ftm-result.error strong{color:#a15342}
 .ftm-result-top .btn{font-size:12px;padding:7px 10px}
 .ftm-out{font:normal 25px/1.35 Georgia,serif;white-space:pre-wrap;color:#203c43;margin:10px 0}
 .ftm-speech{font-size:14px;color:#567071;white-space:pre-wrap}
 .ftm-gloss{display:flex;gap:6px;flex-wrap:wrap;margin:12px 0 0}
 .ftm-gloss span{font-size:12px;background:#e8f0ec;border-radius:7px;padding:5px 7px}
 .ftm-notes{font-size:13px;color:#5d6b6d;margin-top:10px;white-space:pre-line}
 .ftm-divider{border:0;border-top:1px solid #cbd7d1;margin:18px 0 12px}
 .ftm-caption{margin:0 0 5px;font:500 20px Georgia,serif}
 @media(max-width:600px){.ftm-options>.btn{width:100%}.ftm-out{font-size:21px}}
 @media print{#firstTongueTranslator,.ftm-divider,.ftm-caption{display:none!important}}
 `;
 document.head.appendChild(style);
 const el=id=>document.getElementById(id);
 const input=el('ftm-input'),we=el('ftm-we'),result=el('ftm-result');
 const out=el('ftm-out'),status=el('ftm-status'),speech=el('ftm-speech');
 const gloss=el('ftm-gloss'),notes=el('ftm-notes'),copy=el('ftm-copy');
 let latest='';
 function translateNow(){
  const resultData=window.FTTranslator.translate(input.value,{exclusive:we.value==='exclusive'});
  result.classList.toggle('error',!resultData.ok);
  gloss.replaceChildren();
  if(!resultData.ok){
   latest='';
   status.textContent='Translation needs more vocabulary';
   out.textContent='No translation generated';
   speech.textContent='';
   notes.textContent='Unsupported: '+resultData.missing.join(', ')+'.\nYour previous inscription was not changed. Rephrase or consult the dictionary.';
   copy.disabled=true;
   return;
  }
  latest=resultData.firstTongue;
  status.textContent=resultData.notes.length?'Translated · interpretation notes':'Translated · established rules';
  out.textContent=latest;
  speech.textContent='Pronunciation (approx.): '+resultData.pronunciation;
  for(const [en,ft] of resultData.breakdown){
   const span=document.createElement('span');span.textContent=en+' → '+ft;gloss.appendChild(span);
  }
  notes.textContent=resultData.notes.length?resultData.notes.join('\n'):'Built using documented roots, SOV word order, and established particles.';
  copy.disabled=false;
  const firstTongue=el('phrase');firstTongue.value=latest;drawInscription();
 }
 el('ftm-go').addEventListener('click',translateNow);
 input.addEventListener('keydown',e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();translateNow();}});
 we.addEventListener('change',translateNow);
 document.querySelectorAll('[data-example]').forEach(b=>b.addEventListener('click',()=>{input.value=b.dataset.example;translateNow();}));
 copy.addEventListener('click',async()=>{
  if(!latest)return;
  try{await navigator.clipboard.writeText(latest);status.textContent='Translation copied.';}
  catch(e){status.textContent='Select translation above to copy.';}
 });
 function switchMode(english){
  el('ftm-translator').hidden=!english;
  for(const [id,on] of [['ftm-english-mode',english],['ftm-kethil-mode',!english]]){
   const button=el(id);button.classList.toggle('active',on);button.setAttribute('aria-pressed',String(on));
  }
 }
 el('ftm-english-mode').addEventListener('click',()=>switchMode(true));
 el('ftm-kethil-mode').addEventListener('click',()=>switchMode(false));
 translateNow();
})();