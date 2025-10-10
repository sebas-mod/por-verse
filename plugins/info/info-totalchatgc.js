let handler = async (m, { conn }) => {
    let user = global.db.data.chats[m.chat].member;
    let members = Object.keys(user)
        .filter((v) => v != conn.user.jid)
        .sort((a, b) => {
            const totalA = user[a].chat;
            const totalB = user[b].chat;
            return totalB - totalA;
        });

    let numero = 1;
    let chatHoy = 0;
    let chatTotal = 0;

    for (let memberId of members) {
        chatHoy += user[memberId].chat;
        chatTotal += user[memberId].chatTotal;
    }

    let encabezado = `🍙 *Estadísticas de Chat del Grupo* 🍙\n🍜 *Total Hoy:* ${formatNumber(chatHoy)} chats\n🍤 *Total Acumulado:* ${formatNumber(chatTotal)} chats\n━━━━━━━━━━━━━━\n\n`;
    let cuerpo = "";

    for (let i = 0; i < Math.min(10, members.length); i++) {
        if (typeof user[members[i]] != "undefined") {
            cuerpo += `🍡 *${numero++}. ${await conn.getName(members[i])}*\n`;
            cuerpo += `🍱 *Chats Hoy:* ${formatNumber(user[members[i]].chat)}\n`;
            cuerpo += `🍰 *Total Chats:* ${formatNumber(user[members[i]].chatTotal)}\n`;
            cuerpo += `🍩 *Última Actividad:* ${getTimeAgo(user[members[i]].lastseen)}\n\n`;
        }
    }

    await m.reply(encabezado + cuerpo.trim());
};

handler.help = ["totalchatgc"];
handler.tags = ["info"];
handler.command = /^(totalchatgc)$/i;
handler.group = true;
handler.admin = true;

export default handler;

export function parseMs(ms) {
    if (typeof ms !== "number") throw "El parámetro debe ser un número";
    return {
        days: Math.trunc(ms / 86400000),
        hours: Math.trunc(ms / 3600000) % 24,
        minutes: Math.trunc(ms / 60000) % 60,
        seconds: Math.trunc(ms / 1000) % 60,
    };
}

export function getTimeAgo(ms) {
    let now = parseMs(+new Date() - ms);
    if (now.days) return `${now.days} días atrás 🍙`;
    else if (now.hours) return `${now.hours} horas atrás 🍜`;
    else if (now.minutes) return `${now.minutes} minutos atrás 🍤`;
    else return `hace unos segundos 🍡`;
}

const formatNumber = (number) => parseInt(number).toLocaleString("es-AR");