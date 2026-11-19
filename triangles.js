/* Lesson-specific additions. Original theme and deck navigation are reused. */
(function () {
  'use strict';
  const esc = (s='') => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  const text = (x,y,s,cls='',anchor='middle') => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${esc(s)}</text>`;
  const line = (a,b,cls='') => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" class="${cls}"/>`;
  const polygon = (p,cls='shape-wash') => `<polygon points="${p.map(v=>v.join(',')).join(' ')}" class="${cls}"/>`;
  const svg = (label,body,box='0 0 900 460') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box}" role="img" aria-label="${esc(label)}"><title>${esc(label)}</title>${body}</svg>`;
  const right = (x,y,sx=1,sy=-1) => `<path d="M ${x+sx*18} ${y} v ${sy*18} h ${-sx*18}" class="angle-mark"/>`;
  // Construct the minor interior arc from the two rays at the actual vertex.
  function angleAt(points,index,label,{radius=26,distance=55}={}) {
    const v=points[index],a=points[(index+1)%3],b=points[(index+2)%3];
    const start=Math.atan2(a[1]-v[1],a[0]-v[0]);
    let turn=Math.atan2(b[1]-v[1],b[0]-v[0])-start;
    while(turn>Math.PI)turn-=2*Math.PI;
    while(turn<-Math.PI)turn+=2*Math.PI;
    const at=(r,t)=>[v[0]+r*Math.cos(t),v[1]+r*Math.sin(t)];
    const p=at(radius,start),q=at(radius,start+turn),m=at(distance,start+turn/2);
    return `<path d="M ${p.join(' ')} A ${radius} ${radius} 0 0 ${turn>0?1:0} ${q.join(' ')}" class="angle-mark"/>`+
      (label?text(m[0],m[1],label,'interior-angle'):'');
  }
  function labelledTriangle(points,letters,{sides=[],angles=[],markSides=false}={}) {
    const centre=points.reduce((c,p)=>[c[0]+p[0]/3,c[1]+p[1]/3],[0,0]);
    const edges=[[0,1,'edge-a'],[1,2,'edge-b'],[2,0,'edge-c']];
    let body=polygon(points);
    for(const [i,j,cls] of edges)body+=line(points[i],points[j],cls);
    if(markSides)edges.forEach(([i,j],n)=>body+=ticks(points[i],points[j],n+1));
    points.forEach((p,i)=>{
      const dx=p[0]-centre[0],dy=p[1]-centre[1],len=Math.hypot(dx,dy);
      body+=text(p[0]+dx/len*25,p[1]+dy/len*25+6,letters[i],'diagram-vertex');
    });
    sides.forEach(({edge,label,offset=29})=>{
      const [i,j]=edges[edge],a=points[i],b=points[j],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);
      let nx=-dy/len,ny=dx/len;
      const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;
      if(nx*(mx-centre[0])+ny*(my-centre[1])<0){nx=-nx;ny=-ny;}
      const anchor=Math.abs(nx)>.65?(nx<0?'end':'start'):'middle';
      body+=text(mx+nx*offset,my+ny*offset+6,label,'diagram-side',anchor);
    });
    angles.forEach(({index,label,...options})=>body+=angleAt(points,index,label,options));
    return body;
  }
  function correspondenceDiagram(kind='warmup') {
    const first=kind==='congruentAngle'?[[90,55],[90,215],[90+160*Math.tan(48*Math.PI/180),215]]:[[90,55],[65,215],[245,215]];
    const second=first.map(([x,y])=>[590-x,270-y]);
    const letters=kind==='congruentAngle'?'QPR':'DEF';
    const options=kind==='congruentAngle'?{angles:[{index:0,label:'48°',distance:72}]}:{};
    const other=kind==='congruentAngle'?{angles:[{index:0,label:'?',distance:72}]}:{};
    return svg(kind==='congruentAngle'?'Congruent triangles ABC and QPR, turned through 180 degrees. Angle A is 48 degrees; angle Q is unknown.':'Congruent triangles ABC and DEF, with DEF turned through 180 degrees. Match side BC and angle A.',
      labelledTriangle(first,'ABC',options)+labelledTriangle(second,letters,other),'25 10 535 260');
  }
  function warmupVisual(kind) {
    if(kind==='match')return correspondenceDiagram();
    if(kind==='reflection')return svg('A triangle and its reflected image, on opposite sides of a vertical mirror line.',
      polygon([[75,195],[195,195],[115,65]],'object-shape')+polygon([[425,195],[305,195],[385,65]],'image-shape')+
      line([250,25],[250,215],'dashed')+text(250,248,'mirror line','shape-tag'),'20 0 460 265');
    return svg('An object triangle has a side of 5 cm. Its enlarged image has the corresponding side of 15 cm.',
      polygon([[70,180],[130,180],[83.33,126.67]],'object-shape')+polygon([[300,180],[480,180],[340,20]],'image-shape')+
      text(100,218,'5 cm','diagram-side')+text(390,218,'15 cm','diagram-side')+
      text(100,253,'OBJECT','shape-tag')+text(390,253,'IMAGE','shape-tag')+text(225,125,'→','diagram-side'),'20 0 500 275');
  }
  function practice(s) {
    return `<div class="scene-inner practice-layout warmup-layout"><div>${title(s)}<p class="slide-instruction">${esc(s.instruction)}</p></div><div class="practice-list">${s.questions.map((q,i)=>`<article class="practice-item warmup-item"><header><span class="eyebrow">${String(i+1).padStart(2,'0')}</span><h3>${esc(q.label)}</h3></header><figure class="warmup-figure">${warmupVisual(q.kind)}</figure>${q.given?`<p class="warmup-given">${esc(q.given)}</p>`:''}<p class="warmup-prompt">${esc(q.prompt)}</p>${q.parts?`<dl class="match-questions">${q.parts.map(p=>`<div><dt>${esc(p)}</dt><dd>↔ ?</dd></div>`).join('')}</dl>`:''}<button class="reveal-button" type="button" data-action="toggle-reveal" aria-expanded="false" aria-controls="warmup-answer-${i}">Reveal model response</button><div class="reveal-body" id="warmup-answer-${i}" hidden>${q.answerParts?`<dl class="match-answers">${q.answerParts.map(([a,b])=>`<div><dt>${esc(a)}</dt><dd>↔ ${esc(b)}</dd></div>`).join('')}</dl><p>Match letters in the same order.</p>`:esc(q.answer)}</div></article>`).join('')}</div></div>`;
  }
  function practiceDiagram(kind) {
    if(kind==='congruentAngle')return correspondenceDiagram(kind);
    if(kind==='similarAngle'){
      // A = 42°, B = 73°, hence C = 65°; the image is a rotated copy.
      // Coordinates from the sine rule, rotated so AB is horizontal.
      const base=210,ac=base*Math.sin(73*Math.PI/180)/Math.sin(42*Math.PI/180);
      const p=[[95+ac*Math.cos(65*Math.PI/180),285-ac*Math.sin(65*Math.PI/180)],[305,285],[95,285]];
      const q=p.map(([x,y])=>[890-x,340-y]);
      return svg('Similar triangles ABC and LMN. Angles A and B are 42 and 73 degrees. Angle N is unknown.',
        labelledTriangle(p,'ABC',{angles:[{index:0,label:'42°',distance:77},{index:1,label:'73°',distance:58}]})+
        labelledTriangle(q,'LMN',{angles:[{index:2,label:'?',distance:58}]}),'25 -35 880 410');
    }
    if(kind==='ssa')return ssa().replace(/<g data-diagram-step="2"[\s\S]*?<\/g>/,'');
    const p=[[110,95],[75,285],[300,285]],q=[[605,60],[560,310],[856,310]];
    const config={
      scale:{left:[{edge:1,label:'12 cm'}],right:[{edge:1,label:'8 cm'}],tag:'OBJECT → IMAGE · k = ?'},
      missing:{left:[{edge:0,label:'4 cm'},{edge:1,label:'7 cm'}],right:[{edge:0,label:'10 cm'},{edge:1,label:'EF = ?'}],tag:'△ABC ∼ △DEF'},
      whole:{left:[{edge:0,label:'2'},{edge:2,label:'b'}],right:[{edge:0,label:'8'},{edge:2,label:'9 + b'}],tag:'SMALL → LARGE · SIMILAR TRIANGLES'}
    }[kind];
    const rightPoints=kind==='scale'?p.map(([x,y])=>[650+(x-185)*2/3,220+(y-220)*2/3]):q;
    return svg(kind==='scale'?'An object side of 12 cm corresponds to an image side of 8 cm. Find the scale factor.':kind==='missing'?'Similar triangles ABC and DEF. AB is 4 cm, BC is 7 cm, DE is 10 cm, and EF is unknown.':'Similar triangles: side 2 corresponds to 8, and side b corresponds to the whole side 9 plus b.',
      labelledTriangle(p,kind==='scale'?'':'ABC',{sides:config.left})+labelledTriangle(rightPoints,kind==='scale'?'':'DEF',{sides:config.right})+text(460,390,config.tag,'shape-tag'),'-35 15 1010 415');
  }
  const ticks = (a,b,n=1) => {
    const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),u=[dx/len,dy/len],v=[-dy/len,dx/len];
    return Array.from({length:n},(_,i)=>{
      const off=(i-(n-1)/2)*9,c=[(a[0]+b[0])/2+u[0]*off,(a[1]+b[1])/2+u[1]*off];
      return line([c[0]-v[0]*7,c[1]-v[1]*7],[c[0]+v[0]*7,c[1]+v[1]*7],'equality-tick');
    }).join('');
  };
  function congruent(kind='sss') {
    const p=[[105,325],[345,325],[105,145]],q=[[780,135],[540,135],[780,315]];
    let body=polygon(p)+polygon(q);
    const edges=[[0,2,'edge-a'],[0,1,'edge-b'],[1,2,'edge-c']];
    for(const [j,k,cls] of edges) body+=line(p[j],p[k],cls)+line(q[j],q[k],cls);
    body+=text(80,355,'A','vertex')+text(369,351,'B','vertex')+text(81,124,'C','vertex')+text(808,120,'D','vertex')+text(514,124,'E','vertex')+text(806,345,'F','vertex');
    if(kind==='aas') {
      // Exact 30-60-90 geometry; only AAS evidence is marked.
      const a=[[100,330],[411.77,330],[100,150]],b=[[800,120],[488.23,120],[800,300]];
      body=polygon(a)+polygon(b);
      for(const [j,k,cls] of edges)body+=line(a[j],a[k],cls)+line(b[j],b[k],cls);
      body+=right(100,330)+right(800,120,-1,1)+text(132,307,'90°','angle-label')+text(757,156,'90°','angle-label');
      body+=text(327,311,'30°','angle-label')+text(572,152,'30°','angle-label')+text(280,218,'6')+text(625,257,'6');
      body+=text(76,359,'A','vertex')+text(435,351,'B','vertex')+text(77,129,'C','vertex')+text(825,109,'D','vertex')+text(465,109,'E','vertex')+text(825,330,'F','vertex');
    } else {
      if(['sss','unknown'].includes(kind)) {
        body+=text(62,246,'3')+text(226,370,'4')+text(254,222,'5');
        body+=text(828,238,kind==='unknown'?'y':'3',kind==='unknown'?'unknown':'')+text(661,99,kind==='unknown'?'x':'4',kind==='unknown'?'unknown':'')+text(626,263,'5');
        if(kind==='sss')for(let i=0;i<edges.length;i++){const [j,k]=edges[i];body+=ticks(p[j],p[k],i+1)+ticks(q[j],q[k],i+1);}
      }
      if(kind==='sas') body+=right(105,325)+right(780,135,-1,1)+text(62,246,'3')+text(225,370,'4')+text(829,236,'3')+text(662,99,'4')+ticks(p[0],p[2])+ticks(q[0],q[2])+ticks(p[0],p[1],2)+ticks(q[0],q[1],2);
      if(kind==='rhs')body+=right(105,325)+right(780,135,-1,1)+text(62,246,'3')+text(255,222,'5')+text(829,236,'3')+text(627,263,'5')+ticks(p[0],p[2])+ticks(q[0],q[2])+ticks(p[1],p[2],2)+ticks(q[1],q[2],2);
    }
    body+=text(225,425,'△ABC','shape-tag')+text(665,425,'△DEF','shape-tag');
    return svg(`Two congruent triangles ABC and DEF. Evidence for ${kind}.`,body);
  }
  function kite() {
    const m=[445,45],n=[445,395],p=[185,230],q=[705,230];
    let b=polygon([m,p,n,q]);
    for(const [a,z] of [[m,p],[m,q]]) b+=line(a,z,'edge-a')+ticks(a,z);
    for(const [a,z] of [[n,p],[n,q]]) b+=line(a,z,'edge-c')+ticks(a,z,2);
    b+=line(m,n,'edge-b')+text(445,24,'M','vertex')+text(445,436,'N','vertex')+text(151,239,'P','vertex')+text(739,239,'Q','vertex');
    b+=`<g data-diagram-step="2" hidden aria-hidden="true"><path d="M 445 45 V 395" class="step-highlight-halo"/><path d="M 445 45 V 395" class="edge-b"/></g>`;
    return svg('Kite MPNQ. MP equals MQ, NP equals NQ; triangles MNP and MNQ share side MN.',b);
  }
  function ssa() {
    const a=[75,335],b=[529.66,72.5],c=[674.89,335],d=[384.42,335];
    let s=polygon([a,b,c])+line(a,b,'edge-a')+line(b,c,'edge-c')+line(a,c,'edge-b');
    s+=text(55,369,'A','vertex')+text(529,45,'B','vertex')+text(699,365,'C','vertex')+text(282,173,'7')+text(649,201,'4')+text(200,314,'30°','angle-label');
    s+=`<path d="M 153 335 A 78 78 0 0 0 142.55 296" class="angle-mark"/>`;
    s+=`<g data-diagram-step="2" hidden aria-hidden="true">${line(b,d,'alternative-edge')}${text(383,368,'D','vertex')}${text(408,205,'4')}<circle cx="${d[0]}" cy="${d[1]}" r="6" class="vertex-dot"/></g>`;
    return svg('SSA counterexample: AB is 7 cm, BC is 4 cm, angle BAC is 30 degrees. Reveal a second point D with BD also 4 cm.',s);
  }
  function cover() {
    return svg('A blue triangle and a turned red copy. Are they congruent or similar?',polygon([[90,250],[255,250],[90,126]],'object-shape')+polygon([[545,104],[380,104],[545,228]],'image-shape')+right(90,250)+right(545,104,-1,1)+text(320,187,'≡ or ∼ ?','cover-symbol'),'0 50 650 270');
  }
  const title = s=>`<header class="scene-heading"><p class="eyebrow">${esc(s.eyebrow)}</p><h2>${esc(s.title)}</h2></header>`;
  const explorerTests={
    shape:{label:'Shape & size',edges:[0,1,2],angles:[0,1,2]},
    sss:{label:'SSS',edges:[0,1,2],angles:[]},
    sas:{label:'SAS',edges:[0,2],angles:[0]},
    asa:{label:'ASA',edges:[0],angles:[0,1]},
    aas:{label:'AAS',edges:[1],angles:[0,1]},
    rhs:{label:'RHS',edges:[1,2],angles:[0]},
    aa:{label:'AA / AAA',edges:[],angles:[0,1]}
  };
  const explorer={mode:'congruent',test:'shape',scale:1.5,overlay:false};
  const explorerKeys=()=>explorer.mode==='congruent'?['shape','sss','sas','asa','aas','rhs']:['shape','sss','sas','aa','rhs'];
  const format=n=>Number(n.toFixed(2)).toString();
  function explorerEvidence() {
    const congruent=explorer.mode==='congruent',k=congruent?1:explorer.scale;
    const equal=congruent?'equal':'in the same ratio';
    const result=congruent?'△ABC ≡ △DEF':'△ABC ∼ △DEF';
    const evidence={
      shape:{heading:congruent?'Same shape. Same size.':'Same shape. Size may differ.',detail:congruent?'Corresponding sides are equal.':'Every corresponding side uses the same multiplier.',facts:congruent?['AB = DE   AC = DF   BC = EF','Corresponding angles are equal.']:[`DE/AB = DF/AC = EF/BC = ${format(k)}`,'Corresponding angles are equal.'],note:congruent?'A turn or reflection also preserves congruence.':k===1?'At k = 1, these triangles are also congruent.':'Angles stay equal when side lengths change.'},
      sss:{heading:congruent?'Three equal side pairs':'Three side pairs in one ratio',detail:`All three corresponding side pairs are ${equal}.`,facts:congruent?['AB = DE   AC = DF   BC = EF']:[`6/4 = 4.5/3 = 7.5/5 = 1.5`],note:'Check all three pairs.'},
      sas:{heading:congruent?'Two sides and the included angle':'Two side ratios and the included angle',detail:`Two corresponding side pairs are ${equal}.`,facts:[congruent?'AB = DE   AC = DF':`DE/AB = DF/AC = ${format(k)}`,'∠A = ∠D = 90°'],note:'The equal angle must lie between the two given sides.'},
      asa:{heading:'Two angles and the side between',detail:'Two equal angle pairs and their included equal side.',facts:['∠A = ∠D   ∠B = ∠E','AB = DE'],note:'The highlighted side joins the two marked angles.'},
      aas:{heading:'Two angles and another side',detail:'Two equal angle pairs and an equal corresponding side.',facts:['∠A = ∠D   ∠B = ∠E','BC = EF'],note:'The highlighted side is not between the two marked angles.'},
      rhs:{heading:congruent?'Right angle, hypotenuse, side':'Right angle and two side ratios',detail:congruent?'Equal hypotenuses and one equal matching leg.':'Hypotenuses and one matching leg have the same ratio.',facts:['∠A = ∠D = 90°',congruent?'BC = EF   AC = DF':`EF/BC = DF/AC = ${format(k)}`],note:'The hypotenuse lies opposite the right angle.'},
      aa:{heading:'Two equal angle pairs',detail:'Two matching angles establish similarity.',facts:['∠A = ∠D   ∠B = ∠E','The third angle pair must also be equal.'],note:'AA / AAA fixes shape. It does not fix size.'}
    }[explorer.test];
    if(explorer.test==='sss'&&!congruent)evidence.facts=[`${format(4*k)}/4 = ${format(3*k)}/3 = ${format(5*k)}/5 = ${format(k)}`];
    return {...evidence,k,result};
  }
  function explorerTriangle(letters,k=1) {
    const points=[[0,0],[180,0],[0,-135]],test=explorerTests[explorer.test];
    const edges=[[0,1,4],[1,2,5],[2,0,3]],labelPoints=[[90,31/k],[90+27/k,-67.5-17/k],[-29/k,-67.5]];
    let body=polygon(points,'explorer-fill');
    edges.forEach(([a,b,length],i)=>{
      const active=test.edges.includes(i),cls=`explorer-edge evidence-${i}${active?' is-evidence':''}`;
      body+=line(points[a],points[b],cls);
      if(active) {
        const pos=labelPoints[i],anchor=i===2?'end':'middle';
        body+=text(pos[0],pos[1],`${format(length*k)} cm`,'explorer-length',anchor);
        if(explorer.mode==='congruent')body+=`<g class="explorer-ticks evidence-${i}">${ticks(points[a],points[b],i+1)}</g>`;
      }
    });
    test.angles.forEach(i=>{
      let arc=i===0?`<path d="M ${17/k} 0 v ${-17/k} h ${-17/k}"/>`:angleAt(points,i,'',{radius:25/k})+(i===1?angleAt(points,i,'',{radius:31/k}):angleAt(points,i,'',{radius:31/k})+angleAt(points,i,'',{radius:37/k}));
      body+=`<g class="explorer-angle is-evidence">${arc}</g>`;
    });
    [[-18/k,22/k],[180+22/k,12/k],[-13/k,-135-18/k]].forEach((p,i)=>body+=text(p[0],p[1],letters[i],'explorer-vertex'));
    return body;
  }
  function testExplorer(s) {
    return `<div class="scene-inner explorer-layout">${title(s)}
      <div class="explorer-topline"><div class="relationship-switch" role="group" aria-label="Compare relationships"><button type="button" data-relationship="congruent" aria-pressed="true">Congruent <span>≡</span></button><button type="button" data-relationship="similar" aria-pressed="false">Similar <span>∼</span></button></div><p>Object = original triangle. Image = transformed triangle.</p></div>
      <div class="test-picker" role="tablist" aria-label="Triangle tests" data-test-picker></div>
      <div class="explorer-stage" id="test-evidence-panel" role="tabpanel" aria-labelledby="test-shape-tab">
        <div class="explorer-visual"><figure class="explorer-figure">${svg('Object ABC and image DEF. Compare corresponding sides and angles.',`<g data-explorer-object class="explorer-object" style="transform:translate(160px,265px)"></g><g data-explorer-image class="explorer-image" style="transform:translate(640px,265px)"></g>${text(250,337,'OBJECT · ABC','explorer-caption')}${text(740,337,'IMAGE · DEF','explorer-caption')}`,'0 0 960 365')}</figure>
        <div class="explorer-tools"><button class="quiet-button" type="button" data-explorer-overlay aria-pressed="false">Overlay triangles</button><div class="explorer-scales" role="group" aria-label="Image scale factor" data-explorer-scales hidden>${[0.5,1,1.5].map(k=>`<button type="button" data-explorer-scale="${k}" aria-pressed="${k===1.5}">k = ${k===0.5?'½':k}</button>`).join('')}</div><button class="text-button" type="button" data-explorer-reset>Reset</button></div><p class="explorer-legend">Thick sides and marked angles show the given evidence.</p></div>
        <aside class="explorer-explanation" aria-live="polite" data-explorer-explanation></aside>
      </div><p class="explorer-takeaway"><strong>Congruent:</strong> equal sides, k = 1. <strong>Similar:</strong> proportional sides. <mark>Both have equal corresponding angles.</mark></p>
    </div>`;
  }
  function updateExplorer({rebuildPicker=false,focusTest=false}={}) {
    const scene=document.querySelector('.scene-testExplorer');if(!scene)return;
    if(!explorerKeys().includes(explorer.test))explorer.test=explorer.test==='aa'?'asa':'aa';
    const picker=scene.querySelector('[data-test-picker]');
    if(rebuildPicker||!picker.children.length)picker.innerHTML=explorerKeys().map(key=>`<button type="button" id="test-${key}-tab" role="tab" data-explorer-test="${key}" aria-selected="${key===explorer.test}" aria-controls="test-evidence-panel" tabindex="${key===explorer.test?0:-1}">${explorerTests[key].label}</button>`).join('');
    picker.querySelectorAll('button').forEach(b=>{const selected=b.dataset.explorerTest===explorer.test;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;if(selected&&focusTest)b.focus();});
    const evidence=explorerEvidence();
    const object=scene.querySelector('[data-explorer-object]'),image=scene.querySelector('[data-explorer-image]');
    const narrow=window.matchMedia('(max-width:52rem)').matches;
    const graphic=scene.querySelector('.explorer-figure svg');
    graphic.setAttribute('viewBox',narrow?`0 0 480 ${explorer.overlay?365:700}`:'0 0 960 365');
    object.style.transform=`translate(160px,${narrow&&!explorer.overlay?230:265}px)`;
    object.innerHTML=explorerTriangle('ABC');image.innerHTML=explorerTriangle('DEF',evidence.k);
    image.style.transform=`translate(${explorer.overlay||narrow?160:640}px,${narrow&&!explorer.overlay?530:265}px) scale(${evidence.k})`;
    const captions=scene.querySelectorAll('.explorer-caption');
    captions[0].textContent=explorer.overlay?'OBJECT + IMAGE':'OBJECT · ABC';
    captions[0].setAttribute('y',narrow&&!explorer.overlay?315:337);
    captions[1].setAttribute('x',narrow?250:740);captions[1].setAttribute('y',narrow?650:337);
    captions[1].style.opacity=explorer.overlay?'0':'1';
    image.style.setProperty('--triangle-scale',evidence.k);
    scene.classList.toggle('is-overlaid',explorer.overlay);
    scene.querySelector('.explorer-figure svg').setAttribute('aria-label',`${evidence.result}. ${evidence.heading} Scale factor ${evidence.k}. ${evidence.note}`);
    scene.querySelector('#test-evidence-panel').setAttribute('aria-labelledby',`test-${explorer.test}-tab`);
    scene.querySelectorAll('[data-relationship]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.relationship===explorer.mode)));
    scene.querySelector('[data-explorer-scales]').hidden=explorer.mode==='congruent';
    scene.querySelectorAll('[data-explorer-scale]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.explorerScale)===explorer.scale)));
    const overlay=scene.querySelector('[data-explorer-overlay]');overlay.setAttribute('aria-pressed',String(explorer.overlay));overlay.textContent=explorer.overlay?'Separate triangles':'Overlay triangles';
    scene.querySelector('[data-explorer-explanation]').innerHTML=`<span class="eyebrow">${explorer.test==='shape'?'The difference':esc(explorerTests[explorer.test].label)+' evidence'}</span><h3>${esc(evidence.heading)}</h3><p>${esc(evidence.detail)}</p><div class="explorer-facts">${evidence.facts.map(f=>`<p>${esc(f)}</p>`).join('')}</div><p class="explorer-note">${esc(evidence.note)}</p><p class="explorer-result">${esc(evidence.result)}<span>k = ${format(evidence.k)}${explorer.mode==='similar'&&evidence.k===1?' · also congruent':''}</span></p>`;
  }
  function comparison(s) {
    return `<div class="scene-inner comparison-layout">${title(s)}
      <div class="comparison-mode-tabs" role="tablist" aria-label="Comparison reference">
        <button id="comparison-tests-tab" type="button" role="tab" data-comparison-view="tests" aria-controls="comparison-tests" aria-selected="true">Congruence &amp; similarity tests</button>
        <button id="comparison-properties-tab" type="button" role="tab" data-comparison-view="properties" aria-controls="comparison-properties" aria-selected="false" tabindex="-1">Compare shapes &amp; scale factor</button>
      </div>
      <div id="comparison-properties" class="comparison-properties" role="tabpanel" data-comparison-panel="properties" aria-labelledby="comparison-properties-tab" hidden inert>
        <p class="comparison-shared"><span>BOTH</span><strong>Same shape. Equal corresponding angles.</strong><span class="shared-reminder">Angles do not scale.</span></p>
        <div class="properties-scroll"><table class="properties-table" aria-label="Common properties and differences between congruent and similar triangles">
          <thead><tr><th scope="col">Compare</th><th scope="col">Congruent <span>≡</span><small>Same shape <mark>and same size</mark>.</small></th><th scope="col">Similar <span>∼</span><small>Same shape; <mark>size may differ</mark>.</small></th></tr></thead>
          <tbody><tr><th scope="row">Corresponding sides</th><td data-column="Congruent"><mark>Equal lengths</mark><small>3 → 3, 4 → 4, 5 → 5</small></td><td data-column="Similar"><mark>All in the same ratio</mark><small>3 → 6, 4 → 8, 5 → 10</small></td></tr>
          <tr><th scope="row">Scale factor</th><td data-column="Congruent"><strong>k = 1</strong><small>Every length stays the same.</small></td><td data-column="Similar"><strong>Any k &gt; 0</strong><small>Includes k = 1: same size is allowed.</small></td></tr></tbody>
        </table></div>
        <section class="scale-definition" aria-labelledby="scale-definition-title">
          <div class="scale-meaning"><h3 id="scale-definition-title">Scale factor k <span>Object → image</span></h3><p>The multiplier for <b>every corresponding length</b>.</p><p class="ratio-formula"><b>k =</b><span class="fraction"><span>image side length</span><span>object side length</span></span></p></div>
          <div class="scale-cases"><p class="image-length-rule">Image length = object length × k</p><dl>
            <div><dt>k = 1</dt><dd>Same size<span>5 cm → 5 cm</span></dd></div>
            <div><dt>k &gt; 1</dt><dd>Enlargement<span>5 cm → 10 cm · k = 2</span></dd></div>
            <div><dt>0 &lt; k &lt; 1</dt><dd>Reduction<span>5 cm → 2.5 cm · k = ½</span></dd></div>
          </dl></div>
        </section>
        <p class="comparison-connection">Congruent triangles are <b>also similar</b>: their scale factor is <mark>k = 1</mark>.</p>
      </div>
      <div id="comparison-tests" class="comparison-tests" role="tabpanel" data-comparison-panel="tests" aria-labelledby="comparison-tests-tab">
        <p class="slide-instruction">Match corresponding parts. Look for <mark>equal lengths</mark> or <mark>the same side ratio</mark>.</p>
        <div class="comparison-scroll"><table class="comparison-table"><thead><tr><th scope="col">Test</th><th scope="col">Congruent · ≡</th><th scope="col">Similar · ∼</th></tr></thead><tbody><tr><th scope="row">SSS</th><td>Three <mark>equal</mark> side pairs.</td><td>Three side pairs <mark>in the same ratio</mark>.</td></tr><tr><th scope="row">SAS</th><td>Two <mark>equal</mark> side pairs + equal included angle.</td><td>Two side pairs <mark>in the same ratio</mark> + equal included angle.</td></tr><tr><th scope="row">Angles</th><td><b>AAS / ASA:</b> two equal angle pairs + <mark>an equal corresponding side</mark>.</td><td><b>AA / AAA:</b> two equal angle pairs; <mark>no side length needed</mark>.</td></tr><tr><th scope="row">RHS</th><td>Right angles + <mark>equal</mark> hypotenuses + one <mark>equal</mark> matching leg.</td><td>Right angles + hypotenuse and one matching leg <mark>in the same ratio</mark>.</td></tr></tbody></table></div>
        <p class="takeaway"><span>WATCH OUT</span><strong>AAA does not fix size. SAS needs the included angle; SSA is not a general test.</strong></p>
      </div></div>`;
  }
  function setComparisonView(view,focus=false) {
    const scene=document.querySelector('.scene-comparison');
    if(!scene||!['properties','tests'].includes(view))return;
    scene.querySelectorAll('[data-comparison-view]').forEach(button=>{
      const selected=button.dataset.comparisonView===view;
      button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;
      if(selected&&focus)button.focus();
    });
    scene.querySelectorAll('[data-comparison-panel]').forEach(panel=>{
      const selected=panel.dataset.comparisonPanel===view;
      panel.hidden=!selected;panel.inert=!selected;
    });
  }
  const questions=[
    {title:'Read the side evidence',prompt:'Use only the labelled lengths. Which test establishes congruence?',visual:congruent('sss'),options:['SSS','SAS','AAA'],answer:0,hint:'How many complete pairs of side lengths are given?',solution:'SSS: AB = DE, AC = DF and BC = EF. All three corresponding side pairs are equal.'},
    {title:'Locate the included angle',prompt:'Which test uses the two given sides and the marked angle?',visual:congruent('sas'),options:['RHS','SAS','SSA'],answer:1,hint:'The marked angle is between the two known sides. Is a hypotenuse length given?',solution:'SAS: two side pairs are equal and the included angles are both 90°. RHS is not supported by the marked evidence because no hypotenuse length is given.'},
    {title:'Find the hypotenuse first',prompt:'Which test is supported by these right angles and labelled lengths?',visual:congruent('rhs'),options:['SAS','AAA','RHS'],answer:2,hint:'The side opposite the right angle is the hypotenuse.',solution:'RHS: both triangles are right-angled, BC = EF (hypotenuses) and AC = DF (matching legs). The right angle is not between the two labelled sides, so this is not SAS evidence.'},
    {title:'What does the evidence guarantee?',prompt:'Two triangles have the same three angles. Which conclusion is guaranteed?',visual:window.GEOMETRY.trianglePair('aaa'),options:['They are congruent.','They are similar; their sizes may differ.','Their areas are equal.'],answer:1,hint:'Could one triangle be a larger copy of the other?',solution:'AAA / AA guarantees similarity. It gives no scale factor or equal side length, so congruence and equal area are not guaranteed.'},
    {title:'Find the reduction factor',prompt:'Find k for object → image. You can enter a fraction.',visual:practiceDiagram('scale'),answer:2/3,unit:'',hint:'Use image ÷ object. This is a reduction.',solution:'k = 8 ÷ 12 = 2/3. The reverse direction would have scale factor 3/2.'},
    {title:'Find a missing image side',prompt:'Use the marked lengths to find EF.',condition:'△ABC ∼ △DEF',visual:practiceDiagram('missing'),answer:17.5,unit:'cm',hint:'AB ↔ DE gives the scale factor. BC ↔ EF gives the unknown side.',solution:'k = DE / AB = 10 / 4 = 2.5. EF = BC × k = 7 × 2.5 = 17.5 cm.'}
  ];
  let current=0;
  const states=questions.map(()=>({value:'',checked:false,correct:false,hint:false,solution:false}));
  function quiz(s){return `<div class="scene-inner quiz-layout">${title(s)}<div class="quiz-toolbar"><p>Write a reason or calculation before checking.</p><strong data-q-score>0 / ${questions.length} correct</strong></div><div class="quiz-dots" role="group" aria-label="Practice questions">${questions.map((q,i)=>`<button type="button" data-q-index="${i}" aria-label="Question ${i+1}: ${esc(q.title)}" aria-pressed="${i===0}">${i+1}</button>`).join('')}</div><div class="quiz-body" data-quiz-body></div><p class="quiz-footnote">Use the <a href="#slide-4">test table</a> when you need a reminder.</p><div class="quiz-print-key"><h3>Practice answer key</h3><ol>${questions.map(q=>`<li><strong>${esc(q.title)}</strong><p>${esc(q.solution)}</p></li>`).join('')}</ol></div></div>`;}

  function updateQuiz() {
    const host=document.querySelector('[data-quiz-body]');if(!host)return;
    const q=questions[current],st=states[current];
    host.innerHTML=`<figure class="math-figure quiz-visual">${q.condition?`<p class="diagram-condition">${esc(q.condition)}</p>`:''}${q.visual||`<div class="given-card"><span>GIVEN</span><strong>${esc(q.given).replaceAll('\n','<br>')}</strong></div>`}<figcaption>${q.visual?'Use the marked measurements. Diagrams are not necessarily to scale.':'Use the matching order or relationship to set up your calculation.'}</figcaption></figure><section class="quiz-answer"><span class="eyebrow">Question ${current+1} of ${questions.length}</span><h3>${esc(q.title)}</h3><p>${esc(q.prompt)}</p>${q.options?`<div class="quiz-options">${q.options.map((o,i)=>`<button type="button" data-q-option="${i}" aria-pressed="${st.value===String(i)}" class="${st.value===String(i)?'selected':''}"><span>${String.fromCharCode(65+i)}</span>${esc(o)}</button>`).join('')}</div>`:`<label class="sr-only" for="practiceAnswer">Your answer</label><div class="numeric-answer"><input type="text" inputmode="decimal" id="practiceAnswer" placeholder="Your answer" autocomplete="off" value="${esc(st.value)}"><span>${esc(q.unit)}</span></div>`}<div class="quiz-actions"><button class="primary-button" type="button" data-q-action="check" ${st.value===''?'disabled':''}>Check answer</button><button class="text-button" type="button" data-q-action="hint" aria-expanded="${st.hint}">Hint</button><button class="text-button" type="button" data-q-action="solution" aria-expanded="${st.solution}">${st.solution?'Hide solution':'Show solution'}</button></div><div class="quiz-feedback" aria-live="polite">${st.checked?`<p class="answer-result ${st.correct?'correct':'try-again'}">${st.correct?'✓ Correct. Explain your reasoning.':'Try again. Check the corresponding parts and your calculation.'}</p>`:''}${st.hint?`<p class="quiz-hint"><b>Hint:</b> ${esc(q.hint)}</p>`:''}${st.solution?`<p class="quiz-solution"><b>Solution:</b> ${esc(q.solution)}</p>`:''}</div><div class="quiz-bottom"><button class="text-button" type="button" data-q-action="reset">Reset question</button><button class="quiet-button" type="button" data-q-action="next" ${current===questions.length-1?'disabled':''}>Next question →</button></div></section>`;
    document.querySelector('[data-q-score]').textContent=`${states.filter(s=>s.correct).length} / ${questions.length} correct`;
    document.querySelectorAll('[data-q-index]').forEach(b=>{const i=Number(b.dataset.qIndex);b.setAttribute('aria-pressed',String(i===current));b.classList.toggle('solved',states[i].correct);});
  }
  document.addEventListener('click',e=>{
    const referenceTab=e.target.closest('[data-comparison-view]');
    if(referenceTab){setComparisonView(referenceTab.dataset.comparisonView);return;}
    const mode=e.target.closest('[data-relationship]');if(mode){explorer.mode=mode.dataset.relationship;updateExplorer({rebuildPicker:true});return;}
    const test=e.target.closest('[data-explorer-test]');if(test){explorer.test=test.dataset.explorerTest;updateExplorer();return;}
    const scale=e.target.closest('[data-explorer-scale]');if(scale){explorer.scale=Number(scale.dataset.explorerScale);updateExplorer();return;}
    if(e.target.closest('[data-explorer-overlay]')){explorer.overlay=!explorer.overlay;updateExplorer();return;}
    if(e.target.closest('[data-explorer-reset]')){Object.assign(explorer,{mode:'congruent',test:'shape',scale:1.5,overlay:false});updateExplorer({rebuildPicker:true});return;}
    const choice=e.target.closest('[data-q-option]');if(choice){states[current].value=choice.dataset.qOption;states[current].checked=false;states[current].correct=false;updateQuiz();}
    const jump=e.target.closest('[data-q-index]');if(jump){current=Number(jump.dataset.qIndex);updateQuiz();}
    const button=e.target.closest('[data-q-action]');if(!button)return;
    const st=states[current],q=questions[current];
    if(button.dataset.qAction==='check'){
      if(st.value==='')return;
      let value=NaN;
      const raw=st.value.trim();
      if(/^-?(?:\d+(?:\.\d*)?|\.\d+)$/.test(raw))value=Number(raw);
      else if(/^-?\d+(?:\.\d+)?\s*\/\s*\d+(?:\.\d+)?$/.test(raw)){const [a,b]=raw.split('/').map(Number);if(b!==0)value=a/b;}
      st.correct=Math.abs(value-q.answer)<1e-8;st.checked=true;
    }
    if(button.dataset.qAction==='hint')st.hint=!st.hint;
    if(button.dataset.qAction==='solution')st.solution=!st.solution;
    if(button.dataset.qAction==='reset')states[current]={value:'',correct:false,checked:false,hint:false,solution:false};
    if(button.dataset.qAction==='next')current=Math.min(current+1,questions.length-1);
    updateQuiz();
  });
  document.addEventListener('input',e=>{
    if(e.target.matches('#practiceAnswer')){states[current].value=e.target.value;states[current].checked=false;states[current].correct=false;document.querySelector('[data-q-score]').textContent=`${states.filter(s=>s.correct).length} / ${questions.length} correct`;document.querySelector(`[data-q-index="${current}"]`).classList.remove('solved');const b=document.querySelector('[data-q-action="check"]');b.disabled=e.target.value.trim()==='';const feedback=document.querySelector('.answer-result');if(feedback)feedback.remove();}
  });
  document.addEventListener('keydown',e=>{
    if(e.target.matches('#practiceAnswer')&&e.key==='Enter'){e.preventDefault();document.querySelector('[data-q-action="check"]').click();}
  });
  window.addEventListener('resize',()=>updateExplorer());
  document.addEventListener('DOMContentLoaded',()=>{
    updateExplorer();updateQuiz();
    document.querySelector('[data-test-picker]')?.addEventListener('keydown',e=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
      e.preventDefault();e.stopPropagation();
      const keys=explorerKeys(),index=keys.indexOf(explorer.test);
      const next=e.key==='Home'?0:e.key==='End'?keys.length-1:(index+(e.key==='ArrowRight'?1:-1)+keys.length)%keys.length;
      explorer.test=keys[next];updateExplorer({focusTest:true});
    });
    document.querySelector('.comparison-mode-tabs')?.addEventListener('keydown',e=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
      e.preventDefault();e.stopPropagation();
      const current=document.querySelector('[data-comparison-view][aria-selected="true"]').dataset.comparisonView;
      const next=e.key==='Home'?'tests':e.key==='End'?'properties':current==='properties'?'tests':'properties';
      setComparisonView(next,true);
    });
  });
  window.TRIANGLES={congruent,kite,ssa,cover,questions};
  window.LESSON_RENDERERS={...window.LESSON_RENDERERS,testExplorer,comparison,quiz,practice};
}());
