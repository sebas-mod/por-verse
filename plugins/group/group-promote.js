let handler = async (m, { conn, args, participants, command, usedPrefix }) => {
    let targets = [];

    // Si mencionaron usuarios
    if (m.mentionedJid.length) targets.push(...m.mentionedJid);

    // Si respondieron a un mensaje
    if (m.quoted && m.quoted.sender) targets.push(m.quoted.sender);

    // Si pusieron números directamente
    for (let arg of args) {
        if (/^\d{5,}$/.test(arg)) {
            let jid = arg.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
            targets.push(jid);
        }
    }

    // Filtrar duplicados y validar que estén en el grupo
    targets = [...new Set(targets)].filter((v) => participants.some((p) => p.id === v));

    if (!targets.length) {
        return m.reply(
            `🍩 *Che, ingresá un número, tag o respondé al usuario que quieras promover a admin~*\n\n*Ejemplo: ${usedPrefix + command} @628xx*`
        );
    }

    await conn.groupParticipantsUpdate(m.chat, targets, "promote");

    m.reply(`🌸 ¡Listo! Los usuarios seleccionados ahora son administradores del grupo.`);
};

handler.help = ["promote"];
handler.tags = ["group"];
handler.command = /^(promote)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;