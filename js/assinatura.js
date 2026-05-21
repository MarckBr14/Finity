

const grid =
    document.getElementById("gridAssinaturas");

const busca =
    document.getElementById("buscarAssinatura");

const formPagamento =
    document.getElementById("formPagamento");

let assinaturasOriginais = [];

let pagamentos = [];

let assinaturaSelecionadaId = null;



// =========================
// STATUS
// =========================

function obterStatus(dataVencimento) {

    const hoje = new Date().getDate();

    const dia =
        new Date(dataVencimento).getDate();

    let diasRestantes =
        dia - hoje;

    if (diasRestantes < 0) {

        diasRestantes += 30;
    }

    let cor = "#22c55e";

    if (diasRestantes <= 3) {

        cor = "#ef4444";

    } else if (diasRestantes <= 7) {

        cor = "#f97316";

    } else if (diasRestantes <= 15) {

        cor = "#eab308";
    }

    let porcentagem =
        ((15 - diasRestantes) / 15) * 100;

    if (porcentagem < 5) {

        porcentagem = 5;
    }

    if (porcentagem > 100) {

        porcentagem = 100;
    }

    return {
        diasRestantes,
        cor,
        porcentagem
    };
}



// =========================
// CARREGAR
// =========================

async function carregarAssinaturas() {

    try {

        // =========================
        // ASSINATURAS
        // =========================

        const responseAssinaturas = await fetch(
            `${API_URL}/api/assinatura`,
            {
                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );

        const assinaturas =
            await responseAssinaturas.json();

        console.log("Assinaturas:", assinaturas);


        // =========================
        // PAGAMENTOS
        // =========================

        const responsePagamentos = await fetch(
            `${API_URL}/api/pagamento`,
            {
                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );

        pagamentos =
            await responsePagamentos.json();

        console.log("Pagamentos:", pagamentos);


        // =========================
        // JUNTA PAGAMENTOS
        // =========================

        assinaturas.forEach(assinatura => {

            assinatura.pagamentos =
                pagamentos.filter(p =>

                    p.idAssinatura === assinatura.id
                );
        });

        assinaturasOriginais = assinaturas;

        atualizarCardsTopo(assinaturas);

        renderizarAssinaturas(assinaturas);

    } catch (erro) {

        console.log(erro);

    }
}

carregarAssinaturas();



// =========================
// TOPO
// =========================

function atualizarCardsTopo(assinaturas) {

    document.getElementById(
        "totalAssinaturas"
    ).innerText =
        assinaturas.length;

    document.getElementById(
        "assinaturasAtivas"
    ).innerText =
        assinaturas.filter(a =>
            a.status === 0
        ).length;

    document.getElementById(
        "assinaturasPendentes"
    ).innerText =
        assinaturas.filter(a =>
            a.status === 1
        ).length;
}



// =========================
// RENDER
// =========================

function renderizarAssinaturas(lista) {

    grid.innerHTML = "";

    if (lista.length === 0) {

        grid.innerHTML = `

            <div class="sem-assinaturas">
                <h3>Nenhuma assinatura encontrada</h3>
            </div>

        `;

        return;
    }

    lista.forEach((assinatura, index) => {

        // =========================
        // VERIFICA PAGAMENTO
        // =========================

        const estaPago =
            pagamentos.some(p =>

                p.idAssinatura === assinatura.id

                &&

                p.status?.toString().toLowerCase() !== "pendente"
            );

        const status =
            obterStatus(
                assinatura.dataVencimento
            );

        let texto = "";

        if (status.diasRestantes === 0) {

            texto = "Vence hoje";

        } else if (status.diasRestantes === 1) {

            texto = "Vence amanhã";

        } else {

            texto =
                `${status.diasRestantes} dias restantes`;
        }

        grid.innerHTML += `

            <div
                class="assinatura-card ${estaPago ? "card-pago" : ""}"
                style="animation-delay:${index * 0.1}s"
            >

                <div class="card-header">

                    <div
                        class="netflix-logo"
                        style="
                            background:${estaPago ? "#22c55e" : status.cor}
                        "
                    >
                        ${
                            estaPago
                            ? "✓"
                            : assinatura.nome.charAt(0)
                        }
                    </div>

                    <h3>
                        ${assinatura.nome}
                    </h3>

                </div>

                <p
                    class="vencimento"
                    style="
                        color:${estaPago ? "#22c55e" : status.cor}
                    "
                >
                    ${
                        estaPago
                        ? "Pagamento realizado"
                        : texto
                    }
                </p>

                <h2>
                    ${(assinatura.valor ?? 0)
                        .toLocaleString(
                            "pt-BR",
                            {
                                style: "currency",
                                currency: "BRL"
                            }
                        )
                    }
                </h2>

                <div class="barra">

                    <div
                        class="barra-fill"
                        style="
                            width:${estaPago ? "100%" : status.porcentagem + "%"};
                            background:${estaPago ? "#22c55e" : status.cor};
                        "
                    ></div>

                </div>

                <div class="buttons-card">

                    <button>
                        Detalhes
                    </button>

                    ${
                        estaPago
                        ?
                        `
                            <button class="btn-pago">
                                Pago
                            </button>
                        `
                        :
                        `
                            <button
                                class="pagar"
                                onclick="abrirModal(${assinatura.id})"
                            >
                                Pagar
                            </button>
                        `
                    }

                </div>

            </div>

        `;
    });
}



// =========================
// BUSCA
// =========================

busca.addEventListener("input", () => {

    const valor =
        busca.value.toLowerCase();

    const filtradas =
        assinaturasOriginais.filter(a =>

            a.nome
                .toLowerCase()
                .includes(valor)
        );

    renderizarAssinaturas(filtradas);

});



// =========================
// MODAL
// =========================

function abrirModal(idAssinatura) {

    assinaturaSelecionadaId =
        idAssinatura;

    document
        .getElementById("modal")
        .classList.add("active");
}

function fecharModal() {

    document
        .getElementById("modal")
        .classList.remove("active");

    formPagamento.reset();

    assinaturaSelecionadaId = null;
}



// =========================
// FECHAR CLICANDO FORA
// =========================

window.addEventListener("click", (e) => {

    const modal =
        document.getElementById("modal");

    if (e.target === modal) {

        fecharModal();

    }
});



// =========================
// SUCESSO
// =========================

function mostrarSucesso() {

    const modal =
        document.getElementById("successModal");

    modal.classList.add("active");

    setTimeout(() => {

        modal.classList.remove("active");

    }, 2000);
}



// =========================
// CRIAR + PAGAR
// =========================

formPagamento.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const body = {

            idAssinatura:
                assinaturaSelecionadaId,

            observacao:
                document.getElementById("descricaoPagamento").value,

            mesReferencia:
                parseInt(
                    document.getElementById("mesPagamento").value
                ),

            anoReferencia:
                parseInt(
                    document.getElementById("anoPagamento").value
                )
        };

        console.log(body);

        try {

            // =====================
            // CRIAR PAGAMENTO
            // =====================

            const response = await fetch(
                `${API_URL}/api/pagamento`,
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(body)
                }
            );

            const data =
                await response.json();

            console.log(data);

            if (!response.ok) {

                alert(
                    data.mensagem ??
                    "Erro ao criar pagamento"
                );

                return;
            }

            // =====================
            // PAGAR
            // =====================

            const pagarResponse = await fetch(
                `${API_URL}/api/pagamento/${data.id}/pagar`,
                {
                    method: "PUT",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

            const pagarData =
                await pagarResponse.json();

            console.log(pagarData);

            if (pagarResponse.ok) {

                fecharModal();

                mostrarSucesso();

                carregarAssinaturas();

            } else {

                alert(
                    pagarData.mensagem ??
                    "Erro ao pagar assinatura"
                );
            }

        } catch (erro) {

            console.log(erro);

            alert("Erro ao conectar API");
        }
    }
);