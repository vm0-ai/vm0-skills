# Recipes: what kind of intro video this is

A recipe fixes the narrative spine, defaults, and production guidance for one intent. The spines reuse the narrative arcs and beat roles of the Okou intro-video template packs (`vm0-ai/Template-IntroVideo`), so a controlled-route composition and a native HeyGen prompt tell the same story.

Recipes are never shown to the user and the form has no intent selector; classify from the brief.

## Beat vocabulary

Use these roles to structure the script. They are writing tools, not prompt labels.

| Role | Meaning |
| --- | --- |
| hook | grab attention in the first sentence |
| claim | the one thing the video says |
| conflict | why now, what is wrong today |
| concept | define the term |
| mechanism | how it works |
| breakdown | the parts |
| example | one concrete case |
| evidence | data, chart, before/after |
| proof | someone else vouches (quote, logo, result) |
| turn | so what changes |
| boundary | when it does not apply |
| recap | the one sentence to remember |
| cta | the next action |
| credits | who is speaking |
| disclosure | required compliance text |

## Recipe table

| id | Use when | Spine (arc) | Duration band | Orientation | Presenter | Media | On-screen text | Style tags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `product-launch` | new product, feature, release | hook → conflict → turn → concept → breakdown → evidence → proof → recap → cta (`lau_keynote`) | 45–60 s | landscape | opens and closes on camera | product screenshots as B-roll; motion graphics for numbers | product name, headline number, CTA | retro-tech, print, cinematic |
| `company-intro` | who we are, brand story, about us | hook → example → conflict → turn → proof → evidence → breakdown → recap → cta (`mkt_story`) | 60–90 s | landscape | on camera for claim and ask | stock for real environments; logo in intro and end card | company name, tagline, URL | print, cinematic, handmade |
| `personal-intro` | founder / creator self-introduction, outreach, "video of me" | hook → example → conflict → concept → turn → proof → breakdown → recap → cta (`cre_personal`) | 30–45 s | landscape | direct-to-camera throughout | minimal overlays only | name, role, one contact | cinematic, handmade |
| `sales-outreach` | pitch to one prospect or segment | hook → conflict → evidence → turn → breakdown → proof → example → boundary → cta (`sal_consult`) | 30–60 s | landscape | on camera | motion graphics for the cost/benefit numbers | the one number, the offer, next step | print, retro-tech |
| `promo` | campaign, event, webinar, offer | hook → conflict → turn → evidence → proof → breakdown → example → recap → cta (`mkt_funnel`) | 20–30 s | by destination | optional | motion graphics; stock for atmosphere | date, place, registration URL | pop-culture, print |
| `onboarding` | new hire or new customer welcome | hook → concept → breakdown → example → mechanism → boundary → proof → recap → cta (`hr_onboard`) | 60–120 s | landscape | on camera plus overlays | motion graphics checklists | first steps, names of tools, dates | handmade, print |
| `course-intro` | lesson or series opener | hook → concept → breakdown → example → evidence → mechanism → boundary → recap → cta (`edu_linear`) | 45–60 s | landscape | on camera plus chapter cards | motion graphics diagrams | lesson title, outline items | print, handmade |
| `explainer` | how something works, tech or process | claim → concept → mechanism → breakdown → example → evidence → boundary → turn → recap (`tec_teardown`) | 60–90 s | landscape | optional; voice-over is fine | motion graphics diagrams; AI-generated for abstractions | term definitions, key numbers | retro-tech, print |
| `report-summary` | deck, report, or data → short briefing | claim → evidence → breakdown → mechanism → example → boundary → turn → recap → disclosure (`con_pyramid` / `fin_report`) | by material, 60–120 s | landscape | optional | motion graphics for every figure; attached charts | every number shown, source line, disclosure | print, retro-tech |
| `care-update` | health, patient, or wellbeing information | hook → concept → mechanism → evidence → example → boundary → recap → turn → cta (`hea_care`) | 45–60 s | landscape | on camera, calm | minimal; no dramatization | dosages, contacts, disclosure | handmade, print |
| `social-short` | one idea for Reels / TikTok / Shorts | one continuous thought, hook first | 15–30 s | portrait | direct-to-camera | minimal overlays | at most two short lines | styles whose `aspect_ratio` is 9:16 |

Style tags are preferences for `Let Okou choose`; an explicit style always wins.

A duration band is where a finished video of this kind should land, not a target to pick from — least of all its low end. The number written into the brief comes from the narration actually drafted, measured against the budget in [brief](brief.md); the band only bounds it. A band never reaches the user as a requirement: when no duration was requested, say the inferred length is your inference.

## The narrative frame comes first

Before compiling any prompt, fill the brief's five answers: claim, conflict, turn, proof, ask. Proof must be a checkable fact from the request or a source (a number, a named customer, a file). Waive an answer only with a written reason ("no ask: internal announcement"). A video with an empty frame is a list, and lists produce forgettable output.

## Script rules

These come from HeyGen's own prompting experiments and from the arcs above. They apply to both routes.

- The script is the biggest quality lever. Write for the ear: short sentences, active voice, contractions, one idea per video.
- Write to the narration budget for the target, not to the material. Material always outruns the budget; drop the weakest key messages here, deliberately, instead of letting the agent drop the closing sentence at render time.
- Stories beat lists. First person and a concrete case ("we lost the evening enquiries") beat neutral summaries.
- Front-load the hook. The first sentence carries the claim or the conflict.
- Use the arc as an order, not as labels. Up to about 60 seconds, write one flowing script with a tone line; do not split it into scenes. Above 60 seconds or for data-heavy content, group the script into scene blocks in arc order, each with a media note, and never with timestamps.
- Do not build the script around questions to the viewer; a single presenter asking questions reads as unnatural.
- Keep the presenter's words in the narration language and keep every technical directive in English.
- End with the ask in plain words. Put dates, prices, URLs, and names in `on_screen_text` so they render literally.
- Every claim traces to a source. Do not round or invent numbers; if the material does not contain a figure, the script does not either.
