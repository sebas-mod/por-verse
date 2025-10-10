let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return m.reply(
        `🎮 *Ingresá el nombre de usuario de Roblox para buscar.*\n\n` +
        `👉 Ejemplo: ${usedPrefix + command} M4auroAzc`
    );

    await global.loading(m, conn);

    try {
        let username = args[0];
        let res = await fetch(`https://api.platform.web.id/roblox-stalk?username=${encodeURIComponent(username)}`);
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        let data = await res.json();
        if (!data || !data.account) throw new Error("No se encontró la cuenta.");

        let account = data.account;
        let presence = data.presence;
        let stats = data.stats;
        let badges = data.badges || [];
        let friends = data.friendList || [];

        // Construimos el mensaje
        let caption = `🎮 *Roblox Stalk* 🎮\n\n`;
        caption += `👤 *Usuario:* ${account.username}\n`;
        caption += `💠 *Display Name:* ${account.displayName}\n`;
        caption += `📝 *Descripción:* ${account.description || "-"}\n`;
        caption += `📅 *Creación:* ${new Date(account.created).toLocaleDateString()}\n`;
        caption += `🚫 *Baneado:* ${account.isBanned ? "Sí" : "No"}\n`;
        caption += `✔️ *Verificado:* ${account.hasVerifiedBadge ? "Sí" : "No"}\n\n`;
        caption += `💻 *Estado:* ${presence.isOnline ? "En línea" : "Desconectado"}\n`;
        caption += `🕹️ *Último juego:* ${presence.recentGame || "N/A"}\n\n`;
        caption += `👥 *Amigos:* ${stats.friendCount}\n`;
        caption += `📎 *Seguidores:* ${stats.followers}\n`;
        caption += `📌 *Siguiendo:* ${stats.following}\n\n`;
        if (badges.length) caption += `🏅 *Badges:* ${badges.map(b => b.name).join(", ")}\n\n`;
        if (friends.length) caption += `🤝 *Primeros amigos:* ${friends.slice(0, 5).map(f => f.displayName).join(", ")}\n`;

        await conn.sendMessage(
            m.chat,
            { image: { url: account.profilePicture }, caption },
            { quoted: m }
        );

    } catch (e) {
        console.error(e);
        m.reply(`❌ *Error al buscar usuario de Roblox.*\n📄 ${e.message}`);
    } finally {
        await global.loading(m, conn, true);
    }
};

handler.help = ["roblox <usuario>"];
handler.tags = ["tool"];
handler.command = /^roblox$/i;

export default handler;