function inputError() {
}

inputError.prototype.show = function(inputId, errorMessage) {
  const elementError = document.getElementById("error" + inputId.charAt(0).toUpperCase() + inputId.slice(1));
  if (elementError) {
      elementError.textContent = errorMessage;
  } else{
    console.error(`Elemento de erro para o campo ${inputId} não encontrado.`);
  }
};

inputError.prototype.clear = function(inputId) {
  const elementError = document.getElementById("error" + inputId.charAt(0).toUpperCase() + inputId.slice(1));
  if (elementError) {
      elementError.textContent = "";
  }
};

export default inputError;
