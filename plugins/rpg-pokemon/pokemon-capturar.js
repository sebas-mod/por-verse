import fs from 'fs'
import { getPokemon } from '../../lib/pokeapi.js'

const userPath = './database/usuarios.json'

// 🛠️ Crear base si no existe
if (!fs.existsSync('./database')) fs.mkdirSync('./database', { recursive: true })
if (!fs.existsSync(userPath)) fs.writeFileSync(userPath, '{}')

let handler = async (m, { conn }) => {
  let usuarios = JSON.parse(fs.readFileSync(userPath))
  if (!usuarios[m.sender]) return m.reply('⚠️ No tenés perfil. Usá *.iniciar* primero.')

  let user = usuarios[m.sender]

  if (user.pokeballs <= 0) {
    return m.reply('❌ No te quedan Pokéballs. Comprá más en la tienda con *.tienda*')
  }

  // 🔹 Pokémon aleatorio (1–1010)
  let randomId = Math.floor(Math.random() * 1010) + 1

  try {
    const poke = await getPokemon(randomId)
    const chance = Math.random()

    // 🎯 30% posibilidad de escapar
    if (chance < 0.3) {
      user.pokeballs -= 1
      fs.writeFileSync(userPath, JSON.stringify(usuarios, null, 2))
      return conn.sendFile(
        m.chat,
        poke.imagen,
        'fail.jpg',
        `💨 El *${poke.nombre.toUpperCase()}* escapó...\n🎯 Pokéballs restantes: ${user.pokeballs}`,
        m
      )
    }

    // ✅ Capturado
    user.pokeballs -= 1
    user.pokemones = user.pokemones || []
    user.pokemones.push({
      id: poke.id,
      nombre: poke.nombre,
      tipo: poke.tipos,
      imagen: poke.imagen,
      nivel: 1,
      exp: 0,
      stats: poke.stats,
    })

    fs.writeFileSync(userPath, JSON.stringify(usuarios, null, 2))

    let info = `🎉 *Has capturado un ${poke.nombre.toUpperCase()}!*\n\n` +
               `🌀 Tipo: ${poke.tipos.join(', ')}\n` +
               `❤️ HP: ${poke.stats.hp}\n` +
               `⚔️ Ataque: ${poke.stats.ataque}\n` +
               `🛡️ Defensa: ${poke.stats.defensa}\n\n` +
               `🎯 Pokéballs restantes: ${user.pokeballs}`

    await conn.sendFile(m.chat, poke.imagen, 'captura.jpg', info, m)

  } catch (e) {
    console.error(e)
    m.reply('❌ Error al obtener datos del Pokémon o al conectar con la API.')
  }
}

handler.help = ['capturar']
handler.tags = ['rpg', 'pokemon']
handler.command = /^capturar$/i
export default handler
