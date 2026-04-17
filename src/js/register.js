const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const url = isLocal
  ? "http://localhost:8081/api/usuarios/cadastrar-cliente"
  : "/api/usuarios/cadastrar-cliente";

// Selecionamos o botão uma única vez
const btn = document.getElementById("button");

// --- 1. MÁSCARAS DE INPUT (VISUAL) ---

// Máscara de CPF (xxx.xxx.xxx-xx)
document.getElementById("cpf").addEventListener("input", (e) => {
  let v = e.target.value.replace(/\D/g, "");
  if (v.length > 11) v = v.slice(0, 11);
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  e.target.value = v;
});

// Máscara de Telefone ((xx) xxxxx-xxxx)
document.getElementById("telefone").addEventListener("input", (e) => {
  let v = e.target.value.replace(/\D/g, "");
  if (v.length > 11) v = v.slice(0, 11);
  v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
  v = v.replace(/(\d)(\d{4})$/, "$1-$2");
  e.target.value = v;
});

// --- 2. LÓGICA DO FORMULÁRIO E MODAL ---

function AbrirRevisao(event) {
  event.preventDefault();

  // Verificação de campos
  const senha = document.getElementById("senha").value;
  const confirmarSenha = document.getElementById("confirmar-senha").value;
  const _cpf = document.getElementById("cpf").value;
  const _telefone = document.getElementById("telefone").value;
  const _login = String(document.getElementById("login").value);

  if (_cpf.length < 14) {
    alert("Digite um cpf válido");
    return;
  }

  if (_telefone.length < 15) {
    alert("Digite um telefone válido");
    return;
  }

  if (senha === "" || confirmarSenha === "") {
    alert("Por favor, preencha os campos de senha.");
    return;
  }

  if (senha !== confirmarSenha) {
    alert("As senhas não coincidem! Verifique e tente novamente.");
    return;
  }

  if (_login.includes(" ")) {
    alert("Login não pode conter espaços. Use - ou _ para separação");
    return;
  }

  // Coleta de dados para a prévia do Modal
  const dados = {
    nome: document.getElementById("nome").value,
    cpf: _cpf,
    nascimento: document.getElementById("nascimento").value,
    telefone: _telefone,
    login: _login,
  };

  // Validação simples de campos vazios
  if (!dados.nome || !dados.cpf || !dados.login || !dados.nascimento) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  // Alimenta o conteúdo do modal (Exibindo data em formato BR)
  document.getElementById("lista-revisao").innerHTML = `
        <p><b>Nome:</b> ${dados.nome}</p>
        <p><b>CPF:</b> ${dados.cpf}</p>
        <p><b>Nascimento:</b> ${dados.nascimento.split("-").reverse().join("/")}</p>
        <p><b>Telefone:</b> ${dados.telefone}</p>
        <p><b>Login:</b> ${dados.login}</p>
    `;

  // Exibe o modal
  document.getElementById("modal-revisao").style.display = "flex";

  // Configura o clique do botão "Confirmar" dentro do modal
  document.getElementById("confirmar-final").onclick = () =>
    EnviarDadosReais(dados, senha);
}

// --- 3. ENVIO DOS DADOS PARA O BACKEND ---

async function EnviarDadosReais(dados, senha) {
  // Criamos o objeto final limpando as máscaras para o banco (enviando apenas números)
  const dadosParaEnviar = {
    ...dados,
    cpf: dados.cpf.replace(/\D/g, ""),
    telefone: dados.telefone.replace(/\D/g, ""),
    senha: senha,
  };

  try {
    const request = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dadosParaEnviar),
    });

    if (request.ok) {
      window.location.href = "../index.html";
      alert("Usuário cadastrado com Sucesso! Faça login!");
    } else {
      const erro = await request.text();
      alert("Erro : " + erro);
    }
  } catch (error) {
    console.error("Erro no Fetch:", error);
    alert("Não foi possível conectar ao servidor.");
  }
}

// Evento de clique no botão principal para iniciar a revisão
btn.addEventListener("click", AbrirRevisao);
