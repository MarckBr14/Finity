let currentStep = 0;



const pages = document.querySelectorAll('.page');

const steps = document.querySelectorAll('.step');

const progressBar =
    document.getElementById('progressBar');

let categoriaSelecionadaId = null;



// =========================
// STEPS
// =========================

function updateSteps() {

    pages.forEach((page, index) => {

        page.classList.remove('active');

        if (index === currentStep) {

            page.classList.add('active');

        }
    });

    steps.forEach((step, index) => {

        if (index <= currentStep) {

            step.classList.add('active');

        } else {

            step.classList.remove('active');

        }
    });

    progressBar.style.width =
        `${currentStep * 50}%`;

    // controla botão voltar
    document.querySelectorAll(".btn-back")
        .forEach(btn => {

            btn.disabled = currentStep === 0;

        });
}



// =========================
// AVANÇAR
// =========================

async function nextStep(){

    // passo 1 -> 2
    if(currentStep === 0){

        const nome =
            document.getElementById("nome").value;

        const valor =
            document.getElementById("valor").value;

        if(!nome || !valor){

            alert("Preencha os campos obrigatórios");

            return;
        }
    }

    // passo 2 -> salvar
    if(currentStep === 1){

        await salvarAssinatura();

        return;
    }

    if(currentStep < pages.length - 1){

        currentStep++;

        updateSteps();
    }
}



// =========================
// VOLTAR
// =========================

function prevStep(){

    if(currentStep > 0){

        currentStep--;

        updateSteps();
    }
}



// =========================
// LISTAR CATEGORIAS
// =========================

async function carregarCategorias(){

    try{

        const response = await fetch(
            `${API_URL}/api/categoria`,
            {
                headers:{
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );

        const categorias =
            await response.json();

        const lista =
            document.getElementById("listaCategorias");

        lista.innerHTML = "";

        categorias.forEach(categoria => {

            lista.innerHTML += `

                <div
                    class="option"
                    onclick="selectCategory(this, ${categoria.id})"
                >
                    ${obterEmoji(categoria.nome)}
                    ${categoria.nome}
                </div>

            `;
        });

    } catch(erro){

        console.log(erro);

    }
}

carregarCategorias();



// =========================
// SELECIONAR CATEGORIA
// =========================

function selectCategory(element, id){

    document
        .querySelectorAll('.option')
        .forEach(option => {

            option.classList.remove('selected');

        });

    element.classList.add('selected');

    categoriaSelecionadaId = id;
}



// =========================
// SALVAR
// =========================

async function salvarAssinatura(){

    try{

        const body = {

            nome:
                document.getElementById("nome").value,

            valor:
                parseFloat(
                    document.getElementById("valor").value
                ),

            dataVencimento:
                document.getElementById("dataVencimento").value,

            status:
                document.getElementById("status").value,

            descricao:
                document.getElementById("descricao").value,

            categoriaId:
                categoriaSelecionadaId
        };

        console.log(body);

        const response = await fetch(
            `${API_URL}/api/assinatura/criar`,
            {
                method:"POST",

                headers:{
                    "Authorization":
                        `Bearer ${token}`,

                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify(body)
            }
        );

        if(response.ok){

            currentStep++;

            updateSteps();

            // espera 2 segundos
            setTimeout(() => {

                window.location.href =
                    "assinaturas.html";

            }, 2000);

        } else {

            const erro =
                await response.json();

            alert(erro.mensagem);

        }

    } catch(erro){

        console.log(erro);

    }
}



// =========================
// EMOJIS
// =========================

function obterEmoji(nome){

    nome = nome.toLowerCase();

    if(nome.includes("game")) return "🎮";

    if(nome.includes("música")) return "🎵";

    if(nome.includes("software")) return "💻";

    if(nome.includes("stream")) return "📺";

    return "💳";
}

