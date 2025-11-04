handler.before = async function (m, { conn }) {
if (!m || !m.chat) return
if (!m.isGroup) return

const chatId = m.chat
const chat = global.db.data.chats[chatId] || {}

// Forzar booleano
chat.welcomeActive = !!chat.welcomeActive

// Simulación
if (m.fakeEvent) chat.welcomeActive = true

// Solo entradas/salidas
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
groupPic = global.db.data.settings?.welcomeImage || "[https://qu.ax/uyykM.jpg](https://qu.ax/uyykM.jpg)"
}

// Validar participant
if (!m.messageStubParameters || !m.messageStubParameters[0]) return
const participant = m.messageStubParameters[0]
const userTag = "@" + participant.split("@")[0]

try {
// BIENVENIDA
if (m.messageStubType === 27 && chat.welcomeActive) {
const caption = `🌸 *𝐀𝐋𝐘𝐀 𝐁𝐎𝐓 𝐓𝐄 𝐃𝐀 𝐋𝐀 𝐁𝐈𝐄𝐍𝐕𝐄𝐍𝐈𝐃𝐀* ${userTag}\n⚓ Disfrutá en *${groupName}*\n\n𝙙𝙚𝙨𝙘𝙧𝙞𝙥𝙘𝙞𝙤𝙣:\n${desc}`

```
  await delay(1000)  
  const msgOptions = { caption, mentions: [participant] }  
  if (groupPic) msgOptions.image = { url: groupPic }  
  await conn.sendMessage(chatId, msgOptions)  
}  

// DESPEDIDA  
else if (m.messageStubType === 28 && chat.welcomeActive) {  
  const caption = chat.sBye || `😢 *Un negro menos queda...* ${userTag}\n👥 Ahora somos *${totalMembers - 1}* miembros ⚓`  

  await delay(1000)  
  const msgOptions = { caption, mentions: [participant] }  
  if (groupPic) msgOptions.image = { url: groupPic }  
  await conn.sendMessage(chatId, msgOptions)  
}  
```

} catch (err) {
console.error("❌ Error en welcome:", err)
}
}
