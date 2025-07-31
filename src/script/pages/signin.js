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
  function (e) {
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

      if(rememberMe){
        localStorage.setItem("email", email)
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Entrando...";


      loginUser(email, password);
    } else {
      loginAttempts++;

      if (loginAttempts >= maxAttempts) {
        showError("Muitas tentativas falharam. Tente novamente em 5 minutos.");
        // In a real app, you would implement actual lockout logic
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

// Auto-fill demo credentials on double click
document.addEventListener("dblclick", function (e) {
  if (e.target.closest(".glass-effect")) {
    document.getElementById("email").value = "admin@example.com";
    document.getElementById("password").value = "123456";
    showSuccess();
    setTimeout(() => {
      document.getElementById("successMessage").classList.add("hidden");
    }, 2000);
  }
});
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
      
        window.location.replace('/dashboard.html');
      } else {
        console.error("AccessToken não encontrado na resposta do servidor.");
      }

      /*
         IMPORTANTE: O REFRESH TOKEN NO COOKIE
         
         Você mencionou que o refreshToken vem em um cabeçalho 'Set-Cookie'.
         O navegador lida com isso AUTOMATICAMENTE!
         
         - Você NÃO PRECISA ler o cabeçalho 'Set-Cookie' com JavaScript.
         - O navegador irá receber o cabeçalho, criar o cookie e armazená-lo.
         - Em futuras requisições para o mesmo domínio, o navegador enviará
           o cookie de volta para o servidor automaticamente, sem que você
           precise fazer nada no seu código 'fetch'.
         
         Isso é um mecanismo de segurança, especialmente se o cookie for
         marcado como 'HttpOnly', o que impede que ele seja acessado por JavaScript.
      */

      return data; // Retorna os dados (incluindo o token)
  } catch (error) {
    // Captura e exibe qualquer erro que tenha ocorrido durante o processo
    console.error("Ocorreu um erro ao tentar fazer login:", error);
    // Aqui você pode exibir uma mensagem de erro para o usuário na tela
    // Ex: document.getElementById('errorMessage').textContent = error.message;
  }
}
