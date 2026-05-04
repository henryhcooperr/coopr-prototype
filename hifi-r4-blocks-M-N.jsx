/* global React, window, Frame, Eyebrow, Footer, FooterChip, Icon, Stat, ProgressBar, ChannelChip, registerBlock,
   R4BDrawPath, R4BStaggerBars, R4BSweepDonut, R4BCountUp, R4BWordReveal,
   R4FSkelLine, R4FSkelBars, R4FSkelCurve, R4FSkelRows, R4FSkelTiles,
   R4FToolEmpty, R4FToolError, R4FToolLoading,
   R4BPostHitCard, R4BInlinePreviewCard, R4BMediaTransferCard,
   R4GOutcomeRail, R4GOutcomeSourceTray, R4GOutcomePackage */
/* hifi-r4-blocks-M-N.jsx - R4C capability blocks: Search and Own Content. */

// ─── M · per-tool state stubs ─────────────────────────────────────────────
function M01Loading({ onCancel }) { return <R4FToolLoading id="M01" eyebrow="UNIVERSAL SEARCH · LOADING" caption="Searching across web, social, and your library…" shape="search-hit-rows" shapeProps={{ count: 5 }} onCancel={onCancel} />; }
function M01Empty({ onAsk }) { return <R4FToolEmpty id="M01" eyebrow="UNIVERSAL SEARCH · EMPTY" body="No matches across web, social, or your library." ctas={[{ label: 'Widen window', onClick: onAsk }, { label: 'Try synonym', onClick: onAsk }]} />; }
function M01Error({ onRetry }) { return <R4FToolError id="M01" eyebrow="UNIVERSAL SEARCH · ERROR" body="Web search rate-limited — only your library searched." ctas={[{ label: 'Show library only', onClick: onRetry }]} />; }

function M02Loading({ onCancel }) { return <R4FToolLoading id="M02" eyebrow="QUERY REFINEMENT · LOADING" caption="Narrowing the fuzzy query…" shape="search-hit-rows" shapeProps={{ count: 2 }} onCancel={onCancel} />; }
function M02Empty({ onAsk }) { return <R4FToolEmpty id="M02" eyebrow="QUERY REFINEMENT · EMPTY" body="Query already narrow — no refinement needed." ctas={[{ label: 'Run as-is', onClick: onAsk }]} />; }
function M02Error({ onRetry }) { return <R4FToolError id="M02" eyebrow="QUERY REFINEMENT · ERROR" body="Refinement model unavailable." ctas={[{ label: 'Skip refinement', onClick: onRetry }]} />; }

function M03Loading({ onCancel }) { return <R4FToolLoading id="M03" eyebrow="WEB RESULT · LOADING" caption="Loading 1 web source with why-it-matters…" shape="search-hit-rows" shapeProps={{ count: 3 }} onCancel={onCancel} />; }
function M03Empty({ onAsk }) { return <R4FToolEmpty id="M03" eyebrow="WEB RESULT · EMPTY" body="Source URL returns 403." ctas={[{ label: 'Try cached version', onClick: onAsk }]} />; }
function M03Error({ onRetry }) { return <R4FToolError id="M03" eyebrow="WEB RESULT · ERROR" body="Source content paywalled." ctas={[{ label: 'Show snippet only', onClick: onRetry }]} />; }

function M04Loading({ onCancel }) { return <R4FToolLoading id="M04" eyebrow="SOURCE STACK · LOADING" caption="Stacking 12 sources by type before synthesis…" shape="search-hit-rows" shapeProps={{ count: 3 }} onCancel={onCancel} />; }
function M04Empty({ onAsk }) { return <R4FToolEmpty id="M04" eyebrow="SOURCE STACK · EMPTY" body="No sources retrieved. Loosen query or add a source manually." ctas={[{ label: 'Loosen query', onClick: onAsk }, { label: 'Add source', onClick: onAsk }]} />; }
function M04Error({ onRetry }) { return <R4FToolError id="M04" eyebrow="SOURCE STACK · ERROR" body="Some sources expired." ctas={[{ label: 'Show fresh only', onClick: onRetry }]} />; }

function M05Loading({ onCancel }) { return <R4FToolLoading id="M05" eyebrow="FACETS · LOADING" caption="Loading 12 result-shaping facets…" shape="search-hit-rows" shapeProps={{ count: 3 }} onCancel={onCancel} />; }
function M05Empty({ onAsk }) { return <R4FToolEmpty id="M05" eyebrow="FACETS · EMPTY" body="No facets available — search returned 0." ctas={[{ label: 'Clear filters', onClick: onAsk }]} />; }
function M05Error({ onRetry }) { return <R4FToolError id="M05" eyebrow="FACETS · ERROR" body="Facet count cache stale." ctas={[{ label: 'Recount', onClick: onRetry }]} />; }

function M06Loading({ onCancel }) { return <R4FToolLoading id="M06" eyebrow="CREDIBILITY · LOADING" caption="Scoring source on 3 trust axes…" shape="bars-pulse" shapeProps={{ count: 3, h: 60 }} onCancel={onCancel} />; }
function M06Empty({ onAsk }) { return <R4FToolEmpty id="M06" eyebrow="CREDIBILITY · EMPTY" body="No credibility model for this source domain." ctas={[{ label: 'Use heuristic score', onClick: onAsk }]} />; }
function M06Error({ onRetry }) { return <R4FToolError id="M06" eyebrow="CREDIBILITY · ERROR" body="Credibility lookup timed out." ctas={[{ label: 'Show without score', onClick: onRetry }]} />; }

function M07Loading({ onCancel }) { return <R4FToolLoading id="M07" eyebrow="CITATION BUNDLE · LOADING" caption="Packaging 4 sources for the claim…" shape="search-hit-rows" shapeProps={{ count: 4 }} onCancel={onCancel} />; }
function M07Empty({ onAsk }) { return <R4FToolEmpty id="M07" eyebrow="CITATION BUNDLE · EMPTY" body="No citations needed for this claim." ctas={[{ label: 'Bundle anyway', onClick: onAsk }]} />; }
function M07Error({ onRetry }) { return <R4FToolError id="M07" eyebrow="CITATION BUNDLE · ERROR" body="Some citations expired since fetch." ctas={[{ label: 'Refresh expired', onClick: onRetry }]} />; }

