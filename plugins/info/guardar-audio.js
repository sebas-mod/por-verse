import fs from "fs"
import path from "path"

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let name = args.join(" ").trim()
  if (!name) return m.reply(`🎙️ *Uso correcto:* ${usedPrefix + command} <nombre>\n\nEjemplo: ${usedPrefix + command} saludo`)

  let quoted = m.quoted || m
  let mime = (quoted.msg || quoted).mimetype || ""
  if (!/audio/.test(mime)) return m.reply("⚠️ Responde a un *audio de voz o archivo de audio* para guardarlo.")

  const dbPath = path.join("./database/audios.json")
  if (!fs.existsSync("./database")) fs.mkdirSync("./database", { recursive: true })
  if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, "[]")

  const buffer = await quoted.download()
  const fileName = `${name}.mp3`
  const savePath = path.join("./database", fileName)
  fs.writeFileSync(savePath, buffer)

  let db = JSON.parse(fs.readFileSync(dbPath))
  if (db.find(a => a.name === name)) return m.reply("⚠️ Ya existe un audio con ese nombre.")

  db.push({
    name,
    author: m.sender,
    path: savePath,
    date: new Date().toISOString()
  })

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))
  m.reply(`✅ Audio *${name}* guardado correctamente.`)
}
handler.help = ["guardar <nombre>"]
handler.tags = ["info"]
handler.command = /^(guar|guardar)$/i
export default handler
