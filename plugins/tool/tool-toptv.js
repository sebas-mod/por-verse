let handler = async (m, { conn, usedPrefix, command }) => {
    if (!m.quoted || !/video/.test(m.quoted.mimetype || "")) {
        return m.reply(`🎥 *Responde a un video con el comando ${usedPrefix + command}*`);
    }

    await global.loading(m, conn);

    try {
        let q = await m.quoted.download();
        await conn.sendFile(m.chat, q, "ptv.mp4", "✅ *Video convertido a PTV.* 🎬", m, false, {
            asPTV: true
        });
    } catch (e) {
        console.error(e);
        m.reply("🚫 *No se pudo convertir el video a PTV.*");
    } finally {
        await global.loading(m, conn, true);
    }
};

handler.help = ["toptv"];
handler.tags = ["tools"];
handler.command = /^(toptv)$/i;

export default handler;