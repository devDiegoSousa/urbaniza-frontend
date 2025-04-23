document.querySelector("form").addEventListener("submit", function (e) {
    const novaSenhaInput = document.getElementById("novaSenha");
    const confirmarSenhaInput = document.getElementById("confirmarSenha");
  
    const senha = novaSenhaInput.value;
    const confirmar = confirmarSenhaInput.value;
  
    const erroNovaSenha = document.getElementById("erroNovaSenha");
    const erroConfirmarSenha = document.getElementById("erroConfirmarSenha");
  
    // Limpa mensagens de erro
    erroNovaSenha.textContent = "";
    erroConfirmarSenha.textContent = "";
  
    // Limpa estilos anteriores
    [novaSenhaInput, confirmarSenhaInput].forEach(input => {
      input.classList.remove("border-red-500");
      input.classList.add("border-gray-300");
    });
  
    let valido = true;
  
    // Validação de senha forte
    const senhaForte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(senha);
    if (!senhaForte) {
      erroNovaSenha.textContent = "A senha deve conter no mínimo 8 caracteres, com letras maiúsculas, minúsculas e números.";
      novaSenhaInput.classList.add("border-red-500");
      valido = false;
    }
  
    // Verifica se as senhas coincidem
    if (senha !== confirmar) {
      erroConfirmarSenha.textContent = "As senhas não coincidem.";
      confirmarSenhaInput.classList.add("border-red-500");
      valido = false;
    }
  
    if (!valido) {
      e.preventDefault();
    }
  });
  