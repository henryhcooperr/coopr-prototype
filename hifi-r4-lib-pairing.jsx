/* global React, window, HfShell, R4PlatformCard, R4PillarDot, r4FmtViews */
/* hifi-r4-lib-pairing.jsx — Library round 4 · Cross-platform Pairing.

   Job: A single idea — say, "the 8-second rule" — usually spawns multiple
   posts: a long-form on YouTube, a TikTok cut, an IG reel teaser. The
   pairing view is the surface that EXPLICITLY shows that an idea was
   expressed across N channels and how the channels compare.

   Layout: a vertical list of "ideas". Each idea is a row with three
   columns — YT · IG · TT — populated with the posts that expressed it
   (or empty slots inviting a repost). Below each row: a tiny stat block
   comparing channels and a one-line takeaway.

   This is the surface that turns 412 atomic posts into ~120 ideas, and
   makes it obvious which ideas haven't been ported yet. */

const R4X_DATA = window.HF_DATA;

// ─── Synthesized ideas — clusters of posts by theme ─────
// Each idea has slots per channel; missing slots represent un-ported
// ideas (a soft prompt to do the port).
const R4_IDEAS = [
  {
    key: 'eight-second',
    title: 'The 8-second rule',
    blurb: 'A primer on how short the average viewer\'s attention is on a vertical feed, and how to design a hook that respects it.',
    pillar: 'safety',
    state: 'fully-ported',
    yt: { id: '0041', role: 'origin · long primer', verdict: 'underperformed at length' },
    ig: { id: '0046', role: 'short cut · 47s reel', verdict: 'delta vs. parent: +47% retention, -73% length' },
    tt: { id: '0039', role: 'TT-native rebuild', verdict: 'best of three. cold-open + on-screen text only.' },
    takeaway: 'TT version vastly outperforms its parent. The 12-min primer was wrong shape — short-first would have shipped twice as fast.',
  },
  {
    key: 'truk-flagship',
    title: 'My first wreck — what I got wrong',
    blurb: 'The flagship Truk story. Originally a 9-minute YouTube; the cold-open made it shareable.',
    pillar: 'story',
    state: 'partial',
    yt: { id: '0042', role: 'origin · flagship', verdict: 'CScore 84 · 421K views' },
    ig: null,
    tt: null,
    takeaway: 'Highest-yield post in 18 months but no ports. Two 60s reels (the bow-shot scene + the free-flow cold-open) would compound. Drafts queued in Studio (d010).',
  },
  {
    key: 'din-yoke',
    title: 'DIN vs. yoke first stage',
    blurb: 'A gear teardown. Long-form is the right shape; carousel could carry the comparison frame.',
    pillar: 'gear',
    state: 'partial',
    yt: { id: '0040', role: 'origin · long-form teardown', verdict: 'solid retention; 7:20 is most-rewatched' },
    ig: null,
    tt: { id: '0045', role: 'spinoff · "why I trust my SPG"', verdict: 'thematic kin, different argument' },
    takeaway: 'Carousel of the comparison frame would likely outperform the YT teardown\'s save rate by 3×. Not yet drafted.',
  },
  {
    key: 'mask-flooded',
    title: 'Clearing a flooded mask, calmly',
    blurb: 'A safety primer. Currently ig-only. Likely a TT cold-open (start with the moment of panic).',
    pillar: 'safety',
    state: 'partial',
    yt: null,
    ig: { id: '0038', role: 'origin · 58s reel', verdict: 'save rate below median' },
    tt: null,
    takeaway: 'Reframe as cold-open ("the moment my mask flooded at 22m") and re-cut for TT. The original wasn\'t bad — the package was.',
  },
  {
    key: 'komodo',
    title: 'Komodo, three reels',
    blurb: 'Travel content. Carousel was the surprise format winner of March.',
    pillar: 'story',
    state: 'partial',
    yt: null,
    ig: { id: '0037', role: 'origin · carousel · 6 frames', verdict: 'saves 2× short-form average' },
    tt: null,
    takeaway: 'Carousel format earned its slot. A 3-min YT travelogue cut from B-roll exists in Studio (d007).',
  },
  {
    key: 'wreck-checklist',
    title: 'Three things before every wreck',
    blurb: 'A pre-dive checklist primer. The reel cut works, but this is fundamentally a long-form argument.',
    pillar: 'safety',
    state: 'partial',
    yt: null,
    ig: { id: '0046', role: 'origin · 47s reel', verdict: '142K views · 68% retention · saves above median' },
    tt: null,
    takeaway: 'The reel performs but compresses too much. Long-form would let the third item (gas matching) breathe — currently 8 seconds in the reel, 90+ seconds it deserves on YT.',
  },
  {
    key: 'rebreather-yr-two',
    title: 'Should you buy a rebreather in year two?',
    blurb: 'The rebreather Q&A. Long-form Q&A is the right shape for the argument; reel cuts read as click-bait.',
    pillar: 'reply',
    state: 'single',
    yt: { id: '0036', role: 'origin · long Q&A', verdict: 'thoughtful audience · 62% retention on 8-min' },
    ig: null,
    tt: null,
    takeaway: 'Don\'t port. The format requires room. A reel teaser (d014, drafted) would feed the YT, not replace it.',
  },
  {
    key: 'reply-marina',
    title: 'Reply to @marina.k on safety storytelling',
    blurb: 'Replies are a low-volume opportunity. Marina\'s audience overlaps 62% — a long-form follow-up would compound.',
    pillar: 'reply',
    state: 'single',
    yt: null,
    ig: { id: '0035', role: 'origin · 49s reel', verdict: '43.8K views · 66% retention · low save rate' },
    tt: null,
    takeaway: 'Highest-overlap collaborator we haven\'t formally engaged. A 6-min YT response — "what Marina got right, what I would add" — would borrow her audience structurally, not just point at it.',
  },
  {
    key: 'flooded-mask',
    title: 'Clearing a flooded mask, calmly',
    blurb: 'A safety primer. The IG reel exists; both YT and TT slots are open and the same source clip can feed both.',
    pillar: 'safety',
    state: 'partial',
    yt: null,
    ig: { id: '0038', role: 'origin · 58s reel · how-to caption', verdict: 'save rate below median; format may be wrong' },
    tt: null,
    takeaway: 'The how-to caption underweights this content. Reframe both ports as cold-open: "the moment my mask flooded at 22m." Same footage, two cuts.',
  },
];

