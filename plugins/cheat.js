let handler = async (m, { conn }) => {
    // --- Lista Completa de Items del Gacha ---
    // (Esta lista está dentro del comando, no necesita archivos externos)
    const items = {
        "Común": [
            "Espada de Hierro",
            "Escudo de Madera",
            "Poción de Salud Pequeña",
            "Daga Oxidada",
            "Casco de Cuero"
        ],
        "Raro": [
            "Arco de Elfo",
            "Hacha de Guerra Enana",
            "Tomo de Hechizos Menor",
            "Armadura de Acero"
        ],
        "Épico": [
            "Báculo del Mago de Fuego",
            "Espada de Cristal",
            "Amuleto de Protección"
        ],
        "Legendario": [
            "Filo del Infinito",
            "Corazón del Dragón",
            "Capa de Invisibilidad"
        ]
    };
    // ------------------------------------------

    let user = global.db.data.users[m.sender];

    conn.reply(m.chat, '✅ *Activando protocolo de Owner... Otorgando todos los recursos.*', m);

    // --- Otorgar Cristales ---
    const maxCrystals = 999999;
    user.cristales = maxCrystals;

    // --- Otorgar Todos los Items ---
    let allItems = [];
    for (const rarity in items) {
        for (const itemName of items[rarity]) {
            allItems.push({
                item: itemName,
                rarity: rarity
            });
        }
    }
    user.inventory = allItems;
    
    // --- Reseteamos todos los Cooldowns ---
    user.lastclaim = 0;
    user.lastmine = 0;
    user.lastadventure = 0;

    // --- Mensaje de Confirmación ---
    await conn.reply(m.chat, 
        `*¡Cheat Activado con Éxito!* ✨\n\n` +
        `*Recursos Obtenidos:*\n` +
        `💎 *Cristales:* ${maxCrystals.toLocaleString()}\n` +
        `🎒 *Items en Inventario:* ${allItems.length} (¡Todos!)\n` +
        `⏳ *Cooldowns:* Reseteados.\n\n` +
        `¡Ahora eres imparable, Owner!`,
        m
    );
};

handler.help = ['cheat'];
handler.tags = ['owner'];
handler.command = /^(cheat|godmode)$/i;
handler.owner = true; // Solo el owner puede usarlo

export default handler;