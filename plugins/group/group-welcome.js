import fs from "fs"

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

let handler = async (m, { conn }) => {}

handler.before = async function (m, { conn }) {
  if (!m || !m.chat) return
  if (!m.isGroup) return

  const chatId = m.chat
  const chat = global.db.data.chats[chatId] || {}

  // Inicializamos la opción de welcome si no existe
  if (!("welcomeActive" in chat)) chat.welcomeActive = false

  // Solo procesamos eventos importantes (join/leave/desc)
  if (![21, 27, 28, 29, 30].includes(m.messageStubType)) return

  // Anti-spam (4s entre eventos del mismo grupo)
  if (!global.lastEvent) global.lastEvent = {}
  if (Date.now() - (global.lastEvent[chatId] || 0) < 4000) return
  global.lastEvent[chatId] = Date.now()

  // Cache metadata del grupo (evita rate limit)
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
    // 📥 BIENVENIDA (messageStubType 27)
    if (m.messageStubType === 27 && chat.welcomeActive) { // <-- Se envía solo si welcomeActive es true
      const participant = m.messageStubParameters[0]
      const userTag = "@" + participant.split("@")[0]

      let welcomeMsg =
        chat.sWelcome ||
        "🍓 *Alya te da la bienvenida,* @user 💖\nDisfrutá en *@subject* ⚓\n\n@desc"

      let text = welcomeMsg
        .replace(/@user/gi, userTag)
        .replace(/@subject/gi, groupName)
        .replace(/@desc/gi, desc)

      await delay(1000)
      await conn.sendMessage(chatId, {
        image: { url: groupPic },
        caption: text,
        mentions: [participant],
      })
    }

    // 📤 DESPEDIDA (messageStubType 28)
    else if (m.messageStubType === 28 && chat.welcomeActive) { // <-- Se aplica mismo control
      const participant = m.messageStubParameters[0]
      const userTag = "@" + participant.split("@")[0]

      let byeMsg =
        chat.sBye ||
        `😢 *Un negro menos queda...* ${userTag}\n👥 Ahora somos *${totalMembers - 1}* miembros ⚓`

      let text = byeMsg
        .replace(/@user/gi, userTag)
        .replace(/@subject/gi, groupName)
        .replace(/@desc/gi, desc)
        .replace(/{members}/gi, totalMembers - 1)

      await delay(1000)
      await conn.sendMessage(chatId, {
        image: { url: groupPic },
        caption: text,
        mentions: [participant],
      })
    }

    // 🏅 PROMOTE (messageStubType 29)
    else if (m.messageStubType === 29) {
      const participant = m.messageStubParameters[0]
      const userTag = "@" + participant.split("@")[0]
      await delay(800)
      await conn.sendMessage(chatId, {
        text: `🎖️ ${userTag} fue promovido a *admin* ⚓`,
        mentions: [participant],
      })
    }

    // 🪓 DEMOTE (messageStubType 30)
    else if (m.messageStubType === 30) {
      const participant = m.messageStubParameters[0]
      const userTag = "@" + participant.split("@")[0]
      await delay(800)
      await conn.sendMessage(chatId, {
        text: `🪓 ${userTag} ya no es *admin* 😢`,
        mentions: [participant],
      })
    }

    // 📝 CAMBIO DE DESCRIPCIÓN (messageStubType 21)
    else if (m.messageStubType === 21) {
      if (!chat.sDesc) return
      const actor = m.sender ? "@" + m.sender.split("@")[0] : "alguien"
      let descMsg =
        chat.sDesc ||
        "📢 {user} cambió la descripción del grupo:\n\n{desc}"

      let text = descMsg
        .replace(/@user/gi, actor)
        .replace(/@subject/gi, groupName)
        .replace(/@desc/gi, desc)

      // Nueva estructura con subtítulo
      let formattedText = `📝 *Descripción del Grupo:*\n─────────────────\n${text}`

      await delay(1000)
      await conn.sendMessage(chatId, {
        image: { url: groupPic },
        caption: formattedText,
        mentions: [m.sender],
      })
    }
  } catch (err) {
    if (err?.data === 429) {
      console.log("⚠️ Rate limit alcanzado, pausando 10s...")
      await delay(10000)
    } else {
      console.error("❌ Error en evento grupo:", err.message)
    }
  }
}

export default handler
