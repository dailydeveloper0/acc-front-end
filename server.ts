import { createServer, IncomingMessage, ServerResponse } from "http";
import next from "next";
import { parse, UrlWithParsedQuery } from "url";

const port: number = Number(process.env.PORT) || 3000;
const dev: boolean = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req: IncomingMessage, res: ServerResponse) => {
    // `req.url` is possibly undefined on IncomingMessage, so provide a fallback when parsing
    const parsedUrl: UrlWithParsedQuery = parse(req.url ?? "/", true);
    // `handle` accepts (req, res, parsedUrl) — typed loosely by Next, so we just call it directly
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (handle as any)(req, res, parsedUrl);
  }).listen(port, (err?: Error) => {
    if (err) {
      throw err;
    }
    // eslint-disable-next-line no-console
    console.log(`> Ready on http://localhost:${port}`);
  });
}).catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to prepare Next app", err);
  process.exit(1);
});
