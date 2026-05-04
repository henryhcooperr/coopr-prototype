/* global React, ReactDOM, window, document, requestAnimationFrame */
/* hifi-docs-r6-image-studio.jsx — Docs R6 image studio modal (Wave 3 / S6).

   Full-bleed modal opened by clicking any image-bearing embed in a doc.
   Tools (left rail): Annotate (pen) · Text (overlay) · COOPR Score · Crop.
   Save back to doc replaces the embed src; Save to Media pushes to drawer.
   No stickers (per locked decision).

   Public API (window):
     HF_DocsImageStudio.openWith(srcUrl, opts?)
     HF_DocsImageStudio.close()
     HF_DocsImageStudio                          // React component
*/

(function () {
  'use strict';
  if (window.__DOCS_R6_IMG_STUDIO_BOOTED__) return;
  window.__DOCS_R6_IMG_STUDIO_BOOTED__ = true;

  // ── State + listeners ──
  const state = { open: false, src: null, embedId: null };
  const listeners = new Set();
  function notify() { listeners.forEach(cb => { try { cb({ ...state }); } catch (e) {} }); }

  function openWith(src, opts) {
    if (!src) return;
    state.open = true;
    state.src = src;
    state.embedId = (opts && opts.embedId) || null;
    notify();
  }
  function close() {
    if (!state.open) return;
    state.open = false; state.src = null; state.embedId = null;
    notify();
  }

  // ── Click delegation: click on any embed image opens studio ──
  document.addEventListener('click', (e) => {
    const t = e.target;
    if (!t || !t.closest) return;
    const action = t.dataset && t.dataset.r6Action;
    if (action) return; // action chips handled elsewhere
    // R5 photo-canvas (uploaded image) or carousel slide with bg-image
    const photo = t.closest('.r5-embed-photo .r5-photo-canvas');
    const slide = t.closest('.r5-carousel-slide');
    if (photo) {
      const bg = window.getComputedStyle(photo).backgroundImage;
      const m = bg && bg.match(/url\("?(.+?)"?\)/);
      if (m && m[1]) {
        const embed = t.closest('[data-r5-embed-id]');
        const eid = embed && embed.getAttribute('data-r5-embed-id');
        e.preventDefault(); e.stopPropagation();
        openWith(m[1], { embedId: eid });
      }
      return;
    }
    if (slide) {
      const bg = window.getComputedStyle(slide).backgroundImage;
      const m = bg && bg.match(/url\("?(.+?)"?\)/);
      if (m && m[1]) {
        const embed = t.closest('[data-r5-embed-id]');
        const eid = embed && embed.getAttribute('data-r5-embed-id');
        e.preventDefault(); e.stopPropagation();
        openWith(m[1], { embedId: eid });
      }
      return;
    }
  }, true);

  // ── CSS ──
  const CSS = `
    .docs-r6-img-scrim {
      position: fixed; inset: 0;
      background: rgba(26,24,21,0.40);
      backdrop-filter: blur(2px);
      z-index: 14;
      opacity: 0;
      pointer-events: none;
      transition: opacity 200ms ease-out;
    }
    .docs-r6-img-scrim.is-open { opacity: 1; pointer-events: auto; }
    .docs-r6-img-modal {
      position: fixed;
      left: 50%; top: 50%;
      transform: translate(-50%, -50%) scale(0.96);
      width: min(80vw, 1280px);
      height: min(80vh, 800px);
      background: var(--surface-1);
      border: 1px solid var(--border-subtle);
      border-radius: 14px;
      box-shadow: 0 32px 80px -24px rgba(26,24,21,0.40);
      z-index: 15;
      display: flex; flex-direction: column;
      opacity: 0;
      pointer-events: none;
      transition: opacity 220ms cubic-bezier(0.2,0.7,0.2,1), transform 220ms cubic-bezier(0.2,0.7,0.2,1);
      font-family: var(--font-sans);
    }
    .docs-r6-img-modal.is-open {
      opacity: 1;
      pointer-events: auto;
      transform: translate(-50%, -50%) scale(1);
    }
    .docs-r6-img-bar {
      height: 52px;
      padding: 0 16px;
      display: flex; align-items: center; gap: 12px;
      border-bottom: 1px solid var(--border-subtle);
      flex-shrink: 0;
    }
    .docs-r6-img-bar-title {
      font-family: var(--font-mono); font-size: 9.5px; font-weight: 600;
      letter-spacing: 0.10em; text-transform: uppercase; color: var(--fg-tertiary);
    }
    .docs-r6-img-bar-btn {
      display: inline-flex; align-items: center;
      height: 30px; padding: 0 12px;
      border: 1px solid var(--border-subtle);
      border-radius: 7px; cursor: pointer;
      font-family: var(--font-sans); font-size: 12px; font-weight: 500;
      color: var(--fg-secondary); background: var(--surface-1);
      transition: background 120ms, color 120ms, border-color 120ms;
    }
    .docs-r6-img-bar-btn:hover { background: var(--surface-2); color: var(--fg-primary); }
    .docs-r6-img-bar-btn.is-primary {
      background: var(--accent-primary); color: var(--fg-on-accent); border-color: var(--accent-primary);
    }
    .docs-r6-img-bar-btn.is-primary:hover { background: var(--accent-primary-press); }
    .docs-r6-img-body {
      display: flex; flex: 1; min-height: 0;
    }
    .docs-r6-img-rail {
      width: 88px;
      border-right: 1px solid var(--border-subtle);
      padding: 12px 8px;
      display: flex; flex-direction: column; gap: 4px;
    }
    .docs-r6-img-tool {
      display: flex; flex-direction: column; align-items: center; gap: 4px;
      padding: 10px 4px;
      border: 1px solid transparent;
      border-radius: 7px; cursor: pointer;
      font-family: var(--font-mono); font-size: 9px; font-weight: 600;
      letter-spacing: 0.10em; text-transform: uppercase;
      color: var(--fg-tertiary);
      transition: background 120ms, color 120ms, border-color 120ms;
    }
    .docs-r6-img-tool:hover { background: var(--surface-2); color: var(--fg-primary); }
    .docs-r6-img-tool.is-active {
      background: var(--accent-soft);
      border-color: var(--accent-primary);
      color: var(--accent-primary);
    }
    .docs-r6-img-canvas-wrap {
      flex: 1; min-width: 0;
      display: flex; align-items: center; justify-content: center;
      padding: 24px;
      background: color-mix(in srgb, var(--surface-2) 60%, var(--surface-1));
      position: relative;
      overflow: hidden;
    }
    .docs-r6-img-canvas {
      max-width: 100%; max-height: 100%;
      box-shadow: 0 12px 28px -12px rgba(26,24,21,0.30);
      position: relative;
    }
    .docs-r6-img-overlay {
      position: absolute; inset: 0;
      pointer-events: auto;
    }
    .docs-r6-img-side {
      width: 280px;
      border-left: 1px solid var(--border-subtle);
      padding: 16px;
      overflow-y: auto;
      flex-shrink: 0;
    }
    .docs-r6-img-options {
      height: 56px; flex-shrink: 0;
      border-top: 1px solid var(--border-subtle);
      padding: 0 16px;
      display: flex; align-items: center; gap: 10px;
    }
    .docs-r6-img-color {
      width: 24px; height: 24px; border-radius: 50%;
      border: 2px solid var(--surface-1);
      box-shadow: 0 0 0 1px var(--border-subtle);
      cursor: pointer;
    }
    .docs-r6-img-color.is-active {
      box-shadow: 0 0 0 2px var(--accent-primary);
    }
    .docs-r6-score-row {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 0;
      border-bottom: 1px solid var(--border-subtle);
    }
    .docs-r6-score-bar {
      flex: 1; height: 4px;
      background: var(--border-subtle); border-radius: 2px;
      overflow: hidden;
    }
    .docs-r6-score-bar-fill {
      height: 100%;
      background: var(--accent-primary);
      transition: width 240ms cubic-bezier(0.2,0.7,0.2,1);
    }
  `;

  function injectCSS() {
    if (document.getElementById('docs-r6-img-style')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'docs-r6-img-style';
    styleEl.textContent = CSS;
    document.head.appendChild(styleEl);
  }

  // ── Modal component ──
  const PALETTE = [
    { name: 'moss',    val: 'var(--accent-primary)' },
    { name: 'amber',   val: 'var(--accent-warning, #c98a3e)' },
    { name: 'rust',    val: 'var(--accent-error, #b34a3a)' },
    { name: 'cocoa',   val: 'var(--fg-primary)' },
  ];

  function HF_DocsImageStudioModal() {
    const [s, setS] = React.useState(state);
    const [tool, setTool] = React.useState('annotate');
    const [aspect, setAspect] = React.useState('free');
    const [color, setColor] = React.useState(0);
    const [stroke, setStroke] = React.useState('m');
    const [scoring, setScoring] = React.useState(false);
    const [scores, setScores] = React.useState(null);
    const [textBoxes, setTextBoxes] = React.useState([]);
    const drawCanvasRef = React.useRef(null);
    const drawing = React.useRef({ active: false, last: null });

    React.useEffect(() => {
      const cb = (next) => setS(next);
      listeners.add(cb);
      return () => { listeners.delete(cb); };
    }, []);

    React.useEffect(() => {
      // Reset state when opening a new image
      if (s.open && s.src) {
        setTool('annotate'); setAspect('free'); setColor(0); setStroke('m');
        setScoring(false); setScores(null); setTextBoxes([]);
      }
    }, [s.open, s.src]);

    React.useEffect(() => {
      if (!s.open) return;
      function onKey(e) {
        if (e.key === 'Escape') { e.preventDefault(); close(); }
      }
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, [s.open]);

    function strokeWidth() {
      return stroke === 's' ? 2 : stroke === 'm' ? 4 : 7;
    }

    function startDraw(e) {
      if (tool !== 'annotate' || !drawCanvasRef.current) return;
      const canvas = drawCanvasRef.current;
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      drawing.current = { active: true, last: { x: e.clientX - rect.left, y: e.clientY - rect.top } };
      ctx.strokeStyle = PALETTE[color].val.includes('var') ? getComputedStyle(canvas).color || PALETTE[color].val : PALETTE[color].val;
      // Resolve var() to a real color
      const tmp = document.createElement('div');
      tmp.style.color = PALETTE[color].val;
      document.body.appendChild(tmp);
      ctx.strokeStyle = window.getComputedStyle(tmp).color;
      tmp.remove();
      ctx.lineWidth = strokeWidth();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
    function moveDraw(e) {
      if (!drawing.current.active) return;
      const canvas = drawCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ctx.beginPath();
      ctx.moveTo(drawing.current.last.x, drawing.current.last.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      drawing.current.last = { x, y };
    }
    function endDraw() { drawing.current.active = false; }

    function onCanvasClick(e) {
      if (tool !== 'text' || !drawCanvasRef.current) return;
      const canvas = drawCanvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setTextBoxes(prev => [...prev, { id: Date.now(), x, y, text: 'Type…', color: PALETTE[color].val, size: 24 }]);
    }

    function clearAnnotations() {
      const canvas = drawCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      setTextBoxes([]);
    }

    function runCooprScore() {
      setScoring(true);
      setScores(null);
      setTimeout(() => {
        setScores({
          composition: 70 + Math.floor(Math.random() * 25),
          hook: 55 + Math.floor(Math.random() * 30),
          brand: 80 + Math.floor(Math.random() * 18),
          legibility: 65 + Math.floor(Math.random() * 25),
        });
        setScoring(false);
      }, 1200);
    }

    function saveBackToDoc() {
      const toaster = window.__DOCS_R6_PUSH_TOAST || ((m) => { try { console.log(m); } catch (_) {} });
      const drawCanvas = drawCanvasRef.current;
      if (!drawCanvas || !s.src) { close(); return; }
      // Build an offscreen canvas matching the source image's natural aspect.
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const out = document.createElement('canvas');
        const W = img.naturalWidth || 1200;
        const H = img.naturalHeight || 750;
        out.width = W; out.height = H;
        const ctx = out.getContext('2d');
        // Layer 1: source image
        try { ctx.drawImage(img, 0, 0, W, H); } catch (e) { /* CORS — fall through */ }
        // Layer 2: annotations canvas — scale draw canvas (1200x750 logical) to source
        try { ctx.drawImage(drawCanvas, 0, 0, W, H); } catch (e) { /* swallow */ }
        // Layer 3: text boxes — re-render at scale
        const tcRect = drawCanvas.getBoundingClientRect();
        const xScale = W / tcRect.width;
        const yScale = H / tcRect.height;
        textBoxes.forEach(tb => {
          const inputs = document.querySelectorAll('.docs-r6-img-modal input');
          let val = tb.text || '';
          inputs.forEach(inp => {
            const off = inp.getBoundingClientRect();
            // Crude: match by approximate position
            if (Math.abs(off.left - (tcRect.left + tb.x)) < 3 && Math.abs(off.top - (tcRect.top + tb.y)) < 3) {
              val = inp.value || tb.text;
            }
          });
          // Resolve the var() color
          const tmp = document.createElement('div');
          tmp.style.color = tb.color;
          document.body.appendChild(tmp);
          const real = window.getComputedStyle(tmp).color;
          tmp.remove();
          ctx.fillStyle = real;
          ctx.font = '600 ' + (tb.size * xScale) + 'px ' + 'serif';
          ctx.fillText(val, tb.x * xScale, (tb.y * yScale) + (tb.size * yScale * 0.9));
        });
        let dataUrl;
        try { dataUrl = out.toDataURL('image/jpeg', 0.92); } catch (err) {
          toaster('Save failed · image source blocked by CORS');
          close();
          return;
        }
        // Find the parent embed and replace its photo-canvas background-image
        if (s.embedId) {
          const embed = document.querySelector('[data-r5-embed-id="' + s.embedId + '"]');
          if (embed) {
            const photoCanvas = embed.querySelector('.r5-photo-canvas');
            if (photoCanvas) {
              photoCanvas.style.backgroundImage = 'url("' + dataUrl + '")';
            } else {
              // Carousel slide — try the bg
              const slide = embed.querySelector('.r5-carousel-slide[style*="backgroundImage"]');
              if (slide) slide.style.backgroundImage = 'url("' + dataUrl + '")';
            }
            // Trigger localStorage save by dispatching input event on the editable.
            const editable = embed.closest('[contenteditable="true"]');
            if (editable) editable.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }
        toaster('Saved · annotations baked back into doc image');
        close();
      };
      img.onerror = () => {
        toaster('Save failed · image load error');
        close();
      };
      img.src = s.src;
    }

    function saveToMediaDrawer() {
      const toaster = window.__DOCS_R6_PUSH_TOAST || ((m) => { try { console.log(m); } catch (_) {} });
      if (window.HF_DocsMediaDrawerAdd) {
        window.HF_DocsMediaDrawerAdd({ src: s.src, kind: 'photo', source: 'image-studio' });
        toaster('Saved to Media · drawer');
      } else {
        toaster('Saved to Media (drawer not loaded · phase-2)');
      }
    }

    if (!s.open) {
      return React.createElement(React.Fragment, null,
        React.createElement('div', { className: 'docs-r6-img-scrim' }),
        React.createElement('div', { className: 'docs-r6-img-modal' })
      );
    }

    return (
      <React.Fragment>
        <div className={'docs-r6-img-scrim is-open'} onClick={close} />
        <div className={'docs-r6-img-modal is-open'} role="dialog" aria-label="Image studio">
          {/* Top bar */}
          <div className="docs-r6-img-bar">
            <span
              className="docs-r6-img-bar-btn"
              onClick={close}
              title="Close">
              <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
                <path d="M8 2 L4 6 L8 10" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ marginLeft: 6 }}>Close</span>
            </span>
            <span className="docs-r6-img-bar-title">Image studio · {tool}</span>
            <span style={{ flex: 1 }} />
            <span className="docs-r6-img-bar-btn" onClick={clearAnnotations}>Clear</span>
            <span className="docs-r6-img-bar-btn" onClick={saveToMediaDrawer}>Save to Media</span>
            <span className="docs-r6-img-bar-btn is-primary" onClick={saveBackToDoc}>Save to doc</span>
          </div>

          {/* Body: tool rail + canvas + side panel */}
          <div className="docs-r6-img-body">
            {/* Tool rail */}
            <div className="docs-r6-img-rail">
              {[
                { id: 'annotate', label: 'Annotate' },
                { id: 'text',     label: 'Text' },
                { id: 'score',    label: 'COOPR' },
                { id: 'crop',     label: 'Crop' },
              ].map(t => (
                <div
                  key={t.id}
                  className={'docs-r6-img-tool' + (tool === t.id ? ' is-active' : '')}
                  onClick={() => setTool(t.id)}>
                  <span style={{ fontSize: 14, lineHeight: 1 }}>
                    {t.id === 'annotate' && <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 13 L3 11 L11 3 L13 5 L5 13 Z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round"/></svg>}
                    {t.id === 'text' && <span style={{ fontFamily: 'var(--font-serif)', fontSize: 14, fontWeight: 700, fontStyle: 'italic' }}>T</span>}
                    {t.id === 'score' && <span style={{ fontFamily: 'var(--font-serif)', fontSize: 14 }}>✦</span>}
                    {t.id === 'crop' && <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 5 L3 13 L11 13 M5 3 L13 3 L13 11" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round"/></svg>}
                  </span>
                  <span>{t.label}</span>
                </div>
              ))}
            </div>

            {/* Canvas */}
            <div className="docs-r6-img-canvas-wrap">
              <div className="docs-r6-img-canvas" style={{ position: 'relative' }}>
                <img src={s.src} alt="" style={{ display: 'block', maxWidth: '100%', maxHeight: '60vh' }} />
                <canvas
                  ref={drawCanvasRef}
                  width={1200}
                  height={750}
                  style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%',
                    cursor: tool === 'annotate' ? 'crosshair' : tool === 'text' ? 'text' : 'default',
                    pointerEvents: tool === 'score' || tool === 'crop' ? 'none' : 'auto',
                  }}
                  onMouseDown={startDraw}
                  onMouseMove={moveDraw}
                  onMouseUp={endDraw}
                  onMouseLeave={endDraw}
                  onClick={onCanvasClick}
                />
                {textBoxes.map(tb => (
                  <input
                    key={tb.id}
                    defaultValue={tb.text}
                    style={{
                      position: 'absolute', left: tb.x, top: tb.y,
                      fontFamily: 'var(--font-serif)', fontSize: tb.size, fontWeight: 600,
                      color: tb.color, background: 'transparent', border: 'none', outline: 'none',
                      padding: 4,
                      textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Right side panel — only when COOPR Score active */}
            {tool === 'score' && (
              <div className="docs-r6-img-side">
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', marginBottom: 14 }}>COOPR · image score</div>
                {!scores && !scoring && (
                  <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 13, color: 'var(--fg-tertiary)', lineHeight: 1.5, marginBottom: 18 }}>Run analysis on this image. Composition, hook strength, brand fit, text legibility.</div>
                )}
                {scoring && (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-secondary)' }}>Scoring…</div>
                )}
                {scores && (
                  <div>
                    {[
                      { k: 'composition', label: 'Composition' },
                      { k: 'hook', label: 'Hook strength' },
                      { k: 'brand', label: 'Brand fit' },
                      { k: 'legibility', label: 'Text legibility' },
                    ].map(row => (
                      <div className="docs-r6-score-row" key={row.k}>
                        <span style={{ flex: 0, minWidth: 110, fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-secondary)' }}>{row.label}</span>
                        <span className="docs-r6-score-bar"><span className="docs-r6-score-bar-fill" style={{ width: scores[row.k] + '%' }} /></span>
                        <span style={{ minWidth: 36, textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: 'var(--fg-primary)' }}>{scores[row.k]}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: 14, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 12.5, color: 'var(--fg-secondary)', lineHeight: 1.5 }}>
                      Tighten composition · crop ~15% from the right · text legibility lifts from {scores.legibility} to ~{Math.min(95, scores.legibility + 18)}.
                    </div>
                  </div>
                )}
                <span
                  className="docs-r6-img-bar-btn is-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}
                  onClick={runCooprScore}>
                  {scores ? 'Re-run' : 'Run COOPR analysis'}
                </span>
              </div>
            )}
          </div>

          {/* Bottom options strip — varies by tool */}
          <div className="docs-r6-img-options">
            {(tool === 'annotate' || tool === 'text') && (
              <React.Fragment>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>Color</span>
                {PALETTE.map((c, i) => (
                  <span
                    key={c.name}
                    className={'docs-r6-img-color' + (color === i ? ' is-active' : '')}
                    style={{ background: c.val }}
                    onClick={() => setColor(i)}
                    title={c.name}
                  />
                ))}
              </React.Fragment>
            )}
            {tool === 'annotate' && (
              <React.Fragment>
                <span style={{ marginLeft: 14, fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>Width</span>
                {['s','m','l'].map(w => (
                  <span key={w}
                    className={'docs-r6-img-bar-btn' + (stroke === w ? ' is-primary' : '')}
                    style={{ height: 26, padding: '0 9px', textTransform: 'uppercase', fontSize: 10 }}
                    onClick={() => setStroke(w)}>{w}</span>
                ))}
              </React.Fragment>
            )}
            {tool === 'crop' && (
              <React.Fragment>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>Aspect</span>
                {['free', '1:1', '4:5', '9:16', '16:9'].map(a => (
                  <span key={a}
                    className={'docs-r6-img-bar-btn' + (aspect === a ? ' is-primary' : '')}
                    style={{ height: 26, padding: '0 11px', fontSize: 11 }}
                    onClick={() => setAspect(a)}>{a}</span>
                ))}
              </React.Fragment>
            )}
            {tool === 'score' && (
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 12.5, color: 'var(--fg-tertiary)' }}>
                COOPR analyzes composition, hook framing, brand fit, and text legibility.
              </span>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }

  // ── Mount ──
  function mount() {
    if (!document.body) { requestAnimationFrame(mount); return; }
    if (typeof React === 'undefined' || typeof ReactDOM === 'undefined' || !ReactDOM.createRoot) {
      requestAnimationFrame(mount); return;
    }
    injectCSS();
    let host = document.getElementById('docs-r6-img-host');
    if (!host) {
      host = document.createElement('div');
      host.id = 'docs-r6-img-host';
      document.body.appendChild(host);
    }
    const root = ReactDOM.createRoot(host);
    root.render(<HF_DocsImageStudioModal />);
  }
  mount();

  Object.assign(window, {
    HF_DocsImageStudio: { openWith, close },
    HF_DocsImageStudioModal,
  });
})();
