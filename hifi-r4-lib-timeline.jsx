/* global React, window, HfShell, R4PlatformCard, R4PillarDot, R4ChannelChip, r4FmtViews */
/* hifi-r4-lib-timeline.jsx — Library round 4 · Timeline · vertical date-node.

   R5h rewrite: a real vertical timeline. Continuous spine on the left at
   ~140px from the page edge. For every date that has a post, a filled
   node sits on the spine; the date label is mono-stacked to the left of
   the spine; the media + metadata + stats branch out to the right.

   Month transitions break the spine briefly with a header band (month +
   year + month context — where you were, what you shot, what you learned).

   The previous month-row + annotation-rail layout was archaeology; this
   one is a journal you scroll. */

const R4T_DATA = window.HF_DATA;

// ─── Same-day siblings · timeline-only synthetic posts ────────────────
//
// The journal needs to read like a real publishing month: some days hold
// one post, some days hold three. The base fixture in hifi-data.js gives
// every post a unique date — fine for the catalog grid, useless for the
// "what did I ship on Apr 14" question. These extras are scoped to this
// file so the catalog/detail/series surfaces stay unaffected.
//
// Two clusters land in April 2025:
//   • Apr 14 — three posts (the flagship 0042 plus two same-day siblings)
//   • Apr 19 — two posts (the Truk long-form 0044 plus one short follow)
//
// Each entry mirrors the shape used by R4_LIB_VISUALS so R4TStackCard can
// render without branching on data origin.
const R4T_EXTRA_POSTS = [
  // ── Apr 14 cluster · the flagship + two siblings ──
  {
    id: '0042b', publishedAt: 'Apr 14',
    title: 'Bow shot at 4:12 — the rewatched moment',
    pillar: 'story', channel: 'ig',
    views: 58400, watchPct: 0.63, comments: 142, saves: 1240,
    v: {
      display: 'reel-ig', tone: 'midnight', cooprScore: 64,
      lifecycle: 'normal', velocity: '+5%/d',
      hook: 'THE MOMENT\nyou see\nthe bow',
      improve: 'Pulled from the long-form. Standalone reel held 63% — proves the teaser strategy.',
    },
  },
  {
    id: '0042c', publishedAt: 'Apr 14',
    title: 'A short reply to "but is it actually safe"',
    pillar: 'reply', channel: 'tt',
    views: 22800, watchPct: 0.58, comments: 88, saves: 210,
    v: {
      display: 'short-tt', tone: 'amber', cooprScore: 41,
      lifecycle: 'normal', velocity: '+2%/d',
      hook: 'is it\nactually\nsafe?',
      improve: 'Same-day reply to flagship comments. Caps the loop without pulling watch off the long-form.',
    },
  },
  // ── Apr 19 cluster · long-form day, plus a short ──
  {
    id: '0044b', publishedAt: 'Apr 19',
    title: 'Eight breaths · the breath you take before',
    pillar: 'safety', channel: 'ig',
    views: 41200, watchPct: 0.69, comments: 96, saves: 740,
    v: {
      display: 'reel-ig', tone: 'kelp', cooprScore: 52,
      lifecycle: 'normal', velocity: '+3%/d',
      hook: 'the breath\nbefore\nthe wreck',
      improve: 'Companion reel for the long-form. Saves at 1.8% — above safety baseline.',
    },
  },
];

// Combined view: real fixture posts + same-day siblings, kept newest-first.
function r4tComposePosts(basePosts) {
  const merged = basePosts.concat(
    R4T_EXTRA_POSTS.map(p => ({
      id: p.id, title: p.title, pillar: p.pillar, channel: p.channel,
      publishedAt: p.publishedAt, views: p.views, watchPct: p.watchPct,
      comments: p.comments, saves: p.saves,
    }))
  );
  // Sort by parsed monthKey + day, newest first. Stable on insertion order
  // when day/month tie — preserves the base ordering for the flagship and
  // its same-day siblings.
  return merged
    .map((p, idx) => ({ p, idx, key: r4tParseDate(p.publishedAt) }))
    .sort((a, b) => {
      if (a.key.monthKey !== b.key.monthKey) return a.key.monthKey < b.key.monthKey ? 1 : -1;
      const da = parseInt(a.key.day, 10);
      const db = parseInt(b.key.day, 10);
      if (da !== db) return db - da;
      return a.idx - b.idx;
    })
    .map(x => x.p);
}

