/* global React, window */
/* hifi-tweaks.jsx — variant gallery for Insights · Overview.

   Renders the existing HF_InsightsOverview surface wrapped in a token-overriding
   div. Toggle typography or accent presets and the variables cascade through to
   every nested element via CSS custom-property inheritance. The underlying
   surface component is NEVER modified — this is non-destructive variant
   exploration.

   Why density and chrome are absent:
   - Density: surfaces use raw inline px values, not --space-* tokens, so a
     CSS-var override would have ~zero visible effect. Real density needs a
     refactor pass first.
   - Chrome: layouts like "slim left rail" require shell-level rewrites, not
     token overrides. Out of scope for a tweak panel.
*/

const TW = {
  serif: 'var(--font-serif)',
  sans:  'var(--font-sans)',
  mono:  'var(--font-mono)',
};

// ─── Variant presets ──────────────────────────────────────
// Surface axis lets you preview tweaks against different page types.
// Tokens cascade through the wrapper into whichever component is mounted.
//
// Typography group: Originals (T-A current · T-B sharper · T-C cleaner) +
// Cleaner+ (T-D through T-G — same direction, different serif personalities).
//
// Radius / shadow / border-color axes override CSS vars that DO propagate
// through surfaces consuming them via var(--radius-*) / var(--shadow-*) /
// var(--border-*). Density still uses scale-transform approximation.
const TWEAK_PRESETS = {
  surface: [
    {
      id: 'S-MASTER',
      label: 'Master document',
      sub: 'master.html · layout view · every workspace · scroll to explore · default',
      mode: 'iframe',
      url: 'master.html#layout',
    },
    {
      id: 'S-NAV',
      label: 'Master · Interactive Nav',
      sub: 'master.html · interactive nav · chrome + dossier drawer',
      mode: 'iframe',
      url: 'master.html#interactive/insights/overview',
    },
    {
      id: 'S-R4',
      label: 'Round 4',
      sub: 'Hi-fi round 4 · all 70 artboards · archeology baseline',
      mode: 'iframe',
      url: 'Hi-fi round 4.html',
    },
    {
      id: 'S-E',
      label: 'Token gallery',
      sub: 'every primitive at scale · the test bed for axes',
      component: 'HF_TweakTokenGallery',
    },
    {
      id: 'S-A',
      label: 'Insights · Overview',
      sub: 'data-dense editorial · header band + KPI strip + body grid',
      component: 'HF_InsightsOverview',
    },
    {
      id: 'S-B',
      label: 'Home · Chat',
      sub: 'chat-first cold-open · masthead + composer + briefing + BTF',
      component: 'HF_HomeChat',
    },
    {
      id: 'S-C',
      label: 'Library · Catalog',
      sub: 'visual 7-col grid · platform-faithful thumbs',
      component: 'HF_R4_LibraryCatalogGrid',
    },
    {
      id: 'S-D',
      label: 'Studio · Workspace',
      sub: 'project gallery · status pills + agent activity hints',
      component: 'HF_StudioWorkspace',
    },
  ],
  typo: [
    {
      id: 'T-A',
      label: 'Newsreader',
      sub: 'Newsreader · Plus Jakarta · JetBrains Mono · pre-R8',
      group: 'originals',
      sample: 'Aa',
      tokens: {
        '--font-serif': "'Newsreader', 'Charter', Georgia, serif",
        '--font-sans': "'Plus Jakarta Sans', system-ui, sans-serif",
      },
      sampleTokens: { fontFamily: "'Newsreader', Georgia, serif" },
    },
    {
      id: 'T-B',
      label: 'Sharper',
      sub: 'Fraunces · Inter Tight · IBM Plex Mono',
      group: 'originals',
      sample: 'Aa',
      tokens: {
        '--font-serif': "'Fraunces', 'Newsreader', Georgia, serif",
        '--font-sans': "'Inter Tight', 'Plus Jakarta Sans', system-ui, sans-serif",
        '--font-mono': "'IBM Plex Mono', 'JetBrains Mono', ui-monospace, monospace",
      },
      sampleTokens: { fontFamily: "'Fraunces', Georgia, serif" },
    },
    {
      id: 'T-C',
      label: 'Cleaner',
      sub: 'Source Serif 4 · Geist · JetBrains Mono · neutral 500',
      group: 'originals',
      sample: 'Aa',
      tokens: {
        '--font-serif': "'Source Serif 4', 'Newsreader', Georgia, serif",
        '--font-sans': "'Geist', 'Plus Jakarta Sans', system-ui, sans-serif",
      },
      sampleTokens: { fontFamily: "'Source Serif 4', Georgia, serif" },
    },
    {
      id: 'T-D',
      label: 'Spectral',
      sub: 'Spectral · Geist · screen-warm reading serif',
      group: 'cleaner+',
      sample: 'Aa',
      tokens: {
        '--font-serif': "'Spectral', 'Source Serif 4', Georgia, serif",
        '--font-sans': "'Geist', 'Plus Jakarta Sans', system-ui, sans-serif",
      },
      sampleTokens: { fontFamily: "'Spectral', Georgia, serif" },
    },
    {
      id: 'T-E',
      label: 'Literata · LOCKED',
      sub: 'Literata · Inter Tight · R8 baseline (committed)',
      group: 'cleaner+',
      sample: 'Aa',
      tokens: {},
      sampleTokens: { fontFamily: "'Literata', Georgia, serif" },
    },
    {
      id: 'T-F',
      label: 'Crimson',
      sub: 'Crimson Pro · Geist · contrasty light/heavy',
      group: 'cleaner+',
      sample: 'Aa',
      tokens: {
        '--font-serif': "'Crimson Pro', 'Source Serif 4', Georgia, serif",
        '--font-sans': "'Geist', 'Plus Jakarta Sans', system-ui, sans-serif",
      },
      sampleTokens: { fontFamily: "'Crimson Pro', Georgia, serif" },
    },
    {
      id: 'T-G',
      label: 'Lora',
      sub: 'Lora · DM Sans · warmer · friendlier',
      group: 'cleaner+',
      sample: 'Aa',
      tokens: {
        '--font-serif': "'Lora', 'Source Serif 4', Georgia, serif",
        '--font-sans': "'DM Sans', 'Plus Jakarta Sans', system-ui, sans-serif",
      },
      sampleTokens: { fontFamily: "'Lora', Georgia, serif" },
    },
  ],
  // Palette axis — coordinated multi-color sets that override accent + 4 tones
  // together. The surfaces in this codebase already reference --accent-primary,
  // --tone-success, --tone-warning, --tone-info, --tone-danger across header
  // bands, pillar rows, win/lag callouts, and channel charts — so a palette
  // preset cascades through all of them at once. "Different colors in different
  // sections that work well together" is exactly what these unlock.
  //
  // Each palette is constructed for internal harmony: consistent saturation and
  // value across the 5 slots, all tested against warm-paper backgrounds, no
  // chromatic gradients, no AI-purple. Vibes range from restrained editorial
  // (P-A, P-F) to high-contrast graphic (P-D Bauhaus) to all-earth muted (P-C
  // Field Notes) to single-hue depth (P-G).
  palette: [
    {
      id: 'P-A',
      label: 'Ink Monochrome',
      sub: 'previous lock · ink primary · italic does the work',
      swatches: ['#1a1815', '#4a6b3a', '#a87320', '#3e6680', '#9a3838'],
      vibe: 'restrained · monochrome accent',
      tokens: {
        '--accent-primary':       '#1a1815',
        '--accent-primary-hover': '#3a3631',
        '--accent-primary-press': '#000000',
        '--accent-soft':          '#ebe8e0',
        '--accent-ring':          'rgba(26,24,21,0.20)',
      },
    },
    {
      id: 'P-B',
      label: 'Editorial Magazine',
      sub: 'clay + warm-earth · prior R8 v2 lock · still browsable',
      swatches: ['#b6532b', '#5b7a4c', '#a87320', '#3e6680', '#9a3838'],
      vibe: 'classic editorial · balanced warm',
      tokens: {
        '--accent-primary':       '#b6532b',
        '--accent-primary-hover': '#a04620',
        '--accent-primary-press': '#8c3a1c',
        '--accent-soft':          '#f3e3d8',
        '--accent-ring':          'rgba(182,83,43,0.25)',
        '--tone-success':         '#4a6b3a',
        '--tone-success-bg':      '#e8ede0',
        '--tone-warning':         '#a87320',
        '--tone-warning-bg':      '#f4ead7',
        '--tone-info':            '#3e6680',
        '--tone-info-bg':         '#e1e8ee',
        '--tone-danger':          '#9a3838',
        '--tone-danger-bg':       '#f1dfdc',
      },
    },
    {
      id: 'P-C',
      label: 'Field Notes',
      sub: 'cocoa + all-earth · natural pigments only',
      swatches: ['#6b4226', '#6b7341', '#9c7423', '#4a6e6e', '#9c4f3e'],
      vibe: 'fieldbook · hand-drawn · no synthetic',
      tokens: {
        '--accent-primary':       '#6b4226',
        '--accent-primary-hover': '#5a371f',
        '--accent-primary-press': '#48291a',
        '--accent-soft':          '#e8dcc8',
        '--accent-ring':          'rgba(107,66,38,0.25)',
        '--tone-success':         '#6b7341',
        '--tone-success-bg':      '#ebede0',
        '--tone-warning':         '#9c7423',
        '--tone-warning-bg':      '#f3eadb',
        '--tone-info':            '#4a6e6e',
        '--tone-info-bg':         '#e0e8e7',
        '--tone-danger':          '#9c4f3e',
        '--tone-danger-bg':       '#efe0db',
      },
    },
    {
      id: 'P-D',
      label: 'Bauhaus',
      sub: 'deep red + primary mix · high contrast',
      swatches: ['#a3382b', '#2d5a3a', '#c79a3b', '#2c4d8c', '#6e1f1a'],
      vibe: 'graphic · primary colors moderated',
      tokens: {
        '--accent-primary':       '#a3382b',
        '--accent-primary-hover': '#8d2e22',
        '--accent-primary-press': '#76251c',
        '--accent-soft':          '#f0d8d3',
        '--accent-ring':          'rgba(163,56,43,0.25)',
        '--tone-success':         '#2d5a3a',
        '--tone-success-bg':      '#dde6dc',
        '--tone-warning':         '#c79a3b',
        '--tone-warning-bg':      '#f5e9c8',
        '--tone-info':            '#2c4d8c',
        '--tone-info-bg':         '#dbe2ef',
        '--tone-danger':          '#6e1f1a',
        '--tone-danger-bg':       '#ebd5d2',
      },
    },
    {
      id: 'P-E',
      label: 'Newspaper',
      sub: 'sepia + faded press · 1960s broadsheet',
      swatches: ['#8c5a2e', '#6b7548', '#a08446', '#6b7a82', '#a25148'],
      vibe: 'pre-CMYK · printing-press · warm desaturated',
      tokens: {
        '--accent-primary':       '#8c5a2e',
        '--accent-primary-hover': '#754a26',
        '--accent-primary-press': '#5e3c1f',
        '--accent-soft':          '#ecdfcf',
        '--accent-ring':          'rgba(140,90,46,0.25)',
        '--tone-success':         '#6b7548',
        '--tone-success-bg':      '#e8eadd',
        '--tone-warning':         '#a08446',
        '--tone-warning-bg':      '#efe7d2',
        '--tone-info':            '#6b7a82',
        '--tone-info-bg':         '#e2e6e8',
        '--tone-danger':          '#a25148',
        '--tone-danger-bg':       '#eedcd8',
      },
    },
    {
      id: 'P-F',
      label: 'Soft Editorial',
      sub: 'stone-gray + whispers · low intensity · nothing shouts',
      swatches: ['#5c5a55', '#7a8a6b', '#b89968', '#7a8a96', '#a87878'],
      vibe: 'extremely restrained · luxury-quiet',
      tokens: {
        '--accent-primary':       '#5c5a55',
        '--accent-primary-hover': '#4a4843',
        '--accent-primary-press': '#383631',
        '--accent-soft':          '#e8e6e2',
        '--accent-ring':          'rgba(92,90,85,0.20)',
        '--tone-success':         '#7a8a6b',
        '--tone-success-bg':      '#e9ece2',
        '--tone-warning':         '#b89968',
        '--tone-warning-bg':      '#f1e8d6',
        '--tone-info':            '#7a8a96',
        '--tone-info-bg':         '#e3e7eb',
        '--tone-danger':          '#a87878',
        '--tone-danger-bg':       '#efe1de',
      },
    },
    {
      id: 'P-G',
      label: 'Cool Mineral',
      sub: 'graphite + teal · cool slate · slightly cold modern',
      swatches: ['#2a3640', '#2d6262', '#a87320', '#4d6577', '#7a3848'],
      vibe: 'mineral · architectural · cool-leaning',
      tokens: {
        '--accent-primary':       '#2a3640',
        '--accent-primary-hover': '#1f2a32',
        '--accent-primary-press': '#161e24',
        '--accent-soft':          '#dde2e6',
        '--accent-ring':          'rgba(42,54,64,0.22)',
        '--tone-success':         '#2d6262',
        '--tone-success-bg':      '#dceae9',
        '--tone-warning':         '#a87320',
        '--tone-warning-bg':      '#f3e6ce',
        '--tone-info':            '#4d6577',
        '--tone-info-bg':         '#e0e6ec',
        '--tone-danger':          '#7a3848',
        '--tone-danger-bg':       '#ecd9de',
      },
    },
    {
      id: 'P-H',
      label: 'Single Hue Depth · LOCKED',
      sub: 'R8 v3 baseline · cocoa-only · depth via value · committed',
      swatches: ['#5a371f', '#5a4a26', '#a07346', '#806750', '#7a3a24'],
      vibe: 'monochromatic earth · maximum discipline',
      tokens: {},
    },
  ],
  // Density variants are a VISUAL APPROXIMATION via scale-transform on the
  // render frame. Surfaces use raw inline px (not --space-* tokens) so true
  // density refactor would need a separate pass to tokenize spacing. The
  // scale approximation gives a directional feel: tight = "visually 10%
  // tighter, what compression would look like", spacious = "visually 8%
  // looser, what breathing room would look like". Layout reflow is NOT
  // simulated — same grid, just rendered at a different size.
  density: [
    {
      id: 'D-A',
      label: 'Standard',
      sub: 'current · editorial breathing room',
      scale: 1.0,
      hint: 'baseline',
    },
    {
      id: 'D-B',
      label: 'Tight',
      sub: 'visual zoom −10% · Linear-feel',
      scale: 0.90,
      hint: '−10%',
    },
    {
      id: 'D-C',
      label: 'Spacious',
      sub: 'visual zoom +8% · subtle breathing',
      scale: 1.08,
      hint: '+8%',
    },
    {
      id: 'D-D',
      label: 'More Spacious',
      sub: 'visual zoom +14% · Substack-feel',
      scale: 1.14,
      hint: '+14%',
    },
    {
      id: 'D-E',
      label: 'Airy',
      sub: 'visual zoom +20% · magazine spread feel',
      scale: 1.20,
      hint: '+20%',
    },
    {
      id: 'D-F',
      label: 'Editorial',
      sub: 'visual zoom +28% · long-form reading mood',
      scale: 1.28,
      hint: '+28%',
    },
  ],
  // Warmth variants override the surface palette tokens cleanly via CSS vars.
  // No approximation — every surface that uses var(--bg-base) etc. picks this
  // up directly. Borders shift with the warmth so cards still feel coherent.
  warmth: [
    {
      id: 'W-A',
      label: 'Warm paper',
      sub: 'slightly toasted off-white · prior R8 v2 baseline',
      swatch: '#f7f5f0',
      tokens: {
        '--bg-base':       '#f7f5f0',
        '--surface-1':     '#fdfcf9',
        '--surface-2':     '#f1efe9',
        '--surface-3':     '#ebe8e0',
        '--border-subtle': '#e6e3dc',
        '--border-default':'#d4d0c6',
      },
    },
    {
      id: 'W-B',
      label: 'Cool gray',
      sub: 'cooler · clinical · Notion-y',
      swatch: '#f5f6f8',
      tokens: {
        '--bg-base':       '#f5f6f8',
        '--surface-1':     '#fcfcfd',
        '--surface-2':     '#ecedf0',
        '--surface-3':     '#e2e4e8',
        '--border-subtle': '#e6e8eb',
        '--border-default':'#d4d6da',
      },
    },
    {
      id: 'W-C',
      label: 'Cream',
      sub: 'warmer · book-like · less screen-y',
      swatch: '#faf6ed',
      tokens: {
        '--bg-base':       '#faf6ed',
        '--surface-1':     '#fffbf0',
        '--surface-2':     '#f4eed9',
        '--surface-3':     '#ece5cd',
        '--border-subtle': '#e8e0c8',
        '--border-default':'#d4cbb0',
      },
    },
    {
      id: 'W-D',
      label: 'Ivory · LOCKED',
      sub: 'R8 v3 baseline · almost-white · still warm · committed',
      swatch: '#fbfaf6',
      tokens: {},
    },
    // Paper-stock variants — added v9. Each preset is internally consistent:
    // bg-base sets the page tone; surface-1 is one step lighter; surface-2 is
    // one step darker for nested/pressed; surface-3 is darker still for inputs.
    // Borders shift in the same warmth direction so cards still feel coherent.
    {
      id: 'W-E',
      label: 'Newsprint',
      sub: 'cooler off-white · faint gray cast · fresh broadsheet',
      swatch: '#f3f2ec',
      tokens: {
        '--bg-base':       '#f3f2ec',
        '--surface-1':     '#f9f8f3',
        '--surface-2':     '#eceae4',
        '--surface-3':     '#e2e0d9',
        '--border-subtle': '#e2dfd5',
        '--border-default':'#cfcbbf',
      },
    },
    {
      id: 'W-F',
      label: 'Manila',
      sub: 'warmer tan · folder-stock · documentary',
      swatch: '#f0e6cf',
      tokens: {
        '--bg-base':       '#f0e6cf',
        '--surface-1':     '#f7eeda',
        '--surface-2':     '#e6dabd',
        '--surface-3':     '#dccfac',
        '--border-subtle': '#dcd0b5',
        '--border-default':'#c2b496',
      },
    },
    {
      id: 'W-G',
      label: 'Vellum',
      sub: 'pale cream · quiet · translucent feel',
      swatch: '#faf5e6',
      tokens: {
        '--bg-base':       '#faf5e6',
        '--surface-1':     '#fefaee',
        '--surface-2':     '#f1ebd6',
        '--surface-3':     '#e7e0c8',
        '--border-subtle': '#e8e1c8',
        '--border-default':'#d3cab0',
      },
    },
    {
      id: 'W-H',
      label: 'Bone',
      sub: 'warm white · subtle yellow undertone · gallery card',
      swatch: '#f7f1e3',
      tokens: {
        '--bg-base':       '#f7f1e3',
        '--surface-1':     '#fcf8eb',
        '--surface-2':     '#ede5d2',
        '--surface-3':     '#e3dac4',
        '--border-subtle': '#e4dbc5',
        '--border-default':'#cdc4ac',
      },
    },
    {
      id: 'W-I',
      label: 'Linen',
      sub: 'soft beige · weighted · fabric-like saturation',
      swatch: '#eee7d6',
      tokens: {
        '--bg-base':       '#eee7d6',
        '--surface-1':     '#f5eee0',
        '--surface-2':     '#e3dac8',
        '--surface-3':     '#d8cdb7',
        '--border-subtle': '#d2c8b3',
        '--border-default':'#b8ac93',
      },
    },
    {
      id: 'W-J',
      label: 'Old book',
      sub: 'aged page · deeper yellow-warm · paperback patina',
      swatch: '#f1e9cb',
      tokens: {
        '--bg-base':       '#f1e9cb',
        '--surface-1':     '#f8f0d6',
        '--surface-2':     '#e6dcb8',
        '--surface-3':     '#dbcfa4',
        '--border-subtle': '#d4c89e',
        '--border-default':'#b8aa7c',
      },
    },
    {
      id: 'W-K',
      label: 'Pearl',
      sub: 'cool ivory · faint blue undertone · museum card',
      swatch: '#f4f3ee',
      tokens: {
        '--bg-base':       '#f4f3ee',
        '--surface-1':     '#fafaf6',
        '--surface-2':     '#ebebe5',
        '--surface-3':     '#e0e0d8',
        '--border-subtle': '#e3e2d8',
        '--border-default':'#cdcbc0',
      },
    },
    {
      id: 'W-L',
      label: 'Parchment',
      sub: 'mid-warmth · slightly aged · matte not glossy',
      swatch: '#f5edd9',
      tokens: {
        '--bg-base':       '#f5edd9',
        '--surface-1':     '#fbf4e2',
        '--surface-2':     '#ebe2c8',
        '--surface-3':     '#dfd5b6',
        '--border-subtle': '#dcd1b1',
        '--border-default':'#bfb491',
      },
    },
  ],
  // Border radius — overrides --radius-* tokens. Surfaces using
  // var(--radius-md) etc respond directly. Surfaces with hardcoded radii
  // (still about half) won't react — this is a partial preview.
  radius: [
    {
      id: 'R-A',
      label: 'Standard',
      sub: 'current · 4 / 8 / 12 / 16 ladder',
      tokens: {},
      preview: 'M',
    },
    {
      id: 'R-B',
      label: 'Sharp',
      sub: 'half radius · architectural',
      tokens: {
        '--radius-sm': '2px', '--radius-md': '4px',
        '--radius-lg': '6px', '--radius-xl': '8px', '--radius-2xl': '10px',
      },
      preview: 'S',
    },
    {
      id: 'R-C',
      label: 'Soft',
      sub: '1.5x radius · friendlier',
      tokens: {
        '--radius-sm': '6px', '--radius-md': '12px',
        '--radius-lg': '18px', '--radius-xl': '24px', '--radius-2xl': '30px',
      },
      preview: 'L',
    },
    {
      id: 'R-D',
      label: 'Pill',
      sub: 'fully rounded · maximum playful',
      tokens: {
        '--radius-sm': '999px', '--radius-md': '999px',
        '--radius-lg': '999px', '--radius-xl': '999px', '--radius-2xl': '999px',
      },
      preview: 'XL',
    },
  ],
  // Shadow — overrides --shadow-* tokens. Sparingly used in the design system
  // but does propagate where consumed.
  shadow: [
    {
      id: 'SH-A',
      label: 'Standard',
      sub: 'subtle warm-ink ladder · prior R8 v2 baseline',
      tokens: {
        '--shadow-sm': '0 1px 2px rgba(26,24,21,0.04), 0 1px 1px rgba(26,24,21,0.03)',
        '--shadow-md': '0 4px 12px rgba(26,24,21,0.06), 0 1px 3px rgba(26,24,21,0.04)',
        '--shadow-lg': '0 12px 32px rgba(26,24,21,0.10), 0 2px 6px rgba(26,24,21,0.06)',
      },
    },
    {
      id: 'SH-B',
      label: 'None · LOCKED',
      sub: 'R8 v3 baseline · flat · zero elevation · committed',
      tokens: {},
    },
    {
      id: 'SH-C',
      label: 'Whisper',
      sub: 'barely-there · most restrained',
      tokens: {
        '--shadow-sm': '0 1px 1px rgba(26,24,21,0.02)',
        '--shadow-md': '0 2px 5px rgba(26,24,21,0.03)',
        '--shadow-lg': '0 6px 16px rgba(26,24,21,0.05)',
      },
    },
    {
      id: 'SH-D',
      label: 'Lifted',
      sub: 'more dramatic · cards float',
      tokens: {
        '--shadow-sm': '0 2px 4px rgba(26,24,21,0.06), 0 1px 2px rgba(26,24,21,0.04)',
        '--shadow-md': '0 8px 24px rgba(26,24,21,0.10), 0 2px 6px rgba(26,24,21,0.06)',
        '--shadow-lg': '0 24px 60px rgba(26,24,21,0.18), 0 4px 12px rgba(26,24,21,0.10)',
      },
    },
  ],
  // Headline weight — overrides font-weight on large italic-serif elements
  // (typically the editorial headlines). Targets specific font-size px values
  // in the headline range (22-44px) so body italic stays untouched. Each
  // preset's `rules` string is scoped to a frame via #SCOPE replacement.
  headlineWeight: [
    {
      id: 'HW-A', label: 'Standard',
      sub: 'editorial 600 · −0.02em tracking · prior R8 v2 baseline',
      rules: `
        #SCOPE .hf-headline,
        #SCOPE .hf-headline span,
        #SCOPE h1, #SCOPE h2 {
          font-weight: 600 !important;
          letter-spacing: -0.02em !important;
        }
      `,
    },
    {
      id: 'HW-B', label: 'Bold',
      sub: 'italic 700 · more emphatic',
      rules: `
        #SCOPE .hf-headline,
        #SCOPE .hf-headline span,
        #SCOPE h1, #SCOPE h2,
        #SCOPE [style*="font-family: var(--font-serif)"][style*="font-style: italic"] {
          font-weight: 700 !important;
        }
      `,
    },
    {
      id: 'HW-C', label: 'Light',
      sub: 'italic 400 · more delicate',
      rules: `
        #SCOPE .hf-headline,
        #SCOPE .hf-headline span,
        #SCOPE h1, #SCOPE h2,
        #SCOPE [style*="font-family: var(--font-serif)"][style*="font-style: italic"] {
          font-weight: 400 !important;
        }
      `,
    },
    {
      id: 'HW-D', label: 'Upright',
      sub: 'no italic · weight 600 · stately',
      rules: `
        #SCOPE .hf-headline,
        #SCOPE .hf-headline span,
        #SCOPE h1, #SCOPE h2,
        #SCOPE [style*="font-family: var(--font-serif)"][style*="font-style: italic"] {
          font-style: normal !important;
          font-weight: 600 !important;
        }
      `,
    },
    {
      id: 'HW-E', label: 'Display · LOCKED',
      sub: 'R8 v3 baseline · italic 600 + −0.035em tracking · committed',
      rules: '',
    },
  ],
  // Eyebrow tracking — letter-spacing + treatment of mono uppercase labels.
  // Targets common mono-uppercase patterns. ET-D swaps the mono caps treatment
  // for serif italic (a different "kind" of label entirely).
  eyebrow: [
    {
      id: 'ET-A', label: 'Standard',
      sub: '0.08em on .hf-byline / .hf-folio · prior R8 v2 baseline',
      rules: `
        #SCOPE .hf-byline,
        #SCOPE .hf-folio {
          letter-spacing: 0.08em !important;
        }
      `,
    },
    {
      id: 'ET-B', label: 'Tight · LOCKED',
      sub: 'R8 v3 baseline · 0.06em on .hf-byline / .hf-folio · committed',
      rules: '',
    },
    {
      id: 'ET-C', label: 'Wide',
      sub: '0.28em · more editorial gap',
      rules: `
        #SCOPE .hf-byline,
        #SCOPE .hf-folio,
        #SCOPE [style*="text-transform: uppercase"][style*="font-family: var(--font-mono)"] {
          letter-spacing: 0.28em !important;
        }
      `,
    },
    {
      id: 'ET-D', label: 'Serif italic',
      sub: 'swap caps for italic-serif · soft editorial label',
      rules: `
        #SCOPE .hf-byline,
        #SCOPE .hf-folio,
        #SCOPE [style*="text-transform: uppercase"][style*="font-family: var(--font-mono)"] {
          font-family: var(--font-serif) !important;
          font-style: italic !important;
          text-transform: none !important;
          letter-spacing: -0.005em !important;
          font-weight: 500 !important;
          font-size: 12.5px !important;
        }
      `,
    },
  ],
  // Number style — overrides .hf-num behavior (and via cascade affects most
  // tabular figures). NS-C swaps to old-style figures which feels book-like.
  numbers: [
    {
      id: 'NS-A', label: 'Tabular',
      sub: 'mono · fixed-width · current',
      rules: '',
    },
    {
      id: 'NS-B', label: 'Proportional',
      sub: 'mono · varied widths · less data-grid',
      rules: `
        #SCOPE .hf-num {
          font-variant-numeric: normal !important;
          font-feature-settings: normal !important;
        }
      `,
    },
    {
      id: 'NS-C', label: 'Old-style',
      sub: 'serif old-style figures · book-like',
      rules: `
        #SCOPE .hf-num {
          font-family: var(--font-serif) !important;
          font-feature-settings: 'onum', 'tnum' !important;
          font-style: normal !important;
        }
      `,
    },
    {
      id: 'NS-D', label: 'Sans tabular',
      sub: 'sans bold · tabular · less monospace feel',
      rules: `
        #SCOPE .hf-num {
          font-family: var(--font-sans) !important;
          font-variant-numeric: tabular-nums !important;
          font-feature-settings: 'tnum' !important;
          font-weight: 600 !important;
        }
      `,
    },
  ],
  // Border color intensity — overrides --border-* tokens. Width is hardcoded
  // 1px in surfaces; this controls how visible borders are via color contrast.
  borders: [
    {
      id: 'B-A',
      label: 'Standard',
      sub: 'current · warm-paper-tuned',
      tokens: {},
      swatch: '#d4d0c6',
    },
    {
      id: 'B-B',
      label: 'Whisper',
      sub: 'barely-there · maximum airy',
      tokens: {
        '--border-subtle':  '#f0ede5',
        '--border-default': '#e6e2d8',
        '--border-strong':  '#cdc8bb',
      },
      swatch: '#e6e2d8',
    },
    {
      id: 'B-C',
      label: 'Defined',
      sub: 'heavier · structured',
      tokens: {
        '--border-subtle':  '#d8d4c9',
        '--border-default': '#bab5a8',
        '--border-strong':  '#8d8678',
      },
      swatch: '#bab5a8',
    },
    {
      id: 'B-D',
      label: 'Inked',
      sub: 'near-black · editorial print',
      tokens: {
        '--border-subtle':  '#bab5a8',
        '--border-default': '#5c5a55',
        '--border-strong':  '#1a1815',
      },
      swatch: '#5c5a55',
    },
  ],
  // ─── R8 v4 NEW AXES (2026-04-29) ────────────────────────────
  // Eight new component-level + editorial axes. All target stable
  // .hf-* class selectors so rules propagate cleanly. Token-based
  // axes (heading scale) flow through CSS-var inheritance; rule-based
  // axes use the #SCOPE replacement pattern existing axes already use.
  // Each axis's first variant is "Standard" with empty rules/tokens —
  // matches the current baseline (no LOCKED status, these are exploration).

  // Tag (.hf-tag) rendering — chips/tags appear 30+ times in surfaces.
  // Different visual languages: filled-soft (current), outlined, underlined,
  // mono caps (letterpress), dot-prefix (gallery flag).
  tag: [
    {
      id: 'TG-A', label: 'Standard',
      sub: 'surface-2 fill + 1px subtle border · current',
      rules: '',
    },
    {
      id: 'TG-B', label: 'Outlined',
      sub: 'transparent · 1.5px tone border · structural',
      rules: `
        #SCOPE .hf-tag,
        #SCOPE span[style*="background: var(--surface-2)"][style*="border-radius"][style*="border: 1px"],
        #SCOPE span[style*="background: var(--accent-soft)"][style*="border-radius"] {
          background: transparent !important;
          border: 1.5px solid var(--accent-primary) !important;
          color: var(--accent-primary-press) !important;
        }
        #SCOPE .hf-tag-accent { border-color: var(--accent-primary) !important; background: transparent !important; }
        #SCOPE .hf-tag-success { border-color: var(--tone-success) !important; background: transparent !important; color: var(--tone-success) !important; }
        #SCOPE .hf-tag-warning { border-color: var(--tone-warning) !important; background: transparent !important; color: var(--tone-warning) !important; }
        #SCOPE .hf-tag-info { border-color: var(--tone-info) !important; background: transparent !important; color: var(--tone-info) !important; }
      `,
    },
    {
      id: 'TG-C', label: 'Underlined',
      sub: 'no fill · 2px bottom rule · margin tag',
      rules: `
        #SCOPE .hf-tag,
        #SCOPE span[style*="background: var(--surface-2)"][style*="border-radius"][style*="border: 1px"],
        #SCOPE span[style*="background: var(--accent-soft)"][style*="border-radius"] {
          background: transparent !important;
          border: none !important;
          border-bottom: 2px solid var(--accent-primary) !important;
          border-radius: 0 !important;
          padding-left: 0 !important;
          padding-right: 4px !important;
        }
        #SCOPE .hf-tag-accent { border-bottom-color: var(--accent-primary) !important; }
        #SCOPE .hf-tag-success { border-bottom-color: var(--tone-success) !important; color: var(--tone-success) !important; }
        #SCOPE .hf-tag-warning { border-bottom-color: var(--tone-warning) !important; color: var(--tone-warning) !important; }
        #SCOPE .hf-tag-info { border-bottom-color: var(--tone-info) !important; color: var(--tone-info) !important; }
      `,
    },
    {
      id: 'TG-D', label: 'Mono caps',
      sub: 'mono uppercase · letterpress · no fill',
      rules: `
        #SCOPE .hf-tag,
        #SCOPE span[style*="background: var(--surface-2)"][style*="border-radius"][style*="border: 1px"],
        #SCOPE span[style*="background: var(--accent-soft)"][style*="border-radius"] {
          background: transparent !important;
          border: none !important;
          font-family: var(--font-mono) !important;
          font-size: 10px !important;
          letter-spacing: 0.14em !important;
          text-transform: uppercase !important;
          font-weight: 700 !important;
          color: var(--accent-primary-press) !important;
        }
      `,
    },
    {
      id: 'TG-E', label: 'Dot prefix',
      sub: 'tone dot before label · no fill · gallery flag',
      rules: `
        #SCOPE .hf-tag,
        #SCOPE span[style*="background: var(--surface-2)"][style*="border-radius"][style*="border: 1px"],
        #SCOPE span[style*="background: var(--accent-soft)"][style*="border-radius"] {
          background: transparent !important;
          border: none !important;
          padding-left: 0 !important;
          color: var(--fg-primary) !important;
        }
        #SCOPE .hf-tag::before,
        #SCOPE span[style*="background: var(--surface-2)"][style*="border-radius"][style*="border: 1px"]::before,
        #SCOPE span[style*="background: var(--accent-soft)"][style*="border-radius"]::before {
          content: '';
          display: inline-block;
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--accent-primary);
          margin-right: 6px;
          flex-shrink: 0;
        }
        #SCOPE .hf-tag-accent::before { background: var(--accent-primary) !important; }
        #SCOPE .hf-tag-success::before { background: var(--tone-success) !important; }
        #SCOPE .hf-tag-warning::before { background: var(--tone-warning) !important; }
        #SCOPE .hf-tag-info::before { background: var(--tone-info) !important; }
      `,
    },
  ],
  // Button (.hf-btn-primary) rendering — primary CTA appears 9+ times.
  // Rules target both .hf-btn-primary AND inline-styled buttons that use
  // var(--accent-primary) as background, so partial reach on inline-styled
  // surfaces.
  button: [
    {
      id: 'BT-A', label: 'Standard',
      sub: 'filled accent · 32px · current',
      rules: '',
    },
    {
      id: 'BT-B', label: 'Outlined',
      sub: 'transparent · 1.5px accent · architectural',
      rules: `
        #SCOPE .hf-btn-primary,
        #SCOPE .hf-btn,
        #SCOPE button[style*="background: var(--accent-primary)"],
        #SCOPE button[style*="background:var(--accent-primary)"] {
          background: transparent !important;
          color: var(--accent-primary) !important;
          border: 1.5px solid var(--accent-primary) !important;
        }
      `,
    },
    {
      id: 'BT-C', label: 'Underlined',
      sub: 'italic-serif · text-decoration · editorial link',
      rules: `
        #SCOPE .hf-btn-primary,
        #SCOPE .hf-btn,
        #SCOPE button[style*="background: var(--accent-primary)"],
        #SCOPE button[style*="background:var(--accent-primary)"] {
          background: transparent !important;
          border: none !important;
          color: var(--accent-primary) !important;
          font-family: var(--font-serif) !important;
          font-style: italic !important;
          font-weight: 500 !important;
          font-size: 16px !important;
          text-decoration: underline !important;
          text-underline-offset: 4px !important;
          text-decoration-thickness: 1.5px !important;
          padding: 0 4px !important;
          height: auto !important;
        }
      `,
    },
    {
      id: 'BT-D', label: 'Bracketed',
      sub: 'mono uppercase · square brackets · sci-fi',
      rules: `
        #SCOPE .hf-btn-primary,
        #SCOPE .hf-btn,
        #SCOPE button[style*="background: var(--accent-primary)"],
        #SCOPE button[style*="background:var(--accent-primary)"] {
          background: transparent !important;
          border: none !important;
          color: var(--accent-primary) !important;
          font-family: var(--font-mono) !important;
          font-size: 11px !important;
          letter-spacing: 0.14em !important;
          text-transform: uppercase !important;
          font-weight: 700 !important;
          padding: 0 !important;
          height: auto !important;
        }
        #SCOPE .hf-btn-primary::before,
        #SCOPE .hf-btn::before,
        #SCOPE button[style*="background: var(--accent-primary)"]::before { content: '['; margin-right: 4px; opacity: 0.6; }
        #SCOPE .hf-btn-primary::after,
        #SCOPE .hf-btn::after,
        #SCOPE button[style*="background: var(--accent-primary)"]::after  { content: ']'; margin-left: 4px; opacity: 0.6; }
      `,
    },
    {
      id: 'BT-E', label: 'Minimal',
      sub: 'no fill · no border · text only · whisper',
      rules: `
        #SCOPE .hf-btn-primary,
        #SCOPE .hf-btn,
        #SCOPE button[style*="background: var(--accent-primary)"],
        #SCOPE button[style*="background:var(--accent-primary)"] {
          background: transparent !important;
          border: none !important;
          color: var(--accent-primary) !important;
          padding: 0 4px !important;
        }
      `,
    },
  ],
  // Card (.hf-card) rendering — surface containers appear 9+ times via class,
  // many more via inline style="background: var(--surface-1); border: 1px solid var(--border-...)".
  // Targets both class AND inline-styled card-like divs.
  card: [
    {
      id: 'CD-A', label: 'Standard',
      sub: 'surface-1 fill + subtle border · current',
      rules: '',
    },
    {
      id: 'CD-B', label: 'Rule only',
      sub: 'no fill · 2px top rule · paper-bare',
      rules: `
        #SCOPE .hf-card,
        #SCOPE div[style*="background: var(--surface-1)"][style*="border:"][style*="border-radius"],
        #SCOPE div[style*="background: var(--surface-1)"][style*="border-radius"] {
          background: transparent !important;
          border: none !important;
          border-top: 2px solid var(--fg-primary) !important;
          border-radius: 0 !important;
          padding-top: 14px !important;
        }
      `,
    },
    {
      id: 'CD-C', label: 'Paper',
      sub: 'surface-2 fill · no border · soft inset',
      rules: `
        #SCOPE .hf-card,
        #SCOPE div[style*="background: var(--surface-1)"][style*="border:"][style*="border-radius"],
        #SCOPE div[style*="background: var(--surface-1)"][style*="border-radius"] {
          background: var(--surface-2) !important;
          border-color: transparent !important;
          border-width: 0 !important;
        }
      `,
    },
    {
      id: 'CD-D', label: 'Floating',
      sub: 'no border · dramatic shadow · lifted',
      rules: `
        #SCOPE .hf-card,
        #SCOPE div[style*="background: var(--surface-1)"][style*="border:"][style*="border-radius"],
        #SCOPE div[style*="background: var(--surface-1)"][style*="border-radius"] {
          border-color: transparent !important;
          box-shadow: 0 8px 24px rgba(26,24,21,0.14), 0 2px 6px rgba(26,24,21,0.08) !important;
        }
      `,
    },
    {
      id: 'CD-E', label: 'Lined',
      sub: 'transparent fill · 1.5px ink border · architectural',
      rules: `
        #SCOPE .hf-card,
        #SCOPE div[style*="background: var(--surface-1)"][style*="border:"][style*="border-radius"],
        #SCOPE div[style*="background: var(--surface-1)"][style*="border-radius"] {
          background: transparent !important;
          border: 1.5px solid var(--fg-primary) !important;
        }
      `,
    },
  ],
  // Drop-cap (.hf-dropcap::first-letter) — appears 3 times. Editorial flourish.
  // Standard (serif accent), sans-bold ink, outlined-stroke, ink-stamped block.
  dropcap: [
    {
      id: 'DC-A', label: 'Standard',
      sub: 'serif · 3.4em · accent color · current',
      rules: '',
    },
    {
      id: 'DC-B', label: 'Sans bold',
      sub: 'sans 800 · ink color · masthead-y',
      rules: `
        #SCOPE .hf-dropcap::first-letter {
          font-family: var(--font-sans) !important;
          font-weight: 800 !important;
          color: var(--fg-primary) !important;
          font-style: normal !important;
        }
      `,
    },
    {
      id: 'DC-C', label: 'Outlined',
      sub: 'transparent fill · accent stroke · graphic',
      rules: `
        #SCOPE .hf-dropcap::first-letter {
          color: transparent !important;
          -webkit-text-stroke: 1.5px var(--accent-primary) !important;
        }
      `,
    },
    {
      id: 'DC-D', label: 'Block ink',
      sub: 'sans 800 · ink fill behind letter · stamped',
      rules: `
        #SCOPE .hf-dropcap::first-letter {
          font-family: var(--font-sans) !important;
          font-weight: 800 !important;
          color: var(--fg-on-ink) !important;
          background: var(--surface-ink) !important;
          font-style: normal !important;
          padding: 0.06em 0.12em 0 0.12em !important;
          margin-right: 0.18em !important;
          line-height: 1 !important;
        }
      `,
    },
  ],
  // Active-state (.hf-tab.is-active / .hf-subtab.is-active / .hf-rail-item.is-active)
  // — appears 7+ times. How the current section announces itself.
  // Standard (underline + fill), left-rule, bracket-marks, italic-serif.
  activeState: [
    {
      id: 'AS-A', label: 'Standard',
      sub: 'underline on tabs · fill on rail · current',
      rules: '',
    },
    {
      id: 'AS-B', label: 'Left rule',
      sub: 'vertical accent rule · ledger-left',
      rules: `
        #SCOPE .hf-subtab.is-active,
        #SCOPE .hf-tab.is-active,
        #SCOPE span[style*="border-bottom: 2px solid var(--fg-primary)"] {
          border-bottom-color: transparent !important;
          border-bottom: none !important;
          border-left: 3px solid var(--accent-primary) !important;
          padding-left: 10px !important;
        }
        #SCOPE .hf-rail-item.is-active {
          background: transparent !important;
          border-left: 3px solid var(--accent-primary) !important;
          padding-left: 8px !important;
        }
      `,
    },
    {
      id: 'AS-C', label: 'Brackets',
      sub: 'mono [ · ] flanking active label · accent color',
      rules: `
        #SCOPE .hf-subtab.is-active,
        #SCOPE .hf-tab.is-active,
        #SCOPE span[style*="border-bottom: 2px solid var(--fg-primary)"] {
          color: var(--accent-primary) !important;
          border-bottom-color: var(--accent-primary) !important;
        }
        #SCOPE .hf-subtab.is-active::before,
        #SCOPE .hf-tab.is-active::before,
        #SCOPE .hf-rail-item.is-active::before,
        #SCOPE span[style*="border-bottom: 2px solid var(--fg-primary)"]::before {
          content: '[';
          font-family: var(--font-mono);
          color: var(--accent-primary);
          margin-right: 4px;
          font-weight: 700;
        }
        #SCOPE .hf-subtab.is-active::after,
        #SCOPE .hf-tab.is-active::after,
        #SCOPE .hf-rail-item.is-active::after,
        #SCOPE span[style*="border-bottom: 2px solid var(--fg-primary)"]::after {
          content: ']';
          font-family: var(--font-mono);
          color: var(--accent-primary);
          margin-left: 4px;
          font-weight: 700;
        }
      `,
    },
    {
      id: 'AS-D', label: 'Italic serif',
      sub: 'editorial · italic + accent color · no underline',
      rules: `
        #SCOPE .hf-subtab.is-active,
        #SCOPE .hf-tab.is-active,
        #SCOPE .hf-rail-item.is-active,
        #SCOPE span[style*="border-bottom: 2px solid var(--fg-primary)"] {
          font-family: var(--font-serif) !important;
          font-style: italic !important;
          font-weight: 500 !important;
          font-size: 16px !important;
          color: var(--accent-primary) !important;
          border-bottom-color: transparent !important;
          letter-spacing: -0.02em !important;
        }
        #SCOPE .hf-rail-item.is-active { background: transparent !important; }
      `,
    },
  ],
  // Master nav chrome axes — these target the CSS-variable hooks in
  // hifi-master-interactive-view.jsx. They only affect master.html's
  // interactive chrome; other surfaces ignore these variables.
  navFit: [
    {
      id: 'NF-A',
      label: 'Full width legacy',
      sub: '16px gutters · reads nearly full-bleed',
      rules: `
        #SCOPE .cv-master-root {
          --mv-chrome-gutter: 16px !important;
          --mv-chrome-max-w: calc(100vw - 32px) !important;
          --mv-nav-gap: 28px !important;
          --mv-nav-pad-x: 14px !important;
        }
      `,
    },
    {
      id: 'NF-B',
      label: 'Compact float · LOCKED',
      sub: '1240px cap · real side gutters · daily-driver',
      rules: '',
    },
    {
      id: 'NF-C',
      label: 'Tight index',
      sub: '1100px cap · denser table-of-contents feel',
      rules: `
        #SCOPE .cv-master-root {
          --mv-chrome-max-w: 1100px !important;
          --mv-nav-gap: 12px !important;
          --mv-nav-pad-x: 6px !important;
          --mv-nav-font-size: 12px !important;
        }
      `,
    },
    {
      id: 'NF-D',
      label: 'Wide editorial',
      sub: '1320px cap · still not edge-to-edge',
      rules: `
        #SCOPE .cv-master-root {
          --mv-chrome-max-w: 1320px !important;
          --mv-nav-gap: 22px !important;
          --mv-nav-pad-x: 10px !important;
        }
      `,
    },
  ],
  navMarker: [
    {
      id: 'NM-A',
      label: 'Bubble legacy',
      sub: 'translucent active capsule · old feel',
      rules: `
        #SCOPE .cv-master-root {
          --mv-active-marker-h: 32px !important;
          --mv-active-marker-top: 10px !important;
          --mv-active-marker-bg: linear-gradient(180deg, color-mix(in srgb, var(--accent-primary) 14%, transparent), color-mix(in srgb, var(--accent-primary) 4%, transparent)) !important;
          --mv-active-marker-border: 1px solid color-mix(in srgb, var(--accent-primary) 18%, transparent) !important;
          --mv-active-marker-radius: 999px !important;
          --mv-active-marker-shadow: 0 1px 0 rgba(253,252,249,0.5) inset, 0 2px 6px -3px color-mix(in srgb, var(--accent-primary) 22%, transparent) !important;
          --mv-hover-marker-h: 32px !important;
          --mv-hover-marker-top: 10px !important;
          --mv-hover-marker-bg: var(--surface-2) !important;
          --mv-hover-marker-border: 1px solid var(--border-subtle) !important;
          --mv-hover-marker-radius: 999px !important;
          --mv-hover-marker-shadow: 0 1px 0 rgba(253,252,249,0.5) inset !important;
        }
      `,
    },
    {
      id: 'NM-B',
      label: 'Editorial rule · LOCKED',
      sub: 'quiet 2px marker · no glass capsule',
      rules: '',
    },
    {
      id: 'NM-C',
      label: 'Ledger tick',
      sub: 'shorter underline · accounting ledger cue',
      rules: `
        #SCOPE .cv-master-root {
          --mv-active-marker-h: 3px !important;
          --mv-active-marker-top: calc(var(--mv-chrome-row-h) - 9px) !important;
          --mv-active-marker-bg: var(--fg-primary) !important;
          --mv-hover-marker-bg: var(--border-default) !important;
        }
      `,
    },
    {
      id: 'NM-D',
      label: 'Top rule',
      sub: 'marker above label · publication running-head',
      rules: `
        #SCOPE .cv-master-root {
          --mv-active-marker-h: 2px !important;
          --mv-active-marker-top: 8px !important;
          --mv-active-marker-bg: var(--accent-primary) !important;
          --mv-hover-marker-h: 1px !important;
          --mv-hover-marker-top: 9px !important;
        }
      `,
    },
  ],
  navType: [
    {
      id: 'NT-A',
      label: 'Serif active legacy',
      sub: 'active tab changes font family and style',
      rules: `
        #SCOPE .cv-master-root {
          --mv-nav-active-font-family: var(--font-serif) !important;
          --mv-nav-active-font-style: italic !important;
          --mv-nav-active-font-weight: 600 !important;
          --mv-nav-letter-spacing: -0.005em !important;
        }
      `,
    },
    {
      id: 'NT-B',
      label: 'Steady sans · LOCKED',
      sub: 'same font for every tab · weight/color do the work',
      rules: '',
    },
    {
      id: 'NT-C',
      label: 'Mono index',
      sub: 'small-caps index · more technical',
      rules: `
        #SCOPE .cv-master-root {
          --mv-nav-font-family: var(--font-mono) !important;
          --mv-nav-active-font-family: var(--font-mono) !important;
          --mv-nav-font-size: 10.5px !important;
          --mv-nav-letter-spacing: 0.08em !important;
          --mv-nav-font-weight: 600 !important;
          --mv-nav-active-font-weight: 700 !important;
        }
      `,
    },
    {
      id: 'NT-D',
      label: 'Larger read',
      sub: 'same sans · slightly bigger and calmer',
      rules: `
        #SCOPE .cv-master-root {
          --mv-nav-font-size: 13.5px !important;
          --mv-nav-gap: 16px !important;
          --mv-nav-pad-x: 7px !important;
        }
      `,
    },
  ],
  navPreview: [
    {
      id: 'NP-A',
      label: 'Lean legacy',
      sub: 'shorter drawer · compact preview',
      rules: `
        #SCOPE .cv-master-root {
          --mv-drawer-h: 220px !important;
          --mv-preview-scale: 0.92 !important;
        }
      `,
    },
    {
      id: 'NP-B',
      label: 'Page dossiers · LOCKED',
      sub: '252px drawer · now/evidence/next action',
      rules: '',
    },
    {
      id: 'NP-C',
      label: 'Dense dossier',
      sub: 'same information, compressed for scanning',
      rules: `
        #SCOPE .cv-master-root {
          --mv-drawer-h: 236px !important;
          --mv-preview-scale: 0.94 !important;
        }
      `,
    },
    {
      id: 'NP-D',
      label: 'Open dossier',
      sub: 'more air for preview rows',
      rules: `
        #SCOPE .cv-master-root {
          --mv-drawer-h: 286px !important;
          --mv-preview-scale: 1.06 !important;
        }
      `,
    },
  ],
  // Status-dot (.hf-dot) — appears 7 times. Activity / status indicators.
  // Solid (current), outlined-ring, square-grid, pulsing-halo.
  statusDot: [
    {
      id: 'SD-A', label: 'Standard',
      sub: 'solid 6px circle · current',
      rules: '',
    },
    {
      id: 'SD-B', label: 'Outlined',
      sub: 'transparent · 1.5px ring · hollow',
      rules: `
        #SCOPE .hf-dot,
        #SCOPE span[style*="width: 4px"][style*="border-radius: 50%"],
        #SCOPE span[style*="width: 5px"][style*="border-radius: 50%"],
        #SCOPE span[style*="width: 6px"][style*="border-radius: 50%"],
        #SCOPE span[style*="width: 7px"][style*="border-radius: 50%"],
        #SCOPE span[style*="width: 8px"][style*="border-radius: 50%"],
        #SCOPE span[style*="width: 9px"][style*="border-radius: 50%"],
        #SCOPE span[style*="width: 10px"][style*="border-radius: 50%"] {
          background: transparent !important;
          box-shadow: inset 0 0 0 1.5px var(--accent-primary) !important;
          outline: 1.5px solid var(--accent-primary) !important;
          outline-offset: -1.5px !important;
        }
      `,
    },
    {
      id: 'SD-C', label: 'Square',
      sub: 'square · technical · grid-y',
      rules: `
        #SCOPE .hf-dot,
        #SCOPE span[style*="width: 4px"][style*="border-radius: 50%"],
        #SCOPE span[style*="width: 5px"][style*="border-radius: 50%"],
        #SCOPE span[style*="width: 6px"][style*="border-radius: 50%"],
        #SCOPE span[style*="width: 7px"][style*="border-radius: 50%"],
        #SCOPE span[style*="width: 8px"][style*="border-radius: 50%"],
        #SCOPE span[style*="width: 9px"][style*="border-radius: 50%"],
        #SCOPE span[style*="width: 10px"][style*="border-radius: 50%"] {
          border-radius: 0 !important;
        }
      `,
    },
    {
      id: 'SD-D', label: 'Halo',
      sub: 'solid + soft halo · live-feed pulse',
      rules: `
        #SCOPE .hf-dot,
        #SCOPE span[style*="width: 4px"][style*="border-radius: 50%"],
        #SCOPE span[style*="width: 5px"][style*="border-radius: 50%"],
        #SCOPE span[style*="width: 6px"][style*="border-radius: 50%"],
        #SCOPE span[style*="width: 7px"][style*="border-radius: 50%"],
        #SCOPE span[style*="width: 8px"][style*="border-radius: 50%"],
        #SCOPE span[style*="width: 9px"][style*="border-radius: 50%"],
        #SCOPE span[style*="width: 10px"][style*="border-radius: 50%"] {
          box-shadow: 0 0 0 4px var(--accent-soft) !important;
        }
      `,
    },
  ],
  // Heading-scale — overrides --text-md/lg/xl/2xl/3xl tokens. Surfaces using
  // var(--text-*) respond directly. Inline-px headings unaffected (partial
  // preview, similar to radius axis).
  headingScale: [
    {
      id: 'HS-A', label: 'Standard',
      sub: 'minor third (1.20) · 14→16→18→22→28 · current',
      tokens: {},
      preview: '1.20',
    },
    {
      id: 'HS-B', label: 'Major third',
      sub: 'major third (1.25) · 14→17→22→28→36 · classic',
      tokens: {
        '--text-md': '17px',
        '--text-lg': '22px',
        '--text-xl': '28px',
        '--text-2xl': '36px',
        '--text-3xl': '46px',
      },
      preview: '1.25',
    },
    {
      id: 'HS-C', label: 'Perfect fourth',
      sub: 'perfect fourth (1.33) · 14→18→24→32→44 · roomy',
      tokens: {
        '--text-md': '18px',
        '--text-lg': '24px',
        '--text-xl': '32px',
        '--text-2xl': '44px',
        '--text-3xl': '60px',
      },
      preview: '1.33',
    },
    {
      id: 'HS-D', label: 'Golden',
      sub: 'golden (1.618) · 14→17→27→44→72 · dramatic',
      tokens: {
        '--text-md': '17px',
        '--text-lg': '22px',
        '--text-xl': '36px',
        '--text-2xl': '58px',
        '--text-3xl': '94px',
      },
      preview: '1.62',
    },
  ],
  // Body line-height — controls .hf body line-height. Surfaces inheriting
  // from .hf via the wrapper pick this up directly.
  lineHeight: [
    {
      id: 'LH-A', label: 'Standard',
      sub: '1.45 · current · default reading',
      rules: '',
      preview: 1.45,
    },
    {
      id: 'LH-B', label: 'Tight',
      sub: '1.30 · dense · table-like',
      rules: `
        #SCOPE .hf, #SCOPE .hf p, #SCOPE .hf li { line-height: 1.30 !important; }
      `,
      preview: 1.30,
    },
    {
      id: 'LH-C', label: 'Loose',
      sub: '1.65 · breathing · longform',
      rules: `
        #SCOPE .hf, #SCOPE .hf p, #SCOPE .hf li { line-height: 1.65 !important; }
      `,
      preview: 1.65,
    },
    {
      id: 'LH-D', label: 'Magazine',
      sub: '1.85 · oversize gap · editorial spread',
      rules: `
        #SCOPE .hf, #SCOPE .hf p, #SCOPE .hf li { line-height: 1.85 !important; }
      `,
      preview: 1.85,
    },
  ],
};

