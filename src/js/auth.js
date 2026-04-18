// --- Lógica de proteção ---
const logado = sessionStorage.getItem("usuarioLogado");

if (!logado || logado !== "true") {
  alert("Acesso negado! Por favor, faça login para acessar esta página.");
  window.location.href = "../index.html";
}

function logout() {
  sessionStorage.clear();
  window.location.href = "../index.html";
}

// --- Lógica para exibir o nome ---
window.onload = function () {
  const nomeCompleto = sessionStorage.getItem("usuarioNome");

  // Verificamos se o nome existe e se a página que tem o <h1> de sucesso
  const h1Titulo = document.querySelector("h1");

  if (nomeCompleto && h1Titulo) {
    // // Altera o texto do <h1> no HTML
    h1Titulo.textContent = `🎉 Bem-vindo(a), ${nomeCompleto}!`;
  }
};
