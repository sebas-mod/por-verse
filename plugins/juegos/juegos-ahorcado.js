// plugins/ahorcado.js
// Plugin Ahorcado — autor: ChatGPT (ejemplo listo para integrarse en un bot Baileys estilo handler)
// Comandos: ".ahorcado start" / ".ahorcado iniciar", ".ahorcado stop" / ".ahorcado terminar", ".ahorcado status"
// Mientras hay una partida activa, cualquier usuario puede participar enviando UNA LETRA (a-z, ñ).
// 5 intentos (errores) permitidos. Palabras con acentos se manejan correctamente al comparar.

const games = new Map(); // key: chat id, value: game state

// Lista de 100 palabras "difíciles" (acentos incluidos)
const WORDS = [
  "aberración","absceso","acérrimo","aforismo","agorero","albedrío","anacrónico","anómalo","antítesis","apócope",
  "arqueología","arquetipo","aséptico","atávico","avaricia","bidimensional","bifurcación","cacofonía","caligrafía","candileja",
  "capcioso","carismático","catarsis","circunspecto","clandestino","claudicar","coetáneo","colateral","confluencia","contumaz",
  "corpóreo","críptico","cúmulo","dédalo","deleznable","demagogia","denodado","desidia","despotismo","diatriba",
  "dilema","disyuntiva","dócil","efímero","egregio","elocuente","emancipar","empírico","encapsular","enigmático",
  "epítome","esdrújulo","escabroso","esotérico","estentóreo","estigma","euforia","exánime","exuberante","falaz",
  "fatuo","flagelo","fungible","grandilocuente","hecatombe","hediondo","hegemónico","hermético","histriónico","holístico",
  "idiosincrasia","ignominioso","imbricar","impecable","impío","implacable","inane","incendiario","incólume","indómito",
  "inferencia","inquietud","insigne","interregno","intrépido","inviabilidad","iracundo","jactancia","lacónico","lóbrego",
  "luscofugo","magnánimo","malabarismo","mendaz","mezquindad","melopea","misántropo","mitómano","nefasto","nimio"
];

// --- Helpers ---
const normalize = (s) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .toLowerCase();

const isSingleLetter = (txt) => {
  txt = txt.trim();
  // letra simple: mayúsculas/minúsculas, ñ incluida
  return /^[a-zñáéíóúÁÉÍÓÚ]$/.test(txt);
};

const formatWordProgress = (originalWord, revealedSet) => {
  // muestra la palabra con letras descubiertas y guiones bajos separados por espacios
  return originalWord
    .split("")
    .map((ch) => {
      if (ch === " ") return " "; // por si hay espacios (no debería)
      const normalized = normalize(ch);
      return revealedSet.has(normalized) ? ch : "_";
    })
    .join(" ");
};

// --- Game logic ---
const newGameState = () => ({
  word: null, // palabra original con acentos
  normalizedWord: null, // palabra sin acentos y en minúsculas
  revealed: new Set(), // letras ya descubiertas (normalizadas)
  guessedLetters: new Set(), // letras intentadas (normalizadas)
  attemptsLeft: 5,
  startedAt: Date.now(),
});

const pickRandomWord = () => {
  const idx = Math.floor(Math.random() * WORDS.length);
  return WORDS[idx];
};

