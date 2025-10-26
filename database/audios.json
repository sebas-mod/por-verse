import fs from "fs"
import path from "path"

let handler = async (m, { command, conn }) => {
  const dbPath = path.join("./database/audios.json")
  if (!fs.existsSync(dbPath)) return // No hay base de datos aún

  const db = JSON.parse(fs.readFileSync(dbPath))
  const audio = db.find(a => a.name.toLowerCase() === command.toLowerCase())
  if (!audio) return // Si no existe el audio, ignora el mensaje

  if (!fs.existsSync(audio.path)) {
    return m.reply(`⚠️ El archivo del audio *${audio.name}* ya no existe.`)
  }

  await m.reply(`🎧 Reproduciendo: *${audio.name}*`)
  await conn.sendMessage(
    m.chat,
    { audio: { url: audio.path }, mimetype: "audio/mp4", ptt: true },
    { quoted: m }
  )
}

handler.tags = ["info"]

// 🔥 Genera dinámicamente los comandos con prefijo
const getCommands = () => {
  const dbPath = path.join("./database/audios.json")
  if (!fs.existsSync(dbPath)) return []
  try {
    const db = JSON.parse(fs.readFileSync(dbPath))
    return db.map(a => a.name.toLowerCase())
  } catch {
    return []
  }
}

// Se cargan dinámicamente los nombres como comandos válidos
handler.command = new RegExp(`^(${getCommands().join("|")})$`, "i")

export default handler
