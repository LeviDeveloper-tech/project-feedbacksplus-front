const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";
const urlBase = isLocal
  ? "http://localhost:8081/api/usuarios"
  : "/api/usuarios";

function abrirModalEditarCliente() {
  document.getElementById("modal-editar-cliente").style.display = "block";
}

function fecharModalEditarCliente() {
  document.getElementById("modal-editar-cliente").style.display = "none";
  document.getElementById("form-editar-cliente").reset();
}

async function carregarDadosCliente() {
  const usuarioId = sessionStorage.getItem("usuarioIdLogado");
  if (!usuarioId) return;

  try {
    const response = await fetch(`${urlBase}/${usuarioId}`);
    if (!response.ok) {
      throw new Error("Não foi possível buscar os dados do cliente.");
    }

    const usuario = await response.json();
    document.getElementById("input-nome").value = usuario.nome || "";
    document.getElementById("input-login").value = usuario.login || "";
    document.getElementById("input-telefone").value = usuario.telefone || "";
    document.getElementById("input-senha").value = "";
  } catch (error) {
    console.error(error);
    alert("Erro ao carregar seus dados. Tente novamente mais tarde.");
  }
}

async function salvarDadosCliente(event) {
  event.preventDefault();
  const usuarioId = sessionStorage.getItem("usuarioIdLogado");
  if (!usuarioId) return;

  const nome = document.getElementById("input-nome").value;
  const login = document.getElementById("input-login").value;
  const telefone = document.getElementById("input-telefone").value;
  const senha = document.getElementById("input-senha").value;

  const dados = {
    nome,
    login,
    telefone,
  };

  if (senha) {
    dados.senha = senha;
  }

  try {
    const response = await fetch(`${urlBase}/${usuarioId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    if (!response.ok) {
      const erro = await response.text();
      throw new Error(erro || "Erro ao atualizar seus dados.");
    }

    alert("Dados atualizados com sucesso.");
    sessionStorage.setItem("usuarioNome", nome);
    sessionStorage.setItem("usuarioLogin", login);
    document.getElementById("sidebar-nome").textContent = nome;
    document.getElementById("sidebar-login").textContent = `@${login}`;
    fecharModalEditarCliente();
  } catch (error) {
    console.error(error);
    alert("Falha ao atualizar informações. Verifique os dados e tente novamente.");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const btnEditar = document.getElementById("btn-abrir-editar");
  if (btnEditar) {
    btnEditar.addEventListener("click", async (event) => {
      event.preventDefault();
      await carregarDadosCliente();
      abrirModalEditarCliente();
    });
  }

  const formEditar = document.getElementById("form-editar-cliente");
  if (formEditar) {
    formEditar.addEventListener("submit", salvarDadosCliente);
  }

  const btnFechar = document.getElementById("close-editar-cliente");
  if (btnFechar) {
    btnFechar.addEventListener("click", fecharModalEditarCliente);
  }

  const modal = document.getElementById("modal-editar-cliente");
  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        fecharModalEditarCliente();
      }
    });
  }
});