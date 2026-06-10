const STORAGE = "usuarios";

function toast(msg, tipo = "success") {

    const el =
        document.getElementById("toast");

    el.textContent = msg;

    el.className =
    `toast toast-${tipo}`;

    el.classList.add("show");

    setTimeout(() => {

        el.classList.remove("show");

    }, 3000);
}

let usuarios =
    JSON.parse(localStorage.getItem(STORAGE)) || [];

const lista = document.getElementById("listaUsuarios");

const pesquisa =
    document.getElementById("pesquisa");

const contador =
    document.getElementById("contadorUsuarios");

const modal =
    document.getElementById("modalEditar");

let usuarioEditando = null;

function salvarStorage() {
    localStorage.setItem(
        STORAGE,
        JSON.stringify(usuarios)
    );
}

function atualizarLista() {

    const termo =
        pesquisa.value.toLowerCase();

    const filtrados =
        usuarios.filter(u =>
            u.nome.toLowerCase().includes(termo) ||
            u.matricula.toLowerCase().includes(termo)
        );

    contador.textContent =
        filtrados.length;

    lista.innerHTML = "";

    filtrados.forEach(usuario => {

        lista.innerHTML += `
        <tr>

            <td>${usuario.matricula}</td>

            <td>${usuario.nome}</td>

            <td>${usuario.cargo}</td>

            <td>••••••••</td>

            <td>

                <button
                    class="acao editar"
                    onclick="abrirEdicao('${usuario.matricula}')">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button
                    class="acao excluir"
                    onclick="excluirUsuario('${usuario.matricula}')">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>
        `;
    });
}

document
.getElementById("btnCadastrar")
.addEventListener("click", () => {

    const matricula =
        document.getElementById("matricula").value.trim();

    const nome =
        document.getElementById("nome").value.trim();

    const cargo =
        document.getElementById("cargo").value.trim();

    const senha =
        document.getElementById("senha").value.trim();

    if (!matricula || !nome || !cargo || !senha) {
        toast("Preencha todos os campos","error");
        return;
    }

    const existe =
        usuarios.find(
            u => u.matricula === matricula
        );

    if (existe) {
    toast("Matrícula já cadastrada","error");
    return;
    }

    usuarios.push({
        matricula,
        nome,
        cargo,
        senha
    });

    salvarStorage();
    atualizarLista();

    toast("Usuário cadastrado com sucesso");

    document.getElementById("matricula").value = "";
    document.getElementById("nome").value = "";
    document.getElementById("cargo").value = "";
    document.getElementById("senha").value = "";
});

const modalExcluir =
    document.getElementById("modalExcluir");

let matriculaExcluir = null;

function excluirUsuario(matricula){

    matriculaExcluir = matricula;

    modalExcluir.style.display = "flex";
}

function abrirEdicao(matricula){

    usuarioEditando =
        usuarios.find(
            u => u.matricula === matricula
        );

    document.getElementById("editMatricula").value =
        usuarioEditando.matricula;

    document.getElementById("editNome").value =
        usuarioEditando.nome;

    document.getElementById("editCargo").value =
        usuarioEditando.cargo;

    document.getElementById("editSenha").value =
        usuarioEditando.senha;

    modal.style.display = "flex";
}

document
.getElementById("salvarEdicao")
.addEventListener("click", () => {

    const novaMatricula =
        document.getElementById("editMatricula")
        .value
        .trim();

    const duplicado =
        usuarios.find(u =>
            u.matricula === novaMatricula &&
            u !== usuarioEditando
        );

    if (duplicado) {

        toast(
            "Já existe um usuário com essa matrícula",
            "error"
        );

        return;
    }

    usuarioEditando.matricula =
        novaMatricula;

    usuarioEditando.nome =
        document.getElementById("editNome")
        .value
        .trim();

    usuarioEditando.cargo =
        document.getElementById("editCargo")
        .value
        .trim();

    usuarioEditando.senha =
        document.getElementById("editSenha")
        .value
        .trim();

    salvarStorage();
    atualizarLista();

    modal.style.display = "none";

    toast("Usuário atualizado");
});

document
.getElementById("cancelarEdicao")
.addEventListener("click", () => {

    modal.style.display = "none";
});

document
.getElementById("toggleSenha")
.addEventListener("click", () => {

    const senha =
        document.getElementById("senha");

    senha.type =
        senha.type === "password"
            ? "text"
            : "password";
});

pesquisa.addEventListener(
    "input",
    atualizarLista
);

atualizarLista();


document
.getElementById("cancelarExclusao")
.addEventListener("click", () => {

    modalExcluir.style.display = "none";
});

document
.getElementById("confirmarExclusao")
.addEventListener("click", () => {

    usuarios = usuarios.filter(
        u => u.matricula !== matriculaExcluir
    );

    salvarStorage();
    atualizarLista();

    modalExcluir.style.display = "none";

    toast("Usuário removido");
});