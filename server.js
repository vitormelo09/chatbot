require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// Salva estado dos usuários
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
    const msg = req.body.Body.trim();

    const twiml = new twilio.twiml.MessagingResponse();

    // cria usuário se não existir
    if (!usuarios[numero]) {
        usuarios[numero] = {
            etapa: "menu"
        };
    }

    const etapa = usuarios[numero].etapa;

    // MENU PRINCIPAL
    if (msg === "0") {
        usuarios[numero].etapa = "menu";

        twiml.message(menuPrincipal());
    }

    // ETAPA MENU
    else if (etapa === "menu") {

        if (msg === "1") {

            usuarios[numero].etapa = "animais";

            twiml.message(
`🐶 *Animais disponíveis*

1️⃣ Thor
2️⃣ Luna
3️⃣ Mel

Digite o número do animal.`
            );
        }

        else if (msg === "2") {

            twiml.message(
`📋 *Como adotar*

✔️ Ser maior de idade
✔️ Ter espaço adequado
✔️ Assinar contrato`
            );
        }

        else if (msg === "3") {

            twiml.message(
`💖 *Doações*

PIX:
ong@pix.com`
            );
        }

        else if (msg === "4") {

            twiml.message(
`👩‍💻 Um atendente responderá em breve.`
            );
        }

        else {

            twiml.message(
`❌ Opção inválida.

Digite 0 para voltar ao menu.`
            );
        }
    }

    // ETAPA ANIMAIS
    else if (etapa === "animais") {

        if (msg === "1") {

            usuarios[numero].etapa = "thor";

            twiml.message(
`🐶 *Thor*

Idade: 2 anos
Porte: Médio
Vacinado: Sim
Castrado: Sim

Digite:
1️⃣ Quero adotar
0️⃣ Menu`
            );
        }

        else if (msg === "2") {

            usuarios[numero].etapa = "luna";

            twiml.message(
`🐱 *Luna*

Idade: 1 ano
Porte: Pequeno
Vacinada: Sim

Digite:
1️⃣ Quero adotar
0️⃣ Menu`
            );
        }

        else if (msg === "3") {

            usuarios[numero].etapa = "mel";

            twiml.message(
`🐶 *Mel*

Idade: 4 meses
Filhote
Vacinada: Sim

Digite:
1️⃣ Quero adotar
0️⃣ Menu`
            );
        }

        else {

            twiml.message(
`❌ Animal inválido.`
            );
        }
    }

    // THOR
    else if (etapa === "thor") {

        if (msg === "1") {

            twiml.message(
`✅ Pedido de adoção do Thor enviado!

Nossa equipe entrará em contato 🐾`
            );

            usuarios[numero].etapa = "menu";
        }
    }

    // LUNA
    else if (etapa === "luna") {

        if (msg === "1") {

            twiml.message(
`✅ Pedido de adoção da Luna enviado!`
            );

            usuarios[numero].etapa = "menu";
        }
    }

    // MEL
    else if (etapa === "mel") {

        if (msg === "1") {

            twiml.message(
`✅ Pedido de adoção da Mel enviado!`
            );

            usuarios[numero].etapa = "menu";
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