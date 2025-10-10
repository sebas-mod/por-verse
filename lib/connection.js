/* global conn */
import path, { join } from "path";
import { existsSync, readFileSync, watch } from "fs";
import syntaxerror from "syntax-error";
import { format } from "util";
import { schedule } from "./cron.js";
import chalk from "chalk";
import { DisconnectReason } from "baileys";
import {
    checkPremium,
    resetChat,
    Backup,
    OtakuNews,
    checkGempa,
    clearTmp,
    resetCommand,
} from "./schedule.js";

async function connectionUpdateHandler(update) {
    const { receivedPendingNotifications, connection, lastDisconnect, isOnline, isNewLogin } = update;
    if (isNewLogin) conn.isInit = true;

    if (connection === "connecting")
        console.log(chalk.yellow.bold("🚀 Activando, por favor espera un momento"));
    
    if (connection === "open")
        console.log(chalk.cyan.bold("⚡ Conectado! Activación exitosa."));
    
    if (isOnline === false) {
        console.log(chalk.redBright.bold("🔴 Estado: Desconectado!"));
        console.log(chalk.red.bold("❌ La conexión con WhatsApp se ha perdido."));
        console.log(chalk.red.bold("🚀 Intentando reconectar..."));
    }

    if (receivedPendingNotifications)
        console.log(chalk.cyan.bold("📩 Estado: Esperando nuevos mensajes"));
    
    if (connection === "close") {
        console.log(chalk.redBright.bold("⚠️ Conexión cerrada!"));
        console.log(chalk.red.bold("📡 Intentando reconectar..."));
    }

    global.timestamp.connect = new Date();

    if (lastDisconnect && lastDisconnect.error) {
        const { statusCode } = lastDisconnect.error.output || {};
        if (statusCode !== DisconnectReason.loggedOut) {
            await global.reloadHandler(true);
            console.log(chalk.redBright.bold("🔌 Reconectando"));
        }
    }

    if (global.db.data == null) await global.loadDatabase();
}

async function initReload(conn, pluginFolder, getAllPlugins) {
    const pluginFilter = (filename) => /\.js$/.test(filename);
    global.plugins = {};

    async function filesInit() {
        let success = 0;
        let failed = 0;
        for (let filepath of getAllPlugins(pluginFolder)) {
            let filename = path.relative(pluginFolder, filepath);
            try {
                let file = global.__filename(filepath);
                const module = await import(file);
                global.plugins[filename] = module.default || module;
                success++;
            } catch {
                delete global.plugins[filename];
                failed++;
            }
        }
        conn.logger.info(`🍩 Total de plugins cargados: ${success}, fallidos: ${failed}`);
    }

    await filesInit().catch(console.error);

    global.reload = async (_ev, filename) => {
        if (pluginFilter(filename)) {
            let dir = global.__filename(join(pluginFolder, filename), true);
            if (filename in global.plugins) {
                if (existsSync(dir)) conn.logger.info(`🍰 Recargando plugin '${filename}'`);
                else {
                    conn.logger.warn(`🍪 Plugin '${filename}' ha sido eliminado`);
                    return delete global.plugins[filename];
                }
            } else conn.logger.info(`🧁 Cargando nuevo plugin: '${filename}'`);
            
            let err = syntaxerror(readFileSync(dir), filename, {
                sourceType: "module",
                allowAwaitOutsideFunction: true,
            });

            if (err) {
                conn.logger.error(
                    [
                        `🍬 Error en plugin: '${filename}'`,
                        `🍫 Mensaje: ${err.message}`,
                        `🍩 Línea: ${err.line}, Columna: ${err.column}`,
                        `🍓 ${err.annotated}`,
                    ].join("\n")
                );
                return;
            }

            try {
                const module = await import(`${global.__filename(dir)}?update=${Date.now()}`);
                global.plugins[filename] = module.default || module;
            } catch (e) {
                conn.logger.error(`🍪 Error cargando plugin '${filename}'\n${format(e)}`);
            } finally {
                global.plugins = Object.fromEntries(
                    Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b))
                );
            }
        }
    };

    Object.freeze(global.reload);
    watch(pluginFolder, { recursive: true }, global.reload);
}

function initCron() {
    schedule(
        "reset",
        async () => {
            await resetCommand();
            await resetChat();
        },
        { cron: "0 0 * * *" }
    );
    schedule(
        "backup",
        async () => {
            await Backup();
        },
        { cron: "0 */8 * * *" }
    );
    schedule(
        "maintenance",
        async () => {
            await clearTmp();
            await checkPremium();
        },
        { intervalSeconds: 600 }
    );
    schedule(
        "feeds",
        async () => {
            await checkGempa();
            await OtakuNews();
        },
        { intervalSeconds: 60 }
    );
}

export { connectionUpdateHandler, initReload, initCron };
