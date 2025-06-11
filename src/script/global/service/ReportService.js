const API_BASE_URL = 'http://localhost:8282';


const reportService = {
  async viewCitizenReport() {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error("Erro: Token de acesso não encontrado. Faça login novamente.");
      window.location.href = "/pages/dashboard/citizen/my-reports.html";
      return null;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/reports/my-reports`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Minhas denúncias:", data);
        return data;
      } else if (response.status === 401 || response.status === 403) {
        const errorData = await response.json(); // Tenta ler o corpo do erro
        console.error("Erro de autenticação/autorização:", errorData.message || response.statusText);
        throw new Error("Acesso negado. Você não tem permissão para ver estes reports.");
      } else if (response.status === 404) {
          console.warn("Nenhum report encontrado para este usuário.");
          return [];
      }
      else {
          const errorData = await response.json();
          console.error("Erro ao buscar reports:", errorData.message || response.statusText);
          throw new Error("Ocorreu um erro ao buscar seus reports.");
      }
    } catch (error) {
        console.error("Erro na requisição viewCitizenReport:", error);
        throw error;
    }
    }
}

export { reportService };