# Canonical Page Set — the 15-slot content-role contract

A shared contract for structure templates. A conforming deck has **exactly 15
slots, in this fixed order**. Each slot is a *position* with a fixed **content
role** and the **content it must carry** — independent of any template's visual
treatment. A template fills the slots with its own layout/devices/motifs but
**cannot change the slot order, count, or content role**.

Templates that follow this contract reference it; their own `SKILL.md` only adds
the per-slot *layout* (how each role is arranged and decorated).

## The 15 slots

| # | Slot (content role) | Required content |
|---|---|---|
| 01 | **Cover** | title · subtitle? · brand pill · year · footer hashtag/url |
| 02 | **Agenda / TOC** | sections[] (label · target page) |
| 03 | **Section divider: About** | chapter number · section title · pill? |
| 04 | **About / Intro** | kicker · headline · lead · body · photo |
| 05 | **Mission / Vision** | kicker · headline · items[] (title · body) |
| 06 | **Team** | members[] (name · role · photo · stat?) |
| 07 | **Section divider: Work** | chapter number · section title |
| 08 | **Services** | kicker · headline · services[] (icon · title · body) |
| 09 | **Process / How it works** | kicker · headline · steps[] (number · title · body) |
| 10 | **Gallery / Portfolio** | kicker · headline · body · photos[] · tags[] |
| 11 | **Section divider: Proof** | chapter number · section title |
| 12 | **Stats / Impact** | kicker · headline · body · stats[] (value · caption) |
| 13 | **Testimonials** | quotes[] (text · name · role · company · photo) |
| 14 | **Pricelist** | kicker · headline · body · plans[] (tier · price · unit · features[] · popular?) |
| 15 | **Thank you / Contact** | title · contact (email · url) · pill · year |

*( = 1 cover + 1 agenda + 3 dividers + 9 content + 1 close = 15 )*

## Rules

- **Fixed order; fill every slot, never skip one.** The 15-page shape is invariant.
- Each slot is unique by content role — no two "stat" pages, no duplicate-role slides.
- When learning an external deck, walk the 15 roles in order: source covers it → record its treatment; source missing → use a neutral fallback for that role.
- A template defines *how* each role looks; this contract defines *what each role is*.
