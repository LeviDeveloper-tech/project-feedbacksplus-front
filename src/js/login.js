//Definição da URL (mesma lógica que usamos no registro)
const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";
const url = isLocal
  ? "http://localhost:8081/api/usuarios/login"
  : "/api/usuarios/login";

const form = document.getElementById("form-login");

// Escutando o evento de submit do formulário
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Impede o recarregamento da página

  const loginInput = document.getElementById("username-input").value;
  const senhaInput = document.getElementById("password-input").value;

  const dadosParaEnviar = {
    login: loginInput,
    senha: senhaInput,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dadosParaEnviar),
    });

    const resultado = await response.json();

    if (response.ok) {
      //Salva a sessão e redireciona
      sessionStorage.setItem("usuarioLogado", "true");

      // Salvando o nome que o Java enviou no JSON
      // O 'resultado' já contém o JSON 
      sessionStorage.setItem("usuarioNome", resultado.nome);

      alert(resultado.mensagem);

      // O redirecionamento
      window.location.href = "./pages/sucesso.html";
    } else {
      //Exibe mensagem do back (401 Unauthorized)
      alert(resultado.erro || "Falha ao entrar.");
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    alert("Erro ao conectar com o servidor.");
  }
});
