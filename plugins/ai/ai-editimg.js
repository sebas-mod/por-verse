import axios from "axios";
import https from "https";
import { uploader } from "../../lib/uploader.js";

const agent = new https.Agent({
    rejectUnauthorized: false, // 🚨 Ignora SSL
});

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        return m.reply(
            `📸 *Usa este comando para editar imágenes con IA.*\n\n` +
            `👉 *Ejemplo:* ${usedPrefix + command} Agrega detalles de flamas (responde a una imagen)`
        );
    }

    await global.loading(m, conn);

    try {
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || "";

        let imageUrl = "";
        if (/image\/(jpe?g|png)/.test(mime)) {
            let media = await q.download?.();
            if (!media) return m.reply("❌ *No se pudo descargar la imagen.*");

            imageUrl = await uploader(media).catch(() => null);
            if (!imageUrl) return m.reply("⚠️ *Fallo al subir la imagen al servidor.*");
        } else if (/^https?:\/\//i.test(args[0])) {
            imageUrl = args[0];
            args.shift();
        }

        let prompt = args.join(" ");
        if (!imageUrl) return m.reply("⚠️ *Responde a una imagen o coloca un enlace válido.*");
        if (!prompt) return m.reply("⚠️ *Escribe un prompt para editar la imagen.*");

        let apiUrl = `https://api.deline.my.id/ai/editimg?url=${encodeURIComponent(
            imageUrl
        )}&prompt=${encodeURIComponent(prompt)}`;

        // 🚀 Petición con axios + agente que ignora SSL
        let { data: json } = await axios.get(apiUrl, { httpsAgent: agent });

        if (!json.status || !json.result?.url) throw new Error("Error en la API.");

        await conn.sendMessage(
            m.chat,
            {
                image: { url: json.result.url },
                caption: `✨ *Imagen editada con IA*\n🎨 Prompt: ${prompt}`,
            },
            { quoted: m }
        );
    } catch (e) {
        console.error(e);
        await m.reply(`❌ *Error al editar la imagen.*\n📄 ${e.message}`);
    } finally {
        await global.loading(m, conn, true);
    }
};

handler.help = ["editimg <prompt>"];
handler.tags = ["ai", "maker"];
handler.command = /^(editimg)$/i;

export default handler;