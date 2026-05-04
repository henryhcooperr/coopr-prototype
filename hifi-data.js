/* hifi-data.js — single source of truth for all data-rich pages.
   One creator (Henry, dive cinematographer / safety educator). Everything else
   hangs off this. Numbers are realistic for a 410K-follower hybrid creator
   posting ~3x/wk across YT + IG + TikTok. */

window.HF_DATA = (function () {
  // ─── Creator profile ─────────────────────────────────────
  const creator = {
    name: 'Henry Mwangi',
    handle: '@henry.dives',
    location: 'Wayanad, IN · UTC+5:30',
    plan: 'Pro',
    channels: [
      { id: 'yt', name: 'YouTube',   handle: '@henrymwangi',  followers: 287400, growth30: +4.2 },
      { id: 'ig', name: 'Instagram', handle: '@henry.dives',  followers:  98300, growth30: +1.1 },
      { id: 'tt', name: 'TikTok',    handle: '@henrymwangi',  followers:  24800, growth30: -0.6 },
    ],
    pillars: [
      { id: 'safety',  label: 'Dive safety',     share: 0.42, color: 'var(--accent-primary)' },
      { id: 'gear',    label: 'Gear teardowns',  share: 0.28, color: 'var(--tone-info)' },
      { id: 'story',   label: 'Story / travel',  share: 0.22, color: 'var(--tone-success)' },
      { id: 'reply',   label: 'Replies / Q&A',   share: 0.08, color: 'var(--tone-warning)' },
    ],
    voice: {
      tone: ['plainspoken', 'self-deprecating', 'precise about gear', 'avoids hype words'],
      sentenceLen: 'short to medium · avg 12 words',
      forbidden: ['game-changer', 'absolute', 'literally', 'insane', 'epic'],
    },
  };

  // ─── Posts (latest 12, used for Library + Insights) ──────
  // hookLen: seconds of opening before first cut. retention[i] = fraction
  // watching at every 5% of duration. Indexes 0..20.
  function makeRetention(start = 1.0, dropAt, dropAmt) {
    const out = [];
    let cur = start;
    for (let i = 0; i <= 20; i++) {
      // gentle decay
      cur -= 0.012 + Math.random() * 0.008;
      if (dropAt && i === dropAt) cur -= dropAmt;
      out.push(Math.max(0.18, cur));
    }
    return out;
  }
  const posts = [
    { id: '0046', title: 'Three things I check before every wreck dive',     pillar: 'safety', format: 'short', channel: 'ig', durationS: 47,  publishedAt: 'Apr 22', views: 142000, watchPct: 0.68, hookLen: 1.1, comments: 412, saves: 2840, retention: makeRetention(1.0) },
    { id: '0045', title: 'Why I trust my SPG over my dive computer',          pillar: 'gear',   format: 'short', channel: 'tt', durationS: 38,  publishedAt: 'Apr 21', views:  88200, watchPct: 0.61, hookLen: 1.4, comments: 198, saves: 1090, retention: makeRetention(0.98) },
    { id: '0044', title: 'Truk Lagoon · the Fujikawa Maru in eight breaths',  pillar: 'story',  format: 'long',  channel: 'yt', durationS: 712, publishedAt: 'Apr 19', views: 312000, watchPct: 0.54, hookLen: 2.2, comments: 1240, saves: 8900, retention: makeRetention(1.0, 3, 0.07) },
    { id: '0043', title: 'Buddy check, but make it actually useful',          pillar: 'safety', format: 'short', channel: 'ig', durationS: 52,  publishedAt: 'Apr 17', views:  61800, watchPct: 0.42, hookLen: 2.4, comments:  88, saves:  610, retention: makeRetention(0.95, 0, 0.12) },
    { id: '0042', title: 'My first wreck — and what I got wrong',             pillar: 'story',  format: 'long',  channel: 'yt', durationS: 542, publishedAt: 'Apr 14', views: 421000, watchPct: 0.71, hookLen: 0.9, comments: 1810, saves: 12400, retention: makeRetention(1.0) },
    { id: '0041', title: 'A 12-min dive-safety primer that almost worked',    pillar: 'safety', format: 'long',  channel: 'yt', durationS: 728, publishedAt: 'Apr 10', views: 138000, watchPct: 0.31, hookLen: 2.1, comments: 412, saves: 1820, retention: makeRetention(0.95, 1, 0.14) },
    { id: '0040', title: 'Reg first stage teardown · DIN vs yoke',            pillar: 'gear',   format: 'long',  channel: 'yt', durationS: 612, publishedAt: 'Apr 06', views: 96400,  watchPct: 0.58, hookLen: 1.8, comments: 304, saves: 2100, retention: makeRetention(0.97) },
    { id: '0039', title: 'Hook test · the eight-second rule',                  pillar: 'safety', format: 'short', channel: 'tt', durationS: 41,  publishedAt: 'Apr 04', views: 188000, watchPct: 0.74, hookLen: 0.8, comments: 612, saves: 4200, retention: makeRetention(1.02) },
    { id: '0038', title: 'How I clean a flooded mask without panic',           pillar: 'safety', format: 'short', channel: 'ig', durationS: 58,  publishedAt: 'Apr 02', views: 71200,  watchPct: 0.49, hookLen: 1.6, comments: 142, saves:  890, retention: makeRetention(0.96, 1, 0.06) },
    { id: '0037', title: 'Three reels from Komodo · uncut',                    pillar: 'story',  format: 'short', channel: 'ig', durationS: 62,  publishedAt: 'Mar 31', views: 84600,  watchPct: 0.55, hookLen: 1.2, comments:  88, saves:  720, retention: makeRetention(0.97) },
    { id: '0036', title: 'Q&A · should you buy a rebreather in year two?',     pillar: 'reply',  format: 'long',  channel: 'yt', durationS: 488, publishedAt: 'Mar 28', views: 52400,  watchPct: 0.62, hookLen: 1.3, comments: 218, saves:  680, retention: makeRetention(0.99) },
    { id: '0035', title: 'A reply to @marina.k on safety storytelling',        pillar: 'reply',  format: 'short', channel: 'ig', durationS: 49,  publishedAt: 'Mar 26', views: 43800,  watchPct: 0.66, hookLen: 0.9, comments: 122, saves:  340, retention: makeRetention(1.0) },
  ];

  // ─── Drafts / projects in Studio ─────────────────────────
  const drafts = [
    { id: 'd012', title: 'Fiji wreck series · ep. 1 hook',  pillar: 'story',  series: 'fiji',   stage: 'hooks',     score: 78, lastEdit: '12m', dueIn: '3d', notes: 3, charts: 2 },
    { id: 'd011', title: 'Replacement opener for 0041',     pillar: 'safety', series: 'safety', stage: 'rewrite',   score: 84, lastEdit: '1h',  dueIn: 'now', notes: 2, charts: 1 },
    { id: 'd010', title: 'Three-frame carousel from 0042',  pillar: 'story',  series: 'fiji',   stage: 'frames',    score: 71, lastEdit: '4h',  dueIn: '2d', notes: 1, charts: 0 },
    { id: 'd009', title: 'Reply ideas for @marina.k',       pillar: 'reply',  series: null,     stage: 'voice',     score: 66, lastEdit: 'yest', dueIn: '4d', notes: 4, charts: 0 },
    { id: 'd008', title: 'Reg-first-stage gear teardown 2', pillar: 'gear',   series: 'gear',   stage: 'outline',   score: 58, lastEdit: '2d',   dueIn: '1w', notes: 2, charts: 0 },
    { id: 'd007', title: 'Komodo cold-open — alt cut',      pillar: 'story',  series: null,     stage: 'frames',    score: 73, lastEdit: '3d',   dueIn: '2w', notes: 1, charts: 0 },
    { id: 'd006', title: 'Q&A · doubles vs sidemount',      pillar: 'reply',  series: null,     stage: 'outline',   score: 49, lastEdit: '4d',   dueIn: '2w', notes: 0, charts: 0 },
    { id: 'd005', title: 'Why I retired my old BCD',        pillar: 'gear',   series: 'gear',   stage: 'idea',      score: 41, lastEdit: '1w',   dueIn: '3w', notes: 0, charts: 0 },
  ];
  const STAGES = [
    { id: 'idea',     label: 'Spark',     color: 'var(--fg-tertiary)' },
    { id: 'outline',  label: 'Outline',   color: 'var(--tone-info)' },
    { id: 'hooks',    label: 'Hook',      color: 'var(--accent-primary)' },
    { id: 'voice',    label: 'Voice pass',color: 'var(--tone-warning)' },
    { id: 'frames',   label: 'Frames',    color: 'var(--tone-info)' },
    { id: 'rewrite',  label: 'Rewrite',   color: 'var(--accent-primary)' },
  ];

  // ─── Schedule (next 14 days) ─────────────────────────────
  const schedule = [
    { day: 'Thu Apr 25', slot: '09:00', channel: 'ig', draftId: 'd011', title: 'Replacement opener · 0041', state: 'queued' },
    { day: 'Thu Apr 25', slot: '17:30', channel: 'tt', draftId: 'd012', title: 'Fiji ep.1 · 8s hook',         state: 'queued' },
    { day: 'Fri Apr 26', slot: '08:00', channel: 'yt', draftId: 'd010', title: 'Carousel · 0042 → 7 frames',  state: 'needs-review' },
    { day: 'Sat Apr 27', slot: '09:00', channel: 'ig', draftId: null,  title: '— open slot —',                state: 'empty' },
    { day: 'Mon Apr 29', slot: '08:00', channel: 'yt', draftId: 'd008', title: 'Reg teardown · ep. 2',        state: 'queued' },
    { day: 'Tue Apr 30', slot: '17:30', channel: 'tt', draftId: null,  title: '— open slot —',                state: 'empty' },
    { day: 'Wed May 01', slot: '09:00', channel: 'ig', draftId: 'd009', title: 'Reply · @marina.k',            state: 'draft' },
  ];

  // ─── Inbox (comments, mentions, replies needed) ─────────
  const inbox = [
    { id: 'c2401', kind: 'comment',  on: '0044', author: '@reefkid',     ts: '2h',  body: 'The bow shot at 4:12 — that was your old Sony A7Siii right? The DR is unreal.', sentiment: 'positive', cluster: 'gear-q', priority: 'medium' },
    { id: 'c2402', kind: 'comment',  on: '0044', author: '@diveops_lt',  ts: '4h',  body: 'Worth pointing out: that wreck has been off-limits to penetration since Feb. Story is great but please add the disclaimer.', sentiment: 'concerned', cluster: 'safety-correction', priority: 'high' },
    { id: 'c2403', kind: 'mention',  on: null,   author: '@marina.k',    ts: '5h',  body: 'Asked Henry on the safety storytelling pod — his answer at 23:14 is the cleanest I\'ve heard.', sentiment: 'positive', cluster: 'creator-mention', priority: 'high' },
    { id: 'c2404', kind: 'comment',  on: '0042', author: '@nightdiver',  ts: '1d',  body: 'Where do you stash your spare mask? Couldn\'t see it on the rig.', sentiment: 'neutral', cluster: 'gear-q', priority: 'low' },
    { id: 'c2405', kind: 'comment',  on: '0042', author: '@brett',       ts: '1d',  body: 'Don\'t agree with rec divers doing wrecks at all tbh.', sentiment: 'negative', cluster: 'controversy', priority: 'medium' },
    { id: 'c2406', kind: 'comment',  on: '0041', author: '@kelpwalker',  ts: '2d',  body: 'Bailed at minute three. The pacing felt off vs your usual.', sentiment: 'negative', cluster: 'pacing', priority: 'high' },
    { id: 'c2407', kind: 'mention',  on: null,   author: '@diveops_lt',  ts: '3d',  body: 'Citing Henry\'s buddy-check format in our shop\'s new student manual. Permission?', sentiment: 'positive', cluster: 'use-permission', priority: 'high' },
  ];
  const inboxClusters = [
    { id: 'safety-correction',  label: 'Safety corrections',         count: 4,  trend: 'rising', priority: 'high' },
    { id: 'pacing',             label: 'Pacing complaints (0041)',   count: 9,  trend: 'rising', priority: 'high' },
    { id: 'gear-q',             label: 'Gear questions',             count: 22, trend: 'flat',   priority: 'medium' },
    { id: 'creator-mention',    label: 'Creator mentions',           count: 5,  trend: 'rising', priority: 'high' },
    { id: 'use-permission',     label: 'Use / cite permission',      count: 3,  trend: 'flat',   priority: 'medium' },
    { id: 'controversy',        label: 'Rec-vs-tech tension',        count: 14, trend: 'flat',   priority: 'low' },
  ];

  // ─── Trends (rising in niche) ────────────────────────────
  const trends = [
    { id: 't01', topic: 'Sidemount for travel',              acceleration: +84, mentions7d: 412, peakIn: '2-3 wks',  fit: 0.81, channel: 'all',     example: '@reefdrifter\'s "carry-on rig" reel · 1.2M' },
    { id: 't02', topic: 'Decompression myths debunked',       acceleration: +62, mentions7d: 318, peakIn: '1-2 wks',  fit: 0.94, channel: 'yt',      example: '@diveops_lt 14-min explainer · 480K' },
    { id: 't03', topic: 'Underwater color science · phones',  acceleration: +44, mentions7d: 188, peakIn: '4 wks',    fit: 0.62, channel: 'ig',      example: '@coralcam · color-correction tutorial' },
    { id: 't04', topic: 'Wreck etiquette · do-not-touch',     acceleration: +38, mentions7d: 142, peakIn: '3 wks',    fit: 0.88, channel: 'all',     example: 'Cresting in conservation circles' },
    { id: 't05', topic: 'Solo diving (debate)',                acceleration: +21, mentions7d:  96, peakIn: 'unclear',  fit: 0.71, channel: 'yt',      example: 'Long-form podcast wave' },
    { id: 't06', topic: 'Older divers returning post-COVID',   acceleration: -8,  mentions7d:  64, peakIn: 'cooling',  fit: 0.48, channel: 'ig',      example: 'Saturated · 5 creators on it' },
  ];

  // ─── Niche intelligence (peer set) ────────────────────────
  const peers = [
    { handle: '@diveops_lt',     followers: 312000, postsWk: 4, growth30: +6.8, lane: 'safety-tech',      overlap: 0.41 },
    { handle: '@marina.k',       followers: 408000, postsWk: 3, growth30: +3.1, lane: 'safety-storytelling', overlap: 0.62 },
    { handle: '@reefdrifter',    followers: 612000, postsWk: 5, growth30: +12.4, lane: 'travel-gear',       overlap: 0.18 },
    { handle: '@coralcam',       followers: 198000, postsWk: 6, growth30: +2.2, lane: 'underwater-cinema', overlap: 0.28 },
    { handle: '@reefkid',        followers:  74000, postsWk: 7, growth30: +18.2, lane: 'beginner-q',        overlap: 0.34 },
    { handle: '@nightdiver',     followers: 142000, postsWk: 2, growth30: -1.4, lane: 'safety-tech',       overlap: 0.39 },
  ];

  // ─── Inspiration board (saved external posts) ────────────
  const inspirations = [
    { id: 'i01', source: '@diveops_lt', kind: 'short', topic: 'buddy-check redesign', notes: 'Cut to checklist over 4 quick beats. The audio cue is the magic.', savedAt: '2d', tag: 'structure' },
    { id: 'i02', source: '@marina.k',    kind: 'long',  topic: 'safety storytelling',  notes: 'Opens on the failure, not the lesson. Earn the lesson.', savedAt: '5d', tag: 'opening' },
    { id: 'i03', source: '@reefdrifter', kind: 'short', topic: 'traveling-with-rig',   notes: 'Single static shot, voiceover only. No B-roll. Worked because face on camera.', savedAt: '1w', tag: 'minimal' },
    { id: 'i04', source: '@coralcam',    kind: 'long',  topic: 'color science',         notes: 'The split-screen comparison sells the whole thesis in 8s.', savedAt: '1w', tag: 'comparison' },
    { id: 'i05', source: 'NYT',          kind: 'article', topic: 'risk communication',  notes: '"Tell people what could kill them, in order of likelihood."', savedAt: '2w', tag: 'frame' },
  ];

  // ─── Studies / experiments ───────────────────────────────
  const studies = [
    { id: 's04', title: 'Hook length vs. retention at 3min',  hypothesis: 'Hooks ≤1.2s outperform >1.8s on long-form by ≥10pp', status: 'running',   n: 6, confidence: 0.74, expectedEnd: 'May 4',  effect: '+12.4pp' },
    { id: 's03', title: 'Vertical vs square crops on IG',      hypothesis: 'Vertical wins on first-watch but square wins on saves', status: 'complete',  n: 12, confidence: 0.92, expectedEnd: 'Apr 18', effect: '+18% saves on square' },
    { id: 's02', title: 'Posting at 09:00 vs 17:30',           hypothesis: '09:00 wins on safety pillar; 17:30 wins on story',     status: 'complete',  n: 16, confidence: 0.88, expectedEnd: 'Apr 12', effect: 'split confirmed' },
    { id: 's01', title: 'Disclaimer placement · pre vs post',  hypothesis: 'Pre-roll disclaimer reduces drop at min 1',            status: 'paused',    n: 4,  confidence: 0.31, expectedEnd: 'tbd',    effect: 'inconclusive' },
  ];

  // ─── Format DNA — what works in your library ─────────────
  const formats = [
    { id: 'f1', name: 'Cold-open primer',         posts: 14, avgRet: 0.66, avgSaves: 1820, lift: +0.18, signature: 'open on the failure',           length: 'short' },
    { id: 'f2', name: 'Narrated teardown',         posts: 8,  avgRet: 0.58, avgSaves: 2100, lift: +0.04, signature: 'one tool, one breath',         length: 'long' },
    { id: 'f3', name: 'On-camera Q&A',             posts: 11, avgRet: 0.62, avgSaves:  680, lift: -0.02, signature: 'face + caption · no B-roll',   length: 'short' },
    { id: 'f4', name: 'Long voiceover travel',     posts: 5,  avgRet: 0.54, avgSaves: 8900, lift: +0.11, signature: 'no on-camera Henry',           length: 'long' },
    { id: 'f5', name: 'Checklist micro-doc',        posts: 7,  avgRet: 0.71, avgSaves: 2840, lift: +0.22, signature: '3-step → 1 wide shot',         length: 'short' },
    { id: 'f6', name: 'Reply / response',          posts: 4,  avgRet: 0.59, avgSaves:  340, lift: -0.06, signature: 'quote + reply structure',      length: 'short' },
  ];

  // ─── Memory (decisions + learnings) ──────────────────────
  const memories = [
    { id: 'm12', kind: 'decision',  ts: 'Apr 22',  body: 'Switched safety primers to cold-open format. Old narrated intros lose 14% by min 1.',  source: 'Study s04 · interim',  pin: true },
    { id: 'm11', kind: 'learning',  ts: 'Apr 19',  body: 'Truk audience indexes older (35-54). They watch longer. Don\'t cut for TikTok pacing.', source: 'Audience cohort review', pin: true },
    { id: 'm10', kind: 'decision',  ts: 'Apr 14',  body: '0042 confirmed: own-failure cold-opens > observation cold-opens for save rate.',         source: 'Post 0042 retro',         pin: false },
    { id: 'm09', kind: 'learning',  ts: 'Apr 10',  body: 'On long-form, the disclaimer kills 11% if it\'s pre-content. Move it to footer.',        source: 'Comment cluster',          pin: false },
    { id: 'm08', kind: 'preference',ts: 'Apr 06',  body: 'Don\'t use the word "epic" — Henry\'s style guide treats it as forbidden.',              source: 'Brand voice',              pin: false },
    { id: 'm07', kind: 'decision',  ts: 'Mar 30',  body: 'Series cadence: 1 long YouTube every 10 days, supported by 2 IG shorts.',                source: 'Q2 plan',                  pin: false },
  ];

  // ─── Threads (for Studio sidebar) ─────────────────────────
  const threads = [
    { id: 'th1', title: 'Why dive-safety retention dropped',  snippet: 'The drop happens at 0:03 — 14% below your top quartile.', m: '12m', signal: 'charts', count: 2, age: 'today' },
    { id: 'th2', title: 'Hook lines for Fiji series',          snippet: '"You have ninety seconds underwater. Don\'t waste the first eight."', m: '1h',  signal: 'drafts', count: 3, age: 'today' },
    { id: 'th3', title: 'Reply ideas for @marina.k',           snippet: 'Three options, ranked by how often you reply with humor vs. craft.', m: '4:12p', signal: 'reply',  count: 1, age: 'yesterday' },
    { id: 'th4', title: 'Repurpose 0042 → carousel',           snippet: 'Six-frame breakdown. The hook stays; the middle gets quieter.', m: '11:08a', signal: 'drafts', count: 1, age: 'yesterday' },
    { id: 'th5', title: 'Audience deep-dive · safety lens',    snippet: 'Your safety viewers skew older and finish more often than the channel avg.', m: 'Mon', signal: 'charts', count: 4, age: 'week' },
    { id: 'th6', title: 'Wreck-dive script outline',           snippet: 'Beat sheet for a 2:30 piece, opening on the bow railing.', m: 'Sun', signal: 'drafts', count: 1, age: 'week' },
  ];

  // ─── Insights summary numbers (last 30d) ─────────────────
  const insights30d = {
    views:        2_184_000, viewsDelta: +18.2,
    watchHrs:        58_400, watchHrsDelta: +12.4,
    followers:    410_500,  followersDelta: +3.1,
    saves:           42_300, savesDelta: +28.4,
    comments:        4_180,  commentsDelta: +69.0,
    shares:          18_900, sharesDelta: +6.8,
    avgRetention:   0.587,  retentionDelta: +0.018,
    topQuartileRet: 0.71,
  };

  // ─── Posting heatmap · day×hour engagement index ─────────
  // 7 rows (Mon-Sun) × 8 hours of day (06,09,12,15,17,19,21,23)
  const heatmap = [
    [0.32, 0.84, 0.38, 0.41, 0.62, 0.74, 0.51, 0.21], // Mon
    [0.28, 0.78, 0.33, 0.39, 0.71, 0.82, 0.48, 0.19], // Tue
    [0.31, 0.86, 0.42, 0.44, 0.67, 0.78, 0.54, 0.22], // Wed
    [0.36, 0.91, 0.39, 0.42, 0.69, 0.81, 0.50, 0.24], // Thu
    [0.41, 0.74, 0.44, 0.51, 0.58, 0.62, 0.47, 0.31], // Fri
    [0.52, 0.61, 0.48, 0.54, 0.49, 0.51, 0.42, 0.34], // Sat
    [0.58, 0.64, 0.51, 0.46, 0.44, 0.47, 0.39, 0.32], // Sun
  ];
  const heatmapHours = ['06', '09', '12', '15', '17', '19', '21', '23'];
  const heatmapDays  = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // ─── Helpers ─────────────────────────────────────────────
  function fmtNum(n) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(2).replace(/\.?0+$/, '') + 'M';
    if (n >= 1_000)     return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    return String(n);
  }
  function fmtPct(p, digits = 1) { return (p * 100).toFixed(digits) + '%'; }
  function fmtDelta(d) { return (d > 0 ? '+' : '') + d.toFixed(1) + '%'; }

  return {
    creator, posts, drafts, STAGES, schedule, inbox, inboxClusters,
    trends, peers, inspirations, studies, formats, memories, threads,
    insights30d, heatmap, heatmapHours, heatmapDays,
    fmtNum, fmtPct, fmtDelta,
  };
})();
