import yts from "yt-search";

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `🎵 Por favor, proporciona el nombre de una canción o video para buscar.\n\n*Ejemplo:*\n*${usedPrefix + command} Joji - Glimpse of Us*`;
    }
    
    try {
        await global.loading(m, conn);
        let search = await yts(text);
        let videos = search.videos;

        if (!Array.isArray(videos) || videos.length === 0) {
            throw `❌ No se encontraron resultados para "${text}".`;
        }

        let video = videos[0];

        // --- INICIO DEL NUEVO DISEÑO PARA LA RESPUESTA DEL BOT ---
        const responseText = `
*⎯⎯ㅤㅤִㅤㅤ୨   ❀  ୧ㅤㅤִ   ㅤ⎯⎯*
> *- ${video.title}*
*⎯⎯ㅤㅤִㅤㅤ୨   ❒  ୧ㅤㅤִ   ㅤ⎯⎯*
> ₊·( 🜸 ) *αᥙ𝗍ᦅ𝗋 »* ${video.author.name} ${video.author.verified ? '✅' : ''}
> ₊·( ❒ ) *d𝖾sc »* Duración: ${video.timestamp} • Vistas: ${formatNumber(video.views)}
> ₊·( ꕤ ) *𝖾𝗇lαc𝖾 »* ${video.url}
*⎯⎯ㅤㅤִㅤㅤ୨   ❒  ୧ㅤㅤִ   ㅤ⎯⎯*
        `.trim();
        // --- FIN DEL NUEVO DISEÑO ---

        await conn.sendMessage(
            m.chat,
            {
                image: { url: video.thumbnail },
                caption: responseText, // Se usa el nuevo texto decorado aquí
                footer: "Búsqueda de YouTube",
                interactiveButtons: [
                    {
                        name: "single_select",
                        buttonParamsJson: JSON.stringify({
                            title: "🎶 Opciones de Descarga",
                            sections: [
                                {
                                    title: "Formatos Disponibles",
                                    rows: [
                                        { header: "🎵 Audio Directo", title: "Audio (MP3)", description: "Descargar el audio para escuchar.", id: `.ytmp3 ${video.url}` },
                                        { header: "🎥 Video Directo", title: "Video (MP4)", description: "Descargar el video para ver.", id: `.ytmp4 ${video.url}` },
                                        { header: "📄 Documento de Audio", title: "Audio (Documento)", description: "Conserva calidad y nombre de archivo.", id: `.ytadoc ${video.url}` },
                                        { header: "📄 Documento de Video", title: "Video (Documento)", description: "Ideal para guardar o compartir.", id: `.ytvdoc ${video.url}` }
                                    ],
                                },
                            ],
                        }),
                    },
                ],
                hasMediaAttachment: false,
            },
            { quoted: m }
        );

    } catch (e) {
        console.error(e);
        m.reply(`❌ Ocurrió un error al procesar la búsqueda.\n\n*Error:* ${e.message || e}`);
    } finally {
        if (global.loading) {
            await global.loading(m, conn, true);
        }
    }
};

handler.help = ["play <búsqueda>"];
handler.tags = ["downloader"];
handler.command = /^(play)$/i;

export default handler;

function formatNumber(num) {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    return num.toString();
}