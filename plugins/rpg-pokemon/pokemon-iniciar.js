import fs from 'fs'

const folder = './database'
const path = `${folder}/usuarios.json`

// 🛠️ Crear carpeta y archivo si no existen
if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true })
if (!fs.existsSync(path)) fs.writeFileSync(path, '{}')

let handler = async (m, { conn }) => {
  let usuarios = JSON.parse(fs.readFileSync(path))

  if (usuarios[m.sender]) return m.reply(`🌟 Ya tenés un perfil creado, ${usuarios[m.sender].nombre}.\n¡Explorá el mundo Pokémon y entrená para ser el mejor!`)

  // 🎮 Crear nuevo perfil
  usuarios[m.sender] = {
    nombre: m.pushName,
    monedas: 1000,
    pokeballs: 5,
    pokedex: true,
    nivel: 1,
    equipo: [],
    inicialElegido: false
  }

  fs.writeFileSync(path, JSON.stringify(usuarios, null, 2))

  // 🧢 Mensaje introductorio del Profesor
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
- 5 Pokéballs
- 1000 monedas
- Tu Pokédex

🌍 ¡Atrapa, entrena, evoluciona y enfrenta a otros entrenadores!
`

  await m.reply(mensaje)
}

handler.help = ['iniciar']
handler.tags = ['rpg', 'pokemon']
handler.command = /^iniciar$/i

export default handler
