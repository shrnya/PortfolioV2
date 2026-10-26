// Hand-drawn nature bits for the home illustrations: leaves, stems, webs,
// spiders. Built on the rough helpers so they share the same wobble.
// Placeholders until Sharanya redraws the key ones.
import { rng, line, ellipse, poly } from './rough';

const f = (n: number) => n.toFixed(1);

/** A leaf from (x, y) pointing at `deg`, with a midrib. Returns [outline, rib]. */
export function leaf(x: number, y: number, len: number, deg: number, seed = 1, w = 0.38): [string, string] {
  const r = rng(seed);
  const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  const tip = [x + c * len, y + s * len];
  const wid = len * w * (0.85 + r() * 0.3);
  const n = [-s, c];
  const m1 = [x + c * len * 0.45 + n[0] * wid, y + s * len * 0.45 + n[1] * wid];
  const m2 = [x + c * len * 0.5 - n[0] * wid, y + s * len * 0.5 - n[1] * wid];
  const out = `M${f(x)} ${f(y)}Q${f(m1[0])} ${f(m1[1])} ${f(tip[0])} ${f(tip[1])}Q${f(m2[0])} ${f(m2[1])} ${f(x)} ${f(y)}`;
  const rib = line(x, y, x + c * len * 0.85, y + s * len * 0.85, seed + 3, 0.8);
  return [out, rib];
}

/** A wavy stem through points, drawn as a smooth curve. */
export function stem(points: [number, number][], seed = 1) {
  const r = rng(seed);
  const p = points.map(([x, y]) => [x + (r() - 0.5) * 2, y + (r() - 0.5) * 2]);
  let d = `M${f(p[0][0])} ${f(p[0][1])}`;
  for (let i = 1; i < p.length; i++) {
    const [px, py] = p[i - 1], [cx, cy] = p[i];
    d += `Q${f(px + (cx - px) * 0.5 + (r() - 0.5) * 8)} ${f(py + (cy - py) * 0.5 + (r() - 0.5) * 8)} ${f(cx)} ${f(cy)}`;
  }
  return d;
}

/** Spokes of an orb web from a centre to the anchor points. */
export function spokes(cx: number, cy: number, anchors: [number, number][], seed = 1) {
  return anchors.map(([x, y], i) => line(cx, cy, x, y, seed + i, 1.2));
}

/** One spiral ring of an orb web at a fraction of the way out along each spoke. */
export function ring(cx: number, cy: number, anchors: [number, number][], t: number, seed = 1) {
  const r = rng(seed);
  const pts = anchors.map(([x, y]) => {
    const k = t * (0.92 + r() * 0.16);
    return [cx + (x - cx) * k, cy + (y - cy) * k] as [number, number];
  });
  // threads sag slightly between spokes
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 1; i <= pts.length; i++) {
    const [px, py] = pts[i - 1], [qx, qy] = pts[i % pts.length];
    const mx = (px + qx) / 2, my = (py + qy) / 2;
    d += `Q${f(mx + (cx - mx) * 0.08)} ${f(my + (cy - my) * 0.08)} ${f(qx)} ${f(qy)}`;
  }
  return d;
}

/** A small spider: body, head and eight bent legs. Returns paths. */
export function spider(x: number, y: number, size = 1, seed = 1) {
  const s = size;
  const body = ellipse(x, y + 6 * s, 6 * s, 7.5 * s, seed, 0.4);
  const head = ellipse(x, y - 3 * s, 4 * s, 3.6 * s, seed + 1, 0.3);
  const legs: string[] = [];
  [-1, 1].forEach((side) => {
    [[-6, -16, -14], [-2, -18, -4], [2, -18, 6], [6, -14, 16]].forEach(([oy, kx, fy], i) => {
      legs.push(poly([[x + side * 3 * s, y + oy * s * 0.4 + 2 * s], [x + side * Math.abs(kx) * s, y + (oy - 6) * s], [x + side * (Math.abs(kx) + 5) * s, y + fy * s]], seed + 10 + i + (side > 0 ? 5 : 0), 0.3));
    });
  });
  return { body, head, legs };
}
