import os from "os";
import fs from "fs";

// DECORACIÓN APLICADA AQUÍ
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
`,
};

let handler = async (m, { conn, usedPrefix, command, isOwner, isMods, isPrems, args }) => {
    try {
        await global.loading(m, conn);
        let tags;
        let teks = `${args[0]}`.toLowerCase();
        let arrayMenu = [
            "all",
            "ai",
            "downloader",
            "group",
            "info",
            "internet",
            "juegos",
            "rpg",
            "maker",
            "owner",
            "server",
            "tools",
            
        ];
        if (!arrayMenu.includes(teks)) teks = "404";
        if (teks == "all")
            tags = {
                ai: "🤖 Menú de IA",
                downloader: "📲 Menú de Descargas",
                group: "👥️ Menú de Grupos",
                info: "📖 Menú de Información",
                internet: "💌 Menú de Internet",
                juegos: "🎮menu juegos",
                rpg: "⛏️ Menú Rpg",
                maker: "👑 Menú de Creadores",
                owner: "😎 Menú del Dueño",
                tools: "🔧 Menú de Herramientas",
            };
        if (teks == "ai") tags = { ai: "🤖 Menú de IA" };
        if (teks == "downloader") tags = { downloader: "📲 Menú de Descargas" };
        if (teks == "group") tags = { group: "👥️ Menú de Grupos" };
        if (teks == "info") tags = { info: "📖 Menú de Información" };
        if (teks == "internet") tags = { internet: "🌐 Menú de Internet" };
        if (teks == "rpg") tags = { juego: "🎮 Menú juegos" };
        if (teks == "rpg") tags = { rpg: "⛏️ Menú Rpg" };
        if (teks == "maker") tags = { maker: "👑 Menú de Creadores" };
        if (teks == "owner") tags = { owner: "😎 Menú del Dueño" };
        if (teks == "tools") tags = { tools: "🔧 Menú de Herramientas" };

        let name = conn.getName(m.sender);
        let status = isMods
            ? "👤 Desarrollador"
            : isOwner
                ? "👑 Dueño"
                : isPrems
                    ? "👤 Usuario Premium"
                    : "👥️ Usuario Gratis";
        let vcard = `BEGIN:VCARD
VERSION:3.0
N:;ttname;;;
FN:ttname
item1.TEL;waid=13135550002:+1 (313) 555-0002
item1.X-ABLabel:Ponsel
END:VCARD`;
        let q = {
            key: {
                fromMe: false,
                participant: "13135550002@s.whatsapp.net",
                remoteJid: "status@broadcast",
            },
            message: {
                contactMessage: {
                    displayName: "🤖𝐀𝐋𝐘𝐀 𝐁𝐎𝐓𝒊",
                    vcard,
                },
            },
        };
        let member = Object.keys(global.db.data.users)
            .filter(
                (v) =>
                    typeof global.db.data.users[v].commandTotal != "undefined" && v != conn.user.jid
            )
            .sort((a, b) => {
                const totalA = global.db.data.users[a].command;
                const totalB = global.db.data.users[b].command;
                return totalB - totalA;
            });
        const icons = ["👑", "☠️", "🤖", "👥️", "👤", "👺", "😈", "🙈", "🙉", "🙊", "🤡"];
        let commandToday = 0;
        for (let number of member) {
            commandToday += global.db.data.users[number].command;
        }
        let totalf = Object.values(global.plugins)
            .filter((v) => Array.isArray(v.help))
            .reduce((acc, v) => acc + v.help.length, 0);
        let uptime = formatUptime(process.uptime());
        let muptime = formatUptime(os.uptime());
        let timeID = new Intl.DateTimeFormat("es-AR", {
            timeZone: "America/Buenos_Aires",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        }).format(new Date());
        let subtitle = `🕒 ${timeID}`;
        const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
        const Version = packageJson.version;
        const mode = global.opts.self ? "Privado" : "Público";

        // DECORACIÓN APLICADA AQUÍ
        let listCmd = `
