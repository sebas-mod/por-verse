import fetch from 'node-fetch';
import { Sticker } from 'wa-sticker-formatter';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  // Obtener el texto del argumento o mensaje citado
  const text = (args.join(" ") || m.quoted?.text || m.quoted?.caption || '').trim();
  if (!text) {
    return conn.sendMessage(
      m.chat,
      { text: `❌ Ingresa un texto!\nEjemplo: ${usedPrefix + command} Hola` },
      { quoted: m }
    );
  }

  // Mensaje de reacción mientras se procesa
  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

  try {
    // Llamada a la API
    const res = await fetch(`https://api.yupra.my.id/api/image/brat?text=${encodeURIComponent(text)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const buffer = await res.buffer();

    // Crear sticker
    const sticker = new Sticker(buffer, {
      pack: 'Yupra',
      author: 'Brat',
      type: 'full',
      quality: 80
    });

    await conn.sendMessage(m.chat, { sticker: await sticker.build() }, { quoted: m });

    // Reacción de éxito
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (e) {
    // Reacción de error
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    await conn.sendMessage(
      m.chat,
      { text: `❌ Error al crear el sticker: ${e.message}` },
      { quoted: m }
    );
  }
};

handler.help = ['brat <texto>'];
handler.tags = ['maker'];
handler.command = /^brat$/i;

export default handler;
