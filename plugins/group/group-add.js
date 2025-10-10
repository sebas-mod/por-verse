let handler = async (m, { conn, args, usedPrefix, command }) => {
    let targets = [];
    for (let arg of args) {
        if (/^\d{5,}$/.test(arg)) {
            let jid = arg.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
            targets.push(jid);
        }
    }
    targets = [...new Set(targets)];
    if (!targets.length)
        return m.reply(`🍡 *Ejemplo de uso:* ${usedPrefix + command} 628xxxx 628xxxx`);
    
    let msg = `🍓 *¡Añadir miembros completado!*\n`;
    let inviteCode = await conn.groupInviteCode(m.chat);
    let groupMeta = await conn.groupMetadata(m.chat);

    for (let target of targets) {
        try {
            let res = await conn.groupParticipantsUpdate(m.chat, [target], "add");
            if (res[0]?.status === "200") {
                msg += `🧁 *Éxito:* @${target.split("@")[0]}\n`;
            } else {
                await conn.sendMessage(target, {
                    groupInvite: {
                        jid: m.chat,
                        name: groupMeta.subject,
                        caption: "📨 *¡Por favor, únete a mi grupo de WhatsApp!*",
                        code: inviteCode,
                        expiration: 86400,
                    },
                });
                msg += `🍬 *Invitación enviada a:* @${target.split("@")[0]} *(cuenta privada)*\n`;
            }
        } catch (e) {
            console.error(e);
            msg += `🍩 *Fallo al agregar:* @${target.split("@")[0]}\n`;
        }
        await delay(1500);
    }

    m.reply(msg.trim(), null, { mentions: targets });
};

handler.help = ["add"];
handler.tags = ["group"];
handler.command = /^(add)$/i;
handler.group = true;
handler.botAdmin = true;
handler.admin = true;

export default handler;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));