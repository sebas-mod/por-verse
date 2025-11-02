let handler = async (m, { conn }) => {
  let mensaje = await conn.sendMessage(m.chat, { text: "⏳ Probando edición..." }, { quoted: m })

  await new Promise(r => setTimeout(r, 2000))

  // ✅ Prueba método nuevo
  try {
    await conn.sendMessage(m.chat, { edit: mensaje.key.id, text: "✅ Método NUEVO detectado" })
    return
  } catch {}

  // ✅ Prueba método viejo
  try {
    await conn.editMessage(m.chat, mensaje.key.id, { text: "✅ Método VIEJO detectado" })
    return
  } catch {}

  m.reply("⚠️ Tu bot no reconoció ninguno, dime la versión de tu Luffy MD")
}

handler.command = /^testedit$/i
export default handler