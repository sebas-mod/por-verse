import { getPokemon } from '../../lib/pokeapi.js'
import fs from 'fs'
import { pathUsuarios } from './rpgConfig.js'  // Importamos la config global

let handler = async (m, { conn, text }) => {
if (!fs.existsSync(pathUsuarios)) return m.reply('❌ No hay base de datos.')
let usuarios = JSON.parse(fs.readFileSync(pathUsuarios))
let user = usuarios[m.sender]
if (!user) return m.reply('🎮 Primero creá tu perfil con .iniciar')

const gimnasios = [
{ nombre: 'Ciudad Verde', tipo: 'planta', medalla: '🌿 Medalla Hoja', pokemons: [1, 43] },
{ nombre: 'Ciudad Carmín', tipo: 'eléctrico', medalla: '⚡ Medalla Trueno', pokemons: [25, 81] },
// ...agregás los demás gimnasios
]

let gym = gimnasios.find(g => g.nombre.toLowerCase().includes(text.toLowerCase()))
if (!gym) return m.reply(`🏟️ Gimnasios disponibles:\n${gimnasios.map(g => `- ${g.nombre} (${g.tipo})`).join('\n')}`)

user.medallas = user.medallas || []

if (user.medallas.includes(gym.medalla)) return m.reply('🏅 Ya ganaste este gimnasio.')

const poke = await getPokemon(gym.pokemons[Math.floor(Math.random() * gym.pokemons.length)])

// Simulamos la batalla simple (puedes luego hacer el sistema real de combate)
let win = Math.random() < 0.7 // 70% chance de ganar si tu nivel es suficiente
if (win) {
user.medallas.push(gym.medalla)
fs.writeFileSync(pathUsuarios, JSON.stringify(usuarios, null, 2))
conn.sendFile(m.chat, poke.imagen, 'poke.jpg', `🔥 ¡Ganaste a ${gym.nombre}!\nConseguiste ${gym.medalla}`, m)
} else {
m.reply(`😓 ${gym.nombre} te derrotó... Entrena más antes de volver.`)
}
}

handler.help = ['gimnasio <nombre>']
handler.tags = ['rpg', 'pokemon']
handler.command = /^gimnasio$/i

export default handler
