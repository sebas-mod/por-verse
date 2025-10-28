import fs from "fs"

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

let handler = async (m, { conn }) => {}

handler.before = async function (m, { conn }) {
  if (!m || !m.chat) return
  if (!m.isGroup) return

  const chatId = m.chat
  const chat = global.db.data.chats[chatId] || {}

  // Si es simulación, forzamos el welcome
  if (m.fakeEvent) chat.welcomeActive = true
  if (!("welcomeActive" in chat)) chat.welcomeActive = false

  // Solo eventos de entrada/salida
  if (![27, 28].includes(m.messageStubType)) return

  // Anti-spam
  if (!global.lastEvent) global.lastEvent = {}
  if (Date.now() - (global.lastEvent[chatId] || 0) < 4000) return
  global.lastEvent[chatId] = Date.now()

  // Metadata
  if (!global.groupCache) global.groupCache = {}
  let groupMetadata = global.groupCache[chatId]
  if (!groupMetadata || Date.now() - groupMetadata.time > 300000) {
    groupMetadata = await conn.groupMetadata(chatId).catch(() => ({}))
    global.groupCache[chatId] = { ...groupMetadata, time: Date.now() }
  }

  const groupName = groupMetadata.subject || "Grupo"
  const desc = groupMetadata.desc || "Sin descripción disponible"
  const totalMembers = groupMetadata.participants?.length || 0

  // Imagen del grupo o personalizada
  let groupPic
  try {
    groupPic = await conn.profilePictureUrl(chatId, "image")
  } catch {
    groupPic = global.db.data.settings?.welcomeImage || "https://qu.ax/uyykM.jpg"
  }

  try {
    const participant = m.messageStubParameters[0]
    const userTag = "@" + participant.split("@")[0]

    // BIENVENIDA
    if (m.messageStubType === 27 && chat.welcomeActive) {
      let caption =
        `🌸 *𝐀𝐋𝐘𝐀 𝐁𝐎𝐓 𝐓𝐄 𝐃𝐀 𝐋𝐀 𝐁𝐈𝐄𝐍𝐕𝐄𝐍𝐈𝐃𝐀* ${userTag}\n` +
        `⚓ Disfrutá en *${groupName}*\n\n` +
        `𝙙𝙚𝙨𝙘𝙧𝙞𝙥𝙘𝙞𝙤𝙣:\n${desc}`

      await delay(1000)
      await conn.sendMessage(chatId, {
        image: { url: groupPic },
        caption,
        mentions: [participant],
      })
    }

    // DESPEDIDA
    else if (m.messageStubType === 28 && chat.welcomeActive) {
      let caption =
        chat.sBye ||
        `😢 *Un negro menos queda...* ${userTag}\n👥 Ahora somos *${totalMembers - 1}* miembros ⚓`

      await delay(1000)
      await conn.sendMessage(chatId, {
        image: { url: groupPic },
        caption,
        mentions: [participant],
      })
    }
  } catch (err) {
    console.error("❌ Error en welcome:", err.message)
  }
}

// 📦 Función para simulación (preview)
handler.preview = async (m, { conn }) => {
  const chatId = m.chat
  const groupMetadata = await conn.groupMetadata(chatId).catch(() => ({}))
  const groupName = groupMetadata.subject || "Grupo"
  const desc = groupMetadata.desc || "Sin descripción disponible"

  let groupPic
  try {
    groupPic = await conn.profilePictureUrl(chatId, "image")
  } catch {
    groupPic = global.db.data.settings?.welcomeImage || "https://qu.ax/uyykM.jpg"
  }

  const participant = m.messageStubParameters[0]
  const userTag = "@" + participant.split("@")[0]

  let caption =
    m.messageStubType === 27
      ? `🌸 *𝐀𝐋𝐘𝐀 𝐁𝐎𝐓 𝐓𝐄 𝐃𝐀 𝐋𝐀 𝐁𝐈𝐄𝐍𝐕𝐄𝐍𝐈𝐃𝐀* ${userTag}\n⚓ Disfrutá en *${groupName}*\n\n𝙙𝙚𝙨𝙘𝙧𝙞𝙥𝙘𝙞𝙤𝙣:\n${desc}`
      : `😢 *Un negro menos queda...* ${userTag}\n👥 Ahora somos *${groupMetadata.participants?.length || 0}* miembros ⚓`

  return { image: groupPic, caption }
}

export default handler