function M08Loading({ onCancel }) { return <R4FToolLoading id="M08" eyebrow="WATCHLIST · LOADING" caption="Loading 3 saved searches that keep watching…" shape="search-hit-rows" shapeProps={{ count: 3 }} onCancel={onCancel} />; }
function M08Empty({ onAsk }) { return <R4FToolEmpty id="M08" eyebrow="WATCHLIST · EMPTY" body="No saved searches. Save the current search to start watching." ctas={[{ label: 'Save search', icon: 'plus', onClick: onAsk }]} />; }
function M08Error({ onRetry }) { return <R4FToolError id="M08" eyebrow="WATCHLIST · ERROR" body="One watchlist entry's source disabled." ctas={[{ label: 'Disable entry', onClick: onRetry }]} />; }

// ─── N · per-tool state stubs ─────────────────────────────────────────────
function N01Loading({ onCancel }) { return <R4FToolLoading id="N01" eyebrow="SIMILAR POSTS · LOADING" caption="Searching 404 posts ranked by similarity…" shape="post-rows" shapeProps={{ count: 5 }} onCancel={onCancel} />; }
function N01Empty({ onAsk }) { return <R4FToolEmpty id="N01" eyebrow="SIMILAR POSTS · EMPTY" body="No similar posts above threshold." ctas={[{ label: 'Lower similarity threshold', onClick: onAsk }, { label: 'Search broader', onClick: onAsk }]} />; }
function N01Error({ onRetry }) { return <R4FToolError id="N01" eyebrow="SIMILAR POSTS · ERROR" body="Similarity model dropped non-English transcripts." ctas={[{ label: 'Filter to English', onClick: onRetry }]} />; }

function N02Loading({ onCancel }) { return <R4FToolLoading id="N02" eyebrow="BEST SOURCE · LOADING" caption="Picking strongest internal proof post…" shape="post-rows" shapeProps={{ count: 3 }} onCancel={onCancel} />; }
function N02Empty({ onAsk }) { return <R4FToolEmpty id="N02" eyebrow="BEST SOURCE · EMPTY" body="No strong source candidate above threshold." ctas={[{ label: 'Show top 3', onClick: onAsk }]} />; }
function N02Error({ onRetry }) { return <R4FToolError id="N02" eyebrow="BEST SOURCE · ERROR" body="Multiple candidates tied." ctas={[{ label: 'Show all tied', onClick: onRetry }]} />; }

function N03Loading({ onCancel }) { return <R4FToolLoading id="N03" eyebrow="TRANSCRIPT MOMENT · LOADING" caption="Pulling timestamp + 3-line transcript window…" shape="transcript-stream" shapeProps={{ lines: 3 }} onCancel={onCancel} />; }
function N03Empty({ onAsk }) { return <R4FToolEmpty id="N03" eyebrow="TRANSCRIPT MOMENT · EMPTY" body="Video has no transcript. Run transcript extraction first." ctas={[{ label: 'Run extraction', icon: 'plus', onClick: onAsk }]} />; }
function N03Error({ onRetry }) { return <R4FToolError id="N03" eyebrow="TRANSCRIPT MOMENT · ERROR" body="Transcript timestamp drift — moment shifted by 2s." ctas={[{ label: 'Show 4s window', onClick: onRetry }]} />; }

function N04Loading({ onCancel }) { return <R4FToolLoading id="N04" eyebrow="CLIP CANDIDATES · LOADING" caption="Detecting 5 clip candidates from source footage…" shape="tile-cascade" shapeProps={{ rows: 1, cols: 5, h: 50 }} onCancel={onCancel} />; }
function N04Empty({ onAsk }) { return <R4FToolEmpty id="N04" eyebrow="CLIP CANDIDATES · EMPTY" body="No clips meet the salience threshold." ctas={[{ label: 'Lower threshold', onClick: onAsk }, { label: 'Add a hint', onClick: onAsk }]} />; }
function N04Error({ onRetry }) { return <R4FToolError id="N04" eyebrow="CLIP CANDIDATES · ERROR" body="Clip detection found 0 hooks — usually voice-over without speaker visual." ctas={[{ label: 'Use audio-only mode', onClick: onRetry }]} />; }

function N05Loading({ onCancel }) { return <R4FToolLoading id="N05" eyebrow="ASSET MATCH · LOADING" caption="Matching 240 owned assets to the thread…" shape="tile-cascade" shapeProps={{ rows: 2, cols: 3, h: 40 }} onCancel={onCancel} />; }
function N05Empty({ onAsk }) { return <R4FToolEmpty id="N05" eyebrow="ASSET MATCH · EMPTY" body="No assets matched. Loosen match or drop new assets." ctas={[{ label: 'Loosen match', onClick: onAsk }, { label: 'Drop assets', onClick: onAsk }]} />; }
function N05Error({ onRetry }) { return <R4FToolError id="N05" eyebrow="ASSET MATCH · ERROR" body="Asset metadata stale — match accuracy reduced." ctas={[{ label: 'Re-index assets', onClick: onRetry }]} />; }

function N06Loading({ onCancel }) { return <R4FToolLoading id="N06" eyebrow="QUOTE EXTRACTION · LOADING" caption="Extracting 3 usable quotes from your content…" shape="quote-stream" shapeProps={{ lines: 3 }} onCancel={onCancel} />; }
function N06Empty({ onAsk }) { return <R4FToolEmpty id="N06" eyebrow="QUOTE EXTRACTION · EMPTY" body="No quotes pass salience threshold." ctas={[{ label: 'Lower threshold', onClick: onAsk }]} />; }
function N06Error({ onRetry }) { return <R4FToolError id="N06" eyebrow="QUOTE EXTRACTION · ERROR" body="Quote source deleted." ctas={[{ label: 'Pick another source', onClick: onRetry }]} />; }

function N07Loading({ onCancel }) { return <R4FToolLoading id="N07" eyebrow="PATTERN RETRIEVAL · LOADING" caption="Retrieving reusable structure behind prior wins…" shape="post-rows" shapeProps={{ count: 3 }} onCancel={onCancel} />; }
function N07Empty({ onAsk }) { return <R4FToolEmpty id="N07" eyebrow="PATTERN RETRIEVAL · EMPTY" body="Pattern bank empty for this niche." ctas={[{ label: 'Run auto-detect', icon: 'plus', onClick: onAsk }]} />; }
function N07Error({ onRetry }) { return <R4FToolError id="N07" eyebrow="PATTERN RETRIEVAL · ERROR" body="Pattern detection requires ≥40 posts." ctas={[{ label: 'Wait for more posts', onClick: onRetry }]} />; }

