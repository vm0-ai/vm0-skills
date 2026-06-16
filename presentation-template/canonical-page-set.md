# Canonical Page Set — the 15-slot content-role contract

A shared contract for structure templates. A conforming deck has **exactly 15
slots, in this fixed order**. Each slot is a *position* with a fixed **content
role** and the **content it must carry** — independent of any template's visual
treatment. A template fills the slots with its own layout/motifs but **cannot
change the slot order, count, or content role**.

Templates that follow this contract reference it; their own `SKILL.md` only adds
the per-slot *layout* (how each role is arranged and decorated).

## The 15 slots

| # | Slot (content role) |
|---|---|
| 01 | Cover |
| 02 | Agenda / TOC |
| 03 | Section divider: About |
| 04 | About / Intro |
| 05 | Mission / Vision |
| 06 | Team |
| 07 | Section divider: Work |
| 08 | Services |
| 09 | Process / How it works |
| 10 | Gallery / Portfolio |
| 11 | Section divider: Proof |
| 12 | Stats / Impact |
| 13 | Testimonials |
| 14 | Pricelist |
| 15 | Thank you / Contact |

*( = 1 cover + 1 agenda + 3 dividers + 9 content + 1 close = 15 )*

## Detailed slot specs

For each slot: **role** (what it conveys) and **content** (the data fields it
must carry). `?` marks an optional field; `[]` a repeated list.

### 01 — Cover
- **Role:** First impression — brand / project / year; no business content yet.
- **Content:** title · subtitle? · brand pill · year · footer hashtag/url

### 02 — Agenda / TOC
- **Role:** Tell the viewer what's coming; set expectations and pace.
- **Content:** sections[] (label · target page)

### 03 — Section divider: About
- **Role:** A visual stop that opens slots 04–06; marks a chapter.
- **Content:** chapter number · section title · pill?

### 04 — About / Intro
- **Role:** Narrative introduction — who / what we are.
- **Content:** kicker · headline · lead · body · photo

### 05 — Mission / Vision
- **Role:** What we believe / aim for.
- **Content:** kicker · headline · items[] (title · body)

### 06 — Team
- **Role:** Show the team — names and roles.
- **Content:** members[] (name · role · photo · stat?)

### 07 — Section divider: Work
- **Role:** Opens the Work chapter (same shape as 03).
- **Content:** chapter number · section title

### 08 — Services
- **Role:** What we offer.
- **Content:** kicker · headline · services[] (icon · title · body)

### 09 — Process / How it works
- **Role:** How we deliver — steps in sequence.
- **Content:** kicker · headline · steps[] (number · title · body)

### 10 — Gallery / Portfolio
- **Role:** Show work, snapshots, environment.
- **Content:** kicker · headline · body · photos[] · tags[]

### 11 — Section divider: Proof
- **Role:** Opens the Proof chapter (same shape as 03).
- **Content:** chapter number · section title

### 12 — Stats / Impact
- **Role:** Numbers that prove value.
- **Content:** kicker · headline · body · stats[] (value · caption)

### 13 — Testimonials
- **Role:** Social proof — what clients / users say.
- **Content:** quotes[] (text · name · role · company · photo)

### 14 — Pricelist
- **Role:** Pricing tiers / plans.
- **Content:** kicker · headline · body · plans[] (tier · price · unit · features[] · popular?)

### 15 — Thank you / Contact
- **Role:** Closing — gratitude + how to reach.
- **Content:** title · contact (email · url) · pill · year

## Rules

- **Fixed order; fill every slot, never skip one.** The 15-page shape is invariant.
- Each slot is unique by content role — no two "stat" pages, no duplicate-role slides.
- When learning an external deck, walk the 15 roles in order: source covers it → record its treatment; source missing → use a neutral fallback for that role.
- A template defines *how* each role looks; this contract defines *what each role is*.
