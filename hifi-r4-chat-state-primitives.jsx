/* global React, window, document, Icon, ProgressBar, ChannelChip, AvatarDisc */
/* hifi-r4-chat-state-primitives.jsx - R4G shared realism states for chat-first prototype. */

function ensureR4GChatStateStyles() {
  if (typeof document === 'undefined' || document.getElementById('r4g-chat-state-styles')) return;
  const style = document.createElement('style');
  style.id = 'r4g-chat-state-styles';
  style.textContent = `
    @keyframes r4g-state-pulse { 0%,100% { opacity: .58; transform: scale(.92); } 50% { opacity: 1; transform: scale(1); } }
    @keyframes r4g-state-sweep { from { transform: translateX(-105%); } to { transform: translateX(105%); } }
    .r4g-state-card { border: 1px solid var(--border-subtle); border-radius: 8px; background: color-mix(in srgb, var(--surface-1) 88%, var(--bg-base)); padding: 11px 12px; display: flex; flex-direction: column; gap: 9px; min-width: 0; }
    .r4g-state-card[data-compact="1"] { padding: 9px 10px; gap: 7px; }
    .r4g-state-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; min-width: 0; }
    .r4g-state-title { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
    .r4g-state-title strong { font-family: var(--font-serif); font-style: italic; font-size: 15px; font-weight: 700; line-height: 1.16; color: var(--fg-primary); letter-spacing: -0.01em; overflow-wrap: anywhere; }
    .r4g-state-title span, .r4g-state-note { font-family: var(--font-mono); font-size: 8.8px; font-weight: 800; letter-spacing: .07em; line-height: 1.35; text-transform: uppercase; color: var(--fg-tertiary); overflow-wrap: anywhere; }
    .r4g-state-copy { margin: 0; font-family: var(--font-serif); font-size: 12.7px; line-height: 1.38; color: var(--fg-secondary); overflow-wrap: anywhere; }
    .r4g-state-pill { display: inline-flex; align-items: center; gap: 5px; min-height: 20px; max-width: 100%; padding: 0 8px; border-radius: 999px; border: 1px solid var(--border-subtle); background: var(--surface-2); color: var(--fg-secondary); font-family: var(--font-mono); font-size: 8.5px; font-weight: 900; letter-spacing: .07em; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex-shrink: 0; }
    .r4g-state-pill[data-state="active"], .r4g-state-pill[data-state="uploading"], .r4g-state-pill[data-state="processing"], .r4g-state-pill[data-state="running"] { background: var(--accent-soft); color: var(--accent-primary-press); border-color: transparent; }
    .r4g-state-pill[data-state="ready"], .r4g-state-pill[data-state="done"] { background: var(--accent-soft); color: var(--accent-primary-press); border-color: transparent; }
    .r4g-state-pill[data-state="partial"], .r4g-state-pill[data-state="auth"], .r4g-state-pill[data-state="retry"], .r4g-state-pill[data-state="approval"] { background: var(--tone-warning-bg); color: var(--tone-warning); border-color: transparent; }
    .r4g-state-pill[data-state="error"], .r4g-state-pill[data-state="failed"] { background: var(--tone-danger-bg); color: var(--tone-danger); border-color: transparent; }
    .r4g-state-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
    .r4g-state-pill[data-live="1"] .r4g-state-dot { animation: r4g-state-pulse 940ms ease-in-out infinite; }
    .r4g-state-list { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
    .r4g-state-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(38px, auto); gap: 8px; align-items: center; min-width: 0; padding-top: 6px; border-top: 1px dotted var(--border-subtle); }
    .r4g-state-row:first-child { border-top: 0; padding-top: 0; }
    .r4g-state-row-main { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
    .r4g-state-row-main strong { font-family: var(--font-sans); font-size: 12px; line-height: 1.18; color: var(--fg-primary); font-weight: 700; overflow-wrap: anywhere; }
    .r4g-state-row-main span { font-family: var(--font-mono); font-size: 8.4px; color: var(--fg-tertiary); letter-spacing: .05em; text-transform: uppercase; line-height: 1.35; overflow-wrap: anywhere; }
    .r4g-state-strip { border: 1px solid var(--border-subtle); border-radius: 8px; background: color-mix(in srgb, var(--surface-1) 86%, var(--surface-2)); padding: 8px; display: flex; flex-direction: column; gap: 7px; min-width: 0; }
    .r4g-state-strip-head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; min-width: 0; }
    .r4g-state-strip-head strong { font-family: var(--font-serif); font-style: italic; font-size: 13.4px; font-weight: 700; line-height: 1.15; color: var(--fg-primary); }
    .r4g-state-strip-head span { font-family: var(--font-mono); font-size: 8.2px; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; color: var(--fg-tertiary); }
    .r4g-state-strip-row { display: grid; grid-template-columns: repeat(var(--r4g-strip-count, 5), minmax(0, 1fr)); gap: 5px; min-width: 0; }
    .r4g-state-strip-item { min-width: 0; border: 1px solid var(--border-subtle); border-radius: 6px; background: var(--surface-2); padding: 6px; display: flex; flex-direction: column; gap: 3px; }
    .r4g-state-strip-item[data-state="active"], .r4g-state-strip-item[data-state="uploading"], .r4g-state-strip-item[data-state="processing"], .r4g-state-strip-item[data-state="ready"], .r4g-state-strip-item[data-state="done"] { background: var(--accent-soft); border-color: transparent; }
    .r4g-state-strip-item[data-state="partial"], .r4g-state-strip-item[data-state="auth"], .r4g-state-strip-item[data-state="retry"], .r4g-state-strip-item[data-state="approval"] { background: var(--tone-warning-bg); border-color: transparent; }
    .r4g-state-strip-item[data-state="error"], .r4g-state-strip-item[data-state="failed"] { background: var(--tone-danger-bg); border-color: transparent; }
    .r4g-state-strip-item strong { font-family: var(--font-mono); font-size: 7.8px; font-weight: 900; letter-spacing: .06em; text-transform: uppercase; color: var(--fg-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .r4g-state-strip-item span { font-family: var(--font-serif); font-size: 10.6px; line-height: 1.2; color: var(--fg-secondary); overflow-wrap: anywhere; }
    .r4g-latency-rail { border: 1px solid var(--border-subtle); border-radius: 8px; background: var(--surface-1); padding: 10px; display: flex; flex-direction: column; gap: 8px; min-width: 0; }
    .r4g-latency-rail[data-compact="1"] { padding: 8px; gap: 6px; }
    .r4g-latency-grid { display: grid; grid-template-columns: repeat(var(--r4g-step-count, 4), minmax(0, 1fr)); gap: 8px; min-width: 0; }
    .r4g-latency-step { position: relative; min-width: 0; display: flex; flex-direction: column; gap: 5px; padding: 8px 8px 7px; border-radius: 7px; border: 1px solid var(--border-subtle); background: var(--surface-2); overflow: hidden; }
    .r4g-latency-step::before { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent-soft) 68%, transparent), transparent); transform: translateX(-105%); opacity: 0; pointer-events: none; }
    .r4g-latency-step[data-state="active"] { border-color: var(--accent-ring); background: color-mix(in srgb, var(--accent-soft) 70%, var(--surface-1)); }
    .r4g-latency-step[data-state="active"]::before { opacity: .8; animation: r4g-state-sweep 1100ms ease-in-out infinite; }
    .r4g-latency-step[data-state="done"] { background: var(--accent-soft); border-color: transparent; }
    .r4g-latency-step[data-state="partial"], .r4g-latency-step[data-state="retry"], .r4g-latency-step[data-state="approval"] { background: var(--tone-warning-bg); border-color: transparent; }
    .r4g-latency-step[data-state="error"], .r4g-latency-step[data-state="failed"] { background: var(--tone-danger-bg); border-color: transparent; }
    .r4g-latency-top { display: flex; align-items: center; justify-content: space-between; gap: 6px; min-width: 0; position: relative; z-index: 1; }
    .r4g-latency-label { min-width: 0; font-family: var(--font-mono); font-size: 8.6px; font-weight: 900; letter-spacing: .07em; text-transform: uppercase; color: var(--fg-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .r4g-latency-step[data-state="done"] .r4g-latency-label, .r4g-latency-step[data-state="active"] .r4g-latency-label { color: var(--accent-primary-press); }
    .r4g-latency-step[data-state="partial"] .r4g-latency-label, .r4g-latency-step[data-state="retry"] .r4g-latency-label, .r4g-latency-step[data-state="approval"] .r4g-latency-label { color: var(--tone-warning); }
    .r4g-latency-step[data-state="error"] .r4g-latency-label, .r4g-latency-step[data-state="failed"] .r4g-latency-label { color: var(--tone-danger); }
    .r4g-latency-meta { position: relative; z-index: 1; font-family: var(--font-serif); font-size: 11.8px; line-height: 1.25; color: var(--fg-secondary); overflow-wrap: anywhere; }
    .r4g-media-card { border: 1px solid var(--border-subtle); border-radius: 8px; background: var(--surface-1); padding: 11px; display: flex; flex-direction: column; gap: 9px; min-width: 0; overflow: hidden; }
    .r4g-media-card[data-state="entry"] { border-style: dashed; background: color-mix(in srgb, var(--surface-2) 70%, var(--surface-1)); }
    .r4g-media-card[data-state="partial"], .r4g-media-card[data-state="auth"] { background: var(--tone-warning-bg); }
    .r4g-media-card[data-state="error"], .r4g-media-card[data-state="failed"] { background: var(--tone-danger-bg); }
    .r4g-media-drop { display: grid; grid-template-columns: 38px minmax(0, 1fr) auto; gap: 10px; align-items: center; min-width: 0; }
    .r4g-media-icon { width: 34px; height: 34px; border-radius: 8px; background: var(--surface-2); color: var(--accent-primary); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .r4g-media-card[data-state="uploading"] .r4g-media-icon, .r4g-media-card[data-state="processing"] .r4g-media-icon { background: var(--accent-soft); }
    .r4g-media-card[data-state="partial"] .r4g-media-icon, .r4g-media-card[data-state="auth"] .r4g-media-icon { color: var(--tone-warning); background: color-mix(in srgb, var(--tone-warning-bg) 70%, var(--surface-1)); }
    .r4g-media-card[data-state="error"] .r4g-media-icon, .r4g-media-card[data-state="failed"] .r4g-media-icon { color: var(--tone-danger); background: color-mix(in srgb, var(--tone-danger-bg) 70%, var(--surface-1)); }
    .r4g-media-title { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
    .r4g-media-title strong { font-family: var(--font-serif); font-style: italic; font-size: 15.4px; line-height: 1.15; color: var(--fg-primary); letter-spacing: -0.01em; overflow-wrap: anywhere; }
    .r4g-media-title span { font-family: var(--font-mono); font-size: 8.5px; font-weight: 800; color: var(--fg-tertiary); letter-spacing: .06em; text-transform: uppercase; overflow-wrap: anywhere; line-height: 1.35; }
    .r4g-media-files { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
    .r4g-media-file { display: grid; grid-template-columns: minmax(82px, 128px) minmax(0, 1fr) 38px; gap: 8px; align-items: center; min-width: 0; padding-top: 6px; border-top: 1px dotted var(--border-subtle); }
    .r4g-media-file:first-child { border-top: 0; padding-top: 0; }
    .r4g-media-file-name { min-width: 0; font-family: var(--font-sans); font-size: 12px; font-weight: 700; color: var(--fg-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .r4g-media-file-meta { min-width: 0; font-family: var(--font-mono); font-size: 8.3px; letter-spacing: .05em; text-transform: uppercase; color: var(--fg-tertiary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .r4g-media-stage-row { display: grid; grid-template-columns: repeat(var(--r4g-stage-count, 4), minmax(0, 1fr)); gap: 6px; min-width: 0; }
    .r4g-media-stage { min-width: 0; display: flex; flex-direction: column; gap: 4px; padding: 7px; border-radius: 6px; border: 1px solid var(--border-subtle); background: color-mix(in srgb, var(--surface-2) 82%, var(--surface-1)); }
    .r4g-media-stage[data-state="done"] { background: var(--accent-soft); border-color: transparent; }
    .r4g-media-stage[data-state="active"] { border-color: var(--accent-ring); background: color-mix(in srgb, var(--accent-soft) 68%, var(--surface-1)); }
    .r4g-media-stage[data-state="partial"], .r4g-media-stage[data-state="retry"] { background: var(--tone-warning-bg); border-color: transparent; }
    .r4g-media-stage[data-state="error"], .r4g-media-stage[data-state="failed"] { background: var(--tone-danger-bg); border-color: transparent; }
    .r4g-media-stage strong { font-family: var(--font-mono); font-size: 8.1px; font-weight: 900; letter-spacing: .06em; text-transform: uppercase; color: var(--fg-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .r4g-media-stage span { font-family: var(--font-serif); font-size: 11.2px; color: var(--fg-secondary); line-height: 1.25; overflow-wrap: anywhere; }
    .r4g-profile-card { border: 1px solid var(--border-subtle); border-radius: 8px; background: var(--surface-1); padding: 11px; display: flex; flex-direction: column; gap: 10px; min-width: 0; }
    .r4g-profile-card[data-tone="competitor"] { background: color-mix(in srgb, var(--surface-1) 86%, var(--tone-info-bg)); }
    .r4g-profile-head { display: grid; grid-template-columns: 40px minmax(0, 1fr); gap: 6px 10px; align-items: center; min-width: 0; }
    .r4g-profile-avatar { width: 38px; height: 38px; border-radius: 50%; background: var(--surface-ink); color: var(--fg-on-ink); display: inline-flex; align-items: center; justify-content: center; font-family: var(--font-serif); font-style: italic; font-size: 16px; font-weight: 700; box-shadow: inset 0 0 0 1px rgba(255,255,255,.12); }
    .r4g-profile-name { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
    .r4g-profile-name strong { font-family: var(--font-serif); font-style: italic; font-size: 15.5px; line-height: 1.12; font-weight: 700; color: var(--fg-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .r4g-profile-name span { font-family: var(--font-mono); font-size: 9px; font-weight: 800; color: var(--fg-tertiary); letter-spacing: .05em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .r4g-platform-chips { grid-column: 2 / -1; display: inline-flex; gap: 4px; flex-wrap: wrap; justify-content: flex-start; }
    .r4g-profile-stat-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 7px; }
    .r4g-profile-stat { min-width: 0; padding: 8px; border-radius: 6px; background: var(--surface-2); }
    .r4g-profile-stat strong { display: block; font-family: var(--font-serif); font-style: italic; font-size: 17px; line-height: 1; color: var(--fg-primary); font-weight: 700; font-variant-numeric: tabular-nums; }
    .r4g-profile-stat span { display: block; margin-top: 4px; font-family: var(--font-mono); font-size: 7.9px; color: var(--fg-tertiary); font-weight: 800; letter-spacing: .06em; text-transform: uppercase; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .r4g-latest-post { border: 1px solid var(--border-subtle); border-radius: 7px; background: color-mix(in srgb, var(--surface-2) 78%, var(--surface-1)); padding: 8px; display: grid; grid-template-columns: minmax(0, 1fr) minmax(62px, auto); gap: 8px; align-items: center; min-width: 0; }
    .r4g-latest-post strong { font-family: var(--font-serif); font-style: italic; font-size: 13.2px; line-height: 1.2; color: var(--fg-primary); overflow-wrap: anywhere; }
    .r4g-latest-post span { display: block; margin-top: 3px; font-family: var(--font-mono); font-size: 8.2px; color: var(--fg-tertiary); letter-spacing: .05em; text-transform: uppercase; overflow-wrap: anywhere; }
    .r4g-profile-actions, .r4g-hit-actions { display: flex; gap: 6px; flex-wrap: wrap; padding-top: 2px; }
    .r4g-mini-btn { height: 22px; display: inline-flex; align-items: center; gap: 5px; padding: 0 8px; border: 1px solid var(--border-default); border-radius: 999px; background: var(--surface-1); color: var(--fg-primary); font-family: var(--font-sans); font-size: 10.5px; font-weight: 600; cursor: pointer; white-space: nowrap; }
    .r4g-mini-btn:hover { background: var(--surface-2); border-color: var(--border-strong); }
    .r4g-mini-btn[data-active="1"] { background: var(--accent-soft); color: var(--accent-primary-press); border-color: transparent; }
    .r4g-mini-btn[data-warn="1"] { background: var(--tone-warning-bg); color: var(--tone-warning); border-color: transparent; }
    .r4g-hit-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; min-width: 0; }
    .r4g-post-hit { width: 100%; border: 1px solid var(--border-subtle); border-radius: 8px; background: var(--surface-1); padding: 8px; display: grid; grid-template-columns: 92px minmax(0, 1fr); gap: 9px; align-items: stretch; text-align: left; color: inherit; cursor: pointer; min-width: 0; overflow: hidden; }
    .r4g-post-hit:hover { border-color: var(--border-strong); background: color-mix(in srgb, var(--surface-1) 76%, var(--accent-soft)); }
    .r4g-post-hit[data-size="feature"] { grid-template-columns: minmax(118px, 150px) minmax(0, 1fr); padding: 10px; gap: 11px; }
    .r4g-post-hit[data-size="gallery"] { grid-template-columns: 84px minmax(0, 1fr); gap: 8px; padding: 7px; min-height: 152px; }
    .r4g-post-hit[data-size="gallery"][data-shape="feed"], .r4g-post-hit[data-size="gallery"][data-shape="thread"] { grid-template-columns: 104px minmax(0, 1fr); }
    .r4g-hit-visual { display: flex; align-items: center; justify-content: center; min-width: 0; border-radius: 7px; background: var(--surface-2); overflow: hidden; padding: 6px; align-self: stretch; }
    .r4g-hit-visual[data-shape="vertical"] { height: 140px; }
    .r4g-hit-visual[data-shape="horizontal"] { height: 86px; align-self: start; }
    .r4g-hit-visual[data-shape="square"] { height: 108px; }
    .r4g-hit-visual[data-shape="feed"] { height: 128px; }
    .r4g-hit-visual[data-shape="thread"] { height: 128px; align-items: flex-start; padding: 0; background: transparent; }
    .r4g-post-hit[data-size="feature"] .r4g-hit-visual { min-height: 154px; }
    .r4g-post-hit[data-size="gallery"] .r4g-hit-visual[data-shape="vertical"] { height: 132px; }
    .r4g-post-hit[data-size="gallery"] .r4g-hit-visual[data-shape="horizontal"] { height: 74px; }
    .r4g-post-hit[data-size="gallery"] .r4g-hit-visual[data-shape="square"] { height: 106px; }
    .r4g-post-hit[data-size="gallery"] .r4g-hit-visual[data-shape="feed"] { height: 132px; }
    .r4g-post-hit[data-size="gallery"] .r4g-hit-visual[data-shape="thread"] { height: 132px; }
    .r4g-hit-inner { width: 100%; min-width: 0; max-height: 100%; overflow: hidden; }
    .r4g-hit-visual[data-shape="vertical"] .r4g-hit-inner { width: 76px; max-width: 100%; }
    .r4g-hit-visual[data-shape="feed"] .r4g-hit-inner { width: 96px; max-width: 100%; }
    .r4g-hit-visual[data-shape="square"] .r4g-hit-inner { width: 96px; max-width: 100%; }
    .r4g-hit-visual[data-shape="horizontal"] .r4g-hit-inner, .r4g-hit-visual[data-shape="thread"] .r4g-hit-inner { width: 100%; }
    .r4g-hit-body { min-width: 0; display: flex; flex-direction: column; gap: 6px; overflow: hidden; }
    .r4g-hit-kicker { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; min-width: 0; }
    .r4g-hit-title { font-family: var(--font-serif); font-style: italic; font-size: 13.6px; line-height: 1.18; font-weight: 700; color: var(--fg-primary); overflow-wrap: anywhere; }
    .r4g-post-hit[data-size="feature"] .r4g-hit-title { font-size: 16px; }
    .r4g-post-hit[data-size="gallery"] .r4g-hit-title { font-size: 12.8px; line-height: 1.14; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .r4g-hit-meta { font-family: var(--font-mono); font-size: 8.4px; color: var(--fg-tertiary); letter-spacing: .05em; line-height: 1.35; text-transform: uppercase; overflow-wrap: anywhere; }
    .r4g-hit-stats { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; min-width: 0; margin-top: auto; }
    .r4g-post-hit[data-size="gallery"] .r4g-hit-stats { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 4px; }
    .r4g-hit-stat { min-width: 0; padding: 6px; border-radius: 5px; background: var(--surface-2); }
    .r4g-post-hit[data-size="gallery"] .r4g-hit-stat { padding: 4px; }
    .r4g-hit-stat strong { display: block; font-family: var(--font-mono); font-size: 10px; font-weight: 900; color: var(--accent-primary); font-variant-numeric: tabular-nums; }
    .r4g-hit-stat span { display: block; margin-top: 2px; font-family: var(--font-mono); font-size: 7.6px; color: var(--fg-tertiary); letter-spacing: .05em; text-transform: uppercase; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .r4g-post-hit[data-size="gallery"] .r4g-hit-meta { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .r4g-post-hit[data-size="gallery"] .r4g-hit-actions { margin-top: 0; flex-wrap: nowrap; }
    .r4g-inline-preview { border: 1px solid var(--border-subtle); border-radius: 8px; background: color-mix(in srgb, var(--surface-1) 90%, var(--accent-soft)); padding: 10px; display: flex; flex-direction: column; gap: 8px; min-width: 0; }
    .r4g-inline-preview .r4g-post-hit { border-color: var(--accent-ring); }
    @media (max-width: 900px) {
      .r4g-latency-grid, .r4g-media-stage-row, .r4g-hit-grid { grid-template-columns: 1fr; }
      .r4g-state-strip-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .r4g-post-hit, .r4g-post-hit[data-size="feature"], .r4g-media-drop { grid-template-columns: 1fr; }
      .r4g-profile-stat-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    }
    @media (prefers-reduced-motion: reduce) {
      .r4g-state-pill[data-live="1"] .r4g-state-dot, .r4g-latency-step[data-state="active"]::before { animation: none !important; }
    }
  `;
  document.head.appendChild(style);
}

