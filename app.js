const form = document.getElementById('addAccountForm');
const cardsContainer = document.getElementById('accountCards');
const accountUrlInput = document.getElementById('accountUrl');
const platformSelect = document.getElementById('platform');

const STORAGE_KEY = 'socialDashboardAccounts';

const platformIcons = {
  'instagram': '📷',
  'twitter': '𝕏',
  'facebook': '👥',
  'linkedin': '💼',
  'youtube': '▶️',
  'tiktok': '🎵',
  'custom': '🔗'
};

const defaultAccounts = [
  { platform: 'Instagram', url: 'https://www.instagram.com', label: 'Instagram', platformKey: 'instagram' },
  { platform: 'Twitter', url: 'https://twitter.com', label: 'Twitter', platformKey: 'twitter' },
  { platform: 'LinkedIn', url: 'https://www.linkedin.com', label: 'LinkedIn', platformKey: 'linkedin' },
  { platform: 'Facebook', url: 'https://www.facebook.com', label: 'Facebook', platformKey: 'facebook' },
  { platform: 'YouTube', url: 'https://www.youtube.com', label: 'YouTube', platformKey: 'youtube' },
  { platform: 'TikTok', url: 'https://www.tiktok.com', label: 'TikTok', platformKey: 'tiktok' },
];

function loadAccounts() {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return defaultAccounts;
  try {
    return JSON.parse(saved);
  } catch {
    return defaultAccounts;
  }
}

function saveAccounts(accounts) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}

function getPlatformName(value) {
  if (value === 'custom') return 'Anderer Account';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function renderAccounts() {
  const accounts = loadAccounts();
  cardsContainer.innerHTML = '';

  if (accounts.length === 0) {
    cardsContainer.innerHTML = '<p>Füge zuerst einen Account hinzu.</p>';
    return;
  }

  accounts.forEach((account, index) => {
    const card = document.createElement('article');
    card.className = 'card';

    const header = document.createElement('div');
    header.className = 'card-header';

    const icon = document.createElement('span');
    icon.className = 'card-icon';
    icon.textContent = platformIcons[account.platformKey] || '🔗';
    header.appendChild(icon);

    const title = document.createElement('h3');
    title.textContent = account.platform;
    header.appendChild(title);

    card.appendChild(header);

    const link = document.createElement('a');
    link.href = account.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = account.url;
    card.appendChild(link);

    const button = document.createElement('button');
    button.textContent = 'Entfernen';
    button.addEventListener('click', () => {
      accounts.splice(index, 1);
      saveAccounts(accounts);
      renderAccounts();
    });
    card.appendChild(button);

    cardsContainer.appendChild(card);
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const url = accountUrlInput.value.trim();
  const platformKey = platformSelect.value;
  const platformName = getPlatformName(platformKey);

  if (!url) return;

  const accounts = loadAccounts();
  accounts.push({ platform: platformName, url, label: platformName, platformKey });
  saveAccounts(accounts);
  renderAccounts();

  accountUrlInput.value = '';
  platformSelect.value = 'instagram';
});

renderAccounts();
