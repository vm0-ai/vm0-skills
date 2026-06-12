---
name: gen
description: Use vm0 Zero generation pipelines via `zero generate` for images, videos, voice, presentations, websites, reports, posters, docs designs, dashboard designs, mobile app designs, and connector-backed text/code/document generation. Use when a user asks to generate an artifact and the right built-in pipeline, style, model, or connector should be discovered at runtime.
---

# Gen

Use this skill to generate user-facing artifacts through the Zero CLI:

```bash
npx -p @vm0/cli zero generate -h
```

`zero generate` is the source of truth. Always inspect the current command help when exact flags, models, styles, or providers matter.

## Core Commands

- `zero generate image` - billed image file generation; supports built-in models, image editing/reference inputs, image style registry selection, and connector guidance.
- `zero generate video` - billed video file generation; supports built-in video models, first/last frames, reference media, audio controls, and connector guidance.
- `zero generate voice` - billed speech audio generation; supports built-in voices and connector guidance.
- `zero generate presentation` - returns an Open Design resource-selection packet for an HTML presentation that the agent authors and hosts.
- `zero generate website` - returns website authoring instructions / an Open Design packet that the agent uses to build and host a static site.
- `zero generate report`, `docs-design`, `poster`, `dashboard-design`, `mobile-app-design` - return Open Design resource-selection packets for static HTML artifacts.
- `zero generate text`, `code`, `document`, `audio` - list connector-backed options and print connector skill-invocation guidance; these do not have built-in vm0 pipelines unless the CLI help says otherwise.

Run `zero generate <type>` with no prompt to list available providers for that artifact type. Add `--all` when unavailable or not-yet-authorized connectors are relevant.

## Generation Workflow

1. Identify the artifact type from the user's request.
   - Use `image` for raster images, edits, references, thumbnails, icons, illustrations, and visual assets.
   - Use `video` for generated motion, animated frames, product clips, or reference-driven video.
   - Use `voice` for speech audio from text.
   - Use Open Design artifact commands for websites, decks, reports, posters, docs, dashboards, and mobile UI prototypes.
   - Use connector-listing commands for text, code, document, or non-speech audio generation.

2. Discover current capability before committing.
   - Run `zero generate <type> -h` for flags and built-in model support.
   - Run `zero generate <type>` to see available providers.
   - If the user asked for a connector/provider by name, run `zero generate <type> --provider <name>` to get invocation guidance, then follow that provider skill.

3. Determine whether style discovery is needed.
   - For styled images, inspect the current style registry from `zero generate image -h`.
   - Do not hardcode style names or style descriptions in this skill. Treat the registry printed by the CLI as the live source.
   - Choose a registered style when the user's wording clearly matches a trigger, named style, or visual direction in the registry.
   - To obtain style-specific prompt guidance, run image generation with the selected `--style <id>`; the CLI returns the current resource-selection packet / metadata with the style locked in. Use that output instead of recreating the style from memory.
   - Use `--skip-style` when the user explicitly wants no style, wants photorealism/model-native output, supplies a fully specified prompt, or no registry style is a good match.
   - When no style is obvious but style materially affects the result, ask the user to choose among a few options summarized from the live registry or ask whether to proceed without a style.

4. Decide provider and model.
   - Prefer `--provider built-in` when the user wants a direct artifact, does not name a connector, and the built-in pipeline supports the request.
   - Use connector guidance when the user names a provider, needs a provider-specific capability, or the requested artifact type is connector-only.
   - Ask the user when the choice changes cost, latency, fidelity, licensing, account usage, or final format in a way that is not implied by the request.
   - Otherwise choose a sensible default from the CLI help and proceed.

5. Build the prompt.
   - Preserve the user's core intent, constraints, audience, brand, source materials, aspect ratio, duration, size, format, and delivery target.
   - Add operational details only when they improve generation reliability: composition, visual hierarchy, must-include/must-avoid elements, target medium, and reference handling.
   - For style-guided image generation, let the selected registry style drive stylistic details. Do not manually rewrite the style into the skill; pass `--style <id>`.
   - For video generation with a named style or aesthetic, look up the style in the **Video Style Library** below. Inject the listed hard constraint terms into the prompt and pass `--negative-prompt` for `veo3.1-fast` and `kling-v3-4k`. Style names alone are unreliable — models interpret them inconsistently.
   - For prompt text that is long or quote-sensitive, write it to a temp file and pipe it into the command to avoid shell quoting issues.

6. Execute and wait for completion.
   - Run the selected `zero generate <type>` command.
   - For commands that return an Open Design resource-selection packet, follow the packet: author the artifact, verify it locally if needed, and host static outputs with `zero host`.
   - For commands that return `/f/` file URLs, keep the URL and metadata for the user.
   - If generation fails because of missing credits, run `zero doctor credit`.
   - If connector auth fails, run `zero doctor check-connector` using the environment name or URL from the provider guidance.

