/* Focused revision: visual differences, test evidence and six selected questions. */
(function () {
  'use strict';
  const t=window.TRIANGLES;
  window.LESSON={
    meta:{title:'Congruent & similar triangles',unit:'6.5 · Revision',yearLevel:'Year 8 Mathematics',mark:'△'},
    slides:[
      {
        type:'opening',title:'Congruent & similar triangles',eyebrow:'Year 8 Mathematics · 6.5 · Revision',
        questionLabel:'Revision focus',question:'Same shape. Same size?',diagram:t.cover(),
        recall:{label:'Our lesson',text:'Two quick checks, a visual recap, then six selected questions.'},
        goals:['Tell congruent and similar triangles apart.','Recognise the evidence for each test.','Use corresponding sides and angles.'],
        phase:'Revision · 1 min',notes:'本节是复习课，共6页。重点只放在全等与相似的区别，以及判定所需的证据。先做两道热身，再按学生实际需要点击第3页的方法，不逐项长讲。第4页保留为随时回看的参考。第5页共6道精选题，所有人使用同一组题，没有难度分层。学生先在本上作答并写理由，再核对。最后两道exit ticket独立完成。'
      },
      {
        type:'practice',title:'Two quick checks',eyebrow:'Warm up · answer first, then compare',
        instruction:'Give an answer and one short reason.',
        questions:[
          {label:'Reflect',kind:'reflection',prompt:'Is the reflected image congruent, similar, both, or neither?',answer:'Both. Reflection preserves lengths and angles. The scale factor is 1.'},
          {label:'Find the scale factor',kind:'scale',prompt:'Find k from object to image using the marked sides.',answer:'k = image ÷ object = 15 ÷ 5 = 3.'}
        ],phase:'Warm up · 3 min',notes:'只保留原来的前两道题，删除对应关系Q3。给1–2分钟独立作答后分别揭示。Q1只确认翻转保持全等，且全等也属于相似；Q2只确认比例方向是像÷原图。若答对直接进入下一页，不展开讲解。'
      },
      {
        type:'testExplorer',title:'Congruent & similar: the evidence',eyebrow:'Visual recap · click a test to highlight its evidence',
        phase:'Visual recap · 5–7 min',notes:'先用Shape & size对照：Congruent同形同大小，所有对应边相等，k=1；Similar同形、所有对应边成同一比例，大小可以不同。OBJECT是原图，IMAGE是变换后的图。点击右侧每条条件，两个图形中对应的边或角会同时变红并加亮，其余证据淡化。ASA/AAS的两个角条件可以分别点击。点击Show all conditions恢复全部条件。Overlay支持叠合比较。相似比例只提供1、2、3，默认2；k=1时它们也全等。随后只点击学生需要复习的方法：全等SSS、SAS、ASA、AAS、RHS；相似SSS、SAS、AA/AAA、RHS。实线粗边及角弧是已知证据，淡边仅是轮廓。同一颜色与同一标记表示对应位置。SAS必须是夹角；ASA的边在两角之间，AAS的边不在两角之间；RHS斜边在直角对面。切换Congruent与Similar时SSS/SAS/RHS保留当前方法，直接比较相等与同比例。无需完整讲授所有按钮。'
      },
      {
        type:'comparison',title:'Congruent or similar?',eyebrow:'Reference · the tests and the differences',
        phase:'Quick reference · 2 min',notes:'保留原第4页的内容及表格。第3页已经用图复习，本页只归纳，不逐行重新讲解。默认是判定方法，另一标签保留定义与比例方向。全等要求对应边相等，相似要求所有相关对应边同比例，两者对应角都相等。AAA仅保证相似，SSA不是一般判定方法。练习遇到困惑时随时用Slides跳回。'
      },
      {
        type:'quiz',title:'Six selected questions',eyebrow:'Practice · choose a test or show your calculation',
        phase:'Independent revision · 15–20 min + feedback',notes:'精选6题，取消Core / Develop / Challenge等级。Q1 SSS全等，Q2 SAS夹角，Q3 RHS斜边与直角边，Q4 AA/AAA只保证相似，Q5缩小比例2/3，Q6相似求未知边17.5cm。所有人先独立在本上作答并写理由，再使用Check answer核对。只集中反馈共同错误。Hint和solution按需点击，查看答案不计入答对数。方法已熟练可快速通过前三题，不新增长例题。'
      },
      {
        type:'exit',title:'One last check',eyebrow:'Exit ticket · two short answers',
        instruction:'Work independently. Include a reason.',
        prompts:[
          {question:'Triangles have sides 5, 7, 8 and 10, 14, 16. Congruent or similar? Name the test.',answer:'Similar by SSS. Each corresponding side has ratio 2. They are not congruent because corresponding lengths differ.'},
          {question:'Are congruent triangles also similar? What stays equal in both relationships?',answer:'Yes, with k = 1. Corresponding angles stay equal in both. Congruent triangles also have equal corresponding side lengths.'}
        ],phase:'Exit ticket · 2 min',notes:'两道简短题检查核心区别。第一题确认同一比例与SSS相似；第二题确认全等是k=1的相似，以及对应角在两者中都相等。先独立作答再揭示，不新增教学内容。'
      }
    ]
  };
}());
