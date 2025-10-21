import axios from 'axios'
import WSF from 'wa-sticker-formatter'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    // 🧍‍♂️ Obtener usuario objetivo
    let who = m.quoted ? m.quoted.sender 
        : m.mentionedJid && m.mentionedJid[0] 
        ? m.mentionedJid[0] 
        : m.fromMe 
        ? conn.user.jid 
        : m.sender

    // 🗨️ Texto principal
    let text = m.quoted?.text ? m.quoted.text : args.slice(1).join(' ')
    let name = global.db.data.users[who]?.name || 'Usuario'
    let pp = await conn.profilePictureUrl(who, 'image').catch(() => 'https://telegra.ph/file/320b066dc81928b782c7b.png')

    // 🎨 Colores válidos
    const validColors = {
        pink: '#FFC0CB', red: '#FF0000', blue: '#0000FF', green: '#008000', yellow: '#FFFF00',
        black: '#000000', white: '#FFFFFF', orange: '#FFA500', purple: '#800080', brown: '#A52A2A',
        cyan: '#00FFFF', magenta: '#FF00FF', lime: '#00FF00', indigo: '#4B0082', violet: '#8A2BE2',
        gold: '#FFD700', silver: '#C0C0C0', beige: '#F5F5DC', teal: '#008080', navy: '#000080',
        maroon: '#800000', coral: '#FF7F50', turquoise: '#40E0D0', peach: '#FFDAB9', salmon: '#FA8072',
        mint: '#98FF98', lavender: '#E6E6FA', chartreuse: '#7FFF00', khaki: '#F0E68C', plum: '#DDA0DD',
        olive: '#808000', orchid: '#DA70D6', sienna: '#A0522D', tomato: '#FF6347', tan: '#D2B48C',
        snow: '#FFFAFA', azure: '#007FFF', slategray: '#708090', royalblue: '#4169E1', fuchsia: '#FF00FF',
        lavenderblush: '#FFF0F5'
    }

    // 🎨 Color elegido
    let color = 'black'
    if (validColors[args[0]]) color = args[0].toLowerCase()

    // 📌 Si no hay texto
    if (!text) {
        let lista = Object.keys(validColors).map((c, i) => `${i + 1}. ${c}`).join('\n')
        return m.reply(`📌 *Ejemplo:* ${usedPrefix + command} pink Hola Mundo\n\n🎨 *Colores disponibles:*\n${lista}`)
    }

    // 🧱 Objeto para la API
    const obj = {
        type: 'quote',
        format: 'png',
        backgroundColor: validColors[color],
        width: 512,
        height: 768,
        scale: 2,
        messages: [{
            entities: [],
            avatar: true,
            from: {
                id: 1,
                name,
                photo: { url: pp }
            },
            text,
            replyMessage: {}
        }]
    }

    try {
        // 🌐 API externa
        const { data } = await axios.post('https://qc.botcahx.eu.org/generate', obj, {
            headers: { 'Content-Type': 'application/json' }
        })

        if (!data.result?.image) throw new Error('❌ Error en la API')

        const buffer = Buffer.from(data.result.image, 'base64')
        const sticker = await crearSticker(buffer, global.packname || 'Luffy Bot', global.author || 'Luis Sebastián')

        await conn.sendMessage(m.chat, { sticker }, { quoted: m })
    } catch (e) {
        console.error(e)
        m.reply('🚨 *Error al generar el sticker.*')
    }
}

handler.help = ['qc']
handler.tags = ['sticker']
handler.command = /^qc$/i


export default handler

// 🧠 Función auxiliar para crear sticker
async function crearSticker(img, packname, author, categories = ['']) {
    try {
        const metadata = { type: 'full', pack: packname, author, categories }
        return await new WSF.Sticker(img, metadata).build()
    } catch (e) {
        console.error('❌ Error al crear sticker:', e)
        return null
    }
}
