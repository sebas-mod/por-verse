/*
 * Liora WhatsApp Bot
 * @description Open source WhatsApp bot based on Node.js and Baileys.
 *
 * @founder     གྷ Naruya Izumi <https://linkbio.co/naruyaizumi> | wa.me/6283143663697
 * @owner       གྷ SXZnightmar <wa.me/6281398961382>
 * @business    གྷ Ashaa <wa.me/6285167849436>
 * @api-dev     གྷ Alfi Dev <wa.me/6287831816747>
 * @python-dev  གྷ Zhan Dev <wa.me/6281239621820>
 *
 * @copyright   © 2024 - 2025 Naruya Izumi
 * @license     Apache License 2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * IMPORTANT NOTICE:
 * - Do not sell or redistribute this source code for commercial purposes.
 * - Do not remove or alter original credits under any circumstances.
 */

import "dotenv/config";

global.config = {
    /*============== STAFF ==============*/
    owner: [
        ["5491166887146", "sebasMD", true]
    ],
    newsletter: process.env.NEWSLETTER,
    group: process.env.GROUP,
    website: process.env.WEBSITE,

    /*========== DEVELOPER MODE ==========*/
    DEVELOPER: process.env.IS_IZUMI === "true",

    /*============= PAIRING =============*/
    pairingNumber: process.env.PAIRING_NUMBER,
    pairingAuth: process.env.PAIRING_AUTH === "true",

    /*============== API ==============*/
    APIs: {
        btz: process.env.API_BTZ,
    },
    APIKeys: {
        [process.env.API_BTZ]: process.env.APIKEY_BTZ,
    },

    /*============= VPS PANEL =============*/
    domain: process.env.PANEL_DOMAIN,
    apikey: process.env.PANEL_APIKEY,
    capikey: process.env.PANEL_CAPIKEY,
    nestid: process.env.PANEL_NESTID,
    egg: process.env.PANEL_EGG,
    loc: process.env.PANEL_LOC,
    VPS: {
        host: process.env.VPS_HOST,
        port: process.env.VPS_PORT,
        username: process.env.VPS_USERNAME,
        password: process.env.VPS_PASSWORD,
    },
    token: process.env.DIGITALOCEAN_TOKEN,

    /*============= SUBDOMAIN =============*/
    Subdo: {
        "naruyaizumi.site": {
            zone: process.env.CF_ZONE,
            apitoken: process.env.CF_APIKEY,
        },
    },

    /*============== MESSAGES ==============*/
 watermark: "𝐀𝐋𝐘𝐀 𝐁𝐎𝐓",
author: "© 𝚂𝚎𝚋𝚊𝚜 𝙼𝙳",
stickpack: "𝐀𝐋𝐘𝐀 𝐁𝐎𝐓",
stickauth: "© 𝚂𝚎𝚋𝚊𝚜 𝙼𝙳",
};
