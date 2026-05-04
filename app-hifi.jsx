/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard */
/* global HF_HomeChat, HF_HomeColdOpen, HF_HomeActive, HF_HomeCommand */
/* global HF_ChatDefault, HF_ChatEmpty, HF_ChatActive */
/* global HF_StudioDoc, HF_StudioSlash, HF_StudioShortDoc, HF_StudioThreads */
/* global HF_LibraryGrid, HF_LibraryDetail, HF_LibraryAll, HF_LibraryArchive, HF_LibraryTable */
/* global HF_InsightsRetention, HF_InsightsAudience, HF_AudienceOverview */
/* global HF_PulseForYou */
/* global HF_TokenProposals, HF_ChartVariant, HF_Inventory */
/* global HF_InboxComments, HF_InboxDMs, HF_InboxMentions, HF_InboxReplies */
/* global HF_InsightsOverview, HF_InsightsFormatDNA, HF_InsightsPosting */
/* global HF_StudioPipeline, HF_StudioShipped */
/* global HF_Calendar */
/* global HF_Settings */
/* global HF_LinkedSwitcher */
/* global HF_Onb1Signup, HF_Onb2Handle, HF_Onb3Loading, HF_Onb4FirstChat */
/* global HF_HomeEmpty, HF_HomeBriefingCollapsed */
/* global HF_PatternDecisions */

const SCREEN_W = 1440;
const SCREEN_H = 900;

function Headline() {
  return (
    <div className="hf" style={{ padding: '8px 4px', maxWidth: 1440 }}>
      <div className="hf-card-eyebrow" style={{ marginBottom: 8 }}>HI-FI · ROUND 2 · NEW IA · ALL SCREENS</div>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 34, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.015em', lineHeight: 1.15, marginBottom: 8 }}>
        Six workspaces, end-to-end. Inbox, Calendar, Settings, Onboarding — finally on the page.
      </div>
      <div style={{ fontSize: 14, color: 'var(--fg-secondary)', maxWidth: 880, lineHeight: 1.55 }}>
        Round 1 hit Home, Studio, Library and the editorial Intel broadsheet. Round 2 closes the gap: the four Inbox sub-tabs, the three missing Insights views, the Studio kanban + Shipped, top-level Calendar with drag-from-Library, Settings, three placements for the linked-accounts switcher, four onboarding screens, the empty-home and briefing-collapse states, plus the cross-cutting pattern decisions.
      </div>
    </div>
  );
}

