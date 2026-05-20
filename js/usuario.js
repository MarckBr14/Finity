

const listaUsuarios =
    document.getElementById("listaUsuarios");

const form =
    document.getElementById("form");

let usuariosCache = [];

let usuarioEditandoId = null;



// =========================
// LISTAR USUÁRIOS
// =========================

async function carregarUsuarios() {

    try {

        const response = await fetch(
            "https://localhost:7022/api/usuario",
            {
                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );

        const usuarios =
            await response.json();

        usuariosCache = usuarios;

        renderizarUsuarios(usuarios);

        atualizarCards(usuarios);

    } catch (erro) {

        console.log(erro);

    }
}

carregarUsuarios();



// =========================
// RENDERIZAR
// =========================

function renderizarUsuarios(usuarios) {

    listaUsuarios.innerHTML = "";

    if (!usuarios || usuarios.length === 0) {

        listaUsuarios.innerHTML = `
        
            <div class="sem-usuarios">
                Nenhum usuário encontrado
            </div>

        `;

        return;
    }

    usuarios.forEach(usuario => {

        listaUsuarios.innerHTML += `

            <div class="table-row">

                <div class="user-info">

                    <img
                        src="https://i.pravatar.cc/40?u=${usuario.email}"
                    >

                    <h4>
                        ${usuario.nome}
                    </h4>

                </div>

                <p>
                    ${usuario.email}
                </p>

                <div class="status">

                    <div class="dot"></div>

                    <span>
                        ${usuario.statusUsuario ?? "Ativo"}
                    </span>

                </div>

                <p>
                    ${usuario.cargo ?? "-"}
                </p>

                <button
                    class="edit-btn"
                    onclick="editarUsuario(${usuario.id})"
                >
                    Editar
                </button>

            </div>

        `;
    });
}



// =========================
// CARDS TOPO
// =========================

function atualizarCards(usuarios) {

    document.getElementById(
        "totalUsuarios"
    ).innerText = usuarios.length;

    const ativos =
        usuarios.filter(u =>
            u.statusUsuario === "Ativo"
        );

    document.getElementById(
        "usuariosAtivos"
    ).innerText = ativos.length;

    const hoje = new Date().getMonth();

    const novos = usuarios.filter(u => {

        if (!u.dataCadastro)
            return false;

        return (
            new Date(u.dataCadastro)
                .getMonth() === hoje
        );
    });

    document.getElementById(
        "usuariosMes"
    ).innerText = novos.length;
}



// =========================
// PESQUISA
// =========================

document.getElementById(
    "pesquisaUsuario"
).addEventListener("input", (e) => {

    const valor =
        e.target.value.toLowerCase();

    const filtrados =
        usuariosCache.filter(usuario => {

            return (

                usuario.nome
                    .toLowerCase()
                    .includes(valor)

                ||

                usuario.email
                    .toLowerCase()
                    .includes(valor)

            );
        });

    renderizarUsuarios(filtrados);
});



// =========================
// EDITAR
// =========================

function editarUsuario(id) {

    const usuario =
        usuariosCache.find(u => u.id === id);

    if (!usuario) return;

    usuarioEditandoId = id;

    document.getElementById("nome").value =
        usuario.nome ?? "";

    document.getElementById("email").value =
        usuario.email ?? "";

    document.getElementById("cargo").value =
        usuario.cargo ?? "";

    document.getElementById("nivelAcesso").value =
        usuario.nivelAcesso ?? "User";

    document.getElementById("senha").value = "";

    document.getElementById("matricula").value =
        usuario.matricula ?? "";

    document.getElementById("statusUsuario").value =
        usuario.statusUsuario ?? "Ativo";

    document.getElementById("departamento").value =
        usuario.idDepartamento ?? "";

    document.getElementById("tituloModal").innerText =
        "Editar Usuário";

    document.getElementById("btnSalvar").innerText =
        "Salvar Alterações";

    abrirModal();
}



// =========================
// NOVO USUÁRIO
// =========================

function novoUsuario() {

    usuarioEditandoId = null;

    form.reset();

    document.getElementById("tituloModal").innerText =
        "Novo Usuário";

    document.getElementById("btnSalvar").innerText =
        "Adicionar";

    abrirModal();
}



// =========================
// VALIDAR SENHA
// =========================

function validarSenha(senha) {

    const temNumero =
        /\d/.test(senha);

    const temMaiuscula =
        /[A-Z]/.test(senha);

    const temEspecial =
        /[!@#$%^&*(),.?":{}|<>]/.test(senha);

    if (senha.length < 6) {

        alert(
            "A senha deve ter pelo menos 6 caracteres"
        );

        return false;
    }

    if (!temNumero) {

        alert(
            "A senha deve conter pelo menos 1 número"
        );

        return false;
    }

    if (!temMaiuscula) {

        alert(
            "A senha deve conter pelo menos 1 letra maiúscula"
        );

        return false;
    }

    if (!temEspecial) {

        alert(
            "A senha deve conter pelo menos 1 caractere especial"
        );

        return false;
    }

    return true;
}



// =========================
// CADASTRAR / EDITAR
// =========================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const senha =
        document.getElementById("senha").value;

    // valida senha somente se preencher
    if (senha && !validarSenha(senha)) {
        return;
    }

    const body = {

        nome:
            document.getElementById("nome").value,

        email:
            document.getElementById("email").value,

        senha: senha,

        cargo:
            document.getElementById("cargo").value,

        nivelAcesso:
            document.getElementById("nivelAcesso").value,

        idDepartamento:
            parseInt(
                document.getElementById("departamento").value
            ),

        statusUsuario:
            document.getElementById("statusUsuario").value,

        matricula:
            document.getElementById("matricula").value
    };

    try {

        let response;

        // =====================
        // EDITAR
        // =====================

        if (usuarioEditandoId !== null) {

            response = await fetch(
                `https://localhost:7022/api/usuario/atualizar/${usuarioEditandoId}`,
                {
                    method: "PUT",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(body)
                }
            );

        } else {

            // =====================
            // CRIAR
            // =====================

            response = await fetch(
                "https://localhost:7022/api/usuario/register",
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
        }

        if (response.ok) {

            fecharModal();

            mostrarSucesso();

            form.reset();

            usuarioEditandoId = null;

            carregarUsuarios();

        } else {

            const erro =
                await response.json();

            alert(
                erro.mensagem ??
                "Erro ao salvar usuário"
            );

        }

    } catch (erro) {

        console.log(erro);

        alert("Erro ao conectar API");

    }
});



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
}

