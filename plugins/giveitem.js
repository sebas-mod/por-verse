let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Expresión regular para parsear los argumentos
    const args = text.match(/(@\d{5,16})?\s*(Común|Raro|Épico|Legendario)?\s*\"(.*?)\"/);

    if (!args) throw `Formato incorrecto. Debes usar:\n*${usedPrefix + command} @usuario <Rareza> "Nombre del Item"*\n\n*Ejemplo:*\n*${usedPrefix + command} @${m.sender.split('@')[0]} Legendario "Filo del Infinito"*`;

    let who;
    if (m.isGroup) {
        // Obtiene el JID de la mención
        let jidFromMention = args[1] ? args[1].replace('@', '') + '@s.whatsapp.net' : null;
        who = jidFromMention || (m.quoted ? m.quoted.sender : null);
    } else {
        who = m.chat;
    }
    
    if (!who) throw 'Debes etiquetar a un usuario del grupo.';

    const rarity = args[2];
    const itemName = args[3];

    if (!rarity || !itemName) throw 'Debes especificar la rareza y el nombre del item entre comillas.';

    let user = global.db.data.users[who];
    if (!user) throw 'Usuario no encontrado en la base de datos.';
    
    // Añadimos el item al inventario
    user.inventory = user.inventory || [];
    user.inventory.push({
        item: itemName,
        rarity: rarity
    });

    await conn.reply(m.chat, 
        `✅ Se ha añadido el item "${itemName}" (${rarity}) al inventario de @${who.split('@')[0]}.`, 
        m, {
        mentions: [who]
    });
};

handler.help = ['giveitem @user <rareza> "<item>"'];
handler.tags = ['owner', 'rpg'];
handler.command = /^(giveitem)$/i;
handler.owner = true;

export default handler;