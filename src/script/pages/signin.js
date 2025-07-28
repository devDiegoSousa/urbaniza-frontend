import

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
  const toggle = field.nextElementSibling;

  if (field.getAttribute("type") === "password") {
    field.setAttribute("type", "text");
    toggle.textContent = "🙈";
  } else {
    field.setAttribute("type", "password");
    toggle.textContent = "👁️";
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
form.addEventListener("submit", function (e) {
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

    submitBtn.disabled = true;
    submitBtn.textContent = "Entrando...";

    
      } else {
        loginAttempts++;

        if (loginAttempts >= maxAttempts) {
          showError(
            "Muitas tentativas falharam. Tente novamente em 5 minutos."
          );
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
    }, 1500);
  }
});

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
