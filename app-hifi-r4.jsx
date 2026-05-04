/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard, DCPostIt */
/* global HF_R3Cover, HF_ChromeAudit, HF_R3IATable */
/* global HF_HomeChat, HF_HomeColdOpen, HF_HomeActive, HF_HomeCommand, HF_HomeEmpty, HF_HomeBriefingCollapsed, HF_HomeWithLibraryRail */
/* global HF_StudioWorkspace, HF_StudioDocFull, HF_StudioDocHooks, HF_StudioDocNotes, HF_StudioList, HF_StudioCalendar, HF_StudioSlash, HF_StudioShipped */
/* global HF_ClipLabEmpty, HF_ClipLabImport, HF_ClipLabAutoClips, HF_ClipLabReview, HF_ClipLabExport */
/* global HF_R4_LibraryCatalog, HF_R4_LibraryCatalogGrid, HF_R4_LibraryDetail, HF_R4_LibraryPairing, HF_R4_LibraryPatterns, HF_R4_LibrarySeries, HF_R4_LibraryTimeline, HF_R4_LibraryCompare */
/* global HF_SearchOverlay, HF_SearchEmpty, HF_SearchResults, HF_SearchHistory */
/* global HF_InsightsOverview, HF_InsightsRetention, HF_InsightsFormatDNA, HF_InsightsAudience, HF_InsightsPosting */
/* global HF_PulseForYou, HF_IntelRadar, HF_IntelInspiration, HF_IntelDNA, HF_IntelMemory, HF_IntelStudies */
/* global HF_InboxComments, HF_InboxComments_R2, HF_InboxDMs, HF_InboxDMs_R2, HF_InboxMentions, HF_InboxReplies */
/* global HF_Calendar, HF_CalendarDay, HF_CalendarMonth, HF_CalendarSlotDrawer, HF_CalendarConflict, HF_CalendarEmpty */
/* global HF_SettingsAccount, HF_SettingsBrandVoice, HF_SettingsPlan, HF_SettingsNotifications, HF_SettingsConnections_R2, HF_SettingsData, HF_LinkedSwitcher */
/* global HF_Onb1Signup, HF_Onb2Handle, HF_Onb3Loading, HF_Onb4FirstChat */
/* global HF_PatternDecisions, HF_TokenProposals, HF_ChartVariant, HF_Inventory */

/* app-hifi-r4.jsx — round 4 entry point.
   Mirrors app-hifi-r3.jsx and adds ONE new section pinned right after the
   existing Library section: "Library · Round 4 (in progress) · the mid-prompt
   upgrade". That section showcases the six new R4 surfaces — Catalog · Detail
   · Series · Patterns · Timeline · Pairing — built on top of the shared
   visuals primitives in hifi-r4-lib-visuals.jsx.

   The R3 sections are identical to round 3. Edit them in place there if you
   want a permanent change; the R4 section is where new design experiments
   should live until they're promoted into the Library subtab list. */

const SW = 1440;
const SH = 900;

