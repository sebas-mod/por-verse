import fs from "fs"

let handler = async (m, { conn }) => {}

handler.before = async function (m, { conn }) {
  if (!m.isGroup) return
  const chatId = m.chat
  const chat = global.db.data.chats[chatId] || {}
  const groupMetadata = await conn.groupMetadata(chatId)
  const groupName = groupMetadata.subject
  const desc = groupMetadata.desc || "Sin descripción disponible"
  const totalMembers = groupMetadata.participants.length

  // 🖼️ Imagen del grupo o personalizada por URL global
  let groupPic
  try {
    groupPic = await conn.profilePictureUrl(chatId, "image")
  } catch {
    groupPic = global.db.data.settings?.welcomeImage ||
      "https://telegra.ph/file/8b3a7d6bbcfb5efb6b8dc.jpg" // predeterminada si no hay ninguna
  }

  // 📥 BIENVENIDA
  if (m.messageStubType === 27) {
    const participant = m.messageStubParameters[0]
    const userTag = "@" + participant.split("@")[0]

    let welcomeMsg =
      chat.sWelcome ||
      "🍓 *Alya te da la bienvenida,* {user} 💖\nDisfrutá en *{group}* ⚓\n\n{desc}"

    let text = welcomeMsg
      .replace(/@user/gi, userTag)
      .replace(/@subject/gi, groupName)
      .replace(/@desc/gi, desc)

    await conn.sendMessage(chatId, {
      image: { url: groupPic },
      caption: text,
      mentions: [participant],
    })
  }

  // 📤 DESPEDIDA
  else if (m.messageStubType === 28) {
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

    await conn.sendMessage(chatId, {
      image: { url: groupPic },
      caption: text,
      mentions: [participant],
    })
  }

  // 📝 CAMBIO DE DESCRIPCIÓN
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

    await conn.sendMessage(chatId, {
      image: { url: groupPic },
      caption: text,
      mentions: [m.sender],
    })
  }
}

export default handler
