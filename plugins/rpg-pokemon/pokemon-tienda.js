import fs from 'fs'
const path = './plugins/rpg-pokemon/database/usuarios.json'

let handler = async (m, { args }) => {
  let usuarios = JSON.parse(fs.readFileSync(path))
  let user = usuarios[m.sender]
  if (!user) return m.reply('⚠️ Usá .iniciar primero.')

  if (!args[0]) return m.reply('🛒 Tienda:\n1. Pokéball - 200 monedas\nUsá .tienda comprar pokeball')

  if (args[0] === 'comprar' && args[1] === 'pokeball') {
    if (user.monedas < 200) return m.reply('💰 No tenés suficientes monedas.')
    user.monedas -= 200
    user.pokeballs++
    fs.writeFileSync(path, JSON.stringify(usuarios, null, 2))
    return m.reply('⚡ Compraste 1 Pokéball por 200 monedas.')
  }
}

handler.help = ['tienda']
handler.tags = ['rpg', 'pokemon']
handler.command = /^tienda$/i
export default handler
