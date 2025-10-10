let handler = async (m, { conn }) => {
    let users = global.db.data.users;
    let members = Object.keys(users)
        .filter((v) => typeof users[v].commandTotal != "undefined" && v != conn.user.jid)
        .sort((a, b) => users[b].command - users[a].command);

    let numero = 1;
    let commandHoy = 0;
    let commandTotal = 0;

    for (let id of members) {
        commandHoy += users[id].command;
        commandTotal += users[id].commandTotal;
    }

    let encabezado = `🍙 *Total de comandos hoy: ${formatNumber(commandHoy)}*\n🍜 *Total de todos los comandos: ${formatNumber(commandTotal)}*\n\n`;
    let cuerpo = "";

    for (let i = 0; i < Math.min(10, members.length); i++) {
        if (typeof users[members[i]] != "undefined") {
            cuerpo += `🍩 *${numero++}. ${await conn.getName(members[i])}*\n`;
            cuerpo += `🍡 *Comandos Hoy: ${formatNumber(users[members[i]].command)}*\n`;
            cuerpo += `🍤 *Total Comandos: ${formatNumber(users[members[i]].commandTotal)}*\n`;
            cuerpo += `🍱 *Último Comando: ${getTimeAgo(users[members[i]].lastseen)}*\n\n`;
        }
    }

    await m.reply(encabezado + cuerpo.trim());
};

handler.help = ["totalcommand"];
handler.tags = ["info"];
handler.command = /^(totalcommand(all)?)$/i;
handler.owner = true;

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