const R4_CH_META = {
  yt: { name: 'YouTube',   short: 'YT', color: '#FF0033' },
  ig: { name: 'Instagram', short: 'IG', color: '#0a0a0a' },
  tt: { name: 'TikTok',    short: 'TT', color: '#0a0a0a' },
};

// ─── Per-row winner derivation ────────────────────────────
// Returns { ch, lift, vs, savesDeltaPct } or null when fewer than 2 channels.
function r4xPickWinner(idea, posts) {
  const filled = ['yt','ig','tt']
    .map(ch => idea[ch] ? { ch, post: posts.find(p => p.id === idea[ch].id) } : null)
    .filter(Boolean)
    .filter(x => x.post);
  if (filled.length < 2) return null;
  // winner = highest watchPct (retention is the truer "won" signal than raw views,
  // because each channel has different reach budgets)
  filled.sort((a, b) => b.post.watchPct - a.post.watchPct);
  const w = filled[0], runnerUp = filled[1];
  const lift = w.post.watchPct / runnerUp.post.watchPct;
  // Saves delta vs runner-up — second axis the takeaway uses
  const savesDeltaPct = runnerUp.post.saves > 0
    ? Math.round(((w.post.saves - runnerUp.post.saves) / runnerUp.post.saves) * 100)
    : 0;
  return { ch: w.ch, lift, vs: runnerUp.ch, savesDeltaPct };
}

