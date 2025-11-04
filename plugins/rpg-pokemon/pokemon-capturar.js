import fs from 'fs'
import fetch from 'node-fetch'
const path = './plugins/pokemon/data/usuarios.json'

let handler = async (m, { conn, usedPrefix }) => {
  let usuarios = JSON.parse(fs.readFileSync(path))
  let user = usuarios[m.sender]
  if (!user) return m.reply(`⚠️ Usá ${usedPrefix}iniciar primero.`)

  let pokes = ['Charmander','Bulbasaur','Squirtle','Pikachu','Eevee','Pidgey','Rattata','Caterpie','Zubat','Geodude']
  let pokeName = pokes[Math.floor(Math.random() * pokes.length)]
  let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName.toLowerCase()}`)
  let data = await res.json()
  let img = data.sprites.front_default

  user.ultimo = pokeName
  fs.writeFileSync(path, JSON.stringify(usuarios, null, 2))
  conn.sendMessage(m.chat, { image: { url: img }, caption: `¡Un ${pokeName} salvaje apareció!\nUsá *${usedPrefix}lanzarpokeball* para intentar capturarlo.` })
}

handler.help = ['capturar']
handler.tags = ['rpg', 'pokemon']
handler.command = /^capturar$/i
export default handler
