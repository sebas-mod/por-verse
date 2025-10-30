let handler = async (m, { conn, participants, isAdmin, isOwner }) => {
    // Verificar si es admin o creador del bot
    if (!isAdmin && !isOwner) {
        return conn.reply(m.chat, `❌ *Solo los administradores pueden usar este comando*`, m)
    }

    let total = participants.length
    let textoFinal = `🌸 *𝐀𝐋𝐘𝐀 𝐁𝐎𝐓 𝐋𝐎𝐒 𝐈𝐍𝐕𝐎𝐂𝐀...*\n\n🌸 *𝐌𝐄𝐍𝐂𝐈𝐎𝐍𝐀𝐍𝐃𝐎 𝐀: ${total} 𝐌𝐈𝐄𝐌𝐁𝐑𝐎𝐒*`

    for (let miembro of participants) {
        textoFinal += `\n🌸 @${miembro.id.split("@")[0]}`
    }

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
handler.admin = true // ✅ Solo admins
handler.owner = false

export default handler