/* global React, window, R4CatalogChrome */
/* hifi-r4-lib-catalog-grid.jsx — Library round 4 · Catalog · GRID variant (default).

   E1-finish update: the catalog now mixes the FIVE platform-faithful
   thumbnail shapes on one page — Reel (9:16), Carousel (1:1), Feed (4:5),
   Thread (text card, variable height), YouTube (16:9). Each post is
   dispatched to the matching `R4Thumb_*` component from
   `hifi-r4-lib-visuals.jsx` so a creator can read the platform of any
   piece of content at a glance, without a label.

   Layout: CSS column-count masonry. Five tracks at 1440 viewport, 12px
   gutter. Each card claims its own natural aspect-ratio inside the column;
   `breakInside: avoid` keeps a single card on a single column. This avoids
   `grid-auto-rows: masonry` (still unsupported in stable browsers).

   PRESERVED CHROME (wraps every variant):
     · score badge (top-left)
     · format pill (top-right)
     · B1 drag handle + lifted-state ghost
     · B3 kebab handle + frozen-open context menu
     · TRIAL flag (when applicable)
     · caption row (date · views)
*/

const R4G_DATA = window.HF_DATA;

const R4G_FORMAT_LABEL = {
  'long-yt':     'VIDEO',
  'reel-ig':     'REEL',
  'short-tt':    'SHORT',
  'carousel-ig': 'CAROUSEL',
  'feed-ig':     'POST',
  'thread':      'THREAD',
};

// ─── Platform mapping ────────────────────────────────────
// Maps each post (by id + index) to one of the 5 R4Thumb_* shapes.
// Strategy:
//   1) `post.platform` wins (future-proof for when fixtures get the field).
//   2) Else infer from R4_LIB_VISUALS[post.id].display + post.format.
//   3) For any post that lands on long-form-yt (`long-yt`), use YouTube.
//      Carousel-ig → carousel. The 4:5 Feed and Threads cards have no
//      direct fixture display value, so we sprinkle them by index so the
//      first ~15 cards include ≥2 of each variant.
//
// Index slots used to inject Feed + Thread. The fixture only carries four
// `display` values (reel-ig, short-tt, long-yt, carousel-ig) so Feed (4:5
// IG post) and Thread (text card) need to be sprinkled by slot. Slots
// chosen to:
//   1) preserve carousel-ig (post idx 9) — the ONLY carousel in the
//      fixture — so we don't drop carousel from the page;
//   2) interleave variants so the page reads as a mixed catalog rather
//      than five rows of the same shape.
// Distribution at default (16-card) sequence:
//   reel-ig:5 · reel-tt:1 · youtube:4 · carousel:2 · feed:2 · thread:2
const R4G_FEED_SLOTS   = new Set([1, 8]);
const R4G_THREAD_SLOTS = new Set([4, 10]);

function r4PlatformOf(post, index) {
  if (post && post.platform) return post.platform;
  if (R4G_FEED_SLOTS.has(index))   return 'feed';
  if (R4G_THREAD_SLOTS.has(index)) return 'thread';
  const v = window.R4_LIB_VISUALS[post.id];
  const d = v && v.display;
  if (d === 'long-yt')     return 'youtube';
  if (d === 'carousel-ig') return 'carousel';
  if (d === 'short-tt')    return 'reel';   // TikTok short → Reel component, platform=tt
  return 'reel';                            // reel-ig and any unknown → Reel, platform=ig
}

function r4ReelPlatformOf(post) {
  // The Reel component supports both ig and tt looks; pick from channel.
  if (post && post.channel === 'tt') return 'tt';
  return 'ig';
}

function r4FormatLabelFor(platform, post) {
  if (platform === 'reel') {
    return r4ReelPlatformOf(post) === 'tt' ? 'TIKTOK' : 'REEL';
  }
  if (platform === 'carousel') return 'CAROUSEL';
  if (platform === 'feed')     return 'POST';
  if (platform === 'thread')   return 'THREAD';
  if (platform === 'youtube')  return 'VIDEO';
  const v = window.R4_LIB_VISUALS[post.id];
  return R4G_FORMAT_LABEL[v && v.display] || 'POST';
}

// Build the card sequence. We have 12 base posts; we ship 16 cards by
// re-using four post ids (no `id` collision because React keys append the
// slot index). The added slots are positioned so that, combined with the
// FEED_SLOTS / THREAD_SLOTS sprinkling above, the first 15 cards contain
// ≥2 of each platform variant.
function r4BuildCardSequence(posts) {
  // Base 12, then 4 alt-renders of select posts to top up to 16.
  // Indices we reuse (chosen to land on platform slots that are still light
  // after the sprinkle): 0 (reel-ig), 6 (long-yt → youtube), 9 (carousel-ig),
  // 11 (reel-ig).
  const repeats = [0, 6, 9, 11];
  const out = posts.map((p, i) => ({ post: p, slot: i }));
  for (const r of repeats) {
    if (posts[r]) out.push({ post: posts[r], slot: out.length });
  }
  return out;
}

