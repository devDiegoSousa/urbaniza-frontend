// Form state management
let currentStep = 1;
const totalSteps = 3;

// Department categories mapping
const departmentCategories = {
  obras: [
    { value: "buracos", label: "Buracos na Via" },
    { value: "calcadas", label: "Calçadas Danificadas" },
    { value: "sinalizacao", label: "Sinalização" },
    { value: "iluminacao", label: "Iluminação Pública" },
    { value: "pavimentacao", label: "Pavimentação" },
  ],
  "meio-ambiente": [
    { value: "lixo", label: "Descarte Irregular de Lixo" },
    { value: "poluicao", label: "Poluição" },
    { value: "areas-verdes", label: "Áreas Verdes" },
    { value: "animais", label: "Animais Abandonados" },
  ],
  saude: [
    { value: "posto-saude", label: "Posto de Saúde" },
    { value: "vigilancia", label: "Vigilância Sanitária" },
    { value: "dengue", label: "Combate à Dengue" },
  ],
  transporte: [
    { value: "onibus", label: "Transporte Público" },
    { value: "semaforo", label: "Semáforos" },
    { value: "transito", label: "Trânsito" },
  ],
  seguranca: [
    { value: "policiamento", label: "Policiamento" },
    { value: "vandalismo", label: "Vandalismo" },
    { value: "drogas", label: "Drogas" },
  ],
  educacao: [
    { value: "escola", label: "Infraestrutura Escolar" },
    { value: "transporte-escolar", label: "Transporte Escolar" },
  ],
  "assistencia-social": [
    { value: "moradores-rua", label: "Moradores de Rua" },
    { value: "idosos", label: "Assistência a Idosos" },
  ],
};

// DOM elements
const form = document.getElementById("report-form");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");
const departmentSelect = document.getElementById("department");
const categorySelect = document.getElementById("category");
const descriptionTextarea = document.getElementById("description");
const charCount = document.getElementById("char-count");

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  setupEventListeners();
  updateCharacterCount();
  updateStepIndicators();
});

function setupEventListeners() {
  // Navigation buttons
  prevBtn.addEventListener("click", () => {
    if (currentStep > 1) {
      currentStep--;
      showStep(currentStep);
    }
  });

  nextBtn.addEventListener("click", () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        currentStep++;
        showStep(currentStep);
      }
    }
  });

  // Form submission
  form.addEventListener("submit", handleSubmit);

  // Department change handler
  departmentSelect.addEventListener("change", updateCategories);

  // Character count for description
  descriptionTextarea.addEventListener("input", updateCharacterCount);

  // Priority selection
  document.querySelectorAll('input[name="priority"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      document.querySelectorAll(".priority-card").forEach((card) => {
        card.classList.remove("border-green-primary", "bg-green-primary/10");
        card.classList.add("border-dark-border");
      });

      if (this.checked) {
        const card = this.parentElement.querySelector(".priority-card");
        card.classList.remove("border-dark-border");
        card.classList.add("border-green-primary", "bg-green-primary/10");
      }
    });
  });

  // File upload handling
  const uploadArea = document.getElementById("upload-area");
  const fileInput = document.getElementById("images");

  uploadArea.addEventListener("click", () => fileInput.click());

  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadArea.classList.add("border-green-primary");
  });

  uploadArea.addEventListener("dragleave", () => {
    uploadArea.classList.remove("border-green-primary");
  });

  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadArea.classList.remove("border-green-primary");
    handleFiles(e.dataTransfer.files);
  });

  fileInput.addEventListener("change", (e) => {
    handleFiles(e.target.files);
  });

  // Geolocation
  document
    .getElementById("get-location")
    .addEventListener("click", getCurrentLocation);
}

function showStep(step) {
  // Hide all steps
  document.querySelectorAll(".step-content").forEach((content) => {
    content.classList.add("hidden");
  });

  // Show current step
  document.getElementById(`step-${step}-content`).classList.remove("hidden");

  // Update navigation buttons
  if (step === 1) {
    prevBtn.classList.add("hidden");
  } else {
    prevBtn.classList.remove("hidden");
  }

  if (step === totalSteps) {
    nextBtn.classList.add("hidden");
    submitBtn.classList.remove("hidden");
    updateConfirmationStep();
  } else {
    nextBtn.classList.remove("hidden");
    submitBtn.classList.add("hidden");
  }

  updateStepIndicators();
}

