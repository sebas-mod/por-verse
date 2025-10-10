import { convert } from "../../lib/convert.js";

let handler = async (m, { conn }) => {
    try {
        let q = m.quoted || m;
        let mime = (q.msg || q).mimetype || "";

        if (!/^(video|audio)\//.test(mime)) {
            return m.reply("🍙 *Responde a un video o nota de voz que quieras convertir en PTT (nota de voz).*");
        }

        await global.loading(m, conn);

        let type = mime.split("/")[0];
        let media = await conn.downloadM(q, type);
        if (!media) return m.reply("🍔 *Error al descargar el archivo.*");

        let audio = await convert(media, { format: "mp3" });
        if (!audio) return m.reply("🍡 *No se pudo realizar la conversión.*");

        await conn.sendFile(m.chat, audio, "voice.mp3", "✅ *Archivo convertido a Nota de Voz (PTT).* 🎤", m, true, {
            mimetype: "audio/mpeg",
        });
    } catch (e) {
        console.error(e);
        m.reply("🍩 *Ocurrió un error inesperado durante la conversión.*");
    } finally {
        await global.loading(m, conn, true);
    }
};

handler.help = ["topt", "tovn"];
handler.tags = ["audio", "tools"];
handler.command = /^(toptt|tovn)$/i;

export default handler;