let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0])
        return m.reply(`🍡 *Ejemplo de uso: ${usedPrefix + command} Nueva descripción del grupo~*`);
    try {
        await conn.groupUpdateDescription(m.chat, args.join(" "));
        m.reply("🍰 *¡Descripción del grupo actualizada con éxito!*");
    } catch (e) {
        console.error(e);
        m.reply("🍬 *No se pudo cambiar la descripción del grupo.*");
    }
};

handler.help = ["setdesc"];
handler.tags = ["group"];
handler.command = /^(setdesc|setdesk)$/i;
handler.group = true;
handler.botAdmin = true;
handler.admin = true;

export default handler;