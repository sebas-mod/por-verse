import { createRequire } from "module";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { platform } from "process";
import yargs from "yargs";
import Database from "better-sqlite3";

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== "win32") {
    return rmPrefix
        ? /file:\/\/\//.test(pathURL)
            ? fileURLToPath(pathURL)
            : pathURL
        : pathToFileURL(pathURL).toString();
};

global.__dirname = function dirname(pathURL) {
    return path.dirname(global.__filename(pathURL, true));
};

global.__require = function require(dir = import.meta.url) {
    return createRequire(dir);
};

global.API = (name, path = "/", query = {}, apikeyqueryname) =>
    (name in global.config.APIs ? global.config.APIs[name] : name) +
    path +
    (query || apikeyqueryname
        ? "?" +
          new URLSearchParams(
              Object.entries({
                  ...query,
                  ...(apikeyqueryname
                      ? {
                            [apikeyqueryname]:
                                global.config.APIKeys[
                                    name in global.config.APIs ? global.config.APIs[name] : name
                                ],
                        }
                      : {}),
              })
          )
        : "");

global.timestamp = { start: new Date() };
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());

const dbPath = path.join(global.__dirname(import.meta.url), "database.db");
const sqlite = new Database(dbPath);

sqlite.exec(`
CREATE TABLE IF NOT EXISTS store (
  key TEXT PRIMARY KEY,
  value TEXT
);
`);

class data {
    constructor() {
        this.data = {
            users: {},
            chats: {},
            stats: {},
            settings: {},
            bots: {},
        };
    }
    read() {
        const row = sqlite.prepare("SELECT value FROM store WHERE key = ?").get("db");
        if (row) {
            try {
                this.data = JSON.parse(row.value);
            } catch (e) {
                console.error("❌ DB parse error:", e);
            }
        }
    }
    write() {
        sqlite
            .prepare("INSERT OR REPLACE INTO store (key, value) VALUES (?, ?)")
            .run("db", JSON.stringify(this.data));
    }
}

const db = new data();
db.read();
global.db = db;
global.loadDatabase = () => db.read();

global.loading = async (m, conn, back = false) => {
    if (!back) {
        return conn.sendReact(m.chat, "🍥", m.key);
    } else {
        return conn.sendReact(m.chat, "", m.key);
    }
};

global.dfail = (type, m, conn) => {
    let msg = {
        owner: "✨ *Lo siento, esta función solo puede ser usada por el propietario. Por favor, contáctalo directamente.*",
        mods: "⚙️ *Esta función es solo para moderadores. Si necesitas ayuda, contacta al moderador principal.*",
        premium:
            "💎 *Lo siento, esta función es solo para usuarios premium. Puedes considerar actualizar tu acceso.*",
        group: "🌐 *Este comando solo puede ser usado dentro de un grupo. Prueba en otro grupo.*",
        admin: "🛡️ *Solo los administradores del grupo pueden usar este comando.*",
        botAdmin:
            "🤖 *Necesito ser admin en este grupo para ejecutar este comando. ¿Puedes ayudarme a ser admin?*",
        restrict: "❌ *Lo siento, esta función ha sido restringida y no puede ser usada.*",
    }[type];

    if (msg) {
        conn.sendMessage(
            m.chat,
            {
                text: msg,
                contextInfo: {
                    externalAdReply: {
                        title: "🍡 ACCESO DENEGADO",
                        body: global.config.watermark,
                        mediaType: 1,
                        thumbnailUrl: "https://n.uguu.se/PfcBtCcJ.jpg",
                        renderLargerThumbnail: true,
                    },
                },
            },
            { quoted: m }
        );
    }
};
