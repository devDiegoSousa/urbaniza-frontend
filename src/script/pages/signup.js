const form = document.getElementById('signupForm');
const inputs = form.querySelectorAll('input');
const submitBtn = form.querySelector('button[type="submit"]');

// Password visibility toggle
function togglePassword(fieldId) {
  const field = document.getElementById(fieldId);
  const type = field.getAttribute('type') === 'password' ? 'text' : 'password';
  field.setAttribute('type', type);
}

// Password strength checker
function checkPasswordStrength(password) {
  const strengthMeter = document.getElementById('strengthFill');
  const strengthText = document.getElementById('strengthText');
  const meterContainer = document.getElementById('strengthMeter');
  
  let strength = 0;
  let feedback = '';
  
  if (password.length >= 8) strength += 25;
  if (password.match(/[a-z]/)) strength += 25;
  if (password.match(/[A-Z]/)) strength += 25;
  if (password.match(/[0-9]/)) strength += 25;
  
  if (password.length > 0) {
    meterContainer.classList.remove('hidden');
    
    if (strength < 50) {
        strengthMeter.style.background = '#ef4444';
        feedback = 'Fraca';
    } else if (strength < 75) {
        strengthMeter.style.background = '#f59e0b';
        feedback = 'Média';
    } else {
        strengthMeter.style.background = '#10b981';
        feedback = 'Forte';
    }
    
    strengthMeter.style.width = strength + '%';
    strengthText.textContent = `Força da senha: ${feedback}`;

  } else {
    meterContainer.classList.add('hidden');
  }
}
// Add error state classes
function addErrorState(field) {
  field.classList.remove('border-gray-300', 'border-green-500');
  field.classList.add('border-red-500', 'ring-4', 'ring-red-500/10');
}
function removeErrorState(field) {
  field.classList.remove('border-red-500', 'ring-4', 'ring-red-500/10');
  field.classList.add('border-gray-300');
}

// Real-time validation
inputs.forEach(input => {
  input.addEventListener('input', function() {
    validateField(this);
    
    if (this.id === 'password') {
      checkPasswordStrength(this.value);
      validateField(document.getElementById('confirmPassword'));
    }
    
    if (this.id === 'confirmPassword') {validatePasswordMatch();}
  });
  
  input.addEventListener('blur', function() {
    validateField(this);
  });
});

function validateField(field) {
    const errorElement = document.getElementById(field.id + 'Error');
    let isValid = true;
    
    if (field.id === 'fullName' && field.value.trim().length < 2) {
      isValid = false;
    } else if (field.id === 'email' && !field.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      isValid = false;
    } else if (field.id === 'password' && field.value.length < 8) {
      isValid = false;
    } else if (field.id === 'confirmPassword' && field.value !== document.getElementById('password').value) {
      isValid = false;
    }
    
    if (isValid) {
      removeErrorState(field);
      errorElement.classList.add('hidden');
    } else {
      addErrorState(field);
      errorElement.classList.remove('hidden');
    }
    
    return isValid;
}
function validatePasswordMatch() {
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const errorElement = document.getElementById('confirmPasswordError');
  const field = document.getElementById('confirmPassword');
  
  if (confirmPassword && password !== confirmPassword) {
    addErrorState(field);
    errorElement.classList.remove('hidden');
    return false;
  } else {
    removeErrorState(field);
    errorElement.classList.add('hidden');
    return true;
  }
}
// Form submission
form.addEventListener('submit', function(e) {
  e.preventDefault();
    
  let isFormValid = true;
  inputs.forEach(input => {
    if (!validateField(input)) {isFormValid = false;}
  });
    
  if (isFormValid) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Criando conta...';
    
    // Simulate API call
    setTimeout(() => {
      document.getElementById('successMessage').classList.remove('hidden');
      form.reset();
      document.getElementById('strengthMeter').classList.add('hidden');
      
      submitBtn.disabled = false;
      submitBtn.textContent = 'Criar Conta';
      
      // Hide success message after 5 seconds
      setTimeout(() => {
          document.getElementById('successMessage').classList.add('hidden');
      }, 5000);
    }, 2000);
  }
});