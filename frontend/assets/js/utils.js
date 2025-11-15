// ====================================================================
// UTILITY FUNCTIONS - API & AUTH
// ====================================================================

const API_BASE_URL = 'http://localhost:3000/api';

// Fungsi untuk mendapatkan token dari localStorage
function getToken() {
  return localStorage.getItem('token');
}

// Fungsi untuk menyimpan token ke localStorage
function setToken(token) {
  localStorage.setItem('token', token);
}

// Fungsi untuk menghapus token (logout)
function removeToken() {
  localStorage.removeItem('token');
}

// Fungsi untuk cek apakah user sudah login
function isAuthenticated() {
  return getToken() !== null;
}

// Fungsi untuk redirect ke login jika belum login
function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = '/public/index.html';
    return false;
  }
  return true;
}

// Fungsi untuk logout
function logout() {
  removeToken();
  window.location.href = '/public/index.html';
}

// Fungsi wrapper untuk fetch dengan auth header
async function fetchWithAuth(url, options = {}) {
  const token = getToken();
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, mergedOptions);
    
    // Jika unauthorized, redirect ke login
    if (response.status === 401 || response.status === 403) {
      removeToken();
      window.location.href = '/public/index.html';
      throw new Error('Unauthorized');
    }

    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// Fungsi untuk menampilkan alert
function showAlert(message, type = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.role = 'alert';
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;

  const container = document.querySelector('.container');
  if (container) {
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      alertDiv.remove();
    }, 5000);
  }
}

// Fungsi untuk format tanggal
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString('id-ID', options);
}

// Fungsi untuk format angka
function formatNumber(num) {
  return new Intl.NumberFormat('id-ID').format(num);
}

// Fungsi untuk disable/enable button dengan loading
function setButtonLoading(button, isLoading) {
  if (isLoading) {
    button.dataset.originalText = button.innerHTML;
    button.disabled = true;
    button.innerHTML = '<span class="loading"></span> Memproses...';
  } else {
    button.disabled = false;
    button.innerHTML = button.dataset.originalText || button.innerHTML;
  }
}

// Export functions (jika menggunakan module)
// export { API_BASE_URL, getToken, setToken, removeToken, isAuthenticated, requireAuth, logout, fetchWithAuth, showAlert, formatDate, formatNumber, setButtonLoading };
