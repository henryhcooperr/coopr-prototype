/* global React */
// hifi-charts.jsx — real chart components for the Audience workspace.
// Retention curve, comparison bands, comments distribution, follower velocity.

// Retention curve — line chart with gridlines, axes, comparison shading.
function HfRetentionChart({ width = 560, height = 260 }) {
  const pad = { top: 24, right: 24, bottom: 32, left: 40 };
  const W = width - pad.left - pad.right;
  const H = height - pad.top - pad.bottom;

  // Data: % viewers remaining at each second, last 12 posts averaged + this post.
  const seconds = Array.from({ length: 31 }, (_, i) => i);
  const benchmark = seconds.map(s => Math.max(28, 100 * Math.exp(-s * 0.045)));   // your typical
  const thisPost  = seconds.map(s => Math.max(22, 100 * Math.exp(-s * 0.062) - (s > 3 ? (s - 3) * 1.6 : 0)));
  const top       = seconds.map(s => Math.max(40, 100 * Math.exp(-s * 0.030)));   // top quartile

  const x = (s) => pad.left + (s / 30) * W;
  const y = (v) => pad.top + H - (v / 100) * H;

  const path = (data) => data.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ');
  const area = (data) => `M${x(0)},${y(0)} ` + data.map((v, i) => `L${x(i)},${y(v)}`).join(' ') + ` L${x(30)},${y(0)} Z`;

  // Drop-off annotation at second 3
  const dropX = x(3);
  const dropY = y(thisPost[3]);

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <defs>
        <pattern id="gridDots" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="0.5" fill="var(--fg-tertiary)" opacity="0.35" />
        </pattern>
      </defs>

      {/* Top-quartile band — soft shaded area showing the goal */}
      <path d={area(top)} fill="var(--tone-success-bg)" opacity="0.5" />

      {/* Y axis labels + gridlines */}
      {[0, 25, 50, 75, 100].map(t => (
        <g key={t}>
          <line x1={pad.left} x2={pad.left + W} y1={y(t)} y2={y(t)} stroke="var(--border-subtle)" strokeWidth="1" />
          <text x={pad.left - 8} y={y(t) + 3} textAnchor="end" fontSize="10" fill="var(--fg-tertiary)" fontFamily="var(--font-mono)" fontWeight="500">{t}</text>
        </g>
      ))}

      {/* X axis labels */}
      {[0, 5, 10, 15, 20, 25, 30].map(s => (
        <text key={s} x={x(s)} y={pad.top + H + 18} textAnchor="middle" fontSize="10" fill="var(--fg-tertiary)" fontFamily="var(--font-mono)" fontWeight="500">{s}s</text>
      ))}

      {/* Benchmark line — thin, dashed */}
      <path d={path(benchmark)} fill="none" stroke="var(--fg-tertiary)" strokeWidth="1.25" strokeDasharray="3 3" />

      {/* This post — thick clay line */}
      <path d={path(thisPost)} fill="none" stroke="var(--accent-primary)" strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round" />

      {/* Drop annotation */}
      <line x1={dropX} y1={pad.top} x2={dropX} y2={pad.top + H} stroke="var(--tone-danger)" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
      <circle cx={dropX} cy={dropY} r="4" fill="var(--surface-1)" stroke="var(--tone-danger)" strokeWidth="1.75" />
      <g transform={`translate(${dropX + 12}, ${dropY - 12})`}>
        <rect x="0" y="0" width="138" height="38" rx="4" fill="var(--surface-ink)" />
        <text x="10" y="15" fontSize="10" fill="var(--surface-2)" fontFamily="var(--font-mono)" fontWeight="500" letterSpacing="0.06em">DROP · 0:03</text>
        <text x="10" y="30" fontSize="11" fill="var(--surface-1)" fontFamily="var(--font-sans)" fontWeight="500">−14% vs benchmark</text>
      </g>

      {/* Y axis line */}
      <line x1={pad.left} x2={pad.left} y1={pad.top} y2={pad.top + H} stroke="var(--fg-primary)" strokeWidth="1" />
      <line x1={pad.left} x2={pad.left + W} y1={pad.top + H} y2={pad.top + H} stroke="var(--fg-primary)" strokeWidth="1" />

      {/* Y unit label */}
      <text x={pad.left - 32} y={pad.top - 8} fontSize="10" fill="var(--fg-tertiary)" fontFamily="var(--font-mono)" fontWeight="500" letterSpacing="0.06em">% VIEWING</text>
    </svg>
  );
}

