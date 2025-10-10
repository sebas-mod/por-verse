// Costo de cada tirada de gacha
const GACHA_COST = 150;

let handler = async (m, { conn }) => {
    // --- Lista Completa de Items del Gacha ---
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

    // --- Probabilidades para cada rareza ---
    const rarityWeights = {
        "Común": 65,
        "Raro": 25,
        "Épico": 8,
        "Legendario": 2
    };

    // Obtenemos los datos del usuario
    let user = global.db.data.users[m.sender];
    let userCrystals = user.cristales || 0;

    // 1. Verificamos si el usuario tiene suficientes cristales
    if (userCrystals < GACHA_COST) {
        return await conn.reply(m.chat,
            `*¡Cristales insuficientes!* 💎\n\n` +
            `Necesitas *${GACHA_COST}* cristales para una tirada y solo tienes *${userCrystals}*.\n` +
            `Usa los comandos *.reclamar*, *.minar* o *.aventurar* para obtener más.`,
            m
        );
    }

    // 2. Avisamos si tiene un premio pendiente que será reemplazado
    if (user.unclaimedGacha) {
        await conn.reply(m.chat, `*Aviso:* Tenías un "${user.unclaimedGacha.item}" sin reclamar. ¡Esta nueva tirada lo reemplazará!`, m);
    }

    // --- Lógica interna para la tirada ---
    const gachaPull = () => {
        const rand = Math.random() * 100;
        let cumulativeWeight = 0, chosenRarity = null;
        for (const rarity in rarityWeights) {
            cumulativeWeight += rarityWeights[rarity];
            if (rand <= cumulativeWeight) {
                chosenRarity = rarity;
                break;
            }
        }
        const itemsInRarity = items[chosenRarity];
        const chosenItem = itemsInRarity[Math.floor(Math.random() * itemsInRarity.length)];
        return { item: chosenItem, rarity: chosenRarity };
    };
    // --- Fin de la Lógica ---

    // 3. Realizamos la tirada y restamos el costo
    user.cristales -= GACHA_COST;
    const result = gachaPull();

    // 4. Guardamos el resultado en la base de datos para ser reclamado
    user.unclaimedGacha = {
        item: result.item,
        rarity: result.rarity
    };

    const rarityEmoji = { "Común": "⚪", "Raro": "🔵", "Épico": "🟣", "Legendario": "🌟" };

    // 5. Enviamos el mensaje final
    const text = `🎊 *¡Has ganado un premio!* 🎊

👤 *Jugador:* *${m.pushName}*
*(-${GACHA_COST} Cristales)*

🎁 *Premio:* *${result.item}*
✨ *Rareza:* *${result.rarity}* ${rarityEmoji[result.rarity] || ''}

*Usa el comando .reclamaritem para añadirlo a tu inventario.*`;

    await conn.reply(m.chat, text, m);
};

handler.help = ["gacha"];
handler.tags = ["rpg"];
handler.command = /^(gacha|pull|tirada)$/i;
// Opcional: Añadir un cooldown para evitar spam
// handler.cooldown = 5; 

export default handler;