function N08Loading({ onCancel }) { return <R4FToolLoading id="N08" eyebrow="GAP MAP · LOADING" caption="Mapping 32 angles for coverage gaps…" shape="heatmap-cascade" shapeProps={{ rows: 4, cols: 8, h: 20 }} onCancel={onCancel} />; }
function N08Empty({ onAsk }) { return <R4FToolEmpty id="N08" eyebrow="GAP MAP · EMPTY" body="No gaps detected — full coverage." ctas={[{ label: 'Re-scan with stricter criteria', onClick: onAsk }]} />; }
function N08Error({ onRetry }) { return <R4FToolError id="N08" eyebrow="GAP MAP · ERROR" body="Coverage map needs niche taxonomy — none defined." ctas={[{ label: 'Define niche tags', onClick: onRetry }]} />; }


function MNBarRows({ rows = [] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {rows.map((row, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(58px, 84px) minmax(0, 1fr) minmax(34px, 44px)', gap: 8, alignItems: 'center', minWidth: 0 }}>
          <span className="mono" style={{ fontSize: 9.5, fontWeight: 800, color: row.hot ? 'var(--accent-primary)' : 'var(--fg-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase', minWidth: 0 }}>{row.label}</span>
          <ProgressBar pct={row.pct} accent={row.hot} />
          <span className="num mono" style={{ fontSize: 10, color: row.hot ? 'var(--accent-primary)' : 'var(--fg-tertiary)', textAlign: 'right', fontWeight: 700 }}>{row.value}</span>
        </div>
      ))}
    </div>
  );
}

function MNResultRow({ source = '', title, meta, score, channel }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(24px, 32px) minmax(0, 1fr) 42px', gap: 9, alignItems: 'start', padding: '8px 0', borderTop: '1px dotted var(--border-subtle)', minWidth: 0 }}>
      <span className="mono" style={{ minWidth: 0, fontSize: 8.5, fontWeight: 800, color: 'var(--fg-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{channel ? <ChannelChip channel={channel} /> : String(source).slice(0, 3)}</span>
      <div style={{ minWidth: 0 }}>
        <div className="serif-it" style={{ fontSize: 14.2, fontWeight: 600, color: 'var(--fg-primary)', lineHeight: 1.25, overflowWrap: 'anywhere' }}>{title}</div>
        <div className="mono" style={{ marginTop: 3, fontSize: 9.2, color: 'var(--fg-tertiary)', letterSpacing: '0.04em', lineHeight: 1.35, textTransform: 'uppercase', overflowWrap: 'anywhere' }}>{source} / {meta}</div>
      </div>
      <span className="num mono" style={{ fontSize: 11, fontWeight: 800, color: score >= 80 ? 'var(--accent-primary)' : 'var(--fg-secondary)', textAlign: 'right' }}>{score}</span>
    </div>
  );
}

function MNToken({ label, active = false, muted = false }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      minHeight: 22,
      padding: '0 9px',
      borderRadius: 999,
      border: active ? 0 : '1px solid var(--border-default)',
      background: active ? 'var(--accent-primary)' : muted ? 'var(--surface-2)' : 'var(--surface-1)',
      color: active ? 'var(--fg-on-accent)' : muted ? 'var(--fg-tertiary)' : 'var(--fg-secondary)',
      fontFamily: 'var(--font-mono)',
      fontSize: 9.5,
      fontWeight: 800,
      letterSpacing: '0.04em',
      maxWidth: '100%',
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    }}>{label}</span>
  );
}

function HF_R4B_M01() {
  const results = [
    { source: 'Web', title: 'Recent creator breakdowns on cold-open proof', meta: 'fresh / cites 12', score: 91 },
    { source: 'Library', title: '0042 wreck post: nearest internal proof', meta: 'watch 71%', score: 88, channel: 'YT' },
    { source: 'Social', title: 'Forum thread on first-minute safety checks', meta: '214 replies', score: 76 },
  ];
  return (
    <Frame id="M01" name="Universal search results" purpose="One ranked search across web, social, and your library." target="INTEL" span={6}
      renderLoading={(s) => <M01Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <M01Empty onAsk={() => s('loading')} />} renderError={(s) => <M01Error onRetry={() => s('loading')} />}
      entrance="cascade-down"
    >
      <div className="blk">
        <Eyebrow left="SEARCH / ALL SOURCES / COLD OPEN SAFETY" right="18 RESULTS / 3 SOURCES" />
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 78px', gap: 10, alignItems: 'center' }}>
          <div className="serif-it" style={{ fontSize: 16.5, fontWeight: 600, lineHeight: 1.24 }}>Best match pairs outside pressure with one proven library post.</div>
          <Stat label="TOP SCORE" val="91" accent />
        </div>
        <div>{results.map((r, i) => <MNResultRow key={i} {...r} />)}</div>
        <Footer openIn="Intel" extra={<FooterChip icon="pin" label="Use top result" accent />} />
      </div>
    </Frame>
  );
}

function HF_R4B_M02() {
  return (
    <Frame id="M02" name="Query refinement" purpose="Show how the agent narrows a fuzzy search." target="INTEL" span={6}
      renderLoading={(s) => <M02Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <M02Empty onAsk={() => s('loading')} />} renderError={(s) => <M02Error onRetry={() => s('loading')} />}
      entrance="fade-up"
    >
      <div className="blk">
        <Eyebrow left="QUERY PLAN / 4 PASSES" right="GOAL: FIND PROOF + ANGLE" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <MNToken label="safety" active />
          <MNToken label="first minute" active />
          <MNToken label="retention" active />
          <MNToken label="cold open" />
          <MNToken label="own proof" />
          <MNToken label="promo tips" muted />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
          {[
            ['1', 'Wide scan', '142 hits'],
            ['2', 'Creator-fit', '38 hits'],
            ['3', 'Freshness', '19 hits'],
            ['4', 'Proof only', '6 hits'],
          ].map(([n, title, meta]) => (
            <div key={n} style={{ padding: 9, background: 'var(--surface-2)', borderRadius: 6, minHeight: 58, minWidth: 0 }}>
              <div className="mono" style={{ fontSize: 9, color: 'var(--accent-primary)', fontWeight: 800 }}>{n}</div>
              <div className="serif-it" style={{ fontSize: 13.5, fontWeight: 600, marginTop: 4 }}>{title}</div>
              <div className="mono" style={{ fontSize: 9, color: 'var(--fg-tertiary)', marginTop: 4, letterSpacing: '0.06em' }}>{meta}</div>
            </div>
          ))}
        </div>
        <Footer openIn="Intel" extra={<FooterChip icon="retry" label="Run refined search" accent />} />
      </div>
    </Frame>
  );
}

