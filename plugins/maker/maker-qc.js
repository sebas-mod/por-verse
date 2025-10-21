/* Adaptado al estilo de Luffy Bot por Luis 🇺🇾 */

import axios from 'axios'
import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  // Obtener el texto
  let text
  if (args.length >= 1) {
    text = args.join(' ')
  } else if (m.quoted && m.quoted.text) {
    text = m.quoted.text
  } else return conn.reply(m.chat, '🌸 *Te faltó el texto!*', m)

  if (!text) return conn.reply(m.chat, '🌸 *Te faltó el texto!*', m)

  // Obtener el usuario mencionado o el autor
  const who =
    (m.mentionedJid && m.mentionedJid[0]) ||
    (m.fromMe ? conn.user.jid : m.sender)

  // Quitar la mención del texto si la hay
  const mentionRegex = new RegExp(
    `@${who.split('@')[0].replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\s*`,
    'g'
  )
  const quoteText = text.replace(mentionRegex, '')

  if (quoteText.length > 40)
    return conn.reply(m.chat, '🌸 *El texto no puede tener más de 40 caracteres.*', m)

  // Foto de perfil del usuario
  const pp =
    (await conn.profilePictureUrl(who, 'image').catch(() => null)) ||
    'https://telegra.ph/file/24fa902ead26340f3df2c.png'
  const nombre = await conn.getName(who)

  // Configuración para la API
  const obj = {
    type: 'quote',
    format: 'png',
    backgroundColor: '#000000',
    width: 512,
    height: 768,
    scale: 2,
    messages: [
      {
        entities: [],
        avatar: true,
        from: {
          id: 1,
          name: nombre,
          photo: { url: pp },
        },
        text: quoteText,
        replyMessage: {},
      },
    ],
  }

  try {
    // Generar sticker desde la API
    const { data } = await axios.post(
      'https://bot.lyo.su/quote/generate',
      obj,
      { headers: { 'Content-Type': 'application/json' } }
    )

    const buffer = Buffer.from(data.result.image, 'base64')
    const stiker = await sticker(buffer, false, global.packname, global.author)

    if (stiker)
      await conn.sendFile(m.chat, stiker, 'quote.webp', '', fkontak)
    else conn.reply(m.chat, '⚠️ No se pudo crear el sticker.', m)
  } catch (e) {
    console.error(e)
    conn.reply(
      m.chat,
      '❌ *Error al generar el sticker.*\nVerifica la conexión o intenta más tarde.',
      m
    )
  }
}

handler.help = ['qc']
handler.tags = ['sticker']
handler.command = /^qc$/i

export default handler
