import fs from 'fs'
import { loadUsers, saveUsers } from './utils.js'


let handler = async (m, { args, usedPrefix, command }) => {
const users = loadUsers()
const user = users[m.sender]
if(!user) return m.reply(`No tenés perfil. Usa ${usedPrefix}iniciar`)
if(!user.equipo || user.equipo.length===0) return m.reply('No tenés Pokémon.')
const idx = parseInt(args[0]) - 1
if(isNaN(idx) || idx < 0 || idx >= user.equipo.length) return m.reply('Posición inválida')
const nuevo = args.slice(1).join(' ')
if(!nuevo) return m.reply(`Usa: ${usedPrefix}${command} <posición> <nuevo nombre>`)
user.equipo[idx].nombre = nuevo
saveUsers(users)
m.reply(`✅ Pokémon renombrado a ${nuevo}`)
}
handler.command = /^renombrar$/i
export default handler
