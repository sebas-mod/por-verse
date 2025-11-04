import fs from 'fs'
const path = './plugins/pokemon/data/usuarios.json'

let handler = async (m, { args, usedPrefix, command }) => {
  let usuarios = JSON.parse(fs.readFileSync(path))
  let user = usuarios[m.sender]
  if (!user) return m.reply(`⚠️ Usá ${usedPrefix}iniciar primero.`)
  if (user.equipo.length === 0) return m.reply('❌ No tenés Pokémon.')

  let index = parseInt(args[0]) - 1
  let nuevoNombre = args.slice(1).join(' ')
  if (isNaN(index) || index < 0 || index >= user.equipo.length) return m.reply('❌ Posición inválida.')
  if (!nuevoNombre) return m.reply(`💡 Usa: *${usedPrefix}${command} <posición> <nuevo nombre>*`)

  user.equipo[index].nombre = nuevoNombre
  fs.writeFileSync(path, JSON.stringify(usuarios, null, 2))
  m.reply(`✅ Tu Pokémon ahora se llama *${nuevoNombre}*.`)
}

handler.help = ['renombrar <posición> <nombre>']
handler.tags = ['rpg', 'pokemon']
handler.command = /^renombrar$/i
export default handler
