/* global React, window */
/* hifi-cohesion-r9-surface-rhythm.jsx — Cohesion R9 surface rhythm primitive
   (Wave 3 / I5).

   Defines HF_EditorialHeader, the shared editorial-header primitive that
   levels every workspace surface up to the Insights gold-standard rhythm:

     · Mono caps eyebrow (left) + mono caps right-meta (right) on top row
     · Mono dateline (left) + mono right-dateline (right) on second row
     · Big serif italic headline (lyrical, lifts the surface)
     · Italic tail line (lyrical second clause, fg-tertiary)
     · Sans body paragraph (max-width ~60ch)
     · Generous vertical breathing

   Wave 3 applies the primitive to Studio/Docs Home as proof. Per-surface
   adoption to Library / Intel / Inbox / Calendar happens in Wave 3b.

   Locked decision: surface-rhythm-primitive

   Public API (window):
     HF_EditorialHeader                 // React component
*/

(function () {
  'use strict';
  if (window.__COHESION_R9_SURFACE_RHYTHM_BOOTED__) return;
  window.__COHESION_R9_SURFACE_RHYTHM_BOOTED__ = true;

  function HF_EditorialHeader({
    eyebrow,           // mono caps left
    rightMeta,         // mono caps right
    dateline,          // mono regular left
    rightDateline,     // mono regular right
    headline,          // serif italic big
    tail,              // italic continuation, fg-tertiary
    body,              // sans paragraph, max-width 60ch
    density = 'comfortable', // compact|comfortable|spacious
  }) {
    // density → headline size mapping
    const headlineSize = { compact: 32, comfortable: 40, spacious: 48 }[density] || 40;
    const verticalPadding = {
      compact:     '20px 0 24px',
      comfortable: '28px 0 32px',
      spacious:    '36px 0 44px',
    }[density] || '28px 0 32px';

    return (
      <header className={'docs-r9-editorial-header docs-r9-editorial-' + density}
        style={{
          padding: verticalPadding,
          // outer container — inherits parent's max-width
        }}>
        {(eyebrow || rightMeta) && (
          <div style={{
            display: 'flex', alignItems: 'baseline', gap: 12,
            marginBottom: 8, justifyContent: 'space-between',
          }}>
            {eyebrow ? (
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 600,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--fg-tertiary)',
              }}>{eyebrow}</span>
            ) : <span />}
            {rightMeta ? (
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 600,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--fg-tertiary)',
              }}>{rightMeta}</span>
            ) : <span />}
          </div>
        )}
        {(dateline || rightDateline) && (
          <div style={{
            display: 'flex', alignItems: 'baseline', gap: 12,
            marginBottom: 18, justifyContent: 'space-between',
          }}>
            {dateline ? (
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 11,
                color: 'var(--fg-secondary)',
              }}>{dateline}</span>
            ) : <span />}
            {rightDateline ? (
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 11,
                color: 'var(--fg-tertiary)',
              }}>{rightDateline}</span>
            ) : <span />}
          </div>
        )}
        {headline && (
          <h1 style={{
            margin: 0, padding: 0,
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontWeight: 600, fontSize: headlineSize, lineHeight: 1.06,
            letterSpacing: '-0.02em',
            color: 'var(--fg-primary)',
          }}>
            {headline}
            {tail && (
              <span style={{
                color: 'var(--fg-tertiary)', marginLeft: 6,
              }}>
                {' '}{tail}
              </span>
            )}
          </h1>
        )}
        {body && (
          <p style={{
            marginTop: 18, marginBottom: 0,
            fontFamily: 'var(--font-sans)', fontSize: 14.5, lineHeight: 1.55,
            color: 'var(--fg-secondary)',
            maxWidth: '60ch',
          }}>{body}</p>
        )}
      </header>
    );
  }

  Object.assign(window, { HF_EditorialHeader });
})();
