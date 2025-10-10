/*
 • Plugin: YouTube Scraper (Clipto)
 • By: Kenisawadev
 • Uso: .ytdl <URL>
*/

import axios from "axios";

async function ytdlid(videoUrl) {
    try {
        const response = await axios.post(
            'https://www.clipto.com/api/youtube',
            { url: videoUrl },
            {
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36',
                    'Referer': 'https://www.clipto.com/id/media-downloader/youtube-downloader',
                },
            }
        );
        return response.data;
    } catch (error) {
        return { error: true, details: error.message };
    }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`⚠️ Uso correcto: ${usedPrefix}${command} <URL de YouTube>`);

    await m.reply("⏳ Buscando video, por favor espera...");

    const data = await ytdlid(text);

    if (data.error) {
        return m.reply(`❌ Ocurrió un error:\n${data.details || "Sin detalles disponibles"}`);
    }

    // Devuelve toda la respuesta JSON como texto
    let replyText = `🎬 *Respuesta del Scraper:*\n\n\`\`\`${JSON.stringify(data, null, 2)}\`\`\``;

    await m.reply(replyText);
};

handler.help = ["test"];
handler.command = /^(test)$/i;

export default handler;