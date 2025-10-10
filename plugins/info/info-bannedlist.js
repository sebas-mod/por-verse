let handler = async (m, { conn }) => {
    let chats = Object.entries(global.db.data.chats).filter(([jid, chat]) => chat.isBanned);
    let users = Object.entries(global.db.data.users).filter(([jid, user]) => user.banned);
    let now = Date.now();

    let chatList = await Promise.all(
        chats.map(async ([jid], i) => {
            let name = await conn.getName(jid).catch(() => "Desconocido");
            let tiempo =
                now - global.db.data.chats[jid].isBannedTime < 0
                    ? msToDate(global.db.data.chats[jid].isBannedTime - now)
                    : "Baneo Permanente";
            return `*│ ${i + 1}. ${name}*\n*│ ${jid}*\n*│ ⏱ ${tiempo}*`;
        })
    );

    let userList = await Promise.all(
        users.map(async ([jid], i) => {
            let name = await conn.getName(jid).catch(() => "Desconocido");
            let tiempo =
                now - global.db.data.users[jid].bannedTime < 0
                    ? msToDate(global.db.data.users[jid].bannedTime - now)
                    : "Baneo Permanente";
            return `*│ ${i + 1}. ${name}*\n*│ ${jid}*\n*│ ⏱ ${tiempo}*`;
        })
    );

    let texto = `
🍩 *LISTA DE BANEOS* 🍩

*┌🥯 Chats Baneados*
*│ Total: ${chats.length}*
${chatList.length ? chatList.join("\n│\n") : "*│ 🍡 No hay chats baneados~*"}
*└────*

*┌🧁 Usuarios Baneados*
*│ Total: ${users.length}*
${userList.length ? userList.join("\n│\n") : "*│ 🍡 No hay usuarios baneados~*"}
*└────*
`.trim();

    m.reply(texto);
};

handler.help = ["bannedlist"];
handler.tags = ["info"];
handler.command = /^(listban(ned)?|ban(ned)?list|daftarban(ned)?)$/i;
handler.owner = true;

export default handler;

function msToDate(ms) {
    let dias = Math.floor(ms / (24 * 60 * 60 * 1000));
    let restoDias = ms % (24 * 60 * 60 * 1000);
    let horas = Math.floor(restoDias / (60 * 60 * 1000));
    let restoHoras = restoDias % (60 * 60 * 1000);
    let minutos = Math.floor(restoHoras / (60 * 1000));
    return `${dias} 🍪 días ${horas} 🍭 horas ${minutos} 🍫 minutos`;
}