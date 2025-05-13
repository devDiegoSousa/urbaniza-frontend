const urlBase = "http://localhost:8081"

function Formulario() {
}

Formulario.prototype.init = async function (form, validateCallback, url) {
  if (!form) {
    console.error("Formulário não encontrado.");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário

    const validationResult = validateCallback(); // Valida os dados

    if (validationResult === true) {
      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      try {
        const response = await fetch(urlBase+ url, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log("Requisição bem-sucedida!", responseData);
          alert("Formulário enviado com sucesso!");
          // form.reset(); // Limpa o formulário após o envio
        } else {
          const errorData = await response.json();
          console.error("Erro na requisição:", errorData);
          alert("Erro ao enviar formulário. Verifique o console.");
        }
      } catch (error) {
        // Trata erros de rede ou outros erros
        console.error("Erro de rede:", error);
        alert("Erro de rede. Verifique sua conexão.");
      }
    } else {
      // Se a validação falhar
      console.error("Formulário inválido. Corrija os erros.");
    }
  });
};

export default Formulario;
