import ValidateInput from '../components/input/validateInput.js';
import InputError from '../components/input/inputError.js';
import FormSchema from '../components/form.js';


function validateForm() {
  const firstName = document.getElementById("name").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  let hasError = false; // Controla a existencia de erros

  const validate = new ValidateInput();
  const displayError = new InputError();

  // Limpa mensagens de erro anteriores
  document.getElementById("errorEmail").textContent = "";
  document.getElementById("errorPassword").textContent = "";
  document.getElementById("errorConfirmPassword").textContent = "";
  // Validação do Nome
  if (!firstName) {
      displayError.show("name", "Nome é obrigatório.");
      hasError = true;
  }
  // Validação do Sobrenome
  if (!lastName) {
      displayError.show("lastName", "Sobrenome é obrigatório.");
      hasError = true;
  }
  // Validação do Email
  if (!email) {
      displayError.show("email", "Email é obrigatório");
      hasError = true;
  } else if (!validate.email(email)) {
      displayError.show("email", "Um email válido é obrigatório");
      hasError = true;
  }
  // Validação da Senha
  if (!password) {
    displayError.show("password", "Uma senha é obrigatória");
    hasError = true;
  } else if (!validate.password(password)) {
      displayError.show("password", "Uma senha válida é obrigatória");
      hasError = true;
  }
  // Validação da Confirmação da Senha
  if (!confirmPassword) {
      console.log(password, confirmPassword, "password e confirm")
      displayError.show("confirmPassword", "Confirme sua senha");
      hasError = true;
  } else if (!validate.confirmPassword(password, confirmPassword)) {
      displayError.show("confirmPassword", "As senhas não conferem");
      hasError = true;
  }

  return !hasError; // Retorna true se não houver erros, false caso contrário
}

const signupForm = document.querySelector(".authForm");
const Form = new FormSchema();
Form.init(signupForm, validateForm, "/auth/signup");
