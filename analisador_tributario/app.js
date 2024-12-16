// URL base do backend
const API_BASE_URL = "https://analisador-tributario-vercel-lnh5uk6an-elias-silvas-projects.vercel.app";
let isProcessing = false; // Variável para rastrear o status de processamento
let downloadUrl = null; // URL do arquivo gerado

// Função para exibir Toastify
const showToast = (message, type = "info") => {
  Toastify({
    text: message,
    duration: 5000,
    close: true,
    gravity: "top", // Topo da tela
    position: "center",
    backgroundColor: type === "error" ? "red" : "green",
  }).showToast();
};

// Função para exibir o indicador de carregamento
const showLoading = () => {
  const spinner = document.getElementById("spinner");
  const loadingText = document.getElementById("loading-text");
  const container = document.getElementById("loading-spinner");

  container.style.display = "block"; // Mostrar contêiner
  spinner.style.display = "block"; // Exibir círculo girando
  loadingText.textContent = "Processando, por favor aguarde...";
};

// Função para exibir mensagem de sucesso no lugar do círculo
const showSuccessMessage = (message) => {
  const spinner = document.getElementById("spinner");
  const loadingText = document.getElementById("loading-text");

  spinner.style.display = "none"; // Ocultar círculo girando
  loadingText.textContent = message; // Exibir mensagem de sucesso
};

// Função para ocultar o contêiner de carregamento
const hideLoading = () => {
  const container = document.getElementById("loading-spinner");
  container.style.display = "none"; // Ocultar contêiner
};

// Função para enviar os dados do formulário de Planilhas
document.getElementById("form-planilhas").addEventListener("submit", async (event) => {
  event.preventDefault();

  // Criação de FormData para envio do arquivo e dados
  const formData = new FormData();
  formData.append("regime", document.getElementById("regime-planilha").value);
  formData.append("atividade_origem", document.getElementById("atividade_origem-planilha").value);
  formData.append("atividade_destino", document.getElementById("atividade_destino-planilha").value);
  formData.append("razao_social", document.getElementById("razao_social-planilha").value);

  const fileInput = document.getElementById("arquivo-planilha");
  if (fileInput.files.length > 0) {
    formData.append("arquivo", fileInput.files[0]);
  } else {
    showToast("Por favor, selecione um arquivo.", "error");
    return;
  }

  // Exibir mensagem de carregamento e indicador de carregamento
  isProcessing = true;
  showLoading();
  showToast("Processando planilha, aguarde...");

  try {
    const response = await fetch(`${API_BASE_URL}/analisar/planilhas/`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const blob = await response.blob();
      downloadUrl = window.URL.createObjectURL(blob);

      // Salvar a URL para possível reuso
      localStorage.setItem("planilhaGerada", downloadUrl);

      showToast("Planilha gerada com sucesso! Baixando agora.");
      isProcessing = false;

      // Exibir mensagem de sucesso no lugar do círculo
      showSuccessMessage("Planilha salva com sucesso. Faça o download abaixo.");

      // Baixar automaticamente
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "analise_tributaria.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const error = await response.json();
      showToast(`Erro: ${error.detail || "Erro desconhecido."}`, "error");
      isProcessing = false;
      hideLoading();
    }
  } catch (error) {
    console.log(error)
    showToast(`Erro: ${error.message}`, "error");
    isProcessing = false;
    hideLoading();
  }
});
