# year8-revision

Interactive classroom lesson for Jacaranda Maths Quest 8, section 6.5 (printed pp. 270–280).

6 slides focused on revision rather than a new lesson. Student-facing text is English; teacher notes are Chinese.

1. A brief opening focused on shape and size.
2. Two warm-up questions: reflection and scale factor.
3. An interactive visual recap of the differences and test evidence.
4. The retained comparison tables for tests, properties and scale factor.
5. Six selected practice questions, without difficulty levels.
6. Two short exit questions.

The visual recap takes about 5–7 minutes. Select only the tests students need to revisit, then move into independent practice and feedback. The former transformation lab, worked comparison and separate error-analysis checkpoint are removed.

The original theme and navigation are reused from [ChengGuang-Li/year8-similar](https://github.com/ChengGuang-Li/year8-similar), commit `ac17890`. The cream dotted paper, typography, red/yellow accents, presentation controls and teacher notes are retained. This is a separate project for the next lesson.

## Run and build

No dependency installation is required. Open `index.html` directly for offline use, or:

```sh
npm run dev
npm run build
npm run preview
```

The build copies and syntax-checks eight static assets into `dist/`. No textbook PDF, screenshots, student information, external fonts or third-party APIs are included.

## Classroom controls

| Action | Control |
| --- | --- |
| Previous / next slide | Arrow keys, Page Up / Page Down, footer buttons |
| Jump to a slide | Slides |
| First / last slide | Home / End |
| Teacher notes | N or Notes; Esc to close |
| Full-screen presentation | Present |
| Highlight test evidence | Slide 3: Congruent / Similar, then a test button |
| Compare object and image | Slide 3: Overlay triangles; similar scale factors ½, 1 and 1.5 |
| Reset the visual recap | Slide 3: Reset |
| Practice | Slide 5: six numbered questions, each with hint and solution |
| Check a numeric answer | Check answer or Enter |

Practice is local to the current browser page and resets on refresh. Showing a solution does not mark a question as solved. Notes are visible on the same screen, so keep them closed while projecting unless needed.

## Source organization

- `theme.css`, `deck.js`: original generic presentation shell.
- `geometry.css`, `geometry.js`: original geometry diagrams, reveal controls and optional scale model; initialization is guarded when the square-scale slide is absent.
- `triangles.css`, `triangles.js`: test evidence diagrams, animated overlay, test comparison, and six-question practice.
- `content.js`: teaching sequence, wording, model answers and Chinese teacher notes.
- `scripts/`: dependency-free local server and static build.

For Vercel: Framework `Other`, build command `npm run build`, output directory `dist`. The `.openai/hosting.json` file identifies this separate hosted Site; do not copy its identity into another Site.

## Mathematical details

- SSS, SAS, AAS/ASA and RHS establish congruence when their complete conditions hold.
- AA/AAA establishes similarity; equal angles alone do not establish congruence.
- SSA is not a general congruence or similarity test; SAS requires the included angle.
- Every congruent triangle pair is also similar with k = 1. Rotation and reflection preserve congruence.
- Scale factor consistently means image side length divided by object side length.
- The visual recap offers congruent SSS, SAS, ASA, AAS and RHS, and similar SSS, SAS, AA/AAA and RHS. Highlighting identifies the evidence required; unmarked edges only show the outline.
- Object is the original triangle; image is the transformed triangle. The image can overlap the object, with scale presets showing reduction, equal size and enlargement. In both relationships, corresponding angles stay equal.
- Practice covers SSS, SAS and RHS congruence, AA/AAA similarity, reduction by 2/3 and a missing image side of 17.5 cm.
- Printing shows all six practice solutions as an answer key on the practice slide.
- Numeric inputs accept finite decimal or fraction values; an edited answer must be checked again. Revealing a solution does not earn a solved mark.
