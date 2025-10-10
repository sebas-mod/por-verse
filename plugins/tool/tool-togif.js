let handler = async (m, { conn, usedPrefix, command }) => {
    if (!m.quoted || !/video/.test(m.quoted.mimetype || ""))
        return m.reply(`🍓 *Responde a un video con el comando* ${usedPrefix + command}`);
    
    await global.loading(m, conn);
    try {
        let media = await m.quoted.download();
        await conn.sendMessage(
            m.chat,
            { video: media, gifPlayback: true, mimetype: "video/mp4" },
            { quoted: m }
        );
    } catch (e) {
        console.error(e);
        m.reply("🍩 *Error: No se pudo convertir el video a GIF Playback.*");
    } finally {
        await global.loading(m, conn, true);
    }
};

handler.help = ["togif"];
handler.tags = ["tools"];
handler.command = /^(togif)$/i;

export default handler;