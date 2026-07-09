---
name: gen
description: Use Zero generation pipelines for images, video, voice, presentations, websites, reports, and designs.
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
