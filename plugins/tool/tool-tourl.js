import { uploader, uploader2, uploader3 } from "../../lib/uploader.js";

let handler = async (m, { conn }) => {
    try {
        await global.loading(m, conn);

        let q = m.quoted ? m.quoted : m;
        let msg = q.msg || q;
        let mime = msg.mimetype || "";
        if (!mime) {
            await global.loading(m, conn, true);
            return m.reply(`🍡 *Responde a un archivo, imagen, audio o video para subirlo a los servidores.*`);
        }

        let buffer = await q.download?.().catch(() => null);
        if (!buffer || !buffer.length) {
            await global.loading(m, conn, true);
            return m.reply(`🍩 *No se pudo descargar el archivo.*`);
        }

        let catbox = await uploader(buffer).catch(() => null);
        let uguu = await uploader2(buffer).catch(() => null);
        let quax = await uploader3(buffer).catch(() => null);

        if (!catbox && !uguu && !quax) {
            await global.loading(m, conn, true);
            return m.reply(`🧁 *Error al subir el archivo a todos los servidores. Intenta nuevamente más tarde.*`);
        }

        let resultText = `
🍓 *Archivo subido con éxito!*
━━━━━━━━━━━━━━━━━━━
${catbox ? `🍡 *Catbox.moe:* ${catbox}` : ""}
${uguu ? `🍪 *Uguu.se:* ${uguu}` : ""}
${quax ? `🍰 *Qu.ax:* ${quax}\n` : ""}
━━━━━━━━━━━━━━━━━━━
🍦 *Tamaño del archivo:* ${(buffer.length / 1024).toFixed(2)} KB
━━━━━━━━━━━━━━━━━━━
`.trim();

        let buttons = [];
        if (catbox) {
            buttons.push({
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                    display_text: `🍡 Copiar Catbox`,
                    copy_code: catbox,
                }),
            });
        }
        if (uguu) {
            buttons.push({
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                    display_text: `🍪 Copiar Uguu`,
                    copy_code: uguu,
                }),
            });
        }
        if (quax) {
            buttons.push({
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                    display_text: `🍰 Copiar Qu.ax`,
                    copy_code: quax,
                }),
            });
        }

        await conn.sendMessage(
            m.chat,
            {
                text: resultText,
                footer: global.config.watermark,
                interactiveButtons: buttons,
                hasMediaAttachment: false,
            },
            { quoted: m }
        );
    } catch (e) {
        console.error(e);
        m.reply(`🍬 *Ocurrió un error inesperado!*\n🧁 *Detalles:* ${e.message || e}`);
    } finally {
        await global.loading(m, conn, true);
    }
};

handler.help = ["upload", "tourl", "url"];
handler.tags = ["tools"];
handler.command = /^(tourl|url)$/i;

export default handler;