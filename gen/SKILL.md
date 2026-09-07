---
name: gen
description: Use Okou generation pipelines for images, video, talking-avatar videos, voice, presentations, websites, reports, and designs. Adapt video previews to the model's input capabilities and obtain user approval before generation.
---

# Gen

Use this skill to generate user-facing artifacts through the Okou CLI:

```bash
okou generate -h
```

`okou generate` is the source of truth. Always inspect the current command help when exact flags, models, styles, or providers matter.

For new model-generated footage (`video`), follow **Video: keyframes before generation** below before any billed video submission, including template and connector routes. A request to make a video starts with a still preview by default.

## Core Commands

- `okou generate image` - billed image file generation; supports built-in models, image editing/reference inputs, image style registry selection, and connector guidance.
- `okou generate video` - billed video file generation; supports built-in video models, first/last frames, reference media, audio controls, and connector guidance.
- `okou generate avatar-video` - billed JoggAI talking-avatar video generation; supports built-in public avatar and voice discovery, script or audio input, and JoggAI connector guidance.
- `okou generate voice` - billed speech audio generation; supports built-in voices and connector guidance.
- `okou generate presentation` - returns an Open Design resource-selection packet for an HTML presentation that the agent authors and hosts.
- `okou generate website` - returns website authoring instructions / an Open Design packet that the agent uses to build and host a static site.
- `okou generate report`, `docs-design`, `poster`, `dashboard-design`, `mobile-app-design` - return Open Design resource-selection packets for static HTML artifacts.
- `okou generate text`, `code`, `document`, `audio` - list connector-backed options and print connector skill-invocation guidance; these do not have built-in platform pipelines unless the CLI help says otherwise.

Run `okou generate <type>` with no generation input to list available providers for that artifact type. Add `--all` when unavailable or not-yet-authorized connectors are relevant.

## Generation Workflow

1. Identify the artifact type from the user's request.
   - Use `image` for raster images, edits, references, thumbnails, icons, illustrations, and visual assets.
   - Use `video` for generated motion, animated frames, product clips, or reference-driven video.
   - Use `avatar-video` for a talking avatar driven by a narration script or public audio URL.
   - Use `voice` for speech audio from text.
   - Use Open Design artifact commands for websites, decks, reports, posters, docs, dashboards, and mobile UI prototypes.
   - Use connector-listing commands for text, code, document, or non-speech audio generation.

2. Discover current capability before committing.
   - Run `okou generate <type> -h` for flags and built-in model support.
   - Run `okou generate <type>` to see available providers.
   - If the user asked for a connector/provider by name, run `okou generate <type> --provider <name>` to get invocation guidance, then follow that provider skill.

3. Determine whether style discovery is needed.
   - For styled images, inspect the current style registry from `okou generate image -h`.
   - Do not hardcode style names or style descriptions in this skill. Treat the registry printed by the CLI as the live source.
   - Choose a registered style when the user's wording clearly matches a trigger, named style, or visual direction in the registry.
   - To obtain style-specific prompt guidance, run `okou generate image --style <id> --prompt "<brief>" --compile`, follow the returned packet, then generate with `--compiled-prompt "<final prompt>"`.
   - Use `--raw-prompt "<final prompt>"` when the user explicitly wants no registry style, wants photorealism/model-native output, supplies a fully specified prompt, or no registry style is a good match. For video keyframes, preserve the selected video's visual direction; do not add an unrelated image style.
   - When no style is obvious but style materially affects the result, ask the user to choose among a few options summarized from the live registry or ask whether to proceed without a style.

4. Decide provider and model.
   - Prefer `--provider built-in` when the user wants a direct artifact, does not name a connector, and the built-in pipeline supports the request.
   - Use connector guidance when the user names a provider, needs a provider-specific capability, or the requested artifact type is connector-only.
   - Ask the user when the choice changes cost, latency, fidelity, licensing, account usage, or final format in a way that is not implied by the request.
   - Otherwise choose a sensible default from the CLI help and proceed.

