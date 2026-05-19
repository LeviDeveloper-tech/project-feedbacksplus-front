const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";
const urlBase = isLocal ? "http://localhost:8081/api" : "/api";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Verificação de Segurança (Garantir que há um usuário logado)
  const empresaId = sessionStorage.getItem("usuarioIdLogado");
  if (!empresaId) {
    alert("⚠️ Sessão expirada ou inválida. Por favor, faça login novamente.");
    window.location.href = "../../index.html";
    return;
  }

  // 2. Chamar funções de inicialização da Dashboard
  carregarDadosDashboard(empresaId);
});

/**
 * Busca do back-end as métricas e a lista de feedbacks específicos da empresa logada
 * @param {string} empresaId
 */
async function carregarDadosDashboard(empresaId) {
  try {
    // Faz a requisição trazendo a lista de feedbacks vinculados a esta empresa
    // (Ajuste a rota "/feedbacks/empresa/" conforme o mapeamento exato do seu FeedbackController)
    const response = await fetch(`${urlBase}/feedbacks/empresa/${empresaId}`);

    if (!response.ok) {
      throw new Error("Não foi possível obter os dados dos feedbacks.");
    }

    const feedbacks = await response.json();

    // 3. Renderizar a tabela e processar os KPIs
    renderizarTabelaFeedbacks(feedbacks);
    calcularEExibirMetricas(feedbacks);
  } catch (error) {
    console.error("Erro ao carregar a dashboard da empresa:", error);
    // Mantém a tabela amigável exibindo o erro visualmente na própria grade
    const tbody = document.getElementById("corpo-tabela-feedbacks");
    if (tbody) {
      tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; color: var(--primary-pink); padding: 20px;">
                        ❌ Falha ao conectar com o servidor para carregar feedbacks.
                    </td>
                </tr>
            `;
    }
  }
}

/**
 * Monta as linhas da tabela dinamicamente com base nos registros do banco
 * @param {Array} feedbacks
 */
function renderizarTabelaFeedbacks(feedbacks) {
  const tbody = document.getElementById("corpo-tabela-feedbacks");
  if (!tbody) return;

  if (!feedbacks || feedbacks.length === 0) {
    tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; color: var(--text-gray); padding: 20px;">
                    Nenhum feedback registrado para esta empresa ainda.
                </td>
            </tr>
        `;
    return;
  }

  tbody.innerHTML = ""; // Limpa a linha de "Carregando" ou registros antigos

  feedbacks.forEach((fb) => {
    // Tratamento da data/hora para o padrão brasileiro
    const dataFormatada = fb.datahora
      ? new Date(fb.datahora).toLocaleString("pt-BR", { timeZone: "UTC" })
      : "Sem data";

    // Captura a nota média deste feedback específico (vindo da tbAvaliacao)
    // Se o seu DTO trouxer direto a nota do feedback, use fb.nota. Caso contrário, definimos um padrão.
    const notaFeedback = fb.nota !== undefined ? `${fb.nota} ★` : "N/A";

    tbody.innerHTML += `
            <tr>
                <td>${fb.feedbackId}</td>
                <td>${dataFormatada}</td>
                <td>${fb.clienteNome || fb.clienteId || "Anônimo"}</td>
                <td style="color: var(--primary-pink); font-weight: bold;">${notaFeedback}</td>
                <td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${fb.observacao || ""}">
                    ${fb.observacao || "<span style='color: var(--text-gray); italic'>Sem comentários</span>"}
                </td>
            </tr>
        `;
  });
}

/**
 * Faz o cálculo em tempo real das métricas exibidas nos cards superiores da tela
 * @param {Array} feedbacks
 */
function calcularEExibirMetricas(feedbacks) {
  const elTotal = document.getElementById("total-feedbacks");
  const elMedia = document.getElementById("media-notas");

  if (!feedbacks || feedbacks.length === 0) {
    if (elTotal) elTotal.textContent = "0";
    if (elMedia) elMedia.textContent = "0.0 ★";
    return;
  }

  // 1. Atualiza contador total
  if (elTotal) {
    elTotal.textContent = feedbacks.length;
  }

  // 2. Calcula a média aritmética de todas as notas recebidas
  let somaNotas = 0;
  let feedbacksComNota = 0;

  feedbacks.forEach((fb) => {
    if (fb.nota !== undefined && fb.nota !== null) {
      somaNotas += Number(fb.nota);
      feedbacksComNota++;
    }
  });

  if (elMedia) {
    if (feedbacksComNota > 0) {
      const mediaGeral = (somaNotas / feedbacksComNota).toFixed(1);
      elMedia.textContent = `${mediaGeral} ★`;
    } else {
      elMedia.textContent = "0.0 ★";
    }
  }
}
