function getAuthToken() {
  console.log("Token from LocalStorage :- "+ localStorage.getItem('accessToken'));
  return localStorage.getItem('accessToken');
}
function handleUnauthorized() {
  window.location.href = 'login.html';
}

function apiFetch(url, options = {}) {
  // Add default headers
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `${getAuthToken()}`,
    ...options.headers,
  };

  // Merge options with headers
  const config = {
    ...options,
    headers,
  };

  return fetch(url, config)
    .then(response => {
      if (response.status === 401) {
        handleUnauthorized();
        throw new Error('Unauthorized! Redirecting to login...');
      }
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    });
}

export { apiFetch };