const veiculos =
    JSON.parse(localStorage.getItem("veiculos")) || [];

const movimentacoes =
    JSON.parse(localStorage.getItem("movimentacoes")) || [];

const totalVeiculos =
    document.getElementById("totalVeiculos");

const totalEntradas =
    document.getElementById("totalEntradas");

const totalSaidas =
    document.getElementById("totalSaidas");

const totalEstacionados =
    document.getElementById("totalEstacionados");

const ativosDiv =
    document.getElementById("ativos");

const totalVagas =
    document.getElementById("totalVagas");

const CAPACIDADE_ESTACIONAMENTO = 50;


let precoHora =
    Number(localStorage.getItem("precoHora")) || 10;


function hoje() {
    return new Date().toISOString().split("T")[0];
}


function getUltimoStatus(placa) {

    for (let i = movimentacoes.length - 1; i >= 0; i--) {

        if (movimentacoes[i].placa === placa) {
            return movimentacoes[i];
        }
    }

    return null;
}


function getAtivos() {

    return veiculos.filter(v => {

        const ultimo = getUltimoStatus(v.placa);

        return ultimo && ultimo.tipo === "Entrada";
    });
}


function tempoEstacionado(dataEntrada) {

    const entrada = new Date(dataEntrada);
    const agora = new Date();

    const diff = agora - entrada;

    const minutosTotais =
        Math.floor(diff / 60000);

    const dias =
        Math.floor(minutosTotais / 1440);

    const horas =
        Math.floor((minutosTotais % 1440) / 60);

    const minutos =
        minutosTotais % 60;

    return {
        dias,
        horas,
        minutos
    };
}


function valor(horas, minutos) {

    const totalHoras = horas + (minutos / 60);

    return (totalHoras * precoHora).toFixed(2);
}


function renderAtivos() {

    const ativos = getAtivos();

    ativosDiv.innerHTML = "";

    if (ativos.length === 0) {
        ativosDiv.innerHTML =
            "<p>Nenhum veículo estacionado.</p>";
        return;
    }

    ativos.forEach(v => {

        const ultimaEntrada =
            [...movimentacoes]
                .reverse()
                .find(m =>
                    m.placa === v.placa &&
                    m.tipo === "Entrada"
                );

        const tempo =
            tempoEstacionado(ultimaEntrada.data);

        const preco =
        valor(
        (tempo.dias * 24) + tempo.horas,
        tempo.minutos
        );

        ativosDiv.innerHTML += `
            <div class="registro">

                <p><strong>Placa:</strong> ${v.placa}</p>
                <p><strong>Modelo:</strong> ${v.modelo}</p>
                <p><strong>Cor:</strong> ${v.cor}</p>

                <p>
                <strong>Tempo estacionado:</strong>
                ${tempo.dias}d ${tempo.horas}h ${tempo.minutos}min
                </p>

                <p>
                    <strong>Valor estimado:</strong>
                    R$ ${preco}
                </p>

                <p class="status-entrada">
                    ESTACIONADO
                </p>

            </div>
        `;
    });
}


function atualizar() {

    const hojeMov =
        movimentacoes.filter(m => {

            if (m.dia) return m.dia === hoje();

            return m.data &&
                m.data.split("T")[0] === hoje();
        });

    totalVeiculos.textContent = veiculos.length;

    totalEntradas.textContent =
        hojeMov.filter(m => m.tipo === "Entrada").length;

    totalSaidas.textContent =
        hojeMov.filter(m => m.tipo === "Saída").length;

    const estacionados =
    getAtivos().length;

    totalEstacionados.textContent =
    estacionados;

    totalVagas.textContent =
    Math.max(
        0,
        CAPACIDADE_ESTACIONAMENTO - estacionados
    );

renderAtivos();
}


function salvarPreco() {

    const valorInput =
        document.getElementById("precoInput").value;

    if (!valorInput) return;

    precoHora = Number(valorInput);

    localStorage.setItem("precoHora", valorInput);

    toast(`Preço atualizado para R$ ${valorInput}`, "success");
}


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


atualizar();