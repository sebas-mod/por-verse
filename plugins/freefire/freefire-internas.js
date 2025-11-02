const registro = {}; // Registro de participantes por modalidad
const limiteParticipantes = 5; // Límite por modalidad

const handler = async (m, { conn, args, command }) => {
    if (args.length < 2) {
        conn.reply(m.chat, `*[ 🤍 ] Proporciona una hora seguido del país y una modalidad.*\n*Usa AR, PE, MX o CO.*\nEjemplo: .${command} 20:00 PE Vv2`, m);
        return;
    }

    // Validación de hora
    const horaRegex = /^([01]?[0-9]|2[0-3])(:[0-5][0-9])?$/;
    if (!horaRegex.test(args[0])) {
        conn.reply(m.chat, '*[ ⏰ ] Formato de hora incorrecto.*', m);
        return;
    }

    let [hora, minutos] = args[0].includes(':') ? args[0].split(':').map(Number) : [Number(args[0]), 0];
    const pais = args[1].toUpperCase();
    const diferenciasHorarias = { AR: -3, PE: -5, MX: -6, CO: -5 };

    if (!(pais in diferenciasHorarias)) {
        conn.reply(m.chat, '*[ ℹ️ ] País no válido. Usa AR, PE, MX o CO.*', m);
        return;
    }

    const diferenciaHoraria = diferenciasHorarias[pais];
    const formatTime = (date) => date.toLocaleTimeString('es', { hour12: false, hour: '2-digit', minute: '2-digit' });

    const horasEnPais = {};
    for (const key in diferenciasHorarias) {
        const horaActual = new Date();
        horaActual.setHours(hora, minutos, 0, 0);
        const horaEnPais = new Date(horaActual.getTime() + 3600000 * (diferenciasHorarias[key] - diferenciaHoraria));
        horasEnPais[key] = formatTime(horaEnPais);
    }

    const modalidad = args.slice(2).join(' ');

    // Configuración de modalidad
    let titulo = '';
    let iconosA = [];
    let iconosB = [];

    switch (command.toLowerCase()) {
        case 'inmixto4': case 'internamixto4':
            titulo = 'INTERNA MIXTO';
            iconosA = ['🍁','🍁','🍁','🍁'];
            iconosB = ['🍃','🍃','🍃','🍃'];
            break;
        case 'inmasc4': case 'internamasc4':
            titulo = 'INTERNA MASC';
            iconosA = ['🥷🏻','🥷🏻','🥷🏻','🥷🏻'];
            iconosB = ['🤺','🤺','🤺','🤺'];
            break;
        case 'infem4': case 'internafem4':
            titulo = 'INTERNA FEM';
            iconosA = ['🪱','🪱','🪱','🪱'];
            iconosB = ['🦋','🦋','🦋','🦋'];
            break;
        case 'inmixto6': case 'internamixto6':
            titulo = 'INTERNA MIXTO';
            iconosA = ['❄️','❄️','❄️','❄️','❄️','❄️'];
            iconosB = ['🔥','🔥','🔥','🔥','🔥','🔥'];
            break;
        case 'inmasc6': case 'internamasc6':
            titulo = 'INTERNA MASC';
            iconosA = ['🪸','🪸','🪸','🪸','🪸','🪸'];
            iconosB = ['🦪','🦪','🦪','🦪','🦪','🦪'];
            break;
        case 'infem6': case 'internafem6':
            titulo = 'INTERNA FEM';
            iconosA = ['🍭','🍭','🍭','🍭','🍭','🍭'];
            iconosB = ['🍬','🍬','🍬','🍬','🍬','🍬'];
            break;
        default:
            conn.reply(m.chat, '*[ ❌ ] Comando no válido.*', m);
            return;
    }

    if (!registro[command]) registro[command] = [];

    const message = `ㅤㅤㅤ *\`${titulo}\`*
╭── ︿︿︿︿︿ *⭒ ⭒ ⭒ ⭒ ⭒*
» *☕꒱ Mᴏᴅᴀʟɪᴅᴀᴅ:* ${modalidad}
» *⏰꒱ Hᴏʀᴀʀɪᴏs:*
│• PE: ${horasEnPais.PE}
│• ARG: ${horasEnPais.AR}
│• MX: ${horasEnPais.MX}
│• CO: ${horasEnPais.CO}
╰─── ︶︶︶︶ ✰⃕  ⌇ *⭒⭒*   ˚̩̥̩̥*̩̩͙✩
ㅤ _ʚ Equipo A:_ ᭡
${iconosA.map(icono => `${icono} • `).join('\n')}
ㅤ _ʚ Equipo B:_ ᭡
${iconosB.map(icono => `${icono} • `).join('\n')}

*ᡣ𐭩 Organiza:* ${conn.getName(m.sender)}
*Jugadores inscritos:* ${registro[command].length}/${limiteParticipantes}
🎮 Reacciona a este mensaje para anotarte!`;

    // Enviar mensaje y esperar reacciones
    const sentMsg = await conn.sendMessage(m.chat, { text: message }, { quoted: m });

    // Escuchar reacciones
    conn.ev.on('messages.reaction', ({ reaction, key, user }) => {
        if (key.id === sentMsg.key.id && reaction === '🎮') {
            if (!registro[command].includes(user)) {
                if (registro[command].length < limiteParticipantes) {
                    registro[command].push(user);
                    conn.sendMessage(m.chat, { text: `✅ ${conn.getName(user)} se anotó en ${titulo} (${registro[command].length}/${limiteParticipantes})` }, { quoted: m });
                } else {
                    conn.sendMessage(m.chat, { text: `⚠️ La modalidad ${titulo} ya está llena (${limiteParticipantes} jugadores).` }, { quoted: m });
                }
            }
        }
    });
};

handler.help = ['inmixto4','inmixto6','inmasc4','inmasc6','infem4','infem6'];
handler.tags = ['ff'];
handler.command = /^(inmixto4|internamixto4|inmixto6|internamixto6|inmasc4|internamasc4|inmasc6|internamasc6|infem4|internafem4|infem6|internafem6)$/i;

export default handler;
