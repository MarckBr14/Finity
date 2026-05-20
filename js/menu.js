function logout() {

    localStorage.removeItem("token");

    window.location.href = "login.html";
}

function atualizarProgressoMes() {

    const hoje = new Date();

    const ano = hoje.getFullYear();

    const mes = hoje.getMonth();

    const ultimoDia = new Date(ano, mes + 1, 0).getDate();

    const diaAtual = hoje.getDate();

    const diasRestantes = ultimoDia - diaAtual;

    const porcentagem =
        (diaAtual / ultimoDia) * 100;

    const texto =
        `${diasRestantes} dias (${Math.round(porcentagem)}%)`;

    document.getElementById("textoMes").innerText =
        texto;

    // cor dinâmica
    let cor = "#22c55e";

    if (diasRestantes <= 7) {

        cor = "#ef4444";

    } else if (diasRestantes <= 15) {

        cor = "#f97316";

    }

    document.getElementById("barraMes").style.background =
        cor;

    document.getElementById("barraMes").style.width =
        `${porcentagem}%`;
}

atualizarProgressoMes();



// USUÁRIO LOGADO

const usuario = JSON.parse(
    localStorage.getItem("usuario")
);

document.getElementById("nomeUsuario").innerText =
    usuario.nome;

document.getElementById("emailUsuario").innerText =
    usuario.email;


// CONTROLE MENU ADMIN

const menuUsuarios =
    document.getElementById("menuUsuarios");

if (
    usuario.nivelAcesso.toLowerCase() !== "admin"
) {

    menuUsuarios.style.display = "none";

}