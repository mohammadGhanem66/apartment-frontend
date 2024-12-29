
const logoutBTN = document.getElementById('logoutBTN');

logoutBTN.addEventListener('click', logout);
function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('email');
  window.location.href = 'login.html';
}
