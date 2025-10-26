import fs from "fs"
import path from "path"

const dbFolder = path.join(process.cwd(), "database")
const dbPath = path.join(dbFolder, "audios.json")

// Asegurar que exista la carpeta database
if (!fs.existsSync(dbFolder)) fs.mkdirSync(dbFolder, { recursive: true })

// Asegurar que exista audios.json
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, "[]")

// Leer base de datos
const readDB = () => {
  try {
    return JSON.parse(fs.readFileSync(dbPath))
  } catch {
    fs.writeFileSync(dbPath, "[]") // Reinicia JSON si está corrupto
    return []
  }
}

// Generar comandos dinámicamente desde audios.json
const getCommands = () => {
  const db = readDB()
  return db.map(a => a.name.toLowerCase())
}

// Solo crear el regex si hay audios guardados
const commands = getCommands()
const commandRegex = commands.length > 0 ? new RegExp(`^(${commands.join("|")})$`, "i") : /^$/i

let handler = async (m, { command, conn }) => {
  const db = readDB()
  if (db.length === 0) return m.reply("📂 No hay audios guardados aún.")

  // Buscar audio por nombre
  const audio = db.find(a => a.name.toLowerCase() === command.toLowerCase())
  if (!audio) return m.reply(`❌ No se encontró un audio llamado *${command}*`)

  // Construir ruta absoluta del archivo
  const audioPath = path.isAbsolute(audio.path) ? audio.path : path.join(process.cwd(), audio.path)
  if (!fs.existsSync(audioPath)) {
    return m.reply(`⚠️ El archivo del audio *${audio.name}* ya no existe en la ruta:\n${audioPath}`)
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
handler.command = commandRegex

export default handler
