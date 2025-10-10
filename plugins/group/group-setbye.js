let handler = async (m, { text, usedPrefix, command }) => {
    if (text) {
        global.db.data.chats[m.chat].sBye = text;
        m.reply(`🍰 *¡Mensaje de despedida configurado con éxito!*`);
    } else {
        return m.reply(
            `🍩 *¿Dónde está el texto, che?*\n\n🍬 *Ejemplo de uso: ${usedPrefix + command} ¡Chau chau 🍙 @user*`
        );
    }
};

handler.help = ["setbye"];
handler.tags = ["group"];
handler.command = /^(setbye)$/i;
handler.group = true;
handler.owner = true;

export default handler;