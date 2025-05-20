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

  displayError.clear("name");
  displayError.clear("lastName");
  displayError.clear("email");
  displayError.clear("password");
  displayError.clear("confirmPassword");

  if (!firstName) {
    displayError.show("name", "Nome é obrigatório.");
    hasError = true;
  }
  if (!lastName) {
    displayError.show("lastName", "Sobrenome é obrigatório.");
    hasError = true;
  }
  if (!validate.email(email)) {
    displayError.show("email", "Um email válido é obrigatório");
    hasError = true;
  }
  if (!validate.password(password)) {
    displayError.show("password", "Uma senha válida é obrigatória");
    hasError = true;  
  }
  if (!validate.confirmPassword(password, confirmPassword)) {
    displayError.show("confirmPassword", "As senhas não conferem");
    hasError = true
  }
  return !hasError; // Retorna true se não houver erros, false caso contrário
}

const signupForm = document.querySelector(".authForm");
const Form = new FormSchema();
Form.init(signupForm, validateForm, "/auth/signup");
