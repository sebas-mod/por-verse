let handler = async (m, { conn }) => {
    try {
        // Revocar el link de invitación
        let newCode = await conn.groupRevokeInvite(m.chat);
        let newLink = `https://chat.whatsapp.com/${newCode}`;

        // Enviar mensaje con el nuevo link
        await conn.sendMessage(
            m.chat,
            {
                text: `🍓 *¡El link de invitación del grupo se ha reseteado con éxito!*`,
                title: "🍡 Link de Invitación del Grupo",
                footer: "📋 Presioná el botón de abajo para copiar el nuevo link~",
                buttons: [
                    {
                        name: "cta_copy",
                        buttonParamsJson: JSON.stringify({
                            display_text: "📋 Copiar Link del Grupo",
                            copy_code: newLink,
                        }),
                    },
                ],
            },
            { quoted: m }
        );
    } catch (e) {
        console.error(e);
        m.reply("🍩 *No se pudo resetear el link del grupo. Probá de nuevo más tarde~*");
    }
};

handler.help = ["revoke"];
handler.tags = ["group"];
handler.command = /^(revoke)$/i;
handler.group = true;
handler.botAdmin = true;
handler.admin = true;

export default handler;