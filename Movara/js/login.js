const formulario = document.getElementById("loginForm");

const mostrarSenha =
    document.getElementById("mostrarSenha");

const campoSenha =
    document.getElementById("senha");

const mensagem =
    document.getElementById("mensagem");

mostrarSenha.addEventListener("change", () => {

    campoSenha.type =
        mostrarSenha.checked
            ? "text"
            : "password";
});

formulario.addEventListener("submit", (event) => {

    event.preventDefault();

    const matricula =
        document.getElementById("matricula")
        .value.trim();

    const senha =
        document.getElementById("senha")
        .value.trim();

    if (!matricula || !senha) {

        mostrarMensagem(
            "Preencha todos os campos",
            "erro"
        );

        return;
    }

    const usuarios =
        JSON.parse(
            localStorage.getItem("usuarios")
        ) || [];

    const usuario =
        usuarios.find(u =>
            u.matricula === matricula &&
            u.senha === senha
        );

    if (!usuario) {

        mostrarMensagem(
            "Matrícula ou senha inválida",
            "erro"
        );

        return;
    }

    localStorage.setItem(
        "token",
        "parkflow-logado"
    );

    localStorage.setItem(
        "usuarioLogado",
        JSON.stringify(usuario)
    );

    mostrarMensagem(
        `Bem-vindo ${usuario.nome}`,
        "sucesso"
    );

    setTimeout(() => {

        window.location.href =
            "pages/dashboard.html";

    }, 1200);

});

function mostrarMensagem(texto, tipo) {

    mensagem.textContent = texto;

    mensagem.style.color =
        tipo === "erro"
            ? "#dc2626"
            : "#16a34a";
}