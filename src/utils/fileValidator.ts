import { fileTypeFromFile } from "file-type";
import fs from "fs/promises";

// -----------------------------
// GLOBAL HIGH SECURITY VALIDATION
// -----------------------------
export async function validateFile(
    filePath: string,
    originalName: string,
    allowed: string[]
) {
    allowed = allowed.map(a => a.toLowerCase());

    // --------------------------
    //  Real File Type Check
    // --------------------------
    const detected = await fileTypeFromFile(filePath);

    if (!detected || !allowed.includes(detected.ext)) {
        throw new Error(`Invalid file type. Allowed: ${allowed.join(", ")}`);
    }

    // --------------------------
    // Check Extension
    // --------------------------
    const ext = originalName.split(".").pop()?.toLowerCase();

    if (!ext || !allowed.includes(ext)) {
        throw new Error(`Invalid file extension. Allowed: ${allowed.join(", ")}`);
    }

    // --------------------------
    //  Ensure match real <-> extension
    // --------------------------
    if (detected.ext !== ext) {
        throw new Error("File extension does not match file content.");
    }


    // --------------------------
    //  XLSX MUST be ZIP
    // --------------------------
    if (detected.ext === "xlsx") {
        const data = await fs.readFile(filePath);

        const zipHeader = Buffer.from([0x50,0x4b,0x03,0x04]);

        if (!data.subarray(0,4).equals(zipHeader)) {
            throw new Error("Invalid XLSX structure (not a ZIP file).");
        }
    }


    // --------------------------
    //  XLS MUST have OLE header
    // --------------------------
    if (detected.ext === "xls") {
        const data = await fs.readFile(filePath);

        const header = Buffer.from([0xD0,0xCF,0x11,0xE0]);

        if (!data.subarray(0,4).equals(header)) {
            throw new Error("Invalid XLS structure.");
        }
    }


    // --------------------------
    //  CSV simple structure check
    // --------------------------
    if (detected.ext === "csv") {
        const text = await fs.readFile(filePath, "utf8");

        if (!text.includes(",")) {
            throw new Error("Invalid CSV format.");
        }

        if (text.length > 3_000_000) {
            throw new Error("CSV too large.");
        }
    }


    return true;
}
