const partidas = {};

const handler = async (m, { conn, args, command }) => {
  if (args.length < 5) {
    return conn.reply(
      m.chat,
      `
📢 *ANUNCIO IMPORTANTE*

Para crear una lista de VS usa el formato:

.${command} <hora> <am/pm> <país> <modalidad> <tipo>

*📍 Ejemplos:*
.${command} 10:00 pm ar scrim mixto  
.${command} 9:30 pm pe guerra fem  
.${command} 8:00 pm mx cuadrilatero masc

*🌎 Países:* 🇦🇷 ar | 🇵🇪 pe | 🇨🇴 co | 🇲🇽 mx  
*🎮 Modalidades:* scrim | cuadrilatero | guerra | guerra-de-clanes  
*👥 Tipo:* fem | masc | mixto
`.trim(),
      m
    );
  }

  const [hora, formato, pais, modalidad, tipo] = args.map((a) => a.toLowerCase());

  if (!hora.match(/^\d{1,2}:\d{2}$/)) return m.reply("⏰ *Formato de hora inválido.* Ej: 10:00");
  if (!/(am|pm)/i.test(formato)) return m.reply("⚠️ *Formato inválido.* Usa AM o PM.");
  if (!["ar", "pe", "co", "mx"].includes(pais)) return m.reply("🌍 *País inválido.* Usa ar, pe, co o mx.");
  if (!["scrim", "cuadrilatero", "guerra", "guerra-de-clanes"].includes(modalidad))
    return m.reply("🎮 *Modalidad inválida.* Usa scrim, cuadrilatero, guerra o guerra-de-clanes.");
  if (!["fem", "masc", "mixto"].includes(tipo)) return m.reply("👥 *Tipo inválido.* Usa fem, masc o mixto.");

  const partidaId = `${m.chat}-${Date.now()}`;

  const horarios = {
    AR: pais === "ar" ? `${hora} ${formato}` : "22:00",
    PE: pais === "pe" ? `${hora} ${formato}` : "20:00",
    CO: pais === "co" ? `${hora} ${formato}` : "21:00",
    MX: pais === "mx" ? `${hora} ${formato}` : "19:00",
  };

  let deco, color, titulo;
  switch (tipo) {
    case "fem":
      deco = "🌸";
      color = "💖";
      titulo = "💞 LISTA VS FEM 💞";
      break;
    case "masc":
      deco = "🔥";
      color = "💀";
      titulo = "🔥 LISTA VS MASC 🔥";
      break;
    case "mixto":
      deco = "⚡";
      color = "🌈";
      titulo = "⚡ LISTA VS MIXTO ⚡";
      break;
  }

  partidas[partidaId] = {
    id: partidaId,
    chat: m.chat,
    jugadores: [],
    suplentes: [],
    tipo,
    deco,
    color,
    modalidad,
    hora: `${hora} ${formato}`,
    pais,
    horarios,
    msgId: null,
  };

  const mensaje = generarMensaje(partidas[partidaId], titulo);
  const sent = await conn.sendMessage(
    m.chat,
    {
      text: mensaje,
      footer: `Reacciona con cualquier emoji para anotarte automáticamente. Quitar la reacción te quitará de la lista.`,
    },
    { quoted: m }
  );

  partidas[partidaId].msgId = sent.key.id;
};

// Generar mensaje decorado
function generarMensaje(p, titulo) {
  const horariosTxt = Object.entries(p.horarios)
    .map(([pais, h]) => {
      const flag = { AR: "🇦🇷", PE: "🇵🇪", CO: "🇨🇴", MX: "🇲🇽" }[pais];
      return `*${flag} ${pais}:* ${h}`;
    })
    .join("\n");

  const escuadra = p.jugadores.map((x) => `🥷 ${x}`).join("\n") || "—";
  const suplentes = p.suplentes.map((x) => `🥷 ${x}`).join("\n") || "—";

  return `
${p.color}━━━━━━━━━━━━━━━━━━━${p.color}
${p.deco} *${titulo}* ${p.deco}
${p.color}━━━━━━━━━━━━━━━━━━━${p.color}

🕓 *Hora:* ${p.hora}  
🎮 *Modalidad:* ${p.modalidad.toUpperCase()}  

${horariosTxt}

👤 *ESCUADRA*
${escuadra}

👥 *SUPLENTES*
${suplentes}

${p.color}━━━━━━━━━━━━━━━━━━━${p.color}
`.trim();
}

// Reacción automática (añadir o quitar)
handler.before = async (m, { conn }) => {
  if (![28, 29].includes(m.messageStubType)) return; // 28 = añadir reacción, 29 = quitar reacción
  const reactMsgId = m.messageStubParameters?.[1];
  const sender = m.sender;
  const name = global.db.data.users[sender]?.name || (await conn.getName(sender));

  const partida = Object.values(partidas).find((p) => p.msgId === reactMsgId);
  if (!partida) return;

  if (m.messageStubType === 28) {
    // Añadir reacción
    if (partida.jugadores.includes(name) || partida.suplentes.includes(name)) return;
    if (partida.jugadores.length < 4) partida.jugadores.push(name);
    else if (partida.suplentes.length < 2) partida.suplentes.push(name);
    else return conn.sendMessage(partida.chat, { text: "✅ Lista llena, suerte en el VS!" });
  } else if (m.messageStubType === 29) {
    // Quitar reacción
    partida.jugadores = partida.jugadores.filter((x) => x !== name);
    partida.suplentes = partida.suplentes.filter((x) => x !== name);
  }

  const titulo =
    partida.tipo === "fem"
      ? "💞 LISTA VS FEM 💞"
      : partida.tipo === "masc"
      ? "🔥 LISTA VS MASC 🔥"
      : "⚡ LISTA VS MIXTO ⚡";

  const actualizado = generarMensaje(partida, titulo);

  // Actualiza el mensaje original
  await conn.editMessage(partida.chat, partida.msgId, { text: actualizado });
};

handler.help = ["vs <hora> <am/pm> <país> <modalidad> <tipo>"];
handler.tags = ["ff"];
handler.command = /^vs$/i;
handler.group = true;

export default handler;
