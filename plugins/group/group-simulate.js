import welcomeHandler from './group-welcome.js' // Ajusta la ruta si es necesario

let handler = async (m, { conn, usedPrefix, command, args: [evento], text }) => {
    if (!evento) {
        return await conn.reply(
            m.chat,
            `*Ejemplo de uso:*\n` +
            `*${usedPrefix + command} welcome @usuario*\n` +
            `*${usedPrefix + command} bye @usuario*\n` +
            `*${usedPrefix + command} promote @usuario*\n` +
            `*${usedPrefix + command} demote @usuario*\n` +
            `*${usedPrefix + command} desc* para simular cambio de descripción`,
            m
        );
    }

    // Procesamos menciones
    let mencionesTexto = text.replace(evento, "").trimStart();
    let quienes = mencionesTexto ? conn.parseMention(mencionesTexto) : [];
    let participantes = quienes.length ? quienes : [m.sender];

    await m.reply(`*❃ Simulando ${evento}...*`);

    for (let participant of participantes) {
        // Creamos un objeto "fake" similar a messageStubType
        let fakeMsg = {
            chat: m.chat,
            isGroup: true,
            sender: m.sender,
            messageStubParameters: [participant],
        };

        switch (evento.toLowerCase()) {
            case "welcome":
            case "add":
            case "invite":
                fakeMsg.messageStubType = 27;
                break;
            case "bye":
            case "kick":
            case "leave":
            case "remove":
                fakeMsg.messageStubType = 28;
                break;
            case "promote":
                fakeMsg.messageStubType = 29;
                break;
            case "demote":
                fakeMsg.messageStubType = 30;
                break;
            case "desc":
                fakeMsg.messageStubType = 21;
                break;
            default:
                return await conn.reply(
                    m.chat,
                    `*Ejemplo de uso:*\n` +
                    `*${usedPrefix + command} welcome @usuario*\n` +
                    `*${usedPrefix + command} bye @usuario*\n` +
                    `*${usedPrefix + command} promote @usuario*\n` +
                    `*${usedPrefix + command} demote @usuario*\n` +
                    `*${usedPrefix + command} desc* para simular cambio de descripción`,
                    m
                );
        }

        // Llamamos directamente al handler.before del welcome
        try {
            await welcomeHandler.before(fakeMsg, { conn });
        } catch (err) {
            console.error("❌ Error al simular evento:", err.message);
        }
    }
};

handler.help = ["simulate"];
handler.tags = ["group"];
handler.command = /^(simulate|simulation|simulacion)$/i;
handler.owner = true;
handler.admin = true;

export default handler;
