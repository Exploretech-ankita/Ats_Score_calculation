import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { createRequire } from "module";
import mammoth from "mammoth";
import { parseResumeLocally } from "./localResumeParser.js";

const router = express.Router();
const upload = multer({
    dest: "uploads/"
});

// pdf-parse v2 is CommonJS-flavored; loading it via createRequire avoids
// ESM/CJS interop issues seen with `import`.
const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");

async function extractText(filePath, originalName) {
    const ext = path.extname(originalName).toLowerCase();

    if (ext === ".pdf") {
        const buffer = fs.readFileSync(filePath);
        const parser = new PDFParse({ data: buffer });
        try {
            const result = await parser.getText();
            return result.text;
        } finally {
            await parser.destroy();
        }
    }

    if (ext === ".docx") {
        const result = await mammoth.extractRawText({ path: filePath });
        return result.value;
    }

    throw new Error(`Unsupported file type: ${ext}`);
}

router.post("/parse-resume", upload.single("resume"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            error: "No file uploaded"
        });
    }

    try {
        const resumeText = await extractText(req.file.path, req.file.originalname);

        if (!resumeText || resumeText.trim().length < 20) {
            return res.status(400).json({
                error: "Could not extract readable text from this file"
            });
        }

        const parsed = parseResumeLocally(resumeText);

        res.json({
            fileName: req.file.originalname,
            ...parsed
        });
    }
    catch (err) {
        console.log("Resume parsing error:", err.message);
        res.status(500).json({
            error: "Failed to parse resume"
        });
    }
    finally {
        fs.unlink(req.file.path, (unlinkErr) => {
            if (unlinkErr) {
                console.log("Failed to delete temp upload:", unlinkErr.message);
            }
        });
    }
});

export default router;