const veiculos =
    JSON.parse(localStorage.getItem("veiculos")) || [];

const movimentacoes =
    JSON.parse(localStorage.getItem("movimentacoes")) || [];

const select =
    document.getElementById("veiculoSelect");

const btnEntrada =
    document.getElementById("btnEntrada");

const btnSaida =
    document.getElementById("btnSaida");

const historico =
    document.getElementById("historico");

veiculos.forEach(v => {
    select.innerHTML += `
        <option value="${v.placa}">
            ${v.placa} - ${v.modelo}
        </option>
    `;
});

function salvar() {
    localStorage.setItem("movimentacoes", JSON.stringify(movimentacoes));
}

function getUltimoStatus(placa) {
    for (let i = movimentacoes.length - 1; i >= 0; i--) {
        if (movimentacoes[i].placa === placa) {
            return movimentacoes[i].tipo;
        }
    }
    return null;
}



let toastTimeout;

function toast(message, type = "success") {

    if (!message || message.trim() === "") return;

    const container = document.getElementById("toast-container");

    if (!container) return;

    const el = document.createElement("div");

    el.className = `toast ${type}`;

    el.textContent = message;

    container.appendChild(el);

    setTimeout(() => el.remove(), 2500);
}

function renderizar() {

    historico.innerHTML = "";

    if (movimentacoes.length === 0) {
        historico.innerHTML =
            "<p>Nenhuma movimentação registrada ainda.</p>";
        return;
    }

    movimentacoes
        .slice()
        .reverse()
        .forEach(m => {

            historico.innerHTML += `
                <div class="registro">

                    <p><strong>Placa:</strong> ${m.placa}</p>

                    <p>
                        <strong>Tipo:</strong>
                        <span class="${m.tipo === "Entrada" ? "status-entrada" : "status-saida"}">
                            ${m.tipo}
                        </span>
                    </p>

                    <p>
                        ${new Date(m.data).toLocaleString("pt-BR")}
                    </p>

                </div>
            `;
        });
}


btnEntrada.addEventListener("click", () => {

    const placa = select.value;

    if (!placa) return;

    if (getUltimoStatus(placa) === "Entrada") {
        toast("Este veículo já está estacionado", "error");
        return;
    }

    movimentacoes.push({
        placa,
        tipo: "Entrada",
        data: new Date()
    });

    salvar();
    renderizar();

    toast("Entrada registrada");
});


btnSaida.addEventListener("click", () => {

    const placa = select.value;

    if (!placa) return;

    if (getUltimoStatus(placa) !== "Entrada") {
        toast("Este veículo não está no estacionamento", "error");
        return;
    }

    movimentacoes.push({
        placa,
        tipo: "Saída",
        data: new Date()
    });

    salvar();
    renderizar();

    toast("Saída registrada");
});

renderizar();