let handler = async (m, { conn, args, usedPrefix, command }) => {
    let estadoGrupo = {
        open: "not_announcement",   // Abrir grupo
        close: "announcement",      // Cerrar grupo
    }[(args[0] || "").toLowerCase()];

    if (estadoGrupo === undefined)
        return m.reply(
            `🍰 *Formato incorrecto, che~*\n*Usá uno de estos comandos:*\n🍓 *${usedPrefix + command} open* (Abrir grupo)\n🍓 *${usedPrefix + command} close* (Cerrar grupo)`.trim()
        );

    await conn.groupSettingUpdate(m.chat, estadoGrupo);
};

handler.help = ["group"];
handler.tags = ["group"];
handler.command = /^(g|group)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;