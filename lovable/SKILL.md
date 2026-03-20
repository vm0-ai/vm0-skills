---
name: lovable
description: Lovable AI app builder. Use when user mentions "Lovable", "lovable.dev", wants to generate a full-stack web app with Lovable AI, or create a Build-with-URL link for Lovable.
---

# Lovable API

Generate full-stack web apps on Lovable by constructing a Build-with-URL link. This is the current public API for programmatic app creation on Lovable — a full REST API with authentication is planned but not yet released.

> Official docs: `https://docs.lovable.dev/integrations/lovable-api`

---

## When to Use

Use this skill when you need to:

- Launch a Lovable app build from a prompt programmatically
- Create a shareable link that opens Lovable with a predefined prompt
- Trigger app generation with image references (mockups, screenshots, wireframes)
- Embed a "Build with Lovable" button for a specific use case

---

## Prerequisites

No API key or token is required. The user must be **logged in** to [lovable.dev](https://lovable.dev) in their browser. When the URL is opened, Lovable prompts the logged-in user to select a workspace and starts building automatically.

> **Note:** The Lovable API is URL-based only at this stage. API calls via curl are not supported — the link must be opened in a browser.

---

## How to Use

URL format:

```
https://lovable.dev/?autosubmit=true#prompt=<url-encoded-prompt>
```

**Required query parameter:** `autosubmit=true` — triggers automatic prompt submission
**Hash parameter:** `prompt` — URL-encoded string, max 50,000 characters
**Optional hash parameter:** `images` — comma- or repeat-appended publicly accessible image URLs (JPEG, PNG, WebP), up to 10

---

### 1. Construct a Build URL

Write the prompt to `/tmp/lovable_prompt.txt`:

```
Build a SaaS landing page with a hero section, pricing table, and FAQ. Use React and Tailwind CSS with a modern blue color scheme.
```

Then construct and print the URL:

```bash
python3 -c "
import urllib.parse
prompt = open('/tmp/lovable_prompt.txt').read().strip()
encoded = urllib.parse.quote(prompt, safe='')
print('https://lovable.dev/?autosubmit=true#prompt=' + encoded)
"
```

Open the printed URL in a browser to trigger app generation.

---

### 2. Include Image References

Attach up to 10 publicly accessible image URLs as design references:

Write the prompt to `/tmp/lovable_prompt.txt`:

```
Recreate this UI design as a working React app with Tailwind CSS
```

Write the image URLs (one per line) to `/tmp/lovable_images.txt`:

```
https://example.com/design-mockup.png
https://example.com/mobile-view.png
```

Then construct the URL:

```bash
python3 -c "
import urllib.parse
prompt = open('/tmp/lovable_prompt.txt').read().strip()
images = open('/tmp/lovable_images.txt').read().strip().splitlines()
encoded_prompt = urllib.parse.quote(prompt, safe='')
encoded_images = '&images='.join(urllib.parse.quote(img, safe='') for img in images)
print('https://lovable.dev/?autosubmit=true#prompt=' + encoded_prompt + '&images=' + encoded_images)
"
```

---

### 3. Quick URL for Simple Prompts

For short prompts without special characters, encode manually:

```bash
python3 -c "import urllib.parse; print('https://lovable.dev/?autosubmit=true#prompt=' + urllib.parse.quote('Build a React todo app with dark mode and local storage', safe=''))"
```

---

## Guidelines

1. **Browser login required**: The URL must be opened in a browser where the user is logged into lovable.dev — curl calls will redirect to the login page
2. **Always URL-encode prompts**: Use Python's `urllib.parse.quote()` — spaces, `&`, `#`, and other special characters must be encoded to avoid breaking the URL
3. **Max prompt length**: 50,000 characters
4. **Image URLs must be public**: Referenced images must be accessible without authentication — no signed S3 URLs or private links
5. **REST API in development**: Lovable has announced more endpoints are planned; check `docs.lovable.dev` for updates
