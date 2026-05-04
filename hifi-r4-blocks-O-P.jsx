/* global React, window, Frame, Eyebrow, Footer, FooterChip, Icon, Stat, ProgressBar, ChannelChip, AvatarDisc, registerBlock,
   R4BDrawPath, R4BStaggerBars, R4BSweepDonut, R4BCountUp, R4BWordReveal,
   R4FSkelLine, R4FSkelBars, R4FSkelCurve, R4FSkelRows, R4FSkelTiles,
   R4FToolEmpty, R4FToolError, R4FToolLoading,
   R4BSocialProfileCard, R4BMediaTransferCard, R4BDataEntryState, R4BStateStrip, r4gProfileFromPeer,
   R4GOutcomeRail, R4GOutcomeMediaStack, R4GOutcomePackage */
/* hifi-r4-blocks-O-P.jsx - R4C capability blocks: Social Intel and Imports. */

// ─── O · per-tool state stubs ─────────────────────────────────────────────
function O01Loading({ onCancel }) { return <R4FToolLoading id="O01" eyebrow="PLATFORM SCAN · LOADING" caption="Scanning YouTube, Instagram, and TikTok for signal…" shape="channel-rows" shapeProps={{ count: 3 }} onCancel={onCancel} />; }
function O01Empty({ onAsk }) { return <R4FToolEmpty id="O01" eyebrow="PLATFORM SCAN · EMPTY" body="No platforms connected." ctas={[{ label: 'Connect a platform', icon: 'plus', onClick: onAsk }]} />; }
function O01Error({ onRetry }) { return <R4FToolError id="O01" eyebrow="PLATFORM SCAN · ERROR" body="Two platform APIs rate-limited at once." ctas={[{ label: 'Show partial, retry rest in 10 min', onClick: onRetry }]} />; }

function O02Loading({ onCancel }) { return <R4FToolLoading id="O02" eyebrow="YOUTUBE · LOADING" caption="Searching YouTube for examples ranked by relevance…" shape="channel-rows" shapeProps={{ count: 5 }} onCancel={onCancel} />; }
function O02Empty({ onAsk }) { return <R4FToolEmpty id="O02" eyebrow="YOUTUBE · EMPTY" body="No YouTube matches above relevance threshold." ctas={[{ label: 'Loosen query', onClick: onAsk }]} />; }
function O02Error({ onRetry }) { return <R4FToolError id="O02" eyebrow="YOUTUBE · ERROR" body="YouTube quota exhausted for the day." ctas={[{ label: 'Resume tomorrow', onClick: onRetry }]} />; }

function O03Loading({ onCancel }) { return <R4FToolLoading id="O03" eyebrow="TIKTOK · LOADING" caption="Pulling 6 TikTok examples with trend fit…" shape="tile-cascade" shapeProps={{ rows: 2, cols: 3, h: 56 }} onCancel={onCancel} />; }
function O03Empty({ onAsk }) { return <R4FToolEmpty id="O03" eyebrow="TIKTOK · EMPTY" body="No TikTok trend matches. Try YouTube Shorts instead?" ctas={[{ label: 'Try YT Shorts', onClick: onAsk }]} />; }
function O03Error({ onRetry }) { return <R4FToolError id="O03" eyebrow="TIKTOK · ERROR" body="TikTok scraping rate-limited." ctas={[{ label: 'Use cached results', onClick: onRetry }]} />; }

function O04Loading({ onCancel }) { return <R4FToolLoading id="O04" eyebrow="REELS CLUSTER · LOADING" caption="Clustering 24 Reels by topic + creative move…" shape="tile-cascade" shapeProps={{ rows: 2, cols: 4, h: 48 }} onCancel={onCancel} />; }
function O04Empty({ onAsk }) { return <R4FToolEmpty id="O04" eyebrow="REELS CLUSTER · EMPTY" body="No Reels matched the topic. Loosen the cluster?" ctas={[{ label: 'Loosen cluster', onClick: onAsk }]} />; }
function O04Error({ onRetry }) { return <R4FToolError id="O04" eyebrow="REELS CLUSTER · ERROR" body="Reel previews unavailable — IG limits public preview." ctas={[{ label: 'Show titles only', onClick: onRetry }]} />; }

function O05Loading({ onCancel }) { return <R4FToolLoading id="O05" eyebrow="FORUM CLUSTER · LOADING" caption="Clustering 87 threads by audience language…" shape="channel-rows" shapeProps={{ count: 4 }} onCancel={onCancel} />; }
function O05Empty({ onAsk }) { return <R4FToolEmpty id="O05" eyebrow="FORUM CLUSTER · EMPTY" body="No active threads in tracked forums." ctas={[{ label: 'Add a forum', icon: 'plus', onClick: onAsk }]} />; }
function O05Error({ onRetry }) { return <R4FToolError id="O05" eyebrow="FORUM CLUSTER · ERROR" body="Forum auth expired." ctas={[{ label: 'Re-auth', onClick: onRetry }]} />; }

function O06Loading({ onCancel }) { return <R4FToolLoading id="O06" eyebrow="PEER LANE · LOADING" caption="Positioning 12 peer creators by format + authority…" shape="scatter-pop" shapeProps={{ h: 140, count: 12 }} onCancel={onCancel} />; }
function O06Empty({ onAsk }) { return <R4FToolEmpty id="O06" eyebrow="PEER LANE · EMPTY" body="No tracked peers. Add peers in Intel · Radar." ctas={[{ label: 'Open Intel · Radar', icon: 'arrow-up-right', onClick: onAsk }]} />; }
function O06Error({ onRetry }) { return <R4FToolError id="O06" eyebrow="PEER LANE · ERROR" body="Peer authority signal unavailable for new accounts." ctas={[{ label: 'Show only peers ≥3mo', onClick: onRetry }]} />; }

function O07Loading({ onCancel }) { return <R4FToolLoading id="O07" eyebrow="HASHTAG TREND · LOADING" caption="Tracking 3 trend signals by velocity…" shape="curve-loop" shapeProps={{ h: 100, count: 3, variant: 'growth' }} onCancel={onCancel} />; }
function O07Empty({ onAsk }) { return <R4FToolEmpty id="O07" eyebrow="HASHTAG TREND · EMPTY" body="No tracked tags moving today." ctas={[{ label: 'Add tags to track', icon: 'plus', onClick: onAsk }]} />; }
function O07Error({ onRetry }) { return <R4FToolError id="O07" eyebrow="HASHTAG TREND · ERROR" body="TikTok sound API returned partial — 2 sounds unscored." ctas={[{ label: 'Show tags only', onClick: onRetry }]} />; }

function O08Loading({ onCancel }) { return <R4FToolLoading id="O08" eyebrow="COMMENT-FIELD · LOADING" caption="Fast-scanning 1.4k comments by intent…" shape="comment-rows" shapeProps={{ count: 4 }} onCancel={onCancel} />; }
function O08Empty({ onAsk }) { return <R4FToolEmpty id="O08" eyebrow="COMMENT-FIELD · EMPTY" body="Target post too new — fewer than 20 public comments." ctas={[{ label: 'Wait 1h', onClick: onAsk }, { label: 'Pick different post', onClick: onAsk }]} />; }
function O08Error({ onRetry }) { return <R4FToolError id="O08" eyebrow="COMMENT-FIELD · ERROR" body="Comment scrape rate-limited." ctas={[{ label: 'Use cached comments', onClick: onRetry }]} />; }

