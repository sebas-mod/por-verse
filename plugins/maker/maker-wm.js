import { sticker } from "../../lib/sticker.js";

let handler = async (m, { conn, text }) => {
    let q = m.quoted ? m.quoted : m;
    if (!q || !/sticker|image|video/.test(q.mtype)) {
        return m.reply("🍡 *Respondé a un sticker, imagen o video para cambiarle el watermark!*");
    }

    let [packName, authorName] = (text || "").split("|");
    packName = packName?.trim() || global.config.stickpack || "StickerPack";
    authorName = authorName?.trim() || global.config.stickauth || "KenisawaDev";

    await global.loading(m, conn);
    try {
        const file = await conn.downloadM(q, "sticker" /* image/video */, true);
        const result = await sticker(file, { packName, authorName });
        await conn.sendFile(m.chat, result, "sticker.webp", "", m, false, { asSticker: true });
    } catch (e) {
        console.error(e);
        m.reply(`🍰 *Ups, no se pudo cambiar el watermark!*\n📄 ${e.message}`);
    } finally {
        await global.loading(m, conn, true);
    }
};

handler.help = ["watermark"];
handler.tags = ["maker"];
handler.command = /^(wm|watermark)$/i;
handler.premium = true;

export default handler;