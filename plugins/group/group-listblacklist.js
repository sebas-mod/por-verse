let handler = async (m) => {
    let chat = global.db.data.chats[m.chat];
    chat.member = chat.member || {};
    let listUser = Object.entries(chat.member).filter(([_, v]) => v.blacklist);

    if (listUser.length === 0)
        return m.reply("🍩 *¡No hay usuarios en la lista negra de este grupo todavía~!*");

    let caption = `
🍓 *Lista de Usuarios en Blacklist del Grupo:*\n
${await Promise.all(
        listUser.map(async ([number, value], i) => {
            let time = formatDate(value.blacklistTime);
            return `🍡 *${i + 1}.* @${number.split("@")[0]}
🕒 *Agregado a blacklist:* ${time}`;
        })
    ).then((res) => res.join("\n\n"))}
`.trim();

    await m.reply(caption, false, {
        contextInfo: {
            mentionedJid: listUser.map(([number]) => number),
        },
    });
};

handler.help = ["listblacklist"];
handler.tags = ["group"];
handler.command = /^(listblacklist|lbl)$/i;
handler.group = true;
handler.owner = true;

export default handler;

// Función para formatear la fecha de forma amigable
function formatDate(timestamp) {
    let date = new Date(timestamp);
    let options = {
        weekday: "long",      // día de la semana
        year: "numeric",      // año completo
        month: "long",        // nombre del mes
        day: "numeric",       // día del mes
        hour: "2-digit",      // hora en 2 dígitos
        minute: "2-digit",    // minutos en 2 dígitos
        second: "2-digit",    // segundos en 2 dígitos
        hour12: false,        // formato 24 horas
        timeZone: "America/Argentina/Buenos_Aires", // zona horaria argentina
    };
    return date.toLocaleString("es-AR", options).trim();
}