import fs from 'fs'
import path from 'path'
const dataDir = path.resolve('./plugins/pokemon/data')
const usuariosFile = path.join(dataDir, 'usuarios.json')
const pokemonFile = path.join(dataDir, 'pokemon.json')


const ECON = {
ENTRY_FEE: 200,
WIN_REWARD: 600,
LOSS_PENALTY: 200,
EXP_WIN: 100,
EXP_LOSS: 30
}


function loadJSON(file){
if(!fs.existsSync(file)) return {}
return JSON.parse(fs.readFileSync(file, 'utf8'))
}
function saveJSON(file, data){
fs.writeFileSync(file, JSON.stringify(data, null, 2))
}


export function loadUsers(){ return loadJSON(usuariosFile) }
export function saveUsers(d){ saveJSON(usuariosFile, d) }
export function loadPokedex(){ return loadJSON(pokemonFile) }
export { ECON }


export function ensureUser(users, sender, pushName){
if(!users[sender]){
users[sender] = {
numero: sender,
nombre: pushName || sender,
monedas: 1000,
pokeballs: 5,
equipo: [],
victorias: 0,
derrotas: 0
}
}
return users[sender]
}


export function createWildFrom(entryId, level=5){
const pokedex = loadPokedex()
const base = pokedex[entryId]
if(!base) return null
const hp = Math.max(1, Math.floor(base.hp + level * 2))
return {
id: base.id,
original: base.nombre,
nombre: base.nombre,
nivel: level,
hp: hp,
hp_max: hp,
atk: base.atk,
def: base.def,
}
