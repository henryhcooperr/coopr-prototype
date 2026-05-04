/* global React, window, HfShell, HomeComposer, SuggestionRow, TodayBriefing, RecentThreads, Mono, R4PlatformCard */
/* hifi-home-rail.jsx — Home · vertical library rail variant.

   Same Home content as HF_HomeChat (masthead · composer · suggestions ·
   briefing · recent threads), but with a 320px library rail pinned to the
   right edge. Vertical stack of 6 most-recent posts as compact cards. This
   is the "creator's desk" variant of Home — chat for asking, library for
   remembering, both visible at once.

   Why ship this as a separate artboard rather than replacing HF_HomeChat:
   the rail competes for attention with the chat-first cold open. We want
   to evaluate them side-by-side on the canvas before deciding which is the
   default Home.

   Layout (at 1440 viewport):
     ┌─────────────────────────────────┬──────────┐
     │                                 │ rail     │
     │   chat content column (720)     │ (320)    │
     │   centered in remaining space   │ pinned R │
     │                                 │          │
     └─────────────────────────────────┴──────────┘
*/

const R4_HOMERAIL_DATA = window.HF_DATA;
const R4_HOMERAIL_W = 320;
const R4_HOMERAIL_CARD_W = R4_HOMERAIL_W - 28 * 2;  // 264px — fits rail padding

function HF_HomeWithLibraryRail() {
  const ms = (window.useMasterState && window.useMasterState()) || {};
  // Pick the 6 most recent posts from the catalog.
  const recent = R4_HOMERAIL_DATA.posts.slice(0, 6);

  return (
    <HfShell workspace="home">
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex' }}>
        {/* ── Chat content lane (left) ─────────────────── */}
        <div style={{ flex: 1, minWidth: 0, overflow: 'auto', display: 'flex', justifyContent: 'center', padding: '52px 32px 60px' }}>
          <div style={{ width: 720, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* Editorial masthead — same as HF_HomeChat */}
            <div style={{ textAlign: 'center', marginBottom: 26 }}>
              <Mono size={10.5} color="var(--fg-tertiary)" style={{ letterSpacing: '0.18em', textTransform: 'uppercase' }}>Wed · Apr 24 · Wayanad</Mono>
              <h1 style={{
                margin: '14px 0 8px',
                fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: 44,
                color: 'var(--fg-primary)', letterSpacing: '-0.02em', lineHeight: 1.1,
              }}>
                Good morning, <span style={{ fontStyle: 'italic' }}>Henry</span>.
              </h1>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14.5, color: 'var(--fg-secondary)', lineHeight: 1.55 }}>
                Three things waiting for you. The Fujikawa cut is closest to ship.
              </div>
            </div>

            <HomeComposer />

            <SuggestionRow items={[
              { eyebrow: 'DRAFT',     prompt: 'Three openers for the Fiji wreck series, under 1.2 seconds.' },
              { eyebrow: 'EXPLAIN',   prompt: 'Why did 0042 keep watchers and 0041 lose them at minute three?' },
              { eyebrow: 'SCHEDULE',  prompt: 'Lay out next week to balance safety, gear, and storytime.' },
              { eyebrow: 'REPLY',     prompt: "Draft a reply to @marina.k that doesn't sound like a brand." },
            ]} />

            <TodayBriefing />
            <RecentThreads />

          </div>
        </div>

        {/* ── Library rail (right) ─────────────────────── */}
        <aside style={{
          width: R4_HOMERAIL_W,
          flexShrink: 0,
          borderLeft: '1px solid var(--border-subtle)',
          background: 'var(--surface-1)',
          overflow: 'auto',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Rail header */}
          <div style={{ padding: '24px 28px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.14em', marginBottom: 6 }}>
              YOUR LIBRARY
            </div>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 22, color: 'var(--fg-primary)', letterSpacing: '-0.018em', lineHeight: 1.1 }}>
              What you've made, recently.
            </h2>
            <div style={{ marginTop: 6, fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--fg-tertiary)', lineHeight: 1.4 }}>
              412 posts · last 30d <span style={{ color: 'var(--tone-success)', fontWeight: 600 }}>+18%</span>
            </div>
          </div>

          {/* Vertical stack — 6 recent posts at column-fluid width */}
          <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 24, flex: 1 }}>
            {recent.map(p => (
              <R4HomeRailCard key={p.id} post={p} />
            ))}
          </div>

          {/* Rail footer */}
          <div
            onClick={() => ms.setActiveSurface && ms.setActiveSurface('library', 'Catalog')}
            style={{
              padding: '14px 28px',
              borderTop: '1px solid var(--border-subtle)',
              background: 'var(--surface-2)',
              fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-primary)',
              letterSpacing: '0.06em', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'transform 120ms ease',
            }}>
            OPEN LIBRARY
            <svg width="9" height="9" viewBox="0 0 10 10"><path d="M2 8 L8 2 M5 2 L8 2 L8 5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </aside>
      </div>
    </HfShell>
  );
}

// Compact card used in the rail. Shows the platform card itself + a one-line
// title row (mono date + dot + serif title clamped to 2 lines). perfMode='off'
// keeps the rail visually quiet — performance is for Library, not Home.
function R4HomeRailCard({ post }) {
  const ms = (window.useMasterState && window.useMasterState()) || {};
  const v = window.R4_LIB_VISUALS[post.id] || {};
  return (
    <div
      onClick={() => ms.setActiveSurface && ms.setActiveSurface('library', 'Catalog')}
      style={{ display: 'flex', flexDirection: 'column', gap: 10, cursor: 'pointer', transition: 'transform 120ms ease' }}>
      <R4PlatformCard post={post} density="compact" perfMode="off" colWidth={R4_HOMERAIL_CARD_W} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, paddingTop: 4, borderTop: '1px solid var(--border-subtle)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.06em', flexShrink: 0 }}>{post.publishedAt.toUpperCase()}</span>
        <span style={{
          fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 13.5, fontWeight: 500,
          color: 'var(--fg-primary)', letterSpacing: '-0.005em', lineHeight: 1.3,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{post.title}</span>
        {v.cooprScore != null && (
          <span style={{
            marginLeft: 'auto', flexShrink: 0,
            fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 700,
            color: v.cooprScore >= 60 ? 'var(--tone-success)' : 'var(--fg-tertiary)',
          }}>{v.cooprScore}</span>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { HF_HomeWithLibraryRail });
