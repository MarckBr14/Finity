

const lista =
    document.getElementById("listaCategorias");

const form =
    document.getElementById("form");

let categoriaEditandoId = null;



// =========================
// EMOJIS AUTOMÁTICOS
// =========================

function obterEmojiCategoria(nome) {

    nome = nome.toLowerCase();

    if (nome.includes("game")) return "🎮";

    if (nome.includes("música")) return "🎵";

    if (nome.includes("software")) return "💻";

    if (nome.includes("stream")) return "📺";

    if (nome.includes("filme")) return "🎬";

    return "💳";
}



// =========================
// LISTAR
// =========================

async function carregarCategorias() {

    try {

        const response = await fetch(
            `${API_URL}/api/categoria`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const categorias =
            await response.json();

        console.log(categorias);

        lista.innerHTML = "";

        if (!categorias || categorias.length === 0) {

            lista.innerHTML = `
            
                <div class="sem-categoria">
                    <h3>Nenhuma categoria encontrada</h3>
                </div>

            `;

            return;
        }

        categorias.forEach(categoria => {

            lista.innerHTML += `

                <div class="card"
                >

                    <h1>
                        ${obterEmojiCategoria(categoria.nome)}
                    </h1>

                    <h3>
                        ${categoria.nome}
                    </h3>

                    <p>
                        ${categoria.descricao ?? "Sem descrição"}
                    </p>

                    <button
                        class="btn-editar"
                        onclick="editarCategoria(
                            ${categoria.id},
                            '${categoria.nome}',
                            \`${categoria.descricao ?? ""}\`
                        )"
                    >
                        Editar
                    </button>

                </div>

            `;
        });

    } catch (erro) {

        console.log(erro);

    }
}

carregarCategorias();



// =========================
// CRIAR / EDITAR
// =========================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const nome =
        document.getElementById("nomeCategoria").value;

    const descricao =
        document.getElementById("descricaoCategoria").value;

    try {

        let response;

        // =========================
        // EDITAR
        // =========================

        if (categoriaEditandoId) {

            response = await fetch(
                `${API_URL}/api/categoria/${categoriaEditandoId}`,
                {
                    method: "PUT",

                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        nome,
                        descricao
                    })
                }
            );

        } else {

            // =========================
            // CRIAR
            // =========================

            response = await fetch(
                `${API_URL}/api/categoria`,
                {
                    method: "POST",

                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        nome,
                        descricao
                    })
                }
            );
        }

        if (response.ok) {

            fecharModal();

            mostrarSucesso();

            carregarCategorias();

        } else {

            const erro = await response.json();

            alert(erro.mensagem);

        }

    } catch (erro) {

        console.log(erro);

    }
});



// =========================
// EDITAR
// =========================

function editarCategoria(id, nome, descricao) {

    categoriaEditandoId = id;

    document.getElementById("nomeCategoria").value =
        nome;

    document.getElementById("descricaoCategoria").value =
        descricao;

    document.querySelector(".modal h2").innerText =
        "Editar Categoria";

    document.getElementById("btnSalvarCategoria").innerText =
        "Salvar Alterações";

    abrirModal();
}



// =========================
// MODAL
// =========================

function abrirModal() {

    document
        .getElementById("modal")
        .classList.add("active");
}

function fecharModal() {

    document
        .getElementById("modal")
        .classList.remove("active");

    categoriaEditandoId = null;

    form.reset();

    document.querySelector(".modal h2").innerText =
        "Nova Categoria";

    document.getElementById("btnSalvarCategoria").innerText =
        "Adicionar";
}



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