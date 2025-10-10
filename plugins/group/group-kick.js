let handler = async (m, { conn, args, participants, command, usedPrefix }) => {
    let targets = [];

    // Recolectar objetivos desde menciones, replies o números
    if (m.mentionedJid.length) targets.push(...m.mentionedJid);
    if (m.quoted && m.quoted.sender) targets.push(m.quoted.sender);
    for (let arg of args) {
        if (/^\d{5,}$/.test(arg)) {
            let jid = arg.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
            targets.push(jid);
        }
    }

    // Filtrar duplicados y evitar que se autoexpulse el que ejecuta el comando
    targets = [...new Set(targets)].filter(
        (v) => v !== m.sender && participants.some((p) => p.id === v)
    );

    if (!targets.length)
        return m.reply(
            `🍩 *Etiqueta, responde o ingresa el número del miembro que deseas expulsar, mi cielito~*\n*Ejemplo: ${usedPrefix + command} @628xx*`
        );

    for (let target of targets) {
        await conn.groupParticipantsUpdate(m.chat, [target], "remove");
        if (/^dor$/i.test(command)) {
            await m.reply(`🔫 *DORRR!!! 🍬 ¡El objetivo ha sido expulsado con éxito, mi cielito~!*`);
        } else {
            await m.reply(`🍓 *¡Miembro expulsado correctamente!* @${target.split("@")[0]}`, null, { mentions: [target] });
        }
    }
};

handler.help = ["kick"];
handler.tags = ["group"];
handler.command = /^(kick|k|dor)$/i;
handler.group = true;
handler.botAdmin = true;
handler.admin = true;

export default handler;