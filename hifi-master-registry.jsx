/* global window */
/* hifi-master-registry.jsx — single source of truth for the master prototype.

   Replaces the duplicated workspace/subtab metadata that previously lived in
   hifi-chrome-v10.jsx (WS_META) and app-hifi-r4.jsx (DCArtboard list). Both
   the layout view and the interactive view consume this map.

   Shape:
     SURFACE_REGISTRY[wsId][subId] = {
       component: 'HF_X' | null,    // window key for the React surface
       kicker:    string,           // mono eyebrow shown in drawer preview
       descriptor: string,          // serif italic one-liner
       stats:     [{ l, v, t }],    // 3 stat chips · t = up | down | flat
       dimensions: { w, h }         // artboard size in layout view
     };

   `null` component → layout view shows a "DRAFT THIS SURFACE" placeholder,
   interactive view shows the same placeholder via the v10-style not-yet-built
   panel. Master entry guarantees ZERO null components — Home/Threads,
   Home/Activity, Intel/Trends are all drafted in this fleet.

   WS_ORDER + SUB_ORDER are exported alongside so callers don't re-key the
   object themselves. */

// MASTER_WS_ORDER: 8 top-level workspaces in nav order. Wave 3 IA collapse:
// Studio retired entirely (its 5 sub-tabs collapse into Docs Home + top-level
// Clip Lab; List/Shipped killed; Workspace becomes Pinned filter on Docs Home
// — handled separately by I3). Block Catalog (id: 'blocks') is intentionally
// EXCLUDED from this list — it remains in SURFACE_REGISTRY for layout-view
// rendering only and is never a top-level interactive workspace.
const MASTER_WS_ORDER = [
  { id: 'home',     label: 'Home',     fresh: false },
  { id: 'docs',     label: 'Docs',     fresh: true  },
  { id: 'cliplab',  label: 'Clip Lab', fresh: true  },
  { id: 'library',  label: 'Library',  fresh: false },
  { id: 'insights', label: 'Insights', fresh: true  },
  { id: 'intel',    label: 'Intel',    fresh: true  },
  { id: 'inbox',    label: 'Inbox',    fresh: true  },
  { id: 'calendar', label: 'Calendar', fresh: false },
];

