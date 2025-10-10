import yts from "yt-search";

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text)
        return m.reply(
            `🍬 *Ingresá primero la palabra clave para buscar!* \n\n🍭 *Ejemplo: ${usedPrefix + command} Serana*`
        );
    try {
        await global.loading(m, conn);
        let search = await yts(text);
        let results = search.videos;
        if (!results.length) return m.reply("🍩 *No se encontraron videos!*");

        let sections = [
            {
                title: "🍱 Resultados de YouTube",
                rows: results.slice(0, 10).map((v, i) => ({
                    header: `🍙 ${v.title}`,
                    title: `${i + 1}. ${v.author.name}`,
                    description: `🍜 Duración: ${v.timestamp} | 👀 ${v.views} vistas`,
                    id: `.play ${v.title}`,
                })),
            },
        ];

        await conn.sendMessage(
            m.chat,
            {
                image: { url: results[0].thumbnail },
                caption: `🍰 *Se encontraron ${results.length} resultados en YouTube!* 🍡\n🍓 *Elegí el Video/Audio que quieras reproducir~*`,
                footer: "🍛 Búsqueda YouTube",
                title: "🍤 Seleccioná un resultado",
                interactiveButtons: [
                    {
                        name: "single_select",
                        buttonParamsJson: JSON.stringify({
                            title: "🍙 Elegir resultado",
                            sections,
                        }),
                    },
                ],
            },
            { quoted: m }
        );
    } finally {
        await global.loading(m, conn, true);
    }
};

handler.help = ["ytsearch"];
handler.tags = ["internet"];
handler.command = /^(yt(s|search)|youtubesearch)$/i;

export default handler;