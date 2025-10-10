//import fetch from "node-fetch";

// --- Scraper de MediaFire (sin cambios) ---
async function MediaFire(url) {
  try {
    const res1 = await fetch("https://staging-mediafire-direct-url-ui-txd2.frontend.encr.app/api/mediafire/taskid", { method: "POST", headers: { "accept": "*/*", "content-type": "application/json", "accept-language": "id-ID" } });
    const data1 = await res1.json();
    const taskId = data1.taskId;
    const res2 = await fetch(`https://staging-mediafire-direct-url-ui-txd2.frontend.encr.app/api/mediafire/download/${taskId}`, { method: "POST", headers: { "accept": "*/*", "content-type": "application/json", "accept-language": "id-ID" }, body: JSON.stringify({ url }) });
    const data2 = await res2.json();
    return { fileName: data2.fileName, downloadUrl: data2.downloadUrl };
  } catch { return null; }
}

// --- Función para formatear bytes a un formato legible (KB, MB, GB) ---
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // --- Límite de Tamaño ---
    const MAX_SIZE_MB = 70;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    // 1. Validaciones iniciales
    if (!text) throw m.reply(`Por favor, proporciona un enlace de MediaFire.\n\n*Ejemplo:* ${usedPrefix + command} https://www.mediafire.com/file/link-ejemplo/archivo.zip/file`);
    if (!/mediafire\.com/i.test(text)) throw m.reply('El enlace proporcionado no es de MediaFire.');

    await conn.reply(m.chat, '📥 *Procesando enlace...*\nPor favor, espera un momento.', m);

    try {
        // 2. Usamos el scraper
        const fileData = await MediaFire(text);
        if (!fileData || !fileData.downloadUrl) {
            throw new Error('No se pudo obtener el enlace de descarga.');
        }

        // 3. --- ¡NUEVO! Comprobación de tamaño ---
        const headRes = await fetch(fileData.downloadUrl, { method: 'HEAD' });
        const fileSize = headRes.headers.get('content-length');

        if (fileSize && parseInt(fileSize) > MAX_SIZE_BYTES) {
            const fileSizeFormatted = formatBytes(parseInt(fileSize));
            return await conn.reply(m.chat, 
                `❌ *Archivo Demasiado Grande*\n\n` +
                `El archivo "*${fileData.fileName}*" pesa *${fileSizeFormatted}* y supera el límite de *${MAX_SIZE_MB} MB* que puedo enviar.`,
                m
            );
        }
        // --- Fin de la comprobación ---

        // 4. Creamos el caption, ¡ahora con el tamaño del archivo!
        const fileSizeFormatted = fileSize ? formatBytes(parseInt(fileSize)) : 'Tamaño desconocido';
        let caption = `
✅ *Descarga de MediaFire Lista* ✅

📁 *Nombre:* ${fileData.fileName}
📦 *Tamaño:* ${fileSizeFormatted}

*Enviando archivo...*
        `.trim();

        // 5. Enviamos el archivo
        await conn.sendFile(m.chat, fileData.downloadUrl, fileData.fileName, caption, m);

    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, '❌ *Error*\n\nNo se pudo descargar el archivo. Asegúrate de que el enlace sea válido y público.', m);
    }
};

handler.help = ['mediafire <url>'];
handler.tags = ['downloader'];
handler.command = /^(mediafire|mf|mfdl)$/i;
handler.cooldown = 15;

export default handler;