// login form inputs
const emailInput = document.getElementById('user-email');
// login form messages
const errorMessage = document.getElementById('reset-password-error');

// clear auth errors
emailInput.addEventListener('input', () => {
  errorMessage.textContent = '';
  errorMessage.style.display = 'none';
});