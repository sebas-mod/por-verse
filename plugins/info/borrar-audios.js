import fs from "fs"
import path from "path"

let handler = async (m, { args, usedPrefix, command }) => {
  const name = args.join(" ").trim()
  if (!name) return m.reply(`🗑️ *Uso correcto:* ${usedPrefix + command} <nombre>`)

  const dbPath = path.join("./database/audios.json")
  if (!fs.existsSync(dbPath)) return m.reply("📂 No hay audios guardados.")

  let db = JSON.parse(fs.readFileSync(dbPath))
  let index = db.findIndex(a => a.name === name)
  if (index === -1) return m.reply("❌ No se encontró un audio con ese nombre.")

  const audio = db[index]
  if (fs.existsSync(audio.path)) fs.unlinkSync(audio.path)

  db.splice(index, 1)
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))
  m.reply(`🗑️ Audio *${name}* eliminado correctamente.`)
}
handler.help = ["borrar-audio <nombre>"]
handler.tags = ["info"]
handler.command = /^(borrar-audio|eliminar-audio|del-audio)$/i
export default handler
