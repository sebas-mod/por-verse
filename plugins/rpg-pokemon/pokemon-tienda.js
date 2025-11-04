import fs from 'fs'
import { pathUsuarios } from './rpgConfig.js'

let handler = async (m, { args }) => {
let usuarios = JSON.parse(fs.readFileSync(pathUsuarios))
let user = usuarios[m.sender]
if (!user) return m.reply('⚠️ Usá .iniciar primero.')

if (!args[0]) {
return m.reply('🛒 Tienda:\n1. Pokéball - 200 monedas\nUsá *.tienda comprar pokeball*')
}

if (args[0].toLowerCase() === 'comprar' && args[1]?.toLowerCase() === 'pokeball') {
if (user.monedas < 200) return m.reply('💰 No tenés suficientes monedas.')
user.monedas -= 200
user.pokeballs = (user.pokeballs || 0) + 1
fs.writeFileSync(pathUsuarios, JSON.stringify(usuarios, null, 2))
return m.reply('⚡ Compraste 1 Pokéball por 200 monedas.')
}
}

handler.help = ['tienda']
handler.tags = ['rpg', 'pokemon']
handler.command = /^tienda$/i
export default handler
