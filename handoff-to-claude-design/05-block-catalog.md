# Block catalog — every in-line block in COOPR chat

Each row is one block type. The agent renders these inline inside a COOPR turn (between paragraphs of streamed prose). Every block needs:

- **Kicker** (mono uppercase 0.06em, `--fg-tertiary`).
- **Body** (the data / chart / list).
- **Inline action chips** at the bottom (≥ 2).
- **States:** idle · hover · loading · empty · error.
- **No shadow.** Border-only. Radius 12.

Group these by *narrative role* — that's how the conversation uses them. Design each one as if an editor laid it out for that one moment, not a generic template.

---

## A · Data-presentation blocks
> "Here's the data you asked about."

| Block | Job in conversation |
|---|---|
| `chart` | Generic chart — line, bar, area. The default visualization. |
| `retention_curve` | "Here's how long viewers stayed and where they dropped." Watch-% curve with annotated drop-points + benchmark. |
| `metric_pill` | "Three figures that matter, side-by-side." Label + value + sub × N. |
| `velocity` | "How fast something is changing." Series + delta + sparkline. |
| `sparkline` | Inline tiny chart used inside other blocks. |
| `table` | Sortable tabular data. |
| `comparison` | Two or three things side-by-side. Hooks · videos · captions · competitors. |
| `clip_comparison` | "These two clips, head-to-head." A vs B with retention overlay. |
| `clip_compare_grid` | "These six clips, scored." Grid with retention bars per clip. |
| `outlier_report` | "These items are unusual — here's why." Set with anomaly score + reason. |
| `breakout_trends` | "Topics breaking out in your niche." Trend list with velocity. |
| `trend_archive` | "Past trends and their decay curves." Trend cards over time. |
| `account_changes` | "Followed accounts that shifted." Account list with delta. |
| `niche_bleed` | "Adjacent niches your viewers also watch." Niche map with overlap %. |

## B · Decision-aiding blocks
> "Help me choose."

| Block | Job |
|---|---|
| `hook_card` | "Three hooks I'd write — pick one." |
| `hooks_recommend` | "Hooks ranked against your top quartile." |
| `caption` | "Drafted caption, in your voice." |
| `idea_list` | "Concept candidates I generated." |
| `idea_scorecard` | "These six ideas, scored on novelty / fit / lift." |
| `format_suggestion` | "What format this idea wants to be." |
| `posting_time` | "When to post — by platform, by day." |
| `inspiration_match` | "Three references that match your idea." |
| `content_match` | "This piece of yours rhymes with that one." |
| `decisions_list` | "Calls I made — confirm or override." |

## C · Deliverable blocks
> "Here's the finished thing."

| Block | Job |
|---|---|
| `script` | The script itself, with line types (hook · build · reveal). |
| `script_flow` | The script as a flow diagram. |
| `script_audit` | "What's wrong with this script and what to fix." |
| `creative_brief` | One-page brief for a project. |
| `shot_list` | Numbered shots with framing notes. |
| `overlay_sequence` | On-screen text overlay timing. |
| `overlay_strategy` | Why these overlays, in this order. |
| `carousel_organizer` | Slide order for a carousel post. |
| `image_grid` | Generated / referenced image set. |
| `media_kit` | Brand-deck snapshot. |
| `portfolio` | Sampler of best work. |
| `library_grid` | A subset of the creator's posts. |
| `library_ref` | Link back to a single library post. |
| `repurpose_approval` | "Approve this repurposed version?" |
| `edit_plan` | Steps to recut / edit a clip. |
| `clip_analysis` | "What's good and bad in this clip." |
| `clip_headline` | The hook line for a clip. |

## D · Strategy / explanation blocks
> "Here's why."

| Block | Job |
|---|---|
| `creativity_analysis` | "Why this format / pillar is working." |
| `voice_report` | "Your voice, characterized." |
| `validator_report` | "Your script measured against your voice." |
| `retention_psychology` | "Why people leave at 0:03." |
| `story_strategy` | "Narrative arc for this piece." |
| `knowledge_insight` | A single insight pulled from the knowledge base. |
| `research_report` | Long-form findings from a research run. |
| `study_plan` | "Here's how I'll test this." |
| `study_outcome` | "Test ran. Here's what we learned." |
| `recap` | "Last week, in your library." |
| `daily_brief` | "What's worth knowing this morning." |
| `session_digest` | "What we covered in this thread." |
| `strategic_change_radar` | "Things shifting in your strategy space." |
| `semantic_cluster` | "These ideas group around this theme." |
| `photo_report` | Photo-set analysis. |
| `hashtag_report` | Hashtag performance + recommendations. |

## E · System / self-aware blocks
> "Here's what I'm doing or just did."

| Block | Job |
|---|---|
| `action` | A row of buttons with confirmation. |
| `expandable` | "I have more — click to expand." |
| `onboarding` | Step-by-step setup card. |
| `autopilot` | "Here's what I'll do unattended." |
| `autopilot_stats` | "What I did this week, unattended." |
| `program_status` | "This long-running program is at step 4 / 8." |
| `program_rotation` | "What I'm rotating through." |
| `campaigns` | Active campaign cards. |
| `memory_write` | "I just learned this about you. Confirm to save." |
| `web_search` | "Found these on the web." |
| `web_sweep` | "Daily web sweep results." |
| `search_results` | Internal search results. |
| `creator_grid` | A grid of creators (Radar / Inspiration). |
| `music_timeline` | Music beat-map for a clip. |
| `file_analysis` | "I read your file. Here's what's in it." |
| `calendar` | Schedule view inline. |
| `job_progress` | Long-running job card (running / done / errored states). |
| `error_card` | Something failed — what to do next. |
| `block_skeleton` | The shared loading state. Designed once, reused everywhere. |

---

## Suggested order of attack

1. **Foundations first:** `block_skeleton`, `error_card`, `action`, `metric_pill`, `chart`. These set the visual grammar everything else inherits.
2. **Most-used in real conversations:** `hook_card`, `script`, `caption`, `retention_curve`, `idea_list`, `comparison`. These are the workhorses.
3. **Distinctive narrative blocks:** `daily_brief`, `recap`, `creative_brief`, `voice_report`, `validator_report`, `clip_analysis`. These should feel hand-set.
4. **Long-running / system:** `job_progress`, `web_sweep`, `program_status`, `autopilot`, `memory_write`. These need motion and self-awareness.
5. **Everything else** in any order.

When you finish a block, also draft 2–3 variants of *how it would appear in a COOPR turn* — what the prose around it would read like, what the inline action chips offer, what the "save-to-workspace" target is.
