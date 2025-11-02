import fs from 'fs'
import os from 'os'

let handler = async (m, { conn, usedPrefix }) => {
  try {
    // Lista de comandos que pertenecen a MENUFF
    const menuFFCommands = [
      'inmasc4','infem4','inmixto4',
      'inmasc6','infem6','inmixto6',
      'bermuda','purgatorio','kalahari',
      'nexterra','alpes',
      'encuesta','sala'
    ]

    // Filtramos los plugins que existen en global.plugins
    const help = Object.values(global.plugins)
      .filter(plugin => !plugin.disabled)
      .map(plugin => ({
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: "customPrefix" in plugin,
        premium: plugin.premium,
        mods: plugin.mods,
        owner: plugin.owner,
        admin: plugin.admin,
        enabled: !plugin.disabled,
      }))

    // Tomamos solo los plugins que sean del submenú MENUFF
    let menuFF = help.filter(p => {
      if (!p.help) return false
      // Comprobamos si el comando está en menuFFCommands
      return p.help.some(h => menuFFCommands.includes(h))
    })

    // Construimos el texto dinámico
    let text = `
╭━━━〔 🌸 Alya Bot 🌸 〕━━━╮
┃ 💫 Submenú: MENUFF
┃ 🧩 Categoría: INFO
┃ 📜 Comandos: ${menuFF.length}
┃ 🕒 Activo: ${clockString(process.uptime() * 1000)}
┃ ⚙️ Sistema: ${os.platform().toUpperCase()}
╰━━━━━━━━━━━━━━━━━━━━━━━╯

╭╼[ LISTA DE COMANDOS ]
${menuFF.map(p => 
      p.help.map(c => `┃➺ ${usedPrefix}${c}`).join('\n')
    ).join('\n')}
╰━━━━━━⋆★⋆━━━━━━⬣
`.trim()

    await conn.sendMessage(m.chat, { text }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('⚠️ Error al mostrar el submenú MENUFF')
  }
}

handler.help = ['menuff']
handler.tags = ['info']  // ✅ Aquí va info
handler.command = /^menuff$/i

export default handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}