function updateStepIndicators() {
  for (let i = 1; i <= totalSteps; i++) {
    const stepElement = document.getElementById(`step-${i}`);
    const stepText = document.getElementById(`step-${i}-text`);

    if (i < currentStep) {
      // Completed step
      stepElement.classList.remove("bg-gray-600", "text-gray-400");
      stepElement.classList.add("bg-green-primary", "text-white");
      stepText.classList.remove("text-gray-400");
      stepText.classList.add("text-green-primary");
    } else if (i === currentStep) {
      // Current step
      stepElement.classList.remove("bg-gray-600", "text-gray-400");
      stepElement.classList.add("bg-green-primary", "text-white");
      stepText.classList.remove("text-gray-400");
      stepText.classList.add("text-green-primary");
    } else {
      // Future step
      stepElement.classList.remove("bg-green-primary", "text-white");
      stepElement.classList.add("bg-gray-600", "text-gray-400");
      stepText.classList.remove("text-green-primary");
      stepText.classList.add("text-gray-400");
    }
  }

  // Update progress bars
  const progress12 = document.getElementById("progress-1-2");
  const progress23 = document.getElementById("progress-2-3");

  if (currentStep > 1) {
    progress12.classList.remove("bg-gray-600");
    progress12.classList.add("bg-green-primary");
  } else {
    progress12.classList.remove("bg-green-primary");
    progress12.classList.add("bg-gray-600");
  }

  if (currentStep > 2) {
    progress23.classList.remove("bg-gray-600");
    progress23.classList.add("bg-green-primary");
  } else {
    progress23.classList.remove("bg-green-primary");
    progress23.classList.add("bg-gray-600");
  }
}

function validateCurrentStep() {
  const currentStepElement = document.getElementById(
    `step-${currentStep}-content`
  );
  const requiredFields = currentStepElement.querySelectorAll("[required]");
  let isValid = true;

  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      field.classList.add("border-red-500");
      isValid = false;
    } else {
      field.classList.remove("border-red-500");
    }
  });

  // Special validation for step 1
  if (currentStep === 1) {
    const description = document.getElementById("description").value;
    if (description.length < 20) {
      document.getElementById("description").classList.add("border-red-500");
      isValid = false;
    }

    const priority = document.querySelector('input[name="priority"]:checked');
    if (!priority) {
      isValid = false;
      // Show priority error styling
    }
  }

  // Special validation for step 3
  if (currentStep === 3) {
    const terms = document.getElementById("terms");
    if (!terms.checked) {
      isValid = false;
      terms.classList.add("border-red-500");
    }
  }

  if (!isValid) {
    // Show error message
    showNotification(
      "Por favor, preencha todos os campos obrigatórios.",
      "error"
    );
  }

  return isValid;
}

function updateCategories() {
  const selectedDepartment = departmentSelect.value;
  const categories = departmentCategories[selectedDepartment] || [];

  categorySelect.innerHTML =
    '<option value="">Selecione uma categoria</option>';

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.value;
    option.textContent = category.label;
    categorySelect.appendChild(option);
  });

  categorySelect.disabled = categories.length === 0;
}

function updateCharacterCount() {
  const current = descriptionTextarea.value.length;
  charCount.textContent = `${current}/500`;

  if (current < 20) {
    charCount.classList.add("text-red-400");
    charCount.classList.remove("text-gray-400");
  } else {
    charCount.classList.remove("text-red-400");
    charCount.classList.add("text-gray-400");
  }
}

