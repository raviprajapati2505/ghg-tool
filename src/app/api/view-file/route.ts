import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { authGuard } from "@/helpers/server/authGuard";

export async function POST(req: NextRequest) {
    try {
        const authUser = await authGuard(req);
        if (authUser instanceof Response) return authUser;

        const body = await req.json();
        const { fileName } = body;

        if (!fileName) {
            return NextResponse.json(
                { status: 400, message: "File name missing" },
                { status: 400 }
            );
        }

        // 🚨 Prevent path traversal
        const safeFileName = path.basename(fileName);

        const uploadDir = path.join(process.cwd(), "uploads", "categories_files");
        const filePath = path.join(uploadDir, safeFileName);

        try {
            await fs.access(filePath);
        } catch {
            return NextResponse.json(
                { status: 404, message: "File not found" },
                { status: 404 }
            );
        }

        const fileBuffer = await fs.readFile(filePath);

        // Detect content type dynamically
        const ext = safeFileName.split(".").pop()?.toLowerCase();

        const contentTypes: any = {
            pdf: "application/pdf",
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            png: "image/png",
            webp: "image/webp",
        };

        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                "Content-Type": contentTypes[ext || ""] || "application/octet-stream",
                "Content-Disposition": `inline; filename="${safeFileName}"`,
            },
        });

    } catch (error) {
        return NextResponse.json(
            { status: 500, message: "Server Error" },
            { status: 500 }
        );
    }
}