function HF_R4B_M03() {
  return (
    <Frame id="M03" name="Web result card" purpose="A single web source with why it matters." target="INTEL" span={6}
      renderLoading={(s) => <M03Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <M03Empty onAsk={() => s('loading')} />} renderError={(s) => <M03Error onRetry={() => s('loading')} />}
      entrance="fade-up"
    >
      <div className="blk">
        <Eyebrow left="WEB SOURCE / FIELD GUIDE" right="UPDATED 6D AGO" />
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 76px', gap: 10 }}>
          <div>
            <div className="serif-it" style={{ fontSize: 17.5, fontWeight: 600, lineHeight: 1.2 }}>Retention teardown: land the promise before the first chart.</div>
            <p className="serif" style={{ margin: '7px 0 0', fontSize: 12.8, color: 'var(--fg-secondary)', lineHeight: 1.4 }}>Supports your proven sequence: promise, evidence, caveat.</p>
          </div>
          <div style={{ padding: 10, background: 'var(--accent-soft)', borderRadius: 6, textAlign: 'center' }}>
            <div className="num" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 30, fontWeight: 700, color: 'var(--accent-primary)' }}>86</div>
            <div className="mono" style={{ fontSize: 8.5, color: 'var(--accent-primary-press)', letterSpacing: '0.08em' }}>CREDIBLE</div>
          </div>
        </div>
        <MNBarRows rows={[
          { label: 'Fresh', pct: 78, value: '6d' },
          { label: 'Cited', pct: 64, value: '12' },
          { label: 'Fit', pct: 88, value: 'high', hot: true },
        ]} />
        <Footer openIn="Intel" extra={<FooterChip icon="plus" label="Cite source" accent />} />
      </div>
    </Frame>
  );
}

function HF_R4B_M04() {
  return (
    <Frame id="M04" name="Mixed-source stack" purpose="Source stack grouped by type before synthesis." target="INTEL" span={6}
      renderLoading={(s) => <M04Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <M04Empty onAsk={() => s('loading')} />} renderError={(s) => <M04Error onRetry={() => s('loading')} />}
      entrance="cascade-down"
    >
      <div className="blk">
        <Eyebrow left="SOURCE STACK / 9 ITEMS" right="WEB / LIBRARY / SOCIAL" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {[
            { label: 'Web', value: '3', rows: ['fresh guide', 'study note', 'brand blog'] },
            { label: 'Library', value: '4', rows: ['0042', '0039', '0031'] },
            { label: 'Social', value: '2', rows: ['forum question', 'creator clip'] },
          ].map((group, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '72px minmax(0, 1fr) 24px', gap: 8, alignItems: 'center', padding: '8px 9px', background: i === 1 ? 'var(--accent-soft)' : 'var(--surface-2)', borderRadius: 6, minWidth: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span className="mono" style={{ fontSize: 9, color: i === 1 ? 'var(--accent-primary)' : 'var(--fg-tertiary)', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{group.label}</span>
                <span className="mono" style={{ fontSize: 8.5, color: 'var(--fg-tertiary)', letterSpacing: '0.05em' }}>{group.value} items</span>
              </div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', minWidth: 0 }}>{group.rows.map(r => <MNToken key={r} label={r} muted={i !== 1} active={i === 1} />)}</div>
              <span className="num serif-it" style={{ fontSize: 20, fontWeight: 700, textAlign: 'right' }}>{group.value}</span>
            </div>
          ))}
        </div>
        <Footer openIn="Intel" extra={<FooterChip icon="check" label="Use source stack" accent />} />
      </div>
    </Frame>
  );
}

function HF_R4B_M05() {
  return (
    <Frame id="M05" name="Filters and facets" purpose="Search controls shown as result-shaping chips." target="ANYWHERE" span={6}
      renderLoading={(s) => <M05Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <M05Empty onAsk={() => s('loading')} />} renderError={(s) => <M05Error onRetry={() => s('loading')} />}
      entrance="cascade-down"
    >
      <div className="blk">
        <Eyebrow left="FILTERS / 214 TO 18" right="LIVE FACETS" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {['Fresh < 30d', 'Video first', 'Trusted', 'Transcript', 'Creator-fit', 'No promos'].map((label, i) => (
            <MNToken key={label} label={label} active={i < 4} muted={i === 5} />
          ))}
        </div>
        <MNBarRows rows={[
          { label: 'Web', pct: 38, value: '7' },
          { label: 'Library', pct: 61, value: '11', hot: true },
          { label: 'Forums', pct: 22, value: '4' },
          { label: 'Social', pct: 33, value: '6' },
        ]} />
        <Footer openIn="Anywhere" extra={<FooterChip icon="plus" label="Save filters" accent />} />
      </div>
    </Frame>
  );
}

function HF_R4B_M06() {
  return (
    <Frame id="M06" name="Credibility score" purpose="Explain why a source is trusted or demoted." target="INTEL" span={6}
      renderLoading={(s) => <M06Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <M06Empty onAsk={() => s('loading')} />} renderError={(s) => <M06Error onRetry={() => s('loading')} />}
      animateOnMount entrance="count-up-mount"
    >
      <div className="blk">
        <Eyebrow left="CREDIBILITY / SOURCE 3" right="SCORE 82 / 100" />
        <div style={{ display: 'grid', gridTemplateColumns: '82px minmax(0, 1fr)', gap: 12, alignItems: 'center', minWidth: 0 }}>
          <Stat label="SOURCE" val="82" accent />
          <MNBarRows rows={[
            { label: 'Primary', pct: 74, value: 'good', hot: true },
            { label: 'Freshness', pct: 91, value: 'new', hot: true },
            { label: 'Bias risk', pct: 24, value: 'low' },
            { label: 'Citation', pct: 58, value: 'ok' },
          ]} />
        </div>
        <Footer openIn="Intel" extra={<FooterChip icon="warning" label="Review caveats" />} />
      </div>
    </Frame>
  );
}

function HF_R4B_M07() {
  return (
    <Frame id="M07" name="Citation bundle" purpose="Sources packaged for a claim or draft." target="INTEL" span={6}
      renderLoading={(s) => <M07Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <M07Empty onAsk={() => s('loading')} />} renderError={(s) => <M07Error onRetry={() => s('loading')} />}
      entrance="cascade-down"
    >
      <div className="blk">
        <Eyebrow left="CITATION BUNDLE / CLAIM 2" right="5 SOURCES / 2 INTERNAL" />
        <div className="serif-it" style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.28 }}>Claim: first-person openers hold longer before technical detail.</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            ['1', '0042 library post', 'internal proof', 'watch 71%'],
            ['2', 'peer teardown', 'external context', 'fresh'],
            ['3', 'forum thread', 'audience language', '214 replies'],
            ['4', '0046 draft test', 'pending proof', 'forecast'],
          ].map(([n, title, type, meta]) => (
            <div key={n} style={{ display: 'grid', gridTemplateColumns: '22px minmax(0, 1fr) minmax(48px, 72px)', gap: 8, padding: '7px 0', borderTop: '1px dotted var(--border-subtle)', alignItems: 'baseline', minWidth: 0 }}>
              <span className="mono" style={{ fontSize: 9, color: 'var(--accent-primary)', fontWeight: 800 }}>{n}</span>
              <span className="serif" style={{ fontSize: 13.2, color: 'var(--fg-primary)', lineHeight: 1.25, minWidth: 0 }}>{title} <span className="mono" style={{ fontSize: 8.8, color: 'var(--fg-tertiary)', textTransform: 'uppercase' }}> / {type}</span></span>
              <span className="mono" style={{ fontSize: 8.8, color: 'var(--fg-tertiary)', textAlign: 'right', overflowWrap: 'anywhere' }}>{meta}</span>
            </div>
          ))}
        </div>
        <Footer openIn="Intel" extra={<FooterChip icon="plus" label="Attach sources" accent />} />
      </div>
    </Frame>
  );
}

