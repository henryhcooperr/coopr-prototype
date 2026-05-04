/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard */
/* global HF_R3Cover, HF_ChromeAudit, HF_R3IATable */
/* global HF_HomeChat, HF_HomeColdOpen, HF_HomeActive, HF_HomeCommand, HF_HomeEmpty, HF_HomeBriefingCollapsed */
/* global HF_StudioPipeline, HF_StudioDocFull, HF_StudioDocHooks, HF_StudioDocNotes, HF_StudioList, HF_StudioCalendar, HF_StudioSlash, HF_StudioShipped */
/* global HF_LibraryGrid, HF_LibraryDetail, HF_LibraryArchive, HF_LibraryTable */
/* global HF_InsightsOverview, HF_InsightsRetention, HF_InsightsFormatDNA, HF_InsightsAudience, HF_InsightsPosting */
/* global HF_PulseForYou */
/* global HF_InboxComments, HF_InboxDMs, HF_InboxMentions, HF_InboxReplies */
/* global HF_Calendar */
/* global HF_Settings, HF_LinkedSwitcher */
/* global HF_Onb1Signup, HF_Onb2Handle, HF_Onb3Loading, HF_Onb4FirstChat */
/* global HF_PatternDecisions, HF_TokenProposals, HF_ChartVariant, HF_Inventory */

const SW = 1440;
const SH = 900;

function R3Headline() {
  return <HF_R3Cover />;
}

