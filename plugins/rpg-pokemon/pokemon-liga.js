import fs from 'fs';
import path from 'path';
import { obtenerUsuario, guardarUsuario } from '../../lib/pokemon-utils.js';

let handler = async (m, { conn }) => {
  const user = obtenerUsuario(m.sender);
  if (!user) return m.reply('🍃 Aún no has comenzado tu aventura. Usa *.pokemon-iniciar*');

  if (user.medallas.length < 8)
    return m.reply(`🏅 Necesitas las 8 medallas para participar en la Liga Pokémon.`);

  if (user.ligaGanada)
    return m.reply(`👑 Ya eres Campeón de la Liga Pokémon.`);

  const promedio = Math.round(
    user.pokemons.reduce((a, p) => a + p.nivel, 0) / user.pokemons.length
  );

  if (promedio < 70)
    return m.reply(`⚠️ Tu equipo necesita un nivel promedio de al menos 70.`);

  // Simular enfrentamientos contra el Alto Mando
  const altoMando = [
    { nombre: 'Lorelei', tipo: 'Hielo', nivel: 70 },
    { nombre: 'Bruno', tipo: 'Lucha', nivel: 72 },
    { nombre: 'Agatha', tipo: 'Fantasma', nivel: 74 },
    { nombre: 'Lance', tipo: 'Dragón', nivel: 76 },
    { nombre: 'Campeón Azul', tipo: 'Mixto', nivel: 80 },
  ];

  for (const rival of altoMando) {
    await m.reply(`🔥 Enfrentando a ${rival.nombre}, líder del tipo ${rival.tipo} (Nv. ${rival.nivel})...`);

    const ganar = Math.random() < 0.8; // 80% de probabilidad de ganar por ahora
    if (!ganar) {
      return m.reply(`💥 ${rival.nombre} te ha derrotado. ¡Vuelve a intentarlo!`);
    }
    await new Promise((r) => setTimeout(r, 2000));
    await m.reply(`✅ ¡Has derrotado a ${rival.nombre}!`);
  }

  user.ligaGanada = true;
  user.titulo = 'Campeón Pokémon';
  guardarUsuario(m.sender, user);

  await m.reply(`🏆 ¡Felicidades ${user.nombre}! Has vencido al Alto Mando y te has convertido en **Campeón de la Liga Pokémon**.`);
};

handler.help = ['pokeliga'];
handler.tags = ['rpg'];
handler.command = /^pokeliga$/i;
export default handler;
