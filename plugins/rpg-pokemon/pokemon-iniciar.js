import { loadUsers, saveUsers, ensureUser } from './utils.js'


let handler = async (m, { conn }) => {
const users = loadUsers()
const user = ensureUser(users, m.sender, m.pushName || m.sender)
saveUsers(users)
m.reply(`✅ Perfil creado / revisado. Tenés ${user.monedas} monedas y ${user.pokeballs} Pokéballs.`)
}
handler.command = /^(iniciar|start|registro)$/i
$1handler.tags = ['rpg']
export default handler
