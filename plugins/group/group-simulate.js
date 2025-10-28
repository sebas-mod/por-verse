import welcomeHandler from './group-welcome.js' // ajustá la ruta si hace falta
import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

let handler = async (m, { conn, usedPrefix, command, args, text }) => {
    const evento = args[0];

    if (!evento) {
        return conn.reply(
            m.chat,
            `*🧩 Ejemplo de uso:*\n` +
            `• ${usedPrefix + command} welcome @usuario\n` +
            `• ${usedPrefix + command} bye @usuario\n` +
            `• ${usedPrefix + command} promote @usuario\n` +
            `• ${usedPrefix + command} demote @usuario\n` +
            `• ${usedPrefix + command} desc\n\n` +
            `_Simula eventos de grupo antes de enviarlos._`,
            m
        );
    }

    // Obtener usuarios mencionados o el remitente
    let mencionesTexto = (text || "").replace(evento, "").trimStart();
    let mencionados = [...mencionesTexto.matchAll(/@([0-9]{5,16})/g)].map(v => v[1] + "@s.whatsapp.net");
    let participantes = mencionados.length ? mencionados : [m.sender];

    await m.reply(`*❃ Simulando evento ${evento}...*`);

    for (let participant of participantes) {
        // Crear mensaje simulado
        let fakeMsg = {
            chat: m.chat,
            isGroup: true,
            sender: m.sender,
            fakeEvent: true, // ⚡ indica que es simulación
            messageStubParameters: [participant],
        };

        switch (evento.toLowerCase()) {
            case "welcome": case "add": case "invite":
                fakeMsg.messageStubType = 27; break;
            case "bye": case "kick": case "leave": case "remove":
                fakeMsg.messageStubType = 28; break;
            case "promote":
                fakeMsg.messageStubType = 29; break;
            case "demote":
                fakeMsg.messageStubType = 30; break;
            case "desc":
                fakeMsg.messageStubType = 21; break;
            default:
                return conn.reply(
                    m.chat,
                    `Evento no reconocido.\nUsá:\n• welcome\n• bye\n• promote\n• demote\n• desc`,
                    m
                );
        }

        try {
            // Generar el mensaje de prueba sin enviarlo aún
            const preview = await welcomeHandler.preview?.(fakeMsg, { conn });
            if (!preview) {
                await m.reply("⚠️ No se pudo generar vista previa, enviando directamente...");
                await welcomeHandler.before(fakeMsg, { conn });
                continue;
            }

            // Mostrar vista previa con botones
            const botones = [
                { buttonId: `.confirmSim ${evento}`, buttonText: { displayText: "✅ Enviar" }, type: 1 },
                { buttonId: `.cancelSim`, buttonText: { displayText: "❌ Cancelar" }, type: 1 },
            ];

            await conn.sendMessage(m.chat, {
                image: { url: preview.image },
                caption: preview.caption,
                footer: `¿Deseas enviar este mensaje al grupo?`,
                buttons: botones,
                headerType: 4,
                mentions: [participant],
            });
        } catch (err) {
            console.error("❌ Error al simular evento:", err);
            await conn.reply(m.chat, `⚠️ Error al simular: ${err.message}`, m);
        }
    }
};

// ✅ Comando para confirmar el envío
let confirmSim = async (m, { conn, args }) => {
    const evento = args[0];
    if (!evento) return m.reply("⚠️ Debes especificar el evento.");

    const fakeMsg = {
        chat: m.chat,
        isGroup: true,
        sender: m.sender,
        fakeEvent: true,
        messageStubParameters: [m.sender],
    };

    switch (evento.toLowerCase()) {
        case "welcome": case "add": case "invite": fakeMsg.messageStubType = 27; break;
        case "bye": case "kick": case "leave": case "remove": fakeMsg.messageStubType = 28; break;
        case "promote": fakeMsg.messageStubType = 29; break;
        case "demote": fakeMsg.messageStubType = 30; break;
        case "desc": fakeMsg.messageStubType = 21; break;
        default: return m.reply("Evento no reconocido.");
    }

    await m.reply(`✅ Enviando mensaje de ${evento}...`);
    await welcomeHandler.before(fakeMsg, { conn });
};

let cancelSim = async (m) => {
    await m.reply("❌ Simulación cancelada.");
};

// Registrar los handlers
handler.help = ["simulate"];
handler.tags = ["group"];
handler.command = /^(simulate|simulation|simulacion)$/i;
handler.owner = true;
handler.admin = true;

confirmSim.command = /^confirmSim/i;
cancelSim.command = /^cancelSim/i;

export default [handler, confirmSim, cancelSim];
