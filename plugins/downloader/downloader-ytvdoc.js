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

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        throw m.reply(`✧ Por favor, proporciona un enlace de YouTube para descargar el video como documento.\n\n*Ejemplo:*\n*${usedPrefix + command} https://www.youtube.com/watch?v=Ld2a5KewaGU*`);
    }
    if (!isValidYouTubeUrl(args[0])) {
        throw m.reply(`✧ El enlace proporcionado no es un enlace válido de YouTube.`);
    }

    await conn.sendMessage(m.chat, { text: `📥 Descargando video como documento...` }, { quoted: m });
    await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

    try {
        const apiUrl = `https://api.zenzxz.my.id/search/play?query=${encodeURIComponent(args[0])}`;
        const { data } = await axios.get(apiUrl, { httpsAgent });

        if (data.status !== true || !data.dl_mp4) {
            throw new Error('No se pudo obtener el enlace de descarga del video.');
        }
        
        const metadata = data.metadata;

        // Enviamos el video como un documento
        await conn.sendMessage(m.chat, {
            document: { url: data.dl_mp4 },
            fileName: `${metadata.title}.mp4`,
            mimetype: 'video/mp4' // Mimetype para archivos MP4
        }, { quoted: m });

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error("Error en el comando ytvdoc:", error);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        m.reply(`Ocurrió un error al descargar el documento de video.\n\n*Error:* ${error.message}`);
    }
};

handler.help = ['ytvdoc <enlace>'];
handler.tags = ['downloader'];
handler.command = /^(ytvdoc)$/i;

export default handler;