7. Deliver the result.
   - Give the user the generated URL or hosted artifact URL.
   - Mention important parameters used: provider, model, selected style or `--skip-style`, size/aspect ratio, duration, voice, or site slug.
   - If the output is temporary or provider-hosted with expiration, download or host a durable copy when appropriate.

## Asking vs. Choosing

Ask the user before generation when:

- The prompt is too underspecified to produce a useful artifact.
- Multiple provider/style/model choices are plausible and materially different.
- The command will spend meaningful credits and the request did not imply that spend.
- The user requested brand, person, legal, medical, financial, or other high-stakes accuracy that needs source material.
- Required inputs are missing, such as source images, brand assets, narration text, dimensions, or audience.

Proceed without asking when:

- The user gave enough context for a reasonable first version.
- The built-in default clearly fits the request.
- The user asked for speed or explicitly delegated choices.
- The missing details can be safely inferred and refined after the first artifact.

## Common Patterns

List current providers:

```bash
npx -p @vm0/cli zero generate image
npx -p @vm0/cli zero generate video
npx -p @vm0/cli zero generate voice
```

Inspect current image styles and flags:

```bash
npx -p @vm0/cli zero generate image -h
```

Generate a styled image after selecting a live registry style:

```bash
npx -p @vm0/cli zero generate image --provider built-in --style "<style-id>" --prompt "<prompt>"
```

Generate an unstyled/model-native image:

```bash
npx -p @vm0/cli zero generate image --provider built-in --skip-style --prompt "<prompt>"
```

Use connector guidance instead of built-in generation:

```bash
npx -p @vm0/cli zero generate video --provider "<connector-name>"
```

Generate a static Open Design artifact:

```bash
npx -p @vm0/cli zero generate website --prompt "<brief>"
```

Then follow the returned packet to build and host the artifact.

## Video Style Library

When the user names a cinematic style, genre, or visual aesthetic, look up the entry below. Inject the listed **prompt constraints** verbatim — do not rely on style names alone. For `veo3.1-fast` and `kling-v3-4k`, always pass `--negative-prompt` with the listed exclusion terms.

---

### Film Noir / Classic B&W
**Triggers:** film noir, black and white, classic noir, 1940s thriller, B&W cinematic  
**Prompt constraints:** `monochrome, grayscale film stock, high-contrast chiaroscuro lighting, deep shadow pools, single harsh key light, venetian blind shadow patterns, no color`  
**Negative prompt:** `color, colorized, saturated, neo-noir, chromatic, vibrant`  
**Best model:** veo3.1-fast  
**Known bias:** Veo and Kling default to neo-noir (colorful). Without hard constraints + negative prompt, output will be color.

---

### Cyberpunk / Neo-Noir
**Triggers:** cyberpunk, neo-noir, blade runner, neon dystopia, rain-soaked city  
**Prompt constraints:** `neon-lit rain-soaked streets, blue and magenta color grade, volumetric fog, holographic signage, wet reflective pavement, high-tech low-life, practical neon lighting`  
**Negative prompt:** `daylight, bright natural light, clean environment, pastoral, warm golden tones`  
**Best model:** veo3.1-fast, kling-v3-4k  
**Known bias:** Models produce generic city-night without density; fog and practical neon must be explicit.

---

### Horror / Thriller
**Triggers:** horror, thriller, psychological horror, slasher, supernatural, suspense  
**Prompt constraints:** `desaturated cold palette, deep shadow pools, motivated practical lighting only, shallow depth of field, unstable handheld camera, isolated subject, dread atmosphere`  
**Negative prompt:** `bright cheerful lighting, warm tones, saturated colors, wide establishing shot`  
**Best model:** veo3.1-fast  
**Known bias:** Models produce neutral clean frames with no tension; lighting constraints are required.

---

### Fantasy / Magical Realism
**Triggers:** fantasy, magical realism, fairy tale, epic fantasy, enchanted, mythical  
**Prompt constraints:** `ethereal soft light, golden-hour rim light, practical particles (embers, motes, fireflies), impossible scale architecture, painterly color palette, lush oversaturated environment`  
**Negative prompt:** `urban, industrial, modern architecture, harsh flat daylight`  
**Best model:** dreamina-seedance-2.0, veo3.1-fast  
**Known bias:** Models produce generic forests without scale or light magic; particle and scale terms are required.

---

### Action / High Energy
**Triggers:** action, fight scene, chase, explosion, high energy, intense  
**Prompt constraints:** `dynamic tracking shot, motion blur, Dutch angle, whip pan, rapid cut rhythm, impact moment freeze, adrenaline-driven framing`  
**Negative prompt:** `static camera, slow motion, calm atmosphere, locked-off wide shot`  
**Best model:** kling-v3-4k  
**Known bias:** Models default to stable cinematography; motion, angle, and rhythm must be forced.