// --- Handler export ---
let handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    const chatId = m.chat;
    const arg = (text || "").trim().toLowerCase();

    // detecta subcomandos start/stop/status (español o inglés)
    if (arg.startsWith("start") || arg.startsWith("iniciar") || arg === "iniciar" || arg === "start") {
      if (games.has(chatId)) {
        await conn.reply(chatId, "Ya hay una partida activa en este chat. Usa una letra para jugar o `.ahorcado stop` para terminarla.", m);
        return;
      }
      const g = newGameState();
      g.word = pickRandomWord();
      g.normalizedWord = normalize(g.word);
      // si la palabra tiene tildes, al mostrar se conservarán; la comparación se hará con normalized
      // pre-descubrir vocales opcional: aquí no pre-descubrimos nada (más difícil)
      // Si quieres mostrar alguna letra inicial, puedes añadirlas a revealed.
      games.set(chatId, g);

      const progress = formatWordProgress(g.word, g.revealed);
      await conn.reply(chatId,
        `🎯 *Ahorcado iniciado*\nPalabra: ${progress}\nIntentos restantes: ${g.attemptsLeft}\n\nReglas: cualquiera puede participar enviando UNA letra.\nPara finalizar la partida usa: \`.ahorcado stop\``,
        m
      );
      return;
    }

    if (arg.startsWith("stop") || arg.startsWith("terminar") || arg === "terminar" || arg === "stop") {
      if (!games.has(chatId)) {
        await conn.reply(chatId, "No hay ninguna partida activa en este chat. Usa `.ahorcado start` para comenzar.", m);
        return;
      }
      const g = games.get(chatId);
      games.delete(chatId);
      await conn.reply(chatId, `🛑 Partida terminada. La palabra era: *${g.word}*`, m);
      return;
    }

    if (arg.startsWith("status") || arg === "estado" || arg === "status") {
      if (!games.has(chatId)) {
        await conn.reply(chatId, "No hay partida activa. Comienza una con `.ahorcado start`", m);
        return;
      }
      const g = games.get(chatId);
      const progress = formatWordProgress(g.word, g.revealed);
      await conn.reply(chatId, `🔎 Estado de la partida:\nPalabra: ${progress}\nIntentos restantes: ${g.attemptsLeft}\nLetras intentadas: ${Array.from(g.guessedLetters).join(", ") || "ninguna"}`, m);
      return;
    }

    // Si hay una partida activa y el mensaje es una letra, procesarla
    if (games.has(chatId) && isSingleLetter(text || "")) {
      const g = games.get(chatId);
      const letter = normalize((text || "").trim());
      if (g.guessedLetters.has(letter)) {
        await conn.reply(chatId, `✳️ Ya se intentó la letra *${text.trim()}*.\nIntentos restantes: ${g.attemptsLeft}`, m);
        return;
      }

      g.guessedLetters.add(letter);

      if (g.normalizedWord.includes(letter)) {
        // descubrir todas las posiciones
        for (const ch of g.normalizedWord) {
          if (ch === letter) g.revealed.add(letter);
        }
        // además, si la palabra contiene otras letras iguales con tildes, la normalización cubre eso.
        const progress = formatWordProgress(g.word, g.revealed);
        // verificar si ganó (todas las letras normalizadas están reveladas)
        const uniqueLettersInWord = new Set(g.normalizedWord.replace(/[^a-zñ]/g, "").split(""));
        const allRevealed = Array.from(uniqueLettersInWord).every((l) => g.revealed.has(l));

        if (allRevealed) {
          games.delete(chatId);
          await conn.reply(chatId, `🎉 ¡Felicidades! La palabra era *${g.word}*.\nLa resolvieron entre todos.`, m);
          return;
        } else {
          await conn.reply(chatId, `✅ Buena! La letra *${text.trim()}* está en la palabra.\nPalabra: ${progress}\nIntentos restantes: ${g.attemptsLeft}`, m);
          return;
        }
      } else {
        // fallo
        g.attemptsLeft -= 1;
        if (g.attemptsLeft <= 0) {
          const answer = g.word;
          games.delete(chatId);
          await conn.reply(chatId, `❌ Te quedaste sin intentos. La palabra era *${answer}*.\nPuedes iniciar otra partida con \`.ahorcado start\``, m);
          return;
        } else {
          const progress = formatWordProgress(g.word, g.revealed);
          await conn.reply(chatId, `❌ La letra *${text.trim()}* no está. Intentos restantes: ${g.attemptsLeft}\nPalabra: ${progress}`, m);
          return;
        }
      }
    }

    // Si no hay partida y no es comando, ignorar
    // Si quieres que el plugin también responda a ".ahorcado" sin args, mostramos ayuda
    if (!arg) {
      // mensaje por defecto (ayuda breve)
      await conn.reply(chatId,
        "Comandos de Ahorcado:\n" +
        "• `.ahorcado start` o `.ahorcado iniciar` — comenzar partida\n" +
        "• `.ahorcado stop` o `.ahorcado terminar` — terminar partida\n" +
        "• `.ahorcado status` o `.ahorcado estado` — ver estado\n\nMientras hay una partida activa, cualquiera puede jugar enviando UNA letra.",
        m
      );
      return;
    }

    // si llega texto que no es letra y no es comando, ignorar (no responder)
  } catch (e) {
    console.error("Error plugin ahorcado:", e);
    // intenta informar al chat
    try {
      await m.reply?.("Ocurrió un error en el plugin del ahorcado.");
    } catch {}
  }
};

handler.help = ["ahorcado start | stop | status"].map(v => v);
handler.tags = ["juegos"];
handler.command = /^ahorcado$/i;
handler.rowner = false; // no solo owner
handler.level = 0;

export default handler;
