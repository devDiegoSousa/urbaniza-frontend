document.querySelector("form").addEventListener("submit", function (e) {
  const emailInput = document.getElementById("email");
  const senhaInput = document.getElementById("senha");
  const consenhaInput = document.getElementById("consenha");

  const email = emailInput.value.trim();
  const senha = senhaInput.value;
  const consenha = consenhaInput.value;

  const erroEmail = document.getElementById("erroEmail");
  const erroSenha = document.getElementById("erroSenha");
  const erroConfirmarSenha = document.getElementById("erroConfirmarSenha");

  // Limpa mensagens de erro
  erroEmail.textContent = "";
  erroSenha.textContent = "";
  erroConfirmarSenha.textContent = "";

  // Limpa estilos de erro anteriores
  [emailInput, senhaInput, consenhaInput].forEach(input => {
    input.classList.remove("border-red-500");
    input.classList.add("border-gray-300");
  });

  let valido = true;

  // Validação de email
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailValido) {
    erroEmail.textContent = "Por favor, insira um e-mail válido.";
    emailInput.classList.remove("border-gray-300");
    emailInput.classList.add("border-red-500");
    valido = false;
  }

  // Validação de senha
  const senhaForte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(senha);
  if (!senhaForte) {
    erroSenha.textContent = "A senha deve conter no mínimo 8 caracteres, com letras maiúsculas, minúsculas e números.";
    senhaInput.classList.remove("border-gray-300");
    senhaInput.classList.add("border-red-500");
    valido = false;
  }

  // Validação de confirmação de senha
  if (senha !== consenha) {
    erroConfirmarSenha.textContent = "As senhas não coincidem.";
    consenhaInput.classList.remove("border-gray-300");
    consenhaInput.classList.add("border-red-500");
    valido = false;
  }

  if (!valido) {
    e.preventDefault(); // Impede envio do formulário se algo está inválido
  }
});
