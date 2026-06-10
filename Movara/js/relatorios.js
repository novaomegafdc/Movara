const movimentacoes =
    JSON.parse(localStorage.getItem("movimentacoes")) || [];

const tabela =
    document.getElementById("tabelaRelatorios");

const filtroPlaca =
    document.getElementById("filtroPlaca");

const filtroTipo =
    document.getElementById("filtroTipo");

const contador =
    document.getElementById("contadorRegistros");

const mensagemVazia =
    document.getElementById("mensagemVazia");

const btnExportar =
    document.getElementById("btnExportar");

const btnLimpar =
    document.getElementById("btnLimpar");

function formatarData(data) {

    return new Date(data)
        .toLocaleString("pt-BR");
}

function obterDadosFiltrados() {

    const placa =
        filtroPlaca.value.trim().toLowerCase();

    const tipo =
        filtroTipo.value;

    return movimentacoes

        .slice()

        .sort(
            (a, b) =>
                new Date(b.data) -
                new Date(a.data)
        )

        .filter(item => {

            const matchPlaca =
                item.placa
                .toLowerCase()
                .includes(placa);

            const matchTipo =
                tipo === "Todos" ||
                item.tipo === tipo;

            return matchPlaca && matchTipo;
        });
}

function renderizar() {

    const dados =
        obterDadosFiltrados();

    tabela.innerHTML = "";

    contador.textContent =
        dados.length;

    mensagemVazia.style.display =
        dados.length === 0
            ? "block"
            : "none";

    dados.forEach(item => {

        tabela.innerHTML += `
            <tr>

                <td>${item.placa}</td>

                <td class="${
                    item.tipo === "Entrada"
                    ? "tipo-entrada"
                    : "tipo-saida"
                }">

                    ${item.tipo}

                </td>

                <td>
                    ${formatarData(item.data)}
                </td>

            </tr>
        `;
    });
}

function exportarCSV() {

    const dados =
        obterDadosFiltrados();

    let csv =
        "Placa,Tipo,DataHora\n";

    dados.forEach(item => {

        csv +=
            `${item.placa},${item.tipo},"${formatarData(item.data)}"\n`;
    });

    const blob =
        new Blob(
            [csv],
            { type: "text/csv;charset=utf-8;" }
        );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "relatorio_movimentacoes.csv";

    link.click();

    URL.revokeObjectURL(url);
}

btnExportar.addEventListener(
    "click",
    exportarCSV
);

btnLimpar.addEventListener(
    "click",
    () => {

        filtroPlaca.value = "";
        filtroTipo.value = "Todos";

        renderizar();
    }
);

filtroPlaca.addEventListener(
    "input",
    renderizar
);

filtroTipo.addEventListener(
    "change",
    renderizar
);

renderizar();