function HF_R4_LibraryPairing({ state = 'happy' }) {
  // R10 · state variants — hooks first, returns after.
  const ovr = window.useSurfaceState && window.useSurfaceState('library', 'Pairings');
  const s = (ovr && ovr !== 'happy') ? ovr : state;
  if (s === 'loading') {
    return <HfShell workspace="library" subtab="Pairings" topbarRight={<R4XTopbar />}><window.HF_SkeletonHero shape="grid" /></HfShell>;
  }
  if (s === 'empty') {
    return <HfShell workspace="library" subtab="Pairings" topbarRight={<R4XTopbar />}><window.HF_EmptyHero
      eyebrow="Pairings · 0 ideas"
      title="No cross-channel ideas yet. Pairings form once you ship the same idea twice."
      caption="Same idea, three channels — see what ports cleanly between YouTube, IG, and TikTok."
      ctaLabel="Open Library"
    /></HfShell>;
  }
  if (s === 'error') {
    return <HfShell workspace="library" subtab="Pairings" topbarRight={<R4XTopbar />}><window.HF_ErrorHero
      title="Couldn't load the pairings."
      body="The cross-channel index timed out. Retry, or come back in a minute."
    /></HfShell>;
  }
  return (
    <HfShell workspace="library" subtab="Pairings" topbarRight={<R4XTopbar />}>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', background: 'var(--bg-base)' }}>
        {/* Masthead */}
        <header style={{ padding: '18px 32px 14px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-1)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Library · Pairing · 412 posts → 124 ideas</div>
              <h1 style={{ margin: '4px 0 4px', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 28, color: 'var(--fg-primary)', letterSpacing: '-0.02em', lineHeight: 1.05 }}>One idea, three channels.</h1>
              <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-secondary)', lineHeight: 1.5, maxWidth: 720 }}>
                Each row is an <em>idea</em>. The three lines are where it lives — sparkline shows retention, bar shows views, accent marks the row winner.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 22, flexShrink: 0 }}>
              <R4XStat label="IDEAS" value="124" sub="from 412 posts" />
              <R4XStat label="FULLY PORTED" value="38" sub="all 3 channels" />
              <R4XStat label="UN-PORTED ASKS" value="62" sub="opportunity" accent />
            </div>
          </div>
          {/* Coverage — three thin truth-bars, mono-labeled, no rainbow */}
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {[
              { label: '3 OF 3', count: 38, pct: 31, tone: 'var(--fg-primary)' },
              { label: '2 OF 3', count: 24, pct: 19, tone: 'var(--fg-secondary)' },
              { label: '1 OF 3', count: 62, pct: 50, tone: 'var(--fg-tertiary)' },
            ].map(r => (
              <div key={r.label} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 60px 60px', gap: 10, alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.12em' }}>{r.label}</span>
                <div style={{ height: 4, background: 'var(--surface-2)', borderRadius: 1, overflow: 'hidden' }}>
                  <div style={{ width: `${r.pct}%`, height: '100%', background: r.tone }} />
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, color: 'var(--fg-primary)', textAlign: 'right' }}>{r.count}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', textAlign: 'right' }}>{r.pct}%</span>
              </div>
            ))}
          </div>
        </header>

        {/* Column headers + inline chart legend */}
        <div style={{ padding: '14px 32px 6px', display: 'grid', gridTemplateColumns: '300px 1fr 240px', gap: 24, alignItems: 'baseline' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.12em' }}>IDEA</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.12em' }}>CHANNELS · YT · IG · TT</span>
            <span style={{ display: 'flex', gap: 16, fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)', letterSpacing: '0.06em' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <svg width="22" height="8" viewBox="0 0 22 8"><polyline points="0,6 5,3 10,4 15,2 22,1" fill="none" stroke="var(--fg-secondary)" strokeWidth="1.2" /></svg>
                RETENTION
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 22, height: 4, background: 'var(--fg-secondary)', borderRadius: 1, display: 'inline-block' }} />
                VIEWS · NORMALIZED PER ROW
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent-primary)', display: 'inline-block' }} />
                WINNER
              </span>
            </span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.12em' }}>TAKEAWAY</div>
        </div>

        {/* Idea rows */}
        <div style={{ padding: '8px 32px 60px' }}>
          {R4_IDEAS.map((idea, i) => (
            <R4XIdeaRow key={idea.key} idea={idea} odd={i % 2 === 1} />
          ))}
          <div style={{ marginTop: 18, padding: '12px 14px', border: '1px dashed var(--border-default)', borderRadius: 6, fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-tertiary)', textAlign: 'center' }}>
            + 119 more ideas · click any cell to expand or to draft a port
          </div>
        </div>
      </div>
    </HfShell>
  );
}

