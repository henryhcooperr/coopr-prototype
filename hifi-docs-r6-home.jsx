/* global React, window, document */
/* hifi-docs-r6-home.jsx — Docs R6 home (Wave 3 / S1).

   Replaces the R5 single-column editorial card list with a
   Google-Docs-home-meets-Figma-files surface that supports:
     · Card view (default) — 4:5 thumbnails, eyebrow + title + status row
     · List view — sortable table
     · Toggle (persisted in localStorage docs-r6-view-mode)
     · Filter chips (status / channel / updated) + Clear all
     · Sort dropdown
     · Group-by (None / Status / Channel / Series)
     · Version-tree expansion (parentId + branchLabel; Figma branches model)
     · + New doc CTA (calls master pushModal('ModalNewDoc'))

   Reads window.R5H_DOCS at module load. Augments it with two trial-reel
   children of `truk-lagoon-ep-1` to demo the version-tree affordance.

   Public API (window):
     HF_DocsHome                         // React component (HF_R5DocsHome alias)
     HF_DocsHomeOpenDoc(docId)           // imperative open (used by libref blocks)
*/

(function () {
  'use strict';
  if (window.__DOCS_R6_HOME_BOOTED__) return;
  window.__DOCS_R6_HOME_BOOTED__ = true;

  const LS_VIEW = 'docs-r6-view-mode';
  const LS_FILTERS = 'docs-r6-filters';
  const LS_GROUP = 'docs-r6-group';
  const LS_SORT = 'docs-r6-sort';

  function loadJSON(key, fallback) {
    try { const v = window.localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
  }
  function saveJSON(key, val) { try { window.localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }
  function loadStr(key, fallback) { try { return window.localStorage.getItem(key) || fallback; } catch (e) { return fallback; } }
  function saveStr(key, val) { try { window.localStorage.setItem(key, val); } catch (e) {} }

  // ── Augment R5H_DOCS with version-tree fixtures ──
  function augmentDocs() {
    if (!window.R5H_DOCS || !Array.isArray(window.R5H_DOCS)) return;
    const existing = window.R5H_DOCS;
    const has = (id) => existing.some(d => d.id === id);
    const adds = [];
    if (!has('truk-lagoon-ep-1-trial-a')) {
      adds.push({
        id: 'truk-lagoon-ep-1-trial-a',
        parentId: 'truk-lagoon-ep-1',
        branchLabel: 'Trial reel A',
        eyebrow: 'Truk Lagoon · ep. 1 hook · trial A',
        title: 'Eight breaths',
        italicTail: 'and the gun mount.',
        status: 'trial', statusVersion: 'v3a',
        words: 420, target: null,
        target_when: 'Tue 6:30 PM',
        channel: 'IG · 60s',
        agent: { name: 'Coopr', when: '2d ago', body: 'pulled the wreck approach as the cold open' },
        section: 'active',
      });
    }
    if (!has('truk-lagoon-ep-1-trial-b')) {
      adds.push({
        id: 'truk-lagoon-ep-1-trial-b',
        parentId: 'truk-lagoon-ep-1',
        branchLabel: 'Trial reel B',
        eyebrow: 'Truk Lagoon · ep. 1 hook · trial B',
        title: 'I dropped to ninety-five',
        italicTail: 'feet.',
        status: 'trial', statusVersion: 'v3b',
        words: 395, target: null,
        target_when: 'Tue 6:30 PM',
        channel: 'IG · 60s',
        agent: { name: 'Coopr', when: '2d ago', body: 'led with the depth count for tension' },
        section: 'active',
      });
    }
    if (adds.length) {
      window.R5H_DOCS = [...existing, ...adds];
    }
  }
  augmentDocs();

  // ── Fonts / helpers ──
  const F = {
    serif: 'var(--font-serif)',
    sans:  'var(--font-sans)',
    mono:  'var(--font-mono)',
  };

  const STATUS_COLORS = {
    drafting:  { bg: 'var(--accent-soft)',    fg: 'var(--accent-primary)',  dot: 'var(--accent-primary)' },
    reviewing: { bg: 'var(--surface-2)',      fg: 'var(--fg-secondary)',    dot: 'var(--fg-secondary)' },
    notes:     { bg: 'var(--surface-2)',      fg: 'var(--fg-tertiary)',     dot: 'var(--fg-tertiary)' },
    shipped:   { bg: 'var(--accent-soft)',    fg: 'var(--accent-primary)',  dot: 'var(--accent-primary)' },
    trial:     { bg: 'var(--surface-2)',      fg: 'var(--fg-secondary)',    dot: 'var(--accent-primary)' },
  };

  function StatusPill({ status, version }) {
    const c = STATUS_COLORS[status] || STATUS_COLORS.notes;
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        height: 22, padding: '0 9px',
        background: c.bg, color: c.fg,
        border: '1px solid var(--border-subtle)',
        borderRadius: 999,
        fontFamily: F.mono, fontSize: 9.5, fontWeight: 600,
        letterSpacing: '0.10em', textTransform: 'uppercase',
      }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.dot }} />
        {status}{version ? ' · ' + version : ''}
      </span>
    );
  }

  function FilterChip({ label, count, active, onClick }) {
    return (
      <span
        onClick={onClick}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          height: 26, padding: '0 11px',
          border: '1px solid ' + (active ? 'var(--accent-primary)' : 'var(--border-subtle)'),
          background: active ? 'var(--accent-soft)' : 'var(--surface-1)',
          color: active ? 'var(--accent-primary)' : 'var(--fg-secondary)',
          borderRadius: 999,
          fontFamily: F.sans, fontSize: 11.5, fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 100ms',
        }}
        onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--surface-2)'; }}
        onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'var(--surface-1)'; }}>
        {label}
        {typeof count === 'number' && (
          <span style={{ fontFamily: F.mono, fontSize: 9.5, opacity: 0.8 }}>{count}</span>
        )}
      </span>
    );
  }

  // ── Thumbnail strategy: real rendered preview of doc body (Cohesion R9 / I3) ──
  function CardThumbnail({ doc }) {
    return (
      <div style={{
        width: '100%', aspectRatio: '4 / 5',
        background: 'var(--surface-1)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 8,
        position: 'relative', overflow: 'hidden',
      }}>
        {window.HF_DocCardPreview
          ? <window.HF_DocCardPreview docId={doc.id} fallbackTitle={doc.title} />
          : null}
      </div>
    );
  }

  function DocCard({ doc, onOpen, branches, expanded, onToggleExpand }) {
    const wordsLine = doc.target
      ? <span><span style={{ fontFamily: F.mono, color: 'var(--fg-secondary)' }}>{doc.words.toLocaleString()}</span> <span style={{ color: 'var(--fg-tertiary)' }}>/ {doc.target.toLocaleString()}</span></span>
      : <span style={{ fontFamily: F.mono, color: 'var(--fg-secondary)' }}>{(doc.words || 0).toLocaleString()}</span>;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div
          data-r6-doc-id={doc.id}
          onClick={() => onOpen(doc.id)}
          style={{
            cursor: 'pointer',
            transition: 'transform 120ms, border-color 120ms',
          }}
          onMouseEnter={(e) => {
            const card = e.currentTarget.querySelector('[data-r6-card-thumb]');
            if (card) {
              card.style.borderColor = 'var(--border-default)';
              card.style.background = 'var(--surface-2)';
            }
          }}
          onMouseLeave={(e) => {
            const card = e.currentTarget.querySelector('[data-r6-card-thumb]');
            if (card) {
              card.style.borderColor = 'var(--border-subtle)';
              card.style.background = 'var(--surface-1)';
            }
          }}>
          <div data-r6-card-thumb="1" style={{ transition: 'background 120ms, border-color 120ms' }}>
            <CardThumbnail doc={doc} />
          </div>
          <div style={{ paddingTop: 8, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <StatusPill status={doc.status} version={doc.statusVersion} />
            {branches && branches.length > 0 && (
              <span
                onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  height: 22, padding: '0 8px',
                  border: '1px dashed var(--border-default)',
                  borderRadius: 999,
                  fontFamily: F.mono, fontSize: 9.5, fontWeight: 600,
                  color: 'var(--fg-tertiary)', cursor: 'pointer',
                }}
                title={branches.length + ' branch' + (branches.length === 1 ? '' : 'es')}>
                <svg width="9" height="9" viewBox="0 0 12 12" aria-hidden="true">
                  <path d={expanded ? 'M2 4 L6 8 L10 4' : 'M4 2 L8 6 L4 10'} stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                ⊕ {branches.length}
              </span>
            )}
            <span style={{ flex: 1 }} />
            <span style={{ fontFamily: F.mono, fontSize: 9.5, color: 'var(--fg-tertiary)' }}>
              {doc.target_when || '—'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, fontSize: 11.5 }}>
            <span style={{ fontFamily: F.mono, fontSize: 10, color: 'var(--fg-tertiary)' }}>{wordsLine} words</span>
            <span style={{ flex: 1 }} />
            {doc.agent && (
              <span style={{ fontFamily: F.mono, fontSize: 10, color: 'var(--fg-tertiary)' }}>
                {doc.agent.when} · {doc.agent.name}
              </span>
            )}
          </div>
        </div>

        {/* Expanded children */}
        {expanded && branches && branches.length > 0 && (
          <div style={{ paddingLeft: 14, borderLeft: '2px solid var(--accent-soft)', marginTop: 4, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {branches.map(b => (
              <div key={b.id}
                onClick={() => onOpen(b.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 10px',
                  background: 'var(--surface-1)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 6, cursor: 'pointer',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--surface-1)'; }}>
                <span style={{ fontFamily: F.mono, fontSize: 9, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>{b.branchLabel || 'branch'}</span>
                <span style={{ fontFamily: F.serif, fontSize: 13, color: 'var(--fg-primary)' }}>{b.title} <span style={{ fontStyle: 'italic', color: 'var(--fg-tertiary)' }}>{b.italicTail}</span></span>
                <span style={{ flex: 1 }} />
                <span style={{ fontFamily: F.mono, fontSize: 9.5, color: 'var(--fg-tertiary)' }}>{b.statusVersion || ''}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  function DocRow({ doc, onOpen, branches, expanded, onToggleExpand, depth }) {
    return (
      <React.Fragment>
        <div
          data-r6-doc-id={doc.id}
          onClick={() => onOpen(doc.id)}
          style={{
            display: 'grid',
            gridTemplateColumns: '32px 2.6fr 1fr 0.6fr 1.4fr 0.8fr 0.9fr 32px',
            alignItems: 'center', gap: 14,
            padding: '10px 14px',
            borderBottom: '1px solid var(--border-subtle)',
            cursor: 'pointer',
            background: depth ? 'var(--surface-1)' : 'transparent',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = depth ? 'var(--surface-1)' : 'transparent'; }}>
          <span style={{ paddingLeft: depth * 12 }}>
            {branches && branches.length > 0 ? (
              <span
                onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}
                style={{
                  display: 'inline-flex', width: 18, height: 18,
                  alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'var(--fg-tertiary)',
                }}>
                <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true">
                  <path d={expanded ? 'M2 4 L6 8 L10 4' : 'M4 2 L8 6 L4 10'} stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            ) : (depth ? <span style={{ display: 'inline-block', width: 8, height: 1, background: 'var(--border-default)' }} /> : null)}
          </span>
          <span style={{ minWidth: 0 }}>
            <span style={{
              display: 'block',
              fontFamily: F.mono, fontSize: 8.5, fontWeight: 600,
              letterSpacing: '0.10em', textTransform: 'uppercase',
              color: 'var(--fg-tertiary)', marginBottom: 1,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{doc.eyebrow}</span>
            <span style={{ fontFamily: F.serif, fontSize: 14, color: 'var(--fg-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
              {doc.title}{doc.italicTail && <span style={{ fontStyle: 'italic', color: 'var(--fg-tertiary)' }}> {doc.italicTail}</span>}
            </span>
          </span>
          <span><StatusPill status={doc.status} version={doc.statusVersion} /></span>
          <span style={{ fontFamily: F.mono, fontSize: 10, color: 'var(--fg-tertiary)' }}>{doc.statusVersion || '—'}</span>
          <span style={{ fontFamily: F.serif, fontSize: 12.5, color: 'var(--fg-secondary)' }}>{doc.channel || '—'}</span>
          <span style={{ fontFamily: F.mono, fontSize: 10, color: 'var(--fg-tertiary)' }}>{doc.agent ? doc.agent.when : '—'}</span>
          <span style={{ fontFamily: F.mono, fontSize: 10.5, color: 'var(--fg-secondary)' }}>
            {doc.target ? (doc.words || 0).toLocaleString() + ' / ' + doc.target.toLocaleString() : (doc.words || 0).toLocaleString()}
          </span>
          <span title="More" style={{ display: 'inline-flex', justifyContent: 'center', color: 'var(--fg-tertiary)' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <circle cx="3" cy="7" r="1.2" fill="currentColor"/>
              <circle cx="7" cy="7" r="1.2" fill="currentColor"/>
              <circle cx="11" cy="7" r="1.2" fill="currentColor"/>
            </svg>
          </span>
        </div>
        {expanded && branches && branches.map(b => (
          <DocRow key={b.id} doc={b} onOpen={onOpen} branches={[]} expanded={false} onToggleExpand={() => {}} depth={(depth || 0) + 1} />
        ))}
      </React.Fragment>
    );
  }

  // ── Main home component ──
  function HF_DocsHome({ onOpen }) {
    // Expose the R5-shell-provided onOpen to the chrome bridge so it can
    // open ANY doc directly (including child branches not in top-level grid).
    React.useEffect(() => {
      window.__DOCS_R6_HOME_OPEN_DOC = onOpen;
      return () => {
        if (window.__DOCS_R6_HOME_OPEN_DOC === onOpen) {
          delete window.__DOCS_R6_HOME_OPEN_DOC;
        }
      };
    }, [onOpen]);

    const [view, setView] = React.useState(loadStr(LS_VIEW, 'cards')); // 'cards' | 'list'
    const [filters, setFilters] = React.useState(loadJSON(LS_FILTERS, { status: [], channel: [], updated: 'anytime' }));
    const [group, setGroup] = React.useState(loadStr(LS_GROUP, 'none')); // 'none' | 'status' | 'channel' | 'series'
    const [sort, setSort] = React.useState(loadStr(LS_SORT, 'recent'));   // 'recent' | 'title' | 'words' | 'status'
    const [expanded, setExpanded] = React.useState({});
    const [search, setSearch] = React.useState('');

    const allDocs = React.useMemo(() => (window.R5H_DOCS || []).slice(), []);

    // Top-level docs (no parentId) — children render via expansion.
    const topLevel = React.useMemo(() => allDocs.filter(d => !d.parentId), [allDocs]);
    const childrenByParent = React.useMemo(() => {
      const map = {};
      allDocs.forEach(d => {
        if (d.parentId) {
          if (!map[d.parentId]) map[d.parentId] = [];
          map[d.parentId].push(d);
        }
      });
      return map;
    }, [allDocs]);

    // Apply filters / search
    const filtered = React.useMemo(() => {
      let arr = topLevel;
      if (filters.status && filters.status.length) {
        arr = arr.filter(d => filters.status.includes(d.status));
      }
      if (filters.channel && filters.channel.length) {
        arr = arr.filter(d => d.channel && filters.channel.some(c => d.channel.includes(c)));
      }
      const s = (search || '').trim().toLowerCase();
      if (s) {
        arr = arr.filter(d => (
          (d.title || '').toLowerCase().includes(s) ||
          (d.eyebrow || '').toLowerCase().includes(s) ||
          (d.italicTail || '').toLowerCase().includes(s)
        ));
      }
      return arr;
    }, [topLevel, filters, search]);

    // Sort
    const sorted = React.useMemo(() => {
      const arr = filtered.slice();
      if (sort === 'title') arr.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      else if (sort === 'words') arr.sort((a, b) => (b.words || 0) - (a.words || 0));
      else if (sort === 'status') arr.sort((a, b) => (a.status || '').localeCompare(b.status || ''));
      // 'recent' is default fixture order (most recent first per R5)
      return arr;
    }, [filtered, sort]);

    // Group
    const groups = React.useMemo(() => {
      if (group === 'none') return [{ name: null, docs: sorted }];
      const buckets = {};
      sorted.forEach(d => {
        let key;
        if (group === 'status')   key = d.status || 'other';
        else if (group === 'channel') key = (d.channel && d.channel.split(' · ')[0]) || 'other';
        else if (group === 'series') key = d.eyebrow ? d.eyebrow.split(' · ')[0] : 'other';
        else key = 'all';
        (buckets[key] = buckets[key] || []).push(d);
      });
      return Object.keys(buckets).map(name => ({ name, docs: buckets[name] }));
    }, [sorted, group]);

    function setViewMode(v) { setView(v); saveStr(LS_VIEW, v); }
    function toggleStatus(s) {
      const next = { ...filters };
      next.status = filters.status.includes(s) ? filters.status.filter(x => x !== s) : [...filters.status, s];
      setFilters(next); saveJSON(LS_FILTERS, next);
    }
    function clearFilters() { const next = { status: [], channel: [], updated: 'anytime' }; setFilters(next); saveJSON(LS_FILTERS, next); setSearch(''); }
    function setSortVal(v) { setSort(v); saveStr(LS_SORT, v); }
    function setGroupVal(v) { setGroup(v); saveStr(LS_GROUP, v); }
    function toggleExpand(id) { setExpanded(prev => ({ ...prev, [id]: !prev[id] })); }

    function newDoc() {
      const ctx = window.useMasterState && (() => { try { return window.useMasterState(); } catch (e) { return null; } });
      // Cannot call hook here; rely on global trigger if available.
      if (window.HF_DocsHomeTriggerNewDoc) {
        window.HF_DocsHomeTriggerNewDoc();
      } else {
        // Fallback: dispatch event for parent to handle
        document.dispatchEvent(new CustomEvent('docs-r6-new-doc'));
        const toaster = window.__DOCS_R6_PUSH_TOAST || (() => {});
        toaster('New doc · phase-2 · would open ModalNewDoc');
      }
    }

    const filterCount =
      (filters.status ? filters.status.length : 0) +
      (filters.channel ? filters.channel.length : 0) +
      (filters.updated && filters.updated !== 'anytime' ? 1 : 0) +
      (search ? 1 : 0);

    const STATUS_OPTIONS = ['drafting', 'reviewing', 'shipped', 'notes', 'trial'];

    // ── Editorial header meta (Cohesion R9 / I5 surface-rhythm) ──
    const docCount = topLevel.length;
    const shippedCount = allDocs.filter(d => d.status === 'shipped').length;
    const lastEditTime = (() => {
      const firstAgentWhen = (allDocs.find(d => d.agent && d.agent.when) || {}).agent;
      return firstAgentWhen ? firstAgentWhen.when : 'recently';
    })();

    return (
      <div style={{
        flex: 1, minHeight: 0,
        display: 'flex', flexDirection: 'column',
        background: 'var(--surface-1)',
        overflow: 'hidden',
      }}>
        {/* Editorial header strip (Cohesion R9 / I5 — surface-rhythm primitive).
            Lives ABOVE the toolbar, lifts the surface to the Insights bar. */}
        {window.HF_EditorialHeader && (
          <div style={{ padding: '4px 28px 0' }}>
            <window.HF_EditorialHeader
              eyebrow="DOCS"
              rightMeta={`${docCount} ACTIVE · ${shippedCount} SHIPPED`}
              dateline={`UPDATED ${String(lastEditTime).toUpperCase()}`}
              rightDateline="SHARE"
              headline="The drafting set."
              tail="A few projects in motion, a couple still finding their hook."
              body="The work in progress across episodes, carousels, channel intros, and scratch notes. Coopr touched the active threads recently — open one to keep moving."
              density="comfortable"
            />
          </div>
        )}

        {/* Toolbar row */}
        <div style={{
          padding: '14px 28px 10px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'center', gap: 12,
          flexWrap: 'wrap',
        }}>
          <span style={{ fontFamily: F.mono, fontSize: 9.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>
            Docs · {topLevel.length} {topLevel.length === 1 ? 'project' : 'projects'}
          </span>
          <span style={{ flex: 1 }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            style={{
              height: 28, padding: '0 11px',
              background: 'var(--surface-2)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 7,
              fontFamily: F.sans, fontSize: 12, color: 'var(--fg-primary)',
              outline: 'none', width: 200,
            }}
          />
          {/* View toggle */}
          <div style={{ display: 'flex', gap: 0, border: '1px solid var(--border-subtle)', borderRadius: 7, overflow: 'hidden' }}>
            {[
              { id: 'cards', label: 'Cards', icon: 'grid' },
              { id: 'list',  label: 'List',  icon: 'list' },
            ].map(v => (
              <span key={v.id}
                onClick={() => setViewMode(v.id)}
                title={v.label}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  height: 28, padding: '0 11px',
                  background: view === v.id ? 'var(--accent-soft)' : 'var(--surface-1)',
                  color: view === v.id ? 'var(--accent-primary)' : 'var(--fg-tertiary)',
                  cursor: 'pointer',
                  fontFamily: F.mono, fontSize: 9.5, fontWeight: 600,
                  letterSpacing: '0.10em', textTransform: 'uppercase',
                  borderRight: v.id === 'cards' ? '1px solid var(--border-subtle)' : 'none',
                }}>
                {v.icon === 'grid' ? (
                  <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
                    <rect x="1.5" y="1.5" width="3.5" height="3.5" stroke="currentColor" fill="none" strokeWidth="1.2"/>
                    <rect x="7" y="1.5" width="3.5" height="3.5" stroke="currentColor" fill="none" strokeWidth="1.2"/>
                    <rect x="1.5" y="7" width="3.5" height="3.5" stroke="currentColor" fill="none" strokeWidth="1.2"/>
                    <rect x="7" y="7" width="3.5" height="3.5" stroke="currentColor" fill="none" strokeWidth="1.2"/>
                  </svg>
                ) : (
                  <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
                    <line x1="2" y1="3" x2="10" y2="3" stroke="currentColor" strokeWidth="1.2"/>
                    <line x1="2" y1="6" x2="10" y2="6" stroke="currentColor" strokeWidth="1.2"/>
                    <line x1="2" y1="9" x2="10" y2="9" stroke="currentColor" strokeWidth="1.2"/>
                  </svg>
                )}
                {v.label}
              </span>
            ))}
          </div>
          <span
            onClick={newDoc}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              height: 28, padding: '0 14px',
              background: 'var(--accent-primary)',
              color: 'var(--fg-on-accent)',
              borderRadius: 7,
              fontFamily: F.mono, fontSize: 9.5, fontWeight: 700,
              letterSpacing: '0.10em', textTransform: 'uppercase',
              cursor: 'pointer',
            }}>
            <span style={{ fontSize: 14, lineHeight: 1 }}>+</span> New doc
          </span>
        </div>

        {/* Filter row */}
        <div style={{
          padding: '10px 28px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'center', gap: 8,
          flexWrap: 'wrap',
        }}>
          <span style={{ fontFamily: F.mono, fontSize: 8.5, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', marginRight: 4 }}>Status</span>
          {STATUS_OPTIONS.map(s => (
            <FilterChip key={s} label={s} active={filters.status.includes(s)} onClick={() => toggleStatus(s)} />
          ))}
          <span style={{ width: 1, height: 16, background: 'var(--border-subtle)', margin: '0 4px' }} />
          <span style={{ fontFamily: F.mono, fontSize: 8.5, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', marginRight: 4 }}>Group</span>
          {[
            { id: 'none', label: 'None' },
            { id: 'status', label: 'Status' },
            { id: 'channel', label: 'Channel' },
            { id: 'series', label: 'Series' },
          ].map(g => (
            <FilterChip key={g.id} label={g.label} active={group === g.id} onClick={() => setGroupVal(g.id)} />
          ))}
          <span style={{ width: 1, height: 16, background: 'var(--border-subtle)', margin: '0 4px' }} />
          <span style={{ fontFamily: F.mono, fontSize: 8.5, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', marginRight: 4 }}>Sort</span>
          <select
            value={sort}
            onChange={(e) => setSortVal(e.target.value)}
            style={{
              height: 26, padding: '0 8px',
              background: 'var(--surface-1)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 7,
              fontFamily: F.sans, fontSize: 11.5, color: 'var(--fg-primary)',
              cursor: 'pointer',
            }}>
            <option value="recent">Recently updated</option>
            <option value="title">Title A→Z</option>
            <option value="words">Most words</option>
            <option value="status">Status order</option>
          </select>
          {filterCount > 0 && (
            <span
              onClick={clearFilters}
              style={{
                fontFamily: F.mono, fontSize: 9, fontWeight: 600,
                letterSpacing: '0.10em', textTransform: 'uppercase',
                color: 'var(--accent-primary)', cursor: 'pointer',
                marginLeft: 6,
              }}>
              Clear · {filterCount}
            </span>
          )}
        </div>

        {/* Body */}
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: view === 'cards' ? '20px 28px 60px' : '4px 0 60px' }}>
          {sorted.length === 0 && (
            <div style={{
              padding: 60, textAlign: 'center',
              fontFamily: F.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--fg-tertiary)',
            }}>
              No docs match. {filterCount > 0 && <span onClick={clearFilters} style={{ color: 'var(--accent-primary)', cursor: 'pointer' }}>Clear filters</span>}
            </div>
          )}

          {groups.map((g, gi) => (
            <div key={g.name || 'all'} style={{ marginBottom: 22 }}>
              {g.name && (
                <div style={{
                  fontFamily: F.mono, fontSize: 9, fontWeight: 600,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: 'var(--fg-tertiary)',
                  padding: view === 'cards' ? '0 0 12px' : '14px 28px 6px',
                }}>
                  {g.name} · {g.docs.length}
                </div>
              )}
              {view === 'cards' ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(232px, 1fr))',
                  gap: 28,
                }}>
                  {g.docs.map(d => (
                    <DocCard
                      key={d.id}
                      doc={d}
                      onOpen={onOpen}
                      branches={childrenByParent[d.id] || []}
                      expanded={!!expanded[d.id]}
                      onToggleExpand={() => toggleExpand(d.id)}
                    />
                  ))}
                </div>
              ) : (
                <div>
                  {/* Header */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '32px 2.6fr 1fr 0.6fr 1.4fr 0.8fr 0.9fr 32px',
                    alignItems: 'center', gap: 14,
                    padding: '8px 14px',
                    borderBottom: '1px solid var(--border-subtle)',
                    fontFamily: F.mono, fontSize: 9, fontWeight: 600,
                    letterSpacing: '0.10em', textTransform: 'uppercase',
                    color: 'var(--fg-tertiary)',
                  }}>
                    <span></span><span>Title</span><span>Status</span><span>Ver</span><span>Channel</span><span>Updated</span><span>Words</span><span></span>
                  </div>
                  {g.docs.map(d => (
                    <DocRow
                      key={d.id}
                      doc={d}
                      onOpen={onOpen}
                      branches={childrenByParent[d.id] || []}
                      expanded={!!expanded[d.id]}
                      onToggleExpand={() => toggleExpand(d.id)}
                      depth={0}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Imperative open helper for libref blocks + version-pill clicks ──
  function openDocImperative(docId) {
    if (!docId) return;
    // The MasterStateProvider-mounted bridge (HF_DocsR6ToolbarHook) listens
    // for this event; it handles the doc-mode → home → click-card sequence.
    document.dispatchEvent(new CustomEvent('docs-r6-open-doc', { detail: { id: docId } }));
  }

  Object.assign(window, {
    HF_DocsHome,
    HF_DocsHomeOpenDoc: openDocImperative,
    // Override R5 home so the shell renders ours
    HF_R5DocsHome: HF_DocsHome,
  });
})();
