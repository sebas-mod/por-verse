import axios from "axios";
import https from "https";

const agent = new https.Agent({
    rejectUnauthorized: false, // Ignora SSL (para evitar error de certificado)
});

let handler = async (m, { text, conn, usedPrefix, command }) => {
    if (!text) {
        return m.reply(
            `✍️ *Escribe un mensaje para preguntar a Gemini.*\n\n` +
            `👉 Ejemplo: *${usedPrefix + command} Hola, ¿cómo estás?*`
        );
    }

    await global.loading(m, conn);

    try {
        let apiUrl = `https://api.deline.my.id/ai/gemini-2.0?q=${encodeURIComponent(text)}`;
        let { data: json } = await axios.get(apiUrl, { httpsAgent: agent });

        if (!json.status || !json.result?.response) {
            throw new Error("La API no devolvió respuesta.");
        }

        await m.reply(`🤖 *Gemini-2.0*\n\n${json.result.response}`);
    } catch (e) {
        console.error(e);
        await m.reply(`❌ *Error al conectar con Gemini.*\n📄 ${e.message}`);
    } finally {
        await global.loading(m, conn, true);
    }
};

handler.help = ["gemini <texto>"];
handler.tags = ["ai"];
handler.command = /^gemini$/i;

export default handler;