// ─── P · per-tool state stubs ─────────────────────────────────────────────
function P01Loading({ onCancel }) { return <R4FToolLoading id="P01" eyebrow="CONNECT · LOADING" caption="Loading required access scopes…" shape="channel-rows" shapeProps={{ count: 3 }} onCancel={onCancel} />; }
function P01Empty({ onAsk }) { return <R4FToolEmpty id="P01" eyebrow="CONNECT · EMPTY" body="No source available to connect." ctas={[{ label: 'Pick from list', onClick: onAsk }]} />; }
function P01Error({ onRetry }) { return <R4FToolError id="P01" eyebrow="CONNECT · ERROR" body="OAuth state mismatched — most often a stale browser tab." ctas={[{ label: 'Restart connection', onClick: onRetry }]} />; }

function P02Loading({ onCancel }) { return <R4FToolLoading id="P02" eyebrow="SYNC STATUS · LOADING" caption="Checking what 3 connected accounts have indexed…" shape="channel-rows" shapeProps={{ count: 3 }} onCancel={onCancel} />; }
function P02Empty({ onAsk }) { return <R4FToolEmpty id="P02" eyebrow="SYNC STATUS · EMPTY" body="No accounts connected." ctas={[{ label: 'Connect account', icon: 'plus', onClick: onAsk }]} />; }
function P02Error({ onRetry }) { return <R4FToolError id="P02" eyebrow="SYNC STATUS · ERROR" body="One account auth token expired silently." ctas={[{ label: 'Re-auth that account', onClick: onRetry }]} />; }

function P03Loading({ onCancel }) { return <R4FToolLoading id="P03" eyebrow="UPLOAD PARSE · LOADING" caption="Parsing fiji-ep1.mp4 (240 MB)…" shape="progress-loop" shapeProps={{ h: 18 }} onCancel={onCancel} />; }
function P03Empty({ onAsk }) { return <R4FToolEmpty id="P03" eyebrow="UPLOAD PARSE · EMPTY" body="No active uploads. Drop files here." ctas={[{ label: 'Upload', icon: 'plus', onClick: onAsk }]} />; }
function P03Error({ onRetry }) { return <R4FToolError id="P03" eyebrow="UPLOAD PARSE · ERROR" body="File over size limit (200 MB)." ctas={[{ label: 'Compress and retry', onClick: onRetry }]} />; }

function P04Loading({ onCancel }) { return <R4FToolLoading id="P04" eyebrow="TRANSCRIPT · LOADING" caption="Transcribing 12:48 of source video…" shape="transcript-stream" shapeProps={{ lines: 4 }} onCancel={onCancel} />; }
function P04Empty({ onAsk }) { return <R4FToolEmpty id="P04" eyebrow="TRANSCRIPT · EMPTY" body="No video uploaded." ctas={[{ label: 'Upload video', icon: 'plus', onClick: onAsk }]} />; }
function P04Error({ onRetry }) { return <R4FToolError id="P04" eyebrow="TRANSCRIPT · ERROR" body="Transcript model failed on heavily-accented audio." ctas={[{ label: 'Try alternative model', onClick: onRetry }]} />; }

function P05Loading({ onCancel }) { return <R4FToolLoading id="P05" eyebrow="OCR · LOADING" caption="OCR'ing 4 screenshots into text + visual facts…" shape="tile-cascade" shapeProps={{ rows: 2, cols: 2, h: 50 }} onCancel={onCancel} />; }
function P05Empty({ onAsk }) { return <R4FToolEmpty id="P05" eyebrow="OCR · EMPTY" body="No images uploaded." ctas={[{ label: 'Drop screenshots', icon: 'plus', onClick: onAsk }]} />; }
function P05Error({ onRetry }) { return <R4FToolError id="P05" eyebrow="OCR · ERROR" body="OCR failed on low-resolution images." ctas={[{ label: 'Try high-res mode', onClick: onRetry }]} />; }

function P06Loading({ onCancel }) { return <R4FToolLoading id="P06" eyebrow="COVERAGE · LOADING" caption="Auditing what data is missing for answer quality…" shape="channel-rows" shapeProps={{ count: 3 }} onCancel={onCancel} />; }
function P06Empty({ onAsk }) { return <R4FToolEmpty id="P06" eyebrow="COVERAGE · EMPTY" body="Coverage complete — no gaps. Re-scan with stricter criteria?" ctas={[{ label: 'Re-scan', onClick: onAsk }]} />; }
function P06Error({ onRetry }) { return <R4FToolError id="P06" eyebrow="COVERAGE · ERROR" body="Coverage check requires all platforms connected." ctas={[{ label: 'Connect missing', onClick: onRetry }]} />; }

function P07Loading({ onCancel }) { return <R4FToolLoading id="P07" eyebrow="DISCLOSURE · LOADING" caption="Auditing what was read and what was not…" shape="channel-rows" shapeProps={{ count: 3 }} onCancel={onCancel} />; }
function P07Empty({ onAsk }) { return <R4FToolEmpty id="P07" eyebrow="DISCLOSURE · EMPTY" body="Nothing read this thread — disclosure trivially empty." ctas={[{ label: 'Re-audit', onClick: onAsk }]} />; }
function P07Error({ onRetry }) { return <R4FToolError id="P07" eyebrow="DISCLOSURE · ERROR" body="Disclosure cache stale — re-audit needed." ctas={[{ label: 'Re-audit', onClick: onRetry }]} />; }

function P08Loading({ onCancel }) { return <R4FToolLoading id="P08" eyebrow="RE-AUTH · LOADING" caption="Checking expired or failed connections…" shape="channel-rows" shapeProps={{ count: 2 }} onCancel={onCancel} />; }
function P08Empty({ onAsk }) { return <R4FToolEmpty id="P08" eyebrow="RE-AUTH · EMPTY" body="No expired connections. All set." ctas={[{ label: 'Force re-check', onClick: onAsk }]} />; }
function P08Error({ onRetry }) { return <R4FToolError id="P08" eyebrow="RE-AUTH · ERROR" body="Re-auth itself failed — usually a third-party outage." ctas={[{ label: 'Open outage status', icon: 'arrow-up-right', onClick: onRetry }]} />; }


function OPMetricRow({ label, value, pct, hot = false }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '112px 1fr 48px', gap: 10, alignItems: 'center' }}>
      <span className="mono" style={{ fontSize: 9.5, color: hot ? 'var(--accent-primary)' : 'var(--fg-secondary)', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</span>
      <ProgressBar pct={pct} accent={hot} />
      <span className="num mono" style={{ fontSize: 10, color: hot ? 'var(--accent-primary)' : 'var(--fg-tertiary)', textAlign: 'right', fontWeight: 800 }}>{value}</span>
    </div>
  );
}

