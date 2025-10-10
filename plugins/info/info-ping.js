import { execSync } from "child_process";
import os from "os";
import fs from "fs";

function formatSize(bytes) {
    if (!bytes || isNaN(bytes)) return "0 B";
    let units = ["B", "KB", "MB", "GB", "TB"];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
        bytes /= 1024;
        i++;
    }
    return `${bytes.toFixed(2)} ${units[i]}`;
}

function clockString(ms) {
    if (isNaN(ms) || ms < 0) return "--";
    let d = Math.floor(ms / 86400000);
    let h = Math.floor((ms / 3600000) % 24);
    let m = Math.floor((ms / 60000) % 60);
    let s = Math.floor((ms / 1000) % 60);
    let result = "";
    if (d) result += `${d}d `;
    if (h || d) result += `${h}h `;
    if (m || h || d) result += `${m}m `;
    result += `${s}s`;
    return result;
}

function getUptimeInfo() {
    return {
        botUptime: clockString(process.uptime() * 1000),
        vpsUptime: clockString(os.uptime() * 1000),
    };
}

function getOSPrettyName() {
    try {
        let lines = fs.readFileSync("/etc/os-release").toString().split("\n");
        let info = lines.reduce((acc, line) => {
            let [key, val] = line.split("=");
            if (key && val) acc[key.trim()] = val.replace(/"/g, "");
            return acc;
        }, {});
        return info["PRETTY_NAME"] || os.platform();
    } catch {
        return os.platform();
    }
}

function getCPUInfo() {
    const cpus = os.cpus();
    return { model: cpus[0]?.model || "Desconocido", cores: cpus.length };
}

function getRAMInfo() {
    try {
        let meminfo = fs
            .readFileSync("/proc/meminfo")
            .toString()
            .split("\n")
            .reduce((acc, line) => {
                let [key, value] = line.split(":");
                if (key && value) acc[key.trim()] = parseInt(value.trim());
                return acc;
            }, {});
        let ramUsed = meminfo["MemTotal"] - meminfo["MemAvailable"];
        let swapUsed = meminfo["SwapTotal"] - meminfo["SwapFree"];
        let totalUsed = ramUsed + swapUsed;
        let totalMemory = meminfo["MemTotal"] + meminfo["SwapTotal"];
        return { ramUsed: ramUsed * 1024, totalUsed: totalUsed * 1024, totalMemory: totalMemory * 1024 };
    } catch {
        return { ramUsed: 0, totalUsed: 0, totalMemory: 0 };
    }
}

function getDiskUsage() {
    try {
        let output = execSync("df -k --output=size,used,target /").toString().trim().split("\n")[1];
        let parts = output.trim().split(/\s+/);
        return { total: parseInt(parts[0]) * 1024, used: parseInt(parts[1]) * 1024 };
    } catch {
        return { total: 0, used: 0 };
    }
}

function makeBar(used, total, length = 10) {
    const ratio = total ? Math.min(1, Math.max(0, used / total)) : 0;
    const filled = Math.round(ratio * length);
    const empty = length - filled;
    return `*[${"█".repeat(filled)}${"░".repeat(empty)}] ${(ratio * 100).toFixed(2)}%*`;
}

let handler = async (m, { conn }) => {
    let vcard = `BEGIN:VCARD
VERSION:3.0
N:;ttname;;;
FN:ttname
item1.TEL;waid=13135550002:+1 (313) 555-0002
item1.X-ABLabel:Teléfono
END:VCARD`;
    let q = {
        key: {
            fromMe: false,
            participant: "13135550002@s.whatsapp.net",
            remoteJid: "status@broadcast",
        },
        message: {
            contactMessage: {
                displayName: "📡 DELUXE HOST",
                vcard,
            },
        },
    };

    let uptime = getUptimeInfo();
    let cpu = getCPUInfo();
    let osName = getOSPrettyName();
    let startTime = performance.now();
    let ram = getRAMInfo();
    let disk = getDiskUsage();
    let ramBar = makeBar(ram.totalUsed, ram.totalMemory);
    let diskBar = makeBar(disk.used, disk.total);
    let ramUsedStr = formatSize(ram.totalUsed);
    let ramTotalStr = formatSize(ram.totalMemory);
    let diskUsedStr = formatSize(disk.used);
    let diskTotalStr = formatSize(disk.total);
    let endTime = performance.now();
    let responseTime = (endTime - startTime).toFixed(2);

    let message = `
🌟 *\`INFORME DEL SERVIDOR\`*
🚀 *Tiempo de Respuesta: ${responseTime} ms*
⏰ *Uptime del Bot: ${uptime.botUptime}*
📡 *Uptime del VPS: ${uptime.vpsUptime}*
━━━━━━━━━━━━━━━━━━━━
💻 *\`DETALLES DEL SISTEMA\`*
🐧 *SO: ${osName}*
🖥️ *Plataforma: ${os.platform()} (${os.arch()})*
📜 *Kernel: ${os.release()}*
🧠 *CPU: ${cpu.model} (${cpu.cores} Core)*
🗳️ *RAM: ${ramUsedStr} / ${ramTotalStr}*
${ramBar}
🔥 *Disco: ${diskUsedStr} / ${diskTotalStr}*
${diskBar}
━━━━━━━━━━━━━━━━━━━━
✨ ¡Este bot y VPS están alojados en *Deluxe Host*!  
💎 Servidores confiables, rápidos y 24/7 🌐  
🎉 Visita: https://dash.deluxehost.cl
`;

    await conn.sendMessage(
        m.chat,
        {
            text: message,
            contextInfo: {
                externalAdReply: {
                    title: "🍙 Estado del Sistema en Tiempo Real",
                    body: "🍣 Monitoreo automático por Waguri Ai 🍵",
                    thumbnailUrl: "https://files.catbox.moe/ggdvzu.jpg",
                    mediaType: 1,
                    renderLargerThumbnail: true,
                },
            },
        },
        { quoted: q }
    );
};

handler.help = ["ping"];
handler.tags = ["info"];
handler.command = /^(ping)$/i;
handler.owner = true;

export default handler;