let handler = async (m, { conn, text, usedPrefix, command }) => {
    let who;
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false;
    else who = m.chat;

    if (!who) throw `Etiqueta al usuario cuyos datos de RPG quieres resetear.\n\n*Ejemplo:* ${usedPrefix + command} @usuario`;

    let user = global.db.data.users[who];
    if (!user) throw 'Usuario no encontrado en la base de datos.';

    // Reseteamos todos los campos de RPG a sus valores por defecto
    user.cristales = 0;
    user.lastclaim = 0;
    user.lastmine = 0;
    user.lastadventure = 0;
    user.inventory = [];
    user.unclaimedGacha = null;

    await conn.reply(m.chat, 
        `⚠️ Se han reseteado todos los datos de RPG (cristales, inventario y cooldowns) para el usuario @${who.split('@')[0]}.`, 
        m, {
        mentions: [who]
    });
};

handler.help = ['resetuserrpg @user'];
handler.tags = ['owner', 'rpg'];
handler.command = /^(resetuserrpg|rpgreset)$/i;
handler.owner = true;

export default handler;