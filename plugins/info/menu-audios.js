import fs from "fs"
import path from "path"

let handler = async (m, { conn }) => {
  const dbPath = path.join("./database/audios.json")
  if (!fs.existsSync(dbPath)) return m.reply("📂 No hay audios guardados aún.")

  let db = JSON.parse(fs.readFileSync(dbPath))
  if (db.length === 0) return m.reply("📂 No hay audios en la base de datos.")

  let txt = `🎧 *Menú de Audios*\n\n`

  db.forEach((a, i) => {
    txt += `${i + 1}. 🎙️ *${a.name}*\n👤 Guardado por: @${a.author.split("@")[0]}\n\n`
  })

  txt += `────────────────────\n`
  txt += `💡 *Instrucciones:*\n`
  txt += `- Para *guardar* un audio: responde a un audio y escribe *guar* o *guardar* seguido del nombre.\n`
  txt += `  Ejemplo: *guardar saludo*\n`
  txt += `- Para *borrar* un audio: escribe *borrar-audio* seguido del nombre.\n`
  txt += `  Ejemplo: *borrar-audio saludo*\n`
  txt += `────────────────────`

  const imgPath = path.join("./database/menu.png") // reemplaza con tu imagen

  await conn.sendMessage(
    m.chat,
    { image: { url: fs.existsSync(imgPath) ? imgPath : "https://i.ibb.co/album-placeholder.png" }, caption: txt, mentions: db.map(a => a.author) },
    { quoted: m }
  )
}

handler.help = ["menuaudios"]
handler.tags = ["info"]
handler.command = /^(menuaudios)$/i

export default handler
