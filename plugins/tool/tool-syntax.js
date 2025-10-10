import { readdirSync, statSync, readFileSync } from "fs";
import { join } from "path";
import syntaxerror from "syntax-error";

let handler = async (m) => {
    function scanJS(dir) {
        let res = [];
        for (let file of readdirSync(dir)) {
            let full = join(dir, file);
            if (["node_modules", "auth"].includes(file)) continue; // Ignorar carpetas innecesarias
            if (statSync(full).isDirectory()) res.push(...scanJS(full));
            else if (file.endsWith(".js")) res.push(full);
        }
        return res;
    }

    let files = scanJS("./");
    let resultados = [];

    for (let file of files) {
        let code;
        try {
            code = readFileSync(file, "utf8");
        } catch (e) {
            resultados.push(
                `📄 *Archivo:* ${file.replace("./", "")}\n🚫 *No se pudo leer:* ${e.message}`
            );
            continue;
        }

        let err = syntaxerror(code, file, {
            sourceType: "module",
            allowAwaitOutsideFunction: true,
        });

        if (err) {
            resultados.push(
                [
                    `🍓 *Archivo:* ${file.replace("./", "")}`,
                    `🍩 *Error:* ${err.name}`,
                    `🍬 *Línea:* ${err.line ?? "-"}, *Columna:* ${err.column ?? "-"}`,
                    `🍰 *Mensaje:* _${err.message}_`,
                    `🧁 *Fragmento:*\n\n\`\`\`${err.annotated.trim().slice(0, 300)}\`\`\``,
                ].join("\n")
            );
        }
    }

    if (!resultados.length)
        return m.reply("🍦 *Todos los archivos JavaScript están correctos. No se encontraron errores de sintaxis.*");

    m.reply(`🍫 *Se encontraron errores de sintaxis:*\n\n${resultados.join("\n\n")}`);
};

handler.help = ["syntaxcheck"];
handler.tags = ["owner"];
handler.command = /^(syntaxcheck|syntax)$/i;
handler.owner = true;

export default handler;