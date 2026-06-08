import { verifyJWT } from "@/lib/auth";
import { getMDBSingleData } from "@/db/mongoQueries";
import { NextRequest } from "next/server";
import { JwtPayload } from "jsonwebtoken";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const token = req.cookies.get('GHGAuthToken')?.value;
    if (!token) return new Response('Unauthorized', { status: 401 });

    const verifyJWTToken = verifyJWT(token);
    if (!verifyJWTToken || typeof verifyJWTToken === 'string') return new Response('Unauthorized', { status: 401 });

    const user_id = (verifyJWTToken as JwtPayload).id || null;
    if (!user_id) return new Response('Unauthorized', { status: 401 });

    const encoder = new TextEncoder();
    let interval: NodeJS.Timeout;

    const stream = new ReadableStream({
        start(controller) {
            interval = setInterval(async () => {
                try {
                    const { getMDBData } = await import("@/db/mongoQueries");
                    const notifications = await getMDBData("notifications", {
                        user_id: user_id,
                        $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }],
                    });
                    const data = `data: ${JSON.stringify(notifications)}\n\n`;
                    controller.enqueue(encoder.encode(data));
                } catch {
                    controller.close();
                }
            }, 5000);
        },
        cancel() {
            clearInterval(interval);
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}