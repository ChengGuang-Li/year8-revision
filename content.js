/* Revision lesson: Jacaranda Maths Quest 8, 6.5. One concept recap, one test table,
   one worked comparison; new mixed practice. Original theme retained. */
(function () {
  'use strict';
  const t=window.TRIANGLES;
  window.LESSON={
    meta:{title:'Congruent & similar triangles',unit:'6.5 · Revision',yearLevel:'Year 8 Mathematics',mark:'△'},
    slides:[
      {
        type:'opening',title:'Congruent & similar triangles',eyebrow:'Year 8 Mathematics · 6.5 · Revision',
        questionLabel:'Today’s focus',question:'What can the evidence tell us?',diagram:t.cover(),
        recall:{label:'Our lesson',text:'Warm up → a short recap → mixed practice.'},
        goals:['Distinguish congruence from similarity.','Choose a test and justify it using the given evidence.','Find unknown sides and angles.'],
        phase:'Start · 1 min',notes:'复习版共8页。建议：开场1分钟，热身5分钟，模型与对照表共6–7分钟，对比例题4分钟，纠错2分钟，独立练习25分钟及集中反馈5分钟，exit ticket3分钟；余下时间用于转换和巡视。三个部分仍为Warm up / Recap / Practice。教学节奏由诊断决定：学生已会的内容快速通过，不逐项重新讲授。第3–5页是仅有的集中讲解；第6页让学生说理由。练习用新数值检查迁移，避免重复例题。Slides可随时跳回对照表。'
      },
      {
        type:'practice',title:'Three quick checks',eyebrow:'01 · Warm up · work independently first',
        instruction:'Use each diagram. Write an answer and a short reason.',
        questions:[
          {label:'Reflect',kind:'reflection',prompt:'Is the reflected image congruent, similar, both, or neither?',answer:'Both. All lengths and angles stay equal; k = 1.'},
          {label:'Find the scale factor',kind:'scale',prompt:'Find k for object → image using the marked sides.',answer:'k = image ÷ object = 15 ÷ 5 = 3.'},
          {label:'Match corresponding parts',kind:'match',given:'Given: △ABC ≡ △DEF',prompt:'Which side and angle match?',parts:['Side BC','Angle ∠A'],answerParts:[['BC','EF'],['∠A','∠D']]}
        ],phase:'Warm up · 5 min',notes:'给2–3分钟安静独立作答，随后快速核对并抽问理由。每题答案独立揭示。Q1诊断翻转后不全等的误解；Q2诊断比例方向；Q3诊断对应关系。只处理实际出现的错误，不把三题再讲成三堂小课。若全班已掌握，可第3页只展示k=1→1.5一次。'
      },
      {
        type:'triangleLab',title:'One model. Two relationships.',eyebrow:'02 · Recap · shape, size and corresponding parts',
        prompt:'At k = 1, turn or reflect the image. Then change k. Explain what stays equal.',
        phase:'Recap · 2–3 min',notes:'定义只集中讲这一次。先k=1旋转或反射：同形同大小，全等，同时相似。再k=1.5：形状相同，边成比例，大小改变。两者对应角都相等。让学生自己说全等看对应边相等、相似看对应边同比例；k=1是两者的连接。无需逐个演示所有预设，选1和1.5即可。'
      },
      {
        type:'comparison',title:'Congruent or similar?',eyebrow:'02 · Recap · what stays the same? What changes?',
        phase:'Recap · 4 min',notes:'默认显示Congruence & similarity tests（三角形全等与相似的判定方法），包含SSS/SAS/AAS/ASA/AA/AAA/RHS及AAA、SSA的提醒。SAS必须是夹角；RHS中的斜边在直角对面。需要复习定义时，点击Compare shapes & scale factor：两者同形、对应角相等；全等还要求同大小、对应边相等、k=1；相似对应边必须全部为同一比例，允许k=1，所以全等也是相似。强调不是每对相似图形大小都不同。Scale factor是所有对应长度共同的乘数，k=像的对应边长÷原图的对应边长；要先匹配边并统一长度单位，再按object→image计算。对比5→5、5→10、5→2.5，分别对应k=1、2、1/2；角度不乘k。后面练习可随时回看本页。'
      },
      {
        type:'pairedExample',title:'Match first. Then calculate.',eyebrow:'02 · One worked comparison · sides and angles',
        prompt:'Find the lengths x and y, then the angles θ and φ.',
        steps:[
          {label:'Match corresponding parts',body:'AB ↔ DE ↔ PQ; ∠C ↔ ∠F ↔ ∠R.'},
          {label:'Find the corresponding lengths',body:'Equal sides: x = 6 cm. Scale sides: y = 6 × 1.5 = 9 cm.'},
          {label:'Find the corresponding angles',body:'∠C ↔ ∠F ↔ ∠R. Both angles stay equal to 65°.',emphasis:'θ = 65°; φ = 65°'}
        ],takeaway:'Scale factor applies to lengths. Corresponding angles stay equal.',
        phase:'Worked comparison · 4 min',notes:'把原先分开的全等求边、相似求边、对应角解释合并为同一道对比例题。AB是已知6cm；DE=x；PQ=y。C角=65°对应F角θ及R角φ。DEF已旋转，不按位置配对。先配对、再用两种边关系，最后一次性处理角度。不要再从头讲四种判定，因为关系已给定。本页留1分钟让学生写出预测后再揭示。'
      },
      {
        type:'check',title:'Spot the mistake',eyebrow:'03 · Checkpoint · justify your decision',
        question:'A student compares triangles with sides 3, 4, 5 and 6, 8, 11. “Two sides double, so the triangles are similar.” Is the argument valid?',
        options:['Yes. Two matching ratios are always enough.','No. The third ratio differs, and no equal included angle is given.','Yes. The longer sides make the image an enlargement.'],correct:1,
        explanation:'6/3 = 2 and 8/4 = 2, but 11/5 = 2.2. SSS similarity fails. Two ratios alone do not establish SAS: the equal included angle is also required.',
        phase:'Checkpoint · 2 min',notes:'先与同桌讨论，再选项核对。重点让学生找出证据缺口，不根据更大或差不多像判断。B正确。此题与前一例不同：需要自己检验相似，不是已知相似再求值。若大多数答错，在对照表只回看SSS/SAS对应行，不重讲全部。'
      },
      {
        type:'quiz',title:'Your turn. Use the evidence.',eyebrow:'03 · Mixed practice · name a test or show your working',
        phase:'Independent practice · 25 min + 5 min feedback',notes:'12题，每层4题。Core Q1–4：SSS、SAS、AAS、RHS各一题；Develop Q5–8：全等对应角48°、相似对应角65°（先用内角和）、缩小比例2/3、相似未知边17.5cm；Challenge Q9–12：AAA证据范围、公共边证明、SSA错误、整边方程b=3。先要求全体做Core，再根据准备度进入Develop和Challenge，不必人人做完全部。学生在本上写题号与过程，可教师投影逐题放行。只讲共性错题；已答对的题让学生简短说明。Hint/solution按需打开，查看解答不计入完成数。第4页可随时作为参考。数值题接受小数或分数。刷新重置本次进度。'
      },
      {
        type:'exit',title:'Can you justify it on your own?',eyebrow:'03 · Exit ticket · fresh examples',
        instruction:'Answer independently. Include the evidence or calculation.',
        prompts:[
          {question:'One triangle has sides 5, 7, 8. Another has sides 10, 14, 16. State the relationship and a test.',answer:'Similar by SSS: 10/5 = 14/7 = 16/8 = 2. They are not congruent because corresponding lengths differ.'},
          {question:'△ABC ≡ △XYZ. BC = 9 cm and ∠B = 58°. Find YZ and ∠Y.',answer:'BC ↔ YZ and B ↔ Y, so YZ = 9 cm and ∠Y = 58°.'},
          {question:'For SAS, where must the given equal angle be?',answer:'Between the two given corresponding sides: it must be the included angle.'}
        ],phase:'Exit ticket · 3 min',notes:'用新数据检查独立迁移，不重复本节例题原数值。Q1看SSS比例检验；Q2同时看对应边与对应角；Q3看SAS关键条件。先收集或巡视答案后才揭示。下一节只针对未掌握项补充。'
      }
    ]
  };
}());
