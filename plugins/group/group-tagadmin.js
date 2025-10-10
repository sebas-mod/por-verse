let handler = async (m, { conn, participants, groupMetadata }) => {
    // Obtener foto de perfil del grupo, con fallback si no hay
    let pp = await conn
        .profilePictureUrl(m.chat, "image")
        .catch((_) => "https://i.ibb.co.com/WY9SCc2/150fa8800b0a0d5633abc1d1c4db3d87.jpg");

    const { subject } = groupMetadata;
    const groupAdmins = participants.filter((p) => p.admin);
    const mentionJids = groupAdmins.map((p) => p.id);

    let listaAdmins = groupAdmins
        .map((admin, i) => `*❁ ${i + 1}.* @${admin.id.split("@")[0]}`)
        .join("\n");

    let caption = `
*╭─❁ Lista de Admins ❁*
*│ Grupo: ${subject}*
*│*
${listaAdmins}
*╰─────────────❁*
`.trim();

    await conn.sendMessage(
        m.chat,
        {
            image: { url: pp },
            caption,
            mentions: mentionJids,
        },
        { quoted: m }
    );
};

handler.help = ["tagadmin"];
handler.tags = ["group"];
handler.command = /^(tagadmin|listadmin)$/i;
handler.group = true;
handler.owner = true;

export default handler;