function HF_R4B_M08() {
  return (
    <Frame id="M08" name="Saved search watchlist" purpose="A reusable search that keeps watching." target="INTEL" span={6}
      renderLoading={(s) => <M08Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <M08Empty onAsk={() => s('loading')} />} renderError={(s) => <M08Error onRetry={() => s('loading')} />}
      entrance="cascade-down"
    >
      <div className="blk">
        <Eyebrow left="WATCHLIST / COLD-OPEN SAFETY" right="NEXT CHECK 18:00" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <Stat label="NEW TODAY" val="7" accent />
          <Stat label="WATCHED" val="42" />
          <Stat label="ALERTS" val="3" sub="above threshold" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 10, alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: 9, minWidth: 0 }}>
          <span className="serif-it" style={{ fontSize: 13.5, color: 'var(--fg-secondary)', lineHeight: 1.38 }}>Notify when credible sources combine retention, safety, and first-minute proof.</span>
          <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end', flexWrap: 'wrap' }}><MNToken label="Daily" active /><MNToken label="Web" /></div>
        </div>
        <Footer openIn="Intel" extra={<FooterChip icon="check" label="Edit watch" accent />} />
      </div>
    </Frame>
  );
}

function HF_R4B_N01() {
  const hits = [
    { postId: '0046', variant: 'ig-reel', route: '0046', match: 91, reason: 'vertical safety opener', role: 'vertical video' },
    { postId: '0044', variant: 'youtube', route: '0044~youtube', match: 88, reason: 'horizontal proof shape', role: 'YouTube source' },
    { postId: '0045', variant: 'feed', route: '0045~feed', match: 84, reason: 'native feed framing', role: 'feed post' },
    { postId: '0042', variant: 'thread', route: '0042~thread', match: 94, reason: 'text-thread proof', role: 'text thread' },
  ];
  return (
    <Frame id="N01" name="Similar posts" purpose="Your own posts ranked by similarity to the current ask." target="LIBRARY" span={6}
      renderLoading={(s) => <N01Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <N01Empty onAsk={() => s('loading')} />} renderError={(s) => <N01Error onRetry={() => s('loading')} />}
      entrance="cascade-down"
    >
      <div className="blk">
        <Eyebrow left="OWN CONTENT / SIMILAR POSTS" right="4 SHAPES / 12 MATCHES" />
        {window.R4GOutcomeRail && <R4GOutcomeRail active="library" compact title="Own proof enters the run" right="source selection" />}
        <div className="serif-it" style={{ fontSize: 15.8, fontWeight: 600, lineHeight: 1.25, color: 'var(--fg-primary)' }}>The retrieval result keeps the post shape intact: vertical, horizontal, feed, and text-thread candidates route to real preview detail.</div>
        <div className="r4g-hit-grid">
          {hits.map(hit => <R4BPostHitCard key={hit.route} {...hit} size="gallery" />)}
        </div>
        <Footer openIn="Library" extra={<FooterChip icon="plus" label="Use context" accent />} />
      </div>
    </Frame>
  );
}

function HF_R4B_N02() {
  return (
    <Frame id="N02" name="Best source post" purpose="One internal post selected as the strongest proof." target="LIBRARY" span={6}
      renderLoading={(s) => <N02Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <N02Empty onAsk={() => s('loading')} />} renderError={(s) => <N02Error onRetry={() => s('loading')} />}
      entrance="fade-up"
    >
      <div className="blk">
        <Eyebrow left="SOURCE POST / 0042~THREAD" right="BEST INTERNAL PROOF" />
        {window.R4GOutcomeSourceTray && <R4GOutcomeSourceTray compact activeRoute="0042~thread" />}
        <R4BInlinePreviewCard
          postId="0042"
          variant="thread"
          route="0042~thread"
          title="Selected source post preview"
          note="Text-thread variant opens the existing library detail route."
        />
        {window.R4GOutcomePackage && <R4GOutcomePackage active="package" compact />}
        <div className="mono" style={{ fontSize: 9.3, color: 'var(--accent-primary)', fontWeight: 800, letterSpacing: '0.05em', lineHeight: 1.35, borderTop: '1px solid var(--border-subtle)', paddingTop: 7 }}>USE AS FIRST PROOF BEFORE THE CHART</div>
        <Footer openIn="Library" extra={<FooterChip icon="plus" label="Use post" accent />} />
      </div>
    </Frame>
  );
}

