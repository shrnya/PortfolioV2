// Turns dist/ into dist-preview/ for sharing as a static Artifact:
// root-absolute links become relative, directory links point at index.html,
// and the home page loses its document skeleton (the host adds its own).
import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';

const src = 'dist', out = 'dist-preview';
const walk = (d) => readdirSync(d).flatMap((f) => statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]);

for (const file of walk(src)) {
  const rel = relative(src, file);
  mkdirSync(dirname(join(out, rel)), { recursive: true });
  let s = readFileSync(file, 'utf8');
  if (file.endsWith('.html')) {
    const up = '../'.repeat(rel.split('/').length - 1) || './';
    s = s.replace(/(href|src|poster)="\/(?!\/)([^"]*)"/g, (_, a, p) => {
      const [path, hash = ''] = p.split('#');
      const target = path === '' || path.endsWith('/') ? path + 'index.html' : path;
      return `${a}="${up}${target}${hash ? '#' + hash : ''}"`;
    });
    if (rel === 'index.html') {
      s = s.replace(/<!doctype html>/i, '').replace(/<\/?html[^>]*>/g, '').replace(/<\/?head>/g, '')
        .replace(/<body[^>]*>/, '').replace('</body>', '')
        .replace(/<meta charset[^>]*>|<meta name="viewport"[^>]*>/g, '')
        .replace(/<title>/, '<meta name="claude:viewport-fit-sides" content="cover"><title>');
    }
  }
  writeFileSync(join(out, rel), s);
}
console.log('preview ready');
