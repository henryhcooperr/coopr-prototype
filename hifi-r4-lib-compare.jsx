/* global React, window, HfShell, R4PlatformCard, R4PillarDot, R4ChannelChip, R4Stat, r4FmtViews, r4PlatformLabel */
/* hifi-r4-lib-compare.jsx — Library round 4 · Compare.

   Job: take 2-3 posts and put them next to each other so you can see what
   actually differs. Catalog promises this with the "Compare 2-3 posts" chip.
   This is where that chip lands.

   Layout:
   - Top: three platform cards in a row, each with its score block
   - Middle: ONE retention chart with all three curves overlaid, color-coded
   - Bottom: comparison table — rows are dimensions, columns are posts,
     highest-in-row gets a small accent mark (NOT bold — too noisy)
   - Right rail: synthesis copy ("what this comparison says")

   The default selection is intentional: 0042 (long YT flagship · CScore 84),
   0039 (TT short · CScore 62), 0046 (IG reel · CScore 47). Different formats,
   different lifecycle states, all from the same creator's library — proves
   the comparison surface earns its slot.

   Color assignment for the curves and accents matches the pillar palette
   to stay coherent with R4PillarDot / R4_PILLAR_COLORS:
     0042 (story)  → tone-success (moss)
     0039 (safety) → accent-primary (clay)
     0046 (safety) → tone-info (slate)
   We override 0046 to slate so it visually separates from 0039 in the same
   pillar. */

const R4C_DATA = window.HF_DATA;
const R4C_DEFAULT_IDS = ['0042', '0039', '0046'];
const R4C_COLORS = {
  '0042': 'var(--tone-success)',
  '0039': 'var(--accent-primary)',
  '0046': 'var(--tone-info)',
};
// Per-post overrides — sub-scores are not in the data file, only in detail copy.
// Keep them here so this surface is self-contained.
const R4C_SCORES = {
  '0042': { CScore: 84, Hook: 94, Depth: 88, Save: 71, Voice: 82 },
  '0039': { CScore: 62, Hook: 92, Depth: 58, Save: 64, Voice: 88 },
  '0046': { CScore: 47, Hook: 86, Depth: 52, Save: 76, Voice: 80 },
};

// ─── Candidate strip data — 10 posts shown above the chart ────
// Pre-selected: the three R4C_DEFAULT_IDS. Toggling drives the
// selection state + bottom action bar.
const R4C_CANDIDATE_IDS = ['0046', '0044', '0042', '0041', '0040', '0039', '0038', '0037', '0045', '0043'];

