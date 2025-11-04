import fs from 'fs'
import path from 'path'

// Carpeta principal de la base de datos del RPG
export const folderDB = path.resolve('./plugins/rpg-pokemon/database')

// Rutas de los archivos
export const pathUsuarios = `${folderDB}/usuarios.json`
export const pathPokemons = `${folderDB}/pokemon.json`

// Crear carpeta y archivos si no existen
if (!fs.existsSync(folderDB)) fs.mkdirSync(folderDB, { recursive: true })
if (!fs.existsSync(pathUsuarios)) fs.writeFileSync(pathUsuarios, '{}')
if (!fs.existsSync(pathPokemons)) fs.writeFileSync(pathPokemons, '{}')
