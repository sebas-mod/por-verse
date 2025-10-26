import axios from "axios";
import { sticker } from "../lib/sticker.js";

let handler = async (m, { conn, args }) => {
  let text = args.length ? args.join(" ") : m.quoted?.text;
  if (!text) return conn.reply(m.chat, "🌸 Te faltó el texto!", m);
  if (text.length > 40)
    return conn.reply(m.chat, "🌸 El texto no puede tener más de 40 caracteres", m);

  const who = m.mentionedJid?.[0] || (m.fromMe ? conn.user.jid : m.sender);

  const pp =
    (await conn.profilePictureUrl(who, "image").catch(
      () => "https://telegra.ph/file/24fa902ead26340f3df2c.png"
    )) || "https://telegra.ph/file/24fa902ead26340f3df2c.png";

  const nombre = await conn.getName(who);

  const body = {
    type: "quote",
    format: "png",
    backgroundColor: "#000000",
    width: 512,
    height: 768,
    scale: 2,
    messages: [
      {
        entities: [],
        avatar: true,
        from: { id: 1, name: nombre, photo: { url: pp } },
        text: text,
        replyMessage: {},
      },
    ],
  };

  try {
    const { data } = await axios.post(
      "https://bot.lyo.su/quote/generate",
      body,
      { headers: { "Content-Type": "application/json" } }
    );

    const buffer = Buffer.from(data.result.image, "base64");
    const stiker = await sticker(buffer, false, global.packname, global.author);

    if (stiker) await conn.sendFile(m.chat, stiker, "quote.webp", "", m);
    else conn.reply(m.chat, "❌ No se pudo generar el sticker", m);
  } catch (e) {
    console.error(e);
    conn.reply(m.chat, "⚠️ Error al generar el sticker", m);
  }
};

handler.help = ["qc"];
handler.tags = ["sticker"];
handler.command = /^qc$/i;

export default handler;