// Visual map · merge real + extras so R4TStackCard reads from one source.
function r4tVisualFor(id) {
  const extra = R4T_EXTRA_POSTS.find(x => x.id === id);
  if (extra) return extra.v;
  return (window.R4_LIB_VISUALS && window.R4_LIB_VISUALS[id]) || {};
}

// Per-month context (location, notes, learned). Keyed by 'YYYY-MM'.
const R4T_MONTHS = {
  '2025-04': {
    label: 'April',
    year: 2025,
    ctx: 'Truk arrives.',
    location: 'Chuuk Lagoon → Wayanad',
    note: 'Eight-week Truk shoot wrapped. Two flagships posted. The own-failure cold-open became the format. 0042 broke 421K, the highest single post YTD.',
    learned: 'Cold-opens beat narrated intros 9 pts on 3-sec retention. Switched all safety primers.',
  },
  '2025-03': {
    label: 'March',
    year: 2025,
    ctx: 'Komodo trip · gear bench.',
    location: 'Komodo NP, ID',
    note: 'Travel month. Komodo carousel outperformed reels 2× on saves — the moment carousel earned its slot. Started the gear-teardown series.',
    learned: 'Carousel saves 2× short-form for travel. Don\'t use carousel for safety — comments drop too far.',
  },
};

// Convert "Apr 22" → { day: '22', mon: 'APR', monthKey: '2025-04' }
function r4tParseDate(publishedAt) {
  const [mon, day] = publishedAt.split(' ');
  const monKey = {
    Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
    Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
  }[mon];
  return { day: String(parseInt(day, 10)).padStart(2, '0'), mon: mon.toUpperCase(), monthKey: `2025-${monKey}` };
}

const R4T_FORMAT_LABEL = {
  'long-yt':     'VIDEO',
  'reel-ig':     'REEL',
  'short-tt':    'SHORT',
  'carousel-ig': 'CAROUSEL',
};

