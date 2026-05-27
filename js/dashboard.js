// =========================
// DASHBOARD
// =========================

async function carregarDashboard() {

    const token = localStorage.getItem("token");

    try {

        const response = await fetch(`${API_URL}/api/dashboard`, {

            method: "GET",

            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }

        });

        const dados = await response.json();

        console.log(dados);

        document.getElementById("saldoTotal").innerText =
            (dados.totalGasto ?? 0).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });

        document.getElementById("gastoMes").innerText =
            (dados.gastoMensal ?? 0).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });

        document.getElementById("economiaMes").innerText =
            dados.pendentes ?? 0;


        // =========================
        // CATEGORIAS
        // =========================

        const listaCategorias =
            document.getElementById("listaCategorias");

        listaCategorias.innerHTML = "";

        if (
            dados.gastosPorCategoria &&
            dados.gastosPorCategoria.length > 0
        ) {

            const totalCategorias =
                dados.gastosPorCategoria.reduce(
                    (total, categoria) =>
                        total + categoria.total,
                    0
                );

            dados.gastosPorCategoria.forEach(categoria => {

                const porcentagem =
                    (categoria.total / totalCategorias) * 100;

                listaCategorias.innerHTML += `

                    <div class="categoria">

                        <div class="icone">
                            ${obterEmojiCategoria(categoria.categoria)}
                        </div>

                        <div class="conteudo">

                            <div class="infos">

                                <span>${categoria.categoria}</span>

                                <strong>
                                    ${categoria.total.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL"
                                    })}
                                </strong>

                            </div>

                            <div class="barra">

                                <div 
                                    class="progresso"
                                    style="width:${porcentagem}%"
                                ></div>

                            </div>

                        </div>

                    </div>

                `;
            });

        } else {

            listaCategorias.innerHTML = `
                <p>Nenhuma categoria encontrada.</p>
            `;
        }

    } catch (erro) {

        console.log(erro);

    }
}

carregarDashboard();



// =========================
// USUÁRIO
// =========================

const usuarioDashboard = JSON.parse(
    localStorage.getItem("usuario")
);

document.getElementById("nomeUsuario").innerText =
    usuarioDashboard.nome;

document.getElementById("emailUsuario").innerText =
    usuarioDashboard.email;



// =========================
// EMOJI CATEGORIA
// =========================

function obterEmojiCategoria(nome) {

    nome = nome.toLowerCase();

    if (nome.includes("stream")) return "📺";

    if (nome.includes("software")) return "💻";

    if (nome.includes("música")) return "🎵";

    if (nome.includes("jogo")) return "🎮";

    if (nome.includes("filme")) return "🎬";

    return "💳";
}



// =========================
// STATUS VENCIMENTO
// =========================

function obterStatusVencimento(dataVencimento) {

    const hoje = new Date().getDate();

    const diaVencimento = parseInt(
        dataVencimento.split("T")[0].split("-")[2]
    );

    let diasRestantes = diaVencimento - hoje;

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

    const limiteDias = 15;

    let porcentagem =
        ((limiteDias - diasRestantes) / limiteDias) * 100;

    if (porcentagem < 5) {
        porcentagem = 5;
    }

    if (porcentagem > 100) {
        porcentagem = 100;
    }

    return {
        cor,
        porcentagem,
        diasRestantes
    };
}



// =========================
// ASSINATURAS
// =========================

async function carregarAssinaturas() {

    const token = localStorage.getItem("token");

    try {

        const response = await fetch(
            `${API_URL}/api/assinatura/proximas`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const assinaturas = await response.json();

        console.log(assinaturas);

        const grid =
            document.getElementById("gridAssinaturas");

        grid.innerHTML = "";


        // =========================
        // ALERTA
        // =========================

        const tituloAlerta =
            document.getElementById("tituloAlerta");

        const infoAlerta =
            document.getElementById("infoAlerta");

        const linkAlerta =
            document.getElementById("linkAlerta");


        if (!assinaturas || assinaturas.length === 0) {

            grid.innerHTML = `
            
                <div class="sem-assinaturas">
                    <h3>Nenhuma assinatura próxima</h3>
                    <p>Você não possui vencimentos próximos.</p>
                </div>

            `;

            tituloAlerta.innerText =
                "Nenhum pagamento próximo";

            infoAlerta.innerText =
                "Você não possui vencimentos próximos";

            linkAlerta.style.display =
                "none";

            return;
        }


        // =========================
        // ORDENAÇÃO
        // =========================

        assinaturas.sort((a, b) => {

            const hoje = new Date().getDate();

            const diaA = parseInt(
                a.dataVencimento.split("T")[0].split("-")[2]
            );

            const diaB = parseInt(
                b.dataVencimento.split("T")[0].split("-")[2]
            );

            let diasA = diaA - hoje;
            let diasB = diaB - hoje;

            if (diasA < 0) diasA += 30;
            if (diasB < 0) diasB += 30;

            return diasA - diasB;
        });


        // =========================
        // ALERTA PRINCIPAL
        // =========================

        const proxima = assinaturas[0];

        const statusAlerta =
            obterStatusVencimento(
                proxima.dataVencimento
            );

        let textoTitulo = "";

        if (statusAlerta.diasRestantes === 0) {

            textoTitulo =
                "1 Pagamento vence hoje";

        } else if (statusAlerta.diasRestantes === 1) {

            textoTitulo =
                "1 Pagamento vence amanhã";

        } else {

            textoTitulo =
                `1 Pagamento vence em ${statusAlerta.diasRestantes} dias`;
        }

        tituloAlerta.innerText =
            textoTitulo;

        infoAlerta.innerText =
            `${proxima.nome} - ${
                (proxima.valor ?? 0).toLocaleString(
                    "pt-BR",
                    {
                        style: "currency",
                        currency: "BRL"
                    }
                )
            }`;

        linkAlerta.href =
            `visualizar_assinatura.html?id=${proxima.id}`;


        // =========================
        // CARDS
        // =========================

        assinaturas.forEach((assinatura, index) => {

            const status =
                obterStatusVencimento(
                    assinatura.dataVencimento
                );

            let textoStatus = "";

            if (status.diasRestantes === 0) {

                textoStatus = "Vence hoje";

            } else if (status.diasRestantes === 1) {

                textoStatus = "Vence amanhã";

            } else {

                textoStatus =
                    `${status.diasRestantes} dias restantes`;
            }

            grid.innerHTML += `

                <div 
                    class="card"
                    style="animation-delay:${index * 0.2}s"
                >

                    <div class="card-topo">

                        <div class="logo">
                            ${assinatura.nome.charAt(0)}
                        </div>

                        <div>
                            <h3>${assinatura.nome}</h3>

                            <small>
                                ${assinatura.categoria?.nome ?? ""}
                            </small>
                        </div>

                    </div>

                    <span 
                        class="status"
                        style="color:${status.cor}"
                    >
                        ${textoStatus}
                    </span>

                    <h1>
                        ${(assinatura.valor ?? 0).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                        })}
                    </h1>

                    <div class="barra">

                        <div 
                            class="progresso"
                            style="
                                width:${status.porcentagem}%;
                                background:${status.cor};
                            "
                        ></div>

                    </div>

                    <button 
                        class="btn-card"
                        onclick="window.location.href='visualizar_assinatura.html?id=${assinatura.id}'"
                    >
                        Ver detalhes
                    </button>

                </div>

            `;
        });

    } catch (erro) {

        console.log(erro);

    }
}

carregarAssinaturas();