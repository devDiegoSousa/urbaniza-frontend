function ValidateInput() {
}

ValidateInput.prototype.email = function(email) {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexEmail.test(email); // true or false
  
};

ValidateInput.prototype.password = function(password) {
  if(password.length >= 6) {
    return true;
  }
  return false
};
ValidateInput.prototype.confirmPassword = function(password, confirmPassword) {
  return password === confirmPassword
};

export default ValidateInput;