window.addEventListener("click", (e) => {

    const modal =
        document.getElementById("modal");

    if(e.target === modal){

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
// DEPARTAMENTOS
// =========================

async function carregarDepartamentos() {

    try {

        const response = await fetch(
            "https://localhost:7022/api/departamento",
            {
                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );

        const departamentos =
            await response.json();

        const select =
            document.getElementById("departamento");

        select.innerHTML = `
        
            <option value="">
                Selecione um departamento
            </option>

        `;

        departamentos.forEach(dep => {

            select.innerHTML += `

                <option value="${dep.id}">
                    ${dep.nome}
                </option>

            `;
        });

    } catch (erro) {

        console.log(erro);

    }
}

carregarDepartamentos();

function validarSenhaVisual(){

    const senha =
        document.getElementById("senha").value;

    const tamanho =
        senha.length >= 6;

    const maiuscula =
        /[A-Z]/.test(senha);

    const numero =
        /\d/.test(senha);

    const especial =
        /[!@#$%^&*(),.?":{}|<>]/.test(senha);

    atualizarRequisito(
        "req-tamanho",
        tamanho
    );

    atualizarRequisito(
        "req-maiuscula",
        maiuscula
    );

    atualizarRequisito(
        "req-numero",
        numero
    );

    atualizarRequisito(
        "req-especial",
        especial
    );
}

function atualizarRequisito(id, valido){

    const elemento =
        document.getElementById(id);

    if(valido){

        elemento.classList.add("valido");

        elemento.innerHTML =
            elemento.innerHTML.replace("❌", "✅");

    } else {

        elemento.classList.remove("valido");

        elemento.innerHTML =
            elemento.innerHTML.replace("✅", "❌");
    }
}

function mostrarRequisitosSenha(){

    document
        .querySelector(".senha-requisitos")
        .classList.add("active");
}

function esconderRequisitosSenha(){

    const senha =
        document.getElementById("senha").value;

    // só esconde se estiver vazio
    if(!senha){

        document
            .querySelector(".senha-requisitos")
            .classList.remove("active");
    }
}