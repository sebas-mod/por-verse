import fs from 'fs'
import { pathUsuarios } from './rpgConfig.js'  // Importamos la config global

let handler = async (m) => {
let usuarios = JSON.parse(fs.readFileSync(pathUsuarios))
let user = usuarios[m.sender]
if (!user) return m.reply('⚠️ Usá .iniciar primero.')
if (user.equipo.length === 0) return m.reply('❌ No tenés Pokémon en tu equipo.')

let msg = '🎒 *Tu equipo Pokémon:*\n'
user.equipo.forEach((p, i) => msg += `\n${i + 1}. ${p.nombre} (Lv.${p.nivel}) ❤️${p.vida}`)
m.reply(msg)
}

handler.help = ['equipo']
handler.tags = ['rpg', 'pokemon']
handler.command = /^equipo$/i
export default handler
