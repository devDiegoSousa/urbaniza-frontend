import { signinService } from "../global/service/authService.js";
import { parseJwt } from "../global/service/TokenService.js";
import { getToken } from "../global/service/authService.js";

const form = document.getElementById("loginForm");
const inputs = form.querySelectorAll(
  'input[type="email"], input[type="password"]'
);
const submitBtn = form.querySelector('button[type="submit"]');
let loginAttempts = 0;
const maxAttempts = 3;

// Password visibility toggle
function togglePassword(fieldId) {
  const field = document.getElementById(fieldId);
  const span = field.nextElementSibling;
  const spanChild = span.firstElementChild;
  console.log(spanChild);

  if (field.getAttribute("type") === "password") {
    field.setAttribute("type", "text");
    spanChild.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    field.setAttribute("type", "password");
    spanChild.classList.replace("fa-eye-slash", "fa-eye");
  }
}

// Add error state classes
function addErrorState(field) {
  field.classList.remove("border-gray-300");
  field.classList.add("border-red-500", "ring-4", "ring-red-500/10");
}
function removeErrorState(field) {
  field.classList.remove("border-red-500", "ring-4", "ring-red-500/10");
  field.classList.add("border-gray-300");
}
function showError(message) {
  const errorDiv = document.getElementById("errorMessage");
  const errorText = document.getElementById("errorText");
  const successDiv = document.getElementById("successMessage");

  // Hide success message if showing
  successDiv.classList.add("hidden");

  errorText.textContent = message;
  errorDiv.classList.remove("hidden");

  // Add shake animation to form
  form.classList.add("animate-shake");
  setTimeout(() => {
    form.classList.remove("animate-shake");
  }, 500);

  // Hide after 5 seconds
  setTimeout(() => {
    errorDiv.classList.add("hidden");
  }, 5000);
}
function showSuccess() {
  const successDiv = document.getElementById("successMessage");
  const errorDiv = document.getElementById("errorMessage");

  // Hide error message if showing
  errorDiv.classList.add("hidden");

  successDiv.classList.remove("hidden");

  // Hide after 3 seconds
  setTimeout(() => {
    successDiv.classList.add("hidden");
  }, 3000);
}
// Real-time validation
inputs.forEach((input) => {
  input.addEventListener("input", function () {
    validateField(this);
  });

  input.addEventListener("blur", function () {
    validateField(this);
  });
});

function validateField(field) {
  const errorElement = document.getElementById(field.id + "Error");
  let isValid = true;

  if (field.id === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!field.value.trim() || !emailRegex.test(field.value)) {
      isValid = false;
    }
  } else if (field.id === "password") {
    if (!field.value.trim()) {
      isValid = false;
    }
  }

  if (isValid) {
    removeErrorState(field);
    errorElement.classList.add("hidden");
  } else {
    addErrorState(field);
    errorElement.classList.remove("hidden");
  }

  return isValid;
}
// Form submission
form.addEventListener(
  "submit",
  async function (e) {
    e.preventDefault();

    let isFormValid = true;
    inputs.forEach((input) => {
      if (!validateField(input)) {
        isFormValid = false;
      }
    });

    if (isFormValid) {
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const rememberMe = document.getElementById("rememberMe").checked;

      if (rememberMe) {
        localStorage.setItem("email", email);
      }

      const userDetails = {
        email: email,
        password: password,
      };

      submitBtn.disabled = true;
      submitBtn.textContent = "Entrando...";

      const isSigninSuccessful = await signinService(userDetails);

      if (isSigninSuccessful) {
        const decodedToken = parseJwt(getToken());
        const userRole = decodedToken ? decodedToken.role : null;

        switch (userRole) {
          case "ROLE_DEPARTMENT":
            window.location.replace("/pages/app/department/dashboard.html");
            break;

          default:
            window.location.replace("/pages/app/citizen/dashboard.html");
            break;
        }
      } else {
        loginAttempts++;

        if (loginAttempts >= maxAttempts) {
          showError(
            "Muitas tentativas falharam. Tente novamente em 5 minutos."
          );
          setTimeout(() => {
            loginAttempts = 0;
          }, 300000);
        } else {
          showError(
            `Email ou senha incorretos. Tentativa ${loginAttempts}/${maxAttempts}`
          );
        }
      }
    } else {
      loginAttempts++;

      if (loginAttempts >= maxAttempts) {
        showError("Muitas tentativas falharam. Tente novamente em 5 minutos.");
        setTimeout(() => {
          loginAttempts = 0;
        }, 300000); // 5 minutes
      } else {
        showError(
          `Email ou senha incorretos. Tentativa ${loginAttempts}/${maxAttempts}`
        );
      }
    }

    submitBtn.disabled = false;
    submitBtn.textContent = "Entrar";
  },
  1500
);

// Keyboard shortcuts
document.addEventListener("keydown", function (e) {
  // Ctrl/Cmd + Enter to submit form
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    form.dispatchEvent(new Event("submit"));
  }
});

async function loginUser(email, password) {
  const loginData = {
    email: email,
    password: password,
  };

  try {
    const response = await fetch("http://localhost:8282/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    if (response.ok) {
      const data = await response.json();
      const accessToken = data.accessToken;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        console.log("Login bem-sucedido! AccessToken armazenado.");
      } else {
        console.error("AccessToken não encontrado na resposta do servidor.");
      }

      return data;
    }
  } catch (error) {
    // Captura e exibe qualquer erro que tenha ocorrido durante o processo
    console.error("Ocorreu um erro ao tentar fazer login:", error);
    // Aqui você pode exibir uma mensagem de erro para o usuário na tela
    // Ex: document.getElementById('errorMessage').textContent = error.message;
  }
}
