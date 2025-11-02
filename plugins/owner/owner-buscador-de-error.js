import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

let handler = async (m, { conn }) => {
    const pluginFolder = './plugins'
    let errorList = []

    if (!fs.existsSync(pluginFolder)) {
        return m.reply('❌ ¡Carpeta de complementos no encontrada!')
    }

    let files = fs.readdirSync(pluginFolder).filter(file => file.endsWith('.js'))

    for (let file of files) {
        try {
            const filePath = path.resolve(pluginFolder, file)
            const moduleUrl = pathToFileURL(filePath).href
            const plugin = await import(moduleUrl)

            if (typeof plugin.default !== 'function' && typeof plugin !== 'function') {
                throw new Error('La exportación predeterminada no es una función')
            }
        } catch (err) {
            errorList.push(`❌ ${file}: ${err.message}`)
        }
    }

    if (errorList.length === 0) {
        m.reply('✅ ¡Todas las funciones fueron verificadas y no se encontraron errores!')
    } else {
        m.reply(`🚨 Se encontraron ${errorList.length} errores:\n\n${errorList.join('\n')}`)
    }
}

handler.help = ['viewerror']
handler.tags = ['owner']
handler.command = /^viewerror$/i
handler.rowner = true // Solo el dueño

export default handler
