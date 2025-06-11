import { reportService } from '/src/script/global/service/ReportService.js';

document.addEventListener('DOMContentLoaded', async () => {
    const loadingMessageElement = document.getElementById('loading-message');
    const errorMessageElement = document.getElementById('error-message');
    const reportsListElement = document.getElementById('reports-list');
    const noReportsMessageElement = document.getElementById('no-reports-message');

    function showErrorMessage(message) {
        loadingMessageElement.classList.add('hidden'); // Esconde o carregamento
        errorMessageElement.textContent = message;
        errorMessageElement.classList.remove('hidden'); // Mostra a mensagem de erro
        reportsListElement.innerHTML = ''; // Limpa a lista
        noReportsMessageElement.classList.add('hidden'); // Esconde "nenhum report"
    }

    // Função auxiliar para mostrar que não há reports
    function showNoReportsMessage() {
        loadingMessageElement.classList.add('hidden');
        errorMessageElement.classList.add('hidden');
        reportsListElement.innerHTML = '';
        noReportsMessageElement.classList.remove('hidden');
    }

    // Função para renderizar os reports na lista
    function renderReports(reports) {
      loadingMessageElement.classList.add('hidden');
      errorMessageElement.classList.add('hidden');
      noReportsMessageElement.classList.add('hidden'); // Esconde "nenhum report" se houver reports
      reportsListElement.innerHTML = ''; // Limpa a lista existente
      if (reports && reports.length > 0) {
        reports.forEach(report => {
          const listItem = document.createElement('li');
          listItem.classList.add('report');
          listItem.innerHTML = `
            <section class="infoContainer">
              <h2 class="reportTitle">${report.title}</h2>
              <div class="reportLocation">
                <p class="location">Lat${report.latitude}, Long: ${report.longitude}</p>
                <p class="region">Região Cotia</p>
              </div>
              <div class="tagContainer">
                <span class="reportTag healthTag">${report.departmentName}</span>
                <span class="reportTag segmentTag">${report.segmentName}</span>
              </div>
              </section>
              <section class="statusContainer">
                <span class="currentStatus correctingStatus">${report.statusName}</span>
              </section>
            `;
          reportsListElement.appendChild(listItem);
        });
      } else {
          showNoReportsMessage(); // Se a lista estiver vazia ou nula
      }
    }

    // 1. Procurar por um accessToken no localStorage
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
        try {
            const reports = await reportService.viewCitizenReport();
            renderReports(reports);
        } catch (error) {
            showErrorMessage(`Erro ao carregar reports: ${error.message}`);
        }
    } else {
        // 3. Se não houver accessToken, mostrar uma mensagem de erro ou redirecionar para login
        showErrorMessage("Você não está logado. Faça login para ver seus reports.");
        window.location.href = "/pages/dashboard/citizen/my-reports.html";
        
    }
});