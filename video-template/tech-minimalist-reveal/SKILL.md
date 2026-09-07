---
name: tech-minimalist-reveal
description: A minimalist tech/product reveal video style — a single product floating in a bright white seamless studio void, precise soft studio light, clean shadow, glossy reflection, cool neutral grade, and generous negative space. Applies to whatever product the user brings. Trigger on /tech-minimalist-reveal, "product reveal", "Phone Product Showcase", "Apple-style product video", or "clean studio product shot".
---

# Phone Product Showcase

A premium **product-reveal style**, not a fixed product. Keep the user's product exactly as briefed — a phone, a watch, a bottle, a gadget — and present it in the locked studio look below. The style supplies the *look*; the user supplies the *what*. Tuned for **Seedance** (the platform's default video model): the prompt follows Seedance's `subject → scene → motion → camera → light → style` ordering, and framing/negatives are expressed the way Seedance follows most reliably.

## Keyframe review before video generation

Before any billed video submission through the CLI or a provider API:

1. Verify the exact provider/model version and endpoint/mode using `okou generate video -h` and current provider documentation as needed. Check supported image roles, counts, input combinations, and size/aspect-ratio limits before generating stills. A model family name or global CLI flag does not establish support; do not use paid jobs to probe capabilities. Choose the smallest useful approach:
   - **First-frame input:** start with one opening image and describe motion separately.
   - **First/last frames:** add a last frame only when the ending matters. Check that subject, scene, and motion can connect plausibly within the duration; incompatible endpoints can cause unnatural morphing.
   - **Reference images:** use a small set for subject/product/style consistency. Image order does not control a timeline, shot order, or timestamps unless the API explicitly supports that.
   - **Text only:** explain before making stills that they are concept previews for the user and prompt development, not model inputs. Include this limitation in the approval, or agree on an image-capable alternative; do not silently change the selected model/mode.
2. Prepare only the needed frames of the user's subject in this style; reuse suitable supplied/approved images. Read `okou generate image -h` for supported prompt modes, keep the default image model unless the user names another, and use economical preview settings. Tell the user that images are billed and video generation will wait. The reference-output images below illustrate style, not approval of this video's composition. For multiple shots, preview distinct compositions only as needed; separate generations and editing must be included in the approved clip count and cost, not automatically assigned to every storyboard image.
3. Inspect and share the actual numbered frames using accessible URLs (upload local images), with individual links alongside any contact sheet. Identify each as first frame, last frame, visual reference, or concept preview only; show the exact crop for model inputs. Include planned motion, clip count, duration per clip, ratio, resolution, audio, provider/model/mode, and a current cost estimate when available; distinguish image/video costs, never invent prices, and resolve user-set spending caps. Explain the relevant limits briefly: previews align appearance but do not guarantee motion, transitions, temporal consistency, physics, text stability, first-attempt success, or lower total cost. More frames do not necessarily help.
4. Ask the user to approve the shown frames and described video approach, then end the turn. Do not start video jobs in the background or in parallel while waiting. A general video request, template choice, speed request, or silence is not approval. Reuse explicit approval for an unchanged plan; only an explicit instruction to skip preview review and proceed with paid generation for this video overrides the default. Revise affected frames/plan and seek approval again when changes are requested. For text-only generation, never imply the model receives the preview images.
5. Execute the approved strategy. For an image-capable mode, pass individual approved images using the verified roles and supported combinations, not a contact sheet. For an explicitly approved text-only plan, translate the approved visual direction into the prompt without unsupported image flags or claims of direct image conditioning. If the intended strategy is unsupported, get approval for a compatible plan before submitting. Keep the approved URLs, roles, and plan in the conversation; submit only the approved clips and parameters, wait for completion, and deliver the returned artifact.
6. Approval covers the described attempts, not unlimited spending. Obtain fresh approval for material frame/plan/cost changes, including model/mode or image roles, and for extra variants or paid retries outside the approved attempt limit and budget. Recover or poll an existing job when its status is uncertain instead of submitting a duplicate.

## What this style is

**The essence:** make a single object feel **precious and inevitable** — isolate it in clean empty space and let pristine light do all the talking. The goal is **focus and reverence for the object**, nothing else in the frame to distract.

**Touchstones:** Apple product films, premium consumer-tech keynote reveals, high-end e-commerce hero shots, minimalist studio still-life.