function App() {
  return (
    <DesignCanvas>

      {/* ─── 0. Cover + IA proofs ─────────────────────────────────── */}
      <DCSection id="cover" title="Round 4 · Library upgrade · everything-in-one-prototype" subtitle="R3 surfaces are unchanged. The new section below — Library · Round 4 — is where the mid-prompt library upgrade lives. Edit those JSX files (hifi-r4-lib-*.jsx) and refresh.">
        <DCArtboard id="r3-brief"   label="round 3 brief · what changed"     width={1440} height={580}><HF_R3Cover /></DCArtboard>
        <DCArtboard id="r3-audit"   label="chrome audit · all 7 workspaces"  width={1440} height={1280}><HF_ChromeAudit /></DCArtboard>
        <DCArtboard id="r3-iatable" label="IA contract · workspace · primary · sub-tabs · R7 retirements" width={1440} height={760}><HF_R3IATable /></DCArtboard>
      </DCSection>

      {/* ─── 1. Docs · top-level workspace (Wave 3 IA collapse) ─────── */}
      {/* Studio retired. The four Docs artboards keep their existing ids and
          component bindings (HF_StudioDocFull alias preserves R6/R7/R8 wiring);
          only their labels change. studio-workspace / studio-list /
          studio-calendar / studio-shipped are removed entirely. */}
      <DCSection id="docs" title="Docs · top-level workspace · home + list views + per-doc surface" subtitle="The adaptive block-doc with Coopr editing inline. Home is the card grid (Workspace becomes a Pinned filter here). List is the sortable table over the same data. Per-doc surfaces (full, hooks, notes) prove the shape adapts to the work. The slash menu is the block-atom entry point.">
        <DCArtboard id="studio-doc-full" label="Docs · full doc with Coopr inline (presence · diff · agent-added rows)" width={SW} height={SH * 2}><HF_StudioDocFull /></DCArtboard>
        <DCArtboard id="studio-doc-hooks" label="Docs · just hooks (proves shape adapts)"      width={SW} height={SH}><HF_StudioDocHooks /></DCArtboard>
        <DCArtboard id="studio-doc-notes" label="Docs · just loose notes (La Jolla scout)"     width={SW} height={SH}><HF_StudioDocNotes /></DCArtboard>
        <DCArtboard id="studio-slash"    label="Docs · block-atom slash menu (write · plan · schedule · drop in · ask Coopr)" width={SW} height={SH}><HF_StudioSlash /></DCArtboard>
      </DCSection>

      {/* ─── 1b. Clip Lab · top-level workspace · 5-step state machine ─── */}
      <DCSection id="cliplab" title="Clip Lab · top-level workspace · 5-step state machine" subtitle="Promoted out of Studio in Wave 3. Empty (day-one) → Import (drop-zone + drive + paste-link + upload ladder) → Auto-Clips (4×3 grid · 12 vertical thumbs · use/skip) → Review (16:9 player + transcript + AI cut suggestions) → Export (queued clips · per-channel chips · bulk caption · ship-all). Coopr presence band on every surface mirrors the R6 agent co-editor vocabulary.">
        <DCArtboard id="cliplab-empty"     label="Clip Lab · Empty (day one) · drop-zone · connect-drive · paste-link"                          width={SW} height={SH}>    <HF_ClipLabEmpty /></DCArtboard>
        <DCArtboard id="cliplab-import"    label="Clip Lab · Import · drop-zone band + 4-take upload ladder (extract → transcribe → analyze → ready)" width={SW} height={SH}>    <HF_ClipLabImport /></DCArtboard>
        <DCArtboard id="cliplab-autoclips" label="Clip Lab · Auto-Clips · 12 auto-detected vertical clips · 4×3 grid · use/skip"                  width={SW} height={SH}>    <HF_ClipLabAutoClips /></DCArtboard>
        <DCArtboard id="cliplab-review"    label="Clip Lab · Review · single-clip detail · 1280×720 player + transcript + 3 cut suggestions"      width={SW} height={SH * 2}><HF_ClipLabReview /></DCArtboard>
        <DCArtboard id="cliplab-export"    label="Clip Lab · Export · queued clips · per-channel chips · bulk captions · ship-all CTA"            width={SW} height={SH}>    <HF_ClipLabExport /></DCArtboard>
      </DCSection>

      {/* ─── 2. Onboarding ────────────────────────────────────────── */}
      <DCSection id="onboarding" title="Onboarding · signup → handle → 90s bootstrap → first chat" subtitle="Four screens, single progress bar.">
        <DCArtboard id="onb-1" label="01 · signup"                       width={SW} height={SH}><HF_Onb1Signup /></DCArtboard>
        <DCArtboard id="onb-2" label="02 · paste a handle"               width={SW} height={SH}><HF_Onb2Handle /></DCArtboard>
        <DCArtboard id="onb-3" label="03 · bootstrap (single progress)"  width={SW} height={SH}><HF_Onb3Loading /></DCArtboard>
        <DCArtboard id="onb-4" label="04 · first chat (pre-loaded)"      width={SW} height={SH}><HF_Onb4FirstChat /></DCArtboard>
      </DCSection>

      {/* ─── 3. Home · chat workspace ─────────────────────────────── */}
      <DCSection id="home" title="Home · the chat workspace" subtitle="Default chat, cold-open, active thread, empty-handle, briefing-collapse, command-center alt, plus a vertical library-rail variant (R5d).">
        <DCArtboard id="home-default"   label="Home · chat default · ATF chat + BTF desk (week ahead · library pulse · one thing)" width={SW} height={SH * 2}><HF_HomeChat /></DCArtboard>
        <DCArtboard id="home-rail"      label="Home · vertical variant · chat + library rail (R5d)" width={SW} height={SH}><HF_HomeWithLibraryRail /></DCArtboard>
        <DCArtboard id="home-coldopen"  label="Home · cold-open (day one)"              width={SW} height={SH}><HF_HomeColdOpen /></DCArtboard>
        <DCArtboard id="home-active"    label="Home · active thread"                    width={SW} height={SH}><HF_HomeActive /></DCArtboard>
        <DCArtboard id="home-empty"     label="Home · empty (no handle yet)"            width={SW} height={SH}><HF_HomeEmpty /></DCArtboard>
        <DCArtboard id="home-collapsed" label="Home · briefing collapsed after first send" width={SW} height={SH}><HF_HomeBriefingCollapsed /></DCArtboard>
        <DCArtboard id="home-command"   label="Home · command center (data-rich alt)"   width={SW} height={SH}><HF_HomeCommand /></DCArtboard>
      </DCSection>

      {/* ─── 4. Library — Round 4 ─────────────────────────────────── */}
      {/* R7 cull: Library R3 section (4 artboards) removed — fully superseded by Library R4 below. */}
      <DCSection
        id="library-r4"
        title="Library · Round 4 · the upgrade (in progress)"
        subtitle="Six surfaces built on a shared R4 visuals primitive (R4PlatformCard with density toggles, retention sparks, pillar dots, channel chips). Catalog is the new front door — sectioned by rhythm, not chronology. Detail is content-first. Series treats every multi-part project as a case file. Patterns is the meta layer (pillars · formats · hook DNA). Timeline is the journal. Pairing is one-idea-three-channels.">
        <DCArtboard id="r4-lib-catalog"          label="R4 · Catalog · GRID (default · R5f) · uniform 9:16 vertical · 7-col"         width={SW} height={SH}><HF_R4_LibraryCatalogGrid /></DCArtboard>
        <DCArtboard id="r4-lib-catalog-masonry"  label="R4 · Catalog · masonry variant · sectioned + hero (former default)"          width={SW} height={SH}><HF_R4_LibraryCatalog /></DCArtboard>
        <DCArtboard id="r4-lib-detail-yt" label="R4 · Detail · long-form (0042 · Truk flagship) · with deep analysis (Hook DNA · drop-offs · audience · comments · vs-cluster · reuse moments)" width={SW} height={SH * 3}><HF_R4_LibraryDetail postId="0042" /></DCArtboard>
        <DCArtboard id="r4-lib-detail-tt" label="R4 · Detail · short-form (0039 · 8-second rule) · with deep analysis"                                                                                            width={SW} height={SH * 3}><HF_R4_LibraryDetail postId="0039" /></DCArtboard>
        <DCArtboard id="r4-lib-series"   label="R4 · Series · case file (Truk Lagoon · 6 posts · arc + memory + cooking)" width={SW} height={SH}><HF_R4_LibrarySeries /></DCArtboard>
        <DCArtboard id="r4-lib-patterns" label="R4 · Patterns · pillars · formats · hook DNA (5-up)" width={SW} height={SH}><HF_R4_LibraryPatterns /></DCArtboard>
        <DCArtboard id="r4-lib-timeline" label="R4 · Timeline · vertical date-node spine (R5h) · scroll the journal" width={SW} height={SH * 3}><HF_R4_LibraryTimeline /></DCArtboard>
        <DCArtboard id="r4-lib-pairing"  label="R4 · Pairing · one idea × three channels" width={SW} height={SH}><HF_R4_LibraryPairing /></DCArtboard>
        <DCArtboard id="r4-lib-compare"  label="R4 · Compare · 3 posts side-by-side · curves overlaid · synthesis rail" width={SW} height={SH}><HF_R4_LibraryCompare /></DCArtboard>

        <DCPostIt top={20} right={20} rotate={2} width={220}>
          R5 (this loop): added Compare surface (the catalog chip finally lands
          somewhere). Patterns got a dashboard band above the fold. Catalog
          shows hover-state on first card + filter-active strip. Series rail
          weights cooking series with a soft-accent stripe + pill.
        </DCPostIt>
      </DCSection>

      {/* ─── 4c. Search · overlay + 3 page surfaces ───────────────── */}
      <DCSection id="search" title="Search · Cmd-K overlay + 3 full surfaces" subtitle="Stance B (overlay-only) — Search is an action invoked from any surface, not a workspace destination. The 'Search · ⌘K' chip already lives in every topbar; promoting Search to a workspace would duplicate it. Modern command-palette UX (Linear, Notion, Raycast) treats search as modal-over-context.">
        <DCArtboard id="search-overlay" label="Search · Cmd-K overlay · 720px palette over blurred Home backdrop · 8 grouped results · show-all"           width={SW} height={SH}><HF_SearchOverlay /></DCArtboard>
        <DCArtboard id="search-empty"   label="Search · cold state · italic-serif 'What are you looking for?' · 6 suggestion chips · recents + saved rail" width={SW} height={SH}><HF_SearchEmpty /></DCArtboard>
        <DCArtboard id="search-results" label="Search · full results · 280px filter rail (Type · Date · Pillar · Channel · Status) + 6 grouped scopes"     width={SW} height={SH}><HF_SearchResults /></DCArtboard>
        <DCArtboard id="search-history" label="Search · resumed query · active 'hook < 1.5s' · 5 recents + 1 saved 'My Tuesday review' in left rail"       width={SW} height={SH}><HF_SearchHistory /></DCArtboard>
      </DCSection>

      {/* ─── 5. Insights ──────────────────────────────────────────── */}
      <DCSection id="insights" title="Insights · Overview · Retention · Format DNA · Audience · Posting" subtitle="All five sub-tabs.">
        <DCArtboard id="insights-overview"   label="Insights · Overview"            width={SW} height={SH}><HF_InsightsOverview /></DCArtboard>
        <DCArtboard id="insights-retention"  label="Insights · Retention + DNA"     width={SW} height={SH}><HF_InsightsRetention /></DCArtboard>
        <DCArtboard id="insights-format-dna" label="Insights · Format DNA quadrant" width={SW} height={SH}><HF_InsightsFormatDNA /></DCArtboard>
        <DCArtboard id="insights-audience"   label="Insights · Audience cohorts"    width={SW} height={SH}><HF_InsightsAudience /></DCArtboard>
        <DCArtboard id="insights-posting"    label="Insights · Posting heatmap"     width={SW} height={SH}><HF_InsightsPosting /></DCArtboard>
      </DCSection>

      {/* ─── 6. Intel ─────────────────────────────────────────────── */}
      {/* All 6 surfaces run SH*2 (1800px) so the below-the-fold scroll content is visible on canvas. */}
      <DCSection id="intel" title="Intel · Trends · Radar · Inspiration · DNA · Memory · Studies" subtitle="The full Pulse · Dispatch №142 — six broadsheet sections, full vertical span.">
        <DCArtboard id="intel-trends"      label="Intel · Trends (Pulse cover · full scroll)"          width={SW} height={SH * 2}><HF_PulseForYou /></DCArtboard>
        <DCArtboard id="intel-radar"       label="Intel · Radar (signals + outcomes + dispatch log)"   width={SW} height={SH * 2}><HF_IntelRadar /></DCArtboard>
        <DCArtboard id="intel-inspiration" label="Intel · Inspiration (study list + swipes + applied)" width={SW} height={SH * 2}><HF_IntelInspiration /></DCArtboard>
        <DCArtboard id="intel-dna"         label="Intel · DNA (fingerprint + voice samples + drift)"   width={SW} height={SH * 2}><HF_IntelDNA /></DCArtboard>
        <DCArtboard id="intel-memory"      label="Intel · Memory (ledger + rules + strikes)"            width={SW} height={SH * 2}><HF_IntelMemory /></DCArtboard>
        <DCArtboard id="intel-studies"     label="Intel · Studies (lead + list + closed + pending)"     width={SW} height={SH * 2}><HF_IntelStudies /></DCArtboard>
      </DCSection>

      {/* ─── 7. Inbox ─────────────────────────────────────────────── */}
      <DCSection id="inbox" title="Inbox · Comments · DMs · Mentions · Replies" subtitle="All four sub-tabs on the editorial template — header band + KPI strip + 3-pane queue + BTF.">
        <DCArtboard id="inbox-comments" label="Inbox · Comments (R2 · editorial header · KPI strip · 3-pane queue · BTF sentiment + threads + CTA)" width={SW} height={SH * 2}><HF_InboxComments_R2 /></DCArtboard>
        <DCArtboard id="inbox-dms"      label="Inbox · DMs (R2 · editorial header · KPI strip · brand-fit queue · BTF accounts + CTA)"              width={SW} height={SH * 2}><HF_InboxDMs_R2 /></DCArtboard>
        <DCArtboard id="inbox-mentions" label="Inbox · Mentions (full scroll · sentiment + most-mentioned)" width={SW} height={SH * 2}><HF_InboxMentions /></DCArtboard>
        <DCArtboard id="inbox-replies"  label="Inbox · Replies sent (perf strip + older + what's working)"   width={SW} height={SH * 2}><HF_InboxReplies /></DCArtboard>
      </DCSection>

      {/* ─── 8. Calendar (top-level) · R2 surface set ─────────────── */}
      <DCSection id="calendar" title="Calendar · Week · Day · Month · Slot drawer · Conflict · Empty" subtitle="R1 week view + R2 set: Day, Month, Slot drawer (week+480px right drawer), Conflict (double-book resolver), Empty (day-one).">
        <DCArtboard id="calendar-week"     label="Calendar · this week (R1 baseline · drag-to-schedule)"                                       width={SW} height={SH}><HF_Calendar /></DCArtboard>
        <DCArtboard id="calendar-day"      label="Calendar · today · vertical hour-spine 06→22 · library drawer + one-thing rail"              width={SW} height={SH}><HF_CalendarDay /></DCArtboard>
        <DCArtboard id="calendar-month"    label="Calendar · April · 5×7 grid · weekend tint · count + top-slot per cell"                       width={SW} height={SH}><HF_CalendarMonth /></DCArtboard>
        <DCArtboard id="calendar-slot"     label="Calendar · slot drawer · week behind + 480px right drawer editing one slot"                   width={SW} height={SH}><HF_CalendarSlotDrawer /></DCArtboard>
        <DCArtboard id="calendar-conflict" label="Calendar · conflict · double-book inside 30min · clay alert + 3 resolutions (re-time/split/merge)" width={SW} height={SH}><HF_CalendarConflict /></DCArtboard>
        <DCArtboard id="calendar-empty"    label="Calendar · day-one empty · serif pull-quote + connect-channel CTA"                            width={SW} height={SH}><HF_CalendarEmpty /></DCArtboard>
      </DCSection>

      {/* ─── 9. Settings + Switcher · R2 full set ─────────────────── */}
      <DCSection id="settings" title="Settings · account · connections · brand voice · plan · notifications · data" subtitle="R2 — every section drafted, not just Connections. Stance: Settings stays flat (no shell subtabs); the in-surface 220px section nav handles navigation.">
        {/* R7 cull: settings-conn (R1 HF_Settings) removed — fully superseded by HF_SettingsConnections_R2 below. */}
        <DCArtboard id="settings-account"     label="Settings · Account · email + handle + tz + sessions + delete-account zone" width={SW} height={SH}><HF_SettingsAccount /></DCArtboard>
        <DCArtboard id="settings-brandvoice"  label="Settings · Brand voice · 5 voice samples + pillar weights + forbidden tones + credibility band" width={SW} height={SH}><HF_SettingsBrandVoice /></DCArtboard>
        <DCArtboard id="settings-plan"        label="Settings · Plan · ink Pro hero + usage matrix + invoices + payment method" width={SW} height={SH}><HF_SettingsPlan /></DCArtboard>
        <DCArtboard id="settings-notif"       label="Settings · Notifications · 3-channel × 8-category matrix + quiet-hours + presets" width={SW} height={SH}><HF_SettingsNotifications /></DCArtboard>
        <DCArtboard id="settings-conn-r2"     label="Settings · Connections (R2) · re-auth strip + scope chips + last-sync + 'what Coopr can see' disclosure" width={SW} height={SH}><HF_SettingsConnections_R2 /></DCArtboard>
        <DCArtboard id="settings-data"        label="Settings · Data & privacy · export + retention chip + privacy toggles + audit log + erase/delete zones" width={SW} height={SH}><HF_SettingsData /></DCArtboard>
      </DCSection>

      <DCSection id="switcher" title="Linked-accounts switcher · 3 placement options" subtitle="Same user, different connected platform identities.">
        <DCArtboard id="switcher-options" label="Switcher · 3 placements + recommendation" width={1440} height={760}><HF_LinkedSwitcher /></DCArtboard>
      </DCSection>

      {/* ─── 10. Patterns + System ────────────────────────────────── */}
      <DCSection id="patterns" title="Pattern decisions · cross-cutting" subtitle="Composer + menu, dimmed-chrome, inline AI.">
        <DCArtboard id="patterns-3" label="Patterns · plus-menu · dimmed chrome · inline AI" width={1440} height={620}><HF_PatternDecisions /></DCArtboard>
      </DCSection>

      <DCSection id="system" title="System · tokens, palette, inventory" subtitle="Where the visual language lives.">
        <DCArtboard id="tokens"        label="Token proposals · current vs proposed" width={1440} height={760}><HF_TokenProposals /></DCArtboard>
        <DCArtboard id="chart-variant" label="Chart palette · 3 options"             width={1440} height={420}><HF_ChartVariant /></DCArtboard>
        <DCArtboard id="inventory"     label="Component inventory"                    width={1440} height={520}><HF_Inventory /></DCArtboard>
      </DCSection>

    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
