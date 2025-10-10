let handler = async (m, { conn, usedPrefix, command, args: [evento], text }) => {
    if (!evento)
        return await conn.reply(
            m.chat,
            `*Ejemplo de uso:*
*${usedPrefix + command} welcome @usuario*
*${usedPrefix + command} bye @usuario*
*${usedPrefix + command} promote @usuario*
*${usedPrefix + command} demote @usuario*`.trim(),
            m
        );

    let mencionesTexto = text.replace(evento, "").trimStart();
    let quienes = mencionesTexto ? conn.parseMention(mencionesTexto) : [];
    let participantes = quienes.length ? quienes : [m.sender];
    let accion = false;

    m.reply(`*❃ Simulando ${evento}...*`);

    switch (evento.toLowerCase()) {
        case "add":
        case "invite":
        case "welcome":
            accion = "add";
            break;
        case "bye":
        case "kick":
        case "leave":
        case "remove":
            accion = "remove";
            break;
        case "promote":
            accion = "promote";
            break;
        case "demote":
            accion = "demote";
            break;
        default:
            return await conn.reply(
                m.chat,
                `*Ejemplo de uso:*
*${usedPrefix + command} welcome @usuario*
*${usedPrefix + command} bye @usuario*
*${usedPrefix + command} promote @usuario*
*${usedPrefix + command} demote @usuario*`.trim(),
                m
            );
    }

    return conn.participantsUpdate({
        id: m.chat,
        participants: participantes,
        action: accion,
    });
};

handler.help = ["simulate"];
handler.tags = ["group"];
handler.command = /^(simulate|simulation|simulacion)$/i;
handler.owner = true;
handler.admin = true;

export default handler;