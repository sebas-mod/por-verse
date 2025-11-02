import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import chalk from 'chalk'

let handler = async (m, { conn }) => {
    const pluginFolder = path.resolve('./plugins')
    let errorList = []

    if (!fs.existsSync(pluginFolder)) {
        return m.reply('❌ *Carpeta de plugins no encontrada.*')
    }

    const files = fs.readdirSync(pluginFolder).filter(f => f.endsWith('.js'))

    console.log(chalk.cyan('\n🔍 Verificando plugins...\n'))

    for (const file of files) {
        const filePath = path.join(pluginFolder, file)
        try {
            const moduleUrl = pathToFileURL(filePath).href
            const plugin = await import(moduleUrl + '?update=' + Date.now())

            if (typeof plugin.default !== 'function' && typeof plugin !== 'function') {
                throw new Error('La exportación predeterminada no es una función')
            }

            console.log(chalk.green(`✅ ${file} verificado correctamente`))
        } catch (err) {
            console.log(chalk.red(`❌ ${file}: ${err.message}`))
            errorList.push(file)
        }
    }

    console.log(chalk.yellow('\n📋 Verificación completa.\n'))

    if (errorList.length === 0) {
        m.reply('✅ *Todas las funciones fueron verificadas y no se encontraron errores.*')
    } else {
        const listaErrores = errorList.map(f => `• ${f}`).join('\n')
        m.reply(`🚨 *Se encontraron ${errorList.length} errores:*\n\n${listaErrores}\n\n📁 *Revisa la consola para más detalles.*`)
    }
}

handler.help = ['viewerror']
handler.tags = ['owner']
handler.command = /^viewerror$/i
handler.rowner = true

export default handler
