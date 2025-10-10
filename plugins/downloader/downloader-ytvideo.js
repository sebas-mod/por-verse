import axios from 'axios';
import https from 'https';

// Agente para ignorar la validación del certificado SSL
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

// Valida si una URL es de YouTube
function isValidYouTubeUrl(url) {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return youtubeRegex.test(url);
}

// Formatea la duración de segundos a MM:SS
function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = String(seconds % 60).padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        throw m.reply(`✧ Por favor, proporciona un enlace de YouTube.\n\n*Ejemplo:*\n*${usedPrefix + command} https://www.youtube.com/watch?v=Ld2a5KewaGU*`);
    }
    if (!isValidYouTubeUrl(args[0])) {
        throw m.reply(`✧ El enlace proporcionado no es válido.`);
    }

    await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

    try {
        const apiUrl = `https://api.zenzxz.my.id/search/play?query=${encodeURIComponent(args[0])}`;
        const { data } = await axios.get(apiUrl, { httpsAgent });

        if (data.status !== true || !data.dl_mp4) {
            throw new Error('No se pudo procesar el enlace.');
        }
        
        const videoUrl = data.dl_mp4;
        const metadata = data.metadata;
        const formattedDuration = formatDuration(metadata.duration);
        
        const caption = `
乂 *VIDEO DESCARGADO*

*✧ Título:* ${metadata.title}
*✧ Duración:* ${formattedDuration}
        `.trim();

        await conn.sendMessage(m.chat, {
            video: { url: videoUrl },
            caption: caption,
            mimetype: 'video/mp4',
            fileName: `${metadata.title}.mp4`
        }, { quoted: m });

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    } catch (error) {
        console.error("Error en el comando ytmp4:", error);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        m.reply(`Ocurrió un error al descargar el video.\n\n*Error:* ${error.message}`);
    }
};

handler.help = ['ytmp4 <enlace>'];
handler.tags = ['downloader'];
handler.command = /^(ytmp4|ytvideo)$/i;

export default handler;