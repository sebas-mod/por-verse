import axios from "axios";
import { sticker } from "../lib/sticker.js"; // Ajustar ruta si es necesario

let handler = async (m, { conn, args, usedPrefix, command }) => {
  // Obtener texto
  let text = args.length ? args.join(" ") : m.quoted?.text;
  if (!text) return m.reply(`🌸 Te faltó el texto!`);
  if (text.length > 40)
    return m.reply(`🌸 El texto no puede tener más de 40 caracteres`);

  // Usuario mencionado o el propio
  const who = m.mentionedJid?.[0] || (m.fromMe ? conn.user.jid : m.sender);

  // Foto de perfil
  const pp =
    (await conn.profilePictureUrl(who, "image").catch(
      () => "https://telegra.ph/file/24fa902ead26340f3df2c.png"
    )) || "https://telegra.ph/file/24fa902ead26340f3df2c.png";

  // Nombre del usuario
  const nombre = await conn.getName(who);

  // Cuerpo para la API de quote
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
    // Mostrar loading (opcional según tu bot)
    await global.loading(m, conn);

    // Llamada a la API
    const { data } = await axios.post(
      "https://bot.lyo.su/quote/generate",
      body,
      { headers: { "Content-Type": "application/json" } }
    );

    // Convertir imagen a buffer
    const buffer = Buffer.from(data.result.image, "base64");

    // Generar sticker
    const stiker = await sticker(buffer, {
      packName: global.config.stickpack || "StickerPack",
      authorName: global.config.stickauth || "KenisawaDev",
    });

    // Enviar sticker
    await conn.sendFile(m.chat, stiker, "quote.webp", "", m, false, { asSticker: true });
  } catch (e) {
    console.error(e);
    m.reply("⚠️ Error al generar el sticker: " + e.message);
  } finally {
    await global.loading(m, conn, true); // Finalizar loading
  }
};

handler.help = ["qc"];
handler.tags = ["sticker"];
handler.command = /^qc$/i; // Regex compatible, también puedes usar ["qc"]

export default handler;
