import moment from 'moment-timezone'
import os from 'os'

let handler = async (m, { conn, usedPrefix }) => {
  try {
    // Información general
    let uptime = process.uptime() * 1000
    let uptimeText = clockString(uptime)
    let arraymenu = ['menuff']
    let tag = 'info'

    // Lista fija de comandos para este submenú
    const cmds = [
      '.inmasc4', '.infem4', '.inmixto4',
      '.inmasc6', '.infem6', '.inmixto6',
      '.bermuda', '.purgatorio', '.kalahari',
      '.nexterra', '.alpes',
      '.encuesta', '.sala'
    ]

    // Texto decorativo estilo Alya Bot
    let text = `
╭━━━〔 🌸 *Alya Bot* 🌸 〕━━━╮
┃ 💫 *Submenú:* ${arraymenu[0].toUpperCase()}
┃ 🧩 *Categoría:* ${tag.toUpperCase()}
┃ 📜 *Comandos:* ${cmds.length}
┃ 🕒 *Activo:* ${uptimeText}
┃ ⚙️ *Sistema:* ${os.platform().toUpperCase()}
╰━━━━━━━━━━━━━━━━━━━━━━━╯

╭╼[ *LISTAS DE VS INTERNOS* ]
┃🍀➺ ${usedPrefix}inmasc4
┃🍀➺ ${usedPrefix}infem4
┃🍀➺ ${usedPrefix}inmixto4
┃🪻➺ ${usedPrefix}inmasc6
┃🪻➺ ${usedPrefix}infem6
┃🪻➺ ${usedPrefix}inmixto6
╰━━━━━━⋆★⋆━━━━━━⬣

╭╼[ *MAPAS DE FREE FIRE* ]
┃🗼➺ ${usedPrefix}bermuda
┃🏝️➺ ${usedPrefix}purgatorio
┃🏜️➺ ${usedPrefix}kalahari
┃🏗️➺ ${usedPrefix}nexterra
┃🏞️➺ ${usedPrefix}alpes
╰━━━━━━⋆★⋆━━━━━━⬣

╭╼[ *ENCUESTA* ]
┃⚙️➺ ${usedPrefix}encuesta
┃⚙️➺ ${usedPrefix}sala
╰━━━━━━⋆★⋆━━━━━━⬣
`.trim()

    await conn.reply(m.chat, text, m)

  } catch (e) {
    console.error(e)
    m.reply('⚠️ Ocurrió un error al mostrar el submenú de Alya Bot.')
  }
}

handler.help = ['menuff']
handler.tags = ['info'] // ✅ pertenece a la categoría info
handler.command = /^menuff$/i

export default handler

// Función formato de tiempo
function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