function HF_R4B_N03() {
  return (
    <Frame id="N03" name="Transcript moment" purpose="A precise timestamp lifted from a source video." target="LIBRARY" span={6}
      renderLoading={(s) => <N03Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <N03Empty onAsk={() => s('loading')} />} renderError={(s) => <N03Error onRetry={() => s('loading')} />}
      animateOnMount entrance="type-in"
    >
      <div className="blk">
        <Eyebrow left="TRANSCRIPT / 0042 / 01:14" right="HIGH-RETENTION MOMENT" />
        <div style={{ display: 'grid', gridTemplateColumns: '64px minmax(0, 1fr)', gap: 10, alignItems: 'start', minWidth: 0 }}>
          <div style={{ padding: 10, background: 'var(--surface-ink)', color: 'var(--fg-on-ink)', borderRadius: 6, textAlign: 'center' }}>
            <div className="num mono" style={{ fontSize: 16, fontWeight: 800 }}>01:14</div>
            <div className="mono" style={{ fontSize: 8.5, letterSpacing: '0.08em' }}>CLIP IN</div>
          </div>
          <p className="serif-it" style={{ margin: 0, fontSize: 15.8, lineHeight: 1.35, color: 'var(--fg-primary)', overflowWrap: 'anywhere' }}>"I was saying the checklist from memory, not touching the gear."</p>
        </div>
        <MNBarRows rows={[
          { label: 'Hold', pct: 71, value: '71%', hot: true },
          { label: 'Comments', pct: 38, value: '38' },
          { label: 'Reusable', pct: 84, value: 'high', hot: true },
        ]} />
        <Footer openIn="Library" extra={<FooterChip icon="plus" label="Quote this" accent />} />
      </div>
    </Frame>
  );
}

