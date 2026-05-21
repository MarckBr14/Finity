

const form =
    document.getElementById("form");

const lista =
    document.getElementById("listaDepartamentos");



// =========================
// LISTAR
// =========================

async function carregarDepartamentos() {

    try {

        const response = await fetch(
            `https://${API_URL}/api/departamento`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const departamentos =
            await response.json();

        console.log(departamentos);

        lista.innerHTML = "";

        if (departamentos.length === 0) {

            lista.innerHTML = `
            
                <tr>
                    <td colspan="3">
                        Nenhum departamento encontrado
                    </td>
                </tr>

            `;

            return;
        }

        departamentos.forEach(departamento => {

            lista.innerHTML += `

                <tr>

                    <td>
                        ${departamento.nome}
                    </td>

                    <td>
                        ${departamento.descricao}
                    </td>

                    <td>

                        <button
                            onclick="editarDepartamento(${departamento.id})"
                        >
                            Editar
                        </button>

                    </td>

                </tr>

            `;
        });

    } catch (erro) {

        console.log(erro);

    }
}

carregarDepartamentos();



// =========================
// CADASTRAR
// =========================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const nome =
        document.getElementById("nomeDepartamento").value;

    const descricao =
        document.getElementById("descricaoDepartamento").value;

    try {

        const response = await fetch(
            `https://${API_URL}/api/departamento`,
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

        if (response.ok) {

            fecharModal();

            mostrarSucesso();

            form.reset();

            carregarDepartamentos();

        } else {

            const erro = await response.json();

            alert(erro.mensagem);

        }

    } catch (erro) {

        console.log(erro);

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
// EDITAR
// =========================

function editarDepartamento(id) {

    alert("Editar departamento " + id);
}