function R4XIdeaRow({ idea, odd }) {
  const posts = R4X_DATA.posts;
  const winner = r4xPickWinner(idea, posts);
  // Normalize the per-row view-magnitude bar against the row's max — every bar
  // in the row is comparable, but bars across rows are not. That's intentional:
  // the chart's job here is "which of these three won by how much", not "absolute scale".
  const filledViews = ['yt','ig','tt']
    .map(ch => idea[ch] ? (posts.find(p => p.id === idea[ch].id) || {}).views || 0 : 0);
  const maxViews = Math.max(...filledViews, 1);

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '300px 1fr 240px',
      gap: 24, alignItems: 'center',
      padding: '12px 0 10px',
      borderTop: '1px solid var(--border-subtle)',
    }}>
      {/* Title block — compact, leaves vertical room for 6-8 pairings on screen */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingRight: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <window.R4PillarDot pillar={idea.pillar} size={7} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)', letterSpacing: '0.12em' }}>IDEA · {idea.key.toUpperCase()}</span>
        </div>
        <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 18, color: 'var(--fg-primary)', letterSpacing: '-0.015em', lineHeight: 1.18 }}>{idea.title}</h3>
        <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-secondary)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{idea.blurb}</p>
        <div style={{ marginTop: 2, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <R4XCoverageChip state={idea.state} count={[idea.yt, idea.ig, idea.tt].filter(Boolean).length} />
          {winner && <R4XWinnerPill winner={winner} />}
        </div>
      </div>

      {/* Channel chart-stack — three horizontal lines, one per channel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {['yt', 'ig', 'tt'].map(ch => (
          <R4XChannelLine
            key={ch}
            ch={ch}
            slot={idea[ch]}
            isWinner={winner ? winner.ch === ch : false}
            maxViews={maxViews}
          />
        ))}
      </div>

      {/* Takeaway */}
      <aside style={{ paddingLeft: 12, borderLeft: '2px solid var(--surface-ink)', alignSelf: 'stretch' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)', letterSpacing: '0.14em', marginBottom: 4 }}>TAKEAWAY</div>
        <p style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: 12, color: 'var(--fg-primary)', lineHeight: 1.45, letterSpacing: '-0.005em', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{idea.takeaway}</p>
      </aside>
    </div>
  );
}

// One horizontal line per channel — the actual "chart" of this surface.
// Filled: [chip] [role text] [sparkline] [retention%] [view bar] [views] [saves]
// Empty:  [chip] NOT PORTED · format-aware suggestion · [+ Draft port pill]
function R4XChannelLine({ ch, slot, isWinner = false, maxViews = 1 }) {
  if (!slot) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: '32px 1fr auto',
        gap: 10,
        alignItems: 'center',
        height: 28,
        padding: '0 8px 0 0',
        borderRadius: 4,
        background: 'transparent',
        opacity: 0.78,
      }}>
        <window.R4ChannelChip ch={ch} />
        <span style={{
          fontFamily: 'var(--font-serif)', fontStyle: 'italic',
          fontSize: 12, color: 'var(--fg-tertiary)', lineHeight: 1.3,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontStyle: 'normal', fontSize: 9, letterSpacing: '0.12em', color: 'var(--fg-tertiary)', marginRight: 8 }}>NOT PORTED</span>
          {ch === 'yt' && 'long-form has space for the full argument · 6–9 min'}
          {ch === 'ig' && 'a 50–60s vertical reel or a 5-frame carousel'}
          {ch === 'tt' && 'cold-open the moment of failure · ≤45s'}
        </span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '3px 9px',
          borderRadius: 4,
          background: 'var(--accent-primary)', color: 'var(--fg-on-accent)',
          fontFamily: 'var(--font-sans)', fontSize: 10.5, fontWeight: 600,
          cursor: 'pointer',
          letterSpacing: '0.01em',
        }}>
          + Draft port
        </span>
      </div>
    );
  }
  const post = R4X_DATA.posts.find(p => p.id === slot.id);
  if (!post) return <div style={{ height: 28 }} />;
  const viewPct = Math.max(0.04, post.views / maxViews);
  const retentionColor = isWinner ? 'var(--accent-primary)' : 'var(--fg-secondary)';
  const cooprScore = (window.R4_LIB_VISUALS[post.id] || {}).cooprScore;
  return (
    <div style={{
      display: 'grid',
      // [chip 32] [role-text 1fr] [retention spark + % 130] [view bar 110] [stat strip 110]
      gridTemplateColumns: '32px minmax(0, 1fr) 130px 110px 110px',
      gap: 10,
      alignItems: 'center',
      height: 28,
      padding: '0 8px 0 6px',
      borderRadius: 4,
      background: isWinner ? 'var(--surface-1)' : 'transparent',
      border: isWinner ? '1px solid rgba(182,83,43,0.22)' : '1px solid transparent',
    }}>
      {/* channel chip */}
      <window.R4ChannelChip ch={ch} />

      {/* role text — italic serif, the narrative inside this line */}
      <span style={{
        fontFamily: 'var(--font-serif)', fontStyle: 'italic',
        fontSize: 12, color: 'var(--fg-primary)', lineHeight: 1.3,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {slot.role}
      </span>

      {/* retention sparkline + percent — the SHAPE chart */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, height: 18, position: 'relative' }}>
          <window.R4RetentionSpark data={post.retention} w={88} h={18} accent={isWinner} />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 1, background: 'var(--border-subtle)' }} />
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: retentionColor, minWidth: 30, textAlign: 'right' }}>
          {Math.round(post.watchPct * 100)}%
        </span>
      </div>

      {/* view-magnitude bar — the SCALE chart, normalized within this idea row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, height: 5, background: 'var(--surface-2)', borderRadius: 1, overflow: 'hidden' }}>
          <div style={{
            width: `${Math.round(viewPct * 100)}%`,
            height: '100%',
            background: isWinner ? 'var(--accent-primary)' : 'var(--fg-secondary)',
          }} />
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--fg-primary)', minWidth: 36, textAlign: 'right' }}>
          {window.r4FmtViews(post.views)}
        </span>
      </div>

      {/* stat strip — saves + score, mono tabular */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, fontFamily: 'var(--font-mono)', fontSize: 10.5 }}>
        <span style={{ color: 'var(--fg-tertiary)' }}>
          <span style={{ marginRight: 3, fontSize: 9, letterSpacing: '0.06em' }}>SV</span>
          <span style={{ color: 'var(--fg-primary)', fontWeight: 700 }}>{window.r4FmtViews(post.saves)}</span>
        </span>
        <span style={{ color: 'var(--fg-tertiary)' }}>
          <span style={{ marginRight: 3, fontSize: 9, letterSpacing: '0.06em' }}>CS</span>
          <span style={{ color: isWinner ? 'var(--accent-primary)' : 'var(--fg-primary)', fontWeight: 700 }}>{cooprScore || '—'}</span>
        </span>
      </div>
    </div>
  );
}