// Comments distribution — proper bars with annotation, axes, gridlines.
function HfCommentsBars({ width = 320, height = 180 }) {
  const pad = { top: 16, right: 12, bottom: 28, left: 28 };
  const W = width - pad.left - pad.right;
  const H = height - pad.top - pad.bottom;
  const data = [
    { label: 'Safety', v: 64, accent: true },
    { label: 'Wrecks', v: 52 },
    { label: 'Gear', v: 31 },
    { label: 'Reefs', v: 24 },
    { label: 'Travel', v: 18 },
    { label: 'Misc', v: 9 },
  ];
  const max = 70;
  const barW = W / data.length - 8;
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      {[0, 20, 40, 60].map(t => (
        <g key={t}>
          <line x1={pad.left} x2={pad.left + W} y1={pad.top + H - (t / max) * H} y2={pad.top + H - (t / max) * H} stroke="var(--border-subtle)" strokeWidth="1" />
          <text x={pad.left - 6} y={pad.top + H - (t / max) * H + 3} textAnchor="end" fontSize="9.5" fill="var(--fg-tertiary)" fontFamily="var(--font-mono)" fontWeight="500">{t}</text>
        </g>
      ))}
      {data.map((d, i) => {
        const h = (d.v / max) * H;
        return (
          <g key={i}>
            <rect x={pad.left + i * (barW + 8) + 4} y={pad.top + H - h} width={barW} height={h} fill={d.accent ? 'var(--accent-primary)' : 'var(--fg-primary)'} opacity={d.accent ? 1 : 0.18} rx="0" />
            <text x={pad.left + i * (barW + 8) + 4 + barW / 2} y={pad.top + H + 16} textAnchor="middle" fontSize="10" fill="var(--fg-secondary)" fontFamily="var(--font-sans)" fontWeight="500">{d.label}</text>
            {d.accent && (
              <text x={pad.left + i * (barW + 8) + 4 + barW / 2} y={pad.top + H - h - 4} textAnchor="middle" fontSize="10" fill="var(--accent-primary)" fontFamily="var(--font-mono)" fontWeight="600">{d.v}</text>
            )}
          </g>
        );
      })}
      <line x1={pad.left} x2={pad.left} y1={pad.top} y2={pad.top + H} stroke="var(--fg-primary)" strokeWidth="1" />
      <line x1={pad.left} x2={pad.left + W} y1={pad.top + H} y2={pad.top + H} stroke="var(--fg-primary)" strokeWidth="1" />
    </svg>
  );
}

// Follower velocity — area + line, weeks on x.
function HfFollowerArea({ width = 320, height = 180 }) {
  const pad = { top: 16, right: 12, bottom: 28, left: 36 };
  const W = width - pad.left - pad.right;
  const H = height - pad.top - pad.bottom;
  const data = [180, 192, 188, 215, 244, 268, 252, 298, 342, 388, 364, 412];
  const max = 450, min = 100;
  const x = (i) => pad.left + (i / (data.length - 1)) * W;
  const y = (v) => pad.top + H - ((v - min) / (max - min)) * H;
  const path = data.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ');
  const area = `M${x(0)},${y(min)} ` + data.map((v, i) => `L${x(i)},${y(v)}`).join(' ') + ` L${x(data.length - 1)},${y(min)} Z`;
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      {[100, 200, 300, 400].map(t => (
        <g key={t}>
          <line x1={pad.left} x2={pad.left + W} y1={y(t)} y2={y(t)} stroke="var(--border-subtle)" />
          <text x={pad.left - 6} y={y(t) + 3} textAnchor="end" fontSize="9.5" fill="var(--fg-tertiary)" fontFamily="var(--font-mono)">{t}</text>
        </g>
      ))}
      <path d={area} fill="var(--accent-soft)" opacity="0.6" />
      <path d={path} fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinejoin="round" />
      {data.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r="2" fill="var(--accent-primary)" />
      ))}
      {/* Annotated peak */}
      <g transform={`translate(${x(11) - 56}, ${y(412) - 28})`}>
        <rect width="56" height="20" rx="3" fill="var(--surface-ink)" />
        <text x="6" y="13" fontSize="10" fill="var(--surface-1)" fontFamily="var(--font-mono)" fontWeight="600">+412 wk</text>
      </g>
      <line x1={pad.left} x2={pad.left} y1={pad.top} y2={pad.top + H} stroke="var(--fg-primary)" strokeWidth="1" />
      <line x1={pad.left} x2={pad.left + W} y1={pad.top + H} y2={pad.top + H} stroke="var(--fg-primary)" strokeWidth="1" />
      {['12w', '8w', '4w', 'now'].map((l, i) => (
        <text key={l} x={pad.left + (i / 3) * W} y={pad.top + H + 16} textAnchor="middle" fontSize="9.5" fill="var(--fg-tertiary)" fontFamily="var(--font-mono)" fontWeight="500">{l}</text>
      ))}
    </svg>
  );
}

