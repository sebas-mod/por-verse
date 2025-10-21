let handler = async (m, { conn, text, participants }) => {
    // Emoji decorativo (puedes cambiarlo)
    const emoji = "🇺🇾";

    // Mensaje base
    let mensaje = text
        ? `*Mensaje de javi bot 2.0.0:*\n${text}`
        : " *––––––『 Invocando a todos 』––––––*";

    let textoFinal = `${mensaje}\n\n👥 *Miembros etiquetados:*\n`;

    // Recorremos a los miembros con un solo emoji
    for (let miembro of participants) {
        textoFinal += `${emoji} @${miembro.id.split("@")[0]}\n`;
    }

    // Enviar el mensaje con las menciones
    await conn.sendMessage(m.chat, {
        text: textoFinal.trim(),
        mentions: participants.map(p => p.id),
    });
};

// Información del comando
handler.help = ["tagall"];
handler.tags = ["group"];
handler.command = /^(tagall|todos)$/i;
handler.group = true;
handler.owner = false;

export default handler;
