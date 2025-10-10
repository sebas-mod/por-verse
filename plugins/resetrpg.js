let handler = async (m, { conn, text, usedPrefix, command }) => {
    let who;
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false;
    else who = m.chat;

    if (!who) throw m.reply(`Etiqueta o menciona a un usuario.\n\n*Ejemplo:* ${usedPrefix + command} @${m.sender.split('@')[0]}`);

    let user = global.db.data.users[who];
    if (!user) throw m.reply('Usuario no encontrado en la base de datos.');
    
    // Reseteamos los cooldowns a 0
    user.lastclaim = 0;
    user.lastmine = 0;
    user.lastadventure = 0;

    await conn.reply(m.chat, 
        `✅ Se han reseteado todos los cooldowns de RPG para @${who.split('@')[0]}.`, 
        m, {
        mentions: [who]
    });
};

handler.help = ['resetrpg @user'];
handler.tags = ['owner', 'rpg']; // Doble tag para organizar
handler.command = /^(resetrpg)$/i;
handler.owner = true;

export default handler;