let handler = async (m, { text, usedPrefix, command }) => {
    let chat = global.db.data.chats[m.chat];
    if (!text) {
        return m.reply(
            `🍩 *Estado actual del Bot:*\n*${chat.mute ? "🤫 Bot está en modo silencioso" : "💬 Bot está activo"}*`
        );
    }
    switch (text.toLowerCase()) {
        case "off":
        case "mute":
            if (chat.mute) return m.reply("⚠️ *El Bot ya está en modo silencioso~*");
            chat.mute = true;
            m.reply("🌸 *¡Listo! El Bot ahora está en modo silencioso.*");
            break;
        case "on":
        case "unmute":
            if (!chat.mute) return m.reply("⚠️ *El Bot ya está activo~* 💬");
            chat.mute = false;
            m.reply("🌸 *¡Listo! El Bot se ha activado nuevamente~* 💬");
            break;
        default:
            m.reply(
                `❗ *Formato incorrecto!*\n\n💡 *Ejemplo: ${usedPrefix + command} on o ${usedPrefix + command} off*`
            );
    }
};

handler.help = ["botmode"];
handler.tags = ["group"];
handler.command = /^(bot(mode)?)$/i;
handler.owner = true;

export default handler;