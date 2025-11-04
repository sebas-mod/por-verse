import fs from 'fs'

const folder = './database'
const path = `${folder}/usuarios.json`

if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true })
if (!fs.existsSync(path)) fs.writeFileSync(path, '{}')

// Cambiar por tu número de WhatsApp
const owner = ['[5491166887146@s.whatsapp.net](mailto:5491166887146@s.whatsapp.net)']

let handler = async (m, { conn, args }) => {
if (!owner.includes(m.sender)) return m.reply('❌ Solo el owner puede usar este comando.')

let usuarios = JSON.parse(fs.readFileSync(path))

const accion = args[0]?.toLowerCase()
const target = args[1]
const cantidad = parseInt(args[2])

if (!accion || !target || !cantidad || isNaN(cantidad)) {
return m.reply('❌ Uso correcto:\n.darcoins <usuario> <cantidad>\n.darexp <usuario> <cantidad>')
}

if (!usuarios[target]) return m.reply('❌ Ese usuario no tiene perfil.')

if (accion === 'darcoins') {
usuarios[target].monedas += cantidad
fs.writeFileSync(path, JSON.stringify(usuarios, null, 2))
return m.reply(`✅ ${cantidad} monedas entregadas a ${usuarios[target].nombre}`)
}

if (accion === 'darexp') {
usuarios[target].exp = (usuarios[target].exp || 0) + cantidad
fs.writeFileSync(path, JSON.stringify(usuarios, null, 2))
return m.reply(`✅ ${cantidad} EXP entregada a ${usuarios[target].nombre}`)
}

return m.reply('❌ Acción no reconocida. Usa darcoins o darexp.')
}

handler.help = ['darcoins', 'darexp']
handler.tags = ['owner', 'rpg']
handler.command = /^(darcoins|darexp)$/i

export default handler