// Heat-strip — retention by post (each row = a post, color = retention)
function HfHeatStrip({ width = 560, height = 120 }) {
  const posts = [
    { id: '0042', title: 'Tank check that saved my life',     ret: 71, hook: 1.1 },
    { id: '0041', title: 'Buoyancy controls every safety call', ret: 64, hook: 1.4 },
    { id: '0040', title: 'Why I stopped using a dive computer', ret: 58, hook: 1.6 },
    { id: '0039', title: 'Truk Lagoon · why this wreck',       ret: 71, hook: 0.9 },
    { id: '0038', title: 'Reef I keep coming back to',         ret: 58, hook: 1.3 },
    { id: '0037', title: 'Decompression illness · what to do',  ret: 55, hook: 1.5 },
    { id: '0036', title: 'My weight pocket setup',              ret: 49, hook: 2.1 },
    { id: '0035', title: 'Three regulators tested',             ret: 52, hook: 1.9 },
    { id: '0034', title: 'When the visibility drops',           ret: 47, hook: 2.4 },
    { id: '0033', title: 'Fiji series · part 1',                ret: 51, hook: 1.7 },
    { id: '0032', title: 'Why current matters more than depth', ret: 54, hook: 1.5 },
    { id: '0031', title: 'A safety call I got wrong',           ret: 58, hook: 1.2 },
  ];
  const cellW = (width - 80) / posts.length;
  const cellH = 28;
  // Color: clay for low retention, ink for high.
  const colorFor = (v) => {
    const t = (v - 40) / 35; // 40..75 mapped 0..1
    const c = Math.max(0, Math.min(1, t));
    // interpolate between clay and ink
    return `rgba(26, 24, 21, ${(0.15 + c * 0.7).toFixed(2)})`;
  };
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      {/* Threshold marker (50%) */}
      {posts.map((p, i) => {
        const x = 60 + i * cellW;
        const lowRet = p.ret < 50;
        return (
          <g key={p.id}>
            <rect x={x} y={20} width={cellW - 2} height={cellH} fill={lowRet ? 'var(--tone-danger)' : colorFor(p.ret)} rx="2" />
            <text x={x + (cellW - 2) / 2} y={20 + cellH / 2 + 3} textAnchor="middle" fontSize="9.5" fill={p.ret < 55 ? 'var(--surface-1)' : 'var(--surface-1)'} fontFamily="var(--font-mono)" fontWeight="600">{p.ret}</text>
            <text x={x + (cellW - 2) / 2} y={66} textAnchor="middle" fontSize="9" fill="var(--fg-tertiary)" fontFamily="var(--font-mono)" fontWeight="500">{p.id}</text>
            <rect x={x} y={76} width={cellW - 2} height={Math.min(28, p.hook * 11)} fill="var(--accent-primary)" opacity="0.5" rx="1" />
          </g>
        );
      })}
      {/* Y label */}
      <text x="0" y="35" fontSize="9.5" fill="var(--fg-tertiary)" fontFamily="var(--font-mono)" fontWeight="500" letterSpacing="0.06em">RET %</text>
      <text x="0" y="91" fontSize="9.5" fill="var(--fg-tertiary)" fontFamily="var(--font-mono)" fontWeight="500" letterSpacing="0.06em">HOOK</text>
    </svg>
  );
}

Object.assign(window, { HfRetentionChart, HfCommentsBars, HfFollowerArea, HfHeatStrip });
