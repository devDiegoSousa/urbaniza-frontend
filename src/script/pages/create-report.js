const urlBase = "http:localhost:8081"

const token = localStorage.getItem('token');

const submitButton = document.querySelector("#confirmButton");

submitButton.addEventListener('click', () =>{

})

function form() {

  const createReport = (title, description, department, segment, anonymous, address, number, neightborhood, region) => {
    const bodyData = {
      title: title,
      description: description,
      department: department,
      segment: segment,
      anonymous: anonymous,
      address: address, 
      number: number,     
      neightborhood: neightborhood,   
      region: region       
    }

    fetch(`${urlBase}/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': `Bearer ${token}` // Adiciona o token no header Authorization
      },
      body: JSON.stringify(bodyData) // Converte o objeto JavaScript para JSON
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Resposta da API:', data);
        // Faça algo com a resposta da API
      })
      .catch(error => {
        console.error('Erro ao enviar a requisição:', error);
        // Lide com o erro
      });
  }

    
}