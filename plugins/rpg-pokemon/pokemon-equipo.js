import { loadUsers } from './utils.js'


let handler = async (m, { conn }) => {
const users = loadUsers()
const user = users[m.sender]
if(!user) return m.reply('No tenés perfil. Usa .iniciar')
if(!user.equipo || user.equipo.length===0) return m.reply('No tenés Pokémon. Usa .capturar')
let txt = 'Tu equipo:\n'
user.equipo.forEach((p,i)=>{
txt += `${i+1}. ${p.nombre} (${p.original}) Lv.${p.nivel} HP:${p.hp}/${p.hp_max} EXP:${p.exp}\n`
})
m.reply(txt)
}
handler.command = /^(equipo|team)$/i
export default handler
