let handler = async (m, { conn, args, usedPrefix, command }) => {
  const chat = m.chat
  if (!m.isGroup) return m.reply("❌ Este comando solo funciona en grupos.")

  // Obtener metadata del grupo y participantes
  const groupMetadata = await conn.groupMetadata(chat)
  const participants = groupMetadata.participants

  // Verificar si el usuario y el bot son admin
  const sender = m.sender
  const isAdmin = participants.find(p => p.id === sender)?.admin
  const isBotAdmin = participants.find(p => p.id === conn.user.jid)?.admin

  if (!isAdmin) return m.reply("❌ Solo los admins pueden usar este comando.")
  if (!isBotAdmin) return m.reply("❌ Necesito ser admin para cerrar o abrir el grupo.")

  let msTime = null
  let timeStr = null

  // Validar tiempo si se proporcionó
  if (args.length >= 2) {
    let timeNum = parseInt(args[0])
    let unit = args[1].toLowerCase()
    if (isNaN(timeNum)) return m.reply("❌ Debes poner un número válido para el tiempo.")

    if (unit.startsWith("seg")) msTime = timeNum * 1000
    else if (unit.startsWith("min")) msTime = timeNum * 60 * 1000
    else if (unit.startsWith("hor")) msTime = timeNum * 60 * 60 * 1000
    else return m.reply("❌ Unidad inválida. Usa segundos, minutos u horas.")

    const future = new Date(Date.now() + msTime)
    timeStr = future.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
  }

  if (command.toLowerCase() === "cerrar") {
    await conn.groupSettingUpdate(chat, "announcement") // solo admins
    if (msTime) {
      m.reply(`🔒 El grupo ha sido cerrado.\n⏰ Se reabrirá automáticamente a las ${timeStr}.`)
      setTimeout(async () => {
        await conn.groupSettingUpdate(chat, "not_announcement")
        conn.sendMessage(chat, { text: `🔓 El grupo se ha reabierto automáticamente a las ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}.` })
      }, msTime)
    } else {
      m.reply("🔒 El grupo ha sido cerrado indefinidamente. Solo los admins pueden enviar mensajes.")
    }

  } else if (command.toLowerCase() === "abrir") {
    await conn.groupSettingUpdate(chat, "not_announcement") // todos pueden enviar
    if (msTime) {
      m.reply(`🔓 El grupo ha sido abierto.\n⏰ Se cerrará automáticamente a las ${timeStr}.`)
      setTimeout(async () => {
        await conn.groupSettingUpdate(chat, "announcement")
        conn.sendMessage(chat, { text: `🔒 El grupo se ha cerrado automáticamente a las ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}.` })
      }, msTime)
    } else {
      m.reply("🔓 El grupo ha sido abierto indefinidamente. Todos pueden enviar mensajes.")
    }

  } else {
    m.reply("❌ Comando desconocido, usa cerrar o abrir.")
  }
}

handler.help = ["cerrar [tiempo unidad]", "abrir [tiempo unidad]"]
handler.tags = ["grupo"]
handler.command = /^(cerrar|abrir)$/i

export default handler
