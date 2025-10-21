import { exec } from 'child_process'
import util from 'util'

let handler = async (m, { conn }) => {
  // 🔍 Detectar manualmente si el remitente es owner
  const owners = global.config.owner.map(([n]) => n.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
  const isRealOwner = owners.includes(m.sender)

  console.log('📱 Remitente:', m.sender)
  console.log('👑 Owners registrados:', owners)
  console.log('✅ ¿Es owner?:', isRealOwner)

  if (!isRealOwner) return m.reply('🚫 *Solo el Owner puede usar este comando.*')

  m.reply('🌀 *Actualizando el repositorio...*\nPor favor espera unos segundos ⏳')

  try {
    exec('git pull', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Error al ejecutar git pull:', error)
        return m.reply('⚠️ *Error al actualizar:*\n' + util.format(error))
      }

      if (stderr) console.warn('⚠️ stderr:', stderr)

      let resultado = stdout.trim()
      if (!resultado) resultado = '✅ *Repositorio actualizado (sin cambios detectados).*'

      console.log('📦 Archivos actualizados:\n', resultado)

      m.reply(`✅ *Actualización completada:*\n\`\`\`${resultado}\`\`\`\n\n🔁 *Reiniciando bot...*`)

      // Reinicio automático
      setTimeout(() => process.exit(), 2000)
    })
  } catch (e) {
    console.error('❌ Error inesperado en update.js:', e)
    m.reply('🚨 *Error inesperado al actualizar:*\n' + util.format(e))
  }
}

handler.help = ['up']
handler.tags = ['owner']
handler.command = /^up(date)?$/i

export default handler
