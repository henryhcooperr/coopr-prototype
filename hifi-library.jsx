/* global React, window, HfShell */
/* hifi-library.jsx — Library workspace.
   Platform-faithful card grid + 2-row filter chips + post detail modal
   with phone preview, Performance/Audience/Diagnostics tabs, action bar. */

const LIB = window.HF_DATA;

// ─── Per-post visual overrides ─────────────────────────────
// Each Library card needs more than the raw data row gives us — a hook line
// rendered ON the thumbnail, a tone (color of the underwater scene), a real
// platform display target (since 'channel' alone doesn't tell us reel vs feed
// vs story). This map is keyed by post.id from hifi-data.js.
const LIB_VISUALS = {
  '0046': { display: 'reel-ig',     hook: '3 THINGS\nI CHECK\nbefore every wreck',           tone: 'deep-blue',  cooprScore: 47, lifecycle: 'graduated', velocity: '+4%/d' },
  '0045': { display: 'short-tt',    hook: 'why I trust\nmy SPG\nover my dive computer',      tone: 'teal',       cooprScore: 38, lifecycle: 'normal',     velocity: '+1%/d' },
  '0044': { display: 'long-yt',     hook: 'TRUK LAGOON · The Fujikawa Maru in eight breaths', tone: 'kelp',       cooprScore: 71, lifecycle: 'graduated', velocity: '+12%/d' },
  '0043': { display: 'reel-ig',     hook: 'BUDDY CHECK\nbut make it\nactually useful',       tone: 'cyan',       cooprScore: 22, lifecycle: 'normal',     velocity: '-3%/d' },
  '0042': { display: 'long-yt',     hook: 'My first wreck — and what I got wrong',           tone: 'midnight',   cooprScore: 84, lifecycle: 'graduated', velocity: '+6%/d' },
  '0041': { display: 'long-yt',     hook: 'The 12-minute primer that almost worked',         tone: 'navy',       cooprScore: 31, lifecycle: 'trial',      velocity: '-2%/d' },
  '0040': { display: 'long-yt',     hook: 'Reg first stage · DIN vs YOKE',                   tone: 'steel',      cooprScore: 56, lifecycle: 'normal',     velocity: '+3%/d' },
  '0039': { display: 'short-tt',    hook: 'the EIGHT\nSECOND\nrule',                         tone: 'electric',   cooprScore: 62, lifecycle: 'graduated', velocity: '+9%/d' },
  '0038': { display: 'reel-ig',     hook: 'how to clean\na flooded\nMASK without panic',     tone: 'green',      cooprScore: 29, lifecycle: 'normal',     velocity: '+2%/d' },
  '0037': { display: 'carousel-ig', hook: 'three reels\nfrom KOMODO\n· uncut',                tone: 'sunset',     cooprScore: 44, lifecycle: 'normal',     velocity: '+1%/d' },
  '0036': { display: 'long-yt',     hook: 'Should you buy a rebreather in year two?',        tone: 'plum',       cooprScore: 51, lifecycle: 'normal',     velocity: '+0%/d' },
  '0035': { display: 'reel-ig',     hook: 'a reply to\n@marina.k\non safety storytelling',   tone: 'amber',      cooprScore: 33, lifecycle: 'normal',     velocity: '+1%/d' },
};

// Tone palettes — each thumbnail gets a layered gradient so the grid doesn't
// look like one cliff of blue. All warm-cool pairs that pass with white text.
const TONE_PALETTES = {
  'deep-blue':  { from: '#0d2b3e', via: '#1f5876', to: '#3a7c9a' },
  'teal':       { from: '#0a3a3f', via: '#1f6770', to: '#3a9a9c' },
  'kelp':       { from: '#1a2e1a', via: '#2d4f2a', to: '#5a7a3e' },
  'cyan':       { from: '#0f3a4a', via: '#256a86', to: '#5fa8c0' },
  'midnight':   { from: '#0a1424', via: '#1a2c4a', to: '#2c4878' },
  'navy':       { from: '#0e1f3a', via: '#1f3760', to: '#385a8c' },
  'steel':      { from: '#1a2025', via: '#3a4452', to: '#6a7280' },
  'electric':   { from: '#0a1a3a', via: '#1f3a72', to: '#4868b8' },
  'green':      { from: '#0e2a1c', via: '#1f5535', to: '#3a8a55' },
  'sunset':     { from: '#3a1a0e', via: '#7a3a1a', to: '#c97b3e' },
  'plum':       { from: '#28102a', via: '#4a2155', to: '#7a4a8a' },
  'amber':      { from: '#3a200a', via: '#7a4a1a', to: '#c08a3e' },
};

