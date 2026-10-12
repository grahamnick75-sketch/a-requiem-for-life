/* Conservatory working translator: English -> attested First Tongue.
   Strictly rejects unrecognized words instead of manufacturing vocabulary.
   Uses LEXICON from the original Kethil workshop. */
(function(){
'use strict';
const lexSet=new Set(LEXICON.map(x=>x.word.toLowerCase()));
const nouns=new Map(),verbs=new Map(),qualities=new Map();
function install(target,rows){for(const [ft,aliases] of rows)for(const en of aliases.split('|'))target.set(en.trim(),ft);}
install(nouns,[
['esha','voice|expression|song'],['esh','sound|note'],['or','curiosity'],['ith','craft'],['sae','together|mutuality'],['lun','shelter'],['mer','remembrance'],['eth','endurance'],['vae','passage'],['drin','transformation|choice'],
['var','person|individual|human'],['varum','people|crowd|gathering'],['ena','life|breath'],['nil','self|identity'],['tal','name'],['nel','friend|companion'],['sur','stranger|visitor'],['ani','child'],['lir','love'],['elu','joy|delight'],['saren','sorrow|grief|sadness'],['veth','fear|dread'],['selu','trust'],['haren','mercy|compassion'],['kor','cruelty'],['kir','wound|injury|hurt'],['hei','hope'],['lim','truth'],['tar','promise|pledge'],['saetar','pact|bond|mutual promise'],['saevar','community'],
['nara','fog|mist'],['sir','sea|ocean'],['thul','tide'],['hal','land|earth|ground'],['kar','stone|rock'],['sil','wind|air'],['oru','dawn|sunrise|first light'],['thei','shade|shadow'],['sela','star'],['vere','rain'],['mara','tree'],['shul','wave'],['darel','shore|coast'],['telu','hearth'],['vahar','home|dwelling|house'],['den','gate|door|opening'],['merir','archive|memorial repository'],['vaeir','crossing place'],['saeir','meeting place'],['ithir','workshop'],['kethil','writing|inscription'],
['ari','beginning'],['lem','now'],['sere','afterward'],['taren','ancestor'],['tir','night'],['ele','day'],['neth','death'],['meren','memory'],['ethen','endurance'],['oren','question'],['vaeen','crossing'],['drinen','becoming'],['esha-en','self-expression'],['nor','forgetfulness'],['il','line|trail|stroke'],['nul','zero'],['lin','one'],['dus','two'],['vos','three'],['kel','four'],['thal','five'],['ithen','invention'],['ithel','inventor|maker'],['merel','witness'],['eshael','singer|speaker'],['orel','seeker|investigator'],['ser','system|structure|arrangement'],['serith','machine|mechanism|apparatus'],['rath','energy|force'],['tash','path|route|road'],['varil','footprint|trace']
]);
install(verbs,[['esha','sing|speak|express'],['ra','rise|resist|rebel'],['or','seek|search|ask|look for'],['ith','make|create|craft|engineer|invent'],['lun','hold|shelter|sustain'],['mer','remember|recall'],['eth','endure|last'],['vae','cross|travel|pass'],['drin','become|transform'],['ena','live|breathe'],['lir','love|cherish'],['selu','trust|entrust'],['haren','show mercy'],['kir','hurt|wound'],['hei','hope'],['tar','promise|pledge'],['ven','see|witness'],['mas','hear|listen'],['len','understand|learn|know'],['vel','vanish|disappear'],['dur','erase|remove'],['keth','write|inscribe'],['riv','read|decipher'],['kal','open'],['dak','close|lock|seal'],['dar','give|offer'],['vak','take|carry'],['nam','share'],['ther','bind|restrain'],['ham','protect|defend|save'],['nira','walk'],['mal','change|alter'],['mar','build|assemble'],['ner','stand|remain|stay'],['siv','return|come back'],['las','touch'],['rav','shout|call out'],['veth','fear']]);
install(qualities,[['nar','alone|lonely'],['nor','forgotten|overlooked'],['ari','first'],['lim','true'],['sae','together']]);
const pronouns={i:'mi',me:'mi',you:'ti',he:'sa',she:'sa',it:'sa',him:'sa',her:'sa',they:'ter',them:'ter',we:'sai',us:'sai'};
const possessive={my:'mi',your:'ti',his:'sa',her:'sa',its:'sa',their:'ter',our:'sai'};
const post={in:'lu',within:'lu',inside:'lu',with:'al',alongside:'al',from:'ren',toward:'vai',towards:'vai',to:'vai'};
const aux=new Set(['do','does','did',"don't","doesn't","didn't",'will',"won't",'shall','not','never']);
const norm=s=>s.toLowerCase().replace(/[’]/g,"'").trim();
const words=s=>norm(s).match(/[a-z]+(?:'[a-z]+)?/g)||[];
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
function lookup(map,ts,i){
 for(let n=Math.min(3,ts.length-i);n>=1;n--){
  const phrase=ts.slice(i,i+n).join(' ');
  if(map.has(phrase))return {ft:map.get(phrase),en:phrase,n,past:false,plural:false};
  if(n===1){
   const tryForms=[phrase];
   if(phrase.endsWith('ies'))tryForms.push(phrase.slice(0,-3)+'y');
   if(phrase.endsWith('es'))tryForms.push(phrase.slice(0,-2));
   if(phrase.endsWith('s'))tryForms.push(phrase.slice(0,-1));
   if(phrase.endsWith('ed'))tryForms.push(phrase.slice(0,-2),phrase.slice(0,-1));
   if(phrase.endsWith('ing'))tryForms.push(phrase.slice(0,-3),phrase.slice(0,-3)+'e');
   for(const f of tryForms)if(map.has(f))return {ft:map.get(f),en:phrase,n:1,past:phrase.endsWith('ed'),plural:phrase.endsWith('s')&&!phrase.endsWith('ss')};
  }
 }
 return null;
}
function phrase(ts,opts,parsePrep=true){
 let ft=[],breakdown=[],missing=[];
 for(let i=0;i<ts.length;){
  const t=ts[i];
  if(['the','a','an'].includes(t)){i++;continue;}
  if(Object.prototype.hasOwnProperty.call(possessive,t)&&!(t==='her'&&i===ts.length-1)){
   const p=t==='our'&&opts.exclusive?'sin':possessive[t];
   ft.push(p,'i');breakdown.push([t,p+' i']);i++;continue;
  }
  if(parsePrep&&Object.prototype.hasOwnProperty.call(post,t)){
   const next=phrase(ts.slice(i+1),opts,false);
   ft.push(...next.ft,post[t]);breakdown.push(...next.breakdown,[t,post[t]]);missing.push(...next.missing);
   return {ft,breakdown,missing};
  }
  if(Object.prototype.hasOwnProperty.call(pronouns,t)){
   const p=opts.exclusive&&['we','us'].includes(t)?'sin':pronouns[t];
   ft.push(p);breakdown.push([t,p]);i++;continue;
  }
  let m=lookup(nouns,ts,i),type='noun';
  if(!m){m=lookup(qualities,ts,i);type='quality';}
  if(m){ft.push(m.ft);breakdown.push([m.en,m.ft]);if(type==='noun'&&m.plural){ft.push('se');breakdown.push(['plural','se']);}i+=m.n;continue;}
  missing.push(t);i++;
 }
 return {ft,breakdown,missing};
}
function simple(sentence,opts){
 const ts=words(sentence),missing=[],notes=[];
 const base=norm(sentence).replace(/[.!?]+$/,'');
 const special={
  'remember who you are':['Ti i nil ha mer.','Idiomatic paraphrase: "Remember your self." Relative clauses are not yet reconstructed.'],
  "don't forget who you are":['Ti i nil ha mer.','Idiomatic paraphrase: "Remember your self," not a literal negated-forget construction.'],
  'the bond does not vanish':['Saelun nu vel.','Poetic use of Saelun as the bond itself.']
 };
 if(special[base]){
  const [ft,note]=special[base];
  return {ok:true,ft,missing:[],notes:[note],breakdown:[['idiomatic rendering',ft.replace(/[.!?]$/,'')]]};
 }
 if(!ts.length)return {ok:false,ft:'',missing:['Empty sentence'],notes,breakdown:[]};
 const question=sentence.trim().endsWith('?');
 if(question&&['do','does','did'].includes(ts[0]))ts.shift();
 let idx=-1,v=null;
 for(let j=0;j<ts.length;j++)if((v=lookup(verbs,ts,j))){idx=j;break;}
 if(idx<0){
  const at=ts.findIndex(t=>['am','is','are','was','were'].includes(t));
  if(at<0)return {ok:false,ft:'',missing:['No supported verb or predicate: '+ts.join(' ')],notes,breakdown:[]};
  const subject=phrase(ts.slice(0,at),opts),predTs=ts.slice(at+1),negative=predTs[0]==='not';
  if(negative)predTs.shift();
  const pred=phrase(predTs,opts);
  missing.push(...subject.missing,...pred.missing);
  if(!pred.ft.length)missing.push('Missing predicate');
  const out=[...subject.ft,...(negative?['nu']:[]),...pred.ft,...(question?['ke']:[])];
  return {ok:!missing.length,ft:!missing.length?cap(out.join(' '))+(question?'?':'.'):'',missing,notes:["Present 'to be' is normally omitted."],
   breakdown:[...subject.breakdown,...(negative?[['not','nu']]:[]),...pred.breakdown,...(question?[['question','ke']]:[])]};
 }
 const command=idx===0,before=ts.slice(0,idx),ai=before.findIndex(t=>aux.has(t));
 const sub=command?[]:before.slice(0,ai<0?before.length:ai);
 const markers=command?[]:(ai<0?[]:before.slice(ai));
 if(!command&&!sub.length)missing.push('Missing subject');
 const subject=phrase(sub,opts),obj=phrase(ts.slice(idx+v.n),opts);
 missing.push(...subject.missing,...obj.missing);
 const future=markers.includes('will')||markers.includes('shall')||markers.includes("won't");
 const past=markers.includes('did')||markers.includes("didn't")||v.past;
 const negative=markers.some(t=>['not','never',"don't","doesn't","didn't","won't"].includes(t));
 const unknownMarker=markers.filter(t=>!aux.has(t));if(unknownMarker.length)missing.push(...unknownMarker);
 if(future&&past)missing.push('Conflicting time markers');
 if(future&&negative)notes.push('Future plus negation is a cautious grammatical reconstruction.');
 if(opts.exclusive&&sub.includes('we'))notes.push('We excludes the listener (sin).');
 if(sub.includes('we')&&!opts.exclusive)notes.push('We includes the listener (sai).');
 if(ts.some(t=>['he','she','him','her'].includes(t)))notes.push('The First Tongue uses gender-neutral sa.');
 const parts=[...subject.ft,...obj.ft,...(command?['ha']:[]),...(past?['ya']:[]),...(future?['vei']:[]),...(negative?['nu']:[]),v.ft,...(question?['ke']:[])];
 const breakdown=[...subject.breakdown,...obj.breakdown,...(command?[['imperative','ha']]:[]),...(past?[['completed/past','ya']]:[]),...(future?[['future/intended','vei']]:[]),...(negative?[['not','nu']]:[]),[v.en,v.ft],...(question?[['question','ke']]:[])];
 return {ok:!missing.length,ft:!missing.length?cap(parts.join(' '))+(question?'?':'.'):'',missing,notes,breakdown};
}
const pronunciations={mi:'mee',ti:'tee',sa:'sah',sai:'sigh',sin:'sin',ter:'tehr',i:'ee',al:'ahl',nu:'noo',ya:'yah',vei:'vay',ha:'hah',ke:'keh',tal:'tahl',mer:'mehr',nel:'nehl',nil:'neel',ner:'nehr',den:'dehn',kal:'kahl',eth:'ehth',vel:'vehl',saelun:'SAY-loon',esha:'EH-shah',eshara:'eh-SHAH-rah',orith:'OR-ith',mereth:'MEH-reth',vaedrin:'VAY-drin',ra:'rah',or:'or',ith:'eeth',sae:'say',lun:'loon',vae:'vay',drin:'drin',nara:'NAH-rah',sir:'seer',haren:'HAH-rehn',lu:'loo'};
function pronunciation(text){
 return text.split(/(\s+|[.,!?;:])/g).map(t=>{
  if(!/[a-z]/i.test(t))return t;
  const word=t.toLowerCase();if(pronunciations[word])return pronunciations[word];
  return (word.match(/ae|sh|th|[a-z]/g)||[]).map(c=>({a:'ah',e:'eh',i:'ee',o:'oh',u:'oo',ae:'ay'})[c]||c).join('');
 }).join('');
}
function translate(input,opts={}){
 const txt=String(input||'').trim();
 if(!txt)return {ok:false,firstTongue:'',missing:['Enter an English sentence.'],notes:[],breakdown:[]};
 if(txt.length>600)return {ok:false,firstTongue:'',missing:['Please use up to 600 characters.'],notes:[],breakdown:[]};
 const sentences=(txt.match(/[^.!?\n]+[.!?]?/g)||[]).map(x=>x.trim()).filter(Boolean);
 if(sentences.length>5)return {ok:false,firstTongue:'',missing:['Translate up to five short sentences at once.'],notes:[],breakdown:[]};
 const rows=sentences.map(s=>simple(s,opts)),missing=[...new Set(rows.flatMap(r=>r.missing))],ok=rows.every(r=>r.ok);
 const firstTongue=ok?rows.map(r=>r.ft).join('\n'):'';
 return {ok,firstTongue,pronunciation:ok?pronunciation(firstTongue):'',
   missing,notes:[...new Set(rows.flatMap(r=>r.notes))],breakdown:rows.flatMap(r=>r.breakdown)};
}
window.FTTranslator={translate,pronunciation};
})();