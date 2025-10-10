let handler = async (m, { conn, participants, text, usedPrefix, command }) => {
    // Obtenemos a todos los miembros del grupo
    let allUsers = participants.map(p => p.id);
    
    // Identificamos a los dos shippers
    let shipper1 = m.sender;
    let shipper2;

    // Modo 1: El usuario menciona a alguien
    if (m.mentionedJid.length) {
        shipper2 = m.mentionedJid[0];
    } 
    // Modo 2: El usuario no menciona a nadie, se elige a alguien al azar
    else {
        // Filtramos al propio usuario para que no se empareje consigo mismo
        let availableUsers = allUsers.filter(id => id !== shipper1);
        if (availableUsers.length < 1) return conn.reply(m.chat, 'No hay suficientes personas en el grupo para emparejar.', m);
        
        shipper2 = availableUsers[Math.floor(Math.random() * availableUsers.length)];
    }

    // Obtenemos los nombres
    let name1 = conn.getName(shipper1);
    let name2 = conn.getName(shipper2);

    // Algoritmo para que el porcentaje sea siempre el mismo entre dos personas
    let ids = [shipper1, shipper2].sort(); // Ordenamos los IDs para que (A,B) sea igual que (B,A)
    let combinedIds = ids[0].split('@')[0] + ids[1].split('@')[0];
    let hash = 0;
    for (let i = 0; i < combinedIds.length; i++) {
        hash += combinedIds.charCodeAt(i);
    }
    const percent = hash % 101; // Resultado de 0 a 100

    // Creamos el "nombre de ship"
    const shipName = name1.slice(0, Math.ceil(name1.length / 2)) + name2.slice(Math.floor(name2.length / 2));

    // Creamos la barra de amor visual
    const filledHearts = Math.floor(percent / 10);
    const emptyHearts = 10 - filledHearts;
    const loveBar = '❤️'.repeat(filledHearts) + '🖤'.repeat(emptyHearts);

    // Seleccionamos un mensaje según el porcentaje
    let message;
    if (percent < 30) {
        message = 'Parece que solo pueden ser amigos... 😔';
    } else if (percent < 60) {
        message = 'Hay potencial, pero necesitan trabajar en ello. 👀';
    } else if (percent < 90) {
        message = '¡Una pareja muy prometedora! ¡Felicidades! 🎉';
    } else {
        message = '¡Destinados a estar juntos! ¡Almas gemelas! 💖✨';
    }

    // Construimos el texto final
    const textResult = `
💖 *TEST DE COMPATIBILIDAD* 💖

*Pareja:*
❤️ @${shipper1.split('@')[0]}
❤️ @${shipper2.split('@')[0]}

*Nombre de Ship:* *${shipName}*

*Compatibilidad:*
${loveBar} *${percent}%*

*Resultado:*
_${message}_
    `;

    await conn.reply(m.chat, textResult.trim(), m, {
        mentions: [shipper1, shipper2]
    });
};

handler.help = ['ship [@user]'];
handler.tags = ['fun']; // Una nueva categoría para comandos divertidos
handler.command = /^(ship|pareja)$/i;
handler.group = true; // Este comando funciona mejor en grupos

export default handler;