// Winner pill — title-block companion. Tiny, mono diff number, channel chip.
function R4XWinnerPill({ winner }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 8px 3px 4px',
      borderRadius: 999,
      background: 'var(--surface-2)',
      border: '1px solid var(--border-subtle)',
      fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
      color: 'var(--fg-primary)', letterSpacing: '0.04em',
    }}>
      <window.R4ChannelChip ch={winner.ch} />
      <span style={{ color: 'var(--fg-tertiary)', fontWeight: 500 }}>WINS</span>
      <span style={{ color: 'var(--accent-primary)' }}>{winner.lift.toFixed(2)}×</span>
    </span>
  );
}

function R4XCoverageChip({ state, count }) {
  const map = {
    'fully-ported': { label: '3-of-3', tone: 'var(--tone-success)' },
    'partial':       { label: `${count}-of-3`, tone: 'var(--accent-primary)' },
    'single':        { label: '1-of-3', tone: 'var(--tone-warning)' },
  };
  const m = map[state] || map.partial;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px',
      borderRadius: 999,
      background: 'var(--surface-2)',
      border: '1px solid var(--border-subtle)',
      fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
      color: m.tone, letterSpacing: '0.08em',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: m.tone }} />
      {m.label.toUpperCase()}
    </span>
  );
}

function R4XStat({ label, value, sub, accent = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 88 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)', letterSpacing: '0.12em' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 500, color: accent ? 'var(--accent-primary)' : 'var(--fg-primary)', letterSpacing: '-0.015em', lineHeight: 1 }}>{value}</span>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10.5, color: 'var(--fg-tertiary)' }}>{sub}</span>
    </div>
  );
}

function R4XTopbar() {
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

Object.assign(window, { HF_R4_LibraryPairing });
