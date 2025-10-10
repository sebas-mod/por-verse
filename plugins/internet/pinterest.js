import axios from 'axios';
import https from 'https';

// Agente para ignorar la validación del certificado SSL
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw m.reply(`✧ Por favor, proporciona un término de búsqueda.\n\n*Ejemplo:*\n*${usedPrefix + command} anime girl 5* (para 5 imágenes)`);
    }

    // Separar el texto de búsqueda del número de imágenes
    const args = text.split(' ');
    let query = '';
    let count = 1; // Número de imágenes por defecto

    // Comprobar si el último argumento es un número
    const lastArg = parseInt(args[args.length - 1]);
    if (!isNaN(lastArg)) {
        count = Math.min(lastArg, 20); // Limitar a un máximo de 20 para no saturar
        query = args.slice(0, -1).join(' ');
    } else {
        query = text;
    }
    
    if (!query) {
        throw m.reply(`✧ Debes proporcionar un término de búsqueda.\n\n*Ejemplo:*\n*${usedPrefix + command} anime girl 5*`);
    }

    await conn.sendMessage(m.chat, { text: `Buscando ${count} imagen(es) de "${query}" en Pinterest...` }, { quoted: m });
    await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

    try {
        const apiUrl = `https://api.platform.web.id/pinterest?q=${encodeURIComponent(query)}`;
        const { data } = await axios.get(apiUrl, { httpsAgent });

        if (data.status !== true || !data.results || data.results.length === 0) {
            throw new Error('No se encontraron imágenes para esa búsqueda.');
        }
        
        const results = data.results;
        
        // Barajar el array de resultados para obtener variedad
        results.sort(() => 0.5 - Math.random());
        
        // Enviar el número de imágenes solicitado
        for (let i = 0; i < Math.min(count, results.length); i++) {
            await conn.sendMessage(m.chat, {
                image: { url: results[i] },
                caption: `Imagen ${i + 1}/${count} de "${query}"`
            }, { quoted: m });
        }

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error("Error en el comando Pinterest:", error);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        m.reply(`Ocurrió un error al buscar en Pinterest.\n\n*Error:* ${error.message}`);
    }
};

handler.help = ['pinterest <búsqueda> [cantidad]', 'pin <búsqueda> [cantidad]'];
handler.tags = ['search'];
handler.command = /^(pinterest|pin)$/i;

export default handler;