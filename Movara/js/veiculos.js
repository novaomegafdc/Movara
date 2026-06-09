let veiculos =
    JSON.parse(localStorage.getItem("veiculos")) || [];

const lista =
    document.getElementById("listaVeiculos");

const formulario =
    document.getElementById("formVeiculo");

const pesquisa =
    document.getElementById("pesquisa");

const modal =
    document.getElementById("modalExcluir");

const textoModal =
    document.getElementById("textoModal");

const btnCancelar =
    document.getElementById("btnCancelar");

const btnConfirmar =
    document.getElementById("btnConfirmar");

let indiceParaExcluir = null;

function salvarDados() {
    localStorage.setItem(
        "veiculos",
        JSON.stringify(veiculos)
    );
}

function renderizarVeiculos(filtro = "") {

    lista.innerHTML = "";

    const veiculosFiltrados =
        veiculos.filter((veiculo) =>
            veiculo.placa
                .toLowerCase()
                .includes(filtro.toLowerCase())
        );

    if (veiculosFiltrados.length === 0) {

        lista.innerHTML =
            "<p>Nenhum veículo encontrado.</p>";

        return;
    }

    veiculosFiltrados.forEach((veiculo) => {

        const indice =
            veiculos.indexOf(veiculo);

        lista.innerHTML += `
            <div class="veiculo" data-indice="${indice}">

                <p>
                    <span class="titulo-placa">
                        Placa:
                    </span>

                    <span class="valor-placa">
                        ${veiculo.placa}
                    </span>
                </p>

                <p>
                    <span class="titulo-info">
                        Modelo:
                    </span>

                    <span class="valor-info">
                        ${veiculo.modelo}
                    </span>
                </p>

                <p>
                    <span class="titulo-info">
                        Cor:
                    </span>

                    <span class="valor-info">
                        ${veiculo.cor}
                    </span>
                </p>

                <div class="acoes">

                    <button
                        class="btn-editar"
                        onclick="editarVeiculo(${indice})">

                        Editar

                    </button>

                    <button
                        class="btn-excluir"
                        onclick="excluirVeiculo(${indice})">

                        Excluir

                    </button>

                </div>

            </div>
        `;
    });
}

formulario.addEventListener(
    "submit",
    function(event){

        event.preventDefault();

        const placa =
            document
                .getElementById("placa")
                .value
                .trim();

        const modelo =
            document
                .getElementById("modelo")
                .value
                .trim();

        const cor =
            document
                .getElementById("cor")
                .value
                .trim();

        veiculos.push({
            placa,
            modelo,
            cor
        });

        salvarDados();

        renderizarVeiculos(
            pesquisa.value
        );

        formulario.reset();
    }
);

pesquisa.addEventListener(
    "input",
    () => {
        renderizarVeiculos(
            pesquisa.value
        );
    }
);

window.excluirVeiculo = function(indice){

    indiceParaExcluir = indice;

    textoModal.textContent =
        `Deseja excluir o veículo ${veiculos[indice].placa}?`;

    modal.classList.add("ativo");
};

btnCancelar.addEventListener(
    "click",
    () => {

        modal.classList.remove("ativo");

        indiceParaExcluir = null;
    }
);

btnConfirmar.addEventListener(
    "click",
    () => {

        if(indiceParaExcluir !== null){

            veiculos.splice(
                indiceParaExcluir,
                1
            );

            salvarDados();

            renderizarVeiculos(
                pesquisa.value
            );
        }

        modal.classList.remove("ativo");

        indiceParaExcluir = null;
    }
);

window.editarVeiculo = function(indice){

    const veiculo =
        veiculos[indice];

    const card =
        document.querySelector(
            `.veiculo[data-indice="${indice}"]`
        );

    if(!card) return;

    card.innerHTML = `

        <label>Placa</label>

        <input
            class="input-edicao"
            id="placaEdit${indice}"
            value="${veiculo.placa}">

        <label>Modelo</label>

        <input
            class="input-edicao"
            id="modeloEdit${indice}"
            value="${veiculo.modelo}">

        <label>Cor</label>

        <input
            class="input-edicao"
            id="corEdit${indice}"
            value="${veiculo.cor}">

        <div class="acoes">

            <button
                class="btn-salvar"
                onclick="salvarEdicao(${indice})">

                Salvar

            </button>

            <button
                class="btn-cancelar"
                onclick="renderizarVeiculos(pesquisa.value)">

                Cancelar

            </button>

        </div>

    `;
};

window.salvarEdicao = function(indice){

    const placa =
        document
            .getElementById(
                `placaEdit${indice}`
            )
            .value
            .trim();

    const modelo =
        document
            .getElementById(
                `modeloEdit${indice}`
            )
            .value
            .trim();

    const cor =
        document
            .getElementById(
                `corEdit${indice}`
            )
            .value
            .trim();

    if(
        !placa ||
        !modelo ||
        !cor
    ){
        alert(
            "Preencha todos os campos."
        );
        return;
    }

    veiculos[indice] = {
        placa,
        modelo,
        cor
    };

    salvarDados();

    renderizarVeiculos(
        pesquisa.value
    );
};

renderizarVeiculos();