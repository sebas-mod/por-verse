let handler = async (m, { conn }) => {
    let plugins = Object.values(global.plugins);
    let totalHelp = plugins.reduce(
        (sum, plugin) => sum + (plugin.help ? plugin.help.length : 0),
        0
    );
    let totalTags = [...new Set(plugins.flatMap((v) => v.tags || []))].length;
    let totalPlugins = plugins.length;

    await conn.sendMessage(
        m.chat,
        {
            text: `✨ *Estadísticas de mis plugins*\n\n📚 *Total de funciones:* ${totalHelp}\n🏷️ *Total de menús:* ${totalTags}\n📂 *Total de plugins:* ${totalPlugins}\n\n🍀 ¡Gracias por usar el bot!`,
        },
        { quoted: m }
    );
};

handler.help = ["totalcmd"];
handler.tags = ["info"];
handler.command = /^(totalcmd)$/i;
handler.owner = true;

export default handler;