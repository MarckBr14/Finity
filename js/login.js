const btnLogin = document.getElementById("btnLogin");

btnLogin.addEventListener("click", async (event) => {

    event.preventDefault();

    const textoOriginal = btnLogin.innerText;

    btnLogin.disabled = true;
    btnLogin.innerText = "Entrando...";

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {

        const response = await fetch(`${API_URL}/api/auth/login`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                senha
            })

        });

        const dados = await response.json();

        console.log(dados);

        if (response.ok) {

            localStorage.setItem("token", dados.token);

            localStorage.setItem(
                "usuario",
                JSON.stringify(dados.usuario)
            );

            btnLogin.innerText = "Sucesso!";

            setTimeout(() => {

                window.location.href =
                    "../html/dashboard.html";

            }, 800);

        } else {

            alert(dados.mensagem || "Email ou senha inválidos");

            btnLogin.disabled = false;
            btnLogin.innerText = textoOriginal;

        }

    } catch (erro) {

        console.log(erro);

        alert("Erro ao conectar com a API");

        btnLogin.disabled = false;
        btnLogin.innerText = textoOriginal;

    }

});