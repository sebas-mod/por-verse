import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { tmpdir } from "os";
import { join } from "path";

/**
 * Scraper por Ponta Sensei
 * Adaptado para un plugin de Baileys
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

  if (!res.ok) throw new Error(await res.text());
  const json = await res.json();
  return { extractedText: json.extractedText };
}
// --- Fin del Scraper ---


let handler = async (m, { conn, usedPrefix, command }) => {
    let tempFilePath = null;

    try {
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || q.mediaType || "";
        if (!/image/g.test(mime)) {
            return m.reply(
                `🔎 *Responde o envía una imagen con el comando* ${usedPrefix + command} para extraer el texto.`
            );
        }

        await conn.reply(m.chat, '🔎 *Leyendo el texto de la imagen...*', m);

        const mediaBuffer = await q.download?.();
        if (!mediaBuffer) return m.reply("🍩 *No se pudo descargar la imagen.*");
        
        // Obtenemos la extensión del archivo para guardarlo correctamente
        const ext = mime.split('/')[1] || 'jpg';
        tempFilePath = join(tmpdir(), `${Date.now()}.${ext}`);
        await fs.promises.writeFile(tempFilePath, mediaBuffer);

        const result = await ponta(tempFilePath);
        
        if (!result || !result.extractedText || result.extractedText.trim() === '') {
            return m.reply('No se pudo encontrar ningún texto legible en la imagen.');
        }

        const extractedText = result.extractedText.trim();
        await m.reply(`✅ *Texto Extraído:*\n\n${extractedText}`);

    } catch (e) {
        console.error(e);
        await m.reply("❌ *Ocurrió un error al procesar la imagen:* " + (e.message || e));
    } finally {
        // Limpieza del archivo temporal
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }
    }
};

handler.help = ["ocr"];
handler.tags = ["tools"];
handler.command = /^(ocr|leertexto)$/i;

export default handler;