function HF_R4_LibraryCompare({ state = 'happy' }) {
  // R10 · state variants — hooks first, returns after.
  const ovr = window.useSurfaceState && window.useSurfaceState('library', 'Compare');
  const s = (ovr && ovr !== 'happy') ? ovr : state;

  // B2 · multi-select state. Pre-selected = the 3 default compare IDs so
  // the surface ships in a "ready to compare" state that demonstrates
  // the selected look + sticky action bar.
  const [selectedIds, setSelectedIds] = React.useState(R4C_DEFAULT_IDS);
  // Master-state pull for pushToast — guarded so the surface still
  // mounts standalone (layout view, IA preview).
  let ms = null;
  try { ms = window.useMasterState && window.useMasterState(); } catch (_e) { ms = null; }
  const pushToast = (ms && ms.pushToast) ? ms.pushToast : function () {};

  function toggleId(id) {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 3) return prev; // hard cap at 3
      return [...prev, id];
    });
  }
  function clearSelection() { setSelectedIds([]); }

  if (s === 'loading') {
    return <HfShell workspace="library" subtab="Compare" topbarRight={<R4CTopbar />}><window.HF_SkeletonHero shape="grid" /></HfShell>;
  }
  if (s === 'empty') {
    return <HfShell workspace="library" subtab="Compare" topbarRight={<R4CTopbar />}><window.HF_EmptyHero
      eyebrow="Compare · 0 selected"
      title="Pick three posts to compare side-by-side."
      caption="Overlay watch curves and saves on one chart, with a synthesis rail on the right."
      ctaLabel="Open Library"
    /></HfShell>;
  }
  if (s === 'error') {
    return <HfShell workspace="library" subtab="Compare" topbarRight={<R4CTopbar />}><window.HF_ErrorHero
      title="Couldn't load Compare."
      body="The chart engine timed out. Retry, or pick different posts."
    /></HfShell>;
  }
  const posts = R4C_DEFAULT_IDS.map(id => R4C_DATA.posts.find(p => p.id === id)).filter(Boolean);
  const candidates = R4C_CANDIDATE_IDS.map(id => R4C_DATA.posts.find(p => p.id === id)).filter(Boolean);
  const count = selectedIds.length;
  const headerCopy =
    count === 0 ? 'Select 3 posts to compare.'
    : count === 1 ? '1 of 3 selected · pick 2 more.'
    : count === 2 ? '2 of 3 selected · pick 1 more.'
    : '3 of 3 selected · ready to compare.';
  return (
    <HfShell workspace="library" subtab="Compare" topbarRight={<R4CTopbar />}>
      <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'grid', gridTemplateColumns: '1fr 320px', overflow: 'hidden', background: 'var(--bg-base)' }}>

        {/* ── Main column ───────────────────────────────── */}
        <div style={{ overflow: 'auto', padding: '24px 32px 60px' }}>
          {/* Masthead */}
          <header style={{ paddingBottom: 18, borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Library · Compare · 3 posts</div>
            <h1 style={{ margin: '6px 0 6px', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 34, color: 'var(--fg-primary)', letterSpacing: '-0.02em', lineHeight: 1.05 }}>
              Three posts, side by side.
            </h1>
            <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--fg-secondary)', lineHeight: 1.6, maxWidth: 720 }}>
              The flagship, a top short-form, and a recent reel. Same creator, three formats. The retention curves overlay so you can see where each holds attention; the table below ranks them on every dimension that matters.
            </p>
          </header>

          {/* B2 · selection-state header band — explains the 3-pick contract */}
          <section style={{
            marginTop: 18,
            padding: '12px 14px',
            background: count === 3 ? 'var(--accent-soft)' : 'var(--surface-1)',
            border: '1px solid ' + (count === 3 ? 'var(--accent-primary)' : 'var(--border-subtle)'),
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.16em' }}>SELECTION</span>
            <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 16, color: 'var(--fg-primary)', letterSpacing: '-0.005em' }}>{headerCopy}</span>
            <span style={{ flex: 1 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.12em' }}>
              <span className="hf-num">{count}</span><span style={{ color: 'var(--border-strong)', margin: '0 5px' }}>/</span><span className="hf-num">3</span>
            </span>
          </section>

          {/* B2 · candidate strip — compact tiles, 10 posts, pre-selected = R4C_DEFAULT_IDS */}
          <section style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 8 }}>
            {candidates.map(c => {
              const checked = selectedIds.includes(c.id);
              const v = window.R4_LIB_VISUALS[c.id] || {};
              const formatLabel = { 'long-yt': 'YT', 'reel-ig': 'IG', 'short-tt': 'TT', 'carousel-ig': 'CAR' }[v.display] || 'POST';
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleId(c.id)}
                  style={{
                    position: 'relative',
                    padding: 0,
                    border: '1.4px solid ' + (checked ? 'var(--accent-primary)' : 'var(--border-subtle)'),
                    borderRadius: 5,
                    background: checked ? 'var(--accent-soft)' : 'var(--surface-1)',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    aspectRatio: '9 / 16',
                    boxShadow: checked ? '0 0 0 2px var(--accent-soft)' : 'none',
                  }}
                >
                  <window.R4ThumbBackdrop tone={v.tone}>
                    <div style={{
                      position: 'absolute', left: 0, right: 0, bottom: 0,
                      padding: '18px 6px 6px',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.58), transparent)',
                      display: 'flex', flexDirection: 'column', gap: 3,
                    }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#fff', fontWeight: 700, letterSpacing: '0.04em', textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}>{c.id}</span>
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 7.5, color: 'rgba(255,255,255,0.76)', fontWeight: 700, letterSpacing: '0.1em' }}>{formatLabel}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: '#fff', fontWeight: 700, letterSpacing: '0.02em' }}>{v.cooprScore}</span>
                      </span>
                    </div>
                  </window.R4ThumbBackdrop>
                  {/* Checkbox top-left */}
                  <span style={{
                    position: 'absolute', left: 5, top: 5,
                    width: 16, height: 16,
                    borderRadius: 3,
                    border: '1.4px solid ' + (checked ? 'var(--accent-primary)' : 'rgba(255,255,255,0.85)'),
                    background: checked ? 'var(--accent-primary)' : 'rgba(255,255,255,0.18)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {checked && (
                      <svg width="10" height="10" viewBox="0 0 12 12">
                        <path d="M2.5 6.4 L4.8 8.7 L9.5 3.8" stroke="var(--fg-on-accent)" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                </button>
              );
            })}
          </section>

          {/* Post row — 3 cards with score blocks under them */}
          <section style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignItems: 'flex-start' }}>
            {posts.map(p => (
              <R4CColumn key={p.id} post={p} accent={R4C_COLORS[p.id]} score={R4C_SCORES[p.id]} />
            ))}
          </section>

          {/* Common-attributes connection strip — what the 3 posts share */}
          <R4CCommonStrip />

          {/* Overlaid retention curves */}
          <section style={{ marginTop: 36 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 22, color: 'var(--fg-primary)', letterSpacing: '-0.015em' }}>Retention, overlaid.</h2>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.12em' }}>NORMALIZED 0–100% OF DURATION · 21 SAMPLES</span>
            </div>
            <R4COverlayCurve posts={posts} colors={R4C_COLORS} />
            <div style={{ marginTop: 12, display: 'flex', gap: 18, fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-secondary)' }}>
              {posts.map(p => (
                <span key={p.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 16, height: 2, background: R4C_COLORS[p.id], borderRadius: 999 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.06em' }}>{p.id}</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-primary)', fontWeight: 500 }}>
                    {p.title.length > 36 ? p.title.slice(0, 34) + '…' : p.title}
                  </span>
                </span>
              ))}
            </div>
          </section>

          {/* Comparison table */}
          <section style={{ marginTop: 36 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 22, color: 'var(--fg-primary)', letterSpacing: '-0.015em' }}>By the numbers.</h2>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.12em' }}>HIGHEST IN ROW · MARKED</span>
            </div>
            <R4CTable posts={posts} colors={R4C_COLORS} />
          </section>
        </div>

        {/* ── Right rail · synthesis ──────────────────── */}
        <aside style={{ borderLeft: '1px solid var(--border-subtle)', background: 'var(--surface-1)', overflow: 'auto', padding: '24px 22px 60px', display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.12em', marginBottom: 8 }}>WHAT THIS COMPARISON SAYS</div>
            <div style={{ borderTop: '2px solid var(--surface-ink)', paddingTop: 14 }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 19, color: 'var(--fg-primary)', lineHeight: 1.25, letterSpacing: '-0.012em' }}>
                The hook is not the gap. Depth is.
              </div>
              <p style={{ margin: '8px 0 0', fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--fg-secondary)', lineHeight: 1.55 }}>
                All three clear the library 3-second average. Only 0042 sustains attention because the cold-open has somewhere to go after the first quarter.
              </p>
              <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                <R4CRailMetric label="HOOK" value="90+" note="all 3" />
                <R4CRailMetric label="HOLDS" value="0042" note="long" />
                <R4CRailMetric label="STEAL" value="71" note="pred." />
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.12em', marginBottom: 8 }}>WHAT'S DIFFERENT</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <R4CObservation eyebrow="HOOK SHAPE" body="0042 is own-failure cold-open ('my reg started free-flowing'). 0039 is declaration ('the eight-second rule'). 0046 is list-of-N ('three things'). Three distinct hook patterns, three distinct retention shapes." />
              <R4CObservation eyebrow="SAVE BEHAVIOR" body="0046 has the highest save rate per view (2.0%) despite the lowest score — the checklist format earns saves. 0042 wins absolute saves (12.4K) because of volume. 0039 saves fewer than expected for its watch %." />
              <R4CObservation eyebrow="VOICE INDEX" body="0039 scores highest on voice (88) — the all-lowercase TT-native script reads as 'you'. 0042 (82) carries narrative voice well. 0046 (80) is more functional than personal." />
            </div>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.12em', marginBottom: 8 }}>WHAT TO STEAL</div>
            <div style={{ borderLeft: '3px solid var(--accent-primary)', paddingLeft: 14, fontFamily: 'var(--font-serif)', fontSize: 14, fontStyle: 'italic', color: 'var(--fg-primary)', lineHeight: 1.55 }}>
              The own-failure cold-open from 0042. Run it through the 8-second declaration shape from 0039. Land it in the list-of-N format from 0046. Predicted CScore on the recombination: 71.
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <span style={{ padding: '6px 12px', borderRadius: 999, background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', fontFamily: 'var(--font-sans)', fontSize: 11.5, fontWeight: 600 }}>+ Draft the recombination</span>
              <span style={{ padding: '6px 12px', borderRadius: 999, border: '1px solid var(--border-default)', fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--fg-secondary)' }}>Save analysis</span>
            </div>
          </div>

          {/* Footer note */}
          <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.08em', lineHeight: 1.6 }}>
            COMPARE UP TO 3 POSTS · SHIFT-CLICK FROM CATALOG · OR USE ⌘K → "COMPARE"
          </div>
        </aside>

        {/* B2 · sticky bottom action bar */}
        {window.MultiSelectActionBar && (
          <window.MultiSelectActionBar
            count={count}
            onClear={clearSelection}
            actions={[
              { label: 'Compare these ' + count, variant: 'primary', onClick: () => pushToast('Compare these ' + count) },
            ]}
          />
        )}
      </div>
    </HfShell>
  );
}

// ─── Post column (card + score block) ─────────────────────
function R4CColumn({ post, accent, score }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '14px 14px 16px', border: '1px solid var(--border-subtle)', borderRadius: 8, background: 'var(--surface-1)', borderTop: `3px solid ${accent}` }}>
      {/* Uniform 9:16 vertical thumb (R5h — was R4PlatformCard with mixed aspects) */}
      <R4CVerticalThumb post={post} />

      {/* Score row */}
      <div style={{ paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)', letterSpacing: '0.12em' }}>COOPR SCORE</span>
          <window.R4ChannelChip ch={post.channel} />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 4 }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 36, fontWeight: 500, color: accent, letterSpacing: '-0.025em', lineHeight: 1 }}>{score.CScore}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.06em' }}>/ 100</span>
        </div>
      </div>
      {/* Sub-scores compact bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {['Hook', 'Depth', 'Save', 'Voice'].map(k => (
          <div key={k} style={{ display: 'grid', gridTemplateColumns: '50px 1fr 28px', gap: 8, alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)', letterSpacing: '0.1em' }}>{k.toUpperCase()}</span>
            <div style={{ height: 3, background: 'var(--surface-2)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: `${score[k]}%`, height: '100%', background: accent, borderRadius: 999 }} />
            </div>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700, color: 'var(--fg-primary)', textAlign: 'right' }}>{score[k]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Uniform 9:16 vertical thumb (compare context) ───────
function R4CVerticalThumb({ post }) {
  const v = window.R4_LIB_VISUALS[post.id] || {};
  const display = v.display;
  const formatLabel = { 'long-yt': 'VIDEO', 'reel-ig': 'REEL', 'short-tt': 'SHORT', 'carousel-ig': 'CAROUSEL' }[display] || 'POST';
  const hookStyle =
    display === 'long-yt'   ? { fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 12, textTransform: 'none' }
    : display === 'short-tt'? { fontFamily: 'var(--font-sans)',  fontWeight: 800,     fontSize: 11.5, textTransform: 'lowercase' }
    : display === 'reel-ig' ? { fontFamily: 'var(--font-sans)',  fontWeight: 800,     fontSize: 11.5, textTransform: 'uppercase' }
    :                          { fontFamily: 'var(--font-sans)', fontWeight: 800,     fontSize: 11, textTransform: 'uppercase' };
  return (
    <div style={{
      position: 'relative', width: '100%', aspectRatio: '9 / 16',
      borderRadius: 5, overflow: 'hidden',
      background: '#111', boxShadow: '0 1px 3px rgba(15,14,12,0.10)',
    }}>
      <window.R4ThumbBackdrop tone={v.tone}>
        <div style={{
          position: 'absolute', left: 10, right: 10, top: 36,
          color: '#fff', textShadow: '0 1px 6px rgba(0,0,0,0.6)',
          lineHeight: 1.12, whiteSpace: 'pre-wrap', letterSpacing: '-0.005em',
          maxHeight: 92, overflow: 'hidden',
          ...hookStyle,
        }}>{v.hook}</div>
      </window.R4ThumbBackdrop>
      <span style={{ position: 'absolute', left: 6, top: 6, zIndex: 2, padding: '2px 7px', borderRadius: 3, background: 'var(--accent-primary)', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700 }}>{v.cooprScore}</span>
      <span style={{ position: 'absolute', right: 6, top: 6, zIndex: 2, padding: '2px 6px', borderRadius: 3, background: 'rgba(255,255,255,0.92)', color: 'var(--fg-primary)', fontFamily: 'var(--font-mono)', fontSize: 8.5, fontWeight: 700, letterSpacing: '0.06em' }}>{formatLabel}</span>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 32, background: 'linear-gradient(to top, rgba(0,0,0,0.42), transparent)', pointerEvents: 'none' }} />
      <span style={{ position: 'absolute', left: 8, bottom: 6, fontFamily: 'var(--font-sans)', fontSize: 9.5, color: 'rgba(255,255,255,0.96)', fontWeight: 600, textShadow: '0 1px 3px rgba(0,0,0,0.55)' }}>@henry.dives</span>
    </div>
  );
}

// ─── Common-attributes connection strip ──────────────────
// A horizontal bracket beneath the 3 posts that shows what they share.
// Visual idea: a thin clay line with 3 nubs (one under each column) joining
// to a center label. Says "all cold-open · all 3-sec retention >90% · etc"
function R4CCommonStrip() {
  return (
    <section style={{
      marginTop: 8,
      padding: '14px 0 8px',
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24,
      alignItems: 'center',
      position: 'relative',
    }}>
      {/* Connecting bracket — three short verticals joining a horizontal line */}
      {[0, 1, 2].map(i => (
        <div key={i} style={{ position: 'relative', height: 32, display: 'flex', justifyContent: 'center' }}>
          <span style={{ width: 1.5, height: 14, background: 'var(--accent-primary)' }} />
          <span style={{
            position: 'absolute',
            top: 14,
            left: i === 0 ? '50%' : 0,
            right: i === 2 ? '50%' : 0,
            height: 1.5,
            background: 'var(--accent-primary)',
          }} />
        </div>
      ))}
      {/* The shared-attributes label spans below */}
      <div style={{
        gridColumn: '1 / -1',
        marginTop: -14,
        textAlign: 'center',
        padding: '10px 18px',
        background: 'var(--accent-soft)',
        border: '1px solid var(--accent-primary)',
        borderRadius: 6,
        display: 'inline-flex',
        alignSelf: 'center',
        flexDirection: 'column',
        gap: 4,
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--accent-primary-press)', letterSpacing: '0.16em' }}>WHAT THESE THREE SHARE</span>
        <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14, color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>
          all cold-open · all 3-sec retention &gt; 90% · all clear library median save rate · same creator-voice index 80+
        </span>
      </div>
    </section>
  );
}

