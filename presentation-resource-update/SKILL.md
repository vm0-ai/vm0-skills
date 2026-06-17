---
name: presentation-resource-update
description: Maintain vm0 presentation template and design-system resources after they have been moved out of the public vm0-skills repo. Use when updating presentation picker previews, private R2-backed template/design-system source archives, registry hashes, storage version IDs, zero resource pull behavior, or when asked how to change presentation resources while keeping previews public and source archives private.
---

# Presentation Resource Update

Use this skill when changing vm0 presentation template resources that follow this boundary:

- Preview assets are public: picker `previewImage`, `previewImages`, and preview `embedUrl` may use public `cdn.vm0.io` URLs.
- Source resources are private: template and design-system `SKILL.md`, examples, build scripts, and canonical/source markdown must not be re-added to the public `vm0-skills` repo or exposed through stable public URLs.
- Pull source archives through authenticated CLI/API flow: `zero resource pull <registry-id>` requests a short-lived presigned R2 URL, downloads the archive, verifies SHA-256, and extracts it.

If the privacy boundary is unclear, stop and confirm before editing. Common ambiguity: whether a preview HTML should remain public display material or should be treated as private source.

## Current Resource Shape

Presentation source resources are private archives, one archive per registry resource:

- `template:html-ppt-playful-launch` -> `presentation-template/aplocoto/` plus `presentation-template/canonical-page-set.md`
- `template:html-ppt-botane-organic` -> `presentation-template/botane-organic/` plus `presentation-template/canonical-page-set.md`
- `template:html-ppt-business-data` -> `presentation-template/business-data/` plus `presentation-template/canonical-page-set.md`
- `design-system:playful-editorial` -> `presentation-design-system/playful-editorial/`
- `design-system:mauve-dusk` -> `presentation-design-system/mauve-dusk/`
- `design-system:berry-pop` -> `presentation-design-system/berry-pop/`

`canonical-page-set.md` is not a standalone registry archive. If it changes, rebuild and re-upload every template archive that bundles it.

## Update Workflow

1. Identify the resource IDs being changed.
   - Template changes affect `template:*` registry entries.
   - Design-system changes affect `design-system:*` registry entries.
   - Preview-only changes should not touch private archive hashes or version IDs.

2. Edit source material outside the public `vm0-skills` repo.
   - Do not re-add deleted presentation source directories to public `vm0-skills`.
   - Preserve the archive-internal paths listed above so `source.path` continues to resolve after extraction.

3. Build a new `archive.tar.gz` for each changed source resource.
   - The SHA-256 must be computed from the exact archive bytes that will be uploaded.
   - Treat the hash as a content integrity check for the archive file, not as a folder hash and not as the R2 storage version ID.
   - Prefer deterministic archive creation when possible; otherwise the hash is only valid for that exact tarball.

4. Upload the new archive to private R2-backed storage.
   - Use authenticated storage prepare/commit or the approved internal upload flow.
   - Record the returned storage version ID.
   - Never write a presigned URL or stable public archive URL into source code, tests, PR body, or docs.

5. Update `vm0`.
   - `turbo/packages/core/src/resource-registry.ts`
     - Update `PRESENTATION_RESOURCE_ARCHIVE_SHA256`.
     - Keep source entries using `privateR2ArchiveSource(path, sha256)`.
     - Do not add `archive.url`.
   - `turbo/apps/api/src/signals/routes/registry-resources-download.ts`
     - Update the allowlisted `versionId` for changed resources.
     - Add a new allowlist case for any new private-pullable resource.
   - Tests
     - Update API download tests if allowlist behavior changes.
     - Keep picker tests asserting public previews and no public archive URLs.

6. Update preview assets only when visual output changes.
   - Regenerate preview PNGs and preview HTML as needed.
   - Upload previews to public CDN.
   - Update `turbo/packages/core/src/presentation-template-items.ts`.
   - Keep `previewImage === previewImages[0]`.
   - Reject `drive.google.com`, `googleusercontent.com`, GitHub raw URLs, `file://`, localhost, and local paths in picker preview fields.

7. Validate the private pull path.
   - Download the archive through the authenticated API/presigned URL flow.
   - Recompute SHA-256 and compare it with `resource-registry.ts`.
   - Run or simulate `zero resource pull <registry-id>` and confirm extraction contains `source.path`.
   - Confirm registry source metadata does not contain a public archive URL.

8. Validate the PR.
   - Run targeted formatting/lint/tests for changed files when local dependencies allow it.
   - Rely on PR CI for full vm0 checks unless explicitly asked to run full local checks.
   - Ensure `vm0-skills` does not reintroduce public presentation source directories.

## PR Body Checklist

Include:

- Resource IDs changed.
- Whether the change is preview-only, source-only, or both.
- New archive SHA-256 values for source changes.
- New storage version IDs for source changes.
- Whether `canonical-page-set.md` changed and which template archives were rebuilt.
- Validation performed: authenticated download, SHA-256 check, `zero resource pull`, preview URL checks, and CI status.

Do not include:

- Presigned URLs.
- Stable public archive URLs.
- R2 bucket keys or credentials.
- Google Drive source URLs as production asset URLs.

## Common Failure Modes

- Updating the hash but not the API allowlist `versionId`: CLI downloads the old archive and fails digest verification.
- Updating `versionId` but not the hash: CLI downloads the new archive and fails digest verification.
- Rebuilding a template after changing `canonical-page-set.md` but forgetting other template archives that also bundle it.
- Putting private source archive URLs into frontend registry data.
- Treating public preview CDN URLs as proof that private source resources are protected.
