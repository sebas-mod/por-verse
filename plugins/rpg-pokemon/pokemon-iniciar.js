import fs from 'fs'
const path = './plugins/pokemon/data/usuarios.json'

let handler = async (m) => {
  if (!fs.existsSync(path)) fs.writeFileSync(path, '{}')
  let usuarios = JSON.parse(fs.readFileSync(path))
  if (usuarios[m.sender]) return m.reply('🌟 Ya tenés perfil creado.')

  usuarios[m.sender] = {
    nombre: m.pushName,
    monedas: 1000,
    pokeballs: 3,
    equipo: []
  }

  fs.writeFileSync(path, JSON.stringify(usuarios, null, 2))
  m.reply('🎮 Perfil creado. Usá .capturar para encontrar Pokémon.')
}

handler.help = ['iniciar']
handler.tags = ['rpg', 'pokemon']
handler.command = /^iniciar$/i
export default handler