function App() {
  return (
    <DesignCanvas>

      {/* ─── 0. Cover + IA proofs ─────────────────────────────────── */}
      <DCSection id="cover" title="Round 3 · Studio gets the redesign · IA gets the audit" subtitle="Pinned anchor — what changed since round 2, and how to verify it.">
        <DCArtboard id="r3-brief"   label="round 3 brief · what changed"     width={1440} height={580}><HF_R3Cover /></DCArtboard>
        <DCArtboard id="r3-audit"   label="chrome audit · all 7 workspaces"  width={1440} height={1280}><HF_ChromeAudit /></DCArtboard>
        <DCArtboard id="r3-iatable" label="IA contract · workspace · primary · sub-tabs" width={1440} height={620}><HF_R3IATable /></DCArtboard>
      </DCSection>

      {/* ─── 1. Studio · the redesign ─────────────────────────────── */}
      <DCSection id="studio" title="Studio · 4 views of your projects · 3 doc shapes" subtitle="Pipeline kanban for many-projects-overview. Docs is inside-one-project. List for triage. Calendar for due-dates. Three doc shapes show the long-doc adapts to the project's actual size — full · just hooks · just notes.">
        <DCArtboard id="studio-pipeline" label="Studio · Pipeline (kanban) · many-projects overview" width={SW} height={SH}><HF_StudioPipeline /></DCArtboard>
        <DCArtboard id="studio-doc-full" label="Studio · Docs · full doc (Truk · ep. 1 hook)"           width={SW} height={SH}><HF_StudioDocFull /></DCArtboard>
        <DCArtboard id="studio-doc-hooks" label="Studio · Docs · just hooks (proves shape adapts)"      width={SW} height={SH}><HF_StudioDocHooks /></DCArtboard>
        <DCArtboard id="studio-doc-notes" label="Studio · Docs · just loose notes (La Jolla scout)"     width={SW} height={SH}><HF_StudioDocNotes /></DCArtboard>
        <DCArtboard id="studio-slash"    label="Studio · Docs · slash menu (block insertion)"            width={SW} height={SH}><HF_StudioSlash /></DCArtboard>
        <DCArtboard id="studio-list"     label="Studio · List · sortable index for triage"               width={SW} height={SH}><HF_StudioList /></DCArtboard>
        <DCArtboard id="studio-calendar" label="Studio · Calendar · project due-dates (NOT post schedule)" width={SW} height={SH}><HF_StudioCalendar /></DCArtboard>
        <DCArtboard id="studio-shipped"  label="Studio · Shipped · the closed file"                       width={SW} height={SH}><HF_StudioShipped /></DCArtboard>
      </DCSection>

      {/* ─── 2. Onboarding ────────────────────────────────────────── */}
      <DCSection id="onboarding" title="Onboarding · signup → handle → 90s bootstrap → first chat" subtitle="Four screens, single progress bar. Lands the user in chat with a pre-loaded message that names something true about them.">
        <DCArtboard id="onb-1" label="01 · signup"                       width={SW} height={SH}><HF_Onb1Signup /></DCArtboard>
        <DCArtboard id="onb-2" label="02 · paste a handle"               width={SW} height={SH}><HF_Onb2Handle /></DCArtboard>
        <DCArtboard id="onb-3" label="03 · bootstrap (single progress)"  width={SW} height={SH}><HF_Onb3Loading /></DCArtboard>
        <DCArtboard id="onb-4" label="04 · first chat (pre-loaded)"      width={SW} height={SH}><HF_Onb4FirstChat /></DCArtboard>
      </DCSection>

      {/* ─── 3. Home · chat workspace ─────────────────────────────── */}
      <DCSection id="home" title="Home · the chat workspace" subtitle="Default chat, cold-open, active thread, the empty-handle sandbox state, briefing-collapse on first send, and the data-rich command-center alt.">
        <DCArtboard id="home-default"   label="Home · chat default"                     width={SW} height={SH}><HF_HomeChat /></DCArtboard>
        <DCArtboard id="home-coldopen"  label="Home · cold-open (day one)"              width={SW} height={SH}><HF_HomeColdOpen /></DCArtboard>
        <DCArtboard id="home-active"    label="Home · active thread"                    width={SW} height={SH}><HF_HomeActive /></DCArtboard>
        <DCArtboard id="home-empty"     label="Home · empty (no handle yet)"            width={SW} height={SH}><HF_HomeEmpty /></DCArtboard>
        <DCArtboard id="home-collapsed" label="Home · briefing collapsed after first send" width={SW} height={SH}><HF_HomeBriefingCollapsed /></DCArtboard>
        <DCArtboard id="home-command"   label="Home · command center (data-rich alt)"   width={SW} height={SH}><HF_HomeCommand /></DCArtboard>
      </DCSection>

      {/* ─── 4. Library ───────────────────────────────────────────── */}
      <DCSection id="library" title="Library · platform-faithful + data-rich + table" subtitle="The platform-faithful card grid (real per-platform aspect ratios), post-detail modal, and the data-rich archive grid + sortable table for triage.">
        <DCArtboard id="library-grid"    label="Library · platform-faithful grid"  width={SW} height={SH}><HF_LibraryGrid /></DCArtboard>
        <DCArtboard id="library-detail"  label="Library · post detail modal"        width={SW} height={SH}><HF_LibraryDetail /></DCArtboard>
        <DCArtboard id="library-archive" label="Library · data-rich archive grid"   width={SW} height={SH}><HF_LibraryArchive /></DCArtboard>
        <DCArtboard id="library-table"   label="Library · sortable table"           width={SW} height={SH}><HF_LibraryTable /></DCArtboard>
      </DCSection>

      {/* ─── 5. Insights ──────────────────────────────────────────── */}
      <DCSection id="insights" title="Insights · Overview · Retention · Format DNA · Audience · Posting" subtitle="All five sub-tabs. Overview is a compact scoreboard. Format DNA puts your formats on a volume×yield quadrant. Posting heatmap quantifies the cost of a missed Tuesday.">
        <DCArtboard id="insights-overview"   label="Insights · Overview"            width={SW} height={SH}><HF_InsightsOverview /></DCArtboard>
        <DCArtboard id="insights-retention"  label="Insights · Retention + DNA"     width={SW} height={SH}><HF_InsightsRetention /></DCArtboard>
        <DCArtboard id="insights-format-dna" label="Insights · Format DNA quadrant" width={SW} height={SH}><HF_InsightsFormatDNA /></DCArtboard>
        <DCArtboard id="insights-audience"   label="Insights · Audience cohorts"    width={SW} height={SH}><HF_InsightsAudience /></DCArtboard>
        <DCArtboard id="insights-posting"    label="Insights · Posting heatmap"     width={SW} height={SH}><HF_InsightsPosting /></DCArtboard>
      </DCSection>

      {/* ─── 6. Intel ─────────────────────────────────────────────── */}
      <DCSection id="intel" title="Intel · Trends (broadsheet)" subtitle="Outward-facing surface. Pulse rebuilt as broadsheet. Memory + Studies live here too — broadsheet treatment in next iteration.">
        <DCArtboard id="intel-trends" label="Intel · Trends (For You broadsheet)" width={SW} height={SH}><HF_PulseForYou /></DCArtboard>
      </DCSection>

      {/* ─── 7. Inbox ─────────────────────────────────────────────── */}
      <DCSection id="inbox" title="Inbox · Comments · DMs · Mentions · Replies" subtitle="Sprout's intent-pre-classified pattern: messages grouped by intent (questions / brand outreach / fans / spam), each with a sentiment + intent label and a voice-matched AI reply suggestion in the right rail.">
        <DCArtboard id="inbox-comments" label="Inbox · Comments (intent-grouped)" width={SW} height={SH}><HF_InboxComments /></DCArtboard>
        <DCArtboard id="inbox-dms"      label="Inbox · DMs (brand priority)"      width={SW} height={SH}><HF_InboxDMs /></DCArtboard>
        <DCArtboard id="inbox-mentions" label="Inbox · Mentions"                  width={SW} height={SH}><HF_InboxMentions /></DCArtboard>
        <DCArtboard id="inbox-replies"  label="Inbox · Replies sent (perf)"       width={SW} height={SH}><HF_InboxReplies /></DCArtboard>
      </DCSection>

      {/* ─── 8. Calendar (top-level) ──────────────────────────────── */}
      <DCSection id="calendar" title="Calendar · top-level cross-platform schedule" subtitle="Promoted to a peer surface — distinct from Studio · Calendar (which shows project due-dates only). Drag from Library → drop on a slot → post builder opens pre-populated.">
        <DCArtboard id="calendar-week" label="Calendar · this week (drag-to-schedule)" width={SW} height={SH}><HF_Calendar /></DCArtboard>
      </DCSection>

      {/* ─── 9. Settings + Switcher ───────────────────────────────── */}
      <DCSection id="settings" title="Settings · account · connections · brand voice · plan" subtitle="Connections is the most material section — a single user with multiple linked platform accounts (a tutorials channel, a behind-the-scenes IG, a TikTok). One per platform marks as primary.">
        <DCArtboard id="settings-conn" label="Settings · Connections" width={SW} height={SH}><HF_Settings /></DCArtboard>
      </DCSection>

      <DCSection id="switcher" title="Linked-accounts switcher · 3 placement options" subtitle="Same user, different connected platform identities — Library, Insights and Inbox follow whichever is active. Three placements compared: dedicated topbar chip · avatar dropdown · ⌘K palette only.">
        <DCArtboard id="switcher-options" label="Switcher · 3 placements + recommendation" width={1440} height={760}><HF_LinkedSwitcher /></DCArtboard>
      </DCSection>

      {/* ─── 10. Patterns + System ────────────────────────────────── */}
      <DCSection id="patterns" title="Pattern decisions · cross-cutting" subtitle="Three small mechanics applied to every workspace: composer + menu (how 285 backend tools become discoverable), dimmed-chrome deep-work mode, and inline AI summoned by space-bar on an empty line.">
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
