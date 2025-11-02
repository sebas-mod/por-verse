import fs from "fs";
import path from "path";
import { tmpdir } from "os";
import { join } from "path";

// Fetch compatible con Node 16 y 18+
const fetch = globalThis.fetch || (await import('node-fetch')).default;

/**
 * Scraper por Ponta Sensei
 * Adaptado para un plugin de Baileys por Luis Sebastián
**/
async function ponta(filePath) {
  const url = "https://staging-ai-image-ocr-266i.frontend.encr.app/api/ocr/process";
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = ext === ".png" ? "image/png" : "image/jpeg";
  const imageBase64 = fs.readFileSync(filePath).toString("base64");

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ imageBase64, mimeType })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error en la API OCR: ${text}`);
  }

  const json = await res.json();
  return { extractedText: json.extractedText };
}

let handler = async (m, { conn, usedPrefix, command }) => {
  let tempFilePath = null;

  try {
    const q = m.quoted ? m.quoted : m;
    const mime = q.mimetype || q.mediaType || (q.msg || {}).mimetype || "";

    if (!/image/g.test(mime)) {
      return m.reply(`🖼️ *Responde o envía una imagen con el comando* ${usedPrefix + command} para extraer el texto.`);
    }

    await m.reply('🔎 *Leyendo el texto de la imagen...*');

    const mediaBuffer = q.download ? await q.download() : await conn.downloadMediaMessage(q);
    if (!mediaBuffer) return m.reply("🍩 *No se pudo descargar la imagen.*");

    const ext = mime.split('/')[1] || 'jpg';
    tempFilePath = join(tmpdir(), `${Date.now()}.${ext}`);
    await fs.promises.writeFile(tempFilePath, mediaBuffer);

    const result = await ponta(tempFilePath);

    if (!result?.extractedText?.trim()) {
      return m.reply('❌ *No se encontró texto legible en la imagen.*');
    }

    await m.reply(`✅ *Texto Extraído:*\n\n${result.extractedText.trim()}`);

  } catch (e) {
    console.error(e);
    await m.reply(`⚠️ *Error al procesar la imagen:* ${e.message}`);
  } finally {
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
};

handler.help = ["ocr"];
handler.tags = ["tools"];
handler.command = /^(ocr|leertexto)$/i;

export default handler;
