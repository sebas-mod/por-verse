let handler = async (m, { conn, args }) => {
    // Definimos los tipos de leaderboards disponibles
    const leaderboards = {
        'cristales': {
            title: '💎 Leaderboard - Cristales 💎',
            sort: (a, b) => (b.cristales || 0) - (a.cristales || 0),
            score: user => (user.cristales || 0).toLocaleString(),
            unit: 'cristales'
        },
        'items': {
            title: '🎒 Leaderboard - Items 🎒',
            sort: (a, b) => (b.inventory?.length || 0) - (a.inventory?.length || 0),
            score: user => (user.inventory?.length || 0).toLocaleString(),
            unit: 'items'
        }
    };

    let type = (args[0] || 'cristales').toLowerCase();
    if (!leaderboards[type]) type = 'cristales'; // Si no es válido, usa cristales

    const lb = leaderboards[type];

    // Obtenemos y ordenamos a todos los usuarios
    let users = Object.entries(global.db.data.users).map(([jid, user]) => ({ jid, ...user }));
    let sortedUsers = users.sort(lb.sort);

    // Creamos la lista del Top 10
    let topUsers = sortedUsers.slice(0, 10);
    const topEmojis = ['🥇', '🥈', '🥉'];
    
    let topList = topUsers.map((user, index) => {
        let rank = topEmojis[index] || `*${index + 1}.*`;
        // Intentamos obtener el nombre guardado, si no, el pushName
        let name = user.name || conn.getName(user.jid); 
        return `${rank} ${name}\n   ↳ *${lb.score(user)}* ${lb.unit}`;
    }).join('\n\n');

    // Buscamos la posición del usuario que ejecutó el comando
    let selfRank = sortedUsers.findIndex(user => user.jid === m.sender) + 1;
    let selfUser = global.db.data.users[m.sender];
    
    // Construimos el mensaje final
    let text = `${lb.title}\n\n${topList}\n\n`;
    text += `-----------------------------------\n`;
    text += `*Tu Posición: #${selfRank}*\n`;
    text += `${m.pushName} - *${lb.score(selfUser)}* ${lb.unit}`;

    await conn.reply(m.chat, text.trim(), m);
};

handler.help = ['leaderboard [cristales|items]', 'lb [cristales|items]'];
handler.tags = ['rpg'];
handler.command = /^(leaderboard|lb|top)$/i;

export default handler;