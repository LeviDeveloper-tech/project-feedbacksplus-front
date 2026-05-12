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

    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");

    if (isJson) {
      const resultado = await response.json();

      if (!response.ok) {
        const mensagemErro = resultado.erro || resultado.mensagem || "Login ou senha inválidos.";
        alert(mensagemErro);
        return;
      }

      sessionStorage.setItem("usuarioLogado", "true");
      sessionStorage.setItem("usuarioIdLogado", resultado.usuarioId);
      sessionStorage.setItem("usuarioNome", resultado.nome);
      sessionStorage.setItem("usuarioLogin", loginInput);
      sessionStorage.setItem("usuarioPessoaTipoId", resultado.pessoaTipoId);

      alert(resultado.mensagem || "Sucesso!");

      if (resultado.pessoaTipoId === 1) {
        window.location.href = "./pages/adm-home.html";
      } else if (resultado.pessoaTipoId === 2) {
        window.location.href = "./pages/empresa-home.html";
      } else if (resultado.pessoaTipoId === 3) {
        window.location.href = "./pages/cliente-home.html";
      } else {
        alert("Tipo de usuário não reconhecido.");
      }
    } else {
      const textoErro = await response.text();
      console.error("O que o Java mandou:", textoErro);
      alert(
        "O servidor não retornou JSON. Verifique o console (F12) aba 'Network'.",
      );
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    alert("Servidor offline ou erro de rede.");
  }
});