function HF_R4_LibraryTimeline({ state = 'happy' }) {
  // R10 · state variants — hooks first, returns after.
  const ovr = window.useSurfaceState && window.useSurfaceState('library', 'Timeline');
  const s = (ovr && ovr !== 'happy') ? ovr : state;
  if (s === 'loading') {
    return <HfShell workspace="library" subtab="Timeline" topbarRight={<R4TTopbar />}><window.HF_SkeletonHero shape="list" /></HfShell>;
  }
  if (s === 'empty') {
    return <HfShell workspace="library" subtab="Timeline" topbarRight={<R4TTopbar />}><window.HF_EmptyHero
      eyebrow="Timeline · 0 months"
      title="No history yet. The journal opens after the first month of posts."
      caption="One row per month — flagships, locations, and what we learned."
      ctaLabel="Open Library"
    /></HfShell>;
  }
  if (s === 'error') {
    return <HfShell workspace="library" subtab="Timeline" topbarRight={<R4TTopbar />}><window.HF_ErrorHero
      title="Couldn't load the timeline."
      body="The journal index timed out. Retry, or refresh the session."
    /></HfShell>;
  }
  const posts = r4tComposePosts(R4T_DATA.posts);
  // Each DATE becomes a row (1 post → simple row, 2-3 posts → stacked row).
  // Month-header rows are interleaved at month boundaries. Grouping by
  // mon+day is what gives the journal its real-month rhythm — sparse days
  // compress, busy days expand.
  const flat = [];
  let lastMonthKey = null;
  let lastDateKey = null;
  posts.forEach(p => {
    const meta = r4tParseDate(p.publishedAt);
    if (meta.monthKey !== lastMonthKey) {
      flat.push({ kind: 'month', monthKey: meta.monthKey });
      lastMonthKey = meta.monthKey;
      lastDateKey = null;
    }
    const dateKey = `${meta.monthKey}-${meta.day}`;
    if (dateKey === lastDateKey) {
      // Append to the previous date row (same day, different post).
      flat[flat.length - 1].posts.push(p);
    } else {
      flat.push({ kind: 'date', dateKey, meta, posts: [p] });
      lastDateKey = dateKey;
    }
  });

  return (
    <HfShell workspace="library" subtab="Timeline" topbarRight={<R4TTopbar />}>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', background: 'var(--bg-base)' }}>

        {/* Compact masthead */}
        <header style={{
          padding: '14px 32px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--surface-1)',
          display: 'flex', alignItems: 'center', gap: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flex: 1 }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 22, color: 'var(--fg-primary)', letterSpacing: '-0.018em', lineHeight: 1 }}>Timeline</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-tertiary)', letterSpacing: '0.06em' }}>· the journal · 412 posts · 14 months · 18.4M cum views</span>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.12em' }}>SCROLL ↓ · NEWEST FIRST</span>
        </header>

        {/* Month jump strip */}
        <nav style={{
          padding: '10px 32px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--surface-1)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.12em' }}>JUMP</span>
          {Object.entries(R4T_MONTHS).map(([k, m]) => {
            const monthCount = posts.filter(p => r4tParseDate(p.publishedAt).monthKey === k).length;
            // monthCount counts posts (not dates) — busy days inflate the
            // chip naturally so the jump-strip reflects publishing volume.
            return (
              <a key={k} href={`#month-${k}`} style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '4px 10px', borderRadius: 999,
                background: 'var(--surface-1)',
                border: '1px solid var(--border-default)',
                color: 'var(--fg-secondary)',
                fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 500,
                textDecoration: 'none', whiteSpace: 'nowrap',
              }}>
                {m.label} {m.year}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, opacity: 0.7 }}>· {monthCount}</span>
              </a>
            );
          })}
          <span style={{ flex: 1 }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.06em' }}>EARLIER · 326 POSTS NOT SHOWN</span>
        </nav>

        {/* Timeline body — spine + nodes */}
        <div style={{ position: 'relative', padding: '32px 0 80px' }}>
          {/* Continuous vertical spine. Renders behind all rows; each row has
              its own filled node circle on the spine. The month headers
              break the spine briefly via a paper-toned background slab. */}
          <div style={{
            position: 'absolute',
            left: 142, top: 0, bottom: 0,
            width: 1.5, background: 'var(--border-default)',
            zIndex: 0,
          }} />

          {flat.map((row) => {
            if (row.kind === 'month') {
              return <R4TMonthHeader key={`m-${row.monthKey}`} monthKey={row.monthKey} />;
            }
            return <R4TDateRow key={row.dateKey} posts={row.posts} meta={row.meta} />;
          })}

          {/* End cap */}
          <div style={{
            position: 'relative', zIndex: 1,
            margin: '20px 0 0 142px',
            display: 'flex', alignItems: 'center', gap: 14,
            transform: 'translateX(-7.5px)',
          }}>
            <span style={{
              display: 'inline-flex', width: 14, height: 14, borderRadius: '50%',
              border: '1.5px solid var(--border-default)', background: 'var(--bg-base)',
              flexShrink: 0,
            }} />
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)',
              letterSpacing: '0.14em', textTransform: 'uppercase',
            }}>EARLIER · 326 POSTS · LOAD MORE ↓</span>
          </div>
        </div>
      </div>
    </HfShell>
  );
}

// ─── Month header band ─────────────────────────────────────
function R4TMonthHeader({ monthKey }) {
  const m = R4T_MONTHS[monthKey];
  if (!m) return null;
  return (
    <div id={`month-${monthKey}`} style={{
      position: 'relative', zIndex: 2,
      margin: '32px 0 18px',
      padding: '28px 32px 24px',
      background: 'var(--surface-1)',
      borderTop: '1px solid var(--border-subtle)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 320px', gap: 28, alignItems: 'flex-start' }}>
        {/* Month label */}
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.14em' }}>CHAPTER</div>
          <h2 style={{
            margin: '4px 0 0',
            fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500,
            fontSize: 38, color: 'var(--fg-primary)',
            letterSpacing: '-0.022em', lineHeight: 1,
          }}>{m.label}</h2>
          <div style={{
            marginTop: 4,
            fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)',
            letterSpacing: '0.1em',
          }}>{m.year}</div>
          <div style={{
            marginTop: 10,
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontSize: 16, color: 'var(--accent-primary)',
            letterSpacing: '-0.01em',
          }}>{m.ctx}</div>
        </div>

        {/* Editorial notes */}
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)', letterSpacing: '0.14em', marginBottom: 6 }}>WHERE</div>
          <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 16, color: 'var(--fg-primary)', letterSpacing: '-0.01em', marginBottom: 14 }}>{m.location}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)', letterSpacing: '0.14em', marginBottom: 6 }}>NOTES</div>
          <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--fg-secondary)', lineHeight: 1.55 }}>{m.note}</p>
        </div>

        {/* Learning */}
        <div style={{
          padding: '14px 16px',
          borderLeft: '3px solid var(--accent-primary)',
          background: 'var(--accent-soft)',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent-primary-press)', letterSpacing: '0.14em', marginBottom: 6 }}>WHAT THE MONTH TAUGHT THE NEXT</div>
          <p style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: 13.5, color: 'var(--fg-primary)', lineHeight: 1.55, letterSpacing: '-0.005em' }}>{m.learned}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Date row · 1 post (rich) OR 2-3 posts (stacked) ───────────────────
