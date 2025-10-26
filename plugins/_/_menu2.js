import os from "os"
import fs from "fs"

const defaultMenu = {
  before: `
*╭─┈・୨ ☠️ ୧・┈・┈─╮*
> *˚₊‧ 𝑰𝑵𝑭𝑶 𝑫𝑬𝑳 𝑼𝑺𝑼𝑨𝑹𝑰𝑶 ‧₊˚*
> 
>  ▸ 👤 *Nombre* : %name
>  ▸ ✅️ *Estado* : %status
*╰─┈・┈・┈・┈・┈─╯*

*╭─┈・୨ ☠️ ୧・┈・┈─╮*
> *˚₊‧ 𝑳𝑰𝑺𝑻𝑨 𝑫𝑬 𝑪𝑶𝑴𝑨𝑵𝑫𝑶𝑺 ‧₊˚*
>
> ▸ *🅟 = Premium*
> ▸ *🅐 = Admin*
> ▸ *🅓 = Desarrollador*
> ▸ *🅞 = Dueño*
*╰─┈・┈・┈・┈・┈─╯*
`.trimStart(),
  header: `
> ┌──「 *%category* 」`,
  body: `> │▸ %cmd %isPremium %isAdmin %isMods %isOwner`,
  footer: `> └───────────･｡ﾟ`,
  after: `
>
*⎯⎯ㅤㅤִㅤㅤ୨   😎  ୧ㅤㅤִ   ㅤ⎯⎯*
> 𝙱𝚢 𝚜𝚎𝚋𝚊𝚜 _ 𝙼𝙳 𝟸𝟶𝟸𝟻
*⎯⎯ㅤㅤִㅤㅤ୨   😎  ୧ㅤㅤִ   ㅤ⎯⎯*
`
}

let handler = async (m, { conn, usedPrefix, isOwner, isMods, isPrems }) => {
  try {
    let name = conn.getName(m.sender)
    let status = isMods
      ? "👤 Desarrollador"
      : isOwner
        ? "👑 Dueño"
        : isPrems
          ? "⭐ Usuario Premium"
          : "🧃 Usuario Gratis"

    // INFO DEL BOT
    const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"))
    const Version = packageJson.version
    const mode = global.opts.self ? "Privado" : "Público"
    const uptime = formatUptime(process.uptime())
    const muptime = formatUptime(os.uptime())
    const totalf = Object.values(global.plugins)
      .filter(v => Array.isArray(v.help))
      .reduce((a, v) => a + v.help.length, 0)

    const listCmd = `
*╭─┈・┈・୨ ☠️ ୧・┈・┈─╮*
> *˚₊‧ 𝑰𝑵𝑭𝑶 𝑫𝑬𝑳 𝑩𝑶𝑻 ‧₊˚*
> 
> ▸ 👤 *Nombre:* ${conn.user.name}
> ▸ 📲 *Versión:* ${Version}
> ▸ ☠️ *Modo:* ${mode}
> ▸ 🕒 *Activo:* ${uptime}
> ▸ 🌐 *Uptime SV:* ${muptime}
> ▸ 💾 *Total Comandos:* ${totalf}
*╰─┈・┈・┈・┈・┈・┈─╯*
`.trimStart()

    // CATEGORÍAS
    const tags = {
      ai: "🤖 Menú de IA",
      downloader: "📲 Descargas",
      group: "👥 Grupos",
      info: "📖 Información",
      internet: "🌐 Internet",
      rpg: "⚔️ RPG",
      maker: "🎨 Creadores",
      owner: "😎 Dueño",
      tools: "🧰 Herramientas"
    }

    let help = Object.values(global.plugins)
      .filter(plugin => !plugin.disabled)
      .map(plugin => ({
        help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: "customPrefix" in plugin,
        premium: plugin.premium,
        mods: plugin.mods,
        owner: plugin.owner,
        admin: plugin.admin
      }))

    let groups = {}
    for (let tag in tags) {
      groups[tag] = []
      for (let plugin of help)
        if (plugin.tags && plugin.tags.includes(tag))
          if (plugin.help) groups[tag].push(plugin)
    }

    // PLANTILLAS
    let before = defaultMenu.before
    let header = defaultMenu.header
    let body = defaultMenu.body
    let footer = defaultMenu.footer
    let after = defaultMenu.after

    // UNIFICAR TODO EN TEXTO
    let _text = [
      before,
      listCmd,
      ...Object.keys(tags).map(tag => {
        return (
          header.replace(/%category/g, tags[tag]) +
          "\n" +
          [
            ...help
              .filter(menu => menu.tags && menu.tags.includes(tag) && menu.help)
              .map(menu =>
                menu.help
                  .map(help => {
                    return body
                      .replace(/%cmd/g, menu.prefix ? help : usedPrefix + help)
                      .replace(/%isPremium/g, menu.premium ? "🅟" : "")
                      .replace(/%isAdmin/g, menu.admin ? "🅐" : "")
                      .replace(/%isMods/g, menu.mods ? "🅓" : "")
                      .replace(/%isOwner/g, menu.owner ? "🅞" : "")
                      .trim()
                  })
                  .join("\n")
              ),
            footer
          ].join("\n")
        )
      }),
      after
    ].join("\n")

    const replace = {
      "%": "%",
      name,
      status
    }

    let text = _text.replace(
      new RegExp(`%(${Object.keys(replace).join("|")})`, "g"),
      (_, name) => replace[name]
    )

    // URL DE IMAGEN DE ALYA
    const alyaImage = "https://h.uguu.se/LFvfEabJ.jpg" // 🌸 Puedes cambiarla si querés

    // Enviar menú con imagen
    await conn.sendMessage(m.chat, {
      image: { url: alyaImage },
      caption: text.trim(),
      contextInfo: {
        externalAdReply: {
          title: "🌸 Alya te da la bienvenida",
          body: wish(),
          thumbnailUrl: alyaImage,
          sourceUrl: global.config.website,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    })
  } catch (err) {
    console.error(err)
    m.reply("⚠️ Error al mostrar el menú2.")
  }
}

handler.help = ["menu2"]
handler.command = /^menu2$/i
export default handler

// Funciones auxiliares
function formatUptime(seconds) {
  let minutes = Math.floor(seconds / 60)
  let hours = Math.floor(minutes / 60)
  minutes %= 60
  return `${hours}h ${minutes}m`
}

function wish() {
  const hour = new Date().getHours()
  if (hour < 6) return "🌙 Dulces sueños~"
  if (hour < 12) return "🌅 Buenos días~"
  if (hour < 18) return "🌇 Buenas tardes~"
  return "🌃 Buenas noches~"
}
