// =========================
// LOGOUT
// =========================

function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("usuario");

    window.location.href = "login.html";
}



// =========================
// PROGRESSO MÊS
// =========================

function atualizarProgressoMes() {

    const hoje = new Date();

    const ano = hoje.getFullYear();

    const mes = hoje.getMonth();

    const ultimoDia =
        new Date(ano, mes + 1, 0).getDate();

    const diaAtual =
        hoje.getDate();

    const diasRestantes =
        ultimoDia - diaAtual;

    const porcentagem =
        (diaAtual / ultimoDia) * 100;

    const texto =
        `${diasRestantes} dias (${Math.round(porcentagem)}%)`;

    const textoMes =
        document.getElementById("textoMes");

    const barraMes =
        document.getElementById("barraMes");

    if (textoMes) {

        textoMes.innerText = texto;

    }

    if (barraMes) {

        let cor = "#22c55e";

        if (diasRestantes <= 7) {

            cor = "#ef4444";

        } else if (diasRestantes <= 15) {

            cor = "#f97316";

        }

        barraMes.style.background = cor;

        barraMes.style.width =
            `${porcentagem}%`;
    }
}

atualizarProgressoMes();



// =========================
// USUÁRIO LOGADO
// =========================

const usuario = JSON.parse(
    localStorage.getItem("usuario")
);

if (usuario) {

    const nomeUsuario =
        document.getElementById("nomeUsuario");

    const emailUsuario =
        document.getElementById("emailUsuario");

    if (nomeUsuario) {

        nomeUsuario.innerText =
            usuario.nome ?? "Usuário";

    }

    if (emailUsuario) {

        emailUsuario.innerText =
            usuario.email ?? "";

    }



    // =========================
    // CONTROLE MENU ADMIN
    // =========================

    const menuUsuarios =
        document.getElementById("menuUsuarios");

    if (
        usuario.nivelAcesso?.toLowerCase() !== "admin"
    ) {

        if (menuUsuarios) {

            menuUsuarios.style.display = "none";

        }
    }
}