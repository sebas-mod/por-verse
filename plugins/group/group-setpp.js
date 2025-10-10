let handler = async (m, { conn, usedPrefix, command }) => {
    if (!m.quoted || !/image/.test(m.quoted.mimetype))
        return m.reply(`🍙 *Respondé o mandá una imagen con el comando: ${usedPrefix + command}*`);
    try {
        let media = await m.quoted.download();
        await conn.updateProfilePicture(m.chat, media);
        m.reply("🌸 *¡Foto del grupo actualizada con éxito!*");
    } catch {
        m.reply("🍩 *No se pudo actualizar la foto del grupo~*");
    }
};

handler.help = ["setppgc"];
handler.tags = ["group"];
handler.command = /^(setppgc)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;