function App() {
  return (
    <DesignCanvas>

      <DCSection id="cover" title="Round 2 · all surfaces, end-to-end" subtitle="Pinned anchor — COOPR turns 'what should I make next?' into a 60-second briefing-to-artifact loop. Every section below is one slice of that loop, on the new IA chrome.">
        <DCArtboard id="headline" label="round 2 brief" width={1440} height={200}><Headline /></DCArtboard>
      </DCSection>

      <DCSection id="onboarding" title="Onboarding · signup → handle → 90s bootstrap → first chat" subtitle="Four screens. Single progress bar (no 14-step pipeline). Lands the user in chat with a pre-loaded message that names something true about them.">
        <DCArtboard id="onb-1" label="01 · signup" width={SCREEN_W} height={SCREEN_H}><HF_Onb1Signup /></DCArtboard>
        <DCArtboard id="onb-2" label="02 · paste a handle" width={SCREEN_W} height={SCREEN_H}><HF_Onb2Handle /></DCArtboard>
        <DCArtboard id="onb-3" label="03 · bootstrap (single progress)" width={SCREEN_W} height={SCREEN_H}><HF_Onb3Loading /></DCArtboard>
        <DCArtboard id="onb-4" label="04 · first chat (pre-loaded)" width={SCREEN_W} height={SCREEN_H}><HF_Onb4FirstChat /></DCArtboard>
      </DCSection>

      <DCSection id="home" title="Home · the chat workspace" subtitle="Default chat (round 1), the empty-home state for users with no handle yet, and the briefing-collapse-on-first-send interaction.">
        <DCArtboard id="home-default"  label="Home · chat default"           width={SCREEN_W} height={SCREEN_H}><HF_HomeChat /></DCArtboard>
        <DCArtboard id="home-coldopen" label="Home · chat cold-open (day 1)" width={SCREEN_W} height={SCREEN_H}><HF_HomeColdOpen /></DCArtboard>
        <DCArtboard id="home-active"   label="Home · chat active thread"     width={SCREEN_W} height={SCREEN_H}><HF_HomeActive /></DCArtboard>
        <DCArtboard id="home-empty"    label="Home · empty (no handle yet)"  width={SCREEN_W} height={SCREEN_H}><HF_HomeEmpty /></DCArtboard>
        <DCArtboard id="home-collapsed" label="Home · briefing collapsed after first send" width={SCREEN_W} height={SCREEN_H}><HF_HomeBriefingCollapsed /></DCArtboard>
        <DCArtboard id="home-command"  label="Home · command center (data-rich alt)" width={SCREEN_W} height={SCREEN_H}><HF_HomeCommand /></DCArtboard>
      </DCSection>

      <DCSection id="inbox" title="Inbox · comments · DMs · mentions · replies" subtitle="The biggest gap in round 1 — zero screens despite 12 backend endpoints. Sprout's intent-pre-classified pattern: messages grouped by intent (questions / brand outreach / fans / spam), each with a sentiment + intent label and a voice-matched AI reply suggestion in the right rail.">
        <DCArtboard id="inbox-comments" label="Inbox · Comments (intent-grouped)" width={SCREEN_W} height={SCREEN_H}><HF_InboxComments /></DCArtboard>
        <DCArtboard id="inbox-dms"      label="Inbox · DMs (brand priority)"      width={SCREEN_W} height={SCREEN_H}><HF_InboxDMs /></DCArtboard>
        <DCArtboard id="inbox-mentions" label="Inbox · Mentions"                  width={SCREEN_W} height={SCREEN_H}><HF_InboxMentions /></DCArtboard>
        <DCArtboard id="inbox-replies"  label="Inbox · Replies sent (perf)"       width={SCREEN_W} height={SCREEN_H}><HF_InboxReplies /></DCArtboard>
      </DCSection>

      <DCSection id="studio" title="Studio · Pipeline · Docs · Shipped" subtitle="Pipeline kanban is the many-projects overview; Docs is the long-doc inside one project. Shipped is the closed file — what was learned. Round 1's Threads landing kept as a wireframe-faithful alt.">
        <DCArtboard id="studio-pipeline" label="Studio · Pipeline (kanban)"      width={SCREEN_W} height={SCREEN_H}><HF_StudioPipeline /></DCArtboard>
        <DCArtboard id="studio-doc"      label="Studio · unified doc (Truk Lagoon)" width={SCREEN_W} height={SCREEN_H}><HF_StudioDoc /></DCArtboard>
        <DCArtboard id="studio-slash"    label="Studio · slash menu open"        width={SCREEN_W} height={SCREEN_H}><HF_StudioSlash /></DCArtboard>
        <DCArtboard id="studio-short"    label="Studio · short doc (La Jolla list)" width={SCREEN_W} height={SCREEN_H}><HF_StudioShortDoc /></DCArtboard>
        <DCArtboard id="studio-shipped"  label="Studio · Shipped (closed file)"  width={SCREEN_W} height={SCREEN_H}><HF_StudioShipped /></DCArtboard>
        <DCArtboard id="studio-threads"  label="Studio · Threads landing (alt)"  width={SCREEN_W} height={SCREEN_H}><HF_StudioThreads /></DCArtboard>
      </DCSection>

      <DCSection id="calendar" title="Calendar · top-level cross-platform schedule" subtitle="Promoted to a peer surface. Drag-from-Library scheduling — drop a thumbnail onto a calendar slot, post builder opens pre-populated. Cells coloured by platform; empty slots show as dashed targets.">
        <DCArtboard id="calendar-week" label="Calendar · this week" width={SCREEN_W} height={SCREEN_H}><HF_Calendar /></DCArtboard>
      </DCSection>

      <DCSection id="library" title="Library · platform-faithful + data-rich + wireframe" subtitle="The platform-faithful card grid (real per-platform aspect ratios), post-detail modal, the data-rich archive grid, the sortable table, and the wireframe table. Platform tabs are filter chips on All — not separate destinations.">
        <DCArtboard id="library-grid"    label="Library · platform-faithful grid"   width={SCREEN_W} height={SCREEN_H}><HF_LibraryGrid /></DCArtboard>
        <DCArtboard id="library-detail"  label="Library · post detail modal"          width={SCREEN_W} height={SCREEN_H}><HF_LibraryDetail /></DCArtboard>
        <DCArtboard id="library-archive" label="Library · data-rich archive grid"     width={SCREEN_W} height={SCREEN_H}><HF_LibraryArchive /></DCArtboard>
        <DCArtboard id="library-table"   label="Library · sortable table"             width={SCREEN_W} height={SCREEN_H}><HF_LibraryTable /></DCArtboard>
        <DCArtboard id="library-all"     label="Library · All (wireframe-faithful)"   width={SCREEN_W} height={SCREEN_H}><HF_LibraryAll /></DCArtboard>
      </DCSection>

      <DCSection id="insights" title="Insights · Overview · Format DNA · Posting · Retention · Audience" subtitle="The three sub-tabs that round 1 skipped, plus the two it shipped. Overview is a compact scoreboard with a 'what worked / what didn't' rail. Format DNA puts your formats on a volume×yield quadrant. Posting is a heatmap that quantifies the cost of a missed Tuesday.">
        <DCArtboard id="insights-overview"   label="Insights · Overview" width={SCREEN_W} height={SCREEN_H}><HF_InsightsOverview /></DCArtboard>
        <DCArtboard id="insights-format-dna" label="Insights · Format DNA (quadrant + archetypes)" width={SCREEN_W} height={SCREEN_H}><HF_InsightsFormatDNA /></DCArtboard>
        <DCArtboard id="insights-posting"    label="Insights · Posting (heatmap + cadence)" width={SCREEN_W} height={SCREEN_H}><HF_InsightsPosting /></DCArtboard>
        <DCArtboard id="insights-retention"  label="Insights · Retention + Format DNA (round 1)" width={SCREEN_W} height={SCREEN_H}><HF_InsightsRetention /></DCArtboard>
        <DCArtboard id="insights-audience"   label="Insights · Audience cohorts (round 1)" width={SCREEN_W} height={SCREEN_H}><HF_InsightsAudience /></DCArtboard>
        <DCArtboard id="insights-aud-over"   label="Insights · Audience overview (charts, round 1)" width={SCREEN_W} height={SCREEN_H}><HF_AudienceOverview /></DCArtboard>
      </DCSection>

      <DCSection id="intel" title="Intel · Trends (broadsheet)" subtitle="Pulse rebuilt as broadsheet — the lead story / inverted stat block / three-up sub-stories. Memory + Studies live under Intel. Other sub-tabs (Radar, Inspiration, DNA) inherit the same broadsheet treatment in next iteration.">
        <DCArtboard id="intel-trends" label="Intel · Trends (For You broadsheet)" width={SCREEN_W} height={SCREEN_H}><HF_PulseForYou /></DCArtboard>
      </DCSection>

      <DCSection id="settings" title="Settings · account · connections · brand voice · plan" subtitle="The avatar-dropdown destination. Connections is the most material section — a single user with multiple linked platform accounts (a tutorials channel, a behind-the-scenes IG, a TikTok). One per platform marks as primary.">
        <DCArtboard id="settings-conn" label="Settings · Connections" width={SCREEN_W} height={SCREEN_H}><HF_Settings /></DCArtboard>
      </DCSection>

      <DCSection id="switcher" title="Linked-accounts switcher · 3 placement options" subtitle="Same user, different connected platform identities — Library, Insights and Inbox follow whichever is active. Three placements compared: dedicated topbar chip · avatar dropdown · ⌘K palette only.">
        <DCArtboard id="switcher-options" label="Switcher · 3 placements + recommendation" width={1440} height={760}><HF_LinkedSwitcher /></DCArtboard>
      </DCSection>

      <DCSection id="patterns" title="Pattern decisions · cross-cutting" subtitle="Three small mechanics applied to every workspace: composer + menu (how 285 backend tools become discoverable), dimmed-chrome deep-work mode, and inline AI summoned by space-bar on an empty line.">
        <DCArtboard id="patterns-3" label="Patterns · plus-menu · dimmed chrome · inline AI" width={1440} height={620}><HF_PatternDecisions /></DCArtboard>
      </DCSection>

      <DCSection id="system" title="System · tokens, palette, inventory" subtitle="Where the visual language lives.">
        <DCArtboard id="tokens"        label="Token proposals · current vs proposed" width={1440} height={760}><HF_TokenProposals /></DCArtboard>
        <DCArtboard id="chart-variant" label="Chart palette · 3 options"               width={1440} height={420}><HF_ChartVariant /></DCArtboard>
        <DCArtboard id="inventory"     label="Component inventory"                      width={1440} height={520}><HF_Inventory /></DCArtboard>
      </DCSection>

    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
