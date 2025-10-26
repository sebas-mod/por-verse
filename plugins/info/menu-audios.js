import fs from "fs"
import path from "path"

let handler = async (m) => {
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

  m.reply(txt, null, { mentions: db.map(a => a.author) })
}
handler.help = ["menu-audios"]
handler.tags = ["info"]
handler.command = /^(menu-audios|audios)$/i
export default handler
