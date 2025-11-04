import fs from 'fs'
import { pathUsuarios } from './rpgConfig.js'  // Importamos la config global

// 🛠️ Crear base si no existe
import path from 'path'
const folderDB = path.dirname(pathUsuarios)
if (!fs.existsSync(folderDB)) fs.mkdirSync(folderDB, { recursive: true })
if (!fs.existsSync(pathUsuarios)) fs.writeFileSync(pathUsuarios, '{}')

let handler = async (m, { conn }) => {
let usuarios = JSON.parse(fs.readFileSync(pathUsuarios))

if (usuarios[m.sender]) return m.reply(`🌟 Ya tenés un perfil creado, ${usuarios[m.sender].nombre}.\n¡Explorá el mundo Pokémon y entrená para ser el mejor!`)

usuarios[m.sender] = {
nombre: m.pushName,
monedas: 1000,
pokeballs: 5,
pokedex: true,
nivel: 1,
equipo: [],
inicialElegido: false,
exp: 0,
medallas: []
}

fs.writeFileSync(pathUsuarios, JSON.stringify(usuarios, null, 2))

let mensaje = `
👋 ¡Hola ${m.pushName}!
Soy el Profesor Oak. Bienvenido al mundo Pokémon.

Aquí podrás capturar, entrenar y luchar con tus Pokémon para convertirte en un Maestro Pokémon.

Antes de comenzar tu aventura, necesitás elegir tu primer compañero:

🔥 Charmander
🌊 Squirtle
🌱 Bulbasaur

Usá:
» *.elegir <nombre>*  para seleccionar tu Pokémon inicial.

Ejemplo:
*.elegir charmander*

🎒 También te entrego:

* 5 Pokéballs
* 1000 monedas
* Tu Pokédex

🌍 ¡Atrapa, entrena, evoluciona y enfrenta a otros entrenadores!
`

await m.reply(mensaje)
}

handler.help = ['iniciar']
handler.tags = ['rpg', 'pokemon']
handler.command = /^iniciar$/i

export default handler