function HF_R4_LibraryCatalogGrid({ state = 'happy', detail = null }) {
  const posts = R4G_DATA.posts;
  const Chrome = window.R4CatalogChrome;
  // R10 · state variants — read tweaks override, fall back to prop.
  const ovr = window.useSurfaceState && window.useSurfaceState('library', 'Catalog');
  const s = (ovr && ovr !== 'happy') ? ovr : state;
  if (s === 'loading') {
    return <Chrome view="grid"><window.HF_SkeletonHero shape="grid" /></Chrome>;
  }
  if (s === 'empty') {
    return <Chrome view="grid"><window.HF_EmptyHero
      eyebrow="Library · 0 posts"
      title="Your first post will land here."
      caption="Connect a channel and Coopr starts indexing what you ship."
      ctaLabel="Connect a channel"
    /></Chrome>;
  }
  if (s === 'error') {
    return <Chrome view="grid"><window.HF_ErrorHero
      title="Couldn't load the catalog."
      body="The post index didn't respond in time. Try again, or check the platform connections."
    /></Chrome>;
  }
  const showAffordanceDemo = detail && detail.kind === 'demo' && detail.id === 'affordances';
  // Card sequence — 16 cards built from the 12-post fixture (see r4BuildCardSequence).
  const cards = r4BuildCardSequence(posts);
  // B1 · pin the lifted-drag demo to slot 2 (a Reel post · top of the
  // first column on the masonry layout).
  const liftedSlot = Math.min(2, cards.length - 1);
  // B3 · pin the frozen-open context menu to slot 4 so it doesn't collide
  // with the lifted-drag demo at slot 2.
  const frozenMenuSlot = Math.min(4, cards.length - 1);
  return (
    <Chrome view="grid" showSortDemo={showAffordanceDemo}>
      <div style={{
        position: 'relative',
        padding: '24px 32px 60px',
      }}>
        {/* Column-based masonry. Five tracks at 1440 viewport. Cards keep
            their natural aspect ratio (9:16, 1:1, 4:5, 16:9, or text-card
            variable) and `breakInside: avoid` keeps each card on one
            column — no rows of forced uniform height. */}
        <div style={{
          columnCount: 5,
          columnGap: 12,
        }}>
          {cards.map(({ post, slot }) => {
            const platform = r4PlatformOf(post, slot);
            return (
              <div key={`${post.id}-${slot}`} style={{
                breakInside: 'avoid',
                WebkitColumnBreakInside: 'avoid',
                pageBreakInside: 'avoid',
                marginBottom: 24,
                display: 'block',
              }}>
                <R4GridCard
                  post={post}
                  platform={platform}
                  dragState={showAffordanceDemo && slot === liftedSlot ? 'lifted' : 'idle'}
                  frozenMenuOpen={showAffordanceDemo && slot === frozenMenuSlot}
                />
              </div>
            );
          })}
        </div>
        {/* B1 · drag status pill — fixed to the grid container, anchored bottom-right */}
        {showAffordanceDemo && (
          <window.DragStatusPill bottom={20} right={32}>
            Reorder mode · drop to commit
          </window.DragStatusPill>
        )}
      </div>
    </Chrome>
  );
}

