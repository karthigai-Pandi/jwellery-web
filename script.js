const tickerText = document.querySelector('.ticker-text');
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const searchForm = document.getElementById('search-form');
const authStatus = document.getElementById('auth-status');
const signinForm = document.getElementById('signin-form');
const signupForm = document.getElementById('signup-form');

const rates = [
  'Gold 22Kt Rate ₹14,395 / gm',
  'Gold 24Kt Rate ₹15,709 / gm',
  'Gold 18Kt Rate ₹11,895 / gm'
];
let rateIndex = 0;

function rotateTicker() {
  rateIndex = (rateIndex + 1) % rates.length;
  if (tickerText) tickerText.textContent = rates[rateIndex];
}

async function submitAuth(endpoint, data) {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Unable to complete request.');
    }

    if (authStatus) {
      authStatus.textContent = result.message;
      authStatus.style.color = '#2c5f2d';
      authStatus.style.background = 'rgba(44, 95, 45, 0.12)';
    }
  } catch (error) {
    if (authStatus) {
      authStatus.textContent = error.message;
      authStatus.style.color = '#8a1f1f';
      authStatus.style.background = 'rgba(138, 31, 31, 0.12)';
    }
  }
}

function attachAuthForms() {
  if (signinForm) {
    signinForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = document.getElementById('signin-email').value.trim();
      const password = document.getElementById('signin-password').value.trim();
      if (!email || !password) {
        if (authStatus) authStatus.textContent = 'Please enter both email and password.';
        return;
      }
      await submitAuth('/api/auth/signin', { email, password });
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value.trim();
      if (!name || !email || !password) {
        if (authStatus) authStatus.textContent = 'Please complete all fields to create an account.';
        return;
      }
      await submitAuth('/api/auth/signup', { name, email, password });
    });
  }
}

if (tickerText) {
  setInterval(rotateTicker, 5000);
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    siteNav.classList.toggle('open');
  });
}

if (searchForm) {
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = document.getElementById('search-input').value.trim();
    if (!query) {
      alert('Please enter a search term.');
      return;
    }
    alert(`Search results for "${query}" are not available in this demo site.`);
  });
}

attachAuthForms();
