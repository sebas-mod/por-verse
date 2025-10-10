import { writeFileSync, unlinkSync } from "fs";
import { fileTypeFromBuffer } from "file-type";
import { join, basename } from "path";

let handler = async (m, { text, conn, usedPrefix, command }) => {
    try {
        if (!/^https?:\/\//.test(text)) {
            return m.reply(
                `❌ *La URL debe empezar con http:// o https://*\n\n📌 *Ejemplo:* ${usedPrefix + command} https://google.com`
            );
        }

        await global.loading(m, conn);

        let redirectUrl = text;
        let redirectCount = 0;

        let finalInfo = {
            url: text,
            redirects: 0,
            status: "",
            contentType: "",
            filename: "",
            size: "",
            filePath: "",
            mime: "",
        };

        while (redirectCount < 10) {
            let res = await fetch(redirectUrl, {
                redirect: "manual",
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
                },
            });

            let statusCode = res.status;
            let statusText = res.statusText || "Estado desconocido";
            let contentLength = res.headers.get("content-length") ?? 0;
            let size = contentLength ? `${(contentLength / 1024 / 1024).toFixed(2)} MB` : "Desconocido";
            let contentType = res.headers.get("content-type") || "desconocido";
            let contentDisposition = res.headers.get("content-disposition") || "";
            let filename =
                contentDisposition?.split("filename=")[1]?.trim()?.replace(/["']/g, "") ||
                new URL(redirectUrl).pathname.split("/").pop() ||
                `download.${Date.now()}`;
            finalInfo = {
                url: redirectUrl,
                redirects: redirectCount,
                status: `${statusCode} - ${statusText}`,
                contentType,
                filename,
                size,
            };

            // Manejo de redirecciones
            if ([301, 302, 307, 308].includes(statusCode)) {
                let location = res.headers.get("location");
                if (location) {
                    redirectUrl = location;
                    redirectCount++;
                    continue;
                }
            }

            // Descarga del archivo
            let buffer = Buffer.from(await res.arrayBuffer());
            if (buffer.length > 20 * 1024 * 1024) {
                throw new Error("El archivo es demasiado grande (límite 20 MB)");
            }

            let fileType = await fileTypeFromBuffer(buffer);
            let contentExt = contentType.split("/")[1]?.split(";")[0]?.trim().replace(/\W/g, "");
            let ext = fileType?.ext || contentExt || "bin";
            let baseName = filename?.split(".").shift()?.replace(/\W/g, "") || `file_${Date.now()}`;
            let safeName = basename(baseName + (ext ? `.${ext}` : ""));
            let filePath = join("./tmp", safeName);

            writeFileSync(filePath, buffer);

            finalInfo.filePath = filePath;
            finalInfo.mime = fileType?.mime || contentType || "application/octet-stream";

            break;
        }

        if (redirectCount >= 10) {
            return m.reply(`❌ *Demasiadas redirecciones (máximo 10).*`);
        }

        let shortUrl =
            finalInfo.url.length > 60 ? finalInfo.url.slice(0, 57) + "..." : finalInfo.url;

        await conn.sendMessage(
            m.chat,
            {
                document: { url: finalInfo.filePath },
                mimetype: finalInfo.mime,
                fileName: finalInfo.filename,
                caption: `🌐 *INFORMACIÓN DEL FETCH*
━━━━━━━━━━━━━━━━━━━
📎 *URL:* ${shortUrl}
📥 *Redirecciones:* ${finalInfo.redirects}
📡 *Estado:* ${finalInfo.status}
📄 *Content-Type:* ${finalInfo.contentType}
📂 *Archivo:* ${finalInfo.filename}
📏 *Tamaño:* ${finalInfo.size}`.trim(),
            },
            { quoted: m }
        );

        // Limpieza del archivo temporal
        try {
            unlinkSync(finalInfo.filePath);
        } catch {
            // ignorar
        }
    } catch (e) {
        m.reply(`❌ *Error al hacer fetch!*\n📄 *Detalles:* \`\`\`${e.message}\`\`\``);
    } finally {
        await global.loading(m, conn, true);
    }
};

handler.help = ["fetch"];
handler.tags = ["internet"];
handler.command = /^(fetch|get)$/i;
handler.owner = true;

export default handler;