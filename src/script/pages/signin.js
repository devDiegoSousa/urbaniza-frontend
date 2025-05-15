import ValidateInput from '../components/input/validateInput.js';
import InputError from '../components/input/inputError.js';
import FormSchema from '../components/form.js';


function validateForm(){
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const validate = new ValidateInput();
  const displayError = new InputError();

  let hasError = false; // Controla a existencia de erros


  // Validação do Email
  if (!email) {
      displayError.show("email", "Email é obrigatório");
      hasError = true;
  } else if (!validate.email(email)) {
      displayError.show("email", "Digite um email válido");
      hasError = true;
  }
  // Validação da Senha
  if (!password) {
    displayError.show("password", "Digite a senha");
    hasError = true;
  }

  return !hasError; // Retorna true se não houver erros, false caso contrário
}

const signinForm = document.querySelector(".authForm");
const Form = new FormSchema();
Form.init(signinForm, validateForm, "/auth/signin");