// ─── Chips ────────────────────────────────────────────────
function TweakChip({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: '7px 12px',
      borderRadius: 999,
      background: active ? 'var(--accent-soft)' : 'var(--surface-1)',
      color: active ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
      border: active ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
      fontFamily: TW.sans, fontSize: 12, fontWeight: 500,
      cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 6,
      transition: 'background 140ms ease, border-color 140ms ease, color 140ms ease',
      lineHeight: 1.2,
    }}>{children}</button>
  );
}

// Typography chip — bigger live-preview "Aa" rendered in the variant's actual
// serif so you can see the letter shapes before committing.
function TypoChip({ opt, active, onClick }) {
  const sampleFamily = opt.sampleTokens?.fontFamily || 'var(--font-serif)';
  return (
    <button onClick={onClick} style={{
      padding: '8px 14px 8px 10px',
      borderRadius: 10,
      background: active ? 'var(--accent-soft)' : 'var(--surface-1)',
      color: active ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
      border: active ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
      cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 10,
      transition: 'background 140ms ease, border-color 140ms ease, color 140ms ease',
      lineHeight: 1.15,
    }}>
      {/* Live preview — Aa rendered in the variant's serif italic */}
      <span style={{
        display: 'inline-flex', alignItems: 'baseline', justifyContent: 'center',
        width: 30, height: 26,
        fontFamily: sampleFamily,
        fontStyle: 'italic',
        fontSize: 22, fontWeight: 500,
        color: active ? 'var(--accent-primary-press)' : 'var(--fg-primary)',
        letterSpacing: '-0.02em',
        borderRight: '1px solid var(--border-subtle)',
        paddingRight: 8,
      }}>{opt.sample}</span>
      <span style={{ fontFamily: TW.mono, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em' }}>{opt.id}</span>
      <span style={{ fontFamily: TW.sans, fontSize: 12, fontWeight: 600 }}>{opt.label}</span>
      <span style={{
        fontFamily: TW.serif, fontStyle: 'italic',
        color: active ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)',
        fontSize: 11.5, fontWeight: 400,
      }}>{opt.sub}</span>
    </button>
  );
}

// ─── Palette chip — multi-swatch preview ──────────────────
function PaletteChip({ opt, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '8px 14px 8px 10px',
      borderRadius: 10,
      background: active ? 'var(--accent-soft)' : 'var(--surface-1)',
      color: active ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
      border: active ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
      cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 10,
      transition: 'background 140ms ease, border-color 140ms ease, color 140ms ease',
      lineHeight: 1.15,
    }}>
      {/* Multi-swatch preview — 5 dots showing the palette's full range */}
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 3,
        borderRight: '1px solid var(--border-subtle)',
        paddingRight: 8, height: 22,
      }}>
        {opt.swatches.map((hex, i) => (
          <span key={i} style={{
            width: 11, height: 11, borderRadius: '50%',
            background: hex,
            border: '1px solid rgba(26,24,21,0.10)',
            display: 'inline-block',
          }} />
        ))}
      </span>
      <span style={{ fontFamily: TW.mono, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em' }}>{opt.id}</span>
      <span style={{ fontFamily: TW.sans, fontSize: 12, fontWeight: 600 }}>{opt.label}</span>
      <span style={{
        fontFamily: TW.serif, fontStyle: 'italic',
        color: active ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)',
        fontSize: 11.5, fontWeight: 400,
      }}>{opt.sub}</span>
    </button>
  );
}