//
// Single-post path renders a full-fat row: 160-wide vertical thumb +
// title + insight + stat strip. This is the journal's editorial voice.
//
// Stacked-day path (2-3 posts on the SAME date) replaces the single
// thumb+meta block with a vertical column of compact ~80px cards. The
// date is written ONCE in the left column; the spine sprouts a node for
// each card; a soft clay vertical line links the cards to indicate
// "same day, different posts." Whichever post in the cluster is the
// flagship still earns the FLAGSHIP eyebrow on the date column and the
// larger ringed node on the spine.
function R4TDateRow({ posts, meta }) {
  const stacked = posts.length > 1;
  // Resolve visuals up-front so we can pick the flagship-ranked entry.
  const enriched = posts.map(p => {
    const v = r4tVisualFor(p.id);
    return { p, v, isFlagship: (v.cooprScore || 0) >= 80 };
  });
  const dayHasFlagship = enriched.some(e => e.isFlagship);

  // Master-state hooks · click handlers fall back to no-op when running
  // outside the master-layout-view so the surface still demos solo.
  const ms = window.useMasterState ? window.useMasterState() : null;
  const pushToast = ms && ms.pushToast ? ms.pushToast : (() => {});
  const setActiveSurface = ms && ms.setActiveSurface ? ms.setActiveSurface : null;
  const setDetail = ms && ms.setDetail ? ms.setDetail : null;
  function openPost(id) {
    pushToast('Open post · ' + id);
    if (setActiveSurface && setDetail) {
      setActiveSurface('library', 'Catalog');
      setDetail('post', id);
    }
  }

  return (
    <article style={{
      position: 'relative', zIndex: 1,
      display: 'grid', gridTemplateColumns: '120px 44px 1fr',
      gap: 0, padding: '20px 0', alignItems: 'flex-start',
    }}>
      {/* Date column · written ONCE per date, even for stacked clusters. */}
      <div style={{ paddingRight: 18, paddingTop: 10, textAlign: 'right' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.14em' }}>{meta.mon}</div>
        <div style={{
          fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500,
          fontSize: 32, color: 'var(--fg-primary)',
          letterSpacing: '-0.025em', lineHeight: 1,
        }}>{meta.day}</div>
        {dayHasFlagship && (
          <div style={{
            marginTop: 6,
            fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700,
            color: 'var(--accent-primary)', letterSpacing: '0.12em',
          }}>FLAGSHIP</div>
        )}
        {stacked && (
          <div style={{
            marginTop: 6,
            fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600,
            color: 'var(--fg-tertiary)', letterSpacing: '0.14em',
          }}>{posts.length} POSTS</div>
        )}
      </div>

      {/* Spine column · single node for solo days, multi-node ladder for
          stacked days. The connecting line lives at the spine's center
          line, not as a card-side affordance, so it composes with the
          page-wide spine without doubling. */}
      <div style={{ position: 'relative', height: '100%', display: 'flex', justifyContent: 'center' }}>
        {!stacked && (
          <span style={{
            position: 'absolute', top: 18,
            width: enriched[0].isFlagship ? 14 : 10,
            height: enriched[0].isFlagship ? 14 : 10,
            borderRadius: '50%',
            background: enriched[0].isFlagship ? 'var(--accent-primary)' : 'var(--surface-ink)',
            border: '2px solid var(--surface-1)',
            boxShadow: enriched[0].isFlagship ? '0 0 0 3px var(--accent-soft)' : '0 0 0 3px var(--bg-base)',
          }} />
        )}
        {stacked && enriched.map((e, i) => (
          <span key={e.p.id} style={{
            position: 'absolute',
            top: 18 + i * 96,
            width: e.isFlagship ? 12 : 8,
            height: e.isFlagship ? 12 : 8,
            borderRadius: '50%',
            background: e.isFlagship ? 'var(--accent-primary)' : 'var(--surface-ink)',
            border: '2px solid var(--surface-1)',
            boxShadow: e.isFlagship ? '0 0 0 3px var(--accent-soft)' : '0 0 0 3px var(--bg-base)',
          }} />
        ))}
      </div>

      {/* Content column · single rich card OR stacked compact cards. */}
      {!stacked ? (
        <R4TSoloCard post={enriched[0].p} v={enriched[0].v} onOpen={openPost} />
      ) : (
        <R4TStackedColumn enriched={enriched} onOpen={openPost} />
      )}
    </article>
  );
}

// ─── Solo card · the original full-width journal entry ─────────────────
function R4TSoloCard({ post, v, onOpen }) {
  const display = v.display;
  const formatLabel = R4T_FORMAT_LABEL[display] || 'POST';
  const lifecycle = (v.lifecycle || 'normal').toUpperCase();
  const lifeColor = lifecycle === 'GRADUATED' ? 'var(--tone-success)'
                   : lifecycle === 'TRIAL'    ? 'var(--tone-warning)'
                   : 'var(--fg-tertiary)';

  return (
    <div
      onClick={() => onOpen(post.id)}
      style={{
        paddingLeft: 24, paddingRight: 32,
        display: 'grid', gridTemplateColumns: '160px 1fr',
        gap: 22, alignItems: 'flex-start',
        cursor: 'pointer',
      }}
    >
      <R4TMediaThumb v={v} display={display} formatLabel={formatLabel} />

      <div style={{ paddingTop: 4, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.14em' }}>
          <window.R4PillarDot pillar={post.pillar} size={7} />
          <span>{formatLabel}</span>
          <span style={{ width: 1, height: 10, background: 'var(--border-default)' }} />
          <window.R4ChannelChip ch={post.channel} />
          <span style={{ flex: 1 }} />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: lifeColor }} />
            <span style={{ color: lifeColor }}>{lifecycle}</span>
          </span>
        </div>

        <h3 style={{
          margin: 0,
          fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500,
          fontSize: 22, color: 'var(--fg-primary)',
          letterSpacing: '-0.018em', lineHeight: 1.2,
          maxWidth: 620,
        }}>
          {post.title}.
        </h3>

        {v.improve && (
          <p style={{
            margin: 0,
            fontFamily: 'var(--font-sans)', fontSize: 12.5,
            color: 'var(--fg-secondary)', lineHeight: 1.5,
            maxWidth: 580,
          }}>
            {v.improve}
          </p>
        )}

        <div style={{
          display: 'flex', gap: 24, marginTop: 4,
          paddingTop: 10, borderTop: '1px solid var(--border-subtle)',
        }}>
          <R4TStat label="COOPR" value={String(v.cooprScore ?? '—')} accent />
          <R4TStat label="VIEWS" value={r4FmtViews(post.views)} />
          <R4TStat label="WATCH" value={`${(post.watchPct * 100).toFixed(0)}%`} />
          <R4TStat label="SAVES" value={r4FmtViews(post.saves)} />
          <R4TStat label="VELO" value={v.velocity || '—'} valueColor={(v.velocity || '').startsWith('-') ? 'var(--tone-warning)' : 'var(--tone-success)'} />
        </div>
      </div>
    </div>
  );
}

// ─── Stacked column · 2-3 compact cards on a same-day cluster ──────────
function R4TStackedColumn({ enriched, onOpen }) {
  return (
    <div style={{
      position: 'relative',
      paddingLeft: 24, paddingRight: 32,
      display: 'flex', flexDirection: 'column', gap: 16,
      alignItems: 'stretch',
    }}>
      {/* Subtle clay vertical · sits behind the cards, runs left of the
          thumb column. Reads as "same day, different posts" without
          fighting the page-wide spine 44px to its left. */}
      <span style={{
        position: 'absolute',
        left: 24 + 8,
        top: 14, bottom: 14,
        width: 1.5,
        background: 'var(--accent-primary)',
        opacity: 0.18,
        pointerEvents: 'none',
      }} />
      {enriched.map((e) => (
        <R4TStackCard key={e.p.id} post={e.p} v={e.v} isFlagship={e.isFlagship} onOpen={onOpen} />
      ))}
    </div>
  );
}

// ─── Stacked card · one of N posts on a busy day ───────────────────────
function R4TStackCard({ post, v, isFlagship, onOpen }) {
  const display = v.display;
  const formatLabel = R4T_FORMAT_LABEL[display] || 'POST';
  const lifecycle = (v.lifecycle || 'normal').toUpperCase();
  const lifeColor = lifecycle === 'GRADUATED' ? 'var(--tone-success)'
                   : lifecycle === 'TRIAL'    ? 'var(--tone-warning)'
                   : 'var(--fg-tertiary)';

  return (
    <div
      onClick={() => onOpen(post.id)}
      style={{
        position: 'relative',
        display: 'grid', gridTemplateColumns: '80px 1fr auto',
        gap: 16, alignItems: 'center',
        padding: '8px 12px',
        background: 'var(--surface-1)',
        border: '1px solid var(--border-subtle)',
        borderLeft: isFlagship ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
        borderRadius: 5,
        cursor: 'pointer',
      }}
    >
      <R4TStackThumb v={v} display={display} formatLabel={formatLabel} />

      {/* Compact meta + title block */}
      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)', letterSpacing: '0.14em' }}>
          <window.R4PillarDot pillar={post.pillar} size={6} />
          <span>{formatLabel}</span>
          <span style={{ width: 1, height: 8, background: 'var(--border-default)' }} />
          <window.R4ChannelChip ch={post.channel} />
          <span style={{ width: 1, height: 8, background: 'var(--border-default)' }} />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: lifeColor }} />
            <span style={{ color: lifeColor }}>{lifecycle}</span>
          </span>
        </div>
        <h4 style={{
          margin: 0,
          fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500,
          fontSize: 14, color: 'var(--fg-primary)',
          letterSpacing: '-0.012em', lineHeight: 1.25,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {post.title}.
        </h4>
      </div>

      {/* Compact stat trio · COOPR · VIEWS · SAVES — drops WATCH/VELO so
          the row stays under 720px without truncating. */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexShrink: 0 }}>
        <R4TStat label="COOPR" value={String(v.cooprScore ?? '—')} accent />
        <R4TStat label="VIEWS" value={r4FmtViews(post.views)} />
        <R4TStat label="SAVES" value={r4FmtViews(post.saves)} />
      </div>
    </div>
  );
}

