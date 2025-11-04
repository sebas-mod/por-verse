import fs from 'fs'
import { pathUsuarios } from './rpgConfig.js'  // Importamos la config global

let handler = async (m) => {
let usuarios = JSON.parse(fs.readFileSync(pathUsuarios))
let user = usuarios[m.sender]
if (!user) return m.reply('⚠️ Usá .iniciar primero.')
if (!user.ultimo) return m.reply('🎯 No hay Pokémon salvaje para capturar.')
if (user.pokeballs <= 0) return m.reply('❌ No tenés Pokéballs.')

user.pokeballs--
if (Math.random() < 0.7) {
user.equipo.push({ id: Date.now(), nombre: user.ultimo, original: user.ultimo, nivel: 5, vida: 50, exp: 0 })
delete user.ultimo
m.reply(`🎉 ¡Capturaste a ${user.equipo[user.equipo.length - 1].nombre}!`)
} else {
m.reply('💨 El Pokémon escapó...')
}

fs.writeFileSync(pathUsuarios, JSON.stringify(usuarios, null, 2))
}

handler.help = ['lanzarpokeball']
handler.tags = ['rpg', 'pokemon']
handler.command = /^lanzarpokeball$/i
export default handler
