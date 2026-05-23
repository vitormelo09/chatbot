require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

const usuarios = {};

function menuPrincipal() {
    return `[ ECOPATAS ]

ONG que arrecada lacres e tampinhas
para ajudar animais abandonados.

[1] Sobre a ONG
[2] Como ajudar
[3] Pontos de coleta
[4] Doações
[5] Contato
[6] Atendente

Digite uma opção:`;
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

    if (msg === "0") {

        usuarios[numero].etapa = "menu";

        twiml.message(menuPrincipal());

        res.writeHead(200, {
            "Content-Type": "text/xml"
        });

        return res.end(twiml.toString());
    }

    const etapa = usuarios[numero].etapa;

    if (etapa === "menu") {

        if (msg === "1") {

            usuarios[numero].etapa = "sobre";

            twiml.message(
`[ SOBRE A ONG ]

A Ecopatas arrecada tampinhas
plásticas e lacres de alumínio
para ajudar animais abandonados.

O valor arrecadado ajuda em:

[✔] Ração
[✔] Vacinas
[✔] Castrações
[✔] Tratamentos veterinários
[✔] Resgate de animais

[0] Voltar ao menu`
            );

        } else if (msg === "2") {

            usuarios[numero].etapa = "ajuda";

            twiml.message(
`[ COMO AJUDAR ]

[1] Doar tampinhas
[2] Doar lacres
[3] Ser voluntário

Digite uma opção.

[0] Voltar ao menu`
            );

        } else if (msg === "3") {

            usuarios[numero].etapa = "coleta";

            twiml.message(
`[ PONTOS DE COLETA ]

[#] Mercado Central
[#] Pet Shop Amigo Fiel
[#] Escola Esperança

Horário:
08h às 18h

[0] Voltar ao menu`
            );

        } else if (msg === "4") {

            usuarios[numero].etapa = "doacoes";

            twiml.message(
`[ DOAÇÕES ]

PIX:
ecopatas@gmail.com

Banco:
NuBank

[#] Toda ajuda salva vidas.

[0] Voltar ao menu`
            );

        } else if (msg === "5") {

            usuarios[numero].etapa = "contato";

            twiml.message(
`[ CONTATO ]

Instagram:
@ecopatas

Email:
contato@ecopatas.org

Telefone:
(11) 99999-9999

Site:
www.ecopatas.org

[0] Voltar ao menu`
            );

        } else if (msg === "6") {

            usuarios[numero].etapa = "atendente";

            twiml.message(
`[ ATENDENTE ]

[#] Um voluntário responderá
você em breve.

[0] Voltar ao menu`
            );

        } else {

            twiml.message(
`[X] Opção inválida.

Digite uma opção válida.

[0] Voltar ao menu`
            );
        }

    } else if (etapa === "ajuda") {

        if (msg === "1") {

            usuarios[numero].etapa = "menu";

            twiml.message(
`[ DOAÇÃO TAMPINHAS ]

Aceitamos:

[✔] Refrigerante
[✔] Shampoo
[✔] Produtos de limpeza
[✔] Garrafas plásticas

[#] Entregue em um ponto
de coleta.

Obrigado por ajudar.

[0] Voltar ao menu`
            );

        } else if (msg === "2") {

            usuarios[numero].etapa = "menu";

            twiml.message(
`[ DOAÇÃO LACRES ]

Aceitamos lacres de:

[✔] Refrigerantes
[✔] Latas em geral

[#] Junte os lacres e entregue
em nossos pontos de coleta.

[0] Voltar ao menu`
            );

        } else if (msg === "3") {

            usuarios[numero].etapa = "menu";

            twiml.message(
`[ SEJA VOLUNTÁRIO ]

Você pode ajudar em:

[✔] Resgates
[✔] Divulgação
[✔] Organização
[✔] Transporte

[#] Nossa equipe entrará
em contato.

[0] Voltar ao menu`
            );

        } else {

            twiml.message(
`[X] Opção inválida.

[0] Voltar ao menu`
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