// Cooldown de 30 minutos (en milisegundos)
const ADVENTURE_COOLDOWN = 1800000;

let handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender];
    let lastadventure = user.lastadventure || 0;

    if (new Date() - lastadventure < ADVENTURE_COOLDOWN) {
        let remainingTime = (lastadventure + ADVENTURE_COOLDOWN) - new Date();
        let minutes = Math.floor((remainingTime / 1000 / 60) % 60);
        let seconds = Math.floor((remainingTime / 1000) % 60);
        return await conn.reply(m.chat, 
            `*Necesitas descansar antes de otra aventura.* ⚔️\n\n` +
            `Podrás salir de nuevo en *${minutes} minutos y ${seconds} segundos*.`,
            m
        );
    }

    // --- NUEVO: Sistema de Efectividad por Items ---

    // 1. Definimos el bonus que da cada rareza
    const rarityBonuses = {
        "Común": 0.5,
        "Raro": 1.5,
        "Épico": 4,
        "Legendario": 10
    };

    // 2. Calculamos el bonus total del inventario del usuario
    let totalBonus = 0;
    const inventory = user.inventory || [];
    if (inventory.length > 0) {
        inventory.forEach(item => {
            totalBonus += rarityBonuses[item.rarity] || 0;
        });
    }
    // Limitamos el bonus máximo para que no sea infalible (ej. 75%)
    totalBonus = Math.min(totalBonus, 75); 

    // 3. Tasa de éxito base y final
    const baseSuccessChance = 50; // 50% de probabilidad de éxito sin items
    const finalSuccessChance = baseSuccessChance + totalBonus;

    // --- FIN DEL NUEVO SISTEMA ---


    // Separamos los resultados en buenos y malos
    const goodOutcomes = [
        { reward: 200, message: "¡Encontraste un tesoro legendario en una cueva oculta! Ganaste *{reward}* cristales 💎." },
        { reward: 150, message: "Derrotaste a un mini-jefe que custodiaba un cofre. ¡Te llevas *{reward}* cristales 💎!" },
        { reward: 75, message: "Ayudaste a un mercader en apuros y te recompensó generosamente. Ganaste *{reward}* cristales 💎." }
    ];

    const badOutcomes = [
        { reward: -30, message: "¡Una emboscada de goblins! Lograste escapar, pero perdiste *{reward}* cristales 💎 en la huida." },
        { reward: -50, message: "Caíste en una trampa y tuviste que usar cristales para pagar tu rescate. Perdiste *{reward}* cristales 💎." },
        { reward: 0, message: "Te perdiste en el bosque y volviste con las manos vacías. No ganaste ni perdiste nada." }
    ];

    let result;
    // Hacemos la tirada de éxito vs fracaso
    if (Math.random() * 100 < finalSuccessChance) {
        // ÉXITO: Elegimos un resultado bueno al azar
        result = goodOutcomes[Math.floor(Math.random() * goodOutcomes.length)];
    } else {
        // FRACASO: Elegimos un resultado malo al azar
        result = badOutcomes[Math.floor(Math.random() * badOutcomes.length)];
    }

    let finalReward = result.reward;
    // Asegurarse de que el usuario no quede con cristales negativos
    if (finalReward < 0 && (user.cristales || 0) < Math.abs(finalReward)) {
        finalReward = -(user.cristales || 0); // Pierde solo lo que tiene
    }

    user.cristales = (user.cristales || 0) + finalReward;
    user.lastadventure = new Date() * 1;

    let message = result.message.replace('{reward}', Math.abs(finalReward));

    // Mensaje final que muestra la efectividad al usuario
    let effectivenessMessage = `Tus items te otorgan un *+${totalBonus.toFixed(1)}%* de efectividad. (Prob. Éxito: ${finalSuccessChance.toFixed(1)}%)`;

    await conn.reply(m.chat, 
        `*Te adentras en tierras desconocidas...*\n` +
        `_${effectivenessMessage}_\n\n` + 
        message,
        m
    );
};

handler.help = ['aventurar'];
handler.tags = ['rpg'];
handler.command = /^(aventurar|adventure|adv)$/i;

export default handler;