let handler = async (m, { conn, groupMetadata }) => {
    try {
        // Obtener código de invitación del grupo
        let link = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`;

        // Texto decorativo para el mensaje
        let teks = `
🍡 *Nombre del Grupo:* ${groupMetadata.subject}
🍰 *ID del Grupo:* ${m.chat}

🍬 *¡Haz clic en el botón de abajo para copiar el link del grupo y compartirlo con tus amiguitos!* 💌
`.trim();

        // Enviar mensaje interactivo con botón de copiar
        await conn.sendMessage(
            m.chat,
            {
                text: teks,
                title: "🍓 Link de Invitación del Grupo",
                footer: "© 2025 Kenisawadevolper",
                interactiveButtons: [
                    {
                        name: "cta_copy",
                        buttonParamsJson: JSON.stringify({
                            display_text: "🍩 Copiar Link del Grupo",
                            copy_code: link,
                        }),
                    },
                ],
            },
            { quoted: m }
        );
    } catch (e) {
        console.error(e);
        m.reply(
            "🍪 *¡Ups! No se pudo obtener el link del grupo. Asegúrate de que el bot sea admin y que el grupo no esté en modo privado.*"
        );
    }
};

handler.help = ["grouplink"];
handler.tags = ["group"];
handler.command = /^(grouplink|link)$/i;
handler.group = true;
handler.botAdmin = true;

export default handler;