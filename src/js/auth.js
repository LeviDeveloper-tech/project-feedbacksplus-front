// auth.js
const logado = sessionStorage.getItem("usuarioLogado");
const pessoaTipoId = sessionStorage.getItem("usuarioPessoaTipoId");

// Só roda a verificação se NÃO estiver na página de login (index.html)
if (
  !window.location.pathname.endsWith("index.html") &&
  !window.location.pathname.endsWith("/")
) {
  if (!logado || logado !== "true") {
    alert("Por favor, faça login.");
    window.location.href = "../../index.html";
  }

  // Restringir acesso ao adm-home apenas para ADM (tipo 1)
  if (
    window.location.pathname.includes("adm-home.html") &&
    pessoaTipoId !== "1"
  ) {
    alert("Acesso restrito ao painel administrativo.");
    if (pessoaTipoId === "2") {
      window.location.href = "empresa-home.html";
    } else if (pessoaTipoId === "3") {
      window.location.href = "cliente-home.html";
    } else {
      window.location.href = "../../index.html";
    }
  }

  // Restringir empresa-home apenas para Empresa (tipo 2)
  if (
    window.location.pathname.includes("empresa-home.html") &&
    pessoaTipoId !== "2"
  ) {
    alert("Acesso restrito ao painel da empresa.");
    if (pessoaTipoId === "1") {
      window.location.href = "adm-home.html";
    } else if (pessoaTipoId === "3") {
      window.location.href = "cliente-home.html";
    } else {
      window.location.href = "../../index.html";
    }
  }

  // Restringir cliente-home apenas para Cliente (tipo 3)
  if (
    window.location.pathname.includes("cliente-home.html") &&
    pessoaTipoId !== "3"
  ) {
    alert("Acesso restrito ao painel do cliente.");
    if (pessoaTipoId === "1") {
      window.location.href = "adm-home.html";
    } else if (pessoaTipoId === "2") {
      window.location.href = "empresa-home.html";
    } else {
      window.location.href = "../../index.html";
    }
  }
}

// Função para logout
function fazerLogout() {
  sessionStorage.clear();
  window.location.href = "../index.html";
}
