import axios from "axios";
import https from "https";

const agent = new https.Agent({
    rejectUnauthorized: false, // 🚨 Ignora SSL solo en esta request
});

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(
            `💬 *Usa este comando para hablar con DeepSeek AI.*\n\n` +
            `👉 *Ejemplo:* ${usedPrefix + command} Hola, ¿cómo estás?`
        );
    }

    await global.loading(m, conn);

    try {
        let apiUrl = `https://api.deline.my.id/ai/deepseek-v3?q=${encodeURIComponent(text)}`;

        // 🚀 Llamada con axios + agente que ignora SSL
        let { data: json } = await axios.get(apiUrl, { httpsAgent: agent });

        if (!json.status || !json.result?.response) throw new Error("Error en la API.");

        await m.reply(`🤖 *DeepSeek*: ${json.result.response}`);
    } catch (e) {
        console.error(e);
        await m.reply(`❌ *Error al consultar DeepSeek.*\n📄 ${e.message}`);
    } finally {
        await global.loading(m, conn, true);
    }
};

handler.help = ["deepseek <texto>"];
handler.tags = ["ai"];
handler.command = /^(deepseek)$/i;

export default handler;