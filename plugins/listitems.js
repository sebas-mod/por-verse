let handler = async (m, { conn }) => {
    // --- Lista de Items del Gacha ---
    // (Copia y pega la misma lista que tienes en tu archivo gacha.js)
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
    // --------------------------------

    const rarityEmoji = {
        "Común": "⚪",
        "Raro": "🔵",
        "Épico": "🟣",
        "Legendario": "🌟"
    };

    let text = "📜 *Catálogo de Items del Gacha* 📜\n\n";
    text += "Estos son todos los items que puedes conseguir en el RPG:\n";

    // Un array para definir el orden en que se mostrarán las rarezas
    const raritiesOrder = ["Legendario", "Épico", "Raro", "Común"];

    for (const rarity of raritiesOrder) {
        if (items[rarity]) {
            let emoji = rarityEmoji[rarity] || '❔';
            text += `\n*${emoji} --- ${rarity.toUpperCase()} --- ${emoji}*\n`;
            
            // Creamos una lista de los items para esa rareza
            const itemList = items[rarity].map(item => `> • ${item}`).join('\n');
            text += itemList + '\n';
        }
    }

    await conn.reply(m.chat, text.trim(), m);
};

handler.help = ['listitems', 'catalogo'];
handler.tags = ['rpg'];
handler.command = /^(listitems|itemlist|catalogo)$/i;

export default handler;