function HF_R4B_N04() {
  const clips = [
    {
      time: '00:08', length: '12s', label: 'Promise',
      line: 'I thought the checklist was the safety layer. It was not.',
      use: 'Use as opener', hold: 92, fit: 96,
    },
    {
      time: '01:14', length: '18s', label: 'Proof',
      line: 'The real issue was that nobody verified the source step.',
      use: 'Cut after setup', hold: 88, fit: 91,
    },
    {
      time: '03:31', length: '16s', label: 'Caveat',
      line: 'This is the caveat I would put before the recipe.',
      use: 'Keep for caption', hold: 74, fit: 82,
    },
  ];
  return (
    <Frame id="N04" name="Clip candidate strip" purpose="Candidate clips from source footage or posts." target="WORKSPACE" span={6}
      renderLoading={(s) => <N04Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <N04Empty onAsk={() => s('loading')} />} renderError={(s) => <N04Error onRetry={() => s('loading')} />}
      entrance="scan-fill"
    >
      <div className="blk">
        <Eyebrow left="CLIP CANDIDATES / SOURCE 0042" right="3 READY / BEST 00:08" />
        <R4BMediaTransferCard
          title="Pulling clip candidates from 0042"
          subtitle="source video / transcript windows / frame scan"
          state="processing"
          pct={76}
          files={[
            { name: '0042-source-video', meta: '542s / high-retention segments', pct: 100, state: 'done' },
            { name: 'transcript-window', meta: '00:08, 01:14, 03:31', pct: 82, state: 'active' },
          ]}
          stages={[
            { label: 'Pull', meta: 'source post opened', state: 'done' },
            { label: 'Detect', meta: 'salient moments', state: 'active' },
            { label: 'Score', meta: 'hook and fit', state: 'partial' },
            { label: 'Preview', meta: 'clip cards ready', state: 'pending' },
          ]}
          note="Clip rows below are not generic assets; each candidate keeps the timestamp, source line, fit score, and preview intent."
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 76px', gap: 10, alignItems: 'center', minWidth: 0 }}>
          <div className="serif-it" style={{ fontSize: 16.2, fontWeight: 600, lineHeight: 1.28, color: 'var(--fg-primary)', overflowWrap: 'anywhere' }}>Start with the missed-checklist line, then cut to the verification proof before the caveat.</div>
          <div style={{ padding: '8px 9px', borderRadius: 7, background: 'var(--accent-soft)', textAlign: 'center', minWidth: 0 }}>
            <div className="num mono" style={{ fontSize: 17, fontWeight: 900, color: 'var(--accent-primary)' }}>96</div>
            <div className="mono" style={{ marginTop: 2, fontSize: 8.2, color: 'var(--accent-primary-press)', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>fit</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {clips.map((clip, i) => (
            <div key={clip.time} style={{ display: 'grid', gridTemplateColumns: '58px minmax(0, 1fr) 76px', gap: 9, alignItems: 'center', background: i === 0 ? 'var(--accent-soft)' : 'var(--surface-2)', border: i === 0 ? '1px solid var(--accent-ring)' : '1px solid var(--border-subtle)', borderRadius: 7, padding: '8px 9px', minWidth: 0 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--accent-primary)' }}>
                  <Icon name="play" size={8} />
                  <span className="num mono" style={{ fontSize: 9.5, fontWeight: 900 }}>{clip.time}</span>
                </div>
                <div className="mono" style={{ marginTop: 3, fontSize: 8.2, color: 'var(--fg-tertiary)', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{clip.length}</div>
              </div>
              <div style={{ minWidth: 0 }}>
                <div className="serif-it" style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.15, color: 'var(--fg-primary)' }}>{clip.label}</div>
                <div className="serif" style={{ marginTop: 2, fontSize: 12.2, color: 'var(--fg-secondary)', lineHeight: 1.26, overflowWrap: 'anywhere' }}>{clip.line}</div>
                <div className="mono" style={{ marginTop: 3, fontSize: 8.2, color: i === 0 ? 'var(--accent-primary)' : 'var(--fg-tertiary)', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', overflowWrap: 'anywhere' }}>{clip.use}</div>
              </div>
              <div style={{ minWidth: 0 }}>
                <div className="num mono" style={{ fontSize: 10.5, textAlign: 'right', color: i === 0 ? 'var(--accent-primary)' : 'var(--fg-secondary)', fontWeight: 900 }}>{clip.fit}</div>
                <div style={{ marginTop: 5 }}><ProgressBar pct={clip.hold} accent={i === 0} /></div>
                <div className="mono" style={{ marginTop: 4, fontSize: 7.8, color: 'var(--fg-tertiary)', textAlign: 'right', letterSpacing: '0.04em', textTransform: 'uppercase' }}>hold {clip.hold}%</div>
              </div>
            </div>
          ))}
        </div>
        <Footer openIn="Workspace" extra={<FooterChip icon="play" label="Preview proof clip" accent />} />
      </div>
    </Frame>
  );
}

function HF_R4B_N05() {
  return (
    <Frame id="N05" name="Asset match grid" purpose="Find owned assets that match a thread or draft." target="WORKSPACE" span={6}
      renderLoading={(s) => <N05Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <N05Empty onAsk={() => s('loading')} />} renderError={(s) => <N05Error onRetry={() => s('loading')} />}
      entrance="scan-fill"
    >
      <div className="blk">
        <Eyebrow left="ASSET MATCH / PROJECT MEDIA" right="8 FILES" />
        <R4BMediaTransferCard
          title="Matching local project assets"
          subtitle="owned clips, b-roll, thumbnails"
          state="ready"
          pct={100}
          files={[
            { name: 'buddy-check-voiceover.wav', meta: 'transcribed / voice match', pct: 100, state: 'done' },
            { name: 'gauge-closeup.mov', meta: 'frame labels ready', pct: 100, state: 'done' },
          ]}
          stages={[
            { label: 'Index', meta: 'asset metadata', state: 'done' },
            { label: 'Match', meta: 'thread intent', state: 'done' },
            { label: 'Attach', meta: 'ready for package', state: 'done' },
          ]}
          note="Assets can be clicked into the workspace later; this block shows the after-state rather than a bare file list."
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {[
            ['01', 'Buddy check voiceover', 'clip', 92],
            ['02', 'Gauge close-up', 'asset', 86],
            ['03', 'Deck wide shot', 'b-roll', 81],
            ['04', 'Wreck bow frame', 'thumbnail', 73],
          ].map(([n, label, type, score], i) => (
            <div key={n} style={{ display: 'grid', gridTemplateColumns: '28px minmax(0, 1fr) 42px', gap: 8, alignItems: 'center', padding: '8px 9px', borderRadius: 6, background: i < 3 ? 'var(--accent-soft)' : 'var(--surface-2)', minWidth: 0 }}>
              <span className="mono" style={{ fontSize: 8.5, color: i < 3 ? 'var(--accent-primary)' : 'var(--fg-tertiary)', fontWeight: 800, letterSpacing: '0.05em' }}>{n}</span>
              <div style={{ minWidth: 0 }}>
                <div className="serif-it" style={{ fontSize: 13.5, color: 'var(--fg-primary)', lineHeight: 1.18, overflowWrap: 'anywhere' }}>{label}</div>
                <div className="mono" style={{ fontSize: 8.5, color: 'var(--fg-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{type}</div>
              </div>
              <span className="num mono" style={{ fontSize: 10, color: i < 3 ? 'var(--accent-primary)' : 'var(--fg-secondary)', fontWeight: 800, textAlign: 'right' }}>{score}</span>
            </div>
          ))}
        </div>
        <Footer openIn="Workspace" extra={<FooterChip icon="plus" label="Attach assets" accent />} />
      </div>
    </Frame>
  );
}

function HF_R4B_N06() {
  return (
    <Frame id="N06" name="Quote extraction" purpose="Pull usable lines from the creator's own content." target="LIBRARY" span={6}
      renderLoading={(s) => <N06Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <N06Empty onAsk={() => s('loading')} />} renderError={(s) => <N06Error onRetry={() => s('loading')} />}
      animateOnMount entrance="type-in"
    >
      <div className="blk">
        <Eyebrow left="QUOTE EXTRACT / 6 LINES" right="VOICE MATCHED" />
        {[
          ['Field note', 'I was saying the checklist. I was not doing the checklist.'],
          ['Caveat', 'This is not about fear. It is about not outsourcing attention.'],
          ['Recipe', 'Touch the thing, say the thing, then have your buddy touch it too.'],
        ].map(([kind, quote], i) => (
          <div key={kind} style={{ padding: '8px 0', borderTop: i ? '1px dotted var(--border-subtle)' : 0 }}>
            <div className="mono" style={{ fontSize: 9, color: 'var(--accent-primary)', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{kind}</div>
            <div className="serif-it" style={{ fontSize: 15.5, color: 'var(--fg-primary)', lineHeight: 1.35, marginTop: 3 }}>"{quote}"</div>
          </div>
        ))}
        <Footer openIn="Library" extra={<FooterChip icon="plus" label="Insert best line" accent />} />
      </div>
    </Frame>
  );
}

function HF_R4B_N07() {
  return (
    <Frame id="N07" name="Pattern retrieval" purpose="Retrieve the reusable structure behind prior wins." target="LIBRARY" span={6}
      renderLoading={(s) => <N07Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <N07Empty onAsk={() => s('loading')} />} renderError={(s) => <N07Error onRetry={() => s('loading')} />}
      entrance="cascade-down"
    >
      <div className="blk">
        <Eyebrow left="PATTERN RETRIEVAL / 14 POSTS" right="OWN-FAILURE FRAME" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {[
            ['Admit the miss', '0-1.2s', 92],
            ['Show the proof', '1.2-5s', 83],
            ['Give the recipe', 'after proof', 77],
          ].map(([title, time, pct]) => (
            <div key={title} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 64px', gap: 9, padding: '8px 9px', background: 'var(--surface-2)', borderRadius: 6, alignItems: 'center', minWidth: 0 }}>
              <div style={{ minWidth: 0 }}>
                <div className="serif-it" style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.15 }}>{title}</div>
                <div className="mono" style={{ marginTop: 4, fontSize: 9, color: 'var(--fg-tertiary)', letterSpacing: '0.05em' }}>{time}</div>
              </div>
              <div><ProgressBar pct={pct} accent={pct > 80} /></div>
            </div>
          ))}
        </div>
        <Footer openIn="Library" extra={<FooterChip icon="pencil" label="Apply pattern" accent />} />
      </div>
    </Frame>
  );
}

function HF_R4B_N08() {
  return (
    <Frame id="N08" name="Content gap map" purpose="Show where the user's own library does not cover an angle." target="LIBRARY" span={6}
      renderLoading={(s) => <N08Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <N08Empty onAsk={() => s('loading')} />} renderError={(s) => <N08Error onRetry={() => s('loading')} />}
      entrance="scan-fill"
    >
      <div className="blk">
        <Eyebrow left="GAP MAP / SAFETY SERIES" right="COVERAGE 68%" />
        <MNBarRows rows={[
          { label: 'Hooks', pct: 92, value: 'strong', hot: true },
          { label: 'Proof', pct: 74, value: 'ok' },
          { label: 'Gear', pct: 48, value: 'thin' },
          { label: 'Beginner', pct: 31, value: 'gap' },
          { label: 'Caveats', pct: 62, value: 'ok' },
        ]} />
        <div className="serif-it" style={{ fontSize: 13.5, color: 'var(--fg-secondary)', lineHeight: 1.38 }}>Next source to add: one beginner-facing proof clip.</div>
        <Footer openIn="Library" extra={<FooterChip icon="plus" label="Create brief" accent />} />
      </div>
    </Frame>
  );
}

const FAMILY_M_META = [
  { id: 'M01', name: 'Universal search results', purpose: 'One ranked search across web, social, and your library.', target: 'INTEL', span: 6, family: 'M', familyTitle: 'Search', component: HF_R4B_M01 },
  { id: 'M02', name: 'Query refinement', purpose: 'Show how the agent narrows a fuzzy search.', target: 'INTEL', span: 6, family: 'M', familyTitle: 'Search', component: HF_R4B_M02 },
  { id: 'M03', name: 'Web result card', purpose: 'A single web source with why it matters.', target: 'INTEL', span: 6, family: 'M', familyTitle: 'Search', component: HF_R4B_M03 },
  { id: 'M04', name: 'Mixed-source stack', purpose: 'Source stack grouped by type before synthesis.', target: 'INTEL', span: 6, family: 'M', familyTitle: 'Search', component: HF_R4B_M04 },
  { id: 'M05', name: 'Filters and facets', purpose: 'Search controls shown as result-shaping chips.', target: 'ANYWHERE', span: 6, family: 'M', familyTitle: 'Search', component: HF_R4B_M05 },
  { id: 'M06', name: 'Credibility score', purpose: 'Explain why a source is trusted or demoted.', target: 'INTEL', span: 6, family: 'M', familyTitle: 'Search', component: HF_R4B_M06 },
  { id: 'M07', name: 'Citation bundle', purpose: 'Sources packaged for a claim or draft.', target: 'INTEL', span: 6, family: 'M', familyTitle: 'Search', component: HF_R4B_M07 },
  { id: 'M08', name: 'Saved search watchlist', purpose: 'A reusable search that keeps watching.', target: 'INTEL', span: 6, family: 'M', familyTitle: 'Search', component: HF_R4B_M08 },
];

const FAMILY_N_META = [
  { id: 'N01', name: 'Similar posts', purpose: 'Your own posts ranked by similarity to the current ask.', target: 'LIBRARY', span: 6, family: 'N', familyTitle: 'Own Content', component: HF_R4B_N01 },
  { id: 'N02', name: 'Best source post', purpose: 'One internal post selected as the strongest proof.', target: 'LIBRARY', span: 6, family: 'N', familyTitle: 'Own Content', component: HF_R4B_N02 },
  { id: 'N03', name: 'Transcript moment', purpose: 'A precise timestamp lifted from a source video.', target: 'LIBRARY', span: 6, family: 'N', familyTitle: 'Own Content', component: HF_R4B_N03 },
  { id: 'N04', name: 'Clip candidate strip', purpose: 'Candidate clips from source footage or posts.', target: 'WORKSPACE', span: 6, family: 'N', familyTitle: 'Own Content', component: HF_R4B_N04 },
  { id: 'N05', name: 'Asset match grid', purpose: 'Find owned assets that match a thread or draft.', target: 'WORKSPACE', span: 6, family: 'N', familyTitle: 'Own Content', component: HF_R4B_N05 },
  { id: 'N06', name: 'Quote extraction', purpose: "Pull usable lines from the creator's own content.", target: 'LIBRARY', span: 6, family: 'N', familyTitle: 'Own Content', component: HF_R4B_N06 },
  { id: 'N07', name: 'Pattern retrieval', purpose: 'Retrieve the reusable structure behind prior wins.', target: 'LIBRARY', span: 6, family: 'N', familyTitle: 'Own Content', component: HF_R4B_N07 },
  { id: 'N08', name: 'Content gap map', purpose: "Show where the user's own library does not cover an angle.", target: 'LIBRARY', span: 6, family: 'N', familyTitle: 'Own Content', component: HF_R4B_N08 },
];

registerBlock('M01', FAMILY_M_META[0]);
registerBlock('M02', FAMILY_M_META[1]);
registerBlock('M03', FAMILY_M_META[2]);
registerBlock('M04', FAMILY_M_META[3]);
registerBlock('M05', FAMILY_M_META[4]);
registerBlock('M06', FAMILY_M_META[5]);
registerBlock('M07', FAMILY_M_META[6]);
registerBlock('M08', FAMILY_M_META[7]);
registerBlock('N01', FAMILY_N_META[0]);
registerBlock('N02', FAMILY_N_META[1]);
registerBlock('N03', FAMILY_N_META[2]);
registerBlock('N04', FAMILY_N_META[3]);
registerBlock('N05', FAMILY_N_META[4]);
registerBlock('N06', FAMILY_N_META[5]);
registerBlock('N07', FAMILY_N_META[6]);
registerBlock('N08', FAMILY_N_META[7]);

Object.assign(window, {
  HF_R4B_M01,
  HF_R4B_M02,
  HF_R4B_M03,
  HF_R4B_M04,
  HF_R4B_M05,
  HF_R4B_M06,
  HF_R4B_M07,
  HF_R4B_M08,
  HF_R4B_N01,
  HF_R4B_N02,
  HF_R4B_N03,
  HF_R4B_N04,
  HF_R4B_N05,
  HF_R4B_N06,
  HF_R4B_N07,
  HF_R4B_N08,
  FAMILY_M: { M01: HF_R4B_M01, M02: HF_R4B_M02, M03: HF_R4B_M03, M04: HF_R4B_M04, M05: HF_R4B_M05, M06: HF_R4B_M06, M07: HF_R4B_M07, M08: HF_R4B_M08 },
  FAMILY_N: { N01: HF_R4B_N01, N02: HF_R4B_N02, N03: HF_R4B_N03, N04: HF_R4B_N04, N05: HF_R4B_N05, N06: HF_R4B_N06, N07: HF_R4B_N07, N08: HF_R4B_N08 },
});
