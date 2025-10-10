// 🌐 AIO DOWNLOADER (All in One)  
// Compatible con: TikTok, Instagram, YouTube, Facebook, X, Spotify, etc.  

import axios from 'axios'

async function aioDownloader(url) {
  try {
    if (!url) throw new Error('⚠️ La URL es obligatoria')

    const { data } = await axios.get(`https://api.platform.web.id/aio?url=${encodeURIComponent(url)}`, {
      headers: {
        'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
      }
    })

    if (!data.success) throw new Error(data.error_message || '❌ Error al procesar la descarga')

    const { download_links, headers } = data.data

    if (!download_links || download_links.length === 0) {
      throw new Error('⚠️ No se encontraron enlaces de descarga')
    }

    return {
      success: true,
      downloadLinks: download_links,
      headers: headers || {},
      referer: headers?.Referer || url
    }
  } catch (error) {
    throw new Error(error.message)
  }
}

let handler = async (m, { conn, args, command }) => {
  try {
    if (!args.length) {
      return m.reply(`📥 *AIO Downloader*  
  
🍣 *Uso correcto:*  
.${command} <url>  

🍤 *Plataformas soportadas:*  
• TikTok • Instagram • YouTube  
• Twitter/X • Facebook • Spotify  
• SoundCloud • Pinterest • Reddit  
• Twitch • Vimeo • ¡Y más!  

🍱 *Ejemplos:*  
.${command} https://vt.tiktok.com/ZSD7tYqMd/  
.${command} https://instagram.com/p/xyz  
.${command} https://youtube.com/watch?v=xyz`)
    }

    const url = args[0]

    // Validar URL
    if (!url.match(/^https?:\/\/.+/)) {
      throw new Error('⚠️ Ingresa una URL válida (http:// o https://)')
    }

    m.reply('⏳ Procesando tu descarga...')

    const result = await aioDownloader(url)

    let response = `✅ *¡Descarga lista!* 🎉\n\n`
    response += `📎 *Enlaces encontrados:* ${result.downloadLinks.length}\n\n`

    // Primer enlace → intentar enviar como video/documento
    const firstLink = result.downloadLinks[0]

    try {
      await conn.sendMessage(m.chat, {
        video: { url: firstLink },
        caption: response,
        headers: result.headers
      }, { quoted: m })
    } catch (videoError) {
      try {
        await conn.sendMessage(m.chat, {
          document: { url: firstLink },
          fileName: `download_${Date.now()}.mp4`,
          caption: response,
          headers: result.headers
        }, { quoted: m })
      } catch (docError) {
        response += `🔗 *Enlaces de descarga:*\n`
        result.downloadLinks.forEach((link, index) => {
          response += `${index + 1}. ${link}\n\n`
        })

        await conn.sendMessage(m.chat, { text: response }, { quoted: m })
      }
    }

    // Si hay más enlaces, mandarlos aparte como texto
    if (result.downloadLinks.length > 1) {
      let additionalLinks = `📎 *Enlaces adicionales:*\n\n`
      result.downloadLinks.slice(1).forEach((link, index) => {
        additionalLinks += `${index + 2}. ${link}\n\n`
      })

      await conn.sendMessage(m.chat, { text: additionalLinks }, { quoted: m })
    }

  } catch (err) {
    m.reply(`❌ Error: ${err.message}`)
  }
}

handler.help = ['aio', 'download', 'dl']
handler.tags = ['downloader']
handler.command = ['aio', 'download', 'dl', 'allinone']

export default handler