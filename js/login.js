const btnLogin = document.getElementById("btnLogin");

btnLogin.addEventListener("click", async (event) => {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {

        const response = await fetch(`${API_URL}/auth/login`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                senha: senha
            })

        });

        const dados = await response.json();

        console.log(dados);

        if(response.ok){

            localStorage.setItem("token", dados.token);
            localStorage.setItem("usuario", JSON.stringify(dados.usuario));

            window.location.href = "../html/dashboard.html";

        } else {

            alert(dados.mensagem);

        }

    } catch (erro){

        console.log(erro);

        alert("Erro ao conectar API");

    }

});