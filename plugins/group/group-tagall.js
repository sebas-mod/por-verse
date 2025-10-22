let handler = async (m, { conn, participants }) => {
    let total = participants.length
    let textoFinal = `🌸 *𝐀𝐋𝐘𝐀 𝐁𝐎𝐓 𝐋𝐎𝐒 𝐈𝐍𝐕𝐎𝐂𝐀...*\n\n🌸 *𝐌𝐄𝐍𝐂𝐈𝐎𝐍𝐀𝐍𝐃𝐎 𝐀: ${total} 𝐌𝐈𝐄𝐌𝐁𝐑𝐎𝐒*`

    for (let miembro of participants) {
        textoFinal += `\n🌸 @${miembro.id.split("@")[0]}`
    }

    // solo un renglón antes de la firma final
    textoFinal += `\n🌸 *𝐁𝐘 𝐀𝐋𝐘𝐀 𝐁𝐎𝐓* 🌸`

    await conn.sendMessage(m.chat, {
        text: textoFinal.trim(),
        mentions: participants.map(p => p.id),
    })
}

handler.help = ["tagall"]
handler.tags = ["group"]
handler.command = /^(tagall|todos)$/i
handler.group = true
handler.owner = false

export default handler