const SURFACE_REGISTRY = {
  home: {
    label: 'Home',
    subs: [
      { id: 'Today',    component: 'HF_HomeChat',                kicker: 'WHAT IS HAPPENING',     descriptor: 'Today’s briefing — what to ship, what to read.',  stats: [{ l: 'Threads', v: '12',  t: 'flat' }, { l: 'Drafts', v: '3',   t: 'up' },   { l: 'Due',         v: '2',     t: 'down' }], dimensions: { w: 1440, h: 1800 } },
      { id: 'Threads',  component: 'HF_HomeThreads',             kicker: 'CONVERSATIONS',         descriptor: 'Recent chats with the agent — pinned + active.',         stats: [{ l: 'Active',  v: '4',   t: 'up' },   { l: 'Pinned', v: '6',   t: 'flat' }, { l: 'Archived',    v: '218',   t: 'up' }],   dimensions: { w: 1440, h: 1200 } },
      { id: 'Briefing', component: 'HF_HomeBriefingCollapsed',   kicker: 'TODAY · STANDALONE', descriptor: 'Full briefing card — week ahead + library pulse.',     stats: [{ l: 'Posts due', v: '4', t: 'flat' }, { l: 'Recent wins', v: '2', t: 'up' }, { l: 'One-thing', v: '1', t: 'flat' }], dimensions: { w: 1440, h: 1200 } },
      { id: 'Activity', component: 'HF_HomeActivity',            kicker: 'RECENT ACTIVITY',       descriptor: 'What the agent did, what you did, in order.',                stats: [{ l: 'Today',   v: '24',  t: 'up' },   { l: 'This week', v: '187', t: 'up' }, { l: 'By agent',    v: '64%',   t: 'up' }],   dimensions: { w: 1440, h: 1500 } },
    ],
  },
  blocks: {
    label: 'Block Catalog',
    subs: [
      { id: 'A · Measurement', component: 'HF_R4B_BlockFamilyA', kicker: 'CHARTS IN THREAD', descriptor: 'Measurement blocks: curves, deltas, histograms, funnels, and strips.', stats: [{ l: 'Blocks', v: '14', t: 'flat' }, { l: 'Charts', v: '11', t: 'up' }, { l: 'Target', v: 'Insights', t: 'flat' }], dimensions: { w: 1440, h: 2400 } },
      { id: 'B · Comparison',  component: 'HF_R4B_BlockFamilyB', kicker: 'TWO THINGS, ONE GAP', descriptor: 'Comparison blocks for pairs, matrices, benchmarks, and rewrites.', stats: [{ l: 'Blocks', v: '7', t: 'flat' }, { l: 'Deltas', v: '7', t: 'up' }, { l: 'Span', v: '4-6', t: 'flat' }], dimensions: { w: 1440, h: 1500 } },
      { id: 'C · Draft',       component: 'HF_R4B_BlockFamilyC', kicker: 'WORDS IN PROGRESS', descriptor: 'Draft blocks for hooks, outlines, captions, source traces, revisions, and approvals.', stats: [{ l: 'Blocks', v: '13', t: 'up' }, { l: 'Text', v: '13', t: 'up' }, { l: 'Open', v: 'Studio', t: 'flat' }], dimensions: { w: 1440, h: 2400 } },
      { id: 'D · Audience',    component: 'HF_R4B_BlockFamilyD', kicker: 'WHO IS THERE', descriptor: 'Audience blocks for segments, personas, fans, geo, overlap, and tone.', stats: [{ l: 'Blocks', v: '8', t: 'flat' }, { l: 'People', v: '5', t: 'up' }, { l: 'Open', v: 'Audience', t: 'flat' }], dimensions: { w: 1440, h: 1800 } },
      { id: 'E · Schedule',    component: 'HF_R4B_BlockFamilyE', kicker: 'TIME AS MATERIAL', descriptor: 'Schedule blocks for weeks, slots, conflicts, cadence, and streaks.', stats: [{ l: 'Blocks', v: '8', t: 'flat' }, { l: 'Calendar', v: '8', t: 'up' }, { l: 'Wide', v: '2', t: 'flat' }], dimensions: { w: 1440, h: 1800 } },
      { id: 'F · Hook tests',  component: 'HF_R4B_BlockFamilyF', kicker: 'TEST THE OPENING', descriptor: 'Hook-test blocks for A/B choices, stop-rate, power, and experiment logs.', stats: [{ l: 'Blocks', v: '6', t: 'flat' }, { l: 'Tests', v: '4', t: 'up' }, { l: 'Open', v: 'Studio', t: 'flat' }], dimensions: { w: 1440, h: 1500 } },
      { id: 'G · Voice',       component: 'HF_R4B_BlockFamilyG', kicker: 'HOW IT SOUNDS', descriptor: 'Voice blocks for memory, forbidden phrases, style samples, and tone axes.', stats: [{ l: 'Blocks', v: '6', t: 'flat' }, { l: 'Memory', v: '5', t: 'up' }, { l: 'Guardrails', v: '14', t: 'flat' }], dimensions: { w: 1440, h: 1500 } },
      { id: 'H · Inbox',       component: 'HF_R4B_BlockFamilyH', kicker: 'VIEWER RESPONSE', descriptor: 'Inbox blocks for digests, clusters, DMs, sentiment, replies, and triage.', stats: [{ l: 'Blocks', v: '6', t: 'flat' }, { l: 'Queues', v: '3', t: 'up' }, { l: 'Open', v: 'Inbox', t: 'flat' }], dimensions: { w: 1440, h: 1500 } },
      { id: 'I · Intel',       component: 'HF_R4B_BlockFamilyI', kicker: 'OUTSIDE SIGNALS', descriptor: 'Intel blocks for trends, sources, peer posts, search, news, and references.', stats: [{ l: 'Blocks', v: '8', t: 'flat' }, { l: 'Sources', v: '3', t: 'up' }, { l: 'Open', v: 'Intel', t: 'flat' }], dimensions: { w: 1440, h: 1800 } },
      { id: 'J · Workspace',   component: 'HF_R4B_BlockFamilyJ', kicker: 'WORK IN FLIGHT', descriptor: 'Workspace blocks for projects, files, briefs, versions, assets, and notes.', stats: [{ l: 'Blocks', v: '7', t: 'flat' }, { l: 'Project', v: '4', t: 'up' }, { l: 'Open', v: 'Workspace', t: 'flat' }], dimensions: { w: 1440, h: 1500 } },
      { id: 'K · Library',     component: 'HF_R4B_BlockFamilyK', kicker: 'PAST WORK PULLED IN', descriptor: 'Library blocks for post hits, patterns, series, facets, and quotes.', stats: [{ l: 'Blocks', v: '5', t: 'flat' }, { l: 'Archive', v: '5', t: 'up' }, { l: 'Open', v: 'Library', t: 'flat' }], dimensions: { w: 1440, h: 1300 } },
      { id: 'L · System',      component: 'HF_R4B_BlockFamilyL', kicker: 'SYSTEM EXPLAINS ITSELF', descriptor: 'System blocks for decisions, forecasts, cost, empty/error states, and caveats.', stats: [{ l: 'Blocks', v: '6', t: 'flat' }, { l: 'States', v: '4', t: 'up' }, { l: 'Open', v: 'Mixed', t: 'flat' }], dimensions: { w: 1440, h: 1500 } },
      { id: 'M · Search',      component: 'HF_R4B_BlockFamilyM', kicker: 'SOURCE TRUST', descriptor: 'Search blocks for query refinement, mixed-source stacks, facets, citations, and watchlists.', stats: [{ l: 'Blocks', v: '8', t: 'flat' }, { l: 'Sources', v: '18', t: 'up' }, { l: 'Open', v: 'Intel', t: 'flat' }], dimensions: { w: 1440, h: 1800 } },
      { id: 'N · Own Content', component: 'HF_R4B_BlockFamilyN', kicker: 'OWN PROOF', descriptor: 'Own-content blocks for library hits, source posts, transcripts, clips, assets, quotes, patterns, and gaps.', stats: [{ l: 'Blocks', v: '8', t: 'flat' }, { l: 'Shapes', v: '4', t: 'up' }, { l: 'Open', v: 'Library', t: 'flat' }], dimensions: { w: 1440, h: 1800 } },
      { id: 'O · Social Intel', component: 'HF_R4B_BlockFamilyO', kicker: 'PROFILE PULLS', descriptor: 'Social intelligence blocks for platform scans, competitor profiles, peer lanes, trends, and comments.', stats: [{ l: 'Blocks', v: '8', t: 'flat' }, { l: 'Profiles', v: '6', t: 'up' }, { l: 'Open', v: 'Intel', t: 'flat' }], dimensions: { w: 1440, h: 1800 } },
      { id: 'P · Imports',     component: 'HF_R4B_BlockFamilyP', kicker: 'CONNECT AND PARSE', descriptor: 'Import blocks for permissions, sync, uploads, OCR, transcripts, privacy, and retry.', stats: [{ l: 'Blocks', v: '8', t: 'flat' }, { l: 'Access', v: '3', t: 'up' }, { l: 'Open', v: 'Settings', t: 'flat' }], dimensions: { w: 1440, h: 1800 } },
      { id: 'Q · Actions',     component: 'HF_R4B_BlockFamilyQ', kicker: 'ACTION BOUNDARIES', descriptor: 'Action blocks for plans, progress, approvals, queues, packages, adaptations, and receipts.', stats: [{ l: 'Blocks', v: '8', t: 'flat' }, { l: 'Queues', v: '3', t: 'up' }, { l: 'Open', v: 'Studio', t: 'flat' }], dimensions: { w: 1440, h: 1800 } },
      { id: 'Thread Demo',     component: 'HF_R4B_ThreadDemo',   kicker: 'BLOCKS IN CONVERSATION', descriptor: 'Forty-plus distinct blocks rendered inside a realistic multi-turn thread.', stats: [{ l: 'Turns', v: '20', t: 'up' }, { l: 'Blocks', v: '42+', t: 'up' }, { l: 'Families', v: '17', t: 'flat' }], dimensions: { w: 1440, h: 2800 } },
    ],
  },
  // Wave 3 IA: 'docs' is the new top-level Docs workspace (was studio.docs).
  // HF_StudioDocFull alias preserves R6/R7/R8 wiring — do not rename.
  docs: {
    label: 'Docs',
    subs: [
      { id: 'Home',  component: 'HF_StudioDocFull', kicker: 'DOCS HOME · CARD GRID',     descriptor: 'All written projects — pinned, recent, and the agent inline.', stats: [{ l: 'Drafts', v: '7',     t: 'flat' }, { l: 'Words',  v: '24.3k', t: 'up' },   { l: 'Open',     v: '3',  t: 'flat' }], dimensions: { w: 1440, h: 2400 } },
      { id: 'List',  component: 'HF_StudioDocFull', kicker: 'DOCS LIST · SORTABLE TABLE', descriptor: 'Same data as Home, sorted by status, due, pillar, words.',     stats: [{ l: 'Items',  v: '18',    t: 'up' },   { l: 'Overdue', v: '1',     t: 'down' }, { l: 'Words',    v: '24.3k', t: 'up' }],   dimensions: { w: 1440, h: 2100 } },
    ],
  },
  // Wave 3 IA: Clip Lab promoted to top-level. 5-step state machine preserved
  // — Empty → Import → AutoClips → Review → Export.
  cliplab: {
    label: 'Clip Lab',
    subs: [
      { id: 'Empty',     component: 'HF_ClipLabEmpty',     kicker: 'CLIP LAB · DAY ONE',       descriptor: 'Drop footage; Coopr finds the best 9:16 verticals.',                stats: [{ l: 'Pending',   v: '0',  t: 'flat' }, { l: 'Reviewed',  v: '0',  t: 'flat' }, { l: 'Published', v: '0',  t: 'flat' }], dimensions: { w: 1440, h: 1500 } },
      { id: 'Import',    component: 'HF_ClipLabImport',    kicker: 'CLIP LAB · INGEST',        descriptor: 'Drop-zone band + 4-take upload ladder (extract → transcribe → analyze → ready).', stats: [{ l: 'Uploading', v: '4',  t: 'up' },   { l: 'Queued',    v: '2',  t: 'flat' }, { l: 'Errors',    v: '0',  t: 'flat' }], dimensions: { w: 1440, h: 1500 } },
      { id: 'AutoClips', component: 'HF_ClipLabAutoClips', kicker: 'CLIP LAB · AUTO-DETECTED', descriptor: 'Twelve auto-detected vertical clips in a 4×3 grid; use or skip.',  stats: [{ l: 'Detected',  v: '12', t: 'up' },   { l: 'Used',       v: '0',  t: 'flat' }, { l: 'Skipped',   v: '0',  t: 'flat' }], dimensions: { w: 1440, h: 1500 } },
      { id: 'Review',    component: 'HF_ClipLabReview',    kicker: 'CLIP LAB · REVIEW',        descriptor: 'Single-clip detail — 1280×720 player + transcript + 3 cut suggestions.', stats: [{ l: 'In review', v: '1',  t: 'flat' }, { l: 'Cuts',      v: '3',  t: 'up' },   { l: 'Length',    v: '0:48', t: 'flat' }], dimensions: { w: 1440, h: 1800 } },
      { id: 'Export',    component: 'HF_ClipLabExport',    kicker: 'CLIP LAB · QUEUE',         descriptor: 'Queued clips — per-channel chips, bulk captions, ship-all CTA.',  stats: [{ l: 'Queued',    v: '6',  t: 'up' },   { l: 'Channels', v: '3',  t: 'flat' }, { l: 'Drafted',   v: '6',  t: 'up' }],   dimensions: { w: 1440, h: 1500 } },
    ],
  },
  library: {
    label: 'Library',
    subs: [
      { id: 'Catalog',  component: 'HF_R4_LibraryCatalogGrid', kicker: 'EVERYTHING YOU MADE',     descriptor: '404 posts across 3 platforms, sectioned by recency and pillar.', stats: [{ l: 'Live', v: '404', t: 'up' }, { l: 'Trial', v: '6', t: 'flat' }, { l: 'Graduated', v: '38', t: 'up' }],                 dimensions: { w: 1440, h: 2700 }, detail: { kind: 'post', component: 'HF_R4_LibraryDetail' } },
      { id: 'Series',   component: 'HF_R4_LibrarySeries',     kicker: 'CASE FILES',                descriptor: 'Multi-part projects, organized as journals.',                  stats: [{ l: 'Active', v: '7', t: 'up' }, { l: 'In series', v: '132', t: 'up' }, { l: 'Top lift', v: '+58%', t: 'up' }],         dimensions: { w: 1440, h: 2100 } },
      { id: 'Patterns', component: 'HF_R4_LibraryPatterns',   kicker: 'PILLARS / FORMATS / DNA',   descriptor: 'What makes a post work for you — and what doesn’t.',  stats: [{ l: 'Pillars', v: '4', t: 'flat' }, { l: 'Top yield', v: '1.42x', t: 'up' }, { l: 'Hooks', v: '47', t: 'up' }],   dimensions: { w: 1440, h: 2400 } },
      { id: 'Timeline', component: 'HF_R4_LibraryTimeline',   kicker: 'THE JOURNAL',               descriptor: 'One row per month — flagships, locations, learnings.',     stats: [{ l: 'Months', v: '14', t: 'flat' }, { l: 'Flagships', v: '9', t: 'up' }, { l: 'Locations', v: '6', t: 'up' }],            dimensions: { w: 1440, h: 2400 } },
      { id: 'Pairings', component: 'HF_R4_LibraryPairing',    kicker: 'ONE IDEA x THREE',     descriptor: 'Same idea, three channels — see what ports.',              stats: [{ l: 'Ideas', v: '9', t: 'flat' }, { l: 'Channels', v: '3', t: 'flat' }, { l: 'Coverage', v: '42%', t: 'up' }],         dimensions: { w: 1440, h: 2400 } },
      { id: 'Compare',  component: 'HF_R4_LibraryCompare',    kicker: 'SIDE BY SIDE',              descriptor: 'Three posts overlaid on one chart with synthesis rail.',         stats: [{ l: 'Active', v: '3', t: 'flat' }, { l: 'Top watch', v: '81%', t: 'up' }, { l: 'Top save', v: '4.6%', t: 'up' }],     dimensions: { w: 1440, h: 2100 } },
    ],
  },
  insights: {
    label: 'Insights',
    subs: [
      { id: 'Overview',   component: 'HF_InsightsOverview',  kicker: '30-DAY SNAPSHOT',     descriptor: 'Where the volume lives this month.',           stats: [{ l: 'Saves', v: '+22%', t: 'up' }, { l: 'Views', v: '+12%', t: 'up' }, { l: 'Channel', v: '−4%', t: 'down' }], dimensions: { w: 1440, h: 1800 } },
      { id: 'Retention',  component: 'HF_InsightsRetention', kicker: 'WATCH-CURVE ANALYSIS', descriptor: 'How long viewers stay; where they drop.',       stats: [{ l: 'Median', v: '64%', t: 'up' }, { l: 'Drop', v: '1:42', t: 'flat' }, { l: 'Top quartile', v: '81%', t: 'up' }], dimensions: { w: 1440, h: 2100 } },
      { id: 'Formats',    component: 'HF_InsightsFormatDNA', kicker: 'WHAT FORMATS WORK FOR YOU', descriptor: 'Top formats, hook structures, channel by format heatmap. What to repeat.', stats: [{ l: 'Top format', v: '+42%', t: 'up' }, { l: 'Coverage', v: '78%', t: 'up' }, { l: 'Emerging', v: '3', t: 'up' }], dimensions: { w: 1440, h: 2400 } },
      { id: 'Audience',   component: 'HF_InsightsAudience',  kicker: 'DEMOGRAPHIC + INTENT', descriptor: 'Who is watching, and how much they say.',       stats: [{ l: 'Net new', v: '+11.4k', t: 'up' }, { l: 'Sentiment', v: '+0.62', t: 'up' }, { l: 'Sub conv', v: '2.6%', t: 'up' }], dimensions: { w: 1440, h: 1800 } },
      { id: 'Posting',    component: 'HF_InsightsPosting',   kicker: 'CADENCE + COVERAGE',   descriptor: 'Volume, timing, and channel mix.',              stats: [{ l: 'Per week', v: '3.2', t: 'down' }, { l: 'On-time', v: '92%', t: 'up' }, { l: 'IG gap', v: '4d', t: 'down' }], dimensions: { w: 1440, h: 2100 } },
    ],
  },
  intel: {
    label: 'Intel',
    subs: [
      { id: 'Trends',      component: 'HF_IntelTrends',      kicker: 'WHAT IS MOVING',          descriptor: 'Topics rising in your corner of the world.',  stats: [{ l: 'Active', v: '8', t: 'up' }, { l: 'New today', v: '2', t: 'up' }, { l: 'Falling', v: '3', t: 'down' }],   dimensions: { w: 1440, h: 1800 } },
      { id: 'Radar',       component: 'HF_IntelRadar',       kicker: 'COMPETITIVE WATCH',       descriptor: 'Creators near your space, ranked by velocity.', stats: [{ l: 'Tracked', v: '42', t: 'flat' }, { l: 'New', v: '4', t: 'up' }, { l: 'Hot', v: '7', t: 'up' }],            dimensions: { w: 1440, h: 2400 } },
      { id: 'Inspiration', component: 'HF_IntelInspiration', kicker: 'IDEAS WORTH STEALING',    descriptor: 'Saved snippets, screenshots, and references.',  stats: [{ l: 'Saved', v: '124', t: 'up' }, { l: 'Tagged', v: '87', t: 'up' }, { l: 'Used', v: '18', t: 'up' }],         dimensions: { w: 1440, h: 2100 } },
      { id: 'DNA',         component: 'HF_IntelDNA',         kicker: 'CREATIVE FINGERPRINT',    descriptor: 'What makes you, you — pillars and voice.',     stats: [{ l: 'Pillars', v: '4', t: 'flat' }, { l: 'Voice', v: '82', t: 'up' }, { l: 'Niche fit', v: '94%', t: 'up' }], dimensions: { w: 1440, h: 2400 } },
      { id: 'Memory',      component: 'HF_IntelMemory',      kicker: 'WHAT THE APP REMEMBERS',  descriptor: 'Knowledge base, lineage, and prior lessons.',   stats: [{ l: 'Snippets', v: '318', t: 'up' }, { l: 'Lessons', v: '42', t: 'up' }, { l: 'Links', v: '128', t: 'up' }], dimensions: { w: 1440, h: 2400 } },
      { id: 'Studies',     component: 'HF_IntelStudies',     kicker: 'DEEPER ANALYSES',         descriptor: 'Long-form takes you can return to.',           stats: [{ l: 'Active', v: '3', t: 'flat' }, { l: 'Done', v: '9', t: 'up' }, { l: 'Words', v: '42k', t: 'up' }],           dimensions: { w: 1440, h: 2400 } },
    ],
  },
  inbox: {
    label: 'Inbox',
    subs: [
      { id: 'Comments', component: 'HF_InboxComments_R2', kicker: 'WHAT VIEWERS SAY',  descriptor: 'Comments across all platforms, intent-grouped.', stats: [{ l: 'Today', v: '214', t: 'up' }, { l: 'Week', v: '1.2k', t: 'up' }, { l: 'Pending', v: '18', t: 'down' }],     dimensions: { w: 1440, h: 2100 }, detail: { kind: 'thread', component: 'HF_InboxCommentThread' } },
      { id: 'DMs',      component: 'HF_InboxDMs_R2',      kicker: 'BRAND + COLLAB',     descriptor: 'Private messages, sorted by brand-fit score.',   stats: [{ l: 'Today', v: '42', t: 'up' }, { l: 'Brand', v: '7', t: 'up' }, { l: 'Top fit', v: '88', t: 'up' }],          dimensions: { w: 1440, h: 1800 } },
      { id: 'Mentions', component: 'HF_InboxMentions',    kicker: 'WHO TAGGED YOU',     descriptor: 'Mentions and tags worth a look.',                stats: [{ l: 'Today', v: '18', t: 'up' }, { l: 'Influencers', v: '4', t: 'up' }, { l: 'Sentiment', v: '+0.71', t: 'up' }], dimensions: { w: 1440, h: 2100 } },
      { id: 'Replies',  component: 'HF_InboxReplies',     kicker: 'YOUR SENT REPLIES',  descriptor: 'Replies and follow-ups, with response time.',     stats: [{ l: 'Today', v: '24', t: 'up' }, { l: 'Within 24h', v: '92%', t: 'up' }, { l: 'Open', v: '7', t: 'flat' }],     dimensions: { w: 1440, h: 2100 } },
    ],
  },
  calendar: {
    label: 'Calendar',
    subs: [
      { id: 'Week',      component: 'HF_Calendar',         kicker: 'WEEK VIEW',          descriptor: 'Cross-platform schedule for the active week.',     stats: [{ l: 'Scheduled', v: '14', t: 'up' }, { l: 'Drafts', v: '4', t: 'flat' }, { l: 'Open slots', v: '6', t: 'down' }], dimensions: { w: 1440, h: 1500 } },
      { id: 'Day',       component: 'HF_CalendarDay',      kicker: 'HOUR-BY-HOUR',       descriptor: 'Vertical hour spine for one day, with a now line.', stats: [{ l: 'Today', v: '4', t: 'flat' }, { l: 'Best window', v: '6:30p', t: 'flat' }, { l: 'Conflict', v: '0', t: 'up' }], dimensions: { w: 1440, h: 1500 } },
      { id: 'Month',     component: 'HF_CalendarMonth',    kicker: 'GRID OVERVIEW',      descriptor: 'April at a glance — daily counts and top slots.',    stats: [{ l: 'This month', v: '36', t: 'up' }, { l: 'Active days', v: '22', t: 'up' }, { l: 'Conflicts', v: '2', t: 'down' }], dimensions: { w: 1440, h: 1500 } },
      { id: 'Conflicts', component: 'HF_CalendarConflict', kicker: 'OVERLAP RESOLUTION', descriptor: 'Scheduling conflicts to resolve, ordered by date.',  stats: [{ l: 'Active', v: '3', t: 'flat' }, { l: 'Resolved', v: '14', t: 'up' }, { l: 'IG double-book', v: '1', t: 'down' }], dimensions: { w: 1440, h: 1500 } },
    ],
  },
};

