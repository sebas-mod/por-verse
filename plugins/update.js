import { exec } from 'child_process'
import util from 'util'

let handler = async (m, { conn, isOwner }) => {
  if (!isOwner) return m.reply('🚫 *Solo el Owner puede usar este comando.*')

  m.reply('🌀 *Actualizando repositorio...*\nPor favor espera un momento ⏳')

  try {
    // Ejecutar git pull
    exec('git pull', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Error al ejecutar git pull:', error)
        return m.reply('⚠️ *Ocurrió un error al actualizar:*\n' + util.format(error))
      }

      if (stderr) console.warn('⚠️ stderr:', stderr)

      // Mostrar resultado del pull
      let resultado = stdout.trim()
      if (!resultado) resultado = '✅ Repositorio actualizado correctamente (sin cambios)'

      // Mostrar en consola los archivos actualizados
      console.log('📦 Archivos actualizados:\n', resultado)

      // Enviar respuesta al chat
      m.reply(`✅ *Actualización completada correctamente:*\n\`\`\`${resultado}\`\`\`\n\n🔁 *Reiniciando bot...*`)

      // Reiniciar el proceso
      setTimeout(() => {
        process.exit()
      }, 2000)
    })
  } catch (e) {
    console.error('❌ Error inesperado en update.js:', e)
    m.reply('🚨 *Error inesperado al actualizar.*\n' + util.format(e))
  }
}

handler.help = ['up']
handler.tags = ['owner']
handler.command = /^up(date)?$/i
handler.owner = true

export default handler
