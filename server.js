require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

function menu() {
    return `🐾 *ONG Patinhas Felizes*

1️⃣ Ver animais para adoção
2️⃣ Como adotar
3️⃣ Fazer doação
4️⃣ Agendar visita
5️⃣ Falar com atendente
6️⃣ Animais perdidos
7️⃣ Ser voluntário
8️⃣ Redes sociais
9️⃣ Horário e localização

Digite uma opção.`;
}

app.post("/webhook", (req, res) => {

    const mensagem = req.body.Body.toLowerCase().trim();

    const twiml = new twilio.twiml.MessagingResponse();

    // MENU
    if (
        mensagem === "oi" ||
        mensagem === "menu" ||
        mensagem === "0"
    ) {
        twiml.message(menu());
    }

    // ADOÇÃO
    else if (mensagem === "1") {
        twiml.message(
`🐶 *Animais disponíveis*

1 - Thor
2 - Luna
3 - Mel

Digite o número do animal.`
        );
    }

    // THOR
    else if (mensagem === "thor" || mensagem === "1 - thor") {
        twiml.message(
`🐶 *Thor*

Idade: 2 anos
Porte: Médio
Vacinado: Sim
Castrado: Sim

Digite:
1 - Quero adotar
0 - Menu`
        );
    }

    // LUNA
    else if (mensagem === "2") {
        twiml.message(
`🐱 *Luna*

Idade: 1 ano
Porte: Pequeno
Vacinada: Sim

Digite:
1 - Quero adotar
0 - Menu`
        );
    }

    // MEL
    else if (mensagem === "3") {
        twiml.message(
`🐶 *Mel*

Idade: 4 meses
Filhote
Vacinada: Sim

Digite:
1 - Quero adotar
0 - Menu`
        );
    }

    // COMO ADOTAR
    else if (mensagem === "como adotar") {
        twiml.message(
`📋 *Processo de adoção*

✔️ Ser maior de idade
✔️ Ter espaço adequado
✔️ Assinar termo de responsabilidade
✔️ Enviar documentos`
        );
    }

    // DOAÇÃO
    else if (mensagem === "4") {
        twiml.message(
`💖 *Doações*

PIX:
ongpatinhas@pix.com

Toda ajuda salva vidas 🐾`
        );
    }

    // VISITA
    else if (mensagem === "5") {
        twiml.message(
`📅 *Agendamento*

Funcionamos:
Segunda a sábado
09h às 18h

Digite seu nome para agendar.`
        );
    }

    // ATENDENTE
    else if (mensagem === "6") {
        twiml.message(
`👩‍💻 Um atendente responderá em breve.`
        );
    }

    // VOLUNTÁRIO
    else if (mensagem === "7") {
        twiml.message(
`🤝 *Voluntariado*

Precisamos de ajuda com:
🐾 Banho
🐾 Alimentação
🐾 Divulgação

Digite seu nome e idade.`
        );
    }

    // REDES
    else if (mensagem === "8") {
        twiml.message(
`📱 Redes sociais

Instagram:
@ongpatinhas

Facebook:
facebook.com/ongpatinhas`
        );
    }

    // LOCAL
    else if (mensagem === "9") {
        twiml.message(
`📍 *Localização*

Rua das Flores, 100
São Paulo - SP

🕘 09h às 18h`
        );
    }

    else {
        twiml.message(
`❌ Opção inválida.

Digite:
0 - Menu`
        );
    }

    res.writeHead(200, {
        "Content-Type": "text/xml",
    });

    res.end(twiml.toString());
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Servidor rodando");
});