import fs from 'fs'
import WSF from "wa-sticker-formatter"

var handler = async (m, { conn, args, text, usedPrefix, command }) => {
    let ps = text 
        ? text 
        : m.quoted?.text 
        || m.quoted?.caption 
        || m.quoted?.description 
        || ''
    
    if (!ps) throw m.reply(`*• Ejemplo:* ${usedPrefix + command} [texto]`)

    let res = `https://mxmxk-helper.hf.space/brat?text=${encodeURIComponent(ps)}`

    try {
        async function sticker(url, packname, author, categories = [""]) {
            const stickerMetadata = {
                type: "full",
                pack: packname,
                author,
                categories,
            }
            return await new WSF.Sticker(url, stickerMetadata).build()
        }

        var stikerp = await sticker(res, "Luffy Bot 🏴‍☠️", "Luis Sebastián")
        await conn.sendFile(m.chat, stikerp, 'brat.webp', '', m)
    } catch (e) {
        console.error(e)
        await m.reply(String(e))
    }
}

handler.help = ['brat']
handler.tags = ['sticker']
handler.command = /^(brat)$/i

export default handler
