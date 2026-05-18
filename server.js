require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// memória simples
const usuarios = {};

function menuPrincipal() {
    return `🐾 *ONG Patinhas Felizes*

1️⃣ Ver animais
2️⃣ Como adotar
3️⃣ Doações
4️⃣ Atendente

Digite uma opção.`;
}

app.post("/webhook", (req, res) => {

    const numero = req.body.From;
    const msg = req.body.Body.toLowerCase().trim();

    const twiml = new twilio.twiml.MessagingResponse();

    // cria usuário
    if (!usuarios[numero]) {
        usuarios[numero] = {
            etapa: "menu"
        };
    }

    // iniciar conversa
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

    // voltar menu
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

            usuarios[numero].etapa = "animais";

            twiml.message(
`🐶 *Animais disponíveis*

1️⃣ Thor
2️⃣ Luna
3️⃣ Mel

Digite o número do animal.

0️⃣ Voltar ao menu`
            );
        }

        else if (msg === "2") {

            twiml.message(
`📋 *Como adotar*

✔️ Ser maior de idade
✔️ Ter espaço adequado
✔️ Assinar contrato

0️⃣ Voltar ao menu`
            );
        }

        else if (msg === "3") {

            twiml.message(
`💖 *Doações*

PIX:
ong@pix.com

0️⃣ Voltar ao menu`
            );
        }

        else if (msg === "4") {

            twiml.message(
`👩‍💻 Um atendente responderá em breve.

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

    // ANIMAIS
    else if (etapa === "animais") {

        if (msg === "1") {

            usuarios[numero].etapa = "thor";

            twiml.message(
`🐶 *Thor*

Idade: 2 anos
Porte: Médio
Vacinado: Sim
Castrado: Sim

1️⃣ Quero adotar
0️⃣ Voltar ao menu`
            );
        }

        else if (msg === "2") {

            usuarios[numero].etapa = "luna";

            twiml.message(
`🐱 *Luna*

Idade: 1 ano
Porte: Pequeno
Vacinada: Sim

1️⃣ Quero adotar
0️⃣ Voltar ao menu`
            );
        }

        else if (msg === "3") {

            usuarios[numero].etapa = "mel";

            twiml.message(
`🐶 *Mel*

Idade: 4 meses
Filhote
Vacinada: Sim

1️⃣ Quero adotar
0️⃣ Voltar ao menu`
            );
        }

        else {

            twiml.message(
`❌ Animal inválido.

0️⃣ Voltar ao menu`
            );
        }
    }

    // THOR
    else if (etapa === "thor") {

        if (msg === "1") {

            usuarios[numero].etapa = "menu";

            twiml.message(
`✅ Pedido de adoção do Thor enviado!

Nossa equipe entrará em contato 🐾

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

    // LUNA
    else if (etapa === "luna") {

        if (msg === "1") {

            usuarios[numero].etapa = "menu";

            twiml.message(
`✅ Pedido de adoção da Luna enviado!

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

    // MEL
    else if (etapa === "mel") {

        if (msg === "1") {

            usuarios[numero].etapa = "menu";

            twiml.message(
`✅ Pedido de adoção da Mel enviado!

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

    res.writeHead(200, {
        "Content-Type": "text/xml"
    });

    res.end(twiml.toString());
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Servidor rodando");
});