const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";
const urlBase = isLocal
  ? "http://localhost:8081/api/usuarios"
  : "/api/usuarios";

document.addEventListener("DOMContentLoaded", () => {
  const inputCnpj = document.getElementById("cpf"); // Mantém o ID 'cpf' mapeado no HTML
  const inputTelefone = document.getElementById("telefone");
  const form = document.getElementById("form-registro-empresa");

  // Máscara em tempo real para CNPJ (XX.XXX.XXX/XXXX-XX)
  inputCnpj.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 14) v = v.slice(0, 14);
    v = v.replace(/^(\d{2})(\d)/, "$1.$2");
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
    v = v.replace(/(\d{4})(\d)/, "$1-$2");
    e.target.value = v;
  });

  // Máscara em tempo real para Telefone ((XX) XXXXX-XXXX)
  inputTelefone.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d{5})(\d)/, "$1-$2");
    e.target.value = v;
  });

  // Evento de Envio do Formulário
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmar-senha").value;

    if (senha !== confirmarSenha) {
      alert("❌ As senhas não coincidem!");
      return;
    }

    // Monta o DTO exatamente como o Java espera receber
    const dados = {
      nome: document.getElementById("nome").value,
      cpf: inputCnpj.value.replace(/\D/g, ""), // Remove os pontos e barras enviando apenas números
      telefone: inputTelefone.value.replace(/\D/g, ""),
      login: document.getElementById("login").value,
      senha: senha,
      nascimento: "2000-01-01", // Valor fixo padrão para passar na validação física do banco
    };

    try {
      const response = await fetch(`${urlBase}/cadastrar-empresa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      if (response.ok) {
        alert("✨ Empresa cadastrada com sucesso!");
        window.location.href = "../index.html"; // Redireciona para a tela de login
      } else {
        const erroTexto = await response.text();
        alert(`⚠️ Erro no cadastro: ${erroTexto}`);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("❌ Falha ao conectar com o servidor.");
    }
  });
});