// ─── Helpers ────────────────────────────────────────────────
function masterRouteSlug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\+/g, 'plus')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]+/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function masterCanonicalWorkspace(wsId) {
  if (!wsId) return null;
  const raw = String(wsId);
  if (SURFACE_REGISTRY[raw]) return raw;
  const slug = masterRouteSlug(raw);
  const found = MASTER_WS_ORDER.find(w => w.id === raw.toLowerCase() || masterRouteSlug(w.id) === slug || masterRouteSlug(w.label) === slug);
  return found ? found.id : null;
}

// Wave 3 IA-collapse alias map. Two shapes:
//   aliases[wsId][subSlug] = 'CanonicalSubId'         — within-workspace rename
//   aliases[wsId][subSlug] = { ws, sub }              — cross-workspace redirect
// `studio` is fully retired from SURFACE_REGISTRY but kept in this map so
// legacy URLs (#interactive/studio/clip-lab, etc.) keep resolving to their new
// homes. `docs.docs` covers the case where someone hits the new docs
// workspace using the literal label-slug "Docs" — it canonicalizes to "Home".
const aliases = {
  docs: {
    docs: 'Home',
  },
  studio: {
    workspace: { ws: 'docs',    sub: 'Home'  },
    'clip-lab': { ws: 'cliplab', sub: 'Empty' },
    docs:      { ws: 'docs',    sub: 'Home'  },
    list:      { ws: 'docs',    sub: 'Home'  },
    shipped:   { ws: 'docs',    sub: 'Home'  },
  },
};

