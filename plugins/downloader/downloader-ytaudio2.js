import axios from 'axios'
import FormData from 'form-data'
import yts from 'yt-search'

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) return m.reply(`✧ Ejemplo: *${usedPrefix + command} Alan Walker Faded*`)

  await conn.sendMessage(m.chat, { react: { text: '🎵', key: m.key } })

  let search = await yts(text)
  let video = search.videos[0]
  if (!video) return m.reply('❌ No se encontró el video.')

  const form = new FormData()
  form.append('url', video.url)

  let { data } = await axios.post('https://www.youtubemp3.ltd/convert', form, {
    headers: {
      ...form.getHeaders(),
      'User-Agent': 'Mozilla/5.0'
    }
  })

  if (!data.link) return m.reply('❌ No se pudo obtener el audio.')

  await conn.sendMessage(m.chat, {
    audio: { url: data.link },
    mimetype: 'audio/mpeg',
    ptt: false,
    fileName: data.filename || `${video.title}.mp3`
  }, { quoted: m })

  await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}

handler.help = ['ytmp32 <texto o link>']
handler.tags = ['downloader']
handler.command = /^ytmp32$/i

export default handler