let handler = async (m, { conn }) => {
    let teks = `
*༺♡⃛・‧₊˚ INTRODUCCIÓN  ˚₊‧・♡⃛༻*

*╭─❍ 𝓕𝓞𝓡𝓜𝓐𝓣 𝓘𝓝𝓣𝓡𝓞 ❍─╮*
*│ ✦ 𝓝𝓪𝓶𝓪:* 
*│ ✦ 𝓔𝓭𝓪𝓭:* 
*│ ✦ 𝐂𝐥𝐚𝐬𝐞:* 
*│ ✦ 𝔾𝕖𝕟𝕖𝕣𝕠:* 
*│ ✦ 𝐇𝐨𝐛𝐛𝐢𝐞𝐬:* 
*│ ✦ 𝕊𝕥𝕒𝕥𝕦𝕤:* 
*╰────────────────╯*

*˚₊‧୨୧ Información ୨୧‧₊˚*
🌸 *𝓝𝓸 𝓸𝓵𝓿𝓲𝓭𝓮𝓼 𝓬𝓸𝓶𝓮𝓻 𝓫𝓲𝓮𝓷~*
✨ *𝓡𝓮𝓼𝓹𝓮𝓽𝓪 𝓵𝓪𝓼 𝓻𝓮𝓰𝓵𝓪𝓼 𝓭𝓮𝓵 𝓰𝓻𝓾𝓹𝓸~*
💌 *𝓔𝓿𝓲𝓽𝓪 𝓼𝓹𝓪𝓶!*
`.trim();

    await conn.sendMessage(
        m.chat,
        {
            text: teks,
            footer: "꒰ © 2025 Kenisawadevolper ꒱",
            title: "🍡 Formato Intro Nuevo Miembro",
            interactiveButtons: [
                {
                    name: "cta_copy",
                    buttonParamsJson: JSON.stringify({
                        display_text: "📋 Copiar Intro",
                        copy_code: teks.replace(/\*/g, "").replace(/_/g, ""),
                    }),
                },
            ],
        },
        { quoted: m }
    );
};

handler.help = ["intro"];
handler.tags = ["group"];
handler.command = /^(intro)$/i;
handler.group = true;

export default handler;