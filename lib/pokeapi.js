import fs from 'fs'
import fetch from 'node-fetch'

const path = './database/pokemon.json'

// 📦 Crear el archivo si no existe
if (!fs.existsSync('./database')) fs.mkdirSync('./database', { recursive: true })
if (!fs.existsSync(path)) fs.writeFileSync(path, '{}')

// 🔹 Función principal para obtener Pokémon
export async function getPokemon(id) {
  let data = JSON.parse(fs.readFileSync(path))

  // ✅ Si ya está en cache, lo usa directamente
  if (data[id]) return data[id]

  // 🌐 Si no, lo pide desde la API
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
  if (!res.ok) throw new Error('No se pudo obtener el Pokémon de la API.')

  const json = await res.json()

  // 🔍 Datos que vamos a guardar
  const pokemon = {
    id: json.id,
    nombre: json.name,
    tipos: json.types.map(t => t.type.name),
    stats: {
      hp: json.stats.find(s => s.stat.name === 'hp').base_stat,
      ataque: json.stats.find(s => s.stat.name === 'attack').base_stat,
      defensa: json.stats.find(s => s.stat.name === 'defense').base_stat,
    },
    imagen: json.sprites.other['official-artwork'].front_default ||
            json.sprites.front_default ||
            null
  }

  // 💾 Guardar en la base de datos local (cache)
  data[id] = pokemon
  fs.writeFileSync(path, JSON.stringify(data, null, 2))

  return pokemon
}