function OPCardRow({ channel, title, meta, score }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(54px, 70px) minmax(0, 1fr) 44px', gap: 10, alignItems: 'center', padding: '8px 0', borderTop: '1px dotted var(--border-subtle)', minWidth: 0 }}>
      <span style={{ minWidth: 0, overflow: 'hidden' }}><ChannelChip channel={channel} /></span>
      <div style={{ minWidth: 0 }}>
        <div className="serif-it" style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--fg-primary)', lineHeight: 1.25 }}>{title}</div>
        <div className="mono" style={{ fontSize: 9.5, color: 'var(--fg-tertiary)', marginTop: 3, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{meta}</div>
      </div>
      <span className="num mono" style={{ fontSize: 11, color: score > 80 ? 'var(--accent-primary)' : 'var(--fg-secondary)', fontWeight: 800, textAlign: 'right' }}>{score}</span>
    </div>
  );
}

function OPDetailRow({ label, value, state = 'idle' }) {
  const accent = state === 'ok';
  const warn = state === 'warn';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '108px 1fr', gap: 10, alignItems: 'baseline', padding: '7px 0', borderTop: '1px dotted var(--border-subtle)' }}>
      <span className="mono" style={{ fontSize: 9, color: accent ? 'var(--accent-primary)' : warn ? 'var(--tone-warning)' : 'var(--fg-tertiary)', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</span>
      <span className="serif-it" style={{ fontSize: 13.5, color: warn ? 'var(--tone-warning)' : 'var(--fg-secondary)', lineHeight: 1.35 }}>{value}</span>
    </div>
  );
}

