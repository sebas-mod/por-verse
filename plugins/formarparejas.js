let handler = async (m, { conn, participants }) => {
    // Obtenemos los IDs de todos los miembros del grupo
    let users = participants.map(p => p.id);
    
    // Verificamos que haya al menos dos personas para emparejar
    if (users.length < 2) {
        return conn.reply(m.chat, '💔 No hay suficientes personas en el grupo para formar una pareja.', m);
    }

    // Elegimos a la primera persona al azar
    let shipper1_index = Math.floor(Math.random() * users.length);
    let shipper1 = users[shipper1_index];

    // Elegimos a la segunda persona al azar, asegurándonos de que no sea la misma
    let shipper2_index;
    do {
        shipper2_index = Math.floor(Math.random() * users.length);
    } while (shipper1_index === shipper2_index);
    let shipper2 = users[shipper2_index];

    // --- (A partir de aquí, la lógica es la misma que en el comando .ship) ---

    // Obtenemos los nombres
    let name1 = conn.getName(shipper1);
    let name2 = conn.getName(shipper2);

    // Algoritmo para que el porcentaje sea siempre el mismo entre dos personas
    let ids = [shipper1, shipper2].sort();
    let combinedIds = ids[0].split('@')[0] + ids[1].split('@')[0];
    let hash = 0;
    for (let i = 0; i < combinedIds.length; i++) {
        hash += combinedIds.charCodeAt(i);
    }
    const percent = hash % 101;

    // Creamos el "nombre de ship"
    const shipName = name1.slice(0, Math.ceil(name1.length / 2)) + name2.slice(Math.floor(name2.length / 2));

    // Creamos la barra de amor visual
    const filledHearts = Math.floor(percent / 10);
    const emptyHearts = 10 - filledHearts;
    const loveBar = '❤️'.repeat(filledHearts) + '🖤'.repeat(emptyHearts);

    // Seleccionamos un mensaje según el porcentaje
    let message;
    if (percent < 30) message = 'Parece que solo pueden ser amigos... 😔';
    else if (percent < 60) message = 'Hay potencial, pero necesitan trabajar en ello. 👀';
    else if (percent < 90) message = '¡Una pareja muy prometedora! ¡Felicidades! 🎉';
    else message = '¡Destinados a estar juntos! ¡Almas gemelas! 💖✨';

    // Construimos el texto final
    const textResult = `
💞 *LA PAREJA DEL DÍA* 💞

El destino ha hablado y ha elegido a dos personas al azar de este grupo:

*La nueva pareja es:*
💘 @${shipper1.split('@')[0]}
💘 @${shipper2.split('@')[0]}

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

handler.help = ['formarparejas'];
handler.tags = ['fun'];
handler.command = /^(formarparejas|randomship)$/i;
handler.group = true; // Este comando solo tiene sentido en grupos

export default handler;