// ─── Stacked thumb · 80px wide, 9:16 ──────────────────────────────────
function R4TStackThumb({ v, display, formatLabel }) {
  if (!v) return null;
  const hookStyle =
    display === 'long-yt'   ? { fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 8, textTransform: 'none' }
    : display === 'short-tt'? { fontFamily: 'var(--font-sans)',  fontWeight: 800,     fontSize: 8, textTransform: 'lowercase', letterSpacing: '-0.01em' }
    : display === 'reel-ig' ? { fontFamily: 'var(--font-sans)',  fontWeight: 800,     fontSize: 8, textTransform: 'uppercase', letterSpacing: '-0.005em' }
    :                          { fontFamily: 'var(--font-sans)', fontWeight: 800,     fontSize: 7, textTransform: 'uppercase' };
  return (
    <div style={{
      position: 'relative',
      width: 80,
      aspectRatio: '9 / 16',
      borderRadius: 4,
      overflow: 'hidden',
      background: '#111',
      boxShadow: '0 1px 3px rgba(15,14,12,0.10)',
      flexShrink: 0,
    }}>
      <window.R4ThumbBackdrop tone={v.tone}>
        <div style={{
          position: 'absolute', left: 5, right: 5, top: 7,
          color: '#fff',
          textShadow: '0 1px 4px rgba(0,0,0,0.6)',
          lineHeight: 1.15,
          whiteSpace: 'pre-wrap',
          ...hookStyle,
        }}>
          {v.hook}
        </div>
      </window.R4ThumbBackdrop>
      <span style={{
        position: 'absolute', left: 3, top: 3,
        padding: '1px 4px', borderRadius: 2,
        background: 'var(--accent-primary)', color: '#fff',
        fontFamily: 'var(--font-mono)', fontSize: 7.5, fontWeight: 700,
      }}>{v.cooprScore}</span>
      <span style={{
        position: 'absolute', right: 3, top: 3,
        padding: '1px 3px', borderRadius: 2,
        background: 'rgba(255,255,255,0.92)', color: 'var(--fg-primary)',
        fontFamily: 'var(--font-mono)', fontSize: 6.5, fontWeight: 700,
        letterSpacing: '0.06em',
      }}>{formatLabel}</span>
    </div>
  );
}