function OPSourceTile({ channel, label, meta, score }) {
  const hot = score > 80;
  return (
    <div style={{ padding: 10, borderRadius: 6, background: hot ? 'var(--accent-soft)' : 'var(--surface-2)', border: hot ? '1px solid var(--accent-ring)' : '1px solid var(--border-subtle)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <ChannelChip channel={channel} />
        <span className="num mono" style={{ color: hot ? 'var(--accent-primary)' : 'var(--fg-secondary)', fontWeight: 800 }}>{score}</span>
      </div>
      <div className="serif-it" style={{ fontSize: 13.5, marginTop: 8, fontWeight: 600, lineHeight: 1.2 }}>{label}</div>
      <div className="mono" style={{ fontSize: 8.5, color: 'var(--fg-tertiary)', marginTop: 5, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{meta}</div>
    </div>
  );
}

function OPStatusPill({ label, state = 'ok' }) {
  const active = state === 'ok';
  const warn = state === 'warn';
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      height: 22,
      padding: '0 9px',
      borderRadius: 999,
      background: active ? 'var(--accent-soft)' : warn ? 'var(--tone-warning-bg)' : 'var(--surface-2)',
      color: active ? 'var(--accent-primary-press)' : warn ? 'var(--tone-warning)' : 'var(--fg-secondary)',
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      fontWeight: 800,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    }}>
      <Icon name={active ? 'check' : warn ? 'warning' : 'circle'} size={9} />
      {label}
    </span>
  );
}

function opPeer(handle, overrides = {}) {
  const peers = ((window.HF_DATA || {}).peers || []);
  const peer = peers.find(p => p.handle === handle) || peers[0] || {};
  return r4gProfileFromPeer ? r4gProfileFromPeer(peer, overrides) : { handle, ...overrides };
}

function HF_R4B_O01() {
  return (
    <Frame id="O01" name="Platform scan summary" purpose="One read across the platforms worth checking now." target="INTEL" span={6}
      renderLoading={(s) => <O01Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <O01Empty onAsk={() => s('loading')} />} renderError={(s) => <O01Error onRetry={() => s('loading')} />}
      entrance="cascade-down"
    >
      <div className="blk">
        <Eyebrow left="SOCIAL SCAN / LAST 24H" right="PUBLIC ONLY / 1.9K ITEMS" />
        {window.R4GOutcomeRail && <R4GOutcomeRail active="social" compact title="Outside signal joins the package" right="public scope only" />}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {[
            ['YT', 'Long proof', '12 videos', 74],
            ['TT', 'Hook spike', '31 clips', 86],
            ['IG', 'Reel variants', '18 reels', 61],
            ['RD', 'Question surge', '214 replies', 91],
          ].map(([channel, label, meta, score]) => <OPSourceTile key={channel} channel={channel} label={label} meta={meta} score={score} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <R4BSocialProfileCard
            tone="competitor"
            profile={opPeer('@reefdrifter', {
              channels: ['TT', 'IG'],
              latestPost: { title: 'Carry-on rig mistake people keep repeating', meta: '1.2M views / public captions / 18h', state: 'ready' },
              sourceScope: 'source scope: public profile, captions, visible comments',
            })}
            compact
          />
          <R4BSocialProfileCard
            tone="peer"
            profile={opPeer('@marina.k', {
              channels: ['YT', 'IG'],
              latestPost: { title: 'Open on the failure, earn the lesson', meta: '408K followers / 62% overlap', state: 'ready' },
              sourceScope: 'source scope: saved inspiration plus public profile',
            })}
            compact
          />
        </div>
        <div className="serif-it" style={{ fontSize: 14, lineHeight: 1.4, color: 'var(--fg-secondary)' }}>Fastest movement is in public forum questions. Short-form has the hooks; YouTube has the reusable proof shape and source links.</div>
        <div className="mono" style={{ fontSize: 9, color: 'var(--fg-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>EXCLUDES PRIVATE DMS, CLOSED GROUPS, AND NON-CONNECTED ACCOUNTS</div>
        <Footer openIn="Intel" extra={<FooterChip icon="pin" label="Pin scan" accent />} />
      </div>
    </Frame>
  );
}

function HF_R4B_O02() {
  return (
    <Frame id="O02" name="YouTube result set" purpose="YouTube examples ranked by relevance and format." target="INTEL" span={6}
      renderLoading={(s) => <O02Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <O02Empty onAsk={() => s('loading')} />} renderError={(s) => <O02Error onRetry={() => s('loading')} />}
      entrance="cascade-down"
    >
      <div className="blk">
        <Eyebrow left="YOUTUBE RESULTS / 8 VIDEOS" right="TRANSCRIPTS READY / 6" />
        <R4BSocialProfileCard
          tone="peer"
          profile={opPeer('@diveops_lt', {
            channels: ['YT'],
            latestPost: { title: 'Five rules people skip until launch week', meta: '242K views / chapters / transcript ready', state: 'ready' },
            sourceScope: 'source scope: public YouTube profile, visible comments, transcript snippets',
          })}
          compact
        />
        <OPCardRow channel="YT" title="The costly mistake I would not repeat" meta="812K views / 9:42 / 1,208 comments" score={88} />
        <OPCardRow channel="YT" title="Five rules people skip until launch week" meta="242K views / list format / chapters" score={74} />
        <OPCardRow channel="YT" title="Why a simple checklist breaks under pressure" meta="118K views / expert voice / pinned source" score={69} />
        <OPDetailRow label="Source use" value="Save public URL, transcript snippets, and visible comments. Do not copy private channel analytics unless connected." state="ok" />
        <Footer openIn="Intel" extra={<FooterChip icon="plus" label="Save examples" accent />} />
      </div>
    </Frame>
  );
}

function HF_R4B_O03() {
  return (
    <Frame id="O03" name="TikTok trend examples" purpose="Short-form examples with trend fit and hook pattern." target="INTEL" span={6}
      renderLoading={(s) => <O03Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <O03Empty onAsk={() => s('loading')} />} renderError={(s) => <O03Error onRetry={() => s('loading')} />}
      entrance="scan-fill"
    >
      <div className="blk">
        <Eyebrow left="TIKTOK EXAMPLES / SHORT-FORM" right="TREND FIT 81 / PUBLIC" />
        <R4BSocialProfileCard
          tone="competitor"
          profile={opPeer('@reefkid', {
            channels: ['TT'],
            latestPost: { title: 'Mistake first, then one checklist beat', meta: '31 saves / 11 stitches / public trend', state: 'ready' },
            sourceScope: 'source scope: public TikTok profile; saves require auth',
          })}
          compact
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            ['0.7s', 'mistake first', '31 saves', 91],
            ['1.1s', 'setup reveal', '19 remixes', 77],
            ['0.9s', 'myth check', '11 stitches', 72],
          ].map(([time, label, meta, score]) => (
            <div key={label} style={{ padding: 10, background: score > 80 ? 'var(--accent-soft)' : 'var(--surface-2)', borderRadius: 6 }}>
              <ChannelChip channel="TT" />
              <div className="num mono" style={{ marginTop: 8, fontSize: 16, color: 'var(--accent-primary)', fontWeight: 800 }}>{time}</div>
              <div className="serif-it" style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
              <div className="mono" style={{ fontSize: 8.5, color: 'var(--fg-tertiary)', margin: '4px 0 6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{meta}</div>
              <ProgressBar pct={score} accent={score > 80} />
            </div>
          ))}
        </div>
        <OPDetailRow label="Allowed" value="Preview hook timing and public captions. Ask for TikTok auth before using account saves or follower overlap." />
        <Footer openIn="Intel" extra={<FooterChip icon="play" label="Preview hooks" />} />
      </div>
    </Frame>
  );
}

function HF_R4B_O04() {
  return (
    <Frame id="O04" name="Instagram reel cluster" purpose="Group similar Reels by topic and creative move." target="INTEL" span={6}
      renderLoading={(s) => <O04Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <O04Empty onAsk={() => s('loading')} />} renderError={(s) => <O04Error onRetry={() => s('loading')} />}
      entrance="scan-fill"
    >
      <div className="blk">
        <Eyebrow left="IG REEL CLUSTER / 18 REELS" right="3 CREATIVE MOVES" />
        <R4BSocialProfileCard
          tone="peer"
          profile={opPeer('@coralcam', {
            channels: ['IG'],
            latestPost: { title: 'Split-screen comparison sells the thesis in 8s', meta: '198K followers / 2.2% growth', state: 'ready' },
            sourceScope: 'source scope: public Reels and bio terms; account analytics excluded',
          })}
          compact
        />
        <OPMetricRow label="Confession" value="8" pct={82} hot />
        <OPMetricRow label="Checklist" value="6" pct={61} />
        <OPMetricRow label="Before after" value="4" pct={48} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div className="serif-it" style={{ fontSize: 13.5, color: 'var(--fg-secondary)', lineHeight: 1.4 }}>Winning cluster: open with the miss, then show one concrete proof in the first frame.</div>
          <div className="mono" style={{ fontSize: 9.5, color: 'var(--fg-tertiary)', lineHeight: 1.5, letterSpacing: '0.05em' }}>MEDIAN COMMENTS 142 / SAVE RATE 3.8% / NAMES REDACTED</div>
        </div>
        <Footer openIn="Intel" extra={<FooterChip icon="pin" label="Save cluster" />} />
      </div>
    </Frame>
  );
}

function HF_R4B_O05() {
  return (
    <Frame id="O05" name="Forum conversation cluster" purpose="Audience language from public conversations." target="INTEL" span={6}
      renderLoading={(s) => <O05Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <O05Empty onAsk={() => s('loading')} />} renderError={(s) => <O05Error onRetry={() => s('loading')} />}
      entrance="cascade-down"
    >
      <div className="blk">
        <Eyebrow left="FORUM CLUSTER / 214 REPLIES" right="QUESTIONS, NOT HOT TAKES" />
        {[
          ['What should I verify before I trust this?', '64 replies / Reddit', 88],
          ['When does the checklist become performative?', '42 replies / community forum', 76],
          ['Do beginners miss the same first step?', '31 replies / comments', 69],
        ].map(([title, meta, score], i) => (
          <div key={title} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 48px', gap: 10, padding: '8px 0', borderTop: i ? '1px dotted var(--border-subtle)' : 0, alignItems: 'center' }}>
            <AvatarDisc label={String(i + 1)} accent={i === 0} />
            <div><div className="serif-it" style={{ fontSize: 14.5, fontWeight: 600 }}>{title}</div><div className="mono" style={{ fontSize: 9, color: 'var(--fg-tertiary)', marginTop: 3 }}>{meta}</div></div>
            <span className="num mono" style={{ fontWeight: 800, color: score > 80 ? 'var(--accent-primary)' : 'var(--fg-secondary)', textAlign: 'right' }}>{score}</span>
          </div>
        ))}
        <OPDetailRow label="Privacy" value="Only public threads are sampled. Usernames are collapsed into intent groups before drafting." state="ok" />
        <Footer openIn="Intel" extra={<FooterChip icon="plus" label="Turn into FAQ" accent />} />
      </div>
    </Frame>
  );
}

function HF_R4B_O06() {
  return (
    <Frame id="O06" name="Peer lane map" purpose="Position peer creators by format and authority." target="INTEL" span={6}
      renderLoading={(s) => <O06Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <O06Empty onAsk={() => s('loading')} />} renderError={(s) => <O06Error onRetry={() => s('loading')} />}
      animateOnMount entrance="scale-pop"
    >
      <div className="blk">
        <Eyebrow left="PEER LANE MAP / 12 PUBLIC ACCOUNTS" right="OPEN LANE: FIELD NOTE" />
        <div style={{ position: 'relative', height: 160, border: '1px solid var(--border-subtle)', borderRadius: 8, background: 'var(--surface-2)', overflow: 'hidden' }}>
          <div className="mono" style={{ position: 'absolute', top: 8, left: 10, fontSize: 8.5, color: 'var(--fg-tertiary)' }}>EXPERT</div>
          <div className="mono" style={{ position: 'absolute', bottom: 8, left: 10, fontSize: 8.5, color: 'var(--fg-tertiary)' }}>STORY</div>
          <div className="mono" style={{ position: 'absolute', bottom: 8, right: 10, fontSize: 8.5, color: 'var(--fg-tertiary)' }}>PRACTICAL</div>
          {[
            [34, 36, 'A'], [62, 44, 'B'], [52, 76, 'C'], [78, 30, 'D'], [24, 72, 'YOU'],
          ].map(([x, y, label]) => (
            <span key={label} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)', width: label === 'YOU' ? 38 : 24, height: label === 'YOU' ? 24 : 20, borderRadius: 999, background: label === 'YOU' ? 'var(--accent-primary)' : 'var(--surface-1)', color: label === 'YOU' ? 'var(--fg-on-accent)' : 'var(--fg-secondary)', border: label === 'YOU' ? 0 : '1px solid var(--border-default)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 800 }}>{label}</span>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <R4BSocialProfileCard
            tone="peer"
            profile={opPeer('@marina.k', {
              channels: ['YT', 'IG'],
              latestPost: { title: 'Safety storytelling without over-selling', meta: 'closest lane / 62% overlap', state: 'ready' },
              sourceScope: 'source scope: tracked peer lane and public posts',
            })}
            compact
          />
          <R4BSocialProfileCard
            tone="competitor"
            profile={opPeer('@diveops_lt', {
              channels: ['YT'],
              latestPost: { title: 'Checklist redesign in four quick beats', meta: 'authority lane / +6.8% velocity', state: 'ready' },
              sourceScope: 'source scope: competitor watchlist, public only',
            })}
            compact
          />
        </div>
        <div className="mono" style={{ fontSize: 9, color: 'var(--fg-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>BASED ON PUBLIC POST MIX, BIO TERMS, AND FORMAT FREQUENCY. PRIVATE METRICS NOT USED.</div>
        <Footer openIn="Intel" extra={<FooterChip icon="pin" label="Save lane" />} />
      </div>
    </Frame>
  );
}

function HF_R4B_O07() {
  return (
    <Frame id="O07" name="Hashtag and sound trend" purpose="Track trend labels, sounds, or tags by velocity." target="INTEL" span={6}
      renderLoading={(s) => <O07Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <O07Empty onAsk={() => s('loading')} />} renderError={(s) => <O07Error onRetry={() => s('loading')} />}
      animateOnMount entrance="draw-on"
    >
      <div className="blk">
        <Eyebrow left="TREND TERMS / 7D VELOCITY" right="SOCIAL SIGNALS" />
        <OPMetricRow label="#setupfix" value="+38%" pct={82} hot />
        <OPMetricRow label="#lessonlearned" value="+21%" pct={68} />
        <OPMetricRow label="calm demo audio" value="+17%" pct={59} />
        <OPMetricRow label="#processlog" value="-4%" pct={22} />
        <OPDetailRow label="Platform mix" value="TikTok velocity is sampled from public captions and sounds. Instagram term counts require re-auth for account-level saves." state="warn" />
        <Footer openIn="Intel" extra={<FooterChip icon="plus" label="Watch terms" accent />} />
      </div>
    </Frame>
  );
}

function HF_R4B_O08() {
  return (
    <Frame id="O08" name="Comment-field scan" purpose="A fast scan of public comments by intent." target="INBOX" span={6}
      renderLoading={(s) => <O08Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <O08Empty onAsk={() => s('loading')} />} renderError={(s) => <O08Error onRetry={() => s('loading')} />}
      entrance="cascade-down"
    >
      <div className="blk">
        <Eyebrow left="COMMENT FIELD / PUBLIC SCAN" right="812 COMMENTS / 3 PLATFORMS" />
        <div style={{ height: 36, display: 'flex', overflow: 'hidden', borderRadius: 5 }}>
          {[
            ['Questions', 42, 'var(--accent-primary)'],
            ['Praise', 28, 'var(--fg-primary)'],
            ['Gear asks', 18, 'var(--fg-tertiary)'],
            ['Critique', 8, 'var(--tone-warning)'],
            ['Other', 4, 'var(--surface-3)'],
          ].map(([label, pct, color]) => <div key={label} title={label} style={{ width: `${pct}%`, background: color }} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
          {['42% questions', '28% praise', '18% gear', '8% critique', '4% other'].map(text => <span key={text} className="mono" style={{ fontSize: 8.5, color: 'var(--fg-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{text}</span>)}
        </div>
        <OPDetailRow label="Draft guard" value="Replies use intent clusters, not raw usernames. Private DMs stay out unless Inbox access is connected." />
        <Footer openIn="Inbox" extra={<FooterChip icon="pencil" label="Draft replies" accent />} />
      </div>
    </Frame>
  );
}

function HF_R4B_P01() {
  return (
    <Frame id="P01" name="Connect source permission" purpose="Ask for access with scope made clear." target="SETTINGS" span={6}
      renderLoading={(s) => <P01Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <P01Empty onAsk={() => s('loading')} />} renderError={(s) => <P01Error onRetry={() => s('loading')} />}
      entrance="fade-up"
    >
      <div className="blk">
        <Eyebrow left="CONNECT SOURCE / YOUTUBE" right="PERMISSION REQUEST" />
        <div className="serif-it" style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.2 }}>Connect YouTube Studio so Coopr can read performance, public comments, transcripts, and thumbnails.</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <OPStatusPill label="Read only" />
          <OPStatusPill label="No publishing" />
          <OPStatusPill label="Comments optional" state="idle" />
          <OPStatusPill label="Expires in 90d" state="warn" />
        </div>
        <OPDetailRow label="Scope" value="Posts, analytics, comments, captions, thumbnails. No upload, delete, DM, or monetization permissions requested." state="ok" />
        <Footer openIn="Settings" extra={<FooterChip icon="plus" label="Connect source" accent />} />
      </div>
    </Frame>
  );
}

function HF_R4B_P02() {
  return (
    <Frame id="P02" name="Account sync status" purpose="Show what connected accounts have indexed." target="SETTINGS" span={6}
      renderLoading={(s) => <P02Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <P02Empty onAsk={() => s('loading')} />} renderError={(s) => <P02Error onRetry={() => s('loading')} />}
      entrance="cascade-down"
    >
      <div className="blk">
        <Eyebrow left="ACCOUNT SYNC / CONNECTED SOURCES" right="LAST RUN 09:41" />
        {[
          ['YouTube', '404 posts / current', 100, 'ok'],
          ['Instagram', '188 reels / comments lag', 74, 'ok'],
          ['TikTok', '92 clips / saves blocked', 41, 'warn'],
          ['Drive folder', 'not connected', 0, 'idle'],
        ].map(([label, meta, pct, state]) => (
          <div key={label} style={{ display: 'grid', gridTemplateColumns: '96px 1fr 132px', gap: 10, alignItems: 'center' }}>
            <span className="mono" style={{ fontSize: 10, fontWeight: 800, color: 'var(--fg-secondary)' }}>{label}</span>
            <ProgressBar pct={pct} accent={state === 'ok'} />
            <span className="mono" style={{ fontSize: 9, color: state === 'warn' ? 'var(--tone-warning)' : 'var(--fg-tertiary)', textAlign: 'right' }}>{meta}</span>
          </div>
        ))}
        <OPDetailRow label="Retry queue" value="4 TikTok metrics and 2 Instagram comment batches are waiting for permission refresh." state="warn" />
        <Footer openIn="Settings" extra={<FooterChip icon="retry" label="Sync now" />} />
      </div>
    </Frame>
  );
}

function HF_R4B_P03() {
  return (
    <Frame id="P03" name="Upload parse card" purpose="A file upload moving through extraction." target="WORKSPACE" span={6}
      renderLoading={(s) => <P03Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <P03Empty onAsk={() => s('loading')} />} renderError={(s) => <P03Error onRetry={() => s('loading')} />}
      animateOnMount entrance="count-up-mount"
    >
      <div className="blk">
        <Eyebrow left="UPLOAD PARSE / 3 FILES" right="READY IN 0:42" />
        {window.R4GOutcomeRail && <R4GOutcomeRail active="preview" compact title="Import can enter with caveats" right="partial usable" />}
        <R4BStateStrip
          title="Media transfer states"
          right="before / during / after / recovery"
          items={[
            { label: 'Drop', meta: 'entry empty', state: 'entry' },
            { label: 'Upload', meta: '64% copied', state: 'uploading' },
            { label: 'Parse', meta: 'frames queued', state: 'processing' },
            { label: 'Ready', meta: 'brief usable', state: 'ready' },
            { label: 'Partial', meta: 'OCR masked', state: 'partial' },
            { label: 'Retry', meta: 'auth failed', state: 'auth' },
          ]}
        />
        <R4BMediaTransferCard
          title="Drop, upload, parse"
          subtitle="brief.pdf / source-clip.mp4 / screenshot.png"
          state="uploading"
          pct={64}
          files={[
            { name: 'brief.pdf', meta: 'outline and claims', pct: 100, state: 'done' },
            { name: 'source-clip.mp4', meta: 'audio, frames, timestamps', pct: 64, state: 'active' },
            { name: 'screenshot.png', meta: 'OCR, objects, hidden fields', pct: 38, state: 'partial' },
          ]}
          stages={[
            { label: 'Before', meta: 'drop zone accepted', state: 'done' },
            { label: 'Upload', meta: '240 MB copied', state: 'active' },
            { label: 'Parse', meta: 'frames queued', state: 'pending' },
            { label: 'Ready', meta: 'not yet usable', state: 'pending' },
          ]}
          note="This is the during state: files have names, progress, and extraction intent before they become chat context."
        />
        {window.R4GOutcomeMediaStack && <R4GOutcomeMediaStack />}
        <OPDetailRow label="Privacy" value="Files stay in this workspace. Coopr extracts text and frames, then marks private fields before using them in chat." state="ok" />
        <Footer openIn="Workspace" extra={<FooterChip icon="plus" label="Add files" />} />
      </div>
    </Frame>
  );
}

function HF_R4B_P04() {
  return (
    <Frame id="P04" name="Video transcript extraction" purpose="Extract timestamps, claims, and quotes from video." target="WORKSPACE" span={6}
      renderLoading={(s) => <P04Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <P04Empty onAsk={() => s('loading')} />} renderError={(s) => <P04Error onRetry={() => s('loading')} />}
      entrance="type-in"
    >
      <div className="blk">
        <Eyebrow left="VIDEO TRANSCRIPT / SOURCE CLIP" right="18:42 / 96% CONF" />
        {window.R4GOutcomePackage && <R4GOutcomePackage active="package" compact />}
        <R4BStateStrip
          title="Transcript extraction states"
          right="speech / moments / review"
          items={[
            { label: 'Audio', meta: 'cleaned', state: 'done' },
            { label: 'Words', meta: '96% aligned', state: 'processing' },
            { label: 'Moments', meta: 'claims found', state: 'active' },
            { label: 'Review', meta: 'ready next', state: 'approval' },
          ]}
        />
        <R4BMediaTransferCard
          title="Transcribing source video"
          subtitle="speech to timestamps / claims / reusable quotes"
          state="processing"
          pct={96}
          files={[
            { name: 'source-clip.mp4', meta: '18:42 / speech detected', pct: 100, state: 'done' },
            { name: 'transcript.vtt', meta: 'timestamp alignment', pct: 96, state: 'active' },
          ]}
          stages={[
            { label: 'Audio', meta: 'cleaned', state: 'done' },
            { label: 'Words', meta: 'transcribed', state: 'done' },
            { label: 'Moments', meta: 'claim extraction', state: 'active' },
            { label: 'Use', meta: 'ready after review', state: 'pending' },
          ]}
          note="Transcript extraction shows the processing state before the final moments become selectable."
        />
        <div style={{ display: 'grid', gridTemplateColumns: '62px 1fr', gap: 10 }}>
          {[
            ['00:08', 'I thought the checklist was the safety layer. It was not.'],
            ['01:14', 'The real issue was that nobody verified the source step.'],
            ['03:31', 'This is the caveat I would put before the recipe.'],
          ].map(([time, quote]) => (
            <React.Fragment key={time}>
              <span className="num mono" style={{ fontSize: 10, color: 'var(--accent-primary)', fontWeight: 800 }}>{time}</span>
              <span className="serif-it" style={{ fontSize: 13.5, color: 'var(--fg-secondary)', lineHeight: 1.35 }}>"{quote}"</span>
            </React.Fragment>
          ))}
        </div>
        <OPDetailRow label="Parsed" value="3 claims, 2 caveats, 5 reusable quotes, and a silence gap at 12:18 flagged for review." state="ok" />
        <Footer openIn="Workspace" extra={<FooterChip icon="plus" label="Use moments" accent />} />
      </div>
    </Frame>
  );
}

function HF_R4B_P05() {
  const extracted = [
    { label: 'Title', text: 'Launch notes', confidence: 98, state: 'ok' },
    { label: 'Metric', text: 'Watch time chart', confidence: 94, state: 'ok' },
    { label: 'Audience', text: 'Audience asked for timeline', confidence: 91, state: 'ok' },
    { label: 'Masked', text: 'Price and email held for review', confidence: 100, state: 'warn' },
  ];
  const facts = [
    ['Text', '14 items'],
    ['Objects', '5 facts'],
    ['Privacy', '2 masked'],
  ];
  return (
    <Frame id="P05" name="OCR and screenshot extraction" purpose="Turn images into usable text and visual facts." target="WORKSPACE" span={6}
      renderLoading={(s) => <P05Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <P05Empty onAsk={() => s('loading')} />} renderError={(s) => <P05Error onRetry={() => s('loading')} />}
      entrance="scan-fill"
    >
      <div className="blk">
        <Eyebrow left="OCR / SCREENSHOT / SCREENSHOT.PNG" right="14 TEXT ITEMS / 5 FACTS" />
        <R4BMediaTransferCard
          title="Screenshot OCR pipeline"
          subtitle="image text / visual facts / private field mask"
          state="partial"
          pct={94}
          files={[
            { name: 'screenshot.png', meta: 'screen text extracted', pct: 94, state: 'partial' },
            { name: 'masked-fields', meta: 'price and email held for review', pct: 100, state: 'partial' },
          ]}
          stages={[
            { label: 'OCR', meta: '14 text items', state: 'done' },
            { label: 'Objects', meta: '5 visual facts', state: 'done' },
            { label: 'Mask', meta: '2 private fields', state: 'partial' },
            { label: 'Ready', meta: 'needs approval', state: 'pending' },
          ]}
          note="Partial means usable notes are available, but masked fields remain out of chat until approved."
          actionLabel="Review masks"
        />
        <div style={{ display: 'grid', gridTemplateColumns: '34px minmax(0, 1fr)', gap: 10, alignItems: 'start', padding: 10, borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border-subtle)', minWidth: 0 }}>
          <span style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--accent-soft)', color: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="check" size={14} /></span>
          <div style={{ minWidth: 0 }}>
            <div className="serif-it" style={{ fontSize: 15.2, fontWeight: 600, color: 'var(--fg-primary)', lineHeight: 1.25, overflowWrap: 'anywhere' }}>Usable notes are extracted; private pricing and contact fields stay masked until approved.</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
              <OPStatusPill label="Read only" />
              <OPStatusPill label="94% avg" />
              <OPStatusPill label="2 masked" state="warn" />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {extracted.map((item) => {
            const warn = item.state === 'warn';
            return (
              <div key={item.label} style={{ display: 'grid', gridTemplateColumns: '64px minmax(0, 1fr) 42px', gap: 8, alignItems: 'baseline', padding: '7px 0', borderTop: '1px dotted var(--border-subtle)', minWidth: 0 }}>
                <span className="mono" style={{ minWidth: 0, fontSize: 8.7, color: warn ? 'var(--tone-warning)' : 'var(--accent-primary)', fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{item.label}</span>
                <span className="serif-it" style={{ minWidth: 0, fontSize: 13.2, color: warn ? 'var(--tone-warning)' : 'var(--fg-secondary)', lineHeight: 1.24, overflowWrap: 'anywhere' }}>{item.text}</span>
                <span className="num mono" style={{ fontSize: 9.5, color: warn ? 'var(--tone-warning)' : 'var(--fg-tertiary)', fontWeight: 800, textAlign: 'right' }}>{item.confidence}%</span>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 7, minWidth: 0 }}>
          {facts.map(([label, value]) => (
            <div key={label} style={{ padding: '8px 9px', borderRadius: 6, background: label === 'Privacy' ? 'var(--tone-warning-bg)' : 'var(--surface-2)', border: '1px solid var(--border-subtle)', minWidth: 0 }}>
              <div className="mono" style={{ fontSize: 8.2, color: label === 'Privacy' ? 'var(--tone-warning)' : 'var(--fg-tertiary)', fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
              <div className="serif-it" style={{ marginTop: 3, fontSize: 13.3, color: 'var(--fg-primary)', fontWeight: 600, lineHeight: 1.15, overflowWrap: 'anywhere' }}>{value}</div>
            </div>
          ))}
        </div>
        <OPDetailRow label="Review" value="Masked fields can be inserted into the workspace only after approval." state="warn" />
        <Footer openIn="Workspace" extra={<FooterChip icon="pencil" label="Extract notes" accent />} />
      </div>
    </Frame>
  );
}

function HF_R4B_P06() {
  return (
    <Frame id="P06" name="Data coverage gap" purpose="Explain what data is missing before answer quality suffers." target="SETTINGS" span={6}
      renderLoading={(s) => <P06Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <P06Empty onAsk={() => s('loading')} />} renderError={(s) => <P06Error onRetry={() => s('loading')} />}
      entrance="cascade-down"
    >
      <div className="blk">
        <Eyebrow left="DATA COVERAGE / THIS ANSWER" right="78% COVERED" />
        <R4BDataEntryState
          title="Answer data readiness"
          source="connected accounts and imports"
          state="partial"
          detail="The answer can proceed for direction, but platform ranking stays caveated until missing sources finish."
          items={[
            { label: 'Library and YouTube', meta: 'ready for analysis', state: 'ready', pct: 94 },
            { label: 'Instagram comments', meta: 'sync lag visible', state: 'partial', pct: 54 },
            { label: 'TikTok saves', meta: 'blocked by permission', state: 'auth', pct: 12 },
          ]}
          compact
        />
        <OPMetricRow label="Library" value="ready" pct={96} hot />
        <OPMetricRow label="YT metrics" value="ready" pct={88} hot />
        <OPMetricRow label="IG comments" value="partial" pct={54} />
        <OPMetricRow label="TikTok saves" value="missing" pct={12} />
        <div className="serif-it" style={{ fontSize: 13.5, color: 'var(--fg-secondary)', lineHeight: 1.4 }}>Answer is safe for direction, but not for cross-platform ranking until TikTok saves and Instagram comment batches finish.</div>
        <Footer openIn="Settings" extra={<FooterChip icon="warning" label="Show impact" muted />} />
      </div>
    </Frame>
  );
}

function HF_R4B_P07() {
  return (
    <Frame id="P07" name="Privacy and scope disclosure" purpose="Show exactly what was read and what was not." target="ANYWHERE" span={6}
      renderLoading={(s) => <P07Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <P07Empty onAsk={() => s('loading')} />} renderError={(s) => <P07Error onRetry={() => s('loading')} />}
      entrance="cascade-down"
    >
      <div className="blk">
        <Eyebrow left="SCOPE DISCLOSURE / THREAD T-42" right="READ ONLY" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: '1px solid var(--border-subtle)', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: 12, background: 'var(--accent-soft)' }}>
            <div className="mono" style={{ fontSize: 9, color: 'var(--accent-primary)', fontWeight: 800, marginBottom: 7 }}>READ</div>
            {['Library posts', 'YouTube analytics', 'Public comments'].map(x => <div key={x} className="serif-it" style={{ fontSize: 13.5, marginTop: 4 }}>{x}</div>)}
          </div>
          <div style={{ padding: 12, background: 'var(--surface-2)' }}>
            <div className="mono" style={{ fontSize: 9, color: 'var(--fg-tertiary)', fontWeight: 800, marginBottom: 7 }}>NOT READ</div>
            {['Private DMs', 'Draft folders', 'Payment data'].map(x => <div key={x} className="serif-it" style={{ fontSize: 13.5, marginTop: 4, color: 'var(--fg-secondary)' }}>{x}</div>)}
          </div>
        </div>
        <OPDetailRow label="Retention" value="This thread keeps citations and derived notes. Source files can be removed without deleting the answer." state="ok" />
        <Footer openIn="Anywhere" extra={<FooterChip icon="check" label="Looks right" />} />
      </div>
    </Frame>
  );
}

function HF_R4B_P08() {
  return (
    <Frame id="P08" name="Re-auth and retry" purpose="Recover from an expired or failed connection." target="SETTINGS" span={6}
      renderLoading={(s) => <P08Loading onCancel={() => s('idle')} />} renderEmpty={(s) => <P08Empty onAsk={() => s('loading')} />} renderError={(s) => <P08Error onRetry={() => s('loading')} />}
      entrance="fade-up"
    >
      <div className="blk" style={{ borderColor: 'var(--tone-warning)', background: 'var(--tone-warning-bg)' }}>
        <Eyebrow left="AUTH NEEDED / TIKTOK" right="LAST GOOD 3D AGO" />
        <R4BDataEntryState
          title="Failed auth after import"
          source="TikTok saves and overlap"
          state="auth"
          detail="Public metrics remain usable, but private save and overlap batches are withheld until re-auth succeeds."
          items={[
            { label: 'Public metrics', meta: 'views and comments available', state: 'ready', pct: 100 },
            { label: 'Save batches', meta: '4 queued after re-auth', state: 'auth', pct: 0 },
            { label: 'Creator overlap', meta: '2 scans paused', state: 'retry', pct: 0 },
          ]}
          actionLabel="Restart auth"
          compact
        />
        <div style={{ display: 'grid', gridTemplateColumns: '42px 1fr', gap: 12, alignItems: 'start' }}>
          <Icon name="warning" size={28} />
          <div>
            <div className="serif-it" style={{ fontSize: 18, fontWeight: 600, color: 'var(--fg-primary)', lineHeight: 1.2 }}>TikTok access expired before saves could sync.</div>
            <p className="serif" style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--fg-secondary)', lineHeight: 1.45 }}>Coopr can still use public metrics, but trend ranking is lower confidence until re-auth completes.</p>
          </div>
        </div>
        <OPDetailRow label="Queued retry" value="Resume 4 save batches, 2 creator overlap scans, and the last trend ranking after permission refresh." state="warn" />
        <Footer openIn="Settings" extra={<FooterChip icon="retry" label="Re-auth" accent />} />
      </div>
    </Frame>
  );
}

const FAMILY_O_META = [
  { id: 'O01', name: 'Platform scan summary', purpose: 'One read across the platforms worth checking now.', target: 'INTEL', span: 6, family: 'O', familyTitle: 'Social Intel', component: HF_R4B_O01 },
  { id: 'O02', name: 'YouTube result set', purpose: 'YouTube examples ranked by relevance and format.', target: 'INTEL', span: 6, family: 'O', familyTitle: 'Social Intel', component: HF_R4B_O02 },
  { id: 'O03', name: 'TikTok trend examples', purpose: 'Short-form examples with trend fit and hook pattern.', target: 'INTEL', span: 6, family: 'O', familyTitle: 'Social Intel', component: HF_R4B_O03 },
  { id: 'O04', name: 'Instagram reel cluster', purpose: 'Group similar Reels by topic and creative move.', target: 'INTEL', span: 6, family: 'O', familyTitle: 'Social Intel', component: HF_R4B_O04 },
  { id: 'O05', name: 'Forum conversation cluster', purpose: 'Audience language from public conversations.', target: 'INTEL', span: 6, family: 'O', familyTitle: 'Social Intel', component: HF_R4B_O05 },
  { id: 'O06', name: 'Peer lane map', purpose: 'Position peer creators by format and authority.', target: 'INTEL', span: 6, family: 'O', familyTitle: 'Social Intel', component: HF_R4B_O06 },
  { id: 'O07', name: 'Hashtag and sound trend', purpose: 'Track trend labels, sounds, or tags by velocity.', target: 'INTEL', span: 6, family: 'O', familyTitle: 'Social Intel', component: HF_R4B_O07 },
  { id: 'O08', name: 'Comment-field scan', purpose: 'A fast scan of public comments by intent.', target: 'INBOX', span: 6, family: 'O', familyTitle: 'Social Intel', component: HF_R4B_O08 },
];

const FAMILY_P_META = [
  { id: 'P01', name: 'Connect source permission', purpose: 'Ask for access with scope made clear.', target: 'SETTINGS', span: 6, family: 'P', familyTitle: 'Imports', component: HF_R4B_P01 },
  { id: 'P02', name: 'Account sync status', purpose: 'Show what connected accounts have indexed.', target: 'SETTINGS', span: 6, family: 'P', familyTitle: 'Imports', component: HF_R4B_P02 },
  { id: 'P03', name: 'Upload parse card', purpose: 'A file upload moving through extraction.', target: 'WORKSPACE', span: 6, family: 'P', familyTitle: 'Imports', component: HF_R4B_P03 },
  { id: 'P04', name: 'Video transcript extraction', purpose: 'Extract timestamps, claims, and quotes from video.', target: 'WORKSPACE', span: 6, family: 'P', familyTitle: 'Imports', component: HF_R4B_P04 },
  { id: 'P05', name: 'OCR and screenshot extraction', purpose: 'Turn images into usable text and visual facts.', target: 'WORKSPACE', span: 6, family: 'P', familyTitle: 'Imports', component: HF_R4B_P05 },
  { id: 'P06', name: 'Data coverage gap', purpose: 'Explain what data is missing before answer quality suffers.', target: 'SETTINGS', span: 6, family: 'P', familyTitle: 'Imports', component: HF_R4B_P06 },
  { id: 'P07', name: 'Privacy and scope disclosure', purpose: 'Show exactly what was read and what was not.', target: 'ANYWHERE', span: 6, family: 'P', familyTitle: 'Imports', component: HF_R4B_P07 },
  { id: 'P08', name: 'Re-auth and retry', purpose: 'Recover from an expired or failed connection.', target: 'SETTINGS', span: 6, family: 'P', familyTitle: 'Imports', component: HF_R4B_P08 },
];

registerBlock('O01', FAMILY_O_META[0]);
registerBlock('O02', FAMILY_O_META[1]);
registerBlock('O03', FAMILY_O_META[2]);
registerBlock('O04', FAMILY_O_META[3]);
registerBlock('O05', FAMILY_O_META[4]);
registerBlock('O06', FAMILY_O_META[5]);
registerBlock('O07', FAMILY_O_META[6]);
registerBlock('O08', FAMILY_O_META[7]);
registerBlock('P01', FAMILY_P_META[0]);
registerBlock('P02', FAMILY_P_META[1]);
registerBlock('P03', FAMILY_P_META[2]);
registerBlock('P04', FAMILY_P_META[3]);
registerBlock('P05', FAMILY_P_META[4]);
registerBlock('P06', FAMILY_P_META[5]);
registerBlock('P07', FAMILY_P_META[6]);
registerBlock('P08', FAMILY_P_META[7]);

Object.assign(window, {
  HF_R4B_O01,
  HF_R4B_O02,
  HF_R4B_O03,
  HF_R4B_O04,
  HF_R4B_O05,
  HF_R4B_O06,
  HF_R4B_O07,
  HF_R4B_O08,
  HF_R4B_P01,
  HF_R4B_P02,
  HF_R4B_P03,
  HF_R4B_P04,
  HF_R4B_P05,
  HF_R4B_P06,
  HF_R4B_P07,
  HF_R4B_P08,
  FAMILY_O: { O01: HF_R4B_O01, O02: HF_R4B_O02, O03: HF_R4B_O03, O04: HF_R4B_O04, O05: HF_R4B_O05, O06: HF_R4B_O06, O07: HF_R4B_O07, O08: HF_R4B_O08 },
  FAMILY_P: { P01: HF_R4B_P01, P02: HF_R4B_P02, P03: HF_R4B_P03, P04: HF_R4B_P04, P05: HF_R4B_P05, P06: HF_R4B_P06, P07: HF_R4B_P07, P08: HF_R4B_P08 },
});
