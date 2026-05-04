/* global window, document, fetch */
/* hifi-cohesion-r9-tweaks-channel.jsx — Cohesion R9 Wave 3 / I4
   Unified tweaks → master token-override channel.

   Two sources of locked-token state, read on master boot:
     1. localStorage['cb-locked-tokens']   — session/per-browser overrides
     2. locked-tokens.json (repo file)     — committable, cross-browser baseline

   Conflict rule: JSON file wins on key conflict (last-write-wins by axis),
   so a committed lock survives across browsers/sessions while still allowing
   local experimentation via the tweaks gallery's "Lock in" button.

   Write path: tweaks gallery snapshots all `tweaks.v11.*` keys into a single
   JSON object, writes it to localStorage['cb-locked-tokens'], and re-injects
   the global :root style so changes apply without reload.

   Apply path: a single <style id="cb-locked-tokens-style"> element is created
   in document.head with rules under :root. This is GLOBAL (not iframe-scoped)
   so the master shell, every surface, and any nested iframe inheriting :root
   picks up the override.

   Token mapping below is a SCAFFOLD covering the most-changed axes from the R2
   audit (accent, headline font, density, warmth). Extend by adding more axis
   branches as more axes need wiring. */

(function () {
  // ─── Token mapping · axis selection → CSS var rule strings ─────────
  // Returns a flat array of CSS declarations (no selector wrap).
  // Each branch maps a single axis value to one or more --var declarations.
  // Keep this pure — no DOM access, no side effects.
  function mapTokensToCssRules(tokenObj) {
    const t = tokenObj || {};
    const cssRules = [];

    // ── Accent · primary brand colour family ──
    if (t.accent === 'moss') {
      cssRules.push('--accent-primary: #5a6a3a;');
      cssRules.push('--accent-primary-hover: #485834;');
      cssRules.push('--accent-primary-press: #36462a;');
    } else if (t.accent === 'clay') {
      cssRules.push('--accent-primary: #b8754a;');
      cssRules.push('--accent-primary-hover: #9a5e3a;');
      cssRules.push('--accent-primary-press: #7a4a2c;');
    } else if (t.accent === 'cocoa') {
      cssRules.push('--accent-primary: #6b4a32;');
      cssRules.push('--accent-primary-hover: #553a26;');
      cssRules.push('--accent-primary-press: #3f2a1a;');
    } else if (t.accent === 'rust') {
      cssRules.push('--accent-primary: #a3382b;');
      cssRules.push('--accent-primary-hover: #832a20;');
      cssRules.push('--accent-primary-press: #631e16;');
    }

    // ── Headline font stack · serif family ──
    if (t.fontHeadline === 'literata') {
      cssRules.push("--font-serif: 'Literata', 'Newsreader', 'Charter', serif;");
    } else if (t.fontHeadline === 'newsreader') {
      cssRules.push("--font-serif: 'Newsreader', 'Literata', 'Charter', serif;");
    } else if (t.fontHeadline === 'charter') {
      cssRules.push("--font-serif: 'Charter', 'Literata', 'Newsreader', serif;");
    }

    // ── Body font stack · sans family ──
    if (t.fontBody === 'inter-tight') {
      cssRules.push("--font-sans: 'Inter Tight', 'Plus Jakarta Sans', system-ui, sans-serif;");
    } else if (t.fontBody === 'plus-jakarta') {
      cssRules.push("--font-sans: 'Plus Jakarta Sans', 'Inter Tight', system-ui, sans-serif;");
    }

    // ── Warmth · base background tint family ──
    if (t.warmth === 'ivory') {
      cssRules.push('--bg-base: #fbfaf6;');
      cssRules.push('--surface-1: #fefdf9;');
      cssRules.push('--surface-2: #f5f3ec;');
      cssRules.push('--surface-3: #ece9df;');
    } else if (t.warmth === 'parchment') {
      cssRules.push('--bg-base: #f8f4ea;');
      cssRules.push('--surface-1: #fbf8f0;');
      cssRules.push('--surface-2: #f1ecdf;');
      cssRules.push('--surface-3: #e7e0d0;');
    } else if (t.warmth === 'cool-paper') {
      cssRules.push('--bg-base: #f6f7f8;');
      cssRules.push('--surface-1: #fbfbfc;');
      cssRules.push('--surface-2: #eceef1;');
      cssRules.push('--surface-3: #dfe2e6;');
    }

    // ── Density · scale on root for compounding rems ──
    // Density is normally an iframe transform in tweaks; for global lock
    // we nudge the root font-size so all rem-based spacing/typography flexes.
    if (t.density === 'tight')        cssRules.push('font-size: 15px;');
    else if (t.density === 'comfortable') cssRules.push('font-size: 16px;');
    else if (t.density === 'spacious')    cssRules.push('font-size: 17px;');
    else if (t.density === 'editorial')   cssRules.push('font-size: 18px;');

    // ── Radius · global radius scale ──
    if (t.radius === 'sharp') {
      cssRules.push('--radius-sm: 2px;');
      cssRules.push('--radius-md: 4px;');
      cssRules.push('--radius-lg: 6px;');
      cssRules.push('--radius-xl: 8px;');
      cssRules.push('--radius-2xl: 10px;');
    } else if (t.radius === 'soft') {
      cssRules.push('--radius-sm: 6px;');
      cssRules.push('--radius-md: 10px;');
      cssRules.push('--radius-lg: 14px;');
      cssRules.push('--radius-xl: 18px;');
      cssRules.push('--radius-2xl: 24px;');
    }

    // Pass-through: any token whose key starts with `--` is treated as a raw
    // CSS variable declaration. Lets the JSON file (or future tweak-stack
    // snapshots) lock arbitrary tokens without growing the mapping above.
    for (const k in t) {
      if (k.indexOf('--') === 0 && t[k] != null) {
        cssRules.push(`${k}: ${t[k]};`);
      }
    }

    return cssRules;
  }

  const channel = {
    // Read both sources, JSON file wins on key conflict.
    read: async () => {
      let json = {};
      try {
        const r = await fetch('locked-tokens.json', { cache: 'no-store' });
        if (r.ok) {
          const parsed = await r.json();
          // Strip non-token meta keys (e.g. `_comment`).
          for (const k in parsed) {
            if (k.charAt(0) !== '_') json[k] = parsed[k];
          }
        }
      } catch (e) { /* file missing or unreachable — fall through */ }
      let local = {};
      try {
        const v = window.localStorage.getItem('cb-locked-tokens');
        if (v) local = JSON.parse(v);
      } catch (e) { /* corrupt JSON — ignore */ }
      // JSON file wins on key conflict (spread JSON last).
      return Object.assign({}, local, json);
    },

    // Write to localStorage from tweaks "Lock in" button. Re-applies live.
    write: (tokenObj) => {
      try {
        window.localStorage.setItem('cb-locked-tokens', JSON.stringify(tokenObj || {}));
      } catch (e) { /* quota/disabled — ignore */ }
      // Re-inject globally so changes apply without reload.
      channel.applyToRoot(tokenObj || {});
    },

    // Apply tokens as a <style> injection at :root (global, not iframe-scoped).
    applyToRoot: (tokenObj) => {
      let style = document.getElementById('cb-locked-tokens-style');
      if (!style) {
        style = document.createElement('style');
        style.id = 'cb-locked-tokens-style';
        document.head.appendChild(style);
      }
      const cssRules = mapTokensToCssRules(tokenObj || {});
      style.textContent = `:root { ${cssRules.join(' ')} }`;
    },

    // Convenience: read + apply on boot. Idempotent — safe to call twice.
    bootApply: async () => {
      const tokens = await channel.read();
      if (!tokens || Object.keys(tokens).length === 0) return;
      channel.applyToRoot(tokens);
    },

    // Exposed for testing / debugging — pure pipeline check.
    _mapTokensToCssRules: mapTokensToCssRules,
  };

  Object.assign(window, { cohesionR9TokensChannel: channel });
})();
