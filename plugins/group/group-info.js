let handler = async (m, { conn, participants, groupMetadata }) => {
    let pp = await conn
        .profilePictureUrl(m.chat, "image")
        .catch((_) => "https://i.ibb.co/WY9SCc2/150fa8800b0a0d5633abc1d1c4db3d87.jpg"); // imagen por defecto

    let { sWelcome, sBye, sPromote, sDemote } = global.db.data.chats[m.chat];
    let groupAdmins = participants.filter((p) => p.admin);
    let listAdmin = groupAdmins
        .map((v, i) => `🍩 *${i + 1}.* @${v.id.split("@")[0]}`)
        .join("\n");

    let owner =
        groupMetadata.owner ||
        groupAdmins.find((p) => p.admin === "superadmin")?.id ||
        m.chat.split`-`[0] + "@s.whatsapp.net";

    let text = `🎀 *Información del Grupo Actual* 🎀

🍡 *ID del Grupo:* 
*${groupMetadata.id}*

🍰 *Nombre del Grupo:* 
*${groupMetadata.subject}*

🍬 *Descripción:* 
${groupMetadata.desc?.toString() || "*Aún no hay descripción~*"}

🍓 *Cantidad de Miembros:* 
*${participants.length} personas*

🍮 *Dueño del Grupo:* 
@${owner.split("@")[0]}

🧁 *Administradores del Grupo:*
${listAdmin || "🌸 *Aún no hay admins* 🌸"}

🧸 *Mensajes Automáticos:*
🎉 *Bienvenida:* ${sWelcome || "Sin mensaje"}
👋 *Despedida:* ${sBye || "Sin mensaje"}
✨ *Promoción:* ${sPromote || "Sin mensaje"}
🔻 *Degradación:* ${sDemote || "Sin mensaje"}
`;

    await conn.sendFile(m.chat, pp, null, text.trim(), m, null, {
        mentions: [...groupAdmins.map((v) => v.id), owner],
    });
};

handler.help = ["infogrup"];
handler.tags = ["group"];
handler.command = /^(gro?upinfo|info(gro?up|gc))$/i;
handler.group = true;
handler.admin = true;

export default handler;