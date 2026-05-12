const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";
const urlBase = isLocal
  ? "http://localhost:8081/api/usuarios"
  : "/api/usuarios";

function normalizeBirthDate(value) {
  if (!value) return "";

  const isoPattern = /^\d{4}-\d{2}-\d{2}$/;
  const brPattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;

  if (isoPattern.test(value)) {
    return value;
  }

  const match = value.match(brPattern);
  if (match) {
    const [, day, month, year] = match;
    return `${year}-${month}-${day}`;
  }

  return value;
}

function extractErrorMessage(text) {
  try {
    const json = JSON.parse(text);
    return json.error || json.message || JSON.stringify(json);
  } catch {
    return text;
  }
}

// --- LISTAGEM ---
async function carregarUsuarios() {
  try {
    const response = await fetch(`${urlBase}/listar`);
    const usuarios = await response.json();

    // Use o ID do tbody presente em adm-home.html
    const tbody = document.getElementById("corpo-tabela");

    // Recupera o ID guardado no login
    const idLogado = sessionStorage.getItem("usuarioIdLogado");

    if (!tbody) {
      console.error("Tabela não encontrada: verifique o id do tbody em adm-home.html");
      return;
    }

    tbody.innerHTML = "";

    usuarios.forEach((user) => {
      const ehOProprioAdm = String(user.usuarioId) === String(idLogado);
      const tipoLabel =
        user.pessoaTipoId === 1
          ? "ADM"
          : user.pessoaTipoId === 2
          ? "Empresa"
          : user.pessoaTipoId === 3
          ? "Cliente"
          : "Desconhecido";

      tbody.innerHTML += `
                <tr>
                    <td>${user.usuarioId}</td>
                    <td>${user.nome}</td>
                    <td>${user.login}</td>
                    <td>${tipoLabel}</td>
                    <td>
                        ${
                          ehOProprioAdm
                            ? '<span class="badge-lock">🔒 Conta Ativa</span>'
                            : `<button class="btn-edit" onclick="prepararEdicao(${user.usuarioId})">✏️ Editar</button>
                               <button class="btn-delete" onclick="excluirUsuario(${user.usuarioId})">🗑️ Excluir</button>`
                        }
                    </td>
                </tr>`;
    });
  } catch (error) {
    console.error("Erro ao carregar lista:", error);
  }
}

// --- FUNÇÕES DE MODAL ---
function abrirModalIncluir() {
  document.getElementById("modal-incluir").style.display = "block";
}
function fecharModalIncluir() {
  document.getElementById("modal-incluir").style.display = "none";
  document.getElementById("form-incluir").reset();
}
function fecharModal() {
  document.getElementById("modal-editar").style.display = "none";
}

// --- EDITAR (PREPARAR) ---
async function prepararEdicao(id) {
  try {
    const response = await fetch(`${urlBase}/${id}`);
    const user = await response.json();
    document.getElementById("edit-id").value = user.usuarioId;
    document.getElementById("edit-nome").value = user.nome;
    document.getElementById("edit-telefone").value = user.telefone || "";
    const editTipo = document.getElementById("edit-tipo");

    if (user.pessoaTipoId === 1) {
      editTipo.innerHTML =
        '<option value="1" selected disabled>Administrador</option>';
      editTipo.disabled = true;
    } else {
      editTipo.innerHTML =
        '<option value="2">Empresa</option><option value="3">Cliente</option>';
      editTipo.disabled = false;
      editTipo.value = user.pessoaTipoId || "3";
    }

    document.getElementById("edit-login").value = user.login;
    document.getElementById("edit-senha").value = "";
    document.getElementById("modal-editar").style.display = "block";
  } catch (error) {
    alert("Erro ao buscar dados.");
  }
}

// --- EXCLUIR ---
async function excluirUsuario(id) {
  if (!confirm(`Excluir usuário ${id}?`)) return;
  try {
    const response = await fetch(`${urlBase}/${id}`, { method: "DELETE" });
    if (response.ok) {
      alert("Excluído!");
      carregarUsuarios();
    }
  } catch (error) {
    alert("Erro de conexão.");
  }
}

// --- INICIALIZAÇÃO ---
window.addEventListener("DOMContentLoaded", () => {
  carregarUsuarios();

  // Form EDITAR
  document
    .getElementById("form-editar")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = document.getElementById("edit-id").value;
      const dados = {
        nome: document.getElementById("edit-nome").value,
        telefone: document.getElementById("edit-telefone").value,
        pessoaTipoId: Number(document.getElementById("edit-tipo").value),
        login: document.getElementById("edit-login").value,
      };
      const senha = document.getElementById("edit-senha").value;
      if (senha) {
        dados.senha = senha;
      }
      const response = await fetch(`${urlBase}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      if (response.ok) {
        fecharModal();
        carregarUsuarios();
      }
    });

  // Form INCLUIR
  document
    .getElementById("form-incluir")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const senha = document.getElementById("add-senha").value;
      if (senha !== document.getElementById("add-senha-confirma").value) {
        alert("Senhas não coincidem!");
        return;
      }

      const perfilId = document.getElementById("add-perfil").value;
      const nascimentoRaw = document.getElementById("add-dataNascimento").value;
      const nascimento = normalizeBirthDate(nascimentoRaw);

      if (!nascimento) {
        alert("Por favor, informe uma data de nascimento válida.");
        return;
      }

      const dados = {
        nome: document.getElementById("add-nome").value,
        nascimento: nascimento,
        cpf: document.getElementById("add-cpf").value,
        telefone: document.getElementById("add-telefone").value,
        login: document.getElementById("add-login").value,
        senha: senha,
      };

      const rota = perfilId === "2" ? "incluir-usuario" : "cadastrar-cliente";
      const url =
        perfilId === "2"
          ? `${urlBase}/${rota}?perfilId=${perfilId}`
          : `${urlBase}/${rota}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      if (response.ok) {
        fecharModalIncluir();
        carregarUsuarios();
      } else {
        const mensagem = await response.text();
        alert(`Erro: ${extractErrorMessage(mensagem)}`);
      }
    });
});
