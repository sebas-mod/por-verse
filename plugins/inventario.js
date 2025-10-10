let handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender];
    
    // Verificamos si el inventario existe y no está vacío
    if (!user || !user.inventory || user.inventory.length === 0) {
        return await conn.reply(m.chat, 
            `🎒 *Tu Inventario está Vacío*\n\nUsa el comando *.gacha* para conseguir items y luego *.reclamaritem* para guardarlos aquí.`, 
            m
        );
    }

    // Preparamos el mapa de emojis para las rarezas
    const rarityEmoji = {
        "Común": "⚪",
        "Raro": "🔵",
        "Épico": "🟣",
        "Legendario": "🌟"
    };

    // Construimos el texto del inventario
    let text = `🎒 *Inventario de ${m.pushName}* 🎒\n\nTienes un total de *${user.inventory.length}* items:\n\n`;

    // Agrupamos los items para contarlos
    let itemCounts = {};
    for (let item of user.inventory) {
        let key = `${item.item}|${item.rarity}`;
        if (!itemCounts[key]) {
            itemCounts[key] = {
                count: 0,
                ...item
            };
        }
        itemCounts[key].count++;
    }

    // Convertimos el objeto de conteo en una lista formateada
    let sortedItems = Object.values(itemCounts).sort((a, b) => a.item.localeCompare(b.item));

    for (let item of sortedItems) {
        let emoji = rarityEmoji[item.rarity] || '❔';
        text += `${emoji} *${item.item}* (x${item.count})\n`;
        text += `   ↳ _Rareza: ${item.rarity}_\n\n`;
    }

    await conn.reply(m.chat, text.trim(), m);
};

handler.help = ['inventario'];
handler.tags = ['rpg'];
handler.command = /^(inventario|inventory|inv)$/i;

export default handler;