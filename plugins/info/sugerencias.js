let handler = async (m, { text, conn }) => {
  if (!text) return m.reply("❌ Por favor escribe tu sugerencia después del comando.\nEjemplo: .sugerencia Me gustaría que el bot tenga música")

  // Obtener los owners del bot
  const owners = global.config.owner.map(([num]) => num.replace(/[^0-9]/g, '') + "@s.whatsapp.net")

  // Mensaje que se enviará al owner
  let msg = `📨 *Nueva sugerencia recibida*\n\n`
  msg += `👤 De: @${m.sender.split("@")[0]}\n`
  msg += `💬 Mensaje:\n${text}`

  // Enviar la sugerencia a todos los owners
  for (let owner of owners) {
    await conn.sendMessage(owner, { text: msg, mentions: [m.sender] })
  }

  // Responder al usuario
  await m.reply("✅ Tu mensaje ha sido enviado a mi creador, ¡gracias por tu sugerencia!")
}

handler.help = ["sugerencia <mensaje>"]
handler.tags = ["info"]
handler.command = /^(sugerencia)$/i

export default handler
