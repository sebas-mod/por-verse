import fs from "fs/promises";
import crypto from "crypto";
import { execFile } from "child_process";
import { promisify } from "util";
import webp from "node-webpmux";

const execFileAsync = promisify(execFile);
const fetchFn = globalThis.fetch || (await import("node-fetch")).default;

async function sticker(
    { filename, mime, ext },
    { packName = "", authorName = "", crop = false, fps = 15, duration = 30 } = {}
) {
    if (!filename) throw new Error("No se proporcionó archivo de entrada.");

    try {
        await fs.access(filename);
    } catch {
        throw new Error(`Archivo no encontrado: ${filename}`);
    }

    const isVideo =
        /^video\//.test(mime) ||
        ["mp4", "webm", "mkv", "mov", "avi"].includes((ext || "").toLowerCase()) ||
        mime === "image/gif";

    const fpsSafe = Math.max(1, Math.min(Number.isFinite(fps) ? fps : 15, 30));
    const durSafe = Math.max(1, Math.min(Number.isFinite(duration) ? duration : 30, 30));
    const outPath = filename.replace(/\.[^/.]+$/, "") + ".webp";
    const TARGET = 900 * 1024;

    const mkVf = (scale, wantFps) => {
        const fit = `scale=${scale}:${scale}:force_original_aspect_ratio=decrease`;
        const box = crop
            ? `crop=${scale}:${scale}`
            : `pad=${scale}:${scale}:-1:-1:color=black@0`;
        return isVideo
            ? `${fit},${box},fps=${wantFps},format=yuva420p`
            : `${fit},${box},format=yuva420p`;
    };

    async function encodeOnce({ scale, q, fps }) {
        try {
            const vf = mkVf(scale, fps);
            const args = ["-y", "-i", filename, "-vf", vf, "-vcodec", "libwebp", "-compression_level", "6"];

            if (isVideo) {
                args.push("-t", String(durSafe), "-an", "-preset", "picture", "-q:v", String(q), outPath);
            } else {
                args.push("-frames:v", "1", "-preset", "picture", "-q:v", String(q), outPath);
            }

            await execFileAsync("ffmpeg", args);
            const stat = await fs.stat(outPath);
            const buf = await fs.readFile(outPath);
            return { size: stat.size, buffer: buf };
        } catch (err) {
            console.error(`⚠️ Error en encodeOnce (q=${q}, fps=${fps}, scale=${scale}):`, err.message);
            return { size: Infinity, buffer: Buffer.alloc(0) };
        }
    }

    const tries = [];
    const qList = [70, 75, 80, 85, 90];
    const fpsList = isVideo ? [fpsSafe, Math.max(12, fpsSafe - 3), 10, 8] : [fpsSafe];
    const scaleList = [512, 480, 448, 416, 384, 360];

    for (const q of qList)
        for (const f of fpsList)
            for (const s of scaleList)
                tries.push({ q, fps: f, scale: s });

    let outBuf = null;
    for (const plan of tries) {
        const { size, buffer } = await encodeOnce(plan);
        if (buffer.length) outBuf = buffer;
        if (size <= TARGET) break;
    }

    if (!outBuf || !outBuf.length) throw new Error("No se pudo generar el sticker correctamente.");

    const imgWebp = new webp.Image();
    await imgWebp.load(outBuf);

    const exifJson = {
        "sticker-pack-id": crypto.randomBytes(16).toString("hex"),
        "sticker-pack-name": packName,
        "sticker-pack-publisher": authorName,
        emojis: [],
    };

    const exifAttr = Buffer.from([
        0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00,
    ]);

    const jsonBuf = Buffer.from(JSON.stringify(exifJson), "utf8");
    const exif = Buffer.concat([exifAttr, jsonBuf]);
    exif.writeUIntLE(jsonBuf.length, 14, 4);
    imgWebp.exif = exif;

    const finalBuf = await imgWebp.save(null);

    try {
        await fs.unlink(outPath);
    } catch {}

    return finalBuf;
}

async function fakechat(text, name, avatar, url = false, isHD = false) {
    const body = {
        type: "quote",
        format: "png",
        backgroundColor: "#FFFFFF",
        width: isHD ? 1024 : 512,
        height: isHD ? 1536 : 768,
        scale: isHD ? 4 : 2,
        messages: [
            {
                entities: [],
                media: url ? { url } : null,
                avatar: true,
                from: {
                    id: 1,
                    name,
                    photo: { url: avatar },
                },
                text,
                replyMessage: {},
            },
        ],
    };

    const response = await fetchFn("https://btzqc.betabotz.eu.org/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
    const { result } = await response.json();
    if (!result?.image) throw new Error("Respuesta inválida del generador.");

    return Buffer.from(result.image, "base64");
}

export { sticker, fakechat };