// ─── Channel/format glyphs ─────────────────────────────────
function ChannelMini({ ch, size = 12 }) {
  const map = {
    yt: { bg: '#ff0033', label: 'YT' },
    ig: { bg: '#000',    label: 'IG' },
    tt: { bg: '#000',    label: 'TT' },
  };
  const c = map[ch] || map.ig;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      height: size + 4, padding: '0 5px',
      background: c.bg, color: '#fff',
      fontFamily: 'var(--font-sans)', fontSize: size - 3, fontWeight: 700,
      letterSpacing: '0.08em', borderRadius: 3,
    }}>{c.label}</span>
  );
}

function platformLabel(display) {
  return {
    'reel-ig':     'REEL',
    'short-tt':    'TIKTOK',
    'long-yt':     'YOUTUBE',
    'carousel-ig': 'CAROUSEL',
    'story-ig':    'STORY',
    'thread':      'THREAD',
  }[display] || 'POST';
}

function fmtViews(n) {
  if (n >= 1000000) return (n/1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1000)    return (n/1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'K';
  return String(n);
}

// ─── Thumbnail backgrounds (no real image, but layered to feel like one) ───
function ThumbBackdrop({ tone = 'deep-blue', children, style = {} }) {
  const p = TONE_PALETTES[tone] || TONE_PALETTES['deep-blue'];
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `radial-gradient(140% 90% at 30% 20%, ${p.via} 0%, ${p.from} 60%, ${p.from} 100%)`,
      overflow: 'hidden',
      ...style,
    }}>
      {/* Light streak — refraction feel */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(50% 30% at 75% 15%, ${p.to}55 0%, transparent 70%)`,
      }} />
      {/* Subtle vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(120% 80% at 50% 80%, rgba(0,0,0,0.45), transparent 60%)',
      }} />
      {/* Diver silhouette suggestion — abstract dots */}
      <svg style={{ position: 'absolute', inset: 0, opacity: 0.25 }} viewBox="0 0 100 100" preserveAspectRatio="none">
        <circle cx="22" cy="38" r="0.4" fill="#fff" />
        <circle cx="62" cy="22" r="0.3" fill="#fff" />
        <circle cx="80" cy="56" r="0.5" fill="#fff" />
        <circle cx="14" cy="72" r="0.4" fill="#fff" />
        <circle cx="48" cy="86" r="0.3" fill="#fff" />
      </svg>
      {children}
    </div>
  );
}

// ─── Card chrome variants ─────────────────────────────────
// Reel/Story share the IG chrome family. We'll do these inline to keep the
// file together — each variant returns the chrome inside the thumbnail.

function ChromeReelIG({ hook, fullChrome }) {
  return (
    <>
      {/* Hook caption — big, slightly rotated, IG reel style */}
      <div style={{
        position: 'absolute', left: 12, top: 30, right: 50,
        fontFamily: '"Plus Jakarta Sans", system-ui',
        fontSize: 15, fontWeight: 800, lineHeight: 1.05,
        color: '#fff', textShadow: '0 1px 8px rgba(0,0,0,0.55)',
        whiteSpace: 'pre-wrap', textTransform: 'uppercase',
        letterSpacing: '-0.005em',
      }}>{hook}</div>

      {/* IG right rail */}
      <div style={{
        position: 'absolute', right: 8, bottom: 56,
        display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center',
      }}>
        {[['♡', '736'], ['◯', '29'], ['↗', '60'], ['↙', '32']].map(([g, n], i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <span style={{ fontSize: 14, color: '#fff', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.55))' }}>{g}</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 8.5, color: '#fff', fontWeight: 600, textShadow: '0 1px 2px rgba(0,0,0,0.55)' }}>{n}</span>
          </div>
        ))}
      </div>

      {/* Bottom — handle + caption snippet */}
      <div style={{
        position: 'absolute', left: 10, right: 10, bottom: 10,
        display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(255,255,255,0.45)', border: '1px solid #fff' }} />
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 9.5, color: '#fff', fontWeight: 600, textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>@henry.dives</span>
        </div>
        {fullChrome && (
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 8, color: '#fff', opacity: 0.85, textShadow: '0 1px 2px rgba(0,0,0,0.6)', lineHeight: 1.3 }}>
            three things I check before every wreck dive…
          </div>
        )}
      </div>
    </>
  );
}

function ChromeShortTT({ hook }) {
  return (
    <>
      <div style={{
        position: 'absolute', left: 12, top: 60, right: 50,
        fontFamily: '"Plus Jakarta Sans", system-ui',
        fontSize: 16, fontWeight: 800, lineHeight: 1.0,
        color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.5)',
        whiteSpace: 'pre-wrap', textTransform: 'lowercase',
        letterSpacing: '-0.015em',
      }}>{hook}</div>

      {/* TikTok right rail */}
      <div style={{
        position: 'absolute', right: 7, bottom: 70,
        display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center',
      }}>
        {[['♥', '4.2K'], ['◯', '612'], ['⤴', '1.1K'], ['☆', '420']].map(([g, n], i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.35)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff' }}>{g}</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 7.5, color: '#fff', fontWeight: 700 }}>{n}</span>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div style={{ position: 'absolute', left: 10, right: 50, bottom: 8 }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 9, color: '#fff', fontWeight: 700, textShadow: '0 1px 2px rgba(0,0,0,0.7)' }}>@henrymwangi</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 8, color: '#fff', opacity: 0.9, textShadow: '0 1px 2px rgba(0,0,0,0.7)', marginTop: 2 }}>♪ original sound — henry</div>
      </div>
    </>
  );
}

function ChromeLongYT({ hook, durationS = 600 }) {
  // YouTube long thumbnail — title is shown BELOW the card, not on it. So
  // here we only render the duration pill bottom-right. The card layout
  // (next component) handles the title row underneath.
  const m = Math.floor(durationS / 60);
  const s = String(durationS % 60).padStart(2, '0');
  return (
    <>
      {/* Big serif title — overlay on the upper third */}
      <div style={{
        position: 'absolute', left: 14, top: 16, right: 16,
        fontFamily: 'var(--font-serif)', fontStyle: 'italic',
        fontSize: 19, fontWeight: 500, lineHeight: 1.05,
        color: '#fff', textShadow: '0 1px 12px rgba(0,0,0,0.6)',
        letterSpacing: '-0.01em',
      }}>{hook}</div>
      {/* Duration pill */}
      <span style={{
        position: 'absolute', right: 8, bottom: 8,
        background: 'rgba(0,0,0,0.85)', color: '#fff',
        fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
        padding: '2px 5px', borderRadius: 3,
      }}>{m}:{s}</span>
    </>
  );
}

function ChromeCarouselIG({ hook }) {
  return (
    <>
      <div style={{
        position: 'absolute', left: 14, top: 24, right: 20,
        fontFamily: '"Plus Jakarta Sans", system-ui',
        fontSize: 14, fontWeight: 800, lineHeight: 1.05,
        color: '#fff', textShadow: '0 1px 8px rgba(0,0,0,0.5)',
        whiteSpace: 'pre-wrap', textTransform: 'uppercase',
      }}>{hook}</div>
      {/* Carousel page indicator */}
      <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 3 }}>
        {[0,1,2,3,4,5].map(i => (
          <span key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: i === 0 ? '#fff' : 'rgba(255,255,255,0.5)' }} />
        ))}
      </div>
      {/* Stack hint */}
      <div style={{
        position: 'absolute', right: -3, top: -3, bottom: -3, width: 4,
        background: 'rgba(0,0,0,0.25)', borderRadius: '0 6px 6px 0',
      }} />
      {/* Username */}
      <div style={{ position: 'absolute', left: 12, bottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(255,255,255,0.5)', border: '1px solid #fff' }} />
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 9.5, color: '#fff', fontWeight: 600, textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>@henry.dives</span>
      </div>
    </>
  );
}

// ─── Card wrapper ─────────────────────────────────────────
// Card sizing: 9:16 ≈ 168×298, 16:9 ≈ 280×158, 1:1 ≈ 220×220
function PlatformCard({ post, onClick }) {
  const v = LIB_VISUALS[post.id] || LIB_VISUALS['0046'];
  const display = v.display;

  let w, h, aspect, ChromeFn;
  if (display === 'long-yt') {
    w = 280; h = 158; aspect = '16:9'; ChromeFn = ChromeLongYT;
  } else if (display === 'carousel-ig') {
    w = 220; h = 220; aspect = '1:1';  ChromeFn = ChromeCarouselIG;
  } else if (display === 'short-tt') {
    w = 168; h = 298; aspect = '9:16'; ChromeFn = ChromeShortTT;
  } else {
    w = 168; h = 298; aspect = '9:16'; ChromeFn = ChromeReelIG;
  }

  return (
    <div onClick={onClick} style={{
      width: w, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      {/* Thumbnail */}
      <div style={{
        position: 'relative', width: w, height: h, borderRadius: 6, overflow: 'hidden',
        background: '#111', boxShadow: '0 1px 2px rgba(15,14,12,0.08)',
      }}>
        <ThumbBackdrop tone={v.tone}>
          <ChromeFn hook={v.hook} durationS={post.durationS} />
        </ThumbBackdrop>

        {/* Coopr Score badge — top-left */}
        <div style={{
          position: 'absolute', left: 7, top: 7,
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
          padding: '3px 7px', borderRadius: 4,
          display: 'inline-flex', alignItems: 'center', gap: 5,
        }}>
          <svg width="9" height="9" viewBox="0 0 12 12" style={{ color: 'var(--accent-primary)' }}>
            <path d="M6 1 L7 5 L11 6 L7 7 L6 11 L5 7 L1 6 L5 5 Z" fill="currentColor" />
          </svg>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10.5, fontWeight: 700, color: '#fff', letterSpacing: '-0.005em' }}>{v.cooprScore}</span>
        </div>

        {/* Platform badge — top-right */}
        <div style={{
          position: 'absolute', right: 7, top: 7,
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
          padding: '3px 6px', borderRadius: 3,
          fontFamily: 'var(--font-sans)', fontSize: 8.5, fontWeight: 700, color: '#fff',
          letterSpacing: '0.08em',
        }}>{platformLabel(display)}</div>
      </div>

      {/* Below-card metadata row */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {display === 'long-yt' ? (
          <>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 600, color: 'var(--fg-primary)', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.title}</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-tertiary)' }}>{fmtViews(post.views)} views · {post.publishedAt}</span>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-secondary)' }}>{post.publishedAt}</span>
            <span style={{ width: 2, height: 2, borderRadius: '50%', background: 'var(--fg-tertiary)' }} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, color: 'var(--fg-primary)' }}>{fmtViews(post.views)}</span>
            <span style={{ flex: 1 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: v.velocity.startsWith('-') ? 'var(--tone-warning)' : 'var(--tone-success)' }}>{v.velocity}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Filter chip rows ──────────────────────────────────────
function ChipRow({ chips, active, size = 'md' }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {chips.map(c => {
        const isActive = c === active;
        return (
          <span key={c} style={{
            padding: size === 'sm' ? '4px 10px' : '6px 12px',
            background: isActive ? 'var(--surface-ink)' : 'transparent',
            border: '1px solid ' + (isActive ? 'var(--surface-ink)' : 'var(--border-default)'),
            color: isActive ? 'var(--fg-on-ink)' : 'var(--fg-secondary)',
            borderRadius: 999,
            fontFamily: 'var(--font-sans)', fontSize: size === 'sm' ? 11 : 12, fontWeight: isActive ? 600 : 500,
            cursor: 'default', whiteSpace: 'nowrap',
          }}>{c}</span>
        );
      })}
    </div>
  );
}

// ─── Library main grid ─────────────────────────────────────
function HF_LibraryGrid() {
  const posts = LIB.posts;

  return (
    <HfShell workspace="library" subtab="All" topbarRight={
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          height: 26, padding: '0 10px',
          border: '1px solid var(--border-subtle)',
          borderRadius: 6,
          background: 'var(--surface-2)',
          fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--fg-tertiary)',
        }}>
          <span style={{ width: 9, height: 9, border: '1.4px solid var(--fg-tertiary)', borderRadius: '50%' }} />
          <span>Search hooks, titles, themes…</span>
        </span>
        <span style={{
          width: 24, height: 24, borderRadius: '50%',
          background: 'var(--accent-primary)', color: 'var(--fg-on-accent)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700,
        }}>H</span>
      </div>
    } subtabRight={
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {['RECENT', 'SCORE', 'SAVES', 'SAVE RATE', 'ENGAGEMENT'].map((s, i) => (
          <span key={s} style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: i === 0 ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
            fontWeight: i === 0 ? 700 : 500,
            letterSpacing: '0.08em',
            padding: i === 0 ? '3px 9px' : 0,
            background: i === 0 ? 'var(--surface-2)' : 'transparent',
            borderRadius: 999, border: i === 0 ? '1px solid var(--border-subtle)' : 'none',
          }}>{s}</span>
        ))}
        <span style={{ width: 1, height: 14, background: 'var(--border-subtle)' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-secondary)', letterSpacing: '0.05em' }}>Advanced filters</span>
      </div>
    }>

      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '24px 32px 60px' }}>

        {/* Header — retrieval framing */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 18 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>Retrieval overview</div>
            <h1 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: 30, color: 'var(--fg-primary)', letterSpacing: '-0.015em', lineHeight: 1.15 }}>
              Find the right post fast.
            </h1>
            <div style={{ marginTop: 6, fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--fg-tertiary)' }}>
              Showing {posts.length} of {posts.length} indexed items.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['134 indexed', '134 visible', 'all filters open'].map((t, i) => (
              <span key={i} style={{
                padding: '5px 11px', border: '1px solid var(--border-subtle)',
                borderRadius: 999, background: 'var(--surface-1)',
                fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-secondary)',
              }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Filter rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 18, borderBottom: '1px solid var(--border-subtle)' }}>
          <ChipRow chips={['All posts', 'Recent winners', 'Remix candidates', 'Underreached', 'Stale']} active="All posts" />
          <ChipRow size="sm" chips={['Normal', 'Trial', 'Graduated', 'Drafts', 'All']} active="All" />
        </div>

        {/* Card grid — masonry-feeling, but a flat flex-wrap is fine for varied
            aspects since we set explicit widths */}
        <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(168px, 1fr))', gap: '24px 18px', alignItems: 'start' }}>
          {posts.map(p => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <PlatformCard post={p} onClick={() => {}} />
            </div>
          ))}
        </div>

      </div>
    </HfShell>
  );
}

// ─── Detail modal ─────────────────────────────────────────
function HF_LibraryDetail() {
  const post = LIB.posts.find(p => p.id === '0046');
  const v = LIB_VISUALS[post.id];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Background — the grid, dimmed */}
      <div style={{ position: 'absolute', inset: 0, filter: 'blur(2px) saturate(0.8)', opacity: 0.4 }}>
        <HF_LibraryGrid />
      </div>
      {/* Scrim */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,14,12,0.32)' }} />

      {/* Modal */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
        width: 'min(1180px, calc(100% - 64px))', height: 'min(770px, calc(100% - 64px))',
        background: 'var(--bg-base)', border: '1px solid var(--border-default)',
        borderRadius: 14, boxShadow: '0 30px 80px rgba(15,14,12,0.32)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        fontFamily: 'var(--font-sans)', color: 'var(--fg-primary)',
      }}>

        {/* Modal top strip — caption preview + close */}
        <div style={{ height: 44, padding: '0 18px', display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', gap: 12 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)', boxShadow: '0 0 0 4px rgba(182,83,43,0.16)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.12em' }}>LIVE PREVIEW</span>
          </span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--fg-secondary)', flex: 1, textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Three things I check before every wreck dive — the eight-second rule, gauge sanity, buddy-handoff.
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--fg-tertiary)' }}>✕</span>
        </div>

        {/* Body — phone + tabs */}
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '300px 1fr', gap: 0 }}>

          {/* Left — phone preview */}
          <div style={{ padding: '24px', borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', overflow: 'auto' }}>

            {/* Phone frame */}
            <div style={{
              width: 226, height: 466,
              background: '#0c0c0c', borderRadius: 28,
              padding: 8, position: 'relative',
              boxShadow: '0 10px 40px rgba(15,14,12,0.18)',
            }}>
              {/* Notch */}
              <div style={{ position: 'absolute', left: '50%', top: 6, transform: 'translateX(-50%)', width: 70, height: 16, borderRadius: 14, background: '#000', zIndex: 2 }} />
              {/* Screen */}
              <div style={{ width: '100%', height: '100%', borderRadius: 22, overflow: 'hidden', position: 'relative', background: '#111' }}>
                <ThumbBackdrop tone={v.tone}>
                  <ChromeReelIG hook={v.hook} fullChrome />
                </ThumbBackdrop>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: 4 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--fg-secondary)' }}>Reel · {post.publishedAt} · </span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--tone-success)', fontWeight: 600 }}>Live asset available</span>
            </div>
          </div>

          {/* Right — score + tabs + metrics */}
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>

            {/* Score header */}
            <div style={{ padding: '20px 28px 14px', display: 'flex', alignItems: 'flex-end', gap: 16 }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: 56, fontWeight: 500, color: 'var(--fg-primary)', lineHeight: 1, letterSpacing: '-0.02em' }}>{v.cooprScore}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingBottom: 6 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Coopr Score</span>
                <div style={{ width: 200, height: 5, borderRadius: 999, background: 'var(--surface-3)' }}>
                  <div style={{ width: `${v.cooprScore}%`, height: '100%', borderRadius: 999, background: 'var(--accent-primary)' }} />
                </div>
                <div style={{ marginTop: 2, display: 'flex', gap: 5 }}>
                  <span style={{ padding: '3px 9px', border: '1px solid var(--border-default)', borderRadius: 999, fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-secondary)', letterSpacing: '0.05em' }}>REEL</span>
                  <span style={{ padding: '3px 9px', border: '1px solid var(--border-default)', borderRadius: 999, fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-secondary)', letterSpacing: '0.05em' }}>SAFETY</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ padding: '0 28px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: 28, height: 36, alignItems: 'center', flexShrink: 0 }}>
              {['PERFORMANCE', 'AUDIENCE', 'DIAGNOSTICS'].map((t, i) => (
                <span key={t} style={{
                  fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.1em',
                  color: i === 0 ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)',
                  borderBottom: i === 0 ? '2px solid var(--accent-primary)' : '2px solid transparent',
                  height: '100%', display: 'inline-flex', alignItems: 'center',
                  marginBottom: -1,
                }}>{t}</span>
              ))}
            </div>

            {/* Metric grid */}
            <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '18px 28px 24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--border-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 6, overflow: 'hidden' }}>
                {[
                  ['VIEWS',           '142K',  'Total reach on this post'],
                  ['LIKES',           '7.4K',  '5.2%'],
                  ['COMMENTS',        '412',   '0.3%'],
                  ['SAVES',           '2.8K',  '2.0%'],
                  ['SHARES',          '688',   '0.5%'],
                  ['COOPR SCORE',     '47',    'Composite · 14 score'],
                  ['ENGAGEMENT RATE', '7.9%',  'Likes + comments + saves over views'],
                  ['SAVE RATE',       '2.0%',  'Utility intent'],
                  ['COMMENT RATE',    '0.3%',  'Conversation depth'],
                  ['SHARE RATE',      '0.5%',  'Redistribution pressure'],
                  ['HOLD RATE',       '68%',   'From available hold signal'],
                  ['3S RETENTION',    '92%',   'Opening stickiness'],
                ].map(([k, v, sub], i) => (
                  <div key={i} style={{ background: 'var(--surface-1)', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.12em' }}>{k}</span>
                    <span style={{ fontFamily: 'var(--font-serif)', fontStyle: i === 5 ? 'italic' : 'normal', fontSize: 22, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.015em', lineHeight: 1 }}>{v}</span>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10.5, color: 'var(--fg-tertiary)', lineHeight: 1.3 }}>{sub}</span>
                  </div>
                ))}
              </div>

              {/* Score decomposition strip */}
              <div style={{ marginTop: 16, padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>Score decomposition</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-secondary)', lineHeight: 1.5 }}>
                  7.9% engagement · 92% opening retention · 2.0% save rate · 0.5% share rate. Composite weighted toward saves (utility intent).
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <button style={{
            flex: 1,
            background: 'var(--accent-primary)', color: 'var(--fg-on-accent)',
            border: 'none', borderRadius: 999,
            padding: '12px 18px', cursor: 'pointer',
            fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600,
          }}>Open in Studio</button>
          {['Open in Clip Lab', 'Discuss in Chat', 'View on Instagram'].map(t => (
            <button key={t} style={{
              background: 'transparent', color: 'var(--fg-primary)',
              border: '1px solid var(--border-default)', borderRadius: 999,
              padding: '12px 18px', cursor: 'pointer',
              fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500,
            }}>{t}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HF_LibraryGrid, HF_LibraryDetail });
