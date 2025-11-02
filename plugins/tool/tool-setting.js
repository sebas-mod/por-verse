let handler = async (m, { conn, isOwner, isAdmin, args, usedPrefix, command }) => {
    let chat = global.db.data.chats[m.chat];
    let bot = global.db.data.settings[conn.user.jid] || {};

    let features = [
        { key: "adminOnly", scope: "chat", name: "👑 Solo Admins" },
        { key: "detect", scope: "chat", name: "🔔 Detección" },
        { key: "otakuNews", scope: "chat", name: "📰 Noticias Otaku" },
        { key: "notifgempa", scope: "chat", name: "🌋 Alerta de Sismos" },
        { key: "antidelete", scope: "chat", name: "🛡️ Anti Eliminar" },
        { key: "antiLinks", scope: "chat", name: "🔗 Anti Enlaces" },
        { key: "antitagsw", scope: "chat", name: "🚫 Anti Tag SW" },
        { key: "antiSticker", scope: "chat", name: "🥟 Anti Stickers" },
        { key: "antiAudio", scope: "chat", name: "🎵 Anti Audios" },
        { key: "antiFile", scope: "chat", name: "📂 Anti Archivos" },
        { key: "antiFoto", scope: "chat", name: "📸 Anti Fotos" },
        { key: "antiVideo", scope: "chat", name: "🎥 Anti Videos" },
        { key: "autoApprove", scope: "chat", name: "✅ Auto Aprobar" },
        { key: "teks", scope: "chat", name: "💬 Responder Texto" },

        { key: "self", scope: "bot", name: "🤖 Modo Self" },
        { key: "gconly", scope: "bot", name: "👥 Solo Grupos" },
        { key: "queque", scope: "bot", name: "📨 Cola de Mensajes" },
        { key: "noprint", scope: "bot", name: "🖨️ Sin Logs" },
        { key: "autoread", scope: "bot", name: "👁️ Lectura Automática" },
        { key: "composing", scope: "bot", name: "⌨️ Escribiendo..." },
        { key: "restrict", scope: "bot", name: "⛔ Restricciones" },
        { key: "backup", scope: "bot", name: "💾 Auto Backup" },
        { key: "cleartmp", scope: "bot", name: "🧹 Limpiar Archivos Tmp" },
        { key: "anticall", scope: "bot", name: "📵 Anti Llamadas" },
        { key: "adReply", scope: "bot", name: "📢 Modo Publicidad" },
        { key: "noerror", scope: "bot", name: "🙈 Ocultar Errores" },
    ];

    let raw = m.selectedButtonId || m.text || "";
    let [cmd, mode, fiturKey] = raw.trim().split(" ");
    if (cmd === ".setting" && fiturKey) {
        let fitur = features.find((f) => f.key === fiturKey);
        if (!fitur) return m.reply("❌ *La función no existe.*");
        if (!["enable", "disable"].includes(mode))
            return m.reply(
                `⚠️ *Formato incorrecto.*\nUsa: ${usedPrefix + command} enable|disable [función]`
            );
        let isEnable = mode === "enable";
        if (fitur.scope === "chat") {
            if (!(isAdmin || isOwner)) return global.dfail("admin", m, conn);
            chat[fitur.key] = isEnable;
        } else if (fitur.scope === "bot") {
            if (!isOwner) return global.dfail("owner", m, conn);
            bot[fitur.key] = isEnable;
        }
        return m.reply(
            `🍣 *La función ${fitur.name} ahora está ${isEnable ? "ACTIVADA 🍱" : "DESACTIVADA 🍵"}!*`
        );
    }
    if (!args[0]) {
        let availableFeatures = isOwner ? features : features.filter((f) => f.scope === "chat");
        let buttons = [
            {
                name: "single_select",
                buttonParamsJson: JSON.stringify({
                    title: "🍙 Activar Funciones",
                    sections: [
                        {
                            title: isOwner ? "🍜 Todas las Funciones" : "🍜 Funciones del Chat",
                            rows: availableFeatures.map((f) => {
                                let aktif = f.scope === "chat" ? chat[f.key] : bot[f.key];
                                return {
                                    header: aktif ? "🟢 Activo" : "🔴 Inactivo",
                                    title: `${f.name}`,
                                    description: aktif
                                        ? `✅ Actualmente activado`
                                        : `❌ Actualmente desactivado`,
                                    id: `.setting enable ${f.key}`,
                                };
                            }),
                        },
                    ],
                }),
            },
            {
                name: "single_select",
                buttonParamsJson: JSON.stringify({
                    title: "🍤 Desactivar Funciones",
                    sections: [
                        {
                            title: isOwner ? "🍣 Todas las Funciones" : "🍣 Funciones del Chat",
                            rows: availableFeatures.map((f) => {
                                let aktif = f.scope === "chat" ? chat[f.key] : bot[f.key];
                                return {
                                    header: aktif ? "🟢 Activo" : "⚪ Ya desactivado",
                                    title: `${f.name}`,
                                    description: aktif
                                        ? `👉 Click para desactivar`
                                        : `🚫 Ya desactivado`,
                                    id: `.setting disable ${f.key}`,
                                };
                            }),
                        },
                    ],
                }),
            },
        ];
        return conn.sendMessage(
            m.chat,
            {
                text: "🍱 *Menú de configuración interactiva del Bot* 🍱\n\n👉 Selecciona qué función deseas activar o desactivar:",
                footer: "⚙️ *Panel de Control* ⚙️",
                title: "🍡 Configuración del Bot",
                interactiveButtons: buttons,
            },
            { quoted: m }
        );
    }
};

handler.help = ["setting"];
handler.tags = ["tools"];
handler.command = /^(setting)$/i;
handler.group = true;

export default handler;