// ─── Grid card · platform dispatcher ─────────────────────
// Renders the right R4Thumb_* component for the post's platform, then
// overlays the catalog chrome (score, format pill, drag handle, kebab,
// trial flag, caption row).
function R4GridCard({ post, platform = 'reel', dragState = 'idle', frozenMenuOpen = false }) {
  const v = window.R4_LIB_VISUALS[post.id];
  if (!v) return null;
  const formatLabel = r4FormatLabelFor(platform, post);
  const [hover, setHover] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [menuPos, setMenuPos] = React.useState({ x: 0, y: 0 });
  const isLifted = dragState === 'lifted';
  const showMenu = menuOpen || frozenMenuOpen;
  const masterCtx = window.useMasterState && window.useMasterState();
  const pushToast = masterCtx && masterCtx.pushToast ? masterCtx.pushToast : (() => {});

  function openMenuAt(e) {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const parent = e.currentTarget.closest('article').getBoundingClientRect();
    setMenuPos({ x: rect.right - parent.left - 200, y: rect.bottom - parent.top + 4 });
    setMenuOpen(true);
  }

  const menuItems = [
    { kicker: 'OPN', label: 'Open',      onClick: () => pushToast('Catalog · Open · ' + post.id) },
    { kicker: 'EDT', label: 'Edit',      onClick: () => pushToast('Catalog · Edit · ' + post.id) },
    { kicker: 'DUP', label: 'Duplicate', onClick: () => pushToast('Catalog · Duplicate · ' + post.id) },
    { kicker: 'ARC', label: 'Archive',   onClick: () => pushToast('Catalog · Archive · ' + post.id) },
    { kicker: 'DEL', label: 'Delete',    onClick: () => pushToast('Catalog · Delete · ' + post.id), danger: true, divider: true },
  ];

  // Cards drill into HF_R4_LibraryDetail via the master state's setDetail.
  const { setDetail } = window.useMasterState();
  function onActivate() {
    setDetail('post', post.id);
  }

  // B1 · lifted transform + shadow tuned to read "this card has been picked up."
  const liftedTransform = 'translate(6px, -8px) rotate(-1.5deg) scale(1.02)';
  const liftedShadow = '0 18px 36px rgba(15,14,12,0.26), 0 4px 10px rgba(15,14,12,0.14)';

  // The actual platform-faithful thumbnail. Each variant brings its own
  // aspect ratio and chrome (avatar, page dots, watch glyph, etc.) — we
  // wrap whatever it returns and overlay the catalog chrome on top.
  let thumbNode = null;
  if (platform === 'reel') {
    thumbNode = <window.R4Thumb_Reel post={post} platform={r4ReelPlatformOf(post)} />;
  } else if (platform === 'carousel') {
    thumbNode = <window.R4Thumb_Carousel post={post} pages={5} />;
  } else if (platform === 'feed') {
    thumbNode = <window.R4Thumb_Feed post={post} />;
  } else if (platform === 'thread') {
    thumbNode = <window.R4Thumb_Thread post={post} withImage={false} />;
  } else if (platform === 'youtube') {
    thumbNode = <window.R4Thumb_YouTube post={post} />;
  } else {
    thumbNode = <window.R4Thumb_Reel post={post} platform="ig" />;
  }

  // The Reel + Carousel + YouTube variants own their own rounded-corner
  // wrapper. Feed and Thread do NOT — the Feed renders profile bar +
  // image + footer as a stack; Thread renders a card with its own
  // border + radius. We need a relative-positioned outer wrapper for
  // the catalog overlays (score / format pill / drag handle / kebab),
  // and we want those overlays anchored to the visual content area
  // (the image block in Feed, the YouTube 16:9 block, etc.) rather
  // than to the post handle / footer.
  //
  // Anchoring approach: overlays are absolute-positioned relative to the
  // outer <article>, fixed at top:6 / right:6 / left:6. For Reel /
  // Carousel / YouTube the visible image starts at the top of the
  // article so the overlays land on top of the image. For Feed the
  // profile bar takes ~26px above the image — overlays therefore live
  // ABOVE that bar (still readable; profile bar is light text on
  // light surface, overlays are glass-on-light or accent-on-white so
  // contrast is fine). For Thread the overlays land on top of the
  // card surface, also fine.
  const isCardSurface = platform === 'thread' || platform === 'feed';

  return (
    <article
      onClick={onActivate}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0,
        cursor: 'pointer',
        position: 'relative',
        transform: isLifted ? liftedTransform : (hover ? 'translateY(-2px)' : 'translateY(0)'),
        opacity: 1,
        transition: isLifted
          ? 'none'
          : 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: isLifted ? 5 : 'auto',
        // Lifted shadow on card-surface variants needs to sit on the
        // outer <article>; image-led variants own their own image
        // block which carries the shadow itself.
        boxShadow: isCardSurface
          ? (isLifted ? liftedShadow : (hover ? '0 8px 22px rgba(15,14,12,0.14)' : 'none'))
          : 'none',
        borderRadius: isCardSurface ? 6 : 0,
        transition: isLifted ? 'none' : 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 200ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
      {/* B1 · faded placeholder · only rendered when this card is lifted.
          Sits behind the floating thumbnail at 0.55 opacity so the user
          reads "this is where the card came from." We size it to the
          first child's bounding box (top:0, left:0, right:0, bottom:0
          inside the article) so it works for any aspect ratio. */}
      {isLifted && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          borderRadius: 6,
          border: '1.5px dashed var(--accent-primary)',
          background: 'rgba(154, 56, 56, 0.06)',
          opacity: 0.55,
          transform: 'translate(-6px, 8px) rotate(0deg) scale(1)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />
      )}

      {/* The platform-faithful thumbnail. Wrapped so the catalog
          chrome can sit on top with absolute positioning. */}
      <div style={{
        position: 'relative',
        width: '100%',
        boxShadow: !isCardSurface
          ? (isLifted ? liftedShadow : (hover ? '0 8px 22px rgba(15,14,12,0.18), 0 1px 3px rgba(15,14,12,0.10)' : '0 1px 3px rgba(15,14,12,0.10)'))
          : 'none',
        borderRadius: !isCardSurface ? 6 : 0,
        // For image-led platforms the inner thumbnail already owns
        // overflow:hidden + radius. For Feed/Thread we don't clip
        // because the profile bar / footer extend past the image.
        overflow: !isCardSurface ? 'hidden' : 'visible',
        transition: isLifted ? 'none' : 'box-shadow 200ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        {thumbNode}

        {/* B1 · drag handle · top-left, fades in on hover OR always-on for lifted card */}
        {(hover || isLifted) && (
          <div style={{
            position: 'absolute',
            left: 6, top: 6,
            zIndex: 6,
            padding: 3,
            borderRadius: 3,
            background: 'rgba(15, 14, 12, 0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'grab',
          }}>
            <window.DragHandle size={11} color="rgba(255,255,255,0.92)" />
          </div>
        )}

        {/* Score · top-left · shifts right when drag handle is visible */}
        <span style={{
          position: 'absolute',
          left: (hover || isLifted) ? 30 : 6,
          top: 6,
          zIndex: 5,
          padding: '2px 7px',
          borderRadius: 3,
          background: 'var(--accent-primary)',
          color: '#fff',
          fontFamily: 'var(--font-mono)',
          transition: 'left 160ms ease-out',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '-0.01em',
          boxShadow: '0 1px 2px rgba(15,14,12,0.18)',
        }}>{v.cooprScore}</span>

        {/* Format pill · top-right · white glass.
            Shifts left when kebab is visible (hover OR frozen-open). */}
        <span style={{
          position: 'absolute',
          right: (hover || showMenu) ? 34 : 6,
          top: 6,
          zIndex: 5,
          padding: '2px 6px',
          borderRadius: 3,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(4px)',
          color: 'var(--fg-primary)',
          fontFamily: 'var(--font-mono)',
          fontSize: 8.5,
          fontWeight: 700,
          letterSpacing: '0.06em',
          transition: 'right 160ms ease-out',
          boxShadow: '0 1px 2px rgba(15,14,12,0.10)',
        }}>{formatLabel}</span>

        {/* B3 · kebab handle · top-right, fades in on hover OR always-on
            for frozen-open card. Click anchors the context menu below. */}
        {(hover || showMenu) && (
          <div style={{ position: 'absolute', right: 6, top: 6, zIndex: 7 }}>
            <window.HF_KebabHandle
              tone={isCardSurface ? 'dark' : 'light'}
              visible
              onClick={openMenuAt}
            />
          </div>
        )}

        {/* Trial flag · bottom-right of the visual block (image-led only —
            Feed and Thread already have rich footer chrome). */}
        {v.trial && !isCardSurface && (
          <span style={{
            position: 'absolute', right: 6, bottom: 6,
            zIndex: 5,
            padding: '2px 6px',
            borderRadius: 2,
            background: 'rgba(255,255,255,0.94)',
            color: 'var(--fg-primary)',
            fontFamily: 'var(--font-mono)',
            fontSize: 8,
            fontWeight: 700,
            letterSpacing: '0.1em',
          }}>TRIAL</span>
        )}
        {v.trial && isCardSurface && (
          <span style={{
            position: 'absolute', right: 6, top: 28,
            zIndex: 5,
            padding: '2px 6px',
            borderRadius: 2,
            background: 'var(--accent-primary)',
            color: '#fff',
            fontFamily: 'var(--font-mono)',
            fontSize: 8,
            fontWeight: 700,
            letterSpacing: '0.1em',
            boxShadow: '0 1px 2px rgba(15,14,12,0.18)',
          }}>TRIAL</span>
        )}
      </div>

      {/* Caption row — date · views (suppressed for Feed and Thread which
          already render their own platform-native footer rows). */}
      {!isCardSurface && (
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 6,
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--fg-tertiary)',
          letterSpacing: '0.04em',
        }}>
          <span>{post.publishedAt}</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontWeight: 700, color: 'var(--fg-secondary)' }}>{window.r4FmtViews(post.views)}</span>
        </div>
      )}

      {/* B3 · context menu · anchored to the kebab. For the frozen-open
          card, position is hard-coded to the same place a click would
          place it (kebab is at top-right of thumbnail, menu drops below). */}
      {showMenu && (
        <div onClick={(e) => e.stopPropagation()}>
          <window.HF_ContextMenu
            x={frozenMenuOpen ? -160 : menuPos.x}
            y={frozenMenuOpen ? 36 : menuPos.y}
            items={menuItems}
            frozen={frozenMenuOpen}
            onClose={() => setMenuOpen(false)}
          />
        </div>
      )}
    </article>
  );
}

Object.assign(window, { HF_R4_LibraryCatalogGrid });