// ─── Vertical thumb · uniform 9:16 · timeline-sized ──────
function R4TMediaThumb({ v, display, formatLabel }) {
  if (!v) return null;
  const hookStyle =
    display === 'long-yt'   ? { fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 11, textTransform: 'none' }
    : display === 'short-tt'? { fontFamily: 'var(--font-sans)',  fontWeight: 800,     fontSize: 11, textTransform: 'lowercase', letterSpacing: '-0.01em' }
    : display === 'reel-ig' ? { fontFamily: 'var(--font-sans)',  fontWeight: 800,     fontSize: 11, textTransform: 'uppercase', letterSpacing: '-0.005em' }
    :                          { fontFamily: 'var(--font-sans)', fontWeight: 800,     fontSize: 10, textTransform: 'uppercase' };

  return (
    <div style={{
      position: 'relative',
      width: 160,
      aspectRatio: '9 / 16',
      borderRadius: 5,
      overflow: 'hidden',
      background: '#111',
      boxShadow: '0 2px 6px rgba(15,14,12,0.10)',
      flexShrink: 0,
    }}>
      <window.R4ThumbBackdrop tone={v.tone}>
        <div style={{
          position: 'absolute', left: 8, right: 8, top: 12,
          color: '#fff',
          textShadow: '0 1px 6px rgba(0,0,0,0.6)',
          lineHeight: 1.15,
          whiteSpace: 'pre-wrap',
          ...hookStyle,
        }}>
          {v.hook}
        </div>
      </window.R4ThumbBackdrop>
      <span style={{
        position: 'absolute', left: 5, top: 5,
        padding: '2px 6px', borderRadius: 3,
        background: 'var(--accent-primary)', color: '#fff',
        fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700,
      }}>{v.cooprScore}</span>
      <span style={{
        position: 'absolute', right: 5, top: 5,
        padding: '2px 5px', borderRadius: 3,
        background: 'rgba(255,255,255,0.92)', color: 'var(--fg-primary)',
        fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 700,
        letterSpacing: '0.06em',
      }}>{formatLabel}</span>
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 28,
        background: 'linear-gradient(to top, rgba(0,0,0,0.42), transparent)',
        pointerEvents: 'none',
      }} />
      <span style={{
        position: 'absolute', left: 7, bottom: 5,
        fontFamily: 'var(--font-sans)', fontSize: 8.5, color: 'rgba(255,255,255,0.96)', fontWeight: 600,
        textShadow: '0 1px 3px rgba(0,0,0,0.55)',
      }}>@henry.dives</span>
    </div>
  );
}

function R4TStat({ label, value, accent = false, valueColor }) {
  const color = valueColor ? valueColor : accent ? 'var(--accent-primary)' : 'var(--fg-primary)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)', letterSpacing: '0.14em' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color, letterSpacing: '-0.01em', lineHeight: 1 }}>{value}</span>
    </div>
  );
}

function R4TTopbar() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        height: 26, padding: '0 10px',
        border: '1px solid var(--border-subtle)', borderRadius: 6,
        background: 'var(--surface-2)',
        fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--fg-tertiary)',
      }}>
        <span style={{ width: 9, height: 9, border: '1.4px solid var(--fg-tertiary)', borderRadius: '50%' }} />
        <span>Search hooks, titles, themes…</span>
      </span>
      <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700 }}>H</span>
    </div>
  );
}

Object.assign(window, { HF_R4_LibraryTimeline });