function masterCanonicalSub(wsId, subId) {
  if (!subId) return null;
  // First, try the alias map. Legacy workspace IDs (e.g. "studio") aren't in
  // SURFACE_REGISTRY anymore, so we consult aliases BEFORE canonicalizing the
  // workspace — otherwise studio links would 404.
  const wsRaw  = String(wsId || '').toLowerCase();
  const subRaw = String(subId);
  const subSlug = masterRouteSlug(subRaw);
  const aliasBucket = aliases[wsRaw];
  if (aliasBucket) {
    const hit = aliasBucket[subRaw] || aliasBucket[subRaw.toLowerCase()] || aliasBucket[subSlug];
    if (typeof hit === 'string') {
      // Within-workspace rename — fall through to normal lookup with the
      // canonical sub label.
      const wsKey = masterCanonicalWorkspace(wsId);
      const ws = wsKey ? SURFACE_REGISTRY[wsKey] : null;
      if (ws) {
        const sub = ws.subs.find(s => s.id === hit);
        if (sub) return sub.id;
      }
    } else if (hit && typeof hit === 'object' && hit.sub) {
      // Cross-workspace redirect — return the target sub label. Callers that
      // need both ws and sub should go through masterLookup, which re-resolves
      // the workspace via the alias too.
      return hit.sub;
    }
  }

  const wsKey = masterCanonicalWorkspace(wsId);
  const ws = wsKey ? SURFACE_REGISTRY[wsKey] : null;
  if (!ws) return null;
  const sub = ws.subs.find(s => s.id === subRaw || s.id.toLowerCase() === subRaw.toLowerCase() || masterRouteSlug(s.id) === subSlug);
  return sub ? sub.id : null;
}