*╭─┈・┈・୨ ☠️ ୧・┈・┈─╮*
> *˚₊‧ 𝑰𝑵𝑭𝑶 𝑫𝑬𝑳 𝑩𝑶𝑻 ‧₊˚*
> 
>  ▸ 👤 *Nombre* : ${conn.user.name}
>  ▸ 📲 *Versión* : ${Version}
>  ▸ ☠️ *Modo* : ${mode}
>  ▸ 🍩 *Base de Datos* : ${bytesToMB(fs.readFileSync("./database.db").byteLength)} Mb
>  ▸ 🤖 *Tiempo Activo* : ${uptime}
>  ▸ 🌐 *Uptime SV* : ${muptime}
>  ▸ 👥️ *Comandos Hoy* : ${commandToday}
*╰─┈・┈・┈・┈・┈・┈─╯*
`.trimStart();

        let lists = arrayMenu.map((v, i) => {
            let icon = icons[i] || "⭐";
            return {
                title: `${icon} Menu ${capitalize(v)}`,
                description: `${icon} ${v} está disponible en alya bot 🌸`,
                id: `${usedPrefix + command} ${v}`,
            };
        });
        if (teks == "404") {
            return await conn.sendMessage(
                m.chat,
                {
                    document: { url: "https://files.catbox.moe/syug0p.jpg" },
                    mimetype: "application/pdf",
                    fileName: `🌸 ${global.config.watermark}`,
                    fileLength: 0,
                    pageCount: 0,
                    caption: listCmd,
                    footer: global.config.author,
                    title: wish(),
                    contextInfo: {
                        externalAdReply: {
                            title: global.config.author,
                            body: subtitle,
                            mediaType: 1,
                            thumbnailUrl: "https://files.catbox.moe/syug0p.jpg",
                            sourceUrl: global.config.website,
                            renderLargerThumbnail: true,
                        },
                    },
                    interactiveButtons: [
                        {
                            name: "single_select",
                            buttonParamsJson: JSON.stringify({
                                title: "👥️ Elige aquí~",
                                sections: [
                                    {
                                        title: `📑 Funciones disponibles del Bot: ${totalf}`,
                                        rows: lists,
                                    },
                                ],
                            }),
                        },
                        {
                            name: "cta_url",
                            buttonParamsJson: JSON.stringify({
                                display_text: "🎐 Contactar al Owner",
                                url: global.config.website,
                                merchant_url: global.config.website,
                            }),
                        },
                    ],
                    hasMediaAttachment: false,
                },
                { quoted: q }
            );
        }
        let help = Object.values(global.plugins)
            .filter((plugin) => !plugin.disabled)
            .map((plugin) => {
                return {
                    help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
                    tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
                    prefix: "customPrefix" in plugin,
                    premium: plugin.premium,
                    mods: plugin.mods,
                    owner: plugin.owner,
                    admin: plugin.admin,
                    enabled: !plugin.disabled,
                };
            });
        let groups = {};
        for (let tag in tags) {
            groups[tag] = [];
            for (let plugin of help)
                if (plugin.tags && plugin.tags.includes(tag))
                    if (plugin.help) groups[tag].push(plugin);
        }
        conn.menu = conn.menu ? conn.menu : {};
        let before = conn.menu.before || defaultMenu.before;
        let header = conn.menu.header || defaultMenu.header;
        let body = conn.menu.body || defaultMenu.body;
        let footer = conn.menu.footer || defaultMenu.footer;
        let after =
            conn.menu.after ||
            (conn.user.jid == global.conn.user.jid
                ? ""
                : `*Powered by https://wa.me/${global.conn.user.jid.split`@`[0]}*`) +
                defaultMenu.after;
        let _text = [
            before,
            ...Object.keys(tags).map((tag) => {
                return (
                    header.replace(/%category/g, tags[tag]) +
                    "\n" +
                    [
                        ...help
                            .filter((menu) => menu.tags && menu.tags.includes(tag) && menu.help)
                            .map((menu) => {
                                return menu.help
                                    .map((help) => {
                                        return body
                                            .replace(/%cmd/g, menu.prefix ? help : "%p" + help)
                                            .replace(/%isPremium/g, menu.premium ? "🅟" : "")
                                            .replace(/%isAdmin/g, menu.admin ? "🅐" : "")
                                            .replace(/%isMods/g, menu.mods ? "🅓" : "")
                                            .replace(/%isOwner/g, menu.owner ? "🅞" : "")
                                            .trim();
                                    })
                                    .join("\n");
                            }),
                        footer,
                    ].join("\n")
                );
            }),
            after,
        ].join("\n");
        let text =
            typeof conn.menu == "string" ? conn.menu : typeof conn.menu == "object" ? _text : "";
        let replace = {
            "%": "%",
            p: usedPrefix,
            name,
            status,
        };
        text = text.replace(
            new RegExp(
                `%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`,
                "g"
            ),
            (_, name) => "" + replace[name]
        );
        await conn.sendMessage(
            m.chat,
            {
                document: { url: "https://files.catbox.moe/syug0p.jpg" },
                mimetype: "application/pdf",
                fileName: `🌸 ${global.config.watermark}.pdf`,
                fileLength: 0,
                pageCount: 0,
                caption: text.trim(),
                footer: global.config.author,
                title: wish(),
                contextInfo: {
                    externalAdReply: {
                        title: global.config.author,
                        body: subtitle,
                        mediaType: 1,
                        thumbnailUrl: "https://files.catbox.moe/syug0p.jpg",
                        sourceUrl: global.config.website,
                        renderLargerThumbnail: true,
                    },
                },
                interactiveButtons: [
                    {
                        name: "single_select",
                        buttonParamsJson: JSON.stringify({
                            title: "🌥️ Menú Adicional ~",
                            sections: [
                                {
                                    title: `📑 Funciones disponibles de max bot: ${totalf}`,
                                    rows: lists,
                                },
                            ],
                        }),
                    },
                ],
                hasMediaAttachment: false,
            },
            { quoted: q }
        );
    } finally {
        await global.loading(m, conn, true);
    }
};

