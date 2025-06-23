import ValidateInput from '../components/input/validateInput.js';
import InputError from '../components/input/inputError.js';
import { authService } from '../global/service/authService.js';
import TokenService from '../global/service/TokenService.js';

const CITIZEN_DASHBOARD_URL = '/pages/dashboard/citizen/my-reports.html';
const DEPARTMENT_DASHBOARD_URL = '/pages/dashboard/department/my-reports.html';
const FALLBACK_URL = '/pages/auth/signin.html'; // URL para caso a role não seja encontrada

const loginButton = document.getElementById("signin-button");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const validate = new ValidateInput();
const displayError = new InputError();


function validateForm() {

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  let hasError = false;

  if (!email) {
    displayError.show("email", "O e-mail é obrigatório.");
    hasError = true;
  } else if (!validate.email(email)) {
    displayError.show("email", "Digite um e-mail válido.");
    hasError = true;
  }

    if (!password) {
      displayError.show("password", "A senha é obrigatória.");
      hasError = true;
    }

    return !hasError;
}

function getRedirectUrlByRole() {
  const userRole = TokenService.getUserRole();
  switch (userRole) {
    case 'ROLE_CITIZEN':
      return CITIZEN_DASHBOARD_URL;
    case 'ROLE_DEPARTMENT':
      return DEPARTMENT_DASHBOARD_URL;
    default:
      console.error(`Role não reconhecida ou não encontrada: '${userRole}'. Redirecionando para a página de fallback.`);
      TokenService.clearTokens();
      return FALLBACK_URL;
  }
}

async function handleLogin() {
  if (!validateForm()) {
    console.log('Por favor, corrija os erros no formulário.');
    return;
  }
    
  loginButton.disabled = true;
  loginButton.textContent = 'Entrando...';

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  try {
    const responseData = await authService.signin(email, password);
    
    if (responseData && responseData.accessToken) {
      TokenService.setUserRole(responseData.role);
      const redirectUrl = getRedirectUrlByRole();
      if (redirectUrl == FALLBACK_URL) {
        throw new Error("Seu usuário não possui uma permissão válida para acessar o sistema.");
      }

      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1500);
    } else {
      throw new Error('Resposta de login inválida do servidor.');
    }
  } catch (error) {
    console.error(`Erro ao fazer login: ${error.message}`);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  TokenService.clearTokens;
  if (loginButton) {
    loginButton.addEventListener('click', handleLogin);
  } else {
    console.error("Botão de login com id 'login-button' não foi encontrado no DOM.");
  }
});