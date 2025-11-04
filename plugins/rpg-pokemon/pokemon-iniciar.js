import fs from 'fs'

const dir = './database/pokemon'
const path = `${dir}/usuarios.json`

// 🛠️ Crear carpeta si no existe
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

let handler = async (m, { conn }) => {
  if (!fs.existsSync(path)) fs.writeFileSync(path, '{}')
  let usuarios = JSON.parse(fs.readFileSync(path))
  if (usuarios[m.sender]) return m.reply('🌟 Ya tenés perfil creado.')

  // 📸 Guardar imagen si la manda o responde
  let mediaUrl = ''
  if (m.quoted && m.quoted.mimetype?.includes('image')) {
    let media = await m.quoted.download()
    let fileName = `${dir}/img-${m.sender}.jpg`
    fs.writeFileSync(fileName, media)
    mediaUrl = fileName
  } else if (m.mimetype && m.mimetype.includes('image')) {
    let media = await m.download()
    let fileName = `${dir}/img-${m.sender}.jpg`
    fs.writeFileSync(fileName, media)
    mediaUrl = fileName
  }

  usuarios[m.sender] = {
    nombre: m.pushName,
    monedas: 1000,
    pokeballs: 3,
    equipo: [],
    imagen: mediaUrl || '',
  }

  fs.writeFileSync(path, JSON.stringify(usuarios, null, 2))

  let msg = `🎮 Perfil creado exitosamente