// ─── Surface chip · with one-line sub ─────────────────────
function SurfaceChip({ opt, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '8px 14px',
      borderRadius: 10,
      background: active ? 'var(--accent-soft)' : 'var(--surface-1)',
      color: active ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
      border: active ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
      cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 10,
      transition: 'background 140ms ease, border-color 140ms ease, color 140ms ease',
      lineHeight: 1.15,
    }}>
      <span style={{ fontFamily: TW.mono, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em' }}>{opt.id}</span>
      <span style={{ fontFamily: TW.sans, fontSize: 13, fontWeight: 600 }}>{opt.label}</span>
      <span style={{
        fontFamily: TW.serif, fontStyle: 'italic',
        color: active ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)',
        fontSize: 12, fontWeight: 400,
      }}>{opt.sub}</span>
    </button>
  );
}

// ─── Radius chip · shows a small radius preview square ────
function RadiusChip({ opt, active, onClick }) {
  // Visual preview of the radius — a tiny square with the variant's radius applied
  const r = opt.tokens['--radius-md'] || '8px';
  return (
    <button onClick={onClick} style={{
      padding: '7px 12px 7px 8px',
      borderRadius: 999,
      background: active ? 'var(--accent-soft)' : 'var(--surface-1)',
      color: active ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
      border: active ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
      cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 8,
      lineHeight: 1.15,
    }}>
      <span style={{
        width: 16, height: 16,
        background: active ? 'var(--accent-primary)' : 'var(--fg-secondary)',
        borderRadius: r,
        display: 'inline-block',
      }} />
      <span style={{ fontFamily: TW.mono, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em' }}>{opt.id}</span>
      <span style={{ fontWeight: 600 }}>{opt.label}</span>
      <span style={{ fontFamily: TW.serif, fontStyle: 'italic', color: active ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)', fontSize: 11.5, fontWeight: 400 }}>{opt.sub}</span>
    </button>
  );
}

// ─── Shadow chip · shows a small swatch with the shadow ───
function ShadowChip({ opt, active, onClick }) {
  const sh = opt.tokens['--shadow-md'] || '0 4px 12px rgba(26, 24, 21, 0.06), 0 1px 3px rgba(26, 24, 21, 0.04)';
  return (
    <button onClick={onClick} style={{
      padding: '7px 12px 7px 10px',
      borderRadius: 10,
      background: active ? 'var(--accent-soft)' : 'var(--surface-1)',
      color: active ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
      border: active ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
      cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 8,
      lineHeight: 1.15,
    }}>
      <span style={{
        width: 16, height: 16,
        background: 'var(--surface-1)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 4,
        boxShadow: sh,
        display: 'inline-block',
      }} />
      <span style={{ fontFamily: TW.mono, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em' }}>{opt.id}</span>
      <span style={{ fontWeight: 600 }}>{opt.label}</span>
      <span style={{ fontFamily: TW.serif, fontStyle: 'italic', color: active ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)', fontSize: 11.5, fontWeight: 400 }}>{opt.sub}</span>
    </button>
  );
}

// ─── Control panel ────────────────────────────────────────
function TweakPanel({
  typo, setTypo, palette, setPalette, density, setDensity, warmth, setWarmth,
  surface, setSurface,
  radius, setRadius, shadow, setShadow, borders, setBorders,
  hw, setHw, eb, setEb, ns, setNs,
  tg, setTg, bt, setBt, cd, setCd, dc, setDc,
  as_, setAs, sd, setSd, hs, setHs, lh, setLh,
  compareOn, setCompareOn,
  onReset,
}) {
  return (
    <div style={{
      background: 'var(--surface-1)',
      borderBottom: '1px solid var(--fg-primary)',
      padding: '24px 32px 22px',
    }}>
      {/* Byline strip */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 12 }}>
        <span style={{ fontFamily: TW.mono, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
          COOPR · TWEAKS · variant gallery · v7
        </span>
        <span style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
        <button onClick={() => setCompareOn(!compareOn)} style={{
          background: compareOn ? 'var(--accent-primary)' : 'transparent',
          color: compareOn ? 'var(--fg-on-accent)' : 'var(--fg-secondary)',
          border: compareOn ? '1px solid var(--accent-primary)' : '1px solid var(--border-default)',
          padding: '4px 10px',
          borderRadius: 999,
          cursor: 'pointer',
          fontFamily: TW.mono, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700,
        }}>{compareOn ? 'COMPARE · ON' : 'COMPARE 2 ↔'}</button>
        <button onClick={onReset} style={{
          background: 'transparent', border: 'none', padding: 0,
          cursor: 'pointer',
          fontFamily: TW.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'var(--accent-primary)', fontWeight: 700,
        }}>RESET TO CURRENT →</button>
      </div>

      {/* Headline + deck */}
      <h1 style={{ margin: '0 0 6px', fontFamily: TW.serif, fontWeight: 500, fontSize: 32, letterSpacing: '-0.02em', color: 'var(--fg-primary)', lineHeight: 1.1 }}>
        Insights · Overview, <span style={{ fontStyle: 'italic' }}>tweaked.</span>
      </h1>
      <p style={{ margin: '0 0 22px', fontFamily: TW.serif, fontStyle: 'italic', fontSize: 14, color: 'var(--fg-secondary)', maxWidth: 740, lineHeight: 1.5 }}>
        Same surface rendered below. Pick a typography stack and an accent — tokens cascade through the wrapper without modifying the underlying component. Your Round 4 prototype is untouched.
      </p>

      {/* Surface chip row · pinned at top — what you're previewing */}
      <div style={{ marginBottom: 18, padding: '14px 16px', background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: 10 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
          <span style={{ fontFamily: TW.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 700 }}>
            preview surface · {TWEAK_PRESETS.surface.length} options
          </span>
          <span style={{ fontFamily: TW.serif, fontStyle: 'italic', fontSize: 12, color: 'var(--fg-tertiary)' }}>
            See how a tweak combo reads against different page types — chat-first vs data-dense vs visual-grid vs project-gallery.
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {TWEAK_PRESETS.surface.map(opt => (
            <SurfaceChip key={opt.id} opt={opt} active={surface === opt.id} onClick={() => setSurface(opt.id)} />
          ))}
        </div>
      </div>

      {/* Axis groups — typography on top (full width), color below */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        {/* Typography — grouped by Originals / Cleaner+ */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 10 }}>
            <span style={{ fontFamily: TW.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
              typography ladder · {TWEAK_PRESETS.typo.length} variants
            </span>
            <span style={{ fontFamily: TW.serif, fontStyle: 'italic', fontSize: 12, color: 'var(--fg-tertiary)' }}>
              Weight character is intrinsic to each font — same numeric weight reads differently across the row.
            </span>
          </div>

          {/* Group A — originals */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontFamily: TW.mono, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 700, minWidth: 78 }}>
              originals
            </span>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {TWEAK_PRESETS.typo.filter(o => o.group === 'originals').map(opt => (
                <TypoChip key={opt.id} opt={opt} active={typo === opt.id} onClick={() => setTypo(opt.id)} />
              ))}
            </div>
          </div>

          {/* Group B — cleaner+ */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: TW.mono, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-primary-press)', fontWeight: 700, minWidth: 78 }}>
              cleaner+
            </span>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {TWEAK_PRESETS.typo.filter(o => o.group === 'cleaner+').map(opt => (
                <TypoChip key={opt.id} opt={opt} active={typo === opt.id} onClick={() => setTypo(opt.id)} />
              ))}
            </div>
          </div>
        </div>

        {/* Palette — multi-color coordinated sets */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 10 }}>
            <span style={{ fontFamily: TW.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
              palette · {TWEAK_PRESETS.palette.length} coordinated sets
            </span>
            <span style={{ fontFamily: TW.serif, fontStyle: 'italic', fontSize: 12, color: 'var(--fg-tertiary)' }}>
              Each palette overrides primary accent + 4 semantic tones together — section colors stay in harmony.
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TWEAK_PRESETS.palette.map(opt => (
              <PaletteChip key={opt.id} opt={opt} active={palette === opt.id} onClick={() => setPalette(opt.id)} />
            ))}
          </div>
        </div>

        {/* Density */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 10 }}>
            <span style={{ fontFamily: TW.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
              density · {TWEAK_PRESETS.density.length} options
            </span>
            <span style={{ fontFamily: TW.serif, fontStyle: 'italic', fontSize: 12, color: 'var(--fg-tertiary)' }}>
              Visual approximation only — surfaces still use raw inline px. True density refactor needs a separate pass.
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TWEAK_PRESETS.density.map(opt => (
              <TweakChip key={opt.id} active={density === opt.id} onClick={() => setDensity(opt.id)}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  minWidth: 32, height: 18,
                  fontFamily: TW.mono, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.04em',
                  color: density === opt.id ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
                  background: density === opt.id ? 'transparent' : 'var(--surface-2)',
                  borderRight: '1px solid var(--border-subtle)',
                  paddingRight: 8, marginRight: 2,
                }}>{opt.hint}</span>
                <span style={{ fontFamily: TW.mono, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em' }}>{opt.id}</span>
                <span style={{ fontWeight: 600 }}>{opt.label}</span>
                <span style={{ fontFamily: TW.serif, fontStyle: 'italic', color: density === opt.id ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)', fontSize: 11.5, fontWeight: 400 }}>
                  {opt.sub}
                </span>
              </TweakChip>
            ))}
          </div>
        </div>

        {/* Surface warmth */}
        <div>
          <div style={{ fontFamily: TW.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600, marginBottom: 10 }}>
            surface warmth · {TWEAK_PRESETS.warmth.length} options
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TWEAK_PRESETS.warmth.map(opt => (
              <TweakChip key={opt.id} active={warmth === opt.id} onClick={() => setWarmth(opt.id)}>
                <span style={{
                  width: 14, height: 14, borderRadius: 3,
                  background: opt.swatch,
                  display: 'inline-block',
                  border: '1px solid rgba(26,24,21,0.12)',
                  flexShrink: 0,
                }} />
                <span style={{ fontFamily: TW.mono, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em' }}>{opt.id}</span>
                <span style={{ fontWeight: 600 }}>{opt.label}</span>
                <span style={{ fontFamily: TW.serif, fontStyle: 'italic', color: warmth === opt.id ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)', fontSize: 11.5, fontWeight: 400 }}>
                  {opt.sub}
                </span>
              </TweakChip>
            ))}
          </div>
        </div>

        {/* Border radius */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 10 }}>
            <span style={{ fontFamily: TW.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
              border radius · {TWEAK_PRESETS.radius.length} options
            </span>
            <span style={{ fontFamily: TW.serif, fontStyle: 'italic', fontSize: 12, color: 'var(--fg-tertiary)' }}>
              Overrides --radius-* tokens AND injects !important rules forcing common px values · should reach most surfaces.
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TWEAK_PRESETS.radius.map(opt => (
              <RadiusChip key={opt.id} opt={opt} active={radius === opt.id} onClick={() => setRadius(opt.id)} />
            ))}
          </div>
        </div>

        {/* Shadow */}
        <div>
          <div style={{ fontFamily: TW.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600, marginBottom: 10 }}>
            shadow weight · {TWEAK_PRESETS.shadow.length} options
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TWEAK_PRESETS.shadow.map(opt => (
              <ShadowChip key={opt.id} opt={opt} active={shadow === opt.id} onClick={() => setShadow(opt.id)} />
            ))}
          </div>
        </div>

        {/* Border color intensity */}
        <div>
          <div style={{ fontFamily: TW.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600, marginBottom: 10 }}>
            border intensity · {TWEAK_PRESETS.borders.length} options
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TWEAK_PRESETS.borders.map(opt => (
              <TweakChip key={opt.id} active={borders === opt.id} onClick={() => setBorders(opt.id)}>
                <span style={{
                  width: 26, height: 14,
                  background: 'transparent',
                  border: `1.4px solid ${opt.swatch}`,
                  borderRadius: 3,
                  display: 'inline-block',
                  flexShrink: 0,
                }} />
                <span style={{ fontFamily: TW.mono, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em' }}>{opt.id}</span>
                <span style={{ fontWeight: 600 }}>{opt.label}</span>
                <span style={{ fontFamily: TW.serif, fontStyle: 'italic', color: borders === opt.id ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)', fontSize: 11.5, fontWeight: 400 }}>{opt.sub}</span>
              </TweakChip>
            ))}
          </div>
        </div>

        {/* Headline weight */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 10 }}>
            <span style={{ fontFamily: TW.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
              headline weight · {TWEAK_PRESETS.headlineWeight.length} options
            </span>
            <span style={{ fontFamily: TW.serif, fontStyle: 'italic', fontSize: 12, color: 'var(--fg-tertiary)' }}>
              How the hero italic-serif renders · weight + style only on 22-44px size range.
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TWEAK_PRESETS.headlineWeight.map(opt => (
              <TweakChip key={opt.id} active={hw === opt.id} onClick={() => setHw(opt.id)}>
                {/* Live preview "Aa" rendered with the variant's treatment */}
                <span style={{
                  width: 24, height: 18,
                  display: 'inline-flex', alignItems: 'baseline', justifyContent: 'center',
                  fontFamily: 'var(--font-serif)',
                  fontStyle: opt.id === 'HW-D' ? 'normal' : 'italic',
                  fontWeight: opt.id === 'HW-B' ? 700 : opt.id === 'HW-C' ? 400 : opt.id === 'HW-D' ? 600 : opt.id === 'HW-E' ? 600 : 500,
                  fontSize: 18,
                  letterSpacing: opt.id === 'HW-E' ? '-0.035em' : 'normal',
                  color: hw === opt.id ? 'var(--accent-primary-press)' : 'var(--fg-primary)',
                  borderRight: '1px solid var(--border-subtle)',
                  paddingRight: 6,
                }}>Aa</span>
                <span style={{ fontFamily: TW.mono, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em' }}>{opt.id}</span>
                <span style={{ fontWeight: 600 }}>{opt.label}</span>
                <span style={{ fontFamily: TW.serif, fontStyle: 'italic', color: hw === opt.id ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)', fontSize: 11.5, fontWeight: 400 }}>{opt.sub}</span>
              </TweakChip>
            ))}
          </div>
        </div>

        {/* Eyebrow tracking */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 10 }}>
            <span style={{ fontFamily: TW.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
              eyebrow style · {TWEAK_PRESETS.eyebrow.length} options
            </span>
            <span style={{ fontFamily: TW.serif, fontStyle: 'italic', fontSize: 12, color: 'var(--fg-tertiary)' }}>
              How the small mono-uppercase metadata labels render · letter-spacing + treatment.
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TWEAK_PRESETS.eyebrow.map(opt => (
              <TweakChip key={opt.id} active={eb === opt.id} onClick={() => setEb(opt.id)}>
                {/* Live preview "WED · APR" or italic-serif equivalent */}
                <span style={{
                  display: 'inline-block',
                  paddingRight: 8, marginRight: 2,
                  borderRight: '1px solid var(--border-subtle)',
                  fontFamily: opt.id === 'ET-D' ? 'var(--font-serif)' : 'var(--font-mono)',
                  fontStyle: opt.id === 'ET-D' ? 'italic' : 'normal',
                  textTransform: opt.id === 'ET-D' ? 'none' : 'uppercase',
                  letterSpacing: opt.id === 'ET-B' ? '0.06em' : opt.id === 'ET-C' ? '0.28em' : opt.id === 'ET-D' ? '-0.005em' : '0.16em',
                  fontSize: opt.id === 'ET-D' ? 12 : 9.5,
                  fontWeight: opt.id === 'ET-D' ? 500 : 700,
                  color: eb === opt.id ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
                  whiteSpace: 'nowrap',
                }}>{opt.id === 'ET-D' ? 'Wed · Apr' : 'WED · APR'}</span>
                <span style={{ fontFamily: TW.mono, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em' }}>{opt.id}</span>
                <span style={{ fontWeight: 600 }}>{opt.label}</span>
                <span style={{ fontFamily: TW.serif, fontStyle: 'italic', color: eb === opt.id ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)', fontSize: 11.5, fontWeight: 400 }}>{opt.sub}</span>
              </TweakChip>
            ))}
          </div>
        </div>

        {/* Number style */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 10 }}>
            <span style={{ fontFamily: TW.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
              number style · {TWEAK_PRESETS.numbers.length} options
            </span>
            <span style={{ fontFamily: TW.serif, fontStyle: 'italic', fontSize: 12, color: 'var(--fg-tertiary)' }}>
              How tabular figures (`.hf-num`) render · affects KPI strips, view counts, scores.
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TWEAK_PRESETS.numbers.map(opt => (
              <TweakChip key={opt.id} active={ns === opt.id} onClick={() => setNs(opt.id)}>
                {/* Live preview "1.42M" rendered in the variant's treatment */}
                <span style={{
                  display: 'inline-block',
                  paddingRight: 8, marginRight: 2,
                  borderRight: '1px solid var(--border-subtle)',
                  fontFamily: opt.id === 'NS-C' ? 'var(--font-serif)' : opt.id === 'NS-D' ? 'var(--font-sans)' : 'var(--font-mono)',
                  fontVariantNumeric: opt.id === 'NS-B' ? 'normal' : opt.id === 'NS-C' ? 'oldstyle-nums' : 'tabular-nums',
                  fontStyle: 'normal',
                  fontSize: 12.5, fontWeight: opt.id === 'NS-D' ? 600 : 500,
                  color: ns === opt.id ? 'var(--accent-primary-press)' : 'var(--fg-primary)',
                  letterSpacing: 'normal',
                }}>1.42M</span>
                <span style={{ fontFamily: TW.mono, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em' }}>{opt.id}</span>
                <span style={{ fontWeight: 600 }}>{opt.label}</span>
                <span style={{ fontFamily: TW.serif, fontStyle: 'italic', color: ns === opt.id ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)', fontSize: 11.5, fontWeight: 400 }}>{opt.sub}</span>
              </TweakChip>
            ))}
          </div>
        </div>

        {/* Tag rendering — .hf-tag */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 10 }}>
            <span style={{ fontFamily: TW.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
              tag style · {TWEAK_PRESETS.tag.length} options
            </span>
            <span style={{ fontFamily: TW.serif, fontStyle: 'italic', fontSize: 12, color: 'var(--fg-tertiary)' }}>
              How chips render · .hf-tag (30+ uses) · filled / outlined / underlined / mono / dot-prefix.
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TWEAK_PRESETS.tag.map(opt => {
              const active = tg === opt.id;
              const previewStyle = (() => {
                const base = { display: 'inline-flex', alignItems: 'center', gap: 4, height: 20, padding: '0 8px', fontSize: 10.5, fontWeight: 500, color: 'var(--accent-primary-press)' };
                if (opt.id === 'TG-A') return { ...base, background: 'var(--surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 4 };
                if (opt.id === 'TG-B') return { ...base, background: 'transparent', border: '1px solid var(--accent-primary)', borderRadius: 4 };
                if (opt.id === 'TG-C') return { ...base, background: 'transparent', border: 'none', borderBottom: '1px solid var(--accent-primary)', borderRadius: 0, padding: '0 2px' };
                if (opt.id === 'TG-D') return { ...base, background: 'transparent', border: 'none', fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 700, padding: '0 2px' };
                if (opt.id === 'TG-E') return { ...base, background: 'transparent', border: 'none', padding: '0 2px' };
                return base;
              })();
              return (
                <TweakChip key={opt.id} active={active} onClick={() => setTg(opt.id)}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', paddingRight: 8, marginRight: 2, borderRight: '1px solid var(--border-subtle)' }}>
                    <span style={previewStyle}>
                      {opt.id === 'TG-E' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)', marginRight: 4, display: 'inline-block' }} />}
                      {opt.id === 'TG-D' ? 'LIVE' : 'Live'}
                    </span>
                  </span>
                  <span style={{ fontFamily: TW.mono, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em' }}>{opt.id}</span>
                  <span style={{ fontWeight: 600 }}>{opt.label}</span>
                  <span style={{ fontFamily: TW.serif, fontStyle: 'italic', color: active ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)', fontSize: 11.5, fontWeight: 400 }}>{opt.sub}</span>
                </TweakChip>
              );
            })}
          </div>
        </div>

        {/* Button rendering — .hf-btn-primary */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 10 }}>
            <span style={{ fontFamily: TW.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
              button style · {TWEAK_PRESETS.button.length} options
            </span>
            <span style={{ fontFamily: TW.serif, fontStyle: 'italic', fontSize: 12, color: 'var(--fg-tertiary)' }}>
              How primary CTAs render · .hf-btn-primary (9 uses) · filled / outlined / italic-link / bracketed / minimal.
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TWEAK_PRESETS.button.map(opt => {
              const active = bt === opt.id;
              const previewStyle = (() => {
                const base = { display: 'inline-flex', alignItems: 'center', height: 22, padding: '0 10px', fontSize: 11, fontWeight: 600, borderRadius: 6 };
                if (opt.id === 'BT-A') return { ...base, background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', border: '1px solid transparent' };
                if (opt.id === 'BT-B') return { ...base, background: 'transparent', color: 'var(--accent-primary)', border: '1px solid var(--accent-primary)' };
                if (opt.id === 'BT-C') return { ...base, background: 'transparent', border: 'none', color: 'var(--accent-primary)', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: 3, padding: '0 2px' };
                if (opt.id === 'BT-D') return { ...base, background: 'transparent', border: 'none', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, padding: '0 2px' };
                if (opt.id === 'BT-E') return { ...base, background: 'transparent', border: 'none', color: 'var(--accent-primary)', padding: '0 2px' };
                return base;
              })();
              return (
                <TweakChip key={opt.id} active={active} onClick={() => setBt(opt.id)}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', paddingRight: 8, marginRight: 2, borderRight: '1px solid var(--border-subtle)' }}>
                    <span style={previewStyle}>
                      {opt.id === 'BT-D' ? '[ SAVE ]' : 'Save'}
                    </span>
                  </span>
                  <span style={{ fontFamily: TW.mono, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em' }}>{opt.id}</span>
                  <span style={{ fontWeight: 600 }}>{opt.label}</span>
                  <span style={{ fontFamily: TW.serif, fontStyle: 'italic', color: active ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)', fontSize: 11.5, fontWeight: 400 }}>{opt.sub}</span>
                </TweakChip>
              );
            })}
          </div>
        </div>

        {/* Card rendering — .hf-card */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 10 }}>
            <span style={{ fontFamily: TW.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
              card style · {TWEAK_PRESETS.card.length} options
            </span>
            <span style={{ fontFamily: TW.serif, fontStyle: 'italic', fontSize: 12, color: 'var(--fg-tertiary)' }}>
              How surface containers render · .hf-card (9 uses) · filled / rule-only / paper / floating / lined.
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TWEAK_PRESETS.card.map(opt => {
              const active = cd === opt.id;
              const previewStyle = (() => {
                const base = { display: 'inline-block', width: 30, height: 18 };
                if (opt.id === 'CD-A') return { ...base, background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 4 };
                if (opt.id === 'CD-B') return { ...base, background: 'transparent', border: 'none', borderTop: '1px solid var(--fg-primary)', borderRadius: 0 };
                if (opt.id === 'CD-C') return { ...base, background: 'var(--surface-2)', border: 'none', borderRadius: 4 };
                if (opt.id === 'CD-D') return { ...base, background: 'var(--surface-1)', border: 'none', borderRadius: 4, boxShadow: '0 4px 8px rgba(26,24,21,0.10), 0 1px 2px rgba(26,24,21,0.06)' };
                if (opt.id === 'CD-E') return { ...base, background: 'transparent', border: '1px solid var(--border-default)', borderRadius: 4 };
                return base;
              })();
              return (
                <TweakChip key={opt.id} active={active} onClick={() => setCd(opt.id)}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', paddingRight: 8, marginRight: 2, borderRight: '1px solid var(--border-subtle)' }}>
                    <span style={previewStyle} />
                  </span>
                  <span style={{ fontFamily: TW.mono, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em' }}>{opt.id}</span>
                  <span style={{ fontWeight: 600 }}>{opt.label}</span>
                  <span style={{ fontFamily: TW.serif, fontStyle: 'italic', color: active ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)', fontSize: 11.5, fontWeight: 400 }}>{opt.sub}</span>
                </TweakChip>
              );
            })}
          </div>
        </div>

        {/* Drop-cap — .hf-dropcap::first-letter */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 10 }}>
            <span style={{ fontFamily: TW.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
              drop-cap · {TWEAK_PRESETS.dropcap.length} options
            </span>
            <span style={{ fontFamily: TW.serif, fontStyle: 'italic', fontSize: 12, color: 'var(--fg-tertiary)' }}>
              First-letter treatment for editorial paragraphs · .hf-dropcap (3 uses).
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TWEAK_PRESETS.dropcap.map(opt => {
              const active = dc === opt.id;
              const previewStyle = (() => {
                const base = { display: 'inline-block', fontSize: 22, lineHeight: 0.9, fontWeight: 600, color: 'var(--accent-primary)', minWidth: 22, textAlign: 'center' };
                if (opt.id === 'DC-A') return { ...base, fontFamily: 'var(--font-serif)' };
                if (opt.id === 'DC-B') return { ...base, fontFamily: 'var(--font-sans)', fontWeight: 800, color: 'var(--fg-primary)' };
                if (opt.id === 'DC-C') return { ...base, fontFamily: 'var(--font-serif)', color: 'transparent', WebkitTextStroke: '1px var(--accent-primary)' };
                if (opt.id === 'DC-D') return { ...base, fontFamily: 'var(--font-sans)', fontWeight: 800, color: 'var(--fg-on-ink)', background: 'var(--surface-ink)', padding: '1px 4px', lineHeight: 1, fontSize: 18 };
                return base;
              })();
              return (
                <TweakChip key={opt.id} active={active} onClick={() => setDc(opt.id)}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', paddingRight: 8, marginRight: 2, borderRight: '1px solid var(--border-subtle)' }}>
                    <span style={previewStyle}>A</span>
                  </span>
                  <span style={{ fontFamily: TW.mono, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em' }}>{opt.id}</span>
                  <span style={{ fontWeight: 600 }}>{opt.label}</span>
                  <span style={{ fontFamily: TW.serif, fontStyle: 'italic', color: active ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)', fontSize: 11.5, fontWeight: 400 }}>{opt.sub}</span>
                </TweakChip>
              );
            })}
          </div>
        </div>

        {/* Active state — .hf-subtab.is-active / .hf-tab.is-active / .hf-rail-item.is-active */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 10 }}>
            <span style={{ fontFamily: TW.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
              active state · {TWEAK_PRESETS.activeState.length} options
            </span>
            <span style={{ fontFamily: TW.serif, fontStyle: 'italic', fontSize: 12, color: 'var(--fg-tertiary)' }}>
              How tabs / subtabs / rail items announce the current section.
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TWEAK_PRESETS.activeState.map(opt => {
              const active = as_ === opt.id;
              const previewLabel = (() => {
                if (opt.id === 'AS-A') return <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, color: 'var(--accent-primary-press)', borderBottom: '2px solid var(--accent-primary)', paddingBottom: 1 }}>Library</span>;
                if (opt.id === 'AS-B') return <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, color: 'var(--accent-primary-press)', borderLeft: '2px solid var(--accent-primary)', paddingLeft: 6 }}>Library</span>;
                if (opt.id === 'AS-C') return <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, color: 'var(--accent-primary-press)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', fontWeight: 700 }}>[</span>
                  Library
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', fontWeight: 700 }}>]</span>
                </span>;
                if (opt.id === 'AS-D') return <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 12, fontWeight: 500, color: 'var(--accent-primary)' }}>Library</span>;
                return null;
              })();
              return (
                <TweakChip key={opt.id} active={active} onClick={() => setAs(opt.id)}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', paddingRight: 8, marginRight: 2, borderRight: '1px solid var(--border-subtle)', minHeight: 18 }}>
                    {previewLabel}
                  </span>
                  <span style={{ fontFamily: TW.mono, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em' }}>{opt.id}</span>
                  <span style={{ fontWeight: 600 }}>{opt.label}</span>
                  <span style={{ fontFamily: TW.serif, fontStyle: 'italic', color: active ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)', fontSize: 11.5, fontWeight: 400 }}>{opt.sub}</span>
                </TweakChip>
              );
            })}
          </div>
        </div>

        {/* Status dot — .hf-dot */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 10 }}>
            <span style={{ fontFamily: TW.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
              status dot · {TWEAK_PRESETS.statusDot.length} options
            </span>
            <span style={{ fontFamily: TW.serif, fontStyle: 'italic', fontSize: 12, color: 'var(--fg-tertiary)' }}>
              Activity / state indicators · .hf-dot (7 uses) · solid / outlined / square / halo.
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TWEAK_PRESETS.statusDot.map(opt => {
              const active = sd === opt.id;
              const previewStyle = (() => {
                const base = { display: 'inline-block', width: 8, height: 8, background: 'var(--accent-primary)', borderRadius: '50%' };
                if (opt.id === 'SD-A') return base;
                if (opt.id === 'SD-B') return { ...base, background: 'transparent', border: '1px solid var(--accent-primary)' };
                if (opt.id === 'SD-C') return { ...base, borderRadius: 0 };
                if (opt.id === 'SD-D') return { ...base, boxShadow: '0 0 0 3px var(--accent-soft)' };
                return base;
              })();
              return (
                <TweakChip key={opt.id} active={active} onClick={() => setSd(opt.id)}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, paddingRight: 8, marginRight: 2, borderRight: '1px solid var(--border-subtle)' }}>
                    <span style={previewStyle} />
                  </span>
                  <span style={{ fontFamily: TW.mono, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em' }}>{opt.id}</span>
                  <span style={{ fontWeight: 600 }}>{opt.label}</span>
                  <span style={{ fontFamily: TW.serif, fontStyle: 'italic', color: active ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)', fontSize: 11.5, fontWeight: 400 }}>{opt.sub}</span>
                </TweakChip>
              );
            })}
          </div>
        </div>

        {/* Heading scale — overrides --text-* tokens */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 10 }}>
            <span style={{ fontFamily: TW.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
              heading scale · {TWEAK_PRESETS.headingScale.length} options
            </span>
            <span style={{ fontFamily: TW.serif, fontStyle: 'italic', fontSize: 12, color: 'var(--fg-tertiary)' }}>
              Typographic ratio between sizes · overrides --text-md/lg/xl/2xl/3xl tokens.
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TWEAK_PRESETS.headingScale.map(opt => {
              const active = hs === opt.id;
              const sizes = (() => {
                if (opt.id === 'HS-A') return [10, 12, 14];
                if (opt.id === 'HS-B') return [10, 13, 16];
                if (opt.id === 'HS-C') return [9, 13, 18];
                if (opt.id === 'HS-D') return [8, 14, 22];
                return [10, 12, 14];
              })();
              return (
                <TweakChip key={opt.id} active={active} onClick={() => setHs(opt.id)}>
                  <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 3, paddingRight: 8, marginRight: 2, borderRight: '1px solid var(--border-subtle)' }}>
                    {sizes.map((s, i) => (
                      <span key={i} style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: s, fontWeight: 600, color: 'var(--fg-primary)', lineHeight: 1 }}>A</span>
                    ))}
                  </span>
                  <span style={{ fontFamily: TW.mono, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em' }}>{opt.id}</span>
                  <span style={{ fontWeight: 600 }}>{opt.label}</span>
                  <span style={{ fontFamily: TW.mono, fontSize: 10, letterSpacing: '0.04em', color: active ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)', fontWeight: 600 }}>·{opt.preview}</span>
                  <span style={{ fontFamily: TW.serif, fontStyle: 'italic', color: active ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)', fontSize: 11.5, fontWeight: 400 }}>{opt.sub}</span>
                </TweakChip>
              );
            })}
          </div>
        </div>

        {/* Body line-height — controls .hf line-height */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 10 }}>
            <span style={{ fontFamily: TW.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600 }}>
              line height · {TWEAK_PRESETS.lineHeight.length} options
            </span>
            <span style={{ fontFamily: TW.serif, fontStyle: 'italic', fontSize: 12, color: 'var(--fg-tertiary)' }}>
              Body line-height on .hf · changes prose air pressure across every block.
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TWEAK_PRESETS.lineHeight.map(opt => {
              const active = lh === opt.id;
              return (
                <TweakChip key={opt.id} active={active} onClick={() => setLh(opt.id)}>
                  <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 1, paddingRight: 8, marginRight: 2, borderRight: '1px solid var(--border-subtle)', height: 22, justifyContent: 'center' }}>
                    {[0,1,2].map(i => (
                      <span key={i} style={{ display: 'block', width: 22, height: 1, background: 'var(--fg-secondary)', marginBottom: opt.preview === 1.30 ? 1 : opt.preview === 1.45 ? 2 : opt.preview === 1.65 ? 3 : 5 }} />
                    ))}
                  </span>
                  <span style={{ fontFamily: TW.mono, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em' }}>{opt.id}</span>
                  <span style={{ fontWeight: 600 }}>{opt.label}</span>
                  <span style={{ fontFamily: TW.mono, fontSize: 10, letterSpacing: '0.04em', color: active ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)', fontWeight: 600 }}>·{opt.preview}</span>
                  <span style={{ fontFamily: TW.serif, fontStyle: 'italic', color: active ? 'var(--accent-primary-press)' : 'var(--fg-tertiary)', fontSize: 11.5, fontWeight: 400 }}>{opt.sub}</span>
                </TweakChip>
              );
            })}
          </div>
        </div>
      </div>

      {/* Status line — what's currently applied · all 19 axes */}
      <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'baseline', gap: 12, fontFamily: TW.mono, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', flexWrap: 'wrap' }}>
        <span>active ·</span>
        <span style={{ color: 'var(--accent-primary-press)', fontWeight: 700 }}>{surface}</span>
        <span>+</span>
        <span style={{ color: 'var(--accent-primary-press)', fontWeight: 700 }}>{typo}</span>
        <span>+</span>
        <span style={{ color: 'var(--accent-primary-press)', fontWeight: 700 }}>{palette}</span>
        <span>+</span>
        <span style={{ color: 'var(--accent-primary-press)', fontWeight: 700 }}>{density}</span>
        <span>+</span>
        <span style={{ color: 'var(--accent-primary-press)', fontWeight: 700 }}>{warmth}</span>
        <span>+</span>
        <span style={{ color: 'var(--accent-primary-press)', fontWeight: 700 }}>{radius}</span>
        <span>+</span>
        <span style={{ color: 'var(--accent-primary-press)', fontWeight: 700 }}>{shadow}</span>
        <span>+</span>
        <span style={{ color: 'var(--accent-primary-press)', fontWeight: 700 }}>{borders}</span>
        <span>+</span>
        <span style={{ color: 'var(--accent-primary-press)', fontWeight: 700 }}>{hw}</span>
        <span>+</span>
        <span style={{ color: 'var(--accent-primary-press)', fontWeight: 700 }}>{eb}</span>
        <span>+</span>
        <span style={{ color: 'var(--accent-primary-press)', fontWeight: 700 }}>{ns}</span>
        <span>+</span>
        <span style={{ color: 'var(--accent-primary-press)', fontWeight: 700 }}>{tg}</span>
        <span>+</span>
        <span style={{ color: 'var(--accent-primary-press)', fontWeight: 700 }}>{bt}</span>
        <span>+</span>
        <span style={{ color: 'var(--accent-primary-press)', fontWeight: 700 }}>{cd}</span>
        <span>+</span>
        <span style={{ color: 'var(--accent-primary-press)', fontWeight: 700 }}>{dc}</span>
        <span>+</span>
        <span style={{ color: 'var(--accent-primary-press)', fontWeight: 700 }}>{as_}</span>
        <span>+</span>
        <span style={{ color: 'var(--accent-primary-press)', fontWeight: 700 }}>{sd}</span>
        <span>+</span>
        <span style={{ color: 'var(--accent-primary-press)', fontWeight: 700 }}>{hs}</span>
        <span>+</span>
        <span style={{ color: 'var(--accent-primary-press)', fontWeight: 700 }}>{lh}</span>
        <span style={{ color: 'var(--border-default)' }}>·</span>
        <span style={{ fontFamily: TW.serif, fontStyle: 'italic', textTransform: 'none', letterSpacing: 0, fontSize: 12, color: 'var(--fg-secondary)' }}>
          T-E + P-H + W-D + SH-B + HW-E + ET-B committed to hifi.css. Eight new axes (TG · BT · CD · DC · AS · SD · HS · LH) are exploration-only.
        </span>
      </div>
    </div>
  );
}

// Generate inline <style> rules to force-override hardcoded radius/shadow on
// surfaces that don't read --radius-* / --shadow-* tokens. Keyed by a unique
// scopeId so A and B sides don't collide in compare mode.
function tokensToOverrideCss(tokens, scopeId) {
  const rs = tokens['--radius-md'];
  const sh = tokens['--shadow-md'];
  const rules = [];
  // Aggressively override common hardcoded radii
  if (rs && rs !== '8px') {
    const v = rs;
    rules.push(`#${scopeId} *[style*="border-radius: 6px"], #${scopeId} *[style*="border-radius: 7px"], #${scopeId} *[style*="border-radius: 8px"], #${scopeId} *[style*="border-radius: 10px"], #${scopeId} *[style*="border-radius: 12px"], #${scopeId} *[style*="border-radius:6px"], #${scopeId} *[style*="border-radius:8px"], #${scopeId} *[style*="border-radius:10px"], #${scopeId} *[style*="border-radius:12px"] { border-radius: ${v} !important; }`);
  }
  // Aggressively override common hardcoded shadows
  if (sh === 'none') {
    rules.push(`#${scopeId} * { box-shadow: none !important; }`);
  } else if (sh && sh.startsWith('0 ')) {
    rules.push(`#${scopeId} *[style*="box-shadow"] { box-shadow: ${sh} !important; }`);
  }
  return rules.join('\n');
}

// ─── Render frame · single side ───────────────────────────
// Surfaces are designed at 1440 × 900. When the frame is narrower (compare
// mode at 720px wide), we render the surface at 1440 internally and visually
// scale to fit — so layout never breaks. Density scale composes on top.
function RenderFrame({ width, tokens, densityScale, Surface, surfaceCfg, sideLabel, scopeId = 'tweak-render', extraCss = '' }) {
  const fitScale = width / 1440;
  const effectiveScale = densityScale * fitScale;
  const frameHeight = 900 * fitScale;
  const innerWidth = 1440 / densityScale;
  const innerHeight = 900 / densityScale;
  const tokenOverrides = tokensToOverrideCss(tokens, scopeId);
  const allOverrides = [tokenOverrides, extraCss].filter(Boolean).join('\n');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {sideLabel && (
        <div style={{ fontFamily: TW.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-primary-press)', fontWeight: 700 }}>
          {sideLabel}
        </div>
      )}
      {/* Inject all !important CSS overrides — radius/shadow tokens + headline-weight / eyebrow / numbers axes */}
      {allOverrides && <style dangerouslySetInnerHTML={{ __html: allOverrides }} />}
      <div id={scopeId} style={{
        width, height: frameHeight,
        background: 'var(--bg-base)',
        border: '1px solid var(--border-default)',
        borderRadius: 12, overflow: 'hidden',
        boxShadow: '0 32px 80px -32px rgba(26,24,21,0.22), 0 8px 24px -16px rgba(26,24,21,0.10)',
      }}>
        <div style={{
          ...tokens,
          width: innerWidth, height: innerHeight,
          transform: `scale(${effectiveScale})`,
          transformOrigin: 'top left',
          overflow: 'auto',
        }}>
          {Surface ? <Surface /> : (
            <div style={{ padding: 32, fontFamily: TW.serif, fontStyle: 'italic', fontSize: 18, color: 'var(--fg-tertiary)' }}>
              Surface "{surfaceCfg?.component || '(none)'}" is not loaded — check that tweaks.html loads its script.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Compare-side mini select ─────────────────────────────
// Used in the SIDE-B panel — compact dropdown-style picker per axis
function CompareSelect({ label, value, setValue, options }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <span style={{ fontFamily: TW.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>
        {label}
      </span>
      <select
        value={value}
        onChange={e => setValue(e.target.value)}
        style={{
          appearance: 'none', WebkitAppearance: 'none',
          padding: '6px 10px',
          background: 'var(--surface-1)',
          border: '1px solid var(--border-default)',
          borderRadius: 6,
          fontFamily: TW.sans, fontSize: 11.5, color: 'var(--fg-primary)',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        {options.map(opt => (
          <option key={opt.id} value={opt.id}>{opt.id} · {opt.label}</option>
        ))}
      </select>
    </div>
  );
}

// ─── Compact axis row · for the sidebar ───────────────────
// One row per axis · 70px label column + chip strip. Each chip is small (just
// the ID suffix like "A", "B", or in palette case a swatch dot). Title attr
// surfaces the full label · sub on hover.
// Each axis row gets a header line — axis name (mono caps) + the ACTIVE
// variant's full label (italic-serif). Chips below show ID + short label so
// every option is readable at a glance. Multi-line wrap is fine — sidebar
// scrolls.
function CompactAxisRow({ label, value, onChange, options, kind, even }) {
  const activeOpt = options.find(o => o.id === value);
  // Strip the "· LOCKED" marker from labels for display brevity
  const cleanLabel = (s) => (s || '').replace(/\s*·\s*LOCKED\s*$/i, '');
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      gap: 5,
      padding: '8px 0 9px',
      borderBottom: '1px solid var(--border-subtle)',
      background: even ? 'transparent' : 'transparent',
    }}>
      {/* Header line — axis name + ACTIVE variant full label */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{
          flexShrink: 0,
          fontFamily: TW.mono,
          fontSize: 9.5, fontWeight: 700,
          letterSpacing: '0.10em', textTransform: 'uppercase',
          color: 'var(--fg-secondary)',
          minWidth: 56,
        }}>{label}</span>
        <span style={{
          flex: 1,
          fontFamily: TW.serif, fontStyle: 'italic',
          fontSize: 12, color: 'var(--accent-primary-press)',
          fontWeight: 500,
          letterSpacing: '-0.005em',
          lineHeight: 1.2,
        }}>
          <span style={{ fontFamily: TW.mono, fontStyle: 'normal', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--accent-primary)', marginRight: 6 }}>{value}</span>
          {cleanLabel(activeOpt?.label) || '—'}
        </span>
      </div>
      {/* Chip row — ID + short label, multi-line wrap */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {options.map(opt => {
          const active = value === opt.id;
          const idSuffix = opt.id.split('-').slice(-1)[0]; // "TG-A" → "A"
          // Compute a tiny preview adornment per axis kind
          let preview = null;
          if (kind === 'palette' && opt.swatches) {
            preview = (
              <span style={{ display: 'inline-flex', gap: 1, marginRight: 4 }}>
                {opt.swatches.slice(0, 3).map((hex, i) => (
                  <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: hex, border: '0.5px solid rgba(26,24,21,0.10)' }} />
                ))}
              </span>
            );
          } else if (kind === 'warmth' && opt.swatch) {
            preview = (
              <span style={{ width: 9, height: 9, borderRadius: 2, background: opt.swatch, border: '0.5px solid rgba(26,24,21,0.18)', marginRight: 4 }} />
            );
          } else if (kind === 'border' && opt.swatch) {
            preview = (
              <span style={{ width: 11, height: 7, background: 'transparent', border: `1px solid ${opt.swatch}`, marginRight: 4 }} />
            );
          } else if (kind === 'typo' && opt.sampleTokens?.fontFamily) {
            preview = (
              <span style={{
                fontFamily: opt.sampleTokens.fontFamily,
                fontStyle: 'italic',
                fontSize: 13, fontWeight: 500,
                lineHeight: 1, marginRight: 4,
                color: active ? 'var(--fg-on-accent)' : 'var(--fg-primary)',
              }}>Aa</span>
            );
          }
          const isLocked = /LOCKED/.test(opt.label || '');
          // Short label — first segment of opt.label, drop "· LOCKED" suffix
          const shortLabel = cleanLabel(opt.label) || '—';
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              title={`${opt.id} · ${opt.label || ''} — ${opt.sub || ''}`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '4px 8px', minHeight: 24,
                borderRadius: 5,
                background: active ? 'var(--accent-primary)' : 'var(--surface-2)',
                color: active ? 'var(--fg-on-accent)' : 'var(--fg-secondary)',
                border: active ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                fontFamily: TW.sans,
                cursor: 'pointer',
                lineHeight: 1.1,
                transition: 'background 100ms ease, color 100ms ease, border-color 100ms ease',
              }}
            >
              {preview}
              <span style={{
                fontFamily: TW.mono, fontSize: 9.5, fontWeight: 700,
                letterSpacing: '0.04em',
                opacity: active ? 0.92 : 0.75,
              }}>{idSuffix}</span>
              <span style={{
                fontFamily: TW.sans, fontSize: 11, fontWeight: active ? 600 : 500,
                letterSpacing: '-0.005em',
                whiteSpace: 'nowrap',
              }}>{shortLabel}</span>
              {isLocked && (
                <span style={{
                  marginLeft: 2,
                  fontSize: 7.5, fontWeight: 700,
                  color: active ? 'var(--fg-on-accent)' : 'var(--accent-primary)',
                  letterSpacing: '0.08em',
                  fontFamily: TW.mono,
                  opacity: 0.85,
                }}>LCK</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// localStorage-backed useState. Reads on mount (falls back to default), saves
// on every change. Survives hard refresh so axis picks stick.
function useStored(key, fallback) {
  const STORAGE_KEY = 'tweaks.v11.' + key;
  const [v, setV] = React.useState(() => {
    try {
      const stored = window.localStorage?.getItem(STORAGE_KEY);
      return stored != null ? stored : fallback;
    } catch { return fallback; }
  });
  React.useEffect(() => {
    try { window.localStorage?.setItem(STORAGE_KEY, v); } catch {}
  }, [STORAGE_KEY, v]);
  return [v, setV];
}

// ─── Cohesion R9 / Wave 3 · Lock-In button ────────────────
// Single master button that snapshots the current tweak selections AND the
// merged token CSS variables, then hands the bundle to the channel writer.
// The channel persists to localStorage['cb-locked-tokens'] and re-injects a
// global :root style so master picks up the override on next reload (and any
// already-mounted master in another tab on its next bootApply call).
//
// Lookup table: tweaks gallery's short axis IDs (e.g. 'P-D') map to canonical
// channel keys. Channel only knows a handful today — extend as more axes are
// wired into hifi-cohesion-r9-tweaks-channel.jsx's mapTokensToCssRules().
const COHESION_R9_AXIS_TO_CHANNEL = {
  // palette ID → accent family
  palette: {
    'P-A': null,        // ink-mono, no accent override
    'P-B': 'rust',
    'P-C': 'cocoa',
    'P-D': 'rust',
    'P-E': 'moss',
    'P-F': 'clay',
    'P-G': null,        // mineral
    'P-H': 'cocoa',     // single-hue depth (locked default)
  },
  // typography ID → headline font key
  typo: {
    'T-A': 'newsreader',
    'T-B': 'newsreader',
    'T-C': 'charter',
    'T-D': 'charter',
    'T-E': 'literata',  // locked default
    'T-F': 'literata',
    'T-G': 'literata',
  },
  // density ID → density key
  density: {
    'D-A': 'comfortable',
    'D-B': 'tight',
    'D-C': 'tight',
    'D-D': 'comfortable',
    'D-E': 'spacious',
    'D-F': 'editorial',
  },
  // warmth ID → warmth key
  warmth: {
    'W-A': 'cool-paper',
    'W-B': 'cool-paper',
    'W-C': 'ivory',
    'W-D': 'ivory',     // locked default
    'W-E': 'parchment',
    'W-F': 'parchment',
    'W-G': 'parchment',
  },
  // radius ID → radius key
  radius: {
    'R-A': null,
    'R-B': 'sharp',
    'R-C': 'soft',
  },
};

function LockInMasterButton({ tokensA, axisIds }) {
  const [status, setStatus] = React.useState(null);

  function handleLock() {
    // Step 1 · build canonical axis snapshot from current selections.
    const snapshot = {};
    const accent = COHESION_R9_AXIS_TO_CHANNEL.palette[axisIds.palette];
    if (accent) snapshot.accent = accent;
    const fontHeadline = COHESION_R9_AXIS_TO_CHANNEL.typo[axisIds.typo];
    if (fontHeadline) snapshot.fontHeadline = fontHeadline;
    const density = COHESION_R9_AXIS_TO_CHANNEL.density[axisIds.density];
    if (density) snapshot.density = density;
    const warmth = COHESION_R9_AXIS_TO_CHANNEL.warmth[axisIds.warmth];
    if (warmth) snapshot.warmth = warmth;
    const radius = COHESION_R9_AXIS_TO_CHANNEL.radius[axisIds.radius];
    if (radius) snapshot.radius = radius;

    // Step 2 · merge in raw CSS-variable tokens from tokenStack(). These pass
    // through the channel via the `--var` pass-through branch, so anything
    // tokenStack() emits (palette colour values, font stacks, radius numbers)
    // lands in :root verbatim — even axes the channel doesn't have a named
    // mapping for yet.
    if (tokensA && typeof tokensA === 'object') {
      for (const k in tokensA) {
        if (k.indexOf('--') === 0) snapshot[k] = tokensA[k];
      }
    }

    // Step 3 · also stamp the raw axis IDs (`tweaks.v11.*`-style keys) so a
    // future wave can re-derive the snapshot or render an axis read-out.
    snapshot._axisIds = { ...axisIds };
    snapshot._lockedAt = new Date().toISOString();

    // Step 4 · hand off to the channel (writes localStorage + applies live).
    const channel = window.cohesionR9TokensChannel;
    if (!channel || typeof channel.write !== 'function') {
      setStatus({ kind: 'err', text: 'Channel not loaded' });
      return;
    }
    channel.write(snapshot);

    const axesLocked = Object.keys(snapshot).filter(k => k.charAt(0) !== '_').length;
    setStatus({
      kind: 'ok',
      text: `Locked ${axesLocked} axes · applies on master reload`,
    });
    // Auto-dismiss the inline confirmation after a beat.
    window.setTimeout(() => setStatus(null), 4200);
  }

  return (
    <div style={{ marginBottom: 14 }}>
      <button
        onClick={handleLock}
        title="Snapshot current tweaks and write to localStorage['cb-locked-tokens']. Master reads on boot."
        style={{
          width: '100%',
          background: 'var(--accent-primary)',
          color: 'var(--fg-on-accent)',
          border: '1px solid var(--accent-primary)',
          padding: '6px 10px',
          borderRadius: 4,
          cursor: 'pointer',
          fontFamily: TW.mono, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700,
        }}>
        LOCK IN · ALL TWEAKS → MASTER
      </button>
      {status ? (
        <div style={{
          marginTop: 6,
          fontFamily: TW.mono, fontSize: 8.5, letterSpacing: '0.08em', textTransform: 'uppercase',
          color: status.kind === 'ok' ? 'var(--accent-primary-press)' : 'var(--tone-danger, #7a3a24)',
        }}>
          {status.text}
        </div>
      ) : null}
    </div>
  );
}

// ─── Gallery shell ────────────────────────────────────────
function HF_TweaksGallery() {
  // Side A — defaults reflect what's locked in hifi.css :root (R8 v3):
  // T-E + P-H + W-D + SH-B + HW-E + ET-B (palette flipped to Single Hue Depth,
  // warmth flipped to Ivory, shadow flipped to None, headline locked Display,
  // eyebrow locked Tight). Token gallery (S-E) is default — every primitive
  // visible at full scale so axis flips produce maximum visible delta.
  // All useStored — picks survive hard refresh via localStorage.
  const [surface, setSurface] = useStored('surface', 'S-NAV');
  const [typo, setTypo]       = useStored('typo', 'T-E');
  const [palette, setPalette] = useStored('palette', 'P-H');
  const [density, setDensity] = useStored('density', 'D-A');
  const [warmth, setWarmth]   = useStored('warmth', 'W-D');
  const [radius, setRadius]   = useStored('radius', 'R-A');
  const [shadow, setShadow]   = useStored('shadow', 'SH-B');
  const [borders, setBorders] = useStored('borders', 'B-A');
  const [hw, setHw]           = useStored('hw', 'HW-E');
  const [eb, setEb]           = useStored('eb', 'ET-B');
  const [ns, setNs]           = useStored('ns', 'NS-A');
  // R8 v4 NEW axes — defaults match current baseline (Standard variants).
  const [tg, setTg]   = useStored('tg', 'TG-A');
  const [bt, setBt]   = useStored('bt', 'BT-A');
  const [cd, setCd]   = useStored('cd', 'CD-A');
  const [dc, setDc]   = useStored('dc', 'DC-A');
  const [as_, setAs]  = useStored('as', 'AS-A');
  const [navFit, setNavFit] = useStored('navFit', 'NF-B');
  const [navMarker, setNavMarker] = useStored('navMarker', 'NM-B');
  const [navType, setNavType] = useStored('navType', 'NT-B');
  const [navPreview, setNavPreview] = useStored('navPreview', 'NP-B');
  const [sd, setSd]   = useStored('sd', 'SD-A');
  const [hs, setHs]   = useStored('hs', 'HS-A');
  const [lh, setLh]   = useStored('lh', 'LH-A');

  // Compare mode — Side B selections (only used when compareOn)
  const [compareOn, setCompareOn] = React.useState(false);
  const [typoB, setTypoB]     = useStored('typoB', 'T-A');
  const [paletteB, setPaletteB] = useStored('paletteB', 'P-A');
  const [densityB, setDensityB] = useStored('densityB', 'D-A');
  const [warmthB, setWarmthB] = useStored('warmthB', 'W-A');
  const [radiusB, setRadiusB] = useStored('radiusB', 'R-A');
  const [shadowB, setShadowB] = useStored('shadowB', 'SH-A');
  const [bordersB, setBordersB] = useStored('bordersB', 'B-A');
  const [hwB, setHwB] = useStored('hwB', 'HW-A');
  const [ebB, setEbB] = useStored('ebB', 'ET-A');
  const [nsB, setNsB] = useStored('nsB', 'NS-A');
  const [tgB, setTgB] = useStored('tgB', 'TG-A');
  const [btB, setBtB] = useStored('btB', 'BT-A');
  const [cdB, setCdB] = useStored('cdB', 'CD-A');
  const [dcB, setDcB] = useStored('dcB', 'DC-A');
  const [asB, setAsB] = useStored('asB', 'AS-A');
  const [navFitB, setNavFitB] = useStored('navFitB', 'NF-A');
  const [navMarkerB, setNavMarkerB] = useStored('navMarkerB', 'NM-A');
  const [navTypeB, setNavTypeB] = useStored('navTypeB', 'NT-A');
  const [navPreviewB, setNavPreviewB] = useStored('navPreviewB', 'NP-A');
  const [sdB, setSdB] = useStored('sdB', 'SD-A');
  const [hsB, setHsB] = useStored('hsB', 'HS-A');
  const [lhB, setLhB] = useStored('lhB', 'LH-A');

  function tokenStack(_typo, _palette, _warmth, _radius, _shadow, _borders, _hs) {
    return {
      ...(TWEAK_PRESETS.typo.find(o => o.id === _typo)?.tokens || {}),
      ...(TWEAK_PRESETS.palette.find(o => o.id === _palette)?.tokens || {}),
      ...(TWEAK_PRESETS.warmth.find(o => o.id === _warmth)?.tokens || {}),
      ...(TWEAK_PRESETS.radius.find(o => o.id === _radius)?.tokens || {}),
      ...(TWEAK_PRESETS.shadow.find(o => o.id === _shadow)?.tokens || {}),
      ...(TWEAK_PRESETS.borders.find(o => o.id === _borders)?.tokens || {}),
      ...(TWEAK_PRESETS.headingScale.find(o => o.id === _hs)?.tokens || {}),
    };
  }
  const tokensA = tokenStack(typo, palette, warmth, radius, shadow, borders, hs);
  const tokensB = tokenStack(typoB, paletteB, warmthB, radiusB, shadowB, bordersB, hsB);
  const densityScaleA = TWEAK_PRESETS.density.find(o => o.id === density)?.scale || 1;
  const densityScaleB = TWEAK_PRESETS.density.find(o => o.id === densityB)?.scale || 1;

  // Resolve the rendered component from the surface preset's component string
  const surfaceCfg = TWEAK_PRESETS.surface.find(o => o.id === surface);
  const Surface = surfaceCfg ? window[surfaceCfg.component] : null;

  function reset() {
    setSurface('S-NAV');
    setTypo('T-E'); setPalette('P-H'); setDensity('D-A'); setWarmth('W-D');
    setRadius('R-A'); setShadow('SH-B'); setBorders('B-A');
    setHw('HW-E'); setEb('ET-B'); setNs('NS-A');
    setTg('TG-A'); setBt('BT-A'); setCd('CD-A'); setDc('DC-A');
    setAs('AS-A'); setNavFit('NF-B'); setNavMarker('NM-B'); setNavType('NT-B'); setNavPreview('NP-B');
    setSd('SD-A'); setHs('HS-A'); setLh('LH-A');
    setCompareOn(false);
  }

  // Compose CSS rule strings from the rule-based axes (HW / ET / NS) for each side.
  // The rule strings have #SCOPE placeholders. scopePrefix is the full selector
  // — '#tweak-frame-a' for inline frames, 'html' for the master-doc iframe so
  // rules cascade into every artboard inside the document.
  function joinRules(scopePrefix, ...presets) {
    return presets
      .filter(p => p && p.rules && p.rules.trim())
      .map(p => p.rules.replace(/#SCOPE/g, scopePrefix))
      .join('\n');
  }
  const extraCssA = joinRules('#tweak-frame-a',
    TWEAK_PRESETS.headlineWeight.find(o => o.id === hw),
    TWEAK_PRESETS.eyebrow.find(o => o.id === eb),
    TWEAK_PRESETS.numbers.find(o => o.id === ns),
    TWEAK_PRESETS.tag.find(o => o.id === tg),
    TWEAK_PRESETS.button.find(o => o.id === bt),
    TWEAK_PRESETS.card.find(o => o.id === cd),
    TWEAK_PRESETS.dropcap.find(o => o.id === dc),
    TWEAK_PRESETS.activeState.find(o => o.id === as_),
    TWEAK_PRESETS.navFit.find(o => o.id === navFit),
    TWEAK_PRESETS.navMarker.find(o => o.id === navMarker),
    TWEAK_PRESETS.navType.find(o => o.id === navType),
    TWEAK_PRESETS.navPreview.find(o => o.id === navPreview),
    TWEAK_PRESETS.statusDot.find(o => o.id === sd),
    TWEAK_PRESETS.lineHeight.find(o => o.id === lh),
  );
  // Iframe-mode CSS — same rule set, but #SCOPE → 'html' so rules apply
  // throughout the master doc (the iframe doesn't have a #tweak-frame-a wrapper).
  const masterDocCssA = joinRules('html',
    TWEAK_PRESETS.headlineWeight.find(o => o.id === hw),
    TWEAK_PRESETS.eyebrow.find(o => o.id === eb),
    TWEAK_PRESETS.numbers.find(o => o.id === ns),
    TWEAK_PRESETS.tag.find(o => o.id === tg),
    TWEAK_PRESETS.button.find(o => o.id === bt),
    TWEAK_PRESETS.card.find(o => o.id === cd),
    TWEAK_PRESETS.dropcap.find(o => o.id === dc),
    TWEAK_PRESETS.activeState.find(o => o.id === as_),
    TWEAK_PRESETS.navFit.find(o => o.id === navFit),
    TWEAK_PRESETS.navMarker.find(o => o.id === navMarker),
    TWEAK_PRESETS.navType.find(o => o.id === navType),
    TWEAK_PRESETS.navPreview.find(o => o.id === navPreview),
    TWEAK_PRESETS.statusDot.find(o => o.id === sd),
    TWEAK_PRESETS.lineHeight.find(o => o.id === lh),
  );
  const extraCssB = joinRules('#tweak-frame-b',
    TWEAK_PRESETS.headlineWeight.find(o => o.id === hwB),
    TWEAK_PRESETS.eyebrow.find(o => o.id === ebB),
    TWEAK_PRESETS.numbers.find(o => o.id === nsB),
    TWEAK_PRESETS.tag.find(o => o.id === tgB),
    TWEAK_PRESETS.button.find(o => o.id === btB),
    TWEAK_PRESETS.card.find(o => o.id === cdB),
    TWEAK_PRESETS.dropcap.find(o => o.id === dcB),
    TWEAK_PRESETS.activeState.find(o => o.id === asB),
    TWEAK_PRESETS.navFit.find(o => o.id === navFitB),
    TWEAK_PRESETS.navMarker.find(o => o.id === navMarkerB),
    TWEAK_PRESETS.navType.find(o => o.id === navTypeB),
    TWEAK_PRESETS.navPreview.find(o => o.id === navPreviewB),
    TWEAK_PRESETS.statusDot.find(o => o.id === sdB),
    TWEAK_PRESETS.lineHeight.find(o => o.id === lhB),
  );
  const masterDocCssB = joinRules('html',
    TWEAK_PRESETS.headlineWeight.find(o => o.id === hwB),
    TWEAK_PRESETS.eyebrow.find(o => o.id === ebB),
    TWEAK_PRESETS.numbers.find(o => o.id === nsB),
    TWEAK_PRESETS.tag.find(o => o.id === tgB),
    TWEAK_PRESETS.button.find(o => o.id === btB),
    TWEAK_PRESETS.card.find(o => o.id === cdB),
    TWEAK_PRESETS.dropcap.find(o => o.id === dcB),
    TWEAK_PRESETS.activeState.find(o => o.id === asB),
    TWEAK_PRESETS.navFit.find(o => o.id === navFitB),
    TWEAK_PRESETS.navMarker.find(o => o.id === navMarkerB),
    TWEAK_PRESETS.navType.find(o => o.id === navTypeB),
    TWEAK_PRESETS.navPreview.find(o => o.id === navPreviewB),
    TWEAK_PRESETS.statusDot.find(o => o.id === sdB),
    TWEAK_PRESETS.lineHeight.find(o => o.id === lhB),
  );

  // Build a unified list of axes for the compact left sidebar. Each axis row
  // shows a short label, a tiny ID-only chip per variant, and the active chip
  // is highlighted. Hover any chip for the full label · sub via title attr.
  const COMPACT_AXES = [
    { lbl: 'SURFACE', value: surface, set: setSurface, options: TWEAK_PRESETS.surface, kind: 'plain' },
    { lbl: 'TYPO',    value: typo,    set: setTypo,    options: TWEAK_PRESETS.typo, kind: 'typo' },
    { lbl: 'PALETTE', value: palette, set: setPalette, options: TWEAK_PRESETS.palette, kind: 'palette' },
    { lbl: 'DENSITY', value: density, set: setDensity, options: TWEAK_PRESETS.density, kind: 'plain' },
    { lbl: 'WARMTH',  value: warmth,  set: setWarmth,  options: TWEAK_PRESETS.warmth, kind: 'warmth' },
    { lbl: 'RADIUS',  value: radius,  set: setRadius,  options: TWEAK_PRESETS.radius, kind: 'plain' },
    { lbl: 'SHADOW',  value: shadow,  set: setShadow,  options: TWEAK_PRESETS.shadow, kind: 'plain' },
    { lbl: 'BORDER',  value: borders, set: setBorders, options: TWEAK_PRESETS.borders, kind: 'border' },
    { lbl: 'HEADLN',  value: hw,      set: setHw,      options: TWEAK_PRESETS.headlineWeight, kind: 'plain' },
    { lbl: 'EYEBR',   value: eb,      set: setEb,      options: TWEAK_PRESETS.eyebrow, kind: 'plain' },
    { lbl: 'NUMS',    value: ns,      set: setNs,      options: TWEAK_PRESETS.numbers, kind: 'plain' },
    { lbl: 'TAG',     value: tg,      set: setTg,      options: TWEAK_PRESETS.tag, kind: 'plain' },
    { lbl: 'BUTTON',  value: bt,      set: setBt,      options: TWEAK_PRESETS.button, kind: 'plain' },
    { lbl: 'CARD',    value: cd,      set: setCd,      options: TWEAK_PRESETS.card, kind: 'plain' },
    { lbl: 'DROPCAP', value: dc,      set: setDc,      options: TWEAK_PRESETS.dropcap, kind: 'plain' },
    { lbl: 'ACTIVE',  value: as_,     set: setAs,      options: TWEAK_PRESETS.activeState, kind: 'plain' },
    { lbl: 'NAVFIT',  value: navFit,  set: setNavFit,  options: TWEAK_PRESETS.navFit, kind: 'plain' },
    { lbl: 'MARKER',  value: navMarker, set: setNavMarker, options: TWEAK_PRESETS.navMarker, kind: 'plain' },
    { lbl: 'NAVTYPE', value: navType, set: setNavType, options: TWEAK_PRESETS.navType, kind: 'plain' },
    { lbl: 'DOSSIER', value: navPreview, set: setNavPreview, options: TWEAK_PRESETS.navPreview, kind: 'plain' },
    { lbl: 'DOT',     value: sd,      set: setSd,      options: TWEAK_PRESETS.statusDot, kind: 'plain' },
    { lbl: 'SCALE',   value: hs,      set: setHs,      options: TWEAK_PRESETS.headingScale, kind: 'plain' },
    { lbl: 'LINEHT',  value: lh,      set: setLh,      options: TWEAK_PRESETS.lineHeight, kind: 'plain' },
  ];

  // Sidebar width is fixed; surface render area takes the rest. Surface
  // designs at 1440 — RenderFrame already scales when given less width.
  const SIDEBAR_W = 380;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Left sticky sidebar — compact panel */}
      <aside style={{
        width: SIDEBAR_W,
        flexShrink: 0,
        background: 'var(--surface-1)',
        borderRight: '1px solid var(--fg-primary)',
        position: 'sticky', top: 0,
        height: '100vh', overflowY: 'auto',
        padding: '16px 14px 24px',
        fontFamily: TW.sans,
      }}>
        {/* Byline strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ fontFamily: TW.mono, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 700 }}>
            COOPR · TWEAKS · v11
          </span>
          <span style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
        </div>

        {/* Header row — compact: compare + reset */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
          <button onClick={() => setCompareOn(!compareOn)} style={{
            background: compareOn ? 'var(--accent-primary)' : 'transparent',
            color: compareOn ? 'var(--fg-on-accent)' : 'var(--fg-secondary)',
            border: compareOn ? '1px solid var(--accent-primary)' : '1px solid var(--border-default)',
            padding: '4px 10px',
            borderRadius: 4,
            cursor: 'pointer',
            fontFamily: TW.mono, fontSize: 9, letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 700,
            flex: 1,
          }}>{compareOn ? 'COMPARE · ON' : 'COMPARE 2 ↔'}</button>
          <button onClick={reset} style={{
            background: 'transparent',
            border: '1px solid var(--border-default)',
            padding: '4px 10px',
            borderRadius: 4,
            cursor: 'pointer',
            fontFamily: TW.mono, fontSize: 9, letterSpacing: '0.10em', textTransform: 'uppercase',
            color: 'var(--accent-primary)', fontWeight: 700,
          }}>RESET</button>
        </div>

        {/* Cohesion R9 / Wave 3 · Master Lock-In
            Snapshots every `tweaks.v11.*` localStorage key plus the merged token-stack
            CSS variables, writes to localStorage['cb-locked-tokens'] (read by master on
            boot via window.cohesionR9TokensChannel), and surfaces an inline status line
            so the user knows the lock applied. JSON file (locked-tokens.json) still wins
            on conflict — this is the per-browser session override layer. */}
        <LockInMasterButton
          tokensA={tokensA}
          axisIds={{ typo, palette, density, warmth, radius, shadow, borders, hw, eb, ns, tg, bt, cd, dc, as_, navFit, navMarker, navType, navPreview, sd, hs, lh }}
        />

        {/* Axis rows · one per axis */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {COMPACT_AXES.map((axis, i) => (
            <CompactAxisRow
              key={axis.lbl}
              label={axis.lbl}
              value={axis.value}
              onChange={axis.set}
              options={axis.options}
              kind={axis.kind}
              even={i % 2 === 0}
            />
          ))}
        </div>

        {/* Status footer */}
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border-subtle)', fontFamily: TW.mono, fontSize: 8.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', lineHeight: 1.5 }}>
          <div>
            <span style={{ fontFamily: TW.serif, fontStyle: 'italic', textTransform: 'none', letterSpacing: 0, fontSize: 11, color: 'var(--fg-secondary)' }}>
              T-E + P-H + W-D + SH-B + HW-E + ET-B committed to hifi.css. Other axes are exploration-only.
            </span>
          </div>
          <div style={{ marginTop: 6, fontSize: 8.5 }}>
            v11 · {COMPACT_AXES.length} axes · {COMPACT_AXES.reduce((n, a) => n + a.options.length, 0)} variants
          </div>
        </div>
      </aside>

      {/* Right side — surface render area, scrollable horizontally if needed */}
      <main style={{ flex: 1, minWidth: 0, padding: '20px 24px 60px', overflowX: 'auto' }}>
        {/* Side-B compare panel */}
        {compareOn && (
          <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '14px 16px', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10 }}>
              <span style={{ fontFamily: TW.mono, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent-primary-press)', fontWeight: 700 }}>
                SIDE B · COMPARE-AGAINST
              </span>
              <span style={{ fontFamily: TW.serif, fontStyle: 'italic', fontSize: 11.5, color: 'var(--fg-secondary)' }}>
                Pick a different combo · split A | B below.
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
              <CompareSelect label="Typography"  value={typoB} setValue={setTypoB} options={TWEAK_PRESETS.typo} />
              <CompareSelect label="Palette"     value={paletteB} setValue={setPaletteB} options={TWEAK_PRESETS.palette} />
              <CompareSelect label="Density"     value={densityB} setValue={setDensityB} options={TWEAK_PRESETS.density} />
              <CompareSelect label="Warmth"      value={warmthB} setValue={setWarmthB} options={TWEAK_PRESETS.warmth} />
              <CompareSelect label="Radius"      value={radiusB} setValue={setRadiusB} options={TWEAK_PRESETS.radius} />
              <CompareSelect label="Shadow"      value={shadowB} setValue={setShadowB} options={TWEAK_PRESETS.shadow} />
              <CompareSelect label="Borders"     value={bordersB} setValue={setBordersB} options={TWEAK_PRESETS.borders} />
              <CompareSelect label="Headline wt" value={hwB} setValue={setHwB} options={TWEAK_PRESETS.headlineWeight} />
              <CompareSelect label="Eyebrow"     value={ebB} setValue={setEbB} options={TWEAK_PRESETS.eyebrow} />
              <CompareSelect label="Numbers"     value={nsB} setValue={setNsB} options={TWEAK_PRESETS.numbers} />
              <CompareSelect label="Tag"         value={tgB} setValue={setTgB} options={TWEAK_PRESETS.tag} />
              <CompareSelect label="Button"      value={btB} setValue={setBtB} options={TWEAK_PRESETS.button} />
              <CompareSelect label="Card"        value={cdB} setValue={setCdB} options={TWEAK_PRESETS.card} />
              <CompareSelect label="Drop-cap"    value={dcB} setValue={setDcB} options={TWEAK_PRESETS.dropcap} />
              <CompareSelect label="Active"      value={asB} setValue={setAsB} options={TWEAK_PRESETS.activeState} />
              <CompareSelect label="Nav fit"     value={navFitB} setValue={setNavFitB} options={TWEAK_PRESETS.navFit} />
              <CompareSelect label="Marker"      value={navMarkerB} setValue={setNavMarkerB} options={TWEAK_PRESETS.navMarker} />
              <CompareSelect label="Nav type"    value={navTypeB} setValue={setNavTypeB} options={TWEAK_PRESETS.navType} />
              <CompareSelect label="Dossier"     value={navPreviewB} setValue={setNavPreviewB} options={TWEAK_PRESETS.navPreview} />
              <CompareSelect label="Status dot"  value={sdB} setValue={setSdB} options={TWEAK_PRESETS.statusDot} />
              <CompareSelect label="Heading"     value={hsB} setValue={setHsB} options={TWEAK_PRESETS.headingScale} />
              <CompareSelect label="Line height" value={lhB} setValue={setLhB} options={TWEAK_PRESETS.lineHeight} />
            </div>
          </div>
        )}

        {/* Render path · iframe (master doc) OR inline RenderFrame (single surface).
            Iframe mode loads Hi-fi round 4.html and injects token + rule overrides
            into its head — every artboard responds live. Inline frame mode is the
            previous behaviour for S-A · S-B · S-C · S-D · S-E. Compare mode only
            applies to inline frames. */}
        {surfaceCfg?.mode === 'iframe' ? (
          compareOn ? (
            <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 12 }}>
              <MasterDocFrame
                url={surfaceCfg.url}
                tokens={tokensA}
                densityScale={densityScaleA}
                extraCss={masterDocCssA}
                sideLabel="A · current"
                frameWidth={712}
              />
              <MasterDocFrame
                url={surfaceCfg.url}
                tokens={tokensB}
                densityScale={densityScaleB}
                extraCss={masterDocCssB}
                sideLabel="B · compare"
                frameWidth={712}
              />
            </div>
          ) : (
            <MasterDocFrame
              url={surfaceCfg.url}
              tokens={tokensA}
              densityScale={densityScaleA}
              extraCss={masterDocCssA}
            />
          )
        ) : (
          <div style={{ display: 'flex', justifyContent: 'flex-start', gap: compareOn ? 12 : 0 }}>
            {!compareOn && (
              <RenderFrame width={1440} tokens={tokensA} densityScale={densityScaleA} Surface={Surface} surfaceCfg={surfaceCfg} scopeId="tweak-frame-a" extraCss={extraCssA} />
            )}
            {compareOn && (
              <>
                <RenderFrame width={712} tokens={tokensA} densityScale={densityScaleA} Surface={Surface} surfaceCfg={surfaceCfg} sideLabel="A · current" scopeId="tweak-frame-a" extraCss={extraCssA} />
                <RenderFrame width={712} tokens={tokensB} densityScale={densityScaleB} Surface={Surface} surfaceCfg={surfaceCfg} sideLabel="B · compare" scopeId="tweak-frame-b" extraCss={extraCssB} />
              </>
            )}
          </div>
        )}
      </main>

    </div>
  );
}

// ─── Master-doc iframe · S-MASTER / S-R4 preview ──────────
// Loads master.html#layout (canonical, default) or Hi-fi round 4.html
// (archeology fallback) in an iframe and injects the tweaks' token overrides
// + extra-CSS rules straight into the iframe document's head. Every axis flip
// cascades live across all artboards, no React double-mount, no script-
// loading collisions.
function MasterDocFrame({ url, tokens, densityScale, extraCss, sideLabel, frameWidth }) {
  const iframeRef = React.useRef(null);
  const [loaded, setLoaded] = React.useState(false);

  // Build the CSS that gets injected on every render of this component.
  // `:root` overrides drive the token-based axes (warmth, palette, radius,
  // typography, heading scale, shadow, borders). The `extraCss` block carries
  // the rule-based axes (HW · ET · NS · TG · BT · CD · DC · AS · SD · LH).
  const tokenCss = Object.entries(tokens || {})
    .map(([k, v]) => `  ${k}: ${v} !important;`)
    .join('\n');
  const css = [
    `:root, html, body, .hf {\n${tokenCss}\n}`,
    extraCss || '',
  ].join('\n\n');

  // Inject / update the <style> tag in the iframe document on every change.
  // useEffect guarantees this fires after each render. The style element is
  // looked up by id; the same node is re-used across updates.
  React.useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !loaded) return;
    try {
      const doc = iframe.contentDocument;
      if (!doc) return;
      let style = doc.getElementById('tweaks-injected');
      if (!style) {
        style = doc.createElement('style');
        style.id = 'tweaks-injected';
        doc.head.appendChild(style);
      }
      style.textContent = css;
    } catch (e) {
      // Cross-origin iframes throw on contentDocument; same-origin localhost
      // is fine. Surface any unexpected error to the console for debugging.
      console.warn('master-doc style inject failed', e);
    }
  }, [css, loaded]);

  // Apply density via CSS transform on the iframe element itself. In compare
  // mode each pane keeps a 1440px design viewport, then visually scales it down
  // to the available pane width so nav fit variants are comparable.
  const scale = densityScale || 1;
  const compareScale = frameWidth ? (frameWidth / 1440) * scale : scale;
  const frameHeight = frameWidth ? 900 : null;
  const shellHeight = frameWidth ? frameHeight * (frameWidth / 1440) : '100vh';
  const iframeWidth = frameWidth ? `${1440 / scale}px` : `calc(100% / ${scale})`;
  const iframeHeight = frameWidth ? `${frameHeight / scale}px` : `calc(100vh / ${scale})`;

  return (
    <div style={{
      width: frameWidth || '100%',
      minHeight: frameWidth ? 'auto' : '100vh',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--fg-tertiary)',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'baseline',
        gap: 10,
      }}>
        <span>{sideLabel || 'master document'}</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
        <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', textTransform: 'none', letterSpacing: 0, fontSize: 12, color: 'var(--fg-secondary)' }}>
          {url} · scroll inside the frame · every axis cascades live
        </span>
      </div>
      <div
        style={{
          width: '100%',
          height: shellHeight,
          border: '1px solid var(--border-default)',
          borderRadius: 12,
          background: 'var(--bg-base)',
          overflow: 'hidden',
        }}
      >
        <iframe
          ref={iframeRef}
          src={url}
          title={'master document · ' + url}
          onLoad={() => setLoaded(true)}
          style={{
            width: iframeWidth,
            height: iframeHeight,
            border: 0,
            background: 'var(--bg-base)',
            transform: `scale(${compareScale})`,
            transformOrigin: 'top left',
            display: 'block',
          }}
        />
      </div>
    </div>
  );
}

// ─── S-E Token gallery · test bed for every primitive ─────
// Renders every .hf-* primitive any axis can target, at clearly-visible scale.
// Lives inside the regular surface system so the wrapper's tokens + extra-CSS
// rules cascade in normally. Designed at the 1440 surface canvas — sections
// stack vertically, each labeled with a mono eyebrow + a serif italic deck.
function HF_TweakTokenGallery() {
  const TG = { sans: 'var(--font-sans)', serif: 'var(--font-serif)', mono: 'var(--font-mono)' };
  const Section = ({ kicker, deck, children }) => (
    <section style={{ borderBottom: '1px solid var(--border-subtle)', padding: '24px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 14 }}>
        <span className="hf-byline" style={{ fontSize: 11 }}>{kicker}</span>
        <span style={{ fontFamily: TG.serif, fontStyle: 'italic', fontSize: 13.5, color: 'var(--fg-secondary)' }}>{deck}</span>
      </div>
      {children}
    </section>
  );

  return (
    <div className="hf" style={{
      width: '100%', minHeight: '100%',
      background: 'var(--bg-base)',
      color: 'var(--fg-primary)',
      fontFamily: TG.sans,
      fontSize: 14,
      lineHeight: 1.45,
    }}>
      {/* MASTHEAD */}
      <header style={{ padding: '28px 32px 22px', background: 'var(--surface-1)', borderBottom: '1px solid var(--fg-primary)' }}>
        <div className="hf-byline" style={{ fontSize: 10, marginBottom: 8 }}>
          coopr · token gallery · S-E · every primitive at scale
        </div>
        <h1 className="hf-headline" style={{ fontSize: 38, margin: 0, marginBottom: 6 }}>
          Token gallery, <span style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--accent-primary)' }}>tweaked.</span>
        </h1>
        <p className="hf-deck" style={{ fontSize: 15, margin: 0, maxWidth: 920 }}>
          Every primitive any axis targets, rendered at unmistakable scale. Flip an axis on the left — the change lands here, not behind a 7-row table.
        </p>
      </header>

      {/* TABS · subtabs · rail — active state is the load-bearing IA signal */}
      <Section kicker="active state · tabs · subtabs · rail" deck="how the current section announces itself">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <div className="hf-byline" style={{ fontSize: 10, marginBottom: 8 }}>tabs</div>
            <div className="hf-topbar" style={{ height: 56, padding: '0 16px', gap: 30, fontSize: 16 }}>
              <span className="hf-tab" style={{ fontSize: 16, height: 56 }}>Home</span>
              <span className="hf-tab is-active" style={{ fontSize: 16, height: 56 }}>Library</span>
              <span className="hf-tab" style={{ fontSize: 16, height: 56 }}>Insights</span>
            </div>
          </div>
          <div>
            <div className="hf-byline" style={{ fontSize: 10, marginBottom: 8 }}>subtabs</div>
            <div className="hf-subtabs" style={{ height: 46, padding: '0 16px', gap: 22, fontSize: 14 }}>
              <span className="hf-subtab is-active" style={{ fontSize: 14, height: 46 }}>Catalog</span>
              <span className="hf-subtab" style={{ fontSize: 14, height: 46 }}>Series</span>
              <span className="hf-subtab" style={{ fontSize: 14, height: 46 }}>Patterns</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ flex: '0 0 240px' }}>
              <div className="hf-byline" style={{ fontSize: 10, marginBottom: 8 }}>rail</div>
              <div className="hf-rail" style={{ width: 240 }}>
                <div className="hf-rail-label">Sections</div>
                <div className="hf-rail-item">All posts <span className="hf-rail-meta">156</span></div>
                <div className="hf-rail-item is-active">Drafts <span className="hf-rail-meta">7</span></div>
                <div className="hf-rail-item">Archived <span className="hf-rail-meta">22</span></div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="hf-byline" style={{ fontSize: 10, marginBottom: 8 }}>shell-style inline tabs (canonical pattern)</div>
              <div style={{ display: 'flex', gap: 30, padding: '0 16px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontFamily: TG.sans, fontSize: 14, fontWeight: 500, color: 'var(--fg-tertiary)', borderBottom: '2px solid transparent', padding: '14px 2px', marginBottom: -1 }}>Overview</span>
                <span style={{ fontFamily: TG.sans, fontSize: 14, fontWeight: 600, color: 'var(--fg-primary)', borderBottom: '2px solid var(--fg-primary)', padding: '14px 2px', marginBottom: -1 }}>Format DNA</span>
                <span style={{ fontFamily: TG.sans, fontSize: 14, fontWeight: 500, color: 'var(--fg-tertiary)', borderBottom: '2px solid transparent', padding: '14px 2px', marginBottom: -1 }}>Audience</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* HEADLINES · drop-cap · numbers */}
      <Section kicker="editorial · headline · drop-cap · numbers" deck="the typographic spine">
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 28, alignItems: 'start' }}>
          <div>
            <div className="hf-byline" style={{ fontSize: 10, marginBottom: 8 }}>headlines · h1 · h2 · h3</div>
            <h1 style={{ fontFamily: TG.serif, fontStyle: 'italic', fontSize: 44, fontWeight: 600, margin: 0, marginBottom: 8, letterSpacing: '-0.02em', lineHeight: 1.05 }}>
              Two pillars carry the lift.
            </h1>
            <h2 style={{ fontFamily: TG.serif, fontStyle: 'italic', fontSize: 30, fontWeight: 600, margin: 0, marginBottom: 8, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Where the volume lives
            </h2>
            <h3 style={{ fontFamily: TG.serif, fontStyle: 'italic', fontSize: 22, fontWeight: 500, margin: 0, marginBottom: 20, letterSpacing: '-0.01em' }}>
              A quieter third option
            </h3>
            <div className="hf-byline" style={{ fontSize: 10, marginBottom: 8 }}>drop-cap paragraph · .hf-dropcap</div>
            <p className="hf-dropcap" style={{ fontSize: 15, lineHeight: 1.55, margin: 0, color: 'var(--fg-secondary)', maxWidth: 620 }}>
              Across the last thirty days, two of the four pillars carry roughly two-thirds of the yield. The remaining two are a mix of warm-but-cheap (replies, sentiment) and an outlier worth watching — gear teardowns trade volume for save rate, which compounds.
            </p>
          </div>
          <div>
            <div className="hf-byline" style={{ fontSize: 10, marginBottom: 8 }}>numbers · .hf-num · tabular figures</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
              {[['410.5k', 'followers'], ['+22%', 'saves'], ['1.42M', 'views'], ['+0.62', 'sentiment']].map(([n, l], i) => (
                <div key={i} style={{ borderTop: '1px solid var(--border-subtle)', padding: '12px 0' }}>
                  <span className="hf-num" style={{ fontFamily: TG.serif, fontSize: 32, fontWeight: 600, color: 'var(--fg-primary)', letterSpacing: '-0.02em', display: 'block', lineHeight: 1 }}>{n}</span>
                  <span className="hf-byline" style={{ fontSize: 10, marginTop: 6, display: 'block' }}>{l}</span>
                </div>
              ))}
            </div>
            <div className="hf-byline" style={{ fontSize: 10, marginBottom: 8 }}>headlines (.hf-headline class)</div>
            <span className="hf-headline" style={{ fontSize: 26 }}>Bound to the headline class.</span>
          </div>
        </div>
      </Section>

      {/* TAGS */}
      <Section kicker="tags · chips · 5 tones" deck=".hf-tag · -accent · -success · -warning · -info">
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <span className="hf-tag" style={{ height: 30, fontSize: 13, padding: '0 12px' }}>last 30d</span>
          <span className="hf-tag hf-tag-accent" style={{ height: 30, fontSize: 13, padding: '0 12px' }}>shipping</span>
          <span className="hf-tag hf-tag-success" style={{ height: 30, fontSize: 13, padding: '0 12px' }}>+22% saves</span>
          <span className="hf-tag hf-tag-warning" style={{ height: 30, fontSize: 13, padding: '0 12px' }}>cadence drift</span>
          <span className="hf-tag hf-tag-info" style={{ height: 30, fontSize: 13, padding: '0 12px' }}>3 platforms</span>
        </div>
      </Section>

      {/* BUTTONS */}
      <Section kicker="buttons · primary · secondary · ghost · sm" deck=".hf-btn family">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="hf-btn hf-btn-primary" style={{ height: 40, fontSize: 14, padding: '0 18px' }}>Approve & post</button>
          <button className="hf-btn hf-btn-secondary" style={{ height: 40, fontSize: 14, padding: '0 18px' }}>Save draft</button>
          <button className="hf-btn hf-btn-ghost" style={{ height: 40, fontSize: 14, padding: '0 14px' }}>Cancel</button>
          <button className="hf-btn hf-btn-primary hf-btn-sm">Open</button>
          <button style={{ height: 40, padding: '0 18px', borderRadius: 8, fontSize: 14, fontWeight: 600, border: '1px solid transparent', background: 'var(--accent-primary)', color: 'var(--fg-on-accent)', cursor: 'pointer', fontFamily: 'inherit' }}>Inline-styled CTA</button>
        </div>
      </Section>

      {/* CARDS */}
      <Section kicker="cards · 3 variants" deck=".hf-card · -tight · with head + eyebrow + title">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          <div className="hf-card">
            <div style={{ fontFamily: TG.sans, fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Default card</div>
            <div style={{ fontSize: 13, color: 'var(--fg-secondary)' }}>Surface-1 fill, subtle border, radius-lg padding.</div>
          </div>
          <div className="hf-card hf-card-tight">
            <div style={{ fontFamily: TG.sans, fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Tight card</div>
            <div style={{ fontSize: 12.5, color: 'var(--fg-secondary)' }}>Same surface, less inset.</div>
          </div>
          <div className="hf-card">
            <div className="hf-card-head">
              <span className="hf-card-eyebrow">section · 02</span>
              <span className="hf-tag hf-tag-accent">live</span>
            </div>
            <span className="hf-card-title">With head + eyebrow + title</span>
            <div style={{ marginTop: 8, fontSize: 13, color: 'var(--fg-secondary)' }}>Three composed primitives.</div>
          </div>
          <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px 18px' }}>
            <div style={{ fontFamily: TG.mono, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', marginBottom: 6 }}>inline-styled card</div>
            <div style={{ fontFamily: TG.sans, fontSize: 14, fontWeight: 600 }}>Same shape, no class</div>
            <div style={{ fontSize: 13, color: 'var(--fg-secondary)', marginTop: 4 }}>Most surfaces use this pattern, not .hf-card.</div>
          </div>
          <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px 18px' }}>
            <div style={{ fontFamily: TG.mono, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', marginBottom: 6 }}>inline · 2</div>
            <div style={{ fontFamily: TG.sans, fontSize: 14, fontWeight: 600 }}>Cascade target</div>
            <div style={{ fontSize: 13, color: 'var(--fg-secondary)', marginTop: 4 }}>CD axis hits all three.</div>
          </div>
          <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px 18px' }}>
            <div style={{ fontFamily: TG.mono, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', marginBottom: 6 }}>inline · 3</div>
            <div style={{ fontFamily: TG.sans, fontSize: 14, fontWeight: 600 }}>Three siblings</div>
            <div style={{ fontSize: 13, color: 'var(--fg-secondary)', marginTop: 4 }}>Confirms aggregate visual delta.</div>
          </div>
        </div>
      </Section>

      {/* DOTS */}
      <Section kicker="status dots · 5 tones" deck=".hf-dot · 12px scale for unmistakable read">
        <div style={{ display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}>
          {[
            { color: 'var(--accent-primary)', label: 'accent' },
            { color: 'var(--tone-success)',   label: 'success' },
            { color: 'var(--tone-warning)',   label: 'warning' },
            { color: 'var(--tone-info)',      label: 'info' },
            { color: 'var(--tone-danger)',    label: 'danger' },
          ].map((d, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span className="hf-dot" style={{ width: 12, height: 12, background: d.color }} />
              <span style={{ fontFamily: TG.mono, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-secondary)' }}>{d.label}</span>
            </span>
          ))}
        </div>
        <div style={{ marginTop: 14, display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="hf-byline" style={{ fontSize: 10 }}>inline dots · 6-10px</div>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)' }} />
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--tone-success)' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--tone-warning)' }} />
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--tone-info)' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--tone-danger)' }} />
        </div>
      </Section>

      {/* DIVIDERS */}
      <Section kicker="dividers · 4 weights" deck=".hf-rule · -thick · -double · .hf-divider">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <div className="hf-byline" style={{ fontSize: 10, marginBottom: 6 }}>.hf-rule</div>
            <div className="hf-rule" />
          </div>
          <div>
            <div className="hf-byline" style={{ fontSize: 10, marginBottom: 6 }}>.hf-rule-thick</div>
            <div className="hf-rule-thick" />
          </div>
          <div>
            <div className="hf-byline" style={{ fontSize: 10, marginBottom: 6 }}>.hf-rule-double</div>
            <div className="hf-rule-double" />
          </div>
          <div>
            <div className="hf-byline" style={{ fontSize: 10, marginBottom: 6 }}>.hf-divider · subtle border tone</div>
            <div className="hf-divider" />
          </div>
        </div>
      </Section>

      {/* SPARKS */}
      <Section kicker="sparkline · 3 series" deck=".hf-spark with .hf-bar children">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { label: 'YouTube', color: 'var(--accent-primary)', heights: [12, 18, 22, 26, 32, 28, 36] },
            { label: 'Instagram', color: 'var(--tone-info)', heights: [22, 18, 14, 16, 12, 14, 10] },
            { label: 'TikTok', color: 'var(--tone-warning)', heights: [8, 12, 18, 20, 14, 22, 28] },
          ].map((s, i) => (
            <div key={i}>
              <div className="hf-byline" style={{ fontSize: 10, marginBottom: 8 }}>{s.label} · 7d</div>
              <div className="hf-spark" style={{ height: 44 }}>
                {s.heights.map((h, j) => <i key={j} style={{ height: h, background: s.color, width: 6 }} />)}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ROWS */}
      <Section kicker="rows · list · .hf-row" deck="table-of-contents pattern">
        <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '4px 0' }}>
          {[
            ['0046', 'Pre-dive checklist',  '142k views · 68% completion', '+22%'],
            ['0042', 'First wreck',         '421k views · top quartile',  '+18%'],
            ['0041', '12-min primer',       '138k views · drop at 3:14',  '−12%'],
            ['0039', 'Tuesday TT slot',     'unscheduled · costing reach','—'],
          ].map((r, i) => (
            <div key={i} className="hf-row" style={{ padding: '12px 18px', alignItems: 'baseline' }}>
              <span style={{ fontFamily: TG.mono, fontSize: 11, color: 'var(--fg-tertiary)', letterSpacing: '0.04em', minWidth: 36 }}>{r[0]}</span>
              <span style={{ fontFamily: TG.sans, fontSize: 14, fontWeight: 600, color: 'var(--fg-primary)', minWidth: 200 }}>{r[1]}</span>
              <span style={{ fontFamily: TG.serif, fontStyle: 'italic', fontSize: 13, color: 'var(--fg-secondary)', flex: 1 }}>{r[2]}</span>
              <span className="hf-num" style={{ fontFamily: TG.mono, fontSize: 13, fontWeight: 600, color: 'var(--fg-primary)' }}>{r[3]}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* FOOTER */}
      <div style={{ padding: '18px 32px 32px', fontFamily: TG.mono, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>
        S-E · token gallery · designed at 1440 × 900 surface canvas · scrolls within
      </div>
    </div>
  );
}

Object.assign(window, { HF_TweaksGallery, HF_TweakTokenGallery });