---

### Romantic / Soft Focus
**Triggers:** romantic, love story, soft focus, dreamy, tender, warm  
**Prompt constraints:** `warm golden-hour backlight, shallow depth of field, soft diffusion filter, cream and peach tones, slow deliberate push-in, gentle lens flare`  
**Negative prompt:** `harsh lighting, cold color temperature, sharp hard edges, high contrast`  
**Best model:** dreamina-seedance-2.0  
**Known bias:** Models produce neutral sharp output; warmth and diffusion must be specified.

---

### Sci-Fi Futuristic
**Triggers:** sci-fi, futuristic, space opera, hard sci-fi, near-future, space station  
**Prompt constraints:** `clinical environment, practical panel lighting, cold blue or ultraviolet color grade, holographic HUD elements, vast scale architecture, minimal surface design, deep space vacuum`  
**Negative prompt:** `organic materials, warm tones, natural environment, vintage aesthetics`  
**Best model:** veo3.1-fast, dreamina-seedance-2.0  
**Known bias:** Models produce generic "tech look"; cold clinical grade and architectural scale need explicit terms.

---

### Cinéma Vérité / Documentary Handheld
**Triggers:** documentary, handheld, cinéma vérité, observational, raw footage, journalistic  
**Prompt constraints:** `handheld organic camera shake, available light only, no artificial fill, natural color grade, intimate subject proximity, real-environment background`  
**Negative prompt:** `studio lighting, clean production look, tripod locked-off, saturated color grade`  
**Best model:** veo3.1-fast  
**Known bias:** Models default to polished cinematic output; organic imperfection must be forced.

---

### Nature Documentary
**Triggers:** nature documentary, BBC Planet Earth, wildlife, animal behavior, David Attenborough  
**Prompt constraints:** `telephoto lens compression, tripod locked-off, overcast diffused natural light, shallow depth of field on subject, muted natural palette (greens, browns, grays), behavioral moment composition`  
**Negative prompt:** `human environment, urban, studio lighting, dramatic artificial color grade`  
**Best model:** dreamina-seedance-2.0  
**Known bias:** Models produce generic outdoor footage; telephoto compression and static tripod framing need explicit terms.

---

### News / Broadcast
**Triggers:** news, broadcast, TV news, live report, journalism, on-the-ground reporting  
**Prompt constraints:** `shoulder-mounted camera, broadcast flat lighting, reporter foreground subject, news environment background, 50mm equivalent focal length, neutral color grade`  
**Negative prompt:** `cinematic color grade, shallow depth of field, dramatic lighting, music video pacing`  
**Best model:** dreamina-seedance-2.0-fast  
**Known bias:** Models apply cinematic treatments by default; flat broadcast look must be forced.

---

### Slow Motion
**Triggers:** slow motion, slow-mo, ultra slow-mo, high-speed camera, slo-mo  
**Prompt constraints:** `ultra-slow playback, subject at peak-action moment, motion trail visible, clean well-lit environment for motion clarity, time-freeze composition`  
**Negative prompt:** `real-time speed, fast cut pacing, motion blur from camera shake`  
**Best model:** kling-v3-4k (native slow-mo), veo3.1-fast  
**Known bias:** Models generate real-time footage; frame the scene as a peak-action freeze to get slow-motion composition even when the model renders at 24fps.

---

### Timelapse / Hyperlapse
**Triggers:** timelapse, time-lapse, hyperlapse, accelerated motion, clouds racing, city flow  
**Prompt constraints:** `extreme time compression, motion trails on moving subjects (clouds, traffic, people), star trail streaks in night sky, light painting from long exposure, static world with fluid motion`  
**Negative prompt:** `real-time speed, static subjects, normal motion`  
**Best model:** dreamina-seedance-2.0, veo3.1-fast  
**Known bias:** Models generate normal-speed video; timelapse must be described as visible motion trails and streaking light, not just named.

---

### Stop Motion
**Triggers:** stop motion, stop-motion, claymation, frame-by-frame, puppet animation  
**Prompt constraints:** `deliberate jitter between frames, handmade physical texture, tactile material surfaces (clay, felt, paper), studio key light, smooth loop-back movement, visible set edges`  
**Negative prompt:** `smooth digital motion blur, CGI sheen, photoreal rendering, fluid camera movement`  
**Best model:** veo3.1-fast  
**Known bias:** Models apply smooth motion by default; jitter and handmade texture must be forced.

---

