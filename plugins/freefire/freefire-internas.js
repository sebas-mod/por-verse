const handler = async (m, { text, conn, args, usedPrefix, command }) => {
    if (args.length < 2) {  
        conn.reply(m.chat, `*[ 🤍 ] Proporciona una hora seguido el país y una modalidad.*\n*Usa AR para Argentina y PE para Perú.*\n\n*[ 💡 ] Ejemplo:* .${command} 20:00 PE Vv2`, m);
        return;
    }

    // Validación formato 24 horas
    const horaRegex = /^([01]?[0-9]|2[0-3])(:[0-5][0-9])?$/;  
    if (!horaRegex.test(args[0])) {  
        conn.reply(m.chat, '*[ ⏰ ] Formato de hora incorrecto.*', m);  
        return;  
    }  

    let [hora, minutos] = args[0].includes(':') ? args[0].split(':').map(Number) : [Number(args[0]), 0];
    const pais = args[1].toUpperCase();  

    const diferenciasHorarias = {  
        CL: 2,  // UTC-4  
        AR: 2,  // UTC-3  
        PE: 0,  // UTC-5  
    };  

    if (!(pais in diferenciasHorarias)) {  
        conn.reply(m.chat, '*[ ℹ️ ] País no válido. Usa AR para Argentina, PE para Perú.*', m);  
        return;  
    }  

    const diferenciaHoraria = diferenciasHorarias[pais];  
    const formatTime = (date) => date.toLocaleTimeString('es', { hour12: false, hour: '2-digit', minute: '2-digit' });  

    const horasEnPais = { CL: '', AR: '', PE: '' };  
    for (const key in diferenciasHorarias) {  
        const horaActual = new Date();  
        horaActual.setHours(hora, minutos, 0, 0);

        const horaEnPais = new Date(horaActual.getTime() + (3600000 * (diferenciasHorarias[key] - diferenciaHoraria)));  
        horasEnPais[key] = formatTime(horaEnPais);  
    }  

    const modalidad = args.slice(2).join(' ');  

    // Reacción segura
    if (m.react) {
        try { m.react('🎮'); } catch(e) { console.error('No se pudo reaccionar al mensaje', e); }
    }

    // Configuración de la modalidad según el comando usado
    let titulo = '';
    let iconosA = [];
    let iconosB = [];

    switch (command.toLowerCase()) {
        case 'inmixto4':
        case 'internamixto4':
            titulo = 'INTERNA MIXTO';
            iconosA = ['🍁','🍁','🍁','🍁'];
            iconosB = ['🍃','🍃','🍃','🍃'];
            break;
        case 'inmasc4':
        case 'internamasc4':
            titulo = 'INTERNA MASC';
            iconosA = ['🥷🏻','🥷🏻','🥷🏻','🥷🏻'];
            iconosB = ['🤺','🤺','🤺','🤺'];
            break;
        case 'infem4':
        case 'internafem4':
            titulo = 'INTERNA FEM';
            iconosA = ['🪱','🪱','🪱','🪱'];
            iconosB = ['🦋','🦋','🦋','🦋'];
            break;
        case 'inmixto6':
        case 'internamixto6':
            titulo = 'INTERNA MIXTO';
            iconosA = ['❄️','❄️','❄️','❄️','❄️','❄️'];
            iconosB = ['🔥','🔥','🔥','🔥','🔥','🔥'];
            break;
        case 'inmasc6':
        case 'internamasc6':
            titulo = 'INTERNA MASC';
            iconosA = ['🪸','🪸','🪸','🪸','🪸','🪸'];
            iconosB = ['🦪','🦪','🦪','🦪','🦪','🦪'];
            break;
        case 'infem6':
        case 'internafem6':
            titulo = 'INTERNA FEM';
            iconosA = ['🍭','🍭','🍭','🍭','🍭','🍭'];
            iconosB = ['🍬','🍬','🍬','🍬','🍬','🍬'];
            break;
        default:
            conn.reply(m.chat, '*[ ❌ ] Comando no válido.*', m);
            return;
    }

    const message = `ㅤㅤㅤ *\`${titulo}\`*
╭── ︿︿︿︿︿ *⭒   ⭒   ⭒   ⭒   ⭒*
» *☕꒱ Mᴏᴅᴀʟɪᴅᴀᴅ:* ${modalidad}
» *⏰꒱ Hᴏʀᴀʀɪᴏs:*
│• *\`PE:\`* ${horasEnPais.PE}
│• *\`ARG:\`* ${horasEnPais.AR}
╰─── ︶︶︶︶ ✰⃕  ⌇ *⭒⭒*   ˚̩̥̩̥*̩̩͙✩
ㅤ _ʚ Equipo A:_ ᭡
${iconosA.map(icono => `${icono} • `).join('\n')}
ㅤ _ʚ Equipo B:_ ᭡
${iconosB.map(icono => `${icono} • `).join('\n')}

*ᡣ𐭩 Organiza:* ${conn.getName(m.sender)}
> © Տһᥲძᨣᥕ Ɓᨣƚ Uᥣ𝗍rᥲ`.trim();

    try {
        await conn.sendMessage(m.chat, { text: message }, { quoted: m });
    } catch (e) {
        console.error('Error enviando mensaje:', e);
    }
};

handler.help = ['inmixto4','inmixto6','inmasc4','inmasc6','infem4','infem6'];
handler.tags = ['ff'];
handler.command = /^(inmixto4|internamixto4|inmixto6|internamixto6|inmasc4|internamasc4|inmasc6|internamasc6|infem4|internafem4|infem6|internafem6)$/i;

export default handler;
