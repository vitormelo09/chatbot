require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

const usuarios = {};

function menuPrincipal() {
    return `♻️🐾 *ONG Ecopatas*

Ajudamos animais abandonados através da coleta de lacres e tampinhas ❤️

1️⃣ Sobre a ONG
2️⃣ Como ajudar
3️⃣ Pontos de coleta
4️⃣ Doações
5️⃣ Falar com atendente

Digite uma opção.`;
}

app.post("/webhook", (req, res) => {

    const numero = req.body.From;
    const msg = req.body.Body.toLowerCase().trim();

    const twiml = new twilio.twiml.MessagingResponse();

    if (!usuarios[numero]) {
        usuarios[numero] = {
            etapa: "menu"
        };
    }

    // MENU PRINCIPAL
    if (
        msg === "oi" ||
        msg === "olá" ||
        msg === "ola" ||
        msg === "menu"
    ) {

        usuarios[numero].etapa = "menu";

        twiml.message(menuPrincipal());

        res.writeHead(200, {
            "Content-Type": "text/xml"
        });

        return res.end(twiml.toString());
    }

    // VOLTAR MENU
    if (msg === "0") {

        usuarios[numero].etapa = "menu";

        twiml.message(menuPrincipal());

        res.writeHead(200, {
            "Content-Type": "text/xml"
        });

        return res.end(twiml.toString());
    }

    const etapa = usuarios[numero].etapa;

    // MENU
    if (etapa === "menu") {

        if (msg === "1") {

            usuarios[numero].etapa = "sobre";

            twiml.message(
`🐾 *Sobre a ONG Ecopatas*

A Ecopatas arrecada tampinhas plásticas e lacres de alumínio para ajudar animais abandonados.

Todo material reciclável é vendido e o valor arrecadado ajuda em:

🐶 Ração
💉 Vacinas
🏥 Tratamentos veterinários
🐱 Resgate de animais

0️⃣ Voltar ao menu`
            );
        }

        else if (msg === "2") {

            usuarios[numero].etapa = "ajuda";

            twiml.message(
`♻️ *Como ajudar*

1️⃣ Doar tampinhas plásticas
2️⃣ Doar lacres de alumínio
3️⃣ Ser voluntário

Digite uma opção.

0️⃣ Voltar ao menu`
            );
        }

        else if (msg === "3") {

            usuarios[numero].etapa = "coleta";

            twiml.message(
`📍 *Pontos de coleta*

📌 Mercado Central
📌 Pet Shop Amigo Fiel
📌 Escola Municipal Esperança

🕗 Horário:
08h às 18h

0️⃣ Voltar ao menu`
            );
        }

        else if (msg === "4") {

            usuarios[numero].etapa = "doacoes";

            twiml.message(
`💖 *Doações*

PIX:
ecopatas@gmail.com

Banco:
NuBank

Toda ajuda salva vidas 🐾

0️⃣ Voltar ao menu`
            );
        }

        else if (msg === "5") {

            usuarios[numero].etapa = "atendente";

            twiml.message(
`👩‍💻 Um voluntário responderá você em breve.

0️⃣ Voltar ao menu`
            );
        }

        else {

            twiml.message(
`❌ Opção inválida.

Digite uma opção válida.

0️⃣ Voltar ao menu`
            );
        }
    }

    // COMO AJUDAR
    else if (etapa === "ajuda") {

        if (msg === "1") {

            usuarios[numero].etapa = "menu";

            twiml.message(
`♻️ *Doação de tampinhas*

Aceitamos:
✅ Tampinhas de refrigerante
✅ Tampinhas de shampoo
✅ Tampinhas de produtos de limpeza

📦 Entregue em um ponto de coleta.

Obrigado por ajudar 🐾

0️⃣ Voltar ao menu`
            );
        }

        else if (msg === "2") {

            usuarios[numero].etapa = "menu";

            twiml.message(
`♻️ *Doação de lacres*

Aceitamos lacres de:
🥤 Refrigerantes
🍺 Latas em geral

📦 Junte os lacres e entregue em nossos pontos de coleta.

0️⃣ Voltar ao menu`
            );
        }

        else if (msg === "3") {

            usuarios[numero].etapa = "menu";

            twiml.message(
`🤝 *Seja voluntário*

Você pode ajudar em:
🐶 Resgates
📦 Organização
📲 Divulgação
🚚 Transporte de doações

Nossa equipe entrará em contato.

0️⃣ Voltar ao menu`
            );
        }

        else {

            twiml.message(
`❌ Opção inválida.

0️⃣ Voltar ao menu`
            );
        }
    }

    // RESPOSTA FINAL
    res.writeHead(200, {
        "Content-Type": "text/xml"
    });

    res.end(twiml.toString());
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Servidor rodando 🚀");
});