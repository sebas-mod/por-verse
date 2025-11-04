import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import chalk from 'chalk';

let handler = async (m, { conn }) => {
const pluginFolder = path.resolve('./plugins');
let errorList = [];

```
if (!fs.existsSync(pluginFolder)) {
    return m.reply('❌ *Carpeta de plugins no encontrada.*');
}

const files = fs.readdirSync(pluginFolder).filter(f => f.endsWith('.js'));

console.log(chalk.cyan('\n🔍 Verificando plugins...\n'));

for (const file of files) {
    const filePath = path.join(pluginFolder, file);
    try {
        const moduleUrl = pathToFileURL(filePath).href;
        const plugin = await import(moduleUrl + '?update=' + Date.now());

        // Detectar handler
        const handlerFn = plugin?.default?.handler || plugin?.handler || null;
        if (!handlerFn) {
            throw new Error('No se encontró un handler válido');
        }

        // Probar handler de manera segura con datos mock
        try {
            await handlerFn({
                chat: 'test_chat',
                args: [],
                text: '',
                usedPrefix: '.',
                command: 'test',
                reply: (msg) => {},
                conn
            });
            console.log(chalk.green(`✅ ${file} - Handler ejecutado correctamente`));
        } catch (err) {
            console.log(chalk.red(`❌ ${file} - Error al ejecutar handler: ${err.message}`));
            errorList.push({ file, error: `Error al ejecutar handler: ${err.message}` });
        }

    } catch (err) {
        console.log(chalk.red(`❌ ${file} - Error de importación: ${err.message}`));
        errorList.push({ file, error: `Error de importación: ${err.message}` });
    }
}

console.log(chalk.yellow('\n📋 Verificación completa.\n'));

if (errorList.length === 0) {
    m.reply('✅ *Todas las funciones fueron verificadas y no se encontraron errores.*');
} else {
    const listaErrores = errorList.map(f => `• ${f.file} → ${f.error}`).join('\n');
    m.reply(`🚨 *Se encontraron ${errorList.length} errores:*\n\n${listaErrores}\n\n📁 *Revisa la consola para más detalles.*`);
}
```

};

handler.help = ['viewerror'];
handler.tags = ['owner'];
handler.command = /^viewerror$/i;
handler.rowner = true;

export default handler;
