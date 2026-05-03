// 1. Configurações de URL
const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";
const urlBase = isLocal
  ? "http://localhost:8081/api/usuarios"
  : "/api/usuarios";

// 2. Funções que podem ser chamadas a qualquer momento (Globais)
async function carregarUsuarios() {
  try {
    const response = await fetch(`${urlBase}/listar`);
    const usuarios = await response.json();
    const tbody = document.getElementById("corpo-tabela");
    tbody.innerHTML = "";

    usuarios.forEach((user) => {
      tbody.innerHTML += `
                <tr>
                    <td>${user.usuarioId}</td>
                    <td>${user.nome}</td>
                    <td>${user.login}</td>
                    <td>
                        <button class="btn-edit" onclick="prepararEdicao(${user.usuarioId})">✏️ Editar</button>
                        <button class="btn-delete" onclick="excluirUsuario(${user.usuarioId})">🗑️ Excluir</button>
                    </td>
                </tr>`;
    });
  } catch (error) {
    console.error("Erro ao carregar lista:", error);
  }
}

async function excluirUsuario(id) {
  if (!confirm(`Tem certeza que deseja excluir o usuário ${id}?`)) return;
  try {
    const response = await fetch(`${urlBase}/${id}`, { method: "DELETE" });
    if (response.ok) {
      alert("Usuário excluído!");
      carregarUsuarios();
    }
  } catch (error) {
    alert("Erro ao conectar com o servidor.");
  }
}

async function prepararEdicao(id) {
  try {
    const response = await fetch(`${urlBase}/${id}`);
    const user = await response.json();
    document.getElementById("edit-id").value = user.usuarioId;
    document.getElementById("edit-nome").value = user.nome;
    document.getElementById("edit-login").value = user.login;
    document.getElementById("modal-editar").style.display = "block";
  } catch (error) {
    alert("Erro ao buscar dados do usuário.");
  }
}

function fecharModal() {
  document.getElementById("modal-editar").style.display = "none";
}

function abrirModalIncluir() {
  document.getElementById("modal-incluir").style.display = "block";
}

function fecharModalIncluir() {
  document.getElementById("modal-incluir").style.display = "none";
  document.getElementById("form-incluir").reset();
}

// 3. INICIALIZAÇÃO (Tudo o que depende do HTML carregado fica aqui dentro)
window.addEventListener("DOMContentLoaded", () => {
  carregarUsuarios(); // Inicia a tabela

  // --- Lógica do Formulário de EDITAR ---
  const formEditar = document.getElementById("form-editar");
  if (formEditar) {
    formEditar.addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = document.getElementById("edit-id").value;
      const dadosAtualizados = {
        nome: document.getElementById("edit-nome").value,
        login: document.getElementById("edit-login").value,
      };
      try {
        const response = await fetch(`${urlBase}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dadosAtualizados),
        });
        if (response.ok) {
          alert("Usuário atualizado!");
          fecharModal();
          carregarUsuarios();
        }
      } catch (error) {
        alert("Erro ao atualizar.");
      }
    });
  }

  // --- Lógica do Formulário de INCLUIR (Movido para dentro do DOMContentLoaded) ---
  const formIncluir = document.getElementById("form-incluir");
  if (formIncluir) {
    formIncluir.addEventListener("submit", async (e) => {
      e.preventDefault();

      const senha = document.getElementById("add-senha").value;
      const confirmaSenha = document.getElementById("add-senha-confirma").value;

      // Validação de senha
      if (senha !== confirmaSenha) {
        alert("As senhas não coincidem!");
        return;
      }

      const perfilId = document.getElementById("add-perfil").value;

      // Objeto montado para casar com seu UsuarioCadastroDTO no Java
      const dados = {
        nome: document.getElementById("add-nome").value,
        nascimento: document.getElementById("add-dataNascimento").value,
        cpf: document.getElementById("add-cpf").value,
        telefone: document.getElementById("add-telefone").value,
        login: document.getElementById("add-login").value,
        senha: senha,
      };

      const rota =
        perfilId === "2" ? "cadastrar-funcionario" : "cadastrar-cliente";

      try {
        const response = await fetch(`${urlBase}/${rota}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados),
        });

        if (response.ok) {
          alert("Usuário cadastrado com sucesso!");
          fecharModalIncluir();
          carregarUsuarios();
        } else {
          const erro = await response.text();
          alert("Erro: " + erro);
        }
      } catch (error) {
        alert("Erro ao conectar com o servidor.");
      }
    });
  }
});