### Vintage 1970s Film
**Triggers:** vintage, 1970s, 70s cinema, retro, analog film, period film  
**Prompt constraints:** `heavy 16mm film grain, warm color shift (yellows and oranges dominant), faded blacks, soft contrast, anamorphic horizontal lens flares, slightly desaturated mids`  
**Negative prompt:** `clean digital, sharp edges, cool color grade, 4K clarity, modern production`  
**Best model:** veo3.1-fast  
**Known bias:** Models produce clean digital output; grain, warm shift, and faded contrast must be explicit.

---

### VHS / Retro 80s
**Triggers:** VHS, retro 80s, 80s aesthetic, lo-fi video, tape, scan lines  
**Prompt constraints:** `VHS tracking artifacts, horizontal scan lines, chroma bleeding on high-contrast edges, washed-out highlights, color bleed, low-resolution softness, heavy noise grain`  
**Negative prompt:** `HD clarity, sharp edges, clean color grade, modern post-production`  
**Best model:** veo3.1-fast  
**Known bias:** Models produce clean video; VHS degradation must be described as specific artifacts, not just "VHS style."

---

### Super 8mm
**Triggers:** Super 8, 8mm, indie film, home movie, analog indie  
**Prompt constraints:** `heavy 8mm grain, soft focus edges, overexposed highlights, warm pushed reds and yellows, light leak artifacts, visible sprocket holes, flickering exposure`  
**Negative prompt:** `clean digital, sharp corners, 4K, flat color grade, modern equipment`  
**Best model:** veo3.1-fast  
**Known bias:** Models conflate 8mm with generic vintage; sprocket artifacts and pushed grain need explicit terms.

---

### Luxury Product Commercial
**Triggers:** luxury commercial, high-end ad, premium product, luxury brand  
**Prompt constraints:** `macro product close-up, controlled studio specular highlights, black or white seamless backdrop, precise key and rim lighting, slow deliberate push-in, neutral cool-to-warm grade`  
**Negative prompt:** `handheld shake, organic environment, natural-light inconsistency, cluttered background`  
**Best model:** kling-v3-4k (4K for product clarity)  
**Known bias:** Models add environmental context; seamless backdrop and controlled lighting must be explicit.

---

### Tech Product Demo
**Triggers:** tech demo, product demo, app demo, software showcase, SaaS ad  
**Prompt constraints:** `clean minimal environment, device on neutral surface, screen UI clearly visible, cool neutral color grade, flat studio lighting, tight framing on product`  
**Negative prompt:** `clutter, organic elements, dramatic lighting, warm tones, busy background`  
**Best model:** dreamina-seedance-2.0  
**Known bias:** Models add lifestyle context; minimal studio isolation must be forced.

---

### Food & Beverage Commercial
**Triggers:** food commercial, food ad, beverage ad, culinary, restaurant, food photography  
**Prompt constraints:** `macro food detail, steam or condensation in frame, warm backlight, saturated natural food colors, shallow depth of field, slate or wood surface texture, food-stylist composition`  
**Negative prompt:** `flat lighting, cool color grade, abstract background, blurry product`  
**Best model:** kling-v3-4k  
**Known bias:** Models produce generic food shots; steam, condensation, and warm backlight must be explicit.

---

### Anime / Manga Motion
**Triggers:** anime, manga, Japanese animation, Ghibli, shonen, cel animation  
**Prompt constraints:** `cel-shaded flat color fills, clean anime line art, flat painted background, limited animation style, large expressive eyes, speed lines on action beats`  
**Negative prompt:** `photorealistic, CGI render, live action, 3D sheen, western cartoon`  
**Best model:** veo3.1-fast  
**Known bias:** Models blend anime with CGI or generic animation; cel-shaded flat fills and limited animation style need explicit terms.

---

### 3D CGI / Render
**Triggers:** 3D CGI, CGI animation, 3D render, Pixar style, Blender render, photoreal 3D  
**Prompt constraints:** `photoreal 3D render, subsurface scattering, ray-traced global illumination, depth of field, PBR materials, studio or environment lighting, smooth surface sheen`  
**Negative prompt:** `live action footage, hand-drawn, 2D flat, cel-shaded, painted texture`  
**Best model:** dreamina-seedance-2.0  
**Known bias:** Models produce cartoon-adjacent output without explicit PBR and ray-trace descriptors.

---

### Watercolor / Painterly
**Triggers:** watercolor, painterly, painted animation, impressionist, hand-painted, artistic  
**Prompt constraints:** `visible brushstroke texture, watercolor pigment bleed at edges, limited palette (5–7 colors), white paper showing through light areas, soft diffuse edges, gestural mark-making`  
**Negative prompt:** `photorealistic, sharp edges, clean digital lines, photography, CGI sheen`  
**Best model:** veo3.1-fast  
**Known bias:** Models produce digitally smooth output; brushstroke texture and pigment bleed must be explicitly forced.
