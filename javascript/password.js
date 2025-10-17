import { apiPostOrPut } from './apiHelper.js';

$('form').on('submit', async function (e) {
  e.preventDefault();

  const apiUrl = "http://89.116.110.164:8080/authentication/update-password";
  const oldPassword = $('#currentPass').val();
  const newPassword = $('#newPass').val();
  if(localStorage.getItem('email') == null || localStorage.getItem('email') == ""){
    window.location.href = 'login.html';
  }
  const email = localStorage.getItem('email');

  const body = {
    oldPassword: oldPassword,
    newPassword: newPassword,
    email: email,
  };

  try {
    // Wait for API response
    const response = await apiPostOrPut(apiUrl, 'POST', body);
    console.log('Password changed successfully:', response);
    alert("تم تغير كلمة المرور بنجاح, يجب عليك تسجيل الدخول الان !");
    window.location.href = 'login.html';
  } catch (error) {
    console.error('Error changing password:', error);
    alert('كلمة المرور الحالية غير صحيحة !');
  }
});