// Look up a (workspace, subtab) pair in the registry. Accepts canonical IDs
// and URL slugs, but always returns the canonical registry entry. Honors the
// Wave 3 alias map: legacy studio links resolve to their new docs/cliplab
// homes here.
function masterLookup(wsId, subId) {
  const wsRaw  = String(wsId || '').toLowerCase();
  const subRaw = String(subId || '');
  const subSlug = masterRouteSlug(subRaw);
  // Cross-workspace alias short-circuit (studio.* → docs.*/cliplab.*).
  const aliasBucket = aliases[wsRaw];
  if (aliasBucket) {
    const hit = aliasBucket[subRaw] || aliasBucket[subRaw.toLowerCase()] || aliasBucket[subSlug];
    if (hit && typeof hit === 'object' && hit.ws && hit.sub) {
      const targetWs = SURFACE_REGISTRY[hit.ws];
      if (targetWs) return targetWs.subs.find(s => s.id === hit.sub) || null;
    }
  }
  const wsKey = masterCanonicalWorkspace(wsId);
  const subKey = masterCanonicalSub(wsKey, subId);
  const ws = wsKey ? SURFACE_REGISTRY[wsKey] : null;
  if (!ws || !subKey) return null;
  return ws.subs.find(s => s.id === subKey) || null;
}

