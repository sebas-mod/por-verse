// Cooldown de 5 minutos (en milisegundos)
const MINE_COOLDOWN = 300000; 

let handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender];
    let lastmine = user.lastmine || 0;

    if (new Date() - lastmine < MINE_COOLDOWN) {
        let remainingTime = (lastmine + MINE_COOLDOWN) - new Date();
        let minutes = Math.floor((remainingTime / 1000 / 60) % 60);
        let seconds = Math.floor((remainingTime / 1000) % 60);
        return await conn.reply(m.chat, 
            `*Descansa un poco, minero.* ⛏️\n\n` +
            `Podrás volver a minar en *${minutes} minutos y ${seconds} segundos*.`,
            m
        );
    }

    // Recompensa aleatoria de cristales (entre 10 y 40)
    let reward = Math.floor(Math.random() * 30) + 10;

    user.cristales = (user.cristales || 0) + reward;
    user.lastmine = new Date() * 1;

    await conn.reply(m.chat, 
        `*¡Encontraste una veta de cristales!* ✨\n\n` +
        `Has minado y conseguido *${reward}* cristales 💎.`,
        m
    );
};

handler.help = ['minar'];
handler.tags = ['rpg']; // Puedes usar la categoría 'game' o crear una 'rpg'
handler.command = /^(minar|mine)$/i;

export default handler;