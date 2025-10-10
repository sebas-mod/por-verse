let handler = async (m, { text, usedPrefix, command }) => {
    let chat = global.db.data.chats[m.chat];
    if (!chat) chat = global.db.data.chats[m.chat] = {};
    
    if (!text) {
        if (chat.sWelcome) {
            chat.sWelcome = "";
            return m.reply(
                "🍩 *El mensaje de bienvenida fue reiniciado!* 🍰\n*Ahora no hay un mensaje de bienvenida especial en este grupo~*"
            );
        } else {
            return m.reply(
                `🍓 *¿Dónde está el texto de bienvenida, che?* 🍮\n\n*Ejemplo: ${usedPrefix + command} ¡Hola, @user! 🍭 Bienvenido/a a @subject* 🍬\n\n*Usá: • @user = mención del usuario*\n*• @subject = nombre del grupo*\n*• @desc = descripción del grupo*`
            );
        }
    }

    chat.sWelcome = text;
    return m.reply("🍰 *¡Mensaje de bienvenida configurado con éxito!* 🍓");
};

handler.help = ["setwelcome"];
handler.tags = ["group"];
handler.command = /^(setwelcome|setw)$/i;
handler.group = true;
handler.admin = true;

export default handler;