// ─── Overlaid retention curves ────────────────────────────
function R4COverlayCurve({ posts, colors }) {
  const W = 880, H = 220, Pad = 18;
  const innerW = W - Pad * 2;
  const innerH = H - Pad * 2 - 12; // 12 for x-axis labels
  return (
    <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '16px 14px 12px', background: 'var(--surface-1)' }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
        {/* gridlines */}
        {[0.25, 0.5, 0.75, 1].map((g, i) => (
          <line key={i}
            x1={Pad} x2={W - Pad}
            y1={Pad + innerH - g * innerH} y2={Pad + innerH - g * innerH}
            stroke="var(--border-subtle)" strokeWidth="1"
            strokeDasharray={i === 3 ? 'none' : '2 4'} />
        ))}
        {/* Y-axis labels */}
        {[0.25, 0.5, 0.75, 1].map(g => (
          <text key={g} x={Pad - 6} y={Pad + innerH - g * innerH + 3}
            fontFamily="var(--font-mono)" fontSize="9" fill="var(--fg-tertiary)"
            textAnchor="end" letterSpacing="0.06em">
            {Math.round(g * 100)}%
          </text>
        ))}
        {/* X-axis labels */}
        {['0%', '25%', '50%', '75%', 'end'].map((lbl, i) => (
          <text key={i} x={Pad + (i / 4) * innerW} y={H - 4}
            fontFamily="var(--font-mono)" fontSize="9" fill="var(--fg-tertiary)"
            textAnchor="middle" letterSpacing="0.06em">{lbl}</text>
        ))}
        {/* Curves */}
        {posts.map(p => {
          const data = p.retention;
          const pts = data.map((val, i) => {
            const x = Pad + (i / (data.length - 1)) * innerW;
            const y = Pad + innerH - val * innerH;
            return `${x.toFixed(1)},${y.toFixed(1)}`;
          }).join(' ');
          return (
            <g key={p.id}>
              <polyline
                points={pts}
                fill="none"
                stroke={colors[p.id]}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round" />
              {/* End-point dot */}
              <circle
                cx={Pad + innerW}
                cy={Pad + innerH - data[data.length - 1] * innerH}
                r="3.5"
                fill={colors[p.id]} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Comparison table ─────────────────────────────────────
function R4CTable({ posts, colors }) {
  // Each row: { label, get(post) -> { display, raw } }
  const rows = [
    { label: 'COOPR SCORE',  get: p => { const s = R4C_SCORES[p.id]; return { display: String(s.CScore), raw: s.CScore }; } },
    { label: 'WATCH %',      get: p => ({ display: `${(p.watchPct * 100).toFixed(0)}%`, raw: p.watchPct }) },
    { label: '3-SEC RETN',   get: p => ({ display: `${(p.retention[1] * 100).toFixed(0)}%`, raw: p.retention[1] }) },
    { label: 'VIEWS',        get: p => ({ display: r4FmtViews(p.views), raw: p.views }) },
    { label: 'SAVES',        get: p => ({ display: r4FmtViews(p.saves), raw: p.saves }) },
    { label: 'SAVE / VIEW',  get: p => ({ display: `${(p.saves / p.views * 100).toFixed(2)}%`, raw: p.saves / p.views }) },
    { label: 'COMMENTS',     get: p => ({ display: r4FmtViews(p.comments), raw: p.comments }) },
    { label: 'CMTS / VIEW',  get: p => ({ display: `${(p.comments / p.views * 100).toFixed(2)}%`, raw: p.comments / p.views }) },
    { label: 'HOOK',         get: p => { const s = R4C_SCORES[p.id]; return { display: String(s.Hook), raw: s.Hook }; } },
    { label: 'DEPTH',        get: p => { const s = R4C_SCORES[p.id]; return { display: String(s.Depth), raw: s.Depth }; } },
    { label: 'SAVE',         get: p => { const s = R4C_SCORES[p.id]; return { display: String(s.Save), raw: s.Save }; } },
    { label: 'VOICE',        get: p => { const s = R4C_SCORES[p.id]; return { display: String(s.Voice), raw: s.Voice }; } },
  ];

  return (
    <div style={{ border: '1px solid var(--border-default)', borderRadius: 8, overflow: 'hidden', background: 'var(--surface-1)' }}>
      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: '160px repeat(3, 1fr)', borderBottom: '1px solid var(--border-default)', background: 'var(--surface-2)' }}>
        <div style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.12em' }}>DIMENSION</div>
        {posts.map(p => (
          <div key={p.id} style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 8, borderLeft: '1px solid var(--border-default)' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: colors[p.id] }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-secondary)', letterSpacing: '0.08em' }}>{p.id}</span>
            <window.R4ChannelChip ch={p.channel} />
          </div>
        ))}
      </div>
      {/* Rows */}
      {rows.map((row, i) => {
        const cells = posts.map(p => row.get(p));
        const max = Math.max(...cells.map(c => c.raw));
        return (
          <div key={row.label} style={{
            display: 'grid', gridTemplateColumns: '160px repeat(3, 1fr)',
            background: i % 2 === 0 ? 'transparent' : 'var(--surface-2)',
            borderBottom: i < rows.length - 1 ? '1px solid var(--border-subtle)' : 'none',
          }}>
            <div style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.1em' }}>{row.label}</div>
            {cells.map((cell, j) => {
              const isMax = cell.raw === max && cells.filter(c => c.raw === max).length === 1;
              const post = posts[j];
              const accent = colors[post.id];
              return (
                <div key={post.id} style={{
                  padding: '12px 14px',
                  borderLeft: '1px solid var(--border-subtle)',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{
                    fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 500,
                    color: isMax ? accent : 'var(--fg-primary)',
                    letterSpacing: '-0.01em', lineHeight: 1,
                  }}>
                    {cell.display}
                  </span>
                  {isMax && (
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700,
                      color: accent, letterSpacing: '0.12em',
                      padding: '2px 6px', borderRadius: 3,
                      background: 'var(--surface-1)', border: `1px solid ${accent}`,
                    }}>BEST</span>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ─── Synthesis observation ────────────────────────────────
function R4CRailMetric({ label, value, note }) {
  return (
    <div style={{
      padding: '8px 6px',
      border: '1px solid var(--border-subtle)',
      borderRadius: 6,
      background: 'var(--surface-2)',
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      minWidth: 0,
    }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--fg-tertiary)', letterSpacing: '0.12em' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 500, color: 'var(--accent-primary)', lineHeight: 1 }}>{value}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--fg-tertiary)', letterSpacing: '0.04em' }}>{note}</span>
    </div>
  );
}

function R4CObservation({ eyebrow, body }) {
  return (
    <div style={{ paddingBottom: 10, borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)', letterSpacing: '0.14em', marginBottom: 4 }}>{eyebrow}</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--fg-secondary)', lineHeight: 1.55 }}>{body}</div>
    </div>
  );
}

function R4CTopbar() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 26, padding: '0 10px', border: '1px solid var(--border-subtle)', borderRadius: 6, background: 'var(--surface-2)', fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--fg-tertiary)' }}>
        <span style={{ width: 9, height: 9, border: '1.4px solid var(--fg-tertiary)', borderRadius: '50%' }} />
        <span>Search hooks, titles, themes…</span>
      </span>
      <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700 }}>H</span>
    </div>
  );
}

Object.assign(window, { HF_R4_LibraryCompare });
