
import { NextRequest, NextResponse } from "next/server";
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";
import { toNodeStream } from "@/utils/parseForm";
import { addFilesToCategory } from "@/apiService/server/projectCategories";
import { authGuard } from "@/helpers/server/authGuard";
export const dynamic = "force-dynamic";

const allowedTypes = ["pdf", "jpeg", "jpg", "png", "webp"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

async function removeFile(filePath: string) {
    try {
        await fs.unlink(filePath);
    } catch { }
}


export async function POST(request: NextRequest) {
    const authUser = await authGuard(request);
    if (authUser instanceof Response) return authUser;

    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
        return NextResponse.json({ status: 400, message: "Invalid content-type" });
    }

    const uploadDir = path.join(process.cwd(), "/uploads/categories_files");
    await fs.mkdir(uploadDir, { recursive: true });

    const form = formidable({
        uploadDir,
        keepExtensions: true,
        maxFileSize: MAX_FILE_SIZE,
        multiples: true,
    });

    const nodeReq = toNodeStream(request);
    return new Promise<NextResponse>((resolve) => {
        form.parse(nodeReq as any, async (err: Error | null, fields: Record<string, any>, files: Record<string, any>) => {
            if (err) {
                return resolve(
                    NextResponse.json({ status: 500, message: "Failed to parse form data" })
                );
            }

            const uploadedFiles = files["files[]"];
            if (!uploadedFiles) {
                return resolve(
                    NextResponse.json({ status: 400, message: "No files found" })
                );
            }

            const filesArray = Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles];
            const result: { uploaded_at: string; original_name: string; name: string; path: string }[] = [];

            for (const file of filesArray) {
                if (file.size > MAX_FILE_SIZE) {
                    await removeFile(file.filepath);
                    return resolve(
                        NextResponse.json({ status: 400, message: "Each file must be less than 2MB" })
                    );
                }

                const ext = (file.originalFilename || "").split(".").pop()?.toLowerCase();
                if (!ext || !allowedTypes.includes(ext)) {
                    await removeFile(file.filepath);
                    return resolve(
                        NextResponse.json({ status: 400, message: "Only PDF or image files are allowed" })
                    );
                }
                result.push({
                    original_name: file.originalFilename,
                    name: file.newFilename,
                    path: path.join("/uploads/categories_files", file.newFilename),
                    uploaded_at: new Date().toISOString(),
                });
            }
            await addFilesToCategory(fields, result);

            return resolve(
                NextResponse.json({
                    status: 200,
                    message: "Files uploaded successfully",
                    data: result,
                })
            );
        });
    });
}


