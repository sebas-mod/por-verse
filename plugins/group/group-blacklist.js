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
            `🍓 *¡Responde o etiqueta a alguien primero, por favor~!* \n*Ejemplo: ${usedPrefix + command}* @${m.sender.split("@")[0]}`,
            false,
            { mentions: [m.sender] }
        );

    let chat = global.db.data.chats[m.chat];
    chat.member = chat.member || {};
    let user = (chat.member[who] = chat.member[who] || {});

    if (user.blacklist)
        return m.reply(
            `🍎 @${who.split("@")[0]} *¡ya está en la lista negra de este grupo!*`,
            false,
            { mentions: [who] }
        );

    user.blacklist = true;
    user.blacklistTime = new Date() * 1;

    m.reply(
        `🍩 *¡Hecho con éxito!*\n@${who.split("@")[0]} *ha sido añadido a la lista negra del grupo.*`,
        false,
        { mentions: [who] }
    );
};

handler.help = ["blacklist"];
handler.tags = ["group"];
handler.command = /^(blacklist(user)?)$/i;
handler.group = true;
handler.owner = true;

export default handler;