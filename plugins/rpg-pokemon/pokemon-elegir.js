import fs from 'fs'

const folder = './database'
const path = `${folder}/usuarios.json`

if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true })
if (!fs.existsSync(path)) fs.writeFileSync(path, '{}')

let handler = async (m, { conn, args }) => {
if (!args[0]) return m.reply('❌ Debés escribir el nombre de tu Pokémon inicial.\nEjemplo: *.elegir charmander*')

let usuarios = JSON.parse(fs.readFileSync(path))
if (!usuarios[m.sender]) return m.reply('❌ Primero debés crear un perfil con *.iniciar*')

if (usuarios[m.sender].inicialElegido) return m.reply('⚠️ Ya elegiste tu Pokémon inicial.')

const pokes = {
charmander: { nombre: 'Charmander', tipo: ['Fuego'], nivel: 5, hp: 39, atk: 52, def: 43 },
squirtle: { nombre: 'Squirtle', tipo: ['Agua'], nivel: 5, hp: 44, atk: 48, def: 65 },
bulbasaur: { nombre: 'Bulbasaur', tipo: ['Planta','Veneno'], nivel: 5, hp: 45, atk: 49, def: 49 }
}

let elegido = pokes[args[0].toLowerCase()]
if (!elegido) return m.reply('❌ Ese Pokémon no es válido. Elegí entre Charmander, Squirtle o Bulbasaur.')

usuarios[m.sender].equipo.push(elegido)
usuarios[m.sender].inicialElegido = true

fs.writeFileSync(path, JSON.stringify(usuarios, null, 2))
await m.reply(`🎉 ¡Felicidades! Has elegido a ${elegido.nombre} como tu Pokémon inicial.\n¡Que comience tu aventura!`)
}

handler.help = ['elegir <nombre>']
handler.tags = ['rpg', 'pokemon']
handler.command = /^elegir$/i

export default handler
