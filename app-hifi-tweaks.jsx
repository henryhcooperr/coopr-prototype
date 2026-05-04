/* global React, ReactDOM, HF_TweaksGallery */
/* app-hifi-tweaks.jsx — entry point for the variant gallery.
   Renders HF_TweaksGallery directly into root (no DesignCanvas — this is a
   single-purpose interactive page, not a multi-artboard exploration).

   The MasterBackLink floats top-right and matches the position + visual
   language of master.html's view-toggle so flipping between the two pages
   feels symmetric. */

function MasterBackLink() {
  return (
    <a
      href="master.html"
      style={{
        position: 'fixed', top: 16, right: 18, zIndex: 50,
        padding: '7px 14px', borderRadius: 999,
        background: 'var(--surface-1)',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 8px 22px -10px rgba(26,24,21,0.18), 0 1px 0 rgba(253,252,249,0.7) inset',
        fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.16em',
        textTransform: 'uppercase', color: 'var(--fg-secondary)', fontWeight: 600,
        textDecoration: 'none',
        display: 'inline-flex', alignItems: 'center', gap: 6,
        transition: 'color 200ms cubic-bezier(0.16,1,0.3,1)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-primary-press)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--fg-secondary)'; }}
    >
      <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true">
        <path d="M7 3 L3 7 M3 4 L3 7 L6 7" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Master
    </a>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.Fragment>
    <MasterBackLink />
    <HF_TweaksGallery />
  </React.Fragment>
);
