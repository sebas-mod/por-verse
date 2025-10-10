import axios from 'axios';
import https from 'https';

// Agente para ignorar la validación del certificado SSL (necesario para la API)
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

// Formatea la duración de segundos a un formato MM:SS
function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = String(seconds % 60).padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw m.reply(`✧ Por favor, proporciona el nombre de una canción o video.\n\n*Ejemplos de uso:*\n*${usedPrefix + command} Under your spell audio*\n*${usedPrefix + command} Bizarrap session 59 video*\n*${usedPrefix + command} Taylor Swift style ytadoc*\n*${usedPrefix + command} Bad Bunny Monaco ytvdoc*`);
    }

    const args = text.split(' ');
    const lastArg = args[args.length - 1].toLowerCase();
    const validFormats = ['audio', 'video', 'ytadoc', 'ytvdoc'];
    
    let format = 'audio'; // Formato por defecto
    let query = text;

    // Comprobar si el último argumento es un formato válido
    if (validFormats.includes(lastArg)) {
        format = lastArg;
        query = args.slice(0, -1).join(' '); // El resto del texto es la búsqueda
    }

    if (!query) {
        throw m.reply(`✧ Debes proporcionar un término de búsqueda junto con el formato.\n\n*Ejemplo:*\n*${usedPrefix + command} Imagine Dragons ${format}*`);
    }

    await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

    try {
        const apiUrl = `https://api.zenzxz.my.id/search/play?query=${encodeURIComponent(query)}`;
        const { data } = await axios.get(apiUrl, { httpsAgent });

        if (data.status !== true || (!data.dl_mp3 && !data.dl_mp4)) {
            throw new Error('No se pudo encontrar contenido para esa búsqueda.');
        }
        
        const metadata = data.metadata;
        const formattedDuration = formatDuration(metadata.duration);

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

        // Usamos un switch para manejar los diferentes formatos de salida
        switch (format) {
            case 'audio':
                await conn.sendMessage(m.chat, {
                    audio: { url: data.dl_mp3 },
                    mimetype: "audio/mp4",
                    fileName: `${metadata.title}.mp3`,
                    contextInfo: {
                        externalAdReply: {
                            title: metadata.title,
                            body: `Duración: ${formattedDuration}`,
                            thumbnailUrl: metadata.thumbnail,
                            sourceUrl: `https://www.youtube.com/watch?v=${metadata.id}`,
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    }
                }, { quoted: m });
                break;

            case 'video':
                const caption = `乂 *VIDEO DESCARGADO*\n\n*✧ Título:* ${metadata.title}\n*✧ Duración:* ${formattedDuration}`;
                await conn.sendMessage(m.chat, {
                    video: { url: data.dl_mp4 },
                    caption: caption,
                    mimetype: 'video/mp4',
                    fileName: `${metadata.title}.mp4`
                }, { quoted: m });
                break;

            case 'ytadoc':
                await conn.sendMessage(m.chat, {
                    document: { url: data.dl_mp3 },
                    fileName: `${metadata.title}.mp3`,
                    mimetype: 'audio/mpeg'
                }, { quoted: m });
                break;

            case 'ytvdoc':
                await conn.sendMessage(m.chat, {
                    document: { url: data.dl_mp4 },
                    fileName: `${metadata.title}.mp4`,
                    mimetype: 'video/mp4'
                }, { quoted: m });
                break;
        }

    } catch (error) {
        console.error("Error en el comando play2:", error);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        m.reply(`Ocurrió un error al buscar el contenido.\n\n*Error:* ${error.message}`);
    }
};

handler.help = ['play2 <búsqueda> [audio|video|ytadoc|ytvdoc]'];
handler.tags = ['downloader'];
handler.command = /^(play2)$/i;

export default handler;