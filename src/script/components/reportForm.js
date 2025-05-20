const confirmButton = document.querySelector("#confirmButton");

const processReport = () => {
  const report = {
    title: "Título do Relatório",
    description: "Descrição detalhada do relatório.",
    anonymous: false,
    logradouro: "Rua Exemplo",
    numero: 123, 
    bairro: "Bairro Modelo",
    regiao: "Região Teste"
  };

  const reportJSON = JSON.stringify(report);
  console.log("Relatório em JSON:", reportJSON);
  
};

if (confirmButton) {
  confirmButton.addEventListener('click', processReport);
} else {
  console.error("Botão 'Confirmar' não encontrado no DOM.");
}