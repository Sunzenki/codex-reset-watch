import { existsSync, readFileSync } from 'node:fs';
import { resolve, sep } from 'node:path';

// Vite's SPA fallback otherwise returns the homepage with 200 for a missing guide.
export default function previewNotFound() {
  return {
    name: 'static-preview-not-found',
    configurePreviewServer(server) {
      const root = resolve(server.config.root, server.config.build.outDir);
      server.middlewares.use((req, res, next) => {
        if (!['GET', 'HEAD'].includes(req.method ?? 'GET')) return next();
        let path;
        try { path = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname); }
        catch { return next(); }
        if (path.startsWith('/api/') || /\.[a-z0-9]+$/i.test(path)) return next();
        const target = resolve(root, '.' + path);
        if (!target.startsWith(root + sep) && target !== root) return next();
        if (existsSync(resolve(target, 'index.html')) || existsSync(target + '.html')) return next();
        const fallback = resolve(root, '404.html');
        if (!existsSync(fallback)) return next();
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('X-Robots-Tag', 'noindex, nofollow');
        res.end(req.method === 'HEAD' ? undefined : readFileSync(fallback));
      });
    },
  };
}