5. Build the prompt.
   - Preserve the user's core intent, constraints, audience, brand, source materials, aspect ratio, duration, size, format, and delivery target.
   - Add operational details only when they improve generation reliability: composition, visual hierarchy, must-include/must-avoid elements, target medium, and reference handling.
   - For avatar video, discover public avatar and voice IDs through the CLI before generation. Never invent either ID, and use exactly one of script or audio URL input.
   - For style-guided image generation, let the selected registry style drive stylistic details through the compilation packet.
   - For prompt text that is long or quote-sensitive, use a file and a safely quoted argument, or stdin when the selected prompt mode supports it.

6. Execute and wait for completion.
   - For `video`, complete the keyframe review below first. Follow provider/template instructions within that approved plan; do not submit a video job while waiting for approval.
   - Run the selected `okou generate <type>` command.
   - For commands that return an Open Design resource-selection packet, follow the packet: author the artifact, verify it locally if needed, and host static outputs with `okou host`.
   - For commands that return `/f/` file URLs, keep the URL and metadata for the user.
   - If generation fails because of missing credits, run `okou doctor credit`.
   - If connector auth fails, run `okou doctor check-connector` using the environment name or URL from the provider guidance.

7. Deliver the result.
   - Give the user the generated URL or hosted artifact URL.
   - Mention important parameters used: provider, model, selected style or raw prompt mode, size/aspect ratio, duration, voice, or site slug.
   - If the output is temporary or provider-hosted with expiration, download or host a durable copy when appropriate.

## Video: keyframes before generation

Apply this review when producing new model-generated footage. Writing prompts, analyzing references, and editing existing footage do not require new generation jobs.

1. **Check the selected generation mode before making images.** Read `okou generate video -h` and, where needed, the provider's current input documentation. Verify the exact provider/model version, endpoint/mode, accepted image roles and counts, compatible input combinations, and size/aspect-ratio limits. A model family name or a globally listed CLI flag does not prove support in that mode. Resolve uncertain support through documentation, not paid trial generations. Choose the smallest useful preview for the verified capability:

   | Verified input capability | Preview and intended use |
   | --- | --- |
   | Single image / first frame | Start with one opening frame and use it as the supported image input. Describe the motion separately. |
   | First and last frames | Start with a first frame; add an ending frame only when the ending matters. Check that subject, scene, and motion can plausibly connect within the clip duration; incompatible endpoints can force unnatural morphing. |
   | Reference images | Use a small set for subject, product, or style consistency. Reference order is not a timeline and does not set shot order or timestamps unless the API explicitly documents those controls. |
   | Text only | Explain before making preview images that they are a concept preview for the user and prompt development, not model inputs. Get approval for that limitation with the video plan, or agree on an image-capable alternative. Do not silently switch the chosen model or mode. |

   For multiple shots, preview distinct compositions only as needed. If exact shot order requires separate generations and editing, include that clip count and cost in the plan before approval; do not turn every storyboard image into a separate billed clip automatically.
2. **Prepare a small still preview.** Preserve the brief's subject, style, composition, aspect ratio, and required text. Generate only the frames needed for the selected approach above. Reuse suitable user-supplied or previously approved frames instead of regenerating them. Template demo images are style examples, not approval of this user's composition.
   - Read `okou generate image -h` and use a supported image mode. Keep the default image model unless the user names another, and use an economical size/quality that makes the visual decisions clear.
   - Tell the user that the preview generates billed images first and that video generation will wait. Do not generate videos as previews or launch video jobs in parallel with the stills.