**What makes it distinct:** **emptiness + precision**. One product, a seamless white void, controlled studio light — the opposite of lifestyle context, clutter, or warmth. Not a scene; a reverent object study.

## Style dimensions (locked)

- **Visual tone — cool & desaturated**: clean, near-neutral white-to-grey, slightly cool grade; pristine, no warm cast.
- **Camera — slow push-in**: one slow, smooth dolly toward the product; controlled, weightless, never handheld.
- **Shot continuity**: one continuous unhurried take. No cuts.
- **Setting & framing**: a **bright white seamless studio void** (cyclorama), product centered with generous negative space; glossy subtly reflective floor; one clean soft shadow. Macro inserts on key detail are allowed, but the establishing frame stays wide and empty.
- **Light**: precise soft studio lighting — large soft sources, gentle gradient falloff, a clean rim; no hard speculars, no colored gels.
- **Production type — live action**: photoreal product footage / CGI-grade realism. Not illustration.
- **Style reference — minimalist tech reveal**: the empty-studio precision of a flagship product film.

## Prompt construction

Write **one cohesive video prompt in your own words**, adapted to the user's product. Compose naturally, hitting these beats in Seedance order:

`product (as briefed) → seamless white studio void → subtle motion (slow rotation / float) → slow push-in → precise soft studio light → cool neutral grade`

**Always convey:** a single product isolated in a bright white seamless void · generous negative space · precise soft studio lighting with one clean shadow · cool neutral grade · slow push-in or slow product rotation · pristine macro-sharp detail · photoreal.

**Never:** cluttered or lifestyle background, warm/colored light, hard speculars, handheld shake, fast cuts, props or hands (unless the user asks).

Adapt the product, its material highlights, and the exact move to what's briefed. Put aspect ratio, negatives, and seed in the **params**, not the prose.

## Generation parameters

- **aspectRatio**: `16:9` (hero) or `9:16` for social product clips.
- **resolution & model tier**: target resolution must be supported by the chosen model tier — fast/draft tiers cap lower (often `720p`); `1080p` needs a full-quality tier.
- **duration**: `5–8s`; pace one slow push-in or half-rotation to fill it.
- **negativePrompt**: `cluttered background, lifestyle context, warm color, colored light, hard glare, handheld shake, fast cuts, busy scene, low resolution, distorted product`.
- **generateAudio**: usually **off** for a clean product cut (add music/VO in edit); leave on only for a subtle ambient hum.
- **seed**: mild lever for text-to-video; use it to re-roll the *same* prompt. The real consistency tool is `firstFrameImageUrl`.
- **firstFrameImageUrl**: use the approved opening frame only when the selected mode supports first-frame input; otherwise follow the approved reference-image or text-only strategy above.

## How to apply

Drop the user's product into the empty white studio and let it own the frame. Do **not** add lifestyle scenery, hands, or warm light. If the brief needs the product *in use* or in context, this style isn't the fit — prefer a lifestyle or commercial style.

## Worked examples

Same locked studio look; the product changes.

1. **"our new wireless earbuds"** → an open earbuds case floating and slowly rotating in a white seamless void, precise soft light, one clean shadow, slow push-in, cool neutral grade.
2. **"a smart water bottle"** → the bottle standing on a glossy reflective floor, slow push-in revealing condensation macro detail, pristine studio light.
3. **"a luxury perfume bottle"** → the bottle on a low pedestal, slow orbit catching glass refractions, generous negative space (see reference still).
4. **"a flagship phone"** → the phone floating upright, screen edge catching a clean rim light, slow push-in to a macro of the camera module.

## Reference output

| Field | Value |
| --- | --- |
| Picker thumbnail | `https://cdn.vm0.io/artifacts/user_3EWY21Oe3f15kfs3yYmbGgDb3NV/c3219368-a46b-43ce-9e98-5b5826fcaa8d/thumbnail-tech-minimalist-reveal.jpg` |
| Reference still — perfume (Seedream, seed 50) | `https://cdn.vm0.io/artifacts/user_3EWY21Oe3f15kfs3yYmbGgDb3NV/6a2bf374-0049-4ade-80f9-bbd419787825/image-6a2bf374.png` |
| Canonical | single product · white seamless void · clean shadow + reflection · cool neutral · slow push-in · 16:9 |

> The reference still holds the studio look on a different product (perfume vs. phone) — the style is product-invariant. For image-capable modes, use a user-approved frame of the brief's subject with its verified input role; text-only previews guide the prompt only.
