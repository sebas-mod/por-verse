let handler = async (m, { conn }) => {
    let who = m.mentionedJid[0]
        ? m.mentionedJid[0]
        : m.quoted
          ? m.quoted.sender
          : m.fromMe
            ? conn.user.jid
            : m.sender;

    let user = global.db.data.users[who];
    let isSender = who === m.sender;

    if (!user.banned) {
        return m.reply(
            `🍩 *${isSender ? "Vos" : `@${who.split("@")[0]}`} no estás baneado~*`,
            false,
            { mentions: [who] }
        );
    }

    let now = Date.now();
    let status =
        user.bannedTime === 999
            ? "🍯 *Estado: Baneo Permanente~*"
            : `🍪 *Tiempo restante:* ${msToDate(user.bannedTime - now)}`;

    let caption = `
🍓 *Estado del Baneo*
━━━━━━━━━━━━━━
🍬 *Usuario:* ${isSender ? "Vos" : `@${who.split("@")[0]}`}
${status}
━━━━━━━━━━━━━━
`.trim();

    m.reply(caption, false, { mentions: [who] });
};

handler.help = ["checkbanned"];
handler.tags = ["info"];
handler.command = /^(checkbanned|cekbanned|checkban|cekban)$/i;

export default handler;

function msToDate(ms) {
    let dias = Math.floor(ms / (24 * 60 * 60 * 1000));
    let restoDias = ms % (24 * 60 * 60 * 1000);
    let horas = Math.floor(restoDias / (60 * 60 * 1000));
    let restoHoras = restoDias % (60 * 60 * 1000);
    let minutos = Math.floor(restoHoras / (60 * 1000));

    return `
*${dias} días*
*${horas} horas*
*${minutos} minutos*
`.trim();
}