import fs from 'fs'
import { pathUsuarios } from './rpgConfig.js'  // Importamos la config global

let handler = async (m, { conn }) => {
if (!fs.existsSync(pathUsuarios)) return m.reply('❌ No hay base de datos.')
let usuarios = JSON.parse(fs.readFileSync(pathUsuarios))
let user = usuarios[m.sender]

if (!user) return m.reply('🍃 Aún no has comenzado tu aventura. Usa *.iniciar*')

user.medallas = user.medallas || []
user.equipo = user.equipo || []

if (user.medallas.length < 8)
return m.reply(`🏅 Necesitas las 8 medallas para participar en la Liga Pokémon.`)

if (user.ligaGanada)
return m.reply(`👑 Ya eres Campeón de la Liga Pokémon.`)

const promedio = Math.round(
user.equipo.reduce((a, p) => a + p.nivel, 0) / user.equipo.length
)

if (promedio < 70)
return m.reply(`⚠️ Tu equipo necesita un nivel promedio de al menos 70.`)

// Simular enfrentamientos contra el Alto Mando
const altoMando = [
{ nombre: 'Lorelei', tipo: 'Hielo', nivel: 70 },
{ nombre: 'Bruno', tipo: 'Lucha', nivel: 72 },
{ nombre: 'Agatha', tipo: 'Fantasma', nivel: 74 },
{ nombre: 'Lance', tipo: 'Dragón', nivel: 76 },
{ nombre: 'Campeón Azul', tipo: 'Mixto', nivel: 80 },
]

for (const rival of altoMando) {
await m.reply(`🔥 Enfrentando a ${rival.nombre}, líder del tipo ${rival.tipo} (Nv. ${rival.nivel})...`)

```
const ganar = Math.random() < 0.8 // 80% de probabilidad de ganar por ahora
if (!ganar) {
  return m.reply(`💥 ${rival.nombre} te ha derrotado. ¡Vuelve a intentarlo!`)
}
await new Promise((r) => setTimeout(r, 2000))
await m.reply(`✅ ¡Has derrotado a ${rival.nombre}!`)
```

}

user.ligaGanada = true
user.titulo = 'Campeón Pokémon'
usuarios[m.sender] = user
fs.writeFileSync(pathUsuarios, JSON.stringify(usuarios, null, 2))

await m.reply(`🏆 ¡Felicidades ${user.nombre}! Has vencido al Alto Mando y te has convertido en **Campeón de la Liga Pokémon**.`)
}

handler.help = ['pokeliga']
handler.tags = ['rpg', 'pokemon']
handler.command = /^pokeliga$/i
export default handler
