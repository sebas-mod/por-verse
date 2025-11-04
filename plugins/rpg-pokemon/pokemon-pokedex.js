import { getPokemon } from '../../lib/pokeapi.js'

let handler = async (m, { text, conn, usedPrefix, command }) => {
if (!text) return m.reply(`🔍 Usa el comando así:\n${usedPrefix + command} pikachu\n${usedPrefix + command} 6`)

try {
const pokemon = await getPokemon(text.toLowerCase())
if (!pokemon) return m.reply('❌ No se encontró ese Pokémon.')

```
let info = `
```

🎮 *Pokédex - ${pokemon.nombre.toUpperCase()}*
🆔 ID: ${pokemon.id}
🔥 Tipo: ${pokemon.tipos.join(', ')}
❤️ HP: ${pokemon.stats.hp}
⚔️ Ataque: ${pokemon.stats.ataque}
🛡️ Defensa: ${pokemon.stats.defensa}
`

```
await conn.sendFile(m.chat, pokemon.imagen, `${pokemon.nombre}.jpg`, info.trim(), m)
```

} catch (e) {
console.error(e)
m.reply('❌ Error al obtener los datos del Pokémon.')
}
}

handler.help = ['pokedex <nombre|id>']
handler.tags = ['rpg', 'pokemon']
handler.command = /^pokedex$/i

export default handler