3. **Inspect and show the actual frames.** Check subject/brand fidelity, text, composition, and consistency between shots. Present numbered images or a contact sheet with links to the individual frames. Use user-accessible artifact URLs; upload local images before sharing. For images that will be model inputs, show the exact intended crop, including any crop needed to match the video aspect ratio.
4. **Present the video plan with the preview.** Identify each image's role: first frame, last frame, visual reference, or concept preview only. Briefly describe the planned motion and transitions, clip count, duration per clip, aspect ratio, resolution, audio, and provider/model/mode. Show an estimated total generation cost when current pricing or a quote is available, separating preview-image cost from video cost. Otherwise state that the price is unavailable; do not invent a dollar estimate. Resolve any user-set spending cap before submitting paid jobs. Explain the relevant limit briefly: stills help align visual direction, but do not guarantee motion, transitions, temporal consistency, physics, or text stability. More frames do not necessarily improve a video, and previews do not guarantee a successful first attempt or lower total cost.
5. **Wait for explicit approval of the shown frames and video plan.** Ask whether to generate the video using the described approach, then end the turn. For a text-only plan, do not imply the model will receive the preview images. Silence, elapsed time, choosing a style, a general video request, or asking for speed does not authorize the video submission. If changes are requested, revise only the affected frames/plan and show them again. Keep the approved frame URLs, roles, and plan in the conversation so a later turn can resume without repeating an unchanged approval. An explicit user instruction to skip preview review and proceed with paid generation for this video can override this default; do not infer that waiver from a broad delegation.
6. **Execute the approved input strategy.** For an image-capable mode, pass the approved individual images through the verified first-frame, last-frame, or reference-image inputs (`--first-frame-image-url`, `--last-frame-image-url`, `--image-url`, or provider equivalents). Use the approved roles and supported combinations; a contact sheet is for review, not a replacement for the individual inputs. For an explicitly approved text-only plan, translate the approved visual direction into the prompt without passing unsupported image flags or claiming direct image conditioning. If the intended strategy is unsupported, explain the limitation and obtain approval for a compatible plan before submitting. Submit only the approved clip count and parameters, then wait for completion and deliver the returned artifact.
7. **Keep further spending bounded.** Approval covers the described generation, not open-ended attempts. Do not create extra variants, paid retries, or quality rerolls without approval unless they were explicitly included in the approved attempt limit and budget. Material changes to frames, motion, model/mode, image roles, duration, resolution, or cost require renewed approval of the affected plan. If a job's status is uncertain, recover/poll the existing job instead of submitting a duplicate; retrieving an already approved job does not require another approval.

## Asking vs. Choosing

For video, the keyframe review above takes precedence over the general proceed-without-asking guidance below.

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
okou generate image
okou generate video
okou generate voice
```

Discover public JoggAI avatars and voices, then generate through the built-in pipeline:

```bash
okou generate avatar-video --provider built-in --list-avatars
okou generate avatar-video --provider built-in --list-voices
okou generate avatar-video --provider built-in --avatar-id "<avatar-id>" --voice-id "<voice-id>" --script "<script>"
```

Get JoggAI connector skill guidance for BYOK operations:

```bash
okou generate avatar-video --provider joggai
```

Inspect current image styles and flags:

```bash
okou generate image -h
```

Compile a styled image prompt after selecting a live registry style, then use the packet's final prompt:

```bash
okou generate image --style "<style-id>" --prompt "<brief>" --compile
okou generate image --provider built-in --compiled-prompt "<final prompt>"
```

Generate an unstyled/model-native image:

```bash
okou generate image --provider built-in --raw-prompt "<prompt>"
```

For a verified first-frame-capable mode, after the user approves the preview frame and video plan:

```bash
okou generate video --provider built-in --first-frame-image-url "<approved-frame-url>" --prompt "<approved motion prompt>" --duration "<approved duration>" --aspect-ratio "<approved ratio>"
```

Use connector guidance instead of built-in generation:

```bash
okou generate video --provider "<connector-name>"
```

Generate a static Open Design artifact:

```bash
okou generate website --prompt "<brief>"
```

Then follow the returned packet to build and host the artifact.
