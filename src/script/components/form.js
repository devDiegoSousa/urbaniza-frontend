import TokenService from '../global/TokenService.js';


const urlBase = "http://localhost:8081"

function Form() {
}

Form.prototype.init = async function (form, validateCallback, url) {
  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário

    const isValid = validateCallback(); // true or false

    if (isValid) {
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
          const contentType = response.headers.get("Content-Type");

          let responseData;
          if (contentType && contentType.includes("application/json")) {responseData = await response.json();} 
          else {responseData = await response.text();}

          switch (url) {
            case "/auth/signin":
              TokenService.saveTokens(responseData.accessToken, responseData.refreshToken);
              window.location.href = "/pages/dashboard/citizen/map.html";
              break;
            case "/auth/signup":
              window.location.href = "/pages/auth/signin.html";
              break
            default:
              break;
          }
          form.reset();

        } else {
          let errorText;
          try {
            errorText = await response.text();
            const errorData = JSON.parse(errorText);
            console.error("Erro ao concluir a requisição:", errorData);
          } catch (parseError) {
            console.error("Erro ao concluir a requisição:", errorText || "Sem conteúdo");
          }

          alert("Erro ao enviar formulário. Verifique o console.");
        }
      } catch (error) {
        // Trata erros de rede ou outros erros
        console.error("Erro de rede:", error);
        console.log(error);

        alert("Erro ao fazer a requisição: Conferir console");
      }
    } else {
      console.error("Formulário inválido. Corrija os erros.");
    }
  });
};



export default Form;
