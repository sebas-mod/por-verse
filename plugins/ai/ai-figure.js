import axios from "axios";
import https from "https";
import { uploader } from "../../lib/uploader.js";

const agent = new https.Agent({
    rejectUnauthorized: false, // ⚠️ Ignora SSL (para evitar errores de certificado)
});

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || "";

    if (!mime || !mime.startsWith("image/")) {
        return m.reply(
            `🖼️ *Responde a una imagen para convertirla en figurine.*\n\n` +
            `👉 Ejemplo: responde a una foto con *${usedPrefix + command}*`
        );
    }

    await global.loading(m, conn);

    try {
        // 📥 Descargar imagen
        let buffer = await q.download();
        if (!buffer) throw new Error("No se pudo descargar la imagen.");

        // ☁️ Subir imagen con tu uploader (catbox / etc.)
        let urlUpload = await uploader(buffer).catch(() => null);
        if (!urlUpload) throw new Error("Error al subir la imagen.");

        // 🌐 Llamada a la API figurine
        let apiUrl = `https://api.deline.my.id/ai/figurine?url=${encodeURIComponent(urlUpload)}`;
        let { data: json } = await axios.get(apiUrl, { httpsAgent: agent });

        if (!json.status || !json.result?.url) throw new Error("Error en la API.");

        // 📤 Enviar resultado
        await conn.sendFile(
            m.chat,
            json.result.url,
            "figurine.jpg",
            `✨ *Figurine generada con éxito*`,
            m
        );
    } catch (e) {
        console.error(e);
        await m.reply(`❌ *Error al generar figurine.*\n📄 ${e.message}`);
    } finally {
        await global.loading(m, conn, true);
    }
};

handler.help = ["figurine"];
handler.tags = ["ai"];
handler.command = /^figurine$/i;

export default handler;