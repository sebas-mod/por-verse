let handler = async (m, { conn, text, usedPrefix, command, participants }) => {
    let targets = [];

    // Agrega los mencionados y el remitente citado
    if (m.mentionedJid.length) targets.push(...m.mentionedJid);
    if (m.quoted && m.quoted.sender) targets.push(m.quoted.sender);

    // Agrega números escritos en el texto
    if (text) {
        for (let num of text.split(/\s+/)) {
            if (/^\d{5,}$/.test(num)) {
                let jid = num.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
                targets.push(jid);
            }
        }
    }

    // Filtra solo los que son participantes del grupo
    targets = [...new Set(targets)].filter((v) => participants.some((p) => p.id === v));

    if (!targets.length)
        return m.reply(
            `🍰 *Etiqueta, responde o ingresa el número del usuario que deseas degradar de admin~*\n\n*Ejemplo: ${usedPrefix + command} @usuario*`
        );

    try {
        await conn.groupParticipantsUpdate(m.chat, targets, "demote");
        m.reply(
            `✅ *Usuarios degradados con éxito:* ${targets
                .map((u) => `@${u.split("@")[0]}`)
                .join(", ")}\n🍩 *Ya no son administradores del grupo.*`,
            null,
            { mentions: targets }
        );
    } catch {
        m.reply("🍬 *Ocurrió un error. Asegúrate de que el número sea válido y que el bot sea admin.*");
    }
};

handler.help = ["demote"];
handler.tags = ["group"];
handler.command = /^(demote)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;