// Default subtab per workspace (the one the drawer commits to first).
// Wave 3 IA collapse: studio + blocks removed (blocks is layout-view-only;
// studio is retired). docs default = Home, cliplab default = Empty.
const MASTER_DEFAULT_SUB = {
  home: 'Today',
  docs: 'Home',
  cliplab: 'Empty',
  library: 'Catalog',
  insights: 'Overview',
  intel: 'Trends',
  inbox: 'Comments',
  calendar: 'Week',
};

// Master entry point: insights / Overview. Spec acceptance #1.
const MASTER_ENTRY = { ws: 'insights', sub: 'Overview' };

// Flat list of every (ws, sub) pair — used by the smoke test and the
// layout view's iteration. Order follows MASTER_WS_ORDER × subs[].
function masterFlatList() {
  const out = [];
  for (const w of MASTER_WS_ORDER) {
    const meta = SURFACE_REGISTRY[w.id];
    if (!meta) continue;
    for (const s of meta.subs) {
      out.push({ ws: w.id, sub: s.id, ...s });
    }
  }
  return out;
}

Object.assign(window, {
  SURFACE_REGISTRY,
  MASTER_WS_ORDER,
  MASTER_DEFAULT_SUB,
  MASTER_ENTRY,
  MASTER_ALIASES: aliases,
  masterRouteSlug,
  masterCanonicalWorkspace,
  masterCanonicalSub,
  masterLookup,
  masterFlatList,
});
