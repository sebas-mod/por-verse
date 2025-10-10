let handler = async (m, { conn, args, usedPrefix, command }) => {
    let action = (args[0] || "").toLowerCase();
    let durationArg = args[1];

    if (!["open", "close"].includes(action) || !durationArg) {
        return m.reply(
            `
🍩 *Formato incorrecto, amig@~ Ejemplo de uso:*

🍬 *Cerrar el grupo por 1 minuto:*
*${usedPrefix + command} close 1m*

🍡 *Abrir el grupo por 2 horas:*
*${usedPrefix + command} open 2h*

🍰 *Cerrar el grupo por 1 día:*
*${usedPrefix + command} close 1d*
`.trim()
        );
    }

    let durationMs = parseDuration(durationArg);
    if (!durationMs)
        return m.reply("🍫 *Formato de tiempo no válido! Usá m (minutos), h (horas) o d (días).*");

    let isClose = action === "close" ? "announcement" : "not_announcement";
    let now = new Date();

    await conn.groupSettingUpdate(m.chat, isClose);

    await conn.sendMessage(
        m.chat,
        {
            text: `🍙 *Grupo ${action === "close" ? "cerrado" : "abierto"} con éxito!*\n⏳ *Se revertirá automáticamente el estado el:*\n🕒 *${new Date(now.getTime() + durationMs).toLocaleString("es-AR")}*`,
            mentions: [m.sender],
        },
        { quoted: m }
    );

    setTimeout(async () => {
        let newStatus = isClose === "announcement" ? "not_announcement" : "announcement";
        await conn.groupSettingUpdate(m.chat, newStatus);
        await conn.sendMessage(m.chat, {
            text: `🍱 *¡Tiempo cumplido!*\n🍡 *El grupo ahora ha sido ${newStatus === "announcement" ? "cerrado" : "abierto"} nuevamente!*\n🕒 *Ahora: ${new Date().toLocaleString("es-AR")}*`,
            mentions: [m.sender],
        });
    }, durationMs);
};

handler.help = ["grouptime"];
handler.tags = ["group"];
handler.command = /^(grouptime|gctime)$/i;
handler.botAdmin = true;
handler.admin = true;
handler.group = true;

export default handler;

function parseDuration(str) {
    let match = str.match(/^(\d+)([mhd])$/i);
    if (!match) return null;

    let val = parseInt(match[1]);
    let unit = match[2].toLowerCase();

    switch (unit) {
        case "m":
            return val * 60 * 1000; // minutos
        case "h":
            return val * 60 * 60 * 1000; // horas
        case "d":
            return val * 24 * 60 * 60 * 1000; // días
        default:
            return null;
    }
}