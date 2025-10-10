import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import { tmpdir } from "os";
import { join } from "path";

// --- Scraper de CodeGood (sin cambios) ---
async function enhanceImage(filePath) {
    try {
        const form = new FormData();
        form.append("file", fs.createReadStream(filePath));
        const response = await axios.post("https://enhanceit.pro/proxy-1.php", form, {
            headers: form.getHeaders(),
            responseType: 'json'
        });
        return response.data.output_url;
    } catch (error) {
        console.error("Error en el scraper de HD:", error.message);
        return null;
    }
}


let handler = async (m, { conn, usedPrefix, command }) => {
    let tempFilePath = null; // Definimos la variable fuera del try para que sea accesible en finally
    
    try {
        // 1. Detección de media (imagen)
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || q.mediaType || "";
        if (!/image/g.test(mime)) {
            return m.reply(
                `🍚 *Responde o envía una imagen con el comando* ${usedPrefix + command} para mejorar su calidad.`
            );
        }

        // 2. Indicador de "cargando" (si tu bot lo soporta)
        // Si no tienes una función global.loading, puedes reemplazar esto con un m.reply
        await conn.reply(m.chat, '⏳ *Procesando imagen, espera por favor...*', m);

        // 3. Descarga de la media a un buffer
        let mediaBuffer = await q.download?.();
        if (!mediaBuffer) return m.reply("🍩 *No se pudo descargar la imagen.*");

        // 4. Guardado del buffer en un archivo temporal
        tempFilePath = join(tmpdir(), `${Date.now()}.jpg`);
        await fs.promises.writeFile(tempFilePath, mediaBuffer);

        // 5. Procesamiento con el scraper
        const enhancedUrl = await enhanceImage(tempFilePath);
        if (!enhancedUrl) throw new Error('La API no devolvió un resultado válido.');

        // 6. Envío del resultado
        await conn.sendFile(m.chat, enhancedUrl, 'enhanced.jpg', '✅ ¡Aquí tienes tu imagen en HD!', m);

    } catch (e) {
        console.error(e);
        await m.reply("❌ *No se pudo mejorar la imagen:* " + e.message);
    } finally {
        // 7. Limpieza del archivo temporal
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }
    }
};

handler.help = ["hd"];
handler.tags = ["tools"];
handler.command = /^(hd|enhance|mejorar)$/i;
handler.cooldown = 20;

export default handler;