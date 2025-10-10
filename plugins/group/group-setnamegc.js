let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return m.reply(`🧁 *Ejemplo de uso: ${usedPrefix + command} Nuevo Nombre del Grupo*`);
    try {
        await conn.groupUpdateSubject(m.chat, args.join(" "));
        m.reply("🍰 *¡Nombre del grupo actualizado con éxito!*");
    } catch (e) {
        console.error(e);
        m.reply(
            "🍩 *No se pudo cambiar el nombre del grupo, quizá por limitaciones de tiempo o porque el bot no es admin~*"
        );
    }
};

handler.help = ["setnamegc"];
handler.tags = ["group"];
handler.command = /^(setnamegc)$/i;
handler.group = true;
handler.botAdmin = true;
handler.admin = true;

export default handler;