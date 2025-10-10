let handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        if (!text || !/^https:\/\/github\.com\/[\w-]+\/[\w-]+/i.test(text)) {
            return m.reply(
                `❌ *Ingresa una URL válida de GitHub!*\n\n📌 *Ejemplo:* ${usedPrefix + command} https://github.com/usuario/repositorio`
            );
        }

        await global.loading(m, conn);

        let parts = text.split("/");
        if (parts.length < 5) return m.reply("⚠️ *La URL de GitHub está incompleta!*");

        let user = parts[3];
        let repo = parts[4];
        let url = `https://api.github.com/repos/${user}/${repo}/zipball`;
        let filename = `${repo}.zip`;

        await conn.sendFile(
            m.chat,
            url,
            filename,
            `✅ *Repositorio descargado con éxito:*\n📦 ${repo}`,
            m
        );
    } catch (e) {
        console.error(e);
        m.reply("❌ *Error al descargar el repositorio. Verificá que la URL sea correcta.*");
    } finally {
        await global.loading(m, conn, true);
    }
};

handler.help = ["gitclone"];
handler.tags = ["downloader"];
handler.command = /^(gitclone)$/i;

export default handler;