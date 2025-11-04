import fs from 'fs'
const path = './plugins/pokemon/data/usuarios.json'

let handler = async (m) => {
  let usuarios = JSON.parse(fs.readFileSync(path))
  let user = usuarios[m.sender]
  if (!user) return m.reply('⚠️ Usá .iniciar primero.')
  if (user.equipo.length === 0) return m.reply('❌ No tenés Pokémon.')

  let poke = user.equipo[0]
  let resultado = Math.random() < 0.5 ? 'ganaste' : 'perdiste'
  if (resultado === 'ganaste') {
    user.monedas += 600
    poke.exp += 100
    m.reply(`🏆 Ganaste contra AlyaBot. +600 monedas, +100 exp.`)
  } else {
    user.monedas = Math.max(0, user.monedas - 200)
    poke.exp += 30
    m.reply(`😣 Perdiste contra AlyaBot. -200 monedas, +30 exp.`)
  }

  let expNecesaria = poke.nivel * 50
  if (poke.exp >= expNecesaria) {
    poke.nivel++
    poke.exp = 0
    poke.vida += 10
    m.reply(`✨ ${poke.nombre} subió a nivel ${poke.nivel}!`)
    if (poke.original === 'Charmander' && poke.nivel === 16) {
      poke.original = 'Charmeleon'
      poke.nombre = 'Charmeleon'
      m.reply('🔥 ¡Tu Charmander evolucionó a Charmeleon!')
    }
  }

  fs.writeFileSync(path, JSON.stringify(usuarios, null, 2))
}

handler.help = ['pelearbot']
handler.tags = ['rpg', 'pokemon']
handler.command = /^pelearbot$/i
export default handler
