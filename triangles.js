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
  function triangleLab(s) {
    return `<div class="scene-inner triangle-lab-layout">${title(s)}<p class="slide-instruction">${esc(s.prompt)}</p><div class="triangle-lab-stage"><figure class="math-figure"><div data-triangle-canvas></div><figcaption>Corresponding sides keep their colours. Rotation and reflection do not change lengths.</figcaption></figure><div class="triangle-controls"><span class="eyebrow">Object → image</span><output data-tri-factor>k = 1</output><label for="triangleScale">Scale factor</label><input id="triangleScale" type="range" min="0.5" max="2" step="0.25" value="1" aria-label="Triangle scale factor"><div class="triangle-presets">${[0.5,1,1.5,2].map(k=>`<button type="button" data-tri-scale="${k}" aria-pressed="${k===1}">×${k}</button>`).join('')}</div><label for="triangleRotation">Rotation <span data-tri-degrees>0°</span></label><input id="triangleRotation" type="range" min="-180" max="180" step="15" value="0" aria-label="Triangle rotation"><div class="triangle-tools"><button class="quiet-button" type="button" data-tri-reflect aria-pressed="false">Reflect</button><button class="text-button" type="button" data-tri-reset>Reset</button></div><p class="triangle-verdict" aria-live="polite" data-tri-verdict></p><p class="triangle-measures" data-tri-measures></p></div></div><p class="takeaway"><span>KEY IDEA</span><strong>Both: equal corresponding angles. Congruent: equal sides. Similar: proportional sides.</strong></p></div>`;
  }
  function updateTriangle() {
    const scene=document.querySelector('.scene-triangleLab');if(!scene)return;
    const k=Number(scene.querySelector('#triangleScale').value),r=Number(scene.querySelector('#triangleRotation').value),reflect=scene.querySelector('[data-tri-reflect]').getAttribute('aria-pressed')==='true';
    const base=[[-4/3,1],[8/3,1],[-4/3,-2]];
    const make=(cx,scale,rot,flip,letters)=>{
      const a=rot*Math.PI/180;
      const pts=base.map(([x,y])=>{x*=flip?-1:1;return [cx+(x*Math.cos(a)-y*Math.sin(a))*48*scale,205+(x*Math.sin(a)+y*Math.cos(a))*48*scale];});
      let b=polygon(pts);
      const e=[[0,2,'edge-a',3],[0,1,'edge-b',4],[1,2,'edge-c',5]];
      for(const [j,z,cls,length]of e){b+=line(pts[j],pts[z],cls);const mx=(pts[j][0]+pts[z][0])/2,my=(pts[j][1]+pts[z][1])/2,dx=mx-cx,dy=my-205,n=Math.hypot(dx,dy)||1;b+=text(mx+dx/n*26,my+dy/n*26+7,Number((length*scale).toFixed(2)),'lab-side-label');}
      pts.forEach((p,i)=>{const dx=p[0]-cx,dy=p[1]-205,n=Math.hypot(dx,dy);b+=text(p[0]+dx/n*23,p[1]+dy/n*23+6,letters[i],'lab-vertex');});
      // Right-angle marker transforms with the triangle; labels remain upright.
      const u=[(pts[1][0]-pts[0][0])/(192*scale),(pts[1][1]-pts[0][1])/(192*scale)],v=[(pts[2][0]-pts[0][0])/(144*scale),(pts[2][1]-pts[0][1])/(144*scale)];
      const mark=[pts[0].map((x,i)=>x+u[i]*13),pts[0].map((x,i)=>x+(u[i]+v[i])*13),pts[0].map((x,i)=>x+v[i]*13)];
      b+=`<polyline points="${mark.map(v=>v.join(',')).join(' ')}" class="lab-right"/>`;
      return b;
    };
    // The image has its own spacious viewBox so every rotation fits at k = 2.
    scene.querySelector('[data-triangle-canvas]').innerHTML=`<div class="triangle-canvases">${svg('Object ABC, a 3-4-5 triangle.',make(230,1,0,false,'ABC')+text(230,-70,'OBJECT · ABC','shape-tag'),'-90 -110 640 640')}${svg(`Image DEF: scale factor ${k}, rotation ${r} degrees${reflect?', reflected':''}.`,make(230,k,r,reflect,'DEF')+text(230,-70,'IMAGE · DEF','shape-tag'),'-90 -110 640 640')}</div>`;
    scene.querySelector('[data-tri-factor]').textContent=`k = ${k}`;
    scene.querySelector('[data-tri-degrees]').textContent=`${r}°`;
    scene.querySelector('[data-tri-verdict]').innerHTML=k===1?'△ABC ≡ △DEF<br><small>Congruent — and also similar.</small>':'△ABC ∼ △DEF<br><small>Similar, with a different size.</small>';
    scene.querySelector('[data-tri-measures]').textContent=`3 → ${3*k}  ·  4 → ${4*k}  ·  5 → ${5*k}`;
    scene.querySelectorAll('[data-tri-scale]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.triScale)===k)));
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
    {level:'Core',title:'Read the side evidence',prompt:'Use only the labelled lengths. Which test establishes congruence?',visual:congruent('sss'),options:['SSS','SAS','AAA'],answer:0,hint:'How many complete pairs of side lengths are given?',solution:'SSS: AB = DE, AC = DF and BC = EF. All three corresponding side pairs are equal.'},
    {level:'Core',title:'Locate the included angle',prompt:'Which test uses the two given sides and the marked angle?',visual:congruent('sas'),options:['RHS','SAS','SSA'],answer:1,hint:'The marked angle is between the two known sides. Is a hypotenuse length given?',solution:'SAS: two side pairs are equal and the included angles are both 90°. RHS is not supported by the marked evidence because no hypotenuse length is given.'},
    {level:'Core',title:'Use angles and a side',prompt:'Which test uses the two marked angles and the given side?',visual:congruent('aas'),options:['AAA only','SSS','AAS'],answer:2,hint:'Angles fix the shape. The equal corresponding side also fixes the size.',solution:'AAS: angles A and D match, angles B and E match, and BC = EF. The given side is not between the two given angles.'},
    {level:'Core',title:'Find the hypotenuse first',prompt:'Which test is supported by these right angles and labelled lengths?',visual:congruent('rhs'),options:['SAS','AAA','RHS'],answer:2,hint:'The side opposite the right angle is the hypotenuse.',solution:'RHS: both triangles are right-angled, BC = EF (hypotenuses) and AC = DF (matching legs). The right angle is not between the two labelled sides, so this is not SAS evidence.'},
    {level:'Develop',title:'Match the angle, not its position',prompt:'The triangles are congruent. Find the marked angle ∠Q.',condition:'△ABC ≡ △QPR',visual:practiceDiagram('congruentAngle'),answer:48,unit:'°',hint:'Use the first letters of the congruence statement: A corresponds to Q.',solution:'A ↔ Q, B ↔ P, C ↔ R. Corresponding angles are equal, so ∠Q = 48°.'},
    {level:'Develop',title:'Find an angle in a similar triangle',prompt:'Find the marked angle ∠N. Use the angle sum in △ABC first.',condition:'△ABC ∼ △LMN',visual:practiceDiagram('similarAngle'),answer:65,unit:'°',hint:'N corresponds to C. Find C using the angle sum before transferring it.',solution:'∠C = 180° − 42° − 73° = 65°. Since C ↔ N, ∠N = 65°. Similarity does not scale angles.'},
    {level:'Develop',title:'Find the reduction factor',prompt:'Find k for object → image. You can enter a fraction.',visual:practiceDiagram('scale'),answer:2/3,unit:'',hint:'Use image ÷ object. This is a reduction.',solution:'k = 8 ÷ 12 = 2/3. The reverse direction would have scale factor 3/2.'},
    {level:'Develop',title:'Find a missing image side',prompt:'Use the marked lengths to find EF.',condition:'△ABC ∼ △DEF',visual:practiceDiagram('missing'),answer:17.5,unit:'cm',hint:'AB ↔ DE gives the scale factor. BC ↔ EF gives the unknown side.',solution:'k = DE / AB = 10 / 4 = 2.5. EF = BC × k = 7 × 2.5 = 17.5 cm.'},
    {level:'Challenge',title:'What does the evidence guarantee?',prompt:'Two triangles have the same three angles. Which conclusion is guaranteed?',visual:window.GEOMETRY.trianglePair('aaa'),options:['They are congruent.','They are similar; their sizes may differ.','Their areas are equal.'],answer:1,hint:'Could one triangle be a larger copy of the other?',solution:'AAA / AA guarantees similarity. It gives no scale factor or equal side length, so congruence and equal area are not guaranteed.'},
    {level:'Challenge',title:'Complete a short proof',prompt:'MP = MQ and NP = NQ. Which extra fact completes an SSS proof that △MNP ≡ △MNQ?',visual:kite(),options:['∠P = ∠Q because they look equal.','Both triangles have the same perimeter.','MN = MN because it is a common side.'],answer:2,hint:'Trace each triangle. Which edge belongs to both?',solution:'MN = MN (common side). With MP = MQ and NP = NQ, all three corresponding side pairs are equal, so △MNP ≡ △MNQ by SSS.'},
    {level:'Challenge',title:'Check a proposed SAS proof',prompt:'Another triangle has the same two marked lengths and angle A. A student claims “congruent by SAS”. What is missing?',visual:practiceDiagram('ssa'),options:['Nothing: any matching angle works.','The included-angle condition is missing.','SAS requires three equal side pairs.'],answer:1,hint:'Read the middle letter of SAS and locate that angle.',solution:'SAS requires the equal angle between the two given sides. SSA is not a general congruence test. This evidence alone does not guarantee congruence.'},
    {level:'Challenge',title:'Use the whole side',prompt:'The triangles are similar. Side 2 matches 8; side b matches the whole side 9 + b. Find b.',visual:practiceDiagram('whole'),answer:3,unit:'',hint:'The factor is 4. Multiply the whole small side b by 4.',solution:'4b = 9 + b, so 3b = 9 and b = 3. Check: (9 + 3) / 3 = 4.'}
  ];
  let current=0;
  const states=questions.map(()=>({value:'',checked:false,correct:false,hint:false,solution:false}));
  function quiz(s){return `<div class="scene-inner quiz-layout">${title(s)}<div class="quiz-toolbar"><div class="quiz-levels" role="group" aria-label="Choose practice level">${['Core','Develop','Challenge'].map((v,i)=>`<button class="quiet-button" type="button" data-q-level="${i*4}" aria-pressed="${i===0}">${v}</button>`).join('')}</div><strong data-q-score>0 / ${questions.length} solved</strong></div><div class="quiz-dots" role="group" aria-label="Practice questions">${questions.map((q,i)=>`<button type="button" data-q-index="${i}" aria-label="Question ${i+1}: ${esc(q.title)}" aria-pressed="${i===0}">${i+1}</button>`).join('')}</div><div class="quiz-body" data-quiz-body></div><p class="quiz-footnote">Write your working first. Hints and solutions are available when you need them.</p></div>`;}
  function updateQuiz() {
    const host=document.querySelector('[data-quiz-body]');if(!host)return;
    const q=questions[current],st=states[current];
    host.innerHTML=`<figure class="math-figure quiz-visual">${q.condition?`<p class="diagram-condition">${esc(q.condition)}</p>`:''}${q.visual||`<div class="given-card"><span>GIVEN</span><strong>${esc(q.given).replaceAll('\n','<br>')}</strong></div>`}<figcaption>${q.visual?'Use the marked measurements. Diagrams are not necessarily to scale.':'Use the matching order or relationship to set up your calculation.'}</figcaption></figure><section class="quiz-answer"><span class="eyebrow">${q.level} · Question ${current+1} of ${questions.length}</span><h3>${esc(q.title)}</h3><p>${esc(q.prompt)}</p>${q.options?`<div class="quiz-options">${q.options.map((o,i)=>`<button type="button" data-q-option="${i}" aria-pressed="${st.value===String(i)}" class="${st.value===String(i)?'selected':''}"><span>${String.fromCharCode(65+i)}</span>${esc(o)}</button>`).join('')}</div>`:`<label class="sr-only" for="practiceAnswer">Your answer</label><div class="numeric-answer"><input type="text" inputmode="decimal" id="practiceAnswer" placeholder="Your answer" autocomplete="off" value="${esc(st.value)}"><span>${esc(q.unit)}</span></div>`}<div class="quiz-actions"><button class="primary-button" type="button" data-q-action="check" ${st.value===''?'disabled':''}>Check answer</button><button class="text-button" type="button" data-q-action="hint" aria-expanded="${st.hint}">Hint</button><button class="text-button" type="button" data-q-action="solution" aria-expanded="${st.solution}">${st.solution?'Hide solution':'Show solution'}</button></div><div class="quiz-feedback" aria-live="polite">${st.checked?`<p class="answer-result ${st.correct?'correct':'try-again'}">${st.correct?'✓ Correct. Explain your reasoning.':'Try again. Check the corresponding parts and your calculation.'}</p>`:''}${st.hint?`<p class="quiz-hint"><b>Hint:</b> ${esc(q.hint)}</p>`:''}${st.solution?`<p class="quiz-solution"><b>Solution:</b> ${esc(q.solution)}</p>`:''}</div><div class="quiz-bottom"><button class="text-button" type="button" data-q-action="reset">Reset question</button><button class="quiet-button" type="button" data-q-action="next" ${current===questions.length-1?'disabled':''}>Next question →</button></div></section>`;
    document.querySelector('[data-q-score]').textContent=`${states.filter(s=>s.correct).length} / ${questions.length} solved`;
    document.querySelectorAll('[data-q-index]').forEach(b=>{const i=Number(b.dataset.qIndex);b.setAttribute('aria-pressed',String(i===current));b.classList.toggle('solved',states[i].correct);});
    document.querySelectorAll('[data-q-level]').forEach(b=>b.setAttribute('aria-pressed',String(Math.floor(Number(b.dataset.qLevel)/4)===Math.floor(current/4))));
  }
  document.addEventListener('click',e=>{
    const referenceTab=e.target.closest('[data-comparison-view]');
    if(referenceTab){setComparisonView(referenceTab.dataset.comparisonView);return;}
    const scale=e.target.closest('[data-tri-scale]');if(scale){document.querySelector('#triangleScale').value=scale.dataset.triScale;updateTriangle();}
    const flip=e.target.closest('[data-tri-reflect]');if(flip){flip.setAttribute('aria-pressed',String(flip.getAttribute('aria-pressed')!=='true'));updateTriangle();}
    if(e.target.closest('[data-tri-reset]')){document.querySelector('#triangleScale').value=1;document.querySelector('#triangleRotation').value=0;document.querySelector('[data-tri-reflect]').setAttribute('aria-pressed','false');updateTriangle();}
    const choice=e.target.closest('[data-q-option]');if(choice){states[current].value=choice.dataset.qOption;states[current].checked=false;states[current].correct=false;updateQuiz();}
    const jump=e.target.closest('[data-q-index],[data-q-level]');if(jump){current=Number(jump.dataset.qIndex??jump.dataset.qLevel);updateQuiz();}
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
    if(e.target.matches('#triangleScale,#triangleRotation'))updateTriangle();
    if(e.target.matches('#practiceAnswer')){states[current].value=e.target.value;states[current].checked=false;states[current].correct=false;document.querySelector('[data-q-score]').textContent=`${states.filter(s=>s.correct).length} / ${questions.length} solved`;document.querySelector(`[data-q-index="${current}"]`).classList.remove('solved');const b=document.querySelector('[data-q-action="check"]');b.disabled=e.target.value.trim()==='';const feedback=document.querySelector('.answer-result');if(feedback)feedback.remove();}
  });
  document.addEventListener('keydown',e=>{
    if(e.target.matches('#practiceAnswer')&&e.key==='Enter'){e.preventDefault();document.querySelector('[data-q-action="check"]').click();}
  });
  document.addEventListener('DOMContentLoaded',()=>{
    updateTriangle();updateQuiz();
    document.querySelector('.comparison-mode-tabs')?.addEventListener('keydown',e=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
      e.preventDefault();e.stopPropagation();
      const current=document.querySelector('[data-comparison-view][aria-selected="true"]').dataset.comparisonView;
      const next=e.key==='Home'?'tests':e.key==='End'?'properties':current==='properties'?'tests':'properties';
      setComparisonView(next,true);
    });
  });
  function pairedExampleDiagram(kind=0) {
    const config=[{letters:'ABC',k:1,turned:false,side:'6 cm',angle:'65°'},
      {letters:'DEF',k:1,turned:true,side:'x',angle:'θ'},
      {letters:'PQR',k:1.5,turned:false,side:'y',angle:'φ'}][kind];
    const base=[[0,-86.67],[-100,43.33],[130/Math.tan(65*Math.PI/180),43.33]];
    const p=base.map(([x,y])=>[190+x*config.k*(config.turned?-1:1),160+y*config.k*(config.turned?-1:1)]);
    return svg(`${config.letters}: ${kind===0?'AB = 6 cm and angle C = 65 degrees':kind===1?'congruent to ABC, with DE = x and angle F = theta':'similar to ABC with scale factor 1.5, PQ = y and angle R = phi'}.`,
      labelledTriangle(p,config.letters,{sides:[{edge:0,label:config.side,offset:25}],angles:[{index:2,label:config.angle,radius:24,distance:kind===0?60:48}]}),'0 -25 380 320');
  }
  function pairedExample(s) {
    const panels=[['Object · ABC','AB = 6 cm · ∠C = 65°'],['Congruent · DEF','△ABC ≡ △DEF'],['Similar · PQR','△ABC ∼ △PQR · k = 1.5']];
    return `<div class="scene-inner worked-comparison">${title(s)}<p class="diagram-prompt">${esc(s.prompt)}</p><div class="worked-triangles">${panels.map(([label,relation],i)=>`<article class="worked-triangle"><header><h3>${esc(label)}</h3></header>${pairedExampleDiagram(i)}<p class="worked-relation">${esc(relation)}</p></article>`).join('')}</div><div class="evidence-panel worked-reasoning" data-reveal-style="focus"><ol class="evidence-list focus-step-list" aria-live="polite">${s.steps.map((step,i)=>`<li class="evidence-step" data-evidence-step hidden><span>${String(i+1).padStart(2,'0')}</span><div><strong>${esc(step.label)}</strong><p>${esc(step.body)}</p>${step.emphasis?`<p class="step-result">${esc(step.emphasis)}</p>`:''}</div></li>`).join('')}</ol><div class="evidence-actions"><button class="primary-button" type="button" data-geometry="reveal" aria-expanded="false">Reveal reasoning</button><button class="text-button" type="button" data-geometry="previous" disabled>Previous step</button><button class="text-button" type="button" data-geometry="reset">Reset</button><span class="reveal-count">0 / ${s.steps.length}</span></div></div><p class="takeaway"><span>REMEMBER</span><strong>${esc(s.takeaway)}</strong></p></div>`;
  }
  window.TRIANGLES={congruent,kite,ssa,cover,questions,pairedExampleDiagram};
  window.LESSON_RENDERERS={...window.LESSON_RENDERERS,triangleLab,comparison,quiz,pairedExample,practice};
}());
