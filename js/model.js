const modal = document.getElementById("modal");
const form = document.getElementById("form");
const modalCategoria = document.getElementById("modal");
const successModal = document.getElementById("successModal");

function abrirModal() {
    modal.classList.add("active");
}

function fecharModal() {
    modal.classList.remove("active");
}

// fechar clicando fora
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        fecharModal();
    }
});

form.addEventListener("submit", function (e) {
    e.preventDefault();
    // fecha modal do formulário
    modalCategoria.classList.remove("active");
    // abre modal sucesso
    successModal.classList.add("active");
    // espera 1 segundo
    setTimeout(() => {
        // fecha modal sucesso
        successModal.classList.remove("active");
    }, 1000);
});
