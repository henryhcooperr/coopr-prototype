/* global React, window, document */
/* hifi-cohesion-r9-card-preview.jsx — Cohesion R9 card preview (Wave 3 / I3).

   Provides HF_DocCardPreview, a React component used inside the docs-r6 home
   CardThumbnail to render a real, scaled-down preview of a doc's saved body.

   Rendering strategy (locked decision: doc-card-thumbnail-strategy):
     · For docs with content saved in localStorage[`r5-doc-${docId}`] whose
       text content (HTML stripped) exceeds 30 chars: render the HTML inside
       a clipped, scaled (transform: scale(0.35)) container.
     · For empty docs: render a serif italic "Start writing." placeholder
       centered in the thumbnail area.

   The preview MUST NOT eat clicks or selection — pointer-events: none on
   all descendants so the parent card click-target keeps working.

   Public API (window):
     HF_DocCardPreview                  // React component
*/

(function () {
  'use strict';
  if (window.__DOCS_R9_CARD_PREVIEW_BOOTED__) return;
  window.__DOCS_R9_CARD_PREVIEW_BOOTED__ = true;

  const STYLE_ID = 'docs-r9-card-preview-style';
  const CSS = `
.docs-r9-card-preview * {
  pointer-events: none !important;
}
.docs-r9-card-preview .r5-embed {
  /* keep visible but no interactions */
  cursor: default !important;
}
.docs-r9-card-preview {
  --doc-r9-preview-scale: 0.35;
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100%;
  pointer-events: none;
  user-select: none;
}
.docs-r9-card-preview > .docs-r9-card-preview-inner {
  transform: scale(var(--doc-r9-preview-scale));
  transform-origin: top left;
  width: calc(100% / var(--doc-r9-preview-scale));
  height: calc(100% / var(--doc-r9-preview-scale));
  padding: 24px 32px;
  font-family: var(--font-serif);
  background: var(--surface-1);
  color: var(--fg-primary);
  box-sizing: border-box;
  max-height: 600px;
  overflow: hidden;
}
`;

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const styleEl = document.createElement('style');
    styleEl.id = STYLE_ID;
    styleEl.textContent = CSS;
    document.head.appendChild(styleEl);
  }

  function readDocHtml(docId) {
    if (!docId) return '';
    try {
      return window.localStorage.getItem('r5-doc-' + docId) || '';
    } catch (e) {
      return '';
    }
  }

  function stripHtml(html) {
    if (!html) return '';
    // Lightweight strip — no DOM parse needed for length test.
    return String(html).replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  }

  function HF_DocCardPreview({ docId /*, fallbackTitle */ }) {
    React.useEffect(() => { ensureStyle(); }, []);

    const html = readDocHtml(docId);
    const textLen = stripHtml(html).length;
    const hasContent = !!html && textLen > 30;

    if (!hasContent) {
      return React.createElement('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: 18,
          color: 'var(--fg-tertiary)',
          letterSpacing: '-0.005em',
        },
      }, 'Start writing.');
    }

    return React.createElement(
      'div',
      { className: 'docs-r9-card-preview' },
      React.createElement('div', {
        className: 'docs-r9-card-preview-inner',
        dangerouslySetInnerHTML: { __html: html },
      })
    );
  }

  Object.assign(window, {
    HF_DocCardPreview,
  });
})();
