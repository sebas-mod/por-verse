import fs from "fs"
import path from "path"

const dbFolder = path.join(process.cwd(), "database")
const dbPath = path.join(dbFolder, "audios.json")

// Asegurar que exista la carpeta database
if (!fs.existsSync(dbFolder)) fs.mkdirSync(dbFolder, { recursive: true })

// Asegurar que exista audios.json
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, "[]")

let handler = async (m, { command, conn }) => {
  // Leer la base de datos
  let db
  try {
    db = JSON.parse(fs.readFileSync(dbPath))
  } catch {
    db = []
    fs.writeFileSync(dbPath, "[]") // Reinicia el JSON si está corrupto
  }

  // Buscar audio por nombre
  const audio = db.find(a => a.name.toLowerCase() === command.toLowerCase())
  if (!audio) return m.reply(`❌ No se encontró un audio llamado *${command}*`)

  // Construir ruta absoluta del archivo
  let audioPath = path.isAbsolute(audio.path) ? audio.path : path.join(process.cwd(), audio.path)

  if (!fs.existsSync(audioPath)) {
    return m.reply(`⚠️ El archivo del audio *${audio.name}* no existe en la ruta:\n${audioPath}`)
  }

  // Avisar que se va a reproducir
  await m.reply(`🎧 Reproduciendo: *${audio.name}*`)

  // Enviar audio como nota de voz (PTT)
  await conn.sendMessage(
    m.chat,
    { audio: { url: audioPath }, mimetype: "audio/mp4", ptt: true },
    { quoted: m }
  )
}

handler.tags = ["info"]

// Generar comandos dinámicamente desde audios.json
const getCommands = () => {
  try {
    const db = JSON.parse(fs.readFileSync(dbPath))
    return db.map(a => a.name.toLowerCase())
  } catch {
    return []
  }
}

handler.command = new RegExp(`^(${getCommands().join("|")})$`, "i")

export default handler
