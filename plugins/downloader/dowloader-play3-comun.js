import yts from "yt-search";
import fetch from "node-fetch";
import ytdl from "@distube/ytdl-core";

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `🎵 Por favor, proporciona el nombre de una canción o video para buscar.\n\n*Ejemplo:*\n*${usedPrefix + command} Joji - Glimpse of Us*`;
    }

    try {
        await global.loading?.(m, conn);

        let search = await yts(text);
        let videos = search.videos;

        if (!Array.isArray(videos) || videos.length === 0) {
            throw `❌ No se encontraron resultados para "${text}".`;
        }

        let video = videos[0];
        const url = video.url;

        const responseText = `
*⎯⎯ㅤㅤִㅤㅤ୨   ❀  ୧ㅤㅤִ   ㅤ⎯⎯*
> *- ${video.title}*
*⎯⎯ㅤㅤִㅤㅤ୨   ❒  ୧ㅤㅤִ   ㅤ⎯⎯*
> ₊·( 🜸 ) *αᥙ𝗍ᦅ𝗋 »* ${video.author.name} ${video.author.verified ? '✅' : ''}
> ₊·( ❒ ) *d𝖾sc »* Duración: ${video.timestamp} • Vistas: ${formatNumber(video.views)}
> ₊·( ꕤ ) *𝖾𝗇lαc𝖾 »* ${video.url}
*⎯⎯ㅤㅤִㅤㅤ୨   ❒  ୧ㅤㅤִ   ㅤ⎯⎯*
`.trim();

        // Enviar la info primero
        await conn.sendMessage(m.chat, {
            image: { url: video.thumbnail },
            caption: responseText,
        }, { quoted: m });

        // Luego descargar y enviar el audio
        const info = await ytdl.getInfo(url);
        const audioFormat = ytdl.chooseFormat(info.formats, { quality: "highestaudio" });
        const audioUrl = audioFormat.url;

        await conn.sendMessage(m.chat, {
            audio: { url: audioUrl },
            mimetype: "audio/mpeg",
            fileName: `${video.title}.mp3`
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply(`❌ Ocurrió un error al procesar la búsqueda.\n\n*Error:* ${e.message || e}`);
    } finally {
        if (global.loading) await global.loading(m, conn, true);
    }
};

handler.help = ["play3 <búsqueda>"];
handler.tags = ["downloader"];
handler.command = /^play3$/i;

export default handler;

function formatNumber(num) {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    return num.toString();
}
