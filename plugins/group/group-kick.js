let handler = async (m, { conn, args, participants, command, usedPrefix }) => {
    let targets = [];

    // Recolectar objetivos desde menciones, respuestas o números
    if (m.mentionedJid?.length) targets.push(...m.mentionedJid);
    if (m.quoted?.sender) targets.push(m.quoted.sender);
    for (let arg of args) {
        if (/^\d{5,}$/.test(arg)) {
            let jid = arg.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
            targets.push(jid);
        }
    }

    // Eliminar duplicados y evitar que el admin se expulse a sí mismo
    targets = [...new Set(targets)].filter(
        v => v !== m.sender && participants.some(p => (p.id || p.jid) === v)
    );

    if (!targets.length)
        return m.reply(
            `🍩 *Etiqueta, responde o ingresa el número del miembro que deseas expulsar, mi cielito~*\n\n📍Ejemplo:\n> ${usedPrefix + command} @1234567890`
        );

    for (let target of targets) {
        try {
            await conn.groupParticipantsUpdate(m.chat, [target], "remove");

            if (/^dor$/i.test(command)) {
                await conn.reply(m.chat, `🔫 *DORRR!!! 🍬 ¡El objetivo ha sido expulsado con éxito, mi cielito~!*`, m);
            } else {
                await conn.reply(
                    m.chat,
                    `🍓 *¡Miembro expulsado correctamente!* @${target.split("@")[0]}`,
                    m,
                    { mentions: [target] }
                );
            }
        } catch (e) {
            console.error(e);
            await conn.reply(m.chat, `⚠️ No pude expulsar a @${target.split("@")[0]}, puede que sea admin.`, m, { mentions: [target] });
        }
    }
};

handler.help = ["kick", "k", "dor"];
handler.tags = ["group"];
handler.command = /^(kick|k|dor)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
