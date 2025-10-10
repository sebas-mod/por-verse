let handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender];

    // Verificamos si hay un premio pendiente
    if (!user.unclaimedGacha) {
        return await conn.reply(m.chat, 
            `*No tienes ningún item pendiente de reclamar.*\n\n` +
            `Usa el comando *.gacha* para obtener uno.`,
            m
        );
    }

    // Obtenemos los detalles del premio
    const itemToClaim = user.unclaimedGacha;

    // Añadimos el premio al inventario del usuario
    // El inventario es un array de objetos
    user.inventory.push({
        item: itemToClaim.item,
        rarity: itemToClaim.rarity
    });

    // MUY IMPORTANTE: Limpiamos el premio pendiente para que no se pueda reclamar de nuevo
    user.unclaimedGacha = null;

    const rarityEmoji = { "Común": "⚪", "Raro": "🔵", "Épico": "🟣", "Legendario": "🌟" };

    await conn.reply(m.chat, 
        `*¡Item reclamado con éxito!* ✅\n\n` +
        `Has añadido *${itemToClaim.item}* (${itemToClaim.rarity} ${rarityEmoji[itemToClaim.rarity] || ''}) a tu inventario.`,
        m
    );
};

handler.help = ['reclamaritem'];
handler.tags = ['game'];
handler.command = /^(reclamaritem|claimitem)$/i;

export default handler;