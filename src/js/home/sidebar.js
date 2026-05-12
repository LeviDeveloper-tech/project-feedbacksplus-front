document.addEventListener("DOMContentLoaded", () => {
  const btnToggle = document.getElementById("btn-toggle");
  const sidebar = document.getElementById("sidebar");

  if (btnToggle && sidebar) {
    btnToggle.addEventListener("click", () => {
      sidebar.classList.toggle("fechada");
    });
  }

  const nome = sessionStorage.getItem("usuarioNome");
  const login = sessionStorage.getItem("usuarioLogin") || sessionStorage.getItem("usuarioNome");
  const elNome = document.getElementById("sidebar-nome");
  const elLogin = document.getElementById("sidebar-login");

  if (nome && elNome) {
    elNome.textContent = nome;
  }
  if (login && elLogin) {
    elLogin.textContent = `@${login}`;
  }
});
