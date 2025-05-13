function ValidateInput() {
}

ValidateInput.prototype.email = function(email) {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  console.error(regexEmail.test(email));
  return regexEmail.test(email); // true or false
  
};

ValidateInput.prototype.password = function(password) {
  if(password.length >= 6) {
    console.error(password);
    return true;
  }
  return false
};
ValidateInput.prototype.confirmPassword = function(password, confirmPassword) {
  return password === confirmPassword
};

export default ValidateInput;