handler.help = ["menu"];
handler.command = /^(menu|help)$/i;

export default handler;

function formatUptime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);
    let months = Math.floor(days / 30);
    let years = Math.floor(months / 12);

    minutes %= 60;
    hours %= 24;
    days %= 30;
    months %= 12;

    let result = [];
    if (years) result.push(`${years} año${years > 1 ? 's' : ''}`);
    if (months) result.push(`${months} mes${months > 1 ? 'es' : ''}`);
    if (days) result.push(`${days} día${days > 1 ? 's' : ''}`);
    if (hours) result.push(`${hours} hora${hours > 1 ? 's' : ''}`);
    if (minutes || result.length === 0) result.push(`${minutes} minuto${minutes > 1 ? 's' : ''}`);

    return result.join(" ");
}

function wish() {
    let time = new Date(new Date().toLocaleString("es-AR", { timeZone: "America/Buenos_Aires" }));
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let quarter = Math.floor(minutes / 15);

    const messages = {
        0: [
            "🍩 Ya es medianoche, a dormir~",
            "🧁 No te quedes despierto, cuida tu salud~",
            "🍓 Noche tranquila, a descansar~",
        ],
        1: [
            "🍡 Es la 1 am, hora de dormir~",
            "🍧 Ojos pesados, vamos a descansar~",
            "🍮 Que tengas sueños dulces~",
        ],
        2: [
            "🍫 2 am, no olvides descansar~",
            "🍩 Ya muy tarde, a dormir~",
            "🍒 Dormir a esta hora se siente bien~",
        ],
        3: [
            "🍓 3 am, hora de dormir bien~",
            "🧁 Descansa para despertar fresco mañana~",
            "🍡 Dormir profundo es lo mejor~",
        ],
        4: [
            "🌸 Amanecer fresco, ánimo para levantarse~",
            "🍵 Hora del té calentito~",
            "🍓 Mañana clara, a ejercitarse~",
        ],
        5: [
            "🐓 El gallo canta, ¡a levantarse!~",
            "🍞 Desayuna para tener energía~",
            "🍯 ¡Buenos días dulzura~!",
        ],
        6: [
            "🍎 Primero, un poco de ejercicio matutino~",
            "🍫 Ánimo para trabajo/clases~",
            "☀️ Mañana soleada, feliz día~",
        ],
        7: [
            "☕ Café primero para despejar~",
            "🍪 Vamos a concentrarnos en el trabajo~",
            "🍩 Mañana productiva~",
        ],
        8: [
            "🍒 Snack de la mañana para energía~",
            "🥤 No olvides hidratarte~",
            "🍱 Se acerca la hora del almuerzo~",
        ],
        9: [
            "🍚 Buen mediodía, a comer~",
            "🍛 ¿Qué estás comiendo?~",
            "🍮 Después de comer, a relajarse un poco~",
        ],
        10: [
            "🍵 Calor de mediodía, a beber algo~",
            "🍫 Mantén el enfoque~",
            "🍧 Té helado refrescante~",
        ],
        11: [
            "🍩 Se acerca la tarde, termina tu trabajo~",
            "🍪 Merienda de tarde, ¡qué divertido!~",
            "🌸 El cielo se ve precioso~",
        ],
        12: [
            "🍚 Ya son las 12, hora de almorzar~",
            "🍲 No te saltes el almuerzo~",
            "🍵 Descansa un poco después de comer~",
        ],
        13: [
            "🍧 Calor de mediodía, bebe algo fresco~",
            "🍹 Mantente hidratado~",
            "🍉 Medio día, calor intenso~",
        ],
        14: [
            "🍫 Hora de un snack~",
            "🥤 Bebe algo refrescante~",
            "📖 Relájate un poco~",
        ],
        15: [
            "🍪 Ya es tarde, haz un poco de stretching~",
            "🍩 Galletitas para merendar~",
            "🌇 Cielo de tarde precioso~",
        ],
        16: [
            "🍵 Té de la tarde + snack, perfecto~",
            "🍰 Relájate viendo algo~",
            "📸 Hora de fotos del cielo~",
        ],
        17: [
            "🍽️ Ya es tarde, prepárate para la cena~",
            "🍲 ¿Qué vas a cenar esta noche?~",
            "🌅 Tarde fresca, qué lindo~",
        ],
        18: [
            "🍛 No olvides cenar~",
            "🍫 Noche tranquila~",
            "📺 Relájate viendo algo~",
        ],
        19: [
            "🎶 Noche divertida con música~",
            "📱 Un poco de redes sociales~",
            "🎮 Juega tranquilo~",
        ],
        20: [
            "🍵 Skincare + tiempo de relax~",
            "📖 Leer antes de dormir~",
            "🛌 8 pm, hora de descansar~",
        ],
        21: [
            "🍒 No trasnoches, a dormir~",
            "🧁 Dormir temprano para despertar fresco~",
            "🌙 Dulces sueños~",
        ],
        22: [
            "🍩 Apaga las luces~",
            "✨ Que tengas sueños hermosos~",
            "🛌 Dormir lo suficiente es importante~",
        ],
        23: [
            "💤 Medianoche, a dormir profundo~",
            "🍓 No trasnoches~",
            "🍮 Buenas noches, dulces sueños~",
        ],
    };

    let message = messages[hours]?.[quarter] || messages[hours]?.[3] || "✨ El tiempo sigue avanzando~";
    return `*${message}*`;
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.substr(1);
}

function bytesToMB(bytes) {
    return (bytes / 1048576).toFixed(2);
}
