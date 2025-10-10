let handler = async (m, { conn }) => {
    try {
        let data = await conn.fetchBlocklist();
        if (!data || !data.length) return m.reply("🍪 *No hay números bloqueados.*");

        let txt = `🍩 *Lista de Números Bloqueados*\n\n`;
        txt += `🍰 *Total: ${data.length}*\n`;
        txt += `━━━━━━━━━━━━━━\n\n`;
        txt += data.map((i, idx) => `${idx + 1}. 🍡 @${i.split("@")[0]}`).join("\n");

        await conn.reply(m.chat, txt, m, { mentions: data });
    } catch (err) {
        console.error(err);
        m.reply("🍪 *No se pudo obtener la lista de números bloqueados.*");
    }
};

handler.help = ["listblock"];
handler.tags = ["info"];
handler.command = /^(listb(lo(ck|k)?)?)$/i;
handler.owner = true;

export default handler;