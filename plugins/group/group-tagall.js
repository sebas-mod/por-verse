let handler = async (m, { conn, text, participants }) => {
    let mensaje = text
        ? `📝 *Mensaje del Owner:*\n${text}`
        : "*––––––『 invocando』––––––*";
    let textoFinal = `${mensaje}`;
    
    for (let miembro of participants) {
        textoFinal += `\n@${miembro.id.split("@")[0]}`;
    }

    await conn.sendMessage(m.chat, {
        text: textoFinal,
        mentions: participants.map((p) => p.id),
    });
};

handler.help = ["tagall"];
handler.tags = ["group"];
handler.command = /^(tagall|todos)$/i;
handler.group = true;
handler.owner = true;

export default handler;