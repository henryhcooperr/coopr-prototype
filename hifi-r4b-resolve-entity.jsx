/* global React, window, document */
/* hifi-r4b-resolve-entity.jsx — r4b-resolve-entity disambiguation block.
   Master/detail picker for ambiguous entity lookups. Phase 2 stateful. */

(function () {
  if (!window.registerBlock) return;

  // ─── Fixture data ─────────────────────────────────────────────
  const RESOLVE_FIXTURE = {
    query: 'chilis creations',
    candidates: [
      {
        handle: 'chilis.creations',
        name: 'Chili — handmade ceramics + apparel',
        niche: 'brand · ceramics + apparel',
        bio: 'small-batch ceramics + hand-dyed sweaters. portland → brooklyn. drop dates in stories. shipping monthly.',
        followers: '8.4k',
        followersN: 8400,
        reels: 120,
        engagement: '4.1%',
        lastPost: '7d',
        confidence: 0.82,
        why: 'Niche match: ceramics + apparel maker · audience overlap with your Saturday Studio thread · 3 of last 10 hooks resemble your "behind the work" pillar.',
        thumbs: [
          { tone: 'amber',   hook: 'first batch out of the kiln', views: '142K' },
          { tone: 'sunset',  hook: 'sweater in 14 colours',       views: '89K' },
          { tone: 'plum',    hook: 'restock thursday 9am',        views: '61K' },
          { tone: 'kelp',    hook: 'behind the studio',           views: '38K' },
          { tone: 'steel',   hook: 'glaze tests',                 views: '24K' },
          { tone: 'navy',    hook: 'why I dropped wholesale',     views: '19K' },
        ],
      },
      {
        handle: 'chiliscreations',
        name: 'Personal · craft + DIY journal',
        niche: 'personal · craft + DIY',
        bio: 'craft journal. tuesdays in the studio. process posts.',
        followers: '1.1k',
        followersN: 1100,
        reels: 34,
        engagement: '1.8%',
        lastPost: '21d',
        confidence: 0.61,
        why: null,
        thumbs: [
          { tone: 'steel',     hook: 'tuesday studio', views: '2.1K' },
          { tone: 'navy',      hook: 'scrap projects', views: '1.4K' },
          { tone: 'deep-blue', hook: '',               views: '980' },
          { tone: 'midnight',  hook: '',               views: '760' },
          { tone: 'kelp',      hook: '',               views: '540' },
          { tone: 'cyan',      hook: '',               views: '410' },
        ],
      },
      {
        handle: 'chilis_creates',
        name: 'Personal · vegetarian recipes',
        niche: 'personal · vegetarian recipes',
        bio: 'recipes from a small kitchen. vegetarian. weekly drops.',
        followers: '3.2k',
        followersN: 3200,
        reels: 78,
        engagement: '3.4%',
        lastPost: '4d',
        confidence: 0.54,
        why: null,
        thumbs: [
          { tone: 'green',  hook: 'five-min pesto',  views: '14K' },
          { tone: 'amber',  hook: 'a tomato confit', views: '22K' },
          { tone: 'sunset', hook: 'midnight eggs',   views: '9.2K' },
          { tone: 'kelp',   hook: '',                views: '6.1K' },
          { tone: 'plum',   hook: '',                views: '4.8K' },
          { tone: 'teal',   hook: '',                views: '3.9K' },
        ],
      },
      {
        handle: 'createdbychili',
        name: 'Lifestyle · low activity (last post 4mo)',
        niche: 'lifestyle · low activity',
        bio: 'lifestyle posts. occasionally.',
        followers: '540',
        followersN: 540,
        reels: 9,
        engagement: '0.6%',
        lastPost: '4mo',
        confidence: 0.31,
        why: null,
        thumbs: [{ tone: 'plum' }, { tone: 'electric' }, { tone: 'teal' }, { tone: 'cyan' }, { tone: 'midnight' }, { tone: 'navy' }],
      },
      {
        handle: 'chili.kreations',
        name: 'Brand · pet accessories (Brazil)',
        niche: 'brand · pet accessories',
        bio: 'acessórios para pets. envios para todo o brasil.',
        followers: '2.1k',
        followersN: 2100,
        reels: 56,
        engagement: '2.2%',
        lastPost: '12d',
        confidence: 0.28,
        why: null,
        thumbs: [{ tone: 'sunset' }, { tone: 'amber' }, { tone: 'plum' }, { tone: 'kelp' }, { tone: 'green' }, { tone: 'teal' }],
      },
    ],
  };

  const TONES = {
    'deep-blue': 'linear-gradient(140deg,#1c2840 0%,#1a2233 50%,#14182a 100%)',
    'teal':      'linear-gradient(140deg,#1f3a3a 0%,#1a3030 50%,#142426 100%)',
    'kelp':      'linear-gradient(140deg,#2a3d2a 0%,#1f3022 50%,#16231a 100%)',
    'cyan':      'linear-gradient(140deg,#1a3a48 0%,#163040 50%,#11242e 100%)',
    'midnight':  'linear-gradient(140deg,#1a1c2a 0%,#14161e 50%,#0d0e15 100%)',
    'navy':      'linear-gradient(140deg,#1d2a48 0%,#15203a 50%,#0e162a 100%)',
    'steel':     'linear-gradient(140deg,#2a323d 0%,#232932 50%,#181c22 100%)',
    'electric':  'linear-gradient(140deg,#2a2440 0%,#221d34 50%,#161226 100%)',
    'green':     'linear-gradient(140deg,#2a3622 0%,#21291c 50%,#161c12 100%)',
    'sunset':    'linear-gradient(140deg,#4a2a26 0%,#3a221e 50%,#281612 100%)',
    'plum':      'linear-gradient(140deg,#3a223c 0%,#2c1a30 50%,#1d1020 100%)',
    'amber':     'linear-gradient(140deg,#4a3826 0%,#382a1d 50%,#261c12 100%)',
  };

  // ─── Top-level component ──────────────────────────────────────
  function HF_R4B_RESOLVE_ENTITY(props) {
    const fixture = (props && props.fixture) || RESOLVE_FIXTURE;
    const [stage, setStage] = React.useState('awaiting'); // awaiting | resolved | input | found | not-found
    const [activeIdx, setActiveIdx] = React.useState(0);
    const [chosen, setChosen] = React.useState(null);
    const [typedHandle, setTypedHandle] = React.useState('');

    return (
      <div className="r4b-resolve-entity" data-stage={stage}>
        {stage === 'awaiting' && (
          <ResolveAwaiting
            fixture={fixture}
            activeIdx={activeIdx}
            setActiveIdx={setActiveIdx}
            onPick={(c) => { setChosen(c); setStage('resolved'); }}
            onNoneOfThese={() => setStage('input')}
          />
        )}
        {stage === 'resolved' && (
          <ResolveStrip chosen={chosen} onChange={() => setStage('awaiting')} />
        )}
        {stage === 'input' && (
          <ResolveInput
            value={typedHandle}
            setValue={setTypedHandle}
            onBack={() => setStage('awaiting')}
            onSubmit={(handle) => setStage(handle === 'not.found' ? 'not-found' : 'found')}
          />
        )}
        {stage === 'found' && (
          <ResolveFoundConfirm
            handle={typedHandle}
            onConfirm={(h) => {
              setChosen({ handle: h, name: 'New account', followers: '—' });
              setStage('resolved');
            }}
            onWrong={() => setStage('input')}
          />
        )}
        {stage === 'not-found' && (
          <ResolveNotFound
            handle={typedHandle}
            onTryAgain={() => setStage('input')}
            onBack={() => setStage('awaiting')}
          />
        )}
      </div>
    );
  }

  // ─── Awaiting stage · master/detail picker ────────────────────
  function ResolveAwaiting({ fixture, activeIdx, setActiveIdx, onPick, onNoneOfThese }) {
    const above = fixture.candidates.filter((c) => c.confidence >= 0.5).length;
    const total = fixture.candidates.length;
    const top = fixture.candidates[0];
    return (
      <div className="blk-frame">
        <div className="blk-tag">
          <span className="blk-id">RES-02</span>
          <span className="blk-name">Did you mean <em style={{ color: 'var(--accent-primary)' }}>@{top.handle}</em>?</span>
          <span className="blk-tag-side"><span className="blk-target">→ Library</span></span>
        </div>
        <span className="blk-purpose">No exact match for "{fixture.query}." {total} candidates by handle + niche similarity to your library.</span>
        <div className="blk">
          <div className="blk-eyebrow"><span className="l" style={{ color: 'var(--tone-warning)' }}>RES-02 · AWAITING YOU</span><span className="r">{total} candidates · {above} above threshold</span></div>
          <div className="r4b-resolve-grid">
            <div className="r4b-resolve-list" role="list">
              {fixture.candidates.map((c, i) => (
                <button
                  key={c.handle}
                  type="button"
                  role="listitem"
                  className={`r4b-resolve-row${i === activeIdx ? ' active' : ''}`}
                  onClick={() => setActiveIdx(i)}
                  onDoubleClick={() => onPick(c)}
                >
                  <span className="r4b-resolve-av">{c.handle.slice(0, 2).toUpperCase()}</span>
                  <span className="r4b-resolve-row-who">
                    <span className="r4b-resolve-handle">@{c.handle}</span>
                    <span className="r4b-resolve-row-sub">{c.name}</span>
                  </span>
                  <span className="r4b-resolve-followers">{c.followers}</span>
                </button>
              ))}
            </div>
            <ResolvePreview
              candidate={fixture.candidates[activeIdx]}
              onConfirm={(c) => onPick(c)}
              onDismiss={() => setActiveIdx((activeIdx + 1) % fixture.candidates.length)}
            />
          </div>
          <div className="blk-footer">
            <button type="button" className="blk-chip muted" onClick={onNoneOfThese}>None of these · enter handle</button>
            <button type="button" className="blk-chip muted">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Profile preview pane (right column of awaiting state) ────
  function ResolvePreview({ candidate, onConfirm, onDismiss }) {
    if (!candidate) return null;
    const top = candidate.confidence >= 0.7;
    return (
      <div className="r4b-resolve-detail">
        <div className="r4b-resolve-detail-head">
          <div className="r4b-resolve-av-lg">{candidate.handle.slice(0, 2).toUpperCase()}</div>
          <div style={{ minWidth: 0 }}>
            <div className="r4b-resolve-handle-lg">@{candidate.handle}</div>
            <div className="r4b-resolve-name">{candidate.name}</div>
          </div>
          {top && <span className="r4b-resolve-conf">top match · {candidate.confidence.toFixed(2)}</span>}
        </div>
        <p className="r4b-resolve-bio">{candidate.bio}</p>
        <div className="r4b-resolve-stats">
          <Stat k={candidate.followers} label="followers" />
          <Stat k={candidate.reels}     label="reels" />
          <Stat k={candidate.engagement} label="avg engagement" />
          <Stat k={candidate.lastPost}   label="last post" />
        </div>
        <div className="r4b-resolve-reels">
          {candidate.thumbs.map((t, i) => (
            <span key={i} className="r4b-resolve-reel" style={{ background: TONES[t.tone] || TONES['deep-blue'] }}>
              {t.views && <span className="r4b-resolve-reel-views">{t.views}</span>}
              {t.hook  && <span className="r4b-resolve-reel-hook">{t.hook}</span>}
            </span>
          ))}
        </div>
        {candidate.why && <div className="r4b-resolve-why">{candidate.why}</div>}
        <div className="r4b-resolve-actions">
          <button type="button" className="r4b-resolve-confirm" onClick={() => onConfirm(candidate)}>Yes, this one — start research</button>
          <button type="button" className="r4b-resolve-dismiss" onClick={onDismiss}>Not it</button>
        </div>
      </div>
    );
  }

  function Stat({ k, label }) {
    return (
      <span className="r4b-resolve-stat">
        <span className="r4b-resolve-stat-k">{k}</span>
        <span className="r4b-resolve-stat-l">{label}</span>
      </span>
    );
  }

  // ─── Resolved-strip terminal ──────────────────────────────────
  function ResolveStrip({ chosen, onChange }) {
    if (!chosen) return null;
    const niche = chosen.niche || '—';
    return (
      <div className="blk-frame">
        <div className="blk-tag">
          <span className="blk-id">RES-02</span>
          <span className="blk-name" style={{ opacity: 0.7 }}>Resolved entity · @{chosen.handle}</span>
          <span className="blk-tag-side"><span className="blk-target">→ Library</span></span>
        </div>
        <div className="r4b-resolve-strip">
          <span className="r4b-resolve-strip-check" aria-hidden="true">
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4.5 L4 6.5 L7.5 2.5" /></svg>
          </span>
          <span className="r4b-resolve-strip-text">
            Resolved · <span className="r4b-resolve-strip-handle">@{chosen.handle}</span> · {chosen.followers} followers · {niche || '—'}
          </span>
          <span className="r4b-resolve-strip-actions">
            <button type="button" className="r4b-resolve-strip-action" onClick={onChange}>change</button>
            <span className="r4b-resolve-strip-sep">·</span>
            <button type="button" className="r4b-resolve-strip-action accent">view profile</button>
          </span>
        </div>
      </div>
    );
  }

  // ─── None-of-these · inline input stage ───────────────────────
  function ResolveInput({ value, setValue, onBack, onSubmit }) {
    function handleKey(e) {
      if (e.key === 'Enter')  { onSubmit((value || '').trim()); }
      if (e.key === 'Escape') { onBack(); }
    }
    return (
      <div className="blk-frame">
        <div className="blk-tag">
          <span className="blk-id">RES-02</span>
          <span className="blk-name">Did you mean…?</span>
          <span className="blk-tag-side"><span className="blk-target">→ Library</span></span>
        </div>
        <div className="blk">
          <div className="blk-eyebrow"><span className="l" style={{ color: 'var(--tone-warning)' }}>RES-02 · ENTER HANDLE</span><span className="r">candidates collapsed</span></div>
          <p style={{ margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 13.5, color: 'var(--fg-tertiary)' }}>
            Candidates collapsed — type the exact handle below.
          </p>
          <div className="r4b-resolve-input-row">
            <span className="r4b-resolve-input-at">@</span>
            <input
              type="text"
              value={value || ''}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKey}
              placeholder="exact instagram handle"
              autoFocus
            />
            <button type="button" className="r4b-resolve-input-submit" onClick={() => onSubmit((value || '').trim())}>Look up</button>
          </div>
          <p className="r4b-resolve-input-hint">Enter to confirm, esc to go back to candidates.</p>
          <div className="blk-footer">
            <button type="button" className="blk-chip muted" onClick={onBack}>Back to candidates</button>
            <button type="button" className="blk-chip muted">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Handle-found confirm card ────────────────────────────────
  function ResolveFoundConfirm({ handle, onConfirm, onWrong }) {
    return (
      <div className="blk-frame">
        <div className="blk-tag">
          <span className="blk-id">RES-02</span>
          <span className="blk-name">Found · confirm <em style={{ color: 'var(--accent-primary)' }}>@{handle}</em></span>
          <span className="blk-tag-side"><span className="blk-target">→ Library</span></span>
        </div>
        <div className="blk">
          <div className="blk-eyebrow"><span className="l">RES-02 · FOUND · CONFIRM</span><span className="r">new account · not in your library yet</span></div>
          <div className="r4b-resolve-track-row">
            <span className="r4b-resolve-av-md">{(handle || '').slice(0, 2).toUpperCase()}</span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
              <span className="r4b-resolve-handle-md">@{handle}</span>
              <span className="r4b-resolve-track-sub">Brand · ceramics + apparel · 12.1k followers · 80 reels</span>
            </span>
            <span className="r4b-resolve-pill">new to library</span>
          </div>
          <div className="blk-footer">
            <button type="button" className="blk-chip accent" onClick={() => onConfirm(handle)}>Yes, this is it · start research</button>
            <button type="button" className="blk-chip muted">View profile first</button>
            <button type="button" className="blk-chip muted" onClick={onWrong}>Wrong account</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Handle-not-found dead-end ────────────────────────────────
  function ResolveNotFound({ handle, onTryAgain, onBack }) {
    return (
      <div className="blk-frame">
        <div className="blk-tag">
          <span className="blk-id">RES-02</span>
          <span className="blk-name">Couldn't find <em style={{ color: 'var(--accent-primary)' }}>@{handle}</em></span>
          <span className="blk-tag-side"><span className="blk-target">→ Library</span></span>
        </div>
        <div className="blk">
          <div className="blk-eyebrow"><span className="l" style={{ color: 'var(--tone-warning)' }}>RES-02 · NOT FOUND</span><span className="r">no public profile</span></div>
          <p style={{ margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14, color: 'var(--fg-primary)', lineHeight: 1.45 }}>
            We couldn't find this handle on Instagram. It may be misspelled, private, or recently renamed.
          </p>
          <div className="blk-footer">
            <button type="button" className="blk-chip accent" onClick={onTryAgain}>Try a different handle</button>
            <button type="button" className="blk-chip" onClick={onBack}>Back to candidates</button>
            <button type="button" className="blk-chip muted">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Runtime style injection ─────────────────────────────────
  function ensureStyles() {
    if (typeof document === 'undefined' || document.getElementById('r4b-resolve-styles')) return;
    const style = document.createElement('style');
    style.id = 'r4b-resolve-styles';
    style.textContent = `
.r4b-resolve-grid { display: grid; grid-template-columns: 320px 1fr; gap: 12px; min-width: 0; }
.r4b-resolve-list { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.r4b-resolve-row { display: grid; grid-template-columns: 32px 1fr auto; gap: 10px; align-items: center; padding: 10px 12px; border: 1px solid var(--border-subtle); border-radius: 6px; background: var(--surface-1); cursor: pointer; min-width: 0; text-align: left; }
.r4b-resolve-row:hover { background: var(--surface-2); }
.r4b-resolve-row.active { border-color: var(--accent-primary); background: var(--accent-soft); }
.r4b-resolve-av { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg,var(--accent-soft),var(--surface-3)); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: var(--accent-primary); }
.r4b-resolve-row-who { display: flex; flex-direction: column; gap: 1px; min-width: 0; text-align: left; }
.r4b-resolve-handle { font-family: var(--font-mono); font-size: 12px; font-weight: 600; color: var(--fg-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.r4b-resolve-row-sub { font-family: var(--font-serif); font-style: italic; font-size: 11.5px; color: var(--fg-tertiary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.2; }
.r4b-resolve-followers { font-family: var(--font-mono); font-size: 10px; letter-spacing: .06em; text-transform: uppercase; color: var(--fg-secondary); font-weight: 700; }
.r4b-resolve-detail { background: var(--surface-1); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 16px; display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.r4b-resolve-detail-head { display: flex; align-items: center; gap: 12px; }
.r4b-resolve-av-lg { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg,var(--accent-soft),var(--surface-3)); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-size: 18px; font-weight: 700; color: var(--accent-primary); flex-shrink: 0; }
.r4b-resolve-handle-lg { font-family: var(--font-mono); font-size: 14px; font-weight: 700; color: var(--fg-primary); }
.r4b-resolve-name { font-family: var(--font-serif); font-style: italic; font-size: 14.5px; color: var(--fg-secondary); margin-top: 2px; line-height: 1.25; }
.r4b-resolve-conf { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 999px; background: var(--accent-soft); color: var(--accent-primary-press); font-family: var(--font-mono); font-size: 9px; letter-spacing: .08em; text-transform: uppercase; font-weight: 700; margin-left: auto; }
.r4b-resolve-bio { font-family: var(--font-serif); font-style: italic; font-size: 13.5px; color: var(--fg-primary); line-height: 1.45; margin: 0; }
.r4b-resolve-stats { display: flex; gap: 24px; padding: 10px 0; border-top: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle); }
.r4b-resolve-stat { display: flex; flex-direction: column; gap: 2px; }
.r4b-resolve-stat-k { font-family: var(--font-serif); font-style: italic; font-size: 22px; color: var(--accent-primary); letter-spacing: -.01em; font-weight: 600; }
.r4b-resolve-stat-l { font-family: var(--font-mono); font-size: 9.5px; letter-spacing: .08em; text-transform: uppercase; color: var(--fg-tertiary); font-weight: 700; }
.r4b-resolve-reels { display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; }
.r4b-resolve-reel { aspect-ratio: 9/16; border-radius: 4px; position: relative; overflow: hidden; }
.r4b-resolve-reel-views { position: absolute; top: 4px; right: 4px; font-family: var(--font-mono); font-size: 7px; font-weight: 700; letter-spacing: .04em; color: rgba(255,255,255,.85); text-shadow: 0 1px 2px rgba(0,0,0,.6); }
.r4b-resolve-reel-hook { position: absolute; left: 4px; right: 4px; bottom: 5px; font-family: var(--font-serif); font-style: italic; color: rgba(255,255,255,.92); font-size: 7.5px; line-height: 1.15; letter-spacing: -.005em; text-shadow: 0 1px 2px rgba(0,0,0,.5); }
.r4b-resolve-why { display: flex; align-items: flex-start; gap: 8px; padding: 10px 12px; background: var(--accent-soft); border-radius: 6px; font-family: var(--font-serif); font-style: italic; font-size: 12.5px; color: var(--accent-primary-press); line-height: 1.4; }
.r4b-resolve-actions { display: flex; gap: 8px; padding-top: 4px; border-top: 1px solid var(--border-subtle); }
.r4b-resolve-confirm { font-family: var(--font-mono); font-size: 10.5px; letter-spacing: .08em; text-transform: uppercase; font-weight: 700; padding: 8px 14px; border-radius: 999px; background: var(--surface-ink); color: var(--fg-on-ink); border: 0; cursor: pointer; }
.r4b-resolve-dismiss { font-family: var(--font-mono); font-size: 10.5px; letter-spacing: .08em; text-transform: uppercase; font-weight: 700; padding: 8px 14px; border-radius: 999px; background: var(--surface-1); color: var(--fg-secondary); border: 1px solid var(--border-default); cursor: pointer; }
.r4b-resolve-strip { display: grid; grid-template-columns: 14px 1fr auto; gap: 10px; align-items: center; padding: 10px 14px; background: var(--accent-soft); border: 1px solid transparent; border-radius: 8px; }
.r4b-resolve-strip-check { width: 14px; height: 14px; border-radius: 50%; background: var(--accent-primary); color: var(--fg-on-ink); display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; }
.r4b-resolve-strip-text { font-family: var(--font-serif); font-style: italic; font-size: 14px; color: var(--accent-primary-press); line-height: 1.3; }
.r4b-resolve-strip-handle { font-family: var(--font-mono); font-style: normal; font-weight: 700; }
.r4b-resolve-strip-actions { display: flex; align-items: center; gap: 10px; font-family: var(--font-mono); font-size: 9.5px; letter-spacing: .08em; text-transform: uppercase; color: var(--fg-tertiary); font-weight: 700; }
.r4b-resolve-strip-action { background: transparent; border: 0; padding: 2px 4px; cursor: pointer; color: var(--accent-primary); font: inherit; letter-spacing: inherit; text-transform: inherit; font-weight: inherit; }
.r4b-resolve-strip-action.accent { color: var(--accent-primary); }
.r4b-resolve-strip-sep { color: var(--fg-tertiary); }
.r4b-resolve-input-row { display: grid; grid-template-columns: 18px 1fr auto; gap: 10px; align-items: center; padding: 10px 14px; background: var(--surface-2); border: 1px solid var(--border-subtle); border-radius: 6px; }
.r4b-resolve-input-at { font-family: var(--font-mono); font-size: 14px; color: var(--accent-primary); font-weight: 700; }
.r4b-resolve-input-row input { background: transparent; border: 0; outline: 0; padding: 4px 0; font-family: var(--font-mono); font-size: 13px; color: var(--fg-primary); font-weight: 500; width: 100%; }
.r4b-resolve-input-row input::placeholder { color: var(--fg-tertiary); font-style: italic; font-family: var(--font-serif); font-weight: 400; }
.r4b-resolve-input-submit { font-family: var(--font-mono); font-size: 9.5px; letter-spacing: .08em; text-transform: uppercase; font-weight: 700; padding: 6px 12px; border-radius: 999px; background: var(--surface-ink); color: var(--fg-on-ink); border: 0; cursor: pointer; }
.r4b-resolve-input-hint { font-family: var(--font-serif); font-style: italic; font-size: 12.5px; color: var(--fg-tertiary); margin: 6px 2px 0; }
.r4b-resolve-track-row { display: grid; grid-template-columns: 36px 1fr auto; gap: 12px; align-items: center; padding: 12px 14px; border: 1px solid var(--border-default); border-radius: 8px; background: var(--surface-1); }
.r4b-resolve-av-md { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg,var(--accent-soft),var(--surface-3)); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-size: 12px; font-weight: 700; color: var(--accent-primary); }
.r4b-resolve-handle-md { font-family: var(--font-mono); font-size: 13px; font-weight: 700; color: var(--fg-primary); }
.r4b-resolve-track-sub { font-family: var(--font-serif); font-style: italic; font-size: 12.5px; color: var(--fg-tertiary); line-height: 1.25; }
.r4b-resolve-pill { display: inline-flex; align-items: center; gap: 5px; padding: 3px 8px; border-radius: 999px; background: var(--accent-soft); color: var(--accent-primary-press); font-family: var(--font-mono); font-size: 9px; letter-spacing: .08em; text-transform: uppercase; font-weight: 700; }
.r4b-resolve-row:focus-visible { outline: 2px solid var(--accent-ring); outline-offset: 2px; }
.r4b-resolve-confirm:focus-visible { outline: 2px solid var(--accent-ring); outline-offset: 2px; }
.r4b-resolve-dismiss:focus-visible { outline: 2px solid var(--accent-ring); outline-offset: 2px; }
.r4b-resolve-input-submit:focus-visible { outline: 2px solid var(--accent-ring); outline-offset: 2px; }
.r4b-resolve-strip-action:focus-visible { outline: 2px solid var(--accent-ring); outline-offset: 2px; }
`;
    document.head.appendChild(style);
  }
  ensureStyles();

  // ─── Registry registration ────────────────────────────────────
  window.registerBlock('r4b-resolve-entity', {
    family: 'M',
    name: 'Did you mean…?',
    purpose: 'Resolve an ambiguous entity before research begins.',
    target: 'LIBRARY',
    span: 12,
    component: HF_R4B_RESOLVE_ENTITY,
    phase: 2,
  });

  Object.assign(window, {
    HF_R4B_RESOLVE_ENTITY,
    HF_R4B_RESOLVE_TONES: TONES,
    HF_R4B_RESOLVE_FIXTURE: RESOLVE_FIXTURE,
  });
})();