function handleFiles(files) {
  const preview = document.getElementById("image-preview");
  const maxFiles = 5;

  if (files.length > maxFiles) {
    showNotification(`Máximo de ${maxFiles} fotos permitidas.`, "error");
    return;
  }

  preview.innerHTML = "";
  preview.classList.remove("hidden");

  Array.from(files).forEach((file, index) => {
    if (file.size > 5 * 1024 * 1024) {
      showNotification(`Arquivo ${file.name} excede 5MB.`, "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const div = document.createElement("div");
      div.className = "relative group";
      div.innerHTML = `
                        <img src="${e.target.result}" alt="Preview" class="w-full h-20 object-cover rounded-lg">
                        <button type="button" class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity" onclick="removeImage(${index})">×</button>
                    `;
      preview.appendChild(div);
    };
    reader.readAsDataURL(file);
  });
}

function removeImage(index) {
  const preview = document.getElementById("image-preview");
  const images = preview.children;
  if (images[index]) {
    images[index].remove();
  }

  if (preview.children.length === 0) {
    preview.classList.add("hidden");
  }
}

function getCurrentLocation() {
  const button = document.getElementById("get-location");
  const originalText = button.innerHTML;

  button.innerHTML = `
                <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <span>Obtendo localização...</span>
            `;
  button.disabled = true;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Simular preenchimento do endereço baseado na coordenada
        document.getElementById("address").value = `Coordenadas: ${lat.toFixed(
          6
        )}, ${lng.toFixed(6)}`;

        // Atualizar mapa (simulado)
        updateMap(lat, lng);

        showNotification("Localização obtida com sucesso!", "success");

        button.innerHTML = originalText;
        button.disabled = false;
      },
      function (error) {
        showNotification(
          "Erro ao obter localização. Verifique as permissões.",
          "error"
        );
        button.innerHTML = originalText;
        button.disabled = false;
      }
    );
  } else {
    showNotification("Geolocalização não suportada pelo navegador.", "error");
    button.innerHTML = originalText;
    button.disabled = false;
  }
}

function updateMap(lat, lng) {
  const mapContainer = document.getElementById("map-container");
  mapContainer.innerHTML = `
                <div class="text-center text-green-400">
                    <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <p class="text-green-400 mb-2">Localização identificada</p>
                    <p class="text-xs text-gray-400">Lat: ${lat.toFixed(
                      6
                    )}, Lng: ${lng.toFixed(6)}</p>
                </div>
            `;
}

function updateConfirmationStep() {
  // Update confirmation data
  const formData = new FormData(form);

  document.getElementById("confirm-title").textContent =
    formData.get("title") || "-";
  document.getElementById("confirm-department").textContent =
    departmentSelect.options[departmentSelect.selectedIndex]?.text || "-";
  document.getElementById("confirm-description").textContent =
    formData.get("description") || "-";
  document.getElementById("confirm-category").textContent =
    categorySelect.options[categorySelect.selectedIndex]?.text || "-";

  const priority = formData.get("priority");
  const priorityLabels = { baixa: "Baixa", media: "Média", alta: "Alta" };
  document.getElementById("confirm-priority").textContent =
    priorityLabels[priority] || "-";

  const region = document.getElementById("region").value;
  const address = formData.get("address");
  const neighborhood = formData.get("neighborhood");
  const reference = formData.get("reference");

  let locationText = "";
  if (region) locationText += `Região: ${region}`;
  if (neighborhood) locationText += `, Bairro: ${neighborhood}`;
  if (address) locationText += `, Endereço: ${address}`;
  if (reference) locationText += `, Referência: ${reference}`;

  document.getElementById("confirm-location").textContent = locationText || "-";

  // Handle images confirmation
  const images = document.getElementById("image-preview").children;
  const confirmImagesSection = document.getElementById(
    "confirm-images-section"
  );
  const confirmImages = document.getElementById("confirm-images");

  if (images.length > 0) {
    confirmImagesSection.classList.remove("hidden");
    confirmImages.innerHTML = "";

    Array.from(images).forEach((imageDiv) => {
      const img = imageDiv.querySelector("img");
      if (img) {
        const div = document.createElement("div");
        div.innerHTML = `<img src="${img.src}" alt="Preview" class="w-full h-16 object-cover rounded-lg">`;
        confirmImages.appendChild(div);
      }
    });
  } else {
    confirmImagesSection.classList.add("hidden");
  }
}

function handleSubmit(e) {
  e.preventDefault();

  if (!validateCurrentStep()) {
    return;
  }

  // Show loading state
  submitBtn.innerHTML = `
                <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <span>Enviando...</span>
            `;
  submitBtn.disabled = true;

  // Simulate form submission
  setTimeout(() => {
    showNotification(
      "Denúncia enviada com sucesso! Você receberá atualizações por email.",
      "success"
    );

    // Reset form or redirect
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 2000);
  }, 2000);
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-blue-500";

  notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full`;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.classList.remove("translate-x-full");
  }, 100);

  // Animate out and remove
  setTimeout(() => {
    notification.classList.add("translate-x-full");
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 5000);
}

// Initialize mobile menu toggle (if needed)
function toggleMobileMenu() {
  // Mobile menu implementation
}
