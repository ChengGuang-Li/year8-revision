# year8-revision

Interactive classroom lesson for Jacaranda Maths Quest 8, section 6.5 (printed pp. 270–280).

8 slides: one diagnostic warm-up, one concept model, one test reference, one worked comparison, an error-analysis checkpoint, 12 mixed practice questions, and a fresh exit ticket. Student-facing text is English; teacher notes are Chinese. Suggested duration: 55–60 minutes. About 10–11 minutes of recap and modelling; 25 minutes for independent practice plus feedback. Repeated rule lectures and the building-height application have been removed.

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
| Reveal example reasoning | Reveal reasoning / Reveal next step |
| Triangle transformations | Slide 3: sliders, scale presets and Reflect |
| Differentiated practice | Slide 7: 12 questions, four per level; numbered questions |
| Check a numeric answer | Check answer or Enter |

Practice is local to the current browser page and resets on refresh. Showing a solution does not mark a question as solved. Notes are visible on the same screen, so keep them closed while projecting unless needed.

## Source organization

- `theme.css`, `deck.js`: original generic presentation shell.
- `geometry.css`, `geometry.js`: original geometry diagrams, reveal controls and optional scale model; initialization is guarded when the square-scale slide is absent.
- `triangles.css`, `triangles.js`: new congruence diagrams, triangle transformations, test comparison, and interactive question bank.
- `content.js`: teaching sequence, wording, model answers and Chinese teacher notes.
- `scripts/`: dependency-free local server and static build.

For Vercel: Framework `Other`, build command `npm run build`, output directory `dist`. The `.openai/hosting.json` file identifies this separate hosted Site; do not copy its identity into another Site.

## Mathematical details

- SSS, SAS, AAS/ASA and RHS establish congruence when their complete conditions hold.
- AA/AAA establishes similarity; equal angles alone do not establish congruence.
- SSA is not a general congruence or similarity test; SAS requires the included angle.
- Every congruent triangle pair is also similar with k = 1. Rotation and reflection preserve congruence.
- Scale factor consistently means image side length divided by object side length.
- The single worked comparison uses AB = 6 cm and angle C = 65°. Congruence gives x = 6; similarity with k = 1.5 gives y = 9. Both corresponding angles remain 65°.
- Practice includes all four congruence tests, corresponding angles under congruence and similarity, reduction by 2/3, a new missing-side calculation, and evidence/error analysis.
- Numeric inputs accept finite decimal or fraction values; an edited answer must be checked again. Revealing a solution does not earn a solved mark.
