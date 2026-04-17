// js/auth.js

// Verifica se a chave de login existe no navegador
const logado = sessionStorage.getItem("usuarioLogado");

if (!logado || logado !== "true") {
    // Se não estiver logado, bloqueia o acesso imediatamente
    alert("Acesso negado! Por favor, faça login para acessar esta página.");
    window.location.href = "../index.html";
}

// Adicione isso ao final do seu auth.js
function logout() {
    sessionStorage.clear();
    window.location.href = "../index.html";
}