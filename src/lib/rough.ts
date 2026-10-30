// Deterministic "hand-drawn" SVG paths, generated at build time so every
// doodle looks the same on every load. Swap for scanned drawings later.

export function rng(seed: number) {
  let s = (seed * 2654435761) >>> 0 || 1;
  return () => {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
    return ((s >>> 0) % 10000) / 10000;
  };
}

const f = (n: number) => n.toFixed(1);
const wob = (r: () => number, j: number) => (r() - 0.5) * j * 2;

export function line(x1: number, y1: number, x2: number, y2: number, seed = 1, j = 1.4) {
  const r = rng(seed);
  const mx = (x1 + x2) / 2 + wob(r, j), my = (y1 + y2) / 2 + wob(r, j);
  return `M${f(x1 + wob(r, j / 2))} ${f(y1 + wob(r, j / 2))}Q${f(mx)} ${f(my)} ${f(x2 + wob(r, j / 2))} ${f(y2 + wob(r, j / 2))}`;
}

/** Two loose passes around a rectangle, like a quick pen box. */
export function rect(x: number, y: number, w: number, h: number, seed = 1, j = 1.6) {
  let d = '';
  for (let p = 0; p < 2; p++) {
    const s = seed * 10 + p * 4;
    d += line(x, y, x + w, y, s, j) + line(x + w, y, x + w, y + h, s + 1, j)
       + line(x + w, y + h, x, y + h, s + 2, j) + line(x, y + h, x, y, s + 3, j);
  }
  return d;
}

/** A slightly overshooting loop, like a circled word. */
export function ellipse(cx: number, cy: number, rx: number, ry: number, seed = 1, j = 1.2) {
  const r = rng(seed);
  const steps = 26, start = r() * Math.PI * 2, sweep = Math.PI * 2.15;
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const a = start + (sweep * i) / steps;
    const k = 1 + wob(r, j) / Math.max(rx, ry);
    d += `${i ? 'L' : 'M'}${f(cx + Math.cos(a) * rx * k)} ${f(cy + Math.sin(a) * ry * k)}`;
  }
  return d;
}

/** A wobbly polyline through points. */
export function poly(points: [number, number][], seed = 1, j = 1.2) {
  const r = rng(seed);
  return points.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x + wob(r, j))} ${f(y + wob(r, j))}`).join('');
}

/** Hand-drawn arrow from a to b with a small open head. */
export function arrow(x1: number, y1: number, x2: number, y2: number, seed = 1) {
  const a = Math.atan2(y2 - y1, x2 - x1), h = 6;
  const l = (t: number) => `M${f(x2)} ${f(y2)}L${f(x2 - Math.cos(a + t) * h)} ${f(y2 - Math.sin(a + t) * h)}`;
  return line(x1, y1, x2, y2, seed, 3) + l(0.5) + l(-0.5);
}

/** Smooth line chart path through values scaled into a box. */
export function chart(values: number[], x: number, y: number, w: number, h: number, min: number, max: number) {
  const pts = values.map((v, i) => [x + (w * i) / (values.length - 1), y + h - ((v - min) / (max - min)) * h]);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1], [cx, cy] = pts[i], mx = (px + cx) / 2;
    d += `C${f(mx)} ${f(py)} ${f(mx)} ${f(cy)} ${f(cx)} ${f(cy)}`;
  }
  return { d, pts };
}
