let handler = async (m, { conn }) => {
    // vCard principal del owner
    let vcard = `BEGIN:VCARD
VERSION:3.0
FN:KenisawaDev
ORG:KenisawaDev
TITLE:Developer
EMAIL;type=INTERNET:mauroazcurra035@gmail.com
TEL;type=CELL;waid=5493865642938:+5493865642938
ADR;type=WORK:;;Argentina;;;;
URL;type=WORK:https://instagram.com/kenisawadevolper
X-WA-BIZ-NAME:KenisawaDev
X-WA-BIZ-DESCRIPTION:El desarrollador del bot
X-WA-BIZ-HOURS:Mo-Su 00:00-23:59
END:VCARD`;

    let qkontak = {
        key: { fromMe: false, participant: "0@s.whatsapp.net", remoteJid: "status@broadcast" },
        message: { contactMessage: { displayName: "KenisawaDev", vcard } },
    };

    // Envío del contacto principal
    await conn.sendMessage(
        m.chat,
        {
            contacts: { displayName: "KenisawaDev", contacts: [{ vcard }] },
            contextInfo: {
                externalAdReply: {
                    title: "Copyright © 2024 - 2025 KenisawaDev",
                    body: "Contactá directo por WhatsApp",
                    thumbnailUrl: "https://files.catbox.moe/njlcj8.jpg",
                    mediaType: 1,
                    renderLargerThumbnail: true,
                },
            },
        },
        { quoted: qkontak }
    );

    // Envío de los miembros del team (excluyendo el owner principal)
    let team = global.config.owner.filter(([num]) => num !== "5493865642938");
    if (team.length) {
        let vcards = team.map(([num, name]) => ({
            vcard: `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL;type=CELL;waid=${num}:${num}
END:VCARD`,
        }));

        await conn.sendMessage(
            m.chat,
            {
                contacts: {
                    displayName: "Deluxe Team",
                    contacts: vcards,
                },
            },
            { quoted: qkontak }
        );
    }
};

handler.help = ["owner"];
handler.tags = ["info"];
handler.command = /^(owner|creator)$/i;

export default handler;