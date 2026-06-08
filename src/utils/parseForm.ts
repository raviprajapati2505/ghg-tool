
import { IncomingMessage } from "http";
import { Readable } from "stream";

/**
 * Convert NextRequest to Node.js IncomingMessage-compatible stream
 */
export function toNodeStream(req: Request): IncomingMessage {
    const readable = Readable.from(req.body as any);
    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
        headers[key] = value;
    });

    const stream = Object.assign(readable, {
        headers,
        method: req.method,
        url: req.url,
    });

    return stream as unknown as IncomingMessage;
}
