import fs from "fs"

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

let handler = async (m, { conn }) => {}

handler.before = async function (m, { conn }) {
  if (!m || !m.chat) return
  if (!m.isGroup) return

  const chatId = m.chat
  const chat = global.db.data.chats[chatId] || {}

  // Inicializamos welcome si no existe
  if (!("welcomeActive" in chat)) chat.welcomeActive = false

  // Solo eventos de entrada/salida
  if (![27, 28].includes(m.messageStubType)) return

  // Anti-spam (4s entre eventos)
  if (!global.lastEvent) global.lastEvent = {}
  if (Date.now() - (global.lastEvent[chatId] || 0) < 4000) return
  global.lastEvent[chatId] = Date.now()

  // Cache metadata
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
    groupPic =
      global.db.data.settings?.welcomeImage ||
      "https://n.uguu.se/qiUlhRsD.jpg"
  }

  try {
    // 📥 BIENVENIDA
    if (m.messageStubType === 27 && chat.welcomeActive) {
      const participant = m.messageStubParameters[0]
      const userTag = "@" + participant.split("@")[0]

      let welcomeMsg =
        `🌸 *𝐀𝐋𝐘𝐀 𝐁𝐎𝐓 𝐓𝐄 𝐃𝐀 𝐋𝐀 𝐁𝐈𝐄𝐍𝐕𝐄𝐍𝐈𝐃𝐀* ${userTag}\n` +
        `⚓ Disfrutá en *${groupName}*\n\n` +
        `𝙙𝙚𝙨𝙘𝙧𝙞𝙥𝙘𝙞𝙤𝙣:\n${desc}`

      await delay(1000)
      await conn.sendMessage(chatId, {
        image: { url: groupPic },
        caption: welcomeMsg,
        mentions: [participant],
      })
    }

    // 📤 DESPEDIDA
    else if (m.messageStubType === 28 && chat.welcomeActive) {
      const participant = m.messageStubParameters[0]
      const userTag = "@" + participant.split("@")[0]

      let byeMsg =
        chat.sBye ||
        `😢 *Un negro menos queda...* ${userTag}\n👥 Ahora somos *${totalMembers - 1}* miembros ⚓`

      await delay(1000)
      await conn.sendMessage(chatId, {
        image: { url: groupPic },
        caption: byeMsg,
        mentions: [participant],
      })
    }
  } catch (err) {
    if (err?.data === 429) {
      console.log("⚠️ Rate limit alcanzado, pausando 10s...")
      await delay(10000)
    } else {
      console.error("❌ Error en welcome:", err.message)
    }
  }
}

export default handler
