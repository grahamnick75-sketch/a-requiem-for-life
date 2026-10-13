/* A Requiem for Life — illustrated hybrid campaign map, v9.
   DM-only map interface. No external tile service and no alteration of campaign canon.
   City artwork remains intact; neighborhood detail uses responsive SVG layers.
*/
(function () {
  'use strict';
  if (typeof data === 'undefined' || !data || !Array.isArray(data.districts) ||
      typeof mapHome !== 'function' || typeof render !== 'function') return;

  var activeDistrict = null;
  var selectedLocation = null;
  var arrange = false;
  var citySpots = {
    presidio:[33,26], ggp:[33,53], haight:[43,58], japantown:[48,40],
    tenderloin:[55,44], chinatown:[64,36], soma:[68,53], castro:[51,70],
    mission:[63,72], dogpatch:[75,74], bayview:[73,79], waterfront:[70,27]
  };
  var roadNames = {
    dogpatch:['Third Street','Illinois Street','22nd Street'],
    haight:['Haight Street','Ashbury Street','Stanyan Street'],
    chinatown:['Grant Avenue','Stockton Street','California Street'],
    tenderloin:['Geary Street','Larkin Street','Hyde Street'],
    soma:['Market Street','Mission Street','Fourth Street'],
    castro:['Market Street','Castro Street','18th Street'],
    ggp:['Fulton Street','Lincoln Way','JFK Drive'],
    presidio:['Lincoln Boulevard','Presidio Boulevard','Golden Gate Bridge'],
    mission:['Mission Street','Valencia Street','24th Street'],
    japantown:['Geary Boulevard','Fillmore Street','Post Street'],
    bayview:['Third Street','Evans Avenue','Oakdale Avenue'],
    waterfront:['The Embarcadero','Jefferson Street','Bay Street']
  };
  var landmarkIds = new Set(['alcatraz','pier39','fishermans_wharf','portsmouth']);
  var h = function(v){return esc(String(v == null ? '' : v));};
  var clamp = function(n,min,max){return Math.min(max,Math.max(min,n));};
  var district = function(id){return data.districts.find(function(x){return x.id===id;});};
  var location = function(id){return data.locations.find(function(x){return x.id===id;});};
  var inDistrict = function(id){return data.locations.filter(function(x){return x.district===id;}).sort(function(a,b){return a.name.localeCompare(b.name);});};
  var isLandmark = function(x){return landmarkIds.has(x.id)||/\b(golden gate bridge|alcatraz|coit tower|salesforce tower|pier 39)\b/i.test(x.name);};

  // Each record owns its marker coordinate within its district. A new location gets a
  // stable slot; moving it on the map saves the coordinate in the usual dashboard backup.
  function initializeAnchors(){
    var dirty=false;
    data.districts.forEach(function(d){
      var occupied=new Set();
      var locations=inDistrict(d.id);
      locations.forEach(function(l){
        if(l.mapPin && Number.isFinite(+l.mapPin.x) && Number.isFinite(+l.mapPin.y)){
          var col=clamp(Math.floor((+l.mapPin.x-12)/10),0,7);
          var row=clamp(Math.floor((+l.mapPin.y-18)/12),0,4);
          occupied.add(row*8+col);
        }
      });
      locations.forEach(function(l){
        if(l.mapPin && Number.isFinite(+l.mapPin.x) && Number.isFinite(+l.mapPin.y))return;
        var hash=0;
        for(var i=0;i<l.id.length;i++)hash=(hash*33+l.id.charCodeAt(i))>>>0;
        var slot=hash%40;
        for(var n=0;n<40&&occupied.has(slot);n++)slot=(slot+1)%40;
        occupied.add(slot);
        l.mapPin={x:16+(slot%8)*9.3,y:22+Math.floor(slot/8)*13.5};
        dirty=true;
      });
    });
    if(dirty && typeof persist==='function'){try{persist();}catch(e){}}
  }

  function graphic(id){
    var d=district(id), names=roadNames[id]||['Main Street','Market Lane','Broadway'];
    var coast=['dogpatch','bayview','waterfront','presidio'].includes(id);
    var seed=0;for(var k=0;k<id.length;k++)seed=(seed*31+id.charCodeAt(k))>>>0;
    var blocks='',streets='',trees='',labels='';
    // An interpretive atlas rather than a magnified three-street sketch: many
    // side streets, fine ink building footprints and uneven blocks of greenery.
    for(var row=0;row<9;row++)for(var col=0;col<14;col++){
      var bx=33+col*70+((row*17+seed%11)%12),by=35+row*64+((col*7)%9);
      if(coast&&bx>790)continue;
      var park=((row*7+col*11+seed)%37===0);
      if(park){
        blocks+='<rect x="'+(bx+6)+'" y="'+(by+6)+'" width="47" height="42" rx="7" fill="#b5ba8b" stroke="#6c785b" stroke-width="1.3"/>';
        for(var t=0;t<4;t++)trees+='<circle cx="'+(bx+14+t*11)+'" cy="'+(by+20+(t%2)*13)+'" r="7" fill="#768561" fill-opacity=".65" stroke="#5c6e51" stroke-width="1"/>';
      }else{
        for(var q=0;q<3;q++){
          var ww=12+((seed+col*3+q*5)%7),xx=bx+6+q*18,yy=by+7+((row+q)%3)*3;
          blocks+='<rect x="'+xx+'" y="'+yy+'" width="'+ww+'" height="'+(15+((row+q*7)%11))+'" rx="1" fill="#d1ba89" fill-opacity=".66" stroke="#856c4d" stroke-width="1.15"/>';
          if((row+col+q)%4===0)blocks+='<path d="M'+xx+' '+(yy+7)+'h'+ww+'" stroke="#8c775a" stroke-opacity=".48"/>';
        }
      }
    }
    for(var i=0;i<15;i++)streets+='<path d="M'+(i*71-6)+' -20L'+(i*71+15)+' 635" stroke="#8f805f" stroke-width="8" stroke-opacity=".34"/><path d="M'+(i*71-6)+' -20L'+(i*71+15)+' 635" stroke="#f1dfb7" stroke-width="5"/>';
    for(var j=0;j<11;j++)streets+='<path d="M-10 '+(j*64+7)+'L1010 '+(j*64-9)+'" stroke="#8f805f" stroke-width="8" stroke-opacity=".34"/><path d="M-10 '+(j*64+7)+'L1010 '+(j*64-9)+'" stroke="#f1dfb7" stroke-width="5"/>';
    labels='<text x="85" y="222" transform="rotate(-2 85 222)">'+h(names[0]).toUpperCase()+'</text>'+
      '<text x="505" y="44" transform="rotate(86 505 44)">'+h(names[1]).toUpperCase()+'</text>'+
      '<text x="480" y="480" transform="rotate(-2 480 480)">'+h(names[2]).toUpperCase()+'</text>';
    return '<svg class="rfl-district-svg" viewBox="0 0 1000 610" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Illustrated parchment neighborhood atlas of '+h(d?d.name:id)+'">'+
      '<defs><filter id="rfl-paper-grain"><feTurbulence type="fractalNoise" baseFrequency=".33" numOctaves="3" seed="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".075"/></feComponentTransfer></filter></defs>'+
      '<rect width="1000" height="610" fill="#e2cba0"/><rect width="1000" height="610" fill="#f0deb9" opacity=".35"/>'+
      '<g>'+blocks+'</g><g>'+streets+'</g><g>'+trees+'</g>'+
      (coast?'<path d="M853 -25Q805 119 849 240T817 440L798 635H1020V-25Z" fill="#8ea9ac" stroke="#687e7a" stroke-width="4"/><path d="M868 -15Q828 120 872 245T844 445L823 640" fill="none" stroke="#e2e7d4" stroke-width="3" stroke-opacity=".5"/>':'')+
      '<g fill="#6b5138" font-size="16" font-family="Georgia,serif" letter-spacing="2.5" opacity=".9" paint-order="stroke" stroke="#e9d4aa" stroke-width="4">'+labels+'</g>'+
      '<g stroke="#8e7350" fill="none" opacity=".65"><path d="M18 18h65M18 18v65M982 592h-65M982 592v-65" stroke-width="2"/></g>'+
      '<rect width="1000" height="610" filter="url(#rfl-paper-grain)" opacity=".45" pointer-events="none"/>'+
      '</svg>';
  }

  function pinsForDistrict(id){
    return inDistrict(id).map(function(l){
      var x=clamp(Number(l.mapPin&&l.mapPin.x)||50,8,88);
      var y=clamp(Number(l.mapPin&&l.mapPin.y)||50,12,86);
      var major=isLandmark(l);
      var current=selectedLocation===l.id;
      return '<button type="button" class="rfl-pin '+(major?'rfl-pin-landmark ':'')+(current?'selected':'')+'" data-rfl-location="'+h(l.id)+'" style="left:'+x+'%;top:'+y+'%" title="'+h(l.name)+'" aria-label="'+h(l.name)+'" aria-pressed="'+current+'">'+
        '<span class="rfl-pin-icon" aria-hidden="true">'+(major?'✦':'•')+'</span>'+
        '<span class="rfl-pin-label">'+h(l.name)+'</span></button>';
    }).join('');
  }

  function sidePanel(){
    if(!activeDistrict){
      return '<aside class="rfl-guide"><div class="rfl-overline">NEIGHBORHOOD GUIDE</div><h3>Explore the city</h3>'+
        '<p class="muted">Choose a district to reveal its illustrated neighborhood map and campaign locations.</p>'+
        '<div class="rfl-district-list">'+data.districts.map(function(d){
          return '<button class="rfl-guide-button" data-rfl-district="'+h(d.id)+'"><span>'+h(d.name)+'</span><small>'+inDistrict(d.id).length+' locations&nbsp; ↗</small></button>';
        }).join('')+'</div></aside>';
    }
    var d=district(activeDistrict);
    var locs=inDistrict(activeDistrict);
    var selected=location(selectedLocation);
    return '<aside class="rfl-guide"><div class="rfl-overline">DISTRICT DOSSIER</div><h3>'+h(d?d.name:activeDistrict)+'</h3>'+
      '<p class="muted">'+h(d&&d.summary)+'</p>'+
      '<div class="rfl-guide-controls"><button class="action" data-go="districts:'+h(activeDistrict)+'">District record →</button>'+
      '<button class="action" id="rflArrange" aria-pressed="'+arrange+'">'+(arrange?'Finish placing':'Arrange pins')+'</button></div>'+
      (arrange?'<p class="rfl-instruction">Select a location below, then click the map to place its pin. Positions save with your dashboard data.</p>':'')+
      '<div class="rfl-overline rfl-location-heading">LOCATIONS · '+locs.length+'</div>'+
      (locs.length?'<div class="rfl-location-list">'+locs.map(function(l){
        return '<button class="rfl-guide-button '+(selectedLocation===l.id?'chosen':'')+'" data-rfl-location="'+h(l.id)+'"><span>'+h(l.name)+'</span><small>'+(isLandmark(l)?'✦ Landmark':'• Location')+'</small></button>';
      }).join('')+'</div>':'<p class="muted">No established locations in this district yet.</p>')+
      (selected&&selected.district===activeDistrict?'<section class="rfl-location-detail"><div class="rfl-overline">SELECTED LOCATION</div><h4>'+h(selected.name)+'</h4><p>'+h(selected.summary)+'</p>'+
        (selected.secret?'<div class="rfl-secret"><strong>DM notes</strong><p>'+h(selected.secret)+'</p></div>':'')+
        '<button class="action" data-go="locations:'+h(selected.id)+'">Open full location →</button></section>':'')+
      '</aside>';
  }

  function cityView(){
    var markers=data.districts.filter(function(d){return citySpots[d.id];}).map(function(d){
      var xy=citySpots[d.id];
      return '<button class="rfl-city-dot" type="button" data-rfl-district="'+h(d.id)+'" style="left:'+xy[0]+'%;top:'+xy[1]+'%" title="Explore '+h(d.name)+'"><span>◆</span><small>'+h(d.name)+'</small></button>';
    }).join('');
    return '<div class="rfl-stage rfl-city-stage" id="rflStage"><div class="rfl-art rfl-city-art">'+
      '<img src="'+MAP_IMAGE+'" draggable="false" alt="Illustrated map of San Francisco neighborhoods"/>'+
      '<div class="rfl-city-markers">'+markers+'</div></div></div>'+
      '<p class="rfl-map-footnote">Illustrated city overview · neighborhood positions are approximate. Select a district for its own detailed map.</p>';
  }
  function districtView(){
    var d=district(activeDistrict);
    return '<div class="rfl-stage rfl-neighborhood-stage" id="rflStage"><div class="rfl-neighborhood-art" id="rflPlacementMap">'+
      graphic(activeDistrict)+pinsForDistrict(activeDistrict)+
      '<span class="rfl-neighborhood-seal" aria-hidden="true">✧ '+h(d?d.name:activeDistrict)+' ✧</span>'+
      '</div></div><p class="rfl-map-footnote">Illustrated parchment district atlas · streets and building footprints are artistically interpreted.'+
      (arrange?' Click anywhere on the map to place the selected pin.':'')+'</p>';
  }
  // Static city overview: no pins, district zoom, or drill-down.
  mapHome=function(){
    activeDistrict=null;selectedLocation=null;arrange=false;
    return '<div class="maphead"><div><h2>San Francisco · Campaign Map</h2><p class="muted">Illustrated city overview · DM workspace</p></div></div>'+
      '<div class="rfl-topbar"><span class="rfl-crumb">San Francisco / City overview</span><button class="action" data-jump="locations">Browse locations →</button></div>'+
      '<div class="rfl-stage rfl-city-stage"><div class="rfl-art rfl-city-art"><img src="'+MAP_IMAGE+'" draggable="false" alt="Illustrated overview map of San Francisco"/></div></div>'+
      '<p class="rfl-map-footnote">City reference illustration. Find campaign locations in the Locations directory.</p>';
  };

  var style=document.createElement('style');
  style.id='rfl-hybrid-map-styles';
  style.textContent=
    '.rfl-topbar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:16px 0}.rfl-crumb{color:#d6c69e;font:15px Georgia,serif}.rfl-topbar [data-jump]{margin-left:auto}'+
    '.rfl-layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(235px,295px);gap:16px;align-items:start}.rfl-map-column{min-width:0}.rfl-stage{border:1px solid #75654b;border-radius:13px;overflow:hidden;background:#1a2427;box-shadow:0 14px 35px #0005;isolation:isolate;animation:rflAppear .38s ease-out both}@keyframes rflAppear{from{opacity:.35;transform:scale(.975)}to{opacity:1;transform:scale(1)}}'+
    '.rfl-art,.rfl-neighborhood-art{position:relative;overflow:hidden;aspect-ratio:3/2}.rfl-city-art img{width:100%;height:100%;object-fit:contain;display:block;pointer-events:none}.rfl-city-markers{position:absolute;inset:0;pointer-events:none}.rfl-city-dot{position:absolute;pointer-events:auto;transform:translate(-50%,-50%);display:flex;align-items:center;gap:5px;padding:2px 5px;border:1px solid #b99359;border-radius:9px;background:#342b23df;color:#f3dba9;z-index:1;font-weight:650;max-width:150px;box-shadow:0 3px 9px #0009}.rfl-city-dot span{font-size:11px;color:#e3b76a}.rfl-city-dot small{font-size:clamp(9px,.85vw,12px);white-space:normal;text-align:left;line-height:1.1}.rfl-city-dot:hover,.rfl-city-dot:focus-visible{background:#795834;outline:2px solid #f6d79c;z-index:3}'+
    '.rfl-neighborhood-art{background:#e2cba0;cursor:default}.rfl-district-svg{width:100%;height:100%;display:block}.rfl-neighborhood-seal{position:absolute;left:3%;top:3%;font:italic clamp(13px,1.4vw,20px) Georgia,serif;color:#59432c;text-shadow:0 1px 2px #eddbb4;pointer-events:none}.rfl-map-footnote{font-size:12px;color:#aeb9bb;margin:10px 0 14px}'+
    '.rfl-guide{background:#1b252e;border:1px solid #3e4c57;border-radius:12px;padding:15px;min-width:0;max-height:min(77vh,850px);overflow:auto}.rfl-guide h3{font:23px Georgia,serif;color:#efd3a2;margin:7px 0}.rfl-guide p{line-height:1.45;font-size:13px}.rfl-overline{color:#cba96b;letter-spacing:.14em;font-size:10px;font-weight:750}.rfl-location-heading{margin-top:18px;margin-bottom:9px}.rfl-district-list,.rfl-location-list{display:flex;flex-direction:column;gap:5px;max-height:39vh;overflow:auto}.rfl-guide-button{background:#24323b;color:#e9e3d7;border:1px solid #435563;border-radius:8px;text-align:left;display:flex;gap:5px;justify-content:space-between;align-items:center;padding:10px;font-size:13px;min-height:39px}.rfl-guide-button small{color:#c9b588;font-size:10px;text-align:right;flex-shrink:0}.rfl-guide-button:hover,.rfl-guide-button:focus-visible,.rfl-guide-button.chosen{background:#634a2d;border-color:#c5a16b;outline:none}.rfl-guide-controls{display:flex;flex-wrap:wrap;gap:7px;margin:13px 0}.rfl-guide-controls button{font-size:12px}.rfl-instruction{color:#efd3a2;border-left:2px solid #cbab70;padding-left:9px}.rfl-location-detail{margin-top:15px;padding:12px;background:#131e24;border:1px solid #50616a;border-radius:9px}.rfl-location-detail h4{font:20px Georgia,serif;color:#eed2a2;margin:8px 0}.rfl-secret{margin:10px 0;padding:9px;background:#33252d;border-left:3px solid #bc8169}.rfl-secret p{white-space:pre-wrap}'+
    '.rfl-pin{position:absolute;transform:translate(-50%,-50%);border:0;box-shadow:none;background:transparent;color:#f9e2ae;z-index:2;display:flex;flex-direction:column;align-items:center;max-width:126px;padding:0;cursor:pointer}.rfl-pin-icon{width:18px;height:18px;border-radius:50%;border:2px solid #ead09c;background:#513729;box-shadow:0 2px 10px #000b;display:grid;place-items:center;font-size:13px;line-height:1}.rfl-pin-landmark .rfl-pin-icon{width:25px;height:25px;border-radius:8px;transform:rotate(45deg);background:#a27e43;font-size:23px}.rfl-pin-landmark .rfl-pin-icon::first-letter{transform:rotate(-45deg)}.rfl-pin-label{background:#15262bd9;border:1px solid #8c7650;color:#ffe7b7;border-radius:5px;padding:3px 5px;font-size:10px;max-width:128px;line-height:1.2;text-align:center;margin-top:3px;overflow-wrap:anywhere}.rfl-pin.selected .rfl-pin-icon,.rfl-pin:hover .rfl-pin-icon,.rfl-pin:focus-visible .rfl-pin-icon{background:#bd8e4d;outline:2px solid #fff1bb;z-index:3}'+
    '.rfl-neighborhood-art.rfl-arrange{cursor:crosshair}.rfl-neighborhood-art.rfl-arrange .rfl-pin{cursor:crosshair}.rfl-neighborhood-art.rfl-arrange::after{content:"";position:absolute;inset:0;border:2px dashed #e0c38a80;pointer-events:none}'+
    '@media(max-width:1000px){.rfl-layout{grid-template-columns:minmax(0,1fr)}.rfl-guide{max-height:none}.rfl-district-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));max-height:none}.rfl-location-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));max-height:none}.rfl-city-dot{padding:3px 5px}.rfl-city-dot small{font-size:10px}}'+
    '@media(max-width:550px){.rfl-city-dot{border-radius:50%;padding:0;width:18px;height:18px;justify-content:center}.rfl-city-dot small{position:absolute;left:50%;top:100%;transform:translateX(-50%);display:none;background:#172831;padding:4px;min-width:75px;z-index:4}.rfl-city-dot:focus-visible small,.rfl-city-dot:hover small{display:block}.rfl-city-dot span{font-size:9px}.rfl-pin-label{font-size:9px;max-width:78px}.rfl-pin-icon{width:21px;height:21px}.rfl-map-footnote{font-size:11px}}'+
    '@media(prefers-reduced-motion:reduce){.rfl-stage{animation:none}}';
  document.head.appendChild(style);

  // The published application is a DM workspace. A future player reference map will
  // be a separate exported asset; do not expose a confusing player-view switch here.
  var playerMode=document.getElementById('playerMode');
  if(playerMode){
    playerMode.checked=false;
    if(playerMode.closest('label'))playerMode.closest('label').style.display='none';
    document.body.classList.remove('player');
    if(typeof mode!=='undefined')mode=false;
  }

  var oldRender=render;
  render=function(){
    oldRender();
    // Preserve the district dossier's existing 'Focus on map' navigation.
    if(tab!=='home')return;
    var app=document.getElementById('app');
    if(!app)return;
    app.querySelectorAll('[data-rfl-district]').forEach(function(button){
      button.onclick=function(){
        activeDistrict=button.dataset.rflDistrict;
        selectedLocation=null;
        arrange=false;
        mapDistrict=activeDistrict;
        render();
      };
    });
    app.querySelectorAll('[data-rfl-location]').forEach(function(button){
      button.onclick=function(e){
        e.stopPropagation();
        selectedLocation=button.dataset.rflLocation;
        render();
      };
    });
    var back=document.getElementById('rflBack');
    if(back)back.onclick=function(){activeDistrict=null;selectedLocation=null;arrange=false;render();};
    var control=document.getElementById('rflArrange');
    if(control)control.onclick=function(){arrange=!arrange;render();};
    var target=document.getElementById('rflPlacementMap');
    if(target&&arrange){
      target.classList.add('rfl-arrange');
      target.onclick=function(e){
        if(e.target.closest('[data-rfl-location]'))return;
        var loc=location(selectedLocation);
        if(!loc||loc.district!==activeDistrict)return;
        var r=target.getBoundingClientRect();
        loc.mapPin={x:Math.round(clamp((e.clientX-r.left)/r.width*100,8,88)*10)/10,
                    y:Math.round(clamp((e.clientY-r.top)/r.height*100,12,86)*10)/10};
        if(typeof persist==='function')persist();
        render();
      };
    }
  };
  render();
})();