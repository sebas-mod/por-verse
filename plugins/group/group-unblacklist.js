let handler = async (m, { usedPrefix, command, text }) => {
    let who = m.mentionedJid[0]
        ? m.mentionedJid[0]
        : m.quoted
          ? m.quoted.sender
          : text
            ? text.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
            : false;
    if (!who)
        return m.reply(
            `🍓 *¡Etiquetá o respondé a la persona primero~!*\n\n*Ejemplo: ${usedPrefix + command} @${m.sender.split("@")[0]}*`,
            false,
            { mentions: [m.sender] }
        );

    let chat = global.db.data.chats[m.chat];
    chat.member = chat.member || {};
    let user = (chat.member[who] = chat.member[who] || {});

    if (!user.blacklist)
        return m.reply(`🍎 *@${who.split("@")[0]} no está en la lista negra del grupo~*`, false, {
            mentions: [who],
        });

    user.blacklist = false;
    user.blacklistTime = 0;

    m.reply(
        `🍩 *¡Listo!*\n*@${who.split("@")[0]} ya fue removido de la lista negra del grupo~*\n*¡Ahora puede usar el bot otra vez!*`,
        false,
        { mentions: [who] }
    );
};

handler.help = ["unblacklist"];
handler.tags = ["group"];
handler.command = /^(unblacklist(user)?)$/i;
handler.group = true;
handler.owner = true;

export default handler;