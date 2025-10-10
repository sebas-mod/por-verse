import baileys from "baileys";
import axios from "axios";

let handler = async (m, {
        conn,
        text,
        usedPrefix,
        command
    }) => {
const settings = global.db.data.settings[conn.user.jid] || {}
        const tiktokRegex = /https?:\/\/(?:www\.|vm\.|vt\.)?tiktok\.com\/(?:@[\w.-]+\/video\/\d+|[\w.-]+\/video\/\d+|\w+|t\/\w+)/i;
        const hasTiktokLink = tiktokRegex.test(text) || null;
        if (!hasTiktokLink) throw m.reply(`Lo siento, ingresaste el enlace primero, ejemplo: ${usedPrefix + command} https://vt.tiktok.com/xxxx`);

        let url;
        if (hasTiktokLink) {
            try {
                const ttwm = await tikwm(text);
                let caption = `🔥 \`[ Downloader TikTok ]\` 💙
📙Titulo: ${ttwm.title || ''}
🗾Region: ${ttwm.region || ''}
🆔Id: ${ttwm.id || ''}
🧩Tipo: ${ttwm.images ? 'image' : 'video' || ''}

🧾Cuenta
🔖Nombre: @${ttwm.author.nickname || ''}
👤Usuario: @${ttwm.author.unique_id || ''}
🆔Id: @${ttwm.author.id || ''}

▶️${ttwm.play_count || ''} | 💙${ttwm.digg_count || ''} | 💬${ttwm.comment_count || ''}`;

                await conn.sendMessage(m.chat, {
                    image: {
                        url: ttwm.author.avatar
                    },
                    caption
                }, {
                    quoted: m
                });
                if (ttwm.images) {
                    const ft = ttwm.images.map(v => v);
                    let push = [];
                    for (let i = 0; i < ft.length; i++) {
                        let cap = `${caption}`;
                        const mediaMessage = await baileys.prepareWAMessageMedia({
                            image: {
                                url: ft[i]
                            }
                        }, {
                            upload: conn.waUploadToServer
                        });
                        push.push({
                            body: baileys.proto.Message.InteractiveMessage.Body.fromObject({
                                text: cap
                            }),
                            footer: baileys.proto.Message.InteractiveMessage.Footer.fromObject({
                                text: wm
                            }),
                            header: baileys.proto.Message.InteractiveMessage.Header.create({
                                title: `Imagen ${i + 1}`,
                                subtitle: '',
                                hasMediaAttachment: true,
                                ...mediaMessage
                            }),
                            nativeFlowMessage: baileys.proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                buttons: [{}]
                            })
                        });
                    }
                    const msg = baileys.generateWAMessageFromContent(m.chat, {
                        viewOnceMessage: {
                            message: {
                                messageContextInfo: {
                                    deviceListMetadata: {},
                                    deviceListMetadataVersion: 2
                                },
                                interactiveMessage: baileys.proto.Message.InteractiveMessage.fromObject({
                                    body: baileys.proto.Message.InteractiveMessage.Body.create({
                                        text: settings.wm
                                    }),
                                    footer: baileys.proto.Message.InteractiveMessage.Footer.create({
                                        text: "Tiktok Downloader"
                                    }),
                                    header: baileys.proto.Message.InteractiveMessage.Header.create({
                                        hasMediaAttachment: false
                                    }),
                                    carouselMessage: baileys.proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                                        cards: push
                                    }),
                                    contextInfo: {
                                        mentionedJid: [m.sender],
                                        forwardingScore: 999,
                                        isForwarded: true,
                                        forwardedNewsletterMessageInfo: {
                                            newsletterJid: settings.id_canal_owner+"@newsletter",
                                            newsletterName: settings.wm,
                                            serverMessageId: 143
                                        }
                                    }
                                })
                            }
                        }
                    }, {
                        quoted: m
                    });
                    await conn.relayMessage(m.chat, msg.message, {
                        messageId: msg.key.id
                    });
                } else {
                    let {
                        data: res
                    } = await axios.get(ttwm.play, {
                        responseType: 'arraybuffer'
                    });
                    conn.sendFile(m.chat, Buffer.from(res), null, caption, m);
                }
            } catch (e) {
                m.reply('❌ Perdón por el error, quizá haya demasiadas solicitudes esta vez.');
                console.error('Error: ', e);
            }
        } else {
            m.reply('❌Lo siento, no hay enlace, ya no funciona.')
        };
    }

handler.help = ['tiktok', 'ttdl', 'tt', 'tiktokdl']
handler.tags = ['downloader']
handler.command = ['tiktok', 'ttdl', 'tt', 'tiktokdl']

export default handler

async function tikwm(url) {
    let retries = 0;
    let response;
    let maxRetries = 10;
    let retryDelay = 4000;
    while (retries < maxRetries) {
        try {
            response = await axios(`https://tikwm.com/api/?url=${url}`).catch(e => e.response);
            if (response && response.data && response.data.data) {
                return response.data.data;
            } else if (response && response.data && response.data.msg) {
                console.error(`Error from API: ${response.data.msg}`);
                throw new Error(`API Error: ${response.data.msg}`);
            } else {
                console.error("Unexpected response from API. Retrying...");
                throw new Error("Unexpected API response");
            }
        } catch (error) {
            console.error(`Attempt ${retries + 1} failed: ${error.message}`);
            retries++;
            if (retries < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            } else {
                console.error(`Max retries reached. Giving up after ${maxRetries} attempts.`);
                throw error;
            }
        }
    }
};