let handler = async (m, { conn }) => {
    if (!m.quoted) return;
    let { chat, id, participant, sender } = m.quoted;
    let quotedSender = participant || sender;

    if (
        global.config.owner.some(([num]) => quotedSender.includes(num)) ||
        (global.mods && global.mods.includes(quotedSender))
    ) {
        return m.reply(`🍩 *¡No puedes eliminar mensajes de Owner/Desarrollador!*`);
    }

    try {
        await conn.sendMessage(chat, {
            delete: {
                remoteJid: m.chat,
                fromMe: false,
                id,
                participant: quotedSender,
            },
        });
        m.reply(`✅ *Mensaje eliminado con éxito!*`);
    } catch (e) {
        console.error(e);
        m.reply(
            `🍬 *¡No se pudo eliminar el mensaje! Tal vez ya no existe o no pertenece a otro usuario.*`
        );
    }
};

handler.help = ["delete"];
handler.tags = ["group"];
handler.command = /^(d|delete|del)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;