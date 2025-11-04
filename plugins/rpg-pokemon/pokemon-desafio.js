import fs from 'fs'
import { pathUsuarios, pathPokemons } from './rpgConfig.js'  // Importamos la config global

let handler = async (m, { conn, args }) => {
let usuarios = JSON.parse(fs.readFileSync(pathUsuarios))
let user = usuarios[m.sender]
if (!user) return m.reply('❌ Primero debés crear un perfil con *.iniciar*')

const hoy = new Date().toLocaleDateString()

// -------------------------
// Reclamar desafío
// -------------------------
if (!args[0] || args[0].toLowerCase() === 'reclamar') {
if (user.lastChallenge === hoy) return m.reply('⚠️ Ya reclamaste tu desafío diario hoy.')

```
// Elegir Pokémon aleatorio
let pokemons = JSON.parse(fs.readFileSync(pathPokemons))
let keys = Object.keys(pokemons)
let randomKey = keys[Math.floor(Math.random() * keys.length)]
let pokemon = pokemons[randomKey]

// Guardamos datos del desafío en el usuario
user.challengePokemon = pokemon.nombre.toLowerCase()
user.challengeAttempts = 0
user.lastChallenge = hoy

fs.writeFileSync(pathUsuarios, JSON.stringify(usuarios, null, 2))

// Pistas según nivel
let pistas = [`Tipo: ${pokemon.tipo.join(', ')}`, `Número en la Pokédex: ${pokemon.id}`]
if (user.nivel >= 5) pistas.push(`HP base aproximado: ${pokemon.hp}`, `Ataque base aproximado: ${pokemon.atk}`)
if (user.nivel >= 10) pistas.push(`Defensa base aproximada: ${pokemon.def}`, `La primera letra es: ${pokemon.nombre[0]}`)

return m.reply(`
```

🧩 ¡Adivina el Pokémon del día!
${pistas.map((p, i) => `- ${p}`).join('\n')}

Usá:
» *.adivinar <nombre del Pokémon>* para responder
Máximo de intentos: 3
`)
}

// -------------------------
// Adivinar Pokémon
// -------------------------
if (args[0].toLowerCase() === 'adivinar') {
if (!user.challengePokemon) return m.reply('❌ No tenés un desafío activo. Usá *.desafio reclamar*.')

```
let respuesta = args[1]?.toLowerCase()
if (!respuesta) return m.reply('❌ Debés escribir el nombre del Pokémon.\nEjemplo: *.adivinar pikachu*')

user.challengeAttempts = (user.challengeAttempts || 0) + 1

if (respuesta === user.challengePokemon) {
  // Recompensa según nivel y número de intentos
  let baseMonedas = user.nivel * 50
  let baseExp = user.nivel * 20
  let bonus = Math.max(1, 3 - user.challengeAttempts) // Menos intentos = mayor bonus
  let monedasGanadas = baseMonedas * bonus
  let expGanada = baseExp * bonus

  user.monedas += monedasGanadas
  user.exp = (user.exp || 0) + expGanada

  // Capturar Pokémon automáticamente
  let pokemonsDB = JSON.parse(fs.readFileSync(pathPokemons))
  let capturado = pokemonsDB[Object.keys(pokemonsDB).find(k => pokemonsDB[k].nombre.toLowerCase() === respuesta)]
  user.equipo.push(capturado)

  delete user.challengePokemon
  delete user.challengeAttempts

  fs.writeFileSync(pathUsuarios, JSON.stringify(usuarios, null, 2))
  return m.reply(`
```

🎉 ¡Correcto! Era ${respuesta}.
💰 Ganaste ${monedasGanadas} monedas y ${expGanada} EXP.
🎒 Además, ${respuesta} fue agregado a tu equipo automáticamente.
`)
    } else {
      if (user.challengeAttempts >= 3) {
        delete user.challengePokemon
        delete user.challengeAttempts
        fs.writeFileSync(pathUsuarios, JSON.stringify(usuarios, null, 2))
        return m.reply('❌ ¡Incorrecto! Se acabaron tus intentos para hoy. Vuelve mañana para otro desafío.')
      } else {
        fs.writeFileSync(pathUsuarios, JSON.stringify(usuarios, null, 2))
        return m.reply(`❌ ¡Incorrecto! Intentos restantes: ${3 - user.challengeAttempts}`)
}
}
}
}

handler.help = ['desafio', 'adivinar']
handler.tags = ['rpg', 'pokemon']
handler.command = /^(desafio|adivinar)$/i

export default handler