ensureR4GChatStateStyles();

function r4gClampPct(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

function r4gFmtViews(n) {
  if (window.r4FmtViews) return window.r4FmtViews(n);
  const value = Number(n) || 0;
  if (value >= 1000000) return (value / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (value >= 1000) return Math.round(value / 1000) + 'K';
  return String(value);
}

function r4gPostById(postId) {
  const id = String(postId || '').split('~')[0];
  const data = window.HF_DATA || {};
  return (data.posts || []).find(p => p.id === id) || (data.posts || [])[0] || null;
}

function r4gPostShape(post, variant) {
  const explicit = String(variant || '').toLowerCase();
  if (explicit === 'thread') return 'thread';
  if (explicit === 'feed') return 'feed';
  if (explicit === 'youtube' || explicit === 'long-yt' || explicit === 'horizontal') return 'horizontal';
  if (explicit === 'carousel' || explicit === 'carousel-ig') return 'square';
  const visual = post && window.R4_LIB_VISUALS ? (window.R4_LIB_VISUALS[post.id] || {}) : {};
  const display = String(visual.display || '').toLowerCase();
  if (display === 'long-yt') return 'horizontal';
  if (display === 'carousel-ig') return 'square';
  return 'vertical';
}

function r4gRouteForPost(post, variant, route) {
  if (route) return String(route).replace(/^#?interactive\/library\/catalog\/post\//, '');
  const id = post && post.id ? post.id : '0042';
  const explicit = String(variant || '').toLowerCase();
  if (explicit === 'thread') return `${id}~thread`;
  if (explicit === 'feed') return `${id}~feed`;
  if (explicit === 'youtube' || explicit === 'long-yt' || explicit === 'horizontal') return `${id}~youtube`;
  if (explicit === 'carousel' || explicit === 'carousel-ig') return `${id}~carousel`;
  return id;
}

function r4gOpenPost(route) {
  if (typeof window === 'undefined') return;
  window.location.hash = `#interactive/library/catalog/post/${route}`;
}

function r4gProfileInitial(handle, name) {
  const raw = String(name || handle || 'C').replace('@', '').trim();
  return raw ? raw.slice(0, 1).toUpperCase() : 'C';
}

function R4BStatePill({ label, state = 'ready', live = false, icon = null }) {
  return (
    <span className="r4g-state-pill" data-state={state} data-live={live ? '1' : '0'}>
      {icon ? <Icon name={icon} size={9} /> : <span className="r4g-state-dot" />}
      {label}
    </span>
  );
}

function R4BDataEntryState({ title = 'Reading context', source = 'Thread scope', state = 'active', detail = '', items = [], metrics = [], actionLabel = '', onAction, compact = false }) {
  const live = state === 'active' || state === 'running' || state === 'uploading' || state === 'processing';
  return (
    <div className="r4g-state-card" data-state={state} data-compact={compact ? '1' : '0'}>
      <div className="r4g-state-head">
        <div className="r4g-state-title">
          <strong>{title}</strong>
          <span>{source}</span>
        </div>
        <R4BStatePill label={state === 'auth' ? 'auth needed' : state} state={state} live={live} />
      </div>
      {detail && <p className="r4g-state-copy">{detail}</p>}
      {items.length > 0 && (
        <div className="r4g-state-list">
          {items.map((item, index) => (
            <div key={item.id || item.label || index} className="r4g-state-row">
              <div className="r4g-state-row-main">
                <strong>{item.label}</strong>
                {item.meta && <span>{item.meta}</span>}
                {typeof item.pct === 'number' && <ProgressBar pct={item.pct} accent={item.state === 'done' || item.state === 'ready'} fill={item.state === 'error' ? 'var(--tone-danger)' : item.state === 'partial' ? 'var(--tone-warning)' : 'var(--fg-tertiary)'} />}
              </div>
              <R4BStatePill label={item.status || item.state || 'ready'} state={item.state || 'ready'} live={item.live} />
            </div>
          ))}
        </div>
      )}
      {metrics.length > 0 && (
        <div className="r4g-profile-stat-grid">
          {metrics.map((metric, index) => (
            <div key={metric.label || index} className="r4g-profile-stat">
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      )}
      {actionLabel && (
        <div className="r4g-profile-actions">
          <button type="button" className="r4g-mini-btn" onClick={onAction || (() => {})}><Icon name="retry" size={9} />{actionLabel}</button>
        </div>
      )}
    </div>
  );
}

function R4BStateStrip({ title = 'State coverage', right = 'real states', items = [] }) {
  const list = items.length ? items : [
    { label: 'Entry', meta: 'drop ready', state: 'entry' },
    { label: 'During', meta: 'running', state: 'active' },
    { label: 'Ready', meta: 'usable', state: 'ready' },
  ];
  return (
    <div className="r4g-state-strip" style={{ '--r4g-strip-count': Math.min(Math.max(list.length, 1), 6) }}>
      <div className="r4g-state-strip-head">
        <strong>{title}</strong>
        <span>{right}</span>
      </div>
      <div className="r4g-state-strip-row">
        {list.map((item, index) => (
          <div key={item.label || index} className="r4g-state-strip-item" data-state={item.state || 'ready'}>
            <strong>{item.label}</strong>
            <span>{item.meta}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function R4BLatencySteps({ steps = [], active = false, complete = false, compact = false, title = '' }) {
  const list = (steps && steps.length ? steps : [
    { label: 'Read context', meta: 'thread and scope', state: complete ? 'done' : active ? 'active' : 'ready' },
    { label: 'Run tool', meta: 'source-specific', state: complete ? 'done' : 'pending' },
    { label: 'Stream text', meta: 'answer first', state: complete ? 'done' : 'pending' },
    { label: 'Render blocks', meta: 'materialize cards', state: complete ? 'done' : 'pending' },
  ]).map((step, index) => {
    let state = step.state || 'pending';
    if (complete && state !== 'error' && state !== 'failed' && state !== 'partial' && state !== 'retry' && state !== 'approval') state = 'done';
    if (active && !complete && !step.state) state = index === 0 ? 'active' : 'pending';
    return { ...step, state };
  });
  return (
    <div className="r4g-latency-rail" data-active={active ? '1' : '0'} data-complete={complete ? '1' : '0'} data-compact={compact ? '1' : '0'} style={{ '--r4g-step-count': Math.min(Math.max(list.length, 1), 5) }}>
      {title && (
        <div className="r4g-state-head">
          <div className="r4g-state-title"><strong>{title}</strong><span>VISIBLE LATENCY</span></div>
          <R4BStatePill label={complete ? 'complete' : active ? 'running' : 'ready'} state={complete ? 'done' : active ? 'running' : 'ready'} live={active && !complete} />
        </div>
      )}
      <div className="r4g-latency-grid">
        {list.map((step, index) => (
          <div key={step.id || step.label || index} className="r4g-latency-step" data-state={step.state || 'pending'}>
            <div className="r4g-latency-top">
              <span className="r4g-latency-label">{step.label}</span>
              <Icon name={step.state === 'done' ? 'check' : step.state === 'error' || step.state === 'failed' ? 'warning' : step.state === 'active' || step.state === 'running' ? 'play' : 'circle'} size={9} />
            </div>
            {step.meta && <div className="r4g-latency-meta">{step.meta}</div>}
            {typeof step.pct === 'number' && <ProgressBar pct={step.pct} accent={step.state === 'done' || step.state === 'active'} fill={step.state === 'partial' || step.state === 'retry' ? 'var(--tone-warning)' : step.state === 'error' || step.state === 'failed' ? 'var(--tone-danger)' : 'var(--fg-tertiary)'} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function R4BMediaTransferCard({ title = 'Add source media', subtitle = 'Drop or attach files', state = 'entry', pct = 0, files = [], stages = [], note = '', actionLabel = '', onAction }) {
  const live = state === 'uploading' || state === 'processing';
  const defaultStages = stages.length ? stages : [
    { label: 'Upload', meta: 'workspace copy', state: state === 'entry' ? 'pending' : 'done' },
    { label: 'Parse', meta: 'frames and text', state: state === 'processing' ? 'active' : state === 'ready' ? 'done' : 'pending' },
    { label: 'Extract', meta: 'moments', state: state === 'ready' ? 'done' : state === 'partial' ? 'partial' : 'pending' },
    { label: 'Ready', meta: 'usable in chat', state: state === 'ready' ? 'done' : state === 'error' ? 'error' : 'pending' },
  ];
  return (
    <div className="r4g-media-card" data-state={state}>
      <div className="r4g-media-drop">
        <span className="r4g-media-icon"><Icon name={state === 'entry' ? 'plus' : state === 'ready' ? 'check' : state === 'error' || state === 'failed' || state === 'auth' ? 'warning' : 'arrow-up'} size={16} /></span>
        <div className="r4g-media-title">
          <strong>{title}</strong>
          <span>{subtitle}</span>
        </div>
        <R4BStatePill label={state === 'entry' ? 'drop ready' : state} state={state} live={live} />
      </div>
      {(state === 'uploading' || state === 'processing' || state === 'partial') && (
        <ProgressBar pct={r4gClampPct(pct)} accent={state !== 'partial'} fill={state === 'partial' ? 'var(--tone-warning)' : 'var(--accent-primary)'} />
      )}
      {files.length > 0 && (
        <div className="r4g-media-files">
          {files.map((file, index) => (
            <div key={file.name || index} className="r4g-media-file">
              <div style={{ minWidth: 0 }}>
                <div className="r4g-media-file-name">{file.name}</div>
                <div className="r4g-media-file-meta">{file.meta || file.type || 'source file'}</div>
              </div>
              <ProgressBar pct={typeof file.pct === 'number' ? file.pct : pct} accent={file.state === 'done' || file.state === 'ready'} fill={file.state === 'error' ? 'var(--tone-danger)' : file.state === 'partial' ? 'var(--tone-warning)' : 'var(--fg-tertiary)'} />
              <span className="num mono" style={{ fontSize: 9, color: file.state === 'error' ? 'var(--tone-danger)' : file.state === 'partial' ? 'var(--tone-warning)' : 'var(--fg-tertiary)', textAlign: 'right', fontWeight: 800 }}>{typeof file.pct === 'number' ? `${file.pct}%` : file.status || ''}</span>
            </div>
          ))}
        </div>
      )}
      <div className="r4g-media-stage-row" style={{ '--r4g-stage-count': Math.min(Math.max(defaultStages.length, 1), 5) }}>
        {defaultStages.map((stage, index) => (
          <div key={stage.label || index} className="r4g-media-stage" data-state={stage.state || 'pending'}>
            <strong>{stage.label}</strong>
            <span>{stage.meta}</span>
          </div>
        ))}
      </div>
      {note && <p className="r4g-state-copy">{note}</p>}
      {actionLabel && (
        <div className="r4g-profile-actions">
          <button type="button" className="r4g-mini-btn" data-warn={state === 'error' || state === 'auth' ? '1' : '0'} onClick={onAction || (() => {})}><Icon name={state === 'error' || state === 'auth' ? 'retry' : 'plus'} size={9} />{actionLabel}</button>
        </div>
      )}
    </div>
  );
}

function R4BSocialProfileCard({ profile = {}, tone = 'peer', compact = false }) {
  const [saved, setSaved] = React.useState(false);
  const [opened, setOpened] = React.useState(false);
  const channels = profile.channels || profile.platforms || ['IG'];
  const stats = profile.stats || [
    { label: 'followers', value: profile.followers || '312K' },
    { label: '30d velocity', value: profile.velocity || profile.growth || '+6.8%' },
    { label: 'overlap', value: profile.overlap || '41%' },
  ];
  const latest = profile.latestPost || {};
  return (
    <div className="r4g-profile-card" data-tone={tone} data-compact={compact ? '1' : '0'}>
      <div className="r4g-profile-head">
        <span className="r4g-profile-avatar">{r4gProfileInitial(profile.handle, profile.name)}</span>
        <div className="r4g-profile-name">
          <strong>{profile.name || String(profile.handle || '@creator').replace('@', '')}</strong>
          <span>{profile.handle || '@creator'} / {profile.lane || 'public creator'}</span>
        </div>
        <span className="r4g-platform-chips">
          {channels.map(ch => <ChannelChip key={ch} channel={String(ch).toUpperCase().slice(0, 2)} />)}
        </span>
      </div>
      <div className="r4g-profile-stat-grid">
        {stats.slice(0, 3).map((stat, index) => (
          <div key={stat.label || index} className="r4g-profile-stat">
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
      <div className="r4g-latest-post">
        <div style={{ minWidth: 0 }}>
          <strong>{latest.title || 'Latest public post preview unavailable'}</strong>
          <span>{latest.meta || profile.sourceScope || 'public profile and posts only'}</span>
        </div>
        <R4BStatePill label={latest.state || 'public'} state={latest.state || 'ready'} />
      </div>
      <div className="r4g-state-note">{profile.sourceScope || 'source scope: public posts, visible comments, bio terms'}</div>
      <div className="r4g-profile-actions">
        <button type="button" className="r4g-mini-btn" data-active={saved ? '1' : '0'} onClick={() => setSaved(true)}><Icon name={saved ? 'check' : 'pin'} size={9} />{saved ? 'Saved' : 'Save profile'}</button>
        <button type="button" className="r4g-mini-btn" data-active={opened ? '1' : '0'} onClick={() => setOpened(true)}><Icon name={opened ? 'check' : 'arrow-up-right'} size={9} />{opened ? 'Opened' : 'Open profile'}</button>
      </div>
    </div>
  );
}

function R4BPostHitVisual({ post, variant }) {
  const shape = r4gPostShape(post, variant);
  let Thumb = null;
  const explicit = String(variant || '').toLowerCase();
  if (shape === 'thread') Thumb = window.R4Thumb_Thread;
  else if (shape === 'feed') Thumb = window.R4Thumb_Feed;
  else if (shape === 'horizontal') Thumb = window.R4Thumb_YouTube;
  else if (shape === 'square') Thumb = window.R4Thumb_Carousel;
  else Thumb = window.R4Thumb_Reel;
  if (!post) return null;
  return (
    <div className="r4g-hit-visual" data-shape={shape}>
      <div className="r4g-hit-inner">
        {Thumb ? <Thumb post={post} platform={explicit === 'tt' || post.channel === 'tt' ? 'tt' : 'ig'} withImage={explicit === 'thread-image'} /> : (
          <div style={{ minHeight: 80, borderRadius: 6, background: 'var(--surface-2)' }} />
        )}
      </div>
    </div>
  );
}

function R4BPostHitCard({ postId = '0042', variant = '', route = '', match = 92, reason = 'nearest proof', role = 'source post', size = 'compact' }) {
  const [saved, setSaved] = React.useState(false);
  const post = r4gPostById(postId);
  if (!post) return null;
  const shape = r4gPostShape(post, variant);
  const openRoute = r4gRouteForPost(post, variant, route);
  const visual = window.R4_LIB_VISUALS ? (window.R4_LIB_VISUALS[post.id] || {}) : {};
  function open(e) {
    if (e) e.stopPropagation();
    r4gOpenPost(openRoute);
  }
  function onKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open(e);
    }
  }
  return (
    <div className="r4g-post-hit" data-shape={shape} data-size={size} role="button" tabIndex={0} onClick={open} onKeyDown={onKeyDown}>
      <R4BPostHitVisual post={post} variant={variant} />
      <div className="r4g-hit-body">
        <div className="r4g-hit-kicker">
          {window.R4ChannelChip ? <window.R4ChannelChip ch={post.channel} /> : <ChannelChip channel={post.channel} />}
          {window.R4PillarDot ? <window.R4PillarDot pillar={post.pillar} size={7} /> : null}
          <R4BStatePill label={shape === 'thread' ? 'text thread' : shape === 'feed' ? 'feed post' : shape === 'horizontal' ? 'youtube' : shape === 'square' ? 'carousel' : 'vertical'} state="ready" />
        </div>
        <div className="r4g-hit-title">{post.title}</div>
        <div className="r4g-hit-meta">{role} / {reason} / {visual.velocity || 'steady'} velocity</div>
        <div className="r4g-hit-stats">
          <div className="r4g-hit-stat"><strong>{match}</strong><span>match</span></div>
          <div className="r4g-hit-stat"><strong>{Math.round(post.watchPct * 100)}%</strong><span>watch</span></div>
          <div className="r4g-hit-stat"><strong>{r4gFmtViews(post.views)}</strong><span>views</span></div>
          <div className="r4g-hit-stat"><strong>{r4gFmtViews(post.saves)}</strong><span>saves</span></div>
        </div>
        <div className="r4g-hit-actions">
          <button type="button" className="r4g-mini-btn" data-active={saved ? '1' : '0'} onClick={(e) => { e.stopPropagation(); setSaved(true); }}><Icon name={saved ? 'check' : 'plus'} size={9} />{saved ? 'Saved' : 'Use'}</button>
          <button type="button" className="r4g-mini-btn" onClick={open}><Icon name="arrow-up-right" size={9} />Preview</button>
        </div>
      </div>
    </div>
  );
}

function R4BInlinePreviewCard({ postId = '0042', variant = 'thread', route, title = 'Inline preview', note = 'Click to open the full library detail.' }) {
  return (
    <div className="r4g-inline-preview">
      <div className="r4g-state-head">
        <div className="r4g-state-title">
          <strong>{title}</strong>
          <span>{note}</span>
        </div>
        <R4BStatePill label="preview ready" state="ready" />
      </div>
      <R4BPostHitCard postId={postId} variant={variant} route={route} size="feature" match={94} reason="best internal proof" role="library detail" />
    </div>
  );
}

function r4gProfileFromPeer(peer = {}, overrides = {}) {
  const followers = r4gFmtViews(peer.followers || 0);
  const growth = `${peer.growth30 > 0 ? '+' : ''}${peer.growth30 || 0}%`;
  const overlap = `${Math.round((peer.overlap || 0) * 100)}%`;
  const lane = peer.lane || 'creator';
  return {
    handle: peer.handle || '@creator',
    name: overrides.name || String(peer.handle || '@creator').replace('@', ''),
    lane,
    channels: overrides.channels || ['YT', 'IG'],
    followers,
    velocity: growth,
    overlap,
    stats: [
      { label: 'followers', value: followers },
      { label: '30d velocity', value: growth },
      { label: 'overlap', value: overlap },
    ],
    latestPost: overrides.latestPost || { title: `${lane.replace(/-/g, ' ')} example`, meta: `${peer.postsWk || 3} posts/wk / public scan`, state: 'ready' },
    sourceScope: overrides.sourceScope || 'source scope: public bio, posts, and visible comments',
    ...overrides,
  };
}

Object.assign(window, {
  R4BStatePill,
  R4BDataEntryState,
  R4BStateStrip,
  R4BLatencySteps,
  R4BMediaTransferCard,
  R4BSocialProfileCard,
  R4BPostHitVisual,
  R4BPostHitCard,
  R4BInlinePreviewCard,
  r4gPostById,
  r4gPostShape,
  r4gRouteForPost,
  r4gOpenPost,
  r4gProfileFromPeer,
});
