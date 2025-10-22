/* BRAT FAST RESPON
Cek example respon nya :
https://cdn.yupra.my.id/yp/uqgcgxw7.mp4
*/
import fetch from 'node-fetch'
import { Sticker } from 'wa-sticker-formatter'

let handler = async (m, { conn, args }) => {
  const text = (args.join(" ") || m.quoted?.text || m.quoted?.caption || '').trim()
  if (!text) return conn.sendMessage(m.chat, { text: "❌ Masukkan teks!\nContoh: .brat Hello" }, { quoted: m })

  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

  try {
    let res = await fetch(https://api.yupra.my.id/api/image/brat?text=${encodeURIComponent(text)})
    if (!res.ok) throw new Error(HTTP ${res.status})

    let buffer = await res.buffer()
    let sticker = new Sticker(buffer, {
      pack: 'Yupra',
      author: 'Brat',
      type: 'full',
      quality: 80
    })

    await conn.sendMessage(m.chat, { sticker: await sticker.build() }, { quoted: m })
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  } catch (e) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    await conn.sendMessage(m.chat, { text: Gagal membuat sticker: ${e.message} }, { quoted: m })
  }
}

handler.help = ['brat <teks>']
handler.tags = ['maker']
handler.command = /^brat$/i

export default handler
